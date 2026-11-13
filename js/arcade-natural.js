/* Lab Arcade: physics, chemistry, biology, earth & space */
(function () {
  const A = Lab.ARC.add, h = Lab.h;

  // ======================= PHYSICS =======================
  A({ id: 'pendulum', d: ['physics', 'math', 'history'], e: '🕰️', t: 'Pendulum clock', b: 'Change length, gravity and swing. Discover what does (and doesn’t) set the period.',
    how: 'Galileo noticed (around 1602, watching a cathedral lamp) that a pendulum’s period barely depends on how far it swings. The period is T ≈ 2π√(L/g): only length and gravity matter, not mass. Huygens built the first pendulum clock in 1656, improving timekeeping roughly 60-fold.',
    use: 'Clocks for 270 years, measuring gravity for oil prospecting, Foucault’s pendulum proving Earth rotates (1851), seismometers, and the physics of any oscillation.',
    m(el, K) {
      const s = { L: 1.5, g: 9.81, a0: 25, m: 1 }; let th, w, t = 0; const out = K.out(); const P = K.canvas(el, 320);
      const reset = () => { th = (s.a0 * Math.PI) / 180; w = 0; t = 0; };
      el.append(K.two(h('div', null, K.slider('Length (m)', 0.2, 3, 0.05, s.L, (v) => { s.L = v; reset(); }), K.slider('Start angle (°)', 2, 170, 1, s.a0, (v) => { s.a0 = v; reset(); })), h('div', null, K.choice([[9.81, 'Earth'], [1.62, 'Moon'], [3.71, 'Mars'], [24.8, 'Jupiter']], 9.81, (v) => { s.g = v; reset(); }), K.slider('Mass (kg)', 0.1, 10, 0.1, s.m, (v) => { s.m = v; }))), out);
      let last = null, crossings = [];
      K.raf((T) => { const dt = last == null ? 0 : Math.min(0.05, T - last); last = T; for (let i = 0; i < 10; i++) { const prev = th; w += (-(s.g / s.L) * Math.sin(th) * dt) / 10; th += (w * dt) / 10; t += dt / 10; if (prev < 0 && th >= 0) { crossings.push(t); if (crossings.length > 3) crossings.shift(); } }
        P.clear(); const px = P.W / 2, py = 20, sc = (P.H - 50) / 3, x = px + Math.sin(th) * s.L * sc, y = py + Math.cos(th) * s.L * sc; P.line([[px, py], [x, y]], K.css('--ink'), 2); P.dot(x, y, 8 + Math.cbrt(s.m) * 6, '#CA8A04');
        const T0 = 2 * Math.PI * Math.sqrt(s.L / s.g); const meas = crossings.length > 1 ? crossings[crossings.length - 1] - crossings[crossings.length - 2] : null;
        out.innerHTML = `Small-swing formula: <b>${T0.toFixed(2)} s</b> · measured: <b>${meas ? meas.toFixed(2) + ' s' : '…'}</b> ${s.a0 > 40 ? '(big swings run slower than the formula)' : ''} · mass makes no difference`; });
      reset();
    } });

  A({ id: 'dblpend', d: ['physics', 'math'], e: '🌪️', t: 'Double pendulum chaos', b: 'Two pendulums start one-thousandth of a degree apart. Watch them split completely.',
    how: 'Hang a pendulum from a pendulum and the motion becomes chaotic: fully determined by physics, yet tiny differences in the start grow exponentially. Edward Lorenz found the same in weather models in 1961 (the “butterfly effect”).',
    use: 'Weather and climate forecasting limits, planetary orbits over millions of years, turbulence, and why we use ensembles of forecasts rather than one.',
    m(el, K) {
      const P = K.canvas(el, 380); let diff = 0.001; const mk = (d) => ({ a1: 2.2 + d, a2: 2.4, w1: 0, w2: 0, tr: [] }); let S = [mk(0), mk(diff)]; const g = 9.81, L = 1;
      const step = (s, dt) => { const { a1, a2, w1, w2 } = s; const d = a1 - a2, den = 3 - Math.cos(2 * d); const al1 = (-3 * g * Math.sin(a1) - g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(d) * (w2 * w2 * L + w1 * w1 * L * Math.cos(d))) / (L * den); const al2 = (2 * Math.sin(d) * (2 * w1 * w1 * L + 2 * g * Math.cos(a1) + w2 * w2 * L * Math.cos(d))) / (L * den); s.w1 += al1 * dt; s.w2 += al2 * dt; s.a1 += s.w1 * dt; s.a2 += s.w2 * dt; };
      el.append(K.choice([[0.001, '0.001° apart'], [0.01, '0.01°'], [0.1, '0.1°']], 0.001, (v) => { diff = v; S = [mk(0), mk((v * Math.PI) / 180)]; }), K.btn('Restart', () => (S = [mk(0), mk((diff * Math.PI) / 180)])));
      S = [mk(0), mk((diff * Math.PI) / 180)];
      K.raf(() => { S.forEach((s) => { for (let i = 0; i < 20; i++) step(s, 0.0015); }); P.clear(); const cx = P.W / 2, cy = P.H / 2 - 20, r = P.H / 4.6;
        S.forEach((s, i) => { const x1 = cx + r * Math.sin(s.a1), y1 = cy + r * Math.cos(s.a1), x2 = x1 + r * Math.sin(s.a2), y2 = y1 + r * Math.cos(s.a2); s.tr.push([x2, y2]); if (s.tr.length > 250) s.tr.shift(); const c = i ? '#DC2626' : '#2563EB'; P.line(s.tr, c + '55', 1.5); P.line([[cx, cy], [x1, y1], [x2, y2]], c, 2.5); P.dot(x2, y2, 7, c); }); });
    } });

  A({ id: 'waves', d: ['physics', 'engineering', 'arts'], e: '🌊', t: 'Wave interference', b: 'Two sources make ripples. Where crests meet they add; where crest meets trough they cancel.',
    how: 'Waves superpose: their heights add. Thomas Young’s double-slit experiment (1801) used this pattern to prove light is a wave. The bright and dark bands depend on wavelength and source spacing.',
    use: 'Noise-cancelling headphones, concert hall acoustics, phased-array radar and 5G beamforming, gravitational-wave detectors (LIGO), and holograms.',
    m(el, K) {
      const P = K.canvas(el, 360); const s = { lam: 30, sep: 80 };
      el.append(K.slider('Wavelength', 10, 60, 1, s.lam, (v) => (s.lam = v)), K.slider('Distance between sources', 0, 200, 1, s.sep, (v) => (s.sep = v)));
      K.raf((t) => { const W = Math.floor(P.W), H = Math.floor(P.H), st = 4; const s1 = [W / 2 - s.sep / 2, 20], s2 = [W / 2 + s.sep / 2, 20]; const k = (2 * Math.PI) / s.lam;
        for (let y = 0; y < H; y += st) for (let x = 0; x < W; x += st) { const d1 = Math.hypot(x - s1[0], y - s1[1]), d2 = Math.hypot(x - s2[0], y - s2[1]); const v = Math.sin(k * d1 - t * 4) + Math.sin(k * d2 - t * 4); const c = Math.round(128 + v * 60); P.rect(x, y, st, st, `rgb(${c * 0.4},${c * 0.7},${c})`); }
        P.dot(...s1, 5, '#CA8A04'); P.dot(...s2, 5, '#CA8A04'); });
    } });

  A({ id: 'snell', d: ['physics', 'engineering', 'biology'], e: '🔦', t: 'Bending light', b: 'Shine a beam into water or glass. Find the angle where light gets trapped inside.',
    how: 'Light slows down in denser materials, so it bends (Snell’s law, n₁ sin θ₁ = n₂ sin θ₂, found by Ibn Sahl in 984 and Snell in 1621). Going from dense to light material at a steep angle, it can’t escape: total internal reflection.',
    use: 'Glasses and contact lenses, cameras, the eye’s lens, fiber-optic internet cables (light trapped by total internal reflection), diamonds’ sparkle and mirages.',
    m(el, K) {
      const P = K.canvas(el, 340); const s = { th: 40, n1: 1.0, n2: 1.33 }; const out = K.out();
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2; P.rect(0, cy, P.W, P.H / 2, '#0EA5E933'); P.line([[cx, 10], [cx, P.H - 10]], K.css('--muted'), 1, [4, 4]);
        const t1 = (s.th * Math.PI) / 180, L = 160; P.line([[cx - L * Math.sin(t1), cy - L * Math.cos(t1)], [cx, cy]], '#DC2626', 3); const r = (s.n1 / s.n2) * Math.sin(t1);
        P.line([[cx, cy], [cx + L * Math.sin(t1), cy - L * Math.cos(t1)]], '#DC262655', 1.5);
        if (Math.abs(r) <= 1) { const t2 = Math.asin(r); P.line([[cx, cy], [cx + L * Math.sin(t2), cy + L * Math.cos(t2)]], '#DC2626', 3); out.innerHTML = `Bends from ${s.th}° to <b>${((t2 * 180) / Math.PI).toFixed(1)}°</b>` + (s.n1 > s.n2 ? ` · critical angle ${((Math.asin(s.n2 / s.n1) * 180) / Math.PI).toFixed(1)}°` : ''); }
        else out.innerHTML = '<b>Total internal reflection</b>: all the light bounces back inside. This is how fiber optics carry the internet.';
        P.text(`n = ${s.n1}`, 10, 20, { c: K.css('--muted') }); P.text(`n = ${s.n2}`, 10, cy + 20, { c: K.css('--muted') }); };
      P.onResize = draw; el.append(K.slider('Angle of the beam (°)', 0, 89, 1, s.th, (v) => { s.th = v; draw(); }), K.choice([['air-water', 'Air → water'], ['air-glass', 'Air → glass'], ['water-air', 'Water → air'], ['glass-air', 'Glass → air'], ['air-diamond', 'Air → diamond']], 'air-water', (v) => { const n = { air: 1.0, water: 1.33, glass: 1.5, diamond: 2.42 }; const [a, b] = v.split('-'); s.n1 = n[a]; s.n2 = n[b]; draw(); }), out); draw();
    } });

  A({ id: 'gas', d: ['physics', 'chemistry'], e: '💨', t: 'Gas in a box', b: 'Heat bouncing particles, squeeze the box, and discover the gas laws from the motion of atoms.',
    how: 'Pressure is particles hitting the walls; temperature is their average kinetic energy. Squeeze the box and hits get more frequent (Boyle’s law, 1662); heat it and they hit harder and more often. Maxwell and Boltzmann derived this from atoms in the 1860s–70s, before atoms were proven to exist.',
    use: 'Engines, weather, scuba diving and decompression sickness, airbags, tires, refrigerators and the physics of stars.',
    m(el, K) {
      const P = K.canvas(el, 320); const s = { T: 300, w: 1, n: 120 }; let ps = [], hits = 0, hist = []; const out = K.out();
      const make = () => { ps = Array.from({ length: s.n }, () => { const a = Math.random() * 7; return { x: Math.random(), y: Math.random(), vx: Math.cos(a), vy: Math.sin(a) }; }); };
      el.append(K.slider('Temperature (K)', 50, 1000, 10, s.T, (v) => (s.T = v)), K.slider('Box width', 0.3, 1, 0.01, s.w, (v) => (s.w = v), (v) => Math.round(v * 100) + '%'), K.slider('Particles', 10, 300, 10, s.n, (v) => { s.n = v; make(); }), out); make();
      K.raf(() => { P.clear(); const bw = P.W * s.w, sp = Math.sqrt(s.T / 300) * 0.006; P.ctx.strokeStyle = K.css('--ink'); P.ctx.lineWidth = 3; P.ctx.strokeRect(1, 1, bw - 2, P.H - 2); let hh = 0;
        ps.forEach((p) => { p.x += (p.vx * sp) / s.w; p.y += p.vy * sp * (P.W / P.H); if (p.x < 0) { p.x = 0; p.vx *= -1; hh++; } if (p.x > 1) { p.x = 1; p.vx *= -1; hh++; } if (p.y < 0) { p.y = 0; p.vy *= -1; hh++; } if (p.y > 1) { p.y = 1; p.vy *= -1; hh++; } P.dot(p.x * (bw - 8) + 4, p.y * (P.H - 8) + 4, 3, `hsl(${240 - Math.min(240, s.T / 4)},80%,50%)`); });
        hist.push(hh * Math.sqrt(s.T / 300)); if (hist.length > 60) hist.shift(); const pr = hist.reduce((a, b) => a + b, 0) / hist.length;
        out.innerHTML = `Pressure (wall hits × force): <b>${pr.toFixed(1)}</b> · ideal gas law predicts ∝ N·T/V = ${((s.n * s.T) / s.w / 3000).toFixed(1)}`; });
    } });

  A({ id: 'relativity', d: ['physics', 'earthspace', 'philosophy'], e: '🚀', t: 'Time dilation', b: 'Send a twin to a star near light speed. How much younger are they when they return?',
    how: 'Einstein’s special relativity (1905): moving clocks tick slower by the Lorentz factor γ = 1/√(1 − v²/c²). It’s not an illusion: atomic clocks flown on airliners (Hafele–Keating, 1971) measured it, and muons from cosmic rays reach the ground only because their time slows.',
    use: 'GPS satellites must correct for both special and general relativity (about 38 microseconds a day), or positions would drift about 10 km a day. Particle accelerators depend on it.',
    m(el, K) {
      const s = { v: 0.9, d: 10 }; const out = h('div'); const bar = h('div');
      const draw = () => { const g = 1 / Math.sqrt(1 - s.v ** 2); const tE = (2 * s.d) / s.v, tS = tE / g; out.innerHTML = `<div class="grid g3"><div><div class="tiny muted">Lorentz factor γ</div><div class="kpi">${g.toFixed(3)}</div></div><div><div class="tiny muted">Earth twin ages</div><div class="kpi">${tE.toFixed(1)} yrs</div></div><div><div class="tiny muted">Traveling twin ages</div><div class="kpi">${tS.toFixed(1)} yrs</div></div></div>`;
        bar.innerHTML = ''; bar.append(h('div', { style: { height: '18px', background: '#2563EB', width: '100%', borderRadius: '6px', marginTop: '10px' } }), h('div', { style: { height: '18px', background: '#DC2626', width: (tS / tE) * 100 + '%', borderRadius: '6px', marginTop: '4px' } })); };
      el.append(K.slider('Speed (fraction of light speed)', 0.01, 0.9999, 0.0001, s.v, (v) => { s.v = v; draw(); }, (v) => v.toFixed(4) + ' c'), K.slider('Distance to star (light-years)', 1, 100, 1, s.d, (v) => { s.d = v; draw(); }), out, bar, h('p', { class: 'tiny muted' }, 'Blue: Earth time. Red: traveler time. At everyday speeds γ is about 1.000000000001; at 0.99c it is 7.1.')); draw();
    } });

  A({ id: 'doppler', d: ['physics', 'earthspace'], e: '🚑', t: 'Doppler effect & redshift', b: 'Move a siren past a listener and hear the pitch change. The same effect shows the universe is expanding.',
    how: 'A moving source bunches up waves ahead of it (higher pitch) and stretches them behind (lower). Christian Doppler described it in 1842. Light does the same: galaxies moving away look redder. Edwin Hubble (1929) found farther galaxies are redshifted more: the universe is expanding.',
    use: 'Police radar, weather radar tracking storms, ultrasound measuring blood flow, finding exoplanets by the wobble of their star, and measuring the expansion of the universe.',
    m(el, K) {
      const P = K.canvas(el, 300); let v = 0.5; const rings = []; let x = 0, tt = 0; const out = K.out(); const f0 = 440;
      el.append(K.slider('Speed (fraction of sound speed)', 0, 0.95, 0.01, v, (a) => (v = a)), out);
      K.raf((t) => { const dt = 1 / 60; tt += dt; x += v * 80 * dt; if (x > P.W + 50) { x = -50; rings.length = 0; } if (Math.round(tt * 60) % 8 === 0) rings.push([x, tt]); if (rings.length > 40) rings.shift(); P.clear(); const y = P.H / 2;
        rings.forEach(([rx, rt]) => { const r = (tt - rt) * 80; P.ctx.strokeStyle = '#2563EB66'; P.ctx.beginPath(); P.ctx.arc(rx, y, r, 0, 7); P.ctx.stroke(); }); P.text('🚑', x - 12, y + 8, { s: 24 }); P.text('👂', P.W * 0.75, y + 50, { s: 22 });
        const ahead = x < P.W * 0.75; const f = ahead ? f0 / (1 - v) : f0 / (1 + v); out.innerHTML = `Listener hears <b>${f.toFixed(0)} Hz</b> (siren emits ${f0} Hz) — ${ahead ? 'approaching: higher pitch' : 'moving away: lower pitch'}`; });
    } });

  A({ id: 'ohm', d: ['physics', 'engineering'], e: '💡', t: 'Circuits: volts, amps, ohms', b: 'Build series and parallel circuits and see current, brightness and power change.',
    how: 'Ohm’s law (1827): current = voltage ÷ resistance. In series, resistances add and the same current flows through all; in parallel, each branch gets the full voltage, so total current rises. Power = voltage × current.',
    use: 'Household wiring (parallel, so one bulb failing doesn’t kill the rest), old Christmas lights (series), phone chargers, electric vehicles, and the power grid.',
    m(el, K) {
      const s = { V: 9, R1: 100, R2: 200, mode: 'series' }; const out = h('div'); const P = K.canvas(el, 220);
      const draw = () => { const { V, R1, R2 } = s; let I1, I2, It, Rt; if (s.mode === 'series') { Rt = R1 + R2; It = V / Rt; I1 = I2 = It; } else { Rt = 1 / (1 / R1 + 1 / R2); I1 = V / R1; I2 = V / R2; It = I1 + I2; } const P1 = I1 * I1 * R1, P2 = I2 * I2 * R2;
        P.clear(); const bulb = (x, y, p) => { P.dot(x, y, 22, `rgba(250,204,21,${Math.min(1, p / 0.5)})`); P.ctx.strokeStyle = K.css('--ink'); P.ctx.beginPath(); P.ctx.arc(x, y, 22, 0, 7); P.ctx.stroke(); };
        const L = 60, R = P.W - 60, T = 40, B = P.H - 40; P.line([[L, T], [R, T], [R, B], [L, B], [L, T]], K.css('--ink'), 2); P.rect(L - 10, P.H / 2 - 20, 20, 40, '#334155'); P.text(V + ' V', L + 16, P.H / 2 + 4);
        if (s.mode === 'series') { bulb(P.W * 0.4, T, P1); bulb(P.W * 0.65, T, P2); } else { P.line([[P.W * 0.45, T], [P.W * 0.45, B]], K.css('--ink'), 2); P.line([[P.W * 0.7, T], [P.W * 0.7, B]], K.css('--ink'), 2); bulb(P.W * 0.45, P.H / 2, P1); bulb(P.W * 0.7, P.H / 2, P2); }
        out.innerHTML = `<div class="grid g4"><div><div class="tiny muted">Total resistance</div><b>${Rt.toFixed(1)} Ω</b></div><div><div class="tiny muted">Total current</div><b>${(It * 1000).toFixed(1)} mA</b></div><div><div class="tiny muted">Bulb 1 power</div><b>${(P1 * 1000).toFixed(1)} mW</b></div><div><div class="tiny muted">Bulb 2 power</div><b>${(P2 * 1000).toFixed(1)} mW</b></div></div>`; };
      P.onResize = draw; el.append(K.choice([['series', 'Series'], ['parallel', 'Parallel']], s.mode, (v) => { s.mode = v; draw(); }), K.slider('Battery voltage', 1, 24, 0.5, s.V, (v) => { s.V = v; draw(); }), K.two(K.slider('Bulb 1 resistance (Ω)', 10, 500, 5, s.R1, (v) => { s.R1 = v; draw(); }), K.slider('Bulb 2 resistance (Ω)', 10, 500, 5, s.R2, (v) => { s.R2 = v; draw(); })), out); draw();
    } });

  A({ id: 'coaster', d: ['physics', 'engineering'], e: '🎢', t: 'Roller coaster energy', b: 'Height becomes speed and back again. Add friction and watch energy turn into heat.',
    how: 'Energy is conserved: potential energy (mgh) turns into kinetic energy (½mv²) and back. Without friction a cart released from a height can reach that height again but never higher. Friction converts some energy to heat, which is why real coasters start with the tallest hill.',
    use: 'Coaster and ski-jump design, hydroelectric dams (falling water), regenerative braking in electric cars, and the energy budgets of every machine.',
    m(el, K) {
      const P = K.canvas(el, 320); let fr = 0.0, x = 0.06, E = 0, dir = 1; const out = K.out(); const hgt = (u) => 0.85 * Math.exp(-((u - 0.05) ** 2) / 0.01) + 0.45 * Math.exp(-((u - 0.45) ** 2) / 0.008) + 0.6 * Math.exp(-((u - 0.75) ** 2) / 0.006) + 0.05;
      const Lm = 60, Hm = 25, g = 9.81; const H = (u) => hgt(u) * Hm; const release = () => { x = 0.06; E = g * H(x) + 0.5; dir = 1; }; release();
      el.append(K.slider('Friction', 0, 0.08, 0.002, fr, (a) => (fr = a)), K.btn('Release from the top', release, true), out);
      K.raf(() => { const dt = 1 / 60; for (let i = 0; i < 10; i++) { const e = 1e-4, sl = ((H(x + e) - H(x - e)) / (2 * e)) / Lm; const ke = E - g * H(x); if (ke <= 0.02) { dir = -dir; E = g * H(x) + 0.03; }
          const v = Math.sqrt(Math.max(0, 2 * (E - g * H(x)))); const ds = (v * dt) / 10; x += (dir * ds) / Math.sqrt(1 + sl * sl) / Lm; E -= (fr * g * ds) / Math.sqrt(1 + sl * sl); if (x < 0.001) { x = 0.001; dir = 1; } if (x > 0.999) { x = 0.999; dir = -1; } if (E < g * H(x)) E = g * H(x); }
        P.clear(); const pts = []; for (let u = 0; u <= 1; u += 0.004) pts.push([u * P.W, P.H - hgt(u) * (P.H - 30) - 10]); P.line(pts, K.css('--ink'), 3); const cy = P.H - hgt(x) * (P.H - 30) - 10; P.dot(x * P.W, cy - 8, 9, '#DC2626');
        const tot = g * H(0.06) + 0.5, pe = g * H(x), ke = Math.max(0, E - pe); const bar = (l, val, c, i) => { P.rect(P.W - 170, 12 + i * 20, (Math.max(0, val) / tot) * 150, 14, c); P.text(l, P.W - 176, 23 + i * 20, { a: 'right', s: 11 }); };
        bar('height energy', pe, '#2563EB', 0); bar('motion energy', ke, '#16A34A', 1); bar('lost to heat', tot - E, '#DC2626', 2); out.textContent = `Speed ${Math.sqrt(2 * ke).toFixed(1)} m/s · ` + (fr ? 'Friction turns energy into heat: each swing gets lower.' : 'No friction: the total never changes, so the cart can always climb back to its starting height.'); });
    } });

  A({ id: 'halflife', d: ['physics', 'chemistry', 'earthspace', 'history'], e: '☢️', t: 'Half-life & carbon dating', b: 'Watch atoms decay at random, then date a bone, a mummy and a dinosaur.',
    how: 'Each radioactive atom has a fixed chance of decaying per second, so half of any sample decays in one half-life. Individually random, collectively clockwork. Willard Libby (1949) used carbon-14 (half-life 5,730 years) to date organic material; other isotopes date rocks over billions of years.',
    use: 'Dating archaeology and fossils, the age of the Earth (4.54 billion years, from uranium-lead), medical isotopes for scans and cancer treatment, and planning nuclear waste storage.',
    m(el, K) {
      const P = K.canvas(el, 260); const N = 400; let alive = new Uint8Array(N).fill(1), t = 0, run = true; const out = K.out(); const hist = [];
      const reset = () => { alive.fill(1); t = 0; hist.length = 0; };
      el.append(h('div', { class: 'row' }, K.btn('⏯ Pause', () => (run = !run)), K.btn('Restart', reset)), out);
      K.raf(() => { if (run && alive.some((x) => x)) { t += 0.02; alive = alive.map((a) => (a && Math.random() < 1 - Math.pow(0.5, 0.02) ? 0 : a)); hist.push(alive.reduce((a, b) => a + b, 0)); } P.clear(); const cols = 25, sz = Math.min(P.H / 16, (P.W * 0.45) / cols);
        alive.forEach((a, i) => P.dot((i % cols) * sz + sz / 2 + 6, Math.floor(i / cols) * sz + sz / 2 + 6, sz * 0.38, a ? '#16A34A' : '#94A3B855'));
        const gx = P.W * 0.5; const gw = P.W - gx - 10; P.line(hist.map((v, i) => [gx + (i / 400) * gw, P.H - 10 - (v / N) * (P.H - 30)]), '#16A34A', 2); for (let k = 1; k <= 5; k++) P.line([[gx + (k * 50 / 400) * gw, 10], [gx + (k * 50 / 400) * gw, P.H - 10]], K.css('--line'), 1, [3, 3]);
        out.textContent = `${t.toFixed(1)} half-lives · ${hist[hist.length - 1] ?? N} of ${N} atoms remain (expected ${Math.round(N * 0.5 ** t)})`; });
      const res = h('div', { class: 'small' }); const C = [['Bone with 50% of its carbon-14 left', 0.5], ['Egyptian mummy wrapping, 66% left', 0.66], ['Mammoth tusk, 3% left', 0.03], ['Dinosaur bone, 0% measurable', 0]];
      el.append(h('h3', null, 'Date it'), h('div', { class: 'row' }, C.map(([l, f]) => K.btn(l, () => { res.innerHTML = f ? `Age = 5,730 × log₂(1/${f}) ≈ <b>${Lab.fmt(5730 * Math.log2(1 / f))} years</b>` : 'After about 50,000 years too little carbon-14 remains. Dinosaurs (over 66 million years) are dated from volcanic rock layers using uranium or argon isotopes with much longer half-lives.'; }))), res);
    } });

  A({ id: 'efield', d: ['physics', 'engineering'], e: '⚡', t: 'Electric field lines', b: 'Place positive and negative charges and see the invisible field between them.',
    how: 'Michael Faraday pictured “lines of force” around charges in the 1830s, without math. Field lines leave positive charges and enter negative ones; their density shows strength. Coulomb’s law: force falls off with the square of distance.',
    use: 'Capacitors, touchscreens, lightning rods, cathode-ray TVs, particle accelerators, and how nerves and heart cells signal (measured by ECG).',
    m(el, K) {
      const P = K.canvas(el, 380); let Q = [[0.35, 0.5, 1], [0.65, 0.5, -1]], sign = 1;
      const E = (x, y) => { let ex = 0, ey = 0; Q.forEach(([qx, qy, q]) => { const dx = x - qx * P.W, dy = y - qy * P.H, r2 = dx * dx + dy * dy + 1; const r = Math.sqrt(r2); ex += (q * dx) / (r2 * r); ey += (q * dy) / (r2 * r); }); return [ex, ey]; };
      const draw = () => { P.clear(); Q.filter((q) => q[2] > 0).forEach(([qx, qy]) => { for (let k = 0; k < 16; k++) { let x = qx * P.W + 8 * Math.cos((k / 16) * 6.283), y = qy * P.H + 8 * Math.sin((k / 16) * 6.283); const pts = [[x, y]]; for (let i = 0; i < 600; i++) { const [ex, ey] = E(x, y); const m = Math.hypot(ex, ey) || 1; x += (ex / m) * 3; y += (ey / m) * 3; pts.push([x, y]); if (x < 0 || y < 0 || x > P.W || y > P.H || Q.some(([a, b, q]) => q < 0 && Math.hypot(x - a * P.W, y - b * P.H) < 6)) break; } P.line(pts, '#64748B', 1); } });
        Q.forEach(([x, y, q]) => { P.dot(x * P.W, y * P.H, 11, q > 0 ? '#DC2626' : '#2563EB'); P.text(q > 0 ? '+' : '−', x * P.W, y * P.H + 5, { a: 'center', c: '#fff', s: 15, w: 700 }); }); };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); Q.push([x / P.W, y / P.H, sign]); draw(); };
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.choice([[1, 'Add + charge'], [-1, 'Add − charge']], 1, (v) => (sign = v)), K.btn('Dipole', () => { Q = [[0.35, 0.5, 1], [0.65, 0.5, -1]]; draw(); }), K.btn('Two positives', () => { Q = [[0.35, 0.5, 1], [0.65, 0.5, 1]]; draw(); }), K.btn('Clear', () => { Q = []; draw(); })), h('p', { class: 'tiny muted' }, 'Click to place a charge. Lines are drawn from positive charges.')); draw();
    } });

  A({ id: 'colorlight', d: ['physics', 'arts', 'biology'], e: '🌈', t: 'Mixing light vs mixing paint', b: 'Red + green light = yellow? Mix light (additive) and pigments (subtractive) side by side.',
    how: 'Your eye has three types of cone cells, roughly for red, green and blue light. Screens mix those three to fool them (additive: all three make white). Paints absorb light, so mixing removes colors (subtractive: cyan, magenta, yellow make near-black). Newton split white light with a prism in 1666.',
    use: 'Every screen, printer (CMYK), stage lighting, color blindness (about 8% of men of Northern European descent), camera sensors and art.',
    m(el, K) {
      const s = { r: 255, g: 200, b: 0 }; const a = h('div', { style: { height: '140px', borderRadius: '14px' } }), sb = h('div', { style: { height: '140px', borderRadius: '14px' } }); const out = K.out();
      const draw = () => { a.style.background = `rgb(${s.r},${s.g},${s.b})`; const c = 255 - s.r, m = 255 - s.g, y = 255 - s.b; sb.style.background = `rgb(${255 - c},${255 - m},${255 - y})`;
        out.innerHTML = `Light: R ${s.r} G ${s.g} B ${s.b} · Ink needed: cyan ${((c / 255) * 100).toFixed(0)}% magenta ${((m / 255) * 100).toFixed(0)}% yellow ${((y / 255) * 100).toFixed(0)}%`; };
      el.append(K.two(h('div', null, h('b', null, 'Light on a screen (additive)'), a), h('div', null, h('b', null, 'Same color printed (subtractive)'), sb)), ['r', 'g', 'b'].map((k, i) => K.slider(['Red light', 'Green light', 'Blue light'][i], 0, 255, 1, s[k], (v) => { s[k] = v; draw(); })), out,
        h('div', { class: 'row' }, [['Red + green', [255, 255, 0]], ['All three', [255, 255, 255]], ['Green + blue', [0, 255, 255]], ['Red + blue', [255, 0, 255]]].map(([l, c]) => K.btn(l, () => { [s.r, s.g, s.b] = c; draw(); })))); draw();
    } });

  // ======================= CHEMISTRY =======================
  A({ id: 'atombuild', d: ['chemistry', 'physics'], e: '⚛️', t: 'Build an atom', b: 'Add protons, neutrons and electrons. Make any element, isotope or ion and check if it is stable.',
    how: 'Protons set the element (its atomic number); neutrons make isotopes; electrons set the charge and chemistry. Electrons fill shells (2, 8, 8, 18…); the outer shell decides how an atom bonds. Rutherford found the nucleus in 1911; Bohr proposed shells in 1913.',
    use: 'All of chemistry, nuclear power and medicine (isotopes), carbon dating, semiconductors (silicon with 4 outer electrons) and understanding why noble gases don’t react.',
    m(el, K) {
      const EL = ['', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminium', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium'];
      const SY = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
      const STABLE = { 1: [0, 1], 2: [1, 2], 3: [3, 4], 4: [5], 5: [5, 6], 6: [6, 7], 7: [7, 8], 8: [8, 9, 10], 9: [10], 10: [10, 11, 12], 11: [12], 12: [12, 13, 14], 13: [14], 14: [14, 15, 16], 15: [16], 16: [16, 17, 18, 20], 17: [18, 20], 18: [18, 20, 22], 19: [20, 22], 20: [20, 22, 23, 24, 26, 28] };
      const s = { p: 6, n: 6, e: 6 }; const P = K.canvas(el, 300); const out = h('div');
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2; const nuc = []; for (let i = 0; i < s.p + s.n; i++) nuc.push(i < s.p ? '#DC2626' : '#94A3B8'); const sh = Lab.shuffle(nuc);
        sh.forEach((c, i) => { const a = i * 2.4, r = 3.2 * Math.sqrt(i); P.dot(cx + r * Math.cos(a), cy + r * Math.sin(a), 5, c); });
        const caps = [2, 8, 8, 18]; let left = s.e; caps.forEach((cap, k) => { const R = 45 + k * 32; P.ctx.strokeStyle = K.css('--line'); P.ctx.beginPath(); P.ctx.arc(cx, cy, R, 0, 7); P.ctx.stroke(); const n = Math.min(cap, left); left -= n; for (let i = 0; i < n; i++) P.dot(cx + R * Math.cos((i / cap) * 6.283), cy + R * Math.sin((i / cap) * 6.283), 5, '#2563EB'); });
        const ch = s.p - s.e; const st = STABLE[s.p] && STABLE[s.p].includes(s.n); out.innerHTML = s.p ? `<div class="kpi">${SY[s.p]}-${s.p + s.n}${ch ? `<sup>${Math.abs(ch) > 1 ? Math.abs(ch) : ''}${ch > 0 ? '+' : '−'}</sup>` : ''} <small>${EL[s.p]} · mass number ${s.p + s.n} · ${ch ? (ch > 0 ? 'positive ion (lost electrons)' : 'negative ion (gained electrons)') : 'neutral atom'} · nucleus ${st ? '<b style="color:#16A34A">stable</b>' : '<b style="color:#DC2626">unstable (radioactive)</b>'}</small></div>` : 'Add a proton to make an element.'; };
      P.onResize = draw; el.append(h('div', { class: 'grid g3' }, K.slider('Protons (red)', 0, 20, 1, s.p, (v) => { s.p = v; draw(); }), K.slider('Neutrons (gray)', 0, 30, 1, s.n, (v) => { s.n = v; draw(); }), K.slider('Electrons (blue)', 0, 22, 1, s.e, (v) => { s.e = v; draw(); })), out,
        h('div', { class: 'row' }, [['Carbon-14', 6, 8, 6], ['Sodium ion Na⁺', 11, 12, 10], ['Chloride Cl⁻', 17, 18, 18], ['Deuterium', 1, 1, 1], ['Neon', 10, 10, 10]].map(([l, p, n, e]) => K.btn(l, () => { Object.assign(s, { p, n, e }); draw(); })))); draw();
    } });

  A({ id: 'ph', d: ['chemistry', 'biology', 'medicine'], e: '🧪', t: 'The pH scale', b: 'From battery acid to drain cleaner. Each step on the scale is ten times more acidic.',
    how: 'pH = −log₁₀ of the hydrogen ion concentration (Søren Sørensen, 1909, at the Carlsberg brewery). pH 7 is neutral; each unit down is 10× more acidic. Because it is logarithmic, pH 3 is 10,000× more acidic than pH 7.',
    use: 'Blood must stay between 7.35 and 7.45; ocean acidification (surface pH fell from about 8.2 to 8.1, roughly 30% more acidic) threatens corals and shellfish; soils, swimming pools, cooking and digestion.',
    m(el, K) {
      const I = [['Battery acid', 0.5], ['Stomach acid', 1.5], ['Lemon juice', 2.2], ['Cola', 2.5], ['Coffee', 5], ['Rain', 5.6], ['Milk', 6.6], ['Pure water', 7], ['Blood', 7.4], ['Seawater', 8.1], ['Baking soda', 9], ['Soap', 10], ['Ammonia', 11.6], ['Bleach', 12.5], ['Drain cleaner', 14]];
      let ph = 7; const bar = h('div', { style: { position: 'relative', height: '50px', borderRadius: '12px', background: 'linear-gradient(90deg,#DC2626,#F97316,#FACC15,#84CC16,#16A34A,#0EA5E9,#2563EB,#7C3AED)' } }); const out = h('div');
      I.forEach(([n, v]) => bar.append(h('div', { title: n, style: { position: 'absolute', left: (v / 14) * 100 + '%', top: '50px', fontSize: '10px', transform: 'rotate(45deg)', transformOrigin: 'left top', whiteSpace: 'nowrap' } }, n)));
      const mark = h('div', { style: { position: 'absolute', top: '-6px', width: '4px', height: '62px', background: '#111', borderRadius: '2px' } }); bar.append(mark);
      const draw = () => { mark.style.left = (ph / 14) * 100 + '%'; const near = I.reduce((a, b) => (Math.abs(b[1] - ph) < Math.abs(a[1] - ph) ? b : a)); out.innerHTML = `<div class="kpi">pH ${ph.toFixed(1)} <small>[H⁺] = 10<sup>−${ph.toFixed(1)}</sup> mol/L · ${ph < 7 ? Lab.fmt(10 ** (7 - ph)) + '× more acidic than water' : ph > 7 ? Lab.fmt(10 ** (ph - 7)) + '× more basic than water' : 'neutral'} · close to: ${near[0]}</small></div>`; };
      el.append(bar, h('div', { style: { height: '80px' } }), K.slider('pH', 0, 14, 0.1, ph, (v) => { ph = v; draw(); }), out); draw();
    } });

  A({ id: 'collide', d: ['chemistry', 'physics'], e: '🔥', t: 'Why heat speeds reactions', b: 'Molecules only react if they collide hard enough. Raise the temperature or add a catalyst.',
    how: 'Svante Arrhenius (1889): only collisions above an activation energy react. Heating gives more molecules that energy, so rates rise steeply (a common rule of thumb is roughly doubling per 10 °C). Catalysts lower the energy barrier without being used up.',
    use: 'Cooking, refrigeration slowing food spoilage, enzymes (biological catalysts) in your body, car catalytic converters, and the Haber process that makes fertilizer for about half the world’s food.',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { T: 300, Ea: 50 }; let A_ = [], made = 0, t0 = 0; const out = K.out();
      const reset = () => { A_ = Array.from({ length: 80 }, (_, i) => ({ x: Math.random(), y: Math.random(), a: Math.random() * 7, k: i % 2 })); made = 0; };
      el.append(K.slider('Temperature (K)', 200, 600, 5, s.T, (v) => (s.T = v)), K.slider('Activation energy (lower = catalyst)', 10, 80, 1, s.Ea, (v) => (s.Ea = v)), K.btn('Restart', reset), out); reset();
      K.raf(() => { const sp = 0.004 * Math.sqrt(s.T / 300); P.clear(); A_.forEach((p) => { p.x += Math.cos(p.a) * sp; p.y += Math.sin(p.a) * sp * (P.W / P.H); if (p.x < 0 || p.x > 1) p.a = Math.PI - p.a; if (p.y < 0 || p.y > 1) p.a = -p.a; p.x = Lab.clamp(p.x, 0, 1); p.y = Lab.clamp(p.y, 0, 1); });
        for (let i = 0; i < A_.length; i++) for (let j = i + 1; j < A_.length; j++) { const a = A_[i], b = A_[j]; if (a.k === 0 && b.k === 1 || a.k === 1 && b.k === 0) if (Math.hypot((a.x - b.x) * P.W, (a.y - b.y) * P.H) < 9) { const E = -Math.log(Math.random()) * (s.T / 300) * 20; if (E > s.Ea) { a.k = 2; b.k = 2; made++; } } }
        A_.forEach((p) => P.dot(p.x * P.W, p.y * P.H, 5, ['#2563EB', '#DC2626', '#16A34A'][p.k])); const frac = Math.exp((-s.Ea / 20) * (300 / s.T));
        out.innerHTML = `<span style="color:#2563EB">● A</span> + <span style="color:#DC2626">● B</span> → <span style="color:#16A34A">● product</span> · reactions so far: <b>${made}</b> · share of collisions with enough energy: <b>${(frac * 100).toFixed(1)}%</b>`; });
    } });

  A({ id: 'equilib', d: ['chemistry', 'economics'], e: '⚖️', t: 'Chemical equilibrium', b: 'A ⇌ B. Disturb the balance and watch the system push back (Le Chatelier’s principle).',
    how: 'Reversible reactions run both ways. At equilibrium the forward and backward rates are equal, so amounts stop changing, though molecules keep converting. Add more A and the system makes more B to compensate (Le Chatelier, 1884).',
    use: 'Industrial chemistry (making ammonia), how blood carries oxygen and buffers acid, ocean CO₂ absorption, and as an analogy for supply and demand reaching a market price.',
    m(el, K) {
      const P = K.canvas(el, 280); let a = 100, b = 0, kf = 0.03, kb = 0.015; const hist = []; const out = K.out();
      el.append(K.two(K.slider('Forward rate A→B', 0.005, 0.08, 0.001, kf, (v) => (kf = v)), K.slider('Backward rate B→A', 0.005, 0.08, 0.001, kb, (v) => (kb = v))), h('div', { class: 'row' }, K.btn('+ Add 50 A', () => (a += 50), true), K.btn('Remove half of B', () => (b /= 2)), K.btn('Reset', () => { a = 100; b = 0; hist.length = 0; })), out);
      K.raf(() => { for (let i = 0; i < 3; i++) { const f = kf * a, r = kb * b; a += r - f; b += f - r; } hist.push([a, b]); if (hist.length > 500) hist.shift(); P.clear(); const mx = Math.max(150, ...hist.map((x) => x[0] + x[1])); const { X, Y } = P.chart(0, 500, 0, mx, { noX: true });
        P.line(hist.map((x, i) => [X(i), Y(x[0])]), '#2563EB', 2.5); P.line(hist.map((x, i) => [X(i), Y(x[1])]), '#DC2626', 2.5); out.innerHTML = `<span style="color:#2563EB">A = ${a.toFixed(1)}</span> · <span style="color:#DC2626">B = ${b.toFixed(1)}</span> · ratio B/A = ${(b / Math.max(a, 1e-9)).toFixed(2)} (equilibrium constant K = ${(kf / kb).toFixed(2)})`; });
    } });

  A({ id: 'titration', d: ['chemistry', 'medicine'], e: '💧', t: 'Titration: find the unknown', b: 'Add base drop by drop to an acid of unknown strength. The indicator flips at the equivalence point.',
    how: 'Titration measures how much base exactly neutralizes the acid. Near the equivalence point pH jumps sharply, so a few drops change the indicator color. From the volume used you can calculate the original concentration.',
    use: 'Quality control of food and drugs, water testing, measuring vitamin C or blood alcohol, and wine making.',
    m(el, K) {
      const P = K.canvas(el, 300); let conc = K.rnd(0.05, 0.2), added = 0; const Va = 25, Cb = 0.1; const out = K.out(); const guess = h('input', { type: 'number', step: 0.001, style: { width: '110px' } }); const res = h('div', { class: 'small' });
      const pH = (vb) => { const na = (conc * Va) / 1000, nb = (Cb * vb) / 1000, V = (Va + vb) / 1000; if (Math.abs(na - nb) < 1e-9) return 7; if (na > nb) return -Math.log10((na - nb) / V); return 14 + Math.log10((nb - na) / V); };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 60, 0, 14, { xl: 'mL of base added', yl: 'pH' }); const pts = []; for (let v = 0; v <= added; v += 0.1) pts.push([X(v), Y(pH(v))]); P.line(pts, '#9333EA', 2.5); const p = pH(added);
        P.rect(P.W - 70, 20, 50, 80, p < 8.2 ? '#F1F5F9' : `rgba(219,39,119,${Math.min(1, (p - 8.2) / 2)})`); P.ctx.strokeStyle = K.css('--ink'); P.ctx.strokeRect(P.W - 70, 20, 50, 80); out.innerHTML = `Added <b>${added.toFixed(1)} mL</b> · pH ${p.toFixed(2)} · indicator: ${p < 8.2 ? 'colorless' : 'pink!'}`; };
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.btn('+1 drop (0.1 mL)', () => { added += 0.1; draw(); }), K.btn('+1 mL', () => { added += 1; draw(); }, true), K.btn('+5 mL', () => { added += 5; draw(); }), K.btn('New sample', () => { conc = K.rnd(0.05, 0.2); added = 0; res.textContent = ''; draw(); })), out,
        h('div', { class: 'row' }, h('span', { class: 'small' }, 'Your answer: acid concentration (mol/L) ='), guess, K.btn('Check', () => { const right = conc; res.innerHTML = `True value ${right.toFixed(3)} mol/L. Method: moles of base at the color change = 0.1 × mL/1000; acid concentration = that ÷ 0.025 L. ${Math.abs(+guess.value - right) < 0.01 ? '✓ Nice titration!' : ''}`; })), res); draw();
    } });

  A({ id: 'spectra', d: ['chemistry', 'physics', 'earthspace'], e: '🔭', t: 'Fingerprints of light', b: 'Every element glows at its own colors. Match a star’s spectrum to find what it is made of.',
    how: 'Electrons jump between fixed energy levels and emit or absorb light of exact wavelengths, so each element has a unique set of lines. Bunsen and Kirchhoff discovered this in 1859; helium was found in the Sun’s spectrum in 1868 before it was found on Earth.',
    use: 'Knowing what stars and exoplanet atmospheres are made of, forensic analysis, fireworks colors, streetlights (sodium yellow), and detecting pollution.',
    m(el, K) {
      const L = { Hydrogen: [410, 434, 486, 656], Helium: [447, 471, 492, 501, 588, 668], Sodium: [589, 589.6], Neon: [585, 588, 603, 607, 616, 621, 626, 633, 640, 650, 693, 703], Mercury: [405, 436, 546, 577, 579], Calcium: [393, 397, 423, 443, 445, 616] };
      const wl = (w) => { const t = (w - 380) / 370; return `hsl(${Math.max(0, 270 - t * 270)},90%,55%)`; };
      const strip = (lines, absorb) => { const c = h('canvas', { width: 700, height: 40, style: { width: '100%', height: '40px', borderRadius: '8px' } }); const x = c.getContext('2d'); for (let i = 0; i < 700; i++) { const w = 380 + (i / 700) * 370; x.fillStyle = absorb ? wl(w) : '#000'; x.fillRect(i, 0, 1, 40); } lines.forEach((w) => { const i = ((w - 380) / 370) * 700; x.fillStyle = absorb ? '#000' : wl(w); x.fillRect(i - 1.5, 0, 3, 40); }); return c; };
      el.append(h('h3', { style: { marginTop: 0 } }, 'Emission lines (glowing gas)'), ...Object.entries(L).map(([n, l]) => h('div', { style: { marginBottom: '6px' } }, h('b', { class: 'small' }, n), strip(l))));
      let mys = K.pick(Object.keys(L)), mys2 = K.pick(Object.keys(L).filter((x) => x !== mys)); const box = h('div'); const res = h('div', { class: 'small' });
      const round = () => { mys = K.pick(Object.keys(L)); mys2 = K.pick(Object.keys(L).filter((x) => x !== mys)); box.innerHTML = ''; box.append(strip([...L[mys], ...L[mys2]], true)); res.textContent = ''; };
      el.append(h('h3', null, 'Mystery star: which two elements absorb these dark lines?'), box, h('div', { class: 'row', style: { marginTop: '6px' } }, Object.keys(L).map((n) => K.btn(n, () => { res.textContent = n === mys || n === mys2 ? `✓ ${n} is there.` : `✗ No ${n} lines here.`; }))), res, K.btn('Answer & new star', () => { res.textContent = `It was ${mys} + ${mys2}.`; setTimeout(round, 1500); })); round();
    } });

  A({ id: 'diffusion', d: ['chemistry', 'biology', 'physics'], e: '🫧', t: 'Diffusion & entropy', b: 'Remove a wall between two gases. They mix and never unmix. Why does time only go one way?',
    how: 'Random motion spreads particles out because there are vastly more mixed arrangements than separated ones. Entropy measures that count (Boltzmann, 1877: S = k log W). Unmixing isn’t forbidden, just astronomically unlikely, which gives time its direction.',
    use: 'Oxygen entering your blood, smells spreading, drug delivery, cooling your coffee, the second law of thermodynamics limiting engine efficiency, and the heat death of the universe.',
    m(el, K) {
      const P = K.canvas(el, 300); let ps, wall = true; const out = K.out(); const hist = [];
      const reset = () => { ps = Array.from({ length: 300 }, (_, i) => ({ x: i < 150 ? Math.random() * 0.5 : 0.5 + Math.random() * 0.5, y: Math.random(), k: i < 150 ? 0 : 1 })); wall = true; hist.length = 0; };
      el.append(h('div', { class: 'row' }, K.btn('Remove the wall', () => (wall = false), true), K.btn('Reset', reset)), out); reset();
      K.raf(() => { ps.forEach((p) => { p.x += K.gauss() * 0.006; p.y += K.gauss() * 0.01; p.y = Lab.clamp(p.y, 0, 1); p.x = Lab.clamp(p.x, 0, 1); if (wall && (p.k === 0 ? p.x > 0.5 : p.x < 0.5)) p.x = p.k === 0 ? 0.499 : 0.501; });
        P.clear(); if (wall) P.rect(P.W / 2 - 2, 0, 4, P.H, K.css('--ink')); ps.forEach((p) => P.dot(p.x * P.W, p.y * P.H, 3, p.k ? '#DC2626' : '#2563EB'));
        const bins = 10; let S = 0; for (let b = 0; b < bins; b++) { const inn = ps.filter((p) => p.x >= b / bins && p.x < (b + 1) / bins); const n = inn.length || 1, r = inn.filter((p) => p.k).length / n; [r, 1 - r].forEach((q) => { if (q > 0) S -= (n / ps.length) * q * Math.log2(q); }); }
        out.innerHTML = `Mixing (entropy) <b>${(S * 100).toFixed(0)}%</b> of maximum` + (S > 0.9 ? ' · fully mixed. Wait as long as you like; it won’t unmix.' : ''); });
    } });

  // ======================= BIOLOGY =======================
  A({ id: 'lotka', d: ['biology', 'math', 'earthspace'], e: '🦊', t: 'Predators & prey', b: 'Rabbits and foxes boom and crash in cycles. Tune the rates and find balance or collapse.',
    how: 'Alfred Lotka (1925) and Vito Volterra (1926) wrote two linked equations: prey grow but are eaten; predators grow by eating and otherwise die off. The result is cycles, with predators lagging behind prey. Hudson’s Bay Company fur records of lynx and hares show cycles of about 10 years.',
    use: 'Fisheries management, pest control, conservation, epidemiology (pathogens and hosts), and even competing firms or ideas.',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { a: 1, b: 0.1, c: 1.5, d: 0.075 }; let x = 10, y = 5; const hist = []; const out = K.out();
      el.append(K.two(h('div', null, K.slider('Rabbit birth rate', 0.2, 2, 0.05, s.a, (v) => (s.a = v)), K.slider('Hunting success', 0.02, 0.3, 0.005, s.b, (v) => (s.b = v))), h('div', null, K.slider('Fox death rate', 0.2, 3, 0.05, s.c, (v) => (s.c = v)), K.slider('Foxes born per rabbit eaten', 0.01, 0.2, 0.005, s.d, (v) => (s.d = v)))), K.btn('Restart', () => { x = 10; y = 5; hist.length = 0; }), out);
      K.raf(() => { for (let i = 0; i < 20; i++) { const dt = 0.002; const dx = s.a * x - s.b * x * y, dy = s.d * x * y - s.c * y; x = Math.max(0.01, x + dx * dt); y = Math.max(0.01, y + dy * dt); } hist.push([x, y]); if (hist.length > 600) hist.shift();
        P.clear(); const mx = Math.max(40, ...hist.flat()); const { X, Y } = P.chart(0, 600, 0, mx, { noX: true, xl: 'time' }); P.line(hist.map((v, i) => [X(i), Y(v[0])]), '#16A34A', 2.5); P.line(hist.map((v, i) => [X(i), Y(v[1])]), '#DC2626', 2.5);
        out.innerHTML = `<span style="color:#16A34A">🐇 ${x.toFixed(0)} rabbits</span> · <span style="color:#DC2626">🦊 ${y.toFixed(1)} foxes</span>`; });
    } });

  A({ id: 'punnett', d: ['biology', 'medicine', 'statistics'], e: '🧬', t: 'Punnett squares', b: 'Cross two parents and predict their children’s traits, from pea flowers to inherited diseases.',
    how: 'Gregor Mendel crossed about 28,000 pea plants (1856–63) and found traits come in pairs of “factors” (genes), one from each parent. A dominant allele (B) masks a recessive one (b). Two carriers (Bb × Bb) have a 1 in 4 chance of a child with two recessive copies.',
    use: 'Genetic counseling for conditions like cystic fibrosis and sickle-cell disease, plant and animal breeding, and understanding blood types.',
    m(el, K) {
      let p1 = 'Bb', p2 = 'Bb'; const box = h('div'); const opts = ['BB', 'Bb', 'bb'];
      const draw = () => { box.innerHTML = ''; const g1 = [...p1], g2 = [...p2]; const kids = []; const tbl = h('table', { style: { borderCollapse: 'collapse', margin: '10px 0', fontSize: '20px' } }, h('tr', null, h('td'), g2.map((a) => h('th', { style: { padding: '10px 20px' } }, a))), g1.map((a) => h('tr', null, h('th', { style: { padding: '10px 20px' } }, a), g2.map((b) => { const k = [a, b].sort().join(''); kids.push(k); return h('td', { style: { padding: '14px 22px', border: '1px solid var(--line)', background: k.includes('B') ? '#9333EA33' : 'rgba(234,179,8,.35)', textAlign: 'center' } }, k); }))));
        const dom = kids.filter((k) => k.includes('B')).length; box.append(tbl, h('p', null, `Dominant trait (e.g. purple flowers / not affected): ${dom}/4 = ${dom * 25}% · recessive trait (white flowers / affected by a recessive condition): ${4 - dom}/4 = ${(4 - dom) * 25}% · carriers (Bb): ${kids.filter((k) => k === 'Bb').length * 25}%`)); };
      el.append(h('div', { class: 'row' }, h('span', null, 'Parent 1:'), K.choice(opts, p1, (v) => { p1 = v; draw(); })), h('div', { class: 'row', style: { marginTop: '6px' } }, h('span', null, 'Parent 2:'), K.choice(opts, p2, (v) => { p2 = v; draw(); })), box,
        h('p', { class: 'tiny muted' }, 'Many traits (height, intelligence, most disease risks) involve hundreds of genes plus environment, so they don’t follow simple Punnett ratios.')); draw();
    } });

  A({ id: 'drift', d: ['biology', 'statistics', 'anthropology'], e: '🎲', t: 'Genetic drift', b: 'In small populations, gene variants vanish or take over by pure luck, no selection needed.',
    how: 'Each generation is a random sample of the last. In small populations the random wobble is large, so variants can disappear or become universal by chance (Sewall Wright, 1931). Bottlenecks and founder effects explain why some isolated groups have unusual frequencies of certain traits.',
    use: 'Conservation of endangered species (cheetahs have very low genetic diversity), human population history, and why some diseases are more common in some communities.',
    m(el, K) {
      const P = K.canvas(el, 300); let N = 50, p0 = 0.5; const out = K.out();
      const run = () => { P.clear(); const { X, Y } = P.chart(0, 200, 0, 1, { xl: 'generations', fy: (v) => Math.round(v * 100) + '%' }); let fixed = 0, lost = 0;
        for (let r = 0; r < 12; r++) { let p = p0; const pts = [[X(0), Y(p)]]; for (let g = 1; g <= 200; g++) { let k = 0; for (let i = 0; i < 2 * N; i++) if (Math.random() < p) k++; p = k / (2 * N); pts.push([X(g), Y(p)]); if (p === 0 || p === 1) break; } if (p === 1) fixed++; if (p === 0) lost++; P.line(pts, K.pal[r % 8], 1.8); }
        out.textContent = `12 populations of ${N}: variant took over in ${fixed}, vanished in ${lost}, still varying in ${12 - fixed - lost}.`; };
      P.onResize = run; el.append(K.slider('Population size', 5, 1000, 5, N, (v) => { N = v; run(); }), K.slider('Starting frequency', 0.05, 0.95, 0.05, p0, (v) => { p0 = v; run(); }), K.btn('Run again', run, true), out); run();
    } });

  A({ id: 'sir', d: ['biology', 'medicine', 'math', 'sociology'], e: '🦠', t: 'Epidemics & herd immunity', b: 'Tune how contagious a disease is and how many are vaccinated. Find the herd immunity threshold.',
    how: 'The SIR model (Kermack & McKendrick, 1927) splits people into Susceptible, Infected and Recovered. R₀ is how many people one case infects in a fully susceptible population. If more than 1 − 1/R₀ are immune, outbreaks fade: about 93–95% for measles (R₀ 12–18), about 50% for seasonal flu.',
    use: 'Vaccination policy, COVID-19 planning, hospital capacity forecasts, and also the spread of rumors and innovations.',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { R0: 3, vax: 0, dur: 10 }; const out = K.out();
      const run = () => { const g = 1 / s.dur, b = s.R0 * g; let S = 1 - s.vax / 100 - 0.001, I = 0.001, R = s.vax / 100; const hist = []; for (let t = 0; t < 365; t++) { for (let k = 0; k < 10; k++) { const ni = b * S * I * 0.1, nr = g * I * 0.1; S -= ni; I += ni - nr; R += nr; } hist.push([S, I, R]); }
        P.clear(); const { X, Y } = P.chart(0, 365, 0, 1, { xl: 'days', fy: (v) => Math.round(v * 100) + '%' }); ['#2563EB', '#DC2626', '#16A34A'].forEach((c, j) => P.line(hist.map((v, i) => [X(i), Y(v[j])]), c, 2.5)); const peak = Math.max(...hist.map((v) => v[1])); const total = hist[364][2] - s.vax / 100;
        out.innerHTML = `<span style="color:#2563EB">Susceptible</span> · <span style="color:#DC2626">Infected</span> · <span style="color:#16A34A">Recovered/immune</span><br>Peak: <b>${(peak * 100).toFixed(1)}%</b> sick at once · ever infected: <b>${(total * 100).toFixed(1)}%</b> · herd immunity threshold for R₀ ${s.R0}: <b>${(Math.max(0, 1 - 1 / s.R0) * 100).toFixed(0)}%</b> immune`; };
      P.onResize = run; el.append(K.slider('R₀ (how contagious)', 0.5, 15, 0.1, s.R0, (v) => { s.R0 = v; run(); }), K.slider('Vaccinated at start (%)', 0, 99, 1, s.vax, (v) => { s.vax = v; run(); }), K.slider('Days contagious', 2, 20, 1, s.dur, (v) => { s.dur = v; run(); }), out, h('p', { class: 'tiny muted' }, 'A simple model: it assumes everyone mixes equally, which real societies don’t.')); run();
    } });

  A({ id: 'weasel', d: ['biology', 'computing', 'philosophy'], e: '🐒', t: 'Random mutation + selection', b: 'Pure chance would take forever to type a sentence. Add selection and it takes dozens of generations.',
    how: 'Richard Dawkins’ “weasel program” (1986) shows cumulative selection: copy the best attempt with random typos, keep the closest. Random typing would need about 27²⁸ tries for a 28-letter phrase. Caveat: real evolution has no target sentence; selection only favors what survives and reproduces now.',
    use: 'Explains how complex adaptations accumulate; inspired genetic algorithms used to design antennas (NASA’s ST5 antenna), schedules and drug molecules.',
    m(el, K) {
      const target = h('input', { type: 'text', value: 'METHINKS IT IS LIKE A WEASEL', style: { width: '100%', fontFamily: 'monospace', textTransform: 'uppercase' } }); const log = h('div', { style: { fontFamily: 'monospace', fontSize: '14px', maxHeight: '260px', overflow: 'auto' } }); let rate = 0.05, kids = 100, cur = null, gen = 0, run = false; const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
      const T = () => target.value.toUpperCase().replace(/[^A-Z ]/g, ''); const score = (s) => [...s].filter((c, i) => c === T()[i]).length;
      const reset = () => { cur = Array.from(T(), () => K.pick(AB)).join(''); gen = 0; log.innerHTML = ''; };
      K.every(60, () => { if (!run || !cur) return; if (cur === T()) { run = false; return; } let best = cur, bs = -1; for (let k = 0; k < kids; k++) { const c = [...cur].map((ch) => (Math.random() < rate ? K.pick(AB) : ch)).join(''); const sc = score(c); if (sc > bs) { bs = sc; best = c; } } cur = best; gen++; log.prepend(h('div', null, `${String(gen).padStart(4)}  ${cur}  (${bs}/${T().length})`)); });
      el.append(h('label', { class: 'ctl' }, 'Target phrase'), target, K.slider('Mutation rate per letter', 0.005, 0.3, 0.005, rate, (v) => (rate = v)), K.slider('Offspring per generation', 2, 500, 1, kids, (v) => (kids = v)), h('div', { class: 'row' }, K.btn('▶ Evolve', () => { if (!cur || cur.length !== T().length) reset(); run = true; }, true), K.btn('Reset', reset)), log); reset();
    } });

  A({ id: 'neuron', d: ['biology', 'medicine', 'psychology', 'computing'], e: '⚡', t: 'A neuron fires', b: 'Inject current into a model neuron and watch it charge up, spike, and reset.',
    how: 'A neuron’s membrane holds a voltage around −70 mV. Input charges it; at about −55 mV ion channels snap open and it fires an all-or-nothing spike, then resets. Hodgkin and Huxley worked out the ion currents in squid giant axons (Nobel 1963). Stronger input means more frequent spikes, not bigger ones.',
    use: 'How the brain codes information, epilepsy and anesthetics, pacemakers, brain-computer interfaces, and spiking neural networks in AI hardware.',
    m(el, K) {
      const P = K.canvas(el, 280); let I = 1.6, v = -70, hist = [], spikes = 0, t = 0; const out = K.out();
      el.append(K.slider('Input current', 0, 4, 0.05, I, (x) => (I = x)), out);
      K.raf(() => { for (let k = 0; k < 4; k++) { t++; v += (-(v + 70) + I * 10) * 0.05 + K.gauss() * 0.3; if (v >= -55) { hist.push(30); v = -75; spikes++; } else hist.push(v); } if (hist.length > 800) hist.splice(0, hist.length - 800);
        P.clear(); const { X, Y } = P.chart(0, 800, -80, 40, { noX: true, fy: (x) => x + ' mV' }); P.line([[X(0), Y(-55)], [X(800), Y(-55)]], '#DC2626', 1, [4, 4]); P.line(hist.map((x, i) => [X(i), Y(x)]), '#9333EA', 1.8);
        out.textContent = I * 10 < 15 ? 'Below threshold: the neuron charges but never fires.' : `Firing. Stronger input → more spikes per second (rate coding). Spikes so far: ${spikes}`; });
    } });

  A({ id: 'resistance', d: ['biology', 'medicine'], e: '💊', t: 'Antibiotic resistance', b: 'Treat an infection. Stop the course early and watch resistant bacteria take over.',
    how: 'In any large population a few bacteria carry mutations that let them survive a drug. Antibiotics kill the susceptible ones, leaving the resistant ones to multiply: natural selection in days. Alexander Fleming warned about this in his 1945 Nobel lecture.',
    use: 'Antimicrobial resistance was directly responsible for an estimated 1.27 million deaths in 2019 (Lancet, 2022). Same logic applies to cancer drug resistance, pesticide resistance in insects, and herbicide-resistant weeds.',
    m(el, K) {
      const P = K.canvas(el, 300); let days = 10, dose = 1; const out = K.out();
      const run = () => { let S = 1e6, R = 10; const hist = []; for (let d = 0; d < 30; d++) { for (let k = 0; k < 10; k++) { const on = d < days; const cap = 1 - (S + R) / 2e7; S += S * (0.07 * cap - (on ? 0.13 * dose : 0)); R += R * (0.06 * cap - (on ? 0.01 * dose : 0)); S = Math.max(S, 0); R = Math.max(R, 0); if (Math.random() < S * 1e-9) R += 1; } hist.push([S, R]); }
        P.clear(); const { X, Y } = P.chart(0, 30, 0, 7.5, { xl: 'days', fy: (v) => '10^' + v.toFixed(0) }); P.rect(X(0), Y(7.5), X(days) - X(0), Y(0) - Y(7.5), '#2563EB12'); P.line(hist.map((v, i) => [X(i), Y(Math.log10(v[0] + 1))]), '#16A34A', 2.5); P.line(hist.map((v, i) => [X(i), Y(Math.log10(v[1] + 1))]), '#DC2626', 2.5);
        const end = hist[29]; out.innerHTML = `<span style="color:#16A34A">Susceptible</span> vs <span style="color:#DC2626">resistant</span> bacteria (log scale). Shaded = treatment days. Day 30: ${Lab.fmt(end[0])} susceptible, ${Lab.fmt(end[1])} resistant.`; };
      P.onResize = run; el.append(K.slider('Days of antibiotics', 0, 30, 1, days, (v) => { days = v; run(); }), K.slider('Dose strength', 0.2, 2, 0.1, dose, (v) => { dose = v; run(); }), out, h('p', { class: 'tiny muted' }, 'A cartoon model for intuition. Real treatment length should follow a doctor’s guidance; recent research suggests shorter courses are often enough for some infections.')); run();
    } });

  A({ id: 'foodweb', d: ['biology', 'earthspace', 'economics'], e: '🌿', t: 'The 10% energy rule', b: 'Follow sunlight up the food chain. Why are there so few lions and so much grass?',
    how: 'Each step up a food chain keeps only about 10% of the energy (Raymond Lindeman, 1942); the rest is lost as heat and movement. So top predators are rare, and food chains rarely exceed 4–5 levels.',
    use: 'Why plant-based diets need less farmland, why tuna and sharks accumulate mercury (biomagnification), fisheries limits, and conservation of large predators.',
    m(el, K) {
      let eff = 10, sun = 1000000; const box = h('div');
      const draw = () => { box.innerHTML = ''; const L = [['☀️ Sunlight reaching plants', sun], ['🌾 Plants', sun * 0.01], ['🐇 Herbivores', sun * 0.01 * eff / 100], ['🦊 Small predators', sun * 0.01 * (eff / 100) ** 2], ['🦁 Top predators', sun * 0.01 * (eff / 100) ** 3]];
        L.slice(1).reverse().forEach(([n, v]) => box.append(h('div', { style: { margin: '4px auto', width: Math.max(4, (Math.log10(v + 1) / Math.log10(sun * 0.01 + 1)) * 100) + '%', background: '#16A34A', color: '#fff', textAlign: 'center', borderRadius: '6px', padding: '8px 4px', fontSize: '13px' } }, `${n}: ${Lab.fmt(v)} units`))); box.append(h('p', { class: 'small' }, `Plants capture about 1% of sunlight. With ${eff}% passed up each level, top predators get ${(((eff / 100) ** 3) * 100).toPrecision(2)}% of the plant energy. Bar widths are on a log scale.`)); };
      el.append(K.slider('Energy passed to the next level (%)', 2, 30, 1, eff, (v) => { eff = v; draw(); }), box); draw();
    } });

  // ======================= EARTH & SPACE =======================
  A({ id: 'seasons', d: ['earthspace', 'physics', 'math'], e: '🌞', t: 'Why we have seasons', b: 'It’s the tilt, not the distance. Change Earth’s tilt and your latitude and watch daylight change.',
    how: 'Earth’s axis is tilted 23.4°. In June the Northern Hemisphere leans toward the Sun: sunlight hits more directly and days are longer. Earth is actually closest to the Sun in early January. With no tilt there would be no seasons.',
    use: 'Agriculture and calendars, solar panel angles, climate zones, migration, ancient monuments aligned to solstices (Stonehenge, Chichén Itzá), and seasonal depression.',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { tilt: 23.4, lat: 40 }; const out = K.out();
      const day = (d) => { const dec = -s.tilt * Math.cos((2 * Math.PI * (d + 10)) / 365); const x = -Math.tan((s.lat * Math.PI) / 180) * Math.tan((dec * Math.PI) / 180); return x <= -1 ? 24 : x >= 1 ? 0 : (24 / Math.PI) * Math.acos(x); };
      const noon = (d) => 90 - s.lat + -s.tilt * Math.cos((2 * Math.PI * (d + 10)) / 365);
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 365, 0, 24, { xl: 'day of year', yl: 'hours of daylight', fx: (v) => ['Jan', 'Mar', 'May', 'Aug', 'Oct', 'Dec'][Math.round(v / 73)] || '' }); const pts = []; for (let d = 0; d <= 365; d++) pts.push([X(d), Y(day(d))]); P.line(pts, '#CA8A04', 3); P.line([[X(0), Y(12)], [X(365), Y(12)]], K.css('--muted'), 1, [4, 4]);
        out.innerHTML = `Latitude ${s.lat}°: longest day <b>${Math.max(...Array.from({ length: 365 }, (_, d) => day(d))).toFixed(1)} h</b>, shortest <b>${Math.min(...Array.from({ length: 365 }, (_, d) => day(d))).toFixed(1)} h</b> · noon sun height in June ${Math.max(0, Math.min(90, noon(172))).toFixed(0)}°, December ${Math.max(0, noon(355)).toFixed(0)}°`; };
      P.onResize = draw; el.append(K.slider('Axial tilt (°)', 0, 45, 0.1, s.tilt, (v) => { s.tilt = v; draw(); }), K.slider('Your latitude (°N)', 0, 89, 1, s.lat, (v) => { s.lat = v; draw(); }), h('div', { class: 'row' }, [['Equator', 0], ['Denver', 39.7], ['London', 51.5], ['Arctic Circle', 66.6]].map(([l, v]) => K.btn(l, () => { s.lat = v; draw(); }))), out); draw();
    } });

  A({ id: 'climate', d: ['earthspace', 'physics', 'economics', 'politics'], e: '🌡️', t: 'Earth’s energy balance', b: 'A one-line climate model: sunlight in, heat out, greenhouse gases in between. Change CO₂ and see the temperature.',
    how: 'Joseph Fourier (1824) realized the atmosphere traps heat; Eunice Foote (1856) and John Tyndall (1859) measured CO₂ absorbing heat; Svante Arrhenius (1896) estimated warming from doubling CO₂. Without greenhouse gases Earth would average about −18 °C instead of +15 °C. Each doubling of CO₂ adds about 3.7 W/m² of heating; with feedbacks, the likely warming is 2.5–4 °C per doubling (IPCC, 2021).',
    use: 'Climate policy, carbon budgets, insurance and agriculture planning. The same energy-balance idea applies to planets like Venus (runaway greenhouse) and Mars.',
    m(el, K) {
      const s = { co2: 420, alb: 0.3, sens: 3 }; const out = h('div'); const P = K.canvas(el, 220);
      const draw = () => { const F = 5.35 * Math.log(s.co2 / 280); const dT = (s.sens / 3.7) * F + (0.3 - s.alb) * 340 * (s.sens / 3.7); const T = 14 + dT; const bare = Math.pow((1361 * (1 - s.alb)) / 4 / 5.67e-8, 0.25) - 273;
        P.clear(); const { X, Y } = P.chart(200, 1200, 10, 26, { xl: 'CO₂ (ppm)', fy: (v) => v + '°C' }); const pts = []; for (let c = 200; c <= 1200; c += 10) pts.push([X(c), Y(14 + (s.sens / 3.7) * 5.35 * Math.log(c / 280) + (0.3 - s.alb) * 340 * (s.sens / 3.7))]); P.line(pts, '#DC2626', 3); P.dot(X(s.co2), Y(T), 7, '#111'); [[280, 'pre-industrial'], [420, 'today (~2024)']].forEach(([c, l]) => { P.line([[X(c), Y(10)], [X(c), Y(26)]], K.css('--muted'), 1, [3, 3]); P.text(l, X(c) + 3, Y(25), { s: 10, c: K.css('--muted') }); });
        out.innerHTML = `<div class="grid g3"><div><div class="tiny muted">Extra heating from CO₂</div><b>${F.toFixed(2)} W/m²</b></div><div><div class="tiny muted">Model global temperature</div><b>${T.toFixed(1)} °C</b> (${dT >= 0 ? '+' : ''}${dT.toFixed(1)} vs 1850)</div><div><div class="tiny muted">With no greenhouse effect</div><b>${bare.toFixed(0)} °C</b></div></div>`; };
      P.onResize = draw; el.append(K.slider('CO₂ concentration (ppm)', 180, 1200, 5, s.co2, (v) => { s.co2 = v; draw(); }), K.slider('Reflectivity (albedo): ice and clouds reflect sunlight', 0.25, 0.35, 0.001, s.alb, (v) => { s.alb = v; draw(); }), K.slider('Climate sensitivity (°C per doubling)', 1.5, 6, 0.1, s.sens, (v) => { s.sens = v; draw(); }), out,
        h('p', { class: 'tiny muted' }, 'A deliberately simple equilibrium model: it ignores ocean lag (so real warming arrives over decades), other gases and aerosols. Observed warming is about 1.2–1.3 °C so far. Policy responses (carbon taxes, regulation, adaptation, nuclear, growth vs. degrowth) are debated in Economics and Politics.')); draw();
    } });

  A({ id: 'quake', d: ['earthspace', 'physics', 'math'], e: '🌋', t: 'Earthquake magnitudes', b: 'Each step on the magnitude scale releases about 32× more energy. Compare famous quakes.',
    how: 'Charles Richter’s scale (1935) was logarithmic; today’s moment magnitude is too. One step up means about 10× more ground shaking and about 32× more energy. A magnitude 9 releases about a million times the energy of a magnitude 5. Plate tectonics (accepted in the 1960s) explains where quakes happen.',
    use: 'Building codes, tsunami warnings, insurance, nuclear plant siting, and detecting underground nuclear tests.',
    m(el, K) {
      const Q = [['Felt indoors', 3], ['Typical damaging quake', 6], ['San Francisco 1906', 7.9], ['Haiti 2010 (very deadly)', 7.0], ['Tōhoku, Japan 2011', 9.1], ['Chile 1960 (largest recorded)', 9.5]]; let a = 6, b = 9.1; const out = h('div'); const P = K.canvas(el, 200);
      const draw = () => { const r = 10 ** (1.5 * (b - a)); P.clear(); const ra = 6, rb = Math.min(P.H / 2 - 4, 6 * Math.sqrt(r)); P.dot(P.W * 0.25, P.H / 2, ra, '#CA8A04'); P.dot(P.W * 0.65, P.H / 2, rb, '#DC262688'); P.text('M' + a, P.W * 0.25, P.H / 2 + 26, { a: 'center' }); P.text('M' + b, P.W * 0.65, P.H / 2, { a: 'center', w: 700 });
        out.innerHTML = `<div class="kpi">${Lab.fmt(r)}× more energy <small>and ${Lab.fmt(10 ** (b - a))}× bigger shaking amplitude (circle areas ∝ energy${rb >= P.H / 2 - 4 ? ', capped' : ''})</small></div>`; };
      P.onResize = draw; el.append(K.slider('Quake A magnitude', 2, 9.5, 0.1, a, (v) => { a = v; draw(); }), K.slider('Quake B magnitude', 2, 9.5, 0.1, b, (v) => { b = v; draw(); }), h('div', { class: 'row' }, Q.map(([l, m]) => K.btn(l + ' (' + m + ')', () => { b = m; draw(); }))), out, h('p', { class: 'tiny muted' }, 'Deaths depend more on building quality and poverty than magnitude: Haiti’s M7.0 killed far more than Chile’s M8.8 the same year.')); draw();
    } });

  A({ id: 'cosmiczoom', d: ['earthspace', 'physics', 'math'], e: '🔭', t: 'Powers of ten', b: 'Zoom from a quark to the observable universe in one slider. Where do we sit?',
    how: 'Scientific notation lets us compare sizes from 10⁻¹⁸ m (quark scale limits) to 10²⁶ m (observable universe). Charles and Ray Eames’ 1977 film “Powers of Ten” made the idea famous. Humans sit roughly in the middle on a log scale.',
    use: 'Every science uses orders of magnitude to sanity-check; nanotechnology, astronomy and particle physics are named after their scales.',
    m(el, K) {
      const S = [[-18, 'Limit on quark size'], [-15, 'Proton'], [-10, 'Atom'], [-9, 'DNA width (2 nm)'], [-7, 'Virus'], [-5, 'Red blood cell'], [-3, 'Ant'], [0, 'Human (1.7 m)'], [2, 'Blue whale / football field'], [3, 'Burj Khalifa (828 m)'], [5, 'Grand Canyon length'], [7, 'Earth (12,742 km)'], [9, 'Sun (1.39 million km)'], [11, 'Earth–Sun distance'], [13, 'Solar system to Neptune'], [16, 'Light-year'], [17, 'Nearest star'], [21, 'Milky Way'], [22, 'Andromeda distance'], [24, 'Galaxy superclusters'], [26.9, 'Observable universe']];
      let e = 0; const big = h('div', { style: { fontSize: '40px', fontWeight: 800, textAlign: 'center', margin: '20px 0' } }); const near = h('div', { class: 'kpi', style: { textAlign: 'center' } }); const strip = h('div', { style: { position: 'relative', height: '50px', background: 'var(--card2)', borderRadius: '10px', marginTop: '10px' } });
      S.forEach(([x, n]) => strip.append(h('div', { title: n, style: { position: 'absolute', left: ((x + 18) / 45) * 100 + '%', top: '10px', width: '3px', height: '30px', background: '#9333EA' } })));
      const mk = h('div', { style: { position: 'absolute', top: '0', width: '4px', height: '50px', background: '#DC2626' } }); strip.append(mk);
      const draw = () => { const n = S.reduce((a, b) => (Math.abs(b[0] - e) < Math.abs(a[0] - e) ? b : a)); big.innerHTML = `10<sup>${e.toFixed(1)}</sup> m`; near.innerHTML = `${n[1]} <small>(about 10^${n[0]} m)</small>`; mk.style.left = ((e + 18) / 45) * 100 + '%'; };
      el.append(K.slider('Zoom (meters, powers of ten)', -18, 27, 0.1, e, (v) => { e = v; draw(); }), big, near, strip); draw();
    } });

  A({ id: 'transit', d: ['earthspace', 'physics', 'statistics'], e: '🪐', t: 'Find a planet by a dip in starlight', b: 'A planet crossing its star dims it slightly. Find the dip in noisy data and measure the planet.',
    how: 'When a planet passes in front of its star, brightness drops by (planet radius ÷ star radius)². Jupiter dims the Sun about 1%; Earth only about 0.008%. NASA’s Kepler and TESS missions found thousands of planets this way, using statistics to pull tiny dips out of noise.',
    use: 'Over 5,000 exoplanets confirmed (NASA, 2022 onward), searching for Earth-like worlds and reading their atmospheres with JWST.',
    m(el, K) {
      const P = K.canvas(el, 300); let rp = 0.1, noise = 0.003, data = [], fold = false; const per = 3.7; const out = K.out();
      const gen = () => { data = []; for (let i = 0; i < 1200; i++) { const t = i * 0.01; const ph = ((t % per) + per) % per; const inT = Math.abs(ph - per / 2) < 0.12; data.push([t, 1 - (inT ? rp * rp : 0) + K.gauss() * noise]); } draw(); };
      const draw = () => { P.clear(); const pts = fold ? data.map(([t, f]) => [((t % per) + per) % per, f]) : data; const x1 = fold ? per : 12; const { X, Y } = P.chart(0, x1, 1 - rp * rp * 2 - noise * 4, 1 + noise * 4, { xl: fold ? 'phase (days)' : 'days', fy: (v) => v.toFixed(3) }); pts.forEach(([t, f]) => P.rect(X(t), Y(f), 2, 2, '#0EA5E9'));
        out.innerHTML = `Dip depth ${(rp * rp * 100).toFixed(2)}% → planet is ${(rp * 109).toFixed(1)}× Earth’s radius for a Sun-sized star ${fold ? '· folding stacks every orbit on top of each other so the dip stands out' : ''}`; };
      P.onResize = draw; el.append(K.slider('Planet size (fraction of star radius)', 0.01, 0.2, 0.005, rp, (v) => { rp = v; gen(); }), K.slider('Measurement noise', 0.0005, 0.01, 0.0005, noise, (v) => { noise = v; gen(); }), K.btn('Fold the data at the orbital period', () => { fold = !fold; draw(); }, true), out); gen();
    } });

  A({ id: 'deeptime', d: ['earthspace', 'biology', 'history', 'anthropology'], e: '⏳', t: 'Earth’s history in one year', b: 'Squeeze 4.54 billion years into a calendar. Humans show up in the last minutes of December 31.',
    how: 'Radiometric dating gives Earth an age of 4.54 billion years. James Hutton (1788) first argued for “deep time” from slowly forming rocks. Scaling it to a year makes the numbers graspable: each day is about 12.4 million years.',
    use: 'Geology, evolution, climate history (ice cores and sediments), and perspective on how recent human civilization is.',
    m(el, K) {
      const E = [[4540, 'Earth forms'], [4400, 'Oldest minerals (zircons)'], [3700, 'Earliest life (evidence debated)'], [2400, 'Great Oxygenation Event'], [1600, 'Complex cells (eukaryotes)'], [541, 'Cambrian explosion'], [470, 'Plants on land'], [252, 'Great Dying (largest extinction)'], [230, 'First dinosaurs'], [66, 'Asteroid ends dinosaurs'], [6, 'Human and chimp lineages split'], [0.3, 'Homo sapiens'], [0.012, 'Farming begins'], [0.005, 'Writing'], [0.0003, 'Industrial Revolution']];
      const list = h('div', { class: 'stack' }); E.forEach(([my, l]) => { const frac = 1 - my / 4540; const sec = frac * 365 * 86400; const d = new Date(2025, 0, 1, 0, 0, sec); const when = my > 10 ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : `Dec 31, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;
        list.append(h('div', { class: 'row', style: { gap: '10px' } }, h('div', { style: { width: '170px', fontWeight: 700 }, class: 'small' }, when), h('div', { style: { flex: 1, height: '8px', background: 'var(--card2)', borderRadius: '4px', position: 'relative' } }, h('div', { style: { position: 'absolute', left: frac * 100 + '%', top: '-3px', width: '14px', height: '14px', borderRadius: '7px', background: '#7C3AED', transform: 'translateX(-7px)' } })), h('div', { class: 'small', style: { width: '260px' } }, `${l} (${my >= 1 ? Lab.fmt(my) + ' million' : Lab.fmt(my * 1e6) + ''} years ago)`))); });
      el.append(list, h('p', { class: 'tiny muted' }, 'All recorded history fits in the last ~35 seconds of the year.'));
    } });

  A({ id: 'moonphase', d: ['earthspace', 'physics', 'religion'], e: '🌓', t: 'Moon phases', b: 'Move the Moon around Earth and see why it waxes and wanes, and why eclipses are rare.',
    how: 'The Moon is always half lit by the Sun; phases are how much of that lit half we see from Earth. A full cycle takes about 29.5 days. Eclipses need a new or full Moon exactly in line, but the Moon’s orbit is tilted about 5°, so most months miss.',
    use: 'Lunar calendars (Islamic, Hebrew and Chinese calendars set holidays like Ramadan, Passover and Lunar New Year by the Moon), tides, navigation and early astronomy.',
    m(el, K) {
      const P = K.canvas(el, 300); let ang = 45; const out = K.out();
      const draw = () => { P.clear(); const cx = P.W * 0.35, cy = P.H / 2, R = Math.min(110, P.H / 2 - 30); P.text('☀️ Sun is this way →', P.W * 0.6, 24, { c: '#CA8A04' }); P.dot(cx, cy, 20, '#2563EB'); P.ctx.strokeStyle = K.css('--line'); P.ctx.beginPath(); P.ctx.arc(cx, cy, R, 0, 7); P.ctx.stroke();
        const a = (ang * Math.PI) / 180, mx = cx + R * Math.cos(a), my = cy - R * Math.sin(a); P.dot(mx, my, 12, '#334155'); P.ctx.fillStyle = '#F8FAFC'; P.ctx.beginPath(); P.ctx.arc(mx, my, 12, -Math.PI / 2, Math.PI / 2); P.ctx.fill();
        const vx = P.W * 0.8, vy = cy, r = 50; const ill = (1 - Math.cos(a)) / 2; const waxing = ang < 180; const c = Math.cos(a);
        P.dot(vx, vy, r, '#334155'); P.ctx.fillStyle = '#F8FAFC'; P.ctx.beginPath(); P.ctx.arc(vx, vy, r, -Math.PI / 2, Math.PI / 2, !waxing); P.ctx.fill();
        P.ctx.fillStyle = c > 0 ? '#334155' : '#F8FAFC'; P.ctx.beginPath(); P.ctx.ellipse(vx, vy, Math.abs(c) * r + 0.5, r + 0.5, 0, 0, 7); P.ctx.fill();
        P.text('What you see from Earth (northern hemisphere)', vx, vy + r + 20, { a: 'center', s: 11 });
        const names = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent']; const idx = Math.round(ang / 45) % 8;
        out.innerHTML = `<b>${names[idx]}</b> · about ${((ang / 360) * 29.5).toFixed(1)} days since new moon · ${(ill * 100).toFixed(0)}% lit`; };
      P.onResize = draw; el.append(K.slider('Moon position in its orbit (°)', 0, 359, 1, ang, (v) => { ang = v; draw(); }), out); draw();
    } });
})();
