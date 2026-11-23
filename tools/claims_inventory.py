#!/usr/bin/env python3
"""Audit inventory: pull every checkable statement out of the Lab's page files and rank it by risk.

A "checkable statement" is a text string of 40+ characters that contains a number, a date, a quotation, a death toll,
a crime or intent label, or a reference to 2025-26 events. Each gets a risk tier:
  T1  deaths, tolls, crimes, intent, quotations, and anything current (2025-26 / developing)
  T2  other dated or numbered statements in history, politics, economics and evidence pages
  T3  numbered statements in science, maths and other subject pages
Outputs data/audit-inventory.csv (every item), data/audit-summary.json (counts) and plan/audit-sample.json
(a reproducible random sample of tier-1 items from the pilot pages, for the independent re-check)."""
import csv, glob, hashlib, json, os, random, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
STR = re.compile(r"'((?:[^'\\\n]|\\.){40,})'|`((?:[^`\\]|\\.){40,})`")
SKIP = {'js/changes-data.js', 'js/stamp.js'}
DEATH = re.compile(r"\b(kill|killed|killing|died|dies|death|deaths|dead|execut\w*|massacre\w*|genocide|famine|starv\w*|toll|murder\w*|tortur\w*|shot|casualt\w*|victims?)\b", re.I)
LABEL = re.compile(r"\b(crimes? against humanity|war crimes?|ethnic cleansing|ordered|apartheid|terror\w*|fascis\w*|propaganda|lie|lies|fake|fabricat\w*)\b", re.I)
NOW = re.compile(r"\b(2025|2026|developing)\b", re.I)
QUOTE = re.compile(r"“[^”]{3,}”|\"[^\"]{12,}\"")
NUM = re.compile(r"\d")
EVID = re.compile(r"(casefiles|storylines|money|pathmarx|verify|tolls|lies|toolkit|sourcecheck|power|govern|modern|marx|capital|fascis|isms|korea|usp|empire|anatomy|africa|americas|asia|europe|lineage|countries|history|hub|economy|institutions|origins|evidence|links|people|regions|case-words|deepdive)", re.I)
PILOT = {'js/casefiles.js', 'js/casefiles-deep.js', 'js/storylines.js', 'js/money.js', 'js/pathmarx.js'}
items = []
for f in sorted(glob.glob('js/*.js')):
    if f in SKIP: continue
    src = open(f, encoding='utf-8').read()
    for m in STR.finditer(src):
        t = (m.group(1) or m.group(2) or '').replace("\\'", "'")
        if ' ' not in t or t.startswith('http') or re.search(r'[{}<>]|=>|\bfunction\b|\.js\b', t): continue
        sig = []
        if DEATH.search(t): sig.append('deaths')
        if LABEL.search(t): sig.append('label')
        if QUOTE.search(t): sig.append('quote')
        if NOW.search(t): sig.append('current')
        if NUM.search(t): sig.append('number')
        if not sig: continue
        tier = 1 if ({'deaths', 'label', 'quote', 'current'} & set(sig)) else (2 if EVID.search(f) else 3)
        line = src.count('\n', 0, m.start()) + 1
        iid = hashlib.sha1((f + t).encode()).hexdigest()[:10]
        items.append({'id': iid, 'file': f, 'line': line, 'tier': tier, 'signals': ' '.join(sig), 'text': t[:400]})
os.makedirs('data', exist_ok=True)
with open('data/audit-inventory.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.DictWriter(fh, fieldnames=['id', 'tier', 'file', 'line', 'signals', 'text']); w.writeheader(); [w.writerow({k: it[k] for k in w.fieldnames}) for it in items]
byfile = {}
for it in items:
    b = byfile.setdefault(it['file'], [0, 0, 0]); b[it['tier'] - 1] += 1
summary = {'total': len(items), 'tiers': [sum(1 for i in items if i['tier'] == k) for k in (1, 2, 3)], 'files': len(byfile),
           'pilot': sum(1 for i in items if i['file'] in PILOT), 'pilotT1': sum(1 for i in items if i['file'] in PILOT and i['tier'] == 1),
           'top': sorted(([f, *v] for f, v in byfile.items()), key=lambda r: -(r[1] * 3 + r[2]))[:40]}
json.dump(summary, open('data/audit-summary.json', 'w'), ensure_ascii=False)
random.seed(20261123)
pool = [i for i in items if i['file'] in PILOT and i['tier'] == 1 and len(i['text']) > 60]
sample = random.sample(pool, min(30, len(pool)))
os.makedirs('plan', exist_ok=True); json.dump(sample, open('plan/audit-sample.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({k: summary[k] for k in ('total', 'tiers', 'files', 'pilot', 'pilotT1')}), 'sample', len(sample))
