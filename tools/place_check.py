"""Check that pictures filed under a country were really taken there.

Generic searches such as "China village" return China, Maine; "Georgia landscape" returns the US state. For every
picture tied to a country (keys c:k-<iso>-..., c:a-gov-<iso>-..., or a country tag such as 'china'), this asks Wikimedia
Commons for the file's coordinates and categories:
  * coordinates inside the country (Natural Earth borders, about 15 km margin)  -> keep
  * coordinates in another country or at sea                                     -> remove
  * no coordinates: categories/description name this country                    -> keep
  * no coordinates: they name only another country or a US state                 -> remove
  * nothing either way                                                            -> keep, marked unknown
Removed keys go to data/media-skip.json so they are never fetched again. Results: plan/place-check.json.
Run in GitHub Actions (needs network): python tools/place_check.py [--dry]
"""
import json, re, sys, time, requests
from shapely.geometry import shape, Point
from shapely.prepared import prep

API = 'https://commons.wikimedia.org/w/api.php'
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson'
S = requests.Session(); S.headers['User-Agent'] = 'OpenLearningLab/1.0 (https://branlung0-svg.github.io/open-learning-lab/; educational)'
TAG_ISO = {'china': ['chn', 'hkg', 'mac'], 'usa': ['usa', 'pri', 'gum', 'vir', 'asm', 'mnp'], 'britain': ['gbr'], 'cuba': ['cub'], 'vietnam': ['vnm'],
           'india': ['ind'], 'japan': ['jpn'], 'soviet-life': ['rus', 'ukr', 'blr', 'kaz', 'uzb', 'tkm', 'kgz', 'tjk', 'arm', 'aze', 'geo', 'mda', 'est', 'lva', 'ltu']}
EXTRA = {'chn': ['hkg', 'mac'], 'usa': ['pri', 'gum', 'vir', 'asm', 'mnp'], 'fra': ['guf', 'glp', 'mtq', 'reu', 'myt'], 'gbr': ['imn', 'jey', 'ggy']}
US_STATES = ('Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|'
             'Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|'
             'New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|'
             'South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming')
STATE_AFTER = re.compile(r'^,?\s*(' + US_STATES + r')\b')
US_CAT = re.compile(r'(,\s*(' + US_STATES + r')\b|\b(in|of) (' + US_STATES + r')\b|\bUnited States\b)')
US_DESC = re.compile(r',\s*(' + US_STATES + r')\b')


def named(text, names):
    """True if one of the names appears and is not part of a US place name such as 'China, Maine'."""
    for n in names:
        for m in re.finditer(r'\b' + re.escape(n) + r'\b', text, re.I):
            if not STATE_AFTER.match(text[m.end():m.end() + 24]): return True
    return False


def api(**p):
    p.update(format='json', formatversion=2)
    for i in range(5):
        try:
            r = S.post(API, data=p, timeout=60)
            if r.status_code == 200: return r.json()
        except Exception:
            pass
        time.sleep(4 * (i + 1))
    return {}


def borders():
    gj = S.get(NE, timeout=180).json(); out = {}
    for f in gj['features']:
        pr = f['properties']; codes = {str(pr.get(k) or '').lower() for k in ('ISO_A3', 'ISO_A3_EH', 'ADM0_A3', 'SOV_A3')} - {'-99', ''}
        try: g = shape(f['geometry'])
        except Exception: continue
        for c in codes:
            out[c] = g if c not in out else out[c].union(g)
    return {c: (g, prep(g.buffer(0.15))) for c, g in out.items()}


def main():
    dry = '--dry' in sys.argv
    C = json.load(open('data/commons.json'))
    L = {c['id']: c for c in json.load(open('data/countries.json'))['list']}
    NAME = {i: [x for x in [c['n'], c.get('off'), c.get('dem'), *(c.get('cap') or []), *(c.get('nat') or [])] if x and len(x) > 3] for i, c in L.items()}
    jobs = {}
    for k, m in C.items():
        if m.get('kind') != 'image': continue
        mm = re.match(r'^c:(?:k|a-gov)-([a-z]{3})-', k)
        isos = [mm.group(1)] if mm and mm.group(1) in L else TAG_ISO.get((m.get('tags') or [''])[0])
        if isos: jobs[k] = sorted(set(isos + sum((EXTRA.get(i, []) for i in isos), [])))
    print('pictures to check:', len(jobs), flush=True)
    B = borders(); print('borders for', len(B), 'codes', flush=True)
    keys = sorted(jobs); res = {}
    for i in range(0, len(keys), 40):
        part = keys[i:i + 40]; t2k = {'File:' + C[k]['title']: k for k in part}
        coords, cats = {}, {}
        p = dict(action='query', titles='|'.join(t2k), prop='coordinates|categories', coprimary='all', colimit='max', clshow='!hidden', cllimit='max', redirects=1)
        while True:
            d = api(**p)
            for pg in d.get('query', {}).get('pages', []):
                t = pg.get('title')
                for c in pg.get('coordinates', []) or []: coords.setdefault(t, []).append((c['lon'], c['lat']))
                for c in pg.get('categories', []) or []: cats.setdefault(t, []).append(c['title'][9:])
            if 'continue' not in d: break
            p.update(d['continue'])
        for t, k in t2k.items():
            ok = jobs[k]; pts = coords.get(t, [])
            if pts:
                inside = any(B[c][1].contains(Point(x, y)) for c in ok if c in B for x, y in pts)
                if inside: res[k] = ['ok', 'coordinates']; continue
                where = next((c for c, (g, _) in B.items() for x, y in pts[:1] if g.contains(Point(x, y))), 'sea or unknown')
                res[k] = ['drop', 'coordinates in ' + where]; continue
            ct = ' | '.join(cats.get(t, [])); desc = (C[k].get('desc') or '') + ' ' + (C[k].get('title') or '')
            names = [n for c in ok for n in NAME.get(c, [])]
            if 'usa' not in ok and (US_CAT.search(ct) or US_DESC.search(desc)) and not named(ct, names):
                res[k] = ['drop', 'United States place: ' + (US_CAT.search(ct) or US_DESC.search(desc)).group(0).strip(', ')]
            elif named(ct, names) or named(desc, names): res[k] = ['ok', 'categories']
            else:
                other = next((L[c]['n'] for c in L if c not in ok and len(L[c]['n']) > 4 and re.search(r'\b' + re.escape(L[c]['n']) + r'\b', ct)), None)
                res[k] = ['drop', 'categories name ' + other] if other else ['unknown', '']
        time.sleep(0.5)
        print(i + len(part), 'checked', flush=True)
    drop = [k for k, v in res.items() if v[0] == 'drop']
    summary = {v: sum(1 for x in res.values() if x[0] == v) for v in ('ok', 'unknown', 'drop')}
    print(summary)
    json.dump({'summary': summary, 'dropped': {k: res[k][1] + ' | ' + C[k]['title'] for k in drop}, 'all': res}, open('plan/place-check.json', 'w'), ensure_ascii=False, indent=1)
    if not dry and drop:
        for k in drop: C.pop(k, None)
        json.dump(C, open('data/commons.json', 'w'), ensure_ascii=False, indent=1, sort_keys=True)
        sk = set(json.load(open('data/media-skip.json'))) | set(drop)
        json.dump(sorted(sk), open('data/media-skip.json', 'w'), indent=0)


if __name__ == '__main__':
    main()
