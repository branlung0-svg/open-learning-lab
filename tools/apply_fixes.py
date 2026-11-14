#!/usr/bin/env python3
"""Apply a fact-check file: factcheck/<name>.json, a list of {file, old, new, problem, severity, sources}.
Each `old` must occur exactly once in its file. Then records the pass in factcheck/applied.json and rebuilds the corrections log.
Usage: python3 tools/apply_fixes.py factcheck/<name>.json"""
import json, sys, subprocess, os, datetime
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
f = sys.argv[1]; items = json.load(open(f, encoding='utf-8')); ok = 0
for it in items:
    s = open(it['file'], encoding='utf-8').read(); n = s.count(it['old'])
    if n != 1: print('SKIP (found', n, 'times)', it['file'], it['old'][:70]); continue
    open(it['file'], 'w', encoding='utf-8').write(s.replace(it['old'], it['new'])); ok += 1
print('applied', ok, 'of', len(items))
bad = 0
for fn in sorted(set(i['file'] for i in items)):
    if fn.endswith('.js'):
        r = subprocess.run(['node', '--check', fn], capture_output=True, text=True)
        if r.returncode: r = subprocess.run(['node', '--input-type=module', '--check'], stdin=open(fn), capture_output=True, text=True)
        print(fn, 'OK' if r.returncode == 0 else 'SYNTAX ERROR ' + r.stderr[:300]); bad += r.returncode != 0
if bad: sys.exit('Syntax errors: fix before committing')
name = os.path.basename(f)[:-5]; ap = 'factcheck/applied.json'; done = json.load(open(ap))
done[name] = datetime.date.today().isoformat(); json.dump(done, open(ap, 'w'), indent=1)
subprocess.run([sys.executable, 'tools/mkchanges.py'], check=True)
