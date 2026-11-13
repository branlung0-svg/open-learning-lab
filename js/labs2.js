const { h } = Lab;

// ---------- GUITAR & THE PHYSICS OF SOUND ----------
const STRINGS = [['E', 2, 82.41], ['A', 2, 110.0], ['D', 3, 146.83], ['G', 3, 196.0], ['B', 3, 246.94], ['E', 4, 329.63]];
const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
let actx = null;
const ctxA = () => { if (!actx) { const C = window.AudioContext || window.webkitAudioContext; actx = C ? new C() : null; } if (actx && actx.state === 'suspended') actx.resume(); return actx; };
function pluck(f, dur = 2.2) {
  const ac = ctxA(); if (!ac) { Lab.toast('Sound isn’t available here'); return; }
  const sr = ac.sampleRate, n = Math.floor(sr * dur), N = Math.max(2, Math.round(sr / f));
  const buf = ac.createBuffer(1, n, sr), d = buf.getChannelData(0), ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
  let p = 0;
  for (let i = 0; i < n; i++) { const a = ring[p], b = ring[(p + 1) % N]; d[i] = a * 0.5; ring[p] = 0.996 * 0.5 * (a + b); p = (p + 1) % N; }
  const src = ac.createBufferSource(); src.buffer = buf; const g = ac.createGain(); g.gain.value = 0.9; src.connect(g).connect(ac.destination); src.start();
}
function tone(freqs, dur = 2.5) {
  const ac = ctxA(); if (!ac) return;
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.25 / freqs.length, ac.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur); g.connect(ac.destination);
  freqs.forEach((f) => { const o = ac.createOscillator(); o.frequency.value = f; o.connect(g); o.start(); o.stop(ac.currentTime + dur); });
}
const noteName = (si, fret) => { const [n, oct] = STRINGS[si]; const idx = NOTES.indexOf(n) + fret; return NOTES[idx % 12] + (oct + Math.floor((NOTES.indexOf(n) + fret) / 12)); };

Lab.explorer('physics', 'sound', {
  mount(el) {
    let last = null, mode = 1, raf;
    const info = h('div', { class: 'small', style: { minHeight: '64px' } }, 'Tap any string at any fret. The sound is computed from scratch, the way a real string vibrates (the Karplus–Strong method).');
    const fb = h('div'); const hv = h('div'); const beatsBox = h('div');
    el.append(h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🎸 A real fretboard, real physics'), fb, info),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Harmonics: the hidden notes in every note'), hv,
          h('div', { class: 'row', style: { flexWrap: 'wrap', marginTop: '8px' } }, [1, 2, 3, 4, 5, 6].map((n) => h('button', { class: 'chip' + (n === 1 ? ' on' : ''), style: { '--c': 'var(--accent)' }, onclick: (e) => { mode = n; [...e.target.parentNode.children].forEach((c) => c.classList.toggle('on', c === e.target)); tone([110 * n], 1.6); harmInfo.textContent = harmText(n); } }, 'Mode ' + n)))),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Beats: two notes almost in tune'), beatsBox)),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The math, symbol by symbol'),
          h('p', { style: { fontFamily: "'Space Grotesk'", fontSize: '20px', fontWeight: 700 } }, 'f = f₀ × 2^(n/12)'),
          h('table', { class: 't small' }, [['f', 'the frequency you hear, in hertz (vibrations per second)'], ['f₀', 'the open string’s frequency (low E = 82.41 Hz)'], ['n', 'the fret number'], ['2^(n/12)', 'each fret multiplies the frequency by the 12th root of 2 ≈ 1.0595; 12 frets = ×2 = one octave']].map(([a, b]) => h('tr', null, h('td', null, h('b', null, a)), h('td', null, b)))),
          h('p', { class: 'small' }, 'That’s why frets get closer together up the neck: fret n sits at a distance L × (1 − 2^(−n/12)) from the nut. The 12th fret is exactly halfway, because half the string vibrates twice as fast.'),
          h('p', { style: { fontFamily: "'Space Grotesk'", fontSize: '18px', fontWeight: 700 } }, 'f₁ = (1 / 2L) × √(T / μ)'),
          h('p', { class: 'small' }, 'Mersenne’s law (1636): a string’s pitch rises with tension T and falls with length L and mass per length μ. Tightening a tuning peg raises T; thick low strings have large μ.')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Who figured this out'),
          h('p', { class: 'small' }, h('b', null, 'Pythagoras’ school (c. 500 BCE)'), ' noticed that strings whose lengths are in simple ratios sound good together: 2:1 is an octave, 3:2 a perfect fifth. It was one of the first times anyone found a law of nature written in numbers. (The stories about Pythagoras himself are legends written centuries later.)'),
          h('p', { class: 'small' }, h('b', null, 'Zhu Zaiyu'), ' in Ming China (1584) and ', h('b', null, 'Simon Stevin'), ' in the Netherlands independently computed equal temperament: dividing the octave into 12 equal steps using the 12th root of 2, so a piece can be played in any key.'),
          h('p', { class: 'small' }, h('b', null, 'Joseph Fourier'), ' (1822) proved that any repeating wave is a sum of pure sine waves. A guitar note is a fundamental plus harmonics; their mix is the instrument’s “color” (timbre).'),
          Lab.conf('Established'),
          Lab.apply('every chord you play in jazz or lo-fi is a set of frequency ratios. A major chord is close to 4:5:6. Fourier’s idea is also how audio compression, MRI scanners and many signal-processing tools for markets work.'))));
    // fretboard
    const cv = Lab.canvasBox(fb, 230); const { c, ctx } = cv;
    const geo = () => { const [W, H] = cv.size(); const x0 = 46, x1 = W - 14, L = (x1 - x0) / (1 - 2 ** (-13 / 12)); const fx = (n) => x0 + L * (1 - 2 ** (-n / 12)); const sy = (i) => 26 + (5 - i) * ((H - 52) / 5); return { W, H, x0, x1, fx, sy }; };
    function drawFB() {
      const { W, H, x0, fx, sy } = geo(); ctx.fillStyle = '#3B2414'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#EDE6D6'; ctx.fillRect(x0 - 6, 14, 6, H - 28);
      for (let n = 1; n <= 12; n++) { ctx.fillStyle = '#C0C4CC'; ctx.fillRect(fx(n) - 1.5, 14, 3, H - 28); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '11px Inter'; ctx.textAlign = 'center'; ctx.fillText(n, (fx(n) + fx(n - 1)) / 2, H - 2); }
      [3, 5, 7, 9].forEach((n) => { ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.arc((fx(n) + fx(n - 1)) / 2, H / 2, 5, 0, 7); ctx.fill(); });
      [H / 2 - 22, H / 2 + 22].forEach((y) => { ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.arc((fx(12) + fx(11)) / 2, y, 5, 0, 7); ctx.fill(); });
      STRINGS.forEach((s, i) => { ctx.strokeStyle = i < 3 ? '#D4A373' : '#E5E7EB'; ctx.lineWidth = 3.2 - i * 0.4; ctx.beginPath(); ctx.moveTo(x0, sy(i)); ctx.lineTo(W - 14, sy(i)); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center'; ctx.fillText(s[0], 18, sy(i) + 4); });
      if (last) { const [i, n] = last; const x = n ? (fx(n) + fx(n - 1)) / 2 : x0 - 20; ctx.fillStyle = '#F97316'; ctx.beginPath(); ctx.arc(x, sy(i), 10, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Inter'; ctx.fillText(noteName(i, n).replace(/\d/, ''), x, sy(i) + 3.5); }
    }
    c.addEventListener('pointerdown', (e) => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; const { x0, fx, sy } = geo();
      let si = 0, best = 1e9; for (let i = 0; i < 6; i++) { const d = Math.abs(y - sy(i)); if (d < best) { best = d; si = i; } }
      let n = 0; if (x > x0) for (let k = 1; k <= 12; k++) if (x < fx(k)) { n = k; break; } else n = 12;
      last = [si, n]; const f = STRINGS[si][2] * 2 ** (n / 12); pluck(f); drawFB();
      info.innerHTML = `<b>${noteName(si, n)}</b> · ${STRINGS[si][0]} string, fret ${n} · <b>${f.toFixed(2)} Hz</b> = ${STRINGS[si][2]} × 2^(${n}/12)${n === 12 ? ' · exactly double the open string: one octave up.' : ''}`;
      Lab.addXP(1, 'note played');
    });
    const ro = new ResizeObserver(drawFB); ro.observe(fb); drawFB();
    // harmonics
    const harmText = (n) => `Mode ${n}: the string vibrates in ${n} segment${n > 1 ? 's' : ''} with ${n - 1} still point${n === 2 ? '' : 's'} (nodes), at ${n}× the fundamental. ${n === 2 ? 'Touch the string lightly over the 12th fret and you force this mode: a natural harmonic.' : n === 3 ? 'Touch over the 7th fret: an octave plus a fifth.' : n === 4 ? 'Touch over the 5th fret: two octaves up.' : ''}`;
    const harmInfo = h('p', { class: 'small' }, harmText(1)); hv.after(harmInfo);
    const hcv = Lab.canvasBox(hv, 150);
    const t0 = performance.now();
    const frame = (t) => { const [W, H] = hcv.size(), x = hcv.ctx; x.fillStyle = '#0B1026'; x.fillRect(0, 0, W, H); const amp = H * 0.36 * Math.cos(((t - t0) / 1000) * 6 * Math.min(mode, 3));
      x.strokeStyle = 'rgba(255,255,255,.15)'; x.beginPath(); x.moveTo(16, H / 2); x.lineTo(W - 16, H / 2); x.stroke();
      x.strokeStyle = '#FBBF24'; x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= 200; i++) { const u = i / 200; const X = 16 + u * (W - 32), Y = H / 2 + amp * Math.sin(Math.PI * mode * u); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke();
      for (let k = 0; k <= mode; k++) { x.fillStyle = '#60A5FA'; x.beginPath(); x.arc(16 + (k / mode) * (W - 32), H / 2, 5, 0, 7); x.fill(); }
      raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    // beats
    const f2 = h('input', { type: 'range', min: 440, max: 452, step: 0.5, value: 443 }); const bl = h('b');
    const upd = () => { bl.textContent = `${f2.value} Hz → ${(f2.value - 440).toFixed(1)} beats per second`; };
    f2.oninput = upd; upd();
    beatsBox.append(h('p', { class: 'small' }, 'Two waves at 440 Hz and a slightly different frequency add up and cancel in turn, so the volume throbs. The throb rate equals the difference in frequency. Guitarists tune by turning the peg until the beats slow down and disappear.'),
      h('label', { class: 'ctl small' }, 'Second note: ', bl), f2, h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn primary sm', onclick: () => { tone([440, Number(f2.value)], 4); Lab.markDone('sound:beats', 10, 'heard beats'); } }, '▶ Play both together'), h('button', { class: 'btn sm', onclick: () => tone([440], 2) }, 'Play 440 Hz alone')));
    return () => { cancelAnimationFrame(raf); cv.stop(); hcv.stop(); ro.disconnect(); };
  },
});

// ---------- NATURAL SELECTION ----------
Lab.explorer('body', 'evolution', {
  mount(el) {
    const POP = 40; let bg = 'light', gen = 1, bugs = [], history = [], timer = 0, playing = false, eaten = 0, raf, auto = false;
    const status = h('div', { class: 'row small' }); const holder = h('div'); const chart = h('div');
    el.append(h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'You are the bird'),
      h('p', { class: 'small' }, 'Moths rest on tree bark. Each round you have 8 seconds to catch as many as you can (up to 20). The survivors breed, and their offspring inherit their color with small random mutations. Watch what happens to the population, then switch the bark.'),
      holder, status,
      h('div', { class: 'row', style: { flexWrap: 'wrap', marginTop: '8px' } }, h('button', { class: 'btn primary', onclick: start }, '▶ Hunt (8 s)'), h('button', { class: 'btn sm', onclick: () => runAuto(10) }, '⏩ Let wild birds hunt 10 generations'),
        h('button', { class: 'btn sm', onclick: () => { bg = bg === 'light' ? 'dark' : 'light'; Lab.toast(bg === 'dark' ? 'Factory soot has darkened the bark' : 'Clean air: the bark is pale again'); draw(); } }, '🏭 Switch light/sooty bark'), h('button', { class: 'btn sm', onclick: reset }, 'Reset'))),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Average darkness by generation'), chart),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'This really happened'),
          h('p', { class: 'small' }, 'The peppered moth, ', h('i', null, 'Biston betularia'), ', is normally pale and speckled, camouflaged on lichen-covered bark. A black form was first recorded near Manchester in 1848. As coal smoke killed the lichen and blackened trees, the black form spread until it made up the large majority of moths around industrial cities by the late 1800s. After clean-air laws in the 1950s, the pale form came back.'),
          h('p', { class: 'small' }, 'Bernard Kettlewell’s experiments in the 1950s pointed to birds as the cause. Critics later questioned his methods, so Michael Majerus ran a large new experiment (2001–2007; published 2012) and confirmed that birds eat the more visible moths more often.'),
          Lab.conf('Established'),
          h('p', { class: 'small' }, h('b', null, 'The idea: '), 'Darwin and Wallace (1858): individuals vary, some variation is inherited, more are born than survive, so the traits that help survival become more common, with no plan or goal.'),
          Lab.apply('selection works on anything that varies, is copied and is filtered: trading strategies in a backtest, products in a market, ideas online. The danger in backtests is the same as nature’s: a filter can make random luck look like design.'))));
    const cv = Lab.canvasBox(holder, 330); const { c, ctx } = cv;
    const stars = Array.from({ length: 260 }, () => [Math.random(), Math.random(), Math.random()]);
    function reset() { gen = 1; history = []; bugs = Array.from({ length: POP }, () => ({ g: 0.15 + Math.random() * 0.2 })); place(); record(); draw(); }
    function place() { const [W, H] = cv.size(); bugs.forEach((b) => { b.x = 20 + Math.random() * (W - 40); b.y = 20 + Math.random() * (H - 40); b.a = Math.random() * Math.PI; b.dead = false; }); }
    function record() { history.push(bugs.reduce((s, b) => s + b.g, 0) / bugs.length); drawChart(); status.innerHTML = `<b>Generation ${gen}</b> · average darkness ${(history[history.length - 1] * 100).toFixed(0)}% · bark: ${bg === 'light' ? 'pale lichen' : 'sooty black'}`; }
    function draw() {
      const [W, H] = cv.size(); const base = bg === 'light' ? [205, 200, 185] : [48, 44, 40];
      ctx.fillStyle = `rgb(${base})`; ctx.fillRect(0, 0, W, H);
      stars.forEach(([x, y, r]) => { const v = bg === 'light' ? 150 + r * 90 : 25 + r * 50; ctx.fillStyle = `rgb(${v},${v},${v - 8})`; ctx.fillRect(x * W, y * H, 3 + r * 7, 2 + r * 3); });
      bugs.forEach((b) => { if (b.dead) return; const v = Math.round(235 - b.g * 220); ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = `rgb(${v},${v},${v - 6})`; ctx.beginPath(); ctx.ellipse(-6, 0, 9, 6, -0.4, 0, 7); ctx.ellipse(6, 0, 9, 6, 0.4, 0, 7); ctx.fill(); ctx.fillStyle = `rgb(${v - 40},${v - 40},${v - 40})`; ctx.fillRect(-1.5, -6, 3, 12); ctx.restore(); });
      if (playing) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, 150, 26); ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'left'; ctx.fillText(`⏱ ${Math.max(0, timer).toFixed(1)}s   caught ${eaten}`, 8, 18); }
    }
    function breed() {
      const live = bugs.filter((b) => !b.dead); if (!live.length) return reset();
      bugs = Array.from({ length: POP }, () => { const p = live[Math.floor(Math.random() * live.length)]; return { g: Lab.clamp(p.g + (Math.random() - 0.5) * 0.16, 0, 1) }; });
      gen++; place(); record(); draw();
    }
    function start() { if (playing) return; playing = true; eaten = 0; timer = 8; let last = performance.now();
      const loop = (t) => { timer -= (t - last) / 1000; last = t; draw(); if (timer <= 0 || eaten >= 20) { playing = false; breed(); Lab.addXP(3, 'generation'); if (gen >= 6) Lab.markDone('evo:6', 15, 'six generations'); return; } raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop); }
    c.addEventListener('pointerdown', (e) => { if (!playing) return; const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const hit = bugs.find((b) => !b.dead && Math.hypot(b.x - x, b.y - y) < 16); if (hit) { hit.dead = true; eaten++; } });
    function runAuto(k) { for (let i = 0; i < k; i++) { const target = bg === 'light' ? 0.1 : 0.9;
        const vis = bugs.map((b) => Math.abs(b.g - target) + 0.05); let caught = 0;
        while (caught < 18) { const tot = vis.reduce((s, v, j) => s + (bugs[j].dead ? 0 : v), 0); let r = Math.random() * tot; for (let j = 0; j < bugs.length; j++) { if (bugs[j].dead) continue; r -= vis[j]; if (r <= 0) { bugs[j].dead = true; caught++; break; } } }
        breed(); }
      Lab.markDone('evo:auto', 10, 'wild birds'); }
    function drawChart() { chart.innerHTML = ''; const W = 420, H = 160; const s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto"><line x1="30" y1="${H - 20}" x2="${W}" y2="${H - 20}" stroke="currentColor" opacity=".2"/><text x="0" y="14" font-size="10" fill="currentColor" opacity=".6">dark</text><text x="0" y="${H - 22}" font-size="10" fill="currentColor" opacity=".6">pale</text><polyline fill="none" stroke="var(--accent)" stroke-width="3" points="${history.map((v, i) => `${30 + (i / Math.max(1, history.length - 1)) * (W - 40)},${H - 20 - v * (H - 34)}`).join(' ')}"/>${history.map((v, i) => `<circle cx="${30 + (i / Math.max(1, history.length - 1)) * (W - 40)}" cy="${H - 20 - v * (H - 34)}" r="3" fill="var(--accent)"/>`).join('')}<text x="${W - 4}" y="${H - 4}" font-size="10" text-anchor="end" fill="currentColor" opacity=".6">generation ${gen}</text></svg>`; chart.innerHTML = s; }
    setTimeout(reset, 30);
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});

// ---------- BALANCE THE REACTION ----------
const RX = [
  { name: 'Making water', eq: [['H2', 'O2'], ['H2O']], ans: [2, 1, 2], why: 'Hydrogen burning in oxygen. This is what powered the Space Shuttle’s main engines, and it is how a fuel cell makes electricity.' },
  { name: 'Burning natural gas', eq: [['CH4', 'O2'], ['CO2', 'H2O']], ans: [1, 2, 1, 2], why: 'Methane, the main part of natural gas, burning in a stove or power plant. Each molecule burned releases one molecule of CO₂.' },
  { name: 'Rust', eq: [['Fe', 'O2'], ['Fe2O3']], ans: [4, 3, 2], why: 'Iron slowly combining with oxygen (water speeds it up). Rust costs economies huge sums every year in damaged bridges, pipes and ships.' },
  { name: 'Table salt', eq: [['Na', 'Cl2'], ['NaCl']], ans: [2, 1, 2], why: 'A soft, explosive metal and a poisonous green gas combine into something you eat. Properties come from structure, not ingredients.' },
  { name: 'Fertilizer (Haber–Bosch)', eq: [['N2', 'H2'], ['NH3']], ans: [1, 3, 2], why: 'Fritz Haber (1909) and Carl Bosch turned nitrogen from the air into ammonia. The fertilizer it makes is estimated to feed around half of humanity today.' },
  { name: 'Grilling with propane', eq: [['C3H8', 'O2'], ['CO2', 'H2O']], ans: [1, 5, 3, 4], why: 'Propane in a gas grill or heater.' },
  { name: 'Your cells breathing', eq: [['C6H12O6', 'O2'], ['CO2', 'H2O']], ans: [1, 6, 6, 6], why: 'Cellular respiration: glucose burned slowly in your mitochondria to make energy. The CO₂ you breathe out comes from here.' },
  { name: 'Photosynthesis', eq: [['CO2', 'H2O'], ['C6H12O6', 'O2']], ans: [6, 6, 1, 6], why: 'The reverse of respiration, powered by sunlight. Nearly all the oxygen you breathe came from photosynthesis.' },
  { name: 'Gasoline in an engine', eq: [['C8H18', 'O2'], ['CO2', 'H2O']], ans: [2, 25, 16, 18], why: 'Octane burning in a car engine. The big numbers show how much oxygen burning fuel consumes.' },
];
const COL = { H: '#F8FAFC', O: '#EF4444', C: '#334155', N: '#3B82F6', Fe: '#F97316', Na: '#A855F7', Cl: '#22C55E' };
const parseF = (f) => { const o = {}; f.replace(/([A-Z][a-z]?)(\d*)/g, (_, e, n) => { o[e] = (o[e] || 0) + (n ? +n : 1); }); return o; };
const sub = (f) => f.replace(/(\d+)/g, (d) => d.split('').map((x) => '₀₁₂₃₄₅₆₇₈₉'[x]).join(''));
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

Lab.explorer('physics', 'reactions', {
  mount(el) {
    let ri = 0, co = [], solved = new Set();
    const pick = h('div', { class: 'row', style: { flexWrap: 'wrap' } }); const eqBox = h('div'); const tbl = h('div'); const msg = h('div', { style: { minHeight: '24px', fontWeight: 600 } }); const why = h('p', { class: 'small' });
    el.append(h('div', { class: 'card' }, pick), h('div', { class: 'card' }, eqBox, msg, why), h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Atom count'), tbl),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Why equations must balance'),
        h('p', { class: 'small' }, 'Atoms are not created or destroyed in a chemical reaction; they are only rearranged. So every atom on the left must appear on the right. Antoine Lavoisier showed this in the 1770s and 1780s by weighing everything, including the gases, before and after reactions, and found the total mass never changed: the law of conservation of mass.'),
        h('table', { class: 't small' }, [['2H₂O', 'The big number in front (the coefficient) counts molecules: two water molecules.'], ['H₂', 'The small number (the subscript) counts atoms inside one molecule. You may change coefficients, never subscripts, because changing a subscript makes a different substance (H₂O₂ is hydrogen peroxide).'], ['→', 'Turns into.']].map(([a, b]) => h('tr', null, h('td', null, h('b', { style: { fontSize: '16px' } }, a)), h('td', null, b)))),
        Lab.conf('Established'))));
    RX.forEach((r, i) => pick.append(h('button', { class: 'tab' + (i === ri ? ' on' : ''), onclick: (e) => { ri = i; [...pick.children].forEach((b) => b.classList.toggle('on', b === e.target)); load(); } }, r.name)));
    function load() { const r = RX[ri]; co = r.eq.flat().map(() => 1); why.textContent = r.why; render(); }
    function counts(side) { const r = RX[ri]; const out = {}; const off = side ? r.eq[0].length : 0; r.eq[side].forEach((f, k) => { const p = parseF(f); for (const e in p) out[e] = (out[e] || 0) + p[e] * co[off + k]; }); return out; }
    function render() {
      const r = RX[ri]; eqBox.innerHTML = ''; let k = 0;
      const row = h('div', { class: 'row', style: { justifyContent: 'center', flexWrap: 'wrap', gap: '10px', fontFamily: "'Space Grotesk'", fontSize: '26px', fontWeight: 700 } });
      r.eq.forEach((side, si) => { side.forEach((f, j) => { const idx = k++;
        row.append(h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } },
          h('div', { class: 'row', style: { gap: '4px' } }, h('button', { class: 'btn sm', onclick: () => { co[idx] = Math.max(1, co[idx] - 1); render(); } }, '−'), h('span', { style: { minWidth: '26px', textAlign: 'center', color: 'var(--accent)' } }, co[idx]), h('button', { class: 'btn sm', onclick: () => { co[idx] = Math.min(30, co[idx] + 1); render(); } }, '+')),
          h('div', null, sub(f)), molecule(f, co[idx])));
        if (j < side.length - 1) row.append(h('span', null, '+')); });
        if (si === 0) row.append(h('span', { style: { color: 'var(--accent)' } }, '→')); });
      eqBox.append(row);
      const L = counts(0), R = counts(1); const els = [...new Set([...Object.keys(L), ...Object.keys(R)])];
      tbl.innerHTML = ''; tbl.append(h('table', { class: 't' }, h('tr', null, h('th', null, 'Element'), h('th', null, 'Left'), h('th', null, 'Right'), h('th', null, '')),
        els.map((e) => h('tr', null, h('td', null, h('span', { style: { display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: COL[e], border: '1px solid #94A3B8', marginRight: '6px' } }), e), h('td', null, L[e] || 0), h('td', null, R[e] || 0), h('td', null, (L[e] || 0) === (R[e] || 0) ? '✅' : '❌')))));
      const bal = els.every((e) => (L[e] || 0) === (R[e] || 0)); const g = co.reduce(gcd);
      if (bal && g === 1) { msg.innerHTML = '🎉 Balanced! Every atom is accounted for.'; if (!solved.has(ri)) { solved.add(ri); Lab.addXP(6, 'reaction balanced'); if (solved.size === RX.length) Lab.markDone('rx:all', 30, 'all reactions'); } }
      else if (bal) msg.textContent = `Balanced, but every number can be divided by ${g}. Use the smallest whole numbers.`;
      else msg.textContent = 'Not balanced yet: count each kind of atom on both sides.';
    }
    function molecule(f, n) { const p = parseF(f); const atoms = []; for (const e in p) for (let i = 0; i < p[e]; i++) atoms.push(e);
      const one = () => h('span', { style: { display: 'inline-flex', flexWrap: 'wrap', width: Math.min(60, 10 * Math.ceil(Math.sqrt(atoms.length)) + 4) + 'px', gap: '1px', padding: '2px', margin: '1px' } }, atoms.map((e) => h('i', { title: e, style: { width: '8px', height: '8px', borderRadius: '50%', background: COL[e], border: '1px solid #64748B' } })));
      return h('div', { style: { display: 'flex', flexWrap: 'wrap', maxWidth: '140px', justifyContent: 'center' } }, Array.from({ length: Math.min(n, 12) }, one), n > 12 ? h('span', { class: 'tiny muted' }, '+' + (n - 12)) : null); }
    load();
  },
});

// register in the hands-on subject menus
Lab.subject('physics').ex.push(['reactions', 'Balance the reaction'], ['sound', 'Guitar & sound']);
Lab.subject('body').ex.push(['evolution', 'Natural selection']);
