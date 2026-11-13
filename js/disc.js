const { h } = Lab;

// ---------- media (real images from Wikimedia Commons, see data/media.json) ----------
Lab.media = {};
Lab.mediaReady = Lab.json('data/media.json').then((m) => (Lab.media = m)).catch(() => ({}));
Lab.img = (title) => Lab.media[title] || null;
const cleanArtist = (a) => { a = String(a || '').replace(/\s+/g, ' ').replace(/(Anonymous)?Unknown author(Unknown author)?/g, 'Unknown author').trim(); return a.length > 60 || /colophon|reads:/i.test(a) ? '' : a; };
const cleanDate = (x) => { const m = String(x || '').match(/\b\d{4}-\d{2}-\d{2}\b/) || String(x || '').match(/\b(1\d{3}|20\d{2}|0\d{3})\b/); return m ? m[0] : ''; };
const credit = (m) => m ? [cleanArtist(m.artist), m.license, cleanDate(m.date)].filter(Boolean).join(' · ') : '';

function lightbox(src, title, caption, m) {
  const bg = h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(5,6,15,.92)', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px', cursor: 'zoom-out' }, onclick: () => bg.remove() },
    h('img', { src, alt: title, style: { maxWidth: '100%', maxHeight: '74vh', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,.5)' } }),
    h('div', { style: { color: '#fff', maxWidth: '760px', marginTop: '12px', textAlign: 'center' } }, h('b', null, title), h('p', { class: 'small', style: { opacity: 0.9, margin: '6px 0' } }, caption),
      m ? h('div', { class: 'tiny', style: { opacity: 0.75 } }, credit(m), ' · ', h('a', { href: m.page, style: { color: '#93C5FD' }, onclick: (e) => e.stopPropagation() }, 'Source & full resolution')) : null,
      h('div', { class: 'tiny', style: { opacity: 0.6, marginTop: '6px' } }, 'Tap anywhere to close')));
  document.body.append(bg);
}
Lab.lightbox = lightbox;

// Turn a book title into a match key so a discipline's key books can open in the Reading Room.
const key = (t) => t.toLowerCase().replace(/^(the|a|an) /, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').slice(0, 4).join(' ');
function findBook(title) {
  const k = key(title); const all = [...(Lab.GUIDED || []), ...(Lab.LIB || [])];
  return all.find((b) => key(b.t) === k) || all.find((b) => key(b.t).startsWith(k) || k.startsWith(key(b.t)));
}
Lab.findBook = findBook;

// deeper material, loaded once on the first discipline page
let deep = null;
Lab.loadDeep = () => deep || (deep = Lab.json('data/deep.json').catch(() => ({}))
  .then((X) => ({ gallery: X.gallery || {}, films: X.films || {}, shelves: X.shelves && X.shelves.shelves ? X.shelves : { shelves: {}, sides: {} }, papers: X.papers || {}, docs: X.docs || [], datasets: X.datasets || [], pmedia: X.pmedia || {} })));
// Each discipline's pictures and book covers travel in one packed file (img/pk/<id>.jpg); [offset, length] picks one image out of it.
const packs = {}, urls = {};
Lab.pack = (id) => packs[id] || (packs[id] = fetch(`img/pk/${id}.jpg`).then((r) => { if (!r.ok) throw new Error('pack ' + r.status); return r.arrayBuffer(); }));
Lab.packUrl = (id, buf, [o, n]) => { const k = id + ':' + o; return urls[k] || (urls[k] = URL.createObjectURL(new Blob([buf.slice(o, o + n)], { type: 'image/jpeg' }))); };

// ---------- discipline page ----------
Lab.routes.d = function (app, [id, part]) {
  const D = Lab.disc(id);
  if (!D) { location.hash = 'home'; return; }
  const F = Lab.FACULTIES.find((f) => f.id === D.fac);
  document.documentElement.style.setProperty('--accent', D.c);
  Lab.setContext(`${D.name}: ${D.what}`);
  Lab.markDone('disc:' + D.id, 10, D.name);
  const sec = {};
  const navItems = [['why', 'Why it exists'], ['people', 'People'], ['time', 'Timeline'], ['archive', 'Pictures'], ['film', 'Film'], ['books', 'Library'], ['docs', 'Documents'], ['data', 'Real data'], ['papers', 'Papers'], ['watch', 'Lectures'], ['labs', 'Hands-on'], ['news', 'News'], ['quiz', 'Quiz'], ['debate', 'Debate']];
  const hero = h('section', { class: 'hero' },
    h('a', { class: 'crumb', href: '#home' }, '← All disciplines'), h('span', { class: 'crumb', style: { opacity: 0.7 } }, '  ·  ' + F.name),
    h('div', { class: 'emoji', style: { marginTop: '10px' } }, D.e), h('h1', null, D.name), h('p', null, D.what),
    h('div', { class: 'row', style: { marginTop: '8px' } }, h('a', { class: 'btn sm primary', href: '#notebook', style: { textDecoration: 'none' } }, '📓 Research Notebook'),
      ['history', 'politics', 'economics', 'geopolitics', 'philosophy', 'sociology'].includes(D.id) ? h('a', { class: 'btn sm primary', href: '#history-modern', style: { textDecoration: 'none' } }, '🌐 Modern world 1700–2026 through the spectrum') : null));
  const nav = h('div', { class: 'tabs', style: { position: 'sticky', top: '58px', zIndex: 20, background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(10px)', padding: '8px 0' } },
    navItems.map(([k, n]) => h('button', { class: 'tab', onclick: () => sec[k] && sec[k].scrollIntoView({ behavior: 'smooth', block: 'start' }) }, n)));
  const body = h('div', { class: 'stack' });
  app.append(hero, nav, body);
  const card = (k, title, ...kids) => { const c = h('div', { class: 'card', style: { scrollMarginTop: '120px' } }, h('h2', { style: { marginTop: 0 } }, title), ...kids); sec[k] = c; return c; };

  // Why + questions + use + links
  body.append(h('div', { class: 'grid g2' },
    card('why', 'Why humans developed it', h('p', null, D.why),
      h('h3', null, 'Big questions'), h('div', { class: 'stack', style: { gap: '6px' } }, D.qs.map((q) => h('button', { class: 'opt', onclick: () => Lab.ask(q + ' Explain from the basics, with who figured it out and how we know.', `${D.name}: ${q}`) }, '✦ ' + q)))),
    h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Why it matters for you'), h('ul', { class: 'small', style: { paddingLeft: '18px', margin: 0 } }, D.use.map((u) => h('li', { style: { marginBottom: '6px' } }, u)))),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'How it connects'), h('div', { class: 'stack', style: { gap: '8px' } }, D.links.map(([lid, how]) => { const L = Lab.disc(lid); return L ? h('a', { href: '#d-' + lid, class: 'row', style: { textDecoration: 'none', color: 'inherit', gap: '10px' } }, h('span', { class: 'tag', style: { '--c': L.c } }, L.e + ' ' + L.name), h('span', { class: 'small muted' }, how)) : null; }))))));

  // People
  const pgrid = h('div', { class: 'grid g3' });
  body.append(card('people', 'The people who built it', h('p', { class: 'small muted' }, 'Real portraits and photographs from Wikimedia Commons. Tap a person to ask the tutor about their life and work.'), pgrid));
  // Timeline
  body.append(card('time', 'How it unfolded', h('div', { class: 'stack', style: { gap: 0, borderLeft: `3px solid ${D.c}`, marginLeft: '8px' } }, D.tl.map(([y, t]) => h('div', { style: { position: 'relative', padding: '8px 0 12px 20px' } },
    h('span', { style: { position: 'absolute', left: '-8px', top: '13px', width: '13px', height: '13px', borderRadius: '50%', background: D.c, border: '3px solid var(--card)' } }),
    h('div', { class: 'tiny', style: { fontWeight: 700, color: D.c, letterSpacing: '.02em' } }, y), h('div', null, t))))));
  // Pictures: archive highlights + the larger gallery
  const agrid = h('div', { class: 'grid g3' });
  const gmore = h('div', { class: 'row', style: { marginTop: '10px' } });
  body.append(card('archive', 'Pictures, documents & artifacts', h('p', { class: 'small muted' }, 'Real photographs, manuscripts, maps, instruments and artworks, old and new. Tap any picture to enlarge it; each one links to its source and license.'), agrid, gmore));
  // Film
  const fbox = h('div');
  body.append(card('film', 'Real film & footage', fbox));
  // Library: the 100-book shelf
  const lbox = h('div');
  body.append(card('books', 'Library', lbox));
  // Primary documents
  const dbox = h('div');
  body.append(card('docs', 'Primary documents', dbox));
  // Real data
  const xbox = h('div');
  body.append(card('data', 'Real data you can explore', xbox));
  // Landmark papers
  const pbox = h('div');
  body.append(card('papers', 'Landmark research papers', pbox));
  // Lectures
  body.append(card('watch', 'Lectures & courses', h('div', { class: 'grid g2' }, D.watch.map(([t, url, who]) => h('a', { href: url, class: 'card', style: { textDecoration: 'none', color: 'inherit', boxShadow: 'none', background: 'var(--card2)' } }, h('div', { class: 'tiny muted' }, '▶ ' + who), h('b', null, t), h('div', { class: 'tiny', style: { color: D.c, marginTop: '4px' } }, 'Opens in a new tab ↗')))),
    h('p', { class: 'tiny muted' }, 'Free lectures and courses from universities and educators. They open outside the Lab.')));
  // Labs
  const arc = Lab.ARC ? Lab.ARC.forDisc(D.id) : [];
  body.append(card('labs', 'Hands-on', D.labs.length ? h('div', null, h('div', { class: 'tiny muted', style: { marginBottom: '6px' } }, 'Big explorers'), h('div', { class: 'row', style: { flexWrap: 'wrap' } }, D.labs.map(([hash, label]) => h('a', { class: 'btn primary', href: '#' + hash, style: { textDecoration: 'none' } }, '▶ ' + label)))) : null,
    arc.length ? h('div', { style: { marginTop: '14px' } }, h('div', { class: 'row' }, h('b', null, `${arc.length} hands-on labs`), h('span', { style: { flex: 1 } }), h('a', { class: 'btn sm', href: '#play-x-' + D.id, style: { textDecoration: 'none' } }, 'Open the lab arcade →')),
      h('div', { class: 'grid g4', style: { marginTop: '8px' } }, arc.map((l) => h('a', { href: '#play-' + l.id, class: 'card', style: { textDecoration: 'none', color: 'inherit', boxShadow: 'none', padding: '12px', background: 'var(--card2)' } }, h('div', { style: { fontSize: '22px' } }, l.e), h('b', { class: 'small' }, l.t), h('div', { class: 'tiny muted' }, l.b))))) : null));
  // News for this discipline
  const nbox = h('div');
  body.append(card('news', 'In the news', nbox));
  // Quiz
  const qbox = h('div');
  body.append(card('quiz', 'Quick quiz', qbox));
  // Debate
  if (D.debate) body.append(card('debate', 'Open question: ' + D.debate.q, h('div', { class: 'grid g2' },
    h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('span', { class: 'tag', style: { '--c': '#2563EB' } }, 'One side'), h('p', { class: 'small' }, D.debate.a)),
    h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('span', { class: 'tag', style: { '--c': '#DC2626' } }, 'The other side'), h('p', { class: 'small' }, D.debate.b))),
    h('div', { class: 'row', style: { marginTop: '8px' } }, h('span', { class: 'small muted' }, 'Where the evidence stands:'), Lab.conf(D.debate.conf), h('span', { class: 'sp' }), h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Give me the strongest evidence on each side of: ${D.debate.q} Then say what would settle it.`, `${D.name} debate`) }, '✦ Dig into the evidence'))));
  else sec.debate = sec.labs;

  // fill images once media is loaded
  Promise.all([Lab.mediaReady, Lab.loadDeep(), Lab.pack(D.id).catch(() => null)]).then(([, X, buf]) => {
    const PM = (X.pmedia || {})[D.id] || {};
    const imgOf = (wt) => { const m = Lab.img(wt); if (!m) return null; return PM[wt] && buf ? { ...m, f: Lab.packUrl(D.id, buf, PM[wt]) } : m; };
    D.people.forEach(([wt, name, yrs, did]) => { const m = imgOf(wt);
      pgrid.append(h('button', { class: 'card', style: { textAlign: 'left', padding: 0, overflow: 'hidden', cursor: 'pointer', boxShadow: 'none', display: 'flex', flexDirection: 'column' }, onclick: () => Lab.ask(`Tell me about ${name} (${yrs}): what they discovered or did, how, why it mattered, and what critics say.`, `${D.name} → ${name}`) },
        m ? h('div', { style: { height: '190px', background: `#111 url("${m.f}") center 22%/cover` }, title: credit(m) }) : h('div', { style: { height: '190px', display: 'grid', placeItems: 'center', fontSize: '54px', background: `linear-gradient(150deg, ${D.c}, color-mix(in srgb, ${D.c} 40%, #0B1026))`, color: '#fff' } }, name.split(' ').map((w) => w[0]).slice(0, 2).join('')),
        h('div', { style: { padding: '12px 14px' } }, h('b', null, name), h('div', { class: 'tiny muted' }, yrs), h('div', { class: 'small', style: { marginTop: '4px' } }, did))));
    });
    D.archive.forEach(([wt, cap]) => { const m = imgOf(wt); if (!m) return;
      agrid.append(h('button', { class: 'card', style: { textAlign: 'left', padding: 0, overflow: 'hidden', cursor: 'zoom-in', boxShadow: 'none' }, onclick: () => lightbox(m.f, wt, cap, m) },
        h('div', { style: { height: '200px', background: `#0B1026 url("${m.f}") center/cover` } }),
        h('div', { style: { padding: '10px 12px' } }, h('div', { class: 'small' }, cap), h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, credit(m)))));
    });
    Lab.loadDeep().then(async (X) => {
      let buf = null; try { buf = await Lab.pack(D.id); } catch (e) {}
      const G = (X.gallery[D.id] || []).filter((g) => buf && g.p).map((g) => ({ ...g, f: Lab.packUrl(D.id, buf, g.p) }));
      const shelf = X.shelves.shelves[D.id]; if (shelf) shelf.covUrl = buf && shelf.cov ? Lab.packUrl(D.id, buf, shelf.cov) : null;
      let shown = 0;
      const more = () => { G.slice(shown, shown + 12).forEach((g) => agrid.append(galleryTile(g))); shown = Math.min(G.length, shown + 12);
        gmore.innerHTML = ''; if (shown < G.length) gmore.append(h('button', { class: 'btn', onclick: more }, `Show more pictures (${G.length - shown} left)`)); };
      more();
      if (!agrid.children.length) agrid.append(h('p', { class: 'muted small' }, 'Images for this discipline are on the way.'));
      drawFilm(X.films[D.id]); drawLibrary(X.shelves); drawPapers(X.papers[D.id] || []);
      drawDocs(X.docs.filter((m) => m.d.includes(D.id))); drawData(X.datasets.filter((m) => m.d.includes(D.id)));
    });
  });

  function galleryTile(g) {
    return h('button', { class: 'card', style: { textAlign: 'left', padding: 0, overflow: 'hidden', cursor: 'zoom-in', boxShadow: 'none' }, onclick: () => lightbox(g.f, g.t, g.d || g.sd || '', g) },
      h('img', { src: g.f, alt: g.t, loading: 'lazy', style: { width: '100%', height: '200px', objectFit: 'cover', display: 'block', background: '#0B1026' } }),
      h('div', { style: { padding: '10px 12px' } }, h('b', { class: 'small' }, g.t), g.sd ? h('div', { class: 'small muted' }, g.sd) : null, h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, credit(g))));
  }

  function drawFilm(F) {
    F = F || { v: [], l: [] };
    fbox.append(h('p', { class: 'small muted' }, 'Real footage from archives and science agencies: early films from the 1890s onward, newsreels, lab recordings and modern clips. Videos load only when you press play.'));
    if (F.v.length) fbox.append(h('div', { class: 'grid g2' }, F.v.map((v) => h('div', { class: 'card', style: { padding: 0, overflow: 'hidden', boxShadow: 'none', background: 'var(--card2)' } },
      h('video', { src: v.u, controls: true, preload: 'metadata', playsinline: true, style: { width: '100%', display: 'block', background: '#000', maxHeight: '300px' } }),
      h('div', { style: { padding: '10px 12px' } }, h('b', { class: 'small' }, v.cap), h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, [v.date, v.dur ? Math.round(v.dur / 60) ? `${Math.round(v.dur / 60)} min` : `${v.dur} s` : '', v.lic, v.artist].filter(Boolean).join(' · ')),
        h('div', { class: 'row', style: { marginTop: '6px' } }, h('a', { class: 'btn sm', href: v.page, style: { textDecoration: 'none' } }, 'Source ↗'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`I just watched real footage: "${v.cap}" (${v.date}). Give me the background: what is happening, why it mattered to ${D.name}, and what came next.`, `${D.name} film`) }, '✦ Background')))))));
    if (F.l.length) fbox.append(h('h3', null, 'Full-length films (open outside the Lab)'), h('div', { class: 'stack', style: { gap: '6px' } }, F.l.map(([t, u]) => h('a', { class: 'row', href: u, style: { textDecoration: 'none', color: 'inherit', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: '12px' } }, '🎞 ', h('span', { class: 'small' }, t), h('span', { class: 'sp' }), h('span', { class: 'tiny', style: { color: D.c } }, 'Watch ↗')))));
    if (!F.v.length && !F.l.length) fbox.append(h('p', { class: 'small' }, 'There is little archival film for this field, so see Lectures & courses below for recorded talks.'));
  }

  function drawLibrary(S) {
    const shelf = (S.shelves[D.id] || { books: [], n: 0 }); const [proName, conName] = S.sides[D.id] || ['Supporters', 'Critics'];
    const rows = Math.max(1, Math.ceil((shelf.n || 0) / 10));
    const TAGS = { start: ['Start here', '#16A34A'], core: ['Core', '#2563EB'], classic: ['Classic', '#9333EA'], world: ['World voices', '#D97706'], for: [proName, '#0891B2'], against: [conName, '#DC2626'] };
    let filter = 'all', q = '', sort = 'shelf', limit = 24;
    const inLab = (Lab.LIB || []).filter((b) => b.d.includes(D.id));
    const chips = h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px' } });
    const search = h('input', { type: 'search', placeholder: 'Search this shelf by title or author…', style: { flex: 1, minWidth: '200px' }, oninput: (e) => { q = e.target.value.toLowerCase(); limit = 24; draw(); } });
    const sorter = h('select', { onchange: (e) => { sort = e.target.value; draw(); } }, h('option', { value: 'shelf' }, 'Suggested order'), h('option', { value: 'old' }, 'Oldest first'), h('option', { value: 'new' }, 'Newest first'), h('option', { value: 'az' }, 'Title A–Z'));
    const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: '14px', marginTop: '12px' } });
    const foot = h('div', { class: 'row', style: { marginTop: '12px' } });
    lbox.append(
      h('p', { class: 'small muted' }, `${shelf.books.length} books chosen to give the whole picture: where to start, the core texts, the classics, voices from around the world, and on the big disputes, the best books on both sides (“${proName}” and “${conName}”).`),
      h('h3', null, 'If you read only a few'),
      h('div', { class: 'stack', style: { gap: '6px' } }, D.books.map(([t, a, y]) => { const b = findBook(t); return h('div', { class: 'row', style: { gap: '10px', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: '12px' } },
        h('div', { style: { flex: 1, minWidth: '180px' } }, h('b', null, t), h('div', { class: 'tiny muted' }, `${a} · ${y}`)),
        b ? h('a', { class: 'btn sm primary', href: '#reading-library-' + b.id, style: { textDecoration: 'none' } }, '📖 Read it here') : h('a', { class: 'btn sm', href: 'https://openlibrary.org/search?q=' + encodeURIComponent(t + ' ' + a.split(/,| and /)[0]) }, 'Find a copy ↗')); })),
      inLab.length ? h('div', null, h('h3', null, `Complete books you can read in the Lab (${inLab.length})`), h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px' } }, inLab.map((b) => h('a', { class: 'chip', href: '#reading-library-' + b.id, style: { textDecoration: 'none', color: 'inherit', '--c': D.c } }, '📖 ' + b.t)))) : null,
      h('h3', null, 'The full shelf'), h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, search, sorter), h('div', { style: { marginTop: '8px' } }, chips), grid, foot,
      h('p', { class: 'tiny muted' }, 'Modern books are under copyright, so “Find” opens the book on Open Library, where many can be borrowed free; your library card also gets free e-books through Libby. Covers from Open Library.'));
    const match = (b) => (filter === 'all' || b[3] === filter || (filter === 'sides' && (b[3] === 'for' || b[3] === 'against'))) && (!q || (b[0] + ' ' + b[1]).toLowerCase().includes(q));
    function drawChips() {
      chips.innerHTML = '';
      const opts = [['all', 'All', D.c], ['start', ...TAGS.start], ['core', ...TAGS.core], ['classic', ...TAGS.classic], ['world', ...TAGS.world], ['sides', 'Both sides of the debate', '#64748B'], ['for', ...TAGS.for], ['against', ...TAGS.against]];
      opts.forEach(([k, n, c]) => { const cnt = shelf.books.filter((b) => k === 'all' || b[3] === k || (k === 'sides' && (b[3] === 'for' || b[3] === 'against'))).length; if (!cnt) return;
        chips.append(h('span', { class: 'chip' + (filter === k ? ' on' : ''), style: { '--c': c }, onclick: () => { filter = k; limit = 24; drawChips(); draw(); } }, h('i'), `${n} (${cnt})`)); });
    }
    function cover(b) {
      const box = { width: '100%', aspectRatio: '2 / 3', borderRadius: '8px', boxShadow: '0 4px 14px rgba(0,0,0,.25)', overflow: 'hidden' };
      if (b[4] != null && shelf.covUrl) { const col = b[4] % 10, row = Math.floor(b[4] / 10);
        return h('div', { style: { ...box, backgroundImage: `url("${shelf.covUrl}")`, backgroundSize: `1000% ${rows * 100}%`, backgroundPosition: `${col / 9 * 100}% ${rows > 1 ? row / (rows - 1) * 100 : 0}%`, backgroundColor: '#222' } }); }
      return h('div', { style: { ...box, background: `linear-gradient(160deg, ${D.c}, color-mix(in srgb, ${D.c} 35%, #0B1026))`, color: '#fff', padding: '12px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
        h('div', { style: { fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: b[0].length > 40 ? '13px' : '15px', lineHeight: 1.2 } }, b[0]), h('div', { class: 'tiny', style: { opacity: 0.85 } }, b[1]));
    }
    function draw() {
      let L = shelf.books.filter(match);
      const Y = (x, d) => (x[2] == null ? d : x[2]);
      if (sort === 'old') L = [...L].sort((a, b) => Y(a, 9999) - Y(b, 9999)); else if (sort === 'new') L = [...L].sort((a, b) => Y(b, -9999) - Y(a, -9999)); else if (sort === 'az') L = [...L].sort((a, b) => a[0].replace(/^(The|A|An) /, '').localeCompare(b[0].replace(/^(The|A|An) /, '')));
      grid.innerHTML = '';
      L.slice(0, limit).forEach((b) => { const [tn, tc] = TAGS[b[3]] || ['', '#888']; const inl = findBook(b[0]);
        const yr = b[2] == null ? '' : b[2] < 0 ? `c. ${-b[2]} BCE` : b[2] < 1500 ? `c. ${b[2]}` : String(b[2]);
        grid.append(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, cover(b),
          h('span', { class: 'tag', style: { '--c': tc, alignSelf: 'flex-start', fontSize: '11px' } }, tn),
          h('b', { class: 'small', style: { lineHeight: 1.25 } }, b[0]), h('div', { class: 'tiny muted' }, yr ? `${b[1]} · ${yr}` : b[1]),
          h('div', { class: 'row', style: { gap: '4px', marginTop: 'auto' } },
            inl ? h('a', { class: 'btn sm primary', href: '#reading-library-' + inl.id, style: { textDecoration: 'none' } }, '📖 Read') : h('a', { class: 'btn sm', href: b[5] ? 'https://openlibrary.org' + b[5] : 'https://openlibrary.org/search?q=' + encodeURIComponent(b[0] + ' ' + b[1]) }, 'Find ↗'),
            h('button', { class: 'btn sm', title: 'Ask the tutor about this book', onclick: () => Lab.ask(`Give me a guide to "${b[0]}" by ${b[1]}${yr ? ` (${yr})` : ''}: its main argument or story, why it matters for ${D.name}, what its strongest critics say, and whether a beginner should read it now or later.`, `${D.name} → ${b[0]}`) }, '✦'))));
      });
      foot.innerHTML = '';
      foot.append(h('span', { class: 'small muted' }, `Showing ${Math.min(limit, L.length)} of ${L.length}`));
      if (L.length > limit) foot.append(h('button', { class: 'btn', onclick: () => { limit += 48; draw(); } }, 'Show more books'), h('button', { class: 'btn', onclick: () => { limit = L.length; draw(); } }, 'Show all'));
      if (!L.length) grid.append(h('p', { class: 'muted small' }, 'No books match that search.'));
    }
    drawChips(); draw();
  }

  function drawDocs(L) {
    if (!L.length) { dbox.append(h('p', { class: 'small muted' }, 'Primary documents for this field are being added. Treaties, constitutions, speeches and laws are in Economics, Politics and Geopolitics so far.')); return; }
    let q = '';
    const list = h('div', { class: 'stack', style: { gap: '6px', marginTop: '8px' } });
    const draw = () => { list.innerHTML = ''; let last = '';
      L.filter((m) => !q || m.t.toLowerCase().includes(q)).forEach((m) => { const era = m.y < 1500 ? 'Ancient & medieval' : m.y < 1700 ? '1500s–1600s' : m.y < 1800 ? '1700s' : m.y < 1900 ? '1800s' : m.y < 1945 ? '1900–1945' : m.y < 2000 ? '1945–1999' : 'Since 2000';
        if (era !== last) { last = era; list.append(h('h3', { style: { margin: '12px 0 4px' } }, era)); }
        list.append(h('button', { class: 'row', style: { gap: '12px', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '12px', background: 'var(--card)', textAlign: 'left', cursor: 'pointer', width: '100%' }, onclick: () => Lab.openDoc(m) },
          h('b', { style: { color: D.c, minWidth: '64px' } }, m.y < 0 ? `${-m.y} BCE` : m.y), h('span', { style: { flex: 1 } }, m.t), h('span', { class: 'tiny muted' }, 'Read →'))); }); };
    dbox.append(h('p', { class: 'small muted' }, `${L.length} original texts you can read in full: treaties, constitutions, laws, declarations, speeches and diplomatic letters, from the Avalon Project at Yale Law School. Reading the real thing, not a summary, is how historians and lawyers work.`),
      h('input', { type: 'search', placeholder: 'Search documents…', style: { width: '100%' }, oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } }), list);
    draw();
  }

  function drawData(L) {
    if (!L.length) { xbox.append(h('p', { class: 'small muted' }, 'Datasets for this field are being added.')); return; }
    xbox.append(h('p', { class: 'small muted' }, `${L.length} real datasets from the people who collect them (Maddison Project, V-Dem, Correlates of War, SIPRI, World Bank, Shiller and others). Pick one, choose countries, and test claims yourself instead of taking anyone’s word for it.`),
      h('div', { class: 'grid g2' }, L.map((m) => h('button', { class: 'card', style: { textAlign: 'left', cursor: 'pointer', boxShadow: 'none', background: 'var(--card2)' }, onclick: () => Lab.openData(m.id) },
        h('b', null, '📈 ' + m.t), h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, m.src), m.about ? h('div', { class: 'small', style: { marginTop: '6px' } }, m.about.slice(0, 180) + (m.about.length > 180 ? '…' : '')) : null))));
  }

  function drawPapers(P) {
    pbox.append(h('p', { class: 'small muted' }, 'The papers and primary documents that changed this field. “Find the paper” searches Google Scholar, which usually shows a free PDF; “Explain” has the tutor walk you through it.'));
    pbox.append(h('div', { class: 'stack', style: { gap: '8px' } }, P.map(([t, au, y, why]) => h('div', { class: 'row', style: { gap: '12px', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '12px', alignItems: 'flex-start' } },
      h('div', { style: { fontWeight: 800, color: D.c, minWidth: '48px' } }, y < 0 ? `${-y} BCE` : y),
      h('div', { style: { flex: 1, minWidth: '200px' } }, h('b', null, t), h('div', { class: 'tiny muted' }, au), h('div', { class: 'small', style: { marginTop: '4px' } }, why)),
      h('div', { class: 'row', style: { gap: '4px' } }, h('a', { class: 'btn sm', href: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(t), style: { textDecoration: 'none' } }, 'Find the paper ↗'),
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Walk me through the landmark paper "${t}" by ${au} (${y}). What problem did it tackle, what did it actually show and how, why was it a turning point for ${D.name}, and what has been challenged or overturned since? Explain for a smart beginner.`, `${D.name} paper`) }, '✦ Explain'))))));
  }

  // news for this discipline from the weekly research feed
  (function news() {
    const status = h('p', { class: 'small muted' }, 'Loading this week’s stories…'); const list = h('div', { class: 'stack' });
    nbox.append(h('p', { class: 'small muted' }, `Stories about ${D.name} from the Lab’s weekly news run, each with sources and a confidence label.`), status, list,
      h('div', { class: 'row' }, h('a', { class: 'btn sm', href: '#news-week', style: { textDecoration: 'none' } }, 'All news →'), h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`What are the most important recent developments in ${D.name}? Separate what is well established from what is still disputed.`, `${D.name} news`) }, '✦ What’s new in this field?')));
    const connect = (db) => { try { db.collection('news').orderBy('date', 'desc').limit(200).onSnapshot((snap) => {
      const items = snap.docs.map((d) => d.data()).filter((x) => x && x.headline && (x.field === D.id || (x.fields || []).includes(D.id)));
      list.innerHTML = '';
      status.textContent = items.length ? `${items.length} stories` : 'No stories tagged to this field yet. They appear here as the weekly run covers it.';
      items.slice(0, 8).forEach((x) => list.append(h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', borderLeft: `4px solid ${D.c}` } },
        h('div', { class: 'row' }, x.confidence ? Lab.conf(x.confidence) : null, h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, x.date || '')),
        h('b', null, x.headline), h('p', { class: 'small' }, x.summary || ''),
        h('div', { class: 'row' }, ...(x.sources || []).slice(0, 3).map((s) => h('a', { class: 'btn sm', href: s.url, style: { textDecoration: 'none' } }, (s.name || 'Source') + ' ↗'))))));
    }, () => { status.textContent = 'The news feed isn’t available in this view.'; }); } catch (e) { status.textContent = 'The news feed isn’t available in this view.'; } };
    if (Lab.db) connect(Lab.db); else { document.addEventListener('lab:db', (e) => connect(e.detail), { once: true }); setTimeout(() => { if (!Lab.db) status.textContent = 'The news feed loads when the Lab is opened on claude.ai while signed in.'; }, 12000); }
  })();

  // quiz from the timeline and people
  let score = 0, n = 0;
  function quiz() {
    qbox.innerHTML = '';
    const usePeople = Math.random() < 0.5 && D.people.length >= 4;
    let prompt, right, opts;
    if (usePeople) { const p = D.people[Math.floor(Math.random() * D.people.length)]; prompt = `Who is known for this? “${p[3]}”`; right = p[1]; opts = Lab.shuffle([right, ...Lab.shuffle(D.people.filter((x) => x !== p).map((x) => x[1])).slice(0, 3)]); }
    else { const ev = D.tl[Math.floor(Math.random() * D.tl.length)]; prompt = `When did this happen? “${ev[1]}”`; right = ev[0]; opts = Lab.shuffle([right, ...Lab.shuffle(D.tl.filter((x) => x !== ev).map((x) => x[0])).slice(0, 3)]); }
    const fb = h('div', { class: 'small', style: { minHeight: '22px', marginTop: '6px' } });
    qbox.append(h('p', { class: 'small muted' }, `Score: ${score} / ${n}`), h('p', null, h('b', null, prompt)), ...opts.map((o) => h('button', { class: 'opt', onclick: (e) => { if (qbox.dataset.a) return; qbox.dataset.a = 1; n++; const ok = o === right; if (ok) { score++; Lab.addXP(3, D.name + ' quiz'); }
      e.target.classList.add(ok ? 'right' : 'wrong'); [...qbox.querySelectorAll('.opt')].forEach((b) => { if (b.textContent === right) b.classList.add('right'); }); fb.textContent = ok ? 'Correct!' : `It was ${right}.`;
      fb.append(' ', h('button', { class: 'btn sm primary', onclick: () => { delete qbox.dataset.a; quiz(); } }, 'Next question →')); } }, o)), fb);
  }
  quiz();
};

// ---------- home: five faculties ----------
Lab.discProgress = (id) => (Lab.isDone('disc:' + id) ? 1 : 0);

// ---------- primary document reader ----------
let docPack = null;
Lab.docText = (id) => (docPack ||= fetch('data/docs3.txt').then((r) => r.text()).then(async (b64) => {
  const bin = atob(b64.replace(/\s+/g, '')); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
})).then((all) => all[id] || '');
function overlay(title, ...kids) {
  const close = () => { bg.remove(); document.removeEventListener('keydown', esc); window.removeEventListener('hashchange', close); };
  const esc = (e) => { if (e.key === 'Escape') close(); };
  const bg = h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(5,6,15,.6)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 12px', overflowY: 'auto' }, onclick: (e) => { if (e.target === bg) close(); } },
    h('div', { class: 'card', style: { maxWidth: '980px', width: '100%', margin: 'auto 0' } }, h('div', { class: 'row' }, h('h2', { style: { margin: 0, flex: 1 } }, title), h('button', { class: 'btn sm', onclick: close }, 'Close ✕')), ...kids));
  document.addEventListener('keydown', esc); window.addEventListener('hashchange', close, { once: true }); document.body.append(bg); return bg;
}
Lab.openDoc = (m) => {
  const body = h('div', { style: { fontFamily: 'Georgia, serif', fontSize: '17px', lineHeight: 1.65, marginTop: '12px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' } }, h('p', { class: 'muted' }, 'Loading the full text…'));
  overlay(m.t,
    h('div', { class: 'row', style: { marginTop: '8px', flexWrap: 'wrap', gap: '6px' } },
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Explain the primary document "${m.t}" (${m.y}). Who wrote it and why, what was happening at the time, what it actually says in plain English, what changed because of it, and how people have argued about it since.`, m.t) }, '✦ Explain this document'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 5 questions on "${m.t}" (${m.y}), then tell me what I missed.`, m.t) }, '✦ Quiz me'),
      h('a', { class: 'btn sm', href: 'https://avalon.law.yale.edu' + m.p, style: { textDecoration: 'none' } }, 'Source: Avalon Project ↗')),
    body);
  Lab.docText(m.id).then((t) => { body.innerHTML = ''; t.split(/\n\s*\n/).forEach((p) => body.append(h('p', null, p))); Lab.markDone('doc:' + m.id, 5, m.t); })
    .catch(() => { body.innerHTML = ''; body.append(h('p', null, 'This document could not be loaded.')); });
};

// ---------- real data explorer ----------
let dsAll = null;
Lab.datasets = () => (dsAll ||= Promise.all([Lab.json('data/ds3.json'), Lab.json('data/ds4.json').catch(() => [])]).then(([a, b]) => a.concat(b)));
const PALETTE = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#7C3AED', '#0891B2', '#DB2777', '#4B5563'];
function lineChart(series, opts = {}) {
  const W = 900, H = 380, m = { l: 64, r: 16, t: 14, b: 34 };
  const pts = series.flatMap((s) => s.pts); if (!pts.length) return h('p', { class: 'muted small' }, 'No data for this choice.');
  let x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
  const log = opts.log && y0 > 0; const fy = (v) => (log ? Math.log10(v) : v);
  if (!log) { y0 = Math.min(0, y0); } let Y0 = fy(y0), Y1 = fy(y1); if (Y1 === Y0) Y1 = Y0 + 1; if (x1 === x0) x1 = x0 + 1;
  const X = (v) => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r), Yp = (v) => H - m.b - (fy(v) - Y0) / (Y1 - Y0) * (H - m.t - m.b);
  const ns = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.width = '100%'; svg.style.height = 'auto';
  const el = (t, a, txt) => { const e = document.createElementNS(ns, t); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; svg.append(e); return e; };
  const fmt = (v) => { const a = Math.abs(v); return a >= 1e12 ? (v / 1e12).toFixed(1) + 'T' : a >= 1e9 ? (v / 1e9).toFixed(1) + 'B' : a >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : a >= 1e4 ? (v / 1e3).toFixed(0) + 'k' : a >= 100 ? v.toFixed(0) : a >= 1 ? v.toFixed(2) : v.toFixed(3); };
  for (let i = 0; i <= 5; i++) { const yv = log ? Math.pow(10, Y0 + (Y1 - Y0) * i / 5) : y0 + (y1 - y0) * i / 5; const yy = Yp(yv);
    el('line', { x1: m.l, x2: W - m.r, y1: yy, y2: yy, stroke: 'currentColor', 'stroke-opacity': 0.12 }); el('text', { x: m.l - 6, y: yy + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'currentColor', 'fill-opacity': 0.7 }, fmt(yv)); }
  const span = x1 - x0, step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000].find((s) => span / s <= 10) || 1000;
  for (let v = Math.ceil(x0 / step) * step; v <= x1; v += step) { el('text', { x: X(v), y: H - 10, 'text-anchor': 'middle', 'font-size': 12, fill: 'currentColor', 'fill-opacity': 0.7 }, v < 0 ? `${-v} BCE` : String(Math.round(v))); }
  series.forEach((s, i) => { if (!s.pts.length) return; let d = ''; let prev = null; s.pts.forEach(([x, y]) => { d += (prev != null && x - prev > (opts.gap || Infinity) ? 'M' : d ? 'L' : 'M') + X(x).toFixed(1) + ',' + Yp(y).toFixed(1); prev = x; });
    el('path', { d, fill: 'none', stroke: PALETTE[i % PALETTE.length], 'stroke-width': 2.2, 'stroke-linejoin': 'round' }); });
  const tip = h('div', { class: 'tiny', style: { minHeight: '18px', marginTop: '4px' } });
  svg.addEventListener('mousemove', (e) => { const r = svg.getBoundingClientRect(); const xv = x0 + ((e.clientX - r.left) / r.width * W - m.l) / (W - m.l - m.r) * (x1 - x0);
    tip.textContent = series.map((s) => { let best = null; for (const p of s.pts) if (!best || Math.abs(p[0] - xv) < Math.abs(best[0] - xv)) best = p; return best ? `${s.name}: ${fmt(best[1])} (${opts.dateLabel ? opts.dateLabel(best[0]) : Math.round(best[0])})` : ''; }).filter(Boolean).join('   ·   '); });
  const legend = h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '10px', marginTop: '6px' } }, series.map((s, i) => h('span', { class: 'small' }, h('span', { style: { display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: PALETTE[i % PALETTE.length], marginRight: '5px', verticalAlign: '-1px' } }), s.name)));
  return h('div', null, svg, legend, tip);
}
Lab.lineChart = lineChart;
Lab.openData = async (id, pre = {}) => {
  const wrap = h('div', null, h('p', { class: 'muted' }, 'Loading data…'));
  const ov = overlay('Real data', wrap);
  let all; try { all = await Lab.datasets(); } catch (e) { wrap.innerHTML = ''; wrap.append(h('p', null, 'The data could not be loaded.')); return; }
  const ds = all.find((d) => d.id === id); ov.querySelector('h2').textContent = ds.t; wrap.innerHTML = '';
  let v = 0, log = false;
  const chartBox = h('div', { style: { marginTop: '10px' } });
  const controls = h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '8px', marginTop: '6px' } });
  const varSel = h('select', { onchange: (e) => { v = +e.target.value; draw(); } }, ds.vars.map((x, i) => h('option', { value: i }, x.name + (x.unit ? ` (${x.unit})` : ''))));
  const logBox = h('label', { class: 'small' }, h('input', { type: 'checkbox', onchange: (e) => { log = e.target.checked; draw(); } }), ' Log scale (shows growth rates as slopes)');
  controls.append(varSel, logBox);
  let picked = [];
  const chips = h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px', marginTop: '8px' } });
  if (ds.kind === 'panel') {
    const has = (e) => ['World', 'United States', 'United States of America', 'China', 'United Kingdom', 'Russia', 'India', 'Germany', 'Japan', 'France'].indexOf(e);
    picked = ds.ents.filter((e) => has(e) >= 0).sort((a, b) => has(a) - has(b)).slice(0, 4); if (!picked.length) picked = ds.ents.slice(0, 3);
    const inp = h('input', { list: 'dsents-' + id, placeholder: 'Add a country or region…', style: { minWidth: '240px' }, onchange: (e) => { const val = e.target.value; if (ds.ents.includes(val) && !picked.includes(val)) { picked.push(val); if (picked.length > 8) picked.shift(); draw(); } e.target.value = ''; } });
    controls.append(inp, h('datalist', { id: 'dsents-' + id }, ds.ents.map((e) => h('option', { value: e }))));
  }
  function draw() {
    chartBox.innerHTML = ''; chips.innerHTML = '';
    let series;
    if (ds.kind === 'panel') {
      const idx = picked.map((e) => ds.ents.indexOf(e));
      series = picked.map((e, i) => ({ name: e, pts: ds.rows.filter((r) => r[0] === idx[i] && r[2 + v] != null && (!log || r[2 + v] > 0)).map((r) => [r[1], r[2 + v]]) }));
      picked.forEach((e, i) => chips.append(h('span', { class: 'chip on', style: { '--c': PALETTE[i % PALETTE.length] }, onclick: () => { picked = picked.filter((x) => x !== e); draw(); } }, h('i'), e + ' ✕')));
      chartBox.append(lineChart(series, { log, gap: 30 }));
    } else {
      const k = ds.vars[v].k; const toX = (d) => { const p = d.split('-'); return +p[0] + ((+(p[1] || 1)) - 1) / 12; };
      series = [{ name: ds.vars[v].name, pts: ds.x.map((d, i) => [toX(d), ds.y[k][i]]).filter((p) => p[1] != null && (!log || p[1] > 0)) }];
      chartBox.append(lineChart(series, { log, dateLabel: (x) => { const y = Math.floor(x); const mo = Math.round((x - y) * 12) + 1; return mo > 1 ? `${y}-${String(mo).padStart(2, '0')}` : String(y); } }));
    }
    Lab.lastData = { t: ds.t, v: ds.vars[v].name, picked: picked.slice(), series };
  }
  const summary = () => (Lab.lastData.series || []).map((s) => { const p = s.pts; if (!p.length) return ''; const a = p[0], b = p[p.length - 1]; const mx = p.reduce((m, x) => (x[1] > m[1] ? x : m), p[0]); return `${s.name}: ${a[1]} in ${Math.round(a[0])}, ${b[1]} in ${Math.round(b[0])}, peak ${mx[1]} in ${Math.round(mx[0])}`; }).join('; ');
  wrap.append(h('p', { class: 'small' }, ds.about || ''), h('div', { class: 'tiny muted' }, 'Source: ', h('a', { href: ds.url }, ds.src), ' · License: ' + ds.lic), controls, chips, chartBox,
    h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px', marginTop: '10px' } },
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`I am looking at real data: "${ds.t}" — ${Lab.lastData.v}. Here is what the chart shows: ${summary()}. Explain what is going on, what events explain the big moves, what the data cannot tell us, and what the strongest competing explanations are.`, ds.t) }, '✦ Explain what I’m seeing'),
      ...(ds.q || []).map((qq) => h('button', { class: 'btn sm', onclick: () => Lab.ask(qq + ` Use the data "${ds.t}" and say what the evidence shows, how confident we can be, and where experts disagree.`, ds.t) }, '? ' + qq)),
      h('button', { class: 'btn sm', onclick: () => { Lab.saveNote && Lab.saveNote({ kind: 'data', title: ds.t, body: `${Lab.lastData.v}: ${summary()}` }); } }, '📓 Save to notebook')));
  if (pre.v != null) { const vi = typeof pre.v === 'number' ? pre.v : ds.vars.findIndex((x) => x.name === pre.v || x.k === pre.v); if (vi >= 0) { v = vi; varSel.value = String(vi); } }
  if (pre.log) { log = true; logBox.querySelector('input').checked = true; }
  if (pre.ents && ds.kind === 'panel') { const ok = pre.ents.filter((e) => ds.ents.includes(e)); if (ok.length) picked = ok; }
  if (pre.note) wrap.insertBefore(h('p', { class: 'small', style: { background: 'var(--soft,#f3f4f6)', padding: '8px 10px', borderRadius: '10px' } }, '🔎 ' + pre.note), controls);
  draw();
};

// ---------- research notebook (saved in this browser) ----------
const NB = 'lab-notebook-v1';
const nbLoad = () => { try { return JSON.parse(localStorage.getItem(NB) || '[]'); } catch (e) { return []; } };
const nbSave = (L) => { try { localStorage.setItem(NB, JSON.stringify(L)); return true; } catch (e) { return false; } };
function toast(msg) { const t = h('div', { style: { position: 'fixed', left: '50%', bottom: '28px', transform: 'translateX(-50%)', background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: '12px', zIndex: 80, boxShadow: '0 8px 24px rgba(0,0,0,.3)' } }, msg); document.body.append(t); setTimeout(() => t.remove(), 2600); }
Lab.saveNote = (n) => { const L = nbLoad(); L.unshift({ id: Date.now(), at: new Date().toISOString().slice(0, 10), ...n }); toast(nbSave(L) ? 'Saved to your Research Notebook' : 'Could not save in this browser'); };
Lab.routes.notebook = function (app) {
  Lab.setContext && Lab.setContext('Research Notebook: the user’s own questions, hypotheses and findings.');
  const list = h('div', { class: 'stack' });
  const f = { q: h('input', { placeholder: 'Your question (e.g. Do tariffs protect jobs?)', style: { width: '100%' } }), hyp: h('textarea', { rows: 2, placeholder: 'Your hypothesis before you look', style: { width: '100%' } }), ev: h('textarea', { rows: 3, placeholder: 'Evidence: data you charted, documents and books you read', style: { width: '100%' } }), con: h('textarea', { rows: 2, placeholder: 'What you concluded, and how confident you are', style: { width: '100%' } }) };
  const draw = () => { list.innerHTML = ''; const L = nbLoad(); if (!L.length) list.append(h('p', { class: 'muted small' }, 'Nothing saved yet. Use “Save to notebook” on any dataset, or write an investigation above.'));
    L.forEach((n) => list.append(h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('div', { class: 'row' }, h('span', { class: 'tag' }, n.kind === 'data' ? '📈 Data' : '🔬 Investigation'), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, n.at)),
      h('b', null, n.title), n.hyp ? h('p', { class: 'small' }, h('b', null, 'Hypothesis: '), n.hyp) : null, h('p', { class: 'small', style: { whiteSpace: 'pre-wrap' } }, n.body), n.con ? h('p', { class: 'small' }, h('b', null, 'Conclusion: '), n.con) : null,
      h('div', { class: 'row', style: { gap: '6px' } }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Review my research note critically. Question: ${n.title}. ${n.hyp ? 'Hypothesis: ' + n.hyp + '.' : ''} Evidence: ${n.body}. ${n.con ? 'Conclusion: ' + n.con + '.' : ''} What does the evidence actually support, what am I missing, what would change my mind, and what should I look at next?`, 'Notebook review') }, '✦ Critique my reasoning'),
        h('button', { class: 'btn sm', onclick: () => { nbSave(nbLoad().filter((x) => x.id !== n.id)); draw(); } }, 'Delete'))))); };
  app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '📓'), h('h1', null, 'Research Notebook'), h('p', null, 'Do your own research: ask a question, write down what you expect, check real data and original documents, then record what you found and how sure you are. Notes are kept in this browser.')),
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'New investigation'), h('div', { class: 'stack', style: { gap: '8px' } }, f.q, f.hyp, f.ev, f.con,
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { if (!f.q.value.trim()) return; Lab.saveNote({ kind: 'inv', title: f.q.value.trim(), hyp: f.hyp.value.trim(), body: f.ev.value.trim(), con: f.con.value.trim() }); Object.values(f).forEach((x) => (x.value = '')); draw(); } }, 'Save investigation')))),
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Saved'), list));
  draw();
};
