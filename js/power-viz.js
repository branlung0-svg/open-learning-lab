// Pictures of power structures, drawn from the data in js/power.js and js/power-more.js:
//  * Lab.powerRoleTree: one leader, each of their roles, and what each role controls (like a newspaper explainer chart)
//  * Lab.powerWhoMap: who runs what, as rings: the core, the top committee in official rank order, then the
//    officials below with their portfolios (like the Fairbank Center's "key people" infographics)
//  * Lab.powerPanel(iso): both, plus a compact ladder, for the Government & power tab of a country page
(function () {
  const h = Lab.h; const NS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs, ...kids) => { const e = document.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => v != null && e.setAttribute(k, v)); kids.flat().forEach((k) => k != null && e.append(typeof k === 'string' ? document.createTextNode(k) : k)); return e; };
  const wrap = (t, n) => { const out = []; let cur = ''; String(t || '').split(/\s+/).forEach((x) => { if ((cur + ' ' + x).trim().length > n && cur) { out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) out.push(cur); return out; };
  const card = (...k) => h('div', { class: 'card' }, ...k);
  const clip = (lines, n) => (lines.length > n ? [...lines.slice(0, n - 1), lines[n - 1] + '…'] : lines);

  Lab.powerRoleTree = (R, col) => h('div', { class: 'pw-tree', style: { '--c': col || '#B91C1C' } },
    h('div', { class: 'pw-tree-top' }, h('div', { class: 'tiny', style: { textTransform: 'uppercase', letterSpacing: '.08em', opacity: 0.85 } }, R.asof), h('b', null, R.top)),
    h('div', { class: 'pw-tree-bar' }),
    h('div', { class: 'pw-tree-cols' + (R.roles.length > 3 ? ' n4' : ''), style: { gridTemplateColumns: `repeat(${Math.min(R.roles.length, 4)}, minmax(0, 1fr))` } },
      R.roles.map(([n, d]) => h('div', { class: 'pw-tree-col' }, h('div', { class: 'pw-tree-role' }, n), h('div', { class: 'pw-tree-arrow', 'aria-hidden': 'true' }, '↓'), h('div', { class: 'pw-tree-ctl' }, d || '')))));

  Lab.powerWhoMap = (R) => { if (!R || !R.who) return null;
    const core = R.who.filter((w) => /^\d+$/.test(w[0])); const outer = R.who.filter((w) => !/^\d+$/.test(w[0]));
    const W = 1000, H = 520, cx = 500, cy = 505; const RED = '#B91C1C', ORANGE = '#EA580C', YELLOW = '#FBBF24';
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Who runs what: ' + R.top + ' at the centre, the top committee around, and the officials below with their portfolios', style: 'width:100%;height:auto;display:block' });
    const band = (rx, ry, fill) => svg.append(s('path', { d: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} Z`, fill }));
    band(495, 495, YELLOW); band(380, 330, ORANGE); band(175, 150, RED);
    const text = (x, y, lines, o = {}) => { const t = s('text', { x, y, 'text-anchor': 'middle', fill: o.fill || '#fff', 'font-size': o.size || 11, 'font-weight': o.bold ? 700 : 400, 'font-family': 'system-ui, sans-serif' });
      lines.forEach((ln, i) => t.append(s('tspan', { x, dy: i ? (o.lh || 13) : 0 }, ln))); svg.append(t); };
    const node = (x, y, w, inner) => { const [rk, n, posts, port] = w; const dark = !inner;
      if (/^\d+$/.test(rk)) { svg.append(s('circle', { cx: x, cy: y - 25, r: 9, fill: '#fff', stroke: RED, 'stroke-width': 1.5 })); text(x, y - 21, [rk], { fill: RED, size: 11, bold: true }); }
      text(x, y, [n], { fill: dark ? '#3B0A0A' : '#fff', size: 15, bold: true });
      text(x, y + 15, clip(wrap(posts, 28), 2), { fill: dark ? '#3B0A0A' : '#FFF7ED', size: 10.5, bold: true, lh: 12 });
      text(x, y + 15 + 12 * Math.min(2, wrap(posts, 28).length) + 2, clip(wrap(port, 28), 3), { fill: dark ? '#451A03' : '#FFEDD5', size: 10, lh: 12 }); };
    const lead = core[0]; if (lead) { text(cx, cy - 92, [lead[1]], { size: 19, bold: true }); text(cx, cy - 74, wrap(lead[2], 34), { size: 10.5, bold: true, fill: '#FEE2E2', lh: 12 }); text(cx, cy - 46, wrap(lead[3], 36).slice(0, 2), { size: 10, fill: '#FECACA', lh: 12 }); }
    const ring = (list, rx, ry, a0, a1, inner) => list.forEach((w, i) => { const a = (a0 + (list.length === 1 ? 0.5 : i / (list.length - 1)) * (a1 - a0)) * Math.PI / 180;
      node(cx + rx * Math.cos(a), cy - ry * Math.sin(a) - 18, w, inner); });
    ring(core.slice(1), 290, 240, 164, 16, true); ring(outer, 440, 420, 146, 34, false);
    // Phones get the same rings stacked as colour blocks, so nothing has to be scrolled or zoomed.
    const tile = ([rk, n, posts, port], dark) => h('div', { class: 'pw-wm-tile' + (dark ? ' dark' : '') }, /^\d+$/.test(rk) ? h('span', { class: 'pw-wm-n' }, rk) : null, h('b', null, n), h('div', { class: 'pw-wm-post' }, posts), h('div', { class: 'pw-wm-port' }, port));
    const stack = h('div', { class: 'pw-wm-stack' }, lead ? h('div', { class: 'pw-wm-band', style: { background: RED } }, h('div', { class: 'pw-wm-lab' }, 'The core'), tile(lead)) : null,
      h('div', { class: 'pw-wm-band', style: { background: ORANGE } }, h('div', { class: 'pw-wm-lab' }, 'Top committee, official rank order'), h('div', { class: 'pw-wm-grid' }, core.slice(1).map((w) => tile(w)))),
      outer.length ? h('div', { class: 'pw-wm-band', style: { background: YELLOW, color: '#3B0A0A' } }, h('div', { class: 'pw-wm-lab' }, 'Below them, and what each is in charge of'), h('div', { class: 'pw-wm-grid' }, outer.map((w) => tile(w, true)))) : null);
    return h('div', null, h('div', { class: 'pw-wm-wide', style: { borderRadius: '12px', overflow: 'hidden' } }, svg), stack,
      h('div', { class: 'row tiny muted', style: { gap: '12px', flexWrap: 'wrap', marginTop: '6px' } },
        [[RED, 'The core'], [ORANGE, 'Top committee, in official rank order'], [YELLOW, 'Officials below and what they are in charge of']].map(([c, t]) => h('span', null, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: c, marginRight: '4px' } }), t)),
        )); };

  const ladderCompact = (id, S) => h('div', { class: 'pw-mini' }, [...S.ladder].reverse().map(([lv, many, how], i) => h('div', { class: 'pw-mini-rung', style: { '--c': S.c } },
    h('span', { class: 'pw-n' }, String(S.ladder.length - i)), h('div', null, h('b', null, lv), h('div', { class: 'tiny muted' }, many), h('div', { class: 'small' }, how)))));

  Lab.powerPanel = (iso) => { const P = Lab.POWER || {}, RO = Lab.POWER_ROLES || {}; const id = Object.keys(P).find((k) => P[k].iso === iso); if (!id) return [];
    const S = P[id], R = RO[id]; const out = [];
    if (R) out.push(card(h('h3', { style: { marginTop: 0 } }, '🏛️ ' + R.title), Lab.powerRoleTree(R, S.c), R.extra ? h('p', { class: 'small', style: { margin: '10px 0 0' } }, R.extra) : null));
    if (R && R.who) out.push(card(h('h3', { style: { marginTop: 0 } }, '👥 Who runs what'), h('p', { class: 'tiny muted', style: { marginTop: 0 } }, R.asof + '. Official rank order for the top committee.'), Lab.powerWhoMap(R),
      h('ul', { class: 'small', style: { marginBottom: 0 } }, (R.notes || []).map((x) => h('li', null, x)))));
    out.push(card(h('div', { class: 'row', style: { justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' } }, h('h3', { style: { margin: 0 } }, '🪜 From citizen to the top'), h('a', { class: 'small', href: '#power-' + id }, 'Full ladder: theory vs practice →')),
      h('p', { class: 'small muted', style: { margin: '4px 0 8px' } }, S.sum), ladderCompact(id, S),
      h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '10px' } }, [['climb', '🧗 How leaders climbed'], ['decide', '⚙️ How decisions are made'], ['money', '💰 Money and war'], ['checks', '⚖️ Checks'], ['shut', '⛓️ Shut out and persecuted']].map(([t, n]) => h('a', { class: 'btn sm', href: '#power-' + id, onclick: () => { try { sessionStorage.setItem('lab.powerTab', t); } catch (e) {} } }, n)))));
    return out; };
})();
