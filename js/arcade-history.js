/* History labs built on real data. 1. Could anyone govern Weimar Germany? (Reichstag seats 1928–1933) */
(function () {
  const h = Lab.h, ARC = Lab.ARC;
  const add = (def) => { const i = ARC.labs.findIndex((l) => l.id === def.id); if (i >= 0) ARC.labs[i] = def; else ARC.labs.push(def); ARC.by[def.id] = def; };
  const P = { NSDAP: ['Nazi Party (NSDAP)', '#7F1D1D'], KPD: ['Communists (KPD)', '#DC2626'], SPD: ['Social Democrats (SPD)', '#F472B6'], Z: ['Catholic Centre (Zentrum)', '#111827'], BVP: ['Bavarian People’s Party (BVP)', '#4B5563'], DDP: ['Democrats / State Party (DDP/DStP)', '#EAB308'], DVP: ['People’s Party (DVP, liberal-conservative)', '#2563EB'], DNVP: ['German Nationals (DNVP, nationalist right)', '#1E3A8A'], WP: ['Economic Party (WP)', '#A16207'], O: ['Small parties', '#D6D3D1'] };
  // Seats from official results (Gonschior.de / Statistisches Reichsamt); Nazi vote share in brackets.
  const E = {
    y28: ['20 May 1928', 2.6, { SPD: 153, DNVP: 73, Z: 61, KPD: 54, DVP: 45, DDP: 25, WP: 23, BVP: 17, NSDAP: 12, O: 28 }],
    y30: ['14 September 1930', 18.3, { SPD: 143, NSDAP: 107, KPD: 77, Z: 68, DNVP: 41, DVP: 30, WP: 23, DDP: 20, BVP: 19, O: 49 }],
    j32: ['31 July 1932', 37.3, { NSDAP: 230, SPD: 133, KPD: 89, Z: 75, DNVP: 37, BVP: 22, DVP: 7, DDP: 4, O: 11 }],
    n32: ['6 November 1932', 33.1, { NSDAP: 196, SPD: 121, KPD: 100, Z: 70, DNVP: 51, BVP: 20, DVP: 11, DDP: 2, O: 13 }],
    y33: ['5 March 1933 (under terror, after Hitler’s appointment)', 43.9, { NSDAP: 288, SPD: 120, KPD: 81, Z: 73, DNVP: 52, BVP: 19, DDP: 5, DVP: 2, O: 7 }],
  };
  const verdict = (ok, text) => h('div', { class: 'small', style: { marginTop: '10px', padding: '10px 12px', borderRadius: '10px', background: ok ? '#16A34A1A' : '#DC26261A', borderLeft: `4px solid ${ok ? '#16A34A' : '#DC2626'}` } }, text);
  add({ id: 'reichstag', d: ['history', 'politics', 'geopolitics', 'math'], e: '🗳️', t: 'Could anyone govern Weimar Germany?',
    b: 'Use the real Reichstag seat counts from 1928 to 1933. Try to build a majority government without the Nazis or the Communists, and see the moment it became impossible.',
    how: 'In a parliamentary system a government needs a majority of seats, or at least a majority that will not vote it down. Weimar Germany used proportional representation, so many parties won seats and every government was a coalition. When parties that wanted to destroy the system together hold more than half the seats, no democratic majority can form: political scientists call this a “negative majority”.',
    use: 'Coalition-building in any parliament today; why some countries set a minimum vote share to win seats; how democracies can break down without a majority ever voting to end them.',
    m(el, K) {
      let ev = 'j32'; let on = new Set(['SPD', 'Z', 'BVP', 'DDP', 'DVP']);
      const bar = h('div', { style: { display: 'flex', height: '34px', borderRadius: '8px', overflow: 'hidden', margin: '10px 0 4px', border: '1px solid var(--line)' } });
      const chips = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }); const out = h('div');
      const kp = { s: K.big(), m: K.big(), x: K.big() };
      const draw = () => { const [label, nazi, S] = E[ev]; const total = Object.values(S).reduce((a, b) => a + b, 0); const need = Math.floor(total / 2) + 1;
        const coal = [...on].filter((k) => S[k]).reduce((a, k) => a + S[k], 0); const anti = (S.NSDAP || 0) + (S.KPD || 0);
        bar.innerHTML = ''; chips.innerHTML = '';
        Object.entries(S).forEach(([k, n]) => { bar.append(h('div', { title: `${P[k][0]}: ${n}`, style: { width: (100 * n / total) + '%', background: P[k][1], opacity: on.has(k) ? 1 : 0.25 } }));
          chips.append(h('button', { class: 'btn sm', style: { border: on.has(k) ? `2px solid ${P[k][1]}` : '1px solid var(--line)', fontWeight: on.has(k) ? 700 : 400 }, onclick: () => { on.has(k) ? on.delete(k) : on.add(k); draw(); } }, `${on.has(k) ? '✓ ' : ''}${P[k][0]} · ${n}`)); });
        kp.s.textContent = `${coal} of ${total}`; kp.m.textContent = need; kp.x.textContent = `${anti} (${Math.round(100 * anti / total)}%)`;
        const extreme = on.has('NSDAP') || on.has('KPD'); const maxDemo = total - anti;
        out.innerHTML = ''; out.append(h('div', { class: 'tiny muted' }, `Election of ${label}. The Nazis won ${nazi}% of the vote.`),
          coal >= need && !extreme ? verdict(true, `Majority found without the Nazis or Communists: ${coal} seats. On paper a democratic coalition was possible in this parliament.`)
            : coal >= need ? verdict(false, `This coalition has a majority (${coal} seats), but it includes a party that wanted to abolish the republic.`)
            : maxDemo < need ? verdict(false, `Impossible: even if every other party joined, they would have only ${maxDemo} seats, short of the ${need} needed. The Nazis and Communists together held a “negative majority” of ${anti} seats.`)
            : verdict(false, `Not a majority yet: ${coal} seats, ${need - coal} short. Every party except the Nazis and Communists together would have ${maxDemo}.`)); };
      el.append(h('div', { class: 'card', style: { boxShadow: 'none', border: '2px solid var(--accent, #2563EB)', padding: '12px 14px', marginBottom: '10px' } }, h('b', null, '🎯 Mission: keep the republic alive'), h('div', { class: 'small', style: { marginTop: '4px' } }, 'You advise President Hindenburg. For each election, tap parties to build a coalition with a majority of seats, without the Nazis or the Communists, who both wanted to end the republic. Find the election where it becomes impossible.')),
        h('div', { class: 'tiny muted' }, 'Election'), K.choice(Object.entries(E).map(([k, v]) => [k, v[0].split(' (')[0]]), ev, (v) => { ev = v; draw(); }),
        bar, h('div', { class: 'tiny muted', style: { marginBottom: '8px' } }, 'Each block is a party’s share of seats. Faded blocks are outside your coalition.'), chips,
        K.kpis([['Your coalition’s seats', kp.s], ['Seats needed for a majority', kp.m], ['Nazi + Communist seats', kp.x]]), out,
        h('details', { style: { marginTop: '12px' } }, h('summary', { class: 'small', style: { cursor: 'pointer', fontWeight: 600 } }, '🔎 Reality check: what happened'), h('div', { class: 'small', style: { marginTop: '6px' } },
          h('p', null, 'The last majority government, a grand coalition under Social Democrat Hermann Müller, fell in March 1930 over unemployment insurance. From then on chancellors Brüning, Papen and Schleicher governed mainly through presidential emergency decrees under Article 48 of the constitution, and the Reichstag was dissolved again and again.'),
          h('p', null, 'After July 1932 no majority without the Nazis or Communists was possible. Conservatives around Hindenburg chose to bring the Nazis in, believing they could control Hitler. He was appointed chancellor on 30 January 1933 at the head of a coalition with the German Nationals. The March 1933 election was held under terror; the Communists’ 81 deputies were arrested, in hiding or barred, and the Enabling Act passed 444 to 94, with only the Social Democrats voting no.'),
          h('p', { class: 'tiny muted' }, 'Historians debate whether different choices could have saved the republic: a Social Democrat–Centre–liberal alliance earlier, a ban on the Nazi party, or a military government without Hitler.'),
          Lab.source('Seat counts: official results compiled by <a href="https://webarchiv.bundestag.de/archive/2007/0711/geschichte/infoblatt/wahlen_weimarer_republik.pdf" target="_blank" rel="noopener">German Bundestag, Wahlen in der Weimarer Republik (PDF)</a> and Gonschior.de; <a href="https://encyclopedia.ushmm.org/content/en/article/the-nazi-rise-to-power" target="_blank" rel="noopener">USHMM, The Nazi Rise to Power</a>.')))); draw();
    } });
})();
