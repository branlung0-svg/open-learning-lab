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
        h('div', { class: 'small', style: { opacity: 0.8 } }, [m.artist, m.license, m.date].filter(Boolean).join(' · '), ' · ', h('a', { href: m.page, target: '_blank', rel: 'noopener', style: { color: '#93C5FD' } }, 'Source and licence ↗'), Lab.translateText ? [' · ', h('a', { href: Lab.translateText([m.cap || m.title, m.desc].filter(Boolean).join('\n\n')), target: '_blank', rel: 'noopener', style: { color: '#93C5FD' } }, 'Translate caption ↗')] : null),
        h('button', { class: 'btn sm', style: { marginTop: '10px' }, onclick: () => ov.remove() }, 'Close')));
    document.body.append(ov); const esc = (e) => { if (e.key === 'Escape') { ov.remove(); removeEventListener('keydown', esc); } }; addEventListener('keydown', esc);
  };
  // A captioned figure. opts: { max: '320px', cap: 'override caption', fit: 'cover' }
  Lab.cfig = (key, opts = {}) => {
    const box = h('figure', { class: 'cfig', style: { margin: opts.margin || '0 0 10px', display: 'none' } });
    Lab.commons().then((C) => { const m = C[key]; if (!m) return; const gm = m.graphic && Lab.graphicMode ? Lab.graphicMode() : 'show'; if (gm === 'hide') return; box.style.display = 'block';
      const media = h('div', { style: { position: 'relative', cursor: 'zoom-in', overflow: 'hidden', borderRadius: '10px' }, onclick: () => Lab.lightbox(Object.assign({}, m, opts.cap ? { cap: opts.cap } : {})) },
        h('img', { src: Lab.mediaUrl(opts.full ? m.f : m.t || m.f), alt: opts.cap || m.cap || m.title, loading: 'lazy', onerror: (e) => { const im = e.target; if (!im.dataset.r) { im.dataset.r = 1; im.src = /^https?:/.test(m.f) ? m.f : SITE + m.f; } else box.style.display = 'none'; }, style: { width: '100%', height: opts.max || '300px', objectFit: opts.fit || 'cover', borderRadius: '10px', display: 'block', background: '#111' } }),
        m.video ? h('span', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '46px', color: '#fff', textShadow: '0 2px 10px #000' } }, '▶') : null);
      if (gm === 'blur') { const im = media.querySelector('img'); im.style.filter = 'blur(22px) grayscale(.6)'; const cover = h('button', { class: 'btn sm', style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 2 }, onclick: (e) => { e.stopPropagation(); im.style.filter = ''; cover.remove(); } }, '⚠️ War or violence: tap to view'); media.append(cover); }
      box.append(media, h('figcaption', { class: 'small', style: { marginTop: '6px' } }, (opts.cap || m.cap || m.desc || m.title.replace(/\.[a-z0-9]+$/i, '')).slice(0, 220)), credit(m)); });
    return box;
  };

  // A swipeable picture carousel: arrows, swipe, keyboard, counter, thumbnails; tap the picture to enlarge.
  // keys: c:/v: archive keys or modern-pack keys (ev:, ml:, sys:). opts.words: also pull archive pictures whose
  // title or description mentions any of these words. opts.max: cap on pictures (default 24).
  const LEADERS = /\b(lenin|stalin|trotsky|hitler|mussolini|franco|mao zedong|castro|guevara|kim il|kim jong|tito|pinochet|allende|salazar|p[eé]tain|gandhi|nasser|sukarno|suharto|yeltsin|reagan|thatcher|churchill|roosevelt|truman|kennedy|nixon|ho chi minh|deng xiaoping|xi jinping|putin|leopold ii|portrait)\b/i;
  // Country pictures, organized: only pictures filed under this country (and place-checked by tools/place_check.py), grouped
  // by theme in a fixed order. Old photographs run oldest first. No loose word matching, which used to pull in China, Maine.
  const CTAG = { chn: ['china'], usa: ['usa'], gbr: ['britain'], cub: ['cuba'], vnm: ['vietnam'], ind: ['india'], jpn: ['japan'], rus: ['soviet-life'] };
  const THEMES = [['heritage', 'Heritage and landmarks'], ['city', 'Cities'], ['land', 'Land and nature'], ['life', 'Daily life'], ['hist', 'History in photographs, oldest first']];
  const yearOf = (m) => { const y = String(m.date || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/) || String(m.title || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/); return y ? +y[1] : null; };
  const themeOf = (k, m) => { const t = k.match(/-(heritage|city|land|life|hist)-/); if (t) return t[1];
    const x = [k, m.title, m.desc, m.cap].join(' '); const y = yearOf(m);
    if ((y && y < 1975) || /historical|\b1[89]\d0s\b|old photograph|dynasty photograph|soviet-life/i.test(x + ' ' + (m.tags || []).join(' '))) return 'hist';
    if (/landscape|mountain|\blake\b|river|valley|desert|forest|beach|coast|island|national park|karst|glacier|waterfall|terrace|grassland|plateau|canyon|gorge|volcano|savanna|nature|reef|fjord|wildlife/i.test(x)) return 'land';
    if (/temple|palace|mosque|church|cathedral|monastery|pagoda|\bfort\b|castle|ruins|tomb|great wall|shrine|heritage|unesco|ancient|old town|mausoleum|monument/i.test(x)) return 'heritage';
    if (/market|people|children|farmer|worker|festival|school|food|dance|village|fisher|bazaar|nomad|family|wedding|harvest|daily life|hutong|bicycle/i.test(x)) return 'life';
    return 'city'; };
  Lab.countryPictureKeys = async (iso) => { const C = await Lab.commons(); const tags = CTAG[iso] || [];
    const keys = Object.keys(C).filter((k) => { const m = C[k]; if (!m || m.kind !== 'image') return false;
      if (LEADERS.test((m.title || '') + ' ' + (m.cap || ''))) return false;
      return k.startsWith('c:k-' + iso + '-') || (tags.length && tags.includes((m.tags || [])[0])); });
    const rank = (k) => (/-(fp|qi)-\d+$/.test(k) ? 0 : /-(heritage|city|land|life|hist)-/.test(k) ? 1 : k.startsWith('c:a-') ? 2 : 3);
    const groups = {}; keys.forEach((k) => (groups[themeOf(k, C[k])] ||= []).push(k));
    Object.entries(groups).forEach(([t, ks]) => ks.sort(t === 'hist' ? (a, b) => (yearOf(C[a]) || 9999) - (yearOf(C[b]) || 9999) || a.localeCompare(b) : (a, b) => rank(a) - rank(b) || a.localeCompare(b)));
    return groups; };
  Lab.countryPictures = (c, opts = {}) => { const box = h('div', { class: 'stack' }, h('p', { class: 'small muted', style: { margin: 0 } }, 'Loading pictures…'));
    Lab.countryPictureKeys(c.id).then((G) => { const total = Object.values(G).reduce((a, b) => a + b.length, 0);
      if (!total) { box.replaceChildren(h('p', { class: 'small muted', style: { margin: 0 } }, 'No checked pictures of ' + c.n + ' yet.')); return; }
      const parts = [h('p', { class: 'tiny muted', style: { margin: 0 } }, total + ' pictures of ' + c.n + ', each checked against where it was taken (camera location or Commons categories). Credits under each picture.')];
      if (opts.highlights) { const hl = THEMES.flatMap(([t]) => (G[t] || []).slice(0, 4)).slice(0, opts.highlights);
        parts.push(Lab.carousel(hl, { max: opts.highlights })); }
      else THEMES.forEach(([t, name]) => { if (G[t] && G[t].length) parts.push(h('h4', { style: { margin: '10px 0 2px' } }, name + ' · ' + G[t].length), Lab.carousel(G[t], { max: 60 })); });
      box.replaceChildren(...parts); });
    return box; };
  Lab.carousel = (keys, opts = {}) => {
    const root = h('div', { class: 'car', tabindex: '0' });
    Lab.commons().then(async (C) => {
      const gm = Lab.graphicMode ? Lab.graphicMode() : 'show';
      let ks = (keys || []).filter(Boolean);
      if (opts.prefix) ks = ks.concat(Object.keys(C).filter((k) => k.startsWith(opts.prefix)).sort(() => Math.random() - 0.5));
      if (opts.words && opts.words.length) { const re = new RegExp('\\b(' + opts.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i');
        const yr = (m) => { const y = String(m.date || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/) || String(m.title || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/); return y ? +y[1] : null; };
        const hit = Object.entries(C).filter(([k, m]) => !ks.includes(k) && !k.includes('-x-') && re.test([m.title, m.cap].join(' ')) && !LEADERS.test(m.title + ' ' + (m.cap || '')) && !(opts.since && yr(m) && yr(m) < opts.since - 5) && !(opts.until && yr(m) && yr(m) > opts.until + 5)).map(([k]) => k);
        ks = ks.concat(hit.sort((a, b) => (b.startsWith('c:a-') - a.startsWith('c:a-')))); }
      const items = [];
      for (const k of [...new Set(ks)]) { if (items.length >= (opts.max || 24)) break;
        if (/^[cv]:/.test(k)) { const m = C[k]; if (!m || (m.graphic && gm === 'hide')) continue; items.push({ k, m, src: Lab.mediaUrl(innerWidth < 760 ? (m.t || m.f) : m.f), thumb: Lab.mediaUrl(m.t || m.f), cap: (opts.caps && opts.caps[k]) || m.cap || m.desc || (m.title || '').replace(/\.[a-z0-9]+$/i, ''), graphic: m.graphic && gm === 'blur' }); }
        else if (Lab.MODERN && Lab.MODERN.img) { const r = await Lab.MODERN.img(k); if (r) items.push({ k, src: r.url, thumb: r.url, cap: r.t, credit: r.c }); } }
      if (!items.length) { root.remove(); return; }
      let i = 0; const seen = new Set();
      const img = h('img', { alt: '' }); const veil = h('button', { class: 'car-veil' }, '⚠️ War or violence: tap to view');
      const count = h('span', { class: 'car-count' }); const cap = h('div', { class: 'small car-cap' }); const cred = h('div', { class: 'tiny muted' });
      const thumbs = h('div', { class: 'car-thumbs' });
      const frame = h('div', { class: 'car-frame' }, img, veil, count, h('span', { class: 'car-zoom' }, '⤢'));
      const go = (j) => { i = (j + items.length) % items.length; const it = items[i]; img.src = it.src; img.alt = (it.cap || '').slice(0, 120);
        const hidden = !!(it.graphic && !seen.has(i)); img.classList.toggle('blur', hidden); veil.style.display = hidden ? '' : 'none';
        count.textContent = `${i + 1} / ${items.length}`; cap.textContent = (it.cap || '').slice(0, 260);
        cred.replaceChildren(it.m ? credit(it.m) : h('span', null, it.credit || ''));
        thumbs.querySelectorAll('button').forEach((b, n) => b.classList.toggle('on', n === i)); const tb = thumbs.children[i]; if (tb) Lab.centerInRow(tb);
        const nx = items[(i + 1) % items.length]; if (nx) { const pre = new Image(); pre.src = nx.src; } };
      veil.onclick = (e) => { e.stopPropagation(); seen.add(i); go(i); };
      img.onclick = () => { const it = items[i]; if (it.m) Lab.lightbox(Object.assign({}, it.m, { cap: it.cap })); else window.open(it.src, '_blank'); };
      img.onerror = () => { const it = items[i]; if (it.m && !img.dataset.r) { img.dataset.r = 1; img.src = /^https?:/.test(it.m.f) ? it.m.f : SITE + it.m.f; } };
      img.onload = () => { img.dataset.r = ''; };
      const many = items.length > 1;
      if (many) { frame.append(h('button', { class: 'car-btn prev', 'aria-label': 'Previous picture', onclick: (e) => { e.stopPropagation(); go(i - 1); } }, '‹'), h('button', { class: 'car-btn next', 'aria-label': 'Next picture', onclick: (e) => { e.stopPropagation(); go(i + 1); } }, '›'));
        items.forEach((it, n) => thumbs.append(h('button', { 'aria-label': 'Picture ' + (n + 1), onclick: () => go(n) }, h('img', { src: it.thumb, alt: '', loading: 'lazy', class: it.graphic ? 'blur' : '' }))));
        let x0 = null; frame.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
        frame.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); });
        root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }); }
      root.append(...[opts.label !== false ? h('div', { class: 'tiny muted car-label' }, `📷 ${items.length} picture${many ? 's' : ''}${many ? ' · swipe or use the arrows · tap to enlarge' : ' · tap to enlarge'}`) : null, frame, cap, cred, many ? thumbs : null].filter(Boolean));
      go(0); });
    return root;
  };
  // A grid of figures: keys = ['c:x', 'v:y', ...]
  Lab.cgrid = (keys, opts = {}) => h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${opts.min || '240px'}, 1fr))`, gap: '14px' } }, keys.map((k) => Lab.cfig(k, { max: opts.max || '200px' })));
})();
