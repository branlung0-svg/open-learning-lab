"""Runs in GitHub Actions (weekly and on demand). Builds data/power.json: for every country, who holds power now and how
its legislature is made up, from open data.

- Wikidata (SPARQL): head of state and head of government with start dates, the offices they hold, form of government,
  the legislature, and current holders of ministerial posts (keeping only the latest holder of each post, since many
  Wikidata entries lack end dates).
- English Wikipedia (infobox of each legislature article): total seats, seat diagram (a file on Wikimedia Commons),
  political groups with seat counts, last election and voting system. Bicameral parliaments are followed to their houses.

Everything is labelled with its source and the date it was built; the site tells readers it can lag behind events.
"""
import json, re, sys, time, datetime, requests

UA = {'User-Agent': 'OpenLearningLab/1.0 (https://branlung0-svg.github.io/open-learning-lab/; educational, non-commercial)'}
S = requests.Session(); S.headers.update(UA)
WDQS = 'https://query.wikidata.org/sparql'
WAPI = 'https://en.wikipedia.org/w/api.php'


def sparql(q, tries=4):
    for i in range(tries):
        try:
            r = S.get(WDQS, params={'query': q, 'format': 'json'}, timeout=90)
            if r.status_code == 200:
                return r.json()['results']['bindings']
            time.sleep(5 * (i + 1))
        except Exception:
            time.sleep(5 * (i + 1))
    return []


def v(b, k):
    x = b.get(k)
    return x['value'] if x else None


def qid(u):
    return u.rsplit('/', 1)[-1] if u else None


def day(s):
    return s[:10] if s else None


COUNTRIES = """
SELECT ?iso ?c ?cLabel ?hos ?hosLabel ?hosStart ?hog ?hogLabel ?hogStart ?hosOff ?hosOffLabel ?hogOff ?hogOffLabel ?form ?formLabel ?leg ?legLabel ?legArt WHERE {
  ?c wdt:P298 ?iso .
  FILTER NOT EXISTS { ?c wdt:P576 ?ended }
  OPTIONAL { ?c p:P35 ?s1 . ?s1 ps:P35 ?hos . FILTER NOT EXISTS { ?s1 pq:P582 ?e1 } OPTIONAL { ?s1 pq:P580 ?hosStart } }
  OPTIONAL { ?c p:P6 ?s2 . ?s2 ps:P6 ?hog . FILTER NOT EXISTS { ?s2 pq:P582 ?e2 } OPTIONAL { ?s2 pq:P580 ?hogStart } }
  OPTIONAL { ?c wdt:P1906 ?hosOff }
  OPTIONAL { ?c wdt:P1313 ?hogOff }
  OPTIONAL { ?c wdt:P122 ?form }
  OPTIONAL { ?c wdt:P194 ?leg . OPTIONAL { ?legArt schema:about ?leg ; schema:isPartOf <https://en.wikipedia.org/> } }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}"""

MINISTERS = """
SELECT ?pos ?posLabel ?p ?pLabel ?start WHERE {
  ?pos wdt:P1001 wd:%s ; rdfs:label ?l .
  FILTER(LANG(?l) = "en" && REGEX(?l, "^(Minister|Secretary of|Secretary for|Attorney General|Chancellor of the Exchequer|Foreign Secretary|Home Secretary|Defence Secretary|Vice[- ]Premier|Deputy Prime Minister|Governor of the (Central|Reserve|People)|Chief of the Defence|Chairman of the Joint)", "i"))
  ?p p:P39 ?st . ?st ps:P39 ?pos .
  FILTER NOT EXISTS { ?st pq:P582 ?end }
  OPTIONAL { ?st pq:P580 ?start }
  FILTER NOT EXISTS { ?p wdt:P570 ?died }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 300"""


def pick_latest(rows):
    """Several people can appear as current holders of a post when end dates are missing: keep the latest start."""
    best = {}
    for name, q, start in rows:
        if not name or re.match(r'^Q\d+$', name):
            continue
        if name not in best or (start or '') > (best[name][2] or ''):
            best[name] = (name, q, start)
    return best


# ---------------- Wikipedia infobox parsing ----------------
def wikitext(title):
    r = S.get(WAPI, params={'action': 'parse', 'page': title, 'prop': 'wikitext', 'section': 0, 'format': 'json', 'redirects': 1}, timeout=60)
    j = r.json()
    if 'parse' not in j:
        return None, title
    return j['parse']['wikitext']['*'], j['parse']['title']


def infobox(txt):
    """Return {field: value} for the first {{Infobox legislature ...}} template, respecting nested templates and links."""
    m = re.search(r'\{\{\s*Infobox[ _]legislature', txt, re.I)
    if not m:
        return {}
    i, depth, start = m.start(), 0, m.start()
    while i < len(txt):
        if txt.startswith('{{', i): depth += 1; i += 2; continue
        if txt.startswith('}}', i):
            depth -= 1; i += 2
            if depth == 0: break
            continue
        i += 1
    body = txt[start + 2:i - 2]
    fields, cur, buf, d, k = {}, None, '', 0, 0
    parts, seg = [], ''
    j = 0
    while j < len(body):
        two = body[j:j + 2]
        if two in ('{{', '[['): d += 1; seg += two; j += 2; continue
        if two in ('}}', ']]'): d -= 1; seg += two; j += 2; continue
        if body[j] == '|' and d == 0: parts.append(seg); seg = ''; j += 1; continue
        seg += body[j]; j += 1
    parts.append(seg)
    for p in parts[1:]:
        if '=' in p:
            a, b = p.split('=', 1)
            fields[a.strip().lower()] = b.strip()
    return fields


def plain(s):
    s = re.sub(r'<ref[^>]*/>', '', s); s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    s = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s); s = re.sub(r"'''?", '', s); s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def num(s):
    m = re.search(r'(\d[\d,\.]*)', plain(s or '').replace(' ', ' '))
    if not m: return None
    try: return int(m.group(1).replace(',', '').split('.')[0])
    except ValueError: return None


SKIP = re.compile(r'^(government|opposition|confidence and supply|vacant|others?$|coalition|supported by|majority|minority|ruling|non-inscrits?)', re.I)


def groups(val):
    """Parse a political_groups field into [name, seats, colour] rows."""
    out = []
    if not val: return out
    lines = re.split(r'<br\s*/?>|\n', val)
    for ln in lines:
        colour = None
        mc = re.search(r'\{\{\s*(?:colou?r ?box|legend|party colou?r[^|]*)\s*\|\s*(#?[0-9A-Fa-f]{3,6})', ln, re.I)
        if mc: colour = mc.group(1) if mc.group(1).startswith('#') else '#' + mc.group(1)
        mp = re.search(r'\{\{\s*party ?colou?r(?:box)?\s*\|\s*([^|}]+)', ln, re.I)
        ln = re.sub(r'\{\{\s*legend2?\s*\|\s*#?[0-9A-Fa-f]{3,6}\s*\|([^{}]*)\}\}', r'\1', ln, flags=re.I)
        ln = re.sub(r'\{\{\s*(?:party name with colou?r|party colou?r cell|colou?red link)\s*\|([^|{}]*)[^{}]*\}\}', r'\1', ln, flags=re.I)
        txt = plain(re.sub(r'\{\{\s*(?:colou?r ?box)[^{}]*\}\}', '', ln))
        if not txt: continue
        m = re.search(r'^(.*?)[\s:–—-]*\(?\s*(\d[\d,]*)\s*\)?\s*(?:seats?)?\s*$', txt)
        if not m:
            m = re.search(r'^(.*?)\((\d[\d,]*)\)', txt)
        if not m: continue
        name = m.group(1).strip(' :–—-*#•·').strip()
        name = re.sub(r'^\(?\s*\d+\s*\)?\s*', '', name)
        seats = int(m.group(2).replace(',', ''))
        if not name and mp: name = mp.group(1).strip()
        if not name or len(name) > 90 or seats == 0: continue
        header = bool(re.match(r"^\s*'''", ln)) or SKIP.match(name)
        out.append([name, seats, colour, bool(header)])
    return out


def legislature(title, depth=0):
    if not title or depth > 1: return []
    try:
        txt, real = wikitext(title)
    except Exception:
        return []
    if not txt: return []
    f = infobox(txt)
    if not f: return []
    res = []
    houses = f.get('houses') or ''
    if houses and depth == 0 and re.search(r'\[\[', houses):
        for t in re.findall(r'\[\[([^|\]]+)', houses)[:2]:
            res += legislature(t, depth + 1)
    diag = None
    for k in ('structure1', 'structure', 'image_seats', 'structure_image'):
        if f.get(k):
            mm = re.search(r'([^|\[\]=]+\.(?:svg|png|jpg))', f[k], re.I)
            if mm: diag = mm.group(1).strip().replace('File:', '').replace('Image:', '').strip(); break
    pg = f.get('political_groups1') or f.get('political_groups') or ''
    rows = groups(pg)
    leaf = [r for r in rows if not r[3]] or rows
    seats = num(f.get('seats1') or f.get('seats') or f.get('members'))
    total = sum(r[1] for r in leaf)
    if (seats or rows or diag) and not res:
        res.insert(0, {'title': real, 'url': 'https://en.wikipedia.org/wiki/' + real.replace(' ', '_'), 'seats': seats, 'diagram': diag,
                       'groups': [[r[0], r[1], r[2]] for r in leaf][:40], 'groupsSum': total, 'sumOk': bool(seats and total and abs(total - seats) <= max(3, seats * 0.03)),
                       'election': plain(f.get('last_election1') or f.get('last_election') or '')[:60] or None,
                       'nextElection': plain(f.get('next_election1') or f.get('next_election') or '')[:60] or None,
                       'voting': plain(f.get('voting_system1') or f.get('voting_system') or '')[:160] or None,
                       'type': 'bicameral' if houses else (plain(f.get('house_type') or '') or None),
                       'leader': plain(f.get('leader1') or '')[:80] or None, 'leaderType': plain(f.get('leader1_type') or '')[:60] or None, '_raw': pg[:1500]})
    return res


def main():
    built = datetime.date.today().isoformat()
    rows = sparql(COUNTRIES)
    C = {}
    for b in rows:
        iso = (v(b, 'iso') or '').lower()
        if not re.match(r'^[a-z]{3}$', iso): continue
        c = C.setdefault(iso, {'qid': qid(v(b, 'c')), 'name': v(b, 'cLabel'), 'hos': {}, 'hog': {}, 'forms': set(), 'legs': {}, 'hosOff': None, 'hogOff': None})
        if v(b, 'hos'): c['hos'][v(b, 'hosLabel')] = (v(b, 'hosLabel'), qid(v(b, 'hos')), day(v(b, 'hosStart')))
        if v(b, 'hog'): c['hog'][v(b, 'hogLabel')] = (v(b, 'hogLabel'), qid(v(b, 'hog')), day(v(b, 'hogStart')))
        if v(b, 'hosOff'): c['hosOff'] = v(b, 'hosOffLabel')
        if v(b, 'hogOff'): c['hogOff'] = v(b, 'hogOffLabel')
        if v(b, 'form'): c['forms'].add(v(b, 'formLabel'))
        if v(b, 'leg'): c['legs'][qid(v(b, 'leg'))] = (v(b, 'legLabel'), (v(b, 'legArt') or '').rsplit('/wiki/', 1)[-1].replace('_', ' ') or None)
    only = set(a.lower() for a in sys.argv[1:])
    out = {}
    for iso, c in sorted(C.items()):
        if only and iso not in only: continue
        rec = {'name': c['name'], 'qid': c['qid'], 'built': built,
               'hos': sorted(c['hos'].values(), key=lambda x: x[2] or '', reverse=True)[:2], 'hosOffice': c['hosOff'],
               'hog': sorted(c['hog'].values(), key=lambda x: x[2] or '', reverse=True)[:2], 'hogOffice': c['hogOff'],
               'forms': sorted(f for f in c['forms'] if f and not re.match(r'^Q\d+$', f))[:4], 'legislatures': [], 'ministers': []}
        # ministers
        ms = sparql(MINISTERS % c['qid']) if c['qid'] else []
        per = {}
        for b in ms:
            per.setdefault(v(b, 'posLabel'), []).append((v(b, 'pLabel'), qid(v(b, 'p')), day(v(b, 'start'))))
        mins = []
        for pos, people in per.items():
            if not pos or re.match(r'^Q\d+$', pos): continue
            best = max(pick_latest(people).values(), key=lambda x: x[2] or '', default=None)
            if best: mins.append([pos, best[0], best[2], best[1]])
        recent = [m for m in mins if (m[2] or '0') >= str(int(built[:4]) - 12)] or mins
        rec['ministers'] = sorted(recent, key=lambda m: m[0])[:60]
        # legislatures
        seen = set()
        cands = list(c['legs'].items())[:2]
        if not cands and c['name']:
            n0 = c['name']
            cands = [(None, (None, t)) for t in [f'National Assembly ({n0})', f'National Assembly of {n0}', f'Parliament of {n0}', f'Congress of {n0}', f'National Congress of {n0}']]
        for lq, (lname, art) in cands:
            for L in legislature(art or lname):
                if L['title'] in seen: continue
                seen.add(L['title']); rec['legislatures'].append(L)
            time.sleep(0.3)
        out[iso] = rec
        print(iso, c['name'], len(rec['ministers']), 'ministers', [(L['title'], L['seats'], len(L['groups']), L['sumOk']) for L in rec['legislatures']], flush=True)
        time.sleep(0.6)
    if only:
        try: old = json.load(open('data/power.json'))
        except Exception: old = {}
        old.update(out); out = old
    dbg = {}
    for iso, r in out.items():
        for L in r['legislatures']:
            raw = L.pop('_raw', '')
            if not L['sumOk'] and raw: dbg[iso + ' ' + L['title']] = {'seats': L['seats'], 'parsed': L['groups'][:12], 'raw': raw}
    json.dump(dbg, open('plan/power-debug.json', 'w'), ensure_ascii=False, indent=1)
    json.dump(out, open('data/power.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    ok = sum(1 for r in out.values() if any(L['sumOk'] for L in r['legislatures']))
    print('countries', len(out), 'with matching seat breakdown', ok)


if __name__ == '__main__':
    main()
