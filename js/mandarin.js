const { h } = Lab;
const say = (t) => Lab.speak(t, { language: 'zh-CN', rate: 0.8 });
const HAN = { fontFamily: '"Noto Serif SC","Songti SC","SimSun",serif' };

const TONES = [
  { n: 1, mark: 'mā', han: '妈', mean: 'mother', contour: [5, 5], desc: 'High and level, like holding a note.', color: '#EF4444' },
  { n: 2, mark: 'má', han: '麻', mean: 'hemp; numb', contour: [3, 5], desc: 'Rising, like asking “huh?”', color: '#F59E0B' },
  { n: 3, mark: 'mǎ', han: '马', mean: 'horse', contour: [2, 1, 4], desc: 'Dips low, then rises. In normal speech it often just stays low.', color: '#10B981' },
  { n: 4, mark: 'mà', han: '骂', mean: 'to scold', contour: [5, 1], desc: 'Sharp fall, like a firm “No!”', color: '#3B82F6' },
  { n: 0, mark: 'ma', han: '吗', mean: '(turns a sentence into a question)', contour: [3, 3], desc: 'Neutral: short and light.', color: '#94A3B8' },
];
function contourSVG(c, color, w = 120, hh = 70) {
  const svg = d3.create('svg').attr('viewBox', `0 0 ${w} ${hh}`).style('width', w + 'px');
  for (let i = 1; i <= 5; i++) svg.append('line').attr('x1', 0).attr('x2', w).attr('y1', hh - (i / 6) * hh).attr('y2', hh - (i / 6) * hh).attr('stroke', 'var(--line)');
  const pts = c.map((v, i) => [10 + (i / (c.length - 1)) * (w - 20), hh - (v / 6) * hh]);
  svg.append('path').attr('d', d3.line().curve(d3.curveCatmullRom)(pts)).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 5).attr('stroke-linecap', 'round');
  return svg.node();
}
Lab.explorer('mandarin', 'tones', {
  mount(el) {
    let q = null, score = 0, n = 0;
    const quiz = h('div');
    el.append(h('div', { class: 'grid g3' }, TONES.map((t) => h('div', { class: 'card', style: { textAlign: 'center', cursor: 'pointer' }, onclick: () => { say(t.han); Lab.addXP(1); } },
      h('div', { class: 'tag', style: { '--c': t.color } }, t.n ? 'Tone ' + t.n : 'Neutral'), h('div', { style: { ...HAN, fontSize: '54px', lineHeight: 1.2, margin: '6px 0' } }, t.han),
      h('div', { class: 'kpi', style: { color: t.color } }, t.mark), h('div', { class: 'small muted' }, t.mean), h('div', { style: { display: 'flex', justifyContent: 'center', margin: '8px 0' } }, contourSVG(t.contour, t.color)), h('p', { class: 'small' }, t.desc), h('span', { class: 'small' }, '🔊 tap to hear')))),
      h('div', { class: 'card' }, h('h3', null, 'Tone trainer'), h('p', { class: 'small muted' }, 'Listen (or read the tone mark), then pick the matching pitch shape. Tones change meaning completely: mā is mother, mǎ is horse.'), quiz),
      h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'Why tones exist'), h('p', { class: 'small' }, 'Mandarin has only about 400 basic syllables (English has thousands), so pitch does the work that extra consonants and vowels do in English. Pitch is shown as numbers from 1 (low) to 5 (high): tone 1 is 55, tone 2 is 35, tone 3 is 214, tone 4 is 51.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'How to practice'), Lab.apply('say each word out loud while drawing its tone shape in the air with your hand. Then record yourself and compare. Ten minutes a day beats an hour on Sunday.'))));
    const WORDS = [['妈', 1], ['马', 3], ['骂', 4], ['麻', 2], ['书', 1], ['茶', 2], ['水', 3], ['去', 4], ['天', 1], ['人', 2], ['我', 3], ['是', 4], ['吃', 1], ['来', 2], ['好', 3], ['看', 4]];
    const PIN = { 妈: 'mā', 马: 'mǎ', 骂: 'mà', 麻: 'má', 书: 'shū', 茶: 'chá', 水: 'shuǐ', 去: 'qù', 天: 'tiān', 人: 'rén', 我: 'wǒ', 是: 'shì', 吃: 'chī', 来: 'lái', 好: 'hǎo', 看: 'kàn' };
    function next() {
      q = WORDS[Math.floor(Math.random() * WORDS.length)];
      quiz.innerHTML = '';
      const ans = h('div', { class: 'row', style: { justifyContent: 'center', gap: '10px', marginTop: '10px' } }, TONES.slice(0, 4).map((t) => h('button', { class: 'opt', style: { width: '140px', textAlign: 'center' }, onclick: (e) => {
        n++; const ok = t.n === q[1]; if (ok) { score++; Lab.addXP(2); } e.currentTarget.classList.add(ok ? 'right' : 'wrong');
        [...ans.children].forEach((b, i) => { b.disabled = true; if (TONES[i].n === q[1]) b.classList.add('right'); });
        quiz.append(h('p', { class: 'small', style: { textAlign: 'center' } }, `${ok ? '✓ Right.' : '✗ It’s tone ' + q[1] + '.'} ${q[0]} = ${PIN[q[0]]}. Score ${score}/${n}`), h('div', { style: { textAlign: 'center' } }, h('button', { class: 'btn sm primary', onclick: next }, 'Next')));
        if (score === 10) Lab.markDone('tones:10', 20, '10 tones right'); } }, contourSVG(TONES[TONES.indexOf(t)].contour, t.color, 100, 54), h('div', { class: 'tiny' }, 'Tone ' + t.n))));
      quiz.append(h('div', { style: { textAlign: 'center' } }, h('div', { style: { ...HAN, fontSize: '64px' } }, q[0]), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn sm', onclick: () => say(q[0]) }, '🔊 Hear it'), h('button', { class: 'btn sm', onclick: (e) => (e.target.textContent = PIN[q[0]]) }, 'Show pinyin'))), ans);
    }
    next();
  },
});

const VOCAB = [['我', 'wǒ', 'I, me'], ['你', 'nǐ', 'you'], ['他', 'tā', 'he'], ['她', 'tā', 'she'], ['我们', 'wǒmen', 'we'], ['好', 'hǎo', 'good'], ['是', 'shì', 'to be'], ['不', 'bù', 'not'], ['有', 'yǒu', 'to have'], ['没有', 'méiyǒu', 'not have'], ['人', 'rén', 'person'], ['大', 'dà', 'big'], ['小', 'xiǎo', 'small'], ['多', 'duō', 'many, much'], ['少', 'shǎo', 'few'], ['中国', 'Zhōngguó', 'China'], ['美国', 'Měiguó', 'the USA'], ['学生', 'xuésheng', 'student'], ['老师', 'lǎoshī', 'teacher'], ['朋友', 'péngyou', 'friend'], ['家', 'jiā', 'home, family'], ['吃', 'chī', 'to eat'], ['喝', 'hē', 'to drink'], ['水', 'shuǐ', 'water'], ['茶', 'chá', 'tea'], ['米饭', 'mǐfàn', 'cooked rice'], ['看', 'kàn', 'to look, watch'], ['听', 'tīng', 'to listen'], ['说', 'shuō', 'to speak'], ['读', 'dú', 'to read'], ['写', 'xiě', 'to write'], ['学习', 'xuéxí', 'to study'], ['工作', 'gōngzuò', 'work, job'], ['去', 'qù', 'to go'], ['来', 'lái', 'to come'], ['回', 'huí', 'to return'], ['在', 'zài', 'at, in'], ['想', 'xiǎng', 'to want; to think'], ['喜欢', 'xǐhuan', 'to like'], ['爱', 'ài', 'to love'], ['今天', 'jīntiān', 'today'], ['明天', 'míngtiān', 'tomorrow'], ['昨天', 'zuótiān', 'yesterday'], ['现在', 'xiànzài', 'now'], ['年', 'nián', 'year'], ['月', 'yuè', 'month; moon'], ['日', 'rì', 'day; sun'], ['一', 'yī', 'one'], ['二', 'èr', 'two'], ['三', 'sān', 'three'], ['四', 'sì', 'four'], ['五', 'wǔ', 'five'], ['六', 'liù', 'six'], ['七', 'qī', 'seven'], ['八', 'bā', 'eight'], ['九', 'jiǔ', 'nine'], ['十', 'shí', 'ten'], ['钱', 'qián', 'money'], ['买', 'mǎi', 'to buy'], ['几', 'jǐ', 'how many'], ['什么', 'shénme', 'what'], ['谁', 'shéi', 'who'], ['哪儿', 'nǎr', 'where'], ['谢谢', 'xièxie', 'thank you'], ['再见', 'zàijiàn', 'goodbye'], ['对不起', 'duìbuqǐ', 'sorry'], ['书', 'shū', 'book'], ['电脑', 'diànnǎo', 'computer'], ['飞机', 'fēijī', 'airplane'], ['天气', 'tiānqì', 'weather'], ['热', 'rè', 'hot'], ['冷', 'lěng', 'cold']];
Lab.explorer('mandarin', 'cards', {
  mount(el) {
    const C = (Lab.state.cards ||= {});
    const today = () => new Date().toISOString().slice(0, 10);
    const addDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
    const GAPS = [0, 1, 3, 7, 16, 35];
    let cur = null, flipped = false, done = 0;
    const box = h('div'); const prog = h('div');
    el.append(h('div', { class: 'grid g2' }, h('div', { class: 'card' }, box), h('div', { class: 'card' }, h('h3', null, 'How this deck works'), h('p', { class: 'small' }, 'Spaced repetition: words you know come back after longer and longer gaps (1, 3, 7, 16, 35 days); words you miss come back right away. It is one of the best-tested ways to remember anything (the “spacing effect,” first measured by Hermann Ebbinghaus in 1885).'), Lab.conf('Established'), prog,
      h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'These are core words from HSK 1, the first level of China’s official proficiency test.'))));
    const due = () => VOCAB.filter(([w]) => !C[w] || C[w].next <= today());
    function show() {
      const d = due(); const learned = VOCAB.filter(([w]) => C[w] && C[w].box >= 2).length;
      prog.innerHTML = ''; prog.append(h('div', { class: 'row', style: { marginTop: '10px' } }, h('div', null, h('div', { class: 'tiny muted' }, 'Due now'), h('div', { class: 'kpi' }, d.length)), h('div', null, h('div', { class: 'tiny muted' }, 'Known (box 2+)'), h('div', { class: 'kpi' }, learned + ' / ' + VOCAB.length)), h('div', null, h('div', { class: 'tiny muted' }, 'Reviewed this session'), h('div', { class: 'kpi' }, done))));
      box.innerHTML = '';
      if (!d.length) { box.append(h('div', { style: { textAlign: 'center', padding: '30px 0' } }, h('div', { style: { fontSize: '50px' } }, '🎉'), h('h3', null, 'All caught up'), h('p', { class: 'small muted' }, 'Come back tomorrow for the next review.'))); return; }
      const unseen = d.filter(([w]) => !C[w]); cur = (d.filter(([w]) => C[w]).length ? d.filter(([w]) => C[w]) : unseen)[0]; if (unseen.length && Math.random() < 0.35) cur = unseen[0];
      flipped = false;
      const face = h('div', { style: { textAlign: 'center', padding: '20px 0', cursor: 'pointer', minHeight: '220px' }, onclick: flip }, h('div', { style: { ...HAN, fontSize: '84px', lineHeight: 1.2 } }, cur[0]), h('div', { class: 'muted small' }, 'Tap to reveal'));
      const btns = h('div', { class: 'row', style: { justifyContent: 'center' } });
      function flip() { if (flipped) return; flipped = true; say(cur[0]); face.innerHTML = ''; face.append(h('div', { style: { ...HAN, fontSize: '84px', lineHeight: 1.2 } }, cur[0]), h('div', { class: 'kpi', style: { color: '#EF4444' } }, cur[1]), h('div', null, cur[2]));
        btns.append(h('button', { class: 'btn', onclick: () => grade(false) }, '✗ Again'), h('button', { class: 'btn primary', style: { '--accent': '#16A34A' }, onclick: () => grade(true) }, '✓ Got it'), h('button', { class: 'btn sm ghost', onclick: () => say(cur[0]) }, '🔊')); }
      box.append(face, btns);
    }
    function grade(ok) { const w = cur[0]; const c = C[w] || { box: 0 }; c.box = ok ? Math.min(5, c.box + 1) : 0; c.next = ok ? addDays(GAPS[c.box]) : today(); C[w] = c; done++; Lab.addXP(ok ? 2 : 1); if (done === 15) Lab.markDone('cards:15:' + today(), 15, '15 cards reviewed'); Lab.save(); show(); }
    show();
  },
});

const PARTS = [
  ['人 / 亻', 'person', ['休', 'xiū', 'to rest', '亻 person + 木 tree: a person leaning on a tree'], ['你', 'nǐ', 'you', '亻 person + 尔 (sound)']],
  ['木', 'tree, wood', ['林', 'lín', 'woods', 'two trees'], ['森', 'sēn', 'forest', 'three trees']],
  ['日 · 月', 'sun · moon', ['明', 'míng', 'bright', 'sun + moon together'], ['早', 'zǎo', 'early', 'the sun over a horizon (traditionally explained as sun above a helmet or plant)']],
  ['口', 'mouth', ['吃', 'chī', 'to eat', '口 mouth + 乞 (sound)'], ['问', 'wèn', 'to ask', '口 mouth inside 门 a doorway']],
  ['氵 (水)', 'water', ['河', 'hé', 'river', '氵 water + 可 (sound kě)'], ['海', 'hǎi', 'sea', '氵 water + 每 (sound měi)']],
  ['女', 'woman', ['好', 'hǎo', 'good', '女 woman + 子 child (a popular memory story; scholars debate the real origin)'], ['妈', 'mā', 'mother', '女 woman + 马 horse (sound mǎ)']],
  ['忄 (心)', 'heart, mind', ['想', 'xiǎng', 'to think', '相 (sound xiāng) + 心 heart'], ['忙', 'máng', 'busy', '忄 heart + 亡 (sound wáng)']],
  ['讠 (言)', 'speech', ['说', 'shuō', 'to speak', '讠 speech + 兑'], ['语', 'yǔ', 'language', '讠 speech + 吾 (sound wú)']],
];
Lab.explorer('mandarin', 'chars', {
  mount(el) {
    el.append(h('div', { class: 'hint small' }, 'Most Chinese characters are built from parts. The most common pattern pairs a meaning part (often on the left) with a sound part that hints at pronunciation. Learn about 200 common parts and new characters stop looking random. Tap any character to hear it.'),
      h('div', { class: 'grid g2' }, PARTS.map(([part, meaning, ...ex]) => h('div', { class: 'card' },
        h('div', { class: 'row' }, h('div', { style: { ...HAN, fontSize: '40px', color: '#EF4444' } }, part), h('div', null, h('div', { class: 'tiny muted' }, 'Building block'), h('b', null, meaning))),
        ex.map(([c, py, en, how]) => h('div', { class: 'row', style: { marginTop: '10px', cursor: 'pointer' }, onclick: () => { say(c); Lab.addXP(1); } }, h('div', { style: { ...HAN, fontSize: '42px', width: '56px', textAlign: 'center' } }, c), h('div', null, h('b', null, py + ' · ' + en), h('div', { class: 'small muted' }, how))))))),
      h('div', { class: 'card' }, h('h3', null, 'Honest note'), h('p', { class: 'small' }, 'Some explanations people use to remember characters are memory stories, not real history: characters changed shape over 3,000 years, and sound parts reflected older pronunciations. Use the stories to remember; use an etymology dictionary (such as Outlier or the Shuowen Jiezi) when you want the true origin.'),
        h('button', { class: 'btn sm', onclick: () => Lab.ask('Teach me 5 more high-frequency Chinese character components, with two example characters each, pinyin and tones, and say which explanations are real etymology versus memory aids.', 'Mandarin: character components') }, '✦ Teach me 5 more')));
  },
});
