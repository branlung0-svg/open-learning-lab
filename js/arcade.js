/* Lab Arcade: a registry of small hands-on labs, each tagged with the disciplines it belongs to.
   Labs live in arcade-*.js files and call Lab.ARC.add({ id, d: [disciplines], e, t, b, how, use, m(el, K) }). */
(function () {
  const h = Lab.h;
  const ARC = (Lab.ARC = { labs: [], by: {} });
  ARC.add = (...defs) => defs.forEach((d) => { if (ARC.by[d.id]) console.warn('dup lab', d.id); ARC.labs.push(d); ARC.by[d.id] = d; });
  ARC.forDisc = (id) => ARC.labs.filter((l) => l.d.includes(id));

  // ---------- kit passed to every lab: helpers that clean up after themselves ----------
  function kit() {
    const stops = [];
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';
    const K = {
      h, css, stops,
      stop() { stops.splice(0).forEach((f) => { try { f(); } catch (e) {} }); },
      raf(fn) { let id, t0 = performance.now(), alive = true; const step = (t) => { if (!alive) return; fn((t - t0) / 1000); id = requestAnimationFrame(step); }; id = requestAnimationFrame(step); const s = () => { alive = false; cancelAnimationFrame(id); }; stops.push(s); return s; },
      every(ms, fn) { const id = setInterval(fn, ms); const s = () => clearInterval(id); stops.push(s); return s; },
      canvas(el, height = 340) {
        const c = h('canvas', { style: { touchAction: 'none' } }); const box = h('div', { class: 'viz', style: { height: height + 'px' } }, c); el.append(box);
        const ctx = c.getContext('2d'); const P = { c, ctx, box, W: 0, H: 0, onResize: null };
        const fit = () => { const d = Math.min(2, devicePixelRatio || 1); P.W = box.clientWidth; P.H = box.clientHeight; c.width = P.W * d; c.height = P.H * d; c.style.width = P.W + 'px'; c.style.height = P.H + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0); P.onResize && P.onResize(); };
        const ro = new ResizeObserver(fit); ro.observe(box); fit(); stops.push(() => ro.disconnect());
        P.clear = () => ctx.clearRect(0, 0, P.W, P.H);
        P.pt = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        P.text = (t, x, y, o = {}) => { ctx.fillStyle = o.c || css('--ink'); ctx.font = `${o.w || 500} ${o.s || 12}px Inter, sans-serif`; ctx.textAlign = o.a || 'left'; ctx.textBaseline = o.bl || 'alphabetic'; ctx.fillText(t, x, y); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; };
        P.line = (pts, color, w = 2, dash) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]); };
        P.dot = (x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
        P.rect = (x, y, w, hh, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, hh); };
        // chart helper: maps data ranges into the canvas with padding and draws axes
        P.chart = (x0, x1, y0, y1, o = {}) => { const pl = o.pl ?? 40, pb = o.pb ?? 26, pt = o.pt ?? 12, pr = o.pr ?? 12;
          const X = (x) => pl + ((x - x0) / (x1 - x0)) * (P.W - pl - pr), Y = (y) => P.H - pb - ((y - y0) / (y1 - y0)) * (P.H - pb - pt);
          ctx.strokeStyle = css('--line'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pl, pt); ctx.lineTo(pl, P.H - pb); ctx.lineTo(P.W - pr, P.H - pb); ctx.stroke();
          const tk = (a, b, n = 5) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
          ctx.fillStyle = css('--muted'); ctx.font = '11px Inter, sans-serif';
          if (!o.noX) tk(x0, x1, o.nx || 5).forEach((v) => { ctx.textAlign = 'center'; ctx.fillText(o.fx ? o.fx(v) : +v.toFixed(2), X(v), P.H - pb + 15); });
          if (!o.noY) tk(y0, y1, o.ny || 4).forEach((v) => { ctx.textAlign = 'right'; ctx.fillText(o.fy ? o.fy(v) : +v.toFixed(2), pl - 5, Y(v) + 4); });
          ctx.textAlign = 'left'; if (o.xl) P.text(o.xl, P.W - pr, P.H - 4, { a: 'right', c: css('--muted'), s: 11 }); if (o.yl) P.text(o.yl, pl + 4, pt + 10, { c: css('--muted'), s: 11 });
          return { X, Y }; };
        return P;
      },
      slider(label, min, max, step, val, on, fmt = (v) => v) { const v = h('b', null, fmt(val)); const r = h('input', { type: 'range', min, max, step, value: val }); r.oninput = () => { v.textContent = fmt(+r.value); on(+r.value); }; const w = h('div', null, h('label', { class: 'ctl' }, label + ' ', v), r); w.set = (x) => { r.value = x; v.textContent = fmt(x); }; w.get = () => +r.value; return w; },
      btn(label, on, primary) { return h('button', { class: 'btn sm' + (primary ? ' primary' : ''), onclick: on }, label); },
      choice(opts, val, on) { const box = h('div', { class: 'row', style: { gap: '6px' } }); const draw = () => { box.innerHTML = ''; opts.forEach((o) => { const [k, l] = Array.isArray(o) ? o : [o, o]; box.append(h('button', { class: 'tab' + (k === val ? ' on' : ''), style: { padding: '6px 12px', fontSize: '13px' }, onclick: () => { val = k; draw(); on(k); } }, l)); }); }; draw(); box.set = (k) => { val = k; draw(); }; return box; },
      out(cls = 'small') { return h('div', { class: cls, style: { marginTop: '8px' } }); },
      kpis(pairs) { return h('div', { class: 'grid g4' }, pairs.map(([l, el]) => h('div', null, h('div', { class: 'tiny muted' }, l), el))); },
      big(t = '') { return h('div', { class: 'kpi' }, t); },
      two(a, b) { return h('div', { class: 'grid g2', style: { alignItems: 'start' } }, a, b); },
      quiz(items, el) { // items: [question, [options], correctIndex, explanation]
        let i = 0, score = 0; const box = h('div'); el.append(box);
        const draw = () => { box.innerHTML = ''; if (i >= items.length) { box.append(h('div', { class: 'kpi' }, `${score} / ${items.length}`), h('button', { class: 'btn sm', onclick: () => { i = 0; score = 0; draw(); } }, 'Again')); return; }
          const [q, opts, c, ex] = items[i]; const fb = h('div', { class: 'small', style: { marginTop: '8px' } });
          box.append(h('div', { class: 'tiny muted' }, `${i + 1} of ${items.length}`), h('p', { style: { fontWeight: 600 } }, q), h('div', { class: 'stack' }, opts.map((o, k) => h('button', { class: 'btn', style: { width: '100%', textAlign: 'left' }, onclick: (e) => { if (fb.textContent) return; const ok = k === c; if (ok) score++; e.target.style.borderColor = ok ? '#16A34A' : '#DC2626'; fb.append(h('b', null, ok ? '✓ Right. ' : '✗ Not quite. '), ex || '', h('div', null, h('button', { class: 'btn sm primary', style: { marginTop: '6px' }, onclick: () => { i++; draw(); } }, 'Next →'))); } }, o))), fb); };
        draw(); return box; },
      rnd: (a, b) => a + Math.random() * (b - a), ri: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
      pick: (a) => a[Math.floor(Math.random() * a.length)],
      gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
      fmt: Lab.fmt,
      pal: ['#2563EB', '#DC2626', '#16A34A', '#CA8A04', '#9333EA', '#0891B2', '#EA580C', '#DB2777'],
    };
    return K;
  }
  ARC.kit = kit;

  const discTag = (id, small) => { const D = Lab.disc(id); return D ? h('a', { href: '#d-' + id, class: 'tag', style: { '--c': D.c, textDecoration: 'none', fontSize: small ? '11px' : null } }, D.e + ' ' + D.name) : null; };
  const played = (id) => !!(Lab.state.done || {})['play:' + id];

  // ---------- one lab ----------
  function labPage(app, L) {
    const K = kit();
    const D = Lab.disc(L.d[0]);
    document.documentElement.style.setProperty('--accent', (D && D.c) || '#3B82F6');
    Lab.setContext(`Hands-on lab: ${L.t} (${L.d.map((x) => (Lab.disc(x) || {}).name).join(', ')})`);
    const sib = ARC.forDisc(L.d[0]); const k = sib.indexOf(L);
    const prev = sib[(k - 1 + sib.length) % sib.length], next = sib[(k + 1) % sib.length];
    const stage = h('div', { class: 'card' });
    app.append(
      h('section', { class: 'hero', style: { padding: '18px 20px' } }, h('a', { class: 'crumb', href: '#play-x-' + L.d[0] }, '← ' + (D ? D.name : '') + ' labs'), h('span', { class: 'crumb', style: { marginLeft: '12px' } }, h('a', { href: '#play', style: { color: 'inherit' } }, 'All labs')),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('span', { style: { fontSize: '38px' } }, L.e), h('div', null, h('h1', { style: { margin: 0, fontSize: '26px' } }, L.t), h('p', { style: { margin: '4px 0 0' } }, L.b)))),
      h('div', { class: 'row', style: { gap: '6px', marginBottom: '10px' } }, L.d.map((x) => discTag(x))),
      stage,
      h('div', { class: 'grid g2', style: { marginTop: '12px', alignItems: 'start' } },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '⚙️ How it works'), h('p', { class: 'small' }, L.how)),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🌍 Where it’s used'), h('p', { class: 'small' }, L.use),
          L.d.length > 1 ? h('p', { class: 'tiny muted' }, 'This lab connects ' + L.d.map((x) => (Lab.disc(x) || {}).name).join(' · ')) : null)),
      h('div', { class: 'row', style: { marginTop: '12px' } },
        h('a', { class: 'btn sm', href: '#play-' + prev.id, style: { textDecoration: 'none' } }, '← ' + prev.e + ' ' + prev.t),
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`I just used the "${L.t}" lab. Explain the idea behind it more deeply, how it was discovered, and 3 real-world uses across different fields. Then give me one challenge to try in the lab.`, L.t) }, '✦ Go deeper'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 4 questions on the idea behind the "${L.t}" lab (${L.b}). Explain each answer.`, L.t) }, '✦ Quiz me'),
        h('span', { style: { flex: 1 } }),
        h('a', { class: 'btn sm', href: '#play-' + next.id, style: { textDecoration: 'none' } }, next.e + ' ' + next.t + ' →')));
    try { L.m(stage, K); } catch (e) { stage.append(h('p', null, 'This lab hit an error: ' + e.message)); console.error(e); }
    Lab.markDone('play:' + L.id, 15, 'hands-on lab');
    return () => K.stop();
  }

  // ---------- connections map: disciplines linked by shared labs ----------
  function connections(onPick, sel) {
    const NS = 'http://www.w3.org/2000/svg'; const s = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const ds = Lab.DISC; const W = 780, C = W / 2, R = 240; const pos = {};
    ds.forEach((d, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / ds.length; pos[d.id] = [C + R * Math.cos(a), C + R * Math.sin(a), a]; });
    const pair = {}; ARC.labs.forEach((l) => { for (let i = 0; i < l.d.length; i++) for (let j = i + 1; j < l.d.length; j++) { const k = [l.d[i], l.d[j]].sort().join('|'); pair[k] = (pair[k] || 0) + 1; } });
    const svg = s('svg', { viewBox: `0 0 ${W} ${W}`, width: '100%', style: 'max-width:680px;display:block;margin:auto' });
    Object.entries(pair).forEach(([k, n]) => { const [a, b] = k.split('|'); if (!pos[a] || !pos[b]) return; const on = sel && (a === sel || b === sel);
      const p = s('path', { d: `M${pos[a][0]},${pos[a][1]} Q${C},${C} ${pos[b][0]},${pos[b][1]}`, fill: 'none', stroke: on ? (Lab.disc(sel).c) : '#94A3B8', 'stroke-opacity': sel ? (on ? 0.85 : 0.07) : 0.25, 'stroke-width': Math.min(6, 0.8 + n * 0.8) }); svg.append(p); });
    ds.forEach((d) => { const [x, y, a] = pos[d.id]; const n = ARC.forDisc(d.id).length; const g = s('g', { style: 'cursor:pointer' });
      g.append(s('circle', { cx: x, cy: y, r: 7 + Math.min(10, n / 3), fill: d.c, opacity: !sel || sel === d.id ? 1 : 0.45 }));
      const lx = C + (R + 24) * Math.cos(a), ly = C + (R + 24) * Math.sin(a); const t = s('text', { x: lx, y: ly + 4, 'font-size': 11.5, 'text-anchor': Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle', fill: 'currentColor', 'font-weight': sel === d.id ? 700 : 500 }); t.textContent = d.e + ' ' + d.name.split(' & ')[0].split(' (')[0]; g.append(t);
      g.addEventListener('click', () => onPick(d.id)); svg.append(g); });
    return svg;
  }

  // ---------- gallery ----------
  function gallery(app, filter) {
    document.documentElement.style.setProperty('--accent', filter && Lab.disc(filter) ? Lab.disc(filter).c : '#3B82F6');
    Lab.setContext('Hands-on lab arcade');
    let sel = filter && Lab.disc(filter) ? filter : null, q = '';
    const chips = h('div', { class: 'row', style: { gap: '6px' } }); const grid = h('div', { class: 'grid g3' }); const mapBox = h('div'); const count = h('span', { class: 'small muted' });
    const search = h('input', { type: 'text', placeholder: 'Search labs…', style: { minWidth: '220px' }, oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } });
    function draw() {
      chips.innerHTML = ''; chips.append(h('span', { class: 'chip' + (!sel ? ' on' : ''), style: { '--c': '#475569' }, onclick: () => { sel = null; draw(); } }, 'All ' + ARC.labs.length));
      Lab.DISC.forEach((d) => { const n = ARC.forDisc(d.id).length; chips.append(h('span', { class: 'chip' + (sel === d.id ? ' on' : ''), style: { '--c': d.c }, onclick: () => { sel = sel === d.id ? null : d.id; draw(); } }, d.e + ' ' + d.name.split(' & ')[0] + ' ' + n)); });
      mapBox.innerHTML = ''; mapBox.append(connections((id) => { sel = sel === id ? null : id; draw(); }, sel));
      const list = ARC.labs.filter((l) => (!sel || l.d.includes(sel)) && (!q || (l.t + ' ' + l.b + ' ' + l.d.join(' ')).toLowerCase().includes(q)));
      const done = list.filter((l) => played(l.id)).length; count.textContent = `${list.length} labs · ${done} played`;
      grid.innerHTML = ''; list.forEach((l) => grid.append(h('a', { href: '#play-' + l.id, class: 'card', style: { textDecoration: 'none', color: 'inherit', boxShadow: 'none', display: 'block', position: 'relative' } },
        played(l.id) ? h('span', { style: { position: 'absolute', right: '12px', top: '10px', color: '#16A34A', fontWeight: 700 } }, '✓') : null,
        h('div', { style: { fontSize: '28px' } }, l.e), h('b', null, l.t), h('p', { class: 'tiny muted', style: { margin: '4px 0 8px' } }, l.b),
        h('div', { class: 'row', style: { gap: '4px' } }, l.d.map((x) => { const D = Lab.disc(x); return D ? h('span', { title: D.name, style: { width: '10px', height: '10px', borderRadius: '5px', background: D.c, display: 'inline-block' } }) : null; })))));
    }
    app.append(
      h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '🕹️'), h('h1', null, 'Hands-on labs'),
        h('p', null, 'Small experiments you can play with, for every discipline. Each one shows how the idea works and where else it is used. Lines on the map connect disciplines that share labs: the same idea at work in different fields.')),
      h('div', { class: 'card' }, h('div', { class: 'row' }, search, count), h('div', { style: { height: '10px' } }), chips),
      h('details', { class: 'card', open: true }, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'How the disciplines connect (click one)'), mapBox),
      grid);
    draw();
  }

  Lab.routes.play = function (app, [id, f]) {
    if (id && id !== 'x' && ARC.by[id]) return labPage(app, ARC.by[id]);
    return gallery(app, id === 'x' ? f : null);
  };
})();
