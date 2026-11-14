// Pictures and archival film from Wikimedia Commons (fetched by tools/fetch_commons.py; credits in data/commons.json).
(function () {
  const h = Lab.h; let P = null; const SITE = 'https://branlung0-svg.github.io/open-learning-lab/';
  // in the claude.ai version the picture files live on the public site
  Lab.mediaUrl = (p) => (!p || /^https?:/.test(p) || !/claude|anthropic|usercontent/.test(location.hostname) ? p : SITE + p);
  Lab.commons = () => (P ||= fetch('data/commons.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  const tidy = (x) => { x = String(x || '').replace(/date QS:\S*/g, '').replace(/\s+/g, ' ').trim(); const half = x.length / 2; return x.length > 9 && x.length % 2 === 0 && x.slice(0, half) === x.slice(half) ? x.slice(0, half) : x; };
  const credit = (m) => h('div', { class: 'tiny muted', style: { marginTop: '3px' } }, [tidy(m.artist), m.license, tidy(m.date)].filter(Boolean).join(' · ') + ' · ', h('a', { href: m.page, target: '_blank', rel: 'noopener' }, 'Wikimedia Commons ↗'));
  Lab.lightbox = (m) => {
    const ov = h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(10,12,20,.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }, onclick: (e) => { if (e.target === ov) ov.remove(); } },
      h('div', { style: { maxWidth: '1100px', width: '100%', color: '#fff' } },
        m.video ? h('video', { src: m.video, poster: Lab.mediaUrl(m.f), controls: true, autoplay: true, style: { width: '100%', maxHeight: '75vh', background: '#000' } }) : h('img', { src: Lab.mediaUrl(m.f), alt: m.cap || m.title, style: { width: '100%', maxHeight: '75vh', objectFit: 'contain' } }),
        h('p', { style: { margin: '10px 0 4px' } }, m.cap || m.title), m.desc ? h('p', { class: 'small', style: { opacity: 0.75, margin: '0 0 4px' } }, m.desc) : null,
        h('div', { class: 'small', style: { opacity: 0.8 } }, [m.artist, m.license, m.date].filter(Boolean).join(' · '), ' · ', h('a', { href: m.page, target: '_blank', rel: 'noopener', style: { color: '#93C5FD' } }, 'Source and licence ↗')),
        h('button', { class: 'btn sm', style: { marginTop: '10px' }, onclick: () => ov.remove() }, 'Close')));
    document.body.append(ov); const esc = (e) => { if (e.key === 'Escape') { ov.remove(); removeEventListener('keydown', esc); } }; addEventListener('keydown', esc);
  };
  // A captioned figure. opts: { max: '320px', cap: 'override caption', fit: 'cover' }
  Lab.cfig = (key, opts = {}) => {
    const box = h('figure', { class: 'cfig', style: { margin: opts.margin || '0 0 10px', display: 'none' } });
    Lab.commons().then((C) => { const m = C[key]; if (!m) return; const gm = m.graphic && Lab.graphicMode ? Lab.graphicMode() : 'show'; if (gm === 'hide') return; box.style.display = 'block';
      const media = h('div', { style: { position: 'relative', cursor: 'zoom-in', overflow: 'hidden', borderRadius: '10px' }, onclick: () => Lab.lightbox(Object.assign({}, m, opts.cap ? { cap: opts.cap } : {})) },
        h('img', { src: Lab.mediaUrl(opts.full ? m.f : m.t || m.f), alt: opts.cap || m.cap || m.title, loading: 'lazy', onerror: (e) => { const im = e.target; if (!im.dataset.r) { im.dataset.r = 1; im.src = SITE + m.f; } else box.style.display = 'none'; }, style: { width: '100%', height: opts.max || '300px', objectFit: opts.fit || 'cover', borderRadius: '10px', display: 'block', background: '#111' } }),
        m.video ? h('span', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '46px', color: '#fff', textShadow: '0 2px 10px #000' } }, '▶') : null);
      if (gm === 'blur') { const im = media.querySelector('img'); im.style.filter = 'blur(22px) grayscale(.6)'; const cover = h('button', { class: 'btn sm', style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 2 }, onclick: (e) => { e.stopPropagation(); im.style.filter = ''; cover.remove(); } }, '⚠️ War or violence: tap to view'); media.append(cover); }
      box.append(media, h('figcaption', { class: 'small', style: { marginTop: '6px' } }, (opts.cap || m.cap || m.desc || m.title.replace(/\.[a-z0-9]+$/i, '')).slice(0, 220)), credit(m)); });
    return box;
  };
  // A grid of figures: keys = ['c:x', 'v:y', ...]
  Lab.cgrid = (keys, opts = {}) => h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${opts.min || '240px'}, 1fr))`, gap: '14px' } }, keys.map((k) => Lab.cfig(k, { max: opts.max || '200px' })));
})();
