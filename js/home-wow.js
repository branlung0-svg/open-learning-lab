// Home page visuals: a cinematic hero built from real archive pictures, picture of the day, photo doors, and photo headers on subject cards.
(function () {
  const h = Lab.h;
  const SAFE = ['workers', 'peasants', 'revolutions', 'cities', 'rights', 'slavery', 'depression', 'science', 'indigenous', 'soviet-life', 'china', 'propaganda', 'empire'];
  const pool = (C) => Object.entries(C).filter(([k, m]) => !m.graphic && !m.video && m.w >= 500 && (k.startsWith('c:a-') ? SAFE.includes((m.tags || [])[0]) : true));
  const shuffle = (a, seed) => { let s = seed || Math.floor(Math.random() * 1e9); const r = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); return a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]); };
  const count = (el, to, suffix) => { const t0 = performance.now(); const step = (t) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString() + (suffix || ''); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };

  Lab.homeHero = ({ greet, nm, lv, kid }) => {
    const mosaic = h('div', { class: 'hw-mosaic' }); const nums = h('div', { class: 'hw-nums' });
    const hero = h('section', { class: 'hw-hero' }, mosaic, h('div', { class: 'hw-shade' }),
      h('div', { class: 'hw-body' },
        h('div', { class: 'hw-kicker' }, `${greet}${nm ? ', ' + nm : ''} · Level ${lv.lv} · free for everyone, ages 10 to 100`),
        h('h1', { class: 'hw-title' }, kid ? 'Explore how the whole world works.' : 'Everything people know, and how we found it out.'),
        h('p', { class: 'hw-sub' }, 'Real photographs, documents, data and film from public archives. Twenty-four disciplines, deep dives into the ideas that shaped the modern world, and labs where you work on real problems.'),
        h('div', { class: 'hw-cta' }, h('a', { class: 'btn primary hw-btn', href: '#learn' }, 'Start the journey →'), h('a', { class: 'btn hw-btn2', href: '#archive' }, 'Explore the Archive'), h('a', { class: 'btn hw-btn2', href: '#home-dives' }, 'Pick a deep dive')),
        nums));
    const N = [[24, 'disciplines'], [(Lab.ARC && Lab.ARC.labs.length) || 100, 'hands-on labs'], [400, 'complete books', '+'], [0, 'pictures and films', '+'], [Math.max(Object.keys(Lab.DIVES_ALL || {}).length, Object.keys(Lab.DEEPDIVES || {}).length + Object.keys(Lab.DISCDIVES || {}).length + 1), 'deep dives']];
    const els = N.map(([, l]) => { const b = h('b'); nums.append(h('div', null, b, h('span', null, l))); return b; });
    Promise.all([Lab.commons(), Lab.MODERN && Lab.MODERN.imgIndex ? Lab.MODERN.imgIndex() : {}]).then(([C, M]) => {
      N[3][0] = Object.keys(C).length + Object.keys(M || {}).length; N.forEach(([n, , s], i) => count(els[i], n, s));
      const P = shuffle(pool(C)); let i = 0; const tiles = [];
      for (let j = 0; j < 12; j++) { const im = h('img', { alt: '', loading: j < 6 ? 'eager' : 'lazy', src: Lab.mediaUrl((P[i++] || [, {}])[1].t || '') }); tiles.push(im); mosaic.append(h('div', null, im)); }
      const tick = setInterval(() => { if (!document.body.contains(mosaic)) return clearInterval(tick); const im = tiles[Math.floor(Math.random() * tiles.length)]; const m = (P[i++ % P.length] || [, {}])[1]; if (!m.f) return;
        im.style.opacity = 0; setTimeout(() => { im.src = Lab.mediaUrl(m.t || m.f); im.onload = () => { im.style.opacity = 1; }; }, 700); }, 2600);
    });
    return hero;
  };

  Lab.homeSpotlight = () => {
    const box = h('div', { class: 'card hw-spot' });
    Lab.commons().then((C) => { const P = pool(C).filter(([k, m]) => k.startsWith('c:a-') && (m.desc || m.cap || '').length > 60); if (!P.length) return box.remove();
      const day = Math.floor(Date.now() / 864e5); const [k, m] = P[day % P.length]; const tag = (m.tags || [])[0];
      box.append(h('div', { class: 'hw-spot-img', onclick: () => Lab.lightbox(m) }, h('img', { src: Lab.mediaUrl(m.f), alt: m.cap || m.desc || m.title })),
        h('div', { class: 'hw-spot-txt' }, h('div', { class: 'hw-kicker dark' }, 'Picture of the day'), h('h2', null, (m.cap || m.desc || m.title).split(/(?<=\.)\s/)[0].slice(0, 140)),
          h('p', { class: 'small muted' }, [m.artist, m.date].filter(Boolean).join(' · ').replace(/date QS:\S*/g, '')),
          h('p', { class: 'small' }, 'Before you read the caption as fact, ask: who made this picture, why, and what can it prove? The same questions historians, journalists and courts use.'),
          h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, h('a', { class: 'btn primary sm', href: '#play-sourcedetective' }, 'Try Source detective'), h('a', { class: 'btn sm', href: '#archive' + (tag ? '-' + tag : '') }, 'More like this →'), h('a', { class: 'btn sm ghost', href: m.page, target: '_blank', rel: 'noopener' }, 'Original ↗')))); });
    return box;
  };

  const DOORS = [['History & power', 'Empires, revolutions, ideologies and how governments really work.', '#history-modern', ['revolutions', 'c:revolutions'], '#B91C1C'], ['The Archive', 'Hundreds of real photographs, posters, documents and films.', '#archive', ['workers'], '#92400E'],
    ['Science & space', 'From atoms to galaxies, with the experiments that proved it.', '#d-physics', ['c:earthspace-hubble-deep-field', 'c:earthspace-earthrise'], '#1D4ED8'], ['Life & medicine', 'Cells, evolution, germs, vaccines and the ethics of experiments.', '#d-biology', ['c:biology-micrographia'], '#16A34A'],
    ['Every country', 'All 196 countries: land, history, government and life in real data.', '#countries', ['c:a-nature-himalaya-everest-1', 'nature', 'cities'], '#0F766E'], ['Mind & society', 'Psychology, sociology, anthropology, law.', '#d-sociology', ['c:sociology-booth-map'], '#7C3AED'], ['Arts & ideas', 'Philosophy, religion, literature, art and language.', '#d-arts', ['c:arts-great-wave'], '#CA8A04']];
  Lab.homeDoors = () => { const g = h('div', { class: 'hw-doors' });
    Lab.commons().then((C) => { const P = pool(C); DOORS.forEach(([t, d, href, keys, c]) => { let m = null; for (const k of keys) { m = C[k] || (P.find(([kk, mm]) => (mm.tags || []).includes(k)) || [])[1]; if (m) break; }
      g.append(h('a', { class: 'hw-door', href, style: { '--c': c } }, m ? h('img', { src: Lab.mediaUrl(m.t || m.f), alt: '', loading: 'lazy' }) : null, h('div', { class: 'hw-door-shade' }), h('div', { class: 'hw-door-txt' }, h('b', null, t), h('span', null, d)))); }); });
    return g; };

  // ---- photo heroes and photo strips used across the whole Lab ----
  const urlOf = (k, C) => (/^[cv]:/.test(k) ? Promise.resolve(C[k] ? Lab.mediaUrl(C[k].t || C[k].f) : null) : (Lab.MODERN && Lab.MODERN.img ? Lab.MODERN.img(k).then((r) => (r ? r.url : null)).catch(() => null) : Promise.resolve(null)));
  const ROUTE_TAGS = { archive: SAFE, play: ['science', 'workers'], arcade: ['science', 'workers'], labs: ['science'], connect: ['science', 'cities'], learn: SAFE, reading: ['propaganda', 'revolutions', 'rights'], sources: ['propaganda', 'rights', 'revolutions'], history: ['revolutions', 'empire', 'workers', 'cities', 'rights'], review: ['science'], notebook: ['science', 'cities'], settings: ['cities'], ged: ['science', 'cities'] };
  // keys: preferred image keys; prefix: commons key prefix; tags: archive tags. Fills up to 6 tiles.
  const poolFor = (C, { keys, prefix, tags }) => { const P = pool(C); let out = (keys || []).filter((k) => !/^[cv]:/.test(k) || (C[k] && !C[k].graphic && !C[k].video));
    if (prefix) out = out.concat(shuffle(P.filter(([k]) => k.startsWith(prefix)).map(([k]) => k)));
    if (out.length < 6) { const T = tags && tags.length ? tags : SAFE; out = out.concat(shuffle(P.filter(([k, m]) => T.some((t) => (m.tags || []).includes(t) || k.startsWith('c:a-' + t + '-'))).map(([k]) => k))); }
    return [...new Set(out)]; };
  Lab.photoize = (el, opts = {}) => { if (!el || el.classList.contains('hero-photo')) return el; el.classList.add('hero-photo'); if (opts.color) el.style.setProperty('--hp', opts.color);
    const mosaic = h('div', { class: 'hp-mosaic' }); el.prepend(mosaic, h('div', { class: 'hp-shade' }));
    Lab.commons().then((C) => { const ks = poolFor(C, opts); const tiles = []; let i = 0; const n = Math.min(6, ks.length);
      for (let j = 0; j < n; j++) { const im = h('img', { alt: '', loading: j < 3 ? 'eager' : 'lazy' }); tiles.push(im); mosaic.append(h('div', null, im)); urlOf(ks[i++], C).then((u) => { if (u) im.src = u; else im.parentNode.remove(); }); }
      if (!n) { el.classList.add('hp-empty'); return; }
      if (ks.length > n) { const tick = setInterval(() => { if (!document.body.contains(mosaic)) return clearInterval(tick); const im = tiles[Math.floor(Math.random() * tiles.length)]; const k = ks[i++ % ks.length];
        urlOf(k, C).then((u) => { if (!u) return; im.style.opacity = 0; setTimeout(() => { im.src = u; im.onload = () => { im.style.opacity = 1; }; }, 600); }); }, 3200); } });
    return el; };
  Lab.enhanceHeroes = (sid, eid) => document.querySelectorAll('#app section.hero:not(.hero-photo):not([data-own])').forEach((el) => {
    if (sid === 'd' && eid) return Lab.photoize(el, { prefix: 'c:' + eid + '-', tags: ['science'] });
    Lab.photoize(el, { tags: ROUTE_TAGS[sid] || SAFE }); });
  // a row of captioned photos; tap to enlarge
  Lab.photoStrip = (opts = {}) => { const box = h('div', { class: 'pstrip' });
    Lab.commons().then((C) => { let ks = (opts.keys || []).filter((k) => C[k] && !C[k].video); if (opts.prefix) ks = ks.concat(Object.keys(C).filter((k) => k.startsWith(opts.prefix) && !C[k].video));
      ks = [...new Set(ks)]; if (ks.length < 2) return box.remove(); const n = Math.min(opts.n || 4, ks.length); const off = ((opts.offset || 0) * n) % ks.length;
      for (let j = 0; j < n; j++) { const k = ks[(off + j) % ks.length]; const m = C[k]; const cap = (m.cap || m.desc || m.title || '').replace(/\.(jpe?g|png|tiff?)$/i, '').split(/(?<=\.)\s/)[0].slice(0, 90);
        const blur = m.graphic && Lab.graphicMode && Lab.graphicMode() !== 'show';
        if (m.graphic && Lab.graphicMode && Lab.graphicMode() === 'hide') continue;
        box.append(h('button', { class: 'pstrip-item' + (blur ? ' blur' : ''), title: cap, onclick: (e) => { const b = e.currentTarget; if (b.classList.contains('blur')) { b.classList.remove('blur'); return; } Lab.lightbox(m); } }, h('img', { src: Lab.mediaUrl(m.t || m.f), alt: cap, loading: 'lazy' }), h('span', null, cap))); }
      if (!box.children.length) box.remove(); });
    return box; };

  // photo headers on discipline cards
  Lab.homeSubjectPhotos = (root) => Lab.commons().then((C) => root.querySelectorAll('a.subj[href^="#d-"]').forEach((a) => { const id = a.getAttribute('href').slice(3); const k = Object.keys(C).find((x) => x.startsWith('c:' + id + '-') && !C[x].graphic); if (!k || a.querySelector('.subj-photo')) return;
    a.prepend(h('div', { class: 'subj-photo', style: { backgroundImage: `url("${Lab.mediaUrl(C[k].t || C[k].f)}")` } })); }));
})();
