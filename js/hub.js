// The Lab's hub: knowledge map, learning paths across disciplines, region doorways, "continue where you left off",
// a search index covering every tab and case, and a "connected disciplines" panel on every discipline page.
const h = Lab.h;
const HUB = (Lab.HUB = {});

// ---------- recent pages ----------
const baseCtx = Lab.setContext;
Lab.setContext = (text) => { baseCtx(text); try { if (!text) return; const hs = location.hash || '#home'; if (hs === '#home') return; const L = JSON.parse(localStorage.getItem('lab:recent') || '[]').filter((x) => x.h !== hs); L.unshift({ h: hs, t: String(text).split('\n')[0].split('→').pop().split(':')[0].trim().slice(0, 50) }); localStorage.setItem('lab:recent', JSON.stringify(L.slice(0, 8))); } catch (e) { /* storage unavailable */ } };
const recent = () => { try { return JSON.parse(localStorage.getItem('lab:recent') || '[]'); } catch (e) { return []; } };

// ---------- learning paths ----------
HUB.paths = [
  { id: 'truth', e: '🔎', t: 'How do we know what really happened?', d: 'Sources, incentives, archives and statistics, applied to real wars.', c: '#0F766E', steps: [['How the Lab rates sources and claims', 'whois'], ['Counting tanks with statistics', 'connect-tank'], ['The bombers that did not come back', 'connect-wald'], ['War stories: who told them', 'history-modern-warmyths'], ['The Korean War, every side', 'history-modern-koreawar'], ['One event, many tellings', 'history-modern-sides']] },
  { id: 'rich', e: '💰', t: 'Why are some countries rich and others poor?', d: 'Geography, institutions, slavery, colonialism, policy and compound growth.', c: '#15803D', steps: [['Compound growth', 'connect-compound'], ['North vs South Korea', 'economy-divergence'], ['Satellites catch inflated GDP', 'connect-lights'], ['Africa: slave trades and colonial rule', 'history-modern-africa'], ['The Americas: silver, sugar and debt', 'history-modern-americas'], ['Economics, the discipline', 'd-economics']] },
  { id: 'origins', e: '🧬', t: 'Where did we come from?', d: 'Physics, chemistry, genetics, language and archaeology agree on Africa.', c: '#B45309', steps: [['Physics tells time', 'connect-dating'], ['Africa: human origins', 'history-modern-africa'], ['Read a real human gene', 'body-dna'], ['Three sciences, one migration', 'connect-bantu'], ['Anthropology', 'd-anthropology'], ['Biology', 'd-biology']] },
  { id: 'power', e: '🏛️', t: 'How power really works', d: 'Parties, guns, money and information, in one-party states and democracies.', c: '#7C3AED', steps: [['Politics, the discipline', 'd-politics'], ['Who really rules? North Korea and Vietnam', 'history-modern-power'], ['American power: how it works', 'history-modern-uspower'], ['Why repeated lies feel true', 'connect-repeat'], ['Game theory and standoffs', 'connect-game'], ['Geopolitics', 'd-geopolitics']] },
  { id: 'marx', e: '🚩', t: 'Marxism and the communist states', d: 'From Marx’s theory to China, the USSR, Cuba, North Korea, Vietnam and Burkina Faso, judged by one standard.', c: '#B91C1C', steps: [['Marx and Engels: 12 core ideas', 'history-modern-marxism-ideas'], ['Surplus value machine', 'play-surplusvalue'], ['Lenin: from theory to party', 'history-modern-marxism-lenin'], ['How a party-state works', 'history-modern-marxism-machine'], ['Plan vs market: run an economy', 'play-planmarket'], ['China, 1921 to 2026', 'history-modern-marxism-china'], ['Nine regimes, same questions', 'history-modern-marxism-compare'], ['Evidence: gains and costs', 'history-modern-marxism-evidence'], ['Debates and claims', 'history-modern-marxism-debates']] },
  { id: 'prob', e: '🎲', t: 'Think in probabilities', d: 'The math every analyst, trader, doctor and judge needs.', c: '#2563EB', steps: [['Run the Galton board', 'math-probability'], ['Bayes and intelligence failures', 'connect-bayes'], ['Benford’s law', 'connect-benford'], ['The math of epidemics', 'connect-epidemic'], ['Statistics vs the tobacco industry', 'connect-tobacco'], ['Statistics & Probability', 'd-statistics']] },
  { id: 'war', e: '⚔️', t: 'War and peace', d: 'Why wars start, how they are fought and how they are remembered.', c: '#DC2626', steps: [['World wars and the Cold War', 'history-modern-wars'], ['From an equation to world politics', 'connect-nuclear'], ['Game theory and standoffs', 'connect-game'], ['The Korean War: the whole story', 'history-modern-koreawar'], ['One missing word in a peace resolution', 'connect-words'], ['One event, many tellings', 'history-modern-sides']] },
];
const pathCard = (p) => {
  const done = p.steps.filter((s, i) => Lab.isDone(`path:${p.id}:${i}`)).length;
  return h('div', { class: 'card', style: { borderTop: `4px solid ${p.c}` } }, h('div', { class: 'row', style: { gap: '8px' } }, h('span', { style: { fontSize: '26px' } }, p.e), h('div', { style: { flex: 1 } }, h('h3', { style: { margin: 0 } }, p.t), h('div', { class: 'tiny muted' }, `${done} of ${p.steps.length} steps`))), h('p', { class: 'small muted', style: { margin: '6px 0' } }, p.d),
    h('ol', { class: 'small', style: { margin: 0, paddingLeft: '20px', lineHeight: 1.8 } }, p.steps.map(([n, hs], i) => h('li', null, h('a', { href: '#' + hs, onclick: () => Lab.markDone(`path:${p.id}:${i}`, 5, 'path step'), style: { textDecoration: Lab.isDone(`path:${p.id}:${i}`) ? 'line-through' : 'none' } }, n)))));
};

// ---------- knowledge map ----------
// Three kinds of links: foundations (what builds on what), real case studies, and hands-on labs shared between fields.
HUB.map = () => {
  const D = Lab.DISC || []; const F = Lab.FACULTIES || []; const C = Lab.CONNECT || []; const FD = Lab.FOUND || []; const LABS = (Lab.ARC && Lab.ARC.labs) || [];
  const order = F.flatMap((f) => D.filter((d) => d.fac === f.id)); const n = order.length;
  const W = 660, cx = 330, cy = 300, R = 230;
  const pos = {}; order.forEach((d, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; pos[d.id] = [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
  const E = { found: {}, case: {}, lab: {} }; const key = (a, b) => [a, b].sort().join('|');
  FD.forEach(([a, b, why]) => { if (pos[a] && pos[b]) E.found[a + '>' + b] = why; });
  C.forEach((c) => c.disc.forEach((a, i) => c.disc.slice(i + 1).forEach((b) => { if (pos[a] && pos[b]) (E.case[key(a, b)] ||= []).push(c); })));
  LABS.forEach((l) => (l.d || []).forEach((a, i) => (l.d || []).slice(i + 1).forEach((b) => { if (pos[a] && pos[b]) (E.lab[key(a, b)] ||= []).push(l); })));
  const show = { found: true, case: true, lab: false };
  const ns = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} 600`); svg.style.width = '100%'; svg.style.maxWidth = '660px';
  const el = (t, a) => { const e = document.createElementNS(ns, t); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
  const defs = el('defs', {}); const mk = el('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }); mk.append(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#334155' })); defs.append(mk); svg.append(defs);
  const layer = el('g', {}); svg.append(layer);
  let sel = null; const paths = [];
  const curve = (a, b, bend) => { const [x1, y1] = pos[a], [x2, y2] = pos[b]; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const qx = mx + (cx - mx) * bend, qy = my + (cy - my) * bend; return `M${x1},${y1} Q${qx},${qy} ${x2},${y2}`; };
  const drawEdges = () => { layer.innerHTML = ''; paths.length = 0;
    if (show.lab) Object.entries(E.lab).forEach(([k, ls]) => { const [a, b] = k.split('|'); const p = el('path', { d: curve(a, b, 0.75), fill: 'none', stroke: '#14B8A6', 'stroke-width': Math.min(4, 0.5 + ls.length * 0.4), opacity: 0.25 }); p.dataset.ends = k; layer.append(p); paths.push(p); });
    if (show.case) Object.entries(E.case).forEach(([k, cs]) => { const [a, b] = k.split('|'); const p = el('path', { d: curve(a, b, 0.6), fill: 'none', stroke: '#7C3AED', 'stroke-width': Math.min(5, 0.8 + cs.length), 'stroke-dasharray': '5 4', opacity: 0.35 }); p.dataset.ends = k; layer.append(p); paths.push(p); });
    if (show.found) Object.keys(E.found).forEach((k) => { const [a, b] = k.split('>'); const [x2, y2] = pos[b]; const p = el('path', { d: curve(a, b, 0.35), fill: 'none', stroke: '#334155', 'stroke-width': 1.6, opacity: 0.45, 'marker-end': 'url(#arr)' }); p.dataset.ends = a + '|' + b; layer.append(p); paths.push(p); });
    if (sel) highlight(sel); };
  const highlight = (id) => paths.forEach((p) => { const on = p.dataset.ends.split('|').includes(id); p.setAttribute('opacity', on ? 0.95 : 0.07); });
  const panel = h('div', { class: 'small' }, h('p', { class: 'muted' }, 'Click any discipline. Arrows show what it builds on and what builds on it; dashed purple lines are real cases where fields solved a problem together; teal lines are hands-on labs shared between fields.'));
  const select = (id) => { sel = id; highlight(id);
    const d = D.find((x) => x.id === id); const inc = FD.filter(([, b]) => b === id), out = FD.filter(([a]) => a === id);
    const cases = C.filter((c) => c.disc.includes(id)); const labs = LABS.filter((l) => (l.d || []).includes(id) && (l.d || []).length > 1);
    const chip = (x) => (Lab.discChip ? Lab.discChip(x) : x);
    panel.innerHTML = ''; panel.append(...[h('h3', { style: { margin: '0 0 4px' } }, d.e + ' ' + d.name), h('p', { class: 'small muted', style: { margin: '0 0 6px' } }, d.what.split('. ')[0] + '.'),
      inc.length ? h('div', null, h('div', { class: 'tiny', style: { fontWeight: 700 } }, '⬇️ Builds on:'), inc.map(([a, , why]) => h('div', { class: 'tiny', style: { margin: '3px 0' } }, chip(a), ' ', why))) : null,
      out.length ? h('div', { style: { marginTop: '6px' } }, h('div', { class: 'tiny', style: { fontWeight: 700 } }, '⬆️ Is a foundation for:'), out.map(([, b, why]) => h('div', { class: 'tiny', style: { margin: '3px 0' } }, chip(b), ' ', why))) : null,
      cases.length ? h('div', { style: { marginTop: '6px' } }, h('div', { class: 'tiny', style: { fontWeight: 700 } }, `🔗 Real cases (${cases.length}):`), h('ul', { style: { margin: '2px 0', paddingLeft: '18px' } }, cases.slice(0, 6).map((c) => h('li', { class: 'tiny' }, h('a', { href: '#connect-' + c.id }, c.e + ' ' + c.t))))) : null,
      labs.length ? h('div', { style: { marginTop: '6px' } }, h('div', { class: 'tiny', style: { fontWeight: 700 } }, `🕹️ Labs shared with other fields (${labs.length}):`), h('div', { class: 'row', style: { gap: '4px' } }, labs.slice(0, 8).map((l) => h('a', { class: 'tag', href: '#play-' + l.id, style: { '--c': '#14B8A6', textDecoration: 'none' } }, l.e + ' ' + l.t)))) : null,
      h('a', { class: 'btn sm primary', href: '#d-' + id, style: { textDecoration: 'none', marginTop: '8px' } }, 'Open ' + d.name + ' →')].filter(Boolean)); };
  order.forEach((d) => { const [x, y, a] = pos[d.id]; const f = F.find((q) => q.id === d.fac); const deg = FD.filter(([p, q]) => p === d.id || q === d.id).length; const r = 8 + Math.min(12, deg * 1.1); const g = el('g', { style: 'cursor:pointer' }); g.append(el('circle', { cx: x, cy: y, r, fill: f ? f.c : '#64748B', stroke: '#fff', 'stroke-width': 2 }));
    const lx = cx + (R + 24) * Math.cos(a), ly = cy + (R + 24) * Math.sin(a); const t = el('text', { x: lx, y: ly + 4, 'font-size': 13, 'text-anchor': Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle', fill: 'currentColor' }); t.textContent = d.e + ' ' + d.name.replace(/ &.*| and .*/, '');
    g.append(t); g.addEventListener('click', () => select(d.id)); svg.append(g); });
  drawEdges();
  const toggles = h('div', { class: 'row', style: { gap: '6px', justifyContent: 'center', margin: '6px 0' } }, [['found', '➡️ Foundations', FD.length], ['case', '🔗 Real cases', Object.keys(E.case).length], ['lab', '🕹️ Shared labs', Object.keys(E.lab).length]].map(([k, n, c]) => h('span', { class: 'chip' + (show[k] ? ' on' : ''), onclick: (e) => { show[k] = !show[k]; e.target.classList.toggle('on', show[k]); drawEdges(); } }, `${n} (${c})`)));
  const legend = h('div', { class: 'row', style: { gap: '8px', justifyContent: 'center' } }, F.map((f) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: f.c, marginRight: '4px' } }), f.name)));
  return h('div', { class: 'card' }, h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, '🕸️ The map of knowledge'), h('span', { class: 'sp' }), h('a', { class: 'btn sm', href: '#connect', style: { textDecoration: 'none' } }, 'All connection cases →')),
    h('p', { class: 'small muted' }, 'Bigger dots are more foundational. Turn link types on and off; click a field to see what it stands on and what stands on it.'), toggles, h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null, svg, legend), panel));
};

// ---------- doorways and regions ----------
HUB.doors = () => h('div', { class: 'grid g4' }, [
  ['#connect', '🔗', 'How disciplines connect', 'Real cases: statistics in war, physics in politics, genetics in history.', '#7C3AED'],
  ['#history-modern-sides', '🗣️', 'One event, many tellings', 'Major events with every side’s story and what each leaves out.', '#B45309'],
  ['#whois', '⚖️', 'How we judge truth', 'Every source scored on evidence, transparency, independence and track record.', '#0F766E'],
  ['#play', '🕹️', 'Hands-on labs', 'Simulations, maps and games across all the disciplines.', '#2563EB'],
].map(([hs, e, t, d, c]) => h('a', { href: hs, class: 'card', style: { textDecoration: 'none', color: 'inherit', borderTop: `4px solid ${c}` } }, h('div', { style: { fontSize: '30px' } }, e), h('h3', { style: { margin: '4px 0' } }, t), h('p', { class: 'small muted', style: { margin: 0 } }, d))));
HUB.regions = () => h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, '🌍 Explore the world by region'), h('p', { class: 'small muted' }, 'Deep dives that put history, politics, economics and evidence together for one part of the world.'),
  h('div', { class: 'grid g3' }, [
    ['history-modern-africa', '🌍', 'Africa', 'From the first humans to the Sahel juntas.'], ['history-modern-americas', '🌎', 'The Americas', 'First peoples, conquest, slavery, revolutions, Venezuela 2026.'], ['history-modern-power', '🏛️', 'Who really rules?', 'North Korea and Vietnam’s power structures, compared.'],
    ['history-modern-koreawar', '🇰🇷', 'The Korean War', 'The whole story, with every side’s documents.'], ['history-modern-uspower', '🇺🇸', 'American power', 'Bases, money, intelligence and allies.'], ['history-atlas', '🗺️', 'World atlas', 'Real borders from 1492 to today.'],
  ].map(([hs, e, t, d]) => h('a', { href: '#' + hs, class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', textDecoration: 'none', color: 'inherit' } }, h('b', null, e + ' ' + t), h('div', { class: 'tiny muted' }, d)))),
  h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, 'Coming next: a capitalism deep dive held to the same standard as the Marxism–Leninism one.'));

HUB.top = () => {
  const r = recent();
  const cont = r.length ? h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '↩️ Continue where you left off'), h('div', { class: 'row', style: { gap: '6px' } }, r.slice(0, 6).map((x) => h('a', { class: 'btn sm', href: x.h, style: { textDecoration: 'none' } }, x.t)))) : null;
  const nx = Lab.learnNext ? Lab.learnNext() : null; const LS = Lab.LEARN || []; const tot = LS.reduce((n, st) => n + st.u.length, 0); const dn = LS.reduce((n, st) => n + st.u.filter((u) => Lab.isDone('learn:' + u[0])).length, 0);
  const journey = LS.length ? h('a', { href: '#learn', class: 'card', style: { display: 'block', textDecoration: 'none', color: '#fff', background: 'linear-gradient(120deg,#1D4ED8,#7C3AED)' } }, h('div', { class: 'row', style: { gap: '14px' } }, h('span', { style: { fontSize: '40px' } }, '🧭'), h('div', { style: { flex: 1, minWidth: '220px' } }, h('h2', { style: { margin: 0, color: '#fff' } }, dn ? 'Continue your Learning Journey' : 'Start the Learning Journey'), h('p', { style: { margin: '4px 0 0', opacity: 0.92 } }, `Six stages, ${tot} units, from big numbers and maps to quantum physics, AI and geopolitics. ${dn} done.`), nx ? h('p', { style: { margin: '4px 0 0', fontWeight: 700 } }, 'Next: ' + nx.u[2] + ' (Stage ' + (nx.si + 1) + ')') : null), h('span', { class: 'btn', style: { background: '#fff', color: '#1D4ED8' } }, 'Go →'))) : null;
  return [journey, cont, HUB.doors(), HUB.regions(), HUB.map(), h('h2', { style: { margin: '24px 0 4px', fontSize: '26px' } }, '🧭 Learning paths'), h('p', { class: 'muted', style: { margin: '0 0 10px' } }, 'Guided routes that cross disciplines, step by step. Steps you open are ticked off.'), h('div', { class: 'grid g3', style: { alignItems: 'start' } }, HUB.paths.map(pathCard))].filter(Boolean);
};

// ---------- search index ----------
HUB.search = (q) => {
  const hits = []; const M = Lab.MODERN;
  if (M && M.SUBS) M.SUBS.forEach(([k, n]) => { if (n.toLowerCase().includes(q)) hits.push(['#history-modern-' + k, '🗺️ ' + n, 'History & Geopolitics']); });
  (Lab.CONNECT || []).forEach((c) => { if ((c.t + ' ' + c.q + ' ' + c.story).toLowerCase().includes(q)) hits.push(['#connect-' + c.id, c.e + ' ' + c.t, 'Connections']); });
  (Lab.SIDES || []).forEach((s) => { if ((s[1] + ' ' + s[4]).toLowerCase().includes(q)) hits.push(['#history-modern-sides', '🗣️ ' + s[1], 'Many tellings']); });
  [[Lab.AFRICA, 'africa', 'Africa'], [Lab.AMERICAS, 'americas', 'Americas'], [Lab.KOREA, 'koreawar', 'Korean War']].forEach(([R, k, n]) => R && (R.timeline || []).forEach((s) => { if ((s[2] + ' ' + s[3]).toLowerCase().includes(q)) hits.push(['#history-modern-' + k, '📜 ' + s[2] + ' (' + s[1] + ')', n]); }));
  if (Lab.POWER) Object.values(Lab.POWER.countries).forEach((c) => { if ((c.n + ' ' + c.sum + ' ' + c.layers.map((l) => l[2]).join(' ')).toLowerCase().includes(q)) hits.push(['#history-modern-power', '🏛️ Power structure: ' + c.n, 'Who really rules?']); });
  (Lab.SOURCES || []).forEach((s) => { if (s.n.toLowerCase().includes(q)) hits.push(['#whois', '🔍 ' + s.n, 'Source dossier']); });
  HUB.paths.forEach((p) => { if (p.t.toLowerCase().includes(q)) hits.push(['#home', p.e + ' Path: ' + p.t, 'Learning path']); });
  return hits;
};

// ---------- connected disciplines on each discipline page ----------
const baseD = Lab.routes.d;
if (baseD) Lab.routes.d = (app, args) => {
  const r = baseD(app, args); const id = args && args[0]; const C = (Lab.CONNECT || []).filter((c) => c.disc.includes(id));
  const paths = HUB.paths.filter((p) => p.steps.some(([, hs]) => hs === 'd-' + id));
  if (C.length || paths.length) {
    const partners = {}; C.forEach((c) => c.disc.forEach((x) => { if (x !== id) partners[x] = (partners[x] || 0) + 1; }));
    const box = h('div', { class: 'card', style: { borderLeft: '4px solid #7C3AED' } }, h('h3', { style: { marginTop: 0 } }, '🔗 How this discipline connects to the others'),
      h('div', { class: 'row', style: { gap: '4px', marginBottom: '8px' } }, Object.entries(partners).sort((a, b) => b[1] - a[1]).map(([x]) => Lab.discChip(x))),
      h('div', { class: 'grid g3' }, C.map((c) => h('a', { href: '#connect-' + c.id, class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', textDecoration: 'none', color: 'inherit' } }, h('b', null, c.e + ' ' + c.t), h('div', { class: 'tiny muted' }, c.q)))),
      paths.length ? h('p', { class: 'small', style: { marginBottom: 0 } }, 'Part of the learning paths: ', ...paths.map((p) => h('a', { href: '#home', style: { marginRight: '8px' } }, p.e + ' ' + p.t))) : null);
    const ov = app.querySelector('[data-ch="overview"]'); if (ov) ov.append(box); else { const hero = app.querySelector('.hero'); if (hero) hero.after(box); else app.prepend(box); }
  }
  return r;
};

// ---------- toolkits: skills from other disciplines, shown inside each topic ----------
const skillCard = (sid, how) => { const s = Lab.skill(sid); if (!s) return null; const [, e, n, from, what, links] = s;
  return h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('div', { class: 'row', style: { gap: '6px' } }, h('b', null, e + ' ' + n), Lab.discChip ? Lab.discChip(from) : null),
    h('div', { class: 'small', style: { margin: '4px 0' } }, how ? h('span', null, h('b', null, 'Here: '), how) : what), how ? h('div', { class: 'tiny muted' }, what) : null,
    h('div', { class: 'row', style: { gap: '4px', marginTop: '4px' } }, links.map(([hs, t]) => h('a', { class: 'tag', href: '#' + hs, style: { '--c': '#7C3AED', textDecoration: 'none' } }, (hs.startsWith('play') ? '🕹️ ' : hs.startsWith('connect') ? '🔗 ' : '📖 ') + t)))); };
HUB.toolkit = (items, title) => items && items.length ? h('div', { class: 'card', style: { borderLeft: '4px solid #7C3AED' } }, h('h3', { style: { marginTop: 0 } }, title || '🧰 Tools from other disciplines for this topic'), h('p', { class: 'small muted' }, 'Real skills from math, science, psychology and more that experts use on exactly this kind of question. Each links to a lab where you can practice it.'), h('div', { class: 'grid g2' }, items.map(([sid, how]) => skillCard(sid, how)))) : null;
const M2 = Lab.MODERN;
if (M2 && M2.render && Lab.TABSKILLS) Object.keys(Lab.TABSKILLS).forEach((k) => { const base = M2.render[k]; if (!base) return; M2.render[k] = (el, arg) => { const r = base(el, arg); const t = HUB.toolkit(Lab.TABSKILLS[k]); if (t) el.append(t); const cs = (Lab.CONNECT || []).filter((c) => c.lab.some(([, hs]) => hs === 'history-modern-' + k)); if (cs.length) el.append(h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '🔗 Real cases connected to this topic'), h('div', { class: 'row', style: { gap: '6px' } }, cs.map((c) => h('a', { class: 'btn sm', href: '#connect-' + c.id, style: { textDecoration: 'none' } }, c.e + ' ' + c.t))))); return r; }; });

// discipline pages: what this field gives to others, and what it borrows
const baseD2 = Lab.routes.d;
if (baseD2 && Lab.SKILLS) Lab.routes.d = (app, args) => { const r = baseD2(app, args); const id = args && args[0];
  const own = Lab.SKILLS.filter((s) => s[3] === id); const borrowFrom = (Lab.FOUND || []).filter(([, b]) => b === id).map(([a]) => a); const borrowed = Lab.SKILLS.filter((s) => borrowFrom.includes(s[3])).slice(0, 6);
  const boxes = [own.length ? HUB.toolkit(own.map((s) => [s[0], '']), '🎁 Skills this field gives the others') : null, borrowed.length ? HUB.toolkit(borrowed.map((s) => [s[0], '']), '🧰 Skills this field borrows from its foundations') : null].filter(Boolean);
  const ov = app.querySelector('[data-ch="overview"]'); if (ov) boxes.forEach((b) => ov.append(b)); else { const anchor = app.querySelector('.hero'); if (anchor) { let after = anchor.nextSibling; boxes.forEach((b) => app.insertBefore(b, after)); } }
  return r; };
