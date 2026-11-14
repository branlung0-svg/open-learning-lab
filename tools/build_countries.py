"""Build data/countries.json (facts for every country) and data/cs/<id>.json (compact long-run series per country)
from mledoze/countries (ODbL) plus the Lab's own datasets (Maddison, Gapminder, V-Dem, World Bank, UNDP via OWID).
Usage: python3 tools/build_countries.py /path/to/mledoze/countries.json"""
import json, sys, re, unicodedata
src = json.load(open(sys.argv[1]))
keep = [c for c in src if c.get('unMember') or c['cca3'] in ('VAT', 'PSE', 'TWN', 'XKX', 'KOS')]
norm = lambda s: re.sub(r'[^a-z]', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())
ALIAS = {'COD': ['democraticrepublicofcongo', 'drcongo', 'congokinshasa', 'democraticrepublicofthecongo'], 'COG': ['congo', 'republicofcongo', 'congobrazzaville'], 'CIV': ['cotedivoire', 'ivorycoast'],
  'CZE': ['czechia', 'czechrepublic'], 'MMR': ['myanmar', 'burma'], 'PRK': ['northkorea'], 'KOR': ['southkorea'], 'RUS': ['russia'], 'USA': ['unitedstates'], 'GBR': ['unitedkingdom'],
  'SWZ': ['eswatini', 'swaziland'], 'MKD': ['northmacedonia', 'macedonia'], 'TLS': ['easttimor', 'timorleste'], 'CPV': ['capeverde', 'caboverde'], 'FSM': ['micronesia', 'micronesiacountry'],
  'VNM': ['vietnam'], 'LAO': ['laos'], 'SYR': ['syria'], 'IRN': ['iran'], 'BOL': ['bolivia'], 'VEN': ['venezuela'], 'TZA': ['tanzania'], 'MDA': ['moldova'], 'PSE': ['palestine', 'westbankandgaza'],
  'TWN': ['taiwan'], 'GMB': ['gambia'], 'BHS': ['bahamas'], 'KGZ': ['kyrgyzstan'], 'SVK': ['slovakia'], 'BRN': ['brunei'], 'VAT': ['vatican', 'holysee'], 'TUR': ['turkey', 'turkiye'], 'XKX': ['kosovo'], 'KOS': ['kosovo']}
def keys(c):
    k = {norm(c['name']['common']), norm(c['name']['official'])} | {norm(a) for a in c.get('altSpellings', []) if len(a) > 3}
    return k | set(ALIAS.get(c['cca3'], []))
out = []
for c in sorted(keep, key=lambda c: c['name']['common']):
    nat = list(dict.fromkeys(v['common'] for v in c['name'].get('native', {}).values()))[:3]
    out.append({'id': c['cca3'].lower(), 'n': c['name']['common'], 'off': c['name']['official'], 'nat': [x for x in nat if x != c['name']['common']],
      'cap': c.get('capital', []), 'reg': c['region'], 'sub': c.get('subregion', ''), 'langs': list(c.get('languages', {}).values()), 'cur': [v['name'] for v in c.get('currencies', {}).values()],
      'area': c.get('area'), 'bor': [b.lower() for b in c.get('borders', [])], 'flag': c.get('flag', ''), 'll': c.get('latlng'), 'land': c.get('landlocked'), 'dem': (c.get('demonyms', {}).get('eng') or {}).get('m', ''), 'un': c.get('unMember')})
ids = {o['id'] for o in out}
for o in out: o['bor'] = [b for b in o['bor'] if b in ids]
K = {o['id']: keys(next(c for c in keep if c['cca3'].lower() == o['id'])) for o in out}
def match(ents):
    m = {}
    for i, e in enumerate(ents):
        ne = norm(e)
        for cid, ks in K.items():
            if ne in ks and cid not in m: m[cid] = i
    return m
P = {x['id']: x for x in json.load(open('data/ds3.json')) + json.load(open('data/ds4.json'))}
SERIES = [('gdppc', 'maddison', 0, 'GDP per person (2011 int. $)'), ('pop', 'popwb', 0, 'Population'), ('lex', 'living', 0, 'Life expectancy (years)'), ('cm', 'living', 1, 'Child deaths before 5 (per 1,000)'),
  ('kids', 'living', 2, 'Children per woman'), ('dem', 'vdem', 0, 'Electoral democracy index (0–1, V-Dem)'), ('lib', 'vdem', 5, 'Civil liberties index (0–1, V-Dem)'), ('hdi', 'hdi', 0, 'Human Development Index'),
  ('urb', 'urban', 4, 'Urban population (%)'), ('mil', 'milgdp', 0, 'Military spending (% of GDP)'), ('co2', 'living', 4, 'CO₂ per person (tonnes)'), ('epov', 'living', 3, 'Extreme poverty (%)')]
stats = {o['id']: {} for o in out}; miss = {}
for key, pid, vi, label in SERIES:
    p = P[pid]; m = match(p['ents']); inv = {i: cid for cid, i in m.items()}
    for row in p['rows']:
        cid = inv.get(row[0]); v = row[2 + vi] if len(row) > 2 + vi else None
        if cid is None or v is None: continue
        stats[cid].setdefault(key, []).append([row[1], round(v, 4) if isinstance(v, float) else v])
    miss[key] = len(out) - len(m)
for cid, s in stats.items():
    for key, arr in s.items():
        arr.sort(); 
        if len(arr) > 90: step = max(1, len(arr) // 90); s[key] = arr[::step] + ([arr[-1]] if arr[::step][-1] != arr[-1] else [])
json.dump({'src': 'Facts: mledoze/countries (ODbL 1.0). Series: Maddison Project 2020, Gapminder, V-Dem, World Bank, UNDP, OWID (CC BY 4.0).', 'labels': {k: l for k, _, _, l in SERIES}, 'list': out}, open('data/countries.json', 'w'), ensure_ascii=False, separators=(',', ':'))
import os; os.makedirs('data/cs', exist_ok=True); [json.dump(v, open(f'data/cs/{k}.json', 'w'), separators=(',', ':')) for k, v in stats.items()]
print(len(out), 'countries; unmatched per series:', miss)
