// Modern world module, part 9: American power — how the US became a superpower, how its government, intelligence agencies and
// contractors work, how it treats allies (South Korea in depth), its tools of leverage, and the "is it an empire?" debate.
const h = Lab.h;
const M = Lab.MODERN;
const U = Lab.USP;
const at = M.SUBS.findIndex(([k]) => k === 'warmyths');
M.SUBS.splice(at >= 0 ? at + 1 : M.SUBS.length, 0, ['uspower', 'American power: how it works']);
const grp = M.GROUPS.find((g) => g[2].includes('warmyths') || g[2].includes('wars'));
if (grp) { const i = grp[2].indexOf('warmyths'); grp[2].splice(i >= 0 ? i + 1 : grp[2].length, 0, 'uspower'); }

const SECTIONS = [
  ['start', '🧭 Start here'], ['history', '📜 How it became a superpower'], ['map', '🗺️ Troops & bases map'], ['data', '📊 The data'], ['machine', '🏛️ The machine'], ['money', '🏭 Money & contractors'],
  ['surveil', '👁️ Surveillance'], ['korea', '🇰🇷 South Korea'], ['deep', '🔍 Japan · Taiwan · NATO · UN'], ['allies', '🌍 More case files'], ['tools', '🧰 Tools of leverage'], ['saidno', '✋ When allies said no'], ['empire', '⚖️ Is it an empire?'],
];
const card = (...kids) => h('div', { class: 'card' }, ...kids);
const h3 = (t) => h('h3', { style: { marginTop: 0 } }, t);
const tutor = (q, ctx, label) => h('button', { class: 'btn sm primary', onclick: () => Lab.ask(q, ctx) }, label || '✦ Go deeper with the tutor');
const bars = (rows, unit, colorFn) => { const mx = Math.max(...rows.map((r) => r[1])); return h('div', null, rows.map(([l, v]) => h('div', { class: 'row', style: { margin: '3px 0', flexWrap: 'nowrap' } }, h('span', { class: 'small', style: { width: '130px', flex: 'none' } }, l), h('div', { style: { flex: 1, height: '16px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: (v / mx) * 100 + '%', height: '100%', borderRadius: '6px', background: colorFn(l) } })), h('b', { class: 'small', style: { width: '56px', textAlign: 'right' } }, v + unit)))); };
const usColor = (l) => (l === 'United States' ? '#2563EB' : '#94A3B8');

const R = {};

R.start = (el, go) => {
  el.append(
    card(h('h2', { style: { marginTop: 0 } }, 'American power: how it works'),
      h('p', { class: 'small' }, 'The United States has the largest military, the world’s main currency, the most allies and the most overseas bases of any country in history. Supporters call it the leader of a free-world order; critics call it an empire. This section lays out how that power was built, who runs it, who profits, how it treats allies and rivals, and how it compares with other great powers, by the same standards used everywhere else in the Lab.'),
      h('div', { class: 'grid g2' },
        h('div', { class: 'hint' }, h('b', null, 'The test used for every case: '), 'What was done? Who decided? Who paid the cost? Who profited? Could the people affected say no?'),
        h('div', { class: 'hint' }, h('b', null, 'Developing: '), 'Events from 2025–26 (tariffs on allies, the Venezuela raid, the Iran war, Greenland, the $1.5 trillion budget request) are still unfolding. They are marked “developing”; check current news.')),
      h('div', { class: 'grid g2', style: { marginTop: '8px' } }, SECTIONS.slice(1).map(([k, n]) => h('button', { class: 'btn', style: { textAlign: 'left' }, onclick: () => go(k) }, n)))),
    h('div', { class: 'grid g3' }, ['us:humphreys', 'us:diego', 'us:pentagon'].map((k) => M.figure(k, { max: '180px', margin: '0' }))),
    h('div', { class: 'card', style: { borderLeft: '4px solid #CA8A04' } }, h('b', { class: 'small' }, '🪞 A note on bias, including mine'), h('p', { class: 'small' }, U.bias)),
    card(h3('The scale, in numbers'), h('div', { class: 'grid g2' },
      h('div', null, h('div', { class: 'tiny muted' }, 'Share of world military spending, 2025'), bars([['United States', 33], ['China (est.)', 12], ['Russia', 6.6], ['Germany', 3.9], ['India', 3.2], ['United Kingdom', 3.1], ['Ukraine', 2.9], ['Saudi Arabia', 2.9], ['France', 2.4]], '%', usColor), Lab.source('SIPRI Military Expenditure Database (April 2026). SIPRI marks China’s figure as an estimate.')),
      h('div', null, h('div', { class: 'tiny muted' }, 'Share of world arms exports, 2021–25'), bars([['United States', 42], ['France', 9.8], ['Russia', 6.8], ['Germany', 5.7], ['China', 5.6], ['Israel', 4.4], ['United Kingdom', 3.4]], '%', usColor), Lab.source('SIPRI Arms Transfers Database (March 2026)')))));
};

R.history = (el) => {
  let i = 0; const box = h('div');
  const nav = h('div', { class: 'row', style: { gap: '4px', flexWrap: 'wrap' } });
  const draw = () => {
    const [y, t, what, why, cost, def, conf, src] = U.timeline[i];
    nav.querySelectorAll('.chip').forEach((c, k) => c.classList.toggle('on', k === i));
    box.innerHTML = '';
    const HIMG = { 2: 'us:hawaii1893', 3: 'us:panamacanal', 6: 'us:imf', 7: 'us:marshall', 8: 'us:tehran1953', 9: 'us:hue', 13: 'us:firdos', 16: 'us:typhon' };
    box.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `Step ${i + 1} of ${U.timeline.length} · ${y}`), Lab.conf(conf)), h('h2', { style: { margin: '4px 0 8px' } }, t),
      HIMG[i] ? M.figure(HIMG[i], { max: '300px' }) : null,
      h('p', { class: 'small' }, what),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } },
        h('div', { class: 'hint' }, h('b', null, '🎯 Why: '), why),
        h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #DC2626' } }, h('b', { class: 'small' }, '💸 Who paid, and the critics'), h('p', { class: 'small' }, cost))),
      h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #2563EB', marginTop: '8px' } }, h('b', { class: 'small' }, '🛡️ What defenders say'), h('p', { class: 'small' }, def)),
      Lab.source(src),
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Earlier'),
        h('button', { class: 'btn sm', disabled: i === U.timeline.length - 1, onclick: () => { i++; draw(); } }, 'Later →'),
        tutor(`Teach me in depth about this stage of US history: "${t}" (${y}). Include primary sources I can read, the strongest critics and defenders and who they are, and how people in the affected countries remember it.`, t))));
  };
  U.timeline.forEach(([y, t], k) => nav.append(h('span', { class: 'chip', style: { fontSize: '11px' }, onclick: () => { i = k; draw(); } }, y)));
  el.append(card(h3('📜 From 13 colonies to superpower'), h('p', { class: 'small' }, 'Seventeen steps, each with the motives, the costs, the critics and the defenders. Click any date.'), nav), box);
  draw();
};

R.machine = (el) => {
  const grid = h('div', { class: 'grid g2', style: { alignItems: 'start' } });
  const MIMG = { pentagon: 'us:pentagon', cia: 'us:cia', nsa: 'us:nsa' };
  U.machine.forEach(([id, e, n, est, size, does, power, scand, over, def, conf, src]) => {
    const body = h('div', { style: { display: 'none', marginTop: '6px' } },
      MIMG[id] ? M.figure(MIMG[id], { max: '220px' }) : null,
      h('p', { class: 'small' }, h('b', null, 'Size: '), size),
      h('p', { class: 'small' }, h('b', null, 'What it does: '), does),
      h('p', { class: 'small' }, h('b', null, 'Its power: '), power),
      h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #DC2626' } }, h('b', { class: 'small' }, '⚠️ Scandals and abuses on record'), h('p', { class: 'small' }, scand)),
      h('p', { class: 'small' }, h('b', null, 'Who checks it: '), over),
      h('p', { class: 'small' }, h('b', null, 'Defenders say: '), def),
      Lab.source(src), tutor(`Explain how the ${n} really works: its legal powers, budget, how it is overseen, its documented abuses and its documented successes, and how it compares with equivalent agencies in China, Russia and allied democracies.`, n));
    const c = h('div', { class: 'card' }, h('div', { class: 'row', style: { cursor: 'pointer', flexWrap: 'nowrap' } }, h('span', { style: { fontSize: '24px' } }, e), h('div', { style: { flex: 1 } }, h('b', null, n), h('div', { class: 'tiny muted' }, 'Created ' + est)), Lab.conf(conf)), body);
    c.firstChild.onclick = () => { body.style.display = body.style.display === 'none' ? 'block' : 'none'; };
    grid.append(c);
  });
  el.append(card(h3('🏛️ Who actually runs American power'), h('p', { class: 'small' }, 'The pieces of the US national-security state, what each costs, what it has done, and who is supposed to check it. Click a card to open it.'),
    h('div', { class: 'hint' }, h('b', null, 'How a decision usually flows: '), 'intelligence agencies warn → the President and National Security Council decide → the Pentagon, CIA, Treasury or State Department act → contractors build and supply → Congress funds (or, rarely, refuses) → courts and the press sometimes expose what went wrong, often years later.')), grid);
};

R.money = (el) => {
  const tiles = h('div', { class: 'grid g2' }, U.money.map(([v, l, src, conf]) => h('div', { class: 'card', style: { boxShadow: 'none' } }, h('div', { class: 'row' }, h('div', { class: 'kpi' }, v), Lab.conf(conf)), h('div', { class: 'small' }, l), Lab.source(src))));
  // loop diagram
  const NS = 'http://www.w3.org/2000/svg'; const s = (t, a) => { const e = document.createElementNS(NS, t); Object.entries(a || {}).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
  const svg = s('svg', { viewBox: '0 0 700 360', width: '100%', style: 'max-width:700px;display:block;margin:auto' });
  const defs = s('defs'); const mk = s('marker', { id: 'usp-arr', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }); mk.append(s('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#64748B' })); defs.append(mk); svg.append(defs);
  const pos = Object.fromEntries(U.loop.map(([id, , x, y]) => [id, [x, y]]));
  const edges = [['tax', 'congress', 'taxes'], ['congress', 'pentagon', 'appropriations'], ['pentagon', 'firms', 'contracts'], ['firms', 'influence', 'profits fund'], ['influence', 'congress', 'lobbying & donations']];
  edges.forEach(([a, b, lab]) => { const [x1, y1] = pos[a], [x2, y2] = pos[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); const sx = x1 + (dx / L) * 62, sy = y1 + (dy / L) * 28, ex = x2 - (dx / L) * 62, ey = y2 - (dy / L) * 28; svg.append(s('line', { x1: sx, y1: sy, x2: ex, y2: ey, stroke: '#64748B', 'stroke-width': 2, 'marker-end': 'url(#usp-arr)' })); const t = s('text', { x: (sx + ex) / 2, y: (sy + ey) / 2 - 6, 'text-anchor': 'middle', 'font-size': 12, fill: '#64748B' }); t.textContent = lab; svg.append(t); });
  // revolving door (curved, dashed)
  const [fx, fy] = pos.firms, [px, py] = pos.pentagon; svg.append(s('path', { d: `M${fx + 60},${fy + 10} Q${px + 60},${fy + 40} ${px + 20},${py + 30}`, fill: 'none', stroke: '#DC2626', 'stroke-width': 2, 'stroke-dasharray': '5 4', 'marker-end': 'url(#usp-arr)' }));
  const rt = s('text', { x: 600, y: 300, 'text-anchor': 'middle', 'font-size': 12, fill: '#DC2626' }); rt.textContent = 'revolving door (people)'; svg.append(rt);
  const info = h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Click a box to see how that step works.');
  U.loop.forEach(([id, label, x, y, d]) => { const g = s('g', { style: 'cursor:pointer' }); g.append(s('rect', { x: x - 70, y: y - 26, width: 140, height: 52, rx: 10, fill: id === 'firms' ? '#2563EB18' : '#64748B14', stroke: id === 'firms' ? '#2563EB' : '#94A3B8' })); const ci = label.lastIndexOf(', '); const lines = ci > 0 ? [label.slice(0, ci + 1), label.slice(ci + 2)] : [label]; lines.forEach((ln, k) => { const t = s('text', { x, y: y + 4 + (k - (lines.length - 1) / 2) * 15, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 600, fill: 'currentColor' }); t.textContent = ln; g.append(t); }); g.addEventListener('click', () => { info.innerHTML = ''; info.append(h('b', null, label + ': '), d); }); svg.append(g); });
  el.append(card(h3('🏭 Follow the money'), h('p', { class: 'small' }, 'In his 1961 farewell address President Eisenhower, a former five-star general, warned against the “unwarranted influence” of a “military-industrial complex.” Here is the loop critics describe, and the numbers behind it.'), svg, info),
    card(h3('The numbers'), tiles),
    h('div', { class: 'grid g2', style: { alignItems: 'start' } }, U.moneySides.map(([w, d], k) => h('div', { class: 'card', style: { borderLeft: `4px solid ${['#DC2626', '#2563EB', '#CA8A04'][k]}` } }, h('b', { class: 'small' }, w), h('p', { class: 'small' }, d)))),
    card(h3('The big contractors, and what they build'), h('div', { class: 'grid g2' }, [
      ['Lockheed Martin', 'F-35 and F-22 fighters, missiles (PAC-3, Javelin with RTX), space systems. The largest federal contractor ($80+ billion in Pentagon obligations in fiscal 2025).'],
      ['RTX (Raytheon)', 'Missiles (Patriot, Tomahawk, Stinger), radars, jet engines (Pratt & Whitney). Former Defense Secretary Lloyd Austin sat on Raytheon’s board before taking office.'],
      ['General Dynamics', 'Nuclear submarines (Electric Boat), Abrams tanks, shipyards, and a huge IT services business.'],
      ['Boeing', 'Fighters (F-15, F/A-18), tankers, helicopters, satellites; also a commercial airliner maker, which makes it less dependent on the Pentagon than rivals.'],
      ['Northrop Grumman', 'B-21 stealth bomber, the new Sentinel nuclear missile, satellites; much of its work is classified.'],
      ['The new wave', 'Palantir (data and AI), Anduril (drones and autonomy), SpaceX (launches and Starshield satellites) and others are winning large contracts, with founders close to politicians of both parties; critics see a new revolving door through venture capital.'],
    ].map(([n, d]) => h('div', { class: 'card', style: { boxShadow: 'none' } }, h('b', { class: 'small' }, n), h('p', { class: 'small' }, d)))), Lab.source('Company reports; federal contract data; news reports'),
      h('div', { class: 'row' }, tutor('Explain how the US defense acquisition system works, from a military requirement to a contract to a weapon in service, where money is lost, why reform keeps failing, and what the strongest arguments are for and against current spending levels. Include who funds the people making each argument.', 'Military-industrial complex'))));
};

R.surveil = (el) => {
  const list = h('div', null, U.surveillance.map(([y, t, d, src, conf]) => h('div', { style: { display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--line)' } },
    h('div', { class: 'tiny', style: { width: '92px', flex: 'none', fontWeight: 700, color: 'var(--muted)' } }, y),
    h('div', { style: { flex: 1 } }, h('div', { class: 'row' }, h('b', { class: 'small' }, t), Lab.conf(conf)), h('div', { class: 'small' }, d), h('div', { class: 'tiny muted' }, 'How we know: ' + src)))));
  el.append(h('div', { class: 'grid g2' }, M.figure('us:nsa', { max: '240px' }), M.figure('us:menwith', { max: '240px' })), card(h3('👁️ A century of American surveillance'), h('p', { class: 'small' }, 'Almost every program below was secret, denied or minimized until someone (a congressional committee, a journalist, a whistleblower, a burglar or a court) forced it into the open. That pattern is itself the most important fact.'), list),
    h('div', { class: 'grid g2', style: { alignItems: 'start' } }, U.survSides.map(([w, d], k) => h('div', { class: 'card', style: { borderLeft: `4px solid ${['#DC2626', '#2563EB', '#CA8A04'][k]}` } }, h('b', { class: 'small' }, w), h('p', { class: 'small' }, d)))),
    card(h('b', { class: 'small' }, 'Think it through'), h('p', { class: 'small' }, 'Every exposure above came from outside the agencies. What does that tell you about how much we still do not know, and about the value of a free press and whistleblowers? And what would the same history look like for a country with no free press?'),
      tutor('Walk me through US surveillance law today: what Section 702 allows, what the FISA Court does, the main abuses documented since 2013, the reforms proposed by both left and right, and how US surveillance compares with China, Russia and the UK. Cite primary sources.', 'US surveillance')));
};

R.korea = (el) => {
  let i = 0; const box = h('div');
  const nav = h('div', { class: 'row', style: { gap: '4px', flexWrap: 'wrap' } });
  const draw = () => {
    const [y, t, what, us, kr, conf, src] = U.korea[i];
    nav.querySelectorAll('.chip').forEach((c, k) => c.classList.toggle('on', k === i));
    box.innerHTML = '';
    const KIMG = { 2: 'us:korea1950', 5: 'us:gwangju', 10: 'us:humphreys' };
    box.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${i + 1} of ${U.korea.length} · ${y}`), Lab.conf(conf)), h('h2', { style: { margin: '4px 0 8px' } }, t), KIMG[i] ? M.figure(KIMG[i], { max: '300px' }) : null, h('p', { class: 'small' }, what),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } },
        h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #2563EB' } }, h('b', { class: 'small' }, '🇺🇸 The American role'), h('p', { class: 'small' }, us)),
        h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #DC2626' } }, h('b', { class: 'small' }, '🇰🇷 Korean choices and views'), h('p', { class: 'small' }, kr))),
      Lab.source(src),
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Earlier'), h('button', { class: 'btn sm', disabled: i === U.korea.length - 1, onclick: () => { i++; draw(); } }, 'Later →'))));
  };
  U.korea.forEach(([y], k) => nav.append(h('span', { class: 'chip', style: { fontSize: '11px' }, onclick: () => { i = k; draw(); } }, y)));
  const levelColor = (l) => (l.startsWith('High') ? '#DC2626' : l.startsWith('Medium') ? '#CA8A04' : l.startsWith('Low') ? '#16A34A' : '#2563EB');
  el.append(card(h3('🇰🇷 South Korea: how much does Washington really control?'), h('p', { class: 'small' }, 'You suggested South Korea as an example of a new, indirect kind of imperialism. Here is the full record from 1945 to today, with the American role and the Korean side shown separately, so you can judge.'), nav), box,
    card(h3('Where the leverage is, today'), h('p', { class: 'tiny muted' }, 'These levels are an editorial judgment from the record above, not a measured statistic. Argue with them.'),
      h('div', null, U.koreaLeverage.map(([a, l, why]) => h('div', { style: { padding: '7px 0', borderBottom: '1px solid var(--line)' } }, h('div', { class: 'row' }, h('b', { class: 'small' }, a), h('span', { class: 'tiny', style: { padding: '1px 8px', borderRadius: '10px', color: '#fff', background: levelColor(l), fontWeight: 700 } }, l)), h('div', { class: 'small' }, why))))),
    h('div', { class: 'card', style: { borderLeft: '4px solid #64748B' } }, h('b', { class: 'small' }, '⚖️ The verdict, as fairly as I can put it'), h('p', { class: 'small' }, U.koreaVerdict),
      h('div', { class: 'row' }, tutor('Give me an in-depth history of the US–South Korea relationship from 1945 to today, including Jeju, the Korean War, Park Chung-hee, Gwangju, the IMF crisis, THAAD, cost-sharing, the 2025 trade deal and the OPCON transfer. Show Korean perspectives from both left and right, Chinese and North Korean views, and US views, and say who funds the main sources.', 'South Korea and the US'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask('Compare how much control the US has over South Korea with how much control China has over North Korea, the USSR had over East Germany, and Britain had over India. Use the same criteria for each: command of the military, choice of government, economic dependence, ability to leave, and use of force against the ally.', 'Comparing alliances') }, '✦ Compare with other alliances'))));
  draw();
};


// ---------- generic bar chart ----------
const barChart = (rows, opts = {}) => { const mx = Math.max(...rows.map((r) => r[1])); const fmt = opts.fmt || ((v) => v.toLocaleString()); return h('div', null, rows.map(([l, v, note]) => h('div', { class: 'row', style: { margin: '4px 0', flexWrap: 'nowrap', alignItems: 'center' } }, h('span', { class: 'small', style: { width: opts.lw || '150px', flex: 'none' } }, l, note ? h('div', { class: 'tiny muted' }, note) : null), h('div', { style: { flex: 1, height: '18px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: Math.max(0.6, (v / mx) * 100) + '%', height: '100%', borderRadius: '6px', background: (opts.color || (() => '#2563EB'))(l) } })), h('b', { class: 'small', style: { width: opts.vw || '90px', textAlign: 'right' } }, fmt(v) + (opts.unit || ''))))); };
const chartCard = (c, opts = {}) => card(h3(c.title), barChart(c.rows, opts), c.note ? h('p', { class: 'tiny muted', style: { marginTop: '6px' } }, c.note) : null, Lab.source(c.src));
const hiUS = (l) => (/United States|^US$/.test(l) ? '#2563EB' : '#94A3B8');

const KCOL = { ally: '#2563EB', territory: '#7C3AED', gulf: '#CA8A04', other: '#DC2626' };
const KNAME = { ally: 'Treaty ally', territory: 'US territory', gulf: 'Gulf partner', other: 'Other host / special status' };

R.map = (el, go) => {
  const info = h('div', { class: 'hint' }, 'Hover or tap a circle for the numbers; circles with a case file open it.');
  const box = h('div');
  const legend = h('div', { class: 'row', style: { gap: '10px' } }, Object.entries(KNAME).map(([k, n]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '11px', height: '11px', borderRadius: '50%', background: KCOL[k], marginRight: '4px' } }), n)));
  el.append(card(h3('🗺️ Where US forces are stationed (permanently assigned, June 2025)'), h('p', { class: 'small' }, 'Circle area is proportional to the number of US military and Defense Department civilian personnel assigned there. Hawaii and Alaska are US states and are not shown.'), legend, box, info, h('p', { class: 'tiny muted' }, U.troopsNote), Lab.source('DMDC (Defense Manpower Data Center), June 30, 2025, via the Pentagon’s own counts')));
  (async () => {
    if (!window.d3 || !window.topojson) { box.append(h('p', { class: 'muted' }, 'Map library unavailable.')); return; }
    const topo = await fetch('data/world110.json').then((r) => r.json());
    const W = 960, H = 470; const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');
    const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' }); const path = d3.geoPath(proj);
    svg.append('path').datum({ type: 'Sphere' }).attr('d', path).attr('fill', 'rgba(56,189,248,.07)');
    svg.append('path').datum(topojson.feature(topo, topo.objects.land)).attr('d', path).attr('fill', 'rgba(120,120,140,.28)');
    const us = proj([-98, 39]); svg.append('text').attr('x', us[0]).attr('y', us[1]).attr('text-anchor', 'middle').attr('font-size', 12).attr('fill', '#64748B').text('United States');
    const rr = (v) => Math.max(3, Math.sqrt(v) * 0.19);
    U.troops.slice().sort((a, b) => b[1] - a[1]).forEach(([n, v, lon, lat, kind, cid]) => {
      const [x, y] = proj([lon, lat]);
      const c = svg.append('circle').attr('cx', x).attr('cy', y).attr('r', rr(v)).attr('fill', KCOL[kind]).attr('fill-opacity', 0.55).attr('stroke', KCOL[kind]).attr('stroke-width', 1.2).style('cursor', 'pointer');
      c.append('title').text(`${n}: ${v.toLocaleString()}`);
      const show = () => { info.innerHTML = ''; info.append(h('b', null, n + ': '), v.toLocaleString() + ' personnel · ' + KNAME[kind], cid ? h('button', { class: 'btn sm', style: { marginLeft: '8px' }, onclick: () => openCase(go, cid) }, 'Open the case file →') : null); };
      c.on('mouseenter', show).on('click', () => { show(); if (cid) openCase(go, cid); });
      if (v > 3000) svg.append('text').attr('x', x).attr('y', y - rr(v) - 3).attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700).attr('fill', 'currentColor').text(n);
    });
    box.append(svg.node());
  })();
  const top = U.troops.slice().sort((a, b) => b[1] - a[1]).slice(0, 14).map(([n, v, , , k]) => [n, v]);
  el.append(card(h3('The top hosts'), barChart(top, { color: (l) => KCOL[(U.troops.find((t) => t[0] === l) || [])[4]] || '#64748B', lw: '170px' }), Lab.source('DMDC, June 30, 2025')),
    card(h3('📷 What the bases look like'), h('div', { class: 'grid g3' }, U.gallery.map(([k, place]) => h('div', null, M.figure(k, { max: '170px', margin: '0' }), h('div', { class: 'tiny', style: { fontWeight: 700 } }, place))))),
    card(h3('How many bases? It depends who counts'), h('div', { class: 'grid g2' },
      h('div', { class: 'hint' }, h('b', null, '~128 major bases in ~49 countries: '), 'counts of significant installations with permanent US staff, used by most defense analysts.'),
      h('div', { class: 'hint' }, h('b', null, '~750 sites in ~80 countries: '), 'anthropologist David Vine’s count for the anti-base group World BEYOND War, including small facilities, radar sites and shared bases.')),
      h('p', { class: 'small' }, 'Both are honest counts of different things. Ask which definition a source uses before comparing numbers. For comparison, Russia has bases in roughly a dozen foreign countries (mostly former Soviet states and Syria), and China has one acknowledged foreign base (Djibouti, 2017).'), Lab.source('World BEYOND War / David Vine; CFR; news reports')));
};
let pendingCase = null;
const openCase = (go, cid) => { if (['japan', 'taiwan', 'nato', 'un'].includes(cid)) { pendingCase = cid; go('deep'); } else { pendingCase = cid; go('allies'); } };

R.data = (el) => {
  const C = U.charts;
  el.append(card(h3('📊 The record in numbers'), h('p', { class: 'small' }, 'Every chart below comes from a named dataset. Where a number was estimated or derived, the note says so. Click “Who are they?” under any chart to see who produced the data and what they gain.')),
    h('div', { class: 'grid g2', style: { alignItems: 'start' } },
      chartCard(C.troopsTime, { unit: '', lw: '70px', vw: '90px', color: () => '#2563EB' }),
      chartCard(C.interventions, { lw: '100px', color: () => '#DC2626' }),
      chartCard(C.interventionRegions, { unit: '%', lw: '190px', color: () => '#DC2626' }),
      card(h3('Cold War regime-change attempts, 1947–89'), barChart([['Covert', U.covert.covert], ['Overt (open war)', U.covert.overt], ['Covert, backing authoritarian forces', U.covert.authoritarian]], { lw: '190px', color: (l) => (l.startsWith('Covert,') ? '#7C3AED' : '#DC2626') }), h('p', { class: 'tiny muted' }, U.covert.note), Lab.source(U.covert.src)),
      chartCard(C.vetoes, { lw: '130px', color: hiUS }),
      chartCard(C.unBudget, { unit: '%', lw: '130px', color: hiUS }),
      chartCard(C.dollar, { unit: '%', lw: '80px', color: () => '#16A34A' }),
      chartCard(C.imfVotes, { unit: '%', lw: '120px', color: hiUS }),
      chartCard(C.sanctions, { lw: '60px', color: () => '#CA8A04' }),
      chartCard(C.milGdp, { unit: '%', lw: '60px', color: () => '#2563EB' }),
      chartCard(C.nato, { unit: '%', lw: '130px', color: hiUS }),
      chartCard(C.nonmembers, { lw: '60px', vw: '50px', color: () => '#2563EB' })),
    h('div', { class: 'card', style: { borderLeft: '4px solid #CA8A04' } }, h('b', { class: 'small' }, '🧠 Reading these charts honestly'), h('ul', { class: 'small' },
      h('li', null, 'Counts of “interventions” depend on definitions: the Tufts project counts threats and shows of force; the CRS list counts deployments; neither counts every covert operation.'),
      h('li', null, 'Absolute numbers and shares tell different stories: US military spending is at a record in dollars but low as a share of the economy compared with the Cold War.'),
      h('li', null, 'Vetoes are used by every permanent member to protect itself and its friends; the US and Russia are the heaviest users.'),
      h('li', null, 'Every one of these datasets is about US actions partly because US records are open. Comparable data on China or Russia is much thinner, which is a limit of the evidence, not proof they do less.')),
      tutor('Using the data on US military interventions, covert regime changes, UN vetoes, IMF voting, sanctions and the dollar’s reserve share, walk me through what each number does and does not show, and how the same measures look for China and Russia.', 'US power in numbers')));
};

R.deep = (el) => {
  const keys = ['japan', 'taiwan', 'nato', 'un']; let cur = pendingCase && keys.includes(pendingCase) ? pendingCase : 'japan'; pendingCase = null;
  const chips = h('div', { class: 'row', style: { gap: '6px' } }); const body = h('div', { class: 'stack' });
  const show = (k) => { cur = k; chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); body.innerHTML = ''; const D = U.deep[k]; let i = 0;
    const stepBox = h('div'); const nav = h('div', { class: 'row', style: { gap: '4px' } });
    const draw = () => { const [y, t, what, us, loc, conf, src, img] = D.steps[i]; nav.querySelectorAll('.chip').forEach((c, j) => c.classList.toggle('on', j === i)); stepBox.innerHTML = '';
      stepBox.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${i + 1} of ${D.steps.length} · ${y}`), Lab.conf(conf)), h('h2', { style: { margin: '4px 0 8px' } }, t), img ? M.figure(img, { max: '300px' }) : null, h('p', { class: 'small' }, what),
        h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #2563EB' } }, h('b', { class: 'small' }, '🇺🇸 The American role'), h('p', { class: 'small' }, us)), h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #DC2626' } }, h('b', { class: 'small' }, `${D.e} Their choices and views`), h('p', { class: 'small' }, loc))),
        Lab.source(src), h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Earlier'), h('button', { class: 'btn sm', disabled: i === D.steps.length - 1, onclick: () => { i++; draw(); } }, 'Later →')))); };
    D.steps.forEach(([y], j) => nav.append(h('span', { class: 'chip', style: { fontSize: '11px' }, onclick: () => { i = j; draw(); } }, y)));
    body.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, D.e), h('div', null, h('h2', { style: { margin: 0 } }, D.n), h('div', { class: 'small muted' }, D.sub))), D.img ? M.figure(D.img, { max: '280px', margin: '10px 0' }) : null,
      h('div', { class: 'grid g2' }, D.nums.map(([l, v]) => h('div', { class: 'card', style: { boxShadow: 'none' } }, h('div', { class: 'tiny muted' }, l), h('b', null, v)))), nav), stepBox,
      h('div', { class: 'card', style: { borderLeft: '4px solid #64748B' } }, h('b', { class: 'small' }, '⚖️ The verdict, as fairly as I can put it'), h('p', { class: 'small' }, D.verdict),
        tutor(`Give me an in-depth, balanced history of ${D.n} and the United States, with primary sources, the strongest critics and defenders on each side (and who funds them), and how people of different political views there see the relationship today.`, D.n)));
    draw(); };
  keys.forEach((k) => chips.append(h('span', { class: 'chip', 'data-k': k, onclick: () => show(k) }, U.deep[k].e + ' ' + U.deep[k].n)));
  el.append(card(h3('🔍 Deep dives'), h('p', { class: 'small' }, 'Step-by-step histories of the most important relationships and institutions, each with the American role and local choices shown side by side.'), chips), body);
  show(cur);
};

R.allies = (el) => {
  const all = U.cases.concat(U.allies.filter((a) => a[0] === 'ukraine').map(([id, e, n, start, tools, agency, flash, conf, src]) => [id, e, n, null, [], start, tools, agency, flash, conf, src]));
  const body = h('div'); const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const show = (id) => { const a = all.find((x) => x[0] === id) || all[0]; chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.id === a[0])); const [, e, n, img, nums, story, tools, agency, flash, conf, src] = a; body.innerHTML = '';
    body.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '28px' } }, e), h('h2', { style: { margin: 0 } }, n), Lab.conf(conf)), img ? M.figure(img, { max: '300px', margin: '10px 0' }) : null,
      nums.length ? h('div', { class: 'grid g3' }, nums.map(([l, v]) => h('div', { class: 'card', style: { boxShadow: 'none' } }, h('div', { class: 'tiny muted' }, l), h('b', { class: 'small' }, v)))) : null,
      h('p', { class: 'small' }, h('b', null, 'The story: '), story),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } },
        h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #2563EB' } }, h('b', { class: 'small' }, '🧰 US leverage'), h('p', { class: 'small' }, tools)),
        h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #16A34A' } }, h('b', { class: 'small' }, '🗳️ Their own choices'), h('p', { class: 'small' }, agency))),
      h('div', { class: 'card', style: { boxShadow: 'none', borderLeft: '4px solid #DC2626', marginTop: '8px' } }, h('b', { class: 'small' }, '🔥 Flashpoints and now'), h('p', { class: 'small' }, flash)),
      Lab.source(src), tutor(`Give me an in-depth, balanced history of US relations with ${n}: how it began, the tools of US influence, local choices and resistance, the major controversies, the latest developments, and how people there of different political views see it. Say who funds the main sources.`, n))); };
  all.forEach((a) => chips.append(h('span', { class: 'chip', 'data-id': a[0], onclick: () => show(a[0]) }, a[1] + ' ' + a[2])));
  el.append(card(h3('🌍 Case files: allies, clients, territories and battlegrounds'), h('p', { class: 'small' }, 'Fifteen more relationships, from close allies to territories with no vote. Japan, Taiwan, NATO and the UN have their own deep dives; South Korea has its own section.'), chips), body);
  const start = pendingCase && all.some((x) => x[0] === pendingCase) ? pendingCase : all[0][0]; pendingCase = null; show(start);
};

R.saidno = (el) => {
  el.append(card(h3('✋ When allies said no'), h('p', { class: 'small' }, 'If the US were a classic empire, allies could not refuse it. Here are the times they did, and what happened.'),
    h('div', null, U.saidNo.map(([y, who, what]) => h('div', { style: { display: 'flex', gap: '10px', padding: '7px 0', borderBottom: '1px solid var(--line)' } }, h('b', { class: 'small', style: { width: '48px', flex: 'none' } }, y), h('div', { class: 'small' }, h('b', null, who + ': '), what))))),
    h('div', { class: 'card', style: { borderLeft: '4px solid #CA8A04' } }, h('b', { class: 'small' }, 'The honest comparison'), h('p', { class: 'small' }, U.saidNoNote)),
    h('div', { class: 'grid g2' }, M.figure('us:subic', { max: '220px' }), M.figure('us:anpo', { max: '220px' })));
};

R.tools = (el) => {
  el.append(card(h3('🧰 The tools of American leverage'), h('p', { class: 'small' }, 'Old empires ruled colonies directly. The US mostly uses these tools instead. Each one also shows how allies and rivals push back, because leverage is never total.')),
    h('div', { class: 'grid g2', style: { alignItems: 'start' } }, U.tools.map(([e, n, how, ex, push, conf]) => card(h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, h('span', { style: { fontSize: '22px' } }, e), h('b', { style: { flex: 1 } }, n), Lab.conf(conf)), h('p', { class: 'small' }, how), h('p', { class: 'small' }, h('b', null, 'Examples: '), ex), h('p', { class: 'small' }, h('b', null, 'How others push back: '), push)))),
    card(tutor('Explain how each tool of US leverage (bases, weapons dependence, the nuclear umbrella, the dollar and sanctions, technology controls, IMF votes, tariffs, intelligence, soft power) works in practice, with recent examples, and compare each with the tools China and Russia use.', 'Tools of leverage')));
};

R.empire = (el) => {
  const debate = h('div', { class: 'stack' }, U.debate.map(([camp, view, who, funding, strong, weak], k) => card(h('b', null, camp), h('p', { class: 'small' }, view), h('p', { class: 'small' }, h('b', null, 'Key voices: '), who), h('p', { class: 'small' }, h('b', null, '💰 Who they are: '), funding),
    h('div', { class: 'grid g2' }, h('div', { class: 'hint' }, h('b', null, 'Strongest point: '), strong), h('div', { class: 'hint' }, h('b', null, 'Weakest point: '), weak)))));
  const heads = ['', 'British Empire (c. 1913)', 'Soviet bloc (1945–89)', 'US network (today)', 'China (today)'];
  const table = h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', width: '100%', minWidth: '720px' } },
    h('thead', null, h('tr', null, heads.map((x, k) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)', background: k === 3 ? '#2563EB12' : 'transparent' } }, x)))),
    h('tbody', null, U.compare.map((r) => h('tr', null, r.map((c, k) => h(k ? 'td' : 'th', { style: { textAlign: 'left', verticalAlign: 'top', padding: '6px', borderBottom: '1px solid var(--line)', background: k === 3 ? '#2563EB12' : 'transparent' } }, c)))))));
  // make-your-own-call
  const claims = ['The US is an empire.', 'US alliances mostly serve the allies as well as the US.', 'The US should keep troops in South Korea.', 'The defense industry has too much influence over US policy.', 'US surveillance law adequately protects Americans.', 'The world would be safer with less US military power.'];
  const ans = {}; const out = h('div');
  const callBox = h('div', null, claims.map((c) => { const row = h('div', { class: 'row', style: { padding: '5px 0', borderBottom: '1px solid var(--line)', flexWrap: 'nowrap' } }, h('span', { class: 'small', style: { flex: 1 } }, c)); ['Agree', 'Unsure', 'Disagree'].forEach((o) => row.append(h('button', { class: 'btn sm', onclick: (e) => { ans[c] = o; row.querySelectorAll('button').forEach((b) => b.classList.toggle('primary', b === e.target)); } }, o))); return row; }));
  el.append(card(h3('⚖️ Is the United States an empire?'), h('p', { class: 'small' }, 'Serious people disagree, partly over facts and partly over the definition of “empire.” Here are the main camps, who they are, and the best and worst of each argument.')), debate,
    card(h3('The same questions for every great power'), table, Lab.source('Historians; SIPRI; CRS; news reports')),
    card(h3('🧠 Make your own call'), h('p', { class: 'small' }, 'Mark where you stand, then ask the tutor to argue against you with the strongest evidence from the other side.'), callBox,
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm primary', onclick: () => { const txt = claims.map((c) => `${c} — ${ans[c] || 'no answer'}`).join('\n'); Lab.ask(`Here are my current views on American power:\n${txt}\nFor each one, give me the strongest evidence and arguments against my position, from credible sources on the other side, and tell me who funds those sources. Then tell me which of my views are best supported by evidence and which rest mostly on values.`, 'Challenge my views'); } }, '✦ Challenge my views'), out)));
};

M.render.uspower = (el) => {
  const panel = h('div', { class: 'stack' });
  const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const go = (k) => { nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; R[k](panel, go); try { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* ignore */ } };
  SECTIONS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, onclick: () => go(k) }, n)));
  el.append(h('div', { class: 'card' }, nav), panel);
  nav.querySelector('.chip').classList.add('on'); R.start(panel, go);
};
