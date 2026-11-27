#!/usr/bin/env python3
"""Inventory crawler: serves the site, walks every in-app link from the home page and records what each page is.

Pages that differ only by an entity id (a country code, a case id, a book id ...) are grouped into one pattern,
and only a few examples of each pattern are opened. Output: plan/inventory/pages.json (one record per page opened)
and plan/inventory/patterns.json (one record per pattern, with how many instances are linked).
Usage: python3 tools/crawl_inventory.py [max_pages]"""
import os, sys, re, json, subprocess, time, socket, collections
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
OUT = 'plan/inventory'; os.makedirs(OUT, exist_ok=True)
MAX = int(sys.argv[1]) if len(sys.argv) > 1 else 2500
PER_PATTERN = 2

s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5); base = f'http://127.0.0.1:{port}/'

# static prefixes reached by buttons rather than links
static = set()
for fn in os.listdir('js'):
    if not fn.endswith('.js'): continue
    src = open('js/' + fn, encoding='utf-8', errors='ignore').read()
    for m in re.finditer(r"(?:location\.hash\s*=\s*|Lab\.go\(\s*|href:\s*)['\"`]#?([a-z][a-z0-9_-]*)", src):
        static.add(m.group(1).rstrip('-'))

ISO = None
def pattern(h, isos):
    parts = h.split('-'); out = []
    for i, p in enumerate(parts):
        if p in isos and i > 0: out.append('{iso}')
        elif re.fullmatch(r'\d+', p): out.append('{n}')
        elif i > 0 and parts[0] in ('search',): out.append('{q}'); break
        else: out.append(p)
    return '-'.join(out)

JS_PAGE = r"""() => {
  const app = document.getElementById('app') || document.body;
  const txt = s => (s || '').replace(/\s+/g, ' ').trim();
  const h1 = app.querySelector('h1'); const crumb = app.querySelector('.crumb');
  const links = [...app.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const tabs = [...app.querySelectorAll('.tab, [role=tab]')].map(b => txt(b.innerText)).filter(Boolean).slice(0, 40);
  const h2 = [...app.querySelectorAll('h2')].map(e => txt(e.innerText)).filter(Boolean).slice(0, 25);
  const ext = [...app.querySelectorAll('a[href^="http"]')].length;
  return { h1: h1 ? txt(h1.innerText) : '', crumb: crumb ? txt(crumb.innerText) : '', chars: txt(app.innerText).length,
           imgs: app.querySelectorAll('img').length, media: app.querySelectorAll('video, audio, iframe').length,
           svgs: app.querySelectorAll('svg').length, tabs, h2, links, ext,
           ctx: (document.getElementById('ctx') || {}).textContent || '' };
}"""

pages, seen, q = [], set(), collections.deque()
per = collections.Counter(); pat_instances = collections.defaultdict(set); inbound = collections.defaultdict(set)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 900})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
        pg.route('**/*', lambda r: r.abort() if not r.request.url.startswith(base) else r.continue_())
        pg.goto(base + '#home'); pg.wait_for_timeout(2500)
        isos = set(pg.evaluate("(()=>{try{return (Lab.COUNTRIES||Lab.countries||[]).map(c=>(c.iso||c.id||c[0]||'').toLowerCase())}catch(e){return []}})()") or [])
        if os.path.isdir('data/cs'): isos |= {f[:-5] for f in os.listdir('data/cs') if f.endswith('.json')}
        routes = pg.evaluate("Object.keys(Lab.routes||{})")
        subj = pg.evaluate("(Lab.subjects||[]).flatMap(s=>s.ex.map(e=>s.id+'-'+e[0]))")
        for h in ['home'] + routes + subj + sorted(static):
            q.append((h, 'seed'))
        while q and len(pages) < MAX:
            h, frm = q.popleft()
            if h in seen: continue
            seen.add(h); pt = pattern(h, isos); pat_instances[pt].add(h); inbound[pt].add(pattern(frm, isos) if frm != 'seed' else 'seed')
            if per[pt] >= PER_PATTERN: continue
            per[pt] += 1
            errs.clear(); pg.goto(base + '#' + h); pg.wait_for_timeout(450)
            pg.evaluate("document.querySelectorAll('.modal-bg').forEach(e=>e.remove())")
            try: rec = pg.evaluate(JS_PAGE)
            except Exception as e: rec = {'error': str(e)[:160], 'links': []}
            rec.update(hash=h, pattern=pt, errors=errs[:2])
            links = rec.pop('links', [])
            rec['out'] = sorted({pattern(l, isos) for l in links})[:200]
            pages.append(rec)
            for l in links:
                if l not in seen: q.append((l, h))
            if len(pages) % 100 == 0: print(len(pages), 'pages,', len(pat_instances), 'patterns', flush=True)
        # everything still queued counts as linked, even if not opened
        for h, frm in q:
            pt = pattern(h, isos); pat_instances[pt].add(h); inbound[pt].add(pattern(frm, isos))
        b.close()
finally:
    srv.terminate()
pats = []
for pt, inst in pat_instances.items():
    ex = [r for r in pages if r['pattern'] == pt]
    pats.append({'pattern': pt, 'instances': len(inst), 'examples': sorted(inst)[:5], 'opened': len(ex),
                 'h1': ex[0].get('h1', '') if ex else '', 'chars': max((r.get('chars', 0) for r in ex), default=0),
                 'inbound': sorted(inbound[pt])[:30]})
json.dump(pages, open(OUT + '/pages.json', 'w'), indent=1, ensure_ascii=False)
json.dump(sorted(pats, key=lambda x: x['pattern']), open(OUT + '/patterns.json', 'w'), indent=1, ensure_ascii=False)
print(len(pages), 'pages opened,', len(pats), 'patterns')
