// Countries of the world: an atlas of all 196 countries (#countries) and a profile page for each (#country-<iso3>).
// Facts: mledoze/countries (ODbL). Long-run series: data/cs/<id>.json built by tools/build_countries.py.
// Each profile connects the country to everything else in the Lab: timeline events, deep-dive cases,
// government diagrams, pictures in the Archive, and the tutor for a full study.
(function () {
  const h = Lab.h;
  const fmt = (n) => (n == null ? '–' : n >= 1e9 ? (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + ' billion' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + ' million' : n >= 1e4 ? Math.round(n / 1e3) + ',000' : Math.round(n).toLocaleString());
  const last = (arr) => (arr && arr.length ? arr[arr.length - 1] : null);
  const first = (arr) => (arr && arr.length ? arr[0] : null);
  let LIST = null; const load = () => (LIST ||= Lab.json('data/countries.json'));
  const stats = (id) => Lab.json('data/cs/' + id + '.json').catch(() => ({}));
  const REG = [['all', 'All'], ['Africa', 'Africa'], ['Americas', 'Americas'], ['Asia', 'Asia'], ['Europe', 'Europe'], ['Oceania', 'Oceania']];
  const GOVMAP = { usa: 'usa', gbr: 'uk', deu: 'germany', chn: 'china', rus: 'ussr', prk: 'dprk', cub: 'cuba', ita: 'italy' };
  const wiki = (t) => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_'));
  const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const NAMEFIX = { 'United States': 'United States', 'DR Congo': 'Democratic Republic of the Congo', 'Republic of the Congo': 'Republic of the Congo', 'Czechia': 'Czech Republic' };

  // ---------------------------------------------------------------- the atlas
  Lab.routes.countries = function (app, [reg0]) {
    Lab.setContext('Countries of the world');
    let reg = REG.some(([k]) => k === reg0) ? reg0 : 'all', q = '', sort = 'az';
    const grid = h('div', { class: 'ctry-grid' }); const count = h('span', { class: 'small muted' });
    const chips = h('div', { class: 'subtabs' });
    const search = h('input', { type: 'search', placeholder: 'Find a country, capital or language…', style: { flex: 1, minWidth: '180px' }, oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } });
    const sorter = h('select', { onchange: (e) => { sort = e.target.value; draw(); }, 'aria-label': 'Sort countries' }, h('option', { value: 'az' }, 'A–Z'), h('option', { value: 'pop' }, 'Most people'), h('option', { value: 'area' }, 'Largest area'), h('option', { value: 'saved' }, 'Saved first'));
    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('h1', null, 'Every country in the world'), h('p', null, 'All 196 countries: their land and cities, their history from before colonial times to today, how they are governed, how life there has changed since 1800 in real data, and their pictures in the Archive. Tap a country to open its page.')),
      h('div', { class: 'card', style: { position: 'sticky', top: '58px', zIndex: 6, padding: '10px 12px' } }, h('div', { class: 'row', style: { gap: '8px', marginBottom: '6px' } }, search, sorter), chips, count), grid);
    REG.forEach(([k, n]) => chips.append(h('button', { 'data-k': k, onclick: () => { reg = k; draw(); } }, n)));
    let L = []; const pops = {};
    const draw = () => { chips.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === reg)); history.replaceState(null, '', '#countries' + (reg === 'all' ? '' : '-' + reg));
      const saved = new Set(Object.keys((Lab.state.saved || {})).filter((k) => k.startsWith('#country-')).map((k) => k.slice(9)));
      let list = L.filter((c) => (reg === 'all' || c.reg === reg) && (!q || [c.n, c.off, ...c.cap, ...c.langs, c.sub, ...c.nat].join(' ').toLowerCase().includes(q)));
      list.sort(sort === 'pop' ? (a, b) => (pops[b.id] || 0) - (pops[a.id] || 0) : sort === 'area' ? (a, b) => (b.area || 0) - (a.area || 0) : sort === 'saved' ? (a, b) => saved.has(b.id) - saved.has(a.id) || a.n.localeCompare(b.n) : (a, b) => a.n.localeCompare(b.n));
      count.textContent = `${list.length} countries`;
      grid.replaceChildren(...list.map((c) => h('a', { class: 'ctry-card', href: '#country-' + c.id }, h('span', { class: 'ctry-flag', 'aria-hidden': 'true' }, c.flag), h('span', { class: 'ctry-txt' }, h('b', null, c.n + (saved.has(c.id) ? ' ★' : '')), h('span', { class: 'tiny muted' }, [c.cap[0], c.sub].filter(Boolean).join(' · '))), h('span', { class: 'tiny muted ctry-pop' }, pops[c.id] ? fmt(pops[c.id]) : '')))); };
    load().then((D) => { L = D.list; draw();
      // population for sorting (small files, fetched lazily)
      Promise.all(L.map((c) => stats(c.id).then((s) => { const p = last(s.pop); if (p) pops[c.id] = p[1]; }))).then(() => { if (sort !== 'az' || true) draw(); }); });
  };

  // ---------------------------------------------------------------- one country
  Lab.routes.country = function (app, [id, tab0]) {
    load().then(async (D) => {
      const c = D.list.find((x) => x.id === id); if (!c) { location.hash = 'countries'; return; }
      Lab.setContext(`${c.n}: the country, its history, government, people and data`);
      const S = await stats(c.id); const LB = D.labels;
      const words = [c.n, c.off, ...c.cap, c.dem, ...(c.nat || [])].filter((w) => w && w.length > 3);
      const byId = Object.fromEntries(D.list.map((x) => [x.id, x]));
      const pop = last(S.pop), lex = last(S.lex), gdp = last(S.gdppc), dem = last(S.dem), hdi = last(S.hdi);
      const TABS = [['overview', 'Overview'], ['history', 'History'], ['data', 'Life in numbers'], ['power', 'Government & power'], ['places', 'Places & pictures'], ['sources', 'Go deeper & sources']];
      let tab = TABS.some(([k]) => k === tab0) ? tab0 : 'overview';
      const body = h('div', { class: 'stack' }); const bar = h('div', { class: 'subtabs', role: 'tablist' });
      const saveBtn = Lab.saveButton ? Lab.saveButton('#country-' + c.id, c.flag + ' ' + c.n, 'Country') : null;
      const hero = h('section', { class: 'hero dive-photo', 'data-own': '1' }, h('a', { class: 'crumb', href: '#countries' }, '← All countries'), h('div', { class: 'hw-kicker' }, [c.reg, c.sub].filter(Boolean).join(' · ')),
        h('h1', null, c.flag + ' ' + c.n), h('p', null, [c.off !== c.n ? c.off : '', c.nat.length ? 'In its own language: ' + c.nat.join(' / ') : ''].filter(Boolean).join('. ')),
        h('div', { class: 'dp-nums' }, [[pop && fmt(pop[1]), 'people (' + (pop ? pop[0] : '') + ')'], [c.cap.join(', '), 'capital'], [lex && lex[1].toFixed(0), 'life expectancy'], [gdp && '$' + Math.round(gdp[1]).toLocaleString(), 'income per person (' + (gdp ? gdp[0] : '') + ')']].filter(([v]) => v).map(([v, l]) => h('div', null, h('b', null, v), h('span', null, l)))),
        saveBtn ? h('div', { style: { marginTop: '10px' } }, saveBtn) : null);
      Lab.commons().then((C) => { const re = new RegExp('\\b(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i');
        const own = Object.keys(C).filter((k) => k.startsWith('c:k-' + c.id + '-') && !C[k].graphic && !C[k].video).sort(() => Math.random() - 0.5);
        const more = Object.keys(C).filter((k) => !k.startsWith('c:k-') && !C[k].graphic && !C[k].video && re.test(C[k].title + ' ' + (C[k].cap || '')));
        Lab.photoize(hero, { keys: own.concat(more), tags: own.length + more.length >= 3 ? ['__none__'] : ['nature'] }); });
      app.append(hero, h('div', { class: 'card', style: { position: 'sticky', top: '58px', zIndex: 6, padding: '6px 10px' } }, bar), body);

      const fact = (k, v) => (v ? h('div', { class: 'ctry-fact' }, h('span', { class: 'tiny muted' }, k), h('b', null, v)) : null);
      const neighbours = c.bor.length ? h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, c.bor.map((b) => byId[b] && h('a', { class: 'chip', href: '#country-' + b, style: { textDecoration: 'none', color: 'inherit' } }, byId[b].flag + ' ' + byId[b].n))) : h('span', { class: 'small muted' }, c.land ? 'Landlocked.' : 'No land borders: an island or island group.');
      const ask = (what) => Lab.ask(what, c.n);
      const STUDY = `Give me a deep, honest study of ${c.n}. Cover: its land and geography and how they shaped it; the peoples and states there before European colonialism (if relevant); colonization or empire and what it did to the people who lived there; independence or national formation; the major events of the 20th and 21st centuries with dates and real numbers; how it is governed today and who really holds power; its economy, what people work at, and how life has changed since 1800 (use real data); its culture, languages, religions and minorities; and the main debates about its history, told from each side at its strongest, especially the people who suffered. Label anything from 2025–26 as developing, give estimate ranges, and end with 5 primary sources and 5 books from different perspectives.`;
      const timeline = () => { const evs = ((Lab.MODERN && Lab.MODERN.events) || []).filter((e) => { const re = new RegExp('\\b(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i'); return re.test((e.place || '') + ' ' + e.t + ' ' + (e.what || '')); }).sort((a, b) => a.y - b.y);
        return evs.length ? h('div', null, evs.map((e) => h('a', { href: '#history-modern-timeline-ev-' + e.id, class: 'search-hit', style: { marginBottom: '6px' } }, h('span', null, h('b', null, (e.y2 && e.y2 !== e.y ? e.y + '–' + e.y2 : e.y) + ' · '), e.t), h('span', { class: 'tiny muted' }, (e.what || '').slice(0, 160))))) : h('p', { class: 'small muted' }, 'No events from the Modern-world timeline mention this country yet. Use the tutor study below for its full history.'); };
      const cases = () => { const out = []; Object.values(Lab.DIVES_ALL || {}).forEach((Dv) => Object.entries(Dv.data.cases || {}).forEach(([k, cs]) => { const t = (cs.n + ' ' + cs.sum).toLowerCase(); if (words.some((w) => t.includes(w.toLowerCase()))) out.push(h('a', { class: 'chip', href: '#' + Dv.base + '-' + k, style: { textDecoration: 'none', color: 'inherit' } }, `${cs.flag} ${Dv.title}: ${cs.n}`)); })); return out.length ? h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, out) : null; };

      const chart = (title, keys, opts = {}) => { const ser = keys.map(([k, col, name]) => [name || LB[k], col, (S[k] || []).map(([x, y]) => [x, opts.div ? y / opts.div : y])]).filter((s) => s[2].length > 1);
        if (!ser.length) return null; const cmpBox = h('div');
        return h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, title), opts.note ? h('p', { class: 'tiny muted' }, opts.note) : null, Lab.chartSVG ? Lab.chartSVG(ser, { unit: opts.unit || '' }) : null,
          h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap' } }, ser.map(([n, col]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: col, marginRight: '4px' } }), n))), cmpBox); };
      let cmp = null; const cmpSel = h('select', { 'aria-label': 'Compare with another country', onchange: async (e) => { cmp = e.target.value ? { c: byId[e.target.value], S: await stats(e.target.value) } : null; show('data'); } }, h('option', { value: '' }, 'Compare with…'), D.list.filter((x) => x.id !== c.id).map((x) => h('option', { value: x.id }, x.flag + ' ' + x.n)));
      const cchart = (title, k, col, opts = {}) => { const pick = (arr) => (arr || []).filter(([x]) => x >= 1800).map(([x, y]) => [x, opts.div ? y / opts.div : y]); const ser = [[c.n, col, pick(S[k])]]; if (cmp && cmp.S[k]) ser.push([cmp.c.n, '#64748B', pick(cmp.S[k])]);
        if (ser[0][2].length < 2) return null; return h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, title), opts.note ? h('p', { class: 'tiny muted' }, opts.note) : null, Lab.chartSVG(ser.filter((s) => s[2].length > 1), { unit: opts.unit || '' }),
          h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap' } }, ser.map(([n, cl]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: cl, marginRight: '4px' } }), n)))); };

      const P = {
        overview: () => [h('div', { class: 'card' }, h('div', { class: 'ctry-facts' }, fact('Capital', c.cap.join(', ')), fact('Region', [c.sub, c.reg].filter(Boolean).join(', ')), fact('Languages', c.langs.join(', ')), fact('Currency', c.cur.join(', ')),
            fact('Area', c.area ? Math.round(c.area).toLocaleString() + ' km²' : ''), fact('People', pop ? fmt(pop[1]) + ' (' + pop[0] + ')' : ''), fact('Life expectancy', lex ? lex[1].toFixed(1) + ' years (' + lex[0] + ')' : ''), fact('Human Development Index', hdi ? hdi[1].toFixed(3) + ' (' + hdi[0] + ')' : ''),
            fact('Democracy index (0–1)', dem ? dem[1].toFixed(2) + ' (' + dem[0] + ', V-Dem)' : ''), fact('Citizens are called', c.dem)),
          h('h3', null, 'Neighbours'), neighbours),
          h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Pictures'), Lab.carousel([], { prefix: 'c:k-' + c.id + '-', words, max: 30 }), h('button', { class: 'btn sm', onclick: () => show('places') }, 'More places & pictures →')),
          h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Study it in depth'), h('p', { class: 'small' }, 'A full study of ' + c.n + ': land, peoples before colonialism, empire and independence, the 20th century with real numbers, how power works today, life in data, culture and minorities, and every side of its debates.'),
            h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, h('button', { class: 'btn primary', onclick: () => ask(STUDY) }, '✦ Full study with the tutor'), h('button', { class: 'btn', onclick: () => show('history') }, 'History on this site →'), h('button', { class: 'btn', onclick: () => show('data') }, 'Life in numbers →')))],
        history: () => { const cs = cases(); const g = GOVMAP[c.id];
          return [h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Where ' + c.n + ' appears in the Lab'), cs || h('p', { class: 'small muted' }, 'No deep-dive case study yet.'), g ? h('a', { class: 'btn sm', href: '#history-modern-govern-' + g, style: { marginTop: '8px', display: 'inline-block' } }, '🏛️ How its government works (diagram) →') : null),
            h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Timeline: events in the Modern-world history'), timeline()),
            h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The whole story'), h('p', { class: 'small' }, 'For periods and events not yet written up on this site, the tutor can take you through them with sources and every side.'),
              h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, [['Before colonialism / early history', `Tell the early history of the lands and peoples of today’s ${c.n}, before European colonialism or the modern state: states, societies, trade, religion, with what archaeology and written sources show.`],
                ['Empire, colonialism and independence', `How did empire or colonial rule shape ${c.n}? Who ruled, what was taken, how people resisted, what independence (or national formation) looked like, with numbers and the views of the colonized and the colonizers.`],
                ['The 20th century', `Take me through ${c.n} in the 20th century: wars, revolutions, coups, famines, economic change and everyday life, with dates, real numbers and how different sides remember it.`],
                ['Today (developing)', `What is happening in ${c.n} now? Politics, economy, conflicts and debates, marking anything from 2025–26 as developing and showing each side.`],
                ['Its hardest truths', `What are the hardest episodes in the history of ${c.n}, told from the side of the people who suffered them, with evidence, estimate ranges and how they are acknowledged or denied today?`]].map(([n, p]) => h('button', { class: 'btn sm', onclick: () => ask(p) }, '✦ ' + n))), h('a', { class: 'small', href: wiki('History of ' + (NAMEFIX[c.n] || c.n)), target: '_blank', rel: 'noopener', style: { display: 'block', marginTop: '8px' } }, 'Wikipedia: History of ' + c.n + ' ↗'))]; },
        data: () => [h('div', { class: 'card', style: { padding: '10px 12px' } }, h('div', { class: 'row', style: { gap: '8px', justifyContent: 'space-between' } }, h('span', { class: 'small' }, 'Real data since 1800. Earlier values are historians’ estimates.'), cmpSel)),
          cchart('Income per person', 'gdppc', '#2563EB', { note: 'Maddison Project, 2011 international dollars (adjusted for prices).' }), cchart('Life expectancy', 'lex', '#15803D', { note: 'Gapminder: years a newborn could expect to live. Dips show wars, famines and epidemics.' }),
          cchart('Children dying before age 5', 'cm', '#B91C1C', { note: 'Per 1,000 born (Gapminder).' }), cchart('Democracy', 'dem', '#7C3AED', { note: 'V-Dem electoral democracy index, 0 (none) to 1 (full). Since 1789.' }), cchart('Civil liberties', 'lib', '#0891B2', { note: 'V-Dem civil liberties index, 0–1.' }),
          cchart('Population', 'pop', '#B45309', { div: 1e6, note: 'Millions (World Bank).' }), cchart('Children per woman', 'kids', '#DB2777'), cchart('Living in cities (%)', 'urb', '#0F766E'), cchart('Extreme poverty (%)', 'epov', '#9333EA'), cchart('Military spending (% of GDP)', 'mil', '#475569'), cchart('CO₂ per person (tonnes)', 'co2', '#57534E'),
          h('p', { class: 'tiny muted' }, D.src)].filter(Boolean),
        power: () => { const g = GOVMAP[c.id]; return [h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Who holds power'), g ? h('p', { class: 'small' }, 'This country has a full diagram of its government on the site: who chooses whom, on paper and in practice.') : h('p', { class: 'small' }, 'A full diagram for ' + c.n + ' is not on the site yet. Start with the democracy and civil-liberties charts in Life in numbers, then ask the tutor.'),
            h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, g ? h('a', { class: 'btn primary sm', href: '#history-modern-govern-' + g }, '🏛️ Open the government diagram') : null,
              h('button', { class: 'btn sm', onclick: () => ask(`How is ${c.n} governed today, on paper and in practice? Constitution, head of state and government, parliament, courts, parties, elections, military and security services, media, and who really holds power. How can ordinary citizens make their voices heard beyond voting (unions, protest, courts, local bodies), and what risks do they face?`) }, '✦ How it is governed, on paper and in practice'),
              h('button', { class: 'btn sm', onclick: () => ask(`What are the main political forces in ${c.n} today and what does each want? Describe each fairly, in its own terms, then its critics’ case.`) }, '✦ The main political forces'))),
            cchart('Democracy', 'dem', '#7C3AED', { note: 'V-Dem electoral democracy index, 0–1.' }), cchart('Civil liberties', 'lib', '#0891B2')].filter(Boolean); },
        places: () => [h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Cities, villages, land and history in pictures'), Lab.carousel([], { prefix: 'c:k-' + c.id + '-', words, max: 80 }),
            h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '8px' } }, h('a', { class: 'btn sm', href: '#archive', onclick: () => { try { sessionStorage.setItem('lab.archiveQ', c.n); } catch (e) {} } }, 'Search the Archive →'),
              h('a', { class: 'btn sm', href: 'https://commons.wikimedia.org/wiki/Category:' + encodeURIComponent((NAMEFIX[c.n] || c.n).replace(/ /g, '_')), target: '_blank', rel: 'noopener' }, 'Thousands more on Wikimedia Commons ↗'))),
          h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Geography'), h('p', { class: 'small' }, [c.land ? 'Landlocked. ' : '', c.area ? `Area ${Math.round(c.area).toLocaleString()} km². ` : '', c.ll ? `Centre near ${c.ll[0].toFixed(1)}°, ${c.ll[1].toFixed(1)}°.` : ''].join('')),
            h('a', { class: 'btn sm', href: `https://www.openstreetmap.org/#map=5/${(c.ll || [0, 0])[0]}/${(c.ll || [0, 0])[1]}`, target: '_blank', rel: 'noopener' }, 'Open the map ↗'), ' ',
            h('button', { class: 'btn sm', onclick: () => ask(`Describe the geography of ${c.n}: landforms, rivers, climate, natural resources, regions and major cities, and how geography shaped its history, economy and politics.`) }, '✦ How its geography shaped it'))],
        sources: () => [h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Go deeper'), h('div', { class: 'stack', style: { gap: '6px' } }, [
            ['Wikipedia: ' + c.n, wiki(NAMEFIX[c.n] || c.n)], ['Our World in Data: ' + c.n, 'https://ourworldindata.org/country/' + slug(c.n)], ['CIA World Factbook', 'https://www.cia.gov/the-world-factbook/countries/' + slug(c.n) + '/'],
            ['V-Dem country graphs (democracy since 1789)', 'https://v-dem.net/data_analysis/CountryGraph/'], ['UN data: ' + c.n, 'https://data.un.org/en/iso/' + c.id.slice(0, 2) + '.html'], ['Documentaries on YouTube', 'https://www.youtube.com/results?search_query=' + encodeURIComponent(c.n + ' history documentary')],
            ['News today (Google News)', 'https://news.google.com/search?q=' + encodeURIComponent(c.n)], ['Read its news in its own language, translated', 'https://translate.google.com/translate?sl=auto&tl=en&u=' + encodeURIComponent('https://news.google.com/search?q=' + encodeURIComponent((c.nat[0] || c.n)))]].map(([t, u]) => h('a', { class: 'search-hit', href: u, target: '_blank', rel: 'noopener' }, h('span', null, t + ' ↗'))))),
          h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Books from different perspectives'), h('button', { class: 'btn sm', onclick: () => ask(`Recommend 10 books on ${c.n}: classic histories, works by writers from ${c.n} itself (including in translation), and critical and sympathetic accounts of its governments. Say who each author is and what perspective they bring.`) }, '✦ Ask for a reading list')),
          h('p', { class: 'tiny muted' }, D.src)],
      };
      const show = (k) => { tab = k; bar.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.t === k)); history.replaceState(null, '', '#country-' + c.id + (k === 'overview' ? '' : '-' + k)); body.replaceChildren(...P[k]().filter(Boolean));
        try { const v = Lab.state.visits = Lab.state.visits || []; const i = v.findIndex((x) => x[0] === '#country-' + c.id); if (i >= 0) v.splice(i, 1); v.unshift(['#country-' + c.id, c.flag + ' ' + c.n, Date.now()]); v.length = Math.min(v.length, 30); Lab.save(); } catch (e) {} };
      TABS.forEach(([k, n]) => bar.append(h('button', { 'data-t': k, role: 'tab', onclick: () => show(k) }, n)));
      show(tab);
    });
  };
})();
