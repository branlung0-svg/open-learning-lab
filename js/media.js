// Pictures and archival film from Wikimedia Commons (fetched by tools/fetch_commons.py; credits in data/commons.json).
(function () {
  const h = Lab.h; let P = null;
  Lab.commons = () => (P ||= fetch('data/commons.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  const credit = (m) => h('div', { class: 'tiny muted', style: { marginTop: '3px' } }, [m.artist, m.license, m.date].filter(Boolean).join(' · ') + ' · ', h('a', { href: m.page, target: '_blank', rel: 'noopener' }, 'Wikimedia Commons ↗'));
  Lab.lightbox = (m) => {
    const ov = h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(10,12,20,.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }, onclick: (e) => { if (e.target === ov) ov.remove(); } },
      h('div', { style: { maxWidth: '1100px', width: '100%', color: '#fff' } },
        m.video ? h('video', { src: m.video, poster: m.f, controls: true, autoplay: true, style: { width: '100%', maxHeight: '75vh', background: '#000' } }) : h('img', { src: m.f, alt: m.cap || m.title, style: { width: '100%', maxHeight: '75vh', objectFit: 'contain' } }),
        h('p', { style: { margin: '10px 0 4px' } }, m.cap || m.title), m.desc ? h('p', { class: 'small', style: { opacity: 0.75, margin: '0 0 4px' } }, m.desc) : null,
        h('div', { class: 'small', style: { opacity: 0.8 } }, [m.artist, m.license, m.date].filter(Boolean).join(' · '), ' · ', h('a', { href: m.page, target: '_blank', rel: 'noopener', style: { color: '#93C5FD' } }, 'Source and licence ↗')),
        h('button', { class: 'btn sm', style: { marginTop: '10px' }, onclick: () => ov.remove() }, 'Close')));
    document.body.append(ov); const esc = (e) => { if (e.key === 'Escape') { ov.remove(); removeEventListener('keydown', esc); } }; addEventListener('keydown', esc);
  };
  // A captioned figure. opts: { max: '320px', cap: 'override caption', fit: 'cover' }
  Lab.cfig = (key, opts = {}) => {
    const box = h('figure', { class: 'cfig', style: { margin: opts.margin || '0 0 10px', display: 'none' } });
    Lab.commons().then((C) => { const m = C[key]; if (!m) return; box.style.display = 'block';
      const media = h('div', { style: { position: 'relative', cursor: 'zoom-in' }, onclick: () => Lab.lightbox(Object.assign({}, m, opts.cap ? { cap: opts.cap } : {})) },
        h('img', { src: m.f, alt: opts.cap || m.cap || m.title, loading: 'lazy', style: { width: '100%', height: opts.max || '300px', objectFit: opts.fit || 'cover', borderRadius: '10px', display: 'block', background: '#111' } }),
        m.video ? h('span', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '46px', color: '#fff', textShadow: '0 2px 10px #000' } }, '▶') : null);
      box.append(media, h('figcaption', { class: 'small', style: { marginTop: '6px' } }, opts.cap || m.cap || m.title), credit(m)); });
    return box;
  };
  // A grid of figures: keys = ['c:x', 'v:y', ...]
  Lab.cgrid = (keys, opts = {}) => h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${opts.min || '240px'}, 1fr))`, gap: '14px' } }, keys.map((k) => Lab.cfig(k, { max: opts.max || '200px' })));
})();
