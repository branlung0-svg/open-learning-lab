// Modern world module: the Marxism–Leninism deep dive. Theory, the party-state machine, eight case studies,
// evidence, labs, debates, claims and a reading room. Rendered by the deep-dive engine (deepdive.js);
// data and page text: marx-data.js; labs: arcade-marx.js. Only the Lenin section has its own renderer.
const h = Lab.h;
const M = Lab.MODERN;
const X = Lab.MARX;
const card = (...kids) => h('div', { class: 'card' }, ...kids);
const link = ([label, url]) => url ? h('a', { href: url, target: '_blank', rel: 'noopener', class: 'small', style: { display: 'block', margin: '4px 0' } }, '📄 ' + label + ' ↗') : h('div', { class: 'small', style: { margin: '4px 0' } }, '📚 ' + label);
const fig = (k, max) => (k && M.figure ? M.figure(k, { max: max || '320px' }) : null);

const lenin = (p) => {
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'Lenin: from theory to a party that takes power'), h('p', { class: 'small' }, X.ui.leninIntro), fig('ev:russia1917', '420px')));
  X.lenin.forEach(([e, t, d, txt, debate]) => p.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '24px' } }, e), h('h3', { style: { margin: 0 } }, t)), h('p', { class: 'small' }, d), h('p', { class: 'small', style: { padding: '8px', borderRadius: '8px', background: 'rgba(124,58,237,.1)' } }, h('b', null, 'The debate: '), debate), link(txt))));
};

Lab.deepdive.register('marxism', {
  tab: 'Marxism–Leninism deep dive',
  title: 'Marxism–Leninism',
  emoji: '🚩',
  color: '#B91C1C',
  years: 'Marx and Engels from the 1840s; Leninist states from 1917',
  data: X,
  labs: ['surplusvalue', 'planmarket'],
  sections: [['start', '🧭 Start'], ['ideas', '📖 Marx & Engels'], ['lenin', '🚩 Lenin'], ['tree', '🌳 Family tree'], ['machine', '🏛️ How a party-state works'], ['cases', '🌍 Case studies'], ['compare', '⚖️ Compare'], ['evidence', '📊 Evidence'], ['labs', '🧪 Labs & tools'], ['debates', '🗣️ Debates'], ['claims', '🔎 Claims'], ['reading', '📚 Reading room']],
  custom: { lenin },
  ui: X.ui,
  side: X.side,
  seeds: ['Paris Commune', 'October Revolution', 'Fall of the Berlin Wall'],
  // Toolkit chips for this tab.
  skills: [['estimate', 'Famine tolls are demographic estimates; read the ranges.'], ['incentives', 'Who appoints whom tells you who really rules.'], ['games', 'Purges and succession are strategic games.'], ['satellite', 'Check official growth claims from space.'], ['sources', 'Party histories, exiles and archives each see different things.'], ['inequality', 'Measure who gains: Gini, wage shares, privileges.']],
});
