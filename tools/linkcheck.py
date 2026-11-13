#!/usr/bin/env python3
"""Weekly: confirm every source link in data/claims still answers. Reports dead links; does not edit anything."""
import json, glob, sys, urllib.request, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
urls = {}
for f in glob.glob('data/claims/*.json'):
    d = json.load(open(f, encoding='utf-8'))
    for c in d.get('events', []) + d.get('people', []):
        for s in c.get('sources', []): urls.setdefault(s['url'], []).append(c['id'])
dead = []
for u, who in sorted(urls.items()):
    try:
        req = urllib.request.Request(u, method='GET', headers={'User-Agent': 'OpenLearningLab-linkcheck/1.0 (+https://github.com/branlung0-svg/open-learning-lab)'})
        code = urllib.request.urlopen(req, timeout=25).status
    except urllib.error.HTTPError as e: code = e.code
    except Exception as e: code = str(e)[:60]
    ok = isinstance(code, int) and (code < 400 or code in (401, 403, 429))  # 403/429: site blocks bots, not necessarily dead
    print(('ok  ' if ok else 'DEAD'), code, u)
    if not ok: dead.append((u, code, who))
print(f'{len(urls)} links, {len(dead)} dead')
for u, code, who in dead: print(f'::warning::{code} {u} used by {", ".join(who)}')
sys.exit(1 if dead else 0)
