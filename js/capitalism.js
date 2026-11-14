// Capitalism deep dive: registered with the deep-dive engine (deepdive.js). Data and page text: capitalism-data.js.
// The "timeline" section renders the independently checked claim file data/claims/capitalism.json.
const h = Lab.h;
const X = Lab.CAP;
const card = (...kids) => h('div', { class: 'card' }, ...kids);
const timeline = (p) => {
  const box = h('div', { class: 'loading' }, 'Loading sourced timeline…');
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'Timeline: 1494 to today'), h('p', { class: 'small' }, 'Every event below has a source you can open and a confidence label. “Checked” means a separate AI fact-checker confirmed the source supports it; “Sources linked” means it has not been independently confirmed yet. No human expert has reviewed these yet.'), box));
  Lab.claims('capitalism').then((C) => { box.className = ''; box.innerHTML = ''; if (!C) { box.textContent = 'The timeline could not be loaded.'; return; }
    box.append(Lab.claimsTimeline({ c: '#1F4E79' }, C)); const ppl = Lab.claimsPeople(C); if (ppl) p.append(card(ppl)); });
};
Lab.deepdive.register('capitalism', {
  tab: 'Capitalism deep dive',
  title: 'Capitalism',
  emoji: '🏭',
  color: '#1F4E79',
  years: 'From the 1500s; industrial capitalism from about 1760',
  data: X, claimsId: 'capitalism',
  labs: ['gdppower', 'lln', 'compound', 'sourcedetective'],
  sections: [['start', 'Start'], ['ideas', 'Big ideas'], ['tree', 'Family tree'], ['machine', 'How the machine works'], ['cases', 'Case studies'], ['gallery', 'Pictures & film'], ['timeline', 'Timeline & people'], ['compare', 'Compare'], ['evidence', 'Evidence'], ['labs', 'Labs & tools'], ['debates', 'Debates'], ['claims', 'Test the claims'], ['reading', 'Reading room']],
  custom: { timeline },
  ui: X.ui,
  side: X.side,
  seeds: ['Industrial Revolution', 'Great Depression', 'Financial crisis of 2007–2008', 'Lowell mills', 'Triangle Shirtwaist Factory fire'],
  skills: [['estimate', 'Poverty and death-toll figures are estimates; compare ranges and methods.'], ['incentives', 'Ask who gains and who pays in each case.'], ['sources', 'Supporters, critics and economic historians each see different things.'], ['fallacy', 'Do not compare one system’s best case with another’s worst.']],
});
