const { h } = Lab;

function plotter(el, height = 360, bg = 'var(--card2)') {
  const c = h('canvas'); const box = h('div', { class: 'viz', style: { height: height + 'px' } }, c); el.append(box);
  const ctx = c.getContext('2d'); let W = 0, H = 0; let onResize = null;
  const fit = () => { const d = Math.min(2, devicePixelRatio || 1); W = box.clientWidth; H = box.clientHeight; c.width = W * d; c.height = H * d; c.style.width = W + 'px'; c.style.height = H + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0); onResize && onResize(); };
  const ro = new ResizeObserver(fit); ro.observe(box); fit();
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';
  const P = { c, ctx, box, get W() { return W; }, get H() { return H; }, css, stop: () => ro.disconnect(), set onResize(f) { onResize = f; },
    view: { x0: -6, x1: 6, y0: -4, y1: 4 },
    X(x) { return ((x - this.view.x0) / (this.view.x1 - this.view.x0)) * W; }, Y(y) { return H - ((y - this.view.y0) / (this.view.y1 - this.view.y0)) * H; },
    axes() { ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1; ctx.strokeStyle = css('--line'); ctx.fillStyle = css('--muted'); ctx.font = '11px Inter, sans-serif';
      const v = this.view; for (let x = Math.ceil(v.x0); x <= v.x1; x++) { ctx.beginPath(); ctx.moveTo(this.X(x), 0); ctx.lineTo(this.X(x), H); ctx.stroke(); }
      for (let y = Math.ceil(v.y0); y <= v.y1; y++) { ctx.beginPath(); ctx.moveTo(0, this.Y(y)); ctx.lineTo(W, this.Y(y)); ctx.stroke(); }
      ctx.strokeStyle = css('--muted'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(this.X(0), 0); ctx.lineTo(this.X(0), H); ctx.moveTo(0, this.Y(0)); ctx.lineTo(W, this.Y(0)); ctx.stroke();
      for (let x = Math.ceil(v.x0); x <= v.x1; x++) if (x) ctx.fillText(x, this.X(x) + 2, this.Y(0) + 12); for (let y = Math.ceil(v.y0); y <= v.y1; y++) if (y) ctx.fillText(y, this.X(0) + 4, this.Y(y) - 2); },
    fn(f, color, width = 2.5, dash) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false; for (let px = 0; px <= W; px += 1) { const x = this.view.x0 + (px / W) * (this.view.x1 - this.view.x0); const y = f(x); if (!isFinite(y) || Math.abs(y) > 1e4) { pen = false; continue; } const py = this.Y(y); pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; } ctx.stroke(); ctx.setLineDash([]); },
  };
  return P;
}
const slider = (label, min, max, step, val, on, fmt = (v) => v) => { const v = h('b', null, fmt(val)); const r = h('input', { type: 'range', min, max, step, value: val }); r.oninput = () => { v.textContent = fmt(+r.value); on(+r.value); }; const wrap = h('div', null, h('label', { class: 'ctl' }, label + ' ', v), r); wrap.set = (x) => { r.value = x; v.textContent = fmt(x); }; return wrap; };

// ---------- FUNCTIONS ----------
const FNS = { 'x²': (x) => x * x, 'x³': (x) => x * x * x, 'sin x': Math.sin, '|x|': Math.abs, '√x': (x) => (x < 0 ? NaN : Math.sqrt(x)), '2ˣ': (x) => Math.pow(2, x), 'ln x': (x) => (x <= 0 ? NaN : Math.log(x)), '1/x': (x) => 1 / x };
Lab.explorer('math', 'functions', {
  mount(el) {
    const s = { f: 'x²', a: 1, b: 1, hh: 0, k: 0 }; let target = null;
    const holder = h('div'); const eq = h('div', { class: 'kpi', style: { fontSize: '22px' } }); const msg = h('div');
    const fsel = h('div', { class: 'row' }, Object.keys(FNS).map((k) => h('button', { class: 'tab' + (k === s.f ? ' on' : ''), onclick: (e) => { s.f = k; [...fsel.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, k)));
    const sa = slider('a: stretch up/down (negative flips it)', -3, 3, 0.1, 1, (v) => { s.a = v; draw(); }), sb = slider('b: squeeze left/right', -3, 3, 0.1, 1, (v) => { s.b = v; draw(); }), sh = slider('h: slide right', -5, 5, 0.1, 0, (v) => { s.hh = v; draw(); }), sk = slider('k: slide up', -4, 4, 0.1, 0, (v) => { s.k = v; draw(); });
    el.append(h('div', { class: 'grid g2' }, h('div', { class: 'card' }, fsel, h('div', { style: { height: '10px' } }), holder), h('div', { class: 'card' }, eq, sa, sb, sh, sk,
      h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary sm', onclick: newTarget }, '🎯 Match-the-curve challenge'), h('button', { class: 'btn sm', onclick: () => { [sa, sb, sh, sk].forEach((w, i) => w.set([1, 1, 0, 0][i])); Object.assign(s, { a: 1, b: 1, hh: 0, k: 0 }); draw(); } }, 'Reset')), msg)),
      h('div', { class: 'hint small' }, 'Every function family follows the same four moves: y = a·f(b(x − h)) + k. Learn them once and you can read any graph on the GED and beyond. The dashed curve is the plain parent function.'));
    const P = plotter(holder, 380); P.onResize = () => draw();
    const g = (x) => s.a * FNS[s.f](s.b * (x - s.hh)) + s.k;
    function newTarget() { const r = (a, b, st = 0.5) => Math.round((a + Math.random() * (b - a)) / st) * st; target = { a: r(-2.5, 2.5) || 1, b: r(0.5, 2), hh: r(-3, 3), k: r(-2, 2) }; msg.innerHTML = ''; msg.append(h('p', { class: 'small', style: { marginTop: '8px' } }, 'Move the sliders until your curve sits on the orange target.')); draw(); }
    function draw() {
      const sign = (v) => (v < 0 ? ' − ' + Math.abs(v).toFixed(1) : ' + ' + v.toFixed(1));
      eq.textContent = `y = ${s.a.toFixed(1)} · ${s.f.replace('x', `(${s.b.toFixed(1)}(x${sign(-s.hh)}))`)}${sign(s.k)}`;
      P.axes(); P.fn(FNS[s.f], P.css('--muted'), 1.5, [5, 5]);
      if (target) P.fn((x) => target.a * FNS[s.f](target.b * (x - target.hh)) + target.k, '#F97316', 6);
      P.fn(g, '#3B82F6', 3);
      if (target) { let err = 0, n = 0; for (let x = -5; x <= 5; x += 0.25) { const t = target.a * FNS[s.f](target.b * (x - target.hh)) + target.k, y = g(x); if (isFinite(t) && isFinite(y)) { err += Math.abs(t - y); n++; } } if (n && err / n < 0.12) { target = null; msg.innerHTML = ''; msg.append(h('div', { class: 'hint small', style: { marginTop: '8px' } }, '🎯 Matched! +10 XP. Try another.')); Lab.addXP(10, 'curve matched'); P.axes(); P.fn(g, '#3B82F6', 3); } }
    }
    draw();
    return () => P.stop();
  },
});

// ---------- CIRCLE → WAVES ----------
Lab.explorer('math', 'circle', {
  mount(el) {
    const s = { f1: 1, a1: 1, f2: 3, a2: 0, speed: 1 }; let t = 0, raf, last = performance.now(); const trail = [];
    const holder = h('div');
    el.append(h('div', { class: 'card' }, holder, h('div', { class: 'grid g4', style: { marginTop: '10px' } },
      slider('Wave 1 speed', 1, 5, 1, 1, (v) => { s.f1 = v; trail.length = 0; }), slider('Wave 1 size', 0, 1.5, 0.1, 1, (v) => { s.a1 = v; trail.length = 0; }),
      slider('Wave 2 speed', 1, 9, 1, 3, (v) => { s.f2 = v; trail.length = 0; }), slider('Wave 2 size', 0, 1.5, 0.05, 0, (v) => { s.a2 = v; trail.length = 0; })),
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => { s.a2 = 1 / 3; s.f2 = 3; trail.length = 0; } }, 'Make a square-ish wave (1 + ⅓ at 3×)'))),
      h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'Where sine comes from'), h('p', { class: 'small' }, 'A point going around a circle at steady speed. Its height over time traces the sine wave; its sideways position traces cosine. That is the whole definition: sin θ = height, cos θ = width, for a circle of radius 1.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Stack circles, build any wave'), h('p', { class: 'small' }, 'Add a second, faster circle on the tip of the first and the wave changes shape. Joseph Fourier showed in 1807 that enough spinning circles can draw almost any repeating signal. This is how audio compression, MRI scanners and your phone’s radio work.'), Lab.apply('when you see a complicated pattern (prices, sound, seasons), ask what simple cycles might be adding up underneath.'))));
    const cv = Lab.canvasBox(holder, 320); const { ctx } = cv;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt * s.speed;
      const [W, H] = cv.size(); ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H);
      const R = Math.min(H * 0.28, W * 0.12), cx = R * 1.6 + 10, cy = H / 2, sx = cx + R * 2.2;
      const a1 = t * s.f1, a2 = t * s.f2;
      const p1 = [cx + Math.cos(a1) * R * s.a1, cy - Math.sin(a1) * R * s.a1], p2 = [p1[0] + Math.cos(a2) * R * s.a2, p1[1] - Math.sin(a2) * R * s.a2];
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R * s.a1, 0, 7); ctx.stroke();
      if (s.a2) { ctx.beginPath(); ctx.arc(p1[0], p1[1], R * s.a2, 0, 7); ctx.stroke(); }
      ctx.strokeStyle = '#7DD3FC'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...p1); ctx.lineTo(...p2); ctx.stroke();
      ctx.fillStyle = '#F472B6'; ctx.beginPath(); ctx.arc(...p2, 5, 0, 7); ctx.fill();
      trail.unshift(p2[1]); if (trail.length > W) trail.pop();
      ctx.strokeStyle = 'rgba(244,114,182,.4)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(...p2); ctx.lineTo(sx, p2[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2.5; ctx.beginPath(); trail.forEach((y, i) => { const x = sx + i * 1.2; if (x < W) i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '12px Inter, sans-serif'; ctx.fillText(`angle ${((a1 * 180 / Math.PI) % 360).toFixed(0)}°   height = sin(angle) = ${Math.sin(a1).toFixed(2)}`, 12, 20);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});

// ---------- CALCULUS ----------
const CF = { 'x²': [(x) => x * x, (x) => 2 * x, (x) => x ** 3 / 3], 'sin x': [Math.sin, Math.cos, (x) => -Math.cos(x)], 'x³ − 3x': [(x) => x ** 3 - 3 * x, (x) => 3 * x * x - 3, (x) => x ** 4 / 4 - 1.5 * x * x], 'eˣ': [Math.exp, Math.exp, Math.exp] };
Lab.explorer('math', 'calculus', {
  mount(el) {
    const s = { f: 'x²', x: 1, n: 8, a: 0, b: 2, showD: true };
    const h1 = h('div'), h2 = h('div'); const o1 = h('div'), o2 = h('div');
    const fsel = h('div', { class: 'row' }, Object.keys(CF).map((k) => h('button', { class: 'tab' + (k === s.f ? ' on' : ''), onclick: (e) => { s.f = k; [...fsel.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, k)));
    el.append(h('div', { class: 'card' }, fsel),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'The derivative: slope at a point'), h1, slider('Move the point (x)', -3, 3, 0.05, 1, (v) => { s.x = v; draw(); }), o1,
          h('p', { class: 'small muted' }, 'The red line just touches the curve. Its slope is the derivative: how fast y changes as x changes, right there. The orange curve plots that slope for every x.')),
        h('div', { class: 'card' }, h('h3', null, 'The integral: area by rectangles'), h2, slider('Number of rectangles', 1, 80, 1, 8, (v) => { s.n = v; draw(); }), slider('From a =', -3, 3, 0.1, 0, (v) => { s.a = v; draw(); }), slider('To b =', -3, 3, 0.1, 2, (v) => { s.b = v; draw(); }), o2,
          h('p', { class: 'small muted' }, 'Add more, thinner rectangles and their total area closes in on the exact area. That limit is the integral.'))),
      h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'The big idea'), h('p', { class: 'small' }, 'Newton and Leibniz (1660s–1680s) discovered that these two are opposites: the slope of the area-so-far is the original curve. That is the Fundamental Theorem of Calculus, and it turned physics into something you could compute. Both claimed it first; the priority fight lasted decades.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Where you meet it'), h('p', { class: 'small' }, 'Speed is the derivative of position; distance is the integral of speed. In money: the derivative of your account is your income rate; the integral of income is your account.'), Lab.apply('track the rate of change, not just the level. A score going from 60% to 70% matters less than whether it’s still climbing.'))));
    const P1 = plotter(h1, 280), P2 = plotter(h2, 280); P1.onResize = P2.onResize = () => draw();
    function draw() {
      const [f, df, F] = CF[s.f]; const big = s.f === 'eˣ' ? { x0: -3, x1: 3, y0: -2, y1: 12 } : s.f === 'x³ − 3x' ? { x0: -3, x1: 3, y0: -6, y1: 6 } : { x0: -3.2, x1: 3.2, y0: -3, y1: 6 };
      P1.view = big; P2.view = big;
      P1.axes(); P1.fn(df, '#F97316', 2, [6, 4]); P1.fn(f, '#3B82F6', 3);
      const m = df(s.x), y0 = f(s.x); P1.fn((x) => y0 + m * (x - s.x), '#DC2626', 2);
      const c = P1.ctx; c.fillStyle = '#DC2626'; c.beginPath(); c.arc(P1.X(s.x), P1.Y(y0), 6, 0, 7); c.fill(); c.fillStyle = '#F97316'; c.beginPath(); c.arc(P1.X(s.x), P1.Y(m), 5, 0, 7); c.fill();
      o1.innerHTML = ''; o1.append(h('div', { class: 'row' }, h('div', null, h('div', { class: 'tiny muted' }, 'Slope at x = ' + s.x.toFixed(2)), h('div', { class: 'kpi' }, m.toFixed(3)))));
      P2.axes(); const a = Math.min(s.a, s.b), b = Math.max(s.a, s.b), w = (b - a) / s.n; let sum = 0; const c2 = P2.ctx;
      for (let i = 0; i < s.n; i++) { const xm = a + (i + 0.5) * w, y = f(xm); sum += y * w; c2.fillStyle = y >= 0 ? 'rgba(16,185,129,.35)' : 'rgba(220,38,38,.3)'; c2.strokeStyle = 'rgba(16,185,129,.9)'; const X0 = P2.X(a + i * w), X1 = P2.X(a + (i + 1) * w), Y0 = P2.Y(0), Y1 = P2.Y(y); c2.fillRect(X0, Math.min(Y0, Y1), X1 - X0, Math.abs(Y1 - Y0)); c2.strokeRect(X0, Math.min(Y0, Y1), X1 - X0, Math.abs(Y1 - Y0)); }
      P2.fn(f, '#3B82F6', 3);
      const exact = F(b) - F(a);
      o2.innerHTML = ''; o2.append(h('div', { class: 'row' }, h('div', null, h('div', { class: 'tiny muted' }, `${s.n} rectangles`), h('div', { class: 'kpi' }, sum.toFixed(4))), h('div', null, h('div', { class: 'tiny muted' }, 'Exact area'), h('div', { class: 'kpi' }, exact.toFixed(4))), h('div', null, h('div', { class: 'tiny muted' }, 'Error'), h('div', { class: 'kpi', style: { color: Math.abs(sum - exact) < 0.01 ? 'var(--good)' : 'inherit' } }, Math.abs(sum - exact).toFixed(4)))));
      Lab.setContext(`Calculus explorer with f(x) = ${s.f}; slope at x=${s.x.toFixed(2)} is ${m.toFixed(3)}; area from ${a.toFixed(1)} to ${b.toFixed(1)} ≈ ${sum.toFixed(3)} (exact ${exact.toFixed(3)}).`);
    }
    draw();
    return () => { P1.stop(); P2.stop(); };
  },
});

// ---------- PROBABILITY ----------
Lab.explorer('math', 'probability', {
  mount(el) {
    const ROWS = 12; let balls = [], bins = new Array(ROWS + 1).fill(0), raf, dropping = 0, total = 0;
    const holder = h('div');
    const mh = h('div');
    el.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h3', null, 'The Galton board'), holder, h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary sm', onclick: () => (dropping += 200) }, 'Drop 200 balls'), h('button', { class: 'btn sm', onclick: () => { bins.fill(0); balls = []; total = 0; } }, 'Reset')),
        h('p', { class: 'small', style: { marginTop: '8px' } }, 'Each ball bounces left or right at random 12 times. No single ball is predictable, but together they build a bell curve, the normal distribution. The white line is what probability theory predicts.')),
      h('div', { class: 'card' }, h('h3', null, 'The Monty Hall game'), mh)),
      h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'Why it matters'), h('p', { class: 'small' }, 'Heights, measurement errors and test scores often look like bell curves because they are sums of many small random pushes. But not everything is: wealth, city sizes, earthquakes and market crashes have “fat tails,” where extreme events are far more common than a bell curve predicts.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Use it'), Lab.apply('one result (one test score, one trade, one news story) tells you little. Judge by the pattern across many tries, and be suspicious of anyone who models fat-tailed risks with a bell curve.'))));
    const cv = Lab.canvasBox(holder, 380); const { ctx } = cv;
    const comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
    function frame() {
      const [W, H] = cv.size(); ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H);
      const top = 20, pegH = H * 0.5, gap = W / (ROWS + 2), binTop = top + pegH + 10;
      for (let r = 0; r < ROWS; r++) for (let k = 0; k <= r; k++) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(W / 2 + (k - r / 2) * gap, top + (r + 1) * (pegH / (ROWS + 1)), 2.5, 0, 7); ctx.fill(); }
      if (dropping > 0 && balls.length < 60) { balls.push({ r: 0, k: 0, p: 0 }); dropping--; }
      for (const b of balls) { b.p += 0.25; if (b.p >= 1) { b.p = 0; b.r++; if (b.r <= ROWS) b.k += Math.random() < 0.5 ? 0 : 1; } }
      for (const b of balls.filter((b) => b.r > ROWS)) { bins[b.k]++; total++; if (total === 1000) Lab.markDone('galton:1000', 15, '1,000 balls'); }
      balls = balls.filter((b) => b.r <= ROWS);
      for (const b of balls) { const x = W / 2 + (b.k - b.r / 2) * gap + (b.r < ROWS ? 0 : 0), y = top + (b.r + b.p) * (pegH / (ROWS + 1)); ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
      const maxB = Math.max(1, ...bins), bh = H - binTop - 10;
      bins.forEach((n, k) => { const x = W / 2 + (k - ROWS / 2) * gap; const hh = (n / maxB) * bh; ctx.fillStyle = '#60A5FA'; ctx.fillRect(x - gap * 0.4, H - 10 - hh, gap * 0.8, hh); });
      if (total > 20) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= ROWS; k++) { const ex = total * comb(ROWS, k) / 2 ** ROWS; const x = W / 2 + (k - ROWS / 2) * gap, y = H - 10 - (ex / maxB) * bh; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '12px Inter, sans-serif'; ctx.fillText(`${total} balls`, 10, 16);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    // Monty Hall
    let stats = { stay: [0, 0], sw: [0, 0] }, game;
    function newGame() { game = { car: Math.floor(Math.random() * 3), pick: null, open: null, done: false }; drawMH(); }
    function drawMH() {
      mh.innerHTML = '';
      const doors = h('div', { class: 'row', style: { justifyContent: 'center', gap: '12px', margin: '8px 0' } }, [0, 1, 2].map((i) => {
        const open = game.open === i || game.done; const isCar = i === game.car;
        return h('button', { style: { width: '84px', height: '110px', borderRadius: '12px', border: game.pick === i ? '3px solid #F97316' : '2px solid var(--line)', background: open ? (isCar ? 'rgba(234,179,8,.45)' : 'var(--card2)') : 'linear-gradient(#8B5CF6,#6D28D9)', color: open ? 'var(--ink)' : '#fff', fontSize: open ? '34px' : '22px', fontWeight: 700, cursor: 'pointer' },
          onclick: () => { if (game.done) return; if (game.pick === null) { game.pick = i; const opts = [0, 1, 2].filter((d) => d !== i && d !== game.car); game.open = opts[Math.floor(Math.random() * opts.length)]; drawMH(); } else if (i !== game.open) { const switched = i !== game.pick; game.pick = i; game.done = true; const win = i === game.car; const key = switched ? 'sw' : 'stay'; stats[key][1]++; if (win) stats[key][0]++; drawMH(); } } },
          open ? (isCar ? '🚗' : '🐐') : 'Door ' + (i + 1));
      }));
      const prompt = game.pick === null ? 'Pick a door. One hides a car, two hide goats.' : !game.done ? `The host, who knows where the car is, opens door ${game.open + 1}: a goat. Stay with door ${game.pick + 1}, or switch? Tap your final choice.` : game.pick === game.car ? '🎉 You won the car!' : 'Goat. 🐐';
      const pct = (a) => (a[1] ? Math.round((a[0] / a[1]) * 100) + '% of ' + a[1] : '—');
      mh.append(h('p', { class: 'small' }, prompt), doors, h('div', { class: 'row' }, game.done ? h('button', { class: 'btn sm primary', onclick: newGame }, 'Play again') : null, h('button', { class: 'btn sm', onclick: () => { for (let i = 0; i < 1000; i++) { const car = Math.floor(Math.random() * 3), pick = Math.floor(Math.random() * 3); stats.stay[1]++; stats.sw[1]++; if (pick === car) stats.stay[0]++; else stats.sw[0]++; } drawMH(); Lab.markDone('monty:sim', 10, 'Monty Hall simulated'); } }, 'Simulate 1,000 games')),
        h('table', { class: 't small', style: { marginTop: '8px' } }, h('tr', null, h('td', null, 'Win rate when staying'), h('td', null, h('b', null, pct(stats.stay)))), h('tr', null, h('td', null, 'Win rate when switching'), h('td', null, h('b', null, pct(stats.sw))))),
        h('details', { class: 'small' }, h('summary', { style: { cursor: 'pointer' } }, 'Why switching wins 2/3 of the time'), h('p', null, 'Your first pick is right 1/3 of the time. The other 2/3 of the time the car is behind one of the other two doors, and the host, who must open a goat door, has just shown you which one. Switching wins exactly when your first pick was wrong. When Marilyn vos Savant explained this in 1990, thousands of readers wrote in to say she was wrong, including many with PhDs.')));
    }
    newGame();
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});

// ---------- RISK & RUIN ----------
Lab.explorer('math', 'risk', {
  mount(el) {
    const s = { p: 0.45, R: 1.5, f: 2, n: 200, paths: 200 };
    const holder = h('div'); const stats = h('div', { class: 'grid g4' }); const note = h('div');
    el.append(h('div', { class: 'card' },
      h('p', { class: 'small' }, 'Any repeated bet works the same way: trading, poker, a business making many small decisions. You win a fraction p of the time; wins pay R times what losses cost; you risk f% of your current bankroll each time. This runs 200 possible futures at once.'),
      h('div', { class: 'grid g4' }, slider('Win rate p', 0.2, 0.8, 0.01, s.p, (v) => { s.p = v; run(); }, (v) => Math.round(v * 100) + '%'), slider('Win size R (× loss)', 0.5, 4, 0.1, s.R, (v) => { s.R = v; run(); }, (v) => v.toFixed(1) + '×'), slider('Risk per bet f', 0.25, 30, 0.25, s.f, (v) => { s.f = v; run(); }, (v) => v + '%'), slider('Number of bets', 20, 1000, 10, s.n, (v) => { s.n = v; run(); })),
      h('div', { style: { height: '10px' } }), holder, h('div', { style: { height: '10px' } }), stats, note),
      h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'The Kelly criterion'), h('p', { class: 'small' }, 'In 1956 John Kelly, a Bell Labs scientist, worked out the bet size that grows a bankroll fastest over the long run: f* = p − (1 − p) / R. Bet more than that and growth slows; bet about twice that and typical growth falls to roughly zero, even with a real edge. The ruin and drawdown numbers here show why.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'The honest catch'), h('p', { class: 'small' }, 'Kelly assumes you know your true win rate and payoff. You never do: they are estimated from a limited sample and they change. Overestimating your edge is the usual way people blow up, which is why most professionals bet a fraction of Kelly (often a quarter to a half).'), Lab.apply('size every risk so that a long losing streak, which will happen, can’t knock you out. Survival comes first; growth compounds only if you are still in the game.'))));
    const cv = Lab.canvasBox(holder, 320); const { ctx } = cv;
    function run() {
      const { p, R, f, n, paths } = s, fr = f / 100; const all = []; let dd50 = 0, below10 = 0;
      for (let k = 0; k < paths; k++) { let eq = 1, peak = 1, maxdd = 0; const path = [1]; for (let i = 0; i < n; i++) { eq *= Math.random() < p ? 1 + fr * R : 1 - fr; peak = Math.max(peak, eq); maxdd = Math.max(maxdd, 1 - eq / peak); path.push(eq); } if (maxdd >= 0.5) dd50++; if (eq < 0.1) below10++; all.push(path); }
      const finals = all.map((a) => a[a.length - 1]).sort((a, b) => a - b); const med = finals[Math.floor(paths / 2)];
      const kelly = p - (1 - p) / R; const edge = p * R - (1 - p);
      const [W, H] = cv.size(); ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H);
      const lo = Math.log10(Math.max(1e-3, Math.min(0.05, finals[0]))), hi = Math.log10(Math.max(2, finals[paths - 1] * 1.2));
      const X = (i) => 40 + (i / n) * (W - 50), Y = (v) => H - 20 - ((Math.log10(Math.max(1e-3, v)) - lo) / (hi - lo)) * (H - 40);
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.font = '11px Inter, sans-serif';
      for (let e = Math.ceil(lo); e <= hi; e++) { ctx.beginPath(); ctx.moveTo(40, Y(10 ** e)); ctx.lineTo(W - 10, Y(10 ** e)); ctx.stroke(); ctx.fillText('×' + (10 ** e >= 1 ? 10 ** e : (10 ** e).toString()), 4, Y(10 ** e) + 4); }
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(40, Y(1)); ctx.lineTo(W - 10, Y(1)); ctx.stroke(); ctx.setLineDash([]);
      all.forEach((a, k) => { const fin = a[a.length - 1]; ctx.strokeStyle = fin >= 1 ? 'rgba(52,211,153,.22)' : 'rgba(248,113,113,.22)'; ctx.lineWidth = 1; ctx.beginPath(); a.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke(); });
      const medPath = all.find((a) => a[a.length - 1] === med); ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.5; ctx.beginPath(); medPath.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke();
      ctx.fillStyle = '#FBBF24'; ctx.fillText('median future', W - 100, Y(med) - 6);
      stats.innerHTML = '';
      const k = (label, v, col) => h('div', null, h('div', { class: 'tiny muted' }, label), h('div', { class: 'kpi', style: { color: col || 'inherit', fontSize: '22px' } }, v));
      stats.append(k('Edge per bet', (edge >= 0 ? '+' : '') + edge.toFixed(2) + ' units', edge > 0 ? 'var(--good)' : 'var(--bad)'), k('Kelly bet size', kelly > 0 ? (kelly * 100).toFixed(1) + '%' : 'don’t bet'), k('Median result', '×' + (med < 10 ? med.toFixed(2) : Lab.fmt(med))), k('Futures with a 50%+ drop', Math.round((dd50 / paths) * 100) + '%', dd50 / paths > 0.1 ? 'var(--bad)' : null));
      note.innerHTML = '';
      note.append(h('div', { class: 'hint small', style: { marginTop: '10px' } }, edge <= 0 ? 'No edge: the expected value of each bet is zero or negative. No bet size fixes that; the only winning move is not to play.' : s.f / 100 > kelly * 2 ? `You are betting more than twice Kelly (${(kelly * 100).toFixed(1)}%). Even with a real edge, most futures do worse than at a smaller size. Try halving it.` : s.f / 100 > kelly ? 'Above Kelly: more risk for less growth. Over-betting is the classic way skilled players go broke.' : `At or below Kelly. ${below10 ? below10 + ' of 200 futures still lost 90%+, a reminder that bad luck happens.' : 'Steadier growth.'}`));
      if (edge > 0 && s.f / 100 > kelly * 2) Lab.markDone('risk:overbet', 10, 'found over-betting');
      Lab.setContext(`Risk & ruin simulator: win rate ${s.p}, payoff ${s.R}, risk ${s.f}% per bet, ${s.n} bets. Kelly ${(kelly * 100).toFixed(1)}%. Median outcome ×${med.toFixed(2)}; ${Math.round(dd50 / paths * 100)}% of paths had a 50%+ drawdown.`);
    }
    const rr = new ResizeObserver(() => run()); rr.observe(cv.box);
    return () => { rr.disconnect(); cv.stop(); };
  },
});
