/* Accuracy audit: how the Lab checks its own statements, what was found and what changed. Route #audit. */
(() => {
  const h = Lab.h;
  const V = {
    accurate: ['Accurate', '#047857', 'Matches the best sources, with nothing important left out.'],
    context: ['Needs context', '#0891B2', 'True, but vague or missing something a reader needs to judge it.'],
    overstated: ['Overstated', '#B45309', 'Says more, or more certainly, than the evidence supports.'],
    understated: ['Understated', '#B45309', 'Makes something sound smaller or milder than the evidence shows.'],
    misleading: ['Misleading', '#7C3AED', 'Each word may be true, but the overall picture is skewed, or one side is judged by a different standard.'],
    unsupported: ['Unsupported', '#B91C1C', 'We could not find a reliable source for it.'],
    wrong: ['Wrong', '#7F1D1D', 'Contradicted by reliable evidence.'],
    outdated: ['Out of date', '#2563EB', 'Was true, but things have changed.'],
    disputed: ['Disputed', '#475569', 'Serious researchers disagree; we show the main positions instead of picking one.'],
  };
  const P = [['Kept', '#047857', 'The promise or claim matched what happened.'], ['Partly true', '#B45309', 'Some of it held, some did not.'], ['Twisted', '#B45309', 'Built on a fact, but bent to hide a larger truth.'], ['Broken', '#B91C1C', 'A promise that was not kept.'], ['False', '#7F1D1D', 'The record shows the opposite.']];
  const BY = { first: 'Audit first pass', earlier: 'Fixed earlier this month', independent: 'Independent re-check', monthly: 'Monthly re-check' };
  const tag = (n, c) => h('span', { class: 'tag', style: { '--c': c } }, n);
  const card = (title, ...kids) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, title), ...kids);
  const num = (n) => Number(n).toLocaleString('en-US');

  Lab.routes.audit = (app) => {
    Lab.setContext && Lab.setContext('Accuracy audit: how the Lab checks its own statements, what was found and what was changed');
    const stats = h('div', { class: 'small muted' }, 'Loading the numbers…');
    const sample = h('div', { class: 'small muted' }, 'Loading…');
    const bar = h('div', { class: 'tn-bar' }); const list = h('div', { class: 'stack', style: { gap: '8px' } });
    let all = [], f = 'all';
    const draw = () => {
      const keys = ['all', ...Object.keys(V).filter((k) => all.some((x) => x.v === k))];
      bar.replaceChildren(...keys.map((k) => h('button', { class: 'btn sm' + (f === k ? ' primary' : ''), onclick: () => { f = k; draw(); } }, (k === 'all' ? 'All' : V[k][0]) + ' · ' + all.filter((x) => k === 'all' || x.v === k).length)));
      list.replaceChildren(...all.filter((x) => f === 'all' || x.v === f).map((x) => h('div', { class: 'card', style: { margin: 0, borderLeft: `5px solid ${(V[x.v] || V.disputed)[1]}` } },
        h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', alignItems: 'center' } }, tag((V[x.v] || V.disputed)[0], (V[x.v] || V.disputed)[1]), x.page ? h('a', { class: 'small', href: '#' + x.page }, x.area) : h('span', { class: 'small' }, x.area), h('span', { class: 'sp' }), h('span', { class: 'tiny muted' }, BY[x.by] || x.by)),
        h('p', { class: 'small', style: { margin: '6px 0 2px' } }, h('b', null, 'Statement: '), x.claim),
        h('p', { class: 'small', style: { margin: '2px 0' } }, h('b', null, 'What we did: '), x.fix),
        x.src && x.src.length ? h('div', { class: 'tiny muted' }, 'Sources: ', ...x.src.slice(0, 3).map((u, i) => h('a', { href: u, target: '_blank', rel: 'noopener', style: { marginRight: '8px' } }, '[' + (i + 1) + ']'))) : null)));
    };
    Promise.all([Lab.json('data/audit-summary.json').catch(() => null), Lab.json('data/audit-findings.json').catch(() => []), Lab.json('data/audit-recheck.json').catch(() => null)]).then(([s, fd, rc]) => {
      if (s) stats.replaceChildren(
        h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } }, ...[[num(s.total), 'checkable statements found'], [num(s.files), 'files scanned'], [num(s.tiers[0]), 'highest-risk (tier 1)'], [num(s.pilot), 'in the pilot pages']].map(([n, l]) => h('div', { class: 'mp-box', style: { flex: '1 1 130px' } }, h('div', { style: { fontSize: '22px', fontWeight: 700 } }, n), h('div', { class: 'tiny muted' }, l)))),
        h('p', { class: 'small', style: { margin: '8px 0 0' } }, 'Tier 1 means the statement gives a death toll, uses a label such as “genocide” or “fascist”, quotes someone, or describes the present. Tier 2 is other numbers and facts on evidence pages; tier 3 is the rest.'));
      const rows = (rc && rc.length ? rc.map((r) => ({ page: r.page || '', area: r.area || r.file, claim: r.claim, v: r.verdict, fix: r.fix || r.reason, src: r.sources || [], by: 'independent' })) : []);
      all = fd.concat(rows); draw();
      if (rc && rc.length) {
        const n = rc.length, c = (k) => rc.filter((r) => r.verdict === k).length; const bad = n - c('accurate') - c('disputed');
        sample.replaceChildren(h('p', { class: 'small', style: { marginTop: 0 } }, `A separate checker, who had not seen our notes, re-checked ${n} statements picked at random from the tier-1 pilot set. ${c('accurate')} were accurate, ${bad} had a problem of some kind, and ${c('disputed')} were genuinely disputed.`),
          h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, ...Object.keys(V).filter((k) => c(k)).map((k) => tag(`${V[k][0]}: ${c(k)}`, V[k][1]))),
          h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, `With only ${n} statements this is a rough guide, not a precise error rate: the true share could be quite a bit higher or lower. Some primary sites were out of the checker’s reach, so a few checks rest on reliable secondary summaries. Every result, kept or fixed, is listed below as “Independent re-check”.`));
      } else sample.textContent = 'The independent re-check of a random sample is in progress. Results will appear here.';
    });
    app.append(
      h('section', { class: 'hero', 'data-own': '1' }, h('h1', null, '✅ Accuracy audit: checking our own work'), h('p', null, 'Any page here can be wrong. This page shows how we check the Lab, what we found and what we changed, including mistakes that made one side look better or worse than the evidence supports.')),
      card('Where the audit stands', stats, h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, 'The pilot covers the case files, the China story line, Follow the money and the Marx path. Older deep dives are next, highest-risk first.')),
      card('🎯 The scale we use', h('p', { class: 'small', style: { marginTop: 0 } }, 'Not everything is a lie, and not everything is true. Each statement gets one of these verdicts:'),
        h('div', { class: 'stack', style: { gap: '4px' } }, ...Object.values(V).map(([n, c, d]) => h('div', { class: 'row', style: { gap: '8px', alignItems: 'baseline' } }, tag(n, c), h('span', { class: 'small' }, d)))),
        h('h4', { style: { margin: '12px 0 4px' } }, 'For what leaders said versus what happened'), h('p', { class: 'small', style: { marginTop: 0 } }, 'Each case file now has a “What they said versus what happened” section, graded on this scale:'),
        h('div', { class: 'stack', style: { gap: '4px' } }, ...P.map(([n, c, d]) => h('div', { class: 'row', style: { gap: '8px', alignItems: 'baseline' } }, tag(n, c), h('span', { class: 'small' }, d))))),
      card('🔁 Independent re-check of a random sample', sample),
      h('div', { class: 'card sticky-wide' }, h('div', { class: 'tiny muted', style: { marginBottom: '4px' } }, 'Findings so far, including statements we checked and kept'), bar), list,
      card('🧭 How the audit works',
        h('ol', { class: 'small', style: { margin: 0, paddingLeft: '20px' } },
          h('li', null, 'A script scans every page for statements that can be checked: numbers, death tolls, labels, quotes and claims about the present.'),
          h('li', null, 'Statements are ranked by risk, so the ones that could most mislead are checked first.'),
          h('li', null, 'Each is checked against sources from more than one side, and graded on the scale above.'),
          h('li', null, 'A second checker re-checks a random sample without seeing the first notes, to catch what the first pass missed.'),
          h('li', null, 'Every fix is logged publicly on the corrections page, with sources.'),
          h('li', null, 'Fast-moving topics (2025–26 events) are re-checked every month.')),
        h('p', { class: 'small', style: { marginBottom: 0 } }, h('b', null, 'Limits: '), 'A scan can find what a page says, not what it leaves out; omissions need human reading. Most checking so far is by one AI reviewer with a second as a check, and most sources are in English. Report anything we missed.')),
      card('📥 Open the data yourself',
        h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap' } },
          h('a', { class: 'btn sm', href: 'data/audit-inventory.csv', download: 'open-learning-lab-statements.csv' }, '⬇ All statements (spreadsheet, CSV)'),
          h('a', { class: 'btn sm', href: '#changes' }, '📝 Every correction'),
          h('a', { class: 'btn sm', href: '#method' }, '📏 Research standard'),
          h('a', { class: 'btn sm', href: '#reviewers' }, '🧑‍⚖️ How it’s checked'),
          h('button', { class: 'btn sm primary', onclick: () => Lab.flagError && Lab.flagError() }, '⚑ Report a problem')),
        h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, 'The spreadsheet lists every statement the scan found, with its file, risk tier and what kind of claim it is. It opens in Excel, Google Sheets or Numbers.')));
    return app;
  };
})();
