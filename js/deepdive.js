// Deep-dive engine. Every ideology deep dive is rendered from one data object, so all dives share the same
// sections, the same layout and the same standard. Register a dive with Lab.deepdive.register(id, cfg):
//   cfg = { tab, title, emoji, color, years, data, labs, sections, custom, ui, side, seeds, skills }
//   data     the dive's data (ideas, tree, machine, gap, tools, cases, caseOrder, compare, gains, tolls,
//            predictions, debates, claims, reading, intro, howto). Missing parts are simply not shown.
//   sections [[key, label], ...] in tab order. Keys with a generic renderer below need no code;
//            other keys are rendered by cfg.custom[key](panel, nav, arg, cfg).
//   ui       headings, intros and tutor prompts for this dive (see marx-data.js for the full set).
//   side     answers to the shared side-by-side questions (Lab.DIVE_HEADINGS): {key: [text, section]}.
// The "Ideologies side by side" tab (#history-modern-dives) lists every registered dive under the same headings.
const h = Lab.h;
const M = Lab.MODERN;
Lab.DEEPDIVES = Lab.DEEPDIVES || {};

// The questions every dive answers, in this order (plan/STANDARDS.md §1).
Lab.DIVE_HEADINGS = [
  ['ideas', 'The core ideas'],
  ['who', 'Who held them, and why'],
  ['promised', 'What it promised'],
  ['tried', 'What happened when it was tried'],
  ['gains', 'Gains'],
  ['costs', 'Costs and death tolls'],
  ['pro', 'What supporters say now'],
  ['con', 'What critics say now'],
];
// The same questions as review-card prompts ({t} = the dive's title).
Lab.DIVE_QS = { ideas: 'What are the core ideas of {t}?', who: 'Who held the ideas of {t}, and why were they drawn to them?', promised: 'What did {t} promise?', tried: 'What happened when {t} was tried?', gains: 'What are the main gains claimed for {t}, with the evidence?', costs: 'What were the costs and death tolls of {t}, as estimate ranges?', pro: 'What do supporters of {t} say now?', con: 'What do critics of {t} say now?' };
// Dives that are planned but not yet built. `ov` is the short overview that already exists in the Ideologies tab.
Lab.DIVES_PLANNED = Lab.DIVES_PLANNED || [
  ['Capitalism', 'Being built now', 'liberal'],
  ['Fascism and Nazism', 'Planned', 'fascism'],
  ['Liberalism', 'Planned', 'progressive'],
  ['Conservatism', 'Planned', 'conservative'],
  ['Anarchism', 'Planned', 'anarchism'],
  ['Social democracy and democratic socialism', 'Planned', 'socdem'],
  ['Nationalism', 'Planned', 'anticolonial'],
  ['Libertarianism', 'Planned', 'libertarian'],
];

const card = (...kids) => h('div', { class: 'card' }, ...kids);
const sub = (...kids) => h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, ...kids);
const link = ([label, url]) => url ? h('a', { href: url, target: '_blank', rel: 'noopener', class: 'small', style: { display: 'block', margin: '4px 0' } }, '📄 ' + label + ' ↗') : h('div', { class: 'small', style: { margin: '4px 0' } }, '📚 ' + label);
const go = (hash) => h('a', { class: 'btn sm', href: '#' + hash, style: { textDecoration: 'none' } });
const btn = ([hash, label]) => Object.assign(go(hash), { textContent: label });
const CONF = { high: 'Established', medium: 'Strong', developing: 'Developing' };
const vcol = (v) => ({ True: '#15803D', False: '#DC2626', Misleading: '#EA580C', Contested: '#7C3AED', Hit: '#15803D', Miss: '#DC2626', 'Mostly miss': '#EA580C', 'Hit (but reformist)': '#0891B2' }[v] || '#475569');
const fig = (k, max) => (!k ? null : /^[cv]:/.test(k) ? Lab.cfig(k, { max: max || '320px' }) : M.figure ? M.figure(k, { max: max || '320px' }) : null);
const figOf = (f) => (f ? fig(f[0], f[1]) : null);
const fill = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
// Rich text from data: strings stay text, ['b', text] becomes bold.
const rich = (parts) => (Array.isArray(parts) ? parts : [parts]).map((x) => (Array.isArray(x) ? h(x[0], null, x[1]) : x));
const discName = (d) => ((Lab.DISC || []).find((x) => x.id === d) || {}).name || d;

// ---------- generic section renderers: R[key](panel, nav, arg, cfg) ----------
const R = {};
R.start = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  const path = D.sections.some(([k]) => k === 'evidence') && !U.path.some(([k]) => k === 'evidence') ? [['evidence', 'The evidence: numbers, charts, photographs, documents, data and research'], ...U.path] : U.path;
  const dir = h('div', { class: 'grid g3' }, path.map(([k, t]) => { const s = D.sections.find((x) => x[0] === k); if (!s) return null;
    return h('button', { class: 'card', style: { textAlign: 'left', cursor: 'pointer', borderTop: `4px solid ${D.color}`, display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: 'none' }, onclick: () => nav(k) },
      h('b', { style: { fontSize: '16px' } }, s[1]), h('span', { class: 'small muted', style: { lineHeight: 1.5 } }, t), h('span', { class: 'small', style: { color: D.color, fontWeight: 700, marginTop: 'auto' } }, 'Open →')); }).filter(Boolean));
  p.append(card(h('h2', { style: { marginTop: 0 } }, U.pathTitle), dir, h('div', { class: 'row', style: { gap: '6px', marginTop: '12px' } }, U.startLinks.map(btn))),
    card(h('h2', { style: { marginTop: 0 } }, U.startTitle),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null, X.intro.slice(1).map((t) => h('p', { class: 'small' }, t))), h('div', { class: 'stack' }, figOf(U.startFig))),
      h('h3', null, (U.lbl || {}).study || 'How to study this fairly'), h('div', { class: 'grid g3' }, X.howto.map(([t, d]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, t), h('div', { class: 'small muted' }, d))))));
};

R.ideas = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  let i = 0; const box = h('div');
  const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const draw = () => { chips.innerHTML = ''; X.ideas.forEach((x, j) => chips.append(h('span', { class: 'chip' + (j === i ? ' on' : ''), onclick: () => { i = j; draw(); } }, x[1] + ' ' + x[2].split(' (')[0])));
    const [id, e, n, plain, ex, txt, test, pro, con] = X.ideas[i]; box.innerHTML = '';
    const labs = (U.ideaLabs || {})[id];
    box.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, e), h('h2', { style: { margin: 0, flex: 1 } }, n), h('span', { class: 'tiny muted' }, `${i + 1} / ${X.ideas.length}`)),
      h('p', null, plain), h('p', { class: 'small' }, h('b', null, 'Example: '), ex),
      labs ? h('div', { class: 'row', style: { gap: '6px' } }, labs.map(btn)) : null,
      figOf((U.ideaFigs || {})[id]),
      h('div', { class: 'grid g3', style: { marginTop: '8px' } }, sub(h('b', null, (U.lbl || {}).test || '🧪 Does it hold up?'), h('p', { class: 'small' }, test)), sub(h('b', { style: { color: '#15803D' } }, U.ideaPro || '👍 Why defenders value it'), h('p', { class: 'small' }, pro)), sub(h('b', { style: { color: '#DC2626' } }, U.ideaCon || '👎 What critics say'), h('p', { class: 'small' }, con))),
      h('div', { style: { marginTop: '8px' } }, link(txt)),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Previous'), h('button', { class: 'btn sm primary', disabled: i === X.ideas.length - 1, onclick: () => { i++; draw(); } }, 'Next idea →'), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => Lab.ask(fill(U.ideaAsk, { n }), n) }, '✦ Discuss with the tutor')))); };
  p.append(card(chips), box); draw();
};

R.tree = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  p.append(card(h('h2', { style: { marginTop: 0 } }, U.treeTitle), h('p', { class: 'small' }, U.treeIntro)));
  const wrap = h('div', { class: 'stack' });
  X.tree.forEach(([id, n, yrs, c, claim, people, where, verdict, txt]) => { const body = h('div', { style: { display: 'none' } }, h('p', { class: 'small' }, h('b', null, ((U.lbl || {}).tree || [])[0] || 'Core claim: '), claim), h('p', { class: 'small' }, h('b', null, ((U.lbl || {}).tree || [])[1] || 'Key people: '), people), h('p', { class: 'small' }, h('b', null, ((U.lbl || {}).tree || [])[2] || 'Where: '), where), h('p', { class: 'small' }, h('b', null, ((U.lbl || {}).tree || [])[3] || 'Track record: '), verdict), link(txt));
    wrap.append(h('div', { class: 'card', style: { borderLeft: `6px solid ${c}`, cursor: 'pointer' }, onclick: () => { body.style.display = body.style.display === 'none' ? 'block' : 'none'; } }, h('div', { class: 'row' }, h('b', null, n), h('span', { class: 'tiny muted' }, yrs), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, 'tap ▾')), body)); });
  p.append(wrap);
};

R.machine = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  let cur = X.machine[0]; const detail = h('div');
  const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '6px' } });
  const draw = () => { grid.innerHTML = ''; X.machine.forEach((m) => grid.append(h('button', { class: 'btn', style: { textAlign: 'left', padding: '7px 9px', display: 'flex', gap: '6px', alignItems: 'center', border: m === cur ? '2px solid var(--accent)' : '1px solid var(--line)' }, onclick: () => { cur = m; draw(); detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }, h('span', { style: { fontSize: '18px' } }, m[1]), h('span', { class: 'tiny', style: { fontWeight: 700, lineHeight: 1.25 } }, m[2]))));
    const [, e, n, formal, real, ex] = cur; detail.innerHTML = '';
    detail.append(card(h('h3', { style: { marginTop: 0 } }, e + ' ' + n), h('div', { class: 'grid g2' }, sub(h('b', null, ((U.lbl || {}).machine || [])[0] || '📜 On paper'), h('p', { class: 'small' }, formal)), sub(h('b', null, ((U.lbl || {}).machine || [])[1] || '🔦 In reality'), h('p', { class: 'small' }, real))), h('p', { class: 'small' }, h('b', null, 'Examples: '), ex), figOf((U.machineFigs || {})[cur[0]]))); };
  p.append(card(h('h2', { style: { marginTop: 0 } }, U.machineTitle), h('p', { class: 'small' }, U.machineIntro),
    U.machineChain ? h('div', { class: 'small', style: { padding: '10px', borderRadius: '10px', background: 'var(--card2)', margin: '8px 0', lineHeight: 1.7 } }, ...rich(U.machineChain)) : null, grid), detail);
  draw();
  const KEPT = [['No', '#DC2626'], ['Partly', '#EA580C'], ['Yes', '#15803D']];
  if (X.gap) p.append(card(h('h3', { style: { marginTop: 0 } }, U.gapTitle), h('div', { class: 'stack', style: { gap: '0' } }, X.gap.map(([a, b, c, s]) => h('div', { style: { padding: '8px 0', borderBottom: '1px solid var(--line)' } }, h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '8px', alignItems: 'flex-start' } }, h('span', { class: 'tag', style: { '--c': KEPT[s][1], flex: 'none', minWidth: '54px', textAlign: 'center' } }, KEPT[s][0]), h('div', null, h('b', { class: 'small' }, a), h('div', { class: 'tiny muted' }, 'Promise from: ' + b), h('div', { class: 'small' }, c)))))), h('p', { class: 'small', style: { marginTop: '8px' } }, X.gapNote)));
  if (X.tools && U.toolsTitle) p.append(card(h('h3', { style: { marginTop: 0 } }, U.toolsTitle), h('div', { class: 'grid g2' }, X.tools.slice(...(U.toolsSlice || [0])).map(([e, t, d, txt, hs]) => sub(h('b', null, e + ' ' + t), h('div', { class: 'tiny muted' }, discName(d)), h('p', { class: 'small' }, txt), h('a', { href: '#' + hs, class: 'small' }, 'Open the related lab or page →'))))));
};

R.cases = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  let key = X.cases[arg] ? arg : X.caseOrder[0]; const box = h('div'); const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const draw = () => { chips.innerHTML = ''; X.caseOrder.forEach((k) => chips.append(h('span', { class: 'chip' + (k === key ? ' on' : ''), onclick: () => { key = k; history.replaceState(null, '', '#' + D.base + '-' + k); draw(); } }, X.cases[k].flag + ' ' + X.cases[k].n)));
    const c = X.cases[key]; box.innerHTML = '';
    const tl = h('div');
    c.tl.forEach(([y, t, cf]) => tl.append(h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-start', padding: '7px 4px', borderBottom: '1px solid var(--line)' } }, h('b', { class: 'small', style: { width: '74px', flex: 'none' } }, y), h('span', { class: 'small', style: { flex: 1 } }, t), Lab.conf(CONF[cf] || cf))));
    const links = (U.caseLinks || []).filter(([, , only]) => !only || only.includes(key)).map(btn);
    box.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, c.flag), h('h2', { style: { margin: 0 } }, c.n), h('span', { class: 'tag', style: { '--c': '#475569' } }, c.years)), h('p', null, c.sum),
      h('div', { class: 'grid g2' }, fig(c.img, '360px'), fig(c.img2, '360px'))),
      card(h('h3', { style: { marginTop: 0 } }, '📅 Timeline'), tl),
      card(h('h3', { style: { marginTop: 0 } }, (U.lbl || {}).power || '🏛️ Who holds power'), h('p', { class: 'small' }, c.power), h('div', { class: 'row', style: { gap: '6px' } }, links)),
      h('div', { class: 'grid g2' }, card(h('h3', { style: { marginTop: 0, color: '#15803D' } }, (U.lbl || {}).gains || '📈 Achievements'), h('ul', { class: 'small' }, c.gains.map((g) => h('li', { style: { margin: '4px 0' } }, g)))), card(h('h3', { style: { marginTop: 0, color: '#DC2626' } }, (U.lbl || {}).costs || '📉 Costs'), h('ul', { class: 'small' }, c.costs.map((g) => h('li', { style: { margin: '4px 0' } }, g))))),
      card(h('h3', { style: { marginTop: 0 } }, (U.lbl || {}).tellings || '🗣️ How each side tells it'), h('div', { class: 'grid g2' }, c.tellings.map(([w, v, m]) => sub(h('b', null, w), h('p', { class: 'small', style: { margin: '4px 0' } }, v), m ? h('p', { class: 'tiny', style: { color: '#B45309', margin: 0 } }, h('b', null, (U.lbl || {}).leaves || 'Leaves out: '), m) : null)))),
      card(h('h3', { style: { marginTop: 0 } }, (U.lbl || {}).now || '🔴 Now'), h('p', { class: 'small' }, c.now), Lab.source(c.src),
        h('button', { class: 'btn sm primary', style: { marginTop: '8px' }, onclick: () => Lab.ask(fill(U.caseAsk, { n: c.n }), c.n) }, '✦ Go deeper with the tutor'))); };
  p.append(card(chips), box); draw();
};

R.compare = (p, nav, arg, D) => { const X = D.data; p.append(card(h('h2', { style: { marginTop: 0 } }, D.ui.compareTitle), h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', minWidth: '980px' } }, h('tr', null, h('th', { style: { textAlign: 'left', padding: '6px' } }, 'Question'), ...X.compareCols.map((c) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, c))), X.compare.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', verticalAlign: 'top', fontWeight: j ? 400 : 600, background: j && /^No\b/.test(c) ? 'rgba(220,38,38,.13)' : j && /^Yes/.test(c) ? 'rgba(22,163,74,.13)' : '' } }, c)))))), h('p', { class: 'small', style: { marginTop: '8px' } }, X.compareNote))); };

// Simple line/bar chart. series: [[name, color, [[x, y], ...]]]; opts: { unit, bar }
const chartSVG = (series, opts = {}) => { const W = 640, H = 260, L = 46, R = 14, T = 14, B = 34; const pts = series.flatMap(([, , d]) => d);
  const num = pts.every((p) => typeof p[0] === 'number'); const xs = num ? [...new Set(pts.map((p) => p[0]))].sort((a, b) => a - b) : [...new Set(pts.map((p) => p[0]))]; const ymax = Math.max(...pts.map((p) => p[1])) * 1.1 || 1;
  const X = (x) => L + (xs.length > 1 ? (xs.indexOf(x) / (xs.length - 1)) : 0.5) * (W - L - R); const Y = (y) => T + (1 - y / ymax) * (H - T - B);
  const ns = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('style', 'width:100%;height:auto;font:11px system-ui,sans-serif'); let g = '';
  for (let i = 0; i <= 4; i++) { const v = ymax * i / 4; g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#94A3B8" stroke-opacity=".25"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" fill="#64748B">${v >= 10 ? Math.round(v) : v.toFixed(1)}</text>`; }
  const step = Math.ceil(xs.length / 12); xs.forEach((x, i) => { if (i % step === 0 || i === xs.length - 1) g += `<text x="${X(x)}" y="${H - 12}" text-anchor="middle" fill="#64748B">${x}</text>`; });
  series.forEach(([n, c, d]) => { if (opts.bar) { const bw = Math.max(4, (W - L - R) / xs.length * 0.6 / series.length); d.forEach(([x, y]) => { g += `<rect x="${X(x) - bw / 2}" y="${Y(y)}" width="${bw}" height="${H - B - Y(y)}" fill="${c}" opacity=".85"><title>${n} ${x}: ${y}${opts.unit || ''}</title></rect>`; }); }
    else { g += `<polyline fill="none" stroke="${c}" stroke-width="2.5" points="${d.map(([x, y]) => X(x) + ',' + Y(y)).join(' ')}"/>`; d.forEach(([x, y]) => { g += `<circle cx="${X(x)}" cy="${Y(y)}" r="3.5" fill="${c}"><title>${n} ${x}: ${y}${opts.unit || ''}</title></circle>`; }); } });
  svg.innerHTML = g; return svg; };
const chartCard = ([t, cap, series, src, opts]) => card(h('h3', { style: { marginTop: 0 } }, '📈 ' + t), h('p', { class: 'small muted' }, cap), chartSVG(series, opts || {}),
  h('div', { class: 'row', style: { gap: '12px', flexWrap: 'wrap', marginTop: '4px' } }, series.map(([n, c]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', background: c, borderRadius: '2px', marginRight: '4px' } }), n))), Lab.source(src));

R.evidence = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  if (X.charts && X.charts.length) p.append(card(h('h2', { style: { marginTop: 0 } }, 'The numbers, charted'), h('p', { class: 'small muted' }, 'Hover or tap a point to see its value. Every chart lists its source.')), ...X.charts.map(chartCard));
  const tbl = (head, rows) => h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', minWidth: '640px', width: '100%' } }, h('tr', null, ...head.map((t) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, t))), rows.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', verticalAlign: 'top', fontWeight: j === 1 ? 700 : j ? 400 : 600 } }, c))))));
  if (X.gains) p.append(card(h('h2', { style: { marginTop: 0 } }, U.gainsTitle), figOf(U.gainsFig), tbl((U.lbl || {}).gainsCols || ['Measure', 'Change', 'Source', 'Caveat'], X.gains), h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, (U.gainsLinks || []).map(btn))));
  if (X.tolls) p.append(card(h('h2', { style: { marginTop: 0 } }, U.tollsTitle), figOf(U.tollsFig), tbl((U.lbl || {}).tollsCols || ['Event', 'Estimate', 'Main sources', 'Notes'], X.tolls), h('p', { class: 'small', style: { marginTop: '8px' } }, X.tollsNote), h('div', { class: 'row', style: { gap: '6px' } }, (U.tollsLinks || []).map(btn))));
  if (X.predictions) p.append(card(h('h2', { style: { marginTop: 0 } }, U.predTitle), h('div', { class: 'stack', style: { gap: '6px' } }, X.predictions.map(([c, v, n]) => h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-start' } }, h('span', { class: 'tag', style: { '--c': vcol(v), flex: 'none', minWidth: '84px', textAlign: 'center' } }, v), h('div', null, h('b', { class: 'small' }, c), h('div', { class: 'small muted' }, n)))))));
  R.locker(p, nav, arg, D, true);
};

// ---------- Evidence: primary documents, data, research, pictures and sourced claims, one kind at a time ----------
R.locker = (p, nav, arg, D, embed) => {
  const X = D.data, L = X.locker || {};
  const fromReading = (X.reading || []).flatMap(([, it]) => it.filter((x) => x[1]).map(([t, u]) => [t, '', '', u]));
  const docs = L.docs || fromReading; const data = L.data || []; const papers = L.papers || [];
  const pics = (X.gallery || []).flatMap(([, , k]) => k);
  const tabs = [['docs', `Primary documents (${docs.length})`, docs.length], ['data', `Data you can check (${data.length})`, data.length], ['papers', `Research papers (${papers.length})`, papers.length], ['pics', `Pictures & film (${pics.length})`, pics.length], ['records', 'Sourced records', D.claimsId]].filter((t) => t[2]);
  const chips = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'nowrap', overflowX: 'auto' } }); const box = h('div');
  const a = (t, u) => (u ? h('a', { href: u, target: '_blank', rel: 'noopener' }, t + ' ↗') : h('span', null, t));
  const row = (...k) => h('div', { style: { borderLeft: `3px solid ${D.color}`, padding: '6px 0 6px 12px', margin: '8px 0' } }, ...k);
  const show = (k) => { chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); box.innerHTML = '';
    if (k === 'docs') box.append(card(h('h3', { style: { marginTop: 0 } }, 'Primary documents'), h('p', { class: 'small muted' }, 'The original texts, laws, records and testimony, so you can read the evidence yourself instead of trusting a summary.'), ...docs.map(([t, y, w, u]) => row(h('b', { class: 'small' }, a(t, u)), y ? h('span', { class: 'tiny muted' }, '  ' + y) : null, w ? h('div', { class: 'small muted' }, w) : null))));
    if (k === 'data') box.append(card(h('h3', { style: { marginTop: 0 } }, 'Data you can check yourself'), h('p', { class: 'small muted' }, 'Datasets kept by the researchers and institutions who collect them. Open them, pick a country or year, and test the claims on this page.'), ...data.map(([t, w, u]) => row(h('b', { class: 'small' }, a(t, u)), h('div', { class: 'small muted' }, w)))));
    if (k === 'papers') box.append(card(h('h3', { style: { marginTop: 0 } }, 'Research papers'), h('p', { class: 'small muted' }, 'Peer-reviewed studies behind the debates. Read what each found, and remember that one study is rarely the last word.'), ...papers.map(([t, au, y, f, u]) => row(h('b', { class: 'small' }, a(t, u)), h('div', { class: 'tiny muted' }, au + (y ? ' · ' + y : '')), h('div', { class: 'small' }, h('b', null, 'Finding: '), f)))));
    if (k === 'pics') box.append(card(h('h3', { style: { marginTop: 0 } }, 'Pictures & film'), h('p', { class: 'small muted' }, 'Photographs, documents and archival film from Wikimedia Commons. Tap to enlarge and see who made each one. Some show violence or its aftermath and are described factually.'), Lab.cgrid(pics)));
    if (k === 'records') { const c = card(h('h3', { style: { marginTop: 0 } }, 'Sourced records'), h('p', { class: 'small muted' }, 'Every dated event and person in this deep dive is a record with its own sources and a confidence label.')); box.append(c);
      Lab.claims(D.claimsId).then((C) => { if (!C) return; const all = [...(C.events || []), ...(C.people || [])]; const by = (f) => all.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
        const st = by((x) => x.status || 'drafted'); const cf = (C.events || []).reduce((m, x) => ((m[x.conf || 'Unknown'] = (m[x.conf || 'Unknown'] || 0) + 1), m), {}); const nsrc = all.reduce((n, x) => n + (x.sources || []).length, 0);
        c.append(h('div', { class: 'row', style: { gap: '22px', flexWrap: 'wrap', margin: '6px 0 12px' } }, [[all.length, 'records'], [nsrc, 'sources linked'], [st.verified || 0, 'checked by a separate AI fact-check'], [st.drafted || 0, 'sources linked, not yet checked']].map(([n, l]) => h('div', null, h('div', { style: { fontFamily: 'var(--serif, Georgia, serif)', fontSize: '26px', fontWeight: 700 } }, String(n)), h('div', { class: 'tiny muted' }, l)))),
          h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, h('span', { class: 'tiny muted' }, 'Events by confidence:'), ...Object.entries(cf).map(([k2, n]) => h('span', null, Lab.conf(k2), h('span', { class: 'tiny muted' }, ' ' + n)))),
          h('p', { class: 'small', style: { marginTop: '10px' } }, 'Confidence labels: Established means overwhelming evidence; Strong means good evidence with details debated; Contested means serious experts disagree; Developing means events are still unfolding. No human expert has reviewed these records yet.'),
          D.sections.some(([s]) => s === 'timeline') ? h('button', { class: 'btn sm primary', onclick: () => nav('timeline') }, 'Read every record with its sources →') : null); }); }
  };
  tabs.forEach(([k, n]) => chips.append(h('span', { class: 'chip', 'data-k': k, style: { flex: 'none', whiteSpace: 'nowrap' }, onclick: () => show(k) }, n)));
  p.append(card(h('h2', { style: { marginTop: 0 } }, embed ? 'Check it yourself' : 'Evidence'), h('p', { class: 'small' }, 'Everything on these pages should be checkable: the original documents, the data, the research, the pictures and the sourced records. Choose a kind of evidence.'), chips), box);
  if (tabs.length) show(tabs[0][0]);
};

R.gallery = (p, nav, arg, D) => {
  (D.data.gallery || []).forEach(([t, intro, keys]) => p.append(card(h('h2', { style: { marginTop: 0 } }, t), intro ? h('p', { class: 'small muted' }, intro) : null, Lab.cgrid(keys))));
  p.append(card(h('a', { class: 'btn sm primary', href: '#archive', style: { marginBottom: '8px', display: 'inline-block' } }, 'See hundreds more in the Archive →'), h('p', { class: 'tiny muted', style: { margin: 0 } }, 'Pictures and film are from Wikimedia Commons and are public domain or Creative Commons licensed; tap any one to enlarge it and see its author, licence and original page. Some show violence or its aftermath and are described factually.')));
};

R.labs = (p, nav, arg, D) => {
  const X = D.data, U = D.ui;
  const K = Lab.ARC.kit(); R._stop = () => K.stop();
  (D.labs || []).forEach((id) => { const L = Lab.ARC.by[id]; if (!L) return; const el = h('div'); p.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '26px' } }, L.e), h('h2', { style: { margin: 0, flex: 1 } }, L.t), Object.assign(go('play-' + id), { textContent: 'Open full screen' })), h('p', { class: 'small muted' }, L.b), el, h('details', { class: 'small', style: { marginTop: '8px' } }, h('summary', null, 'Where this comes from and why it matters'), h('p', null, L.how), h('p', null, L.use)))); L.m(el, K); });
  if (X.tools) p.append(card(h('h2', { style: { marginTop: 0 } }, '🧰 Tools from other disciplines'), h('p', { class: 'small' }, U.labsToolsIntro), h('div', { class: 'grid g2' }, X.tools.map(([e, t, d, txt, hs]) => sub(h('b', null, e + ' ' + t), h('div', { class: 'tiny muted' }, discName(d)), h('p', { class: 'small' }, txt), h('a', { href: '#' + hs, class: 'small' }, 'Related lab or page →'))))));
};

R.debates = (p, nav, arg, D) => D.data.debates.forEach((d) => p.append(card(h('h3', { style: { marginTop: 0 } }, '🗣️ ' + d.q), h('div', { class: 'grid g3' }, d.sides.map(([w, t], i) => h('div', { class: 'card', style: { boxShadow: 'none', borderTop: `4px solid ${['#DC2626', '#2563EB', '#7C3AED'][i]}` } }, h('b', null, w), h('p', { class: 'small' }, t)))), h('p', { class: 'small' }, h('b', null, '📊 Evidence to weigh: '), d.evidence), h('button', { class: 'btn sm', onclick: () => Lab.ask(fill(D.ui.debateAsk, { q: d.q }), d.q) }, '✦ Argue it out with the tutor'))));

R.claims = (p, nav, arg, D) => {
  const X = D.data;
  let i = 0, score = 0; const box = h('div'); const opts = ['True', 'False', 'Misleading', 'Contested'];
  const draw = () => { box.innerHTML = ''; if (i >= X.claims.length) { box.append(h('div', { class: 'kpi' }, `${score} / ${X.claims.length}`), h('button', { class: 'btn sm', onclick: () => { i = 0; score = 0; draw(); } }, 'Again')); return; }
    const [c, v, ex] = X.claims[i]; const fb = h('div');
    box.append(h('div', { class: 'tiny muted' }, `Claim ${i + 1} of ${X.claims.length}`), h('p', { style: { fontWeight: 600, fontSize: '17px' } }, '“' + c + '”'), h('div', { class: 'row', style: { gap: '6px' } }, opts.map((o) => h('button', { class: 'btn sm', onclick: () => { if (fb.childNodes.length) return; if (o === v) score++; fb.append(h('p', { class: 'small' }, h('span', { class: 'tag', style: { '--c': vcol(v) } }, v), ' ', o === v ? '✅ Right. ' : '❌ Not quite. ', ex), h('button', { class: 'btn sm primary', onclick: () => { i++; draw(); } }, 'Next →')); } }, o))), fb); };
  p.append(card(h('h2', { style: { marginTop: 0 } }, '🔎 Test the claims'), h('p', { class: 'small muted' }, D.ui.claimsIntro), box)); draw();
};

R.reading = (p, nav, arg, D) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, '📚 Reading room'), h('p', { class: 'small' }, D.ui.readingIntro), h('div', { class: 'row', style: { gap: '6px' } }, (D.ui.readingLinks || []).map(btn))));
  D.data.reading.forEach(([t, items]) => p.append(card(h('h3', { style: { marginTop: 0 } }, t), items.map(link))));
};

// ---------- registry ----------
const ensureGroup = () => {
  if (!M.GROUPS) return null;
  let g = M.GROUPS.find((x) => x[1] === 'Deep dives');
  if (!g) { const ri = M.GROUPS.findIndex((x) => x[1] === 'Regions & power'); g = ['📚', 'Deep dives', ['dives']]; M.GROUPS.splice(ri >= 0 ? ri + 1 : 2, 0, g); }
  return g;
};

Lab.deepdive = {
  R,
  register(id, cfg) {
    const D = Object.assign({ id, custom: {}, ui: {}, side: {}, labs: [], host: 'history' }, cfg);
    D.base = D.host === 'disc' ? 'd-' + D.disc + '-deep' : 'history-modern-' + id;
    if (D.host === 'history') {
      if (D.inCompare !== false) Lab.DEEPDIVES[id] = D;
      if (!M.SUBS.some(([k]) => k === id)) M.SUBS.push([id, D.tab]);
      M.GROUPS && M.GROUPS.forEach((g) => { if (g[1] !== 'Deep dives') g[2] = g[2].filter((k) => k !== id); });
      const g = ensureGroup(); if (g && !g[2].includes(id)) g[2].push(id);
    }
    const mount = (el, arg) => {
      const panel = h('div', { class: 'stack' }); const nav = h('div', { class: 'row dive-chips', style: { gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'thin', paddingBottom: '2px' } });
      const show = (k, a) => { if (R._stop) { R._stop(); R._stop = null; } nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; history.replaceState(null, '', '#' + D.base + (k === 'start' ? '' : '-' + (a || k))); (D.custom[k] || R[k])(panel, show, a, D); };
      D.sections.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, style: { flex: 'none', whiteSpace: 'nowrap' }, onclick: () => { show(k); const c = nav.querySelector(`[data-k="${k}"]`); if (c) c.scrollIntoView({ block: 'nearest', inline: 'center' }); } }, n)));
      const X = D.data; const lede = D.lede || (X.intro && X.intro[0] ? X.intro[0].split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.') : '');
      const facts = [[D.sections.length, 'sections'], [X.cases ? Object.keys(X.cases).length : 0, D.caseLabel || 'country cases'], [X.debates ? X.debates.length : 0, 'debates'], [X.reading ? X.reading.reduce((a, [, it]) => a + it.length, 0) : 0, 'sources and books'], [(D.labs || []).length, 'labs']].filter(([n]) => n);
      const hero = h('div', { class: 'card dive-hero', style: { borderTop: `6px solid ${D.color}`, padding: '22px 24px' } },
        h('div', { class: 'tiny', style: { letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, color: D.color } }, 'Deep dive · ' + (D.years || '')),
        h('h1', { style: { margin: '6px 0 8px', fontSize: 'clamp(30px,4.4vw,44px)', lineHeight: 1.1 } }, D.title),
        h('p', { style: { fontSize: '17px', lineHeight: 1.55, maxWidth: '760px', margin: '0 0 14px' } }, lede),
        h('div', { class: 'row', style: { gap: '22px', flexWrap: 'wrap' } }, facts.map(([n, l]) => h('div', null, h('div', { style: { fontFamily: 'var(--serif, Georgia, serif)', fontSize: '26px', fontWeight: 700, lineHeight: 1 } }, String(n)), h('div', { class: 'tiny muted' }, l)))));
      const navCard = h('div', { class: 'card dive-nav', style: { position: 'sticky', top: D.host === 'disc' ? '116px' : '58px', zIndex: 6, padding: '8px 10px' } }, nav);
      el.append(hero, navCard, panel);
      let a = (arg || '').split('-')[0]; if (a === 'locker') a = 'evidence';
      if (D.data.cases && D.data.cases[a]) show('cases', a); else show(D.sections.some(([k]) => k === a) ? a : 'start');
    };
    if (D.host === 'disc') { Lab.DISCDIVES = Lab.DISCDIVES || {}; Lab.DISCDIVES[D.disc] = { D, mount }; } else M.render[id] = mount;
    if (Lab.TABSKILLS && D.skills) Lab.TABSKILLS[id] = D.skills;
    return D;
  },
};

// ---------- "Ideologies side by side" ----------
if (!M.SUBS.some(([k]) => k === 'dives')) M.SUBS.push(['dives', 'Ideologies side by side']);
ensureGroup();
M.render.dives = (el) => {
  const dives = Object.values(Lab.DEEPDIVES);
  let only = 'all';
  const table = h('div');
  const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const draw = () => {
    chips.innerHTML = ''; table.innerHTML = '';
    [['all', 'All questions'], ...Lab.DIVE_HEADINGS].forEach(([k, n]) => chips.append(h('span', { class: 'chip' + (k === only ? ' on' : ''), onclick: () => { only = k; draw(); } }, n)));
    const rows = Lab.DIVE_HEADINGS.filter(([k]) => only === 'all' || k === only);
    const more = (D, s) => (s[1] ? h('a', { href: '#history-modern-' + D.id + '-' + s[1], class: 'tiny', style: { display: 'inline-block', marginTop: '4px' } }, 'The evidence in the deep dive →') : null);
    if (window.innerWidth < 700) { // phones: one question at a time, stacked
      rows.forEach(([k, n]) => table.append(h('div', { style: { padding: '8px 0', borderBottom: '1px solid var(--line)' } }, h('h4', { style: { margin: '0 0 6px' } }, n),
        ...dives.map((D) => { const s = D.side[k]; return h('div', { class: 'small', style: { borderLeft: `4px solid ${D.color || 'var(--accent)'}`, paddingLeft: '10px', margin: '6px 0' } }, h('b', null, h('a', { href: '#history-modern-' + D.id }, (D.emoji ? D.emoji + ' ' : '') + D.title)), s ? [h('div', null, s[0]), more(D, s)] : h('div', { class: 'muted' }, 'Not written yet')); }))));
      return;
    }
    const th = { textAlign: 'left', padding: '8px', borderBottom: '2px solid var(--line)', verticalAlign: 'bottom' };
    table.append(h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', width: '100%', minWidth: Math.max(320, 140 + dives.length * 280) + 'px' } },
      h('thead', null, h('tr', null, h('th', { style: Object.assign({ width: '140px' }, th) }, 'Question'), ...dives.map((D) => h('th', { style: Object.assign({ borderTop: `4px solid ${D.color || 'var(--accent)'}` }, th) }, h('a', { href: '#history-modern-' + D.id }, (D.emoji ? D.emoji + ' ' : '') + D.title), h('div', { class: 'tiny muted', style: { fontWeight: 400 } }, D.years || ''))))),
      h('tbody', null, rows.map(([k, n]) => h('tr', null, h('th', { scope: 'row', style: { textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--line)', verticalAlign: 'top' } }, n),
        ...dives.map((D) => { const s = D.side[k]; return h('td', { style: { padding: '8px', borderBottom: '1px solid var(--line)', verticalAlign: 'top' } }, s ? [h('div', null, s[0]), more(D, s)] : h('span', { class: 'muted' }, 'Not written yet')); })))))));
  };
  el.append(
    card(h('h2', { style: { marginTop: 0 } }, 'Ideologies side by side'),
      h('p', null, 'Every deep dive in the Lab answers the same eight questions, in the same order, to the same standard. That lets you put one ideology next to another and compare like with like: the ideas, who believed them, what they promised, what happened when people tried them, and what was gained and lost.'),
      h('p', { class: 'small' }, 'Each answer here is a short summary. Follow the link under it to the full evidence, with sources, estimate ranges and the strongest case from each side. Nothing on this page tells you which ideology is right: that is for you to decide.'),
      h('div', { class: 'grid g3' }, [['Same questions', 'Every ideology is asked the same eight questions. None gets an easier test.'], ['Same yardstick', 'Deaths, famines and repression are counted the same way whoever caused them, and gains are measured with the same data.'], ['Their words, then their critics', 'Each side is described as its own supporters would put it, then its critics get the same space.']].map(([t, d]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, t), h('div', { class: 'small muted' }, d))))),
    card(h('h3', { style: { marginTop: 0 } }, 'Compare one question at a time'), chips, h('div', { style: { marginTop: '10px' } }, table)),
    card(h('h3', { style: { marginTop: 0 } }, 'Deep dives on the way'), h('p', { class: 'small muted' }, 'Each will get the same eight answers when it is finished. Until then, the Ideologies tab has a short overview of each tradition.'),
      h('div', { class: 'stack', style: { gap: '0' } }, Lab.DIVES_PLANNED.filter(([t]) => !dives.some((D) => D.title === t)).map(([t, st, ov]) => h('div', { class: 'row', style: { padding: '7px 0', borderBottom: '1px solid var(--line)', gap: '8px' } }, h('b', { class: 'small', style: { flex: 1 } }, t), h('span', { class: 'tag', style: { '--c': st === 'Planned' ? '#475569' : '#B45309' } }, st), ov ? h('a', { class: 'small', href: '#history-modern-ideologies-' + ov }, 'Short overview: ' + ((M.ideologies || []).find((x) => x.id === ov) || { short: 'open' }).short + ' →') : null)))),
    card(h('h3', { style: { marginTop: 0 } }, 'Connections to other disciplines'), h('p', { class: 'small' }, 'Comparing ideologies draws on economics (what produces wealth and who gets it), political science (how power is held and checked), philosophy and ethics (what a good society is), history (what actually happened) and statistics (how to count fairly).'),
      h('div', { class: 'row', style: { gap: '6px' } }, [['d-economics', '💰 Economics'], ['d-politics', '🏛️ Politics'], ['d-philosophy', '🤔 Philosophy'], ['d-ethics', '⚖️ Ethics'], ['d-history', '📜 History'], ['d-statistics', '📊 Statistics'], ['history-modern-ideologies', '💡 Short overviews of every ideology'], ['history-modern-ledger', '📒 The ledger: all systems’ death tolls']].map(btn))));
  draw();
};
if (Lab.TABSKILLS) Lab.TABSKILLS.dives = [['estimate', 'Death tolls and growth rates are estimates; compare the ranges, not one number.'], ['sources', 'Supporters, critics and historians each see different things.'], ['fallacy', 'Watch for comparing one side’s best case with the other side’s worst.']];
