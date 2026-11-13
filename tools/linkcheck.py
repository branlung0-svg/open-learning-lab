#!/usr/bin/env python3
"""Weekly: confirm every source link in data/claims still answers. Reports dead links; does not edit anything."""
import json, glob, sys, urllib.request, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
urls = {}
for f in glob.glob('data/claims/*.json'):
    d = json.load(open(f, encoding='utf-8'))
    for c in d.get('events', []) + d.get('people', []):
        for s in c.get('sources', []): urls.setdefault(s['url'], []).append(c['id'])
for f in glob.glob('data/intl-sources.json'):
    for it in json.load(open(f, encoding='utf-8'))['items']:
        for k in ('url', 'en'):
            if it.get(k): urls.setdefault(it[k], []).append('intl:' + it['title'][:30])
dead = []
for u, who in sorted(urls.items()):
    try:
        req = urllib.request.Request(u, method='GET', headers={'User-Agent': 'OpenLearningLab-linkcheck/1.0 (+https://github.com/branlung0-svg/open-learning-lab)'})
        code = urllib.request.urlopen(req, timeout=25).status
    except urllib.error.HTTPError as e: code = e.code
    except Exception as e: code = str(e)[:60]
    ok = not (isinstance(code, int) and code in (404, 410)) and 'Name or service not known' not in str(code)  # only a clear 404/410 or a dead domain counts; 403/429/timeouts are bot blocks or slow servers
    print(('ok  ' if ok else 'DEAD') if (ok and isinstance(code, int) and code < 400) or not ok else 'warn', code, u)
    if not ok: dead.append((u, code, who))
print(f'{len(urls)} links, {len(dead)} dead')
for u, code, who in dead: print(f'::warning::{code} {u} used by {", ".join(who)}')
sys.exit(1 if dead else 0)
