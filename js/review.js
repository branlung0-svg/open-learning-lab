/* Review: spaced repetition, explain-it-back and notes.
   Cards are built from the Lab's own content (timelines, people, big questions, case studies, claims,
   learning-journey checks) plus the learner's own cards. A card joins the learner's queue once they have
   visited its page, so review always covers what they have actually seen. Scheduling is a simple SM-2
   variant: Again / Hard / Good / Easy. Everything is stored in Lab.state (browser, or the claude.ai account). */
(function () {
  const h = Lab.h;
  const today = () => Math.floor(Date.now() / 864e5);
  const S = () => { const s = Lab.state; s.srs = s.srs || {}; s.notes = s.notes || {}; s.seen = s.seen || {}; s.mycards = s.mycards || []; return s; };
  const NEW_PER_DAY = 12;

  // ---------- pages seen ----------
  const pageKey = (hash) => { const raw = (hash || location.hash || '#home').slice(1); const p = raw.split('-');
    if (p[0] === 'history' && p[1] === 'modern') return p.slice(0, 4).join('-');
    if (p[0] === 'd' || p[0] === 'connect' || p[0] === 'learn' || p[0] === 'play') return p.slice(0, 2).join('-');
    return p.slice(0, 2).join('-'); };
  const markSeen = () => { const k = pageKey(); if (!k || k === 'home' || k === 'review' || k === 'notes') return; const s = S(); if (!s.seen[k]) { s.seen[k] = today(); Lab.save(); } };
  window.addEventListener('hashchange', () => setTimeout(markSeen, 300));
  document.addEventListener('DOMContentLoaded', () => setTimeout(markSeen, 900));

  // ---------- the card pool ----------
  // card: {id, page, kind: 'recall' | 'explain' | 'verdict', front, back, src, opts?}
  let POOL = null;
  Lab.cardPool = () => {
    if (POOL) return POOL;
    const C = [];
    (Lab.DISC || []).forEach((d) => {
      const page = 'd-' + d.id;
      if (!(Lab.CLAIMS || {})[d.id]) (d.tl || []).forEach((t, i) => C.push({ id: `d:${d.id}:tl:${i}`, page, kind: 'recall', topic: d.name, front: `${d.e} ${d.name}: when did this happen?\n\n“${t[1]}”`, back: t[0] }));
      (d.people || []).forEach((p, i) => C.push({ id: `d:${d.id}:p:${i}`, page, kind: 'recall', topic: d.name, front: `${d.e} ${d.name}: who is this?\n\n${p[3]}`, back: `${p[1]} (${p[2]})` }));
      (d.qs || []).forEach((q, i) => C.push({ id: `d:${d.id}:q:${i}`, page, kind: 'explain', topic: d.name, front: q, back: `There is no single answer. A strong answer names what the field knows, what is still debated, and one piece of evidence. Revisit the ${d.name} page and its debates to check yourself.` }));
      (d.links || []).forEach((l, i) => { const o = (Lab.DISC || []).find((x) => x.id === l[0]); if (o) C.push({ id: `d:${d.id}:l:${i}`, page, kind: 'recall', topic: d.name, front: `How are ${d.name} and ${o.name} connected?`, back: l[1] }); });
    });
    (Lab.CONNECT || []).forEach((c) => C.push({ id: 'c:' + c.id, page: 'connect-' + c.id, kind: 'explain', topic: 'Connections', front: `${c.e} ${c.t}\n\n${c.q}`, back: c.result + '\n\nLesson: ' + c.lesson }));
    (Lab.LEARN || []).forEach((st) => (st.u || []).forEach((u) => C.push({ id: 'l:' + u[0], page: 'learn', kind: 'explain', topic: 'Learning journey', front: `${u[2]}\n\n${u[6]}`, back: u[3] + ' Open the unit’s steps to check your answer.' })));
    if (Lab.MARX) { const X = Lab.MARX;
      X.ideas.forEach((x) => C.push({ id: 'mx:i:' + x[0], page: 'history-modern-marxism-ideas', kind: 'explain', topic: 'Marxism', front: `${x[1]} Explain in your own words: ${x[2]}`, back: x[3] }));
      X.claims.forEach((x, i) => C.push({ id: 'mx:c:' + i, page: 'history-modern-marxism-claims', kind: 'verdict', topic: 'Marxism', front: x[0], back: x[2], answer: x[1], opts: ['True', 'False', 'Misleading', 'Contested'] }));
      X.predictions.forEach((x, i) => C.push({ id: 'mx:p:' + i, page: 'history-modern-marxism-evidence', kind: 'verdict', topic: 'Marxism', front: 'Marx predicted: ' + x[0] + '. How did it turn out?', back: x[2], answer: x[1], opts: ['Hit', 'Miss', 'Mostly miss', 'Contested', 'Hit (but reformist)'] }));
    }
    Object.values(Lab.DEEPDIVES || {}).forEach((D) => (Lab.DIVE_HEADINGS || []).forEach(([k, n]) => { const s = D.side && D.side[k]; if (s) C.push({ id: `dv:${D.id}:${k}`, page: 'history-modern-dives', kind: 'explain', topic: 'Ideologies side by side', front: (Lab.DIVE_QS[k] || n).replace('{t}', D.title) + ' Answer in two or three sentences.', back: s[0] }); }));
    Object.values(Lab.CLAIMS || {}).forEach((F) => { const d = (Lab.DISC || []).find((x) => x.id === F.disc); if (!d) return; const page = 'd-' + d.id;
      (F.events || []).forEach((c) => C.push({ id: 'cl:' + c.id, page, kind: 'recall', topic: d.name, front: `${d.e} ${d.name}: when did this happen?\n\n“${c.text}”`, back: c.when + (c.sources && c.sources[0] ? `\n\nSource: ${c.sources[0].cite}` : '') }));
      (F.people || []).forEach((c) => C.push({ id: 'cl:' + c.id, page, kind: 'recall', topic: d.name, front: `${d.e} ${d.name}: who is this?\n\n${c.text}`, back: `${c.name} (${c.years}, ${c.region})` })); });
    S().mycards.forEach((c) => C.push(Object.assign({ kind: 'recall', topic: 'My cards' }, c)));
    POOL = C; return C;
  };
  const seenPage = (page) => { const s = S().seen; if (page === 'learn') return Object.keys(s).some((k) => k.startsWith('learn')); return Object.keys(s).some((k) => k === page || k.startsWith(page + '-') || page.startsWith(k)); };

  // ---------- scheduling ----------
  const due = () => { const s = S(), t = today(); POOL = null; const pool = Lab.cardPool();
    const old = pool.filter((c) => s.srs[c.id] && s.srs[c.id].due <= t);
    const introducedToday = Object.values(s.srs).filter((r) => r.first === t).length;
    const cand = pool.filter((c) => !s.srs[c.id] && (c.mine || seenPage(c.page)));
    // Mix new cards across pages and kinds (seeded by the day, so the choice is stable within a day).
    let seed = t * 2654435761 % 4294967296; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const groups = {}; cand.forEach((c) => { const g = c.page + ':' + c.kind; (groups[g] = groups[g] || []).push(c); });
    Object.values(groups).forEach((a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } });
    const keys = Object.keys(groups).sort(() => rnd() - 0.5); const mixed = []; let added = true;
    for (let r = 0; added; r++) { added = false; keys.forEach((k) => { if (groups[k][r]) { mixed.push(groups[k][r]); added = true; } }); }
    const fresh = mixed.slice(0, Math.max(0, NEW_PER_DAY - introducedToday));
    return { old, fresh, all: [...old, ...fresh] }; };
  Lab.reviewDue = () => due().all.length;
  const grade = (c, g) => { const s = S(), t = today(); const r = s.srs[c.id] || { ivl: 0, ease: 2.5, reps: 0, lapses: 0, first: t };
    if (g === 1) { r.lapses++; r.reps = 0; r.ivl = 0; r.ease = Math.max(1.3, r.ease - 0.2); }
    else { r.reps++; r.ivl = r.reps === 1 ? (g === 4 ? 4 : g === 2 ? 1 : 2) : Math.max(1, Math.round(r.ivl * (g === 2 ? 1.2 : g === 4 ? r.ease * 1.3 : r.ease))); r.ease = Math.max(1.3, r.ease + (g === 2 ? -0.15 : g === 4 ? 0.15 : 0)); }
    r.due = t + r.ivl; r.last = t; s.srs[c.id] = r; Lab.save(); };
  const strength = () => { const s = S(); const rs = Object.values(s.srs); return { learned: rs.length, strong: rs.filter((r) => r.ivl >= 21).length, fading: rs.filter((r) => r.due <= today()).length }; };

  // ---------- review page ----------
  Lab.routes.review = (app) => {
    document.documentElement.style.setProperty('--accent', '#0D9488'); Lab.setContext('Review');
    const st = strength(); const q = due(); let i = 0, done = 0; const queue = Lab.shuffle(q.old).concat(q.fresh);
    const stage = h('div');
    app.append(h('section', { class: 'hero', style: { background: 'linear-gradient(120deg,#0F766E,#0D9488 50%,#2563EB)' } }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '🧠'), h('h1', null, 'Daily review'), h('p', null, 'Remembering takes recall, not rereading. A few minutes a day brings back what you have seen, just before you would forget it.'),
      h('div', { class: 'row', style: { gap: '8px', marginTop: '8px', flexWrap: 'wrap' } }, ...[[`${q.old.length} due`, 'cards to review'], [`${q.fresh.length} new`, 'from pages you visited'], [`${st.learned}`, 'cards learned'], [`${st.strong}`, 'remembered 3+ weeks']].map(([a, b]) => h('span', { class: 'pill', style: { background: 'rgba(255,255,255,.18)', color: '#fff', borderColor: 'transparent' } }, h('b', null, a), ' ', b)))), stage,
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '➕ Make your own card'), myCardForm(() => Lab.go('review'))),
      h('div', { class: 'card small muted' }, h('b', null, 'How it works. '), 'Cards come from the timelines, people, big questions, case studies and claims on pages you have opened, up to ', String(NEW_PER_DAY), ' new a day. Rate each answer honestly: cards you find hard come back sooner, easy ones later (spaced repetition, one of the best-supported study methods in learning research). ', h('a', { href: '#notes' }, 'Your notes →')));
    const show = () => { stage.innerHTML = ''; const c = queue[i];
      if (!c) { stage.append(h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { style: { fontSize: '40px' } }, done ? '🎉' : '🌱'), h('h2', null, done ? `Done: ${done} card${done === 1 ? '' : 's'} reviewed` : 'Nothing to review yet'), h('p', { class: 'small muted' }, done ? 'Come back tomorrow for the next ones.' : 'Explore a discipline, a case study or the learning journey, and its cards will appear here.'), h('a', { class: 'btn primary', href: '#learn', style: { textDecoration: 'none' } }, 'Go to the learning journey'))); if (done) Lab.markDone('review:' + today(), 20, 'daily review'); return; }
      const back = h('div', { style: { display: 'none' } }); const card = h('div', { class: 'card' });
      const rateRow = h('div', { class: 'row', style: { gap: '6px', marginTop: '10px', flexWrap: 'wrap' } }, [[1, 'Again', '#DC2626'], [2, 'Hard', '#EA580C'], [3, 'Good', '#16A34A'], [4, 'Easy', '#2563EB']].map(([g, l, col]) => h('button', { class: 'btn', style: { borderColor: col, color: col }, onclick: () => { grade(c, g); if (g === 1) queue.push(c); i++; done++; Lab.addXP(1); show(); } }, l)));
      const reveal = () => { back.style.display = ''; revealBtn.remove(); back.append(rateRow); };
      const revealBtn = h('button', { class: 'btn primary', style: { marginTop: '10px' }, onclick: reveal }, 'Show answer');
      let body;
      if (c.kind === 'verdict') {
        body = h('div', { class: 'row', style: { gap: '6px', marginTop: '10px', flexWrap: 'wrap' } }, c.opts.map((o) => h('button', { class: 'btn', onclick: (e) => { [...body.children].forEach((b) => (b.disabled = true)); e.target.style.outline = '2px solid ' + (o === c.answer ? '#16A34A' : '#DC2626'); back.prepend(h('p', { style: { fontWeight: 700, color: o === c.answer ? '#16A34A' : '#DC2626' } }, (o === c.answer ? '✓ ' : '✗ ') + 'Answer: ' + c.answer)); reveal(); } }, o)));
      } else if (c.kind === 'explain') {
        const ta = h('textarea', { rows: 4, placeholder: 'Explain it in your own words, as if to a friend. Writing it out is what makes it stick.', style: { width: '100%', marginTop: '10px' } });
        const prev = (S().notes['explain:' + c.id] || {}).t; if (prev) ta.value = prev;
        body = h('div', null, ta, h('div', { class: 'row', style: { gap: '6px', marginTop: '6px', flexWrap: 'wrap' } }, h('button', { class: 'btn primary', onclick: () => { if (ta.value.trim()) { S().notes['explain:' + c.id] = { t: ta.value.trim(), at: today(), page: c.page, title: c.front.split('\n')[0] }; Lab.save(); } reveal(); } }, 'Compare with the answer'), h('button', { class: 'btn', onclick: () => Lab.ask(`Check my explanation. The question: ${c.front.replace(/\n+/g, ' ')}\n\nMy explanation: ${ta.value.trim() || '(I have not written one yet; ask me guiding questions)'}\n\nTell me what I got right, what is missing or wrong, and one question to push me further. Be honest and specific.`, c.topic) }, '✦ Get feedback')));
        back.append(h('div', { class: 'small muted', style: { marginTop: '8px' } }, 'Did your explanation: name the main idea? give an example or evidence? say why it matters? Rate yourself on that.'));
      } else body = revealBtn;
      back.prepend(h('div', { class: 'small', style: { whiteSpace: 'pre-wrap', marginTop: '10px', padding: '10px', borderRadius: '10px', background: 'var(--card2)' } }, c.back));
      card.append(h('div', { class: 'row', style: { gap: '8px' } }, h('span', { class: 'tag', style: { '--c': '#0D9488' } }, c.topic || 'Review'), h('span', { class: 'tiny muted' }, `${i + 1} of ${queue.length}` + (S().srs[c.id] ? '' : ' · new')), h('span', { class: 'sp' }), c.page && c.page !== 'learn' ? h('a', { class: 'tiny', href: '#' + c.page }, 'Open page →') : null),
        h('div', { style: { whiteSpace: 'pre-wrap', fontSize: '18px', fontWeight: 600, marginTop: '10px', lineHeight: 1.45 } }, c.front), c.kind === 'recall' ? null : body, back, c.kind === 'recall' ? body : null);
      stage.append(card); };
    show();
  };

  function myCardForm(after, preset) {
    const f = h('textarea', { rows: 2, placeholder: 'Question or prompt', style: { width: '100%' } }); const b = h('textarea', { rows: 2, placeholder: 'Answer', style: { width: '100%', marginTop: '6px' } });
    if (preset) b.value = preset;
    return h('div', null, f, b, h('button', { class: 'btn sm primary', style: { marginTop: '6px' }, onclick: () => { if (!f.value.trim() || !b.value.trim()) return; S().mycards.push({ id: 'my:' + Date.now(), mine: true, page: pageKey(), front: f.value.trim(), back: b.value.trim() }); POOL = null; Lab.save(); Lab.toast('Card added to your review'); after && after(); } }, 'Add card'));
  }

  // ---------- notes ----------
  Lab.openNotes = () => { const k = pageKey(); const s = S(); const title = (document.querySelector('#app h1') || {}).textContent || k;
    const ta = h('textarea', { rows: 10, style: { width: '100%' }, placeholder: 'Your notes on this page. Saved automatically.' }); ta.value = (s.notes[k] || {}).t || '';
    let tm; ta.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { if (ta.value.trim()) s.notes[k] = { t: ta.value, at: today(), title, page: k }; else delete s.notes[k]; Lab.save(); }, 500); };
    const sel = String(window.getSelection ? window.getSelection() : '').trim();
    Lab.modal('📝 Notes: ' + title.slice(0, 60), h('div', { class: 'stack' }, sel ? h('button', { class: 'btn sm', onclick: () => { ta.value += (ta.value ? '\n\n' : '') + '“' + sel + '”'; ta.oninput(); } }, '+ Add the text you selected') : null, ta,
      h('details', null, h('summary', { class: 'small' }, '➕ Turn something on this page into a review card'), myCardForm(null, sel)), h('div', { class: 'row', style: { gap: '8px' } }, h('a', { href: '#notes', class: 'small' }, 'All my notes →'), h('span', { class: 'tiny muted' }, Lab.db ? 'Saved to your account.' : 'Saved in this browser.'))));
    setTimeout(() => ta.focus(), 50); };
  Lab.routes.notes = (app) => { const s = S(); const entries = Object.entries(s.notes).sort((a, b) => (b[1].at || 0) - (a[1].at || 0));
    const q = h('input', { type: 'search', placeholder: 'Search your notes…', style: { width: '100%' } }); const list = h('div', { class: 'stack' });
    const draw = () => { list.innerHTML = ''; const t = q.value.toLowerCase(); const rows = entries.filter(([k, n]) => !t || (n.t + ' ' + (n.title || '')).toLowerCase().includes(t));
      if (!rows.length) list.append(h('p', { class: 'small muted' }, entries.length ? 'No notes match.' : 'No notes yet. Tap 📝 at the top of any page to start.'));
      rows.forEach(([k, n]) => list.append(h('div', { class: 'card' }, h('div', { class: 'row' }, h('b', null, k.startsWith('explain:') ? '🗣️ ' + (n.title || 'Explanation') : n.title || k), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, new Date((n.at || 0) * 864e5).toISOString().slice(0, 10))), h('div', { class: 'small', style: { whiteSpace: 'pre-wrap', marginTop: '6px' } }, n.t), n.page ? h('a', { class: 'tiny', href: '#' + n.page }, 'Open page →') : null))); };
    q.oninput = draw;
    const exp = h('button', { class: 'btn sm', onclick: () => { const txt = entries.map(([k, n]) => `## ${n.title || k}\n${n.t}\n`).join('\n'); navigator.clipboard && navigator.clipboard.writeText(txt).then(() => Lab.toast('Notes copied'), () => {}); } }, '📋 Copy all notes');
    app.append(h('section', { class: 'hero', style: { background: 'linear-gradient(120deg,#334155,#0D9488)' } }, h('a', { class: 'crumb', href: '#home' }, '← Home'), h('div', { class: 'emoji', style: { marginTop: '10px' } }, '📝'), h('h1', null, 'My notes'), h('p', null, `${entries.length} note${entries.length === 1 ? '' : 's'}, including your own explanations from review.`)), h('div', { class: 'card' }, h('div', { class: 'row', style: { gap: '8px' } }, q, exp)), list); draw(); };

  // ---------- top bar + home card ----------
  document.addEventListener('DOMContentLoaded', () => {
    const top = document.querySelector('.top .wrap'); if (!top) return; const sp = top.querySelector('.sp');
    const rv = h('a', { class: 'pill', href: '#review', title: 'Daily review', style: { textDecoration: 'none', color: 'inherit', background: 'var(--card)' } }, '🧠 ', h('span', { id: 'dueVal' }, ''));
    const nt = h('button', { class: 'pill', title: 'Notes on this page', onclick: () => Lab.openNotes(), style: { cursor: 'pointer', font: 'inherit', color: 'inherit', background: 'var(--card)' } }, '📝');
    sp.after(rv, nt);
    const upd = () => { const n = Lab.reviewDue(); const el = document.getElementById('dueVal'); if (el) el.textContent = n ? String(n) : ''; };
    setTimeout(upd, 1500); window.addEventListener('hashchange', () => setTimeout(upd, 800));
  });
})();
