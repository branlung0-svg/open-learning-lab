// Modern world module: the Marxism–Leninism deep dive. Theory, the party-state machine, eight case studies,
// evidence, labs, debates, claims and a reading room. Data: marx-data.js; labs: arcade-marx.js.
const h = Lab.h;
const M = Lab.MODERN;
const X = Lab.MARX;
if (!M.SUBS.some(([k]) => k === 'marxism')) M.SUBS.push(['marxism', 'Marxism–Leninism deep dive']);
M.GROUPS.forEach((g) => { g[2] = g[2].filter((k) => k !== 'marxism'); });
const ri = M.GROUPS.findIndex((g) => g[1] === 'Regions & power');
M.GROUPS.splice(ri >= 0 ? ri + 1 : 2, 0, ['🚩', 'Deep dives', ['marxism']]);

const card = (...kids) => h('div', { class: 'card' }, ...kids);
const sub = (...kids) => h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, ...kids);
const link = ([label, url]) => url ? h('a', { href: url, target: '_blank', rel: 'noopener', class: 'small', style: { display: 'block', margin: '4px 0' } }, '📄 ' + label + ' ↗') : h('div', { class: 'small', style: { margin: '4px 0' } }, '📚 ' + label);
const go = (hash) => h('a', { class: 'btn sm', href: '#' + hash, style: { textDecoration: 'none' } });
const CONF = { high: 'Established', medium: 'Strong', developing: 'Developing' };
const vcol = (v) => ({ True: '#15803D', False: '#DC2626', Misleading: '#EA580C', Contested: '#7C3AED', Hit: '#15803D', Miss: '#DC2626', 'Mostly miss': '#EA580C', 'Hit (but reformist)': '#0891B2' }[v] || '#475569');
const fig = (k, max) => (k && M.figure ? M.figure(k, { max: max || '320px' }) : null);

const SECTIONS = [['start', '🧭 Start'], ['ideas', '📖 Marx & Engels'], ['lenin', '🚩 Lenin'], ['tree', '🌳 Family tree'], ['machine', '🏛️ How a party-state works'], ['cases', '🌍 Case studies'], ['compare', '⚖️ Compare'], ['evidence', '📊 Evidence'], ['labs', '🧪 Labs & tools'], ['debates', '🗣️ Debates'], ['claims', '🔎 Claims'], ['reading', '📚 Reading room']];

const R = {};
R.start = (p, nav) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'Marxism–Leninism: the ideas, the states, the evidence'),
    h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null, X.intro.map((t) => h('p', { class: 'small' }, t))), h('div', { class: 'stack' }, fig('ml:manifesto', '260px'))),
    h('h3', null, 'How to study this fairly'), h('div', { class: 'grid g3' }, X.howto.map(([t, d]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, t), h('div', { class: 'small muted' }, d))))),
    card(h('h3', { style: { marginTop: 0 } }, 'A suggested path (about 6–10 hours, spread out)'),
      h('ol', { class: 'small' }, [['ideas', 'Read the 12 core ideas, then the Manifesto (about an hour).'], ['labs', 'Run the surplus value machine and plan vs market labs.'], ['lenin', 'See how Lenin turned theory into a party, and what he warned about at the end.'], ['tree', 'Meet the branches: social democrats, Trotskyists, Maoists, Juche, market socialism.'], ['machine', 'Learn the party-state machine: once you know it, you can read China, Vietnam or Cuba news.'], ['cases', 'Work through the eight case studies, China first.'], ['evidence', 'Weigh achievements and costs with the same yardstick.'], ['debates', 'Argue every side of five live debates, then test yourself on the claims.']].map(([k, t]) => h('li', { style: { margin: '4px 0' } }, h('a', { href: '#history-modern-marxism-' + k, onclick: (e) => { e.preventDefault(); nav(k); } }, SECTIONS.find((s) => s[0] === k)[1]), ' · ', t))),
      h('div', { class: 'row', style: { gap: '6px' } }, Object.assign(go('history-modern-ideologies'), { textContent: '💡 All ideologies compared' }), Object.assign(go('history-modern-anatomy'), { textContent: '🫀 Anatomy of power (all nations)' }), Object.assign(go('history-modern-power'), { textContent: '🏛️ Who really rules?' }), Object.assign(go('d-economics'), { textContent: '💰 Economics' }), Object.assign(go('d-philosophy'), { textContent: '🤔 Philosophy' }))));
};

R.ideas = (p) => {
  let i = 0; const box = h('div');
  const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const draw = () => { chips.innerHTML = ''; X.ideas.forEach((x, j) => chips.append(h('span', { class: 'chip' + (j === i ? ' on' : ''), onclick: () => { i = j; draw(); } }, x[1] + ' ' + x[2].split(' (')[0])));
    const [id, e, n, plain, ex, txt, test, pro, con] = X.ideas[i]; box.innerHTML = '';
    box.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, e), h('h2', { style: { margin: 0, flex: 1 } }, n), h('span', { class: 'tiny muted' }, `${i + 1} / ${X.ideas.length}`)),
      h('p', null, plain), h('p', { class: 'small' }, h('b', null, 'Example: '), ex),
      id === 'ltv' || id === 'crisis' ? h('div', { class: 'row', style: { gap: '6px' } }, Object.assign(go('play-surplusvalue'), { textContent: '⚒️ Try it: surplus value machine' })) : null,
      id === 'dotp' ? fig('ev:commune', '360px') : id === 'ltv' ? fig('sci:marx', '220px') : null,
      h('div', { class: 'grid g3', style: { marginTop: '8px' } }, sub(h('b', null, '🧪 Does it hold up?'), h('p', { class: 'small' }, test)), sub(h('b', { style: { color: '#15803D' } }, '👍 Why defenders value it'), h('p', { class: 'small' }, pro)), sub(h('b', { style: { color: '#DC2626' } }, '👎 What critics say'), h('p', { class: 'small' }, con))),
      h('div', { style: { marginTop: '8px' } }, link(txt)),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Previous'), h('button', { class: 'btn sm primary', disabled: i === X.ideas.length - 1, onclick: () => { i++; draw(); } }, 'Next idea →'), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain Marx’s idea of “${n}” to me with a modern example, then give the strongest case for it, the strongest case against it, and what the evidence says. Quote the original text briefly and cite sources from Marxist and non-Marxist scholars.`, n) }, '✦ Discuss with the tutor')))); };
  p.append(card(chips), box); draw();
};

R.lenin = (p) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'Lenin: from theory to a party that takes power'), h('p', { class: 'small' }, 'Marx wrote little about how to organize a revolution or run a socialist state. Lenin (1870–1924) filled the gap with a theory of the party, of imperialism and of the state, and then had to govern a ruined country in civil war. Most of what people mean by “communist states” comes from his choices between 1902 and 1923.'), fig('ev:russia1917', '420px')));
  X.lenin.forEach(([e, t, d, txt, debate]) => p.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '24px' } }, e), h('h3', { style: { margin: 0 } }, t)), h('p', { class: 'small' }, d), h('p', { class: 'small', style: { padding: '8px', borderRadius: '8px', background: 'rgba(124,58,237,.1)' } }, h('b', null, 'The debate: '), debate), link(txt))));
};

R.tree = (p) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'The family tree: one Marx, many Marxisms'), h('p', { class: 'small' }, 'After Marx died (1883), his followers split over two questions: reform or revolution, and who leads (the class, the party or the leader). Tap a branch.')));
  const wrap = h('div', { class: 'stack' });
  X.tree.forEach(([id, n, yrs, c, claim, people, where, verdict, txt]) => { const body = h('div', { style: { display: 'none' } }, h('p', { class: 'small' }, h('b', null, 'Core claim: '), claim), h('p', { class: 'small' }, h('b', null, 'Key people: '), people), h('p', { class: 'small' }, h('b', null, 'Where: '), where), h('p', { class: 'small' }, h('b', null, 'Track record: '), verdict), link(txt));
    wrap.append(h('div', { class: 'card', style: { borderLeft: `6px solid ${c}`, cursor: 'pointer' }, onclick: () => { body.style.display = body.style.display === 'none' ? 'block' : 'none'; } }, h('div', { class: 'row' }, h('b', null, n), h('span', { class: 'tiny muted' }, yrs), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, 'tap ▾')), body)); });
  p.append(wrap);
};

R.machine = (p) => {
  let cur = X.machine[0]; const detail = h('div');
  const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '6px' } });
  const draw = () => { grid.innerHTML = ''; X.machine.forEach((m) => grid.append(h('button', { class: 'btn', style: { textAlign: 'left', padding: '7px 9px', display: 'flex', gap: '6px', alignItems: 'center', border: m === cur ? '2px solid var(--accent)' : '1px solid var(--line)' }, onclick: () => { cur = m; draw(); detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }, h('span', { style: { fontSize: '18px' } }, m[1]), h('span', { class: 'tiny', style: { fontWeight: 700, lineHeight: 1.25 } }, m[2]))));
    const [, e, n, formal, real, ex] = cur; detail.innerHTML = '';
    detail.append(card(h('h3', { style: { marginTop: 0 } }, e + ' ' + n), h('div', { class: 'grid g2' }, sub(h('b', null, '📜 On paper'), h('p', { class: 'small' }, formal)), sub(h('b', null, '🔦 In reality'), h('p', { class: 'small' }, real))), h('p', { class: 'small' }, h('b', null, 'Examples: '), ex), cur[0] === 'plan' ? fig('ml:gosplan', '300px') : null)); };
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'How a Leninist party-state works'), h('p', { class: 'small' }, 'Every communist-ruled state built roughly the same machine: a party that sits above and inside the state, the army and society. The key rule is the nomenklatura: the party appoints people to every important job. Learn these twelve parts and you can read news from Beijing, Hanoi, Havana or Pyongyang. Tap a part.'),
    h('div', { class: 'small', style: { padding: '10px', borderRadius: '10px', background: 'var(--card2)', margin: '8px 0', lineHeight: 1.7 } }, h('b', null, 'Chain of command (formal → real): '), 'Party Congress → Central Committee → Politburo → Standing Committee → ', h('b', null, 'General Secretary'), '. In practice the arrows also run backwards: the leader and the Organization Department pick who sits in the bodies that “elect” them.'), grid), detail);
  draw();
  const KEPT = [['No', '#DC2626'], ['Partly', '#EA580C'], ['Yes', '#15803D']];
  p.append(card(h('h3', { style: { marginTop: 0 } }, 'Theory vs practice: the founders’ promises'), h('div', { class: 'stack', style: { gap: '0' } }, X.gap.map(([a, b, c, s]) => h('div', { style: { padding: '8px 0', borderBottom: '1px solid var(--line)' } }, h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '8px', alignItems: 'flex-start' } }, h('span', { class: 'tag', style: { '--c': KEPT[s][1], flex: 'none', minWidth: '54px', textAlign: 'center' } }, KEPT[s][0]), h('div', null, h('b', { class: 'small' }, a), h('div', { class: 'tiny muted' }, 'Promise from: ' + b), h('div', { class: 'small' }, c)))))), h('p', { class: 'small', style: { marginTop: '8px' } }, X.gapNote)));
  p.append(card(h('h3', { style: { marginTop: 0 } }, 'Why does it always end up this way? Tools from other disciplines'), h('div', { class: 'grid g2' }, X.tools.slice(3, 7).map(([e, t, d, txt, hs]) => sub(h('b', null, e + ' ' + t), h('div', { class: 'tiny muted' }, Lab.DISC && Lab.DISC.find((x) => x.id === d) ? Lab.DISC.find((x) => x.id === d).name : d), h('p', { class: 'small' }, txt), h('a', { href: '#' + hs, class: 'small' }, 'Open the related lab or page →'))))));
};

R.cases = (p, nav, arg) => {
  let key = X.cases[arg] ? arg : 'china'; const box = h('div'); const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const draw = () => { chips.innerHTML = ''; X.caseOrder.forEach((k) => chips.append(h('span', { class: 'chip' + (k === key ? ' on' : ''), onclick: () => { key = k; history.replaceState(null, '', '#history-modern-marxism-' + k); draw(); } }, X.cases[k].flag + ' ' + X.cases[k].n)));
    const c = X.cases[key]; box.innerHTML = ''; let per = 'all';
    const tl = h('div');
    const drawTl = () => { tl.innerHTML = ''; c.tl.forEach(([y, t, cf]) => tl.append(h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-start', padding: '7px 4px', borderBottom: '1px solid var(--line)' } }, h('b', { class: 'small', style: { width: '74px', flex: 'none' } }, y), h('span', { class: 'small', style: { flex: 1 } }, t), Lab.conf(CONF[cf] || cf)))); };
    drawTl();
    box.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, c.flag), h('h2', { style: { margin: 0 } }, c.n), h('span', { class: 'tag', style: { '--c': '#475569' } }, c.years)), h('p', null, c.sum),
      h('div', { class: 'grid g2' }, fig(c.img, '360px'), fig(c.img2, '360px'))),
      card(h('h3', { style: { marginTop: 0 } }, '📅 Timeline'), tl),
      card(h('h3', { style: { marginTop: 0 } }, '🏛️ Who holds power'), h('p', { class: 'small' }, c.power), h('div', { class: 'row', style: { gap: '6px' } }, Object.assign(go('history-modern-marxism-machine'), { textContent: '🏛️ The party-state machine' }), key === 'dprk' || key === 'vietnam' ? Object.assign(go('history-modern-power'), { textContent: 'More in “Who really rules?”' }) : null, key === 'china' ? Object.assign(go('history-modern-anatomy'), { textContent: '🫀 China in Anatomy of power' }) : null, key === 'dprk' ? Object.assign(go('history-modern-koreawar'), { textContent: '🇰🇷 The Korean War' }) : null, key === 'burkina' ? Object.assign(go('history-modern-africa'), { textContent: '🌍 Africa in depth' }) : null, key === 'cuba' ? Object.assign(go('history-modern-americas'), { textContent: '🌎 The Americas in depth' }) : null)),
      h('div', { class: 'grid g2' }, card(h('h3', { style: { marginTop: 0, color: '#15803D' } }, '📈 Achievements'), h('ul', { class: 'small' }, c.gains.map((g) => h('li', { style: { margin: '4px 0' } }, g)))), card(h('h3', { style: { marginTop: 0, color: '#DC2626' } }, '📉 Costs'), h('ul', { class: 'small' }, c.costs.map((g) => h('li', { style: { margin: '4px 0' } }, g))))),
      card(h('h3', { style: { marginTop: 0 } }, '🗣️ How each side tells it'), h('div', { class: 'grid g2' }, c.tellings.map(([w, v, m]) => sub(h('b', null, w), h('p', { class: 'small', style: { margin: '4px 0' } }, v), h('p', { class: 'tiny', style: { color: '#B45309', margin: 0 } }, h('b', null, 'Leaves out: '), m))))),
      card(h('h3', { style: { marginTop: 0 } }, '🔴 Now'), h('p', { class: 'small' }, c.now), Lab.source(c.src),
        h('button', { class: 'btn sm primary', style: { marginTop: '8px' }, onclick: () => Lab.ask(`Give me a deep, balanced study session on ${c.n} under communist rule: how the party took and held power, how its power structure works, its economic record with data, the human costs with estimate ranges, and how the party, its critics and independent historians each tell the story. Mark anything from 2025–2026 as developing and cite sources.`, c.n) }, '✦ Go deeper with the tutor'))); };
  p.append(card(chips), box); draw();
};

R.compare = (p) => p.append(card(h('h2', { style: { marginTop: 0 } }, 'Same questions, nine regimes'), h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', minWidth: '980px' } }, h('tr', null, h('th', { style: { textAlign: 'left', padding: '6px' } }, 'Question'), ...X.compareCols.map((c) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, c))), X.compare.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', verticalAlign: 'top', fontWeight: j ? 400 : 600, background: j && /^No\b/.test(c) ? 'rgba(220,38,38,.13)' : j && /^Yes/.test(c) ? 'rgba(22,163,74,.13)' : '' } }, c)))))), h('p', { class: 'small', style: { marginTop: '8px' } }, X.compareNote)));

R.evidence = (p) => {
  const tbl = (head, rows) => h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', minWidth: '640px', width: '100%' } }, h('tr', null, ...head.map((t) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, t))), rows.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', verticalAlign: 'top', fontWeight: j === 1 ? 700 : j ? 400 : 600 } }, c))))));
  p.append(card(h('h2', { style: { marginTop: 0 } }, '📈 Gains, with the same scrutiny'), tbl(['Measure', 'Change', 'Source', 'Caveat'], X.gains), h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, Object.assign(go('economy-divergence'), { textContent: '📊 North vs South Korea chart' }), Object.assign(go('connect-lights'), { textContent: '🛰️ Checking official GDP from space' }))),
    card(h('h2', { style: { marginTop: 0 } }, '📉 Famines and political killings: estimates with ranges'), fig('ml:furnace', '320px'), tbl(['Event', 'Estimate', 'Main sources', 'Notes'], X.tolls), h('p', { class: 'small', style: { marginTop: '8px' } }, X.tollsNote), h('div', { class: 'row', style: { gap: '6px' } }, Object.assign(go('history-modern-ledger'), { textContent: '📒 The ledger: all systems’ death tolls' }))),
    card(h('h2', { style: { marginTop: 0 } }, '🎯 Marx’s predictions: a scorecard'), h('div', { class: 'stack', style: { gap: '6px' } }, X.predictions.map(([c, v, n]) => h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-start' } }, h('span', { class: 'tag', style: { '--c': vcol(v), flex: 'none', minWidth: '84px', textAlign: 'center' } }, v), h('div', null, h('b', { class: 'small' }, c), h('div', { class: 'small muted' }, n)))))));
};

R.labs = (p) => {
  const K = Lab.ARC.kit(); R._stop = () => K.stop();
  ['surplusvalue', 'planmarket'].forEach((id) => { const L = Lab.ARC.by[id]; if (!L) return; const el = h('div'); p.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '26px' } }, L.e), h('h2', { style: { margin: 0, flex: 1 } }, L.t), Object.assign(go('play-' + id), { textContent: 'Open full screen' })), h('p', { class: 'small muted' }, L.b), el, h('details', { class: 'small', style: { marginTop: '8px' } }, h('summary', null, 'Where this comes from and why it matters'), h('p', null, L.how), h('p', null, L.use)))); L.m(el, K); });
  p.append(card(h('h2', { style: { marginTop: 0 } }, '🧰 Tools from other disciplines'), h('p', { class: 'small' }, 'Communist systems are a superb place to practice ideas from statistics, game theory, economics and sociology, and those same ideas apply to companies, democracies and your own life.'), h('div', { class: 'grid g2' }, X.tools.map(([e, t, d, txt, hs]) => sub(h('b', null, e + ' ' + t), h('div', { class: 'tiny muted' }, (Lab.DISC || []).find((x) => x.id === d)?.name || d), h('p', { class: 'small' }, txt), h('a', { href: '#' + hs, class: 'small' }, 'Related lab or page →'))))));
};

R.debates = (p) => X.debates.forEach((d) => p.append(card(h('h3', { style: { marginTop: 0 } }, '🗣️ ' + d.q), h('div', { class: 'grid g3' }, d.sides.map(([w, t], i) => h('div', { class: 'card', style: { boxShadow: 'none', borderTop: `4px solid ${['#DC2626', '#2563EB', '#7C3AED'][i]}` } }, h('b', null, w), h('p', { class: 'small' }, t)))), h('p', { class: 'small' }, h('b', null, '📊 Evidence to weigh: '), d.evidence), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Debate with me: ${d.q} Take the side I disagree with after I tell you my view, use real evidence and sources from each side, and point out weak spots in my reasoning.`, d.q) }, '✦ Argue it out with the tutor'))));

R.claims = (p) => {
  let i = 0, score = 0; const box = h('div'); const opts = ['True', 'False', 'Misleading', 'Contested'];
  const draw = () => { box.innerHTML = ''; if (i >= X.claims.length) { box.append(h('div', { class: 'kpi' }, `${score} / ${X.claims.length}`), h('button', { class: 'btn sm', onclick: () => { i = 0; score = 0; draw(); } }, 'Again')); return; }
    const [c, v, ex] = X.claims[i]; const fb = h('div');
    box.append(h('div', { class: 'tiny muted' }, `Claim ${i + 1} of ${X.claims.length}`), h('p', { style: { fontWeight: 600, fontSize: '17px' } }, '“' + c + '”'), h('div', { class: 'row', style: { gap: '6px' } }, opts.map((o) => h('button', { class: 'btn sm', onclick: () => { if (fb.childNodes.length) return; if (o === v) score++; fb.append(h('p', { class: 'small' }, h('span', { class: 'tag', style: { '--c': vcol(v) } }, v), ' ', o === v ? '✅ Right. ' : '❌ Not quite. ', ex), h('button', { class: 'btn sm primary', onclick: () => { i++; draw(); } }, 'Next →')); } }, o))), fb); };
  p.append(card(h('h2', { style: { marginTop: 0 } }, '🔎 Test the claims'), h('p', { class: 'small muted' }, 'Claims you will meet online and in books, from supporters and opponents.'), box)); draw();
};

R.reading = (p) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, '📚 Reading room'), h('p', { class: 'small' }, 'Primary texts link to the Marxists Internet Archive, a free volunteer library (it is sympathetic to Marxism, but the texts are the originals). Critics and scholars are listed alongside, because you should read both. Books without links are in most libraries.'), h('div', { class: 'row', style: { gap: '6px' } }, Object.assign(go('reading-library-manifesto'), { textContent: '📖 Read the Manifesto in the Lab’s reader' }))));
  X.reading.forEach(([t, items]) => p.append(card(h('h3', { style: { marginTop: 0 } }, t), items.map(link))));
};

M.render.marxism = (el, arg) => {
  const panel = h('div', { class: 'stack' }); const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const show = (k, a) => { if (R._stop) { R._stop(); R._stop = null; } nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; history.replaceState(null, '', '#history-modern-marxism' + (k === 'start' ? '' : '-' + (a || k))); R[k](panel, show, a); };
  SECTIONS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, onclick: () => show(k) }, n)));
  el.append(card(nav), panel);
  const a = (arg || '').split('-')[0];
  if (X.cases[a]) show('cases', a); else show(SECTIONS.some(([k]) => k === a) ? a : 'start');
};

// Toolkit chips for this tab, and a learning path on the home hub.
if (Lab.TABSKILLS) Lab.TABSKILLS.marxism = [['estimate', 'Famine tolls are demographic estimates; read the ranges.'], ['incentives', 'Who appoints whom tells you who really rules.'], ['games', 'Purges and succession are strategic games.'], ['satellite', 'Check official growth claims from space.'], ['sources', 'Party histories, exiles and archives each see different things.'], ['inequality', 'Measure who gains: Gini, wage shares, privileges.']];
