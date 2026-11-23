"""Build whole datasets instead of hand-picked examples (runs in GitHub Actions; needs network).

1. data/sources-rsp.json  Wikipedia's "Reliable sources/Perennial sources" table: about 450 outlets, each with the status
   English-Wikipedia editors reached (generally reliable, no consensus, generally unreliable, deprecated, blacklisted), their
   one-line summary and links to the discussions (the evidence behind each rating).
2. data/sources-state.json  Every state-owned media outlet, state news agency and public broadcaster on Wikidata, with
   country, owner and website.
3. data/tolls-lists.json  Every row of Wikipedia's lists of famines, genocides and wars by death toll, with its estimate
   text, parsed low/high numbers and the citation links for that row.
Debug output: plan/evidence-debug.json
"""
import json, re, time, html, requests
from urllib.parse import unquote

S = requests.Session(); S.headers['User-Agent'] = 'OpenLearningLab/1.0 (https://branlung0-svg.github.io/open-learning-lab/; educational)'
API = 'https://en.wikipedia.org/w/api.php'; DBG = {}


def get(url, **p):
    for i in range(6):
        try:
            r = S.get(url, params=p, timeout=90)
            if r.status_code == 200: return r
        except Exception as e:
            DBG.setdefault('errors', []).append(str(e)[:200])
        time.sleep(5 * (i + 1))
    return None


def page_html(title):
    r = get(API, action='parse', page=title, prop='text', format='json', formatversion=2, redirects=1)
    return r.json()['parse']['text'] if r else ''


def plain(x):
    x = re.sub(r'<sup[^>]*class="[^"]*reference[^"]*"[^>]*>.*?</sup>', '', x, flags=re.S)
    x = re.sub(r'<style.*?</style>', '', x, flags=re.S); x = re.sub(r'<br\s*/?>', ' ', x); x = re.sub(r'<[^>]+>', '', x)
    return re.sub(r'\s+', ' ', html.unescape(x)).strip()


def refs_map(doc):
    """cite_note id -> {t: citation text, u: first link}. Handles short footnotes (sfn) that point to a bibliography entry."""
    cites = {}
    for m in re.finditer(r'<cite[^>]*id="(CITEREF[^"]+)"[^>]*>(.*?)</cite>', doc, re.S):
        u = re.search(r'href="(https?://[^"]+)"', m.group(2)); cites[m.group(1)] = (plain(m.group(2))[:160], html.unescape(u.group(1)) if u else None)
    out = {}
    for m in re.finditer(r'<li id="(cite_note-[^"]+)"[^>]*>(.*?)</li>', doc, re.S):
        body = m.group(2); txt = re.search(r'<span class="reference-text"[^>]*>(.*)', body, re.S); t = plain(txt.group(1) if txt else body)[:160]
        u = re.search(r'<a[^>]+class="[^"]*external[^"]*"[^>]+href="([^"]+)"', body) or re.search(r'href="(https?://[^"]+)"', body)
        url = html.unescape(u.group(1)) if u else None
        cr = re.search(r'href="#(CITEREF[^"]+)"', body)
        if cr and cr.group(1) in cites:
            ct, cu = cites[cr.group(1)]; t = (t + ' — ' + ct)[:220]; url = url or cu
        out[m.group(1)] = {'t': t, 'u': url}
    return out


def tables(doc):
    for t in re.finditer(r'<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)</table>', doc, re.S):
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', t.group(1), re.S)
        if not rows: continue
        head = [plain(c) for c in re.findall(r'<th[^>]*>(.*?)</th>', rows[0], re.S)]
        body = []
        for r in rows[1:]:
            cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.S)
            if cells: body.append(cells)
        yield head, body


NUM = re.compile(r'(\d[\d,\.]*)\s*(million|billion|thousand)?', re.I)


def numbers(text):
    vals = []
    for m in NUM.finditer(text.replace(' ', '').replace('\xa0', ' ')):
        raw = m.group(1).replace(',', '')
        try: v = float(raw)
        except ValueError: continue
        mult = {'million': 1e6, 'billion': 1e9, 'thousand': 1e3}.get((m.group(2) or '').lower(), 1)
        if mult == 1 and 1000 <= v <= 2100 and '.' not in raw and len(raw) == 4: continue  # a year
        vals.append(v * mult)
    # "1.5–2 million": the first number inherits the unit of the second
    t = text.lower()
    m = re.search(r'(\d[\d\.]*)\s*[–\-to]+\s*(\d[\d\.]*)\s*(million|billion)', t)
    if m:
        mult = 1e6 if m.group(3) == 'million' else 1e9
        vals += [float(m.group(1)) * mult, float(m.group(2)) * mult]
    vals = [v for v in vals if v >= 100]
    return (min(vals), max(vals)) if vals else (None, None)


def col(head, *names):
    for i, x in enumerate(head):
        if any(n in x.lower() for n in names): return i
    return None


def tolls():
    out = {}
    for key, title in [('famines', 'List of famines'), ('genocides', 'List of genocides'), ('wars', 'List of wars by death toll'), ('atrocities', 'List of massacres in China')][:3]:
        doc = page_html(title); R = refs_map(doc); rows = []; heads = []
        for head, body in tables(doc):
            heads.append(head[:8])
            i_name = col(head, 'name', 'event', 'war', 'genocide', 'famine', 'conflict'); i_date = col(head, 'date', 'year', 'period')
            i_loc = col(head, 'location', 'country', 'place', 'region'); i_d = col(head, 'death', 'toll', 'casualt', 'estimate', 'killed', 'victims', 'number', 'est.')
            if i_d is None: continue
            for cells in body:
                def c(i): return plain(cells[i]) if i is not None and i < len(cells) else ''
                est = c(i_d); lo, hi = numbers(est)
                refs = []
                for cell in cells:
                    for nid in re.findall(r'href="#(cite_note-[^"]+)"', cell):
                        if nid in R and R[nid] not in refs: refs.append(R[nid])
                name = c(i_name) or c(0)
                if not name or (lo is None and not est): continue
                rows.append({'name': name[:160], 'when': c(i_date)[:60], 'where': c(i_loc)[:160], 'estimate': est[:240], 'low': lo, 'high': hi, 'refs': refs[:6]})
        out[key] = {'title': title, 'url': 'https://en.wikipedia.org/wiki/' + title.replace(' ', '_'), 'rows': rows}
        DBG[key] = {'rows': len(rows), 'with_refs': sum(1 for r in rows if r['refs']), 'with_numbers': sum(1 for r in rows if r['low']), 'notes': len(R), 'heads': heads[:8], 'sample': rows[:2]}
        time.sleep(2)
    return out


STATUS = [('blacklisted', 'Blacklisted'), ('deprecated', 'Deprecated'), ('generally unreliable', 'Generally unreliable'), ('no consensus', 'No consensus'), ('generally reliable', 'Generally reliable')]


def rsp():
    title = 'Wikipedia:Reliable sources/Perennial sources'; doc = page_html(title); out = []
    for head, body in tables(doc):
        if not head or 'source' not in head[0].lower(): continue
        for cells in body:
            if len(cells) < 4: continue
            name = plain(cells[0]); st_cell = cells[1]
            st_text = ' '.join(re.findall(r'(?:title|alt|data-sort-value)="([^"]+)"', st_cell)) + ' ' + plain(st_cell)
            status = next((n for k, n in STATUS if k in st_text.lower()), 'Unclear')
            disc = ['https://en.wikipedia.org' + unquote(html.unescape(u)) if u.startswith('/') else html.unescape(u) for u in re.findall(r'href="([^"#][^"]*)"', cells[2])][:8]
            summary = plain(cells[-1])[:600]; last = plain(cells[3]) if len(cells) > 4 else ''
            if name: out.append({'name': name[:120], 'status': status, 'summary': summary, 'discussions': disc, 'last': last[:12]})
    DBG['rsp'] = {'rows': len(out), 'by_status': {s: sum(1 for x in out if x['status'] == s) for _, s in STATUS + [('', 'Unclear')]}}
    return {'url': 'https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources/Perennial_sources', 'rows': out}


SPARQL = 'https://query.wikidata.org/sparql'
Q_STATE = """
SELECT ?m ?mLabel ?type ?countryLabel ?iso ?ownerLabel ?site WHERE {
  VALUES ?type { wd:Q1193236 wd:Q192283 wd:Q1126006 wd:Q17232649 }
  ?m wdt:P31 ?type .
  OPTIONAL { ?m wdt:P17 ?country . ?country wdt:P298 ?iso . }
  OPTIONAL { ?m wdt:P127 ?owner . }
  OPTIONAL { ?m wdt:P856 ?site . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}"""
TYPE = {'Q1193236': 'state media', 'Q192283': 'news agency', 'Q1126006': 'public broadcaster', 'Q17232649': 'state-owned enterprise'}


def state_media():
    r = None
    for i in range(4):
        try:
            r = S.get(SPARQL, params={'query': Q_STATE, 'format': 'json'}, timeout=180, headers={'Accept': 'application/sparql-results+json'})
            if r.status_code == 200: break
        except Exception as e:
            DBG.setdefault('errors', []).append(str(e)[:200])
        time.sleep(10)
    rows = {}
    if r is not None and r.status_code == 200:
        for b in r.json()['results']['bindings']:
            q = b['m']['value'].rsplit('/', 1)[1]; t = TYPE.get(b['type']['value'].rsplit('/', 1)[1], '')
            name = b.get('mLabel', {}).get('value', '')
            if not name or re.match(r'^Q\d+$', name): continue
            x = rows.setdefault(q, {'q': q, 'name': name, 'types': [], 'iso': (b.get('iso', {}).get('value') or '').lower(), 'country': b.get('countryLabel', {}).get('value', ''), 'owner': b.get('ownerLabel', {}).get('value', ''), 'site': b.get('site', {}).get('value', '')})
            if t and t not in x['types']: x['types'].append(t)
    # keep news agencies only when state-linked or with an owner listed; keep all state media and public broadcasters
    keep = [x for x in rows.values() if set(x['types']) & {'state media', 'public broadcaster'} or x['owner']]
    DBG['state'] = {'all': len(rows), 'kept': len(keep), 'countries': len({x['iso'] for x in keep if x['iso']})}
    return {'source': 'Wikidata (instances of state media, news agency, public broadcaster)', 'rows': sorted(keep, key=lambda x: (x['iso'] or 'zzz', x['name']))}


def main():
    json.dump(rsp(), open('data/sources-rsp.json', 'w'), ensure_ascii=False)
    json.dump(state_media(), open('data/sources-state.json', 'w'), ensure_ascii=False)
    json.dump(tolls(), open('data/tolls-lists.json', 'w'), ensure_ascii=False)
    json.dump(DBG, open('plan/evidence-debug.json', 'w'), indent=1)
    print(json.dumps(DBG, indent=1))


if __name__ == '__main__':
    main()
