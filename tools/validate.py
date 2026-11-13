#!/usr/bin/env python3
"""Checks run on every push: claim files follow the schema and every claim is sourced; JS parses."""
import json, glob, re, subprocess, sys, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
CONF = {'Established', 'Strong', 'Contested', 'Unknown', 'Clouded', 'Developing'}
STATUS = {'drafted', 'verified', 'reviewed'}
errs, ids, n = [], set(), 0
def bad(f, msg): errs.append(f'{f}: {msg}')
for f in sorted(glob.glob('data/claims/*.json')):
    try: d = json.load(open(f, encoding='utf-8'))
    except Exception as e: bad(f, f'invalid JSON ({e})'); continue
    if d.get('schema') != 1: bad(f, 'schema must be 1')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(d.get('updated', ''))): bad(f, 'updated must be YYYY-MM-DD')
    for kind in ('events', 'people'):
        for c in d.get(kind, []):
            n += 1; cid = c.get('id', '?')
            if cid in ids: bad(f, f'duplicate id {cid}')
            ids.add(cid)
            if not c.get('text') or len(c['text']) < 10: bad(f, f'{cid}: text missing or too short')
            if kind == 'events':
                if c.get('conf') not in CONF: bad(f, f'{cid}: conf must be one of {sorted(CONF)}')
                if c.get('status') not in STATUS: bad(f, f'{cid}: status must be one of {sorted(STATUS)}')
                if not c.get('when'): bad(f, f'{cid}: missing when')
                if c.get('status') in ('verified', 'reviewed') and not c.get('checked'): bad(f, f'{cid}: {c["status"]} needs a checked record')
            else:
                for k in ('name', 'years', 'region'):
                    if not c.get(k): bad(f, f'{cid}: missing {k}')
            src = c.get('sources') or []
            if not src: bad(f, f'{cid}: no sources')
            for s in src:
                if not s.get('cite'): bad(f, f'{cid}: source without cite')
                if not str(s.get('url', '')).startswith('https://'): bad(f, f'{cid}: source url must be https')
js = sorted(glob.glob('js/*.js'))
for f in js:
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
    if r.returncode: bad(f, r.stderr.strip().splitlines()[0] if r.stderr else 'syntax error')
html = open('index.html', encoding='utf-8').read()
for src in re.findall(r'<script[^>]+src="([^"?]+)', html):
    if not src.startswith('http') and not os.path.exists(src): bad('index.html', f'missing script {src}')
print(f'{n} claims, {len(js)} scripts checked')
if errs:
    print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
print('All checks passed')
