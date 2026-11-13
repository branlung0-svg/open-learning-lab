const { h } = Lab;

function canvasBox(el, height) {
  const c = h('canvas'); const box = h('div', { class: 'viz', style: { height: height + 'px', background: '#0B1026' } }, c); el.append(box);
  const ctx = c.getContext('2d'); let W = 0, H = 0, dpr = 1;
  const fit = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = box.clientWidth; H = box.clientHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const ro = new ResizeObserver(fit); ro.observe(box); fit();
  return { c, ctx, box, size: () => [W, H], stop: () => ro.disconnect() };
}
Lab.canvasBox = canvasBox;

// ---------- ORBITS ----------
const PLANETS = [
  ['Mercury', 0.387, 88.0, 0.055, 0.38, '176 Earth days (sunrise to sunrise)', '#A8A29E', 3],
  ['Venus', 0.723, 224.7, 0.815, 0.91, '117 Earth days; it spins backwards', '#FCD34D', 5],
  ['Earth', 1.0, 365.25, 1, 1, '24 hours', '#3B82F6', 5],
  ['Mars', 1.524, 687.0, 0.107, 0.38, '24.7 hours', '#EF4444', 4],
  ['Jupiter', 5.203, 4331, 317.8, 2.53, '9.9 hours', '#D97706', 10],
  ['Saturn', 9.537, 10747, 95.2, 1.07, '10.7 hours', '#FDE68A', 9],
  ['Uranus', 19.19, 30589, 14.5, 0.9, '17.2 hours; tipped on its side', '#67E8F9', 7],
  ['Neptune', 30.07, 59800, 17.1, 1.14, '16.1 hours', '#818CF8', 7],
];
Lab.explorer('physics', 'orbits', {
  mount(el) {
    let mode = 'solar', speed = 30, t = 0, sel = 2, raf, last = performance.now();
    const modeRow = h('div', { class: 'row' });
    const holder = h('div');
    const side = h('div', { class: 'card' });
    const speedR = h('input', { type: 'range', min: 1, max: 400, value: speed });
    const speedL = h('b');
    el.append(h('div', { class: 'card' }, modeRow, h('div', { style: { height: '10px' } }), holder,
      h('div', { class: 'row', style: { marginTop: '10px' } }, h('div', { style: { flex: 1, minWidth: '200px' } }, h('label', { class: 'ctl' }, 'Time speed ', speedL), speedR))), side);
    const cv = canvasBox(holder, 460);
    const { ctx } = cv;
    const stars = Array.from({ length: 160 }, () => [Math.random(), Math.random(), Math.random() * 1.2 + 0.2]);
    // sandbox state
    let bodies = [], drag = null, best = 0;
    const GM = 4000; // sandbox gravity strength (pixels^3/s^2)
    const setMode = (m) => { mode = m; bodies = []; [...modeRow.children].forEach((b) => b.classList.toggle('on', b.dataset.m === m)); drawSide(); };
    modeRow.append(
      h('button', { class: 'tab on', 'data-m': 'solar', onclick: () => setMode('solar') }, '☀️ Real solar system'),
      h('button', { class: 'tab', 'data-m': 'sandbox', onclick: () => setMode('sandbox') }, '🚀 Launch your own moons'));
    speedR.oninput = () => (speed = +speedR.value);
    function drawSide() {
      side.innerHTML = '';
      if (mode === 'solar') {
        const p = PLANETS[sel];
        side.append(h('div', { class: 'grid g2' },
          h('div', null, h('span', { class: 'tag', style: { '--c': p[6] } }, 'Planet'), h('h3', { style: { marginTop: '8px' } }, p[0]),
            h('table', { class: 't small' }, [['Distance from Sun', p[1] + ' AU (' + Lab.fmt(p[1] * 149.6) + ' million km)'], ['Year length', p[2] < 1000 ? p[2] + ' Earth days' : (p[2] / 365.25).toFixed(1) + ' Earth years'], ['Mass', p[3] + '× Earth'], ['Gravity', p[4] + '× Earth (you’d weigh ' + Math.round(p[4] * 70) + ' kg-force if you weigh 70 kg)'], ['Day length', p[5]]].map(([k, v]) => h('tr', null, h('td', { class: 'muted' }, k), h('td', null, v)))),
            h('p', { class: 'tiny muted' }, 'Tap a planet to switch. Distances are drawn on a square-root scale so the inner planets fit; real gaps are far bigger.')),
          h('div', null, h('h3', null, 'Kepler’s third law, checked with real data'), h('p', { class: 'small' }, 'In 1619 Kepler found that a planet’s year squared equals its distance cubed (in Earth years and AU). Newton later showed gravity explains why.'),
            h('table', { class: 't small' }, h('tr', null, h('th', null, 'Planet'), h('th', null, 'Predicted year'), h('th', null, 'Measured')),
              PLANETS.map((q) => h('tr', null, h('td', null, q[0]), h('td', null, Math.pow(q[1], 1.5).toFixed(2) + ' yr'), h('td', null, (q[2] / 365.25).toFixed(2) + ' yr')))),
            Lab.source('<a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/">NASA Planetary Fact Sheet</a>.'))));
      } else {
        side.append(h('h3', null, 'Your mission: a stable orbit'), h('p', { class: 'small' }, 'Press and drag anywhere, then let go to launch a moon. The arrow is your launch velocity. Too slow and it falls into the star; too fast and it escapes. In between, you get an ellipse, which is what every orbit really is.'),
          h('div', { class: 'row' }, h('div', null, h('div', { class: 'tiny muted' }, 'Moons in orbit'), h('div', { class: 'kpi', id: 'orbCount' }, '0')), h('div', null, h('div', { class: 'tiny muted' }, 'Most orbits completed'), h('div', { class: 'kpi', id: 'orbBest' }, best))),
          h('div', { class: 'hint small' }, 'The rule: an object stays bound if its kinetic energy is less than the energy needed to escape gravity. At any distance r, a circular orbit needs speed √(GM/r), and escape needs √2 times that.'),
          h('button', { class: 'btn sm', onclick: () => (bodies = []) }, 'Clear'),
          Lab.apply('rockets don’t go “up” to reach orbit; they go sideways fast enough that they keep falling around the Earth. About 7.8 km/s in low orbit.'));
      }
    }
    const scaleR = (a, R) => Math.sqrt(a / 30.07) * R;
    cv.c.addEventListener('pointerdown', (e) => {
      const r = cv.c.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      if (mode === 'solar') {
        const [W, H] = cv.size(); const R = Math.min(W, H) / 2 - 16;
        let bi = -1, bd = 1e9; PLANETS.forEach((p, i) => { const ang = (t / p[2]) * Math.PI * 2; const px = W / 2 + Math.cos(ang) * scaleR(p[1], R), py = H / 2 + Math.sin(ang) * scaleR(p[1], R); const d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; bi = i; } });
        if (bd < 30) { sel = bi; drawSide(); Lab.addXP(1); }
      } else { drag = { x, y, x2: x, y2: y }; cv.c.setPointerCapture(e.pointerId); }
    });
    cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const r = cv.c.getBoundingClientRect(); drag.x2 = e.clientX - r.left; drag.y2 = e.clientY - r.top; });
    cv.c.addEventListener('pointerup', () => { if (!drag) return; bodies.push({ x: drag.x, y: drag.y, vx: (drag.x2 - drag.x) * 1.2, vy: (drag.y2 - drag.y) * 1.2, trail: [], ang: 0, laps: 0, prev: null, hue: Math.random() * 360 }); drag = null; });
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const [W, H] = cv.size(); const cx = W / 2, cy = H / 2;
      ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H);
      for (const [sx, sy, sr] of stars) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(sx * W, sy * H, sr, sr); }
      const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 26); grd.addColorStop(0, '#FFF7CC'); grd.addColorStop(0.4, '#FDBA21'); grd.addColorStop(1, 'rgba(253,186,33,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, 7); ctx.fill();
      if (mode === 'solar') {
        t += dt * speed; const R = Math.min(W, H) / 2 - 16;
        PLANETS.forEach((p, i) => {
          const rr = scaleR(p[1], R), ang = (t / p[2]) * Math.PI * 2;
          ctx.strokeStyle = i === sel ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke();
          const px = cx + Math.cos(ang) * rr, py = cy + Math.sin(ang) * rr;
          ctx.fillStyle = p[6]; ctx.beginPath(); ctx.arc(px, py, p[7] * (Math.min(W, H) / 600 + 0.3), 0, 7); ctx.fill();
          if (p[0] === 'Saturn') { ctx.strokeStyle = '#FDE68A'; ctx.beginPath(); ctx.ellipse(px, py, 15, 5, 0.4, 0, 7); ctx.stroke(); }
          if (i === sel || W > 700) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '12px Inter, sans-serif'; ctx.fillText(p[0], px + 10, py - 8); }
        });
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '600 14px Inter, sans-serif';
        ctx.fillText(`${(t / 365.25).toFixed(1)} Earth years`, 14, 24);
        ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText(`${speed} days per second`, 14, 42);
      } else {
        let alive = 0;
        const sub = 6, h2 = dt / sub;
        for (const b of bodies) {
          if (b.dead) continue;
          for (let s = 0; s < sub; s++) {
            const dx = cx - b.x, dy = cy - b.y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
            if (r < 14) { b.dead = 'crashed'; break; }
            const a = (GM * 60) / r2; b.vx += (a * dx / r) * h2; b.vy += (a * dy / r) * h2; b.x += b.vx * h2; b.y += b.vy * h2;
          }
          const ang = Math.atan2(b.y - cy, b.x - cx); if (b.prev != null) { let d = ang - b.prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; b.ang += d; } b.prev = ang;
          const laps = Math.floor(Math.abs(b.ang) / (2 * Math.PI)); if (laps > b.laps) { b.laps = laps; if (laps > best) { best = laps; const e = document.getElementById('orbBest'); if (e) e.textContent = best; } if (laps === 1) Lab.markDone('orbit:stable', 20, 'stable orbit'); }
          if (Math.hypot(b.x - cx, b.y - cy) > Math.max(W, H) * 2) b.dead = 'escaped';
          b.trail.push([b.x, b.y]); if (b.trail.length > 400) b.trail.shift();
          ctx.strokeStyle = `hsla(${b.hue},90%,65%,.45)`; ctx.lineWidth = 1.5; ctx.beginPath(); b.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
          if (!b.dead) { alive++; ctx.fillStyle = `hsl(${b.hue},90%,70%)`; ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, 7); ctx.fill(); }
        }
        const oc = document.getElementById('orbCount'); if (oc) oc.textContent = alive;
        if (drag) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(drag.x, drag.y); ctx.lineTo(drag.x2, drag.y2); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(drag.x, drag.y, 5, 0, 7); ctx.fill();
          const r = Math.hypot(drag.x - cx, drag.y - cy), v = Math.hypot(drag.x2 - drag.x, drag.y2 - drag.y) * 1.2, vc = Math.sqrt(GM * 60 / r);
          ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = '#fff';
          ctx.fillText(v < vc * 0.7 ? 'too slow: will fall in' : v > vc * Math.SQRT2 ? 'faster than escape speed' : v > vc * 0.9 && v < vc * 1.1 ? 'close to a circular orbit (if sideways)' : 'elliptical orbit (if sideways)', drag.x2 + 10, drag.y2);
        }
        if (!bodies.length && !drag) { ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '14px Inter, sans-serif'; ctx.fillText('Press, drag sideways, release.', 14, 24); }
      }
      raf = requestAnimationFrame(frame);
    }
    drawSide(); raf = requestAnimationFrame(frame);
    const sp = setInterval(() => (speedL.textContent = mode === 'solar' ? speed + ' days/s' : '(sandbox runs in real time)'), 200);
    return () => { cancelAnimationFrame(raf); clearInterval(sp); cv.stop(); };
  },
});

// ---------- PROJECTILE ----------
const WORLDS = [['Earth', 9.81, '#3B82F6'], ['Moon', 1.62, '#9CA3AF'], ['Mars', 3.71, '#EF4444'], ['Jupiter', 24.79, '#D97706']];
Lab.explorer('physics', 'projectile', {
  mount(el) {
    const st = { ang: 45, v: 25, w: 0, drag: false };
    let target = 40 + Math.random() * 40, shot = null, raf, hits = 0, tries = 0;
    const holder = h('div'); const out = h('div');
    const ctl = (label, key, min, max, step, fmt) => { const v = h('b'); const r = h('input', { type: 'range', min, max, step, value: st[key] }); const upd = () => (v.textContent = fmt(st[key])); r.oninput = () => { st[key] = +r.value; upd(); predict(); }; upd(); return h('div', null, h('label', { class: 'ctl' }, label + ' ', v), r); };
    const worldSel = h('select', null, WORLDS.map(([n, g], i) => h('option', { value: i }, `${n} (g = ${g} m/s²)`)));
    const dragChk = h('input', { type: 'checkbox' });
    worldSel.onchange = () => { st.w = +worldSel.value; target = 20 + Math.random() * (WORLDS[st.w][1] < 5 ? 200 : 70); shot = null; predict(); };
    dragChk.onchange = () => { st.drag = dragChk.checked; predict(); };
    el.append(h('div', { class: 'card' }, holder,
      h('div', { class: 'grid g3', style: { marginTop: '10px' } }, ctl('Launch angle', 'ang', 5, 85, 1, (v) => v + '°'), ctl('Launch speed', 'v', 5, 60, 1, (v) => v + ' m/s'), h('div', null, h('label', { class: 'ctl' }, 'World'), worldSel, h('label', { class: 'row small', style: { gap: '6px', marginTop: '8px' } }, dragChk, 'Air resistance (baseball)'))),
      h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', onclick: fire }, '🎯 Fire'), h('button', { class: 'btn', onclick: () => { target = 20 + Math.random() * (WORLDS[st.w][1] < 5 ? 200 : 70); shot = null; predict(); } }, 'New target'), h('span', { class: 'sp' }), out)),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'The physics'), h('p', { class: 'small' }, 'Without air, a projectile’s sideways speed never changes, while gravity pulls its upward speed down at a steady rate. That gives a perfect parabola, and the range is:'),
          h('div', { class: 'kpi', style: { fontSize: '20px', margin: '6px 0' } }, 'R = v² · sin(2θ) / g'), h('p', { class: 'small' }, 'So 45° goes farthest, and 30° and 60° land in the same spot. On the Moon, gravity is about 1/6 of Earth’s, so the same throw goes 6 times as far. Air resistance breaks all of this: a real baseball’s best angle is lower and it lands much shorter.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'History'), h('p', { class: 'small' }, 'Galileo showed around 1638 that thrown objects follow parabolas, overturning the ancient idea that they fly straight, then drop. The math was soon used to aim cannon; today it guides everything from basketball shots to spacecraft.'),
          Lab.apply('before you fire, predict where it will land. Guess, test, compare, adjust: that loop is the scientific method, and it is how you learn anything fast.'))));
    const cv = canvasBox(holder, 360); const { ctx } = cv;
    function sim(withDrag) {
      const g = WORLDS[st.w][1], th = st.ang * Math.PI / 180; let x = 0, y = 0, vx = st.v * Math.cos(th), vy = st.v * Math.sin(th); const pts = [[0, 0]]; const k = withDrag && st.w !== 1 ? 0.0055 : 0; const dt = 0.01; let tt = 0, ymax = 0;
      while (y >= 0 && tt < 200) { const sp = Math.hypot(vx, vy); vx -= k * sp * vx * dt; vy -= (g + k * sp * vy) * dt; x += vx * dt; y += vy * dt; tt += dt; ymax = Math.max(ymax, y); pts.push([x, y]); }
      return { pts, range: x, t: tt, ymax };
    }
    let pred;
    function predict() { pred = sim(st.drag); draw(); }
    function fire() { shot = { ...sim(st.drag), i: 0 }; tries++; anim(); }
    function anim() { cancelAnimationFrame(raf); const step = () => { if (!shot) return; shot.i = Math.min(shot.pts.length - 1, shot.i + Math.max(2, Math.round(shot.pts.length / 120))); draw(); if (shot.i < shot.pts.length - 1) raf = requestAnimationFrame(step); else land(); }; raf = requestAnimationFrame(step); }
    function land() {
      const err = Math.abs(shot.range - target); const hit = err < Math.max(2, target * 0.04);
      out.innerHTML = '';
      out.append(h('span', { class: 'pill', style: { color: hit ? 'var(--good)' : 'var(--bad)' } }, hit ? '🎯 Hit!' : `Missed by ${err.toFixed(1)} m`), h('span', { class: 'small muted' }, ` range ${shot.range.toFixed(1)} m · height ${shot.ymax.toFixed(1)} m · ${shot.t.toFixed(1)} s`));
      if (hit) { hits++; Lab.addXP(5, 'target hit'); target = 20 + Math.random() * (WORLDS[st.w][1] < 5 ? 200 : 70); }
    }
    function draw() {
      const [W, H] = cv.size(); const scaleMax = Math.max(target * 1.15, pred.range * 1.1, 30); const sx = (W - 40) / scaleMax; const sy = Math.min(sx, (H - 50) / Math.max(pred.ymax * 1.2, 10)); const X = (x) => 20 + x * sx, Y = (y) => H - 26 - y * sy;
      ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = WORLDS[st.w][2]; ctx.globalAlpha = 0.35; ctx.fillRect(0, H - 26, W, 26); ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '11px Inter, sans-serif'; for (let m = 0; m <= scaleMax; m += scaleMax > 150 ? 50 : 10) { ctx.fillText(m + ' m', X(m) - 8, H - 8); }
      ctx.fillStyle = '#F43F5E'; ctx.fillRect(X(target) - 6, H - 40, 12, 14); ctx.fillStyle = '#fff'; ctx.fillText('target ' + target.toFixed(0) + ' m', X(target) - 30, H - 46);
      ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); pred.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.setLineDash([]);
      if (st.drag) { const vac = sim(false); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); vac.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); }
      if (shot) { ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= shot.i; i++) { const [x, y] = shot.pts[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); } ctx.stroke(); const [bx, by] = shot.pts[shot.i]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X(bx), Y(by), 6, 0, 7); ctx.fill(); ctx.lineWidth = 1; }
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '12px Inter, sans-serif'; ctx.fillText(`Dashed line: your aim. ${hits} hits in ${tries} shots.`, 12, 20);
    }
    predict();
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});

// ---------- PERIODIC TABLE ----------
const CATC = [[/alkali metal/, '#F87171', 'Alkali metals'], [/alkaline earth/, '#FB923C', 'Alkaline earth metals'], [/^transition metal|probably transition/, '#FBBF24', 'Transition metals'], [/post-transition/, '#A3E635', 'Post-transition metals'], [/metalloid/, '#34D399', 'Metalloids'], [/nonmetal/, '#22D3EE', 'Nonmetals'], [/noble gas/, '#A78BFA', 'Noble gases'], [/lanthanide/, '#F472B6', 'Lanthanides'], [/actinide/, '#E879F9', 'Actinides']];
const catColor = (c) => { for (const [re, col] of CATC) if (re.test(c)) return col; return '#CBD5E1'; };
Lab.explorer('physics', 'elements', {
  async mount(el) {
    const E = await Lab.json('data/elements.json');
    let mode = 'cat', sel = E[25], raf;
    const modes = [['cat', 'Type'], ['phase', 'State at room temp'], ['melt', 'Melting point'], ['en', 'Pulls on electrons']];
    const modeRow = h('div', { class: 'row' });
    const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0,1fr))', gap: '3px', minWidth: '640px' } });
    const legend = h('div', { class: 'row small', style: { marginTop: '10px', gap: '10px' } });
    const card = h('div', { class: 'card' });
    el.append(h('div', { class: 'card' }, modeRow, h('div', { style: { overflowX: 'auto', marginTop: '10px' } }, grid), legend, Lab.source('<a href="https://github.com/Bowserinator/Periodic-Table-JSON">Periodic-Table-JSON</a> (Bowserinator, CC BY-A); element summaries from Wikipedia (CC BY-SA).')), card);
    modes.forEach(([m, n]) => modeRow.append(h('button', { class: 'tab' + (m === mode ? ' on' : ''), onclick: (e) => { mode = m; [...modeRow.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, n)));
    const melts = E.map((e) => e.melt).filter((x) => x), mMax = Math.max(...melts);
    function color(e) {
      if (mode === 'cat') return catColor(e.category);
      if (mode === 'phase') return e.phase === 'Gas' ? '#38BDF8' : e.phase === 'Liquid' ? '#F472B6' : '#94A3B8';
      if (mode === 'melt') return e.melt ? d3.interpolateTurbo(Math.pow(e.melt / mMax, 0.6)) : '#E5E7EB';
      if (mode === 'en') return e.electronegativity_pauling ? d3.interpolateViridis(e.electronegativity_pauling / 4) : '#E5E7EB';
    }
    function draw() {
      grid.innerHTML = '';
      for (const e of E) {
        const cell = h('button', { title: e.name, style: { gridColumn: e.xpos, gridRow: e.ypos, aspectRatio: '1', border: e === sel ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,.08)', borderRadius: '6px', background: color(e), cursor: 'pointer', padding: '1px', color: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05 }, onclick: () => { sel = e; draw(); Lab.addXP(1); } },
          h('span', { style: { fontSize: '8px', opacity: 0.7 } }, e.number), h('b', { style: { fontSize: '13px' } }, e.symbol));
        grid.append(cell);
      }
      grid.append(h('div', { style: { gridColumn: '3 / 4', gridRow: '6', fontSize: '9px', color: 'var(--muted)', alignSelf: 'center', textAlign: 'center' } }, '57–71'), h('div', { style: { gridColumn: '3 / 4', gridRow: '7', fontSize: '9px', color: 'var(--muted)', alignSelf: 'center', textAlign: 'center' } }, '89–103'));
      legend.innerHTML = '';
      if (mode === 'cat') CATC.forEach(([, c, n]) => legend.append(h('span', { class: 'row', style: { gap: '5px' } }, h('i', { style: { width: '11px', height: '11px', borderRadius: '3px', background: c, display: 'inline-block' } }), n)));
      if (mode === 'phase') [['#94A3B8', 'Solid'], ['#F472B6', 'Liquid (only mercury and bromine are liquid at room temperature)'], ['#38BDF8', 'Gas']].forEach(([c, n]) => legend.append(h('span', { class: 'row', style: { gap: '5px' } }, h('i', { style: { width: '11px', height: '11px', borderRadius: '3px', background: c, display: 'inline-block' } }), n)));
      if (mode === 'melt') legend.append(h('span', null, 'Cool to hot: helium never freezes at normal pressure; carbon and tungsten melt above 3,400 °C.'));
      if (mode === 'en') legend.append(h('span', null, 'Electronegativity (Pauling scale). Fluorine pulls hardest (3.98); that is why it reacts with almost everything. Noble gases are blank.'));
      showCard();
    }
    function showCard() {
      cancelAnimationFrame(raf);
      const e = sel; const bohr = h('canvas', { width: 220, height: 220, style: { width: '220px', height: '220px' } });
      const C = (k) => (k == null ? '—' : k);
      card.innerHTML = '';
      card.append(h('div', { class: 'grid g2' },
        h('div', null, h('div', { class: 'row' }, h('div', { style: { width: '74px', height: '74px', borderRadius: '14px', background: catColor(e.category), color: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }, h('span', { class: 'tiny' }, e.number), h('b', { style: { fontSize: '28px', fontFamily: 'Space Grotesk' } }, e.symbol)), h('div', null, h('h2', { style: { margin: 0 } }, e.name), h('span', { class: 'tag', style: { '--c': catColor(e.category) } }, e.category))),
          h('p', { class: 'small', style: { marginTop: '10px' } }, e.summary),
          h('table', { class: 't small' }, [['Atomic mass', C(e.atomic_mass && e.atomic_mass.toFixed(3))], ['Electron setup', C(e.electron_configuration_semantic)], ['State at room temp', C(e.phase)], ['Melts at', e.melt ? `${(e.melt - 273.15).toFixed(0)} °C` : '—'], ['Boils at', e.boil ? `${(e.boil - 273.15).toFixed(0)} °C` : '—'], ['Density', e.density ? e.density + (e.phase === 'Gas' ? ' g/L' : ' g/cm³') : '—'], ['Discovered by', C(e.discovered_by)]].map(([k, v]) => h('tr', null, h('td', { class: 'muted' }, k), h('td', null, v)))),
          h('button', { class: 'btn sm', style: { marginTop: '8px' }, onclick: () => Lab.ask(`Tell me about ${e.name} (${e.symbol}): why it behaves the way it does given its electrons, where we find or use it, and one historical story about it.`, `Periodic table: ${e.name}`) }, '✦ Ask about ' + e.name)),
        h('div', { style: { textAlign: 'center' } }, h('div', { class: 'viz', style: { display: 'inline-block', padding: '10px', background: '#0B1026', borderRadius: '50%' } }, bohr), h('p', { class: 'tiny muted' }, `Bohr model: ${e.shells ? e.shells.join(', ') : ''} electrons per shell. A useful picture, not the real quantum shape of an atom.`))));
      const ctx = bohr.getContext('2d'); const shells = e.shells || [];
      const t0 = performance.now();
      const anim = (now) => { const t = (now - t0) / 1000; ctx.clearRect(0, 0, 220, 220); ctx.fillStyle = '#F43F5E'; ctx.beginPath(); ctx.arc(110, 110, 10, 0, 7); ctx.fill();
        shells.forEach((n, si) => { const r = 22 + (si + 1) * (84 / Math.max(1, shells.length)); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(110, 110, r, 0, 7); ctx.stroke();
          for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + t * (1.2 / (si + 1)); ctx.fillStyle = '#7DD3FC'; ctx.beginPath(); ctx.arc(110 + Math.cos(a) * r, 110 + Math.sin(a) * r, 3, 0, 7); ctx.fill(); } });
        raf = requestAnimationFrame(anim); };
      raf = requestAnimationFrame(anim);
      Lab.setContext(`Periodic table: ${e.name} (${e.symbol}), atomic number ${e.number}, ${e.category}.`);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  },
});
