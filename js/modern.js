// Modern world 1700–2026 through the political spectrum: the History tab's main explorer.
const h = Lab.h;
const M = Lab.MODERN;
const LENS = Object.fromEntries(M.lenses.map((l) => [l.id, l]));
const IDEO = Object.fromEntries(M.ideologies.map((i) => [i.id, i]));
const ERA = Object.fromEntries(M.eras.map((e) => [e.id, e]));
const book = (t) => (Lab.LIB || []).find((b) => b.t.toLowerCase().includes(t.toLowerCase()));
const yr = (e) => (e.y2 && e.y2 !== e.y ? `${e.y}–${e.y2}` : String(e.y));
const SUBS = Lab.MODERN.SUBS = [['start', 'Start here'], ['timeline', 'Timeline 1700–2026'], ['ideologies', 'Ideologies'], ['compare', 'Compare ideologies'], ['spectrum', 'Spectrum map'], ['claims', 'Test the claims'], ['game', 'Which side said it?'], ['people', 'People'], ['sources', 'Read the sources']];
Lab.MODERN.render = {};
let docMeta = null;
let imgIdx = null;
Lab.MODERN.imgIndex = () => (imgIdx ||= fetch('data/modern-img.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
Lab.MODERN.img = async (key) => { if (!key) return null; const I = await Lab.MODERN.imgIndex(); const m = I[key]; if (!m) return null; try { const buf = await Lab.pack(m.p); return { url: Lab.packUrl(m.p, buf, [m.o, m.n]), c: m.c, t: m.t }; } catch (e) { return null; } };
Lab.MODERN.thumb = (key, size = 56) => {
  const box = h('div', { style: { width: size + 'px', height: size + 'px', borderRadius: '50%', background: 'var(--card2)', flex: '0 0 auto', overflow: 'hidden' } });
  Lab.MODERN.img(key).then((r) => { if (r) { box.title = r.c; box.append(h('img', { src: r.url, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' } })); } });
  return box;
};
Lab.MODERN.figure = (key, opts = {}) => {
  const box = h('figure', { style: { margin: opts.margin || '0 0 10px', display: 'none' } });
  Lab.MODERN.img(key).then((r) => { if (!r) return; box.style.display = 'block'; box.append(h('img', { src: r.url, alt: r.t || '', loading: 'lazy', style: { width: '100%', maxHeight: opts.max || '340px', objectFit: opts.fit || 'cover', borderRadius: '12px', background: 'var(--card2)' } }), h('figcaption', { class: 'tiny muted', style: { marginTop: '3px' } }, (r.t ? r.t + ' · ' : '') + r.c)); });
  return box;
};
const loadDocs = () => (docMeta ||= Lab.loadDeep().then((X) => Object.fromEntries((X.docs || []).map((d) => [d.id, d]))));
const ALL_LENSES = 'liberal, conservative, socialist/social-democratic, Marxist, far-right (fascist or reactionary, presented historically and critiqued, never endorsed), anarchist, anti-colonial/Global South, and Indigenous perspectives where relevant';

function lensTag(id) { const l = LENS[id]; return h('span', { class: 'tag', style: { '--c': l.c } }, l.e + ' ' + l.n); }
function sect(title, ...kids) { return h('div', { style: { marginTop: '12px' } }, h('div', { class: 'tiny muted', style: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' } }, title), ...kids); }
function personBtn(n) { return h('span', { class: 'chip', style: { '--c': 'var(--accent)' }, onclick: () => Lab.ask(`Who was ${n}? What did they believe and do, what were the material conditions that shaped them, and how do supporters and critics across the political spectrum judge them? Separate documented facts from interpretation.`, n) }, '👤 ' + n); }
function bookLinks(list) {
  const found = (list || []).map(book).filter(Boolean);
  if (!found.length) return null;
  return h('div', { class: 'row', style: { gap: '6px' } }, [...new Set(found)].map((b) => h('a', { class: 'chip', href: '#reading-library-' + b.id, style: { textDecoration: 'none', color: 'inherit', '--c': '#7C3AED' } }, '📖 ' + b.t + (b.a ? ' · ' + b.a.split(',')[0] : ''))));
}
function docLinks(ids) {
  if (!ids || !ids.length) return null;
  const box = h('div', { class: 'row', style: { gap: '6px' } });
  loadDocs().then((D) => ids.forEach((id) => { const m = D[id]; if (m) box.append(h('span', { class: 'chip', style: { '--c': '#0F766E' }, onclick: () => Lab.openDoc(m) }, '📜 ' + m.t.replace(/^The Avalon Project at Yale Law School /, '').slice(0, 70) + (m.y ? ` (${m.y < 0 ? -m.y + ' BCE' : m.y})` : ''))); }));
  return box;
}
function dataBtn(dt, label) {
  if (!dt) return null;
  return h('button', { class: 'btn sm', onclick: () => Lab.openData(dt.ds, { ents: dt.ents, v: dt.v, log: dt.log, note: dt.note || dt.claim }) }, '📈 ' + (label || 'See the real data'));
}
const save = (title, body) => Lab.saveNote && Lab.saveNote({ kind: 'history', title, body });

// ---------- event card ----------
function eventDetail(e) {
  const lensIds = M.lenses.map((l) => l.id).filter((k) => e.L[k]);
  const lensGrid = h('div', { class: 'grid g2', style: { marginTop: '6px' } }, lensIds.map((k) => h('div', { style: { borderLeft: `4px solid ${LENS[k].c}`, padding: '8px 12px', background: 'var(--card2)', borderRadius: '10px' } },
    h('div', { class: 'small', style: { fontWeight: 700, marginBottom: '3px' } }, LENS[k].e + ' ' + LENS[k].n), h('div', { class: 'small' }, e.L[k]))));
  const mine = h('textarea', { rows: 3, placeholder: 'Your own reading: what do you think actually happened and why? (saved to your notebook)', style: { width: '100%', marginTop: '6px' } });
  const sysL = (M.systems || []).filter((x) => (x.ev || []).includes(e.id));
  const sciL = (M.science || []).filter((x) => (x.ev || []).includes(e.id));
  return h('div', { style: { marginTop: '10px' } },
    Lab.MODERN.figure(e.img || 'ev:' + e.id),
    h('div', { class: 'tiny muted' }, '📍 ' + e.place),
    h('div', { class: 'grid g2', style: { marginTop: '6px' } },
      h('div', null, sect('What happened', h('p', { class: 'small' }, e.what)), sect('Why it happened', h('p', { class: 'small' }, e.why))),
      h('div', null, sect('Material conditions', h('p', { class: 'small' }, e.cond)), sect('Outcome & numbers', h('p', { class: 'small' }, e.out)))),
    sect('How each side reads it', h('p', { class: 'tiny muted' }, 'Paraphrased positions of each tradition, not quotes and not endorsements. Read them all, then check them against the evidence below.'), lensGrid),
    (e.ok && e.ok.length) ? sect('What the evidence settles', h('ul', { class: 'small', style: { margin: '4px 0 0 18px' } }, e.ok.map((x) => h('li', null, x)))) : null,
    (e.q && e.q.length) ? sect('What is still argued', ...e.q.map(([q, c, n]) => h('div', { class: 'small', style: { margin: '6px 0' } }, Lab.conf(c), ' ', h('b', null, q), h('div', { class: 'muted', style: { marginTop: '2px' } }, n)))) : null,
    sysL.length ? sect('How the systems involved worked', h('div', { class: 'row', style: { gap: '6px' } }, sysL.map((x) => h('span', { class: 'chip', style: { '--c': '#0F766E' }, onclick: () => Lab.MODERN.go('systems', x.id) }, x.e + ' ' + x.n)))) : null,
    sciL.length ? sect('Science, technology & ideas connected to it', h('div', { class: 'row', style: { gap: '6px' } }, sciL.map((x) => h('span', { class: 'chip', style: { '--c': M.disc[x.d][2] }, onclick: () => Lab.MODERN.go('science', x.id) }, M.disc[x.d][0] + ' ' + x.t + ' (' + x.y + ')')))) : null,
    (e.who && e.who.length) ? sect('People', h('div', { class: 'row', style: { gap: '6px' } }, e.who.map(personBtn))) : null,
    (e.bk && e.bk.length && bookLinks(e.bk)) ? sect('Read it in the Lab', bookLinks(e.bk)) : null,
    (e.dc && e.dc.length) ? sect('Primary documents', docLinks(e.dc)) : null,
    sect('Investigate',
      h('div', { class: 'row', style: { gap: '6px' } },
        dataBtn(e.dt),
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Run a structured debate on "${e.t}" (${yr(e)}). Give the strongest honest case from each of these traditions: ${ALL_LENSES}. Then step back: what does the evidence settle, what is genuinely contested, what has been propagandized by which side, and what would a careful historian conclude? Label confidence (Established, Strong, Contested, Unknown, Clouded).`, e.t) }, '✦ Debate it from every side'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`For "${e.t}" (${yr(e)}): which claims about it are most often propagandized or distorted, by which side, and what do primary sources and data actually show? Give me sources from more than one side to check.`, e.t) }, '✦ Cut through the propaganda'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain the material conditions behind "${e.t}" (${yr(e)}): population, food, work, wages, technology, trade, debt, who owned what. How much do material conditions explain, and what do ideas, leaders and chance explain?`, e.t) }, '✦ Material conditions'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`How did "${e.t}" (${yr(e)}) shape the world of 2026? Trace the chain of consequences to today, including disputed links.`, e.t) }, '✦ How it led to today'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 5 questions on "${e.t}" (${yr(e)}), including at least one about how different political traditions interpret it. Then tell me what I missed.`, e.t) }, '✦ Quiz me'))),
    sect('Your own reading', mine, h('div', { class: 'row', style: { marginTop: '6px', gap: '6px' } },
      h('button', { class: 'btn sm', onclick: () => { if (mine.value.trim()) save(e.t, mine.value.trim()); } }, '📓 Save'),
      h('button', { class: 'btn sm', onclick: () => { if (mine.value.trim()) Lab.ask(`Here is my reading of "${e.t}" (${yr(e)}): "${mine.value.trim()}". Challenge it honestly from each side of the spectrum, point out any facts I have wrong, and tell me what evidence would change my mind.`, e.t); } }, '✦ Challenge my reading'))));
}
function eventRow(e, lens) {
  const conf = (e.q || []).map((q) => q[1]);
  const worst = ['Clouded', 'Contested', 'Unknown'].find((c) => conf.includes(c)) || (conf.length ? conf[0] : (e.ok && e.ok.length ? 'Established' : null));
  let det = null;
  const box = h('div', { class: 'card', style: { padding: '14px 16px', borderLeft: `5px solid ${ERA[e.era].c}` } });
  const head = h('div', { class: 'row', style: { cursor: 'pointer', alignItems: 'baseline' } },
    h('b', { style: { fontFamily: 'Space Grotesk', minWidth: '86px' } }, yr(e)),
    h('span', { style: { fontWeight: 700, flex: '1 1 260px' } }, e.t),
    h('span', { class: 'tiny' }, e.cat.map((c) => M.cats[c][0]).join(' ')),
    worst ? Lab.conf(worst) : null);
  const peek = lens && e.L[lens] ? h('div', { class: 'small', style: { marginTop: '6px', borderLeft: `3px solid ${LENS[lens].c}`, paddingLeft: '10px' } }, h('b', null, LENS[lens].e + ' '), e.L[lens]) : h('div', { class: 'small muted', style: { marginTop: '4px' } }, e.what.length > 190 ? e.what.slice(0, 190) + '…' : e.what);
  head.onclick = () => { if (det) { det.remove(); det = null; return; } det = eventDetail(e); box.append(det); Lab.markDone && Lab.markDone('modern:' + e.id, 3, e.t); };
  box.append(head, peek);
  box.dataset.id = e.id;
  return box;
}

// ---------- tabs ----------
function startTab(el, go) {
  el.append(
    h('div', { class: 'card' },
      h('h2', { style: { marginTop: 0 } }, 'The modern world, 1700–2026, through every side of the spectrum'),
      h('p', null, 'This module follows the events that made today’s world (wars, revolutions, booms and crashes, famines, empires, breakthroughs) and shows how each political tradition explains them: liberals, conservatives, socialists, Marxists, anarchists, anti-colonial thinkers, and the far right, whose framing you need to recognize precisely because it has been so destructive.'),
      h('p', null, 'The method is the one Hegel described: “the truth is the whole.” No single side owns it. Each tradition sees real things others miss, and each has blind spots and has spread propaganda. So for every event you get the facts, the material conditions, each side’s reading, what the evidence settles, and what is still argued, with a confidence label.'),
      h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, Object.entries(M.CONF).map(([k, v]) => h('span', { class: 'small', title: v }, Lab.conf(k)))),
      h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, Object.values(M.CONF).join(' · '))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'How to use it'),
      h('ol', { class: 'small', style: { margin: '0 0 0 18px', lineHeight: 1.7 } },
        h('li', null, 'Read the ', h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); go('ideologies'); } }, 'Ideologies'), ': where each came from, what it believes, its strongest case and its strongest critics.'),
        h('li', null, 'Walk the ', h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); go('timeline'); } }, 'Timeline'), '. Switch the lens to see all of history through one side’s eyes, then switch again.'),
        h('li', null, 'Use ', h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); go('claims'); } }, 'Test the claims'), ' to check the big arguments against real data.'),
        h('li', null, 'Write your own reading of each event and have the tutor challenge it from every side. Everything you save goes to your Research Notebook.'))),
    h('h2', { style: { margin: '18px 0 6px' } }, 'The six eras and their material conditions'),
    h('div', { class: 'grid g2' }, M.eras.map((er) => h('div', { class: 'card', style: { borderTop: `5px solid ${er.c}` } },
      h('div', { class: 'row' }, h('h3', { style: { margin: 0 } }, er.n), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, `${er.y}–${er.y2 === 2026 ? 'now' : er.y2}`)),
      h('p', { class: 'small' }, er.sum),
      h('table', { class: 't small' }, h('tbody', null, er.stats.map(([a, b]) => h('tr', null, h('td', { class: 'muted' }, a), h('td', null, b))))),
      h('div', { class: 'row', style: { marginTop: '8px', gap: '6px' } },
        h('button', { class: 'btn sm primary', onclick: () => go('timeline', er.id) }, `See its ${M.events.filter((x) => x.era === er.id).length} events`),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain the era "${er.n}" (${er.y}–${er.y2}). What were the material conditions of ordinary people, the main ideas, the big conflicts, and how do liberal, conservative, socialist, Marxist and anti-colonial historians each characterize it?`, er.n) }, '✦ Explain this era'))))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The material conditions of humanity, 1700–2026'),
      h('p', { class: 'small muted' }, 'Before arguing about systems, look at what happened to how people actually lived. Open each chart and ask what explains it.'),
      h('div', { class: 'row', style: { gap: '6px' } },
        dataBtn({ ds: 'maddison', ents: ['World', 'Western Europe', 'China', 'India', 'Latin America'], v: 'GDP per capita', log: true, note: 'Income per person since 1700 (Maddison Project). Log scale: steady slopes mean steady growth rates.' }, 'Income per person'),
        dataBtn({ ds: 'maddison', ents: ['World'], v: 'Population', note: 'World population.' }, 'Population'),
        dataBtn({ ds: 'poverty', ents: ['World'], v: 1, note: 'Share of the world living in extreme poverty since 1820.' }, 'Extreme poverty'),
        dataBtn({ ds: 'literacy', ents: ['World'], v: 0, note: 'Literate world population.' }, 'Literacy'),
        dataBtn({ ds: 'urban', ents: ['World', 'United Kingdom', 'China', 'India'], v: 0, note: 'Share of people living in cities.' }, 'Cities'),
        dataBtn({ ds: 'regimepop', ents: ['World'], v: 'population_liberal_dem', note: 'People living in liberal democracies.' }, 'Democracy'),
        dataBtn({ ds: 'wardeaths', ents: ['World'], v: 4, note: 'Deaths in state-based conflicts since 1800.' }, 'War deaths'),
        dataBtn({ ds: 'topinc', ents: ['United States', 'France', 'United Kingdom'], note: 'Income share of the top 1%.' }, 'Inequality'))));
}

function timelineTab(el, arg) {
  const openId = (arg || '').startsWith('ev-') ? arg.slice(3) : null;
  let era = ERA[arg] ? arg : 'all', lens = '', cats = new Set(Object.keys(M.cats)), qtext = '';
  const eraRow = h('div', { class: 'row', style: { gap: '6px' } });
  const catRow = h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } });
  const lensSel = h('select', { onchange: (ev) => { lens = ev.target.value; draw(); } }, h('option', { value: '' }, 'Show a summary'), M.lenses.map((l) => h('option', { value: l.id }, 'Read it as: ' + l.e + ' ' + l.n)));
  const search = h('input', { type: 'text', placeholder: 'Search events, people, places…', style: { minWidth: '220px' }, oninput: (ev) => { qtext = ev.target.value.toLowerCase(); draw(); } });
  const list = h('div', { class: 'stack', style: { marginTop: '10px' } });
  const lensNote = h('p', { class: 'small', style: { margin: '8px 0 0' } });
  function chips() {
    eraRow.innerHTML = ''; catRow.innerHTML = '';
    [['all', 'All eras', '#64748B'], ...M.eras.map((e) => [e.id, `${e.y}–${e.y2 === 2026 ? 'now' : e.y2} ${e.n}`, e.c])].forEach(([id, n, c]) => eraRow.append(h('span', { class: 'chip' + (era === id ? ' on' : ''), style: { '--c': c }, onclick: () => { era = id; chips(); draw(); } }, h('i'), n)));
    Object.entries(M.cats).forEach(([k, [e, n]]) => catRow.append(h('span', { class: 'chip' + (cats.has(k) ? ' on' : ''), style: { '--c': '#475569' }, onclick: () => { cats.has(k) ? cats.delete(k) : cats.add(k); chips(); draw(); } }, e + ' ' + n)));
  }
  function draw() {
    list.innerHTML = '';
    lensNote.innerHTML = '';
    if (lens) lensNote.append(lensTag(lens), ' ', LENS[lens].frame, h('span', { class: 'muted' }, ' Who: ' + LENS[lens].who + '.'));
    const evs = M.events.filter((e) => (era === 'all' || e.era === era) && e.cat.some((c) => cats.has(c)) && (!qtext || JSON.stringify(e).toLowerCase().includes(qtext))).sort((a, b) => a.y - b.y);
    let cur = '';
    for (const e of evs) {
      if (e.era !== cur) { cur = e.era; const er = ERA[cur]; list.append(h('h2', { style: { margin: '18px 0 4px', color: er.c } }, er.n, h('span', { class: 'muted small', style: { fontWeight: 500, marginLeft: '8px' } }, `${er.y}–${er.y2 === 2026 ? 'now' : er.y2}`)), h('p', { class: 'small muted', style: { margin: '0 0 6px' } }, er.sum)); }
      list.append(eventRow(e, lens));
    }
    if (!evs.length) list.append(h('p', { class: 'muted' }, 'No events match.'));
  }
  el.append(h('div', { class: 'card' }, h('p', { class: 'small muted', style: { marginTop: 0 } }, `${M.events.length} major events, each with causes, material conditions, outcomes, how every side reads it, and what is settled vs argued. Tap an event to open it.`),
    eraRow, catRow, h('div', { class: 'row', style: { marginTop: '10px', gap: '8px' } }, lensSel, search), lensNote), list);
  chips(); draw();
  if (openId) setTimeout(() => { const b = list.querySelector(`[data-id="${openId}"]`); if (b) { b.firstChild.click(); b.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 80);
}

function ideologyDetail(i) {
  const wrap = h('div', null);
  const lib = bookLinks(i.read.concat(i.thinkers.map((t) => t[2])));
  wrap.append(
    h('p', { class: 'tiny muted' }, 'Born: ' + i.born),
    h('p', null, i.gist),
    sect('Key thinkers & leaders', h('div', { class: 'row', style: { gap: '6px' } }, i.thinkers.map(([n, life, w]) => h('span', { class: 'chip', style: { '--c': i.c }, title: w, onclick: () => Lab.ask(`Who was ${n} (${life})? Explain their ideas, especially ${w}, in plain English, how they shaped ${i.n}, and the strongest praise and criticism of them.`, n) }, `${n} · ${life}`)))),
    sect('What it believes', h('table', { class: 't small' }, h('tbody', null, M.dims.map(([k, n]) => h('tr', null, h('td', { class: 'muted', style: { width: '28%' } }, n), h('td', null, i.v[k])))))),
    sect('Where it was tried', h('p', { class: 'small' }, i.tried)),
    h('div', { class: 'grid g2', style: { marginTop: '10px' } },
      h('div', { style: { borderLeft: '4px solid #16A34A', padding: '8px 12px', background: 'var(--card2)', borderRadius: '10px' } }, h('b', { class: 'small' }, '👍 Its supporters’ strongest case'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, i.pro)),
      h('div', { style: { borderLeft: '4px solid #DC2626', padding: '8px 12px', background: 'var(--card2)', borderRadius: '10px' } }, h('b', { class: 'small' }, '👎 Its critics’ strongest case'), h('p', { class: 'small', style: { margin: '4px 0 0' } }, i.con))),
    lib ? sect('Read the originals in the Lab', lib) : null,
    sect('Investigate', h('div', { class: 'row', style: { gap: '6px' } },
      h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Steelman ${i.n}: give the strongest, most honest version of its case, as its best defenders would make it. Then give the strongest objections from its best critics. Then tell me what the historical record shows when it was tried, with confidence labels.`, i.n) }, '✦ Steelman it, then critique it'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`How was ${i.n} made? What material conditions, events, earlier ideas and people produced it, and how did it change over time?`, i.n) }, '✦ How it was made'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`What are the most common myths and propaganda about ${i.n}, both from its supporters and from its enemies? What does the evidence actually show?`, i.n) }, '✦ Myths on both sides'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`Quiz me with 6 questions on ${i.n}: its ideas, thinkers, history and critics. Then tell me what I missed.`, i.n) }, '✦ Quiz me'))));
  return wrap;
}
function ideologiesTab(el, arg) {
  const det = h('div', { class: 'card', style: { display: 'none' } });
  function open(id) {
    const i = IDEO[id]; if (!i) return;
    det.style.display = 'block'; det.innerHTML = '';
    det.style.borderTop = `5px solid ${i.c}`;
    det.append(h('div', { class: 'row' }, h('h2', { style: { margin: 0 } }, i.e + ' ' + i.n), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { det.style.display = 'none'; } }, 'Close')), ideologyDetail(i));
    det.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#history-modern-ideologies-' + id);
    Lab.markDone && Lab.markDone('ideo:' + id, 5, i.n);
  }
  el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { margin: 0 } }, 'Thirteen traditions that shaped 1700–2026. Each card shows where it came from, what it believes on the same 13 questions, where it was tried, and the strongest case for and against it. Fascism and Nazism are included because you cannot understand the 20th century without them; their entries record what they claimed and what they did.')),
    h('div', { class: 'grid g3' }, M.ideologies.map((i) => h('div', { class: 'card', style: { cursor: 'pointer', borderTop: `5px solid ${i.c}` }, onclick: () => open(i.id) },
      h('div', { class: 'row' }, h('span', { style: { fontSize: '22px' } }, i.e), h('b', null, i.n)), h('p', { class: 'tiny muted', style: { margin: '4px 0' } }, i.born), h('p', { class: 'small', style: { margin: 0 } }, i.gist.length > 150 ? i.gist.slice(0, 150) + '…' : i.gist)))), det);
  if (arg && IDEO[arg]) setTimeout(() => open(arg), 50);
}

function compareTab(el) {
  const opts = (sel) => M.ideologies.map((i) => h('option', { value: i.id, selected: i.id === sel }, i.e + ' ' + i.n));
  let a = 'leninism', b = 'fascism';
  const A = h('select', { onchange: (ev) => { a = ev.target.value; draw(); } }, opts(a));
  const B = h('select', { onchange: (ev) => { b = ev.target.value; draw(); } }, opts(b));
  const out = h('div');
  function draw() {
    const x = IDEO[a], y = IDEO[b]; out.innerHTML = '';
    const pair = M.pairs.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a));
    out.append(
      pair ? h('div', { class: 'card', style: { marginTop: '10px' } }, h('h3', { style: { marginTop: 0 } }, pair.t),
        h('p', { class: 'small' }, h('b', null, 'How they are alike: '), pair.same), h('p', { class: 'small' }, h('b', null, 'How they differ: '), pair.diff), h('p', { class: 'small' }, h('b', null, 'The scholarly debate: '), pair.debate)) : null,
      h('div', { class: 'card', style: { marginTop: '10px', overflowX: 'auto' } }, h('table', { class: 't small' },
        h('thead', null, h('tr', null, h('th', null, ''), h('th', { style: { color: x.c } }, x.e + ' ' + x.n), h('th', { style: { color: y.c } }, y.e + ' ' + y.n))),
        h('tbody', null, h('tr', null, h('td', { class: 'muted' }, 'Born'), h('td', null, x.born), h('td', null, y.born)),
          M.dims.map(([k, n]) => h('tr', null, h('td', { class: 'muted' }, n), h('td', null, x.v[k]), h('td', null, y.v[k]))),
          h('tr', null, h('td', { class: 'muted' }, 'Tried'), h('td', null, x.tried), h('td', null, y.tried))))),
      h('div', { class: 'row', style: { marginTop: '10px', gap: '6px' } },
        h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Compare ${x.n} and ${y.n} honestly. Where are they genuinely similar (in ideas, methods and results), where are they fundamentally different, how were they each made, and what do scholars disagree about in comparing them? Use the historical record and give confidence labels.`, `${x.n} vs ${y.n}`) }, '✦ Compare them deeply'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Stage a debate between a thoughtful defender of ${x.n} and a thoughtful defender of ${y.n} on three questions: human nature, the economy, and what history proves. Then judge which claims hold up against evidence.`, `${x.n} vs ${y.n}`) }, '✦ Stage a debate')));
  }
  el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { marginTop: 0 } }, 'Pick any two traditions and see them side by side on the same questions. Some pairs have curated notes on the big scholarly debates.'),
    h('div', { class: 'row' }, A, h('b', null, 'vs'), B)),
    out,
    h('h3', { style: { margin: '18px 0 6px' } }, 'The big comparison debates'),
    h('div', { class: 'grid g2' }, M.pairs.map((p) => h('div', { class: 'card', style: { cursor: 'pointer' }, onclick: () => { a = p.a; b = p.b; A.value = a; B.value = b; draw(); el.scrollIntoView({ behavior: 'smooth' }); } }, h('b', null, p.t), h('p', { class: 'small muted', style: { margin: '4px 0 0' } }, p.debate.slice(0, 160) + '…')))));
  draw();
}

const QUIZ = [
  ['Major industries should be owned by the public or by their workers.', 'x', -1], ['Free markets allocate resources better than governments do.', 'x', 1], ['The rich should pay much higher taxes to fund public services.', 'x', -1], ['Labor unions mainly help workers and should be stronger.', 'x', -1],
  ['Free trade benefits most people in the long run.', 'x', 1], ['Government regulation of business usually does more harm than good.', 'x', 1], ['Inheriting a large fortune is fair.', 'x', 1], ['Health care should be guaranteed by the government.', 'x', -1],
  ['A strong leader who can bypass parliament and courts is sometimes needed.', 'y', 1], ['Free speech should be protected even for views most people find hateful.', 'y', -1], ['Children should be taught to respect authority above all.', 'y', 1], ['The state should stay out of what consenting adults do in private.', 'y', -1],
  ['National unity and tradition matter more than individual self-expression.', 'y', 1], ['Police and the military should have more power to keep order.', 'y', 1], ['Power should be decentralized to local communities as much as possible.', 'y', -1], ['Laws should enforce the moral values of the majority’s religion or tradition.', 'y', 1],
];
function spectrumTab(el) {
  const W = 520, H = 520, cx = W / 2, cy = H / 2, s = 23;
  const NS = 'http://www.w3.org/2000/svg';
  const E = (tag, at, parent, text) => { const n = document.createElementNS(NS, tag); Object.entries(at || {}).forEach(([k, v]) => n.setAttribute(k, v)); if (text != null) n.textContent = text; if (parent) parent.append(n); return n; };
  const svg = E('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;max-width:560px;height:auto' });
  [['Authoritarian left', 0, 0, '#FCA5A5'], ['Authoritarian right', cx, 0, '#93C5FD'], ['Libertarian left', 0, cy, '#86EFAC'], ['Libertarian right', cx, cy, '#FDE68A']].forEach(([n, x, y, c]) => { E('rect', { x, y, width: cx, height: cy, fill: c, opacity: 0.22 }, svg); E('text', { x: x ? W - 8 : 8, y: y ? H - 8 : 16, 'text-anchor': x ? 'end' : 'start', 'font-size': 11, fill: 'currentColor', opacity: 0.6 }, svg, n); });
  E('line', { x1: 0, x2: W, y1: cy, y2: cy, stroke: 'currentColor', opacity: 0.4 }, svg);
  E('line', { x1: cx, x2: cx, y1: 0, y2: H, stroke: 'currentColor', opacity: 0.4 }, svg);
  [['← Economic left (collective ownership, equality)', 6, cy - 6, 'start'], ['Economic right (markets, private property) →', W - 6, cy - 6, 'end']].forEach(([t, x, y, a]) => E('text', { x, y, 'font-size': 10, 'text-anchor': a, fill: 'currentColor', opacity: 0.7 }, svg, t));
  E('text', { x: cx, y: 30, 'text-anchor': 'middle', 'font-size': 10, fill: 'currentColor', opacity: 0.7 }, svg, '↑ More state authority');
  E('text', { x: cx, y: H - 24, 'text-anchor': 'middle', 'font-size': 10, fill: 'currentColor', opacity: 0.7 }, svg, '↓ More individual liberty');
  const info = h('div', { class: 'card' }, h('p', { class: 'small muted', style: { margin: 0 } }, 'Tap a dot to read about that tradition.'));
  M.ideologies.forEach((i) => {
    const x = cx + i.x * s, y = cy - i.y * s;
    const gg = E('g', { style: 'cursor:pointer' }, svg);
    gg.addEventListener('click', () => { info.innerHTML = ''; info.style.borderTop = `5px solid ${i.c}`; info.append(h('h3', { style: { marginTop: 0 } }, i.e + ' ' + i.n), ideologyDetail(i)); });
    E('circle', { cx: x, cy: y, r: 9, fill: i.c, stroke: '#fff', 'stroke-width': 2 }, gg);
    const right = i.x > 4 || ['fascism', 'socdem', 'socialism'].includes(i.id);
    E('text', { x: x + (right ? -12 : 12), y: y + 4, 'font-size': 10.5, 'font-weight': 700, 'text-anchor': right ? 'end' : 'start', fill: 'currentColor' }, gg, i.short || i.n);
  });
  const me = E('g', { style: 'display:none' }, svg);
  E('circle', { r: 11, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, me);
  E('text', { y: -15, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: 'currentColor' }, me, 'You');

  const ans = QUIZ.map(() => 0);
  const result = h('div', { class: 'small', style: { marginTop: '8px' } });
  const quiz = h('div', { class: 'stack' }, QUIZ.map(([q], k) => h('div', { class: 'row', style: { justifyContent: 'space-between', gap: '6px' } }, h('span', { class: 'small', style: { flex: '1 1 260px' } }, q),
    h('select', { onchange: (ev) => { ans[k] = +ev.target.value; } }, [['0', 'Neutral / unsure'], ['2', 'Strongly agree'], ['1', 'Agree'], ['-1', 'Disagree'], ['-2', 'Strongly disagree']].map(([v, n]) => h('option', { value: v }, n))))));
  const calc = h('button', { class: 'btn primary sm', onclick: () => {
    let x = 0, y = 0; QUIZ.forEach(([, ax, d], k) => { if (ax === 'x') x += ans[k] * d; else y += ans[k] * d; });
    x = x * 10 / 16; y = y * 10 / 16;
    me.style.display = ''; me.setAttribute('transform', `translate(${cx + x * s},${cy - y * s})`);
    const near = M.ideologies.map((i) => [i, Math.hypot(i.x - x, i.y - y)]).sort((p, q) => p[1] - q[1]).slice(0, 3).map((p) => p[0]);
    result.innerHTML = '';
    result.append(h('p', null, `Your position: economic ${x.toFixed(1)}, authority ${y.toFixed(1)}. Closest traditions on this map: `, ...near.map((i, k) => h('span', null, k ? ', ' : '', h('b', { style: { color: i.c } }, i.n)))),
      h('p', { class: 'muted' }, 'This is only a reflection tool: two axes cannot capture a person’s views, and the closest dot is not a label. The most useful next step is to read the strongest critics of the traditions nearest you.'),
      h('button', { class: 'btn sm', onclick: () => Lab.ask(`My answers on a two-axis political map put me at economic ${x.toFixed(1)} (−10 left, +10 right) and authority ${y.toFixed(1)} (−10 libertarian, +10 authoritarian), nearest ${near.map((i) => i.n).join(', ')}. Without telling me what to believe, show me the strongest arguments against my likely positions, what evidence each side relies on, and which of my views might be in tension with each other.`, 'Where I stand') }, '✦ Challenge my views'));
  } }, 'Place me on the map');
  el.append(
    h('div', { class: 'card' }, h('p', { class: 'small', style: { marginTop: 0 } }, 'A two-axis map: left–right on economics, and authority vs liberty. Placements are approximate and contested; they show the main tendency of each tradition, not every thinker. Fascism’s economic placement is especially disputed (it kept private property but subordinated it to the state).'),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } }, h('div', { class: 'viz', style: { padding: '6px', color: 'var(--ink)' } }, svg), info)),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Other ways to draw the spectrum'),
      h('ul', { class: 'small', style: { margin: '0 0 0 18px', lineHeight: 1.6 } },
        h('li', null, h('b', null, 'The original line (1789). '), 'In the French Assembly, supporters of the king sat on the right and radicals on the left. Left meant change and equality; right meant order and tradition. The words have shifted meaning ever since.'),
        h('li', null, h('b', null, 'The horseshoe. '), 'The far left and far right bend toward each other in methods (dictatorship, violence, cults of personality). Popular but criticized by many political scientists as ignoring their opposite goals.'),
        h('li', null, h('b', null, 'The Nolan chart (1969). '), 'Economic freedom vs personal freedom, designed by a libertarian; similar to the map above.'),
        h('li', null, h('b', null, 'Three or more axes. '), 'Researchers add cultural or nationalist vs cosmopolitan axes (e.g. Kitschelt, Norris and Inglehart): today’s politics often splits on culture and globalization more than on economics.'))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Where do you stand? (for self-reflection)'), h('p', { class: 'small muted' }, 'Sixteen statements. Your answers stay on this page; nothing is saved or sent unless you press the tutor button.'), quiz, h('div', { style: { marginTop: '10px' } }, calc), result));
}

function claimsTab(el) {
  el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { margin: 0 } }, 'Each side cites data. Here are the comparisons they use most, with the caveats their opponents raise. Open the chart, add your own countries, and ask the tutor to explain what you see.')),
    h('div', { class: 'grid g2' }, M.tests.map((t) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, t.t), h('p', { class: 'small' }, t.claim), t.caveat ? h('p', { class: 'small muted' }, '⚖️ Caveat: ' + t.caveat) : null,
      h('div', { class: 'row', style: { gap: '6px' } }, dataBtn(t, 'Open the chart'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Help me test this claim with evidence: "${t.t}". ${t.claim} Caveat raised by critics: ${t.caveat} What does the data actually show, what can it not show, and what do the best scholars on different sides conclude?`, t.t) }, '✦ Test it with the tutor'))))));
}

function gameTab(el) {
  const pool = []; M.events.forEach((e) => Object.entries(e.L).forEach(([k, v]) => { if (v && v.length > 40) pool.push([e, k, v]); }));
  let score = 0, n = 0;
  const card = h('div', { class: 'card' }), sc = h('div', { class: 'kpi' });
  function next() {
    const [e, k, v] = pool[Math.floor(Math.random() * pool.length)];
    const others = M.lenses.map((l) => l.id).filter((x) => x !== k && e.L[x]).sort(() => Math.random() - 0.5).slice(0, 3);
    const fill = M.lenses.map((l) => l.id).filter((x) => x !== k && !others.includes(x)).sort(() => Math.random() - 0.5);
    const choices = [k, ...others, ...fill].slice(0, 4).sort(() => Math.random() - 0.5);
    card.innerHTML = '';
    const fb = h('div', { style: { marginTop: '10px' } });
    let done = false;
    card.append(h('div', { class: 'tiny muted' }, `${e.t} (${yr(e)})`), h('p', { style: { fontSize: '17px' } }, '“' + v + '”'), h('p', { class: 'small muted' }, 'Which tradition reads the event this way?'),
      h('div', { class: 'grid g2' }, choices.map((c) => { const b = h('button', { class: 'btn', style: { justifyContent: 'flex-start' }, onclick: () => {
        if (done) return; done = true; n++; if (c === k) { score++; b.style.background = '#16A34A33'; Lab.addXP && Lab.addXP(2, 'lens game'); } else { b.style.background = '#DC262633'; }
        sc.textContent = `${score} / ${n}`;
        fb.append(h('p', { class: 'small' }, c === k ? '✅ Right. ' : '❌ Not quite. ', 'That was the ', lensTag(k), ' reading. ', LENS[k].frame),
          h('div', { class: 'row', style: { gap: '6px' } }, h('button', { class: 'btn sm primary', onclick: next }, 'Next →'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`In the "which side said it" game, this reading of "${e.t}" was the ${LENS[k].n} view: "${v}". Explain the reasoning behind it, what evidence it relies on, and how the other traditions would answer it.`, e.t) }, '✦ Unpack this view'))); } }, LENS[c].e + ' ' + LENS[c].n); return b; })), fb);
  }
  el.append(h('div', { class: 'card' }, h('div', { class: 'row' }, h('p', { class: 'small', style: { margin: 0, flex: 1 } }, 'Learn to recognize each tradition’s framing, a key skill for seeing through propaganda. Read an interpretation and guess which side it comes from.'), sc)), card);
  sc.textContent = '0 / 0'; next();
}

function peopleTab(el) {
  const map = new Map();
  M.ideologies.forEach((i) => i.thinkers.forEach(([n, life, w]) => { const r = map.get(n) || { n, life, tags: new Set(), ev: new Set(), w }; r.tags.add(i.n); map.set(n, r); }));
  M.events.forEach((e) => (e.who || []).forEach((n) => { const r = map.get(n) || { n, tags: new Set(), ev: new Set() }; r.ev.add(e.t); map.set(n, r); }));
  const all = [...map.values()].sort((a, b) => a.n.split(' ').pop().localeCompare(b.n.split(' ').pop()));
  let q = '';
  const list = h('div', { class: 'grid g3' });
  function draw() {
    list.innerHTML = '';
    all.filter((p) => !q || (p.n + [...p.tags, ...p.ev].join(' ')).toLowerCase().includes(q)).forEach((p) => list.append(h('div', { class: 'card', style: { padding: '12px 14px' } },
      h('div', { class: 'row', style: { gap: '10px', alignItems: 'center' } }, Lab.MODERN.thumb('p:' + p.n), h('div', null, h('b', null, p.n), p.life ? h('div', { class: 'tiny muted' }, p.life) : null)),
      p.tags.size ? h('div', { class: 'tiny', style: { marginTop: '4px' } }, 'Tradition: ' + [...p.tags].join(', ')) : null,
      p.ev.size ? h('div', { class: 'tiny muted', style: { marginTop: '2px' } }, 'In: ' + [...p.ev].slice(0, 3).join(' · ')) : null,
      h('div', { class: 'row', style: { marginTop: '6px', gap: '6px' } },
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Who was ${p.n}? What did they believe and do, what shaped them, and how do supporters and critics across the political spectrum judge them? Separate documented facts from interpretation and propaganda.`, p.n) }, '✦ Who were they?'),
        h('a', { class: 'btn sm', href: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(p.n.split(' / ')[0].replace(/ /g, '_')), style: { textDecoration: 'none' } }, 'Wikipedia ↗')))));
  }
  el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { marginTop: 0 } }, `${all.length} thinkers, leaders, rebels and victims who appear in this module.`), h('input', { type: 'text', placeholder: 'Search people…', oninput: (ev) => { q = ev.target.value.toLowerCase(); draw(); } })), list);
  draw();
}

function sourcesTab(el) {
  const byIdeo = M.ideologies.map((i) => [i, [...new Set(i.read.concat(i.thinkers.map((t) => t[2])).map(book).filter(Boolean))]]).filter(([, b]) => b.length);
  const evBooks = [...new Set(M.events.flatMap((e) => (e.bk || []).map(book)).filter(Boolean))];
  const docIds = [...new Set(M.events.flatMap((e) => e.dc || []))];
  const docBox = h('div', { class: 'stack' });
  loadDocs().then((D) => { docIds.map((id) => D[id]).filter(Boolean).sort((a, b) => a.y - b.y).forEach((m) => docBox.append(h('div', { class: 'row', style: { cursor: 'pointer' }, onclick: () => Lab.openDoc(m) }, h('b', { style: { minWidth: '50px', fontFamily: 'Space Grotesk' } }, m.y), h('span', { class: 'small' }, '📜 ' + m.t.replace(/^The Avalon Project at Yale Law School /, ''))))); });
  el.append(
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'The founding texts of each tradition, readable in the Lab'),
      ...byIdeo.map(([i, bs]) => h('div', { style: { margin: '8px 0' } }, h('div', { class: 'small', style: { fontWeight: 700, color: i.c } }, i.e + ' ' + i.n), h('div', { class: 'row', style: { gap: '6px', marginTop: '4px' } }, bs.map((b) => h('a', { class: 'chip', href: '#reading-library-' + b.id, style: { textDecoration: 'none', color: 'inherit', '--c': i.c } }, '📖 ' + b.t))))),
      h('p', { class: 'tiny muted' }, 'Modern works (Hayek, Friedman, Keynes’s General Theory, Arendt, Hobsbawm, Paxton and others) are still under copyright; borrow them free with a library card through Libby, or ask the tutor to explain their arguments.')),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Eyewitnesses and contemporaries'), h('div', { class: 'row', style: { gap: '6px' } }, evBooks.map((b) => h('a', { class: 'chip', href: '#reading-library-' + b.id, style: { textDecoration: 'none', color: 'inherit', '--c': '#7C3AED' } }, '📖 ' + b.t)))),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, `Primary documents (${docIds.length})`), h('p', { class: 'small muted' }, 'Treaties, declarations, speeches and laws from the Avalon Project. Read what people actually wrote, not what others say they wrote.'), docBox),
    h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Modern historians to look for, across the spectrum'),
      h('ul', { class: 'small', style: { margin: '0 0 0 18px', lineHeight: 1.6 } },
        h('li', null, h('b', null, 'Marxist and left: '), 'Eric Hobsbawm (the Age of… series), E. P. Thompson, C. L. R. James, Walter Rodney, David Harvey, Mike Davis.'),
        h('li', null, h('b', null, 'Liberal: '), 'Joel Mokyr, Deirdre McCloskey, Steven Pinker, Daron Acemoglu and James Robinson, Niall Ferguson (center-right), Timothy Snyder.'),
        h('li', null, h('b', null, 'Conservative: '), 'Edmund Burke, Russell Kirk, Robert Conquest, Richard Pipes, Roger Scruton.'),
        h('li', null, h('b', null, 'On fascism: '), 'Robert Paxton, Stanley Payne, Roger Griffin, Ian Kershaw, Adam Tooze, Richard Evans.'),
        h('li', null, h('b', null, 'On communism: '), 'Stephen Kotkin, Sheila Fitzpatrick, Orlando Figes, Anne Applebaum, Frank Dikötter, Yang Jisheng.'),
        h('li', null, h('b', null, 'Global South: '), 'Amartya Sen, Kenneth Pomeranz, Sven Beckert, Utsa Patnaik, Tirthankar Roy, Rashid Khalidi.'))));
}

Lab.explorer('history', 'modern', {
  mount(el, arg) {
    const [sub0, ...rest] = (arg || '').split('-');
    let sub = SUBS.find(([k]) => k === sub0) ? sub0 : 'start';
    const tabs = h('div', { class: 'card', style: { padding: '10px 12px' } });
    const body = h('div', { class: 'stack' });
    const go = (k, a) => { sub = k; history.replaceState(null, '', '#history-modern-' + k + (a ? '-' + a : '')); render(a); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };
    function render(a) {
      tabs.innerHTML = ''; body.innerHTML = '';
      const tabBtn = ([k, n]) => h('button', { class: 'tab' + (k === sub ? ' on' : ''), style: { padding: '6px 11px', fontSize: '13px' }, onclick: () => go(k) }, n);
      const cur = SUBS.find(([k]) => k === sub); const grp = (Lab.MODERN.GROUPS || []).find((g) => g[2].includes(sub));
      const menu = h('div', { style: { display: sub === 'start' ? 'block' : 'none', marginTop: sub === 'start' ? 0 : '10px' } });
      if (sub !== 'start') tabs.append(h('div', { class: 'row', style: { gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
        h('a', { href: '#history-modern', class: 'tiny', onclick: (e) => { e.preventDefault(); go('start'); } }, 'Modern world'), h('span', { class: 'tiny muted' }, '›'),
        grp ? h('span', { class: 'tiny muted' }, grp[1]) : null, grp ? h('span', { class: 'tiny muted' }, '›') : null, h('b', { class: 'small' }, cur ? cur[1] : ''),
        h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: (e) => { const open = menu.style.display === 'none'; menu.style.display = open ? 'block' : 'none'; e.target.textContent = open ? 'Hide topics ▴' : 'All topics ▾'; } }, 'All topics ▾')));
      tabs.append(menu);
      if (Lab.MODERN.GROUPS) {
        const seen = new Set();
        Lab.MODERN.GROUPS.forEach(([e, g, keys]) => { const items = keys.map((k) => SUBS.find(([x]) => x === k)).filter(Boolean); items.forEach(([k]) => seen.add(k)); menu.append(h('div', { class: 'row', style: { gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' } }, h('span', { class: 'tiny muted', style: { minWidth: '150px', fontWeight: 700 } }, e + ' ' + g), ...items.map(tabBtn))); });
        const rest = SUBS.filter(([k]) => !seen.has(k)); if (rest.length) menu.append(h('div', { class: 'row', style: { gap: '6px' } }, ...rest.map(tabBtn)));
      } else SUBS.forEach((x) => menu.append(tabBtn(x)));
      Lab.setContext(`History → Modern world through the spectrum → ${SUBS.find(([k]) => k === sub)[1]}`);
      ({ start: () => startTab(body, go), timeline: () => timelineTab(body, a), ideologies: () => ideologiesTab(body, a), compare: () => compareTab(body), spectrum: () => spectrumTab(body), claims: () => claimsTab(body), game: () => gameTab(body), people: () => peopleTab(body), sources: () => sourcesTab(body), ...Object.fromEntries(Object.entries(Lab.MODERN.render).map(([k, f]) => [k, () => f(body, a, go)])) })[sub]();
    }
    Lab.MODERN.go = go;
    el.append(tabs, body);
    render(rest.join('-'));
  },
});
const S = Lab.subject('history');
if (S && !S.ex.find(([e]) => e === 'modern')) S.ex.unshift(['modern', 'Modern world through the spectrum']);
