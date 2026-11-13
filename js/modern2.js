// Modern world module, part 2: time machine, how systems work, voting lab, Indigenous peoples, science & ideas.
const h = Lab.h;
const M = Lab.MODERN;
const EV = Object.fromEntries(M.events.map((e) => [e.id, e]));
const IDEO = Object.fromEntries(M.ideologies.map((i) => [i.id, i]));
const SYS = Object.fromEntries(M.systems.map((s) => [s.id, s]));
const yr = (e) => (e.y2 && e.y2 !== e.y ? `${e.y}–${e.y2}` : String(e.y));
const sect = (title, ...kids) => h('div', { style: { marginTop: '12px' } }, h('div', { class: 'tiny muted', style: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' } }, title), ...kids);
const evChip = (id) => { const e = EV[id]; return e ? h('span', { class: 'chip', style: { '--c': '#B45309' }, onclick: () => M.go('timeline', 'ev-' + id) }, `📅 ${e.t} (${yr(e)})`) : null; };
const NS = 'http://www.w3.org/2000/svg';
const S = (tag, at, parent, text) => { const n = document.createElementNS(NS, tag); Object.entries(at || {}).forEach(([k, v]) => n.setAttribute(k, v)); if (text != null) n.textContent = text; if (parent) parent.append(n); return n; };
const BOOK = (t) => (Lab.LIB || []).find((b) => b.t.toLowerCase().includes(t.toLowerCase()));
const bookRow = (titles) => { const bs = [...new Set((titles || []).map(BOOK).filter(Boolean))]; return bs.length ? h('div', { class: 'row', style: { gap: '6px' } }, bs.map((b) => h('a', { class: 'chip', href: '#reading-library-' + b.id, style: { textDecoration: 'none', color: 'inherit', '--c': '#7C3AED' } }, '📖 ' + b.t + (b.a ? ' · ' + b.a.split(/[,(]/)[0].trim() : '')))) : null; };
const SCI_BK = { smith: ['Wealth of Nations'], watt: ['Lives of Boulton and Watt'], lavoisier: ['Elements of Chemistry'], kant: ['Perpetual Peace'], wollstonecraft: ['Rights of Woman'], jenner: ['Variolae Vaccinae'], malthus: ['Principle of Population'], ricardo: ['Principles of Political Economy and Tax'], faraday: ['Experimental Researches in Electricity'], babbage: ['Economy of Machinery'], snow: ['Mode of Communication of Cholera', 'Notes on Nursing'], darwin: ['Origin of Species', 'Mutual Aid'], marx: ['Capital: A Critique', 'Communist Manifesto'], einstein: ['Relativity'], eugenics: ['Mendel'], hegel: ['Philosophy of History'], nietzsche: ['Beyond Good and Evil', 'Zarathustra'], freud: ['Interpretation of Dreams'], marginal: ['Capital and Interest'], kuhn: [] };
const SYS_BK = { uk: ['English Constitution', 'Representative Government'], usa: ['Federalist', 'Congressional Government', 'Democracy in America'], ussr: ['Practice and Theory of Bolshevism', 'Ten Days That Shook', 'Our Revolution'], catalonia: ['Proposed Roads to Freedom', 'Conquest of Bread'], haud: ['Ancient Society', 'Origin of the Family'], raj: ['Indian Home Rule', 'Poverty and Un-British Rule'], ancien: ['Old Regime and the Revolution', 'French Revolution: A History'], nazi: [], italy: ['Reflections on Violence'], nordic: ['Evolutionary Socialism'], swiss: ['Representative Government'] };
const KIND = { ruler: '#B91C1C', party: '#C2410C', body: '#2563EB', court: '#7C3AED', force: '#374151', econ: '#CA8A04', people: '#16A34A' };

// insert tabs in a sensible order
const insertAfter = (after, k, n) => { const i = M.SUBS.findIndex(([x]) => x === after); M.SUBS.splice(i + 1, 0, [k, n]); };
insertAfter('timeline', 'time', 'Time machine');
insertAfter('ideologies', 'systems', 'How systems work');
insertAfter('spectrum', 'voting', 'Voting lab');
insertAfter('voting', 'indigenous', 'Indigenous peoples');
insertAfter('indigenous', 'science', 'Science & ideas');

// ---------- power-structure diagram ----------
function powerDiagram(sys, onNode) {
  const levels = Math.max(...sys.nodes.map((n) => n[2])) + 1;
  const W = 900, rowH = 108, H = levels * rowH + 120;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;height:auto;max-width:960px;min-width:620px' });
  const defs = S('defs', {}, svg); const mk = S('marker', { id: 'ar-' + sys.id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs); S('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'currentColor', opacity: 0.55 }, mk);
  const pos = {};
  for (let L = 0; L < levels; L++) { const row = sys.nodes.filter((n) => n[2] === L); row.forEach((n, i) => { pos[n[0]] = { x: (W / (row.length + 1)) * (i + 1), y: 96 + L * rowH, n }; }); }
  const bw = (label) => Math.min(190, 30 + label.length * 5.6);
  const edgeG = S('g', {}, svg); const nodeG = S('g', {}, svg);
  const edgeEls = [];
  const sameCount = {};
  sys.edges.forEach(([a, b, lab]) => {
    const A = pos[a], B = pos[b]; if (!A || !B) return;
    const same = A.y === B.y;
    let x1, y1, x2, y2, mx, my;
    if (same) {
      const k = (sameCount[A.y] = (sameCount[A.y] || 0) + 1);
      x1 = A.x; x2 = B.x; y1 = A.y - 20; y2 = B.y - 20;
      mx = (x1 + x2) / 2; my = A.y - 40 - k * 22;
    } else {
      const down = B.y > A.y; const dir = (a < b ? 1 : -1) * 12;
      x1 = A.x + dir * 0.5; x2 = B.x + dir * 0.5; y1 = A.y + (down ? 20 : -20); y2 = B.y + (down ? -22 : 22);
      mx = (x1 + x2) / 2 + dir; my = (y1 + y2) / 2;
    }
    const path = S('path', { d: `M${x1},${y1} Q${mx},${my} ${x2},${y2}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.4, opacity: 0.45, 'marker-end': `url(#ar-${sys.id})` }, edgeG);
    const lx = 0.25 * x1 + 0.5 * mx + 0.25 * x2, ly = 0.25 * y1 + 0.5 * my + 0.25 * y2;
    const t = S('text', { x: lx, y: ly - 3, 'font-size': 9.5, 'text-anchor': 'middle', fill: 'currentColor', opacity: 0.75, 'paint-order': 'stroke', stroke: 'var(--card2, #f1f1f6)', 'stroke-width': 3 }, edgeG, lab.length > 30 ? lab.slice(0, 29) + '…' : lab);
    S('title', {}, path, lab);
    edgeEls.push([a, b, path, t]);
  });
  Object.values(pos).forEach(({ x, y, n }) => {
    const g = S('g', { style: 'cursor:pointer' }, nodeG); const w = bw(n[1]);
    S('rect', { x: x - w / 2, y: y - 20, width: w, height: 40, rx: 10, fill: KIND[n[3]] || '#64748B', opacity: 0.92 }, g);
    const words = n[1].split(' '); let l1 = '', l2 = '';
    for (const wd of words) { if ((l1 + ' ' + wd).trim().length <= 30 && !l2) l1 = (l1 + ' ' + wd).trim(); else l2 = (l2 + ' ' + wd).trim(); }
    S('text', { x, y: l2 ? y - 3 : y + 4, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 700, fill: '#fff' }, g, l1);
    if (l2) S('text', { x, y: y + 10, 'text-anchor': 'middle', 'font-size': 10, fill: '#fff' }, g, l2.length > 32 ? l2.slice(0, 31) + '…' : l2);
    g.addEventListener('click', () => { edgeEls.forEach(([a, b, p, t]) => { const on = a === n[0] || b === n[0]; p.setAttribute('opacity', on ? 0.95 : 0.12); p.setAttribute('stroke-width', on ? 2.4 : 1.2); t.setAttribute('opacity', on ? 1 : 0.15); }); onNode && onNode(n, sys.edges.filter(([a, b]) => a === n[0] || b === n[0])); });
  });
  return svg;
}

function stepper(steps) {
  let i = 0;
  const list = h('ol', { class: 'small', style: { margin: '4px 0 0 18px', lineHeight: 1.7 } });
  const draw = () => { list.innerHTML = ''; steps.forEach((s, k) => list.append(h('li', { style: { opacity: k <= i ? 1 : 0.35, fontWeight: k === i ? 700 : 400, transition: 'opacity .3s' } }, s))); };
  const next = h('button', { class: 'btn sm', onclick: () => { i = (i + 1) % steps.length; draw(); } }, 'Next step →');
  const all = h('button', { class: 'btn sm', onclick: () => { i = steps.length - 1; draw(); } }, 'Show all');
  draw();
  return h('div', null, list, h('div', { class: 'row', style: { gap: '6px', marginTop: '6px' } }, next, all));
}

// ---------- How systems work ----------
const FIELDS = [['choose', '👑 How leaders are chosen'], ['vote', '🗳️ How ordinary people take part'], ['econ', '🏭 How the economy is planned or coordinated'], ['goals', '🎯 Stated goals'], ['progress', '📈 How progress was pursued and measured'], ['checks', '⚖️ Checks on power'], ['dissent', '🚫 What happened to dissent'], ['results', '📊 Results']];
function systemDetail(sys) {
  const nodeInfo = h('div', { class: 'small muted', style: { minHeight: '22px', marginTop: '4px' } }, 'Tap a box to see its connections.');
  const diag = powerDiagram(sys, (n, es) => { nodeInfo.innerHTML = ''; nodeInfo.append(h('b', null, n[1] + ': '), es.map(([a, b, l]) => `${a === n[0] ? '→' : '←'} ${l} (${(sys.nodes.find((x) => x[0] === (a === n[0] ? b : a)) || [])[1]})`).join(' · ')); });
  return h('div', null,
    M.figure(sys.img, { max: '300px' }),
    h('p', { class: 'tiny muted', style: { margin: '0 0 6px' } }, `${sys.type} · ${sys.yrs}`),
    h('p', null, sys.sum),
    sect('Who really holds power', h('p', { class: 'small' }, sys.power)),
    sect('Power structure', h('div', { class: 'viz', style: { padding: '8px', color: 'var(--ink)', overflowX: 'auto' } }, diag),
      h('div', { class: 'row tiny', style: { gap: '10px', marginTop: '4px' } }, Object.entries({ ruler: 'Top leadership', party: 'Party', body: 'Institutions', court: 'Courts / councils', force: 'Security & army', econ: 'Economic power', people: 'The people' }).map(([k, n]) => h('span', null, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '3px', background: KIND[k], marginRight: '4px' } }), n))), nodeInfo),
    sect('How a decision or law gets made', stepper(sys.law)),
    h('div', { class: 'grid g2', style: { marginTop: '6px' } }, FIELDS.map(([k, n]) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px' } }, h('b', { class: 'small' }, n), h('p', { class: 'small', style: { margin: '4px 0 0' } }, sys[k])))),
    h('div', { class: 'grid g2', style: { marginTop: '10px' } },
      h('div', { style: { borderLeft: '4px solid #16A34A', padding: '8px 12px', background: 'var(--card2)', borderRadius: '10px' } }, h('b', { class: 'small' }, '👍 Defenders say'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, sys.pro)),
      h('div', { style: { borderLeft: '4px solid #DC2626', padding: '8px 12px', background: 'var(--card2)', borderRadius: '10px' } }, h('b', { class: 'small' }, '👎 Critics say'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, sys.con))),
    bookRow(SYS_BK[sys.id]) ? sect('Read about it in the Lab', bookRow(SYS_BK[sys.id])) : null,
    (sys.ideo.length || sys.ev.length) ? sect('Connected', h('div', { class: 'row', style: { gap: '6px' } }, sys.ideo.map((i) => IDEO[i] ? h('span', { class: 'chip', style: { '--c': IDEO[i].c }, onclick: () => M.go('ideologies', i) }, IDEO[i].e + ' ' + IDEO[i].n) : null), sys.ev.map(evChip))) : null,
    sect('Investigate', h('div', { class: 'row', style: { gap: '6px' } },
      sys.dt ? h('button', { class: 'btn sm', onclick: () => Lab.openData(sys.dt.ds, sys.dt) }, '📈 See the data') : null,
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Put me inside "${sys.n}" (${sys.yrs}). Walk me through a realistic year in the life of an ordinary person there (worker, farmer or student): how they voted or took part, what they could and could not say, how decisions affecting them were made, what they earned and consumed, and what happened to people who objected. Base it on historical evidence and say where accounts differ.`, sys.n) }, '✦ Live a year inside it'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`Pick one real, well-documented decision made under "${sys.n}" and trace exactly how it was made: who proposed it, who argued, who decided, how it was carried out, and what happened. Use it to show how power really worked, beyond the official structure.`, sys.n) }, '✦ Trace a real decision'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`How did "${sys.n}" actually plan and coordinate its economy, in detail: who set targets or prices, what information they used, what incentives managers and workers had, and what went right and wrong? Compare with how a market economy coordinates the same things.`, sys.n) }, '✦ How the economy really ran'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 6 questions on how "${sys.n}" worked: power, participation, decision-making, economy and results. Then tell me what I missed.`, sys.n) }, '✦ Quiz me'))));
}
M.render.systems = (el, arg) => {
  const det = h('div', { class: 'card', style: { display: 'none' } });
  const open = (id) => { const s = SYS[id]; if (!s) return; det.style.display = 'block'; det.innerHTML = ''; det.append(h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, s.e + ' ' + s.n), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { det.style.display = 'none'; } }, 'Close')), systemDetail(s)); det.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', '#history-modern-systems-' + id); Lab.markDone && Lab.markDone('sys:' + id, 5, s.n); };
  // compare two systems
  const opts = (sel) => M.systems.map((s) => h('option', { value: s.id, selected: s.id === sel }, s.e + ' ' + s.n));
  let a = 'usa', b = 'ussr';
  const A = h('select', { onchange: (e) => { a = e.target.value; cmp(); } }, opts(a)), B = h('select', { onchange: (e) => { b = e.target.value; cmp(); } }, opts(b));
  const cmpOut = h('div', { style: { overflowX: 'auto', marginTop: '8px' } });
  function cmp() {
    const x = SYS[a], y = SYS[b]; cmpOut.innerHTML = '';
    cmpOut.append(h('table', { class: 't small' }, h('thead', null, h('tr', null, h('th', null, ''), h('th', null, x.e + ' ' + x.n), h('th', null, y.e + ' ' + y.n))),
      h('tbody', null, [['type', 'Type'], ['yrs', 'When'], ['power', 'Who holds power'], ...FIELDS].map(([k, n]) => h('tr', null, h('td', { class: 'muted', style: { width: '18%' } }, n), h('td', null, x[k]), h('td', null, y[k])))),
    ), h('button', { class: 'btn sm primary', style: { marginTop: '8px' }, onclick: () => Lab.ask(`Compare how "${x.n}" and "${y.n}" actually worked: who held power, how people participated, how decisions and economic plans were made, how each treated dissent, and what results each produced. Where are they surprisingly similar or different? Be evidence-based and even-handed.`, `${x.n} vs ${y.n}`) }, '✦ Compare them deeply'));
  }
  const groups = [['Democracies', ['uk', 'usa', 'swiss', 'nordic', 'india', 'eu']], ['One-party & totalitarian states', ['ussr', 'prc', 'nazi', 'italy', 'cuba', 'yugo']], ['Authoritarian & hybrid regimes', ['ancien', 'raj', 'junta', 'iran', 'putin', 'singapore']], ['Other models', ['haud', 'catalonia']]];
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'How political systems actually work'),
    h('p', { class: 'small' }, 'Ideologies are ideas; systems are how power works in practice. For each one, you can see who holds power, a diagram of how its institutions connect, how a decision gets made step by step, how ordinary people voted or took part, how the economy was planned, what it aimed for, how it treated dissent, and what it produced. The official structure and the real one often differ, and this section shows both.')),
    ...groups.map(([g, ids]) => h('div', null, h('h3', { style: { margin: '14px 0 6px' } }, g), h('div', { class: 'grid g3' }, ids.map((id) => SYS[id]).filter(Boolean).map((s) => h('div', { class: 'card', style: { cursor: 'pointer', padding: '14px' }, onclick: () => open(s.id) }, h('div', { class: 'row' }, h('span', { style: { fontSize: '22px' } }, s.e), h('b', null, s.n)), h('p', { class: 'tiny muted', style: { margin: '4px 0' } }, s.type + ' · ' + s.yrs), h('p', { class: 'small', style: { margin: 0 } }, s.sum.length > 150 ? s.sum.slice(0, 150) + '…' : s.sum)))))),
    det,
    h('div', { class: 'card', style: { marginTop: '14px' } }, h('h3', { style: { marginTop: 0 } }, 'Compare any two systems'), h('div', { class: 'row' }, A, h('b', null, 'vs'), B), cmpOut));
  cmp();
  if (arg && SYS[arg]) setTimeout(() => open(arg), 60);
};

// ---------- Voting lab ----------
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const DISTS = { center: ['A centrist country', (r) => gauss(r) * 0.32], polar: ['A polarized country', (r) => (r() < 0.5 ? -0.5 : 0.5) + gauss(r) * 0.2], left: ['Leans left', (r) => -0.25 + gauss(r) * 0.3], right: ['Leans right', (r) => 0.25 + gauss(r) * 0.3] };
M.render.voting = (el) => {
  const cands = [['Ada', '#DC2626', -0.65, true], ['Ben', '#F97316', -0.2, true], ['Cleo', '#8B5CF6', 0.05, true], ['Dev', '#2563EB', 0.4, true], ['Eve', '#0F172A', 0.8, false]].map(([n, c, x, on]) => ({ n, c, x, on }));
  let dist = 'center', approveR = 0.35;
  const N = 2000;
  let voters = [];
  const makeVoters = () => { const r = rng(42); voters = Array.from({ length: N }, () => Math.max(-1, Math.min(1, DISTS[dist][1](r)))); };
  const out = h('div'); const canvasBox = h('div', { class: 'viz', style: { padding: '8px', color: 'var(--ink)' } });
  const ctrl = h('div', { class: 'stack' });
  function rank(v, C) { return C.slice().sort((a, b) => Math.abs(a.x - v) - Math.abs(b.x - v)); }
  function compute() {
    const C = cands.filter((c) => c.on); const res = {}; if (C.length < 2) return null;
    const ballots = voters.map((v) => rank(v, C));
    const first = (pool) => { const t = new Map(pool.map((c) => [c, 0])); ballots.forEach((b) => { const top = b.find((c) => pool.includes(c)); t.set(top, t.get(top) + 1); }); return t; };
    const best = (t) => [...t.entries()].sort((a, b) => b[1] - a[1]);
    const p = best(first(C)); res.plurality = { w: p[0][0], detail: p.map(([c, n]) => `${c.n} ${(100 * n / N).toFixed(0)}%`).join(', ') };
    const pair = (a, b) => ballots.filter((bl) => bl.indexOf(a) < bl.indexOf(b)).length;
    const top2 = [p[0][0], p[1][0]]; const ab = pair(top2[0], top2[1]);
    res.runoff = p[0][1] > N / 2 ? { w: p[0][0], detail: `${p[0][0].n} wins outright in round 1` } : { w: ab > N / 2 ? top2[0] : top2[1], detail: `Round 2: ${top2[0].n} ${(100 * ab / N).toFixed(0)}% vs ${top2[1].n} ${(100 * (N - ab) / N).toFixed(0)}%` };
    let pool = C.slice(); const rounds = [];
    while (pool.length > 1) { const t = best(first(pool)); rounds.push(t.map(([c, n]) => `${c.n} ${(100 * n / N).toFixed(0)}%`).join(', ')); if (t[0][1] > N / 2) break; pool = pool.filter((c) => c !== t[t.length - 1][0]); }
    res.irv = { w: best(first(pool))[0][0], detail: rounds.map((r, i) => `Round ${i + 1}: ${r}`).join(' → ') };
    const borda = new Map(C.map((c) => [c, 0])); ballots.forEach((b) => b.forEach((c, i) => borda.set(c, borda.get(c) + (C.length - 1 - i))));
    const bb = best(borda); res.borda = { w: bb[0][0], detail: bb.map(([c, n]) => `${c.n} ${n}`).join(', ') };
    const cw = C.find((a) => C.every((b) => a === b || pair(a, b) > N / 2));
    res.condorcet = { w: cw || null, detail: cw ? `${cw.n} beats every rival head-to-head` : 'No candidate beats all others (a cycle)' };
    const ap = new Map(C.map((c) => [c, 0])); voters.forEach((v) => C.forEach((c) => { if (Math.abs(c.x - v) <= approveR) ap.set(c, ap.get(c) + 1); }));
    const aa = best(ap); res.approval = { w: aa[0][0], detail: aa.map(([c, n]) => `${c.n} ${(100 * n / N).toFixed(0)}%`).join(', ') };
    const seats = new Map(C.map((c) => [c, 0])); const fv = first(C);
    for (let s = 0; s < 20; s++) { let bestC = null, bq = -1; C.forEach((c) => { const q = fv.get(c) / (seats.get(c) + 1); if (q > bq) { bq = q; bestC = c; } }); seats.set(bestC, seats.get(bestC) + 1); }
    res.pr = { w: null, seats, detail: [...seats.entries()].filter(([, n]) => n).map(([c, n]) => `${c.n} ${n}`).join(', ') + ' (of 20 seats)' };
    const med = voters.slice().sort((a, b) => a - b)[N >> 1]; res.median = med;
    return res;
  }
  function drawHist(res) {
    canvasBox.innerHTML = '';
    const W = 760, H = 190; const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;height:auto' });
    const bins = new Array(60).fill(0); voters.forEach((v) => { bins[Math.min(59, Math.floor((v + 1) / 2 * 60))]++; }); const mx = Math.max(...bins);
    const X = (x) => 20 + (x + 1) / 2 * (W - 40);
    bins.forEach((n, i) => S('rect', { x: 20 + i * (W - 40) / 60, y: 150 - n / mx * 110, width: (W - 40) / 60 - 1, height: n / mx * 110, fill: 'currentColor', opacity: 0.18 }, svg));
    S('line', { x1: 20, x2: W - 20, y1: 150, y2: 150, stroke: 'currentColor', opacity: 0.4 }, svg);
    S('text', { x: 20, y: 170, 'font-size': 11, fill: 'currentColor', opacity: 0.7 }, svg, '← Left'); S('text', { x: W - 20, y: 170, 'font-size': 11, 'text-anchor': 'end', fill: 'currentColor', opacity: 0.7 }, svg, 'Right →');
    if (res) { S('line', { x1: X(res.median), x2: X(res.median), y1: 30, y2: 150, stroke: 'currentColor', 'stroke-dasharray': '3 3', opacity: 0.6 }, svg); S('text', { x: X(res.median), y: 24, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor' }, svg, 'median voter'); }
    cands.filter((c) => c.on).forEach((c) => { S('circle', { cx: X(c.x), cy: 150, r: 9, fill: c.c, stroke: '#fff', 'stroke-width': 2 }, svg); S('text', { x: X(c.x), y: 186, 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle', fill: c.c }, svg, c.n); });
    canvasBox.append(svg);
  }
  const METHODS = [
    ['plurality', 'First past the post (plurality)', 'Each voter picks one; most votes wins. Used for the US Congress, UK Commons, India, Canada.'],
    ['runoff', 'Two-round runoff', 'If no one gets a majority, the top two face off. Used for France’s and Brazil’s presidents.'],
    ['irv', 'Ranked choice (instant runoff)', 'Voters rank; the last-place candidate is eliminated and their votes transfer until someone has a majority. Used in Australia’s House, Alaska, Maine, New York City primaries.'],
    ['condorcet', 'Condorcet (head-to-head)', 'The winner must beat every other candidate one-on-one. Rarely used in public elections, loved by theorists.'],
    ['borda', 'Borda count', 'Points by rank. Used in Slovenia for minority seats and in Nauru.'],
    ['approval', 'Approval voting', 'Vote for every candidate you find acceptable. Used in Fargo and St. Louis city elections.'],
    ['pr', 'Proportional representation (20 seats)', 'Seats shared by vote share (D’Hondt method). Used in most of Europe, Israel, South Africa.'],
  ];
  function update() {
    const res = compute(); drawHist(res); out.innerHTML = '';
    if (!res) { out.append(h('p', { class: 'muted' }, 'Turn on at least two candidates.')); return; }
    const winners = new Set(METHODS.filter(([k]) => res[k].w).map(([k]) => res[k].w.n));
    out.append(h('p', { class: 'small', style: { fontWeight: 700 } }, winners.size > 1 ? `⚠️ Same voters, different rules, ${winners.size} different winners: ${[...winners].join(', ')}.` : `All single-winner methods agree: ${[...winners][0]}.`),
      h('div', { class: 'grid g2' }, METHODS.map(([k, n, d]) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px', borderLeft: `5px solid ${res[k].w ? res[k].w.c : '#64748B'}` } },
        h('div', { class: 'row' }, h('b', { class: 'small' }, n), h('span', { class: 'sp' }), res[k].w ? h('b', { style: { color: res[k].w.c } }, '🏆 ' + res[k].w.n) : null),
        h('div', { class: 'tiny muted', style: { margin: '3px 0' } }, d), h('div', { class: 'tiny' }, res[k].detail)))));
  }
  cands.forEach((c) => ctrl.append(h('div', { class: 'row', style: { gap: '8px' } },
    h('label', { class: 'small', style: { minWidth: '70px', color: c.c, fontWeight: 700 } }, h('input', { type: 'checkbox', checked: c.on, onchange: (e) => { c.on = e.target.checked; update(); } }), ' ' + c.n),
    h('input', { type: 'range', min: -100, max: 100, value: Math.round(c.x * 100), style: { flex: 1 }, oninput: (e) => { c.x = e.target.value / 100; update(); } }))));
  const distSel = h('select', { onchange: (e) => { dist = e.target.value; makeVoters(); update(); } }, Object.entries(DISTS).map(([k, [n]]) => h('option', { value: k }, n)));
  const apSel = h('input', { type: 'range', min: 10, max: 80, value: 35, style: { width: '160px' }, oninput: (e) => { approveR = e.target.value / 100; update(); } });
  // gerrymandering
  const GRID = Array.from({ length: 25 }, (_, i) => (i % 5 < 2 ? 'T' : 'O'));
  const PLANS = [['Rows', [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4], 'Every district is 3 orange, 2 teal: orange wins all 5.'], ['Columns', [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4], 'Districts follow the communities: 3–2, roughly proportional.'], ['Drawn for teal', [0, 0, 0, 3, 3, 0, 0, 1, 3, 3, 1, 1, 1, 3, 4, 1, 2, 2, 4, 4, 2, 2, 2, 4, 4], 'Teal has 40% of voters but wins 3 of 5 districts.']];
  let plan = 0; const gBox = h('div');
  const DC = ['#F59E0B', '#06B6D4', '#A855F7', '#22C55E', '#EF4444'];
  function drawG() {
    gBox.innerHTML = ''; const [n, P, note] = PLANS[plan];
    const svg = S('svg', { viewBox: '0 0 260 260', style: 'width:240px;height:auto' });
    GRID.forEach((c, i) => { const x = (i % 5) * 50 + 5, y = Math.floor(i / 5) * 50 + 5; S('rect', { x, y, width: 50, height: 50, fill: DC[P[i]], opacity: 0.35 }, svg); S('circle', { cx: x + 25, cy: y + 25, r: 13, fill: c === 'T' ? '#0D9488' : '#EA580C' }, svg); });
    for (let i = 0; i < 25; i++) { const x = (i % 5) * 50 + 5, y = Math.floor(i / 5) * 50 + 5; if (i % 5 < 4 && P[i] !== P[i + 1]) S('line', { x1: x + 50, x2: x + 50, y1: y, y2: y + 50, stroke: 'currentColor', 'stroke-width': 4 }, svg); if (i < 20 && P[i] !== P[i + 5]) S('line', { x1: x, x2: x + 50, y1: y + 50, y2: y + 50, stroke: 'currentColor', 'stroke-width': 4 }, svg); }
    S('rect', { x: 5, y: 5, width: 250, height: 250, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, svg);
    const wins = [0, 0]; for (let d = 0; d < 5; d++) { const t = GRID.filter((c, i) => P[i] === d && c === 'T').length; wins[t >= 3 ? 0 : 1]++; }
    gBox.append(h('div', { class: 'row', style: { alignItems: 'flex-start', gap: '16px' } }, h('div', { style: { color: 'var(--ink)' } }, svg), h('div', { class: 'small', style: { flex: 1 } }, h('p', null, 'Same 25 voters every time: 10 teal (40%), 15 orange (60%). Only the district lines change.'), h('p', null, h('b', null, `Seats: teal ${wins[0]}, orange ${wins[1]}. `), note),
      h('p', { class: 'muted' }, 'Gerrymandering is named for Massachusetts governor Elbridge Gerry (1812). “Packing” crowds opponents into a few districts; “cracking” spreads them thin. In the US it is often done by state legislatures; in Britain, Canada and Australia independent commissions draw the lines.'))));
  }
  el.append(
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Voting lab: how the rules decide the winner'),
      h('p', { class: 'small' }, '2,000 simulated voters sit on a left–right line, and each prefers the candidates closest to them. Move the candidates, change the electorate, and watch seven real voting systems pick different winners from the same voters. This is the real science of elections (social choice theory).'),
      h('div', { class: 'row', style: { gap: '10px', marginBottom: '6px' } }, h('span', { class: 'small' }, 'Electorate:'), distSel, h('span', { class: 'small' }, 'Approval range:'), apSel),
      canvasBox, ctrl),
    h('div', { class: 'card' }, out),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Things to try'),
      h('ul', { class: 'small', style: { margin: '0 0 0 18px', lineHeight: 1.7 } },
        h('li', null, h('b', null, 'The spoiler effect. '), 'Move Ben right next to Ada. Under first past the post they split the left vote and Dev can win; ranked choice and Condorcet are not fooled. This is why plurality systems tend toward two parties (Duverger’s law).'),
        h('li', null, h('b', null, 'Center squeeze. '), 'Put Cleo exactly in the middle with Ben and Dev close on each side. Cleo is everyone’s second choice and beats everyone head-to-head, but can be eliminated first under ranked choice.'),
        h('li', null, h('b', null, 'The median voter theorem. '), 'On a single left–right line, the Condorcet winner is always the candidate closest to the median voter (Duncan Black, 1948; Anthony Downs, 1957). That is why two-party candidates often converge on the center, and why they don’t when primaries reward the base.'),
        h('li', null, h('b', null, 'Arrow’s impossibility theorem. '), 'Kenneth Arrow proved (1951) that no ranked voting system with three or more options can satisfy a short list of reasonable fairness conditions at once. Every system trades something off.'),
        h('li', null, h('b', null, 'Proportional vs majoritarian. '), 'PR gives every sizable group seats, so governments become coalitions (Netherlands, Germany); majoritarian systems give one party power with a minority of votes (UK 2024: about 34% of votes, about 63% of seats).'),
        h('li', null, h('b', null, 'Elections without choice. '), 'In the USSR, Nazi Germany or Fascist Italy, the ballot had one approved list; results were 90–99%. The machinery of voting existed; the choice did not.')),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '6px' } }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask('Explain the main voting systems used around the world (plurality, two-round, ranked choice, proportional, mixed-member, approval, single-list), with real examples of elections where the choice of system changed the result. Include Arrow’s theorem and Duverger’s law, and the main arguments for and against each system from across the political spectrum.', 'Voting systems') }, '✦ Go deeper with the tutor'))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Gerrymandering: drawing the lines'), h('div', { class: 'row', style: { gap: '6px', marginBottom: '8px' } }, PLANS.map(([n], i) => h('button', { class: 'btn sm', onclick: () => { plan = i; drawG(); } }, n))), gBox));
  makeVoters(); update(); drawG();
};

// ---------- Indigenous peoples ----------
M.render.indigenous = (el) => {
  const I = M.indig;
  const nDet = h('div', { class: 'card', style: { display: 'none' } });
  const openN = (n) => { nDet.style.display = 'block'; nDet.innerHTML = ''; nDet.append(h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, n.e + ' ' + n.n), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { nDet.style.display = 'none'; } }, 'Close')),
    M.figure('nat:' + n.id, { max: '300px' }), h('p', { class: 'tiny muted' }, `${n.region} · ${n.when}`),
    h('div', { class: 'grid g2' }, [['👥 Population', n.pop], ['🏛️ How they governed', n.gov], ['🌽 Economy', n.econ], ['🎭 Life & culture', n.life], ['⚔️ Contact & colonization', n.contact], ['🌱 Today', n.today]].map(([a, b]) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px' } }, h('b', { class: 'small' }, a), h('p', { class: 'small', style: { margin: '4px 0 0' } }, b)))),
    h('div', { class: 'row', style: { gap: '6px', marginTop: '10px' } }, n.id === 'haud' ? h('button', { class: 'btn sm', onclick: () => M.go('systems', 'haud') }, '🏛️ How the Confederacy worked') : null,
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Teach me about the ${n.n} in depth: their history before European contact, how they governed themselves, their economy, beliefs and daily life, what happened during colonization (with evidence and numbers), and their situation today. Center Indigenous sources and scholarship, and note where historians disagree.`, n.n) }, '✦ Learn in depth'),
      h('a', { class: 'btn sm', href: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(n.n.split(' (')[0].split(' & ')[0].replace(/^The /, '').replace(/ /g, '_')), style: { textDecoration: 'none' } }, 'Wikipedia ↗')));
    nDet.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  // map
  const mapBox = h('div', { class: 'viz', style: { padding: '6px', color: 'var(--ink)', minHeight: '120px' } }, h('p', { class: 'small muted' }, 'Loading map…'));
  (async () => {
    try {
      if (!window.d3 || !window.topojson) throw new Error('no d3');
      const topo = await fetch('data/world110.json').then((r) => r.json());
      const land = topojson.feature(topo, topo.objects.land);
      const W = 900, H = 460; const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');
      const proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], { type: 'Sphere' }); const path = d3.geoPath(proj);
      svg.append('path').datum({ type: 'Sphere' }).attr('d', path).attr('fill', 'rgba(56,189,248,.08)');
      svg.append('path').datum(land).attr('d', path).attr('fill', 'rgba(120,120,140,.35)');
      const placed = I.nations.map((n) => { const [x, y] = proj([n.lon, n.lat]); return [x - 8, x + 8, y + 4]; });
      const free = (x0, x1, y) => placed.every(([a, b, c]) => Math.abs(c - y) > 12 || x1 < a || x0 > b);
      I.nations.forEach((n) => { const [x, y] = proj([n.lon, n.lat]); const g = svg.append('g').style('cursor', 'pointer').on('click', () => openN(n)); g.append('circle').attr('cx', x).attr('cy', y).attr('r', 7).attr('fill', '#0E7490').attr('stroke', '#fff').attr('stroke-width', 1.5); g.append('title').text(n.n);
        const lab = n.n.split(' (')[0].replace(/^The /, '').split(' & ')[0].replace(' Confederacy', '').replace(' Nation', '').replace(' Empire', '').replace(' Coast nations', '').slice(0, 20); const w = lab.length * 5.6;
        for (const [ax, dy] of [[1, 4], [-1, 4], [1, -10], [-1, -10], [1, 16], [-1, 16]]) { const x0 = ax > 0 ? x + 9 : x - 9 - w, ly = y + dy; if (free(x0, x0 + w, ly)) { placed.push([x0, x0 + w, ly]); g.append('text').attr('x', ax > 0 ? x + 9 : x - 9).attr('y', ly).attr('text-anchor', ax > 0 ? 'start' : 'end').attr('font-size', 10).attr('font-weight', 700).attr('fill', 'currentColor').text(lab); break; } } });
      mapBox.innerHTML = ''; mapBox.append(svg.node());
    } catch (e) { mapBox.innerHTML = ''; mapBox.append(h('p', { class: 'small muted' }, 'Map unavailable; use the cards below.')); }
  })();
  const evs = M.events.filter((e) => e.cat.includes('indig')).sort((a, b) => a.y - b.y);
  el.append(
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, '🪶 Indigenous peoples: before, during and after colonization'), h('p', null, I.intro),
      h('p', { class: 'small muted' }, 'Hundreds of distinct nations are represented here by a few. Indigenous peoples are not one group with one view, and this is history they are still living, not only the past.')),
    h('h3', { style: { margin: '14px 0 6px' } }, 'Nations and civilizations (tap a dot or a card)'), mapBox,
    h('div', { class: 'grid g3', style: { marginTop: '10px' } }, I.nations.map((n) => h('div', { class: 'card', style: { cursor: 'pointer', padding: '14px' }, onclick: () => openN(n) }, h('div', { class: 'row' }, h('span', { style: { fontSize: '22px' } }, n.e), h('b', null, n.n)), h('p', { class: 'tiny muted', style: { margin: '4px 0' } }, n.region + ' · ' + n.when), h('p', { class: 'small', style: { margin: 0 } }, n.gov.length > 130 ? n.gov.slice(0, 130) + '…' : n.gov)))),
    nDet,
    h('h3', { style: { margin: '18px 0 6px' } }, 'What happened, 1763–2026'),
    h('p', { class: 'small muted' }, 'Each event opens in the main timeline with causes, conditions, numbers, every side’s reading (including Indigenous perspectives), and what is settled vs argued.'),
    h('div', { class: 'stack' }, evs.map((e) => h('div', { class: 'card', style: { cursor: 'pointer', padding: '12px 16px', borderLeft: '5px solid #0E7490' }, onclick: () => M.go('timeline', 'ev-' + e.id) }, h('div', { class: 'row' }, h('b', { style: { minWidth: '86px', fontFamily: 'Space Grotesk' } }, yr(e)), h('b', null, e.t)), h('div', { class: 'small muted', style: { marginTop: '4px' } }, e.what.slice(0, 220) + (e.what.length > 220 ? '…' : ''))))),
    h('div', { class: 'stack', style: { marginTop: '6px' } }, ['boer', 'scramble', 'decol'].map((id) => EV[id]).filter(Boolean).map((e) => h('div', { class: 'small' }, '↳ Also: ', h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); M.go('timeline', 'ev-' + e.id); } }, e.t)))),
    h('div', { class: 'card', style: { marginTop: '14px' } }, h('h3', { style: { marginTop: 0 } }, 'Key ideas you need'), h('div', { class: 'grid g2' }, I.concepts.map(([t, d]) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px' } }, h('b', { class: 'small' }, t), h('p', { class: 'small', style: { margin: '4px 0 0' } }, d))))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The big debates'), ...I.debates.map(([q, c, n]) => h('div', { class: 'small', style: { margin: '10px 0' } }, Lab.conf(c), ' ', h('b', null, q), h('div', { class: 'muted', style: { marginTop: '3px' } }, n)))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Go deeper'), h('div', { class: 'row', style: { gap: '6px' } },
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask('Explain the history of Native American nations in what is now the United States from 1492 to 2026 as a connected story: before contact, epidemics, wars, treaties, removal, reservations, boarding schools, termination, Red Power and today’s sovereignty. Use Indigenous scholars as well as others, give numbers with sources, and separate settled facts from debates.', 'Native American history') }, '✦ The whole story, 1492–2026'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask('Compare how the United States, Canada, Australia, New Zealand, Argentina and Russia treated Indigenous peoples: methods, results, legal frameworks and current reconciliation efforts. What patterns repeat in settler colonialism, and where did histories differ?', 'Settler colonialism compared') }, '✦ Compare settler states'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask('Explain the legal definition of genocide (the 1948 Convention, Lemkin’s original concept) and apply it carefully to the California genocide, Indian removal, the boarding and residential schools, the Tasmanian case and the Herero and Nama genocide. Present the arguments of historians who say yes and those who prefer other terms.', 'Genocide and colonization') }, '✦ Was it genocide? Test the definition'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask('Teach me about Indigenous governance systems in depth: the Haudenosaunee Great Law, Lakota councils, Inca administration, Māori tribal government, Aboriginal law and Country, and modern tribal governments and courts. How did they make decisions, distribute power and resolve conflict?', 'Indigenous governance') }, '✦ Indigenous governance'))));
};

// ---------- Science & ideas ----------
M.render.science = (el, arg) => {
  let on = new Set(Object.keys(M.disc)), q = '';
  const chips = h('div', { class: 'row', style: { gap: '6px' } }); const list = h('div', { class: 'stack', style: { marginTop: '10px' } });
  const card = (s) => {
    const D = M.disc[s.d]; let det = null;
    const box = h('div', { class: 'card', style: { padding: '12px 16px', borderLeft: `5px solid ${D[2]}` } });
    const head = h('div', { class: 'row', style: { cursor: 'pointer', alignItems: 'baseline' } }, h('b', { style: { minWidth: '56px', fontFamily: 'Space Grotesk' } }, s.y), h('span', null, D[0]), h('b', { style: { flex: '1 1 240px' } }, s.t), h('span', { class: 'tiny muted' }, s.who));
    head.onclick = () => { if (det) { det.remove(); det = null; return; } det = h('div', { style: { marginTop: '8px' } }, M.figure('sci:' + s.id, { max: '260px', fit: 'contain' }),
      h('p', { class: 'small' }, h('b', null, 'What: '), s.what), h('p', { class: 'small' }, h('b', null, 'Why it mattered: '), s.why), h('p', { class: 'small' }, h('b', null, '🔗 How it connects to history and politics: '), s.link),
      s.ev.length ? h('div', { class: 'row', style: { gap: '6px' } }, s.ev.map(evChip)) : null,
      bookRow(SCI_BK[s.id]) ? h('div', { style: { marginTop: '6px' } }, h('div', { class: 'tiny muted' }, 'Read the original in the Lab'), bookRow(SCI_BK[s.id])) : null,
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Teach me "${s.t}" (${s.y}, ${s.who}) properly: explain the actual ${D[1].toLowerCase()} in plain language with an example I can work through, the people and conditions that made the discovery possible, and how it changed politics, the economy and war.`, s.t) }, '✦ Teach me the actual science'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`What were the material, political and economic conditions that made "${s.t}" (${s.y}) possible, who funded it, and who benefited or was harmed by it?`, s.t) }, '✦ Who paid, who gained')));
      box.append(det); Lab.markDone && Lab.markDone('sci:' + s.id, 2, s.t); };
    box.append(head, h('div', { class: 'small muted', style: { marginTop: '4px' } }, s.link)); box.dataset.id = s.id; return box;
  };
  function draw() {
    chips.innerHTML = ''; list.innerHTML = '';
    Object.entries(M.disc).forEach(([k, [e, n, c]]) => chips.append(h('span', { class: 'chip' + (on.has(k) ? ' on' : ''), style: { '--c': c }, onclick: () => { on.has(k) ? on.delete(k) : on.add(k); draw(); } }, e + ' ' + n)));
    M.science.filter((s) => on.has(s.d) && (!q || JSON.stringify(s).toLowerCase().includes(q))).sort((a, b) => a.y - b.y).forEach((s) => list.append(card(s)));
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Science, technology, ideas & arts, 1700–2026'),
    h('p', { class: 'small' }, `${M.science.length} breakthroughs and movements, each tied to the political and economic history it shaped, and to the events in the timeline. Science never happens outside history: who funded it, who used it and who paid for it is part of the story.`),
    chips, h('input', { type: 'text', placeholder: 'Search…', style: { marginTop: '8px' }, oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } })), list);
  draw();
  if (arg) setTimeout(() => { const b = list.querySelector(`[data-id="${arg}"]`); if (b) { b.firstChild.click(); b.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 80);
};

// ---------- Time machine ----------
const POP = [[1700, 600], [1750, 770], [1800, 990], [1850, 1260], [1900, 1650], [1950, 2500], [1975, 4060], [2000, 6150], [2026, 8250]];
const LIFE = [[1700, 28], [1800, 29], [1850, 30], [1900, 32], [1950, 46], [1975, 59], [2000, 66], [2026, 73]];
const lerp = (T, y) => { for (let i = 1; i < T.length; i++) if (y <= T[i][0]) { const [a, va] = T[i - 1], [b, vb] = T[i]; return va + (vb - va) * (y - a) / (b - a); } return T[T.length - 1][1]; };
const sysYears = (s) => { const m = s.yrs.match(/\d{4}/g) || []; const a = +m[0]; const b = /today/.test(s.yrs) ? 2026 : +(m[m.length - 1] || a); return [a, b]; };
M.render.time = (el) => {
  let Y = 1789;
  const lbl = h('div', { style: { fontFamily: 'Space Grotesk', fontSize: '44px', fontWeight: 800 } });
  const stats = h('div', { class: 'row', style: { gap: '18px' } });
  const body = h('div', { class: 'grid g2', style: { marginTop: '10px' } });
  const slider = h('input', { type: 'range', min: 1700, max: 2026, value: Y, style: { width: '100%' }, oninput: (e) => { Y = +e.target.value; draw(); } });
  const step = (d) => h('button', { class: 'btn sm', onclick: () => { Y = Math.max(1700, Math.min(2026, Y + d)); slider.value = Y; draw(); } }, (d > 0 ? '+' : '') + d);
  function draw() {
    lbl.textContent = Y; stats.innerHTML = '';
    const era = M.eras.find((e) => Y >= e.y && Y <= e.y2) || M.eras[M.eras.length - 1];
    stats.append(h('div', null, h('div', { class: 'tiny muted' }, 'Era'), h('b', { style: { color: era.c } }, era.n)), h('div', null, h('div', { class: 'tiny muted' }, 'World population (approx.)'), h('b', null, (lerp(POP, Y) / 1000).toFixed(2) + ' billion')), h('div', null, h('div', { class: 'tiny muted' }, 'Life expectancy at birth (approx.)'), h('b', null, Math.round(lerp(LIFE, Y)) + ' years')));
    body.innerHTML = '';
    const now = M.events.filter((e) => e.y <= Y + 2 && (e.y2 || e.y) >= Y - 2).sort((a, b) => a.y - b.y);
    const sci = M.science.filter((s) => Math.abs(s.y - Y) <= 12).sort((a, b) => Math.abs(a.y - Y) - Math.abs(b.y - Y)).slice(0, 6);
    const sys = M.systems.filter((s) => { const [a, b] = sysYears(s); return a <= Y && b >= Y; });
    body.append(
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, `🔥 Happening around ${Y}`), now.length ? h('div', { class: 'stack' }, now.map((e) => h('div', { style: { cursor: 'pointer' }, onclick: () => M.go('timeline', 'ev-' + e.id) }, h('b', { class: 'small' }, `${yr(e)} · ${e.t}`), h('div', { class: 'tiny muted' }, e.what.slice(0, 140) + '…')))) : h('p', { class: 'small muted' }, 'No major event in this module right at this year; move the slider or open the World atlas for the map.')),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '💡 Science & ideas nearby'), sci.length ? h('div', { class: 'stack' }, sci.map((s) => h('div', { class: 'small', style: { cursor: 'pointer' }, onclick: () => M.go('science', s.id) }, `${M.disc[s.d][0]} ${s.y} · ${s.t}`))) : h('p', { class: 'small muted' }, 'Nothing in the list within 12 years.')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🏛️ Systems in existence'), sys.length ? h('div', { class: 'row', style: { gap: '6px' } }, sys.map((s) => h('span', { class: 'chip', style: { '--c': '#0F766E' }, onclick: () => M.go('systems', s.id) }, s.e + ' ' + s.n))) : h('p', { class: 'small muted' }, '—')),
        h('div', { class: 'card' }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Take me to the year ${Y}. Describe the world as it was: who the great powers were, the main political systems and ideologies, what ordinary people in different parts of the world ate, earned and did, the big science and technology of the moment, the arts, and the conflicts brewing. Then tell me what people at the time could not know was coming.`, 'The year ' + Y) }, `✦ Describe the world in ${Y}`), ' ', h('a', { class: 'btn sm', href: '#history-atlas', style: { textDecoration: 'none' } }, '🗺️ Open the world atlas'))));
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Time machine'), h('p', { class: 'small muted' }, 'Drag to any year from 1700 to 2026 to see what was happening, the science of the moment, which political systems existed, and how people lived.'), lbl, stats, slider, h('div', { class: 'row', style: { gap: '6px', marginTop: '6px' } }, step(-25), step(-5), step(-1), step(1), step(5), step(25))), body);
  draw();
};
