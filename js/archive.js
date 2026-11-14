// The Archive: every picture and film in the Lab in one place, filtered by topic, searchable, loading as you scroll.
(function () {
  const h = Lab.h;
  const TOPICS = [['all', 'Everything'], ['slavery', 'Slavery & abolition'], ['peasants', 'Peasants & farmers'], ['workers', 'Workers & labour'], ['revolutions', 'Revolutions'], ['war', 'War'], ['depression', 'Great Depression'], ['empire', 'Empire & colonies'], ['cities', 'Cities & migration'], ['rights', 'Rights movements'], ['soviet-life', 'Soviet life'], ['china', 'China'], ['ideologies', 'Marxism, capitalism & fascism'], ['indigenous', 'Indigenous peoples'], ['colonialism', 'Colonialism & famine'], ['covert', 'Coups & covert operations'], ['companies', 'Companies & disasters'], ['propaganda', 'Propaganda'], ['news', 'Newspapers'], ['science', 'Science & space'], ['medicine', 'Medicine'], ['ethics', 'Ethics & experiments'], ['government', 'Governments & citizens'], ['film', 'Film'], ['disciplines', 'Treasures of the 24 disciplines'], ['modern', 'Modern history collection']];
  const IDEO = new Set(); const GOV = new Set(['c:us-capitol', 'c:us-senate-chamber', 'c:us-house-chamber', 'c:scotus-building', 'c:white-house', 'c:westminster', 'c:commons-chamber', 'c:great-hall-people', 'c:kremlin-senate', 'c:mansudae-hall', 'c:capitolio-havana', 'c:reichstag-dome', 'c:riksdag', 'c:ballot-box', 'c:suffrage-1913', 'c:lawrence-strike', 'c:flint-sitdown', 'c:selma-march', 'c:salt-march', 'c:town-meeting', 'c:miners-strike-1984', 'c:solidarity-gdansk']);
  const DISCS = (Lab.DISC || []).map((d) => d.id);
  const tagsOf = (k, m) => { const t = new Set(m.tags || []); const a = k.match(/^c:a-([a-z-]+?)-/); if (a) t.add(a[1]);
    const d = k.slice(2).split('-')[0]; if (DISCS.includes(d)) t.add('disciplines'); if (k.startsWith('c:emp-')) t.add('empire'); if (IDEO.has(k)) t.add('ideologies'); if (GOV.has(k)) t.add('government'); if (m.video) t.add('film'); if ((m.tags || []).includes('soviet-life')) t.add('soviet-life'); return t; };
  Lab.routes.archive = function (app, [topic0]) {
    [Lab.MARX, Lab.CAP, Lab.FAS, Lab.EMP].forEach((X) => X && (X.gallery || []).forEach(([, , ks]) => ks.forEach((k) => IDEO.add(k))));
    let topic = TOPICS.some(([k]) => k === topic0) ? topic0 : 'all', q = '', shown = 0, list = [];
    const chips = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '2px' } });
    const search = h('input', { type: 'search', placeholder: 'Search pictures, places, years, people’s work…', style: { flex: 1, minWidth: '200px' }, oninput: (e) => { q = e.target.value.toLowerCase(); build(); } });
    const count = h('span', { class: 'small muted' }); const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' } }); const more = h('div', { style: { height: '40px' } });
    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('h1', null, 'The Archive'), h('p', null, 'Real photographs, paintings, posters, documents and film from public archives, from ancient tablets to the 21st century. Every item is public domain or Creative Commons and credited to its maker. Tap any one to enlarge it and see its source.')),
      h('div', { class: 'card', style: { position: 'sticky', top: '58px', zIndex: 6, padding: '10px 12px' } }, h('div', { class: 'row', style: { gap: '8px', marginBottom: '8px' } }, search, count), chips),
      h('p', { class: 'tiny muted' }, 'Pictures of war and violence are blurred until you tap them, and hidden for ages 10–12; change this in Settings. Some captions come from the archives themselves and may use the language of their time.'), grid, more);
    let C = {}, M = {};
    const items = () => { const out = [];
      Object.entries(C).forEach(([k, m]) => { const t = tagsOf(k, m); if (topic !== 'all' && topic !== 'modern' && !t.has(topic)) return; if (topic === 'modern') return; const text = ((m.cap || '') + ' ' + (m.desc || '') + ' ' + m.title + ' ' + [...t].join(' ')).toLowerCase(); if (q && !text.includes(q)) return; out.push(['c', k]); });
      if (topic === 'all' || topic === 'modern') Object.entries(M).forEach(([k, m]) => { if (q && !((m.t || '') + ' ' + (m.c || '')).toLowerCase().includes(q)) return; out.push(['m', k]); });
      return out; };
    const tile = ([kind, k]) => kind === 'c' ? Lab.cfig(k, { max: '200px' }) : (() => { const f = Lab.MODERN.figure(k, { max: '200px' }); const m = M[k]; f.append(h('figcaption', { class: 'small', style: { marginTop: '6px' } }, m.t), h('div', { class: 'tiny muted' }, m.c)); return f; })();
    const page = () => { list.slice(shown, shown + 30).forEach((it) => grid.append(tile(it))); shown = Math.min(list.length, shown + 30); };
    const build = () => { list = items(); shown = 0; grid.innerHTML = ''; count.textContent = `${list.length} items`; page(); history.replaceState(null, '', '#archive' + (topic === 'all' ? '' : '-' + topic)); };
    TOPICS.forEach(([k, n]) => chips.append(h('span', { class: 'chip' + (k === topic ? ' on' : ''), 'data-k': k, style: { flex: 'none', whiteSpace: 'nowrap' }, onclick: () => { topic = k; chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); build(); } }, n)));
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting && shown < list.length) page(); }, { rootMargin: '600px' }); io.observe(more);
    Promise.all([Lab.commons(), Lab.MODERN && Lab.MODERN.imgIndex ? Lab.MODERN.imgIndex() : {}]).then(([c, m]) => { C = c; M = m || {}; build(); });
    return () => io.disconnect();
  };
})();
