// "How power works": interactive diagrams of ten governments, a freedom comparison, and the citizen's toolkit.
const h = Lab.h; const M = Lab.MODERN; const G = Lab.GOV;
const KIND = { leader: ['Leader', '#B91C1C'], party: ['Ruling party', '#9F1239'], legislature: ['Legislature', '#1D4ED8'], executive: ['Executive', '#0F766E'], court: ['Courts', '#7C3AED'], security: ['Security & military', '#374151'], local: ['Local & states', '#B45309'], people: ['Citizens', '#15803D'], informal: ['Parties, money & media', '#64748B'] };
const STATUS = (s) => /^Allowed/.test(s) ? '#16A34A' : /^(Tolerated|Partly)/.test(s) ? '#CA8A04' : /^(Restricted|Controlled)/.test(s) ? '#EA580C' : '#DC2626';
const card = (...k) => h('div', { class: 'card' }, ...k);

function diagram(S, onPick) {
  const wrap = h('div', { style: { position: 'relative', padding: '6px 0' } });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible');
  const tiers = Math.max(...S.bodies.map((b) => b[1])) + 1; const box = {};
  wrap.append(svg);
  for (let t = 0; t < tiers; t++) {
    const row = h('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '0 0 34px', position: 'relative', zIndex: 1 } });
    S.bodies.filter((b) => b[1] === t).forEach((b) => { const [id, , n, kind] = b; const [kn, kc] = KIND[kind] || ['', '#64748B'];
      const el = h('button', { class: 'card', style: { padding: '10px 12px', minWidth: '150px', maxWidth: '230px', textAlign: 'left', cursor: 'pointer', borderTop: `4px solid ${kc}`, boxShadow: 'none' }, onclick: () => onPick(b) },
        h('div', { class: 'tiny', style: { color: kc, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' } }, kn), h('b', { class: 'small', style: { display: 'block', lineHeight: 1.3 } }, n));
      box[id] = el; row.append(el); });
    wrap.append(row);
  }
  const draw = () => { svg.innerHTML = ''; const W = wrap.getBoundingClientRect();
    svg.innerHTML = '<defs><marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#94A3B8"/></marker></defs>';
    S.links.forEach(([a, b, lab]) => { const A = box[a], B = box[b]; if (!A || !B) return; const ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
      const down = ra.top <= rb.top; const x1 = ra.left + ra.width / 2 - W.left, y1 = (down ? ra.bottom : ra.top) - W.top, x2 = rb.left + rb.width / 2 - W.left, y2 = (down ? rb.top : rb.bottom) - W.top;
      const same = Math.abs(ra.top - rb.top) < 5; const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = same ? `M${ra.right - W.left},${ra.top + ra.height / 2 - W.top} L${rb.left - W.left},${rb.top + rb.height / 2 - W.top}` : `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#94A3B8'); p.setAttribute('stroke-width', '1.6'); p.setAttribute('marker-end', 'url(#arw)'); svg.append(p);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); t.setAttribute('x', (x1 + x2) / 2 + 4); t.setAttribute('y', (y1 + y2) / 2); t.setAttribute('font-size', '11'); t.setAttribute('fill', '#64748B'); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke', 'var(--card, #fff)'); t.setAttribute('stroke-width', '3'); t.textContent = lab; svg.append(t); }); };
  requestAnimationFrame(() => requestAnimationFrame(draw)); try { new ResizeObserver(draw).observe(wrap); } catch (e) {}
  return wrap;
}

function system(el, key, go) {
  const S = G.S[key]; const detail = h('div');
  const pick = (b, quiet) => { const [, , n, kind, paper, practice, chosen, img] = b; const [kn, kc] = KIND[kind] || ['', '#64748B'];
    detail.replaceChildren(card(h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': kc } }, kn), h('h3', { style: { margin: 0 } }, n)),
      h('div', { class: 'grid g2', style: { marginTop: '8px', alignItems: 'start' } }, h('div', null,
        h('p', { class: 'small' }, h('b', null, '📜 On paper: '), paper), h('p', { class: 'small' }, h('b', null, '🔦 In practice: '), practice), chosen ? h('p', { class: 'small' }, h('b', null, '🗳️ How chosen: '), chosen) : null,
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Explain in depth how the ${n} works in ${S.n}: its powers on paper and in practice, how members are chosen, real examples, and what supporters and critics say.`, n) }, '✦ Go deeper with the tutor')),
        img ? Lab.cfig(img, { max: '240px' }) : null))); if (!quiet) detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
  el.append(card(h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null,
      h('div', { class: 'tiny', style: { letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, color: S.c } }, S.type + ' · ' + S.years),
      h('h2', { style: { margin: '4px 0 8px' } }, S.flag + ' ' + S.n), h('p', null, S.sum)), Lab.cfig(S.img, { max: '230px' }))),
    card(h('h3', { style: { marginTop: 0 } }, 'The system as a diagram'), h('p', { class: 'small muted' }, 'Arrows show who chooses or controls whom. Tap any box.'), diagram(S, pick),
      h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap' } }, Object.entries(KIND).filter(([k]) => S.bodies.some((b) => b[3] === k)).map(([, [n, c]]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', background: c, borderRadius: '2px', marginRight: '4px' } }), n)))),
    detail,
    card(h('h3', { style: { marginTop: 0 } }, 'How citizens can make their voices heard'), h('div', { class: 'stack', style: { gap: '6px' } }, S.voice.map(([c, st, d]) => h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '10px', alignItems: 'flex-start' } },
      h('span', { class: 'tag', style: { '--c': STATUS(st), minWidth: '120px', textAlign: 'center', flex: 'none' } }, st), h('div', null, h('b', { class: 'small' }, c), h('div', { class: 'small muted' }, d))))),
      h('div', { style: { marginTop: '8px' } }, Lab.source(S.src))));
  pick(S.bodies[0], true);
}

function compare(el, go) {
  const cols = [['Vote', /^Vote/], ['Free press', /^Free press/], ['Protest', /^Protest/], ['Unions and strikes', /^Unions/]];
  el.append(card(h('h2', { style: { marginTop: 0 } }, 'Freedom at a glance'), h('p', { class: 'small' }, 'The same four questions asked of every system. Tap a country for the full picture.'),
    h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', width: '100%', minWidth: '640px' } },
      h('tr', null, h('th', { style: { textAlign: 'left', padding: '6px' } }, 'System'), ...cols.map(([n]) => h('th', { style: { textAlign: 'left', padding: '6px' } }, n))),
      G.order.map((k) => { const S = G.S[k]; return h('tr', { style: { borderTop: '1px solid var(--line)' } }, h('td', { style: { padding: '6px' } }, h('a', { href: '#history-modern-govern-' + k, onclick: (e) => { e.preventDefault(); go(k); } }, S.flag + ' ' + S.n)),
        ...cols.map(([, re]) => { const v = S.voice.find(([c]) => re.test(c)); return h('td', { style: { padding: '6px' } }, v ? h('span', { class: 'tag', title: v[2], style: { '--c': STATUS(v[1]) } }, v[1]) : '—'); })); }))),
    h('p', { class: 'tiny muted' }, 'Green: allowed. Amber: tolerated or partly free. Orange: restricted or state-controlled. Red: banned. Hover a label for the detail.')));
}

function toolkit(el) {
  el.append(card(h('h2', { style: { marginTop: 0 } }, 'The citizen’s toolkit: how people make change'), h('p', null, 'Voting is only one tool. Throughout history people have won rights with petitions, lawsuits, unions, strikes, boycotts, mass nonviolent protest, community organizing and mutual aid. Each has a record of wins, costs and limits, and many are banned in dictatorships, which is itself a sign of their power.')),
    ...G.channels.map(([n, img, what, ex, lim]) => card(h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', null, h('h3', { style: { marginTop: 0 } }, n), h('p', { class: 'small' }, what),
      h('p', { class: 'small' }, h('b', null, '✅ Real example: '), ex), h('p', { class: 'small' }, h('b', null, '⚠️ Limits: '), lim),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`How can an ordinary person use “${n}” to make change in their community today? Give practical first steps, real historical examples from several countries, and the risks.`, n) }, '✦ How could I use this?')),
      img ? Lab.cfig(img, { max: '220px' }) : h('div')))));
}

const TABS = [['overview', 'Overview'], ...G.order.map((k) => [k, G.S[k].flag + ' ' + G.S[k].n.replace(/ \(.*\)/, '')]), ['compare', 'Freedom compared'], ['toolkit', 'Citizen’s toolkit']];
if (!M.SUBS.some(([k]) => k === 'govern')) M.SUBS.push(['govern', 'How power works: governments & citizens']);
if (M.GROUPS) { const g = M.GROUPS.find((x) => x[1] === 'Regions & power'); if (g && !g[2].includes('govern')) g[2].unshift('govern'); }
M.render.govern = (el, arg) => {
  const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '2px' } }); const panel = h('div', { class: 'stack' });
  const go = (k) => { nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; history.replaceState(null, '', '#history-modern-govern' + (k === 'overview' ? '' : '-' + k));
    if (G.S[k]) system(panel, k, go); else if (k === 'compare') compare(panel, go); else if (k === 'toolkit') toolkit(panel);
    else { panel.append(card(h('h2', { style: { marginTop: 0 } }, 'How power works'), h('p', null, G.intro)), h('div', { class: 'grid g3' }, G.order.map((k2) => { const S = G.S[k2];
      return h('button', { class: 'card', style: { textAlign: 'left', cursor: 'pointer', borderTop: `4px solid ${S.c}`, padding: 0, overflow: 'hidden' }, onclick: () => go(k2) }, Lab.cfig(S.img, { max: '140px', margin: '0' }),
        h('div', { style: { padding: '10px 14px' } }, h('b', null, S.flag + ' ' + S.n), h('div', { class: 'tiny muted' }, S.type))); }),
      ...[['compare', 'Freedom compared', 'Vote, press, protest and unions in every system, side by side.'], ['toolkit', 'Citizen’s toolkit', 'Eleven ways people have made change, with real examples and limits.']].map(([k2, n, d]) => h('button', { class: 'card', style: { textAlign: 'left', cursor: 'pointer', borderTop: '4px solid #15803D' }, onclick: () => go(k2) }, h('b', null, n), h('div', { class: 'small muted' }, d))))); } };
  TABS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, style: { flex: 'none', whiteSpace: 'nowrap' }, onclick: () => go(k) }, n)));
  el.append(h('div', { class: 'card', style: { position: 'sticky', top: '58px', zIndex: 6, padding: '8px 10px' } }, nav), panel);
  const a = (arg || '').split('-')[0]; go(TABS.some(([k]) => k === a) ? a : 'overview');
};
Lab.routes.govern = () => { location.replace('#history-modern-govern'); };
