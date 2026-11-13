// Sourced claim records: data/claims/<disc>.json. Each claim carries its sources, a confidence label and a review status.
(function () {
  const { h } = Lab;
  const cache = {};
  Lab.claims = (disc) => (cache[disc] ||= fetch(`data/claims/${disc}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  const STATUS = {
    drafted: ['Sources linked', 'Written with sources attached. Not yet independently checked.'],
    verified: ['Checked', 'An independent check confirmed that the linked source supports this statement.'],
    reviewed: ['Expert reviewed', 'A named subject expert has reviewed this statement.'],
  };
  Lab.timeline = (color, items, extra) => h('div', { class: 'stack', style: { gap: 0, borderLeft: `3px solid ${color}`, marginLeft: '8px' } }, items.map((it) => h('div', { style: { position: 'relative', padding: '8px 0 12px 20px' } },
    h('span', { style: { position: 'absolute', left: '-8px', top: '13px', width: '13px', height: '13px', borderRadius: '50%', background: color, border: '3px solid var(--card)' } }),
    h('div', { class: 'tiny', style: { fontWeight: 700, color, letterSpacing: '.02em' } }, it.when), h('div', null, it.text), extra ? extra(it) : null)));
  const srcLine = (c) => h('div', { class: 'tiny muted', style: { marginTop: '3px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' } },
    c.conf ? h('span', { class: 'conf ' + c.conf }, c.conf) : null,
    c.status && STATUS[c.status] ? h('span', { title: STATUS[c.status][1], style: { border: '1px solid var(--line)', borderRadius: '6px', padding: '1px 6px' } }, (c.status === 'drafted' ? '◔ ' : '✓ ') + STATUS[c.status][0]) : null,
    ...(c.sources || []).map((s) => h('a', { href: s.url, target: '_blank', rel: 'noopener', style: { color: 'inherit' } }, '↗ ' + s.cite)),
    h('button', { class: 'btn sm', style: { padding: '0 6px', fontSize: '11px' }, title: 'Report a problem with this statement', onclick: () => Lab.flagError && Lab.flagError(`Claim ${c.id}: ${c.text}`) }, '⚑'));
  Lab.claimsTimeline = (D, C) => {
    const ev = C.events || [];
    const counts = ev.reduce((m, c) => ((m[c.status] = (m[c.status] || 0) + 1), m), {});
    const show = h('div');
    const head = h('p', { class: 'small muted' }, `${ev.length} events, each with its source. `,
      Object.entries(counts).map(([k, n]) => `${n} ${(STATUS[k] || [k])[0].toLowerCase()}`).join(' · '),
      '. Tap ↗ to read the source yourself, or ⚑ to report a mistake.');
    show.append(Lab.timeline(D.c, ev, srcLine));
    return h('div', null, head, show);
  };
  Lab.claimsPeople = (C) => {
    const P = C.people || [];
    if (!P.length) return null;
    return h('div', { style: { marginTop: '14px' } }, h('h3', null, 'More people who shaped it, worldwide'),
      h('div', { class: 'grid g2' }, P.map((p) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', padding: '12px' } },
        h('b', null, p.name), h('span', { class: 'tiny muted' }, `  ${p.years} · ${p.region}`), h('div', { class: 'small' }, p.text),
        h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, (p.sources || []).map((s) => h('a', { href: s.url, target: '_blank', rel: 'noopener', style: { color: 'inherit', marginRight: '8px' } }, '↗ ' + s.cite)))))));
  };
})();
