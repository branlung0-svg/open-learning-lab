/* Lesson kit: interactive figures, step-by-step practice, drills and the exit check for lesson pages
   built by tools/lessons/build.mjs. Plain script, no dependencies; math in data arrives pre-typeset. */
(function () {
  'use strict';
  const doc = document, root = doc.documentElement;
  const DATA = JSON.parse((doc.getElementById('lesson-data') || {}).textContent || '{}');
  const LID = (doc.title.split(' ')[0] || 'lesson');
  const MINUS = '−';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('lesson:' + LID + ':' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('lesson:' + LID + ':' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  };
  const fmt = n => (n < 0 ? MINUS + Math.abs(n) : String(n)).replace(/\.0+$/, '');
  const par = n => (n < 0 ? '(' + fmt(n) + ')' : fmt(n));
  const num = s => { const t = String(s).trim().replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/^\+/, ''); return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : NaN; };
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, ...kids) {
    const e = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : doc.createTextNode(c));
    return e;
  }
  function sv(tag, attrs, ...kids) {
    const e = doc.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) e.setAttribute(k, v);
    for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : doc.createTextNode(c));
    return e;
  }
  function animate(ms, step, done) {
    if (reduce) { step(1); if (done) done(); return; }
    const t0 = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    (function f(now) { const t = Math.min(1, (now - t0) / ms); step(ease(t)); if (t < 1) requestAnimationFrame(f); else if (done) done(); })(t0);
  }
  // Figures are drawn in a 640-unit-wide frame. On narrow screens, text and dots grow so they stay readable.
  const fitK = (box, w) => Math.max(1, Math.min(2.2, (w || 640) / Math.max(280, box.clientWidth || 640)));
  const svgK = (s, k) => { s.style.setProperty('--k', k); return k; };
  const btn = (label, on, cls) => el('button', { type: 'button', class: 'kbtn' + (cls ? ' ' + cls : ''), onclick: on }, label);

  /* ---------- page chrome: mode, theme, progress, contents ---------- */
  function chrome() {
    const setMode = m => { root.classList.toggle('short', m === 'short'); store.set('mode', m); try { localStorage.setItem('lesson-mode', m); } catch (e) { } doc.querySelectorAll('.mode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m))); };
    doc.querySelectorAll('.mode button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    setMode(root.classList.contains('short') ? 'short' : 'full');
    const tb = doc.querySelector('.theme');
    if (tb) tb.addEventListener('click', () => {
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('lesson-theme', root.dataset.theme); } catch (e) { }
    });
    const bar = doc.querySelector('.progress i');
    const onScroll = () => { const h = doc.body.scrollHeight - innerHeight; if (bar) bar.style.width = (h > 0 ? Math.min(100, 100 * scrollY / h) : 0) + '%'; };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const links = [...doc.querySelectorAll('.toc a')];
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
      doc.querySelectorAll('section.sec').forEach(s => io.observe(s));
    }
    doc.querySelectorAll('.reveal').forEach(r => {
      const b = el('button', { type: 'button', class: 'revbtn', 'aria-expanded': 'false' }, 'Show answer');
      r.hidden = true; r.before(b);
      b.addEventListener('click', () => { r.hidden = !r.hidden; b.setAttribute('aria-expanded', String(!r.hidden)); b.textContent = r.hidden ? 'Show answer' : 'Hide'; });
    });
  }

  /* ---------- number-line helper ---------- */
  function axis(g, x, y, lo, hi, opts = {}) {
    const every = opts.every || 1, lab = opts.label || 1, k = opts.k || 1;
    g.append(sv('line', { x1: x(lo) - 10, x2: x(hi) + 10, y1: y, y2: y, class: 'ax' }));
    for (let n = lo; n <= hi; n += every) {
      g.append(sv('line', { x1: x(n), x2: x(n), y1: y - (n === 0 ? 8 : 5), y2: y + (n === 0 ? 8 : 5), class: n === 0 ? 'ax zero' : 'ax' }));
      if (n % lab === 0) g.append(sv('text', { x: x(n), y: y + 12 + 12 * k, class: 'tick' }, fmt(n)));
    }
  }

  /* ---------- Figure: the flip ---------- */
  function figFlip(box) {
    const W = 640, Y = 46, X = n => 320 + 56 * n;
    const s = sv('svg', { viewBox: `0 0 ${W} 104`, class: 'figsvg', role: 'img', 'aria-label': 'Number line from minus five to five with two dots that flip over around zero' });
    const k = svgK(s, fitK(box));
    const fixed = sv('g'); axis(fixed, X, Y, -5, 5, { k }); s.append(fixed);
    const turn = sv('g', { class: 'turning' });
    turn.append(sv('line', { x1: X(-5) - 10, x2: X(5) + 10, y1: Y, y2: Y, class: 'ghost' }));
    const A = sv('circle', { r: 9 * Math.min(k, 1.3), class: 'dot a' }), B = sv('circle', { r: 7 * Math.min(k, 1.3), class: 'dot b' });
    turn.append(B, A); s.append(turn);
    let start = 3, flips = 0, busy = false;
    const sign = () => (flips % 2 ? -1 : 1);
    const place = () => { A.setAttribute('cx', X(start * sign())); A.setAttribute('cy', Y); B.setAttribute('cx', X(-2 * sign())); B.setAttribute('cy', Y); };
    const out = el('p', { class: 'readout' });
    const say = () => {
      const chain = [fmt(start)].concat(Array(flips).fill('(' + MINUS + '1)')).join(' × ');
      out.textContent = flips === 0 ? `Blue dot: ${fmt(start)}. Grey dot: ${MINUS}2. Tap a number on the line to follow a different one.` : `${chain} = ${fmt(start * sign())}  (${flips} flip${flips > 1 ? 's' : ''}${flips % 2 === 0 ? ', back where it started' : ''})`;
    };
    // a half-turn of the line about the vertical axis through zero, seen face on: every point slides through zero to its mirror image
    const flip = () => {
      if (busy) return; busy = true;
      animate(800, t => turn.setAttribute('transform', `translate(${X(0)} 0) scale(${Math.cos(Math.PI * t)} 1) translate(${-X(0)} 0)`), () => { turn.removeAttribute('transform'); flips++; place(); say(); busy = false; });
    };
    s.addEventListener('click', e => {
      const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(s.getScreenCTM().inverse());
      const n = Math.round((q.x - 320) / 56); if (n >= -5 && n <= 5 && n !== 0 && !busy) { start = n; flips = 0; place(); say(); }
    });
    s.classList.add('tap'); place(); say();
    box.append(s, el('div', { class: 'controls' }, btn(['× (', MINUS, '1)'].join(''), flip, 'primary'), btn('Reset', () => { flips = 0; place(); say(); })), out);
  }

  /* ---------- Figure: stretch, then flip ---------- */
  function figStretch(box) {
    const W = 640, Y = 108, X = n => 320 + 14 * n;
    const s = sv('svg', { viewBox: `0 0 ${W} 150`, class: 'figsvg', role: 'img', 'aria-label': 'Number line from minus twenty to twenty showing a stretch and a flip' }); const k = svgK(s, fitK(box));
    const g = sv('g'); axis(g, X, Y, -20, 20, { label: 5, k }); s.append(g);
    const arcs = sv('g'); s.append(arcs);
    const P0 = sv('circle', { r: 7, class: 'dot b' }), P1 = sv('circle', { r: 8, class: 'dot ring' }), P2 = sv('circle', { r: 9, class: 'dot a' });
    s.append(P0, P1, P2);
    let a = -3, b = -2, stage = 0;
    const out = el('p', { class: 'readout' });
    const sel = (lab, vals, get, set) => el('label', { class: 'pick' }, lab + ' ', (() => { const x = el('select', { onchange: e => { set(Number(e.target.value)); stage = 0; draw(); } }); vals.forEach(v => x.append(el('option', { value: v, selected: v === get() ? 'selected' : false }, fmt(v)))); return x; })());
    const arc = (x1, x2, tall, cls) => { const up = true; const h = -(tall ? Math.max(34, Math.abs(x2 - x1) / 2.6) : Math.max(14, Math.abs(x2 - x1) / 4)); arcs.append(sv('path', { d: `M${x1} ${Y - 10 * (up ? 1 : -1)} Q${(x1 + x2) / 2} ${Y + 2 * h} ${x2} ${Y - 10 * (up ? 1 : -1)}`, class: 'arc ' + cls, 'marker-end': 'url(#kit-ah-' + cls + ')' })); };
    const defs = sv('defs'); ['a', 'b'].forEach(c => defs.append(sv('marker', { id: 'kit-ah-' + c, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, sv('path', { d: 'M0 0L10 5L0 10z', class: 'ah ' + c })))); s.prepend(defs);
    function draw() {
      arcs.replaceChildren();
      const st = Math.abs(a) * b, fin = a * b;
      P0.setAttribute('cx', X(b)); P0.setAttribute('cy', Y);
      P1.setAttribute('cx', X(st)); P1.setAttribute('cy', Y); P1.style.opacity = stage >= 1 ? 1 : 0;
      P2.setAttribute('cx', X(fin)); P2.setAttribute('cy', Y); P2.style.opacity = stage >= 2 ? 1 : 0;
      if (stage >= 1 && st !== b) arc(X(b), X(st), false, 'b');
      if (stage >= 2 && a < 0 && fin !== st) arc(X(st), X(fin), true, 'a');
      const msgs = [`Start at ${fmt(b)}. Multiplying by ${fmt(a)} is ${a < 0 ? 'a stretch by ' + Math.abs(a) + ', then a flip' : 'just a stretch by ' + a}.`,
        `Stretch by ${Math.abs(a)}: ${fmt(b)} → ${fmt(st)}.`,
        a < 0 ? `Flip: ${fmt(st)} → ${fmt(fin)}. So ${par(a)} × ${par(b)} = ${fmt(fin)}.` : `No flip needed: ${par(a)} × ${par(b)} = ${fmt(fin)}.`];
      out.textContent = msgs[stage];
      next.textContent = stage === 0 ? 'Stretch' : stage === 1 ? (a < 0 ? 'Flip' : 'Done') : 'Start again';
    }
    const next = btn('Stretch', () => { stage = (stage + 1) % 3; if (stage === 2 && a >= 0) stage = 2; draw(); }, 'primary');
    box.append(s, el('div', { class: 'controls' }, sel('Multiply', [-4, -3, -2, -1, 1, 2, 3, 4], () => a, v => a = v), sel('by', [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], () => b, v => b = v), next), out);
    draw();
  }

  /* ---------- Figure: the pattern that must continue ---------- */
  function figPattern(box) {
    let b = -2, idx = 0, tries = 0;
    const ns = [3, 2, 1, 0, -1, -2, -3];
    const W = 640, H = 260, gx = n => 380 + 52 * n, gy = v => 130 - 9 * v;
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'figsvg', role: 'img', 'aria-label': 'Graph of n times b for n from three down to minus three' }); svgK(s, fitK(box));
    const grid = sv('g'); s.append(grid);
    const pts = sv('g'); s.append(pts);
    const table = el('table', { class: 'ptable' });
    const ask = el('div', { class: 'ask' });
    const out = el('p', { class: 'readout' });
    function frame() {
      grid.replaceChildren();
      grid.append(sv('line', { x1: gx(-4), x2: gx(4), y1: gy(0), y2: gy(0), class: 'ax' }), sv('line', { x1: gx(0), x2: gx(0), y1: gy(13), y2: gy(-13), class: 'ax' }));
      for (let n = -3; n <= 3; n++) if (n) grid.append(sv('text', { x: gx(n), y: gy(0) + 20, class: 'tick' }, fmt(n)));
      for (let v = -12; v <= 12; v += 4) if (v) { grid.append(sv('line', { x1: gx(0) - 4, x2: gx(0) + 4, y1: gy(v), y2: gy(v), class: 'ax' })); grid.append(sv('text', { x: gx(0) - 10, y: gy(v) + 4, class: 'tick end' }, fmt(v))); }
      grid.append(sv('text', { x: gx(4) - 4, y: gy(0) - 8, class: 'tick end' }, 'n'), sv('text', { x: gx(0) + 8, y: gy(13) + 4, class: 'tick start' }, 'n × ' + par(b)));
    }
    function draw() {
      frame(); pts.replaceChildren(); table.replaceChildren(el('tr', {}, el('th', {}, 'n'), el('th', {}, 'n × ' + par(b)), el('th', {}, 'change')));
      const shown = ns.slice(0, idx + 1);
      if (shown.length >= 3) { const lo = shown[shown.length - 1], hi = shown[0]; pts.append(sv('line', { x1: gx(hi), y1: gy(hi * b), x2: gx(lo), y2: gy(lo * b), class: 'trend' })); }
      shown.forEach((n, i) => {
        pts.append(sv('circle', { cx: gx(n), cy: gy(n * b), r: n < 0 ? 7 : 6, class: n < 0 ? 'dot a' : 'dot b' }));
        table.append(el('tr', { class: n < 0 ? 'neg' : '' }, el('td', {}, fmt(n)), el('td', {}, fmt(n * b)), el('td', {}, i ? (b < 0 ? '+' : MINUS) + Math.abs(b) : '')));
      });
      ask.replaceChildren();
      if (idx < ns.length - 1) {
        const n = ns[idx + 1];
        if (n < 0) {
          const inp = el('input', { type: 'text', inputmode: 'numeric', 'aria-label': 'Your prediction', size: 5 });
          const go = () => { const v = num(inp.value); if (isNaN(v)) return; if (v === n * b || ++tries >= 2) { if (v !== n * b) out.textContent = `It is ${fmt(n * b)}: the pattern keeps ${b < 0 ? 'adding' : 'subtracting'} ${Math.abs(b)}.`; else out.textContent = 'Right. The line stays straight.'; tries = 0; idx++; draw(); } else out.textContent = `Not quite. Each step down in n ${b < 0 ? 'adds' : 'subtracts'} ${Math.abs(b)} to the product. Try again.`; };
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
          ask.append(el('span', {}, `Predict ${par(n)} × ${par(b)} = `), inp, btn('Check', go, 'primary'));
        } else ask.append(btn(`Next: n = ${fmt(n)}`, () => { idx++; out.textContent = ''; draw(); }, 'primary'));
      } else { ask.append(btn('Start again', () => { idx = 0; out.textContent = ''; draw(); })); out.textContent = `The products lie on one straight line through zero. Below zero, ${par(-1)} × ${par(b)} = ${fmt(-b)}.`; }
    }
    const pick = el('select', { onchange: e => { b = Number(e.target.value); idx = 0; tries = 0; out.textContent = ''; draw(); } });
    [-3, -2, -1, 2, 3].forEach(v => pick.append(el('option', { value: v, selected: v === b ? 'selected' : false }, fmt(v))));
    box.append(el('div', { class: 'fig-split' }, s, table), el('div', { class: 'controls' }, el('label', { class: 'pick' }, 'Second number ', pick), ask), out);
    draw();
  }

  /* ---------- Figure: the missing corner ---------- */
  function figArea(box) {
    let p = 3, q = 2; const u = 24, x0 = 34, y0 = 26, S = 10 * u;
    const s = sv('svg', { viewBox: '0 0 290 280', class: 'figsvg', role: 'img', 'aria-label': 'A ten by ten square with a strip removed from the right and the bottom' });
    svgK(s, fitK(box, 290) > 1.4 ? 1.15 : 1);
    const g = sv('g'); s.append(g);
    const work = el('ol', { class: 'work' }), eq = el('p', { class: 'eqline' });
    function draw() {
      g.replaceChildren();
      const kx = x0 + (10 - p) * u, ky = y0 + (10 - q) * u;
      g.append(sv('rect', { x: kx, y: y0, width: p * u, height: S, class: 'strip' }), sv('rect', { x: x0, y: ky, width: S, height: q * u, class: 'strip' }),
        sv('rect', { x: kx, y: ky, width: p * u, height: q * u, class: 'corner' }), sv('rect', { x: x0, y: y0, width: S, height: S, class: 'outline' }));
      const t = (x, y, txt, cls) => g.append(sv('text', { x, y, class: 'lab ' + (cls || '') }, txt));
      t(x0 + (10 - p) * u / 2, y0 + (10 - q) * u / 2 + 5, String((10 - p) * (10 - q)), 'strong big');
      t(kx + p * u / 2, y0 + (10 - q) * u / 2 + 5, MINUS + (10 * p), 'mid');
      t(x0 + (10 - p) * u / 2, ky + q * u / 2 + 5, MINUS + (10 * q), 'mid');
      t(kx + p * u / 2, ky + q * u / 2 + 5, '+' + p * q, 'strong');
      t(x0 + (10 - p) * u / 2, y0 - 8, String(10 - p), 'dim'); t(kx + p * u / 2, y0 - 8, String(p), 'dim');
      t(x0 - 14, y0 + (10 - q) * u / 2 + 4, String(10 - q), 'dim'); t(x0 - 14, ky + q * u / 2 + 4, String(q), 'dim');
      work.replaceChildren(el('li', {}, 'Whole square: 10 × 10 = 100'), el('li', {}, `Remove the ${p}-wide strip: ${MINUS} ${10 * p}`), el('li', {}, `Remove the ${q}-tall strip: ${MINUS} ${10 * q}`),
        el('li', {}, `The ${q} × ${p} corner was in both strips, so it was removed twice. Add it back once: + ${p * q}`));
      eq.innerHTML = `(10 ${MINUS} ${q})(10 ${MINUS} ${p}) = 100 ${MINUS} ${10 * p} ${MINUS} ${10 * q} + ${p * q} = <b>${(10 - p) * (10 - q)}</b><br><span class="accent">The + ${p * q} is (${MINUS}${q}) × (${MINUS}${p}).</span>`;
    }
    const slider = (lab, get, set) => { const r = el('input', { type: 'range', min: 1, max: 5, step: 1, value: get(), 'aria-label': lab }); const o = el('output', {}, String(get())); r.addEventListener('input', () => { set(Number(r.value)); o.textContent = r.value; draw(); }); return el('label', { class: 'pick' }, lab + ' ', r, o); };
    box.append(el('div', { class: 'fig-split wide' }, s, el('div', { class: 'side' }, work, eq)), el('div', { class: 'controls' }, slider('Right strip width', () => p, v => p = v), slider('Bottom strip height', () => q, v => q = v)));
    draw();
  }

  /* ---------- Figure: the film in reverse ---------- */
  function figFilm(box) {
    const v = -3, X = m => 320 + 20 * m, Y = 100;
    const s = sv('svg', { viewBox: '0 0 640 170', class: 'figsvg', role: 'img', 'aria-label': 'A car moving left along a track, with its position over time' }); const k = svgK(s, fitK(box));
    const g = sv('g'); axis(g, X, Y + 30, -12, 12, { label: k > 1.5 ? 6 : 3, k }); s.append(g);
    const car = sv('g', { class: 'car' }, sv('rect', { x: -26, y: -22, width: 52, height: 22, rx: 6, class: 'body' }), sv('rect', { x: -14, y: -34, width: 26, height: 14, rx: 4, class: 'body' }),
      sv('circle', { cx: -15, cy: 2, r: 6, class: 'wheel' }), sv('circle', { cx: 15, cy: 2, r: 6, class: 'wheel' }), sv('path', { d: 'M-40 -12 L-30 -18 L-30 -6 Z', class: 'nose' }));
    const ghost = sv('g', { class: 'car ghostcar' }, sv('rect', { x: -26, y: -22, width: 52, height: 22, rx: 6 }), sv('rect', { x: -14, y: -34, width: 26, height: 14, rx: 4 }));
    s.append(ghost, car);
    let t = 0, busy = false;
    const out = el('p', { class: 'readout' });
    function place() {
      const x = v * t; car.setAttribute('transform', `translate(${X(x)} ${Y})`); ghost.setAttribute('transform', `translate(${X(0)} ${Y})`);
      out.textContent = t === 0 ? `Now: t = 0 s, position 0 m. Velocity ${fmt(v)} m/s (moving left).` : `t = ${fmt(+t.toFixed(1))} s: position = (${fmt(v)}) × ${par(+t.toFixed(1))} = ${fmt(+(v * t).toFixed(1))} m${t < 0 ? ' (in the past: the car was to the right)' : ' (in the future: to the left)'}.`;
    }
    const play = to => { if (busy) return; busy = true; const from = t; animate(Math.abs(to - from) * 450, k => { t = from + (to - from) * k; place(); }, () => { t = to; place(); busy = false; }); };
    box.append(s, el('div', { class: 'controls' }, btn('Play forward 2 s', () => play(2), ''), btn('Play backward 2 s', () => play(-2), 'primary'), btn('Back to now', () => play(0))), out);
    place();
  }

  /* ---------- Figure: the rule on a clock ---------- */
  function figClock(box) {
    let n = 12; const cx = 150, cy = 140, R = 120;
    const s = sv('svg', { viewBox: '0 0 300 285', class: 'figsvg', role: 'img', 'aria-label': 'A clock face with n hours, showing (n minus 1) squared landing on 1' });
    svgK(s, fitK(box, 300) > 1.4 ? 1.1 : 1);
    const g = sv('g'); s.append(g);
    const hand = sv('line', { x1: cx, y1: cy, x2: cx, y2: cy - R + 30, class: 'hand' }); s.append(hand, sv('circle', { cx, cy, r: 5, class: 'dot a' }));
    const work = el('div', { class: 'side' });
    const ang = k => -Math.PI / 2 + 2 * Math.PI * k / n;
    function face() {
      g.replaceChildren(sv('circle', { cx, cy, r: R, class: 'face' }));
      for (let k = 0; k < n; k++) {
        const a = ang(k), x = cx + (R - 20) * Math.cos(a), y = cy + (R - 20) * Math.sin(a) + 5;
        g.append(sv('text', { x, y, class: 'tick' + (k === n - 1 ? ' accent strong' : k === 1 ? ' strong' : '') }, String(k === 0 ? n : k)));
      }
    }
    function say() {
      const m = n - 1, sq = m * m, full = n - 2;
      work.innerHTML = `<p>On a ${n}-hour clock, going forward ${m} hours lands where going back 1 hour does, so <b>${m} plays the part of ${MINUS}1</b>.</p>` +
        `<p class="eqline">${m} × ${m} = ${sq} = ${n} × ${full} + 1</p><p>That is ${full} full turns and then 1 more hour, so the hand stops at 1.</p><p class="accent"><b>On this clock, (${MINUS}1) × (${MINUS}1) = 1.</b></p>`;
    }
    const setHand = k => { const a = ang(k); hand.setAttribute('x2', cx + (R - 42) * Math.cos(a)); hand.setAttribute('y2', cy + (R - 42) * Math.sin(a)); };
    const run = () => { const total = (n - 1) * (n - 1); animate(1600, t => setHand(total * t), () => setHand(1)); };
    const r = el('input', { type: 'range', min: 3, max: 24, value: n, 'aria-label': 'Hours on the clock' });
    const o = el('output', {}, String(n));
    r.addEventListener('input', () => { n = Number(r.value); o.textContent = r.value; face(); say(); setHand(0); });
    face(); say(); setHand(0);
    box.append(el('div', { class: 'fig-split wide' }, s, work), el('div', { class: 'controls' }, el('label', { class: 'pick' }, 'Hours on the clock ', r, o), btn('Multiply (n ' + MINUS + ' 1) × (n ' + MINUS + ' 1)', run, 'primary')));
  }

  const FIGS = { flip: figFlip, stretch: figStretch, pattern: figPattern, area: figArea, film: figFilm, clock: figClock };

  /* ---------- Do it: step engine ---------- */
  function steps(box) {
    const S = DATA.steps || []; if (!S.length) return;
    const state = store.get('steps', { i: 0, done: {} });
    const card = el('div', { class: 'stepcard' }), dots = el('div', { class: 'dots', role: 'tablist', 'aria-label': 'Steps' });
    const nav = el('div', { class: 'stepnav' });
    box.append(dots, card, nav);
    function save() { store.set('steps', state); }
    function renderDots() { dots.replaceChildren(...S.map((_, j) => el('button', { type: 'button', class: 'dot-b' + (j === state.i ? ' on' : '') + (state.done[j] ? ' done' : ''), 'aria-label': 'Step ' + (j + 1), onclick: () => { state.i = j; save(); render(); } }, String(j + 1)))); }
    function finish(ok, msg, explain) {
      state.done[state.i] = ok ? 'ok' : 'shown'; save();
      fb.className = 'fb ' + (ok ? 'ok' : 'shown'); fb.innerHTML = (ok ? '<b>Right.</b> ' : '<b>Here is the answer.</b> ') + (msg || '') + ' ' + (explain || '');
      renderDots(); nextB.disabled = false; nextB.focus({ preventScroll: true });
    }
    let fb, nextB, tries;
    function render() {
      const st = S[state.i]; tries = 0; card.replaceChildren();
      card.append(el('p', { class: 'stepno' }, `Step ${state.i + 1} of ${S.length}`), el('div', { class: 'prompt', html: st.prompt }));
      fb = el('div', { class: 'fb', 'aria-live': 'polite' });
      const wrong = (key) => {
        tries++;
        const h = (st.hints && (st.hints[key] || st.hints.other)) || 'Not quite. Try again.';
        if (tries >= 2) finish(false, '', st.explain);
        else { fb.className = 'fb no'; fb.innerHTML = '<b>Not yet.</b> ' + h; }
      };
      if (st.type === 'choice') {
        const opts = el('div', { class: 'opts' + (st.options.every(o => String(o).replace(/<[^>]+>/g, '').length < 16) ? ' compact' : '') });
        st.options.forEach((o, j) => opts.append(el('button', { type: 'button', class: 'opt', html: o, onclick: e => { if (state.done[state.i] && tries === -1) return; if (j === st.answer) { e.currentTarget.classList.add('right'); finish(true, '', st.explain); tries = -1; } else { e.currentTarget.classList.add('wrongpick'); wrong(String(j)); } } })));
        card.append(opts);
      } else if (st.type === 'num') {
        const inp = el('input', { type: 'text', inputmode: 'text', autocomplete: 'off', 'aria-label': 'Your answer', placeholder: 'e.g. ' + MINUS + '4' });
        const go = () => { const v = num(inp.value); if (isNaN(v)) { fb.className = 'fb no'; fb.textContent = 'Type a number, such as −4 or 7.'; return; } if (v === st.answer) finish(true, '', st.explain); else wrong(String(v)); };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
        card.append(el('div', { class: 'row' }, inp, btn('Check', go, 'primary'), minusKey(inp)));
      } else if (st.type === 'table') {
        const ins = st.answers.map((_, j) => el('input', { type: 'text', inputmode: 'text', size: 4, 'aria-label': String(st.labels[j]).replace(/<[^>]+>/g, '') }));
        const t = el('div', { class: 'tblin' }, ...st.labels.map((l, j) => el('label', {}, el('span', { html: l + ' = ' }), ins[j])));
        const go = () => { const vs = ins.map(i => num(i.value)); if (vs.some(isNaN)) { fb.className = 'fb no'; fb.textContent = 'Fill in all four boxes.'; return; } const bad = vs.map((v, j) => v !== st.answers[j]); ins.forEach((i, j) => i.classList.toggle('bad', bad[j])); if (!bad.some(Boolean)) finish(true, '', st.explain); else wrong('other'); };
        card.append(t, el('div', { class: 'row' }, btn('Check', go, 'primary')));
      } else if (st.type === 'line') {
        const [lo, hi] = st.range, X = n => 30 + (580 / (hi - lo)) * (n - lo), Y = 46;
        const s = sv('svg', { viewBox: '0 0 640 86', class: 'figsvg tap', role: 'img', 'aria-label': 'Number line: tap a number' }); const kk = svgK(s, fitK(box)); const g = sv('g'); axis(g, X, Y, lo, hi, { label: kk > 1.5 ? 5 : 2, k: kk }); s.append(g);
        const mk = sv('circle', { r: 9, class: 'dot a', cx: -50, cy: Y }); s.append(mk);
        const hops = sv('g'); s.prepend(hops);
        s.addEventListener('click', e => {
          if (state.done[state.i] && tries === -1) return;
          const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(s.getScreenCTM().inverse());
          const n = Math.max(lo, Math.min(hi, Math.round(lo + (q.x - 30) * (hi - lo) / 580))); mk.setAttribute('cx', X(n));
          if (n === st.answer) { hops.replaceChildren(); const h = st.hop || 0; for (let k = 0; h && k < (st.count || 0); k++) hops.append(sv('path', { d: `M${X(h * k)} ${Y - 8} Q${(X(h * k) + X(h * k + h)) / 2} ${Y - 34} ${X(h * k + h)} ${Y - 8}`, class: 'arc a' })); finish(true, '', st.explain); tries = -1; }
          else wrong(String(n));
        });
        card.append(s);
      } else if (st.type === 'text') {
        const ta = el('textarea', { rows: 3, 'aria-label': 'Your explanation', placeholder: 'Write it in your own words…' });
        const show = () => { finish(true, '', '<p>Compare with these model answers:</p><ul>' + st.models.map(m => '<li>' + m + '</li>').join('') + '</ul>'); };
        card.append(ta, el('div', { class: 'row' }, btn('Compare with model answers', show, 'primary')));
      }
      card.append(fb);
      nextB = btn(state.i < S.length - 1 ? 'Next step' : 'All done', () => { if (state.i < S.length - 1) { state.i++; save(); render(); card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); } }, 'primary');
      nextB.disabled = !state.done[state.i];
      nav.replaceChildren(btn('Back', () => { if (state.i > 0) { state.i--; save(); render(); } }), nextB);
      if (state.done[state.i]) { fb.className = 'fb ' + (state.done[state.i] === 'ok' ? 'ok' : 'shown'); fb.innerHTML = '<b>Done.</b> ' + (st.explain || ''); }
      renderDots();
    }
    render();
  }
  function minusKey(inp) { return btn(MINUS, () => { inp.value = inp.value.startsWith(MINUS) || inp.value.startsWith('-') ? inp.value.slice(1) : MINUS + inp.value; inp.focus(); }, 'minus'); }

  /* ---------- Exit check ---------- */
  function quiz(box) {
    const Q = DATA.quiz || []; if (!Q.length) return;
    const ans = store.get('quiz', {});
    const score = el('p', { class: 'score', 'aria-live': 'polite' });
    const list = el('ol', { class: 'quiz' });
    function upd() {
      const n = Object.keys(ans).length, right = Object.values(ans).filter(x => x === 'ok').length;
      score.innerHTML = n < Q.length ? `${n} of ${Q.length} answered.` : right >= 6 ? `<b>${right} of ${Q.length}. Lesson complete.</b> Next: lesson 2.1.4.` : `<b>${right} of ${Q.length}.</b> Review the sections linked under your misses, then try again.`;
      if (n === Q.length && right >= 6) store.set('complete', true);
    }
    Q.forEach((q, i) => {
      const fb = el('div', { class: 'fb', 'aria-live': 'polite' }), opts = el('div', { class: 'opts' + (q.options.every(o => String(o).replace(/<[^>]+>/g, '').length < 16) ? ' compact' : '') });
      q.options.forEach((o, j) => opts.append(el('button', { type: 'button', class: 'opt', html: o, onclick: () => {
        if (ans[i]) return;
        ans[i] = j === q.answer ? 'ok' : 'no'; store.set('quiz', ans);
        opts.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; if (k === q.answer) b.classList.add('right'); else if (k === j) b.classList.add('wrongpick'); });
        fb.className = 'fb ' + (j === q.answer ? 'ok' : 'no');
        fb.innerHTML = j === q.answer ? '<b>Right.</b> ' + q.explain : `<b>Not this one.</b> ${(q.why && q.why[String(j)]) || ''} ${q.explain} <a href="#${q.review}">Review this</a>`;
        upd();
      } })));
      list.append(el('li', {}, el('div', { class: 'prompt', html: q.q }), opts, fb));
    });
    const again = btn('Start the check again', () => { for (const k of Object.keys(ans)) delete ans[k]; store.set('quiz', ans); box.replaceChildren(); quiz(box); });
    box.append(list, score, again); upd();
    Object.entries(ans).forEach(([i, v]) => { const li = list.children[+i]; if (!li) return; li.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; if (k === Q[+i].answer) b.classList.add('right'); }); const fb = li.querySelector('.fb'); fb.className = 'fb ' + (v === 'ok' ? 'ok' : 'no'); fb.innerHTML = (v === 'ok' ? '<b>Right.</b> ' : '<b>Missed.</b> ') + Q[+i].explain; });
  }

  function explain(box) {
    (DATA.explain || []).forEach((x, i) => {
      const ta = el('textarea', { rows: 3, 'aria-label': 'Your explanation' }); ta.value = store.get('ex' + i, '');
      ta.addEventListener('input', () => store.set('ex' + i, ta.value));
      const m = el('div', { class: 'models', hidden: 'hidden', html: '<p><b>Model answer' + (x.models.length > 1 ? 's' : '') + ':</b></p><ul>' + x.models.map(t => '<li>' + t + '</li>').join('') + '</ul>' });
      box.append(el('div', { class: 'explain-item' }, el('div', { class: 'prompt', html: (i + 1) + '. ' + x.prompt }), ta, btn('Show model answer', e => { m.hidden = !m.hidden; e.currentTarget.textContent = m.hidden ? 'Show model answer' : 'Hide model answer'; }), m));
    });
  }

  /* ---------- Drills ---------- */
  function drills(box) {
    let level = store.get('drill-level', 1), cur = null, streak = 0, tries = 0, total = store.get('drill-total', 0);
    const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const nz = (a, b) => { let v; do v = R(a, b); while (v === 0); return v; };
    function gen() {
      if (level === 1) { const a = nz(-9, 9), b = nz(-9, 9); return Math.random() < .7 ? { f: [a, b], op: '×' } : { f: [a * b, b], op: '÷' }; }
      if (level === 2) { const a = nz(-15, 15), b = nz(-12, 12); if (Math.random() < .5) return { f: [a, b], op: '×' }; const d = nz(-12, 12); return { f: [a * d, d], op: '÷' }; }
      const k = R(3, 5), f = Array.from({ length: k }, () => nz(-6, 6)); if (Math.random() < .4) { const d = nz(-4, 4); f[0] *= d; return { f, op: '×', div: d }; } return { f, op: '×' };
    }
    const val = p => { let v = p.op === '÷' ? p.f[0] / p.f[1] : p.f.reduce((x, y) => x * y, 1); if (p.div) v /= p.div; return v; };
    const show = p => p.op === '÷' ? `${par(p.f[0])} ÷ ${par(p.f[1])}` : p.f.map(par).join(' × ') + (p.div ? ` ÷ ${par(p.div)}` : '');
    const why = p => {
      const fs = p.op === '÷' ? p.f : p.f.concat(p.div ? [p.div] : []);
      const negs = fs.filter(x => x < 0).length, v = val(p);
      return `${negs} negative number${negs === 1 ? '' : 's'}: ${negs % 2 ? 'odd' : 'even'}, so the answer is ${negs % 2 ? 'negative' : 'positive'}. Size: ${Math.abs(v)}. Answer: ${fmt(v)}.`;
    };
    const q = el('p', { class: 'drill-q', 'aria-live': 'polite' }), inp = el('input', { type: 'text', autocomplete: 'off', 'aria-label': 'Your answer' }), fb = el('div', { class: 'fb', 'aria-live': 'polite' }), stat = el('p', { class: 'stat' });
    const lv = el('div', { class: 'mode small', role: 'group', 'aria-label': 'Drill level' });
    [[1, 'Two numbers'], [2, 'Bigger numbers'], [3, 'Chains']].forEach(([l, t]) => lv.append(el('button', { type: 'button', 'aria-pressed': String(l === level), onclick: () => { level = l; store.set('drill-level', l); lv.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i + 1 === l))); next(); } }, t)));
    function next() { cur = gen(); tries = 0; q.textContent = show(cur) + ' = ?'; inp.value = ''; fb.className = 'fb'; fb.textContent = ''; }
    function check() {
      const v = num(inp.value); if (isNaN(v)) return;
      if (v === val(cur)) { streak++; total++; store.set('drill-total', total); fb.className = 'fb ok'; fb.textContent = 'Right. ' + why(cur); setTimeout(next, reduce ? 300 : 1400); }
      else if (++tries < 2) { fb.className = 'fb no'; fb.textContent = Math.abs(v) === Math.abs(val(cur)) ? 'The size is right; check the sign. Count the negative numbers.' : 'Not yet. Find the sign first, then the size.'; }
      else { streak = 0; fb.className = 'fb shown'; fb.textContent = why(cur); }
      stat.textContent = `Streak: ${streak} · Solved on this device: ${total}`;
    }
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    box.append(lv, el('div', { class: 'drill' }, q, el('div', { class: 'row' }, inp, btn('Check', check, 'primary'), minusKey(inp), btn('Skip', next))), fb, stat);
    stat.textContent = `Solved on this device: ${total}`; next();
  }

  const KITS = { steps, quiz, drills, explain };
  function boot() {
    chrome();
    doc.querySelectorAll('figure.fig[data-fig]').forEach(f => { const fn = FIGS[f.dataset.fig]; const body = f.querySelector('.fig-body'); if (fn && body) { body.replaceChildren(); try { fn(body); } catch (e) { body.textContent = 'This figure could not load.'; console.error(e); } } });
    doc.querySelectorAll('[data-kit]').forEach(b => { const fn = KITS[b.dataset.kit]; if (fn) try { fn(b); } catch (e) { b.textContent = 'This exercise could not load.'; console.error(e); } });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
