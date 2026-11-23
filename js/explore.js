// One map of the whole Lab (#explore), an "Explore" button in the top bar, and an "Everything in the Lab" panel at the
// top of every subject page, so that all material on a subject is in one place. Links to pages that do not exist are
// dropped automatically.
(function () {
  const h = Lab.h;
  const has = (href) => { const r = href.replace(/^#/, '').split('-')[0]; return !!(Lab.routes && Lab.routes[r]); };
  const dive = (id) => { const D = (Lab.DIVES_ALL || {})[id]; return D ? ['#' + D.base, D.title, 'Deep dive: ideas, history, evidence, debates, reading'] : null; };
  const L = { mathpath: ['#mathpath', 'Math from the basics', '14 steps from counting to calculus, with practice and a formula builder'], origins: ['#origins', 'How we got here', 'Big Bang to today in 18 steps, with the evidence and who found it'],
    method: ['#method', 'The research standard', 'How the Lab weighs numbers, stories and sources'], verify: ['#verify', 'Claims under the microscope', 'Famous claims checked against the evidence, with verdicts and grades'],
    tolls: ['#tolls', 'Death tolls: what can be proven', 'The big totals for communism, colonialism and wars, sorted by the evidence behind each number'], toolkit: ['#toolkit', 'How lies are made, and how to catch them', 'Fake photos, videos, documents and witnesses; paid influence; who’s behind each source'],
    lies: ['#lies', 'Lies from every side', '53 documented lies and propaganda campaigns, and how each came out'], oppression: ['#oppression', 'Oppressors and the oppressed', 'Colonial rule, war, famine, apartheid, sanctions: who suffered and the evidence'],
    power: ['#power', 'How power really works', '12 systems: who rules, how people climb, money, war, checks'], parl: ['#parliaments', 'Parliaments and seats', 'Seat charts and who sits where'],
    govern: ['#history-modern-govern', 'Government diagrams', 'Who chooses whom, on paper and in practice'], rules: ['#history-modern-power', 'Who really rules?', 'Layers of power country by country'],
    inst: ['#institutions', 'World institutions and money', 'UN, IMF, World Bank, NATO, BRICS, WEF, ICC, lobbying, super PACs'], modern: ['#history-modern', 'The modern world 1700–2026', 'Timeline, ideologies compared, claims tested against data'],
    claims: ['#history-modern-claims', 'Test the claims with data', 'Big arguments checked against well-being statistics'], archive: ['#archive', 'Search the archives', 'Twelve open archives: photos, film, documents, maps'],
    countries: ['#countries', 'Every country', 'Government, history, data, pictures and sources for each'], evidence: ['#evidence', 'Evidence Lab', 'Practise rating real sources'] };
  const D = (k) => L[k]; const ideol = ['marxism', 'capitalism', 'liberalism', 'conservatism', 'fascism', 'anarchism', 'authoritarianism', 'imperialism', 'empire'];
  const MAP = () => ({ math: [D('mathpath'), dive('disc-math')], logic: [D('method'), D('toolkit'), D('verify'), D('lies'), D('evidence')], computing: [D('archive')], statistics: [D('method'), D('tolls'), D('toolkit'), D('claims'), D('verify'), D('countries')],
    physics: [dive('disc-physics'), D('origins')], chemistry: [dive('disc-chemistry'), D('origins')], biology: [dive('disc-biology'), D('origins')], earthspace: [D('origins')],
    economics: [dive('capitalism'), dive('marxism'), D('inst'), D('power'), D('claims')], politics: [D('power'), D('parl'), D('govern'), D('rules'), ...ideol.map(dive), D('verify')],
    geopolitics: [D('inst'), D('power'), dive('imperialism'), dive('empire'), D('lies')], psychology: [D('toolkit'), D('lies'), D('method'), D('verify')], sociology: [D('oppression'), D('claims'), dive('marxism'), dive('conservatism')],
    anthropology: [D('origins'), dive('empire')], law: [D('inst'), D('oppression'), D('verify'), D('govern')], history: [D('modern'), D('origins'), D('tolls'), D('oppression'), D('lies'), D('verify'), D('toolkit'), dive('truths'), ...ideol.map(dive), D('archive')],
    philosophy: [dive('liberalism'), dive('conservatism'), dive('anarchism'), dive('marxism'), D('method')], religion: [D('modern')], linguistics: [D('origins')], literature: [D('archive')], arts: [D('archive')],
    medicine: [D('lies'), D('origins'), D('claims')], engineering: [D('origins')], ethics: [D('oppression'), D('lies'), D('verify'), D('method')] });
  const REL = { math: 'statistics logic computing physics engineering economics', logic: 'math philosophy computing law', computing: 'math logic statistics engineering linguistics', statistics: 'math economics medicine psychology sociology politics',
    physics: 'math chemistry earthspace engineering', chemistry: 'physics biology medicine earthspace', biology: 'chemistry medicine anthropology earthspace psychology', earthspace: 'physics chemistry biology geopolitics',
    economics: 'politics geopolitics statistics history sociology law', politics: 'economics geopolitics law history philosophy sociology', geopolitics: 'politics economics history earthspace', psychology: 'biology sociology medicine statistics philosophy',
    sociology: 'anthropology psychology economics politics statistics', anthropology: 'biology history sociology linguistics religion', law: 'politics ethics philosophy history', history: 'politics economics anthropology religion geopolitics literature',
    philosophy: 'logic ethics religion politics math', religion: 'philosophy history anthropology ethics literature', linguistics: 'anthropology literature computing psychology', literature: 'linguistics arts history philosophy',
    arts: 'literature history religion engineering', medicine: 'biology chemistry statistics ethics psychology', engineering: 'physics math computing earthspace', ethics: 'philosophy law medicine religion politics' };
  const row = ([href, t, d]) => h('a', { class: 'search-hit', href }, h('span', null, h('b', null, t)), d ? h('span', { class: 'tiny muted' }, d) : null);
  // Subject pages: everything in one card under the title.
  const baseD = Lab.routes.d;
  if (baseD) Lab.routes.d = (app, args) => { const r = baseD(app, args); const id = args && args[0]; const disc = (Lab.DISC || []).find((x) => x.id === id);
    const items = (MAP()[id] || []).filter(Boolean).filter(([href]) => has(href)); const steps = (Lab.ORIGINS || []).filter((x) => x[10] === id);
    if (disc) { const card = h('div', { class: 'card', style: { borderLeft: '4px solid ' + (disc.c || '#2563EB') } }, h('h3', { style: { marginTop: 0 } }, 'Everything in the Lab on ' + disc.name),
        h('div', { class: 'stack', style: { gap: '6px' } }, items.map(row), steps.length ? row(['#origins', 'In “How we got here”', steps.map((x) => x[2]).join(' · ')]) : null),
        REL[id] ? h('div', { style: { marginTop: '10px' } }, h('div', { class: 'tiny muted', style: { marginBottom: '4px' } }, 'Connected subjects'), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, REL[id].split(' ').map((k) => (Lab.DISC || []).find((x) => x.id === k)).filter(Boolean).map((x) => h('a', { class: 'btn sm', href: '#d-' + x.id }, (x.e || '') + ' ' + x.name)))) : null,
        h('a', { class: 'tiny', href: '#explore', style: { display: 'inline-block', marginTop: '8px' } }, 'See the whole Lab →'));
      const hero = app.querySelector('.hero'); if (hero) hero.after(card); else app.prepend(card); }
    return r; };
  // The map of the Lab.
  Lab.routes.explore = (app) => {
    Lab.setContext('Explore: the whole Lab on one page');
    const G = [['🌍 Countries', 'Every one of the 196 countries has the same tabs: Government & power, History, Life in numbers, Pictures, Everything in the Lab, and Sources & perspectives.', [D('countries'), ['#country-chn', 'China', 'Example: roles chart, who runs what, 224 checked pictures'], ['#country-usa', 'United States', ''], ['#country-rus', 'Russia', ''], ['#country-ind', 'India', ''], ['#country-prk', 'North Korea', 'With 20 claims checked']]],
      ['📚 Subjects', 'The 24 disciplines. Each subject page starts with everything the Lab has on it.', (Lab.DISC || []).map((x) => ['#d-' + x.id, (x.e || '') + ' ' + x.name, ''])],
      ['🏛️ Power, government and ideas', 'Who rules, how, and the ideas behind each system, each told in its own terms and by its critics.', [D('power'), D('parl'), D('govern'), D('rules'), D('inst'), D('modern'), ...ideol.map(dive)]],
      ['🔎 Evidence and truth', 'How to tell what really happened, and the cases where it was hidden.', [D('method'), D('toolkit'), D('verify'), D('tolls'), D('lies'), D('oppression'), D('claims'), D('archive'), D('evidence')]],
      ['🧭 Paths', 'Start at the beginning and build up.', [D('mathpath'), D('origins')]]];
    const q = h('input', { type: 'search', placeholder: 'Find a country…', 'aria-label': 'Find a country', style: { width: '100%' } }); const hits = h('div', { class: 'stack', style: { gap: '4px', marginTop: '6px' } });
    Lab.json('data/countries.json').then((CL) => { const all = (CL && CL.list) || []; q.oninput = () => { const v = q.value.trim().toLowerCase(); hits.replaceChildren(...(v.length < 2 ? [] : all.filter((c) => (c.n + ' ' + (c.off || '') + ' ' + (c.dem || '')).toLowerCase().includes(v)).slice(0, 8).map((c) => row(['#country-' + c.id, (c.flag || '') + ' ' + c.n, c.off || ''])))); }; }).catch(() => {});
    app.append(h('section', { class: 'hero', 'data-own': '1' }, h('h1', null, 'Explore the Lab'), h('p', null, 'Everything in one map. Pick a country, a subject, or a question about power and truth. Each country and subject page also gathers everything the Lab has on it.')),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🔍 Go straight to a country'), q, hits),
      ...G.map(([t, d, items]) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, t), h('p', { class: 'small muted', style: { marginTop: 0 } }, d),
        h('div', { class: t.startsWith('📚') ? 'ex-grid' : 'stack', style: { gap: '6px' } }, items.filter(Boolean).filter(([href]) => has(href)).map(row)))));
  };
  // Explore button in the top bar, on every page.
  const add = () => { const bar = document.querySelector('.top .wrap'); if (!bar || bar.querySelector('.explore-btn')) return; const logo = bar.querySelector('.logo');
    const a = h('a', { class: 'pill explore-btn', href: '#explore', title: 'The whole Lab on one page' }, '☰ Explore'); if (logo) logo.after(a); else bar.prepend(a); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
