// Who holds power now, for every country, from data/power.json (built weekly from Wikidata and Wikipedia by tools/build_power.py).
// Adds to each country's "Government & power" tab: leaders and their offices, each legislature with its seat chart and the
// official Commons seat diagram, and who runs which ministry. Also an "every country" finder on #parliaments.
(function () {
  const h = Lab.h;
  let DATA = null, LOADING = null;
  const base = () => (Lab.PUBLIC ? '' : (Lab.PUBLIC_URL || 'https://branlung0-svg.github.io/open-learning-lab/'));
  Lab.powerData = () => DATA ? Promise.resolve(DATA) : (LOADING ||= fetch('data/power.json', { cache: 'no-cache' }).then((r) => { if (!r.ok) throw 0; return r.json(); })
    .catch(() => fetch(base() + 'data/power.json').then((r) => r.json())).then((j) => (DATA = j)).catch(() => (DATA = {})));
  const PAL = ['#2563EB', '#DC2626', '#16A34A', '#F59E0B', '#7C3AED', '#0891B2', '#DB2777', '#65A30D', '#EA580C', '#0D9488', '#9333EA', '#CA8A04', '#4B5563'];
  const colour = (c, i) => (c && /^#[0-9a-f]{3,6}$/i.test(c) ? c : PAL[i % PAL.length]);
  const wd = (q) => 'https://www.wikidata.org/wiki/' + q;
  const filePage = (f) => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f.replace(/ /g, '_'));
  const fileImg = (f, w) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f.replace(/ /g, '_')) + '?width=' + (w || 520);
  const person = ([n, q, since]) => h('span', null, q ? h('a', { href: wd(q), target: '_blank', rel: 'noopener' }, n) : n, since ? h('span', { class: 'tiny muted' }, ' since ' + since) : null);
  const legCard = (L) => { const gs = (L.groups || []).map(([n, s, c], i) => [n, s, colour(c, i)]);
    const chart = gs.length && Lab.hemicycle ? Lab.hemicycle(gs, L.sumOk && L.seats ? L.seats : gs.reduce((a, b) => a + b[1], 0)) : null;
    return h('div', { class: 'card' }, h('div', { class: 'row', style: { justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' } }, h('h3', { style: { margin: 0 } }, L.title), L.seats ? h('b', null, L.seats.toLocaleString() + ' seats') : null),
      h('div', { class: 'tiny muted', style: { margin: '2px 0 8px' } }, [L.election ? 'Last election: ' + L.election : null, L.nextElection ? 'next: ' + L.nextElection : null].filter(Boolean).join(' · ')),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null, chart, gs.length ? h('div', { class: 'stack', style: { gap: '2px', marginTop: '6px' } }, gs.map(([n, s, c]) => h('div', { class: 'row small', style: { gap: '8px', flexWrap: 'nowrap' } }, h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: c, flex: 'none' } }), h('span', { style: { flex: 1 } }, n), h('b', null, s.toLocaleString())))) : h('p', { class: 'small muted' }, 'Party breakdown not listed in the source.'),
          gs.length && !L.sumOk ? h('p', { class: 'tiny muted' }, 'The parties listed here do not add up to the total, so the source breakdown may be incomplete; check the official diagram.') : null),
        L.diagram ? h('figure', { style: { margin: 0 } }, h('a', { href: filePage(L.diagram), target: '_blank', rel: 'noopener' }, h('img', { src: fileImg(L.diagram), alt: 'Seat diagram of ' + L.title, loading: 'lazy', style: { width: '100%', background: '#fff', borderRadius: '10px', padding: '6px' }, onerror: (e) => { e.target.closest('figure').remove(); } })), h('figcaption', { class: 'tiny muted' }, 'Seat diagram from Wikimedia Commons ↗')) : null),
      L.voting ? h('p', { class: 'small', style: { margin: '8px 0 2px' } }, h('b', null, 'How members are chosen: '), L.voting) : null,
      L.leader ? h('p', { class: 'small', style: { margin: '2px 0' } }, h('b', null, (L.leaderType || 'Presiding officer') + ': '), L.leader) : null,
      h('a', { class: 'tiny', href: L.url, target: '_blank', rel: 'noopener' }, 'Source: Wikipedia, ' + L.title + ' ↗')); };
  Lab.powerNow = (iso) => { const box = h('div', { class: 'stack' }, h('div', { class: 'card small muted' }, 'Loading who holds power now…'));
    Lab.powerData().then((D) => { const R = D[iso]; if (!R) { box.replaceChildren(); return; }
      const same = R.hos[0] && R.hog[0] && R.hos[0][1] === R.hog[0][1];
      const leaders = h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '👤 Who holds power now'),
        h('div', { class: 'grid g2' }, R.hos.length ? h('div', { class: 'mp-box' }, h('b', null, R.hosOffice || 'Head of state'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, ...R.hos.map((x, i) => [i ? h('br') : null, person(x)]).flat())) : null,
          R.hog.length ? h('div', { class: 'mp-box' }, h('b', null, R.hogOffice || 'Head of government'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, ...R.hog.map((x, i) => [i ? h('br') : null, person(x)]).flat())) : null),
        same ? h('p', { class: 'small', style: { margin: '6px 0 0' } }, 'One person is both head of state and head of government.') : null,
        R.forms.length ? h('p', { class: 'small', style: { margin: '6px 0 0' } }, h('b', null, 'Form of government: '), R.forms.join(', ')) : null);
      const mins = R.ministers.length ? h('details', { class: 'card' }, h('summary', null, h('b', null, `🗂️ Who runs what: ${R.ministers.length} ministerial posts`), h('span', { class: 'tiny muted', style: { display: 'block' } }, 'Tap to open')),
        h('div', { class: 'stack', style: { gap: '4px', marginTop: '8px' } }, R.ministers.map(([pos, n, since, q]) => h('div', { class: 'row small', style: { gap: '8px', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', padding: '4px 0' } }, h('span', { style: { flex: 1 } }, pos), person([n, q, since]), since && +since.slice(0, 4) < +R.built.slice(0, 4) - 10 ? h('span', { class: 'tiny', style: { color: '#B45309' }, title: 'This entry is old in the open data; the post may have changed hands.' }, ' ⚠ check') : null)),
          h('p', { class: 'tiny muted' }, 'Entries marked ⚠ have not changed in the open data for over ten years; the person may be long-serving, or the record may be out of date.'))) : null;
      box.replaceChildren(leaders, ...R.legislatures.map(legCard), mins,
        h('p', { class: 'tiny muted' }, `Built ${R.built} from Wikidata and Wikipedia, which volunteers update; very recent changes may be missing. Check the government’s own website for anything important.`)); });
    return box; };
  // every country on #parliaments
  Lab.powerFinder = () => { const box = h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, '🌍 Every country’s legislature'), h('p', { class: 'small muted' }, 'Loading…'));
    Lab.powerData().then((D) => { const list = Object.entries(D).filter(([, R]) => R.legislatures && R.legislatures.length).sort((a, b) => (a[1].name || '').localeCompare(b[1].name || ''));
      const out = h('div', { class: 'stack' }); const q = h('input', { type: 'search', placeholder: 'Find a country…', 'aria-label': 'Find a country', style: { width: '100%' } });
      const draw = () => { const t = q.value.trim().toLowerCase(); const hits = list.filter(([, R]) => !t || (R.name || '').toLowerCase().includes(t)).slice(0, t ? 6 : 0);
        out.replaceChildren(...hits.flatMap(([iso, R]) => [h('h3', { style: { margin: '10px 0 0' } }, h('a', { href: '#country-' + iso + '-power' }, R.name + ' →')), ...R.legislatures.map(legCard)])); };
      q.oninput = draw;
      box.replaceChildren(h('h2', { style: { marginTop: 0 } }, '🌍 Every country’s legislature'), h('p', { class: 'small' }, `Seat charts, parties and official diagrams for ${list.length} countries, rebuilt every week from Wikipedia and Wikidata. Type a country.`), q, out); });
    return box; };
})();
