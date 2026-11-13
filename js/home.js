const { h } = Lab;

// Today's three missions, picked from the learner's interests (or everything), changing daily.
const BASE_MISSIONS = [['history-atlas', '🗺️ Scrub the atlas from 1700 to 1815 and name 3 empires', 'history'], ['economy-divergence', '📈 Compare North and South Korea since 1950', 'economics'], ['body-dna', '🧬 Make the sickle-cell mutation and explain it out loud', 'biology'], ['math-probability', '🎲 Run the Galton board until the bell curve appears', 'statistics'], ['evidence-rate', '🔎 Rate 8 sources for trustworthiness', 'history'], ['physics-orbits', '🪐 Launch a moon into a stable orbit', 'physics'], ['reading-library-federalist', '📚 Read Federalist No. 10 (20 min)', 'politics'], ['ai-nn', '🤖 Train a neural network on the spiral', 'computing'], ['body-cell', '🔬 Click every organelle in the cell', 'biology'], ['history-timeline', '⏳ Read 5 timeline events from the Cold War', 'history'], ['reading-library-manifesto', '📚 Read Section I of the Communist Manifesto', 'economics']];
function todaysMissions() {
  const p = Lab.profile() || {}; const ints = p.interests || []; const day = Math.floor(Date.now() / 864e5);
  let pool = BASE_MISSIONS.map(([hash, label, d]) => [hash, label, d]);
  if (Lab.ARC) pool = pool.concat(Lab.ARC.labs.map((l) => ['play-' + l.id, (l.e || '🕹️') + ' ' + l.t, (l.d || [])[0], l.d || []]));
  let fav = ints.length ? pool.filter((m) => ints.includes(m[2]) || (m[3] || []).some((d) => ints.includes(d))) : pool;
  if (fav.length < 3) fav = pool;
  const pick = []; const seed = (i) => (day * 9301 + i * 49297) % 233280;
  for (let i = 0; pick.length < 3 && i < 50; i++) { const m = fav[seed(i) % fav.length]; if (!pick.includes(m)) pick.push(m); }
  if (Lab.hasGoal('exam')) pick[0] = ['ged-arcade', '🎯 Play one exam-prep round (10 questions)'];
  if (Lab.hasGoal('language')) pick[2] = ['mandarin-tones', '🀄 Learn the four tones of Mandarin'];
  return pick.map((m) => [m[0], m[1]]);
}

Lab.page('home', {
  mount(app) {
    const st = Lab.state;
    const lv = Lab.level();
    const m = todaysMissions();
    const nm = Lab.displayName();
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    const hero = h('section', { class: 'hero', style: { background: 'linear-gradient(120deg,#4F46E5 0%,#7C3AED 35%,#DB2777 70%,#F59E0B 100%)' } },
      h('div', { class: 'emoji' }, '✦'),
      h('h1', null, nm ? `${greet}, ${nm}.` : `${greet}! Welcome.`),
      h('p', null, Lab.isKid() ? 'Explore how the world works: spin planets, build cells, read real history and play with ideas. Pick a mission or wander!' : 'A free lab for going deep on anything: real maps, real data, real texts, real evidence, and things you can spin, run and break. Pick a mission or wander.'),
      h('div', { class: 'row', style: { marginTop: '12px' } },
        h('span', { class: 'pill', style: { background: 'rgba(255,255,255,.18)', color: '#fff', borderColor: 'transparent' } }, `Level ${lv.lv}`),
        h('div', { style: { flex: '1', minWidth: '140px', maxWidth: '260px' } }, h('div', { class: 'bar', style: { background: 'rgba(255,255,255,.25)' } }, h('i', { style: { width: (lv.into / lv.need * 100) + '%', background: '#fff' } }))),
        h('span', { class: 'small', style: { opacity: .9 } }, `${lv.need - lv.into} XP to level ${lv.lv + 1}`)));

    const mission = h('div', { class: 'card' },
      h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, 'Today’s mission'), h('span', { class: 'sp' }), h('span', { class: 'muted small' }, new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))),
      h('div', { class: 'grid g3', style: { marginTop: '12px' } }, m.map(([hash, label], i) => {
        const key = 'mission:' + new Date().toISOString().slice(0, 10) + ':' + i;
        const done = Lab.isDone(key);
        return h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('div', { style: { fontWeight: 600 } }, label),
          h('div', { class: 'row' },
            h('a', { class: 'btn sm primary', href: '#' + hash, style: { '--accent': '#4F46E5', textDecoration: 'none' } }, 'Go'),
            h('button', { class: 'btn sm', disabled: done, onclick: (e) => { if (Lab.markDone(key, 25, 'mission')) { e.target.textContent = '✓ Done'; e.target.disabled = true; } } }, done ? '✓ Done' : 'Mark done')));
      })));

    const fac = h('div', { class: 'stack' }, Lab.FACULTIES.map((F) => h('div', null,
      h('div', { class: 'row', style: { margin: '18px 0 10px', gap: '10px' } }, h('span', { style: { width: '34px', height: '34px', borderRadius: '10px', display: 'grid', placeItems: 'center', background: F.c, color: '#fff', fontWeight: 800, fontSize: '18px' } }, F.e), h('div', null, h('h2', { style: { margin: 0 } }, F.name), h('div', { class: 'small muted' }, F.sub))),
      h('div', { class: 'grid g4' }, Lab.DISC.filter((d) => d.fac === F.id).map((d) => h('a', { class: 'subj', href: '#d-' + d.id, style: { '--c': d.c, minHeight: '150px' } },
        h('div', { class: 'e' }, d.e), h('h3', null, d.name), h('p', null, d.what.split('. ')[0].replace(/\.$/, '') + '.'),
        h('div', { style: { height: '14px' } }),
        h('div', { class: 'meter', title: Lab.isDone('disc:' + d.id) ? 'Visited' : 'Not visited yet' }, h('i', { style: { width: (Lab.isDone('disc:' + d.id) ? 100 : 4) + '%' } }))))))));
    const grid = h('div', { class: 'grid g4' }, Lab.subjects.map((s) => {
      const p = Lab.subjectProgress(s.id);
      return h('a', { class: 'subj', href: '#' + s.id, style: { '--c': s.c, minHeight: '150px' } },
        h('div', { class: 'e' }, s.e), h('h3', null, s.name), h('p', null, s.blurb),
        h('div', { style: { height: '14px' } }),
        h('div', { class: 'meter', title: Math.round(p * 100) + '% explored' }, h('i', { style: { width: Math.max(4, p * 100) + '%' } })));
    }));
    const search = h('input', { type: 'text', placeholder: 'Search 24 disciplines, 400+ complete books, people and events…', style: { width: '100%', fontSize: '16px', padding: '12px 14px' } });
    const results = h('div', { class: 'stack', style: { gap: '6px', marginTop: '8px' } });
    search.oninput = () => {
      const q = search.value.trim().toLowerCase(); results.innerHTML = ''; if (q.length < 2) return;
      const hits = [];
      Lab.DISC.forEach((d) => { if ((d.name + ' ' + d.what).toLowerCase().includes(q)) hits.push(['#d-' + d.id, d.e + ' ' + d.name, 'Discipline']);
        d.people.forEach((p) => { if ((p[1] + ' ' + p[3]).toLowerCase().includes(q)) hits.push(['#d-' + d.id, p[1] + ' (' + p[2] + ')', d.name + ' · person']); });
        d.tl.forEach((t) => { if (t[1].toLowerCase().includes(q)) hits.push(['#d-' + d.id, t[0] + ': ' + t[1], d.name + ' · timeline']); }); });
      [...(Lab.GUIDED || []), ...(Lab.LIB || [])].forEach((b) => { if ((b.t + ' ' + b.a).toLowerCase().includes(q)) hits.push(['#reading-library-' + b.id, '📖 ' + b.t + ' — ' + b.a, 'Book']); });
      Lab.subjects.forEach((s) => s.ex.forEach(([e, n]) => { if (n.toLowerCase().includes(q)) hits.push(['#' + s.id + '-' + e, '▶ ' + n, s.name + ' · hands-on']); }));
      if (Lab.HUB) hits.unshift(...Lab.HUB.search(q));
      const seen = new Set();
      hits.filter((x) => !seen.has(x[1]) && seen.add(x[1])).slice(0, 20).forEach(([href, t, k]) => results.append(h('a', { href, class: 'row', style: { textDecoration: 'none', color: 'inherit', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: '10px', gap: '10px' } }, h('span', { style: { flex: 1 } }, t), h('span', { class: 'tiny muted' }, k))));
      if (!results.children.length) results.append(h('p', { class: 'small muted' }, 'Nothing found. Try the tutor: it can explain anything.'));
    };
    const finder = h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🔎 Find anything'), search, results);

    const ged = st.ged || {};
    const gedRows = ['math', 'science', 'social', 'rla'].map((k) => { const g = ged[k] || { r: 0, t: 0 }; return [k, g.t ? Math.round(g.r / g.t * 100) : null, g.t]; });
    const names = { math: 'Math', science: 'Science', social: 'Social Studies', rla: 'Reasoning Through Language Arts' };
    const stats = h('div', { class: 'grid g2' },
      !Lab.hasGoal('exam') ? h('div', { class: 'card' }, h('h3', null, '👤 Your learning'), h('p', { class: 'small' }, Lab.profile() && !Lab.profile().skipped ? 'Missions and suggestions follow your interests: ' + ((Lab.profile().interests || []).map((i) => (Lab.DISC.find((d) => d.id === i) || {}).name).filter(Boolean).join(', ') || 'everything') + '.' : 'Tell the Lab a little about you to get missions that fit.'), h('a', { class: 'btn sm', href: '#settings', style: { textDecoration: 'none' } }, 'Edit your profile')) :
      h('div', { class: 'card' }, h('h3', null, '🎯 GED readiness'),
        h('p', { class: 'muted small' }, 'Accuracy in the arcade by test. Aim for 80%+ on practice before booking a test (passing is 145 on each).'),
        ...gedRows.map(([k, pct, t]) => h('div', { style: { margin: '10px 0' } },
          h('div', { class: 'row small' }, h('b', null, names[k]), h('span', { class: 'sp' }), h('span', { class: 'muted' }, pct == null ? 'not started' : `${pct}% of ${t}`)),
          h('div', { class: 'bar', style: { '--accent': '#F97316' } }, h('i', { style: { width: (pct || 0) + '%' } })))),
        h('a', { class: 'btn sm primary', href: '#ged-arcade', style: { '--accent': '#F97316', textDecoration: 'none', marginTop: '6px' } }, 'Practice now')),
      h('div', { class: 'card' }, h('h3', null, '⚡ Recent activity'),
        (st.log || []).length ? h('table', { class: 't' }, (st.log || []).slice(0, 8).map(([d, n, w]) => h('tr', null, h('td', { class: 'muted' }, d.slice(5)), h('td', null, w || 'learning'), h('td', { style: { textAlign: 'right', fontWeight: 700 } }, '+' + n))))
          : h('p', { class: 'muted' }, 'Nothing yet. Every explorer you open, question you answer and chapter you read earns XP.'),
        h('p', { class: 'small muted', style: { marginTop: '10px' } }, Lab.db ? 'Progress is saved to your account and syncs across devices.' : 'Progress is saved on this device.')));

    const how = h('div', { class: 'card' }, h('h3', null, 'How to use the Lab'),
      h('p', { class: 'small' }, 'Pick a discipline to see why it exists, who built it, the real documents and images, the books (many complete, right here), lectures to watch, hands-on labs and a quiz. Tap ', h('b', null, '✦ Ask the tutor'), ' on any page for an explanation, a quiz, or both sides of a debate about exactly what you’re looking at. See something wrong? Tap ', h('b', null, '⚑'), ' at the top to report it.'), h('p', { class: 'small', style: { margin: 0 } }, h('a', { href: '#about' }, 'About this lab and how it’s made →')));

    const arcN = Lab.ARC ? Lab.ARC.labs.length : 0; const played = arcN ? Lab.ARC.labs.filter((l) => Lab.isDone('play:' + l.id)).length : 0;
    const arcade = arcN ? h('div', { class: 'card', style: { marginTop: '14px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' } }, h('span', { style: { fontSize: '40px' } }, '🕹️'), h('div', { style: { flex: 1, minWidth: '220px' } }, h('h2', { style: { margin: 0 } }, `${arcN} hands-on labs`), h('div', { class: 'small muted' }, `Play with the ideas behind every discipline and see how they connect. You’ve played ${played}.`)),
      h('a', { class: 'btn primary', href: '#play', style: { textDecoration: 'none' } }, 'Open the lab arcade'), h('button', { class: 'btn', onclick: () => { const left = Lab.ARC.labs.filter((l) => !Lab.isDone('play:' + l.id)); const L = (left.length ? left : Lab.ARC.labs)[Math.floor(Math.random() * (left.length || arcN))]; location.hash = 'play-' + L.id; } }, '🎲 Surprise me')) : null;
    const truth = h('div', { class: 'grid g2', style: { marginTop: '14px' } },
      h('a', { href: '#whois', class: 'card', style: { textDecoration: 'none', color: 'inherit' } }, h('div', { style: { fontSize: '30px' } }, '🔍'), h('h3', { style: { margin: '4px 0' } }, 'Who is telling me this?'), h('p', { class: 'small muted', style: { margin: 0 } }, 'Who funds each source in this Lab, what they gain, who they work with and who criticizes them.')),
      h('a', { href: '#history-modern-truths', class: 'card', style: { textDecoration: 'none', color: 'inherit' } }, h('div', { style: { fontSize: '30px' } }, '⛓️'), h('h3', { style: { margin: '4px 0' } }, 'Hard truths'), h('p', { class: 'small muted', style: { margin: 0 } }, 'Slavery today, manipulated statistics, poverty lines, false pretexts for war, biased textbooks and GDP, checked against evidence.')));
    app.append(hero, finder, ...(Lab.HUB ? Lab.HUB.top().flatMap((x) => [h('div', { style: { height: '14px' } }), x]) : []), h('div', { style: { height: '14px' } }), mission, arcade, truth, h('h2', { style: { margin: '30px 0 0', fontSize: '28px' } }, 'The disciplines'), h('p', { class: 'muted', style: { margin: '4px 0 0' } }, 'Every major field of human knowledge, each with its history, people, real documents and images, books, lectures, hands-on labs and a quiz.'), fac,
      h('h2', { style: { margin: '30px 0 4px', fontSize: '28px' } }, 'Hands-on labs & tools'), h('p', { class: 'muted', style: { margin: '0 0 12px' } }, 'Maps, models, simulations, full texts, exam practice and the weekly news.'), grid, h('div', { style: { height: '14px' } }), stats, h('div', { style: { height: '14px' } }), how);
  },
});
