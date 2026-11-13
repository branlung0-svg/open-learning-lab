// Modern world module, part 11: Regions & power. Africa and the Americas deep dives, and "Who really rules?"
// (North Korea, Vietnam and a same-questions comparison). Data: africa-data.js, americas-data.js, power-data.js.
const h = Lab.h;
const M = Lab.MODERN;
['africa', 'americas', 'power'].forEach((k) => { if (!M.SUBS.some(([x]) => x === k)) M.SUBS.push([k, { africa: 'Africa in depth', americas: 'The Americas in depth', power: 'Who really rules? Power structures' }[k]]); });
// Reorganize: a "Regions & power" group right after History; move regional tabs into it.
const REG = ['africa', 'americas', 'power', 'uspower', 'koreawar'];
M.GROUPS.forEach((g) => { g[2] = g[2].filter((k) => !REG.includes(k)); });
const hi = M.GROUPS.findIndex((g) => g[1] === 'History');
M.GROUPS.splice(hi >= 0 ? hi + 1 : 1, 0, ['🌍', 'Regions & power', REG]);

const card = (...kids) => h('div', { class: 'card' }, ...kids);
const link = ([label, url]) => h('a', { href: url, target: '_blank', rel: 'noopener', class: 'small', style: { display: 'block', margin: '3px 0' } }, '📄 ' + label + ' ↗');
const vcol = (v) => ({ True: '#15803D', False: '#DC2626', Misleading: '#EA580C', Unproven: '#CA8A04', Contested: '#7C3AED' }[v] || '#475569');
const sectionNav = (SECTIONS, R, el) => {
  const panel = h('div', { class: 'stack' }); const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const go = (k) => { nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; R[k](panel, go); };
  SECTIONS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, onclick: () => go(k) }, n)));
  el.append(card(nav), panel); go(SECTIONS[0][0]);
};
const barChart = ([title, unit, rows, src, note]) => { const mx = Math.max(...rows.map((r) => r[1])); return card(h('h3', { style: { marginTop: 0 } }, title), rows.map(([l, v]) => h('div', { class: 'row', style: { margin: '4px 0', flexWrap: 'nowrap', gap: '8px' } }, h('span', { class: 'small', style: { width: '180px', flex: 'none' } }, l), h('div', { style: { flex: 1, height: '16px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: (v / mx) * 100 + '%', height: '100%', borderRadius: '6px', background: /\*/.test(l) ? '#A78BFA' : '#2563EB' } })), h('b', { class: 'small', style: { width: '64px', textAlign: 'right' } }, v.toLocaleString('en-US') + (unit === 'm' ? 'm' : unit === 'y' ? ' yrs' : '')))), h('p', { class: 'small', style: { marginBottom: '2px' } }, note), Lab.source('Source: ' + src)); };

// ---------- generic region deep dive ----------
const region = (A, key, imgs) => (el) => {
  const R = {};
  R.start = (p, go) => { p.append(card(h('h2', { style: { marginTop: 0 } }, A.title), A.intro.map((t) => h('p', { class: 'small' }, t)), h('div', { class: 'grid g3' }, A.facts.map(([k, v]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', textAlign: 'center' } }, h('div', { style: { fontSize: '20px', fontWeight: 800 } }, v), h('div', { class: 'tiny muted' }, k)))),
    h('div', { class: 'grid g3', style: { marginTop: '8px' } }, imgs.slice(0, 3).map((k) => M.figure(k, { max: '260px' }))),
    h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, [['story', '📜 The story, step by step'], ['sides', '🗣️ Every side’s view'], ['data', '📊 Data'], ['claims', '🔎 Test the claims'], ['archives', '🎞️ Evidence & archives']].map(([k, n]) => h('button', { class: 'btn sm', onclick: () => go(k) }, n))))); };
  R.story = (p) => {
    let per = 'all', i = 0; const box = h('div'); const chips = h('div', { class: 'row', style: { gap: '6px' } });
    const L = () => A.timeline.filter((s) => per === 'all' || s[0] === per);
    const colors = ['#94A3B8', '#2563EB', '#EA580C', '#7C3AED', '#DC2626', '#15803D'];
    const strip = h('div', { style: { display: 'flex', gap: '2px', margin: '8px 0', overflowX: 'auto' } }, A.timeline.map((s, j) => h('div', { title: s[1] + ': ' + s[2], onclick: () => { per = 'all'; i = j; draw(); }, style: { flex: '1 0 16px', height: '22px', borderRadius: '4px', cursor: 'pointer', background: colors[A.periods.findIndex(([k]) => k === s[0]) % colors.length] } })));
    const draw = () => { const S = L(); i = Math.max(0, Math.min(i, S.length - 1)); const [, y, t, what, cond, told, conf, src, links, img] = S[i]; box.innerHTML = '';
      box.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${i + 1} of ${S.length} · ${y}`), Lab.conf(String(conf).split(' ')[0])), h('h2', { style: { margin: '4px 0 8px' } }, t), img ? M.figure(img, { max: '380px' }) : null, h('p', { class: 'small' }, what),
        h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', { class: 'small' }, '🧍 Conditions and causes: '), h('span', { class: 'small' }, cond)),
        h('div', { class: 'card', style: { boxShadow: 'none', background: 'rgba(234,88,12,.13)', marginTop: '6px' } }, h('b', { class: 'small' }, '🗣️ How it is told differently: '), h('span', { class: 'small' }, told)),
        Lab.source('Source: ' + src), (links || []).map(link),
        h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Earlier'), h('button', { class: 'btn sm primary', disabled: i === S.length - 1, onclick: () => { i++; draw(); } }, 'Later →'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`${t} (${y}): explain this from the perspectives of the people who lived it, of outside powers, and of historians from the region and from outside it. Which primary sources and data support each view, and who funds them?`, t) }, '✦ Every side’s view'))));
    };
    [['all', 'All'], ...A.periods].forEach(([k, n]) => chips.append(h('span', { class: 'chip' + (k === 'all' ? ' on' : ''), onclick: (e) => { per = k; i = 0; chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('on')); e.target.classList.add('on'); draw(); } }, n)));
    p.append(card(h('h3', { style: { marginTop: 0 } }, 'The story, step by step'), h('p', { class: 'small muted' }, 'Each step shows what happened, the conditions people faced, and how different sides tell it. Click a block or filter by era.'), strip, chips), box); draw();
  };
  R.sides = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Every side’s view'), h('p', { class: 'small muted' }, 'Each school of thought sees something real and misses something. Read across them.')), h('div', { class: 'grid g2', style: { alignItems: 'start' } }, A.sides.map(([who, view, miss]) => card(h('h3', { style: { margin: '0 0 4px' } }, who), h('p', { class: 'small' }, view), h('p', { class: 'small', style: { color: '#B45309', margin: 0 } }, h('b', null, 'Leaves out: '), miss)))));
  R.data = (p) => A.charts.forEach((c) => p.append(barChart(c)));
  R.claims = (p) => { let i = 0, sc = 0; const box = h('div'); const opts = ['True', 'False', 'Misleading', 'Contested'];
    const ask = () => { box.innerHTML = ''; if (i >= A.claims.length) { box.append(card(h('h3', null, `You matched ${sc} of ${A.claims.length}`), h('button', { class: 'btn sm', onclick: () => { i = 0; sc = 0; ask(); } }, 'Again'))); return; } const [c, v, conf, why] = A.claims[i]; const res = h('div'); const norm = v === 'Unproven' ? 'Contested' : v;
      box.append(card(h('div', { class: 'tiny muted' }, `Claim ${i + 1} of ${A.claims.length}`), h('h3', null, '“' + c + '”'), h('div', { class: 'row', style: { gap: '6px' } }, opts.map((o) => h('button', { class: 'btn sm', onclick: () => { if (res.childNodes.length) return; if (o === norm) sc++; res.append(h('div', { style: { marginTop: '8px' } }, h('b', { style: { color: vcol(v) } }, (o === norm ? '✓ ' : '✗ ') + 'Verdict: ' + v + ' '), Lab.conf(conf), h('p', { class: 'small' }, why), h('button', { class: 'btn sm primary', onclick: () => { i++; ask(); } }, 'Next →'))); } }, o))), res)); };
    p.append(card(h('h3', { style: { marginTop: 0 } }, 'Test the claims'), h('p', { class: 'small muted' }, 'Common claims from every side. Decide, then see the evidence.')), box); ask(); };
  R.archives = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Evidence and archives'), A.archives.map(([n, u, d]) => h('div', { style: { margin: '8px 0' } }, link([n, u]), h('div', { class: 'tiny muted' }, d)))), card(h('h3', { style: { marginTop: 0 } }, 'Photographs'), h('div', { class: 'grid g2' }, imgs.map((k) => M.figure(k, { max: '320px' })))),
    card(h('h3', { style: { marginTop: 0 } }, 'Connected cases'), h('div', { class: 'row', style: { gap: '6px' } }, (Lab.CONNECT || []).filter((c) => c.lab.some(([, hs]) => hs === 'history-modern-' + key)).map((c) => h('a', { class: 'btn sm', href: '#connect-' + c.id, style: { textDecoration: 'none' } }, c.e + ' ' + c.t)))));
  sectionNav([['start', '🧭 Overview'], ['story', '📜 Step by step'], ['sides', '🗣️ Every side’s view'], ['data', '📊 Data'], ['claims', '🔎 Test the claims'], ['archives', '🎞️ Evidence & photos']], R, el);
};
M.render.africa = region(Lab.AFRICA, 'africa', ['af:lucy', 'af:meroe', 'af:timbuktu', 'af:aksum', 'af:zimbabwe', 'af:goree', 'af:ghana57', 'af:nairobi']);
M.render.americas = region(Lab.AMERICAS, 'americas', ['am:tikal', 'am:machu', 'am:cahokia', 'am:potosi', 'am:haiti', 'am:mexrev']);

// ---------- Who really rules? ----------
M.render.power = (el) => {
  const P = Lab.POWER; const R = {};
  R.howto = (p) => p.append(card(h('h2', { style: { marginTop: 0 } }, 'Who really rules? How to read any power structure'), h('p', { class: 'small' }, 'Constitutions describe how power is supposed to work. To see how it actually works, ask the same six questions of every country, including your own.'),
    h('div', { class: 'grid g3' }, P.howto.map(([t, d]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, t), h('div', { class: 'small muted' }, d)))),
    h('div', { class: 'row', style: { gap: '6px', marginTop: '10px' } }, h('a', { class: 'btn sm', href: '#d-politics', style: { textDecoration: 'none' } }, '🏛️ Politics, the discipline'), h('a', { class: 'btn sm', href: '#history-modern-uspower', style: { textDecoration: 'none' } }, '🇺🇸 Same questions for the US'), h('a', { class: 'btn sm', href: '#connect-lights', style: { textDecoration: 'none' } }, '🛰️ Checking a dictator’s numbers'))));
  const country = (key) => (p) => { const c = P.countries[key];
    p.append(card(h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, c.flag), h('h2', { style: { margin: 0 } }, c.n), h('span', { class: 'sp' }), Lab.conf(c.conf)), M.figure(c.img, { max: '360px' }), h('p', null, c.sum)),
      card(h('h3', { style: { marginTop: 0 } }, 'Parties'), h('div', { class: 'grid g3' }, c.parties.map(([n, d, role]) => h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, h('b', null, n), h('div', { class: 'tag', style: { '--c': role === 'Rules' || role === 'Rules alone' ? '#DC2626' : '#64748B', margin: '4px 0' } }, role), h('div', { class: 'small' }, d)))), h('p', { class: 'small', style: { marginBottom: 0 } }, h('b', null, 'Read carefully: '), c.partyNote)),
      card(h('h3', { style: { marginTop: 0 } }, 'How power actually flows'), h('div', { class: 'stack', style: { gap: '6px' } }, c.layers.map(([e, t, d], i) => h('div', { style: { display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px', borderRadius: '10px', background: i % 2 ? 'var(--card2)' : 'transparent' } }, h('span', { style: { fontSize: '22px' } }, e), h('div', null, h('b', null, t), h('div', { class: 'small' }, d)))))),
      card(h('h3', { style: { marginTop: 0 } }, '💰 Money'), h('p', { class: 'small' }, c.money), h('h3', null, '🚪 How can power change hands?'), h('p', { class: 'small' }, c.change)),
      card(h('h3', { style: { marginTop: 0 } }, 'Recent changes'), c.recent.map(([d, t, conf]) => h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '8px', margin: '6px 0', alignItems: 'flex-start' } }, h('b', { class: 'small', style: { width: '70px', flex: 'none' } }, d), h('span', { class: 'small', style: { flex: 1 } }, t), Lab.conf(conf)))),
      card(h('h3', { style: { marginTop: 0 } }, 'How each side tells it'), h('div', { class: 'grid g2' }, c.tellings.map(([w, v, m]) => h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, h('b', null, w), h('p', { class: 'small', style: { margin: '4px 0' } }, v), h('p', { class: 'tiny', style: { color: '#B45309', margin: 0 } }, h('b', null, 'Leaves out: '), m)))), Lab.source('Sources: ' + c.src),
        h('button', { class: 'btn sm primary', style: { marginTop: '8px' }, onclick: () => Lab.ask(`Map the real power structure of ${c.n} today: who appoints whom, who controls the army, police, money and media, and how leaders can be replaced. Cite sources from the government itself, from critics and from independent researchers, and say who funds each.`, c.n) }, '✦ Go deeper with the tutor'))); };
  R.dprk = country('dprk'); R.vietnam = country('vietnam');
  R.compare = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Same questions, seven countries'), h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', minWidth: '900px' } }, h('tr', null, h('th', { style: { textAlign: 'left', padding: '6px' } }, 'Question'), ...P.compareCols.map((c) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, c))), P.compare.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', verticalAlign: 'top', fontWeight: j ? 400 : 600, background: /^(No|Never)/.test(c) ? 'rgba(220,38,38,.13)' : /^Yes|Many times/.test(c) ? 'rgba(22,163,74,.13)' : '' } }, c)))))),
    h('p', { class: 'small', style: { marginTop: '8px' } }, P.compareNote)));
  sectionNav([['howto', '🧭 How to read power'], ['dprk', '🇰🇵 North Korea'], ['vietnam', '🇻🇳 Vietnam'], ['compare', '⚖️ Compare 7 countries']], R, el);
};
