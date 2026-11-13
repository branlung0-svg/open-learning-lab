const { h } = Lab;
const CASES = [
  ['The Gulf of Tonkin, 1964', '035d1278-6a4a', 'An attack that likely never happened, and a war authorized because of it.'],
  ['Iraq’s weapons, 2002–04', 'd2694539-f9ea', 'How one fabricated source became a reason for war.'],
  ['Tiananmen 1989: how many died?', '9317f047-024e', 'When a government holds the evidence, what can we know?'],
  ['Hiroshima: why, and what ended the war?', 'fdb247b7-25c8', 'A real historians’ debate where the evidence is rich and still contested.'],
];
const ITEMS = [
  ['North Vietnamese boats attacked two US destroyers on the night of August 4, 1964.', 'President Johnson on national television that night, based on first reports from the ships and intercepted radio traffic.', 'Weak', 'Announced within hours, before the task-group commander’s own cabled doubts were weighed, by an administration that wanted Congress’s backing. The NSA’s own historian later concluded, from the original intercepts, that no attack took place.', 'How could they know so fast, and what did they want to be true?'],
  ['Soviet security police executed 681,692 people in 1937–38.', 'The NKVD’s own internal records, opened after 1991.', 'Strong', 'Records kept by the people doing the killing, for their own bosses, with no reason to inflate; close to Robert Conquest’s 1968 outside estimate. A minimum: it counts formal executions only.', 'Was this written to persuade, or to be used?'],
  ['At least 10,000 civilians were killed in Beijing on June 3–4, 1989.', 'A cable from the British ambassador the next day, relaying one unnamed Chinese source.', 'Weak', 'A real document, but secondhand from a single unnamed source. Reporters on the scene, the US embassy and victims’ families found nothing that high. Strong evidence someone said it; weak evidence for the number.', 'Is it firsthand, and does anyone independent back it?'],
  ['About 2,600 soldiers and civilians died in the Beijing crackdown.', 'A US embassy cable of June 22, 1989, calling the figure not unreasonable.', 'Middling', 'Experienced diplomats with three weeks to gather reports, but partly resting on a Red Cross figure that the Red Cross denied giving. Plausible, not confirmed.', 'Where did the number first come from?'],
  ['Iraq has mobile laboratories for making biological weapons.', 'The US Secretary of State at the UN, February 2003, relying mainly on one defector (“Curveball”) whom US officers never questioned before the war.', 'Weak', 'One source, handled by German intelligence, with motives of his own. No such labs were found, and in 2011 he admitted he made it up to help topple Saddam Hussein.', 'How many independent sources are there, and what did the source want?'],
  ['An invasion of Japan would have cost over a million American casualties.', 'Henry Stimson’s 1947 magazine article, written to answer critics of the atomic bombings.', 'Weak', 'Written after the fact by a man defending a decision he helped make. Surviving 1945 planning estimates are far lower, though historians still argue about what leaders believed that summer.', 'When was it written, and was the author defending himself?'],
  ['30–60 million people died in the famines of 1876–1902 in India, China and Brazil.', 'Mike Davis, Late Victorian Holocausts (2000), combining colonial records and demographers’ estimates.', 'Middling', 'That mass death happened is not in doubt. The range is wide because records were poor; what caused it is a separate argument.', 'Is the claim about what happened, why, or how many?'],
  ['When 100 published psychology studies were repeated, only 36% gave a significant result again.', 'The Open Science Collaboration in Science (2015): about 270 researchers, using the original authors’ materials.', 'Strong', 'Planned in advance, open data, a large team, and published by psychologists against their own field’s interest.', 'Did the people reporting it gain from the result?'],
];
Lab.explorer('evidence', 'rate', {
  mount(el) {
    const picks = ITEMS.map(() => '');
    const head = h('div', { class: 'row' });
    const list = h('div');
    el.append(h('div', { class: 'card' }, h('h3', null, 'How much should this source move you?'), h('p', { class: 'small muted' }, 'Judge the source, not whether you like the claim. Pick once and the reasoning appears.'), head, list),
      h('div', { class: 'card' }, h('h3', null, 'Four full case studies (in your Doc)'), h('div', { class: 'grid g2' }, CASES.map(([t, id, d]) => h('a', { href: Lab.DOC_URL + '#' + id, class: 'card', style: { textDecoration: 'none', boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, t + ' ↗'), h('p', { class: 'small muted', style: { margin: '4px 0 0' } }, d)))),
        h('a', { class: 'btn sm', href: Lab.DOC_URL + '#6146886c-c88e', style: { textDecoration: 'none', marginTop: '10px' } }, 'The full method page ↗')));
    function draw() {
      const answered = picks.filter(Boolean).length, matched = picks.filter((p, i) => p === ITEMS[i][2]).length;
      head.innerHTML = ''; head.append(h('span', { class: 'pill' }, `${matched} of ${answered} match the evidence`)); if (answered === ITEMS.length) head.append(h('span', { class: 'pill', style: { color: 'var(--good)' } }, 'Complete'));
      list.innerHTML = '';
      ITEMS.forEach(([claim, src, ans, why, key], i) => {
        const pk = picks[i];
        list.append(h('div', { style: { borderTop: '1px solid var(--line)', padding: '12px 0' } }, h('b', null, `${i + 1}. ${claim}`), h('div', { class: 'small muted', style: { margin: '4px 0 8px' } }, 'Source: ' + src),
          h('div', { class: 'row' }, ['Strong', 'Middling', 'Weak'].map((lv) => h('button', { class: 'btn sm', disabled: !!pk, style: pk === lv ? { borderColor: lv === ans ? 'var(--good)' : 'var(--bad)', borderWidth: '2px' } : pk && lv === ans ? { borderColor: 'var(--good)', borderStyle: 'dashed', borderWidth: '2px' } : null, onclick: () => { picks[i] = lv; Lab.addXP(lv === ans ? 4 : 1); if (picks.every(Boolean)) Lab.markDone('evidence:all8', 25, 'all sources rated'); draw(); } }, lv))),
          pk ? h('div', { class: 'hint small', style: { marginTop: '8px' } }, h('b', null, pk === ans ? 'Matches the evidence. ' : `The evidence points to ${ans}. `), why, h('div', { class: 'muted', style: { marginTop: '4px' } }, 'Question to ask: ' + key)) : null));
      });
    }
    draw();
  },
});

const QS = [['Who made it, and when?', 'Eyewitness or secondhand? At the time, or years later?'], ['How could they know?', 'Were they there, did they see the records, or are they repeating someone?'], ['What do they gain if I believe it?', 'Money, power, votes, a cause, faith, pride, career, legal safety, reputation.'], ['What would they lose if the opposite were true?', ''], ['Who disagrees, and what do they gain?', 'Ask the same questions of the critics.'], ['Does anyone confirm it who had reason not to?', 'Testimony against one’s own interest is the strongest kind.'], ['Can it be checked against something that doesn’t care?', 'Physical evidence, records made for insiders, data collected for another purpose.'], ['What is missing?', 'If it were true, what else should we find, and is it there?'], ['Has this source been right before?', 'On things that could be checked.'], ['Why am I being told this now?', 'And why does it matter to them that I know it?']];
Lab.explorer('evidence', 'questions', {
  mount(el) {
    const saved = (Lab.state.claims ||= []);
    const claim = h('textarea', { rows: 2, style: { width: '100%' }, placeholder: 'Paste a claim or headline, e.g. “Country X’s economy grew 8% last year”' });
    const source = h('input', { type: 'text', style: { width: '100%', marginTop: '8px' }, placeholder: 'Who is saying it? (outlet, person, organization)' });
    const marks = QS.map(() => 0); const notes = QS.map(() => '');
    const qbox = h('div'); const verdict = h('div'); const hist = h('div');
    el.append(h('div', { class: 'card' }, h('h3', null, 'Question any claim'), claim, source),
      h('div', { class: 'card' }, h('p', { class: 'small muted' }, 'Go through the ten questions. Mark each: ✓ reassuring, ✗ a red flag, ? don’t know yet. Add a note where you can.'), qbox, verdict,
        h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', onclick: save }, 'Save this analysis'), h('button', { class: 'btn', onclick: () => Lab.ask(`Help me evaluate this claim using the ten source questions (who made it, how could they know, incentives, who disagrees, testimony against interest, independent checks, what's missing, track record, why now). Claim: "${claim.value}". Source: "${source.value}". Tell me what you'd need to look up, and be honest about what you can't verify without searching.`, 'Evidence Lab: questioning a claim') }, '✦ Work through it with the tutor'))),
      hist);
    function draw() {
      qbox.innerHTML = '';
      QS.forEach(([q, hint], i) => qbox.append(h('div', { style: { borderTop: '1px solid var(--line)', padding: '10px 0' } }, h('div', { class: 'row' }, h('b', { style: { flex: 1, minWidth: '200px' } }, `${i + 1}. ${q}`),
        ...[['✓', 1, 'var(--good)'], ['✗', -1, 'var(--bad)'], ['?', 0.0001, 'var(--warn)']].map(([s, v, c]) => h('button', { class: 'btn sm', style: marks[i] === v ? { borderColor: c, borderWidth: '2px', color: c } : null, onclick: () => { marks[i] = marks[i] === v ? 0 : v; draw(); } }, s))),
        hint ? h('div', { class: 'tiny muted' }, hint) : null, h('input', { type: 'text', value: notes[i], placeholder: 'Note…', style: { width: '100%', marginTop: '6px', fontSize: '13px' }, oninput: (e) => (notes[i] = e.target.value) }))));
      const pos = marks.filter((m) => m === 1).length, neg = marks.filter((m) => m === -1).length, unk = marks.filter((m) => m > 0 && m < 1).length;
      const lvl = pos + neg + unk < 4 ? null : neg >= 3 ? ['Weak', 'Several red flags. Treat as unconfirmed until independent evidence appears.'] : unk >= 5 ? ['Unknown', 'Too much you can’t check yet. Say “we don’t know” and look for better sources.'] : pos >= 7 && neg === 0 ? ['Strong', 'It passes most checks. Still note what would change your mind.'] : ['Middling', 'Mixed. Hold it loosely and look for the missing pieces.'];
      verdict.innerHTML = '';
      if (lvl) verdict.append(h('div', { class: 'hint small', style: { marginTop: '10px' } }, h('b', null, 'Suggested confidence: '), Lab.conf(lvl[0] === 'Middling' ? 'Contested' : lvl[0]), ' ', lvl[1]));
    }
    function save() { if (!claim.value.trim()) return Lab.toast('Add a claim first'); saved.unshift({ d: new Date().toISOString().slice(0, 10), c: claim.value.trim().slice(0, 300), s: source.value.trim().slice(0, 120), m: marks.slice(), n: notes.map((x) => x.slice(0, 200)) }); Lab.state.claims = saved.slice(0, 20); Lab.markDone('claim:' + Date.now(), 10, 'claim analyzed'); Lab.save(); showHist(); }
    function showHist() { hist.innerHTML = ''; if (!saved.length) return; hist.append(h('div', { class: 'card' }, h('h3', null, 'Your past analyses'), saved.slice(0, 8).map((x) => h('div', { style: { borderTop: '1px solid var(--line)', padding: '8px 0' } }, h('div', { class: 'tiny muted' }, x.d + (x.s ? ' · ' + x.s : '')), h('div', { class: 'small' }, x.c), h('div', { class: 'tiny muted' }, `✓ ${x.m.filter((m) => m === 1).length}  ✗ ${x.m.filter((m) => m === -1).length}  ? ${x.m.filter((m) => m > 0 && m < 1).length}`))))); }
    draw(); showHist();
  },
});
