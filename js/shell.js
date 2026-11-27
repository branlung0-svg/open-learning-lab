/* The site shell: the header, menu, search, breadcrumbs, page titles, footer, the five door pages and the home page.
   Everything about where a page lives comes from js/sitemap.js. Loaded last, so it can take over the top bar that
   older scripts filled with buttons. */
(function () {
  'use strict';
  const L = window.Lab, h = L.h;
  const $ = (s, r) => (r || document).querySelector(s);
  const IC = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    me: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4m0 1h11l-2 4 2 4H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  };
  const icon = (k) => { const s = h('span', { class: 'ic' }); s.innerHTML = IC[k]; return s; };
  const LESSONS = []; const COUNTRY = {};
  L.COUNTRY_NAMES = COUNTRY;

  /* ---------------- header ---------------- */
  function header() {
    const bar = $('.top .wrap'); if (!bar) return;
    const xp = $('#xpVal'), streak = $('#streakVal');
    bar.replaceChildren();
    const nav = h('nav', { class: 'doors', 'aria-label': 'Main' }, L.DOORS.map((d) => h('a', { href: '#' + d.id, 'data-door': d.id }, d.name)));
    const q = h('input', { type: 'search', placeholder: 'Search the Lab', 'aria-label': 'Search the Lab', enterkeyhint: 'search' });
    const form = h('form', { class: 'hsearch', role: 'search', onsubmit: (e) => { e.preventDefault(); const v = q.value.trim(); location.hash = 'search' + (v ? '-' + encodeURIComponent(v) : ''); q.blur(); } }, icon('search'), q);
    const meBtn = h('button', { type: 'button', class: 'hbtn me-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', 'aria-label': 'My Lab', onclick: (e) => { e.stopPropagation(); toggle(mePanel, meBtn); } }, icon('me'), h('span', { class: 'lbl' }, 'My Lab'), h('b', { class: 'due', id: 'dueVal' }));
    const menuBtn = h('button', { type: 'button', class: 'hbtn menu-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', 'aria-label': 'Menu', onclick: (e) => { e.stopPropagation(); toggle(menuPanel, menuBtn); } }, icon('menu'));
    const searchLink = h('a', { class: 'hbtn search-btn', href: '#search', 'aria-label': 'Search the Lab' }, icon('search'));
    const stats = h('p', { class: 'me-stats' }, h('span', null, xp || h('span', { id: 'xpVal' }, '0'), ' points'), ' · ', h('span', null, streak || h('span', { id: 'streakVal' }, '0'), ' days in a row'));
    const mePanel = h('div', { class: 'hpanel me-panel', hidden: true },
      h('p', { class: 'hp-h' }, 'My Lab'), stats,
      ...[['#me', 'Progress and saved pages'], ['#review', 'Daily review'], ['#notes', 'My notes'], ['#notebook', 'Research notebook'], ['#settings', 'Settings']].map(([href, t]) => h('a', { href }, t)),
      h('hr'), h('button', { type: 'button', class: 'linkish', onclick: () => { close(); L.flagError && L.flagError(); } }, 'Report a problem on this page'), h('a', { href: '#about' }, 'About the Lab'));
    const menuPanel = h('div', { class: 'hpanel menu-panel', hidden: true },
      ...L.DOORS.map((d) => h('a', { href: '#' + d.id, class: 'mp-door' }, h('b', null, d.name), h('span', null, d.blurb))),
      h('hr'), h('a', { href: '#me' }, 'My Lab'), h('a', { href: '#about' }, 'About the Lab'));
    bar.append(h('a', { class: 'logo', href: '#home', 'aria-label': 'Open Learning Lab, home' }, h('i'), h('span', null, 'Open Learning Lab')), nav, h('div', { class: 'sp' }), form, searchLink, meBtn, menuBtn, mePanel, menuPanel);
    function close() { [mePanel, menuPanel].forEach((p) => { p.hidden = true; }); [meBtn, menuBtn].forEach((b) => b.setAttribute('aria-expanded', 'false')); }
    function toggle(p, b) { const open = p.hidden; close(); if (open) { p.hidden = false; b.setAttribute('aria-expanded', 'true'); } }
    document.addEventListener('click', (e) => { if (!e.target.closest('.hpanel')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    addEventListener('hashchange', close);
    const due = () => { try { const n = L.reviewDue ? L.reviewDue() : 0; const el = $('#dueVal'); if (el) { el.textContent = n ? String(n) : ''; el.title = n ? n + ' cards due for review' : ''; } } catch (e) { } };
    setTimeout(due, 1500); addEventListener('hashchange', () => setTimeout(due, 800));
    if (L.renderXP) try { L.renderXP(); } catch (e) { }
  }

  /* ---------------- footer ---------------- */
  function footer() {
    const f = $('#foot'); if (!f) return;
    const col = (t, links) => h('div', { class: 'fcol' }, h('p', { class: 'fh' }, t), ...links.map(([href, x]) => h('a', { href, target: /^http/.test(href) ? '_blank' : null, rel: /^http/.test(href) ? 'noopener' : null }, x)));
    f.replaceChildren(h('div', { class: 'fgrid' },
      h('div', { class: 'fcol fabout' }, h('p', { class: 'fh' }, 'Open Learning Lab'), h('p', null, 'Free, open and checked: every claim sourced, every picture credited, every correction published.')),
      col('The Lab', L.DOORS.map((d) => ['#' + d.id, d.name])),
      col('How it is checked', [['#reviewers', 'How the Lab is checked'], ['#audit', 'Accuracy audit'], ['#changes', 'Corrections log']]),
      col('About', [['#about', 'About the Lab'], ['#privacy', 'Privacy'], ['#settings', 'Settings'], [(L.REPO || 'https://github.com/branlung0-svg/open-learning-lab') + '/issues/new?title=Mistake%20on%20page%3A%20', 'Report a mistake'], [L.REPO || 'https://github.com/branlung0-svg/open-learning-lab', 'Source code']])),
      h('p', { class: 'fsmall' }, 'Images: Wikimedia Commons and NASA, each credited with its author and licence. Books: Project Gutenberg and public-domain scans from the Internet Archive. Documents: the Avalon Project, Yale Law School. Data: Maddison Project, V-Dem, Correlates of War, SIPRI, UCDP/PRIO, World Inequality Database, World Bank, Our World in Data and others, named on each page.'));
  }

  /* ---------------- breadcrumbs, titles, notices ---------------- */
  const OWN = new Set(['home', 'learn', 'explore', 'library', 'evidence', 'practice']);
  function decorate() {
    const hash = (location.hash || '#home').slice(1) || 'home';
    const to = L.redirectFor(hash); if (to) { location.replace('#' + to); return; }
    const place = L.placeOf(hash);
    document.querySelectorAll('.doors a').forEach((a) => a.classList.toggle('on', a.dataset.door === place.door));
    const app = $('#app'); if (!app) return;
    const sid = hash.split('-')[0];
    if (OWN.has(sid) && !(sid === 'learn' && /^learn-journey/.test(hash)) && !(sid === 'evidence' && /^evidence-(rate|questions)/.test(hash))) { document.title = titleText(app) + ' · Open Learning Lab'; return; }
    const better = L.titleFor(hash);
    // History pages carry their own header and topic menu inside, so the old subject banner and its tabs are dropped.
    const outer = app.firstElementChild && app.firstElementChild.matches('section.hero') ? app.firstElementChild : null;
    const layered = /^history-/.test(hash) && outer && outer.nextElementSibling && outer.nextElementSibling.matches('.tabs') && $('.stack', app);
    if (layered) { outer.classList.add('shell-hidden'); outer.nextElementSibling.classList.add('shell-hidden'); }
    const h1 = layered ? null : $('h1', app);
    if (h1 && better && L.isGenericTitle(h1.textContent)) { h1.textContent = better; h1.dataset.renamed = '1'; const lede = h1.nextElementSibling; if (lede && lede.tagName === 'P' && outer && outer.contains(lede)) lede.classList.add('shell-hidden'); }
    const title = layered ? (better || ($('.stack h1', app) || {}).textContent || 'History') : ((h1 && h1.textContent.trim()) || better || 'Open Learning Lab');
    document.title = title + ' · Open Learning Lab';
    const crumbs = L.crumbsFor(hash);
    let nav = $('nav.crumbs', app);
    if (nav && nav.closest('.shell-hidden')) { app.prepend(nav); }
    if (crumbs.length) {
      if (!nav) {
        nav = h('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' });
        const hero = layered ? null : $('.hero', app); const old = hero ? $('.crumb', hero) : layered ? null : $('a.crumb', app);
        if (old) old.replaceWith(nav); else if (hero) hero.prepend(nav); else app.prepend(nav);
      }
      const items = crumbs.filter((c, i) => !(i === crumbs.length - 1 && c.t === title));
      nav.replaceChildren(...items.flatMap((c) => [h('a', { href: c.href }, c.t), h('span', { class: 'sep', 'aria-hidden': 'true' }, '›')]), h('span', { 'aria-current': 'page' }, title));
    }
    if (L.isOlder(hash) && !$('.older-note', app)) {
      const note = h('p', { class: 'older-note' }, h('b', null, 'Older material. '), 'This page has not yet been rebuilt to the Lab’s new standard. It stays up until its rebuilt version replaces it.');
      const hero = nav && nav.closest('.hero');
      if (hero) hero.after(note); else if (nav) nav.after(note); else app.prepend(note);
    }
  }
  const titleText = (app) => { const t = $('h1', app); return t ? t.textContent.trim() : 'Open Learning Lab'; };
  function watch() {
    let t1, t2, t3;
    const run = () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); decorate(); t1 = setTimeout(decorate, 250); t2 = setTimeout(decorate, 900); t3 = setTimeout(decorate, 2200); };
    addEventListener('hashchange', run); run();
    // pages that change their own tab without changing the address still get a correct crumb
    const app = $('#app'); if (app && 'MutationObserver' in window) { let q = null; new MutationObserver(() => { if (q) return; q = setTimeout(() => { q = null; if (!$('nav.crumbs', app) && L.crumbsFor((location.hash || '#home').slice(1)).length) decorate(); }, 120); }).observe(app, { childList: true }); }
  }

  /* ---------------- door pages ---------------- */
  const card = (href, t, d, tag) => h('a', { class: 'dcard', href }, h('span', { class: 'dc-t' }, t), d ? h('span', { class: 'dc-d' }, d) : null, tag ? h('span', { class: 'dc-tag ' + tag.toLowerCase().replace(/\W+/g, '') }, tag) : null);
  const first = (s) => String(s || '').split(/(?<=\.)\s/)[0];
  function doorPage(app, id, focus, sections) {
    const D = L.door(id);
    L.setContext(D.name);
    const jump = h('nav', { class: 'door-jump', 'aria-label': 'On this page' }, sections.map(([k, t]) => h('a', { href: '#' + id + '-' + k }, t)));
    app.append(h('section', { class: 'hero door-hero', 'data-own': '1' }, h('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, h('a', { href: '#home' }, 'Home'), h('span', { class: 'sep' }, '›'), h('span', { 'aria-current': 'page' }, D.name)), h('h1', null, D.name), h('p', null, D.blurb)), jump);
    sections.forEach(([k, t, lede, body]) => app.append(h('section', { class: 'door-sec', id: 'sec-' + k }, h('h2', null, t), lede ? h('p', { class: 'door-lede' }, lede) : null, body)));
    if (focus) setTimeout(() => { const el = document.getElementById('sec-' + focus); if (el) el.scrollIntoView({ block: 'start' }); }, 60);
  }
  const grid = (...cards) => h('div', { class: 'dgrid' }, ...cards.filter(Boolean));

  function learnDoor(app, focus) {
    const fac = (L.FACULTIES || []).map((F) => h('div', { class: 'fac' }, h('h3', null, F.name, h('span', { class: 'fac-sub' }, ' · ' + F.sub)),
      grid(...(L.DISC || []).filter((d) => d.fac === F.id).map((d) => { const n = L.ARC && L.ARC.forDisc ? (L.ARC.forDisc(d.id) || []).length : 0; return card('#d-' + d.id, d.name, first(d.what), n ? n + ' labs' : null); }))));
    const rebuilt = LESSONS.map((x) => card(x.href, x.id + ' ' + x.title, 'Rebuilt in depth and fact-checked' + (x.checked ? ' ' + x.checked : '') + '.', 'Rebuilt'));
    const older = (L.subjects || []).filter((s) => ['math', 'physics', 'body', 'economy', 'ai', 'mandarin'].includes(s.id)).flatMap((s) => s.ex.map(([e, n]) => card('#' + s.id + '-' + e, L.cleanLabel(n), s.name, 'Older')));
    doorPage(app, 'learn', focus, [
      ['disciplines', 'Disciplines', 'Five faculties and 24 disciplines. Each discipline page gathers its path, labs, topics, people, sources and debates.', h('div', null, ...fac)],
      ['paths', 'Paths', 'Start somewhere sensible. Rebuilt lessons are marked; the rest of each path is being rebuilt one lesson at a time.', grid(...rebuilt,
        card('#path-math', 'Mathematics: the full path', 'Ten tiers from counting to the research frontier, 479 lessons planned.', 'Being rebuilt'),
        card('#learn-journey', 'The Learning Journey', 'Six stages from age 10 to college, across every subject.'),
        card('#path-math-learn', 'How to get good at math', 'Study habits that the research supports.'))],
      ['labs', 'Hands-on labs', null, grid(card('#play', 'All hands-on labs', ((L.ARC && L.ARC.labs) ? L.ARC.labs.length : 'Over 250') + ' interactive labs across every discipline, each with a source.'), card('#path-math-experiments', 'Do your own experiments', 'Small experiments you can run at home.'))],
      ['connections', 'Connections', 'Where one discipline solves another’s problem.', grid(card('#connect', 'How the disciplines work together', 'The map of connections between all 24 disciplines.'), ...(L.CONNECT || []).map((c) => card('#connect-' + c.id, L.cleanLabel(c.t), null, 'Older')))],
      ['older', 'Older explorers', 'The first explorers built for the Lab. Each is being merged into its discipline’s labs.', grid(...older)],
    ]);
  }
  function exploreDoor(app, focus) {
    const pick = h('input', { list: 'country-list', placeholder: 'Type a country', 'aria-label': 'Go to a country' });
    const dl = h('datalist', { id: 'country-list' }, Object.entries(COUNTRY).map(([iso, n]) => h('option', { value: n })));
    const go = (e) => { e.preventDefault(); const v = pick.value.trim().toLowerCase(); const hit = Object.entries(COUNTRY).find(([, n]) => n.toLowerCase() === v) || Object.entries(COUNTRY).find(([, n]) => n.toLowerCase().startsWith(v)); if (hit) location.hash = 'country-' + hit[0]; };
    const M = (id) => '#history-modern-' + id;
    const sub = (id) => (((L.MODERN || {}).SUBS) || []).find((s) => s[0] === id);
    const subCard = (id, d, tag) => { const s = sub(id); return s ? card(M(id), L.cleanLabel(s[1]), d, tag) : null; };
    doorPage(app, 'explore', focus, [
      ['places', 'Places', 'Every country has a page with its data, history, government and sources. Regions get their own deep dives.', h('div', null,
        h('form', { class: 'cpick', onsubmit: go }, pick, dl, h('button', { class: 'btn primary', type: 'submit' }, 'Go')),
        grid(card('#countries', 'All 196 countries', 'An atlas with every country, its region and its key figures.'), subCard('africa', 'Empires, trade, slavery, colonial rule and independence.'), subCard('americas', 'From the first peoples to today.'), card('#story-china', 'China, 1921 to today', 'One country’s century, in chapters.')))],
      ['ideas', 'Ideas & systems', 'The ideas that shaped the modern world, each told by its supporters and its critics, with the evidence.', grid(
        ...['marxism', 'capitalism', 'fascism', 'empire'].map((id) => subCard(id, null, 'Deep dive')),
        ...['liberalism', 'conservatism', 'anarchism', 'authoritarianism', 'imperialism'].map((id) => subCard(id, null, 'Older')),
        card('#power', 'How power really works', 'Who holds power in 12 states, past and present.'), subCard('power', 'Power structures, side by side.'), subCard('ledger', 'The good and the bad of every system.'),
        subCard('ideologies'), subCard('families'), subCard('compare'), subCard('spectrum'), subCard('chosen'), subCard('anatomy'))],
      ['events', 'Events & eras', null, grid(card('#origins', 'From the Big Bang to today', '18 milestones, each with how we know.'), subCard('timeline', 'Every major event since 1700.'), subCard('time'), subCard('wars'), subCard('koreawar'), subCard('sides', 'The same event, told by each side.'), card('#oppression', 'Oppressor and oppressed', 'Colonial rule, genocide, famine, war and more.'), subCard('indigenous'), subCard('conditions'))],
      ['people', 'People', null, grid(subCard('people', 'The people who shaped the modern world.', 'Older'), subCard('leaders'))],
      ['institutions', 'Institutions', null, grid(card('#institutions', 'World institutions & money', 'The UN, IMF, World Bank, WTO and who controls them.'), card('#parliaments', 'Parliaments & power', 'How each parliament is chosen and what it can do.'), subCard('alliances'))],
      ['maps', 'Map & timeline', null, grid(card('#history-atlas', 'World atlas', 'Real borders from 1492 to today.'), card('#history-timeline', 'Timeline 1700–now', 'The modern world on one line.'))],
    ]);
  }
  function libraryDoor(app, focus) {
    doorPage(app, 'library', focus, [
      ['books', 'Books', 'Complete books you can read here, searchable and read aloud. The guided ones explain who wrote them, why, and who disagrees.', grid(card('#reading-library', 'The Reading Room', ((L.LIB || []).length || 400) + ' complete books, ' + ((L.GUIDED || []).length || 16) + ' with full guides.'), card('#path-math-library', 'Free math library', 'Free textbooks from counting to research.'), card('#history-modern-sources', 'Read the sources', 'Primary sources behind the history pages.'))],
      ['archives', 'Documents & archives', null, grid(card('#archive', 'The Archive', 'Primary documents, pictures and film, by place and era.'), card('#archive-slavery', 'Slavery and abolition', 'A collection inside the Archive.'))],
      ['week', 'This week', null, grid(card('#news-week', 'This week', 'New findings in AI, science, math and geopolitics, rated for confidence.', 'Older'))],
    ]);
  }
  function evidenceDoor(app, focus) {
    doorPage(app, 'evidence', focus, [
      ['check', 'How to check a claim', 'The method first: how claims are built, and how to test one yourself.', grid(card('#toolkit', 'How lies are made, and how to catch them', 'The tricks, with real examples from every side.'), card('#method', 'How we study anything', 'The research standard the Lab holds itself to.'), card('#evidence-questions', 'Question a claim', 'Five questions to ask of anything you read.', 'Older'))],
      ['who', 'Who is telling me?', 'Owners, funders and track records, because who says it matters.', grid(card('#whois', 'Who is telling me this?', 'Outlets and organisations: who owns and funds them.', 'Older'), card('#sources', 'Source checker', 'Rate a source in two minutes.'), card('#money', 'Follow the money', 'Who funds, owns and steers what you read.'), card('#evidence-rate', 'Rate the source', 'Practice on real sources.', 'Older'))],
      ['claims', 'Claims checked', 'Claims and propaganda from every side, each with the evidence.', grid(card('#verify', 'Claims under the microscope', 'Popular claims, checked one by one.'), card('#lies', 'Lies, propaganda and paid influence', 'Documented cases, from every side.'), card('#history-modern-warmyths', 'War stories: who told them', 'How wars are sold.'), card('#history-modern-claims', 'Test the claims: how people lived', 'Living standards under each system.'), card('#history-modern-game', 'Which side said it?', 'A game about political language.'))],
      ['cases', 'Case files', 'What happened, and how we know: the documents, the numbers and the disputes.', grid(card('#cases', 'Case files', 'Holodomor, Katyn, Tiananmen, Xinjiang, the Japanese American camps and more.'), card('#history-modern-truths', 'Hard truths', 'The people history broke.'))],
      ['tolls', 'Death tolls', null, grid(card('#tolls', 'Death tolls: what can actually be proven', 'Ranges, sources and why they differ.'))],
    ]);
  }
  function practiceDoor(app, focus) {
    doorPage(app, 'practice', focus, [
      ['ged', 'GED', 'All four tests: math, reasoning through language arts, science and social studies.', grid(card('#ged-arcade', 'GED practice', 'Scored questions, every answer explained.', 'Older'), card('#ged-facts', 'The test and a study plan', 'What is on each test and how to prepare.'))],
      ['review', 'Daily review', null, grid(card('#review', 'Daily review', 'Spaced review of what you have learned, a few minutes a day.'))],
      ['drills', 'Drills & checks', 'Every rebuilt lesson ends with drills and an exit check.', grid(...LESSONS.map((x) => card(x.href + '#practice', x.id + ' ' + x.title, 'Drills, 30 problems and the exit check.', 'Rebuilt')))],
    ]);
  }

  /* ---------------- home ---------------- */
  function home(app) {
    L.setContext('');
    let recent = []; try { recent = JSON.parse(localStorage.getItem('lab:recent') || '[]').slice(0, 4); } catch (e) { }
    const q = h('input', { type: 'search', placeholder: 'Search lessons, countries, books, cases and claims', 'aria-label': 'Search the Lab' });
    app.append(
      h('section', { class: 'home-hero' }, h('h1', null, 'Learn anything in depth, and see how we know it.'),
        h('p', null, 'A free lab for every discipline, from a first lesson at age 10 to the research frontier. Every claim is sourced, every picture credited, and every correction published.'),
        h('form', { class: 'home-search', role: 'search', onsubmit: (e) => { e.preventDefault(); const v = q.value.trim(); location.hash = 'search' + (v ? '-' + encodeURIComponent(v) : ''); } }, icon('search'), q, h('button', { class: 'btn primary', type: 'submit' }, 'Search'))),
      recent.length ? h('section', { class: 'home-sec' }, h('h2', null, 'Continue where you left off'), grid(...recent.map((r) => card(r.h, (r.t || r.h).split('→').pop().trim(), (r.t || '').includes('→') ? r.t.split('→')[0].trim() : null)))) : null,
      h('section', { class: 'home-sec' }, h('h2', null, 'Five ways in'), h('div', { class: 'home-doors' }, L.DOORS.map((d) => h('a', { class: 'hdoor', href: '#' + d.id }, h('span', { class: 'hd-t' }, d.name), h('span', { class: 'hd-d' }, d.blurb), h('span', { class: 'hd-go' }, 'Open ' + d.name + ' →'))))),
      LESSONS.length ? h('section', { class: 'home-sec' }, h('h2', null, 'Newly rebuilt'), h('p', { class: 'door-lede' }, 'Lessons rebuilt in depth: pictures, interactive figures, proofs, history, real uses and worked problems, then independently fact-checked.'), grid(...LESSONS.map((x) => card(x.href, x.id + ' ' + x.title, 'Mathematics · ' + x.minutes + ' minutes', 'Rebuilt')))) : null,
      h('section', { class: 'home-sec home-check' }, h('h2', null, 'How the Lab is checked'), h('p', null, 'Each section is checked against its sources by a separate reviewer before it goes live, and every fix is logged in public. Anyone can report a mistake.'), h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, h('a', { class: 'btn', href: '#reviewers' }, 'How it is checked'), h('a', { class: 'btn', href: '#changes' }, 'Corrections log'), h('a', { class: 'btn', href: '#audit' }, 'Accuracy audit'))));
  }

  /* ---------------- routes ---------------- */
  function install() {
    const oldLearn = L.routes.learn, oldExplore = L.routes.explore;
    if (oldLearn) L.routes['learn-journey-old'] = oldLearn;
    L.routes.home = (app) => home(app);
    L.routes.learn = (app, args) => { if (args[0] === 'journey' && oldLearn) return oldLearn(app, args.slice(1)); learnDoor(app, args[0]); };
    L.routes.explore = (app, args) => { if (args[0] === 'all' && oldExplore) return oldExplore(app, args.slice(1)); exploreDoor(app, args[0]); };
    L.routes.library = (app, args) => libraryDoor(app, args[0]);
    L.routes.practice = (app, args) => practiceDoor(app, args[0]);
    L.routes.evidence = (app, args) => { if (['rate', 'questions'].includes(args[0]) && L.renderSubject) return L.renderSubject(app, 'evidence', args[0], args.slice(1)); evidenceDoor(app, args[0]); };
  }

  function boot() {
    install(); header(); footer(); watch();
    const fill = () => { const h0 = (location.hash || '#home').slice(1).split('-')[0]; if (OWN.has(h0) || !h0) L.go && L.go((location.hash || '#home').slice(1) || 'home'); };
    Promise.all([
      L.json('data/lessons.json').then((a) => { LESSONS.push(...(a || []).map((x) => ({ ...x }))); }).catch(() => { }),
      L.json('data/countries.json').then((d) => { (d.list || []).forEach((c) => { COUNTRY[c.id] = c.n; }); }).catch(() => { }),
    ]).then(fill);
    fill();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0)); else setTimeout(boot, 0);
})();
