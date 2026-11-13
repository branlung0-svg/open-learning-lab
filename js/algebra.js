const { h } = Lab;

// ---------- ALGEBRA: BALANCE THE EQUATION ----------
// A side is { x: coefficient of x, c: constant }.
const R = (n) => Math.round(n * 1e6) / 1e6;
const fmtN = (n) => { n = R(n); if (Number.isInteger(n)) return String(n); const s = n.toFixed(3).replace(/0+$/, ''); return s; };
function side(s) {
  const parts = [];
  if (s.x) parts.push((s.x === 1 ? '' : s.x === -1 ? '−' : fmtN(s.x).replace('-', '−')) + 'x');
  if (s.c || !parts.length) { const c = fmtN(Math.abs(s.c)); if (!parts.length) parts.push(fmtN(s.c).replace('-', '−')); else parts.push((s.c < 0 ? ' − ' : ' + ') + c); }
  return parts.join('');
}
const LEVELS = [
  { name: 'One step', make: () => { const x = 2 + Math.floor(Math.random() * 9), b = 1 + Math.floor(Math.random() * 12); return [{ x: 1, c: b }, { x: 0, c: x + b }]; } },
  { name: 'Two steps', make: () => { const x = 1 + Math.floor(Math.random() * 9), a = 2 + Math.floor(Math.random() * 5), b = 1 + Math.floor(Math.random() * 15); return [{ x: a, c: b }, { x: 0, c: a * x + b }]; } },
  { name: 'x on both sides', make: () => { const x = 1 + Math.floor(Math.random() * 8), a = 3 + Math.floor(Math.random() * 5), d = 1 + Math.floor(Math.random() * (a - 1)), b = Math.floor(Math.random() * 10), c = (a - d) * x + b; return [{ x: a, c: b }, { x: d, c }]; } },
  { name: 'Negatives', make: () => { const x = -6 + Math.floor(Math.random() * 13) || 3, a = 2 + Math.floor(Math.random() * 6), b = -12 + Math.floor(Math.random() * 25); return [{ x: a, c: b }, { x: 0, c: a * x + b }]; } },
  { name: 'Size an ES trade', make: null },
];

Lab.explorer('math', 'algebra', {
  mount(el) {
    let lvl = 0, L, Rt, steps = [], solved = 0, raf;
    const lvRow = h('div', { class: 'row', style: { flexWrap: 'wrap' } });
    const eqBox = h('div', { style: { fontFamily: "'Space Grotesk',Inter,sans-serif", fontSize: '34px', fontWeight: 700, textAlign: 'center', margin: '6px 0' } });
    const holder = h('div');
    const ops = h('div', { class: 'row', style: { flexWrap: 'wrap', justifyContent: 'center' } });
    const amt = h('input', { type: 'number', value: 1, style: { width: '90px' } });
    const log = h('ol', { class: 'small', style: { margin: '6px 0 0', paddingLeft: '20px' } });
    const msg = h('p', { class: 'small', style: { textAlign: 'center', minHeight: '20px' } });
    const tradeBox = h('div');
    LEVELS.forEach((l, i) => lvRow.append(h('button', { class: 'tab' + (i === lvl ? ' on' : ''), onclick: () => { lvl = i; [...lvRow.children].forEach((b, j) => b.classList.toggle('on', j === i)); newEq(); } }, l.name)));
    const op = (label, f, title) => h('button', { class: 'btn sm', title, onclick: () => apply(label, f) }, label);
    ops.append(h('span', { class: 'small muted' }, 'Do to BOTH sides:'),
      op('+ n', (s, n) => ({ x: s.x, c: s.c + n }), 'add the number'), op('− n', (s, n) => ({ x: s.x, c: s.c - n })), op('− nx', (s, n) => ({ x: s.x - n, c: s.c })), op('+ nx', (s, n) => ({ x: s.x + n, c: s.c })), op('× n', (s, n) => ({ x: s.x * n, c: s.c * n })), op('÷ n', (s, n) => ({ x: s.x / n, c: s.c / n })),
      h('label', { class: 'small' }, 'n = ', amt));
    el.append(h('div', { class: 'card' }, lvRow, h('div', { style: { height: '8px' } }), holder, eqBox, msg, ops,
      h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: undo }, '↶ Undo'), h('button', { class: 'btn sm', onclick: newEq }, 'New equation'), h('button', { class: 'btn sm', onclick: hint }, '💡 Hint')),
      h('div', { class: 'card', style: { marginTop: '10px', background: 'var(--card2)', boxShadow: 'none' } }, h('b', { class: 'small' }, 'Your steps'), log)), tradeBox,
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'What the symbols mean'),
          h('table', { class: 't small' },
            [['x', 'The unknown: a number you don’t know yet. Writing it as a letter lets you reason about it before you know it.'], ['3x', 'Three times x. A number written right next to a letter means multiply; the number is the coefficient.'], ['=', 'Both sides have exactly the same value. The scale is balanced.'], ['+ 5', 'A constant: a number that doesn’t depend on x.'], ['Solve', 'Find the value of x that makes the two sides equal, by getting x alone on one side.']].map(([a, b]) => h('tr', null, h('td', null, h('b', { style: { fontFamily: "'Space Grotesk'", fontSize: '16px' } }, a)), h('td', null, b)))),
          h('p', { class: 'small' }, h('b', null, 'The one rule: '), 'whatever you do to one side, do to the other. Then the scale stays balanced and the answer you reach is still true.')),
        h('div', { class: 'card' }, h('h3', null, 'Who invented this, and why'),
          h('p', { class: 'small' }, 'Around 820 CE in Baghdad’s House of Wisdom, the Persian scholar ', h('b', null, 'Muhammad ibn Musa al-Khwarizmi'), ' wrote a handbook for inheritance, trade and land measurement. Its title held the word ', h('i', null, 'al-jabr'), ', “restoring”: moving a subtracted amount to the other side. That became our word ', h('b', null, 'algebra'), '. His name became ', h('b', null, 'algorithm'), '.'),
          h('p', { class: 'small' }, 'He wrote everything in words, with no symbols at all. The symbols came slowly: Robert Recorde invented “=” in 1557 (two parallel lines, because nothing is more equal); François Viète used letters for unknowns in the 1590s; René Descartes made x, y and z the standard in 1637.'),
          Lab.conf('Established'),
          h('button', { class: 'btn sm primary', style: { marginTop: '8px' }, onclick: () => Lab.ask('Explain why doing the same thing to both sides keeps an equation true, and show me how al-Khwarizmi would have solved x² + 10x = 39 with a square.', 'Algebra balance') }, '✦ How did al-Khwarizmi solve x² + 10x = 39?'))));
    const cv = Lab.canvasBox(holder, 210); const { ctx } = cv;
    function newEq() {
      if (LEVELS[lvl].make === null) { trade(); return; }
      tradeBox.innerHTML = ''; holder.style.display = ''; eqBox.parentNode && (eqBox.style.display = ''); ops.style.display = '';
      [L, Rt] = LEVELS[lvl].make(); if (Math.random() < 0.3) [L, Rt] = [Rt, L]; steps = []; log.innerHTML = ''; msg.textContent = 'Get x alone on one side.'; draw();
    }
    function apply(label, f) {
      const n = Number(amt.value); if (!isFinite(n) || (label.includes('÷') && n === 0)) { msg.textContent = 'You can’t divide by zero: it has no answer.'; return; }
      if (label.includes('×') && n === 0) { msg.textContent = 'Multiplying both sides by 0 makes 0 = 0. True, but it erases all information about x!'; return; }
      steps.push([L, Rt]); L = f(L, n); Rt = f(Rt, n);
      log.append(h('li', null, `${label.replace('n', fmtN(n))} on both sides → `, h('b', null, `${side(L)} = ${side(Rt)}`)));
      check(); draw();
    }
    function undo() { if (!steps.length) return; [L, Rt] = steps.pop(); log.lastChild && log.lastChild.remove(); msg.textContent = ''; draw(); }
    function check() {
      const done = (a, b) => R(a.x) === 1 && R(a.c) === 0 && R(b.x) === 0;
      if (done(L, Rt) || done(Rt, L)) { const v = done(L, Rt) ? Rt.c : L.c; msg.innerHTML = `🎉 <b>x = ${fmtN(v)}</b>, solved in ${steps.length} step${steps.length > 1 ? 's' : ''}.`; solved++; Lab.addXP(5, 'equation solved'); if (solved === 5) Lab.markDone('algebra:5', 20, '5 equations'); }
      else if (R(L.x) === 0 && R(Rt.x) === 0) msg.textContent = R(L.c) === R(Rt.c) ? 'Both x’s cancelled and the sides are equal: every x works.' : 'Both x’s cancelled. Undo and try another move.';
      else msg.textContent = '';
    }
    function hint() {
      const xs = R(L.x) !== 0 ? [L, Rt] : [Rt, L]; const [a, b] = xs;
      if (R(b.x) !== 0) msg.textContent = `There’s x on both sides. Try subtracting ${fmtN(Math.min(Math.abs(a.x), Math.abs(b.x)))}x from both.`;
      else if (R(a.c) !== 0) msg.textContent = `Undo the constant next to x: ${a.c > 0 ? 'subtract' : 'add'} ${fmtN(Math.abs(a.c))} on both sides.`;
      else msg.textContent = `x is being multiplied by ${fmtN(a.x)}. Undo that: divide both sides by ${fmtN(a.x)}.`;
    }
    function draw() {
      eqBox.textContent = `${side(L)} = ${side(Rt)}`;
      cancelAnimationFrame(raf);
      const paint = () => {
        const [W, H] = cv.size(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H);
        const cx = W / 2, beamY = 70;
        ctx.fillStyle = '#64748B'; ctx.beginPath(); ctx.moveTo(cx, beamY); ctx.lineTo(cx - 22, H - 12); ctx.lineTo(cx + 22, H - 12); ctx.fill();
        ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - W * 0.42, beamY); ctx.lineTo(cx + W * 0.42, beamY); ctx.stroke();
        const pan = (s, x0) => {
          ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x0 - W * 0.19, beamY + 6, W * 0.38, H - beamY - 22);
          let x = x0 - W * 0.17, y = beamY + 16; const put = (w, hgt, color, label, neg) => { if (x + w > x0 + W * 0.17) { x = x0 - W * 0.17; y += 34; } ctx.fillStyle = color; ctx.globalAlpha = neg ? 0.45 : 1; ctx.fillRect(x, y, w, hgt); ctx.globalAlpha = 1; if (neg) { ctx.strokeStyle = '#F87171'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, hgt); } ctx.fillStyle = '#0B1026'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + hgt / 2 + 5); x += w + 5; };
          const nx = Math.round(Math.abs(s.x)), nc = Math.round(Math.abs(s.c));
          const fracX = !Number.isInteger(R(s.x)), fracC = !Number.isInteger(R(s.c));
          if (fracX || nx > 12) put(60, 28, '#FBBF24', fmtN(s.x) + 'x', s.x < 0); else for (let i = 0; i < nx; i++) put(28, 28, '#FBBF24', 'x', s.x < 0);
          if (fracC || nc > 24) put(60, 28, '#60A5FA', fmtN(s.c), s.c < 0); else for (let i = 0; i < nc; i++) put(16, 16, '#60A5FA', '', s.c < 0);
        };
        pan(L, cx - W * 0.22); pan(Rt, cx + W * 0.22);
        ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '12px Inter'; ctx.textAlign = 'left'; ctx.fillText('🟨 = one x   🟦 = one unit   faded/red = negative (a helium balloon pulling up)', 10, H - 2);
      };
      raf = requestAnimationFrame(paint);
    }
    function trade() {
      holder.style.display = 'none'; eqBox.style.display = 'none'; ops.style.display = 'none'; log.innerHTML = ''; msg.textContent = '';
      const risk = [250, 300, 400, 500, 600, 750, 1000][Math.floor(Math.random() * 7)], stop = [2, 2.5, 3, 4, 5, 6, 8][Math.floor(Math.random() * 7)];
      const ans = risk / (stop * 50); const inp = h('input', { type: 'number', step: '0.01', style: { width: '110px' } }); const out = h('div', { class: 'small' });
      tradeBox.innerHTML = '';
      tradeBox.append(h('div', { class: 'card' }, h('h3', null, 'Algebra you already use: position sizing'),
        h('p', null, `You’ll risk at most $${risk} on an ES trade with a ${stop}-point stop. Each ES point is worth $50 per contract. How many contracts, n?`),
        h('p', { style: { fontFamily: "'Space Grotesk'", fontSize: '22px', fontWeight: 700 } }, `${stop} × 50 × n = ${risk}`),
        h('div', { class: 'row' }, h('label', null, 'n = ', inp), h('button', { class: 'btn primary sm', onclick: () => { const v = Number(inp.value); const ok = Math.abs(v - ans) < 0.011; out.innerHTML = ok ? `✅ Right: n = ${risk} ÷ (${stop} × 50) = <b>${fmtN(ans)}</b>. ${Number.isInteger(R(ans)) ? '' : `You can’t trade a fraction of an ES contract, so round <b>down</b> to ${Math.floor(ans)} to stay within your risk (or use MES, worth $5 per point: ${fmtN(ans * 10)} micros).`}` : `Not quite. First multiply ${stop} × 50 = ${stop * 50}: that’s the dollars lost per contract if the stop is hit. Then divide both sides by it.`; if (ok) Lab.addXP(6, 'trade sized'); } }, 'Check'), h('button', { class: 'btn sm', onclick: trade }, 'New trade')), out,
        Lab.apply('this is the same balancing move as the scale above. The unknown is n, and dividing both sides by (stop × $50) gets n alone. Rounding down, never up, is what keeps one loss from exceeding your plan.')));
    }
    newEq();
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});
Lab.subject('math').ex.unshift(['algebra', 'Balance the equation']);
