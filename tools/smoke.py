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
        routes = ['home', 'review', 'notes', 'about', 'privacy', 'changes', 'settings', 'learn', 'arcade', 'search-congo', 'reviewers', 'me', 'method', 'parliaments', 'parliaments-china', 'institutions', 'institutions-icc', 'mathpath', 'mathpath-count', 'mathpath-add', 'mathpath-mul', 'mathpath-div', 'mathpath-frac', 'mathpath-pow', 'mathpath-alg', 'mathpath-func', 'mathpath-geo', 'mathpath-calc', 'mathpath-prob', 'mathpath-stats', 'mathpath-build', 'country-chn-power', 'country-usa-power', 'country-fra-power', 'parliaments', 'power', 'power-usa', 'power-china', 'power-ussr', 'power-nazi', 'power-uk', 'power-russia', 'power-india', 'power-iran', 'power-japan', 'power-nk', 'power-vietnam', 'power-cuba', 'country-irn-power', 'country-gbr-power', 'country-gha-power', 'country-chn-everything', 'country-chn-places', 'country-rus-sources', 'country-irn-everything', 'history-modern-power', 'oppression', 'lies', 'lies-paid', 'lies-war', 'origins', 'verify', 'verify-prk', 'tolls', 'toolkit', 'toolkit-sources', 'toolkit-paid', 'explore', 'd-math', 'd-politics', 'country-prk-everything', 'd-biology', 'd-earthspace', 'oppression-genocide', 'oppression-sanctions', 'oppression-war', 'history-modern-govern-china', 'history-modern-liberalism-gallery', 'history-modern-marxism-gallery', 'history-modern-imperialism-evidence', 'history-modern-liberalism-evidence', 'history-modern-anarchism-evidence', 'history-modern-authoritarianism-evidence', 'history-modern-conservatism-evidence', 'history-modern-liberalism', 'history-modern-liberalism-lineage-abroad', 'history-modern-conservatism-lineage-asia', 'history-modern-anarchism-lineage-asia', 'history-modern-authoritarianism-lineage', 'history-modern-imperialism-lineage-japan', 'history-modern-imperialism-debates', 'history-modern-liberalism-ideas', 'history-modern-anarchism-reading', 'country-lao-power', 'country-jpn-power', 'history-modern-marxism-lineage-kim', 'history-modern-marxism-lineage', 'country-chn-power', 'countries', 'country-usa', 'country-nga-data', 'country-chn-history', 'country-bra-power', 'country-fji-places', 'country-tuv-sources', 'archive-countries']
        routes += ['d-' + d for d in pg.evaluate("(Lab.DISC||[]).map(d=>d.id)")]
        routes += ['history-modern-' + k for k in pg.evaluate("((Lab.MODERN||{}).SUBS||[]).map(s=>s[0])")]
        # every section and case study of every deep dive
        routes += pg.evaluate("Object.values(Lab.DEEPDIVES||{}).flatMap(D=>[...D.sections.map(s=>'history-modern-'+D.id+'-'+s[0]), ...(D.data.caseOrder||[]).map(k=>'history-modern-'+D.id+'-'+k)])")
        for r in routes:
            errs.clear(); pg.goto(base + '#' + r); pg.wait_for_timeout(700)
            pg.evaluate("document.querySelectorAll('.modal-bg').forEach(e=>e.remove())")
            n = pg.evaluate("(document.getElementById('app')||document.body).innerText.trim().length")
            junk = pg.evaluate("""(()=>{const w=document.createTreeWalker(document.getElementById('app')||document.body,NodeFilter.SHOW_TEXT);let c=0,t;while(t=w.nextNode()){const v=t.nodeValue.trim();if(v==='null'||v==='undefined'||v==='NaN'||v.includes('[object Object]'))c++}return c})()""")
            if junk: errs.append(f'{junk} stray null/undefined text')
            crash = pg.evaluate("(()=>{const t=(document.getElementById('app')||document.body).innerText;return /hit an error|Something went wrong|is not defined|Cannot read prop/.test(t)})()")
            if crash: errs.append('error message shown on page')
            if errs or n < 80: fails.append((r, n, errs[:2]))
            print('ok  ' if not (errs or n < 80) else 'FAIL', r, n, errs[:1])
        b.close()
finally:
    srv.terminate()
print(f'{len(fails)} failing pages')
sys.exit(1 if fails else 0)
