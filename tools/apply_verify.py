#!/usr/bin/env python3
"""Apply an independent verification file to a claim file.
Usage: python3 tools/apply_verify.py data/claims/<id>.json factcheck/<id>-verify.json [--no-log]
(--no-log: the claims are not public yet, so pre-publication fixes stay out of the public corrections log.)
Verify file: list of {id, verdict: supported|fix, text?, when?, years?, region?, conf?, sources?, method, problem?}
- Corrections are applied field by field.
- status becomes "verified" (with a checked record) only when the method shows a page was actually opened;
  methods starting with "General knowledge" or "Standard reference" stay "drafted".
- Fixes are also written to factcheck/<id>-claims.json so they appear in the public corrections log."""
import json, sys, os, datetime, subprocess
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
cf, vf = sys.argv[1], sys.argv[2]
d = json.load(open(cf, encoding='utf-8')); V = {v['id']: v for v in json.load(open(vf, encoding='utf-8')) if v.get('id', '_').startswith('_') is False}
today = datetime.date.today().isoformat(); fixes = []; n = {'verified': 0, 'drafted': 0, 'fixed': 0, 'missing': 0}
for kind in ('events', 'people'):
    for c in d.get(kind, []):
        v = V.get(c['id'])
        if not v: n['missing'] += 1; continue
        old = c.get('text', '')
        for k in ('text', 'when', 'years', 'region', 'conf', 'name'):
            if v.get(k): c[k] = v[k]
        if v.get('sources'): c['sources'] = v['sources']
        m = (v.get('method') or '').strip(); weak = (not m) or m.lower().startswith(('general knowledge', 'standard reference'))
        if v.get('verdict') == 'fix':
            n['fixed'] += 1
            fixes.append({'file': cf, 'area': d.get('disc', ''), 'page': '', 'old': old, 'new': c.get('text', ''), 'problem': v.get('problem', 'Corrected after independent check'), 'severity': 'error', 'sources': [s['url'] for s in c.get('sources', [])][:2]})
        if kind == 'events' or 'status' in c:
            if weak: c['status'] = 'drafted'; c.pop('checked', None); n['drafted'] += 1
            else:
                c['status'] = 'verified'; n['verified'] += 1
                c['checked'] = {'by': 'independent AI fact-check (separate agent, not a human expert)', 'on': today, 'method': m + (' Corrected after this check: ' + v['problem'] if v.get('verdict') == 'fix' and v.get('problem') else '')}
d['updated'] = today
json.dump(d, open(cf, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
name = os.path.basename(cf)[:-5] + '-claims'
if fixes and '--no-log' not in sys.argv:
    json.dump(fixes, open(f'factcheck/{name}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    ap = 'factcheck/applied.json'; done = json.load(open(ap)); done[name] = today; json.dump(done, open(ap, 'w'), indent=1)
    subprocess.run([sys.executable, 'tools/mkchanges.py'], check=True)
print(n)
