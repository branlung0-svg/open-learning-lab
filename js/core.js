/* Learning Lab core: router, progress, tutor, voice, helpers */
(function () {
  const Lab = (window.Lab = {});
  const $ = (s, r = document) => r.querySelector(s);

  // ---------- DOM helper ----------
  Lab.h = function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (v[sk] == null) continue; if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'class') el.className = v;
      else if (k.startsWith('--')) el.style.setProperty(k, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  };
  const h = Lab.h;
  Lab.fmt = (n, d = 0) => (n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }));
  Lab.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  Lab.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  Lab.conf = (lvl) => h('span', { class: 'conf ' + lvl }, lvl);

  // Pick readable text (white or dark) for whatever accent color a page sets.
  (() => { const root = document.documentElement; let last = '';
    const lum = (hx) => { const m = hx.replace('#', '').match(/^([0-9a-f]{6})$/i); if (!m) return 0; const v = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const fix = () => { const a = root.style.getPropertyValue('--accent').trim(); if (a === last) return; last = a; root.style.setProperty('--on-accent', lum(a) > 0.3 ? '#14142B' : '#fff'); };
    new MutationObserver(fix).observe(root, { attributes: true, attributeFilter: ['style'] }); fix(); })();

  // Contrast guard: if an inline text color is too close to its background (for example a dark era color in dark mode), nudge it until readable.
  (() => { const parse = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const k = c.startsWith('color(') ? 1 : 255; return m.slice(0, 3).map((v) => +v / k); };
    const L = (rgb) => { const v = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const alpha = (c) => { const a = c.match(/\/\s*([\d.]+)\)|,\s*([\d.]+)\)$/); return a ? +(a[1] || a[2]) : 1; };
    const bgOf = (el) => { let e = el; while (e && e !== document.documentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const b = cs.backgroundColor; if (b && b !== 'transparent' && alpha(b) > 0.5) return b; e = e.parentElement; } return getComputedStyle(document.body).backgroundColor; };
    let t = null; const run = () => { t = null; const app = document.getElementById('app'); if (!app || /stroop|colorwheel|colorlight/.test(location.hash)) return;
      app.querySelectorAll('[style*="color"]').forEach((el) => { if (el.dataset.cg) return; const bgc = bgOf(el); if (!bgc) return; const fg = parse(getComputedStyle(el).color), bg = parse(bgc); if (!fg || !bg) return; const lf = L(fg), lb = L(bg); const ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05); if (ratio >= 3) return;
        el.dataset.cg = '1'; const cw = 1.05 / (lb + 0.05), cd = (lb + 0.05) / 0.06; el.style.color = `color-mix(in srgb, ${getComputedStyle(el).color} 25%, ${cw >= cd ? '#ffffff' : '#111827'})`; }); };
    new MutationObserver(() => { if (!t) t = setTimeout(run, 120); }).observe(document.documentElement, { childList: true, subtree: true });
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { document.querySelectorAll('[data-cg]').forEach((e) => delete e.dataset.cg); run(); }); } catch (e) { /* old browsers */ } })();
  Lab.source = (html) => h('div', { class: 'src', html: 'Source: ' + String(html).replace(/^\s*Sources?:\s*/i, '') });
  Lab.apply = (text) => h('div', { class: 'apply small', html: '<b>Use it in your life:</b> ' + text });

  const cache = {};
  Lab.json = (p) => (cache[p] ||= fetch(p).then((r) => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); }));
  Lab.text = (p) => (cache[p] ||= fetch(p).then((r) => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.text(); }));

  // ---------- subjects ----------
  Lab.subjects = [
    { id: 'history', name: 'History & Geopolitics', e: '🗺️', c: '#F59E0B', blurb: 'Real borders from 1492 to today, empires, wars and the turning points that made the modern world.',
      ex: [['atlas', 'World atlas'], ['timeline', 'Timeline 1700–now']] },
    { id: 'economy', name: 'Economics & Political Systems', e: '📈', c: '#10B981', blurb: 'Why some countries got rich: 300 years of real data on growth, power and how systems compare.',
      ex: [['divergence', 'Rich & poor since 1700'], ['world', 'The world got… better?'], ['market', 'Supply & demand lab'], ['growth', 'The power of growth']] },
    { id: 'body', name: 'Human Body & Biology', e: '🫀', c: '#F43F5E', blurb: 'Spin a 3D body, open a cell, read a real human gene and watch one letter cause sickle cell disease.',
      ex: [['body3d', '3D body'], ['cell', '3D cell'], ['dna', 'DNA → protein']] },
    { id: 'physics', name: 'Physics, Chemistry & Space', e: '🪐', c: '#8B5CF6', blurb: 'Run the solar system on Newton’s law, fire projectiles on other worlds, explore all 118 elements.',
      ex: [['orbits', 'Gravity & orbits'], ['projectile', 'Projectile lab'], ['elements', 'Periodic table']] },
    { id: 'math', name: 'Mathematics', e: '📐', c: '#3B82F6', blurb: 'See the math move: functions, waves, calculus, probability and the math of risk.',
      ex: [['functions', 'Function lab'], ['circle', 'Circles → waves'], ['calculus', 'Calculus you can see'], ['probability', 'Probability'], ['risk', 'Risk & ruin']] },
    { id: 'ai', name: 'AI & Computing', e: '🤖', c: '#06B6D4', blurb: 'Train a real neural network in your browser and see how a language model picks its next word.',
      ex: [['nn', 'Neural net playground'], ['llm', 'How a chatbot picks words']] },
    { id: 'mandarin', name: 'Mandarin', e: '🀄', c: '#EF4444', blurb: 'Hear and see the four tones, learn your first 60 words, and take characters apart.',
      ex: [['tones', 'The four tones'], ['cards', 'First 60 words'], ['chars', 'Character building blocks']] },
    { id: 'ged', name: 'GED Arcade', e: '🎯', c: '#F97316', blurb: 'Fast, scored practice for all four GED tests. Every answer explained. Your weak spots tracked.',
      ex: [['arcade', 'Play'], ['facts', 'Test facts & plan']] },
    { id: 'reading', name: 'Reading Room', e: '📚', c: '#6366F1', blurb: '400+ complete books inside the Lab, searchable and read-aloud, 16 with full guides on who wrote them, why, and who disagrees.',
      ex: [['library', 'Library']] },
    { id: 'evidence', name: 'Evidence Lab', e: '🔎', c: '#14B8A6', blurb: 'Learn to tell what really happened: rate real sources and question any claim.',
      ex: [['rate', 'Rate the source'], ['questions', 'Question a claim']] },
    { id: 'news', name: 'This Week', e: '📰', c: '#EC4899', blurb: 'New advances in AI, science, math and geopolitics, updated weekly and rated for confidence.',
      ex: [['week', 'Latest']] },
  ];
  Lab.subject = (id) => Lab.subjects.find((s) => s.id === id);
  Lab.DOC_URL = 'https://claude.ai/artifact/2aEsPFzjAxXc77snew4oQ4';

  // ---------- registry ----------
  const reg = {};
  Lab.explorer = (sid, eid, def) => { (reg[sid] ||= {})[eid] = def; };
  Lab.page = (sid, def) => { (reg[sid] ||= {})._page = def; };
  Lab.routes = {};

  // ---------- progress ----------
  const today = () => new Date().toISOString().slice(0, 10);
  const blank = { xp: 0, streak: 0, lastDay: '', done: {}, ged: {}, cards: {}, reading: {}, log: [] };
  Lab.state = Object.assign({}, blank);
  try { const s = JSON.parse(localStorage.getItem('lab.progress') || 'null'); if (s) Lab.state = Object.assign({}, blank, s); } catch (e) {}
  let dbDoc = null, saveTimer = null, saving = false, dirty = false;
  function renderXP() { $('#xpVal').textContent = Lab.fmt(Lab.state.xp); $('#streakVal').textContent = Lab.state.streak || 0; }
  Lab.save = function () {
    try { localStorage.setItem('lab.progress', JSON.stringify(Lab.state)); } catch (e) {}
    renderXP();
    if (!dbDoc) return;
    dirty = true; clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 2500);
  };
  async function flush() {
    if (saving || !dirty || !dbDoc) return;
    saving = true; dirty = false;
    try { await dbDoc.set(JSON.parse(JSON.stringify(Lab.state))); } catch (e) { if (e && e.code === 'invalid_argument') dbDoc = null; }
    saving = false; if (dirty) flush();
  }
  function touchDay() {
    const t = today();
    if (Lab.state.lastDay === t) return;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    Lab.state.streak = Lab.state.lastDay === y ? (Lab.state.streak || 0) + 1 : 1;
    Lab.state.lastDay = t;
  }
  Lab.addXP = function (n, why) {
    touchDay();
    Lab.state.xp = (Lab.state.xp || 0) + n;
    Lab.state.log = [[today(), n, why || ''], ...(Lab.state.log || [])].slice(0, 60);
    Lab.save();
    if (n >= 5) Lab.toast(`+${n} XP${why ? ' · ' + why : ''}`);
  };
  Lab.isDone = (k) => !!Lab.state.done[k];
  Lab.markDone = function (k, xp = 10, why) { if (Lab.state.done[k]) return false; Lab.state.done[k] = today(); Lab.addXP(xp, why); return true; };
  Lab.level = () => { const xp = Lab.state.xp || 0; let lv = 1, need = 100, acc = 0; while (xp >= acc + need) { acc += need; lv++; need = Math.round(need * 1.25); } return { lv, into: xp - acc, need }; };
  Lab.subjectProgress = (sid) => { const s = Lab.subject(sid); const n = s.ex.length; const d = s.ex.filter(([e]) => Lab.isDone('visit:' + sid + ':' + e)).length; return d / n; };

  async function connectDB() {
    try {
      if (!window.claude || !claude.use) return;
      const db = await claude.use('db');
      if (!db) return;
      const ref = db.doc('progress/main');
      const snap = await ref.get();
      if (snap.exists) {
        const r = snap.data() || {};
        if ((r.xp || 0) >= (Lab.state.xp || 0)) Lab.state = Object.assign({}, blank, JSON.parse(JSON.stringify(r)));
      }
      dbDoc = ref; Lab.db = db; renderXP();
      if (!snap.exists || (Lab.state.xp || 0) > ((snap.data() || {}).xp || 0)) { dirty = true; flush(); }
      document.dispatchEvent(new CustomEvent('lab:db', { detail: db }));
      if (location.hash === '' || location.hash === '#home') route();
    } catch (e) { /* stays local */ }
  }

  // ---------- toast ----------
  let tt;
  Lab.toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1800); };

  // ---------- voice ----------
  let ttsP = null;
  Lab.speak = async function (text, opts = {}) {
    try {
      if (!ttsP && window.claude && claude.use) ttsP = claude.use('tts');
      const t = ttsP ? await ttsP : null;
      if (t) { await t.speak(text.slice(0, 1990), opts); return true; }
    } catch (e) { /* fall back */ }
    try {
      const u = new SpeechSynthesisUtterance(text);
      if (opts.language) u.lang = opts.language;
      u.rate = opts.rate || (opts.language && opts.language.startsWith('zh') ? 0.8 : 1);
      speechSynthesis.cancel(); speechSynthesis.speak(u); return true;
    } catch (e) { Lab.toast('Voice is not available here'); return false; }
  };
  Lab.stopSpeaking = async function () { try { const t = ttsP ? await ttsP : null; t && t.stop(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} };

  // ---------- tutor ----------
  let sampleP = null, ctxText = '', history = [], busy = false;
  const TUTOR_RULES_BASE = `Rules: explain clearly with concrete examples and numbers; check understanding with one short question at the end when useful; on contested historical or political questions give the strongest case each side makes, say what the evidence shows, and label confidence as Established, Strong, Contested, Unknown or Clouded; say plainly when evidence is thin; never invent quotes, numbers or sources; keep answers under about 250 words unless asked for more; use plain text with short paragraphs or simple dashes, no markdown headings.`;
  const TUTOR_RULES = () => { const p = Lab.state.profile || {}; const age = { kid: 'a child aged 10 to 12 (use simple words, short sentences and friendly examples; avoid graphic detail)', teen: 'a teenager aged 13 to 17', adult: 'an adult', senior: 'an older adult aged 65 or more' }[p.age] || 'a learner of unknown age (assume an adult but keep language clear)'; const depth = { simple: 'Keep explanations short and simple.', standard: 'Give clear explanations with the key details.', deep: 'Go deep: data, debates, sources and nuance.' }[p.depth] || ''; const goals = (p.goals || []).length ? ' Their goals: ' + p.goals.join(', ') + '.' : ''; const ints = (p.interests || []).length ? ' Interests: ' + p.interests.join(', ') + '.' : ''; return `You are a sharp, warm tutor inside the free "Open Learning Lab" app. You are talking with ${age}.${goals}${ints} ${depth} ` + TUTOR_RULES_BASE; };
  Lab.setContext = (text) => { ctxText = text || ''; $('#tutorCtx').textContent = ctxText ? '· ' + ctxText.split('\n')[0].slice(0, 60) : ''; };
  Lab.ask = function (question, context) { if (context) Lab.setContext(context); openDrawer(); if (question) { $('#tutorIn').value = question; send(); } };
  function openDrawer() { $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); if (!history.length) addMsg('ai', 'Ask me anything about what you’re exploring. I can explain, quiz you, connect it to other subjects, or give both sides of a debate.'); setTimeout(() => $('#tutorIn').focus(), 200); }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
  function addMsg(who, text) { const m = h('div', { class: 'msg ' + (who === 'me' ? 'me' : '') }, text); $('#msgs').append(m); $('#msgs').scrollTop = 1e9; return m; }
  async function send() {
    const q = $('#tutorIn').value.trim(); if (!q || busy) return;
    $('#tutorIn').value = ''; addMsg('me', q);
    const out = addMsg('ai', 'Thinking…');
    busy = true;
    try {
      if (!sampleP && window.claude && claude.use) sampleP = claude.use('sample');
      const sample = sampleP ? await sampleP : null;
      if (!sample) { out.textContent = 'This version has no built-in AI. I opened a ready-made question you can paste into any AI assistant.'; busy = false; if (Lab.copyPrompt) Lab.copyPrompt(`${TUTOR_RULES()}\n\nWhat I am looking at: ${ctxText || 'the Open Learning Lab home page'} (${location.href})\n\nMy question: ${q}`); return; }
      const msgs = [];
      const first = `${TUTOR_RULES()}\n\nWhat the learner is looking at right now: ${ctxText || 'the Lab home page'}\n\n`;
      history.forEach((m, i) => msgs.push({ role: m.role, content: (i === 0 ? first : '') + m.content }));
      msgs.push({ role: 'user', content: (history.length ? '' : first) + 'Learner: ' + q });
      const r = await sample(msgs, { cache: false, onText: ({ text }) => { out.textContent = text; $('#msgs').scrollTop = 1e9; } });
      out.textContent = r.text;
      history.push({ role: 'user', content: 'Learner: ' + q }, { role: 'assistant', content: r.text });
      if (history.length > 16) history = history.slice(-16);
      Lab.addXP(2);
    } catch (e) {
      out.textContent = e && e.code === 'rate_limited' ? 'The tutor is busy. Try again in a minute.' : e && e.code === 'not_granted' ? 'The tutor was not allowed in this view.' : 'Something went wrong reaching the tutor. Try again.';
    }
    busy = false;
  }
  Lab.sampleOnce = async function (prompt, onText) {
    if (!sampleP && window.claude && claude.use) sampleP = claude.use('sample');
    const sample = sampleP ? await sampleP : null;
    if (!sample) throw { code: 'unavailable' };
    const r = await sample(prompt, { cache: false, onText });
    return r.text;
  };

  // ---------- router ----------
  let cleanup = null;
  // remember where you were on each page, so Back returns you to the same spot
  let lastHash = null; const scrollMem = (() => { try { return JSON.parse(sessionStorage.getItem('lab-scroll') || '{}'); } catch (e) { return {}; } })();
  let curY = 0;
  const saveScroll = () => { if (lastHash) { scrollMem[lastHash] = curY; try { sessionStorage.setItem('lab-scroll', JSON.stringify(scrollMem)); } catch (e) {} } };
  window.addEventListener('scroll', () => { if ((location.hash || '#home') === lastHash) curY = window.scrollY; }, { passive: true });
  window.addEventListener('beforeunload', saveScroll);
  { const H = window.history; const rs = H.replaceState.bind(H); H.replaceState = (...x) => { rs(...x); lastHash = location.hash || '#home'; }; }
  function route() {
    saveScroll();
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    Lab.stopSpeaking();
    const app = $('#app');
    const raw = (location.hash || '#home').slice(1);
    const [sid, eid, ...rest] = raw.split('-');
    app.innerHTML = '';
    window.scrollTo(0, 0);
    const want = scrollMem[location.hash || '#home'];
    if (want > 0) { let tries = 0; const go = () => { if (document.body.scrollHeight >= want + innerHeight * 0.5 || tries > 12) { window.scrollTo(0, want); curY = window.scrollY; } else { tries++; setTimeout(go, 120); } }; setTimeout(go, 60); }
    lastHash = location.hash || '#home'; curY = 0;
    if (Lab.routes[sid]) {
      document.documentElement.style.setProperty('--accent', '#3B82F6');
      try { cleanup = Lab.routes[sid](app, [eid, ...rest].filter(Boolean)) || null; }
      catch (e) { app.append(h('div', { class: 'card' }, 'This page hit an error: ' + e.message)); console.error(e); }
      return;
    }
    if (!sid || sid === 'home' || !Lab.subject(sid)) {
      document.documentElement.style.setProperty('--accent', '#3B82F6');
      Lab.setContext('');
      const home = reg.home && reg.home._page;
      if (home) cleanup = home.mount(app) || null;
      return;
    }
    const S = Lab.subject(sid);
    document.documentElement.style.setProperty('--accent', S.c);
    const ex = S.ex.find(([e]) => e === eid) ? eid : S.ex[0][0];
    const hero = h('section', { class: 'hero' },
      h('a', { class: 'crumb', href: '#home' }, '← All subjects'),
      h('div', { class: 'emoji', style: { marginTop: '10px' } }, S.e),
      h('h1', null, S.name), h('p', null, S.blurb));
    const tabs = h('div', { class: 'tabs' }, S.ex.map(([e, n]) => h('button', { class: 'tab' + (e === ex ? ' on' : ''), onclick: () => { location.hash = sid + '-' + e; } }, n)));
    const body = h('div', { class: 'stack' });
    app.append(hero, tabs, body);
    const def = reg[sid] && reg[sid][ex];
    Lab.setContext(`${S.name} → ${S.ex.find(([e]) => e === ex)[1]}`);
    if (!def) { body.append(h('div', { class: 'card' }, 'Coming soon.')); return; }
    if (Lab.markDone('visit:' + sid + ':' + ex, 10, 'new explorer')) {}
    try { cleanup = def.mount(body, rest.join('-')) || null; }
    catch (e) { body.append(h('div', { class: 'card' }, 'This explorer hit an error: ' + e.message)); console.error(e); }
  }
  Lab.go = (hash) => { if (location.hash === '#' + hash) route(); else location.hash = hash; };

  document.addEventListener('DOMContentLoaded', () => {
    $('#fab').onclick = openDrawer; $('#tutorClose').onclick = closeDrawer;
    $('#tutorForm').onsubmit = (e) => { e.preventDefault(); send(); };
    $('#tutorIn').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    $('#foot').innerHTML = `<b>${Lab.SITE_NAME || 'Open Learning Lab'}</b>: free and open for everyone. <a href="#about">About</a> · <a href="#privacy">Privacy</a> · <a href="#changes">Corrections</a> · <a href="https://github.com/branlung0-svg/open-learning-lab/issues/new?title=Mistake%20on%20page%3A%20" target="_blank" rel="noopener">Report a mistake</a> · <a href="#archive">Archive</a> · <a href="#review">Review</a> · <a href="#notes">Notes</a> · <a href="#settings">Settings</a> · <a href="https://github.com/branlung0-svg/open-learning-lab" target="_blank" rel="noopener">Source code</a><br>Images: Wikimedia Commons (each credited with its author and license) and NASA (public domain). Books: Project Gutenberg and scanned public-domain editions from the Internet Archive. Primary documents: the Avalon Project, Yale Law School. Data: Maddison Project, V-Dem Institute (CC BY-SA), Correlates of War, SIPRI, UCDP/PRIO, World Inequality Database, World Bank, Robert Shiller and others via Our World in Data and the datasets project on GitHub; historical borders by A. Ourednik (GPL-3); periodic table data by Bowserinator (summaries from Wikipedia, CC BY-SA).`;
    renderXP(); route(); connectDB();
  });
  window.addEventListener('hashchange', route);
})();
