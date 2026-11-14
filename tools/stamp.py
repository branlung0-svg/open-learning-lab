#!/usr/bin/env python3
"""Cache-busting: set ?v=<now> on every local script tag in index.html, so visitors get the new JS after a push.
Also checks that every js/*.js file is loaded by index.html (warns if not)."""
import re, time, os, glob
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
s = open('index.html', encoding='utf-8').read(); v = str(int(time.time()))
s = re.sub(r'src="(js/[A-Za-z0-9_.-]+\.js)(\?v=\d+)?"', lambda m: f'src="{m.group(1)}?v={v}"', s)
open('index.html', 'w', encoding='utf-8').write(s)
loaded = set(re.findall(r'src="(js/[^"?]+)', s))
for f in sorted(glob.glob('js/*.js')):
    if f not in loaded: print('WARNING not loaded by index.html:', f)
print('stamped', v)
