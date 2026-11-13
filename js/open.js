/* Open Learning Lab: things that make the Lab work for anyone, anywhere.
   - "Who's learning?" profile (name, age band, goals, interests, explanation depth)
   - Settings, About and Privacy pages
   - Flag an error (public GitHub issue; also saved to the Lab's database in the claude.ai version)
   - Graphic-content system (hide / blur until tapped / show) tied to age
   - Live evidence panel: photos, films and documents pulled from open archives (public site only)
   - AI tutor fallback for the public site: copy a ready-made question for any AI assistant */
(function () {
  const h = Lab.h;
  const $ = (s, r = document) => r.querySelector(s);
  Lab.REPO = 'https://github.com/branlung0-svg/open-learning-lab';
  Lab.SITE_NAME = 'Open Learning Lab';
  // The claude.ai version provides window.claude; the public website does not.
  Lab.PUBLIC = !/claude|anthropic/i.test(location.hostname) && !(window.claude && window.claude.use);

  // ---------- profile ----------
  const AGES = [['kid', '🧒 10–12'], ['teen', '🧑 13–17'], ['adult', '🧑‍💼 18–64'], ['senior', '🧓 65+']];
  const GOALS = [['curious', '✨ Just curious'], ['school', '🏫 Help with school'], ['exam', '🎯 Exam prep (GED and more)'], ['career', '💼 Skills for work'], ['news', '📰 Understand the news'], ['research', '🔬 Research a topic'], ['language', '🗣️ Learn a language']];
  const DEPTH = [['simple', 'Simple', 'Short, plain words, lots of examples'], ['standard', 'Standard', 'Clear explanations with the key details'], ['deep', 'Deep', 'Full detail, data, debates and sources']];
  Lab.AGES = AGES; Lab.GOALS = GOALS;
  Lab.profile = () => Lab.state.profile || null;
  Lab.ageBand = () => (Lab.profile() || {}).age || 'adult';
  Lab.isKid = () => Lab.ageBand() === 'kid';
  Lab.hasGoal = (g) => ((Lab.profile() || {}).goals || []).includes(g);
  Lab.graphicMode = () => { const p = Lab.profile() || {}; if (Lab.isKid()) return 'hide'; return p.graphic || 'blur'; };
  Lab.displayName = () => ((Lab.profile() || {}).name || '').trim();

  function modal(title, body, opts = {}) {
    const close = () => { wrap.remove(); document.removeEventListener('keydown', esc); opts.onclose && opts.onclose(); };
    const esc = (e) => { if (e.key === 'Escape' && !opts.locked) close(); };
    const box = h('div', { role: 'dialog', 'aria-modal': 'true', 'aria-label': title, style: { background: 'var(--card)', color: 'var(--ink)', borderRadius: '18px', maxWidth: opts.wide ? '900px' : '560px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,.35)' } },
      h('div', { class: 'row', style: { marginBottom: '10px' } }, h('h2', { style: { margin: 0, flex: 1 } }, title), opts.locked ? null : h('button', { class: 'btn sm ghost', 'aria-label': 'Close', onclick: close }, '✕')), body);
    const wrap = h('div', { style: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,10,25,.6)', display: 'grid', placeItems: 'center', padding: '14px' }, onclick: (e) => { if (e.target === wrap && !opts.locked) close(); } }, box);
    document.body.append(wrap); document.addEventListener('keydown', esc);
    return { close, box };
  }
  Lab.modal = modal;

  function profileForm(onDone, first) {
    const p = Object.assign({ name: '', age: '', goals: [], interests: [], depth: 'standard', graphic: 'blur' }, Lab.profile() || {});
    const chip = (on, label, click) => h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), onclick: click, style: { cursor: 'pointer' } }, label);
    const body = h('div', { class: 'stack' });
    const draw = () => { body.innerHTML = '';
      body.append(
        first ? h('p', { class: 'small muted', style: { margin: 0 } }, 'A free, open lab for learning anything, for ages 10 to 100. Answer a few questions so it can suggest the right things. Everything stays on this device, and you can change it anytime in Settings.') : null,
        h('label', { class: 'small' }, h('b', null, 'What should we call you? '), h('span', { class: 'muted' }, '(optional)'), h('br'), h('input', { type: 'text', value: p.name, maxlength: 30, placeholder: 'A first name or nickname', style: { width: '100%', marginTop: '4px' }, oninput: (e) => { p.name = e.target.value; } })),
        h('div', null, h('b', { class: 'small' }, 'Age group'), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, AGES.map(([k, l]) => chip(p.age === k, l, () => { p.age = k; if (k === 'kid') p.depth = 'simple'; draw(); })))),
        h('div', null, h('b', { class: 'small' }, 'What brings you here? '), h('span', { class: 'tiny muted' }, 'pick any'), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, GOALS.map(([k, l]) => chip(p.goals.includes(k), l, () => { p.goals = p.goals.includes(k) ? p.goals.filter((x) => x !== k) : [...p.goals, k]; draw(); })))),
        h('div', null, h('b', { class: 'small' }, 'What interests you? '), h('span', { class: 'tiny muted' }, 'pick a few'), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, Lab.DISC.map((d) => chip(p.interests.includes(d.id), d.e + ' ' + d.name, () => { p.interests = p.interests.includes(d.id) ? p.interests.filter((x) => x !== d.id) : [...p.interests, d.id]; draw(); })))),
        h('div', null, h('b', { class: 'small' }, 'How deep should explanations go?'), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, DEPTH.map(([k, l, d]) => chip(p.depth === k, l, () => { p.depth = k; draw(); }))), h('div', { class: 'tiny muted' }, (DEPTH.find((d) => d[0] === p.depth) || DEPTH[1])[2])),
        p.age && p.age !== 'kid' ? h('div', null, h('b', { class: 'small' }, 'Graphic historical material (war, atrocities)'), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, [['hide', 'Hide it'], ['blur', 'Blur until I tap (recommended)'], ['show', 'Show it']].map(([k, l]) => chip(p.graphic === k, l, () => { p.graphic = k; draw(); }))), h('div', { class: 'tiny muted' }, 'Real history includes hard images. They always come with context. For ages 10–12 they stay hidden.')) : null,
        h('div', { class: 'row', style: { gap: '8px', marginTop: '6px' } }, h('button', { class: 'btn primary', disabled: !p.age, onclick: () => { Lab.state.profile = Object.assign({}, p, { since: (Lab.profile() || {}).since || new Date().toISOString().slice(0, 10) }); Lab.save(); onDone && onDone(); } }, first ? 'Start learning →' : 'Save'), first ? h('button', { class: 'btn ghost', onclick: () => { Lab.state.profile = { age: 'adult', goals: [], interests: [], depth: 'standard', graphic: 'blur', skipped: true }; Lab.save(); onDone && onDone(); } }, 'Skip for now') : null, !p.age ? h('span', { class: 'tiny muted' }, 'Pick an age group to continue.') : null));
    };
    draw(); return body;
  }
  Lab.onboard = () => { const m = modal('👋 Who’s learning?', profileForm(() => { m.close(); if ((location.hash || '#home') === '#home' || !location.hash) Lab.go('home'); }, true), { locked: true, wide: true }); };

  // ---------- flag an error ----------
  Lab.flagError = (preset) => {
    const where = location.hash || '#home';
    const sel = (window.getSelection && String(window.getSelection()).trim().slice(0, 500)) || '';
    const what = h('textarea', { rows: 4, placeholder: 'What is wrong, and what should it say?', style: { width: '100%' } });
    const quote = h('textarea', { rows: 2, placeholder: 'The exact text that is wrong (optional)', style: { width: '100%' } }); quote.value = preset || sel;
    const src = h('input', { type: 'text', placeholder: 'A source that shows the correct fact (link or book), optional', style: { width: '100%' } });
    const status = h('div', { class: 'small' });
    const send = async () => {
      if (!what.value.trim()) { status.textContent = 'Please describe the problem first.'; return; }
      const title = 'Error report: ' + what.value.trim().slice(0, 70);
      const body = `**Page:** ${where}\n\n**What is wrong:**\n${what.value.trim()}\n\n**Text in question:**\n> ${(quote.value || '(not given)').trim().replace(/\n/g, '\n> ')}\n\n**Source for the correction:** ${src.value.trim() || '(not given)'}\n\n_Sent from the ${Lab.SITE_NAME} "Flag an error" button._`;
      let saved = false;
      if (Lab.db) { try { await Lab.db.doc('flags/' + Date.now()).set({ page: where, what: what.value.trim(), quote: quote.value.trim(), source: src.value.trim(), at: new Date().toISOString(), status: 'open' }); saved = true; } catch (e) {} }
      const url = Lab.REPO + '/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body.slice(0, 6000));
      status.innerHTML = '';
      status.append(saved ? h('p', null, '✅ Saved to the Lab’s error list. Thank you!') : null,
        h('p', null, h('a', { href: url, target: '_blank', rel: 'noopener', class: 'btn primary sm', style: { textDecoration: 'none' } }, 'Open the public report on GitHub ↗'), ' ', h('span', { class: 'tiny muted' }, 'Free GitHub account needed. Reports are public so anyone can check them.')));
      Lab.addXP(5, 'flagged an error');
    };
    modal('⚑ Flag an error', h('div', { class: 'stack' }, h('p', { class: 'small muted', style: { margin: 0 } }, 'Found something wrong, out of date or one-sided? Tell us. Every report is checked against sources and fixed in the open.'), h('div', { class: 'tiny muted' }, 'Page: ' + where), what, quote, src, h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: send }, 'Send report')), status));
  };

  // ---------- graphic content ----------
  const GRAPHIC = /\b(corpse|corpses|dead bod|bodies of|massacre|execution|executed|hanged|lynch|atrocit|mass grave|genocide victims|wounded soldier|severed|mutilat|gore|autopsy|cadaver|skeletons? of|starved|starving|famine victim|torture|burned bod|holocaust victims|concentration camp prisoners)\b/i;
  Lab.isGraphic = (text) => GRAPHIC.test(text || '');
  // Wrap any element (image, video) that may be graphic. note: what it shows and why it matters.
  Lab.sensitive = (el, note) => {
    const mode = Lab.graphicMode();
    if (mode === 'show') return el;
    if (mode === 'hide') return h('div', { class: 'small muted', style: { padding: '14px', border: '1px dashed var(--line)', borderRadius: '12px', textAlign: 'center' } }, '🛡️ A graphic historical image is hidden here.', Lab.isKid() ? ' It can be shown for older learners.' : ' You can change this in Settings.');
    const cover = h('button', { type: 'button', style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(15,15,30,.55)', color: '#fff', border: 0, borderRadius: '12px', cursor: 'pointer', padding: '10px', textAlign: 'center', font: 'inherit' } },
      h('div', null, h('div', { style: { fontSize: '22px' } }, '⚠️'), h('div', { style: { fontWeight: 700 } }, 'Graphic historical content'), note ? h('div', { class: 'small', style: { opacity: 0.9, maxWidth: '360px' } }, note) : null, h('div', { class: 'tiny', style: { marginTop: '6px', opacity: 0.85 } }, 'Tap to view')));
    const box = h('div', { style: { position: 'relative' } }, el, cover);
    el.style.filter = 'blur(22px)'; el.style.transition = 'filter .3s';
    cover.onclick = (e) => { e.stopPropagation(); el.style.filter = ''; cover.remove(); };
    return box;
  };

  // ---------- ask any AI (public site) ----------
  Lab.copyPrompt = (prompt) => {
    const ta = h('textarea', { rows: 9, readonly: true, style: { width: '100%', fontSize: '13px' } }); ta.value = prompt;
    const ok = h('span', { class: 'small muted' });
    modal('✦ Ask an AI about this', h('div', { class: 'stack' },
      h('p', { class: 'small', style: { margin: 0 } }, 'This free public site has no built-in AI (each question costs money to answer). Copy this ready-made question and paste it into any AI assistant you use, such as Claude, ChatGPT or Gemini. Always check important answers against the sources here.'),
      ta, h('div', { class: 'row', style: { gap: '8px' } }, h('button', { class: 'btn primary', onclick: async () => { try { await navigator.clipboard.writeText(prompt); ok.textContent = '✅ Copied'; } catch (e) { ta.select(); ok.textContent = 'Select the text and copy it.'; } } }, '📋 Copy question'), h('a', { class: 'btn', href: 'https://claude.ai/new', target: '_blank', rel: 'noopener', style: { textDecoration: 'none' } }, 'Open Claude ↗'), ok)));
  };

  // ---------- live evidence panel (public site) ----------
  const cache = new Map();
  const getJSON = async (url) => { if (cache.has(url)) return cache.get(url); const p = fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }); cache.set(url, p); try { return await p; } catch (e) { cache.delete(url); throw e; } };
  const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const SRC = {
    photos: { label: '📷 Photos & art', credit: 'Wikimedia Commons', async load(q, off) {
      const j = await getJSON('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=24&gsroffset=' + off + '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=420');
      return Object.values((j.query || {}).pages || {}).sort((a, b) => a.index - b.index).filter((p) => p.imageinfo).map((p) => { const i = p.imageinfo[0], m = i.extmetadata || {}; const t = p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''); const desc = strip(m.ImageDescription && m.ImageDescription.value).slice(0, 300);
        return { kind: 'img', thumb: i.thumburl, big: i.thumburl.replace(/\/\d+px-/, '/1200px-'), title: t, desc, credit: (strip(m.Artist && m.Artist.value) || 'Unknown') + ' · ' + ((m.LicenseShortName && m.LicenseShortName.value) || 'see source'), url: i.descriptionurl, date: strip(m.DateTimeOriginal && m.DateTimeOriginal.value).slice(0, 24) }; }); } },
    films: { label: '🎞️ Films & newsreels', credit: 'Internet Archive', async load(q, off) {
      const j = await getJSON('https://archive.org/advancedsearch.php?q=' + encodeURIComponent('(' + q + ') AND mediatype:(movies)') + '&fl[]=identifier&fl[]=title&fl[]=year&fl[]=creator&fl[]=description&rows=18&page=' + (off / 18 + 1) + '&output=json&sort[]=downloads+desc');
      return (j.response.docs || []).map((d) => ({ kind: 'film', thumb: 'https://archive.org/services/img/' + d.identifier, embed: 'https://archive.org/embed/' + d.identifier, title: strip(Array.isArray(d.title) ? d.title[0] : d.title), desc: strip(Array.isArray(d.description) ? d.description[0] : d.description).slice(0, 300), credit: (strip(Array.isArray(d.creator) ? d.creator[0] : d.creator) || 'Internet Archive') + (d.year ? ' · ' + d.year : ''), url: 'https://archive.org/details/' + d.identifier })); } },
    docs: { label: '📜 Documents & books', credit: 'Internet Archive', async load(q, off) {
      const j = await getJSON('https://archive.org/advancedsearch.php?q=' + encodeURIComponent('(' + q + ') AND mediatype:(texts)') + '&fl[]=identifier&fl[]=title&fl[]=year&fl[]=creator&rows=18&page=' + (off / 18 + 1) + '&output=json&sort[]=downloads+desc');
      return (j.response.docs || []).map((d) => ({ kind: 'doc', thumb: 'https://archive.org/services/img/' + d.identifier, embed: 'https://archive.org/embed/' + d.identifier, title: strip(Array.isArray(d.title) ? d.title[0] : d.title), credit: (strip(Array.isArray(d.creator) ? d.creator[0] : d.creator) || 'Internet Archive') + (d.year ? ' · ' + d.year : ''), url: 'https://archive.org/details/' + d.identifier })); } },
    loc: { label: '🏛️ Library of Congress', credit: 'Library of Congress', async load(q, off) {
      const j = await getJSON('https://www.loc.gov/pictures/search/?fo=json&c=24&sp=' + (off / 24 + 1) + '&q=' + encodeURIComponent(q));
      return (j.results || []).filter((r) => r.image && (r.image.full || r.image.thumb)).map((r) => ({ kind: 'img', thumb: (r.image.thumb || r.image.full).replace(/^\/\//, 'https://'), big: (r.image.full || r.image.thumb).replace(/^\/\//, 'https://'), title: strip(r.title).slice(0, 140), desc: '', credit: 'Library of Congress' + (r.created_published_date ? ' · ' + strip(r.created_published_date) : ''), url: (r.links && r.links.item ? r.links.item : 'https://www.loc.gov').replace(/^\/\//, 'https://') })); } },
  };
  function lightbox(it) {
    const media = it.kind === 'img' ? h('img', { src: it.big || it.thumb, alt: it.title, style: { width: '100%', borderRadius: '12px', background: 'var(--card2)' }, onerror: (e) => { e.target.src = it.thumb; } })
      : h('div', { style: { position: 'relative', paddingTop: it.kind === 'doc' ? '75%' : '56.25%' } }, h('iframe', { src: it.embed, title: it.title, allow: 'fullscreen', allowfullscreen: true, loading: 'lazy', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, borderRadius: '12px' } }));
    const graphic = Lab.isGraphic(it.title + ' ' + (it.desc || ''));
    modal(it.title || 'Untitled', h('div', { class: 'stack' }, graphic ? Lab.sensitive(media, 'From an archive search. Check the source page for full context.') : media, it.desc ? h('p', { class: 'small', style: { margin: 0 } }, it.desc) : null, h('div', { class: 'tiny muted' }, 'Credit: ' + it.credit + (it.date ? ' · ' + it.date : '')), h('a', { href: it.url, target: '_blank', rel: 'noopener', class: 'small' }, 'Open the original source page ↗')), { wide: true });
  }
  Lab.evidencePanel = (query, opts = {}) => {
    const card = h('div', { class: 'card', style: { marginTop: '14px' } });
    if (!Lab.PUBLIC) return null;
    let q = query, tab = 'photos', off = 0;
    const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '10px', marginTop: '10px' } });
    const more = h('button', { class: 'btn sm', style: { marginTop: '10px' } }, 'Load more');
    const note = h('div', { class: 'tiny muted', style: { marginTop: '6px' } });
    const tabs = h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } });
    const input = h('input', { type: 'search', value: q, placeholder: 'Search millions of archive items…', style: { flex: 1, minWidth: '180px' } });
    const run = async (append) => { if (!append) { grid.innerHTML = ''; off = 0; } note.textContent = 'Loading…'; more.style.display = 'none';
      try { const items = await SRC[tab].load(q, off); off += items.length;
        items.forEach((it) => { const img = h('img', { src: it.thumb, alt: it.title, loading: 'lazy', style: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', background: 'var(--card2)', display: 'block' }, onerror: (e) => { e.target.style.visibility = 'hidden'; } });
          const graphic = Lab.isGraphic(it.title + ' ' + (it.desc || ''));
          const fig = h('button', { type: 'button', style: { textAlign: 'left', background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }, onclick: () => lightbox(it) }, graphic ? Lab.sensitive(img) : img, h('div', { class: 'tiny', style: { marginTop: '4px', fontWeight: 600, lineHeight: 1.3, maxHeight: '2.6em', overflow: 'hidden' } }, (it.kind === 'film' ? '▶ ' : '') + it.title), h('div', { class: 'tiny muted', style: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } }, it.credit));
          if (!(graphic && Lab.graphicMode() === 'hide' && Lab.isKid())) grid.append(fig); });
        note.textContent = off ? `Live results from ${SRC[tab].credit}. Search results are automatic, so some may be off-topic; each one links to its source and license.` : 'Nothing found. Try different words.';
        more.style.display = items.length >= 12 ? '' : 'none';
      } catch (e) { note.textContent = 'Could not reach ' + SRC[tab].credit + ' right now. Try again in a moment.'; } };
    const drawTabs = () => { tabs.innerHTML = ''; Object.entries(SRC).forEach(([k, s]) => tabs.append(h('button', { type: 'button', class: 'chip' + (k === tab ? ' on' : ''), onclick: () => { tab = k; drawTabs(); run(); } }, s.label))); };
    more.onclick = () => run(true);
    card.append(h('div', { class: 'row' }, h('h3', { style: { margin: 0, flex: 1 } }, opts.title || '🗂️ Real-world evidence'), h('span', { class: 'tiny muted' }, 'from open archives')),
      h('p', { class: 'small muted', style: { margin: '4px 0 0' } }, 'Real photos, film, documents and books about this topic from public archives, credited to their creators.'),
      h('form', { class: 'row', style: { gap: '6px', marginTop: '8px' }, onsubmit: (e) => { e.preventDefault(); q = input.value.trim() || query; run(); } }, input, h('button', { class: 'btn sm', type: 'submit' }, 'Search')),
      tabs, grid, more, note,
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('a', { class: 'btn sm', target: '_blank', rel: 'noopener', href: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' documentary'), style: { textDecoration: 'none' }, onclick: (e) => { e.currentTarget.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' documentary'); } }, '▶ Videos on YouTube ↗'), h('a', { class: 'btn sm', target: '_blank', rel: 'noopener', href: 'https://www.google.com/search?tbm=nws&q=' + encodeURIComponent(query), style: { textDecoration: 'none' }, onclick: (e) => { e.currentTarget.href = 'https://www.google.com/search?tbm=nws&q=' + encodeURIComponent(q); } }, '📰 News coverage ↗'), h('a', { class: 'btn sm', target: '_blank', rel: 'noopener', href: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(query), style: { textDecoration: 'none' }, onclick: (e) => { e.currentTarget.href = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(q); } }, '🎓 Research papers ↗')));
    drawTabs();
    if (Lab.isKid()) { grid.append(h('p', { class: 'small muted' }, 'Live archive searches are turned off for ages 10–12, because automatic results are not checked. Ask a parent or teacher to explore them with you.')); tabs.style.display = 'none'; return card; }
    const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); run(); } }, { rootMargin: '300px' }); io.observe(card);
    return card;
  };
  // Add the panel to discipline pages and modern-world tabs automatically (public site).
  const autoQuery = () => { const raw = (location.hash || '').slice(1); const [a, b, c, d] = raw.split('-');
    if (a === 'd' && b) { const D = (Lab.DISC || []).find((x) => x.id === b); return D ? D.name : null; }
    if (a === 'history' && b === 'modern' && c) { if (c === 'marxism' && d && Lab.MARX && Lab.MARX.cases[d]) return Lab.MARX.cases[d].n + ' communist history'; const S = Lab.MODERN && Lab.MODERN.SUBS.find((x) => x[0] === c); return S ? S[1] : null; }
    if (a === 'connect' && b && Lab.CONNECT) { const C = Lab.CONNECT.find((x) => x.id === b); return C ? C.t : null; }
    return null; };
  let evTimer;
  const addEvidence = () => { clearTimeout(evTimer); if (!Lab.PUBLIC) return; evTimer = setTimeout(() => { const q = autoQuery(); const app = $('#app'); if (!q || !app || app.querySelector('[data-evidence]')) return; const p = Lab.evidencePanel(q.replace(/[^\p{L}\p{N}\s’'-]/gu, ' ').replace(/\s+/g, ' ').trim()); if (p) { p.setAttribute('data-evidence', '1'); app.append(p); } }, 500); };
  window.addEventListener('hashchange', addEvidence);

  // ---------- pages: settings, about, privacy ----------
  Lab.routes.settings = (app) => {
    const exp = () => { const blob = new Blob([JSON.stringify(Lab.state, null, 1)], { type: 'application/json' }); const a = h('a', { href: URL.createObjectURL(blob), download: 'learning-lab-progress.json' }); document.body.append(a); a.click(); a.remove(); };
    const file = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' }, onchange: async (e) => { try { const s = JSON.parse(await e.target.files[0].text()); if (typeof s !== 'object' || s == null || !('xp' in s)) throw 0; Lab.state = Object.assign({}, Lab.state, s); Lab.save(); msg.textContent = '✅ Progress imported.'; } catch (err) { msg.textContent = 'That file is not a Lab progress file.'; } } });
    const msg = h('span', { class: 'small muted' });
    const copy = h('textarea', { rows: 3, readonly: true, style: { width: '100%', fontSize: '12px' } });
    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '⚙️'), h('h1', null, 'Settings'), h('p', null, 'Your learner profile, graphic-content choice and progress.')),
      h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, '👤 Who’s learning?'), profileForm(() => { Lab.toast('Saved'); Lab.go('settings'); }, false)),
      h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, '💾 Your progress'), h('p', { class: 'small' }, Lab.db ? 'Your progress is saved to your claude.ai account and syncs across devices.' : 'Your progress is saved only in this browser on this device. Nothing is sent to any server. To move it to another device, export it here and import it there.'),
        h('div', { class: 'row', style: { gap: '8px' } }, h('button', { class: 'btn', onclick: exp }, '⬇️ Export progress'), h('button', { class: 'btn', onclick: () => file.click() }, '⬆️ Import progress'), file, msg),
        h('p', { class: 'tiny muted' }, 'On a phone where downloads are blocked, copy this instead:'), copy, h('button', { class: 'btn sm', onclick: () => { copy.value = JSON.stringify(Lab.state); copy.select(); } }, 'Show progress as text'),
        h('details', { style: { marginTop: '10px' } }, h('summary', { class: 'small' }, 'Start over'), h('button', { class: 'btn sm', style: { marginTop: '6px' }, onclick: (e) => { if (e.target.dataset.sure) { const p = Lab.state.profile; Lab.state = { xp: 0, streak: 0, lastDay: '', done: {}, ged: {}, cards: {}, reading: {}, log: [], profile: p }; Lab.save(); Lab.go('home'); } else { e.target.dataset.sure = 1; e.target.textContent = 'Tap again to erase all progress on this device'; } } }, 'Erase my progress'))));
  };
  Lab.routes.about = (app) => {
    const sec = (t, ...k) => h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, t), ...k);
    app.append(h('section', { class: 'hero', style: { background: 'linear-gradient(120deg,#0F766E,#2563EB 55%,#7C3AED)' } }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '🌍'), h('h1', null, 'About ' + Lab.SITE_NAME), h('p', null, 'A free, open lab for learning about the world, for anyone from age 10 to 100. No ads, no accounts, no tracking.')),
      sec('What this is', h('p', { class: 'small' }, '24 disciplines, from mathematics and physics to history, politics, religion and the arts. Each has its history, people, primary documents, real images, complete public-domain books, hands-on labs and quizzes. The goal is to understand how we know what we know, how the fields connect, and how to use them in real life.')),
      sec('How it is made, honestly', h('p', { class: 'small' }, 'Most of the text and code here was drafted with the help of an AI model (Claude, made by Anthropic), guided and reviewed by a human volunteer, and checked against the sources it cites. AI can make mistakes, and so can people. That is why every page shows its sources and how confident the evidence is, and why anyone can report an error.'), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, ...['Established', 'Strong', 'Contested', 'Unknown', 'Clouded', 'Developing'].map((c) => Lab.conf(c))), h('p', { class: 'small' }, 'These labels mean: Established (overwhelming evidence), Strong (good evidence, details debated), Contested (serious experts disagree), Unknown (we lack evidence), Clouded (evidence distorted by propaganda or secrecy), and Developing (recent events still being reported).')),
      sec('Our standards', h('ul', { class: 'small' }, h('li', null, 'Judge every country, party, religion and system by the same questions.'), h('li', null, 'Give the strongest case each side makes, then say what the evidence shows.'), h('li', null, 'Give numbers as ranges with who estimated them.'), h('li', null, 'Show real evidence, including hard material, always with context and the victims’ stories where known.'), h('li', null, 'Credit every image, text and dataset to its creator and license.'))),
      sec('Hard and graphic material', h('p', { class: 'small' }, 'Understanding war, atrocities and repression sometimes means looking at real evidence. Graphic items are blurred until you tap them, with a note on what they show and why. Learners aged 10–12 do not see them. You can change your choice in Settings. We do not show material made to spread terror (such as execution videos released by perpetrators), gore with no historical value, or anything sexual.')),
      sec('Found a mistake?', h('p', { class: 'small' }, 'Use ', h('b', null, '⚑ Flag an error'), ' at the top of any page. Reports are public on GitHub so anyone can see what was fixed and why.'), h('button', { class: 'btn primary sm', onclick: () => Lab.flagError() }, '⚑ Flag an error'), ' ', h('a', { class: 'btn sm', href: Lab.REPO + '/issues', target: '_blank', rel: 'noopener', style: { textDecoration: 'none' } }, 'See all reports ↗')),
      sec('Licenses and credits', h('p', { class: 'small' }, 'The code is free to reuse under the MIT License. Original text is free to reuse under Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0) with credit. Images, books and data keep their own licenses, shown next to each one. Full list of data sources is at the bottom of every page. Source code: ', h('a', { href: Lab.REPO, target: '_blank', rel: 'noopener' }, 'github.com/branlung0-svg/open-learning-lab'), '.')),
      sec('Privacy', h('p', { class: 'small' }, h('a', { href: '#privacy' }, 'Read the short privacy page →'))));
  };
  Lab.routes.privacy = (app) => app.append(h('section', { class: 'hero', style: { background: 'linear-gradient(120deg,#334155,#0F766E)' } }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '🔒'), h('h1', null, 'Privacy'), h('p', null, 'Short version: we collect nothing.')),
    h('div', { class: 'card small' }, h('ul', null,
      h('li', null, 'No accounts, no ads, no analytics, no tracking cookies.'),
      h('li', null, 'Your profile, notes and progress are stored only in your own browser (local storage). Clearing your browser data erases them; export them in Settings to keep a copy.'),
      h('li', null, 'When you open live archive results, your browser loads them directly from those archives (Wikimedia Commons, the Internet Archive, the Library of Congress). Like any website, they can see your IP address. Links to YouTube, Google and other sites open those sites in a new tab under their own privacy policies.'),
      h('li', null, 'Error reports you choose to send are public on GitHub under your GitHub account.'),
      h('li', null, 'The site is hosted on GitHub Pages, which keeps standard server logs (GitHub’s privacy statement applies).'))));

  // ---------- top bar buttons, first visit ----------
  document.addEventListener('DOMContentLoaded', () => {
    const top = $('.top .wrap');
    if (top) { const sp = top.querySelector('.sp');
      const mk = (label, title, fn, href) => h(href ? 'a' : 'button', { class: 'pill', title, href, onclick: fn, style: { cursor: 'pointer', textDecoration: 'none', font: 'inherit', color: 'inherit', background: 'var(--card)' } }, label);
      sp.after(mk('⚑', 'Flag an error on this page', () => Lab.flagError()), mk('⚙️', 'Settings', null, '#settings'), mk('ℹ️', 'About this lab', null, '#about')); }
    setTimeout(() => { if (!Lab.profile()) Lab.onboard(); addEvidence(); }, 700);
  });
})();
