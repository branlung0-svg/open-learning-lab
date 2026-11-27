/* The site map: one table that says where every page lives.
   Five doors (Learn, Explore, Library, Evidence, Practice) plus My Lab and About. For any address it gives the
   door, the section inside the door, a real page title and the page's status. The header, the breadcrumbs, the
   door pages, the page titles and the "older material" notices all read from here, so the structure is defined
   once. Source: the inventory in plan/inventory/inventory.csv (27 November 2026). */
(function () {
  'use strict';
  const L = window.Lab = window.Lab || {};

  L.DOORS = [
    { id: 'learn', name: 'Learn', blurb: 'Every discipline, from the first lesson to the research frontier: paths, lessons and hands-on labs.' },
    { id: 'explore', name: 'Explore', blurb: 'The world as it is and how it got here: places, ideas and systems, events, people and institutions.' },
    { id: 'library', name: 'Library', blurb: 'Complete books, primary documents and archives, every one credited and free.' },
    { id: 'evidence', name: 'Evidence', blurb: 'How to check a claim: who is telling you, claims checked from every side, case files and death tolls.' },
    { id: 'practice', name: 'Practice', blurb: 'The GED, daily review and drills: practice that is scored and explained.' },
  ];
  L.door = (id) => L.DOORS.find((d) => d.id === id);

  // Sections inside each door, in the order the door page shows them.
  L.SECTIONS = {
    learn: [['disciplines', 'Disciplines'], ['paths', 'Paths'], ['labs', 'Hands-on labs'], ['connections', 'Connections'], ['older', 'Older explorers']],
    explore: [['places', 'Places'], ['ideas', 'Ideas & systems'], ['events', 'Events & eras'], ['people', 'People'], ['institutions', 'Institutions'], ['maps', 'Map & timeline']],
    library: [['books', 'Books'], ['archives', 'Documents & archives'], ['week', 'This week']],
    evidence: [['check', 'How to check a claim'], ['who', 'Who is telling me?'], ['claims', 'Claims checked'], ['cases', 'Case files'], ['tolls', 'Death tolls']],
    practice: [['ged', 'GED'], ['review', 'Daily review'], ['drills', 'Drills & checks']],
    me: [['me', 'My Lab']],
    about: [['about', 'About the Lab']],
  };
  const secName = (door, sec) => ((L.SECTIONS[door] || []).find(([k]) => k === sec) || [, ''])[1];

  const DISC_NAME = () => Object.fromEntries((L.DISC || []).map((d) => [d.id, d.name]));
  const SUBJ_DISC = { math: 'math', physics: 'physics', body: 'biology', economy: 'economics', ai: 'computing', mandarin: 'linguistics' };

  // Pages that are thin or out of date and are being rebuilt to the new standard (inventory action "Rewrite").
  const OLDER = [/^country-[a-z]{3}$/, /^connect-/, /^oppression-/, /^history-modern-(liberalism|conservatism|anarchism|authoritarianism)$/,
    /^path-math-t-/, /^path-math-\d+$/, /^path-math$/, /^path-math-check$/, /^d-[a-z]+$/, /^math-functions$/, /^body-(body3d|cell)$/, /^mandarin-cards$/,
    /^ged-arcade$/, /^news-week$/, /^whois$/, /^history-modern-people$/, /^mathpath/];

  // Old addresses that now forward somewhere else.
  L.REDIRECTS = [
    [/^d$/, 'learn'], [/^home-dives$/, 'explore'], [/^home-.+/, 'home'], [/^lessons$/, 'learn'], [/^data$/, 'home'], [/^https?$/, 'home'],
    [/^og-[a-z]+$/, 'origins'], [/^country$/, 'countries'], [/^case$/, 'cases'],
  ];
  L.redirectFor = (hash) => { for (const [re, to] of L.REDIRECTS) if (re.test(hash)) return to; return null; };

  // Where a page lives: [door, section] for the address, by the first rule that matches.
  const RULES = [
    [/^(home)?$/, () => [null, null]],
    [/^(learn|path|learn-journey)$/, () => ['learn', 'paths']],
    [/^d-/, () => ['learn', 'disciplines']],
    [/^(play|arcade)/, () => ['learn', 'labs']],
    [/^connect/, () => ['learn', 'connections']],
    [/^(math|physics|body|economy|ai|mandarin)-/, () => ['learn', 'older']],
    [/^(mathpath|path-math)/, () => ['learn', 'disciplines']],
    [/^path-marx/, () => ['explore', 'ideas']],
    [/^(countries|country|parliaments-|govern|power-|story|verify-[a-z]{3}$)/, (h) => ['explore', /^parliaments-|^govern|^power-/.test(h) ? 'places' : 'places']],
    [/^history-modern-(africa|americas)/, () => ['explore', 'places']],
    [/^history-modern-(marxism|capitalism|fascism|empire|imperialism|liberalism|conservatism|anarchism|authoritarianism|ideologies|dives|ledger|anatomy|chosen|power|uspower|govern)/, () => ['explore', 'ideas']],
    [/^power$/, () => ['explore', 'ideas']],
    [/^history-modern-people/, () => ['explore', 'people']],
    [/^history-modern-(claims|warmyths)/, () => ['evidence', 'claims']],
    [/^history-modern-truths/, () => ['evidence', 'cases']],
    [/^(history-modern|history-timeline|origins|oppression|history-modern-timeline|history-modern-wars|history-modern-koreawar|history-modern-sides)/, (h) => ['explore', /^history-timeline/.test(h) ? 'maps' : 'events']],
    [/^history-atlas/, () => ['explore', 'maps']],
    [/^history/, () => ['explore', 'events']],
    [/^institutions-lobbying/, () => ['evidence', 'who']],
    [/^(institutions|parliaments)/, () => ['explore', 'institutions']],
    [/^(reading)/, () => ['library', 'books']],
    [/^archive/, () => ['library', 'archives']],
    [/^news/, () => ['library', 'week']],
    [/^(toolkit|method|evidence-questions)/, (h) => ['evidence', /toolkit-(paid|sources)/.test(h) ? 'who' : 'check']],
    [/^(whois|sources|money|lies-paid|evidence-rate)/, () => ['evidence', 'who']],
    [/^(verify|lies|claims)/, () => ['evidence', 'claims']],
    [/^(cases|case-)/, () => ['evidence', 'cases']],
    [/^tolls/, () => ['evidence', 'tolls']],
    [/^evidence$/, () => ['evidence', null]],
    [/^ged/, () => ['practice', 'ged']],
    [/^review/, () => ['practice', 'review']],
    [/^practice/, () => ['practice', null]],
    [/^(library)$/, () => ['library', null]],
    [/^explore$/, () => ['explore', null]],
    [/^(me|notes|notebook|settings)/, () => ['me', 'me']],
    [/^(about|privacy|reviewers|audit|changes)/, () => ['about', 'about']],
    [/^search/, () => [null, null]],
  ];
  L.placeOf = (hash) => {
    const h = (hash == null ? (location.hash || '#home') : hash).replace(/^#/, '');
    for (const [re, fn] of RULES) if (re.test(h)) { const [door, section] = fn(h); return { hash: h, door, section }; }
    return { hash: h, door: null, section: null };
  };
  L.isOlder = (hash) => OLDER.some((re) => re.test(hash));

  // Breadcrumbs for an address: Home › Door › Section (› Discipline) — the page itself is added by the shell.
  L.crumbsFor = (hash) => {
    const { door, section } = L.placeOf(hash), h = hash.replace(/^#/, '');
    if (!door) return [];
    const out = [{ t: 'Home', href: '#home' }];
    if (door === 'me') { out.push({ t: 'My Lab', href: '#me' }); return out; }
    if (door === 'about') { out.push({ t: 'About the Lab', href: '#about' }); return out; }
    const D = L.door(door); out.push({ t: D.name, href: '#' + door });
    if (section) out.push({ t: secName(door, section), href: '#' + door + '-' + section });
    const dn = DISC_NAME();
    let m;
    if ((m = h.match(/^d-([a-z]+)-/))) out.push({ t: dn[m[1]] || m[1], href: '#d-' + m[1] });
    if ((m = h.match(/^(math|physics|body|economy|ai|mandarin)-/)) && dn[SUBJ_DISC[m[1]]]) out.push({ t: dn[SUBJ_DISC[m[1]]], href: '#d-' + SUBJ_DISC[m[1]] });
    if (/^(mathpath|path-math)/.test(h)) { out.push({ t: 'Mathematics', href: '#d-math' }); if (/^path-math-/.test(h)) out.push({ t: 'Math path', href: '#path-math' }); }
    if ((m = h.match(/^history-modern-([a-z]+)-/)) && L.DEEPDIVES && L.DEEPDIVES[m[1]]) out.push({ t: deepName(m[1]), href: '#history-modern-' + m[1] });
    if ((m = h.match(/^country-([a-z]{3})-/))) out.push({ t: countryName(m[1]) || m[1].toUpperCase(), href: '#country-' + m[1] });
    if ((m = h.match(/^history-modern-timeline-ev-/))) out.push({ t: 'Major events', href: '#history-modern-timeline-ev' });
    if (/^case-/.test(h)) { /* the cases section is enough */ }
    return out;
  };

  const clean = (t) => String(t || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const deepName = (id) => { const D = (L.DEEPDIVES || {})[id]; const S = (((L.MODERN || {}).SUBS) || []).find((x) => x[0] === id); return clean((D && D.title) || (S && S[1]) || id.charAt(0).toUpperCase() + id.slice(1)); };
  L.cleanLabel = clean;
  const countryName = (iso) => { try { const c = (L.COUNTRY_NAMES || {})[iso]; if (c) return c; } catch (e) { } return null; };

  // A real title for pages whose heading is only the old subject name. null = keep the page's own heading.
  const GENERIC = new Set(['History & Geopolitics', 'Economics & Political Systems', 'Human Body & Biology', 'Physics, Chemistry & Space', 'Mathematics', 'AI & Computing', 'Mandarin', 'GED Arcade', 'Evidence Lab', 'This Week', 'Reading Room', 'Everything people know, and how we found it out.']);
  L.isGenericTitle = (t) => GENERIC.has((t || '').trim());
  L.titleFor = (hash) => {
    const h = hash.replace(/^#/, ''); let m;
    const subj = h.match(/^(history|economy|body|physics|math|ai|mandarin|ged|evidence|news|reading)-([a-z0-9]+)(?:-(.*))?$/);
    if ((m = h.match(/^history-modern-([a-z]+)(?:-(.+))?$/))) {
      const id = m[1], rest = m[2];
      const subs = ((L.MODERN || {}).SUBS || []); const sub = subs.find((s) => s[0] === id);
      const D = (L.DEEPDIVES || {})[id];
      if (D && rest) { const s = (D.sections || []).find((x) => x[0] === rest.split('-')[0]); const c = D.data && D.data.cases && D.data.cases[rest]; return deepName(id) + ': ' + clean(s ? s[1] : c ? (c.t || c.title || c.name || rest) : rest.replace(/-/g, ' ')); }
      if (id === 'timeline' && rest) { const ev = rest.replace(/^ev-?/, ''); const E = ((L.MODERN || {}).events || []).find((e) => (e.id || e[0]) === ev); return ev ? (E ? (E.t || E.title || E[1]) : 'Major event') : 'Major events, 1839 to today'; }
      if (sub) return clean(sub[1]);
      if (D) return deepName(id);
      return null;
    }
    if (subj) {
      const S = (L.subjects || []).find((s) => s.id === subj[1]);
      const ex = S && S.ex.find((e) => e[0] === subj[2]);
      if (ex) return clean(ex[1]);
    }
    if ((m = h.match(/^d-([a-z]+)$/))) return DISC_NAME()[m[1]] || null;
    return null;
  };
  L.sectionName = secName;
})();
