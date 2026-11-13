const { h } = Lab;
const FIELDS = { ai: ['AI & computing', '#06B6D4'], science: ['Science & medicine', '#8B5CF6'], math: ['Math', '#3B82F6'], space: ['Space', '#6366F1'], geopolitics: ['Geopolitics & war', '#F59E0B'], economy: ['Economy & markets', '#10B981'], china: ['China', '#EF4444'] };
(Lab.DISC || []).forEach((d) => { if (!FIELDS[d.id] || d.id === 'math' || d.id === 'geopolitics') FIELDS[d.id] = [d.name, d.c]; });
Lab.explorer('news', 'week', {
  mount(el) {
    let items = [], field = 'all', unsub = null, timer = null;
    const tabs = h('div', { class: 'tabs' }); const list = h('div', { class: 'stack' }); const status = h('p', { class: 'small muted' }, 'Loading the latest…');
    el.append(h('div', { class: 'hint small' }, 'Updated every week by a scheduled research run: it searches for the most important developments, reads the sources, writes a short plain-English summary, says why it matters, and labels how confident you should be. Every item links to its source. Breaking news is often wrong at first; items marked Unknown or Clouded are still unfolding.'), tabs, status, list);
    const drawTabs = () => { tabs.innerHTML = ''; [['all', ['Everything', '#EC4899']], ...Object.entries(FIELDS)].forEach(([k, [n, c]]) => { const cnt = k === 'all' ? items.length : items.filter((x) => x.field === k).length; if (k !== 'all' && !cnt) return; tabs.append(h('button', { class: 'tab' + (k === field ? ' on' : ''), style: k === field ? { background: c } : null, onclick: () => { field = k; drawTabs(); draw(); } }, `${n} ${cnt ? '· ' + cnt : ''}`)); }); };
    function draw() {
      list.innerHTML = '';
      const show = items.filter((x) => field === 'all' || x.field === field);
      if (!show.length) return;
      let lastWeek = '';
      for (const x of show) {
        if (x.week && x.week !== lastWeek) { lastWeek = x.week; list.append(h('h3', { style: { marginTop: '14px' } }, 'Week of ' + x.week)); }
        const [fn, fc] = FIELDS[x.field] || ['News', '#EC4899'];
        list.append(h('div', { class: 'card', style: { borderLeft: `5px solid ${fc}` } },
          h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': fc } }, fn), x.confidence ? Lab.conf(x.confidence) : null, h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, x.date || '')),
          h('h3', { style: { marginTop: '8px' } }, x.headline || ''), h('p', { class: 'small' }, x.summary || ''),
          x.why ? h('div', { class: 'hint small' }, h('b', null, 'Why it matters: '), x.why) : null,
          x.debate ? h('p', { class: 'small', style: { marginTop: '8px' } }, h('b', null, 'What’s disputed: '), x.debate) : null,
          h('div', { class: 'row', style: { marginTop: '8px' } }, ...(x.sources || []).slice(0, 4).map((s) => h('a', { class: 'btn sm', href: s.url, style: { textDecoration: 'none' } }, (s.name || 'Source') + ' ↗')),
            h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain this news item in depth, give the background I need, and the strongest perspectives on it: "${x.headline}". Summary: ${x.summary}`, `This Week: ${x.headline}`) }, '✦ Go deeper'))));
      }
    }
    async function connect(db) {
      try {
        timer = setTimeout(() => { status.textContent = 'Can’t reach the news feed right now. It may be offline; try again later.'; }, 10000);
        unsub = db.collection('news').orderBy('date', 'desc').limit(80).onSnapshot((snap) => {
          clearTimeout(timer);
          items = snap.docs.map((d) => d.data()).filter((x) => x && x.headline);
          status.textContent = items.length ? `${items.length} stories · newest ${items[0].date || ''}` : 'No stories yet. The first weekly update will appear here after the scheduled run.';
          drawTabs(); draw();
        }, () => { clearTimeout(timer); status.textContent = 'The news feed isn’t available in this view.'; });
      } catch (e) { status.textContent = 'The news feed isn’t available in this view.'; }
    }
    if (Lab.db) connect(Lab.db);
    else { const on = (e) => connect(e.detail); document.addEventListener('lab:db', on, { once: true }); setTimeout(() => { if (!Lab.db) status.textContent = 'The news feed loads when the Lab is opened on claude.ai while signed in.'; }, 12000); }
    drawTabs();
    return () => { unsub && unsub(); clearTimeout(timer); };
  },
});
