// Fascism and Nazism deep dive: registered with the deep-dive engine (deepdive.js). Data and page text: fascism-data.js.
// Custom sections: the sourced timeline (data/claims/fascism.json), resistance and collaboration, the words, and denial.
const h = Lab.h;
const X = Lab.FAS;
const card = (...kids) => h('div', { class: 'card' }, ...kids);
const timeline = (p) => {
  const box = h('div', { class: 'loading' }, 'Loading sourced timeline…');
  p.append(card(h('h2', { style: { marginTop: 0 } }, 'Timeline: 1914 to today'), h('p', { class: 'small' }, 'Every event has sources you can open and a confidence label. “Checked” means a separate AI fact-checker confirmed the sources support it; “Sources linked” means that check has not happened yet. No human expert has reviewed these yet. Descriptions of crimes are factual and not graphic.'), box));
  Lab.claims('fascism').then((C) => { box.className = ''; box.innerHTML = ''; if (!C) { box.textContent = 'The timeline could not be loaded.'; return; }
    box.append(Lab.claimsTimeline({ c: '#7F1D1D' }, C)); const ppl = Lab.claimsPeople(C); if (ppl) p.append(card(ppl)); });
};
const list = (title, intro, rows) => card(h('h2', { style: { marginTop: 0 } }, title), intro ? h('p', { class: 'small' }, intro) : null,
  h('div', { class: 'stack' }, rows.map(([t, d]) => h('div', { style: { borderLeft: '3px solid var(--line)', padding: '4px 0 4px 12px', margin: '8px 0' } }, h('b', null, t), h('p', { class: 'small', style: { margin: '4px 0 0' } }, d)))));
const resist = (p) => p.append(list('Resistance, rescue and collaboration', 'Fascism was not inevitable, and people had choices. Some resisted or rescued at great risk; many went along; some helped the killers. All of it is part of the record.', X.resist),
  card(h('p', { class: 'small', style: { margin: 0 } }, 'See the people in the Timeline & people section: Sophie Scholl, Claus von Stauffenberg, Witold Pilecki, Irena Sendler, Raoul Wallenberg, Chiune Sugihara, Emanuel Ringelblum, Primo Levi, Anne Frank and Raphael Lemkin, with sources.')));
const words = (p) => p.append(list('The words they used, and what they hid', 'Regimes that commit crimes invent soft words for them. Knowing the real meaning is part of understanding the history.', X.words));
const denial = (p) => p.append(card(h('h2', { style: { marginTop: 0 } }, 'Holocaust denial is not a side'), ...X.denial.map((t) => h('p', null, t)),
  Lab.source('Sources: <a href="https://encyclopedia.ushmm.org/content/en/article/holocaust-deniers-and-public-misinformation" target="_blank" rel="noopener">USHMM, Holocaust denial</a>; <a href="https://www.hdot.org/" target="_blank" rel="noopener">Holocaust Denial on Trial (Emory University)</a>.')));
Lab.deepdive.register('fascism', {
  tab: 'Fascism deep dive',
  title: 'Fascism',
  emoji: '⚫',
  color: '#7F1D1D',
  years: '1919–1945, and its legacy',
  data: X, claimsId: 'fascism',
  labs: ['reichstag', 'confint', 'sourcedetective'],
  sections: [['start', 'Start'], ['ideas', 'Big ideas'], ['tree', 'Family tree'], ['machine', 'How it worked'], ['cases', 'Case studies'], ['gallery', 'Pictures & film'], ['timeline', 'Timeline & people'], ['compare', 'Compare'], ['evidence', 'Evidence'], ['resist', 'Resistance & collaboration'], ['labs', 'Labs & tools'], ['debates', 'Debates'], ['words', 'The words'], ['denial', 'Denial is not a side'], ['claims', 'Test the claims'], ['reading', 'Reading room']],
  custom: { timeline, resist, words, denial },
  ui: X.ui,
  side: X.side,
  seeds: ['March on Rome', 'Reichstag fire', 'Nuremberg rally grounds', 'Warsaw Ghetto Uprising', 'Nuremberg trials', 'Carnation Revolution'],
  skills: [['estimate', 'Death tolls are estimates from records; compare ranges and methods, never treat a range as doubt about the crime.'], ['sources', 'Who made the document? Perpetrator records, survivor testimony and trials each show different things.'], ['incentives', 'Ask why elites handed power to men without majorities.'], ['fallacy', 'Watch for false balance: denial is not a viewpoint.']],
});
