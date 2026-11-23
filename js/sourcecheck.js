// Source checker (#sources): look up any outlet. Shows (1) the rating English-Wikipedia editors reached after documented
// discussions, with links to those discussions as the evidence; (2) whether Wikidata records it as state media or a
// public broadcaster, and who owns it; (3) the Lab's own profile if there is one. Data: data/sources-rsp.json and
// data/sources-state.json, rebuilt weekly by tools/build_evidence.py. Also lists each country's state media on its page.
(function () {
  const h = Lab.h;
  const ST = { 'Generally reliable': '#047857', 'No consensus': '#B45309', 'Generally unreliable': '#C2410C', 'Deprecated': '#B91C1C', 'Blacklisted': '#7F1D1D', 'Unclear': '#475569' };
  let RSP = null, STATE = null; const load = () => Promise.all([RSP || Lab.json('data/sources-rsp.json').catch(() => ({ rows: [] })), STATE || Lab.json('data/sources-state.json').catch(() => ({ rows: [] }))]).then(([a, b]) => { RSP = a; STATE = b; return [a, b]; });
  const norm = (s) => String(s || '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  Lab.stateMediaFor = (iso) => load().then(([, b]) => (b.rows || []).filter((x) => x.iso === iso));
  const clean = (n) => String(n || '').replace(/\s*WP:\S+/g, '').replace(/[\u{1F4CC}\u{1F512}\u{1F4D6}]/gu, '').replace(/\s+/g, ' ').trim();
  const badge = (st) => h('span', { class: 'vf-badge', style: { background: ST[st] || '#475569' } }, st);
  const rspCard = (x) => h('div', { class: 'card', style: { borderLeft: '5px solid ' + (ST[x.status] || '#475569') } }, h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap', alignItems: 'center' } }, h('h3', { style: { margin: 0 } }, clean(x.name)), badge(x.status), x.last ? h('span', { class: 'tiny muted' }, 'last discussed ' + x.last) : null),
    h('p', { class: 'small', style: { margin: '6px 0' } }, x.summary), x.discussions.length ? h('div', { class: 'tiny' }, 'The evidence (editors’ discussions): ', ...x.discussions.slice(0, 6).map((u, i) => [i ? ' · ' : '', h('a', { href: u, target: '_blank', rel: 'noopener' }, (i + 1) + ' ↗')]).flat()) : null);
  const stateRow = (x) => h('div', { class: 'search-hit' }, h('span', null, h('b', null, x.name), ' ', h('span', { class: 'tiny muted' }, x.types.join(', '))), h('span', { class: 'tiny muted' }, [x.country, x.owner ? 'owner: ' + x.owner : '', x.site].filter(Boolean).join(' · ')));
  Lab.routes.sources = (app) => {
    Lab.setContext('Source checker: who rates each outlet, who owns it, and the evidence');
    const q = h('input', { type: 'search', placeholder: 'Type an outlet: Xinhua, BBC, RT, Fox News, Al Jazeera…', 'aria-label': 'Search for a news outlet', style: { width: '100%' } });
    const out = h('div', { class: 'stack' }); const stats = h('div'); const chips = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '8px' } }); let st0 = 'all';
    const draw = () => { const v = norm(q.value); const rows = (RSP.rows || []).filter((x) => (st0 === 'all' || x.status === st0) && (!v || norm(x.name).includes(v)));
      const prof = (Lab.SOURCE_PROFILES || []).filter((p) => v && norm(p[0]).includes(v)); const st = v ? (STATE.rows || []).filter((x) => norm(x.name).includes(v) || norm(x.owner).includes(v)).slice(0, 20) : [];
      out.replaceChildren(
        ...(prof.length ? [h('h3', { style: { margin: '8px 0 0' } }, 'The Lab’s own profile'), ...prof.map((p) => h('a', { class: 'search-hit', href: '#toolkit-sources' }, h('span', null, h('b', null, p[0]), ' ', h('span', { class: 'tiny muted' }, p[2])), h('span', { class: 'tiny muted' }, '💰 ' + p[3])))] : []),
        ...(st.length ? [h('h3', { style: { margin: '8px 0 0' } }, 'State or public ownership (Wikidata)'), ...st.map(stateRow)] : []),
        h('h3', { style: { margin: '8px 0 0' } }, 'Wikipedia editors’ rating · ' + rows.length + (v || st0 !== 'all' ? ' matching' : ' outlets')), ...rows.slice(0, v ? 40 : 30).map(rspCard), rows.length > (v ? 40 : 30) ? h('p', { class: 'tiny muted' }, 'Showing the first ' + (v ? 40 : 30) + '. Type to narrow it down.') : null); };
    load().then(() => { const cnt = {}; (RSP.rows || []).forEach((x) => (cnt[x.status] = (cnt[x.status] || 0) + 1)); const nState = (STATE.rows || []).length, nC = new Set((STATE.rows || []).map((x) => x.iso).filter(Boolean)).size;
      stats.replaceChildren(h('p', { class: 'small', style: { margin: 0 } }, (RSP.rows || []).length ? `${(RSP.rows || []).length} outlets rated by Wikipedia editors; ${nState} state-owned media, state news agencies and public broadcasters in ${nC} countries recorded on Wikidata.` : 'The source data is being built; check back shortly.'),
        h('div', { class: 'bal-bar', style: { margin: '6px 0' } }, Object.keys(ST).filter((k) => cnt[k]).map((k) => h('span', { title: k + ': ' + cnt[k], style: { flex: String(cnt[k]), background: ST[k] } }))));
      chips.replaceChildren(...[['all', 'All ratings'], ...Object.keys(ST).filter((k) => cnt[k]).map((k) => [k, k + ' · ' + cnt[k]])].map(([k, n]) => h('button', { class: 'btn sm' + (st0 === k ? ' primary' : ''), onclick: () => { st0 = k; load().then(() => { chips.querySelectorAll('button').forEach((b) => b.classList.toggle('primary', b.textContent.startsWith(k === 'all' ? 'All' : k))); draw(); }); } }, n)));
      q.oninput = draw; draw(); });
    app.append(h('section', { class: 'hero', 'data-own': '1' }, h('a', { class: 'crumb', href: '#toolkit-sources' }, '← Who’s behind the source'), h('h1', null, 'Source checker'),
        h('p', null, 'Look up any outlet: how it has been rated, on what evidence, and who owns or funds it. A rating is only as good as its evidence, so each one links to the discussions behind it.')),
      h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Who does the rating, and their limits'), h('ul', { class: 'small', style: { margin: 0, paddingLeft: '18px' } },
        h('li', null, h('b', null, 'Wikipedia editors: '), 'volunteers who rate outlets after public discussions of specific errors, fabrications, corrections and ownership. The discussions are the evidence; read them. Most active English-Wikipedia editors are from North America and Europe, so outlets from other regions get less scrutiny, and some ratings are disputed.'),
        h('li', null, h('b', null, 'Wikidata: '), 'records who owns an outlet and whether it is state media or a public broadcaster. Public funding is not the same as state control: the BBC and Germany’s DW are publicly funded but have legal independence; Xinhua and KCNA are run by the state.'),
        h('li', null, h('b', null, 'The Lab’s own profiles: '), h('a', { href: '#toolkit-sources' }, 'Who’s behind the source'), ', with who pays, documented failures and strengths.'),
        h('li', null, h('b', null, 'Commercial raters '), '(NewsGuard, Media Bias/Fact Check, Ad Fontes) are all US-based and are not used here as evidence.'))),
      h('div', { class: 'card' }, q, chips, stats), out);
  };
  // Each country's state and public media, on its Sources tab.
  Lab.countryStateMedia = (c) => { const box = h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'State and public media of ' + c.n), h('p', { class: 'tiny muted', style: { margin: 0 } }, 'Loading…'));
    Lab.stateMediaFor(c.id).then((rows) => { box.replaceChildren(h('h3', { style: { marginTop: 0 } }, 'State and public media of ' + c.n + (rows.length ? ' · ' + rows.length : '')),
      h('p', { class: 'small muted', style: { marginTop: 0 } }, 'Outlets owned or funded by the state, from Wikidata. Read them for the government’s own account; check anything critical of that government elsewhere.'),
      ...(rows.length ? rows.slice(0, 30).map(stateRow) : [h('p', { class: 'small muted' }, 'None recorded on Wikidata yet.')]), h('a', { class: 'small', href: '#sources' }, 'Check any outlet in the source checker →')); });
    return box; };
})();
