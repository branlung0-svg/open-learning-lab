// Modern world module, part 5: Anatomy of power.
const h = Lab.h;
const M = Lab.MODERN;
const i = M.SUBS.findIndex(([x]) => x === 'systems'); M.SUBS.splice(i + 1, 0, ['anatomy', 'Anatomy of power']);
const g = M.GROUPS.find((x) => x[1] === 'Ideas & power'); if (g) { const j = g[2].indexOf('systems'); g[2].splice(j + 1, 0, 'anatomy'); }
const SVGNS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs, ...kids) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); kids.forEach((c) => e.append(c)); return e; };
const RING = ['Core: decides', 'Inner: shapes decisions', 'Middle: bargains & implements', 'Outer: pressure & participation'];

function rings(p, info) {
  const W = 800, C = W / 2, R = [92, 192, 290, 385];
  const svg = s('svg', { viewBox: `0 0 ${W} ${W}`, width: '100%', style: 'max-width:720px;display:block;margin:auto' });
  R.slice().reverse().forEach((r, k) => svg.append(s('circle', { cx: C, cy: C, r, fill: ['#64748B10', '#64748B18', '#64748B22', '#64748B30'][k], stroke: '#94A3B8', 'stroke-dasharray': '4 4' })));
  R.forEach((r, k) => { const t = s('text', { x: C, y: C - r + 14, 'text-anchor': 'middle', 'font-size': 11, fill: '#64748B' }); t.textContent = RING[k]; svg.append(t); });
  // Place players: core stacked in the middle, others spread on their ring, then nudge apart any that overlap.
  const wrap = (t) => { if (t.length <= 18) return [t]; const ws = t.split(' '); let a = ''; const out = []; ws.forEach((w) => { if ((a + ' ' + w).trim().length > 18 && a) { out.push(a); a = w; } else a = (a + ' ' + w).trim(); }); out.push(a); return out.length > 2 ? [out[0], out.slice(1).join(' ')] : out; };
  const P = p.players.map((pl) => { const lines = wrap(pl[0]); return { pl, lines, w: Math.max(56, Math.max(...lines.map((l) => l.length)) * 6.1 + 16), ht: lines.length * 13 + 10 }; });
  [0, 1, 2, 3].forEach((k) => { const arr = P.filter((q) => q.pl[1] === k); arr.forEach((q, n) => {
    if (k === 0) { q.fixed = true; q.x = C; q.y = C + 12 + (n - (arr.length - 1) / 2) * 36; return; }
    q.a = -Math.PI / 2 + (2 * Math.PI * (n + 0.5)) / arr.length + 0.5 * k; const mid = (R[k - 1] + R[k]) / 2 + 4; q.r = mid; }); });
  const xy = (q) => { if (!q.fixed) { q.x = C + q.r * Math.cos(q.a); q.y = C + q.r * Math.sin(q.a); } };
  P.forEach(xy);
  for (let it = 0; it < 300; it++) { let moved = false;
    for (let m = 0; m < P.length; m++) for (let n = m + 1; n < P.length; n++) { const A = P[m], B = P[n];
      if (Math.abs(A.x - B.x) < (A.w + B.w) / 2 + 4 && Math.abs(A.y - B.y) < (A.ht + B.ht) / 2 + 4) { moved = true;
        [A, B].forEach((q, z) => { if (q.fixed) return; const o = q === A ? B : A; const cross = (q.x - C) * (o.y - C) - (q.y - C) * (o.x - C); q.a += (cross > 0 ? -1 : 1) * 0.03; xy(q); }); } }
    if (!moved) break; }
  P.forEach(({ pl, lines, w, ht, x, y }) => {
    {
      const col = (M.ptypes[pl[2]] || ['', '#475569'])[1];
      const gg = s('g', { style: 'cursor:pointer', tabindex: 0, role: 'button' });
      gg.append(s('rect', { class: 'pl', x: x - w / 2, y: y - ht / 2, width: w, height: ht, rx: 11, fill: col, opacity: 0.93 }));
      lines.forEach((l, z) => { const t = s('text', { x, y: y - ht / 2 + 17 + z * 13, 'text-anchor': 'middle', 'font-size': 11, fill: '#fff', 'font-weight': 600 }); t.textContent = l; gg.append(t); });
      const show = () => { info.innerHTML = ''; info.append(h('b', null, pl[0]), ' ', h('span', { class: 'tiny', style: { background: col + '22', color: col, padding: '1px 6px', borderRadius: '8px' } }, M.ptypes[pl[2]][0]), ' ', h('span', { class: 'tiny muted' }, RING[pl[1]]), h('p', { class: 'small', style: { margin: '4px 0 0' } }, pl[3]),
        h('button', { class: 'btn sm', style: { marginTop: '6px' }, onclick: () => Lab.ask(`In ${p.n}, how much real power does "${pl[0]}" have, how does it use it, who checks it, and how has that changed over time? Give concrete examples and note where scholars disagree.`, p.n) }, '✦ Ask about this player')); };
      gg.onclick = show; gg.onkeydown = (e) => { if (e.key === 'Enter') show(); };
      svg.append(gg);
    }
  });
  return svg;
}

function stepper(steps) {
  let k = 0; const box = h('div');
  const draw = () => { box.innerHTML = ''; box.append(
    h('div', { class: 'row', style: { gap: '4px', flexWrap: 'wrap' } }, steps.map((_, n) => h('span', { class: 'chip' + (n === k ? ' on' : ''), style: { '--c': '#2563EB' }, onclick: () => { k = n; draw(); } }, String(n + 1)))),
    h('p', { class: 'small', style: { margin: '8px 0', minHeight: '40px' } }, h('b', null, `Step ${k + 1} of ${steps.length}: `), steps[k]),
    h('div', { class: 'row', style: { gap: '6px' } }, h('button', { class: 'btn sm', disabled: k === 0, onclick: () => { k--; draw(); } }, '← Back'), h('button', { class: 'btn sm primary', disabled: k === steps.length - 1, onclick: () => { k++; draw(); } }, 'Next →'))); };
  draw(); return box;
}

M.render.anatomy = (el, arg) => {
  let cur = M.anatomy.find((x) => x.id === arg) || M.anatomy[0];
  const chips = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const body = h('div', { class: 'stack' });
  function draw() {
    chips.innerHTML = ''; M.anatomy.forEach((x) => chips.append(h('span', { class: 'chip' + (x === cur ? ' on' : ''), style: { '--c': '#475569' }, onclick: () => { cur = x; draw(); } }, x.e + ' ' + x.n)));
    const p = cur; body.innerHTML = '';
    const info = h('div', { class: 'card', style: { minHeight: '90px' } }, h('span', { class: 'small muted' }, 'Click any player on the map to see what it does and how much power it has.'));
    const sw = M.anatomySW[p.id];
    body.append(
      h('div', { class: 'card' }, h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, p.e + ' ' + p.n), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, p.focus)), h('p', { class: 'small' }, p.sum),
        h('div', { class: 'grid g3', style: { marginTop: '6px' } }, p.numbers.map(([l, v]) => h('div', { style: { borderLeft: '3px solid #2563EB', paddingLeft: '8px' } }, h('div', { class: 'tiny muted' }, l), h('b', null, v))))),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Power map: who really decides?'),
        h('p', { class: 'small muted' }, 'The closer to the center, the more direct power over big decisions. Placement is a simplified judgement that scholars debate; power also shifts by issue and over time.'),
        h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap', margin: '4px 0 8px' } }, Object.values(M.ptypes).map(([l, c]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '5px', background: c, marginRight: '4px' } }), l))),
        rings(p, info), info),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The layers of the system'), h('p', { class: 'small muted' }, 'The same ten questions are asked of every power, so you can compare them fairly.'),
        ...p.layers.map(([t, d], n) => h('details', { open: n < 2, style: { margin: '6px 0', borderBottom: '1px solid #94A3B833', paddingBottom: '6px' } }, h('summary', { style: { cursor: 'pointer', fontWeight: 600 } }, t), h('p', { class: 'small', style: { margin: '6px 0 0' } }, d)))),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'How a real decision got made'), h('p', { class: 'small' }, h('b', null, p.case[0])), stepper(p.case[1])),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'How this system evolved'),
        h('div', { style: { borderLeft: '3px solid #94A3B8', marginLeft: '6px' } }, p.evolution.map(([y, t]) => h('div', { style: { position: 'relative', padding: '4px 0 8px 14px' } }, h('span', { style: { position: 'absolute', left: '-7px', top: '8px', width: '11px', height: '11px', borderRadius: '6px', background: '#2563EB' } }), h('b', { class: 'small' }, y + ' '), h('span', { class: 'small' }, t))))),
      sw ? h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Strengths and failures, by the same standard'),
        h('div', { class: 'grid g2', style: { alignItems: 'start' } },
          h('div', { style: { borderLeft: '4px solid #16A34A', paddingLeft: '10px' } }, h('b', { class: 'small' }, '✅ What works / what supporters cite'), h('ul', { class: 'small', style: { margin: '4px 0 0 16px', padding: 0 } }, sw[0].map((x) => h('li', null, x)))),
          h('div', { style: { borderLeft: '4px solid #DC2626', paddingLeft: '10px' } }, h('b', { class: 'small' }, '❌ What fails / what critics cite'), h('ul', { class: 'small', style: { margin: '4px 0 0 16px', padding: 0 } }, sw[1].map((x) => h('li', null, x)))))) : null,
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Open debates'), ...p.debates.map(([q, c, d]) => h('div', { style: { margin: '8px 0' } }, h('b', { class: 'small' }, q), ' ', Lab.conf(c), h('p', { class: 'small', style: { margin: '3px 0 0' } }, d))),
        h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } },
          h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Take me deeper into how power really works in ${p.n} (${p.focus}): formal institutions, parties, money, business, media, security services, regions and informal networks. Use concrete recent examples and numbers, cite sources, and apply the same critical standard you would to any other country.`, p.n) }, '✦ Go deeper'),
          h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 6 questions on how ${p.n}'s political system works (institutions, parties, money and influence, how decisions get made). Explain each answer.`, p.n) }, '✦ Quiz me'),
          h('button', { class: 'btn sm', onclick: () => Lab.ask(`Compare how power works in ${p.n} with ${M.anatomy.filter((x) => x !== p).map((x) => x.n).slice(0, 3).join(', ')}: who decides, how money and business influence it, how leaders can be removed, and what each system is good and bad at.`, p.n) }, '✦ Compare with others'))));
  }
  el.append(
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Anatomy of power'),
      h('p', { class: 'small' }, 'The official chart of a government is only the skeleton. Real power also runs through parties and their satellites, money and lobbying, business and banks, media and ideas, the military and secret police, regions, and personal networks. Pick a power to take it apart.'), chips),
    body,
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Comparison: parties that do not compete for power'), h('p', { class: 'small muted' }, 'Many systems have more parties than they seem to, and some have parties that cannot really win. Same question, different systems:'),
      h('div', { class: 'stack' }, M.partycompare.map(([t, d]) => h('div', { style: { borderLeft: '3px solid #DC2626', paddingLeft: '8px' } }, h('b', { class: 'small' }, t), h('p', { class: 'small', style: { margin: '2px 0 0' } }, d))))));
  draw();
};
