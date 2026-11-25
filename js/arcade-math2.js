/* Lab Arcade: more mathematics labs for the Math path (#path-math), from fractions to the research frontier.
   Several are genuine experiments: counting primes, finding zeta zeros, checking a case of modularity. */
(function () {
  const A = Lab.ARC.add, h = Lab.h;
  const fmt = (n, d = 4) => (Math.abs(n) >= 1e5 ? Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : String(+(+n).toFixed(d)));
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

  A({ id: 'fracbars', d: ['math'], e: '🍫', t: 'Fraction bars', b: 'Cut two bars into equal pieces, line them up on a common denominator, and add or compare them.',
    how: 'To add fractions the pieces must be the same size. Cut both bars into pieces of the least common denominator; then you are adding like pieces. Multiplying top and bottom by the same number never changes the amount, only how finely it is cut.',
    use: 'Recipes, measurements in inches (⅜ + ¾), music rhythms (quarter and eighth notes), sharing costs, and probabilities.',
    m(el, K) {
      let a = 2, b = 3, c = 1, d = 4; const P = K.canvas(el, 250); const out = K.out();
      const bar = (y, n, k, color, label) => { const x0 = 70, w = P.W - 90, hh = 34; P.text(label, 8, y + 22, { s: 13, w: 700 }); for (let i = 0; i < n; i++) { const x = x0 + (w * i) / n; P.ctx.fillStyle = i < k ? color : K.css('--card2'); P.ctx.fillRect(x + 1, y, w / n - 2, hh); } P.ctx.strokeStyle = K.css('--ink'); P.ctx.strokeRect(x0, y, w, hh); };
      const draw = () => { P.clear(); if (a >= b) a = b - 1; if (c >= d) c = d - 1; const L = (b * d) / gcd(b, d); const A2 = a * (L / b), C2 = c * (L / d);
        bar(14, b, a, '#2563EB', `${a}/${b}`); bar(64, d, c, '#DC2626', `${c}/${d}`); bar(124, L, A2, '#2563EB', `${A2}/${L}`); bar(174, L, C2, '#DC2626', `${C2}/${L}`);
        P.text('Same amounts, cut into ' + L + 'ths:', 70, 116, { s: 12, c: K.css('--muted') });
        const s = A2 + C2, g = gcd(s, L); out.innerHTML = `${a}/${b} + ${c}/${d} = ${A2}/${L} + ${C2}/${L} = <b>${s}/${L}</b>${g > 1 ? ` = <b>${s / g}/${L / g}</b>` : ''} = ${(s / L).toFixed(4)} · ${a}/${b} is ${A2 > C2 ? 'bigger' : A2 < C2 ? 'smaller' : 'the same'} than ${c}/${d}`; };
      P.onResize = draw; el.append(K.two(h('div', null, K.slider('Blue: top', 1, 11, 1, a, (v) => { a = v; draw(); }), K.slider('Blue: bottom', 2, 12, 1, b, (v) => { b = v; draw(); })), h('div', null, K.slider('Red: top', 1, 11, 1, c, (v) => { c = v; draw(); }), K.slider('Red: bottom', 2, 12, 1, d, (v) => { d = v; draw(); }))), out); draw();
    } });

  A({ id: 'numline', d: ['math'], e: '↔️', t: 'Walking the number line', b: 'Add, subtract and multiply negative numbers as moves on a line, and see why minus times minus is plus.',
    how: 'Adding a negative moves left. Subtracting a negative undoes a move left, so it moves right. Multiplying by −1 reflects the whole line through zero; doing it twice brings you back, which is why (−1)(−1) = 1.',
    use: 'Bank balances and debts, temperatures, altitudes above and below sea level, and the scores in golf.',
    m(el, K) {
      let a = 3, b = -5, op = '+'; const P = K.canvas(el, 170); const out = K.out();
      const draw = () => { P.clear(); const X = (v) => 20 + ((v + 30) / 60) * (P.W - 40); const y = 95; P.line([[X(-30), y], [X(30), y]], K.css('--ink'), 1.5);
        for (let v = -30; v <= 30; v += 5) { P.line([[X(v), y - 6], [X(v), y + 6]], K.css('--ink'), 1); P.text(String(v), X(v), y + 22, { a: 'center', s: 11, c: K.css('--muted') }); }
        const r = op === '+' ? a + b : op === '−' ? a - b : a * b; const arrow = (x0, x1, yy, color) => { P.line([[X(x0), yy], [X(x1), yy]], color, 3); const dir = Math.sign(x1 - x0) || 1; P.line([[X(x1) - 8 * dir, yy - 6], [X(x1), yy], [X(x1) - 8 * dir, yy + 6]], color, 3); };
        arrow(0, a, 60, '#2563EB'); if (op === '×') { if (b < 0) P.text('× negative: reflect through 0, then stretch', P.W / 2, 30, { a: 'center', s: 12 }); arrow(0, r, 40, '#16A34A'); } else arrow(a, r, 40, '#DC2626');
        P.dot(X(r), y, 6, '#16A34A'); out.innerHTML = `${a} ${op} ${b < 0 ? `(${b})` : b} = <b>${r}</b>` + (op === '−' && b < 0 ? ' · subtracting a negative is adding the opposite' : op === '+' && b < 0 ? ' · adding a negative moves left' : op === '×' && a < 0 && b < 0 ? ' · two reflections cancel: positive' : ''); };
      P.onResize = draw; el.append(K.slider('First number', -15, 15, 1, a, (v) => { a = v; draw(); }), K.slider('Second number', -15, 15, 1, b, (v) => { b = v; draw(); }), K.choice(['+', '−', '×'], op, (v) => { op = v; draw(); }), out); draw();
    } });

  A({ id: 'quadratic', d: ['math', 'physics'], e: '⤴️', t: 'Parabolas and the quadratic formula', b: 'Move a, b and c and watch the roots, the vertex and the discriminant, including when the roots become complex.',
    how: 'The roots are where the curve crosses zero: x = (−b ± √(b² − 4ac))/2a. The discriminant b² − 4ac decides how many: positive gives two, zero gives one, negative gives none on the real line but two complex roots. The vertex sits at x = −b/2a.',
    use: 'Projectile height over time, stopping distances, profit curves with a best price, and the shape of satellite dishes.',
    m(el, K) {
      let a = 1, b = -2, c = -3, mode = 'free'; const P = K.canvas(el, 300); const out = K.out();
      const draw = () => { P.clear(); const ball = mode === 'ball'; const [x0, x1, y0, y1] = ball ? [0, 5, 0, 40] : [-8, 8, -12, 12]; const { X, Y } = P.chart(x0, x1, y0, y1, { xl: ball ? 't (s)' : 'x', yl: ball ? 'height (m)' : 'y' }); const A2 = ball ? -4.9 : a, B = ball ? b : b, Cc = ball ? c : c;
        if (!ball) { P.line([[X(x0), Y(0)], [X(x1), Y(0)]], K.css('--line'), 1); P.line([[X(0), Y(y0)], [X(0), Y(y1)]], K.css('--line'), 1); }
        const pts = []; for (let x = x0; x <= x1; x += (x1 - x0) / 300) { const y = A2 * x * x + B * x + Cc; if (y > y0 - 5 && y < y1 + 5) pts.push([X(x), Y(Math.max(y0 - 1, Math.min(y1 + 1, y)))]); } P.line(pts, '#2563EB', 2.5);
        const D = B * B - 4 * A2 * Cc; const vx = A2 ? -B / (2 * A2) : 0, vy = A2 * vx * vx + B * vx + Cc; if (A2) P.dot(X(vx), Y(vy), 5, '#CA8A04');
        let roots; if (A2 === 0) roots = 'a = 0: not a quadratic'; else if (D > 0) { const r1 = (-B - Math.sqrt(D)) / (2 * A2), r2 = (-B + Math.sqrt(D)) / (2 * A2); [r1, r2].forEach((r) => P.dot(X(r), Y(0), 6, '#DC2626')); roots = `two real roots: x = ${fmt(Math.min(r1, r2), 3)} and ${fmt(Math.max(r1, r2), 3)}`; } else if (D === 0) { P.dot(X(vx), Y(0), 6, '#DC2626'); roots = `one repeated root: x = ${fmt(vx, 3)}`; } else roots = `no real roots; complex roots ${fmt(-B / (2 * A2), 3)} ± ${fmt(Math.sqrt(-D) / Math.abs(2 * A2), 3)}i`;
        out.innerHTML = (ball ? `h(t) = −4.9t² + ${b}t + ${c} · lands when h = 0 · ` : `y = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} · `) + `discriminant b² − 4ac = <b>${fmt(D, 2)}</b> · ${roots} · vertex (${fmt(vx, 2)}, ${fmt(vy, 2)})`; };
      P.onResize = draw; const sa = K.slider('a', -3, 3, 0.5, a, (v) => { a = v; draw(); }); el.append(K.choice([['free', 'Any parabola'], ['ball', 'Thrown ball (a = −4.9)']], mode, (v) => { mode = v; if (v === 'ball') { b = 20; c = 2; } draw(); }), sa, K.slider('b (or launch speed m/s)', -10, 25, 1, b, (v) => { b = v; draw(); }), K.slider('c (or launch height m)', -10, 10, 1, c, (v) => { c = v; draw(); }), out); draw();
    } });

  A({ id: 'complex', d: ['math', 'physics', 'engineering'], e: '🌀', t: 'Multiplying complex numbers = turning', b: 'Drag two complex numbers and see their product: sizes multiply and angles add.',
    how: 'Write z = r(cos θ + i sin θ). Then z·w has size r_z·r_w and angle θ_z + θ_w. Multiplying by i turns by 90°. Repeated multiplication by one number traces a spiral, or a circle if its size is exactly 1.',
    use: 'AC circuits (phasors), signal processing, rotations in computer graphics and robotics, and quantum mechanics.',
    m(el, K) {
      let z = [1.5, 1], w = [0.5, 1.2], drag = null, pw = false; const P = K.canvas(el, 340); const out = K.out(); let map;
      const mul = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]]; const ab = (p) => Math.hypot(p[0], p[1]); const ang = (p) => (Math.atan2(p[1], p[0]) * 180) / Math.PI;
      const draw = () => { P.clear(); const R = 4; const s = Math.min(P.W, P.H) / (2 * R + 0.5); const cx = P.W / 2, cy = P.H / 2; const X = (x) => cx + x * s, Y = (y) => cy - y * s; map = { X, Y, s, cx, cy };
        P.line([[0, cy], [P.W, cy]], K.css('--line'), 1); P.line([[cx, 0], [cx, P.H]], K.css('--line'), 1); P.text('real', P.W - 30, cy - 6, { s: 11, c: K.css('--muted') }); P.text('imaginary', cx + 6, 14, { s: 11, c: K.css('--muted') });
        const u = []; for (let t = 0; t <= 6.3; t += 0.05) u.push([X(Math.cos(t)), Y(Math.sin(t))]); P.line(u, K.css('--line'), 1, [4, 4]);
        const arr = (p, color, lbl) => { P.line([[cx, cy], [X(p[0]), Y(p[1])]], color, 3); P.dot(X(p[0]), Y(p[1]), 6, color); P.text(lbl, X(p[0]) + 8, Y(p[1]) - 6, { s: 13, w: 700, c: color }); };
        const zw = mul(z, w); if (pw) { let p = [1, 0]; const pts = [[X(1), Y(0)]]; for (let k = 1; k <= 24; k++) { p = mul(p, z); if (ab(p) > 6) break; pts.push([X(p[0]), Y(p[1])]); P.dot(X(p[0]), Y(p[1]), 3, '#9333EA'); } P.line(pts, '#9333EA88', 1.5); }
        arr(z, '#2563EB', 'z'); arr(w, '#DC2626', 'w'); arr(zw, '#16A34A', 'z·w');
        const c = (p) => `${fmt(p[0], 2)} ${p[1] < 0 ? '−' : '+'} ${fmt(Math.abs(p[1]), 2)}i`;
        out.innerHTML = `z = ${c(z)} (size ${fmt(ab(z), 2)}, angle ${fmt(ang(z), 1)}°) · w = ${c(w)} (size ${fmt(ab(w), 2)}, angle ${fmt(ang(w), 1)}°)<br>z·w = <b>${c(zw)}</b>: size ${fmt(ab(z), 2)} × ${fmt(ab(w), 2)} = <b>${fmt(ab(zw), 2)}</b>, angle ${fmt(ang(z), 1)}° + ${fmt(ang(w), 1)}° = <b>${fmt(ang(zw), 1)}°</b> (mod 360)`; };
      const near = (e) => { const [x, y] = P.pt(e); const d = (p) => Math.hypot(map.X(p[0]) - x, map.Y(p[1]) - y); return d(z) < 24 ? 'z' : d(w) < 24 ? 'w' : null; };
      P.c.addEventListener('pointerdown', (e) => { drag = near(e); if (drag) P.c.setPointerCapture(e.pointerId); }); P.c.addEventListener('pointerup', () => (drag = null));
      P.c.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = P.pt(e); const p = [(x - map.cx) / map.s, (map.cy - y) / map.s].map((v) => Math.round(v * 20) / 20); if (drag === 'z') z = p; else w = p; draw(); });
      P.onResize = draw; el.append(h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, K.btn('w = i (turn 90°)', () => { w = [0, 1]; draw(); }), K.btn('w = conjugate of z', () => { w = [z[0], -z[1]]; draw(); }), K.btn('Show powers of z', () => { pw = !pw; draw(); })), h('div', { class: 'tiny muted' }, 'Drag the blue (z) and red (w) dots.'), out); draw();
    } });

  A({ id: 'slopefield', d: ['math', 'physics', 'biology'], e: '🌾', t: 'Slope fields and solution curves', b: 'See a differential equation as a field of arrows, tap to launch a solution, and compare a crude step method with an accurate one.',
    how: 'A differential equation dy/dt = f(t, y) gives a slope at every point. A solution is a curve that follows the arrows. Computers trace it in small steps: Euler’s method steps straight along the arrow; Runge–Kutta (RK4) samples the field four times per step and is far more accurate.',
    use: 'Population growth, cooling, drug levels, epidemics, circuits; every weather forecast steps a (much bigger) system of these equations forward.',
    m(el, K) {
      const EQ = { exp: ['dy/dt = 0.5y (growth)', (t, y) => 0.5 * y, [0, 6, -4, 10]], logi: ['dy/dt = y(1 − y/8) (logistic)', (t, y) => y * (1 - y / 8), [0, 8, -1, 10]], cool: ['dy/dt = −0.4(y − 20) (cooling to 20°)', (t, y) => -0.4 * (y - 20), [0, 10, 0, 90]], mix: ['dy/dt = t − y', (t, y) => t - y, [-3, 4, -4, 4]] };
      let k = 'logi', starts = [[0, 0.5]], showEuler = true, h0 = 0.5; const P = K.canvas(el, 320); const out = K.out(); let XY;
      const step = (f, t, y, hh, rk) => { if (!rk) return y + hh * f(t, y); const k1 = f(t, y), k2 = f(t + hh / 2, y + (hh * k1) / 2), k3 = f(t + hh / 2, y + (hh * k2) / 2), k4 = f(t + hh, y + hh * k3); return y + (hh / 6) * (k1 + 2 * k2 + 2 * k3 + k4); };
      const draw = () => { P.clear(); const [lab, f, [t0, t1, y0, y1]] = EQ[k]; const { X, Y } = P.chart(t0, t1, y0, y1, { xl: 't', yl: 'y' }); XY = { X, Y, t0, t1, y0, y1 };
        for (let i = 0; i <= 18; i++) for (let j = 0; j <= 12; j++) { const t = t0 + ((t1 - t0) * i) / 18, y = y0 + ((y1 - y0) * j) / 12; const m = f(t, y); const e = (t1 - t0) / 1000; const sx = X(t + e) - X(t), sy = Y(y + m * e) - Y(y); const L = Math.hypot(sx, sy) || 1; const cx = X(t), cy = Y(y); P.line([[cx - (7 * sx) / L, cy - (7 * sy) / L], [cx + (7 * sx) / L, cy + (7 * sy) / L]], K.css('--muted'), 1); }
        let msg = ''; starts.forEach(([ts, ys], n) => { [false, true].forEach((rk) => { if (!rk && !showEuler) return; const pts = []; let t = ts, y = ys; const hh = rk ? 0.02 : h0; while (t <= t1 && Math.abs(y) < 1e4) { pts.push([X(t), Y(y)]); y = step(f, t, y, hh, rk); t += hh; } P.line(pts, rk ? K.pal[n % 8] : '#9CA3AF', rk ? 2.5 : 1.5, rk ? null : [5, 4]); }); });
        if (k === 'exp' && starts.length) { const [ts, ys] = starts[0]; const T = t1; let y = ys, t = ts; while (t < T - 1e-9) { y = step(EQ.exp[1], t, y, h0, false); t += h0; } const exact = ys * Math.exp(0.5 * (T - ts)); msg = ` · at t = ${T}: exact ${fmt(exact, 3)}, Euler with step ${h0}: ${fmt(y, 3)} (error ${fmt(Math.abs(exact - y) / exact * 100, 1)}%)`; }
        out.innerHTML = `<b>${lab}</b>. Tap the chart to start a solution. Solid: accurate (RK4). Dashed grey: Euler’s method.` + msg; };
      P.c.addEventListener('pointerdown', (e) => { const [x, y] = P.pt(e); const { t0, t1, y0, y1 } = XY; const pl = 40, pb = 26, pt = 12, pr = 12; const t = t0 + ((x - pl) / (P.W - pl - pr)) * (t1 - t0), yy = y0 + ((P.H - pb - y) / (P.H - pb - pt)) * (y1 - y0); starts.push([t, yy]); if (starts.length > 6) starts.shift(); draw(); });
      P.onResize = draw; el.append(K.choice(Object.entries(EQ).map(([id, [l]]) => [id, l.split(' (')[0]]), k, (v) => { k = v; starts = [[EQ[v][2][0], v === 'cool' ? 85 : v === 'mix' ? 2 : 0.5]]; draw(); }), K.slider('Euler step size', 0.05, 1, 0.05, h0, (v) => { h0 = v; draw(); }), h('div', { class: 'row', style: { gap: '6px' } }, K.btn('Clear curves', () => { starts = []; draw(); }), K.btn('Toggle Euler', () => { showEuler = !showEuler; draw(); })), out); draw();
    } });

  A({ id: 'epsdelta', d: ['math', 'logic'], e: '🎯', t: 'The ε–δ limit game', b: 'A challenger sets a tolerance ε around the limit; you must find a δ that keeps the function inside it. Can you always win?',
    how: 'lim_{x→a} f(x) = L means: for every ε > 0 there is a δ > 0 such that 0 < |x − a| < δ forces |f(x) − L| < ε. Here f(x) = x², a = 2, L = 4. A winning rule is δ = min(1, ε/5), because near 2, |x² − 4| = |x − 2|·|x + 2| < 5|x − 2|.',
    use: 'This definition is how mathematics guarantees that numerical methods converge, that calculus rules are valid, and that “close enough” inputs give “close enough” outputs in engineering tolerances.',
    m(el, K) {
      let eps = 1, del = 0.5; const P = K.canvas(el, 320); const out = K.out(); const f = (x) => x * x, a = 2, L = 4;
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 3.5, 0, 10, { xl: 'x', yl: 'f(x) = x²' });
        P.ctx.fillStyle = '#16A34A22'; P.ctx.fillRect(X(0), Y(L + eps), X(3.5) - X(0), Y(L - eps) - Y(L + eps)); P.ctx.fillStyle = '#2563EB22'; P.ctx.fillRect(X(a - del), Y(10), X(a + del) - X(a - del), Y(0) - Y(10));
        const pts = []; for (let x = 0; x <= 3.5; x += 0.01) pts.push([X(x), Y(f(x))]); P.line(pts, K.css('--ink'), 2.5);
        let worst = 0; for (let x = a - del; x <= a + del; x += del / 200) worst = Math.max(worst, Math.abs(f(x) - L)); const win = worst < eps;
        const seg = []; for (let x = Math.max(0, a - del); x <= a + del; x += 0.005) seg.push([X(x), Y(f(x))]); P.line(seg, win ? '#16A34A' : '#DC2626', 4);
        P.dot(X(a), Y(L), 5, '#CA8A04');
        out.innerHTML = `ε = ${fmt(eps, 3)} (green band) · δ = ${fmt(del, 3)} (blue band) · largest |f(x) − 4| inside: ${fmt(worst, 4)} → <b style="color:${win ? '#15803D' : '#B91C1C'}">${win ? 'you win this round' : 'the curve escapes the band: shrink δ'}</b>. A δ that always works: min(1, ε/5) = ${fmt(Math.min(1, eps / 5), 4)}.`; };
      P.onResize = draw; el.append(K.slider('Challenger’s ε', 0.01, 3, 0.01, eps, (v) => { eps = v; draw(); }), K.slider('Your δ', 0.001, 1, 0.001, del, (v) => { del = v; draw(); }), K.btn('Use the winning rule δ = min(1, ε/5)', () => { del = Math.min(1, eps / 5); draw(); }), out); draw();
    } });

  A({ id: 'symmetry', d: ['math', 'chemistry', 'arts'], e: '🔷', t: 'The symmetry group of a square', b: 'Rotate and flip a square, combine moves, and discover that order matters: the 8 symmetries form a non-commutative group.',
    how: 'A symmetry is a move that leaves the square looking the same. There are 8: four rotations (0°, 90°, 180°, 270°) and four flips. Doing one move after another is again a symmetry (closure), every move can be undone (inverses), and doing nothing is the identity. But rotate-then-flip differs from flip-then-rotate.',
    use: 'Group theory classifies crystal structures, molecular vibrations, wallpaper patterns, particle physics, and the Rubik’s cube.',
    m(el, K) {
      const P = K.canvas(el, 260); const out = K.out(); let pos = [0, 1, 2, 3], seq = [];
      const R = (p) => [p[3], p[0], p[1], p[2]]; const F = (p) => [p[1], p[0], p[3], p[2]];
      const NAMES = { '0123': 'the identity (do nothing)', '3012': 'a rotation by 90° clockwise', '2301': 'a rotation by 180°', '1230': 'a rotation by 270° clockwise', '1032': 'a flip across the vertical axis', '3210': 'a flip across the horizontal axis', '0321': 'a flip across the ↘ diagonal', '2103': 'a flip across the ↗ diagonal' };
      const name = (p) => NAMES[p.join('')] || p.join('');
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, s = Math.min(P.W, P.H) * 0.28; const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        P.ctx.strokeStyle = K.css('--ink'); P.ctx.lineWidth = 2; P.ctx.beginPath(); corners.forEach(([x, y], i) => (i ? P.ctx.lineTo(cx + x * s, cy + y * s) : P.ctx.moveTo(cx + x * s, cy + y * s))); P.ctx.closePath(); P.ctx.stroke();
        pos.forEach((lbl, i) => { const [x, y] = corners[i]; P.dot(cx + x * s, cy + y * s, 16, K.pal[lbl]); P.text(String(lbl + 1), cx + x * s, cy + y * s + 5, { a: 'center', s: 14, w: 800, c: '#fff' }); });
        out.innerHTML = `Moves so far: ${seq.join(' then ') || 'none'} · this arrangement is <b>${name(pos)}</b>. Try <i>r then f</i>, reset, then <i>f then r</i>: different results, so the group is not commutative.`; };
      const doit = (m) => { pos = m === 'r' ? R(pos) : F(pos); seq.push(m); draw(); };
      P.onResize = draw; el.append(h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, K.btn('r: rotate 90° clockwise', () => doit('r'), true), K.btn('f: flip left–right', () => doit('f'), true), K.btn('Reset', () => { pos = [0, 1, 2, 3]; seq = []; draw(); })), out); draw();
    } });

  A({ id: 'modclock', d: ['math', 'computing'], e: '🕰️', t: 'Clock arithmetic (mod n)', b: 'Multiply around a clock of n hours, find which numbers have inverses, and test Fermat’s little theorem.',
    how: 'Mod n, numbers wrap around after n − 1. Multiplying by a is a map from the clock to itself; it is reversible exactly when a shares no factor with n (gcd(a, n) = 1). For a prime p, every non-zero a satisfies a^(p−1) ≡ 1 (mod p): Fermat’s little theorem.',
    use: 'Every public-key system (RSA, Diffie–Hellman, elliptic curves), check digits on ISBNs and cards, hash tables, calendars and music (12-note pitch classes).',
    m(el, K) {
      let n = 12, a = 5; const P = K.canvas(el, 320); const out = K.out();
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, R = Math.min(P.W, P.H) * 0.4; const pt = (k) => [cx + R * Math.sin((2 * Math.PI * k) / n), cy - R * Math.cos((2 * Math.PI * k) / n)];
        for (let k = 0; k < n; k++) { const [x0, y0] = pt(k), [x1, y1] = pt((a * k) % n); if (k !== (a * k) % n) P.line([[x0, y0], [x1, y1]], '#2563EB66', 1.5); }
        for (let k = 0; k < n; k++) { const [x, y] = pt(k); const inv = gcd(k, n) === 1; P.dot(x, y, 11, inv ? '#16A34A' : '#9CA3AF'); P.text(String(k), x, y + 4, { a: 'center', s: 11, w: 700, c: '#fff' }); }
        const g = gcd(a, n); let inv = null; for (let b = 1; b < n; b++) if ((a * b) % n === 1) inv = b; let pw = 1; for (let i = 0; i < n - 1; i++) pw = (pw * a) % n;
        const prime = n > 1 && [...Array(n).keys()].slice(2).every((d) => d * d > n || n % d);
        out.innerHTML = `Lines show k → ${a}·k mod ${n}. Green numbers have inverses mod ${n}. gcd(${a}, ${n}) = ${g}: ${inv ? `${a} × ${inv} ≡ 1, so ${a} has inverse <b>${inv}</b>` : `<b>no inverse</b>; multiplying by ${a} is not reversible`}. ${a}^${n - 1} mod ${n} = <b>${pw}</b>${prime ? (pw === 1 ? ' ✓ (n is prime: Fermat’s little theorem)' : '') : pw === 1 ? ' (n is not prime, but this one still gives 1)' : ' (n is not prime, so Fermat need not hold)'}.`; };
      P.onResize = draw; el.append(K.slider('Clock size n', 2, 36, 1, n, (v) => { n = v; draw(); }), K.slider('Multiply by a', 1, 35, 1, a, (v) => { a = v; draw(); }), out); draw();
    } });

  A({ id: 'diagonal', d: ['math', 'logic', 'philosophy'], e: '↘️', t: 'Cantor’s diagonal argument', b: 'Try to list every decimal between 0 and 1. The diagonal builds a number your list missed, every time.',
    how: 'Take digit n of the n-th number on the list and change it (here: 5 becomes 4, anything else becomes 5). The new number differs from every listed number in at least one place, so no list can contain all decimals. The real numbers are uncountable.',
    use: 'The same diagonal trick proves Gödel’s incompleteness theorem and Turing’s halting problem, and shows there are more problems than computer programs.',
    m(el, K) {
      const box = h('div', { class: 'stack', style: { gap: '4px', fontFamily: 'ui-monospace, monospace', fontSize: '15px' } }); const out = K.out(); const D = 10;
      let list = Array.from({ length: D }, () => Array.from({ length: D }, () => Math.floor(Math.random() * 10)));
      const missing = () => list.map((r, i) => (r[i] === 5 ? 4 : 5));
      const draw = () => { box.replaceChildren(...list.map((r, i) => h('div', null, h('span', { class: 'tiny muted', style: { display: 'inline-block', width: '34px' } }, `#${i + 1}`), '0.', ...r.map((d, j) => h('span', { style: j === i ? { background: '#FDE68A', fontWeight: 800 } : {} }, String(d))), '…')));
        const m = missing(); out.innerHTML = `Diagonal digits (highlighted): ${list.map((r, i) => r[i]).join('')} → changed: <b>0.${m.join('')}…</b><br>This number differs from #1 in digit 1, from #2 in digit 2, and so on. It is not on the list.`; };
      el.append(box, h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '6px' } }, K.btn('Add the missing number to the top of the list', () => { list = [missing(), ...list].slice(0, D); draw(); }, true), K.btn('New random list', () => { list = Array.from({ length: D }, () => Array.from({ length: D }, () => Math.floor(Math.random() * 10))); draw(); })), out); draw();
    } });

  A({ id: 'primecount', d: ['math', 'computing'], e: '📈', t: 'Experiment: counting primes', b: 'Sieve the primes up to a million and test Gauss’s guess: about x/ln x primes up to x, and better, the integral Li(x).',
    how: 'π(x) counts the primes up to x. Gauss guessed from tables, as a teenager, that primes near x have density about 1/ln x; summing that density gives Li(x). The prime number theorem (1896) proves π(x)/(x/ln x) → 1. The Riemann hypothesis would pin down how far π(x) can stray from Li(x).',
    use: 'Choosing key sizes for RSA encryption depends on knowing how common primes of a given size are; random prime generation relies on this density.',
    m(el, K) {
      const NMAX = 1000000; const sieve = new Uint8Array(NMAX + 1); sieve[0] = sieve[1] = 1; for (let i = 2; i * i <= NMAX; i++) if (!sieve[i]) for (let j = i * i; j <= NMAX; j += i) sieve[j] = 1;
      const cum = new Uint32Array(NMAX + 1); for (let i = 1; i <= NMAX; i++) cum[i] = cum[i - 1] + (sieve[i] ? 0 : 1);
      const li = (x) => { const L = Math.log(x); let s = 0, term = 1; for (let k = 1; k < 200; k++) { term *= L / k; s += term / k; if (term / k < 1e-12) break; } return 0.5772156649 + Math.log(L) + s; };
      let N = 10000; const P = K.canvas(el, 300); const out = K.out(); const tbl = h('div', { class: 'small' });
      const draw = () => { P.clear(); const { X, Y } = P.chart(2, N, 0, cum[N] * 1.15, { xl: 'x', yl: 'count', fx: (v) => fmt(v, 0), fy: (v) => fmt(v, 0) }); const a = [], b = [], c = []; for (let i = 1; i <= 300; i++) { const x = Math.max(3, Math.round((N * i) / 300)); a.push([X(x), Y(cum[x])]); b.push([X(x), Y(x / Math.log(x))]); c.push([X(x), Y(li(x) - li(2))]); } P.line(a, '#16A34A', 2.5); P.line(b, '#DC2626', 2, [6, 4]); P.line(c, '#2563EB', 2, [2, 3]);
        out.innerHTML = `Up to ${fmt(N, 0)}: <b>${fmt(cum[N], 0)}</b> primes (green). x/ln x = ${fmt(N / Math.log(N), 0)} (red dashes), Li(x) = ${fmt(li(N) - li(2), 0)} (blue dots).`;
        tbl.innerHTML = '<table class="pmx-table"><tr><th>x</th><th>π(x) counted</th><th>x / ln x</th><th>ratio</th><th>Li(x)</th></tr>' + [100, 1000, 10000, 100000, 1000000].map((x) => `<tr><td>${fmt(x, 0)}</td><td><b>${fmt(cum[x], 0)}</b></td><td>${fmt(x / Math.log(x), 0)}</td><td>${(cum[x] / (x / Math.log(x))).toFixed(4)}</td><td>${fmt(li(x) - li(2), 0)}</td></tr>`).join('') + '</table><div class="tiny muted">The ratio creeps toward 1, slowly: that is the prime number theorem. Li(x) is far closer. Counts computed in your browser with the sieve of Eratosthenes.</div>'; };
      P.onResize = draw; el.append(K.slider('Count primes up to (log scale)', 2, 6, 0.1, 4, (v) => { N = Math.round(10 ** v); draw(); }, (v) => fmt(10 ** v, 0)), out, tbl); draw();
    } });

  A({ id: 'zeta', d: ['math'], e: 'ζ', t: 'Experiment: zeros of the zeta function', b: 'Compute the Riemann zeta function along the critical line and find its first zeros yourself; the Riemann hypothesis says all non-trivial zeros lie on this line.',
    how: 'On the line s = ½ + it, ζ can be written as a real function Z(t) times a phase, so its zeros are where Z(t) changes sign. This lab evaluates Z(t) with the Riemann–Siegel formula (the method Riemann himself used, found in his unpublished notes by Carl Siegel in 1932), then pins each zero down by bisection.',
    use: 'The positions of these zeros control the error in counting primes. They also show statistical patterns that match energy levels of heavy atomic nuclei, a connection noticed by Hugh Montgomery and Freeman Dyson in 1972.',
    m(el, K) {
      const theta = (t) => (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3);
      const C0 = (p) => Math.cos(2 * Math.PI * (p * p - p - 1 / 16)) / Math.cos(2 * Math.PI * p); const d3 = (p, e = 0.002) => (C0(p + 2 * e) - 2 * C0(p + e) + 2 * C0(p - e) - C0(p - 2 * e)) / (2 * e ** 3);
      const Z = (t) => { const tau = Math.sqrt(t / (2 * Math.PI)); const N = Math.floor(tau); const th = theta(t); let s = 0; for (let n = 1; n <= N; n++) s += Math.cos(th - t * Math.log(n)) / Math.sqrt(n); const p = tau - N; const C1 = -d3(p) / (96 * Math.PI * Math.PI); return 2 * s + (N % 2 ? 1 : -1) * Math.pow(t / (2 * Math.PI), -0.25) * (C0(p) + C1 / tau); };
      const KNOWN = [14.134725, 21.02204, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832];
      let T = 50; const P = K.canvas(el, 300); const out = K.out();
      const zeros = (t1) => { const zs = []; let prev = Z(10), tp = 10; for (let t = 10.02; t <= t1; t += 0.02) { const v = Z(t); if (Math.sign(v) !== Math.sign(prev)) { let a = tp, b = t; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (Math.sign(Z(m)) === Math.sign(Z(a))) a = m; else b = m; } zs.push((a + b) / 2); } prev = v; tp = t; } return zs; };
      const draw = () => { P.clear(); const { X, Y } = P.chart(10, T, -4, 4, { xl: 't (height on the critical line)', yl: 'Z(t)' }); P.line([[X(10), Y(0)], [X(T), Y(0)]], K.css('--line'), 1); const pts = []; for (let t = 10; t <= T; t += (T - 10) / 900) pts.push([X(t), Y(Math.max(-4, Math.min(4, Z(t))))]); P.line(pts, '#2563EB', 2);
        const zs = zeros(T); zs.forEach((z) => P.dot(X(z), Y(0), 4, '#DC2626'));
        out.innerHTML = `Found <b>${zs.length}</b> zeros between t = 10 and ${T} (red dots). First ones, ours vs published values:<br>` + zs.slice(0, 10).map((z, i) => `${z.toFixed(3)}${KNOWN[i] ? ` <span class="tiny muted">(published ${KNOWN[i].toFixed(3)})</span>` : ''}`).join(' · ') + '<br><span class="tiny muted">Each zero is ½ + it with t as shown. This fast approximation agrees with high-precision published values to about two or three decimal places. Computers have checked trillions of zeros; all lie on the line. A proof that all do would settle the Riemann hypothesis; a claimed computer proof was posted on 20 November 2026 and is being checked (developing).</span>'; };
      P.onResize = draw; el.append(K.slider('Search up to t =', 20, 120, 5, T, (v) => { T = v; draw(); }), out); draw();
    } });

  A({ id: 'modular', d: ['math'], e: '🔁', t: 'Experiment: check a case of the Langlands program', b: 'Count solutions of an elliptic curve modulo each prime, and compare with the coefficients of a modular form. They match, prime after prime.',
    how: 'For the curve y² + y = x³ − x², count the solution pairs (x, y) modulo a prime p and add one point at infinity: call it N_p. Set a_p = p + 1 − N_p. Separately, expand q·∏(1 − qⁿ)²(1 − q¹¹ⁿ)² as a power series. The modularity theorem says the coefficient of q^p equals a_p for every prime p other than 11. This case was proved by Martin Eichler in 1954; the general statement is what Wiles needed for Fermat’s Last Theorem.',
    use: 'Modularity proved Fermat’s Last Theorem; the same counts underlie the Birch and Swinnerton-Dyer conjecture and the elliptic curves used in cryptography.',
    m(el, K) {
      const NQ = 200; let s = new Array(NQ + 1).fill(0); s[0] = 1; const mulBy = (k) => { for (let i = NQ; i >= k; i--) s[i] -= s[i - k]; };
      for (let n = 1; n <= NQ; n++) { mulBy(n); mulBy(n); if (11 * n <= NQ) { mulBy(11 * n); mulBy(11 * n); } }
      const coef = (p) => s[p - 1];
      const count = (p) => { let N = 1; for (let x = 0; x < p; x++) { const rhs = (((x * x * x - x * x) % p) + p) % p; for (let y = 0; y < p; y++) if ((y * y + y) % p === rhs) N++; } return N; };
      const primes = []; for (let n = 2; n <= NQ; n++) if ([...Array(n).keys()].slice(2).every((d) => n % d)) primes.push(n);
      let upto = 60; const tbl = h('div', { class: 'small' }); const out = K.out();
      const draw = () => { let ok = 0, tot = 0; const rows = primes.filter((p) => p <= upto).map((p) => { if (p === 11) return `<tr><td>11</td><td colspan="4" class="tiny muted">bad prime (the curve’s conductor): the simple count rule does not apply here</td></tr>`; const N = count(p), ap = p + 1 - N, c = coef(p); tot++; if (ap === c) ok++; return `<tr><td>${p}</td><td>${N}</td><td><b>${ap}</b></td><td><b>${c}</b></td><td>${ap === c ? '✓' : '✗'} <span class="tiny muted">|a_p| ≤ 2√p = ${(2 * Math.sqrt(p)).toFixed(1)}</span></td></tr>`; });
        tbl.innerHTML = '<table class="pmx-table"><tr><th>prime p</th><th>solutions N_p</th><th>a_p = p + 1 − N_p</th><th>modular form coefficient</th><th>match?</th></tr>' + rows.join('') + '</table>';
        out.innerHTML = `<b>${ok} of ${tot}</b> primes match. Every count here was computed in your browser from scratch; nothing is looked up.`; };
      el.append(K.slider('Check primes up to', 20, NQ, 10, upto, (v) => { upto = v; draw(); }), out, tbl); draw();
    } });

  A({ id: 'gbm', d: ['math', 'economics', 'statistics'], e: '📉', t: 'Volatility drag: random price paths', b: 'Simulate thousands of random price paths and see why the typical (median) outcome falls below the average when volatility is high.',
    how: 'In the standard model (geometric Brownian motion), each day multiplies the price by a random factor. The average path grows at rate μ, but the median grows at μ − σ²/2: a 50% loss needs a 100% gain to recover, so randomness alone drags typical compound growth down. This is Itô’s correction in action.',
    use: 'Portfolio risk, leveraged funds that decay in choppy markets, option pricing, and why diversification raises typical long-run growth. Educational model only: real markets have jumps and fat tails, so this is not investment advice.',
    m(el, K) {
      let mu = 0.07, sig = 0.3, Tyr = 10; const P = K.canvas(el, 300); const out = K.out(); const M = 2000, show = 40;
      const run = () => { const steps = Tyr * 52, dt = 1 / 52; const finals = new Float64Array(M); const paths = []; for (let m = 0; m < M; m++) { let x = 0; const pts = m < show ? [[0, 1]] : null; for (let s = 1; s <= steps; s++) { x += (mu - (sig * sig) / 2) * dt + sig * Math.sqrt(dt) * K.gauss(); if (pts && s % 4 === 0) pts.push([s * dt, Math.exp(x)]); } finals[m] = Math.exp(x); if (pts) paths.push(pts); }
        const sorted = Array.from(finals).sort((a, b) => a - b); const mean = finals.reduce((a, b) => a + b, 0) / M, med = sorted[M >> 1]; const below = sorted.filter((v) => v < 1).length / M;
        P.clear(); const top = Math.max(4, Math.exp(mu * Tyr) * 3); const { X, Y } = P.chart(0, Tyr, 0, top, { xl: 'years', yl: 'value of $1' }); paths.forEach((pts, i) => P.line(pts.map(([t, v]) => [X(t), Y(Math.min(top, v))]), K.pal[i % 8] + '55', 1));
        P.line(Array.from({ length: 50 }, (_, i) => { const t = (Tyr * i) / 49; return [X(t), Y(Math.min(top, Math.exp(mu * t)))]; }), '#111827', 2.5); P.line(Array.from({ length: 50 }, (_, i) => { const t = (Tyr * i) / 49; return [X(t), Y(Math.exp((mu - (sig * sig) / 2) * t))]; }), '#DC2626', 2.5, [6, 4]);
        out.innerHTML = `${M} simulated paths of $1 over ${Tyr} years (μ = ${(mu * 100).toFixed(0)}%, σ = ${(sig * 100).toFixed(0)}%). Simulated mean: <b>$${mean.toFixed(2)}</b> (theory e^(μT) = $${Math.exp(mu * Tyr).toFixed(2)}, black). Median: <b>$${med.toFixed(2)}</b> (theory e^((μ − σ²/2)T) = $${Math.exp((mu - (sig * sig) / 2) * Tyr).toFixed(2)}, red dashes). <b>${(below * 100).toFixed(0)}%</b> of paths end below $1.`; };
      el.append(K.slider('Average growth μ (per year)', -0.05, 0.15, 0.01, mu, (v) => { mu = v; }, (v) => (v * 100).toFixed(0) + '%'), K.slider('Volatility σ (per year)', 0.05, 0.8, 0.05, sig, (v) => { sig = v; }, (v) => (v * 100).toFixed(0) + '%'), K.slider('Years', 1, 30, 1, Tyr, (v) => { Tyr = v; }), K.btn('Run 2,000 paths', run, true), out); P.onResize = run; run();
    } });

  A({ id: 'graddescent', d: ['math', 'computing'], e: '⛰️', t: 'Gradient descent on a landscape', b: 'Drop a ball on a hilly surface and let it follow the slope downhill. Too big a step and it overshoots; a bad start and it gets stuck in the wrong valley.',
    how: 'Each step moves against the gradient: (x, y) ← (x, y) − η ∇f. The learning rate η sets the step size. On a bowl (convex function) any start reaches the bottom; with two valleys, where you start decides where you end. Training a neural network is this, in millions of dimensions.',
    use: 'Training every modern AI model, fitting statistical models, engineering design, and logistics optimization.',
    m(el, K) {
      const FN = { bowl: ['Bowl: x² + 3y²', (x, y) => x * x + 3 * y * y, (x, y) => [2 * x, 6 * y]], two: ['Two valleys', (x, y) => (x * x - 4) ** 2 / 4 + y * y + 0.6 * x, (x, y) => [x * (x * x - 4) + 0.6, 2 * y]] };
      let k = 'two', lr = 0.05, path = [], start = [-0.3, 2.5]; const P = K.canvas(el, 320); const out = K.out(); let map;
      const run = () => { const [, f, g] = FN[k]; let [x, y] = start; path = [[x, y]]; for (let i = 0; i < 200; i++) { const [gx, gy] = g(x, y); x -= lr * gx; y -= lr * gy; if (!isFinite(x) || Math.abs(x) > 50) break; path.push([x, y]); } draw(); const [xe, ye] = path[path.length - 1]; out.innerHTML = `${path.length - 1} steps · ended at (${fmt(xe, 3)}, ${fmt(ye, 3)}), f = <b>${isFinite(f(xe, ye)) ? fmt(f(xe, ye), 4) : '∞ (diverged)'}</b>. ${Math.abs(xe) > 40 ? 'The step was too large: it overshot and blew up.' : k === 'two' ? (xe > 0 ? 'Stuck in the right-hand (higher) valley: a local minimum.' : 'Reached the left-hand (lower) valley: the global minimum.') : ''} Tap the chart to choose a new start.`; };
      const draw = () => { P.clear(); const [, f] = FN[k]; const R = 3.2; const s = Math.min(P.W, P.H) / (2 * R); const cx = P.W / 2, cy = P.H / 2; map = { s, cx, cy }; const step = 6;
        for (let px = 0; px < P.W; px += step) for (let py = 0; py < P.H; py += step) { const x = (px - cx) / s, y = (cy - py) / s; const v = f(x, y); const c = Math.max(0, Math.min(1, Math.log1p(Math.max(0, v + 2)) / 3.5)); P.ctx.fillStyle = `hsl(${210 - 170 * c},70%,${92 - 30 * c}%)`; P.ctx.fillRect(px, py, step, step); }
        P.line(path.map(([x, y]) => [cx + x * s, cy - y * s]), '#111827', 2); path.forEach(([x, y], i) => i % 3 === 0 && P.dot(cx + x * s, cy - y * s, 2.5, '#111827')); P.dot(cx + start[0] * s, cy - start[1] * s, 6, '#DC2626'); };
      P.c.addEventListener('pointerdown', (e) => { const [x, y] = P.pt(e); start = [(x - map.cx) / map.s, (map.cy - y) / map.s]; run(); });
      P.onResize = () => { draw(); }; el.append(K.choice(Object.entries(FN).map(([id, [l]]) => [id, l]), k, (v) => { k = v; run(); }), K.slider('Learning rate η', 0.005, 0.5, 0.005, lr, (v) => { lr = v; run(); }), out); run();
    } });

  A({ id: 'pnp', d: ['math', 'computing'], e: '🧩', t: 'Easy to check, hard to find (P vs NP)', b: 'A subset of numbers adds up to a target. Checking a proposed answer is instant; finding one by brute force doubles in time with every extra number.',
    how: 'Subset sum is NP-complete: a proposed answer can be checked in a few additions, but no known method finds answers quickly for all cases. Brute force tries all 2ⁿ subsets. If P = NP, a fast method would exist for this and thousands of similar problems; most experts think it does not, but no one has proved it.',
    use: 'Scheduling, packing, route planning and cryptography all meet NP-hard problems. Knowing a problem is NP-complete tells engineers to use approximations rather than wait for a perfect algorithm.',
    m(el, K) {
      let n = 16; const out = K.out(); const P = K.canvas(el, 220); const hist = [];
      const make = () => { const xs = Array.from({ length: n }, () => K.ri(100, 999)); const pick = xs.map(() => Math.random() < 0.4); const target = xs.reduce((a, v, i) => a + (pick[i] ? v : 0), 0) || xs[0]; return { xs, pick, target }; };
      let prob = make();
      const solve = () => { const { xs, target } = prob; const t0 = performance.now(); let tries = 0, found = -1; const N = 1 << xs.length; let sum = 0, gray = 0; for (let i = 1; i < N; i++) { const bit = 31 - Math.clz32(i & -i); gray ^= 1 << bit; sum += gray & (1 << bit) ? xs[bit] : -xs[bit]; tries++; if (sum === target) { found = gray; break; } } return { ms: performance.now() - t0, tries, found }; };
      const draw = () => { P.clear(); if (!hist.length) return; const mx = Math.max(...hist.map(([, t]) => t), 1); const { X, Y } = P.chart(8, 24, 0, mx * 1.1, { xl: 'n numbers', yl: 'subsets tried (worst-case grows like 2ⁿ)', fy: (v) => fmt(v, 0) }); hist.forEach(([nn, t]) => P.dot(X(nn), Y(t), 5, '#DC2626')); const curve = []; for (let x = 8; x <= 24; x += 0.25) curve.push([X(x), Y(Math.min(mx * 1.1, 2 ** x))]); P.line(curve, '#9CA3AF', 1.5, [4, 4]); };
      const show = () => { out.innerHTML = `Numbers: ${prob.xs.join(', ')}<br>Target: <b>${prob.target}</b>`; };
      const check = () => { const { xs, pick, target } = prob; const s = xs.reduce((a, v, i) => a + (pick[i] ? v : 0), 0); out.innerHTML += `<br>Checking the hidden answer {${xs.filter((_, i) => pick[i]).join(', ')}}: ${xs.filter((_, i) => pick[i]).length} additions → ${s} ${s === target ? '= target ✓' : ''}. Instant.`; };
      const brute = () => { const r = solve(); hist.push([n, r.tries]); draw(); out.innerHTML += `<br>Brute-force search: tried <b>${fmt(r.tries, 0)}</b> subsets in ${r.ms.toFixed(1)} ms${r.found >= 0 ? '' : ' (none found)'}. Each extra number doubles the worst case: at n = 60, even a billion tries a second would take decades.`; };
      el.append(K.slider('How many numbers (n)', 8, 24, 1, n, (v) => { n = v; prob = make(); show(); }), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, K.btn('Check the hidden answer', check), K.btn('Search by brute force', brute, true), K.btn('New puzzle', () => { prob = make(); show(); })), out); show(); P.onResize = draw; draw();
    } });
})();
