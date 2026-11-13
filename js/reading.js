const { h } = Lab;

const BOOKS = [
  { id: 'constitution', t: 'The Constitution of the United States', a: 'The Framers', y: 1787, c: '#1D4ED8', tag: 'Politics', start: 'Article 1',
    why: 'The operating system of the US government, and the core of GED Social Studies. Short enough to read in an hour.',
    who: 'Written in secret by 55 delegates, mostly wealthy lawyers, merchants and planters; nearly half owned enslaved people. Historian Charles Beard (1913) argued their property interests shaped it; later historians such as Forrest McDonald showed the delegates’ interests were too mixed for Beard’s simple version.',
    against: 'The Anti-Federalists (writing as “Brutus” and “Federal Farmer”) warned it gave the central government too much power; their pressure produced the Bill of Rights.',
    qs: ['What powers does Article I give Congress that the states lost?', 'Where is slavery accommodated without the word “slave”?', 'Which parts would a 1787 small farmer have liked or feared?'] },
  { id: 'federalist', t: 'The Federalist Papers', a: 'Hamilton, Madison & Jay', y: 1788, c: '#2563EB', tag: 'Politics', start: 'FEDERALIST No. 10',
    why: 'The best explanation of why the Constitution is built the way it is. Start with No. 10 (factions) and No. 51 (checks and balances).',
    who: 'Newspaper essays written under the pen name “Publius” to persuade New Yorkers to ratify. They are advocacy, not neutral analysis: the authors wanted a stronger central government and played down its risks.',
    against: 'Anti-Federalist “Brutus I” argued a large republic could not stay free and would drift toward rule by the few.',
    qs: ['What is Madison’s cure for faction: removing its causes or controlling its effects?', 'Why does he think a large republic is safer than a small one?', 'Was he right about political parties?'] },
  { id: 'commonsense', t: 'Common Sense', a: 'Thomas Paine', y: 1776, c: '#DC2626', tag: 'Politics', start: 'OF MONARCHY',
    why: 'The pamphlet that moved ordinary colonists from protest to independence, in plain, punchy English.',
    who: 'Paine had arrived from England barely a year earlier. It was propaganda in the original sense: written to persuade fast. Claims it sold 500,000 copies are likely exaggerated; scholars think tens of thousands to around 100,000 is more realistic.',
    against: 'Loyalists like Charles Inglis replied that independence would bring war, ruin and anarchy, and that reconciliation was possible.',
    qs: ['What rhetorical tricks does Paine use against monarchy?', 'Which arguments are about principle, which about economic interest?'] },
  { id: 'locke', t: 'Second Treatise of Government', a: 'John Locke', y: 1689, c: '#059669', tag: 'Philosophy', start: 'OF THE STATE OF NATURE',
    why: 'Natural rights, consent of the governed, the right to overthrow a tyrant: the ideas behind the Declaration of Independence.',
    who: 'Published right after England’s Glorious Revolution, which it helped justify. Locke was an ally of the Whig opposition, and also invested in the Royal African Company, a slave-trading firm: a contradiction historians still discuss.',
    against: 'Thomas Hobbes (also on this shelf) argued people need an all-powerful ruler; Robert Filmer argued kings rule by divine right.',
    qs: ['How does Locke say private property begins?', 'When, for Locke, may people rebel?'] },
  { id: 'leviathan', t: 'Leviathan', a: 'Thomas Hobbes', y: 1651, c: '#334155', tag: 'Philosophy', start: 'CHAPTER XIII',
    why: 'The classic case for strong government: without it, life is “solitary, poore, nasty, brutish, and short.”',
    who: 'Written in exile during and after the English Civil War, which colored his fear of chaos. Royalists and Parliamentarians both distrusted it.',
    against: 'Locke answered that an absolute ruler is a greater danger than the state of nature.',
    qs: ['Why does Hobbes think people would agree to an absolute sovereign?', 'Where do you see his logic in modern debates about security vs liberty?'] },
  { id: 'wealth', t: 'The Wealth of Nations', a: 'Adam Smith', y: 1776, c: '#10B981', tag: 'Economics', start: 'CHAPTER I. OF THE DIVISION OF LABOUR',
    why: 'The founding book of economics: division of labor, markets, the critique of trade monopolies. Read Book I, chapters 1–3, first.',
    who: 'Smith was a moral philosopher, not a business lobbyist. He distrusted merchants who used government for monopolies, a point often left out by people who quote him for free markets.',
    against: 'Friedrich List (1841) argued young industries need protection before free trade; Marx (also here) argued markets exploit labor.',
    qs: ['Why does the pin factory example matter?', 'What does Smith say about merchants meeting together?'] },
  { id: 'manifesto', t: 'The Communist Manifesto', a: 'Karl Marx & Friedrich Engels', y: 1848, c: '#B91C1C', tag: 'Economics', start: 'I. BOURGEOIS AND PROLETARIANS',
    why: 'Possibly the most influential pamphlet ever written. You can’t understand the 20th century, from the USSR to China, without it.',
    who: 'Commissioned by the Communist League as a party program, written fast during a year of revolutions. Engels was the son of a textile-factory owner and managed the family mill in Manchester.',
    against: 'Eugen Böhm-Bawerk (1896) attacked the labor theory of value; Ludwig von Mises (1920) argued socialist planning can’t calculate prices. The record of communist states is the biggest test.',
    qs: ['Which predictions came true and which didn’t?', 'What does the Manifesto praise about capitalism? (More than you’d expect.)'] },
  { id: 'mill', t: 'On Liberty', a: 'John Stuart Mill', y: 1859, c: '#7C3AED', tag: 'Philosophy', start: 'OF THE LIBERTY OF THOUGHT',
    why: 'The harm principle and the case for free speech: still the frame for almost every free-speech debate.',
    who: 'Mill worked 35 years for the East India Company and wrote that his principle applied to “civilized” societies, not “backward” ones: a limit worth noticing.',
    against: 'Lord Devlin (1965) argued societies may enforce shared morals; modern critics ask whether speech can cause harm Mill didn’t foresee.',
    qs: ['Give Mill’s three reasons for allowing wrong opinions.', 'Where would Mill draw the line online?'] },
  { id: 'malthus', t: 'An Essay on the Principle of Population', a: 'Thomas Malthus', y: 1798, c: '#A16207', tag: 'Economics', start: 'CHAPTER 1',
    why: 'Population grows faster than food, he said, so misery is inevitable. A brilliant argument that was wrong about the future: compare it with the poverty data in the Economics explorer.',
    who: 'A clergyman arguing against optimists like Godwin and Condorcet. His ideas were used to oppose aid to the poor.',
    against: 'Ester Boserup and Julian Simon argued population pressure drives innovation; the Industrial and Green Revolutions broke the trap.',
    qs: ['Why was his logic so convincing in 1798?', 'What did he fail to imagine?'] },
  { id: 'prince', t: 'The Prince', a: 'Niccolò Machiavelli', y: 1532, c: '#0F766E', tag: 'Politics', start: 'CHAPTER XV',
    why: 'Power as it is, not as it should be. Chapters 15–18 are the famous ones (“better to be feared than loved”).',
    who: 'Written around 1513 after Machiavelli had been jailed, tortured and pushed out of office; he dedicated it to a Medici, hoping for a job. Some readers (Rousseau among them) thought it was secretly satire.',
    against: 'His own Discourses on Livy praise republics; Erasmus’s Education of a Christian Prince argued the opposite approach.',
    qs: ['Is Machiavelli describing politics or recommending it?', 'Name a modern leader who followed chapter 17, and how it worked out.'] },
  { id: 'sunzi', t: 'The Art of War', a: 'Sun Tzu (Sunzi)', y: -500, c: '#991B1B', tag: 'War', start: 'III. ATTACK BY STRATAGEM',
    why: 'The most read strategy book on earth: win without fighting, know yourself and your enemy. Lionel Giles’s 1910 translation with notes.',
    who: 'Traditionally credited to a general of about 500 BC; most scholars think it was compiled over time during the Warring States period.',
    against: 'Clausewitz’s On War (1832) stresses decisive battle and the “fog” of war, a different emphasis worth comparing.',
    qs: ['Which ideas apply to business or trading?', 'Why does Sun Tzu value spies so highly?'] },
  { id: 'thucydides', t: 'History of the Peloponnesian War', a: 'Thucydides', y: -400, c: '#1E40AF', tag: 'War', start: 'Melian',
    why: 'The first great work of political realism. The Melian Dialogue (Book V) is essential reading for anyone who wants to understand power.',
    who: 'An Athenian general exiled after failing to save Amphipolis: he had personal reasons to see events a certain way. He admits that the speeches are his reconstructions.',
    against: 'Graham Allison’s “Thucydides Trap” (2017) applies the book to the US and China; many classicists say he misreads it.',
    qs: ['Who wins the argument at Melos, and who wins the war?', 'Does “the strong do what they can” describe the world today?'] },
  { id: 'republic', t: 'The Republic', a: 'Plato', y: -375, c: '#4F46E5', tag: 'Philosophy', start: 'BOOK VII',
    why: 'Justice, education and the ideal state. Book VII has the Allegory of the Cave, about how hard it is to see reality.',
    who: 'Plato watched Athenian democracy execute his teacher Socrates, which helps explain his distrust of rule by the many.',
    against: 'Karl Popper’s The Open Society and Its Enemies (1945) attacked Plato as an enemy of freedom; Aristotle’s Politics disagrees with him throughout.',
    qs: ['What are the shadows on your own cave wall?', 'Why does Plato want philosophers to rule?'] },
  { id: 'aurelius', t: 'Meditations', a: 'Marcus Aurelius', y: 175, c: '#6D28D9', tag: 'Philosophy', start: 'THE SECOND BOOK',
    why: 'A Roman emperor’s private notebook on handling pressure, people and fear. Stoic philosophy as daily practice.',
    who: 'Never meant to be published, which makes it unusually honest: the most powerful man on earth reminding himself to stay humble.',
    against: 'Critics of Stoicism argue it can become passive acceptance of injustice; Marcus also ran wars and persecutions.',
    qs: ['Which entry would help you on a bad day?', 'What does “the obstacle is the way” really mean here?'] },
  { id: 'douglass', t: 'Narrative of the Life of Frederick Douglass', a: 'Frederick Douglass', y: 1845, c: '#B45309', tag: 'History', start: 'CHAPTER VII',
    why: 'A first-hand account of slavery and of how learning to read became the path to freedom. Chapter VII is the turning point.',
    who: 'Written partly to prove he was who he said: critics claimed an enslaved man could not write so well. Publishing it, with names, put him at risk of capture, and he left for Britain soon after.',
    against: 'Pro-slavery writers like George Fitzhugh claimed enslaved people were better off than Northern workers; Douglass’s account is a direct answer.',
    qs: ['Why did his enslaver forbid him to learn to read?', 'How does Douglass use his enemies’ own words against them?'] },
  { id: 'dubois', t: 'The Souls of Black Folk', a: 'W. E. B. Du Bois', y: 1903, c: '#92400E', tag: 'History', start: 'Of Our Spiritual Strivings',
    why: '“Double consciousness” and the color line. Chapter III is his famous disagreement with Booker T. Washington about how to fight for equality.',
    who: 'The first Black American to earn a Harvard PhD, writing as a scholar and an activist; he later co-founded the NAACP.',
    against: 'Booker T. Washington argued for economic progress first and political rights later; the debate between them still echoes.',
    qs: ['What does Du Bois mean by double consciousness?', 'Whose strategy was right, Washington’s or Du Bois’s? Make the best case for each.'] },
];
Lab.GUIDED = BOOKS;
const libBooks = () => (Lab.LIB || []).map((b) => { const D = Lab.disc(b.d[0]) || { c: '#6366F1', name: 'Library' }; return { id: b.id, t: b.t, a: b.a, y: b.life || '', c: D.c, tag: D.name, d: b.d, lib: b.g, scan: b.scan, why: '' }; });
const ALL = () => [...BOOKS, ...libBooks()];
// Newer books travel in packs (data/bk/<pack>.txt = JSON {gutenbergId: base64 gzip}); older ones are one file each.
const bookPacks = {};
const packOf = (g) => ((Lab.LIB || []).find((b) => b.g === g) || {}).pk;
async function libText(g) {
  const pk = packOf(g);
  const b64 = pk != null ? (await (bookPacks[pk] ||= fetch(`data/bk/${pk}.txt`).then((r) => r.json())))[g].replace(/\s+/g, '')
    : (await (await fetch(`data/lib/${g}.txt`)).text()).replace(/\s+/g, '');
  const bin = atob(b64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  let t = bytes[0] === 0x1f && bytes[1] === 0x8b ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text() : new TextDecoder().decode(bytes);
  const st = t.search(/\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i); if (st >= 0) t = t.slice(t.indexOf('\n', st) + 1);
  const en = t.search(/\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG/i); if (en > 0) t = t.slice(0, en);
  return t;
}

function parse(text) {
  const paras = text.replace(/\r/g, '').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const pat = /^(CHAPTER|Chapter|BOOK|Book|PART|ARTICLE|Article|SECTION|FEDERALIST No|PREFACE|INTRODUCTION|THE INTRODUCTION|THE [A-Z]+ BOOK|[IVXLC]+\. [A-Z]|[IVXLC]+\.?$)/;
  const isHead = (p) => p.length < 140 && (pat.test(p) || (p.length < 90 && p.replace(/[^A-Za-z]/g, '').length > 3 && p === p.toUpperCase() && !/[.!?]["”]?$/.test(p.slice(-1) === '.' && p.length > 60 ? p : '')));
  const secs = []; let cur = { title: 'Opening', paras: [] };
  for (let i = 0; i < paras.length; i++) {
    const p = paras[i];
    if (isHead(p)) {
      let title = p;
      if (i + 1 < paras.length && paras[i + 1].length < 90 && !/[.,;]$/.test(paras[i + 1]) && /^[IVXLC]+\.?$|^CHAPTER\.? ?[IVXLC\d]*\.?$/i.test(p)) { title = p + ' · ' + paras[i + 1]; i++; }
      else if (i + 1 < paras.length && paras[i + 1].length < 90 && isHead(paras[i + 1]) && !pat.test(paras[i + 1]) && /,$/.test(p)) { title = p + ' ' + paras[i + 1]; i++; }
      if (cur.paras.length) secs.push(cur);
      cur = { title, paras: [] };
    } else cur.paras.push(p);
  }
  if (cur.paras.length) secs.push(cur);
  const out = [];
  for (const s of secs) { if (s.paras.length <= 45) out.push(s); else for (let k = 0; k < s.paras.length; k += 40) out.push({ title: s.title + (k ? ` (part ${k / 40 + 1})` : ''), paras: s.paras.slice(k, k + 40) }); }
  return out.filter((s) => s.paras.join(' ').length > 200 || s.paras.length > 1);
}

Lab.explorer('reading', 'library', {
  mount(el, arg) {
    const book = ALL().find((b) => b.id === arg);
    if (book) return reader(el, book);
    const R = (Lab.state.reading ||= {});
    const tags = ['Guided', 'All', ...Lab.DISC.filter((d) => (Lab.LIB || []).some((b) => b.d.includes(d.id))).map((d) => d.name)]; let tag = 'Guided', q = '';
    const qIn = h('input', { type: 'text', placeholder: `Search ${ALL().length} complete books by title or author…`, style: { width: '100%', margin: '10px 0' }, oninput: () => { q = qIn.value.trim().toLowerCase(); draw(); } });
    const grid = h('div', { class: 'grid g3' });
    const tabs = h('div', { class: 'row' }, tags.map((t) => h('button', { class: 'tab' + (t === tag ? ' on' : ''), onclick: (e) => { tag = t; [...tabs.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, t)));
    tabs.style.flexWrap = 'wrap';
    el.append(h('div', { class: 'hint small' }, `${ALL().length} complete books, free and public domain (texts via Project Gutenberg). The ${BOOKS.length} “Guided” books come with a full guide: why it matters, who wrote it and what they wanted, and the strongest reply. Every book has search, read-aloud and the tutor.`), qIn, tabs, grid,
      h('div', { class: 'card' }, h('h3', null, 'Modern books on your list'), h('p', { class: 'small' }, 'Copyrighted books (Dikötter, Kotkin, Acemoglu, Pomeranz and the rest of your reading program) can’t be placed here in full. They’re in the Library tab of your Doc with free legal sources (libraries, Libby, Internet Archive lending) and paired counterpoints. The tutor can quiz you on any of them as you read.'), h('a', { class: 'btn sm', href: Lab.DOC_URL, style: { textDecoration: 'none' } }, 'Open the Doc ↗')));
    function draw() {
      grid.innerHTML = '';
      const D = Lab.DISC.find((d) => d.name === tag);
      const list = ALL().filter((b) => (q ? (b.t + ' ' + b.a).toLowerCase().includes(q) : true) && (tag === 'All' || (tag === 'Guided' ? !b.lib : D && b.d && b.d.includes(D.id))));
      if (!list.length) grid.append(h('p', { class: 'muted' }, 'No books match.'));
      list.forEach((b) => { const r = R[b.id]; const pct = r && r.total ? Math.round(((r.max + 1) / r.total) * 100) : 0;
        grid.append(h('a', { href: '#reading-library-' + b.id, style: { textDecoration: 'none' }, class: 'card' },
          h('div', { style: { height: '120px', borderRadius: '12px', padding: '14px', color: '#fff', background: `linear-gradient(150deg, ${b.c}, color-mix(in srgb, ${b.c} 45%, #0B1026))`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'Literata, Georgia, serif' } },
            h('b', { style: { fontSize: '18px', lineHeight: 1.2 } }, b.t), h('div', { class: 'small', style: { opacity: 0.9 } }, b.a + (b.y ? ' · ' + (b.y < 0 ? 'c. ' + -b.y + ' BC' : b.y) : ''))),
          b.why ? h('p', { class: 'small', style: { margin: '10px 0 6px' } }, b.why) : h('div', { style: { height: '8px' } }),
          h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': b.c } }, b.tag), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, pct ? pct + '% read' : 'Not started')),
          pct ? h('div', { class: 'bar', style: { marginTop: '6px' } }, h('i', { style: { width: pct + '%', background: b.c } })) : null)); });
    }
    draw();
  },
});

function reader(el, b) {
  const R = (Lab.state.reading ||= {}); const st = (R[b.id] ||= { sec: 0, max: 0, total: 0 });
  let secs = [], speaking = false, size = 18;
  const body = h('div', { class: 'reader' });
  const nav = h('select', { style: { maxWidth: '100%' } });
  const pos = h('span', { class: 'muted small' });
  const search = h('input', { type: 'text', placeholder: 'Search this book…', style: { flex: 1, minWidth: '140px' } });
  const readBtn = h('button', { class: 'btn sm' }, '🔊 Read aloud');
  el.append(
    h('div', { class: 'row' }, h('a', { href: '#reading-library', class: 'btn sm', style: { textDecoration: 'none' } }, '← Library'), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { size = Math.max(14, size - 1); body.style.fontSize = size + 'px'; } }, 'A−'), h('button', { class: 'btn sm', onclick: () => { size = Math.min(26, size + 1); body.style.fontSize = size + 'px'; } }, 'A+')),
    h('div', { class: 'card', style: { borderTop: `6px solid ${b.c}` } }, h('h2', { style: { fontFamily: 'Literata, Georgia, serif' } }, b.t), h('div', { class: 'muted' }, b.a + (b.y ? ' · ' + (b.y < 0 ? 'c. ' + -b.y + ' BC' : b.y) : '')),
      b.lib && String(b.lib).startsWith('ia:') ? h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, `Scanned ${b.scan ? b.scan + ' ' : ''}edition from the Internet Archive. The text was made by computer reading of the printed page, so expect page numbers, running heads and some misread words. `, h('a', { href: 'https://archive.org/details/' + String(b.lib).slice(3) }, 'See the original scan ↗')) : null,
      b.lib ? h('div', { class: 'row', style: { marginTop: '10px', flexWrap: 'wrap' } }, h('span', { class: 'small muted' }, 'Part of:'), (b.d || []).map((id) => { const D = Lab.disc(id); return D ? h('a', { class: 'tag', href: '#d-' + id, style: { '--c': D.c, textDecoration: 'none' } }, D.e + ' ' + D.name) : null; }), h('span', { class: 'sp' }), h('button', { class: 'btn sm primary', onclick: () => Lab.ask(`Give me a reader’s guide to ${b.t} by ${b.a}: who wrote it and why, when and in what context, its main arguments or story, why it matters today, and its strongest critics.`, `Reading ${b.t}`) }, '✦ Reader’s guide')) : null,
      b.lib ? null : h('div', { class: 'grid g3', style: { marginTop: '12px' } },
        h('div', null, h('span', { class: 'tag', style: { '--c': '#2563EB' } }, 'Why read it'), h('p', { class: 'small', style: { marginTop: '6px' } }, b.why)),
        h('div', null, h('span', { class: 'tag', style: { '--c': '#D97706' } }, 'Who wrote it, and why'), h('p', { class: 'small', style: { marginTop: '6px' } }, b.who)),
        h('div', null, h('span', { class: 'tag', style: { '--c': '#DC2626' } }, 'The strongest reply'), h('p', { class: 'small', style: { marginTop: '6px' } }, b.against))),
      b.qs ? h('details', null, h('summary', { class: 'small', style: { cursor: 'pointer', fontWeight: 600 } }, 'Questions to read with'), h('ul', { class: 'small' }, b.qs.map((q) => h('li', null, q)))) : null),
    h('div', { class: 'card' }, h('div', { class: 'row' }, nav, pos), h('div', { class: 'row', style: { marginTop: '8px' } }, search, h('button', { class: 'btn sm', onclick: doSearch }, 'Find'), h('button', { class: 'btn sm', onclick: () => go(startSec()) }, '⭐ Start here'), readBtn,
      h('button', { class: 'btn sm', onclick: () => { const s = String(getSelection() || '').trim(); Lab.ask(s ? `In ${b.t} by ${b.a}, explain this passage in plain English, give its historical context, and say how a critic would respond: "${s.slice(0, 1200)}"` : `Summarize the section "${secs[st.sec].title}" of ${b.t} in plain English, explain why it matters, and give one point a critic would make.`, `Reading Room: ${b.t}, ${secs[st.sec] ? secs[st.sec].title : ''}`); } }, '✦ Explain (select text first, or the whole section)'))),
    h('div', { class: 'card' }, body),
    h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('button', { class: 'btn', onclick: () => go(st.sec - 1) }, '← Previous'), h('button', { class: 'btn primary', onclick: () => { Lab.markDone(`read:${b.id}:${st.sec}`, 3, 'section read'); go(st.sec + 1); } }, 'Next section →')),
    Lab.source(String(b.lib || '').startsWith('ia:') ? `Scanned text from the <a href="https://archive.org/details/${String(b.lib).slice(3)}">Internet Archive</a> (published before 1929, public domain in the US).` : `Text from <a href="https://www.gutenberg.org">Project Gutenberg</a> (public domain in the US).`));
  readBtn.onclick = async () => {
    if (speaking) { speaking = false; Lab.stopSpeaking(); readBtn.textContent = '🔊 Read aloud'; return; }
    speaking = true; readBtn.textContent = '■ Stop';
    for (const p of secs[st.sec].paras) { if (!speaking) break; for (let k = 0; k < p.length && speaking; k += 1900) { const ok = await Lab.speak(p.slice(k, k + 1900), { language: 'en' }); if (!ok) { speaking = false; break; } } }
    speaking = false; readBtn.textContent = '🔊 Read aloud';
  };
  function startSec() { if (!b.start) return 0; const i = secs.findIndex((s) => s.title.toUpperCase().includes(b.start.toUpperCase())); return i >= 0 ? i : 0; }
  function doSearch() {
    const q = search.value.trim().toLowerCase(); if (!q) return;
    for (let k = 1; k <= secs.length; k++) { const i = (st.sec + k) % secs.length; const j = secs[i].paras.findIndex((p) => p.toLowerCase().includes(q)); if (j >= 0 || secs[i].title.toLowerCase().includes(q)) { go(i, Math.max(0, j)); return; } }
    Lab.toast('Not found');
  }
  function go(i, para) {
    if (!secs.length) return; i = Lab.clamp(i, 0, secs.length - 1); st.sec = i; st.max = Math.max(st.max, i); st.total = secs.length; Lab.save();
    nav.value = i; pos.textContent = `Section ${i + 1} of ${secs.length}`;
    body.innerHTML = ''; body.style.fontSize = size + 'px';
    body.append(h('h3', { style: { fontFamily: 'Literata, Georgia, serif', fontSize: '1.2em' } }, secs[i].title), ...secs[i].paras.map((p, k) => h('p', { id: 'p' + k, style: k === para ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', borderRadius: '6px' } : null }, p)));
    if (para != null) setTimeout(() => document.getElementById('p' + para)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); else body.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    Lab.setContext(`Reading ${b.t} by ${b.a}, section "${secs[i].title}". Opening: ${secs[i].paras.slice(0, 2).join(' ').slice(0, 600)}`);
  }
  body.append(h('div', { class: 'loading' }, 'Opening the book…'));
  (b.lib ? libText(b.lib) : Lab.text(`data/books/${b.id}.txt`)).then((t) => {
    secs = parse(t);
    secs.forEach((s, i) => nav.append(h('option', { value: i }, s.title.slice(0, 70))));
    nav.onchange = () => go(+nav.value);
    const first = st.max ? st.sec : startSec();
    go(first);
    if (!st.max) Lab.toast('Opened at the recommended starting point');
  }).catch(() => { body.innerHTML = ''; body.append(h('p', null, 'Couldn’t load this book.')); });
  return () => { speaking = false; };
}
