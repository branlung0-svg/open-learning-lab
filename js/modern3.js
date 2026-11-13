// Modern world module, part 3: wars, alliances, ideas tree, ideology families, leader dossiers, conditions, opinion, language.
const h = Lab.h;
const M = Lab.MODERN;
const EV = Object.fromEntries(M.events.map((e) => [e.id, e]));
const yr = (e) => (e.y2 && e.y2 !== e.y ? `${e.y}–${e.y2}` : String(e.y));
const sect = (title, ...kids) => h('div', { style: { marginTop: '12px' } }, h('div', { class: 'tiny muted', style: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' } }, title), ...kids);
const NS = 'http://www.w3.org/2000/svg';
const S = (tag, at, parent, text) => { const n = document.createElementNS(NS, tag); Object.entries(at || {}).forEach(([k, v]) => n.setAttribute(k, v)); if (text != null) n.textContent = text; if (parent) parent.append(n); return n; };
const tile = (title, body, color) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px', borderLeft: color ? `4px solid ${color}` : null } }, h('b', { class: 'small' }, title), h('p', { class: 'small', style: { margin: '4px 0 0' } }, body));
const evChip = (id) => { const e = EV[id]; return e ? h('span', { class: 'chip', style: { '--c': '#B45309' }, onclick: () => M.go('timeline', 'ev-' + id) }, `📅 ${e.t}`) : null; };
const dataBtn = (dt, label) => dt ? h('button', { class: 'btn sm', onclick: () => Lab.openData(dt.ds, dt) }, '📈 ' + (label || 'See the data')) : null;
const bars = (rows, unit, color) => { const mx = Math.max(...rows.map((r) => r[1])); return h('div', { class: 'stack', style: { gap: '4px' } }, rows.map(([l, v]) => h('div', { class: 'row', style: { gap: '8px', alignItems: 'center' } }, h('span', { class: 'small', style: { width: '170px', flex: '0 0 auto' } }, l), h('div', { style: { flex: 1, background: 'var(--card2)', borderRadius: '6px', height: '18px' } }, h('div', { style: { width: (v / mx * 100) + '%', height: '100%', background: color || '#2563EB', borderRadius: '6px' } })), h('b', { class: 'small', style: { width: '56px', textAlign: 'right' } }, v + (unit || ''))))); };

// ---------- tab groups ----------
const add = (after, k, n) => { const i = M.SUBS.findIndex(([x]) => x === after); M.SUBS.splice(i + 1, 0, [k, n]); };
add('time', 'wars', 'World wars & Cold War');
add('wars', 'alliances', 'Alliances & tensions');
add('ideologies', 'families', 'Ideology families');
add('families', 'ideas', 'Family tree of ideas');
add('systems', 'leaders', 'Leaders on trial');
add('science', 'conditions', 'How people lived');
add('conditions', 'opinion', 'Public opinion');
add('game', 'language', 'Political language');
M.GROUPS = [['🧭', 'Start', ['start']], ['📅', 'History', ['timeline', 'time', 'wars', 'alliances', 'indigenous']], ['💡', 'Ideas & power', ['ideologies', 'families', 'ideas', 'systems', 'compare', 'spectrum', 'language']], ['👤', 'People', ['leaders', 'people']], ['🍞', 'Life, science & opinion', ['conditions', 'opinion', 'science']], ['🧪', 'Test & play', ['claims', 'voting', 'game', 'sources']]];

// ---------- war rooms ----------
M.render.wars = (el, arg) => {
  let w = M.wars.find((x) => x.id === arg) || M.wars[0], ph = 0;
  const pick = h('div', { class: 'row', style: { gap: '6px' } });
  const body = h('div');
  function draw() {
    pick.innerHTML = ''; M.wars.forEach((x) => pick.append(h('button', { class: 'btn' + (x === w ? ' primary' : ''), onclick: () => { w = x; ph = 0; history.replaceState(null, '', '#history-modern-wars-' + x.id); draw(); } }, x.e + ' ' + x.t)));
    body.innerHTML = '';
    const P = w.phases[ph];
    const stepRow = h('div', { class: 'row', style: { gap: '4px', flexWrap: 'wrap' } }, w.phases.map((p, i) => h('button', { class: 'btn sm' + (i === ph ? ' primary' : ''), onclick: () => { ph = i; draw(); } }, `${i + 1}. ${p.t}`)));
    const figs = (M.figures || []).filter((f) => f.war.includes(w.id));
    body.append(
      h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, w.e + ' ' + w.t), h('p', null, w.sum), stepRow),
      h('div', { class: 'card' },
        h('div', { class: 'grid g2', style: { alignItems: 'start' } },
          M.figure(P.img, { max: '360px', fit: 'contain' }),
          h('div', null, h('div', { class: 'tiny muted' }, `Phase ${ph + 1} of ${w.phases.length}`), h('h3', { style: { margin: '2px 0 6px' } }, P.t), h('p', null, P.d), P.debate ? h('p', { class: 'small' }, Lab.conf('Contested'), ' ', P.debate) : null,
            h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } },
              h('button', { class: 'btn sm', disabled: ph === 0, onclick: () => { ph--; draw(); } }, '← Previous'), h('button', { class: 'btn sm primary', disabled: ph === w.phases.length - 1, onclick: () => { ph++; draw(); } }, 'Next →'),
              h('button', { class: 'btn sm', onclick: () => Lab.ask(`Go deep on "${P.t}" in ${w.t}: what happened day by day or month by month, the decisions and who made them, the material conditions of soldiers and civilians, how each side’s propaganda presented it, and what historians still argue about.`, P.t) }, '✦ Go deeper'),
              h('button', { class: 'btn sm', onclick: () => Lab.ask(`I am a ${['soldier', 'factory worker', 'farmer', 'child', 'nurse'][ph % 5]} during "${P.t}" in ${w.t}. Describe my daily life realistically, using real memoirs, letters and historical evidence, from more than one country’s side.`, P.t) }, '✦ Live it'))))),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The human cost'), bars(w.deaths, 'm', '#DC2626'), h('p', { class: 'tiny muted', style: { marginTop: '6px' } }, w.dlab), dataBtn({ ds: 'wardeaths', ents: ['World'], v: 4, note: 'Deaths in wars per year, worldwide.' }, 'War deaths over time')),
        h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Propaganda'), h('div', { class: 'stack' }, w.prop.map(([k, t, d]) => h('div', { class: 'row', style: { gap: '10px', alignItems: 'flex-start' } }, h('div', { style: { width: '110px', flex: '0 0 auto' } }, M.figure(k, { max: '150px', fit: 'contain', margin: '0' })), h('div', null, h('b', { class: 'small' }, t), h('p', { class: 'small', style: { margin: '2px 0 0' } }, d))))),
          h('button', { class: 'btn sm', style: { marginTop: '8px' }, onclick: () => Lab.ask(`How did each side use propaganda in ${w.t}? Explain the techniques (fear, enemy images, national myths, atrocity stories true and false, censorship), give real examples from at least four countries, and teach me how to recognize the same techniques today.`, 'Propaganda') }, '✦ How propaganda worked'))),
      figs.length ? h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The leaders'), h('div', { class: 'row', style: { gap: '8px' } }, figs.map((f) => h('span', { class: 'chip', style: { '--c': '#374151' }, onclick: () => M.go('leaders', f.id) }, '👤 ' + f.n)))) : null);
  }
  el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { marginTop: 0 } }, 'Step through each war phase by phase: causes, turning points, home fronts, propaganda, the human cost and the leaders.'), pick), body);
  draw();
};

// ---------- alliances map ----------
M.render.alliances = (el) => {
  let i = 0; const box = h('div', { class: 'viz', style: { padding: '6px', color: 'var(--ink)' } }); const info = h('div', { class: 'card' }); const head = h('div');
  const slider = h('input', { type: 'range', min: 0, max: M.snapshots.length - 1, value: 0, style: { width: '100%' }, oninput: (e) => { i = +e.target.value; draw(); } });
  let topo = null;
  async function draw() {
    const s = M.snapshots[i]; head.innerHTML = '';
    head.append(h('div', { class: 'row', style: { alignItems: 'baseline', gap: '12px' } }, h('div', { style: { fontFamily: 'Space Grotesk', fontSize: '38px', fontWeight: 800 } }, s.y), h('h3', { style: { margin: 0 } }, s.t)), h('p', { class: 'small' }, s.sum),
      h('div', { class: 'row', style: { gap: '10px' } }, s.blocs.map(([n, c]) => h('span', { class: 'small' }, h('span', { style: { display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: c, marginRight: '5px' } }), n)), h('span', { class: 'sp' }), Object.entries(M.rels).map(([k, [n, c, dash]]) => h('span', { class: 'tiny', style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } }, h('span', { style: { display: 'inline-block', width: '24px', borderTop: `3px ${dash ? (dash.startsWith('6') ? 'dashed' : 'dotted') : 'solid'} ${c}` } }), n))));
    info.innerHTML = ''; info.append(h('p', { class: 'small muted', style: { margin: 0 } }, 'Tap a country or a line to see what it means.'));
    box.innerHTML = '';
    if (!window.d3 || !window.topojson) { box.append(h('p', { class: 'muted' }, 'Map library unavailable.')); return; }
    topo ||= await fetch('data/world110.json').then((r) => r.json());
    const W = 960, H = 500; const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');
    const usedC = [...new Set([...s.links.flatMap((l) => [l[0], l[1]]), ...s.blocs.flatMap((b) => b[2])])].map((c) => [M.powers[c][1], M.powers[c][2]]);
    const lons = usedC.map((c) => c[0]), lats = usedC.map((c) => c[1]); const pad = 14;
    const bbox = { type: 'Polygon', coordinates: [[[Math.min(...lons) - pad, Math.min(...lats) - pad], [Math.max(...lons) + pad, Math.min(...lats) - pad], [Math.max(...lons) + pad, Math.max(...lats) + pad], [Math.min(...lons) - pad, Math.max(...lats) + pad], [Math.min(...lons) - pad, Math.min(...lats) - pad]]] };
    const proj = d3.geoNaturalEarth1().fitExtent([[20, 30], [W - 20, H - 10]], bbox.coordinates[0][2][0] - bbox.coordinates[0][0][0] > 200 ? { type: 'Sphere' } : { type: 'MultiPoint', coordinates: bbox.coordinates[0] }); const path = d3.geoPath(proj);
    svg.append('path').datum({ type: 'Sphere' }).attr('d', path).attr('fill', 'rgba(56,189,248,.07)');
    svg.append('path').datum(topojson.feature(topo, topo.objects.land)).attr('d', path).attr('fill', 'rgba(120,120,140,.28)');
    const P = (c) => proj([M.powers[c][1], M.powers[c][2]]);
    const name = (c) => (s.names && s.names[c]) || M.powers[c][0];
    const bloc = (c) => s.blocs.find(([, , m]) => m.includes(c));
    const used = new Set([...s.links.flatMap((l) => [l[0], l[1]]), ...s.blocs.flatMap((b) => b[2])]);
    const lines = svg.append('g');
    s.links.forEach(([a, b, t, lab], k) => {
      const [x1, y1] = P(a), [x2, y2] = P(b); const [, c, dash] = M.rels[t];
      const dx = x2 - x1, dy = y2 - y1, off = (k % 2 ? 1 : -1) * Math.min(60, Math.hypot(dx, dy) * 0.18);
      const mx = (x1 + x2) / 2 - dy / Math.hypot(dx, dy || 1) * off, my = (y1 + y2) / 2 + dx / Math.hypot(dx, dy || 1) * off;
      const p = lines.append('path').attr('d', `M${x1},${y1} Q${mx},${my} ${x2},${y2}`).attr('fill', 'none').attr('stroke', c).attr('stroke-width', 3).attr('stroke-dasharray', dash).attr('opacity', 0.85).style('cursor', 'pointer');
      lines.append('path').attr('d', `M${x1},${y1} Q${mx},${my} ${x2},${y2}`).attr('fill', 'none').attr('stroke', 'transparent').attr('stroke-width', 14).style('cursor', 'pointer')
        .on('click', () => { info.innerHTML = ''; info.append(h('div', { class: 'row', style: { gap: '8px' } }, h('b', null, `${name(a)} ↔ ${name(b)}`), h('span', { class: 'tag', style: { '--c': c } }, M.rels[t][0])), h('p', { class: 'small' }, lab), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain the relationship between ${name(a)} and ${name(b)} around ${s.y}: "${lab}". What interests, fears, economic ties and ideologies drove it, how did each side justify it, and what happened next?`, `${name(a)}–${name(b)}, ${s.y}`) }, '✦ Explain this relationship')); });
      p.append('title').text(lab);
    });
    [...used].forEach((c) => { const [x, y] = P(c); const b = bloc(c); const g = svg.append('g').style('cursor', 'pointer');
      g.append('circle').attr('cx', x).attr('cy', y).attr('r', 9).attr('fill', b ? b[1] : '#94A3B8').attr('stroke', '#fff').attr('stroke-width', 2);
      g.append('text').attr('x', x).attr('y', y - 13).attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700).attr('fill', 'currentColor').attr('paint-order', 'stroke').attr('stroke', 'var(--card2,#f1f1f6)').attr('stroke-width', 3).text(name(c).split(' / ')[0]);
      g.on('click', () => { info.innerHTML = ''; const L = s.links.filter((l) => l[0] === c || l[1] === c);
        info.append(h('h3', { style: { marginTop: 0 } }, name(c)), (s.leaders || {})[c] ? h('p', { class: 'small' }, '👑 ' + s.leaders[c]) : null, b ? h('p', { class: 'small' }, 'Bloc: ' + b[0]) : null,
          h('ul', { class: 'small', style: { margin: '4px 0 0 18px' } }, L.map(([a, bb, t, lab]) => h('li', null, `${M.rels[t][0]} with ${name(a === c ? bb : a)}: ${lab}`))),
          h('button', { class: 'btn sm', onclick: () => Lab.ask(`Describe ${name(c)} around ${s.y}: its political system and leader, economy, military power, goals, fears, and its relations with the other great powers.`, `${name(c)} in ${s.y}`) }, `✦ ${name(c)} in ${s.y}`)); }); });
    box.append(svg.node());
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Alliances, rivalries, wars and sanctions, 1815–2026'), h('p', { class: 'small muted' }, 'Drag through thirteen moments in time. Colors show blocs; lines show alliances, wars, rivalries, sanctions and economic ties. Notice how yesterday’s allies become today’s enemies.'), slider, head, box),
    info,
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Economic warfare: blockades, embargoes and sanctions'), h('div', { class: 'stack' }, M.econwar.map(([y, t, d]) => h('div', { class: 'small' }, h('b', null, `${y} · ${t}. `), d))),
      h('button', { class: 'btn sm', style: { marginTop: '8px' }, onclick: () => Lab.ask('Do economic sanctions work? Using historical cases (the WWI blockade, the oil embargo on Japan, Cuba, South Africa, Iraq, Iran, Russia), explain when sanctions changed behavior, when they backfired, who suffered most, and what scholars of economic statecraft conclude.', 'Sanctions') }, '✦ Do sanctions work?')));
  draw();
};

// ---------- ideas family tree ----------
const THP = { locke: 'p:John Locke', hume: 'p:David Hume', rousseau: 'p:Jean-Jacques Rousseau', smith: 'p:Adam Smith', kant: 'p:Immanuel Kant', burke: 'p:Edmund Burke', paine: 'p:Thomas Paine', wollstonecraft: 'p:Mary Wollstonecraft', maistre: 'p:Joseph de Maistre', hegel: 'sci:hegel', ricardo: 'p:David Ricardo', owen: 'p:Robert Owen', proudhon: 'p:Pierre-Joseph Proudhon', marx: 'p:Karl Marx', engels: 'p:Friedrich Engels', mill: 'p:John Stuart Mill', bakunin: 'p:Mikhail Bakunin', nietzsche: 'sci:nietzsche', kautsky: 'p:Karl Kautsky', menger: 'p:Carl Menger', kropotkin: 'p:Peter Kropotkin', sorel: 'p:Georges Sorel', lenin: 'p:Vladimir Lenin', luxemburg: 'p:Rosa Luxemburg', trotsky: 'p:Leon Trotsky', stalin: 'p:Joseph Stalin', gramsci: 'p:Antonio Gramsci', mao: 'p:Mao Zedong', mussolini: 'p:Benito Mussolini', hitler: 'p:Adolf Hitler', keynes: 'p:John Maynard Keynes', hayek: 'p:Friedrich Hayek', arendt: 'sci:arendt', fanon: 'p:Mohandas Gandhi' };
const thk = (id) => THP[id] || 'th:' + id;
M.render.ideas = (el) => {
  const T = M.thinkers, byId = Object.fromEntries(T.map((t) => [t.id, t])), lanes = Object.keys(M.lanes);
  const W = 1100, H = 80 + lanes.length * 92, x0 = 1625, x1 = 1915;
  const X = (y) => 70 + (y - x0) / (x1 - x0) * (W - 110);
  const pos = {}; const laneCount = {};
  T.slice().sort((a, b) => a.y - b.y).forEach((t) => { const li = lanes.indexOf(t.lane); const k = (laneCount[t.lane] = (laneCount[t.lane] || 0) + 1); pos[t.id] = [X(t.y), 60 + li * 92 + ((k - 1) % 3) * 26]; });
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;height:auto;min-width:760px' });
  lanes.forEach((l, i) => { S('rect', { x: 0, y: 40 + i * 92, width: W, height: 92, fill: M.lanes[l][1], opacity: i % 2 ? 0.05 : 0.09 }, svg); S('text', { x: 6, y: 56 + i * 92, 'font-size': 10, 'font-weight': 700, fill: M.lanes[l][1] }, svg, M.lanes[l][0]); });
  for (let y = 1650; y <= 1900; y += 50) { S('text', { x: X(y), y: 26, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', opacity: 0.6 }, svg, y); S('line', { x1: X(y), x2: X(y), y1: 32, y2: H, stroke: 'currentColor', opacity: 0.08 }, svg); }
  const eg = S('g', {}, svg); const E = [];
  M.tlinks.forEach(([a, b, lab]) => { if (!pos[a] || !pos[b]) return; const [ax, ay] = pos[a], [bx, by] = pos[b]; const p = S('path', { d: `M${ax},${ay} C${(ax + bx) / 2},${ay} ${(ax + bx) / 2},${by} ${bx},${by}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.2, opacity: 0.25 }, eg); S('title', {}, p, `${byId[a].n} → ${byId[b].n}: ${lab}`); E.push([a, b, p, lab]); });
  const info = h('div', { class: 'card' }, h('p', { class: 'small muted', style: { margin: 0 } }, 'Tap a thinker to see what they took from others, what they changed, and who they influenced.'));
  const show = (t) => {
    E.forEach(([a, b, p]) => { const on = a === t.id || b === t.id; p.setAttribute('opacity', on ? 0.95 : 0.08); p.setAttribute('stroke-width', on ? 2.4 : 1); p.setAttribute('stroke', on ? M.lanes[t.lane][1] : 'currentColor'); });
    const ins = E.filter(([, b]) => b === t.id), outs = E.filter(([a]) => a === t.id);
    info.innerHTML = '';
    info.append(h('div', { class: 'row', style: { gap: '12px', alignItems: 'center' } }, M.thumb(thk(t.id), 64), h('div', null, h('h3', { style: { margin: 0 } }, t.n), h('div', { class: 'tiny muted' }, `${t.y}–${t.d} · ${M.lanes[t.lane][0]}`))),
      h('div', { class: 'grid g2', style: { marginTop: '8px' } }, tile('💡 Core idea', t.idea, M.lanes[t.lane][1]), tile('📥 What they took', t.took), tile('🔄 What they changed', t.changed), tile('📤 What it led to', t.led)),
      h('div', { class: 'small', style: { marginTop: '8px' } }, ins.length ? h('div', null, h('b', null, 'Influenced by: '), ins.map(([a, , , l]) => `${byId[a].n} (${l})`).join(' · ')) : null, outs.length ? h('div', null, h('b', null, 'Influenced: '), outs.map(([, b, , l]) => `${byId[b].n} (${l})`).join(' · ')) : null),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Teach me ${t.n}’s ideas properly, in plain English with concrete examples: ${t.idea} Then explain how they built on or reacted against earlier thinkers, how they were understood and misunderstood, and their real political consequences.`, t.n) }, '✦ Teach me ' + t.n.split(' & ')[0].split(' ').pop()), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Stage a conversation between ${t.n} and their sharpest critic among the other thinkers in this tradition. Let each make their strongest case, then explain who history proved right on which points.`, t.n) }, '✦ Debate a critic')));
    info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  T.forEach((t) => { const [x, y] = pos[t.id]; const g = S('g', { style: 'cursor:pointer' }, svg); const c = M.lanes[t.lane][1];
    S('circle', { cx: x, cy: y, r: 7, fill: c, stroke: '#fff', 'stroke-width': 1.5 }, g); S('text', { x: x + 9, y: y + 4, 'font-size': 10, 'font-weight': 700, fill: 'currentColor' }, g, t.n.split(' & ')[0].replace('Joseph ', '').replace('Friedrich ', 'F. ').replace('Vladimir ', '').split(' ').slice(-1)[0]);
    g.addEventListener('click', () => show(t)); });
  // guided paths
  const pathBox = h('div', { class: 'card' });
  const runPath = (P, k = 0) => { pathBox.innerHTML = ''; const [id, txt] = P.steps[k]; const t = byId[id]; show(t);
    pathBox.append(h('div', { class: 'row' }, h('h3', { style: { margin: 0 } }, '🧭 ' + P.t), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, `Step ${k + 1} of ${P.steps.length}`)), h('div', { class: 'row', style: { gap: '12px', marginTop: '8px', alignItems: 'flex-start' } }, M.thumb(thk(id), 72), h('div', null, h('b', null, t.n + ` (${t.y}–${t.d})`), h('p', { style: { margin: '4px 0 0' } }, txt))),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, h('button', { class: 'btn sm', disabled: k === 0, onclick: () => runPath(P, k - 1) }, '← Back'), h('button', { class: 'btn sm primary', disabled: k === P.steps.length - 1, onclick: () => runPath(P, k + 1) }, 'Next →'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me on the path "${P.t}": 6 questions on how each thinker built on or broke with the previous one. Then tell me what I missed.`, P.t) }, '✦ Quiz me on this path'))); };
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'The family tree of ideas'), h('p', { class: 'small' }, `${T.length} thinkers from Locke to Arendt, placed by birth year and tradition, connected by who built on, attacked or misused whom. Ideas are never born alone: every thinker answers someone.`),
    h('div', { class: 'row', style: { gap: '6px' } }, M.paths.map((P) => h('button', { class: 'btn sm primary', onclick: () => runPath(P) }, '🧭 ' + P.t)))),
    pathBox, h('div', { class: 'viz', style: { padding: '6px', color: 'var(--ink)', overflowX: 'auto' } }, svg), info);
  runPath(M.paths[0]);
};

// ---------- ideology families ----------
M.render.families = (el) => {
  let f = M.families[0], sel = new Set([0, 3, 4]);
  const box = h('div'); const pick = h('div', { class: 'row', style: { gap: '6px' } });
  function draw() {
    pick.innerHTML = ''; M.families.forEach((x) => pick.append(h('button', { class: 'btn' + (x === f ? ' primary' : ''), onclick: () => { f = x; sel = new Set([0, 1, 2].slice(0, Math.min(3, x.members.length))); if (x.id === 'left') sel = new Set([0, 2, 3]); draw(); } }, x.t)));
    box.innerHTML = '';
    const mem = f.members; const chosen = [...sel].sort((a, b) => a - b).map((i) => mem[i]);
    box.append(h('div', { class: 'card' }, h('p', null, f.intro), h('div', { class: 'tiny muted', style: { marginBottom: '4px' } }, 'Choose which to compare (2–4 works best):'),
      h('div', { class: 'row', style: { gap: '6px' } }, mem.map((m, i) => h('span', { class: 'chip' + (sel.has(i) ? ' on' : ''), style: { '--c': m.c }, onclick: () => { sel.has(i) ? sel.delete(i) : sel.add(i); draw(); } }, h('i'), m.n)))),
      h('div', { class: 'card', style: { overflowX: 'auto' } }, h('table', { class: 't small' }, h('thead', null, h('tr', null, h('th', null, ''), chosen.map((m) => h('th', { style: { color: m.c, minWidth: '170px' } }, m.n)))),
        h('tbody', null, f.dims.map((d, k) => h('tr', null, h('td', { class: 'muted', style: { width: '13%' } }, d), chosen.map((m) => h('td', null, m.v[k]))))))),
      h('div', { class: 'row', style: { gap: '6px' } },
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Compare ${chosen.map((m) => m.n).join(', ')} in depth: how each actually worked in practice, how people’s rights and living conditions changed under each (better and worse), who was persecuted and why, and how each tradition’s supporters and critics argue about them. Be evidence-based and fair.`, 'Comparison') }, '✦ Compare in depth'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`For ${chosen.map((m) => m.n).join(' and ')}: what did ordinary people’s lives look like (work, wages, food, housing, health, education, freedom of speech and religion, ability to strike or vote)? Use real data and testimony.`, 'Living under each') }, '✦ Ordinary life under each'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`How do the differences between ${chosen.map((m) => m.n).join(' and ')} still shape politics today? Which modern parties and movements descend from each?`, 'Legacy today') }, '✦ Their legacy today')));
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Ideology families: the differences that mattered'), h('p', { class: 'small muted' }, 'Labels hide huge differences. Stalinism is not the same as Marx’s Marxism or Lenin’s Leninism; fascism is not the same as conservatism; colonialism is one form of imperialism. Compare them on the same questions.'), pick), box);
  draw();
};

// ---------- leaders on trial ----------
const FIGP = { wilhelm: 'Kaiser Wilhelm II', nicholas: 'Nicholas II', wilson: 'Woodrow Wilson', clemenceau: 'Georges Clemenceau', lenin: 'Vladimir Lenin', hitler: 'Adolf Hitler', mussolini: 'Benito Mussolini', stalin: 'Joseph Stalin', churchill: 'Winston Churchill', fdr: 'Franklin D. Roosevelt', hirohito: 'Emperor Hirohito', chiang: 'Chiang Kai-shek', degaulle: 'Charles de Gaulle', franco: 'Francisco Franco', truman: 'Harry Truman', mao: 'Mao Zedong', khrushchev: 'Nikita Khrushchev', kennedy: 'John F. Kennedy', castro: 'Fidel Castro', ho: 'Ho Chi Minh', nixon: 'Richard Nixon', reagan: 'Ronald Reagan', thatcher: 'Margaret Thatcher', gorbachev: 'Mikhail Gorbachev', deng: 'Deng Xiaoping' };
M.render.leaders = (el, arg) => {
  let war = 'all';
  const det = h('div', { class: 'card', style: { display: 'none' } }); const grid = h('div', { class: 'grid g3' }); const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const open = (f) => { det.style.display = 'block'; det.innerHTML = ''; history.replaceState(null, '', '#history-modern-leaders-' + f.id);
    det.append(h('div', { class: 'row', style: { gap: '14px', alignItems: 'center' } }, M.thumb(f.p || 'p:' + FIGP[f.id], 84), h('div', null, h('h2', { style: { margin: 0 } }, f.n), h('div', { class: 'small muted' }, `${f.life} · ${f.role}`)), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { det.style.display = 'none'; } }, 'Close')),
      sect('Background', h('p', { class: 'small' }, f.bg)), sect('What they actually did (the record)', h('p', { class: 'small' }, f.did)),
      sect('💰 Interests, money & backers', h('p', { class: 'small' }, f.money)),
      h('div', { class: 'grid g2', style: { marginTop: '10px' } }, tile('👍 What supporters say, and why', f.pro, '#16A34A'), tile('👎 What critics say, and why', f.con, '#DC2626')),
      sect('📌 What the evidence settles', h('p', { class: 'small' }, f.facts)), sect('📣 Propaganda by and about them', h('p', { class: 'small' }, f.prop)),
      sect('📚 Historians and biographers (know their stance)', h('ul', { class: 'small', style: { margin: '4px 0 0 18px' } }, f.read.map(([a, s]) => h('li', null, a, ' ', h('span', { class: 'tag', style: { '--c': /critical|hostile/.test(s) ? '#DC2626' : /sympath|admir/.test(s) ? '#16A34A' : '#64748B' } }, s))))),
      f.q ? h('p', { class: 'small', style: { marginTop: '10px' } }, Lab.conf(f.q[1]), ' ', h('b', null, f.q[0])) : null,
      sect('Put them on trial', h('div', { class: 'row', style: { gap: '6px' } },
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Hold a historical trial of ${f.n}. Call (1) their most informed supporter, (2) their most informed critic, and (3) a neutral historian. Each presents their strongest evidence with sources. Then explain why each side says what it says: their interests, ideology, nationality and biases. Finish with what the evidence settles, what remains contested, and what is propaganda.`, f.n) }, '⚖️ Hold the trial'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Follow the money and interests around ${f.n}: who funded them, which classes, businesses or institutions they served, who benefited from their policies and who paid, with evidence.`, f.n) }, '💰 Follow the money'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`What are the most common myths about ${f.n}, from admirers and from enemies? For each, say what the evidence actually shows.`, f.n) }, '🔍 Myths vs evidence'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain how ${f.n} made decisions: their inner circle, how information reached them, how they treated advisers who disagreed, and two specific decisions traced step by step.`, f.n) }, '🧠 How they decided'))));
    det.scrollIntoView({ behavior: 'smooth', block: 'start' }); Lab.markDone && Lab.markDone('fig:' + f.id, 4, f.n); };
  function draw() {
    chips.innerHTML = ''; [['all', 'All'], ['ww1', 'World War I'], ['ww2', 'World War II'], ['cold', 'Cold War']].forEach(([k, n]) => chips.append(h('span', { class: 'chip' + (war === k ? ' on' : ''), style: { '--c': '#374151' }, onclick: () => { war = k; draw(); } }, n)));
    grid.innerHTML = ''; M.figures.filter((f) => war === 'all' || f.war.includes(war)).forEach((f) => grid.append(h('div', { class: 'card', style: { cursor: 'pointer', padding: '12px 14px' }, onclick: () => open(f) }, h('div', { class: 'row', style: { gap: '10px', alignItems: 'center', flexWrap: 'nowrap' } }, M.thumb(f.p || 'p:' + FIGP[f.id], 52), h('div', { style: { minWidth: 0, flex: 1 } }, h('b', null, f.n), h('div', { class: 'tiny muted' }, f.side + ' · ' + f.life))), h('p', { class: 'small', style: { margin: '6px 0 0' } }, f.role))));
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Leaders on trial'), h('p', { class: 'small' }, 'The most controversial figures of the world wars and Cold War. For each: the documented record, the money and interests behind them, what supporters and critics say and why, the propaganda by and about them, and which historians lean which way. The goal is not to make you like or hate anyone but to see clearly.'), chips), grid, det);
  draw(); if (arg) { const f = M.figures.find((x) => x.id === arg); if (f) setTimeout(() => open(f), 60); }
};

// ---------- how people lived ----------
M.render.conditions = (el) => {
  const C = M.conditions; let era = 'e1';
  const eraRow = h('div', { class: 'row', style: { gap: '6px' } }); const body = h('div');
  function draw() {
    eraRow.innerHTML = ''; M.eras.forEach((e) => eraRow.append(h('span', { class: 'chip' + (era === e.id ? ' on' : ''), style: { '--c': e.c }, onclick: () => { era = e.id; draw(); } }, h('i'), `${e.y}–${e.y2 === 2026 ? 'now' : e.y2}`)));
    const er = M.eras.find((e) => e.id === era), g = C.groups.find((x) => x.era === era), b = C.beliefs.find((x) => x.era === era);
    body.innerHTML = '';
    body.append(h('div', { class: 'card', style: { borderTop: `5px solid ${er.c}` } }, h('h3', { style: { marginTop: 0 } }, er.n), h('table', { class: 't small' }, h('tbody', null, er.stats.map(([a, v]) => h('tr', null, h('td', { class: 'muted' }, a), h('td', null, v))))),
      h('div', { class: 'stack', style: { marginTop: '10px' } }, g.rows.map(([who, life, kept]) => h('div', { style: { background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px' } }, h('b', null, who), h('p', { class: 'small', style: { margin: '4px 0' } }, life), h('p', { class: 'small muted', style: { margin: 0 } }, h('b', null, 'What kept it this way: '), kept)))),
      h('div', { style: { marginTop: '10px', background: 'var(--card2)', borderRadius: '10px', padding: '10px 12px', borderLeft: `4px solid ${er.c}` } }, h('b', null, '🧠 What people believed: ' + b.t), h('p', { class: 'small', style: { margin: '4px 0' } }, b.d), h('p', { class: 'small muted', style: { margin: 0 } }, h('b', null, 'How beliefs spread: '), b.media)),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '10px' } }, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Describe a typical day for a poor family and a rich family in three different countries during "${er.n}" (${er.y}–${er.y2}): food, work hours, wages and prices, housing, health, schooling, religion, entertainment, and legal rights. Use real historical evidence and numbers.`, er.n) }, '✦ A day in the life'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`In "${er.n}" (${er.y}–${er.y2}), how were the material conditions of ordinary people created and maintained, and what forces changed them? Give the Marxist, liberal, conservative and anti-colonial explanations and the evidence for each.`, er.n) }, '✦ Why were things this way?'))));
  }
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'How people lived, 1700–2026'), h('p', { class: 'small' }, C.intro),
      h('div', { class: 'row', style: { gap: '6px' } }, dataBtn({ ds: 'living', ents: ['World', 'United Kingdom', 'India', 'China', 'Nigeria'], v: 0, note: 'Life expectancy at birth (Gapminder).' }, 'Life expectancy'), dataBtn({ ds: 'living', ents: ['World', 'United States', 'Russia', 'China', 'India'], v: 1, note: 'Children dying before age 5 per 1,000 born. Look for famines and wars.' }, 'Child mortality'), dataBtn({ ds: 'living', ents: ['World', 'South Korea', 'Iran', 'Nigeria', 'United States'], v: 2, note: 'Children per woman.' }, 'Family size'), dataBtn({ ds: 'living', ents: ['World', 'China', 'India', 'Nigeria'], v: 3, note: 'Extreme poverty rate (Gapminder).' }, 'Extreme poverty'), dataBtn({ ds: 'living', ents: ['United States', 'United Kingdom', 'China', 'India', 'World'], v: 4, note: 'CO₂ per person: who burned the fuel that built modern wealth.' }, 'Emissions'), dataBtn({ ds: 'slavelaw', ents: ['World'], v: 0, note: 'Countries where slavery was legal.' }, 'Legal slavery'))),
    h('div', { class: 'card' }, h('div', { class: 'tiny muted', style: { marginBottom: '4px' } }, 'Pick an era'), eraRow), body,
    h('h3', { style: { margin: '18px 0 6px' } }, 'How material conditions are created, kept and changed'),
    h('div', { class: 'grid g2' }, C.mechanisms.map((m) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, m.e + ' ' + m.t), h('p', { class: 'small' }, m.how), h('p', { class: 'small muted' }, h('b', null, 'Who gained, who paid: '), m.who), dataBtn(m.ds)))));
  draw();
};

// ---------- public opinion ----------
M.render.opinion = (el) => {
  const O = M.opinion; let guess = true;
  const list = h('div', { class: 'stack' });
  const card = (p) => {
    const box = h('div', { class: 'card' }); let shown = !guess; const gi = /^(\d|Aug|May|July|Nov|March)/.test(p.res[0][0]) ? p.res.length - 1 : 0; const G = p.res[gi]; const slider = h('input', { type: 'range', min: 0, max: 100, value: 50, style: { width: '100%' } }); const gv = h('b', null, '50%');
    slider.oninput = () => { gv.textContent = slider.value + '%'; };
    const res = h('div');
    const reveal = () => { shown = true; res.innerHTML = ''; res.append(bars(p.res, '%', '#2563EB'), guess ? h('p', { class: 'small', style: { marginTop: '6px' } }, `Your guess for “${G[0]}”: ${slider.value}%. Actual: ${G[1]}%. ${Math.abs(slider.value - G[1]) <= 10 ? '🎯 Close!' : 'Surprised?'}`) : null,
      h('p', { class: 'small' }, h('b', null, 'Context: '), p.ctx), h('p', { class: 'small' }, h('b', null, 'What it teaches: '), p.lesson), h('p', { class: 'tiny muted' }, 'Source: ' + p.src), p.ev ? evChip(p.ev) : null, ' ',
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`Help me interpret this real poll: ${p.c}, ${p.y}, ${p.who}: "${p.q}" Results: ${p.res.map((r) => r[0] + ' ' + r[1] + '%').join(', ')}. What explains these numbers, how reliable was the method, how did question wording matter, and how do different political sides use this result?`, 'Poll ' + p.y) }, '✦ Interpret it')); };
    box.append(h('div', { class: 'row', style: { gap: '8px', alignItems: 'baseline' } }, h('b', { style: { fontFamily: 'Space Grotesk', fontSize: '20px' } }, p.y), h('span', { class: 'small' }, p.c + ' · ' + p.who), h('span', { class: 'sp' }), Lab.conf(p.conf)), h('p', { style: { fontWeight: 600, margin: '6px 0' } }, '“' + p.q + '”'), res);
    if (!shown) res.append(h('div', { class: 'small' }, `Your guess for “${G[0]}”: `, gv), slider, h('button', { class: 'btn sm primary', style: { marginTop: '6px' }, onclick: reveal }, 'Reveal the real answer')); else reveal();
    return box;
  };
  const draw = () => { list.innerHTML = ''; O.polls.slice().sort((a, b) => a.y - b.y).forEach((p) => list.append(card(p))); };
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'What did people actually think?'), h('p', { class: 'small' }, O.intro),
      h('label', { class: 'small' }, h('input', { type: 'checkbox', checked: true, onchange: (e) => { guess = e.target.checked; draw(); } }), ' Guess mode: predict each result before you see it')),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Before polls: how historians measure opinion'), h('div', { class: 'grid g2' }, O.before.map(([t, d]) => tile(t, d)))),
    list,
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'How to read any poll'), h('ul', { class: 'small', style: { margin: '0 0 0 18px', lineHeight: 1.7 } }, h('li', null, 'Who was asked? A representative random sample beats a huge biased one (1936).'), h('li', null, 'How was the question worded? Small wording changes move results by many points.'), h('li', null, 'Could people answer freely? In dictatorships, fear shapes answers; plebiscites with 99% “yes” measure control.'), h('li', null, 'Who paid for it? Partisan polls are often accurate but are released selectively.'), h('li', null, 'One poll is a snapshot; trends over time tell the story.')),
      h('button', { class: 'btn sm', onclick: () => Lab.ask('Find me the most important public opinion data on a historical question I choose, explain where it comes from and how reliable it is. First, ask me which question.', 'Public opinion') }, '✦ Ask about any period')));
  draw();
};

// ---------- political language ----------
M.render.language = (el) => {
  let q = ''; const list = h('div', { class: 'grid g2' });
  const draw = () => { list.innerHTML = ''; M.terms.filter((t) => !q || t.join(' ').toLowerCase().includes(q)).forEach(([t, d, who, note]) => list.append(h('div', { class: 'card', style: { padding: '12px 14px' } }, h('div', { class: 'row' }, h('b', { style: { fontSize: '16px' } }, t), h('span', { class: 'sp' }), h('span', { class: 'tag', style: { '--c': '#64748B' } }, who)), h('p', { class: 'small', style: { margin: '6px 0' } }, d), note ? h('p', { class: 'tiny muted', style: { margin: 0 } }, '💡 ' + note) : null,
    h('button', { class: 'btn sm', style: { marginTop: '6px' }, onclick: () => Lab.ask(`Trace the history of the political term "${t}": where it came from, how its meaning changed, how different sides use it today and what they mean by it, with real examples.`, t) }, '✦ History of the word')))); };
  el.append(h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Political language decoder'), h('p', { class: 'small' }, 'The same word can mean opposite things to different sides, and euphemisms can hide atrocities. Knowing who uses a word, and what they mean by it, is the first defense against propaganda.'), h('input', { type: 'text', placeholder: 'Search terms…', oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } })), list);
  draw();
};
