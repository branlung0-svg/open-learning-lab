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
    const N = [[24, 'disciplines'], [(Lab.ARC && Lab.ARC.labs.length) || 100, 'hands-on labs'], [400, 'complete books', '+'], [0, 'pictures and films', '+'], [Object.keys(Lab.DEEPDIVES || {}).length + Object.keys(Lab.DISCDIVES || {}).length + 1, 'deep dives']];
    const els = N.map(([, l]) => { const b = h('b'); nums.append(h('div', null, b, h('span', null, l))); return b; });
    Promise.all([Lab.commons(), Lab.MODERN && Lab.MODERN.imgIndex ? Lab.MODERN.imgIndex() : {}]).then(([C, M]) => {
      N[3][0] = Object.keys(C).length + Object.keys(M || {}).length; N.forEach(([n, , s], i) => count(els[i], n, s));
      const P = shuffle(pool(C)); let i = 0; const tiles = [];
      for (let j = 0; j < 12; j++) { const im = h('img', { alt: '', loading: j < 6 ? 'eager' : 'lazy', src: (P[i++] || [, {}])[1].f || '' }); tiles.push(im); mosaic.append(h('div', null, im)); }
      const tick = setInterval(() => { if (!document.body.contains(mosaic)) return clearInterval(tick); const im = tiles[Math.floor(Math.random() * tiles.length)]; const m = (P[i++ % P.length] || [, {}])[1]; if (!m.f) return;
        im.style.opacity = 0; setTimeout(() => { im.src = m.f; im.onload = () => { im.style.opacity = 1; }; }, 700); }, 2600);
    });
    return hero;
  };

  Lab.homeSpotlight = () => {
    const box = h('div', { class: 'card hw-spot' });
    Lab.commons().then((C) => { const P = pool(C).filter(([k, m]) => k.startsWith('c:a-') && (m.desc || m.cap || '').length > 60); if (!P.length) return box.remove();
      const day = Math.floor(Date.now() / 864e5); const [k, m] = P[day % P.length]; const tag = (m.tags || [])[0];
      box.append(h('div', { class: 'hw-spot-img', onclick: () => Lab.lightbox(m) }, h('img', { src: m.f, alt: m.cap || m.desc || m.title })),
        h('div', { class: 'hw-spot-txt' }, h('div', { class: 'hw-kicker dark' }, 'Picture of the day'), h('h2', null, (m.cap || m.desc || m.title).split(/(?<=\.)\s/)[0].slice(0, 140)),
          h('p', { class: 'small muted' }, [m.artist, m.date].filter(Boolean).join(' · ').replace(/date QS:\S*/g, '')),
          h('p', { class: 'small' }, 'Before you read the caption as fact, ask: who made this picture, why, and what can it prove? The same questions historians, journalists and courts use.'),
          h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, h('a', { class: 'btn primary sm', href: '#play-sourcedetective' }, 'Try Source detective'), h('a', { class: 'btn sm', href: '#archive' + (tag ? '-' + tag : '') }, 'More like this →'), h('a', { class: 'btn sm ghost', href: m.page, target: '_blank', rel: 'noopener' }, 'Original ↗')))); });
    return box;
  };

  const DOORS = [['History & power', 'Empires, revolutions, ideologies and how governments really work.', '#history-modern', ['revolutions', 'c:revolutions'], '#B91C1C'], ['The Archive', 'Hundreds of real photographs, posters, documents and films.', '#archive', ['workers'], '#92400E'],
    ['Science & space', 'From atoms to galaxies, with the experiments that proved it.', '#d-physics', ['c:earthspace-hubble-deep-field', 'c:earthspace-earthrise'], '#1D4ED8'], ['Life & medicine', 'Cells, evolution, germs, vaccines and the ethics of experiments.', '#d-biology', ['c:biology-micrographia'], '#16A34A'],
    ['Mind & society', 'Psychology, sociology, anthropology, law.', '#d-sociology', ['c:sociology-booth-map'], '#7C3AED'], ['Arts & ideas', 'Philosophy, religion, literature, art and language.', '#d-arts', ['c:arts-great-wave'], '#CA8A04']];
  Lab.homeDoors = () => { const g = h('div', { class: 'hw-doors' });
    Lab.commons().then((C) => { const P = pool(C); DOORS.forEach(([t, d, href, keys, c]) => { let m = null; for (const k of keys) { m = C[k] || (P.find(([kk, mm]) => (mm.tags || []).includes(k)) || [])[1]; if (m) break; }
      g.append(h('a', { class: 'hw-door', href, style: { '--c': c } }, m ? h('img', { src: m.f, alt: '', loading: 'lazy' }) : null, h('div', { class: 'hw-door-shade' }), h('div', { class: 'hw-door-txt' }, h('b', null, t), h('span', null, d)))); }); });
    return g; };

  // photo headers on discipline cards
  Lab.homeSubjectPhotos = (root) => Lab.commons().then((C) => root.querySelectorAll('a.subj[href^="#d-"]').forEach((a) => { const id = a.getAttribute('href').slice(3); const k = Object.keys(C).find((x) => x.startsWith('c:' + id + '-') && !C[x].graphic); if (!k || a.querySelector('.subj-photo')) return;
    a.prepend(h('div', { class: 'subj-photo', style: { backgroundImage: `url("${C[k].f}")` } })); }));
})();
