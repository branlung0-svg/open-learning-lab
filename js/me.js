// Personalization: save anything, pick up where you left off, "For you" suggestions from your interests,
// and customization (text size, graphic pictures, explanation depth, language) in one place: #me ("My Lab").
(function () {
  const h = Lab.h;
  const PUBLIC = 'https://branlung0-svg.github.io/open-learning-lab/';
  const st = () => { const s = Lab.state; s.saved = s.saved || {}; return s; };

  // ---------------------------------------------------------------- save / bookmark
  Lab.isSaved = (href) => !!st().saved[href];
  Lab.toggleSave = (href, title, kind) => { const s = st(); if (s.saved[href]) delete s.saved[href]; else s.saved[href] = { t: title, kind: kind || '', at: Date.now() }; Lab.save(); if (Lab.toast) Lab.toast(s.saved[href] ? 'Saved to My Lab' : 'Removed from My Lab'); return !!s.saved[href]; };
  Lab.saveButton = (href, title, kind) => { const b = h('button', { class: 'btn sm save-btn', 'aria-pressed': String(Lab.isSaved(href)) });
    const paint = () => { const on = Lab.isSaved(href); b.textContent = on ? '★ Saved' : '☆ Save'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on); };
    b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); Lab.toggleSave(href, title, kind); paint(); }; paint(); return b; };

  // ---------------------------------------------------------------- translation
  Lab.LANGS = [['en', 'English'], ['es', 'Español'], ['zh-CN', '中文 (简体)'], ['zh-TW', '中文 (繁體)'], ['hi', 'हिन्दी'], ['ar', 'العربية'], ['fr', 'Français'], ['pt', 'Português'], ['ru', 'Русский'], ['bn', 'বাংলা'], ['ur', 'اردو'], ['id', 'Bahasa Indonesia'], ['de', 'Deutsch'], ['ja', '日本語'], ['ko', '한국어'], ['vi', 'Tiếng Việt'], ['tr', 'Türkçe'], ['fa', 'فارسی'], ['sw', 'Kiswahili'], ['it', 'Italiano'], ['pl', 'Polski'], ['uk', 'Українська'], ['tl', 'Filipino'], ['ha', 'Hausa'], ['yo', 'Yorùbá'], ['am', 'አማርኛ'], ['ht', 'Kreyòl ayisyen']];
  Lab.translatePage = (tl) => { if (!tl || tl === 'en') return; Lab.state.lang = tl; Lab.save(); location.href = 'https://translate.google.com/translate?sl=en&tl=' + encodeURIComponent(tl) + '&u=' + encodeURIComponent(PUBLIC + (location.hash || '')); };
  Lab.translateText = (text, tl) => 'https://translate.google.com/?sl=auto&tl=' + encodeURIComponent(tl || 'en') + '&text=' + encodeURIComponent(String(text).slice(0, 4500)) + '&op=translate';
  Lab.langSelect = () => h('select', { 'aria-label': 'Read the Lab in another language', onchange: (e) => Lab.translatePage(e.target.value) }, Lab.LANGS.map(([c, n]) => h('option', { value: c, selected: c === 'en' }, (c === 'en' ? '🌐 ' : '') + n)));

  // ---------------------------------------------------------------- My Lab
  const card = (...k) => h('div', { class: 'card' }, ...k);
  const recent = () => { try { return JSON.parse(localStorage.getItem('lab:recent') || '[]'); } catch (e) { return []; } };
  Lab.routes.me = function (app) {
    Lab.setContext('My Lab');
    const s = st(); const prof = Lab.profile() || {}; const name = prof.name ? ', ' + prof.name : '';
    const saved = Object.entries(s.saved).sort((a, b) => b[1].at - a[1].at);
    const dives = Object.values(Lab.DIVES_ALL || {}).map((D) => [D, Lab.diveProgress ? Lab.diveProgress(D) : { n: 0, total: 1 }]);
    const started = dives.filter(([, p]) => p.n > 0 || p.last), fresh = dives.filter(([, p]) => !(p.n > 0 || p.last));
    const R = recent();
    const ints = (prof.interests || []).map((id) => (Lab.DISC || []).find((d) => d.id === id)).filter(Boolean);
    const due = (Lab.reviewDue ? Lab.reviewDue() : null);
    const linkRow = (href, title, sub, extra) => h('a', { class: 'search-hit', href }, h('span', null, title), sub ? h('span', { class: 'tiny muted' }, sub) : null, extra || null);

    const fs = () => Math.round((Lab.state.fontScale || 1) * 100) + '%'; const fsLbl = h('span', { class: 'small' }, fs());
    const setFs = (d) => { if (Lab.setFontScale) Lab.setFontScale(d); fsLbl.textContent = fs(); };
    const gsel = h('select', { 'aria-label': 'Pictures of war and violence', onchange: (e) => { Lab.state.profile = Object.assign({}, Lab.profile() || {}, { graphic: e.target.value }); Lab.save(); Lab.toast && Lab.toast('Saved'); } },
      [['blur', 'Blur until I tap them'], ['show', 'Show them'], ['hide', 'Hide them']].map(([v, n]) => h('option', { value: v, selected: (prof.graphic || 'blur') === v }, n)));
    const dsel = h('select', { 'aria-label': 'How the tutor explains', onchange: (e) => { Lab.state.profile = Object.assign({}, Lab.profile() || {}, { depth: e.target.value }); Lab.save(); Lab.toast && Lab.toast('Saved'); } },
      [['simple', 'Simple: short sentences, everyday words'], ['standard', 'Standard'], ['deep', 'Deep: more detail, numbers and sources']].map(([v, n]) => h('option', { value: v, selected: (prof.depth || 'standard') === v }, n)));

    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('h1', null, 'My Lab' + name), h('p', null, 'Everything you saved, where you left off, suggestions from your interests, and how the Lab looks and explains things for you. Kept in this browser.')),
      h('div', { class: 'grid g2' },
        card(h('h2', { style: { marginTop: 0 } }, '▶ Pick up where you left off'), R.length ? h('div', { class: 'stack', style: { gap: '6px' } }, R.slice(0, 6).map((r) => linkRow(r.h, r.t, r.h.replace('#', '').split('-').slice(0, 3).join(' › ')))) : h('p', { class: 'small muted' }, 'Nothing yet. Open any page and it will appear here.'),
          due != null ? h('a', { class: 'btn sm primary', href: '#review', style: { marginTop: '10px', display: 'inline-block' } }, `🧠 Review (${due} due)`) : h('a', { class: 'btn sm', href: '#review', style: { marginTop: '10px', display: 'inline-block' } }, '🧠 Daily review')),
        card(h('h2', { style: { marginTop: 0 } }, '★ Saved'), saved.length ? h('div', { class: 'stack', style: { gap: '6px' } }, saved.map(([href, v]) => { const row = linkRow(href, v.t, v.kind); row.append(h('button', { class: 'linkish tiny', style: { alignSelf: 'flex-start' }, onclick: (e) => { e.preventDefault(); Lab.toggleSave(href); row.remove(); } }, 'Remove')); return row; }))
          : h('p', { class: 'small muted' }, 'Tap ☆ Save on any deep-dive section or country to keep it here.'))),
      card(h('h2', { style: { marginTop: 0 } }, '📚 Your deep dives'), h('div', { class: 'grid g3' }, [...started, ...fresh].map(([D, p]) => h('a', { class: 'search-hit', href: '#' + D.base }, h('b', null, D.title), h('span', { class: 'tiny muted' }, p.n ? `${p.n} of ${p.total} sections done` : 'Not started'), h('div', { class: 'prog-bar' }, h('i', { style: { width: Math.round(100 * p.n / Math.max(1, p.total)) + '%', background: D.color } })))))),
      card(h('h2', { style: { marginTop: 0 } }, '✨ For you'), ints.length ? h('div', null, h('p', { class: 'small muted' }, 'From the interests in your profile.'), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, ints.map((d) => h('a', { class: 'chip', href: '#d-' + d.id, style: { textDecoration: 'none', color: 'inherit' } }, d.e + ' ' + d.name))))
          : h('p', { class: 'small muted' }, 'Add interests in Settings → Who’s learning, and suggestions will appear here.'),
        h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap', marginTop: '10px' } }, h('a', { class: 'btn sm', href: '#countries' }, '🌍 Explore a country'), fresh[0] ? h('a', { class: 'btn sm', href: '#' + fresh[0][0].base }, '🧭 Start: ' + fresh[0][0].title) : null, h('a', { class: 'btn sm', href: '#archive' }, '🖼️ Browse the Archive'), h('a', { class: 'btn sm', href: '#search' }, '🔎 Search everything'))),
      card(h('h2', { style: { marginTop: 0 } }, '⚙️ Make it yours'),
        h('div', { class: 'me-set' }, h('b', { class: 'small' }, 'Text size'), h('div', { class: 'row', style: { gap: '6px' } }, h('button', { class: 'btn sm', onclick: () => setFs(-0.1) }, 'A−'), fsLbl, h('button', { class: 'btn sm', onclick: () => setFs(0.1) }, 'A+'))),
        h('div', { class: 'me-set' }, h('b', { class: 'small' }, 'How the tutor explains'), dsel),
        h('div', { class: 'me-set' }, h('b', { class: 'small' }, 'Pictures of war and violence'), Lab.isKid && Lab.isKid() ? h('span', { class: 'small muted' }, 'Hidden for ages 10–12') : gsel),
        h('div', { class: 'me-set' }, h('b', { class: 'small' }, 'Read the Lab in another language'), Lab.langSelect()),
        h('p', { class: 'tiny muted' }, 'Translation is done by Google Translate on the public site, so wording may be imperfect; names, numbers and quotes should be checked against the English. Picture captions have their own “Translate” link.'),
        h('a', { class: 'btn sm', href: '#settings' }, 'All settings →')));
  };

  // links into My Lab and Countries from the footer and home
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => { const f = document.getElementById('foot'); if (f && !document.getElementById('footLang')) { const p = h('div', { id: 'footLang', class: 'row', style: { gap: '8px', margin: '8px 0', flexWrap: 'wrap' } }, h('a', { href: '#me' }, '★ My Lab'), h('a', { href: '#countries' }, '🌍 Countries'), Lab.langSelect()); f.prepend(p); } }, 400));
})();
