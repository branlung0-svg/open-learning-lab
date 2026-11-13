/* Lab Arcade: mathematics labs */
(function () {
  const A = Lab.ARC.add, h = Lab.h;

  A({ id: 'sieve', d: ['math', 'computing'], e: '🔢', t: 'Sieve of Eratosthenes', b: 'Watch a 2,200-year-old algorithm find every prime up to 400.',
    how: 'Start at 2 and cross out every multiple of it, then move to the next number that is still standing and cross out its multiples. Whatever survives can’t be divided by anything smaller, so it is prime. You only need to sieve up to √400 = 20.',
    use: 'Primes are the atoms of arithmetic. They keep your bank and messages secure (RSA encryption), they pick hash table sizes in software, and cicadas emerge on prime-year cycles (13 and 17) which may help them avoid predators.',
    m(el, K) {
      const N = 400, cols = 20; const P = K.canvas(el, 420); const st = { comp: new Uint8Array(N + 1), p: 2, m: 4, speed: 6, done: false, hit: {} };
      const info = K.out(); const reset = () => { st.comp.fill(0); st.p = 2; st.m = 4; st.done = false; st.hit = {}; };
      el.append(K.slider('Speed', 1, 40, 1, 6, (v) => (st.speed = v)), K.btn('↺ Restart', reset, true), info);
      K.raf(() => {
        for (let s = 0; s < st.speed && !st.done; s++) { if (st.m <= N) { st.comp[st.m] = 1; st.hit[st.m] = st.p; st.m += st.p; } else { do st.p++; while (st.p * st.p <= N && st.comp[st.p]); if (st.p * st.p > N) st.done = true; else st.m = st.p * st.p; } }
        P.clear(); const cw = P.W / cols, ch = P.H / (N / cols);
        for (let n = 1; n <= N; n++) { const x = ((n - 1) % cols) * cw, y = Math.floor((n - 1) / cols) * ch; const prime = n > 1 && !st.comp[n];
          P.rect(x + 1, y + 1, cw - 2, ch - 2, n === 1 ? '#94A3B833' : st.comp[n] ? K.pal[[2, 3, 5, 7, 11, 13, 17, 19].indexOf(st.hit[n]) % 8] + '55' : prime && (st.done || n < st.p * st.p || n <= st.p) ? '#16A34A' : '#94A3B822');
          P.text(n, x + cw / 2, y + ch / 2 + 4, { a: 'center', s: Math.min(11, cw / 3), c: prime && (st.done || n <= st.p) ? '#fff' : K.css('--ink') }); }
        let c = 0; for (let n = 2; n <= N; n++) if (!st.comp[n]) c++;
        info.textContent = st.done ? `Done: ${c} primes below ${N}. Colors show which prime crossed each number out first.` : `Crossing out multiples of ${st.p}…`;
      });
    } });

  A({ id: 'ulam', d: ['math'], e: '🌀', t: 'Prime spiral', b: 'Write numbers in a spiral and light up the primes. Mysterious diagonals appear.',
    how: 'Stanisław Ulam doodled this in a boring meeting in 1963. Numbers are laid out in a square spiral; primes are marked. Diagonal lines appear because certain quadratic formulas (like n² + n + 41) produce unusually many primes.',
    use: 'It hints that primes are not random, a question at the heart of the Riemann Hypothesis, one of the great unsolved problems. Similar spiral layouts help scientists spot hidden patterns in other data.',
    m(el, K) {
      const P = K.canvas(el, 460); let size = 3; const isP = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
      const draw = () => { P.clear(); let x = 0, y = 0, dx = 1, dy = 0, seg = 1, k = 0, turns = 0; const cx = P.W / 2, cy = P.H / 2; const max = Math.floor((Math.min(P.W, P.H) / size) ** 2);
        for (let n = 1; n <= max; n++) { if (isP(n)) P.rect(cx + x * size, cy + y * size, size, size, '#2563EB'); x += dx; y += dy; if (++k === seg) { k = 0; [dx, dy] = [-dy, dx]; if (++turns % 2 === 0) seg++; } }
        P.text(`${max.toLocaleString()} numbers`, 8, 16, { c: K.css('--muted') }); };
      P.onResize = draw; el.append(K.slider('Zoom (pixel size)', 1, 8, 1, 3, (v) => { size = v; draw(); })); draw();
    } });

  A({ id: 'pythag', d: ['math', 'engineering', 'history'], e: '📐', t: 'Pythagoras by area', b: 'Drag the corner of a right triangle and watch a² + b² = c² hold with real squares.',
    how: 'The squares built on the two short sides always have the same total area as the square on the long side. Babylonian tablets (Plimpton 322, around 1800 BC) list Pythagorean triples centuries before Pythagoras.',
    use: 'Builders check right angles with a 3-4-5 rope; GPS and screen distances use it; every distance formula in physics and machine learning is this theorem in more dimensions.',
    m(el, K) {
      const P = K.canvas(el, 420); let a = 120, b = 90; const out = K.big();
      const draw = () => { P.clear(); const ox = P.W / 2 - a / 2 + 20, oy = P.H / 2 + 40; const A_ = [ox, oy], B_ = [ox + a, oy], C_ = [ox, oy - b];
        const poly = (pts, col) => { P.ctx.fillStyle = col; P.ctx.beginPath(); pts.forEach(([x, y], i) => (i ? P.ctx.lineTo(x, y) : P.ctx.moveTo(x, y))); P.ctx.closePath(); P.ctx.fill(); };
        poly([A_, B_, [ox + a, oy + a], [ox, oy + a]], '#2563EB55'); poly([A_, C_, [ox - b, oy - b], [ox - b, oy]], '#DC262655');
        const v = [C_[0] - B_[0], C_[1] - B_[1]]; const n = [v[1], -v[0]]; poly([B_, C_, [C_[0] + n[0], C_[1] + n[1]], [B_[0] + n[0], B_[1] + n[1]]], '#16A34A55');
        poly([A_, B_, C_], '#CA8A04'); P.dot(C_[0], C_[1], 8, '#111'); P.dot(B_[0], B_[1], 8, '#111');
        const sa = (a / 30) ** 2, sb = (b / 30) ** 2; out.innerHTML = `<span style="color:#2563EB">${sa.toFixed(1)}</span> + <span style="color:#DC2626">${sb.toFixed(1)}</span> = <span style="color:#16A34A">${(sa + sb).toFixed(1)}</span> <small>c = ${Math.sqrt(sa + sb).toFixed(2)}</small>`; };
      P.onResize = draw; el.append(K.slider('Side a', 30, 200, 1, a, (v) => { a = v; draw(); }), K.slider('Side b', 30, 200, 1, b, (v) => { b = v; draw(); }), out, h('p', { class: 'tiny muted' }, 'Try a = 90, b = 120: a 3-4-5 triangle scaled up, so c comes out a whole number.')); draw();
    } });

  A({ id: 'pidarts', d: ['math', 'statistics', 'physics'], e: '🎯', t: 'Find π with random darts', b: 'Throw thousands of random darts at a square and estimate π from where they land.',
    how: 'A circle inside a square covers π/4 of it. Throw darts at random: the fraction that land inside approaches π/4, so 4 × (inside / total) approaches π. The error shrinks like 1/√n, so 100× more darts gives only 10× more accuracy.',
    use: 'This is the Monte Carlo method, invented at Los Alamos in the 1940s for nuclear physics. Today it prices options on Wall Street, renders movie lighting, models climate risk and plans space missions.',
    m(el, K) {
      const P = K.canvas(el, 380); let n = 0, ins = 0, rate = 50; const big = K.big(); const hist = [];
      const reset = () => { n = 0; ins = 0; hist.length = 0; P.clear(); };
      el.append(K.slider('Darts per frame', 1, 500, 1, 50, (v) => (rate = v)), K.btn('↺ Reset', reset, true), big);
      K.raf(() => { const S = Math.min(P.H - 20, P.W / 2 - 20); const ox = 10, oy = (P.H - S) / 2;
        if (n === 0) { P.clear(); P.ctx.strokeStyle = K.css('--line'); P.ctx.strokeRect(ox, oy, S, S); }
        for (let i = 0; i < rate; i++) { const x = Math.random(), y = Math.random(); const inn = x * x + y * y <= 1; n++; if (inn) ins++; P.rect(ox + x * S, oy + (1 - y) * S, 1.5, 1.5, inn ? '#2563EB' : '#DC2626'); }
        const est = (4 * ins) / n; hist.push(est); if (hist.length > 300) hist.shift();
        const gx = S + 30, gw = P.W - gx - 10; P.rect(gx, 0, gw + 10, P.H, K.css('--card2')); const Y = (v) => P.H / 2 - (v - Math.PI) * 300;
        P.line([[gx, Y(Math.PI)], [gx + gw, Y(Math.PI)]], '#16A34A', 1, [4, 4]); P.line(hist.map((v, i) => [gx + (i / 300) * gw, Lab.clamp(Y(v), 0, P.H)]), '#2563EB', 2); P.text('π = 3.14159…', gx + 4, Y(Math.PI) - 6, { c: '#16A34A' });
        big.innerHTML = `π ≈ ${est.toFixed(5)} <small>${n.toLocaleString()} darts · error ${Math.abs(est - Math.PI).toFixed(5)}</small>`; });
    } });

  A({ id: 'phyllo', d: ['math', 'biology', 'arts'], e: '🌻', t: 'Sunflower angle', b: 'Change one angle and see why sunflowers use the golden angle, 137.5°.',
    how: 'Each new seed grows at a fixed turn from the last. If the turn is a simple fraction of a circle the seeds line up in spokes and waste space. The golden angle (360° × (1 − 1/φ) ≈ 137.508°) is the “most irrational” turn, so seeds never line up and pack perfectly. Counting the spirals gives Fibonacci numbers.',
    use: 'Plants, pine cones and pineapples; engineers copy it for solar arrays and antenna layouts; artists and architects use the golden ratio (with some myth mixed in).',
    m(el, K) {
      const P = K.canvas(el, 420); let ang = 137.508, n = 600; const out = K.out();
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, c = Math.min(P.W, P.H) / 2 / Math.sqrt(n) * 0.95;
        for (let i = 0; i < n; i++) { const r = c * Math.sqrt(i), t = (i * ang * Math.PI) / 180; P.dot(cx + r * Math.cos(t), cy + r * Math.sin(t), c * 0.42, `hsl(${40 + (i % 21) * 2},85%,${45 + (i / n) * 15}%)`); }
        out.textContent = Math.abs(ang - 137.508) < 0.05 ? 'Golden angle: no gaps, no spokes, perfect packing.' : 'Look for spokes and gaps: this angle wastes space.'; };
      P.onResize = draw; const sl = K.slider('Turn between seeds (degrees)', 90, 180, 0.01, ang, (v) => { ang = v; draw(); });
      el.append(sl, K.slider('Seeds', 50, 1500, 10, n, (v) => { n = v; draw(); }), h('div', { class: 'row' }, ['137.508', '137.0', '120', '135', '144'].map((v) => K.btn(v + '°', () => { ang = +v; sl.set(ang); draw(); }))), out); draw();
    } });

  A({ id: 'collatz', d: ['math', 'computing'], e: '🔁', t: 'The Collatz mystery', b: 'If even, halve it; if odd, triple it and add 1. Does every number fall to 1?',
    how: 'Nobody has proven that every starting number reaches 1, although computers have checked every number up to about 2.9 × 10²⁰. Some numbers take wild journeys: 27 climbs to 9,232 before falling, taking 111 steps.',
    use: 'A famous example of how simple rules can create behavior nobody can predict. Paul Erdős said mathematics is “not yet ready” for problems like this. It is related to the study of chaos and computation.',
    m(el, K) {
      const P = K.canvas(el, 340); const inp = h('input', { type: 'number', value: 27, min: 1, style: { width: '120px' } }); const out = K.out();
      const run = () => { let n = Math.max(1, Math.floor(+inp.value || 1)); const seq = [n]; while (n !== 1 && seq.length < 2000) { n = n % 2 ? 3 * n + 1 : n / 2; seq.push(n); }
        const mx = Math.max(...seq); P.clear(); const { X, Y } = P.chart(0, seq.length - 1, 0, mx, { fy: (v) => Lab.fmt(v), xl: 'step' });
        P.line(seq.map((v, i) => [X(i), Y(v)]), '#9333EA', 2); out.textContent = `${seq[0]} reaches 1 in ${seq.length - 1} steps, peaking at ${mx.toLocaleString()}.`; };
      P.onResize = run; el.append(h('div', { class: 'row' }, h('label', { class: 'ctl' }, 'Start number'), inp, K.btn('Run', run, true), ...[7, 27, 97, 871, 77031].map((v) => K.btn(v, () => { inp.value = v; run(); }))), out); run();
    } });

  A({ id: 'mandel', d: ['math', 'computing', 'arts'], e: '🌌', t: 'Mandelbrot explorer', b: 'Click to zoom into infinite complexity made from one line of algebra.',
    how: 'For each point c in the complex plane, repeat z → z² + c starting from 0. If z stays bounded, c is in the Mandelbrot set (black). Colors show how fast other points escape. The boundary has infinite detail: zoom forever and new shapes keep appearing.',
    use: 'Fractals describe coastlines, clouds, blood vessels, lungs and markets (Mandelbrot studied cotton prices). They compress images and generate landscapes in films and games.',
    m(el, K) {
      const P = K.canvas(el, 420); let cx = -0.6, cy = 0, sc = 3, it = 120; const out = K.out('tiny muted');
      const draw = () => { const W = Math.floor(P.W), H = Math.floor(P.H); if (!W) return; const img = P.ctx.createImageData(W, H);
        for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) { const x0 = cx + (px / W - 0.5) * sc, y0 = cy + (py / H - 0.5) * sc * (H / W); let x = 0, y = 0, i = 0;
          while (x * x + y * y < 4 && i < it) { const t = x * x - y * y + x0; y = 2 * x * y + y0; x = t; i++; }
          const o = (py * W + px) * 4; if (i === it) { img.data[o + 3] = 255; } else { const t = i / it; img.data[o] = 9 + 246 * Math.sqrt(t); img.data[o + 1] = 30 + 200 * t; img.data[o + 2] = 120 + 135 * (1 - t); img.data[o + 3] = 255; } }
        P.ctx.setTransform(1, 0, 0, 1, 0, 0); P.ctx.putImageData(img, 0, 0); const d = Math.min(2, devicePixelRatio || 1); P.ctx.setTransform(d, 0, 0, d, 0, 0);
        // draw image at css size: re-scale by drawing canvas onto itself
        if (d !== 1) { P.ctx.drawImage(P.c, 0, 0, W, H, 0, 0, W, H); }
        out.textContent = `Center ${cx.toFixed(6)} + ${cy.toFixed(6)}i · zoom ×${(3 / sc).toFixed(0)}`; };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); cx += (x / P.W - 0.5) * sc; cy += (y / P.H - 0.5) * sc * (P.H / P.W); sc /= 3; it = Math.min(1500, it + 60); draw(); };
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.btn('Zoom out', () => { sc *= 3; draw(); }), K.btn('Reset', () => { cx = -0.6; cy = 0; sc = 3; it = 120; draw(); }), K.btn('Seahorse valley', () => { cx = -0.745; cy = 0.11; sc = 0.02; it = 600; draw(); }, true)), out); draw();
    } });

  A({ id: 'compound', d: ['math', 'economics'], e: '💰', t: 'Compound growth', b: 'Linear vs exponential: how saving early and steady growth rates change everything.',
    how: 'Simple growth adds the same amount each year. Compound growth multiplies: interest earns interest. A rough rule: money doubles every 72 ÷ rate years (the Rule of 72). Small differences in rate become huge over decades.',
    use: 'Savings, debt, inflation, population, GDP, viruses and investment returns all compound. It is also why fees of 1–2% a year can eat a large share of long-term investment returns.',
    m(el, K) {
      const P = K.canvas(el, 340); const s = { p: 1000, add: 200, r: 7, y: 40, fee: 0 }; const out = K.kpis([['Final (compound)', h('b')], ['Final (no growth)', h('b')], ['Doubles every', h('b')], ['Lost to fees', h('b')]]);
      const sim = (r) => { let v = s.p; const a = [v]; for (let t = 1; t <= s.y; t++) { v = v * (1 + r / 100) + s.add * 12; a.push(v); } return a; };
      const draw = () => { const c = sim(s.r - s.fee), nofee = sim(s.r), lin = Array.from({ length: s.y + 1 }, (_, t) => s.p + s.add * 12 * t); const mx = Math.max(...nofee);
        P.clear(); const { X, Y } = P.chart(0, s.y, 0, mx, { fy: (v) => '$' + Lab.fmt(v / 1000) + 'k', xl: 'years', pl: 56 });
        P.line(lin.map((v, i) => [X(i), Y(v)]), '#94A3B8', 2, [5, 4]); if (s.fee) P.line(nofee.map((v, i) => [X(i), Y(v)]), '#16A34A55', 2); P.line(c.map((v, i) => [X(i), Y(v)]), '#16A34A', 3);
        const b = out.querySelectorAll('b'); b[0].textContent = '$' + Lab.fmt(c[s.y]); b[1].textContent = '$' + Lab.fmt(lin[s.y]); b[2].textContent = (72 / Math.max(0.1, s.r - s.fee)).toFixed(1) + ' yrs'; b[3].textContent = '$' + Lab.fmt(nofee[s.y] - c[s.y]); };
      P.onResize = draw;
      el.append(K.two(h('div', null, K.slider('Starting amount $', 0, 20000, 100, s.p, (v) => { s.p = v; draw(); }), K.slider('Added per month $', 0, 2000, 10, s.add, (v) => { s.add = v; draw(); })), h('div', null, K.slider('Growth rate % per year', 0, 15, 0.1, s.r, (v) => { s.r = v; draw(); }), K.slider('Years', 1, 60, 1, s.y, (v) => { s.y = v; draw(); }), K.slider('Annual fee %', 0, 3, 0.1, 0, (v) => { s.fee = v; draw(); }))), out);
      Lab.apply && el.append(Lab.apply('Historic US stock returns averaged around 7% a year after inflation, with big swings. Past returns are no guarantee.')); draw();
    } });

  A({ id: 'logistic', d: ['math', 'biology', 'physics'], e: '🦋', t: 'Road to chaos', b: 'One simple population equation goes from stable to cycles to chaos as you turn a dial.',
    how: 'The logistic map x → r·x·(1 − x) models a population limited by food. Low r: it settles. Above 3: it flips between 2 values, then 4, 8… (period doubling). Above about 3.57: chaos, where tiny differences explode. Robert May showed this in 1976.',
    use: 'Chaos theory explains why weather can’t be forecast more than about two weeks ahead, why some animal populations boom and crash, and irregular heartbeats. The doubling ratio (Feigenbaum’s constant 4.669…) appears in fluids and electronics too.',
    m(el, K) {
      const P = K.canvas(el, 360); let r = 3.2; const out = K.out();
      const draw = () => { P.clear(); const W = P.W, H = P.H, top = H * 0.48;
        P.ctx.fillStyle = '#2563EB'; for (let px = 0; px < W; px += 1) { const rr = 2.5 + (px / W) * 1.5; let x = 0.5; for (let i = 0; i < 200; i++) x = rr * x * (1 - x); for (let i = 0; i < 80; i++) { x = rr * x * (1 - x); P.ctx.fillRect(px, top - x * (top - 10), 1, 1); } }
        const rx = ((r - 2.5) / 1.5) * W; P.line([[rx, 0], [rx, top]], '#DC2626', 1.5); P.text('r = 2.5', 4, top + 14, { c: K.css('--muted') }); P.text('r = 4', W - 40, top + 14, { c: K.css('--muted') });
        let x = 0.2; const seq = []; for (let i = 0; i < 60; i++) { seq.push(x); x = r * x * (1 - x); }
        const b0 = top + 24, bh = H - b0 - 6; P.line(seq.map((v, i) => [10 + (i / 59) * (W - 20), b0 + bh - v * bh]), '#DC2626', 2);
        out.textContent = r < 3 ? 'Stable: the population settles on one value.' : r < 3.449 ? 'Two-cycle: boom, bust, boom, bust.' : r < 3.5699 ? 'Period doubling: 4, then 8, then 16 values.' : 'Chaos: never repeats, and tiny changes in the start give totally different futures.'; };
      P.onResize = draw; el.append(K.slider('Growth rate r', 2.5, 4, 0.001, r, (v) => { r = v; draw(); }), out, h('p', { class: 'tiny muted' }, 'Top: the bifurcation diagram (all long-run values for every r). Bottom: 60 generations at your r.')); draw();
    } });

  A({ id: 'fourier', d: ['math', 'physics', 'engineering', 'arts'], e: '〰️', t: 'Build any wave from circles', b: 'Add spinning circles (sine waves) to build square, sawtooth and triangle waves.',
    how: 'Joseph Fourier showed in 1807 that any repeating signal is a sum of simple sine waves. A square wave is sin(x) + sin(3x)/3 + sin(5x)/5 + … Each term is a circle spinning on the tip of the last one.',
    use: 'MP3 and JPEG compression, Wi-Fi and 5G, MRI scanners, earthquake analysis, voice assistants and music synthesizers all rely on breaking signals into frequencies.',
    m(el, K) {
      const P = K.canvas(el, 360); let n = 5, type = 'square'; const wave = [];
      const terms = () => { const t = []; for (let k = 1; t.length < n; k++) { if (type === 'square' && k % 2) t.push([k, 4 / (Math.PI * k)]); if (type === 'saw') t.push([k, (2 / (Math.PI * k)) * (k % 2 ? 1 : -1)]); if (type === 'triangle' && k % 2) t.push([k, (8 / (Math.PI * Math.PI * k * k)) * (((k - 1) / 2) % 2 ? -1 : 1)]); } return t; };
      el.append(K.choice([['square', 'Square'], ['saw', 'Sawtooth'], ['triangle', 'Triangle']], type, (v) => { type = v; wave.length = 0; }), K.slider('Number of circles', 1, 50, 1, n, (v) => { n = v; wave.length = 0; }));
      K.raf((t) => { P.clear(); const R = Math.min(70, P.H / 4.5); let x = R * 1.6 + 10, y = P.H / 2; const T = terms();
        T.forEach(([k, a]) => { const r = a * R; P.ctx.strokeStyle = '#94A3B866'; P.ctx.beginPath(); P.ctx.arc(x, y, Math.abs(r), 0, 7); P.ctx.stroke(); const nx = x + r * Math.cos(k * t * 1.5), ny = y + r * (type === 'triangle' ? Math.sin(k * t * 1.5) : Math.sin(k * t * 1.5)); P.line([[x, y], [nx, ny]], '#2563EB', 1.5); x = nx; y = ny; });
        wave.unshift(y); if (wave.length > 600) wave.pop(); const wx = R * 3.4 + 20; P.line([[x, y], [wx, wave[0]]], '#DC2626', 1, [3, 3]); P.line(wave.map((v, i) => [wx + i * 0.8, v]), '#DC2626', 2); });
    } });

  A({ id: 'matrix', d: ['math', 'computing', 'physics'], e: '🔲', t: 'Matrices move space', b: 'A 2×2 matrix is a machine that stretches, rotates, shears or flips the whole plane.',
    how: 'The first column says where the arrow (1,0) lands; the second where (0,1) lands. Every other point follows. The determinant is how much areas get scaled; if it is 0 the plane is crushed onto a line.',
    use: 'Every 3D game and animated film moves objects with matrices; Google’s original PageRank was a giant matrix; neural networks are mostly matrix multiplications; quantum mechanics is written in them.',
    m(el, K) {
      const P = K.canvas(el, 380); const m = [1, 0, 0, 1]; const det = K.big();
      const draw = () => { P.clear(); const s = Math.min(P.W, P.H) / 8, cx = P.W / 2, cy = P.H / 2; const T = (x, y) => [cx + (m[0] * x + m[1] * y) * s, cy - (m[2] * x + m[3] * y) * s];
        for (let i = -6; i <= 6; i++) { P.line([[cx + i * s, 0], [cx + i * s, P.H]], K.css('--line'), 1); P.line([[0, cy - i * s], [P.W, cy - i * s]], K.css('--line'), 1); }
        for (let i = -6; i <= 6; i++) { P.line([T(i, -6), T(i, 6)], '#2563EB55', 1); P.line([T(-6, i), T(6, i)], '#2563EB55', 1); }
        P.ctx.fillStyle = '#CA8A0466'; P.ctx.beginPath(); [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([x, y], i) => { const [a, b] = T(x, y); i ? P.ctx.lineTo(a, b) : P.ctx.moveTo(a, b); }); P.ctx.fill();
        P.line([T(0, 0), T(1, 0)], '#16A34A', 4); P.line([T(0, 0), T(0, 1)], '#DC2626', 4);
        const d = m[0] * m[3] - m[1] * m[2]; det.innerHTML = `[[${m[0].toFixed(1)}, ${m[1].toFixed(1)}], [${m[2].toFixed(1)}, ${m[3].toFixed(1)}]] <small>determinant ${d.toFixed(2)}${d < 0 ? ' (flipped)' : d === 0 ? ' (crushed!)' : ''}</small>`; };
      P.onResize = draw; const sl = ['a (x→x)', 'b (y→x)', 'c (x→y)', 'd (y→y)'].map((l, i) => K.slider(l, -3, 3, 0.1, m[i], (v) => { m[i] = v; draw(); }));
      const preset = (a, l) => K.btn(l, () => { a.forEach((v, i) => { m[i] = v; sl[i].set(v); }); draw(); });
      el.append(K.two(h('div', null, sl[0], sl[1]), h('div', null, sl[2], sl[3])), h('div', { class: 'row' }, preset([1, 0, 0, 1], 'Identity'), preset([0, -1, 1, 0], 'Rotate 90°'), preset([1, 1, 0, 1], 'Shear'), preset([-1, 0, 0, 1], 'Mirror'), preset([2, 0, 0, 0.5], 'Squash'), preset([1, 2, 0.5, 1], 'Crush')), det); draw();
    } });

  A({ id: 'derivative', d: ['math', 'physics', 'economics'], e: '📈', t: 'Slope at a point', b: 'Shrink the gap between two points and watch a secant become the tangent: the derivative.',
    how: 'The slope between two points is rise ÷ run. Slide them together and the slope approaches one number: the instantaneous rate of change. Newton and Leibniz independently invented this in the 1660s–1680s.',
    use: 'Speed is the derivative of position; marginal cost is the derivative of total cost; doctors track the rate a tumor grows; every machine learning model trains by following derivatives downhill (gradient descent).',
    m(el, K) {
      const P = K.canvas(el, 360); const F = { 'x³ − 3x': [(x) => x ** 3 - 3 * x, (x) => 3 * x * x - 3], 'sin x': [Math.sin, Math.cos], 'eˣ / 4': [(x) => Math.exp(x) / 4, (x) => Math.exp(x) / 4] }; let f = 'x³ − 3x', x0 = 0.5, dx = 1.5; const out = K.out();
      const draw = () => { P.clear(); const [g, dg] = F[f]; const { X, Y } = P.chart(-3, 3, -5, 5);
        const pts = []; for (let x = -3; x <= 3; x += 0.02) pts.push([X(x), Y(Lab.clamp(g(x), -6, 6))]); P.line(pts, '#2563EB', 2.5);
        const x1 = x0 + dx, m = (g(x1) - g(x0)) / dx; P.line([[X(-3), Y(g(x0) + m * (-3 - x0))], [X(3), Y(g(x0) + m * (3 - x0))]], '#DC2626', 2);
        const t = dg(x0); P.line([[X(-3), Y(g(x0) + t * (-3 - x0))], [X(3), Y(g(x0) + t * (3 - x0))]], '#16A34A', 1.5, [5, 4]);
        P.dot(X(x0), Y(g(x0)), 6, '#111'); P.dot(X(x1), Y(g(x1)), 6, '#DC2626');
        out.innerHTML = `Secant slope (red) = <b>${m.toFixed(4)}</b> · true derivative (green) = <b>${t.toFixed(4)}</b> · gap = ${dx.toFixed(3)}`; };
      P.onResize = draw; el.append(K.choice(Object.keys(F), f, (v) => { f = v; draw(); }), K.slider('Point x', -2.5, 2.5, 0.01, x0, (v) => { x0 = v; draw(); }), K.slider('Gap between points (h)', 0.001, 2, 0.001, dx, (v) => { dx = v; draw(); }), out); draw();
    } });

  A({ id: 'riemann', d: ['math', 'physics'], e: '▦', t: 'Area under a curve', b: 'Fill a curve with rectangles. More, thinner rectangles converge on the exact area: the integral.',
    how: 'Archimedes used the same squeeze idea around 250 BC to find the area of a parabola. Add up thin rectangles; as they get thinner, the total approaches the integral. The Fundamental Theorem of Calculus links this area to the derivative.',
    use: 'Distance from a speed chart, total energy used, drug exposure in the blood over time (area under the curve, AUC), the probability of a range of outcomes, and the volume of objects.',
    m(el, K) {
      const P = K.canvas(el, 340); let n = 6, mode = 'mid'; const out = K.out(); const f = (x) => 1 + Math.sin(x) + x / 3; const exact = (a, b) => (b - a) + (Math.cos(a) - Math.cos(b)) + (b * b - a * a) / 6;
      const draw = () => { P.clear(); const a = 0, b = 6; const { X, Y } = P.chart(0, 6, 0, 4.5); const w = (b - a) / n; let sum = 0;
        for (let i = 0; i < n; i++) { const xl = a + i * w; const xs = mode === 'left' ? xl : mode === 'right' ? xl + w : xl + w / 2; const v = f(xs); sum += v * w; P.ctx.fillStyle = '#CA8A0444'; P.ctx.strokeStyle = '#CA8A04'; P.ctx.fillRect(X(xl), Y(v), X(xl + w) - X(xl), Y(0) - Y(v)); P.ctx.strokeRect(X(xl), Y(v), X(xl + w) - X(xl), Y(0) - Y(v)); }
        const pts = []; for (let x = 0; x <= 6; x += 0.02) pts.push([X(x), Y(f(x))]); P.line(pts, '#2563EB', 2.5);
        const ex = exact(a, b); out.innerHTML = `Rectangles: <b>${sum.toFixed(5)}</b> · exact integral: <b>${ex.toFixed(5)}</b> · error ${Math.abs(sum - ex).toFixed(5)}`; };
      P.onResize = draw; el.append(K.slider('Number of rectangles', 1, 200, 1, n, (v) => { n = v; draw(); }), K.choice([['left', 'Left'], ['mid', 'Middle'], ['right', 'Right']], mode, (v) => { mode = v; draw(); }), out); draw();
    } });

  A({ id: 'binary', d: ['math', 'computing'], e: '0️⃣', t: 'Flip the bits', b: 'Click bits to build numbers in binary and see them in decimal, hexadecimal and as a color.',
    how: 'Each place is worth double the one to its right (1, 2, 4, 8…), the same way decimal places are worth 10×. Eight bits make a byte (0–255). Leibniz described binary in 1703; Claude Shannon connected it to electrical circuits in 1937.',
    use: 'Every file, photo and message is stored as bits. Screen colors are three bytes (red, green, blue). IP addresses, permissions and compression all work at the bit level.',
    m(el, K) {
      const bits = Array(24).fill(0); const row = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '4px' } }); const out = h('div'); const sw = h('div', { style: { height: '60px', borderRadius: '12px', marginTop: '8px' } });
      const draw = () => { row.innerHTML = ''; ['Red', 'Green', 'Blue'].forEach((c, g) => { for (let i = 0; i < 8; i++) { const k = g * 8 + i; row.append(h('button', { class: 'btn', style: { padding: '8px 0', background: bits[k] ? ['#DC2626', '#16A34A', '#2563EB'][g] : null, color: bits[k] ? '#fff' : null, fontFamily: 'monospace' }, title: 2 ** (7 - i), onclick: () => { bits[k] ^= 1; draw(); } }, bits[k])); } });
        const val = (g) => bits.slice(g * 8, g * 8 + 8).reduce((a, b) => a * 2 + b, 0); const [r, g, b] = [0, 1, 2].map(val); const all = bits.reduce((a, b) => a * 2 + b, 0);
        out.innerHTML = `<div class="small" style="margin-top:8px">Place values in each row: 128 64 32 16 8 4 2 1</div><div class="kpi">${r}, ${g}, ${b} <small>decimal per byte · #${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()} hex · ${all.toLocaleString()} as one 24-bit number</small></div>`;
        sw.style.background = `rgb(${r},${g},${b})`; };
      el.append(h('p', { class: 'small muted' }, 'Three bytes: red, green, blue. Click to flip bits.'), row, out, sw, h('div', { class: 'row', style: { marginTop: '8px' } }, K.btn('Random', () => { bits.forEach((_, i) => (bits[i] = Math.random() < 0.5 ? 1 : 0)); draw(); }), K.btn('Clear', () => { bits.fill(0); draw(); })));
      K.quiz([['What is 1011 in decimal?', ['9', '11', '13', '1,011'], 1, '8 + 0 + 2 + 1 = 11.'], ['How many different values can one byte hold?', ['8', '100', '255', '256'], 3, '2⁸ = 256 (0 to 255).'], ['How many colors can a 24-bit screen show?', ['About 16.8 million', '256', '1 million', '24'], 0, '2²⁴ = 16,777,216.']], el); draw();
    } });

  A({ id: 'timescircle', d: ['math', 'arts'], e: '⭕', t: 'Times tables on a circle', b: 'Connect n to k×n around a circle and hidden shapes appear: cardioids, nephroids, roses.',
    how: 'Place points around a circle and join each point n to (k × n) mod total. This is modular (“clock”) arithmetic. Times 2 makes a cardioid, the heart shape you see as light reflects in a coffee cup; times 3 a nephroid.',
    use: 'Modular arithmetic runs cryptography, check digits on barcodes and credit cards, calendars and hash functions. The cardioid also appears in optics (caustics) and in the main bulb of the Mandelbrot set.',
    m(el, K) {
      const P = K.canvas(el, 440); let k = 2, N = 200, anim = false; const out = K.out();
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, R = Math.min(P.W, P.H) / 2 - 12; const p = (i) => [cx + R * Math.cos((2 * Math.PI * i) / N - Math.PI), cy + R * Math.sin((2 * Math.PI * i) / N - Math.PI)];
        P.ctx.lineWidth = 0.8; for (let i = 0; i < N; i++) { P.ctx.strokeStyle = `hsl(${(i / N) * 360},70%,50%)`; P.ctx.beginPath(); P.ctx.moveTo(...p(i)); P.ctx.lineTo(...p((i * k) % N)); P.ctx.stroke(); } out.textContent = `×${k.toFixed(2)} on ${N} points`; };
      P.onResize = draw; const ks = K.slider('Multiplier k', 2, 60, 0.01, k, (v) => { k = v; draw(); });
      el.append(ks, K.slider('Points', 10, 500, 1, N, (v) => { N = v; draw(); }), K.btn('▶ Animate', () => (anim = !anim), true), out);
      K.raf(() => { if (anim) { k += 0.005; if (k > 60) k = 2; ks.set(+k.toFixed(2)); draw(); } }); draw();
    } });

  A({ id: 'zeno', d: ['math', 'philosophy'], e: '🐢', t: 'Zeno’s paradox', b: 'Can you reach a wall by always going half the remaining distance? Infinite steps, finite sum.',
    how: 'Zeno of Elea (about 450 BC) argued motion is impossible because you must first complete infinitely many half-steps. The answer took 2,000 years: an infinite series can add to a finite number. 1/2 + 1/4 + 1/8 + … = 1.',
    use: 'Infinite series are the basis of calculus, compound interest formulas, the present value of a perpetuity in finance, and how calculators compute sin, cos and e.',
    m(el, K) {
      const P = K.canvas(el, 220); let n = 1; const out = K.big();
      const draw = () => { P.clear(); const x0 = 20, w = P.W - 40, y = 90; let s = 0; P.line([[x0, y], [x0 + w, y]], K.css('--line'), 2); P.line([[x0 + w, 40], [x0 + w, 140]], '#DC2626', 4);
        for (let i = 1; i <= n; i++) { const a = s; s += 1 / 2 ** i; P.rect(x0 + a * w, y - 12, (s - a) * w - 1, 24, K.pal[i % 8] + 'AA'); if (i < 7) P.text('1/' + 2 ** i, x0 + ((a + s) / 2) * w, y + 34, { a: 'center' }); }
        P.text('🐢', x0 + s * w - 10, y - 20, { s: 22 }); out.innerHTML = `Sum after ${n} steps = ${s.toFixed(n > 15 ? 12 : 6)} <small>remaining gap ${(1 - s).toExponential(2)}</small>`; };
      P.onResize = draw; el.append(K.slider('Steps', 1, 40, 1, 1, (v) => { n = v; draw(); }), out); draw();
    } });

  A({ id: 'birthday', d: ['math', 'statistics'], e: '🎂', t: 'Birthday paradox', b: 'How many people before two share a birthday? Far fewer than you think.',
    how: 'With 23 people there are 253 possible pairs, so a match is more likely than not (50.7%). With 70 people it is 99.9%. Our intuition compares each person only to ourselves, not every pair.',
    use: '“Birthday attacks” break weak cryptographic hashes; it explains surprising coincidences in DNA databases and lotteries; engineers use it to size ID systems so collisions stay rare.',
    m(el, K) {
      const P = K.canvas(el, 300); let n = 23; const out = K.out(); const room = h('div', { class: 'small', style: { marginTop: '8px', lineHeight: 1.8 } });
      const pr = (k) => { let q = 1; for (let i = 0; i < k; i++) q *= (365 - i) / 365; return 1 - q; };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 80, 0, 1, { fy: (v) => Math.round(v * 100) + '%', xl: 'people' }); const pts = []; for (let k = 0; k <= 80; k++) pts.push([X(k), Y(pr(k))]); P.line(pts, '#2563EB', 3); P.dot(X(n), Y(pr(n)), 7, '#DC2626'); out.innerHTML = `With <b>${n}</b> people: <b>${(pr(n) * 100).toFixed(1)}%</b> chance of a shared birthday.`; };
      const sim = () => { const d = Array.from({ length: n }, () => K.ri(1, 365)); const seen = {}; let dup = null; d.forEach((x) => { if (seen[x]) dup = x; seen[x] = 1; }); const day = (x) => new Date(2025, 0, x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        room.innerHTML = d.map((x) => `<span style="padding:2px 6px;border-radius:6px;background:${x === dup ? '#DC2626' : 'var(--card2)'};color:${x === dup ? '#fff' : 'inherit'}">${day(x)}</span>`).join(' ') + `<div><b>${dup ? 'Match: ' + day(dup) : 'No match this time'}</b></div>`; };
      P.onResize = draw; el.append(K.slider('People in the room', 2, 80, 1, n, (v) => { n = v; draw(); }), out, K.btn('🎲 Fill a random room', sim, true), room); draw();
    } });

  A({ id: 'rsa', d: ['math', 'computing', 'history'], e: '🔐', t: 'Secret codes: Caesar to RSA', b: 'Break a Caesar cipher by counting letters, then send a message with a toy version of RSA.',
    how: 'Caesar shifted letters by 3; it falls to frequency analysis, invented by al-Kindi in the 800s, because E is the most common English letter. RSA (1977) uses two large primes: anyone can encrypt with the public key (n, e), but decrypting needs d, which requires knowing n’s prime factors. Multiplying primes is easy; factoring their product is very hard.',
    use: 'RSA and its successors protect online banking, HTTPS, messaging apps and digital signatures. Codebreaking at Bletchley Park shortened World War II. Quantum computers could one day break RSA, which is why “post-quantum” cryptography is being rolled out.',
    m(el, K) {
      const inp = h('input', { type: 'text', value: 'MEET ME AT THE OLD BRIDGE AT SEVEN', style: { width: '100%' } }); let sh = 3; const ct = h('div', { style: { fontFamily: 'monospace', fontSize: '16px', margin: '8px 0' } }); const freq = h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '90px' } });
      const enc = (s, k) => s.toUpperCase().replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65));
      const drawC = () => { const c = enc(inp.value, sh); ct.textContent = c; const f = Array(26).fill(0); c.replace(/[A-Z]/g, (x) => f[x.charCodeAt(0) - 65]++); const m = Math.max(1, ...f); freq.innerHTML = ''; f.forEach((v, i) => freq.append(h('div', { style: { flex: 1, textAlign: 'center' } }, h('div', { style: { height: (v / m) * 70 + 'px', background: '#2563EB', borderRadius: '3px 3px 0 0' } }), h('div', { class: 'tiny' }, String.fromCharCode(65 + i))))); };
      inp.oninput = drawC; const crack = h('div', { class: 'small' });
      el.append(h('h3', null, '1. Caesar cipher'), inp, K.slider('Shift', 1, 25, 1, sh, (v) => { sh = v; drawC(); }), ct, h('div', { class: 'tiny muted' }, 'Letter counts in the coded message:'), freq,
        K.btn('🔓 Crack it by frequency', () => { const c = enc(inp.value, sh); const f = Array(26).fill(0); c.replace(/[A-Z]/g, (x) => f[x.charCodeAt(0) - 65]++); const top = f.indexOf(Math.max(...f)); const guess = (top - 4 + 26) % 26; crack.innerHTML = `Most common coded letter is <b>${String.fromCharCode(65 + top)}</b>. Assume it stands for E → shift ${guess}: <b>${enc(c, -guess)}</b>`; }, true), crack);
      const pr = h('div', { class: 'small', style: { marginTop: '6px' } }); const msg = h('input', { type: 'number', value: 42, min: 2, max: 3000, style: { width: '110px' } });
      const modpow = (b, e, m) => { let r = 1n; b = BigInt(b) % m; e = BigInt(e); while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; } return r; };
      const go = () => { const p = 61n, q = 53n, n = p * q, phi = (p - 1n) * (q - 1n), e = 17n, d = 2753n; const M = BigInt(Math.max(2, Math.min(3000, +msg.value || 2))); const C = modpow(M, e, n), back = modpow(C, d, n);
        pr.innerHTML = `Primes p = 61, q = 53 → public key n = ${n}, e = ${e}. Private key d = ${d} (because e×d ≡ 1 mod ${phi}).<br>Encrypt: ${M}<sup>17</sup> mod 3233 = <b>${C}</b>. Decrypt: ${C}<sup>2753</sup> mod 3233 = <b>${back}</b>.<br><span class="muted">Real RSA uses primes over 300 digits long, so n can’t be factored.</span>`; };
      el.append(h('h3', null, '2. Toy RSA'), h('div', { class: 'row' }, h('label', { class: 'ctl' }, 'Your secret number (2–3000)'), msg, K.btn('Encrypt & decrypt', go, true)), pr); drawC(); go();
    } });

  A({ id: 'polyhedra', d: ['math', 'chemistry', 'arts'], e: '💠', t: 'The five perfect solids', b: 'Spin the Platonic solids and test Euler’s formula V − E + F = 2.',
    how: 'Only five solids have identical regular faces with the same number meeting at every corner; Euclid proved there can be no others. For any such solid, vertices − edges + faces = 2 (Euler, 1758), the first result of topology.',
    use: 'Viruses form icosahedral shells; methane is a tetrahedron; crystals and dice use these shapes; Buckminster Fuller’s domes and the C₆₀ “buckyball” molecule are cousins.',
    m(el, K) {
      const t = (1 + Math.sqrt(5)) / 2;
      const S = { Tetrahedron: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], Cube: [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))), Octahedron: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
        Icosahedron: [[0, 1, t], [0, 1, -t], [0, -1, t], [0, -1, -t], [1, t, 0], [1, -t, 0], [-1, t, 0], [-1, -t, 0], [t, 0, 1], [t, 0, -1], [-t, 0, 1], [-t, 0, -1]],
        Dodecahedron: [...[-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))), ...[-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [[0, a / t, b * t], [a / t, b * t, 0], [a * t, 0, b / t]]))] };
      const F = { Tetrahedron: 4, Cube: 6, Octahedron: 8, Icosahedron: 20, Dodecahedron: 12 }; let cur = 'Cube';
      const edges = (V) => { const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); let m = Infinity; V.forEach((a, i) => V.forEach((b, j) => { if (i < j) m = Math.min(m, d(a, b)); })); const E = []; V.forEach((a, i) => V.forEach((b, j) => { if (i < j && d(a, b) < m * 1.01) E.push([i, j]); })); return E; };
      const P = K.canvas(el, 360); const out = K.big();
      el.append(K.choice(Object.keys(S), cur, (v) => (cur = v)), out);
      K.raf((tt) => { const V = S[cur], E = edges(V); P.clear(); const s = Math.min(P.W, P.H) / 4.2 / (cur === 'Icosahedron' || cur === 'Dodecahedron' ? 1.7 : 1.1); const a = tt * 0.6, b = tt * 0.37;
        const pr = ([x, y, z]) => { const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a); const y1 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b); const k = 4 / (4 + z2 * 0.5); return [P.W / 2 + x1 * s * k, P.H / 2 + y1 * s * k, z2]; };
        const Q = V.map(pr); E.forEach(([i, j]) => P.line([Q[i], Q[j]], (Q[i][2] + Q[j][2]) / 2 > 0 ? '#2563EB' : '#2563EB55', 2.5)); Q.forEach(([x, y]) => P.dot(x, y, 4, '#DC2626'));
        out.innerHTML = `V ${V.length} − E ${E.length} + F ${F[cur]} = <b>${V.length - E.length + F[cur]}</b>`; });
    } });

  A({ id: 'voronoi', d: ['math', 'geopolitics', 'biology', 'computing'], e: '🗺️', t: 'Who is closest? Voronoi maps', b: 'Click to drop towns. Every spot is colored by its nearest town.',
    how: 'A Voronoi diagram splits space by nearest point. John Snow used the idea in 1854 to show cholera deaths clustered around one London water pump, a founding moment of epidemiology.',
    use: 'Placing hospitals, schools, cell towers and stores; mapping animal territories and cell patterns; game level design; the shape of giraffe spots and dragonfly wings resemble them.',
    m(el, K) {
      const P = K.canvas(el, 400); const pts = Array.from({ length: 8 }, () => [Math.random(), Math.random()]); const out = K.out('tiny muted');
      const draw = () => { const W = Math.floor(P.W), H = Math.floor(P.H), st = 4; for (let y = 0; y < H; y += st) for (let x = 0; x < W; x += st) { let b = 0, bd = Infinity; pts.forEach(([px, py], i) => { const d = (px * W - x) ** 2 + (py * H - y) ** 2; if (d < bd) { bd = d; b = i; } }); P.rect(x, y, st, st, `hsl(${(b * 137.5) % 360},65%,${72}%)`); }
        pts.forEach(([x, y]) => P.dot(x * W, y * H, 5, '#111')); out.textContent = `${pts.length} towns. Click to add one, shift-click to remove the nearest.`; };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); if (e.shiftKey && pts.length > 1) { let b = 0, bd = Infinity; pts.forEach(([px, py], i) => { const d = (px * P.W - x) ** 2 + (py * P.H - y) ** 2; if (d < bd) { bd = d; b = i; } }); pts.splice(b, 1); } else pts.push([x / P.W, y / P.H]); draw(); };
      P.onResize = draw; el.append(out, K.btn('Clear', () => { pts.splice(0, pts.length, [0.5, 0.5]); draw(); })); draw();
    } });

  A({ id: 'eratosthenes', d: ['math', 'earthspace', 'history'], e: '🌍', t: 'Measure the Earth with a stick', b: 'Redo Eratosthenes’ 240 BC experiment: two shadows, one distance, the size of the planet.',
    how: 'At noon on the solstice the sun was straight overhead at Syene (no shadow), while a stick in Alexandria cast a shadow at about 7.2°, one fiftieth of a circle. So the Earth’s circumference is about 50 × the distance between the cities.',
    use: 'The same angle reasoning drives navigation, surveying, GPS and astronomy, including measuring distances to stars by parallax.',
    m(el, K) {
      const P = K.canvas(el, 320); let ang = 7.2, dist = 800; const out = K.big();
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H + 120, R = 300; P.ctx.strokeStyle = '#2563EB'; P.ctx.lineWidth = 3; P.ctx.beginPath(); P.ctx.arc(cx, cy, R, Math.PI * 1.25, Math.PI * 1.75); P.ctx.stroke();
        const a1 = -Math.PI / 2, a2 = a1 - (ang * Math.PI) / 180 * 3; [a1, a2].forEach((a, i) => { const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), x2 = cx + (R + 40) * Math.cos(a), y2 = cy + (R + 40) * Math.sin(a); P.line([[x, y], [x2, y2]], '#111', 3); P.text(i ? 'Alexandria' : 'Syene', x2, y2 - 8, { a: 'center' }); });
        for (let i = 0; i < 5; i++) P.line([[20 + i * 30, 0], [20 + i * 30, 60]], '#CA8A04', 1.5); P.text('☀ parallel sun rays', 10, 76, { c: '#CA8A04' });
        P.line([[cx, cy], [cx + R * Math.cos(a1), cy + R * Math.sin(a1)]], '#94A3B8', 1, [4, 4]); P.line([[cx, cy], [cx + R * Math.cos(a2), cy + R * Math.sin(a2)]], '#94A3B8', 1, [4, 4]);
        const C = (360 / ang) * dist; out.innerHTML = `Circumference ≈ 360 ÷ ${ang}° × ${dist} km = <b>${Lab.fmt(C)} km</b> <small>(true value ≈ 40,075 km; angles drawn 3× bigger)</small>`; };
      P.onResize = draw; el.append(K.slider('Shadow angle in Alexandria (°)', 1, 20, 0.1, ang, (v) => { ang = v; draw(); }), K.slider('Distance between cities (km)', 200, 2000, 10, dist, (v) => { dist = v; draw(); }), out); draw();
    } });

  A({ id: 'benford', d: ['math', 'statistics', 'law', 'economics'], e: '1️⃣', t: 'Benford’s law & fraud', b: 'In real data, about 30% of numbers start with 1. Fake numbers usually don’t.',
    how: 'Many real-world quantities grow by multiplying, so they spread evenly on a log scale. That makes leading 1s far more common (log₁₀2 ≈ 30.1%) than leading 9s (4.6%). People inventing numbers tend to spread digits evenly.',
    use: 'Forensic accountants and tax agencies flag suspicious accounts with it; it has been used to question election results and scientific data, though experts warn it is a screening tool, not proof.',
    m(el, K) {
      const P = K.canvas(el, 300); let src = 'growth'; const out = K.out();
      const gen = () => { const a = []; for (let i = 0; i < 3000; i++) { if (src === 'growth') a.push(100 * Math.exp(K.rnd(0, 9))); else if (src === 'pop') a.push(Math.exp(K.rnd(Math.log(500), Math.log(4e7)))); else if (src === 'fake') a.push(K.ri(100, 999)); else a.push(2 ** K.ri(1, 300)); } return a; };
      const draw = () => { const a = gen(); const c = Array(10).fill(0); a.forEach((v) => c[+String(v).replace(/[^1-9]/, '')[0] || 1]++); P.clear(); const { X, Y } = P.chart(0.5, 9.5, 0, 0.4, { fy: (v) => Math.round(v * 100) + '%', noX: true });
        for (let d = 1; d <= 9; d++) { const f = c[d] / a.length; P.rect(X(d) - 14, Y(f), 28, Y(0) - Y(f), '#2563EB'); P.dot(X(d), Y(Math.log10(1 + 1 / d)), 5, '#DC2626'); P.text(d, X(d), P.H - 8, { a: 'center' }); }
        out.innerHTML = '<span style="color:#2563EB">■ your data</span> · <span style="color:#DC2626">● Benford prediction</span>'; };
      P.onResize = draw; el.append(K.choice([['growth', 'Compound growth'], ['pop', 'Town populations (simulated)'], ['pow', 'Powers of 2'], ['fake', 'Made-up 3-digit numbers']], src, (v) => { src = v; draw(); }), out); draw();
    } });

  A({ id: 'gametheory', d: ['math', 'economics', 'politics', 'biology'], e: '🤝', t: 'Prisoner’s dilemma tournament', b: 'Pick strategies and run Axelrod’s famous tournament. Does niceness win?',
    how: 'Each round, two players cooperate or defect. Defecting is tempting (5 vs 3 points), but if both defect each gets 1. In 1980 Robert Axelrod ran a computer tournament: the simplest strategy, Tit-for-Tat (copy your opponent’s last move), won. Being nice, retaliatory, forgiving and clear pays off over repeated games.',
    use: 'Arms races, price wars, climate treaties, trade, evolution of cooperation among animals, and business partnerships. Game theory earned several Nobel prizes in economics (Nash, Schelling, Ostrom-related work).',
    m(el, K) {
      const ST = { 'Tit-for-Tat': (m, o) => (o.length ? o[o.length - 1] : 'C'), 'Always cooperate': () => 'C', 'Always defect': () => 'D', 'Random': () => (Math.random() < 0.5 ? 'C' : 'D'), 'Grudger': (m, o) => (o.includes('D') ? 'D' : 'C'), 'Forgiving TFT': (m, o) => (o.length && o[o.length - 1] === 'D' && Math.random() > 0.1 ? 'D' : 'C'), 'Detective': (m, o) => (m.length < 4 ? 'CDCC'[m.length] : o.slice(0, 4).includes('D') ? o[o.length - 1] : 'D') };
      const pay = { CC: [3, 3], CD: [0, 5], DC: [5, 0], DD: [1, 1] }; const on = new Set(Object.keys(ST)); const chips = h('div', { class: 'row' }); const res = h('div'); let rounds = 200, noise = 0;
      const drawChips = () => { chips.innerHTML = ''; Object.keys(ST).forEach((k) => chips.append(h('span', { class: 'chip' + (on.has(k) ? ' on' : ''), style: { '--c': '#2563EB' }, onclick: () => { on.has(k) ? on.delete(k) : on.add(k); drawChips(); } }, k))); };
      const run = () => { const ps = [...on]; const sc = Object.fromEntries(ps.map((p) => [p, 0]));
        ps.forEach((a, i) => ps.forEach((b, j) => { if (j < i) return; const ma = [], mb = []; for (let r = 0; r < rounds; r++) { let x = ST[a](ma, mb), y = ST[b](mb, ma); if (Math.random() < noise) x = x === 'C' ? 'D' : 'C'; if (Math.random() < noise) y = y === 'C' ? 'D' : 'C'; ma.push(x); mb.push(y); const [pa, pb] = pay[x + y]; sc[a] += pa; if (a !== b) sc[b] += pb; } }));
        const rank = Object.entries(sc).sort((x, y) => y[1] - x[1]); const mx = rank[0][1]; res.innerHTML = ''; rank.forEach(([k, v], i) => res.append(h('div', { class: 'row', style: { margin: '4px 0' } }, h('span', { style: { width: '150px' }, class: 'small' }, (i + 1) + '. ' + k), h('div', { style: { flex: 1, height: '16px', background: 'var(--card2)', borderRadius: '8px' } }, h('div', { style: { width: (v / mx) * 100 + '%', height: '100%', background: i ? '#94A3B8' : '#16A34A', borderRadius: '8px' } })), h('b', { class: 'small' }, Lab.fmt(v))))); };
      el.append(h('p', { class: 'small' }, 'Payoffs: both cooperate 3/3 · both defect 1/1 · betray a cooperator 5/0.'), chips, K.slider('Rounds per match', 1, 500, 1, rounds, (v) => (rounds = v)), K.slider('Mistakes (noise)', 0, 0.2, 0.01, 0, (v) => (noise = v), (v) => Math.round(v * 100) + '%'), K.btn('▶ Run tournament', run, true), res,
        h('p', { class: 'tiny muted' }, 'Try 1 round: defecting wins. Try 200 rounds: cooperators who retaliate win. Add noise and see why forgiveness matters.')); drawChips(); run();
    } });

  A({ id: 'fermi', d: ['math', 'physics', 'economics'], e: '🧮', t: 'Fermi estimation', b: 'How many piano tuners in Chicago? Break impossible questions into guessable pieces.',
    how: 'Enrico Fermi famously estimated the energy of the first atomic bomb test by dropping scraps of paper and watching how far they blew. Break a question into factors you can roughly guess; errors in different factors partly cancel, so the answer is often within a factor of 2–3.',
    use: 'Startups size markets this way; consultants and engineers sanity-check plans; scientists estimate whether an idea is even possible before doing the detailed math.',
    m(el, K) {
      const Q = [{ q: 'Piano tuners in Chicago', f: [['People in Chicago', 2.7e6], ['People per household', 1 / 2.5], ['Share of households with a piano', 0.05], ['Tunings per piano per year', 1], ['Tunings one tuner does per year', 1 / 1000]], real: '≈ 80–300 (estimates vary)' },
        { q: 'Heartbeats in a lifetime', f: [['Beats per minute', 70], ['Minutes per day', 1440], ['Days per year', 365], ['Years of life', 79]], real: '≈ 2–3 billion' },
        { q: 'Gallons of gasoline the US uses per year', f: [['Cars in the US', 2.8e8], ['Miles per car per year', 12000], ['Gallons per mile (1 / mpg)', 1 / 25]], real: '≈ 135 billion gallons (EIA, 2023)' }];
      let qi = 0; const box = h('div');
      const draw = () => { const C = Q[qi]; box.innerHTML = ''; const res = h('div', { class: 'kpi' }); const ins = C.f.map(([l, v]) => { const i = h('input', { type: 'number', value: +v.toPrecision(3), step: 'any', style: { width: '140px' } }); i.oninput = calc; box.append(h('div', { class: 'row' }, h('span', { class: 'small', style: { width: '260px' } }, l), i)); return i; });
        function calc() { const v = ins.reduce((a, i) => a * (+i.value || 0), 1); res.innerHTML = Lab.fmt(v) + ` <small>reality: ${C.real}</small>`; }
        box.append(h('div', { style: { marginTop: '8px' } }, 'Multiply them:'), res); calc(); };
      el.append(K.choice(Q.map((x, i) => [i, x.q]), 0, (v) => { qi = v; draw(); }), h('p', { class: 'tiny muted' }, 'Change the guesses: notice how the answer only moves a little if each guess is roughly right.'), box); draw();
    } });

  A({ id: 'hanoi', d: ['math', 'computing', 'logic'], e: '🗼', t: 'Tower of Hanoi', b: 'Move the tower one disk at a time, never big on small. Then watch recursion solve it.',
    how: 'To move n disks: move n−1 out of the way, move the biggest, then move n−1 back on top. That is recursion: solving a problem with a smaller copy of itself. The minimum is 2ⁿ − 1 moves; legend says monks moving 64 golden disks would need 585 billion years.',
    use: 'Recursion is everywhere in computer science: searching folders, sorting (merge sort), parsing languages, fractals, and backup rotation schemes literally named after Hanoi.',
    m(el, K) {
      const P = K.canvas(el, 280); let n = 4, pegs, sel = null, moves = 0, auto = null; const out = K.out();
      const reset = () => { pegs = [Array.from({ length: n }, (_, i) => n - i), [], []]; sel = null; moves = 0; auto = null; draw(); };
      const draw = () => { P.clear(); const pw = P.W / 3, base = P.H - 20, dh = Math.min(26, (P.H - 60) / n);
        pegs.forEach((pg, i) => { const cx = pw * i + pw / 2; P.rect(cx - 4, 40, 8, base - 40, i === sel ? '#DC2626' : '#94A3B8'); P.rect(pw * i + 10, base, pw - 20, 6, '#94A3B8'); pg.forEach((d, j) => { const w = 30 + (d / n) * (pw - 50); P.rect(cx - w / 2, base - (j + 1) * dh, w, dh - 3, K.pal[d % 8]); }); });
        out.textContent = `Moves: ${moves} (minimum ${2 ** n - 1})` + (pegs[2].length === n ? ' 🎉 Solved!' : ''); };
      const move = (a, b) => { if (!pegs[a].length) return false; const d = pegs[a][pegs[a].length - 1]; if (pegs[b].length && pegs[b][pegs[b].length - 1] < d) return false; pegs[b].push(pegs[a].pop()); moves++; return true; };
      P.c.onclick = (e) => { const [x] = P.pt(e); const i = Math.floor(x / (P.W / 3)); if (sel === null) sel = pegs[i].length ? i : null; else { move(sel, i); sel = null; } draw(); };
      const solve = () => { reset(); const seq = []; const rec = (k, a, b, c) => { if (!k) return; rec(k - 1, a, c, b); seq.push([a, c]); rec(k - 1, b, a, c); }; rec(n, 0, 1, 2); auto = seq; };
      K.every(350, () => { if (auto && auto.length) { move(...auto.shift()); draw(); } });
      P.onResize = () => pegs && draw(); el.append(out, K.slider('Disks', 2, 8, 1, n, (v) => { n = v; reset(); }), h('div', { class: 'row' }, K.btn('↺ Reset', reset), K.btn('▶ Watch recursion solve it', solve, true)), h('p', { class: 'tiny muted' }, 'Click a peg to pick up its top disk, then click another peg.')); reset();
    } });

  A({ id: 'graphroutes', d: ['math', 'computing', 'geopolitics', 'engineering'], e: '🛣️', t: 'Shortest path (Dijkstra)', b: 'Draw walls on a map and watch the algorithm your maps app uses find the shortest route.',
    how: 'Edsger Dijkstra designed it in 1956 in about 20 minutes at a café. It explores outward from the start, always expanding the closest unvisited spot, so the first time it reaches the goal it has found the shortest path. A* adds a guess of the remaining distance to search faster.',
    use: 'Google Maps and GPS, internet routing (OSPF), shipping and airline networks, robot navigation and video game characters. Strategists study chokepoints the same way: which roads, straits or pipelines every shortest route passes through.',
    m(el, K) {
      const C = 30, R = 18; let g; const S = [2, 9], T = [27, 9]; let algo = 'dij', anim = null; const P = K.canvas(el, 380); const out = K.out();
      const reset = (keep) => { if (!keep) g = Array.from({ length: R }, () => Array(C).fill(0)); anim = null; draw(); };
      const cell = () => Math.min(P.W / C, P.H / R);
      const draw = (vis, path) => { P.clear(); const s = cell(); for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) { const k = y * C + x; P.rect(x * s, y * s, s - 1, s - 1, g[y][x] ? '#334155' : path && path.has(k) ? '#CA8A04' : vis && vis.has(k) ? '#93C5FD' : K.css('--card')); } P.rect(S[0] * s, S[1] * s, s - 1, s - 1, '#16A34A'); P.rect(T[0] * s, T[1] * s, s - 1, s - 1, '#DC2626'); };
      let painting = false, val = 1; const paint = (e) => { const [x, y] = P.pt(e); const s = cell(); const cx = Math.floor(x / s), cy = Math.floor(y / s); if (cx < C && cy < R && !(cx === S[0] && cy === S[1]) && !(cx === T[0] && cy === T[1])) { g[cy][cx] = val; draw(); } };
      P.c.onpointerdown = (e) => { painting = true; const [x, y] = P.pt(e); const s = cell(); val = g[Math.floor(y / s)]?.[Math.floor(x / s)] ? 0 : 1; paint(e); }; P.c.onpointermove = (e) => painting && paint(e); P.c.onpointerup = () => (painting = false);
      const run = () => { const dist = new Map(), prev = new Map(), vis = new Set(); const key = (x, y) => y * C + x; const hh = (x, y) => (algo === 'astar' ? Math.abs(x - T[0]) + Math.abs(y - T[1]) : 0); const open = [[hh(...S), 0, ...S]]; dist.set(key(...S), 0); const order = [];
        while (open.length) { open.sort((a, b) => a[0] - b[0]); const [, d, x, y] = open.shift(); const k = key(x, y); if (vis.has(k)) continue; vis.add(k); order.push(k); if (x === T[0] && y === T[1]) break;
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= C || ny >= R || g[ny][nx]) return; const nk = key(nx, ny); if (!dist.has(nk) || d + 1 < dist.get(nk)) { dist.set(nk, d + 1); prev.set(nk, k); open.push([d + 1 + hh(nx, ny), d + 1, nx, ny]); } }); }
        const path = new Set(); let k = key(...T); if (prev.has(k)) while (k !== undefined) { path.add(k); k = prev.get(k); }
        anim = { order, i: 0, path }; out.textContent = path.size ? `Path length ${path.size - 1} steps; explored ${order.length} squares.` : 'No route exists!'; };
      K.raf(() => { if (!anim) return; anim.i = Math.min(anim.order.length, anim.i + 6); draw(new Set(anim.order.slice(0, anim.i)), anim.i >= anim.order.length ? anim.path : null); if (anim.i >= anim.order.length) anim.done = true; });
      P.onResize = () => g && draw(); el.append(K.choice([['dij', 'Dijkstra'], ['astar', 'A* (guided)']], algo, (v) => (algo = v)), h('div', { class: 'row' }, K.btn('▶ Find route', run, true), K.btn('Random walls', () => { g = Array.from({ length: R }, () => Array.from({ length: C }, () => (Math.random() < 0.28 ? 1 : 0))); g[S[1]][S[0]] = g[T[1]][T[0]] = 0; anim = null; draw(); }), K.btn('Clear', () => reset())), out, h('p', { class: 'tiny muted' }, 'Drag on the grid to draw or erase walls. Compare how many squares Dijkstra and A* explore.')); reset();
    } });
})();
