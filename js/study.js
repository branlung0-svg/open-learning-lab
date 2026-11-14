// Study tools shared by every deep dive: progress and "continue", quick checks built from the Lab's own
// data, missed questions sent to Review, search across everything, "also appears in" connections,
// listen-aloud, explain-simply, text size, and the expert-review status of each section.
(function () {
  const h = Lab.h;
  const today = () => Math.floor(Date.now() / 864e5);
  const pick = (a, n) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b.slice(0, n); };
  const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s\S*$/, '') + '…' : s; };
  const strip = (s) => String(s || '').replace(/<[^>]+>/g, '');
  const ALL = () => Lab.DIVES_ALL || {};

  // ---------------------------------------------------------------- progress
  const prog = (D) => { const s = Lab.state; s.dive = s.dive || {}; return (s.dive[D.id] = s.dive[D.id] || { done: {}, last: null }); };
  const countable = (D) => D.sections.filter(([k]) => k !== 'start');
  Lab.diveProgress = (D) => { const p = prog(D); const secs = countable(D); const n = secs.filter(([k]) => p.done[k]).length; return { n, total: secs.length, last: p.last, done: p.done }; };
  const markDone = (D, k) => { const p = prog(D); if (!p.done[k]) { p.done[k] = today(); Lab.state.xp = (Lab.state.xp || 0) + 5; Lab.save(); if (Lab.toast) Lab.toast('Section done · +5 XP'); } };

  // ---------------------------------------------------------------- quick checks
  // Each question: { q, opts, a, why }. Built only from vetted data already shown in that section.
  const mc = (q, right, wrongPool, why) => { const wrong = pick([...new Set(wrongPool.filter((w) => w && w !== right))], 3); if (wrong.length < 2) return null; return { q, opts: pick([right, ...wrong], 4), a: right, why }; };
  const GEN = {
    ideas: (X) => (X.ideas || []).map((x) => mc(`Which idea is this? “${clip(x[3], 170)}”`, x[2], X.ideas.map((y) => y[2]), x[3])),
    tree: (X) => (X.tree || []).map((x) => mc(`Which branch is this? “${clip(x[4], 170)}”`, x[1], X.tree.map((y) => y[1]), `${x[1]} (${x[2]}): ${x[4]}`)),
    lineage: (X) => { const L = X.lineage; if (!L) return []; const nm = (s) => s.who; return L.steps.flatMap((s) => (s.added || []).slice(0, 2).map((a) => mc(`Who added this? “${clip(a, 160)}”`, nm(s), L.steps.map(nm), `${s.who} (${s.yrs}). Conditions: ${clip(s.cond, 220)}`))); },
    machine: (X) => (X.gap || []).map((g) => { const lab = ['No', 'Partly', 'Yes'][g[3]]; return { q: `Promise: “${g[0]}”. Was it kept in practice?`, opts: ['No', 'Partly', 'Yes'], a: lab, why: g[2] }; }),
    cases: (X) => Object.values(X.cases || {}).flatMap((c) => (c.tl || []).map(([y, t]) => mc(`${c.flag} ${c.n}: when did this happen? “${clip(t, 150)}”`, y, (c.tl || []).map((r) => r[0]), `${y}: ${t}`))),
    evidence: (X) => [...(X.tolls || []).map((r) => mc(`Which estimate goes with: ${r[0]}?`, r[1], X.tolls.map((x) => x[1]), `${r[0]}: ${r[1]} (${strip(r[2])}). ${r[3] || ''}`)),
      ...(X.gains || []).map((r) => mc(`Which change goes with: ${r[0]}?`, r[1], X.gains.map((x) => x[1]), `${r[0]}: ${r[1]} (${strip(r[2])}). Caveat: ${r[3] || ''}`))],
    claims: (X) => (X.claims || []).map((c) => ({ q: `True or false? “${c[0]}”`, opts: ['True', 'False', 'Misleading', 'Contested'], a: c[1], why: c[2] })),
  };
  const ALIAS = { compare: 'claims', debates: 'claims', locker: 'evidence', voices: 'cases', gallery: null, labs: null, reading: null, start: null, timeline: 'cases', resist: 'claims', words: 'claims', denial: 'claims' };
  const questionsFor = (D, k) => { let g = k in ALIAS ? ALIAS[k] : k; if (g === null) return []; let qs = (GEN[g] ? GEN[g](D.data) : []).filter(Boolean); if (qs.length < 3 && g !== 'claims') qs = qs.concat(GEN.claims(D.data)); return pick(qs, 3); };

  // missed questions go to the Review queue as cards, due today
  const toReview = (D, k, item) => { const s = Lab.state; s.quizcards = s.quizcards || {}; s.srs = s.srs || {}; const id = 'qz:' + D.id + ':' + item.q.slice(0, 80);
    s.quizcards[id] = { id, page: D.base + '-' + k, kind: 'verdict', topic: D.title, front: item.q, back: item.why, answer: item.a, opts: item.opts };
    s.srs[id] = Object.assign(s.srs[id] || { ivl: 0, ease: 2.3, reps: 0, lapses: 0, first: today() }, { due: today() }); Lab.save(); };

  const quizCard = (D, k, onDone) => { const qs = questionsFor(D, k); const p = prog(D);
    const done = h('button', { class: 'btn sm' + (p.done[k] ? '' : ' primary'), onclick: () => { markDone(D, k); done.textContent = '✓ Section done'; done.classList.remove('primary'); onDone(); } }, p.done[k] ? '✓ Section done' : 'Mark this section done');
    if (!qs.length) return h('div', { class: 'card study-end' }, h('div', { class: 'row', style: { justifyContent: 'space-between', gap: '8px' } }, h('b', null, 'Finished this section?'), done));
    let answered = 0, right = 0; const score = h('span', { class: 'small muted' });
    const list = h('div', { class: 'stack', style: { gap: '10px' } }, qs.map((it, n) => { const fb = h('div', { class: 'small', style: { display: 'none', marginTop: '6px' } });
      const btns = it.opts.map((o) => h('button', { class: 'qz-opt', onclick: (e) => { if (fb.style.display !== 'none') return; const ok = o === it.a; answered++; if (ok) right++;
        btns.forEach((b) => { b.disabled = true; if (b.textContent === it.a) b.classList.add('ok'); }); if (!ok) e.currentTarget.classList.add('no');
        fb.style.display = ''; fb.replaceChildren(h('b', { style: { color: ok ? '#15803D' : '#B91C1C' } }, ok ? 'Right. ' : `Not quite: the answer is “${clip(it.a, 80)}”. `), clip(it.why, 420), ok ? null : h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, '↻ Added to your Review queue for today.'));
        if (!ok) toReview(D, k, it); score.textContent = `${right} of ${answered} right`; if (answered === qs.length) { markDone(D, k); done.textContent = '✓ Section done'; done.classList.remove('primary'); onDone(); } } }, clip(o, 120)));
      return h('div', { class: 'qz' }, h('div', { class: 'small', style: { fontWeight: 600 } }, `${n + 1}. ${it.q}`), h('div', { class: 'qz-opts' }, btns), fb); }));
    return h('div', { class: 'card study-end' }, h('div', { class: 'row', style: { justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' } }, h('h3', { style: { margin: 0 } }, '✅ Check yourself'), score),
      h('p', { class: 'tiny muted', style: { margin: '4px 0 10px' } }, 'Three quick questions built from this section. Anything you miss comes back in Review, spaced out so it sticks.'), list, h('div', { style: { marginTop: '10px' } }, done));
  };

  // ---------------------------------------------------------------- reading tools
  let speaking = false;
  Lab.readAloud = (text) => { try { speechSynthesis.cancel(); } catch (e) {}
    const parts = String(text).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [];
    if (!('speechSynthesis' in window)) { Lab.speak && Lab.speak(text); return; }
    speaking = true; parts.slice(0, 400).forEach((p, i) => { const u = new SpeechSynthesisUtterance(p.trim()); u.rate = 1; if (i === parts.length - 1) u.onend = () => { speaking = false; }; speechSynthesis.speak(u); }); };
  const fontScale = () => (Lab.state.fontScale || 1);
  const applyScale = () => document.documentElement.style.setProperty('--fs', fontScale());
  Lab.setFontScale = (d) => { Lab.state.fontScale = Math.min(1.4, Math.max(0.9, Math.round((fontScale() + d) * 10) / 10)); Lab.save(); applyScale(); };
  const tools = (D, k, title, panel) => { const listen = h('button', { class: 'btn sm ghost', title: 'Read this section aloud', onclick: () => { if (speaking) { try { speechSynthesis.cancel(); } catch (e) {} Lab.stopSpeaking && Lab.stopSpeaking(); speaking = false; listen.textContent = '🔊 Listen'; return; } Lab.readAloud(panel.innerText.replace(/Check yourself[\s\S]*$/, '')); listen.textContent = '⏹ Stop'; } }, '🔊 Listen');
    const simple = h('button', { class: 'btn sm ghost', title: 'Ask the tutor to explain this section simply', onclick: () => Lab.ask(`Explain the “${title}” part of the ${D.title} deep dive simply, for a curious 12-year-old: the main idea in 5–8 short sentences, one everyday example, and two questions to think about. Stay fair to every side and keep the facts accurate. Here is the section text:\n\n${clip(panel.innerText, 3500)}`, D.title + ': ' + title) }, '🧒 Explain simply');
    return h('div', { class: 'study-tools' }, listen, simple, h('span', { class: 'sp' }), h('button', { class: 'btn sm ghost', title: 'Smaller text', 'aria-label': 'Smaller text', onclick: () => Lab.setFontScale(-0.1) }, 'A−'), h('button', { class: 'btn sm ghost', title: 'Bigger text', 'aria-label': 'Bigger text', onclick: () => Lab.setFontScale(0.1) }, 'A+')); };

  // ---------------------------------------------------------------- expert review status
  // Filled in as specialists review sections: key `${diveId}:${section}` → [name, credentials, date, note]
  Lab.REVIEWS = Lab.REVIEWS || {};
  const ISSUE = 'https://github.com/branlung0-svg/open-learning-lab/issues/new?template=expert-review.yml&title=';
  const builtDate = () => { const s = document.querySelector('script[src*="study.js?v="]'); const v = s && +s.src.split('v=')[1]; return v ? new Date(v * 1000).toISOString().slice(0, 10) : ''; };
  const reviewLine = (D, k, title) => { const r = Lab.REVIEWS[D.id + ':' + k];
    return h('div', { class: 'tiny muted study-review' }, r ? h('span', null, `✅ Reviewed by ${r[0]} (${r[1]}), ${r[2]}. `) : h('span', null, '📝 Drafted from the cited sources; not yet checked by an outside specialist. '),
      builtDate() ? `Last updated ${builtDate()}. ` : '', h('a', { href: ISSUE + encodeURIComponent(`Review: ${D.title} – ${title}`), target: '_blank', rel: 'noopener' }, 'Are you a specialist? Review this section ↗'), ' · ', h('a', { href: '#reviewers' }, 'How reviews work')); };

  // ---------------------------------------------------------------- search index across everything
  let IDX = null;
  const add = (out, href, title, where, text) => out.push({ href, title: clip(strip(title), 140), where, text: strip(text + ' ' + title).toLowerCase() });
  Lab.searchIndex = () => { if (IDX) return IDX; const out = [];
    Object.values(ALL()).forEach((D) => { const X = D.data, b = '#' + D.base, T = D.title;
      (X.ideas || []).forEach((x) => add(out, b + '-ideas', x[2], T + ' · idea', x[3]));
      (X.tree || []).forEach((x) => add(out, b + '-tree', x[1] + ' (' + x[2] + ')', T + ' · family tree', x[4]));
      Object.entries(X.cases || {}).forEach(([ck, c]) => { add(out, b + '-' + ck, c.flag + ' ' + c.n + ' (' + c.years + ')', T + ' · case study', c.sum + ' ' + (c.gains || []).join(' ') + ' ' + (c.costs || []).join(' '));
        (c.tl || []).forEach(([y, t]) => add(out, b + '-' + ck, y + ': ' + t, T + ' · ' + c.n + ' timeline', '')); });
      ((X.lineage && X.lineage.steps) || []).forEach((s) => add(out, b + '-lineage-' + s.id, s.who + ' (' + s.yrs + ')', T + ' · how it changed', s.cond + ' ' + (s.added || []).join(' ') + ' ' + (s.changed || []).join(' ') + ' ' + s.result));
      (X.tolls || []).forEach((r) => add(out, b + '-evidence', r[0] + ': ' + r[1], T + ' · evidence', r[3] || ''));
      (X.gains || []).forEach((r) => add(out, b + '-evidence', r[0] + ': ' + r[1], T + ' · evidence', r[3] || ''));
      (X.claims || []).forEach((c) => add(out, b + '-claims', c[0], T + ' · claim (' + c[1] + ')', c[2]));
      (X.debates || []).forEach((d) => add(out, b + '-debates', d.q, T + ' · debate', (d.sides || []).map((x) => x.join(' ')).join(' ')));
      (X.gap || []).forEach((g) => add(out, b + '-machine', 'Promise: ' + g[0], T + ' · theory vs practice', g[2])); });
    ((Lab.MODERN && Lab.MODERN.events) || []).forEach((e) => add(out, '#history-modern-timeline-ev-' + e.id, (e.y2 && e.y2 !== e.y ? e.y + '–' + e.y2 : e.y) + ': ' + e.t, 'Modern world timeline · ' + (e.place || ''), (e.what || '') + ' ' + (e.place || '')));
    (Lab.DISC || []).forEach((d) => { add(out, '#d-' + d.id, d.e + ' ' + d.name, 'Discipline', d.what);
      (d.tl || []).forEach((t) => add(out, '#d-' + d.id + '-story', t[0] + ': ' + t[1], d.name + ' · timeline', ''));
      (d.people || []).forEach((p) => add(out, '#d-' + d.id + '-story', p[1] + ' (' + p[2] + ')', d.name + ' · person', p[3])); });
    [...(Lab.GUIDED || []), ...(Lab.LIB || [])].forEach((x) => add(out, '#reading-library-' + x.id, '📖 ' + x.t + ' — ' + (x.a || ''), 'Book', ''));
    return (IDX = out); };
  Lab.searchAll = (q, limit) => { q = q.trim().toLowerCase(); if (q.length < 2) return []; const words = q.split(/\s+/);
    return Lab.searchIndex().map((e) => { const t = e.title.toLowerCase(); let sc = 0; for (const w of words) { if (t.includes(w)) sc += 3; else if (e.text.includes(w)) sc += 1; else return null; } if (t.includes(q)) sc += 4; return [sc, e]; })
      .filter(Boolean).sort((a, b) => b[0] - a[0]).slice(0, limit || 60).map((x) => x[1]); };
  Lab.appearsIn = (words, excludeHref) => { if (!words || !words.length) return []; const re = new RegExp('\\b(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i');
    const seen = new Set(); return Lab.searchIndex().filter((e) => e.href !== excludeHref && re.test(e.title + ' ' + e.text)).filter((e) => { const k = e.href + '|' + e.where.split(' · ')[0]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 10); };
  Lab.appearsPanel = (words, excludeHref) => { const hits = Lab.appearsIn(words, excludeHref); if (!hits.length) return null;
    return h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🔗 Also appears in'), h('p', { class: 'tiny muted', style: { marginTop: 0 } }, 'The same places, events and people elsewhere in the Lab. The whole story is spread across subjects.'),
      h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, hits.map((e) => h('a', { class: 'chip', href: e.href, title: e.title, style: { textDecoration: 'none', color: 'inherit' } }, h('b', null, e.where.split(' · ')[0]), ' · ' + clip(e.title, 60))))); };

  // ---------------------------------------------------------------- the search page
  Lab.routes.search = (app, args) => { const q0 = decodeURIComponent((args || []).join('-')); Lab.setContext('Search');
    const input = h('input', { type: 'search', value: q0, placeholder: 'Search everything: people, events, countries, ideas, books, pictures…', style: { width: '100%', fontSize: '17px', padding: '12px 14px' }, autofocus: true });
    const res = h('div', { class: 'stack', style: { gap: '6px' } }); const pics = h('div');
    const run = () => { const q = input.value.trim(); history.replaceState(null, '', '#search' + (q ? '-' + encodeURIComponent(q) : '')); res.innerHTML = ''; pics.innerHTML = ''; if (q.length < 2) return;
      const hits = Lab.searchAll(q, 80); const groups = {}; hits.forEach((e) => { const g = e.where.split(' · ')[0]; (groups[g] = groups[g] || []).push(e); });
      res.append(h('div', { class: 'small muted' }, `${hits.length} results`));
      Object.entries(groups).forEach(([g, list]) => res.append(h('div', { class: 'card', style: { padding: '12px 14px' } }, h('b', null, g), h('div', { class: 'stack', style: { gap: '4px', marginTop: '6px' } }, list.slice(0, 12).map((e) => h('a', { href: e.href, class: 'search-hit' }, h('span', null, e.title), h('span', { class: 'tiny muted' }, e.where.split(' · ').slice(1).join(' · '))))))));
      Lab.commons().then((C) => { const ql = q.toLowerCase(); const ks = Object.keys(C).filter((k) => ((C[k].title || '') + ' ' + (C[k].cap || '') + ' ' + (C[k].desc || '')).toLowerCase().includes(ql)).slice(0, 40);
        if (ks.length) pics.append(h('div', { class: 'card' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('b', null, `🖼️ ${ks.length}${ks.length === 40 ? '+' : ''} pictures`), h('a', { class: 'btn sm', href: '#archive', onclick: () => { try { sessionStorage.setItem('lab.archiveQ', q); } catch (e) {} } }, 'Open in the Archive →')), Lab.carousel(ks, { max: 40 }))); });
      if (!hits.length) res.append(h('p', { class: 'small muted' }, 'Nothing found in the text. Try fewer words, or ask the tutor.')); };
    let t = null; input.oninput = () => { clearTimeout(t); t = setTimeout(run, 200); };
    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('h1', null, 'Search everything'), h('p', null, 'Every deep dive, case study, timeline, person, claim, debate, book and picture in the Lab.')),
      h('div', { class: 'card', style: { position: 'sticky', top: '58px', zIndex: 6 } }, input), pics, res); setTimeout(() => input.focus(), 50); run(); };

  // ---------------------------------------------------------------- the reviewers page
  Lab.routes.reviewers = (app) => { Lab.setContext('Expert review');
    const done = Object.entries(Lab.REVIEWS);
    app.append(h('section', { class: 'hero' }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('h1', null, 'How the Lab is checked'), h('p', null, 'Most text in the Lab was drafted with AI help from the sources it cites. That makes outside review essential. Here is how it works and how you can help.')),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '1. Every section shows its status'), h('p', { class: 'small' }, 'At the bottom of each section you will see either “not yet checked by an outside specialist” or the name, field and date of the person who reviewed it.')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '2. Specialists review one section at a time'), h('p', { class: 'small' }, 'Historians, economists, scientists and teachers can open a review form from any section. They check facts, numbers, sources and balance, and say what is missing.')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '3. Corrections are public'), h('p', { class: 'small' }, 'Every change is recorded in the project’s public history on GitHub, with the reason. Mistakes are fixed, not hidden.')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '4. Anyone can report a mistake'), h('p', { class: 'small' }, 'You do not need to be a specialist to spot an error. Use “Report a mistake” at the bottom of any page.'), h('a', { class: 'btn sm primary', href: 'https://github.com/branlung0-svg/open-learning-lab/issues/new?template=expert-review.yml', target: '_blank', rel: 'noopener' }, 'Open the review form ↗'))),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, `Reviewed so far: ${done.length}`), done.length ? h('ul', { class: 'small' }, done.map(([k, r]) => h('li', null, `${k}: ${r[0]} (${r[1]}), ${r[2]}`))) : h('p', { class: 'small muted' }, 'No sections have been reviewed by an outside specialist yet. If you know someone who could check one, send them the link to a section.'))); };

  // ---------------------------------------------------------------- hook into the deep-dive engine
  Lab.study = {
    after(D, k, panel, title, refresh) {
      if (k === 'start') { const P = Lab.diveProgress(D); const last = P.last && P.last !== 'start' && D.sections.find(([x]) => x === P.last);
        panel.prepend(h('div', { class: 'card study-prog' }, h('div', { class: 'row', style: { justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' } }, h('div', null, h('b', null, `Your progress: ${P.n} of ${P.total} sections done`), h('div', { class: 'prog-bar', role: 'progressbar', 'aria-valuenow': P.n, 'aria-valuemax': P.total, 'aria-label': 'Sections done' }, h('i', { style: { width: Math.round(100 * P.n / Math.max(1, P.total)) + '%' } })), h('div', { class: 'meter', style: { marginTop: '6px', width: '220px' } }, h('i', { style: { width: Math.max(3, (P.n / P.total) * 100) + '%' } }))),
          last ? h('button', { class: 'btn sm primary', onclick: () => refresh(P.last) }, `Continue: ${last[1].replace(/^\W+\s*/, '')} →`) : h('span', { class: 'small muted' }, 'Pick any section; quick checks at the end of each one track your progress.'))));
        return; }
      const p = prog(D); p.last = k; Lab.save();
      panel.prepend(tools(D, k, title, panel));
      panel.append(quizCard(D, k, () => refresh()), reviewLine(D, k, title)); },
  };

  // search button in the top bar; text size on load; archive search hand-off
  document.addEventListener('DOMContentLoaded', () => { applyScale(); const bar = document.querySelector('.top .wrap .sp');
    if (bar && !document.getElementById('searchPill')) bar.after(h('a', { class: 'pill', id: 'searchPill', href: '#search', title: 'Search everything', 'aria-label': 'Search everything', style: { textDecoration: 'none', color: 'inherit' } }, '🔎')); });
  // cards from missed quick checks join the Review pool
  const prevPool = Lab.cardPool; if (prevPool) Lab.cardPool = () => { const base = prevPool(); const qc = Object.values((Lab.state.quizcards) || {}); const ids = new Set(base.map((c) => c.id)); return base.concat(qc.filter((c) => !ids.has(c.id))); };
})();
