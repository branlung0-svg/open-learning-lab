// Hard truths: registered with the deep-dive engine (deepdive.js). Data: truths-data.js.
const h = Lab.h; const X = Lab.TRUTHS;
const voices = (p) => p.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'In their own words'), h('p', { class: 'small' }, 'The most important evidence comes from the people who lived through these events. These collections hold their testimony, letters, interviews and statements, free to read, watch or listen to. Some are harrowing.'),
  h('div', { class: 'stack' }, X.voices.map(([t, u]) => h('a', { href: u, target: '_blank', rel: 'noopener', class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', textDecoration: 'none', color: 'inherit', padding: '12px 14px' } }, h('b', { class: 'small' }, t + ' ↗'))))));
Lab.deepdive.register('truths', {
  tab: 'Hard truths: the people history broke', title: 'Hard truths', emoji: '🕯️', color: '#7C2D12', years: 'Slavery, empire, coups, companies and experiments', inCompare: false, caseLabel: 'stories',
  data: X, labs: ['sourcedetective', 'graphics'], ui: X.ui, side: X.side,
  sections: [['start', 'Start'], ['cases', 'Twelve stories'], ['voices', 'In their own words'], ['gallery', 'Pictures'], ['evidence', 'Evidence'], ['debates', 'Debates'], ['claims', 'Myth or fact'], ['reading', 'Reading']],
  custom: { voices },
  skills: [['sources', 'Testimony, perpetrators’ records and photographs each show different things.'], ['estimate', 'Tolls are ranges from records; a range never means doubt that it happened.']],
});
