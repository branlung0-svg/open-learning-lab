#!/usr/bin/env python3
"""Browser smoke test: serve the site, open every discipline page, every modern-world tab and the core pages,
and fail if any page throws a JavaScript error or renders empty. Usage: python3 tools/smoke.py [chrome-path]"""
import os, sys, subprocess, time, socket
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5); base = f'http://127.0.0.1:{port}/'
fails = []
try:
    with sync_playwright() as p:
        kw = {'executable_path': sys.argv[1]} if len(sys.argv) > 1 else {}
        b = p.chromium.launch(**kw); pg = b.new_page(viewport={'width': 1200, 'height': 900})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        pg.route('**/*', lambda r: r.abort() if not r.request.url.startswith(base) else r.continue_())  # offline: test our code, not archives
        pg.goto(base + '#home'); pg.wait_for_timeout(2500)
        routes = ['home', 'review', 'notes', 'about', 'privacy', 'changes', 'settings', 'learn', 'arcade']
        routes += ['d-' + d for d in pg.evaluate("(Lab.DISC||[]).map(d=>d.id)")]
        routes += ['history-modern-' + k for k in pg.evaluate("((Lab.MODERN||{}).SUBS||[]).map(s=>s[0])")]
        for r in routes:
            errs.clear(); pg.goto(base + '#' + r); pg.wait_for_timeout(700)
            pg.evaluate("document.querySelectorAll('.modal-bg').forEach(e=>e.remove())")
            n = pg.evaluate("(document.getElementById('app')||document.body).innerText.trim().length")
            if errs or n < 80: fails.append((r, n, errs[:2]))
            print('ok  ' if not (errs or n < 80) else 'FAIL', r, n, errs[:1])
        b.close()
finally:
    srv.terminate()
print(f'{len(fails)} failing pages')
sys.exit(1 if fails else 0)
