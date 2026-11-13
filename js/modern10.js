// Modern world module, part 10: the Korean War told whole (model multi-perspective case) and
// "One event, many tellings" for major events. Data: korea-data.js (Lab.KOREA), sides-data.js (Lab.SIDES).
const h = Lab.h;
const M = Lab.MODERN;
const K = Lab.KOREA;
const at = M.SUBS.findIndex(([k]) => k === 'uspower');
M.SUBS.splice(at >= 0 ? at + 1 : M.SUBS.length, 0, ['koreawar', 'The Korean War: the whole story'], ['sides', 'One event, many tellings']);
const grp = M.GROUPS.find((g) => g[2].includes('uspower') || g[2].includes('warmyths'));
if (grp) { const i = grp[2].indexOf('uspower'); grp[2].splice(i >= 0 ? i + 1 : grp[2].length, 0, 'koreawar', 'sides'); }

const card = (...kids) => h('div', { class: 'card' }, ...kids);
const link = ([label, url]) => h('a', { href: url, target: '_blank', rel: 'noopener', class: 'small', style: { display: 'block', margin: '3px 0' } }, '📄 ' + label + ' ↗');
const verdictColor = (v) => ({ True: '#15803D', False: '#DC2626', Misleading: '#EA580C', 'Probably false': '#EA580C', Unproven: '#CA8A04', Contested: '#7C3AED' }[v] || '#475569');

const SECTIONS = [['start', '🧭 The short honest version'], ['story', '📜 1894–1953 step by step'], ['decision', '🗂️ The decision in the documents'], ['sides', '🗣️ How each side tells it'], ['standard', '⚖️ Same standard for both Koreas'], ['claims', '🔎 Test the claims'], ['numbers', '📊 The human cost'], ['archives', '🎞️ Films, documents, archives']];
const R = {};

R.start = (el, go) => {
  el.append(card(h('h2', { style: { marginTop: 0 } }, 'The Korean War: the whole story'),
    h('p', { class: 'small muted' }, 'Wars do not start out of nowhere. Real people facing real conditions make choices. Here is the war with its causes, its decision-makers, its victims on every side, and how each country tells it, with the documents so you can check.'),
    h('ol', { class: 'small', style: { lineHeight: 1.75 } }, K.short.map((p) => h('li', null, p))),
    M.figure('kw:soviet1945', { max: '360px' }),
    h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, 'What this Lab got wrong before, and fixed: '), h('span', { class: 'small' }, 'Earlier pages said “North Korea invaded the South” and stopped there. That sentence is true, but alone it misleads: it hides a division imposed without Koreans’ consent, two occupations, years of killing on both sides and a southern government that also wanted war. Leaving out conditions is one of the most common ways true facts are used to tell a false story.')),
    h('div', { class: 'row', style: { gap: '6px', marginTop: '8px' } }, SECTIONS.slice(1).map(([k, n]) => h('button', { class: 'btn sm', onclick: () => go(k) }, n)))));
};

R.story = (el) => {
  let per = 'all'; let i = 0;
  const list = () => K.timeline.filter((s) => per === 'all' || s[0] === per);
  const chips = h('div', { class: 'row', style: { gap: '6px' } });
  const box = h('div');
  const draw = () => {
    const L = list(); i = Math.max(0, Math.min(i, L.length - 1)); const [, y, t, what, cond, actors, conf, src, docs, img] = L[i];
    box.innerHTML = '';
    box.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${i + 1} of ${L.length} · ${y}`), Lab.conf(conf)), h('h2', { style: { margin: '4px 0 8px' } }, t), img ? M.figure(img, { max: '380px' }) : null,
      h('p', { class: 'small' }, what),
      h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', { class: 'small' }, '🧍 The conditions people faced: '), h('span', { class: 'small' }, cond)),
      h('div', { class: 'tiny', style: { marginTop: '6px' } }, h('b', null, 'Who acted: '), actors),
      Lab.source('Source: ' + src), docs.length ? h('div', { style: { marginTop: '6px' } }, h('div', { class: 'tiny', style: { fontWeight: 700 } }, 'Read the documents yourself:'), docs.map(link)) : null,
      h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn sm', disabled: i === 0, onclick: () => { i--; draw(); } }, '← Earlier'), h('button', { class: 'btn sm primary', disabled: i === L.length - 1, onclick: () => { i++; draw(); } }, 'Later →'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Korean history, ${y}: "${t}". Explain this step from the points of view of Koreans in the North and South, the US, the USSR and China. What conditions were people facing, what did each actor want, and which sources (with their funders and biases) support each account?`, t) }, '✦ Every side’s view'))));
  };
  [['all', 'All'], ...K.periods].forEach(([k, n]) => chips.append(h('span', { class: 'chip' + (k === per ? ' on' : ''), onclick: (e) => { per = k; i = 0; chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('on')); e.target.classList.add('on'); draw(); } }, n)));
  // A strip showing the whole timeline at a glance
  const strip = h('div', { style: { display: 'flex', gap: '2px', margin: '8px 0', overflowX: 'auto' } }, K.timeline.map((s, j) => h('div', { title: s[1] + ': ' + s[2], onclick: () => { per = 'all'; i = j; draw(); }, style: { flex: '1 0 18px', height: '22px', borderRadius: '4px', cursor: 'pointer', background: { roots: '#94A3B8', division: '#2563EB', violence: '#EA580C', decision: '#7C3AED', war: '#DC2626' }[s[0]] } })));
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'Step by step, 1894–1953'), h('p', { class: 'small muted' }, 'Grey: roots · Blue: division · Orange: violence before the war · Purple: the decision · Red: the war. Click any block.'), strip, chips), box);
  draw();
};

R.decision = (el) => {
  const steps = K.timeline.filter((s) => s[0] === 'decision' || (s[0] === 'violence' && /border war|occupiers leave/.test(s[2])));
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'How the decision was made: the communist side’s own documents'),
    h('p', { class: 'small' }, 'For forty years the question “who started it?” was argued from public statements. After 1991 Russia released Soviet cables, and China published some of Mao’s and Zhou Enlai’s telegrams. These were internal documents written to make decisions, not propaganda written to persuade, which is why historians treat them as the strongest evidence. They show a sequence: Kim asks, Stalin refuses (1949), circumstances change, Stalin agrees on condition Mao agrees (1950), Mao agrees, Soviet officers help draft the plan.'),
    h('p', { class: 'small' }, 'They also show the context: Kim’s requests followed a year of border fighting in which southern forces attacked too, and Moscow asked Kim what the Americans would do “in case of an attack by the northerners.” The documents do not show a South Korean plan to invade in June 1950. US records show Washington refused Rhee the weapons he would have needed.'),
    h('div', { class: 'tiny muted' }, 'How to read them critically: they are selected releases (Russia chose what to give, and some came via a 1994 gift from Yeltsin to South Korea); ambassadors reported what Moscow wanted to hear; translations were made by a US-funded project. But no serious historian, Russian, Chinese, Korean or Western, now disputes their authenticity on this point.')),
    h('div', { class: 'stack' }, steps.map(([, y, t, what, cond, , conf, src, docs]) => card(h('div', { class: 'row' }, h('b', null, y + ' · ' + t), Lab.conf(conf)), h('p', { class: 'small' }, what), h('p', { class: 'tiny muted' }, cond), Lab.source('Source: ' + src), docs.map(link)))));
};

R.sides = (el) => {
  const grid = h('div', { class: 'grid g2', style: { alignItems: 'start' } });
  K.sides.forEach(([who, flag, name, story, right, omit, why]) => grid.append(card(h('div', { style: { fontSize: '26px' } }, flag), h('h3', { style: { margin: '2px 0' } }, who), h('div', { class: 'tiny muted' }, 'Calls it: ' + name),
    h('p', { class: 'small' }, h('b', null, 'Their story: '), story), h('p', { class: 'small', style: { color: '#15803D' } }, h('b', null, '✓ What it gets right: '), right), h('p', { class: 'small', style: { color: '#B45309' } }, h('b', null, '✗ What it leaves out: '), omit), h('p', { class: 'tiny muted' }, h('b', null, 'Why they tell it this way: '), why))));
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'How each side tells it'), h('p', { class: 'small' }, 'Every national story here contains true facts. Every one also leaves out facts that hurt its side. The pattern is the lesson: the truest account is built from what each side’s story leaves out, checked against the evidence.')), grid);
};

R.standard = (el) => {
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'The same questions for both Korean states'), h('p', { class: 'small muted' }, 'A fair account asks the same questions of both sides and accepts the answers wherever they fall.'),
    h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', width: '100%' } }, h('tr', null, ['Question', '🇰🇷 South (Republic of Korea)', '🇰🇵 North (DPRK)'].map((t) => h('th', { style: { textAlign: 'left', padding: '6px', borderBottom: '2px solid var(--line)' } }, t))), K.standard.map((r) => h('tr', null, r.map((c, j) => h('td', { style: { padding: '6px', borderBottom: '1px solid var(--line)', fontWeight: j ? 400 : 600, verticalAlign: 'top' } }, c)))))),
    h('p', { class: 'small', style: { marginTop: '8px' } }, 'Read row by row, the two states were alike in more ways than either side’s story admits: both were created under foreign occupation, both jailed and killed opponents, both wanted to unify by force. They differed on the decisive act of 25 June 1950, and later in where their paths led.'),
    h('button', { class: 'btn sm primary', onclick: () => Lab.ask('Compare South Korea under Syngman Rhee and North Korea under Kim Il-sung from 1945 to 1960 using the same standards: political prisoners, killings, land reform, elections, dependence on foreign powers, living standards. Use sources from South Korea, North Korea, the US, Russia and China and say who funds each.', 'Korea 1945–60') }, '✦ Compare in more depth')));
};

R.claims = (el) => {
  let i = 0, score = 0; const box = h('div');
  const opts = ['True', 'False', 'Misleading', 'Contested'];
  const ask = () => {
    box.innerHTML = ''; if (i >= K.claims.length) { box.append(card(h('h3', null, `You matched ${score} of ${K.claims.length} verdicts`), h('p', { class: 'small' }, 'Most wrong answers come from knowing only one side’s story. Notice how many claims are “misleading”: true in part, false by omission.'), h('button', { class: 'btn sm', onclick: () => { i = 0; score = 0; ask(); } }, 'Again'))); return; }
    const [claim, verdict, conf, why] = K.claims[i]; const res = h('div');
    const norm = (v) => (v === 'Probably false' ? 'False' : v === 'Unproven' ? 'Contested' : v);
    box.append(card(h('div', { class: 'tiny muted' }, `Claim ${i + 1} of ${K.claims.length}`), h('h3', null, '“' + claim + '”'), h('div', { class: 'row', style: { gap: '6px' } }, opts.map((o) => h('button', { class: 'btn sm', onclick: () => { if (res.childNodes.length) return; const ok = norm(verdict) === o; if (ok) score++; res.append(h('div', { style: { marginTop: '8px' } }, h('b', { style: { color: verdictColor(verdict) } }, (ok ? '✓ ' : '✗ ') + 'Verdict: ' + verdict + ' '), Lab.conf(conf), h('p', { class: 'small' }, why), h('button', { class: 'btn sm primary', onclick: () => { i++; ask(); } }, 'Next →'))); } }, o))), res));
  };
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'Test the claims'), h('p', { class: 'small muted' }, 'Common claims about the Korean War from all sides. Decide, then see the evidence.')), box); ask();
};

R.numbers = (el) => {
  const mx = Math.max(...K.deaths.map((d) => d[2]));
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'Who died: ranges, and who counts'), h('p', { class: 'small muted' }, 'Bars show the range between low and high estimates (thousands). Wide bars mean the counters disagree; ask who is counting and why.'),
    K.deaths.map(([l, lo, hi, , who]) => h('div', { style: { margin: '8px 0' } }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('b', { class: 'small' }, l), h('span', { class: 'small' }, lo === hi ? `${lo}k` : `${lo}k – ${hi}k`)),
      h('div', { style: { position: 'relative', height: '14px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { position: 'absolute', left: (lo / mx) * 100 + '%', width: Math.max(0.8, ((hi - lo) / mx) * 100) + '%', height: '100%', borderRadius: '6px', background: /civilian|before/i.test(l) ? '#DC2626' : '#475569' } })), h('div', { class: 'tiny muted' }, who))),
    h('p', { class: 'small' }, 'The pattern: civilians were the majority of the dead. Governments tend to publish low figures for their own soldiers and high figures for the enemy’s; Chinese official figures are below Western estimates, while some early US estimates of Chinese losses were inflated. North Korea has published no reliable figures.'),
    M.figure('kw:bombing', { max: '380px' })));
};

R.archives = (el) => {
  el.append(card(h('h3', { style: { marginTop: 0 } }, 'Watch and read the evidence yourself'), h('p', { class: 'small muted' }, 'Film shot at the time, government documents from every side, and the archives historians use. Links open the original archives.'), K.archives.map(([n, u, d]) => h('div', { style: { margin: '8px 0' } }, link([n, u]), h('div', { class: 'tiny muted' }, d)))),
    card(h('h3', { style: { marginTop: 0 } }, 'Photographs'), h('div', { class: 'grid g2' }, ['kw:soviet1945', 'kw:usarrive', 'kw:trustee', 'kw:election1948', 'kw:seoul1950', 'kw:refugees', 'kw:inchon', 'kw:chosin', 'kw:bombing', 'kw:armistice'].map((k) => M.figure(k, { max: '320px' })))));
};

M.render.koreawar = (el) => {
  const panel = h('div', { class: 'stack' });
  const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const go = (k) => { nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; R[k](panel, go); };
  SECTIONS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, onclick: () => go(k) }, n)));
  el.append(h('div', { class: 'card' }, nav), panel);
  go('start');
};

// ---------- One event, many tellings ----------
M.render.sides = (el) => {
  const S = Lab.SIDES; let cur = 0;
  const chips = h('div', { class: 'row', style: { gap: '6px' } }); const box = h('div');
  const draw = () => {
    const [, t, yrs, region, und, cond, sides, settles, open, conf, labLink] = S[cur];
    box.innerHTML = '';
    box.append(card(h('div', { class: 'row' }, h('span', { class: 'tiny muted' }, `${yrs} · ${region}`), Lab.conf(conf)), h('h2', { style: { margin: '4px 0 8px' } }, t),
      h('div', { class: 'card', style: { boxShadow: 'none', background: 'rgba(22,163,74,.13)' } }, h('b', { class: 'small' }, '✓ What no serious historian disputes: '), h('span', { class: 'small' }, und)),
      h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', marginTop: '8px' } }, h('b', { class: 'small' }, '🧍 The conditions beforehand: '), h('span', { class: 'small' }, cond)),
      h('h3', null, 'How each side tells it'),
      h('div', { class: 'grid g2', style: { alignItems: 'start' } }, sides.map(([who, story, omits]) => h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, h('b', null, who), h('p', { class: 'small', style: { margin: '4px 0' } }, story), h('p', { class: 'tiny', style: { color: '#B45309', margin: 0 } }, h('b', null, 'Leaves out: '), omits)))),
      h('p', { class: 'small' }, h('b', null, '🔍 Evidence that settles what can be settled: '), settles), h('p', { class: 'small' }, h('b', null, '❓ Still argued: '), open),
      h('div', { class: 'row' }, labLink ? h('button', { class: 'btn sm', onclick: () => M.go(labLink) }, 'Open the full case →') : null, h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`For "${t}" (${yrs}), give me the strongest version of each side's account, the primary documents and data that test each one, who funds the main sources on each side, and what each side leaves out.`, t) }, '✦ Go deeper with the tutor'))));
  };
  S.forEach(([, t], j) => chips.append(h('span', { class: 'chip' + (j === 0 ? ' on' : ''), onclick: (e) => { cur = j; chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('on')); e.target.classList.add('on'); draw(); } }, t)));
  el.append(card(h('h2', { style: { marginTop: 0 } }, 'One event, many tellings'), h('p', { class: 'small' }, 'Each major event below starts with what nobody serious disputes, then the conditions people faced beforehand, then how each side tells the story and what each leaves out. The goal is not to split the difference between sides, but to find the account that survives all the evidence.'), chips), box);
  draw();
};
