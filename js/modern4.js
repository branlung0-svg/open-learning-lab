// Modern world module, part 4: the balance sheet.
const h = Lab.h;
const M = Lab.MODERN;
const EV = Object.fromEntries(M.events.map((e) => [e.id, e]));
const i = M.SUBS.findIndex(([x]) => x === 'families'); M.SUBS.splice(i, 0, ['ledger', 'Balance sheet: good & bad']);
const g = M.GROUPS.find((x) => x[1] === 'Ideas & power'); if (g) g[2].unshift('ledger');
const row = ([txt, conf, ev], color) => h('li', { style: { margin: '6px 0' } }, h('span', { class: 'small' }, txt), ' ', Lab.conf(conf), ev && EV[ev] ? h('a', { href: '#', class: 'tiny', style: { marginLeft: '6px' }, onclick: (e) => { e.preventDefault(); M.go('timeline', 'ev-' + ev); } }, '→ ' + EV[ev].t) : null);
M.render.ledger = (el) => {
  let sel = new Set(M.ledger.map((x) => x.id));
  const chips = h('div', { class: 'row', style: { gap: '6px' } }); const list = h('div', { class: 'stack' });
  function draw() {
    chips.innerHTML = ''; M.ledger.forEach((x) => chips.append(h('span', { class: 'chip' + (sel.has(x.id) ? ' on' : ''), style: { '--c': '#475569' }, onclick: () => { sel.has(x.id) ? sel.delete(x.id) : sel.add(x.id); draw(); } }, x.e + ' ' + x.n)));
    list.innerHTML = '';
    M.ledger.filter((x) => sel.has(x.id)).forEach((x) => list.append(h('div', { class: 'card' },
      h('div', { class: 'row' }, h('h3', { style: { margin: 0 } }, x.e + ' ' + x.n), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, x.ex)),
      h('div', { class: 'grid g2', style: { marginTop: '8px', alignItems: 'start' } },
        h('div', { style: { borderLeft: '4px solid #16A34A', paddingLeft: '10px' } }, h('b', { class: 'small' }, '✅ Achievements & what supporters cite'), h('ul', { style: { margin: '4px 0 0 16px', padding: 0 } }, x.good.map((r) => row(r)))),
        h('div', { style: { borderLeft: '4px solid #DC2626', paddingLeft: '10px' } }, h('b', { class: 'small' }, '❌ Atrocities, crimes & failures'), h('ul', { style: { margin: '4px 0 0 16px', padding: 0 } }, x.bad.map((r) => row(r))))),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } },
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Give me a complete, even-handed balance sheet of ${x.n} (${x.ex}): its real achievements and its crimes and failures, with numbers, sources and confidence levels, using exactly the same standards you would apply to any other system. Point out what each side tends to leave out.`, x.n) }, '✦ Full balance sheet'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`What do defenders of ${x.n} leave out or minimize, and what do its critics leave out or exaggerate? Give specific examples on both sides.`, x.n) }, '✦ What each side leaves out')))));
  }
  el.append(
    h('div', { class: 'card' }, h('h2', { style: { marginTop: 0 } }, 'Balance sheet: the good and the bad of every system'),
      h('p', { class: 'small' }, 'Every political system in this period did real good and real harm. The test of an honest history is whether it applies the same standards to all of them. These are the rules used here:'),
      h('ol', { class: 'small', style: { margin: '0 0 6px 18px', lineHeight: 1.7 } }, M.ledgerRules.map((r) => h('li', null, r))),
      h('p', { class: 'tiny muted' }, 'If you find a place where this module is harsher on one tradition than another for the same kind of act, that is a bias worth flagging. Ask the tutor to check it.'), chips),
    list,
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The body-count debate'), h('p', { class: 'small muted' }, 'Totals of “deaths caused by communism” and “deaths caused by capitalism or colonialism” are both used as political weapons. Here is what the scholarship says about them.'),
      ...M.bodycount.map(([t, d, c]) => h('div', { style: { margin: '10px 0' } }, h('b', { class: 'small' }, t), ' ', Lab.conf(c), h('p', { class: 'small', style: { margin: '3px 0 0' } }, d))),
      h('button', { class: 'btn sm', onclick: () => Lab.ask('Explain how historians count deaths caused by political systems: famines, executions, wars, camps, and slower development. Compare the methods behind the Black Book of Communism, Mike Davis on colonial famines, and Sullivan and Hickel on colonial India, and what their critics say about each.', 'Counting deaths') }, '✦ How should deaths be counted?')));
  draw();
};
