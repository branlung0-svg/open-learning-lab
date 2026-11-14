/* Source detective: read real archival pictures the way historians, journalists, courts and image-forensics engineers do. */
(function () {
  const h = Lab.h, ARC = Lab.ARC;
  const add = (def) => { const i = ARC.labs.findIndex((l) => l.id === def.id); if (i >= 0) ARC.labs[i] = def; else ARC.labs.push(def); ARC.by[def.id] = def; };
  // [image key, title, [question, [options], correct index, explanation] x3, wider lesson, where it led]
  const CASES = [
    ['c:brookes-slave-ship', 'The Brookes slave ship diagram (1788)',
      [['Who made this, and why?', ['A ship’s officer, to plan the cargo', 'Abolitionists, to persuade Parliament and the public', 'An artist, as decoration'], 1, 'Abolitionists in Plymouth and London drew it from measurements of a real ship, the Brookes, and printed thousands of copies to shock people into opposing the trade.'],
       ['What can it prove?', ['How tightly the law allowed enslaved people to be packed', 'Exactly what every voyage was like', 'That most British people supported slavery'], 0, 'It shows 454 people packed by the space allowed under the 1788 law; records show the Brookes had carried as many as 609 on earlier voyages.'],
       ['What can’t it show on its own?', ['That the ship existed', 'The experiences of the people inside, in their own words', 'The ship’s size'], 1, 'A diagram cannot speak for the enslaved. For that, historians turn to testimony such as Olaudah Equiano’s 1789 narrative.']],
      'Evidence made to persuade can still be accurate. Ask both “who made it and why?” and “can I check the facts?”', 'The diagram became one of the most reproduced images in history; Britain abolished its slave trade in 1807.'],
    ['c:petrograd-july-1917', 'Petrograd, 4 July 1917',
      [['What does the photo show?', ['A parade', 'People scattering as troops fire into a crowd', 'A traffic accident'], 1, 'Viktor Bulla’s photograph shows demonstrators fleeing gunfire on Nevsky Prospekt during the “July Days”.'],
       ['What can it prove?', ['Who fired first', 'That shots were fired and the crowd fled', 'How many people died'], 1, 'A single frame proves that something happened at a moment, not its causes or toll.'],
       ['How would a historian check it?', ['Trust the caption alone', 'Compare with newspapers, diaries, police and army records', 'Count the people in the photo'], 1, 'Corroboration: independent sources that agree are far stronger than any single one.']],
      'One picture is a fact about a moment. Context comes from other sources.', 'Within four months the Bolsheviks seized power in the October Revolution.'],
    ['c:soviet-5yr-poster', '“2 + 2 = 5”: a Soviet poster (1931)',
      [['What is it saying?', ['A maths joke', 'Workers can finish the five-year plan in four years (“2 + 2 years = 5”)', 'An advert for a school'], 1, 'Yakov Guminer’s poster urged workers to complete the first Five-Year Plan early.'],
       ['What can it prove?', ['That the plan was achieved', 'What the state wanted people to believe and do', 'How workers felt'], 1, 'Propaganda is excellent evidence of a government’s goals and methods, and weak evidence of reality.'],
       ['Where did “2 + 2 = 5” go next?', ['Nowhere', 'George Orwell used it in Nineteen Eighty-Four (1949) as the symbol of a state forcing people to deny reality', 'It became a Soviet law'], 1, 'Orwell knew this slogan; it became the most famous symbol of totalitarian control of truth.']],
      'Propaganda tells you about its makers. Read it for the message, the audience and what it leaves out.', 'Official statistics claimed the plan was fulfilled; historians find many targets were missed while the human costs were enormous.'],
    ['c:child-labor-hine', 'A child spinner, Augusta, Georgia (1909)',
      [['Who took it, and why?', ['The mill owner, to advertise', 'Lewis Hine, an investigator for the National Child Labor Committee, to campaign for laws', 'A tourist'], 1, 'Hine often posed as a salesman or inspector to get into mills, and noted children’s names and ages.'],
       ['What can it prove?', ['That children worked at dangerous machines in this mill', 'That every mill used children', 'That the girl was unhappy'], 0, 'It is direct visual evidence for this place and time; Hine’s notes add names and ages.'],
       ['What is a fair criticism of it?', ['It is fake', 'Hine chose his shots to persuade, so it shows the worst cases, not the average', 'It is too old to matter'], 1, 'Advocacy photos are real but selected. Statistics such as census data tell you how typical they were.']],
      'Selection is not fabrication, but it shapes what you see. Ask what is outside the frame.', 'Hine’s photos helped win state laws and, in 1938, federal limits on child labour (the Fair Labor Standards Act).'],
    ['c:reichstag-fire', 'The Reichstag burning (27 February 1933)',
      [['What does the photo prove?', ['Who set the fire', 'That the parliament building burned', 'That Communists were plotting a revolution'], 1, 'It proves the event, not the culprit.'],
       ['How did the Nazis use the event?', ['They ignored it', 'They blamed a Communist plot and the next day suspended civil rights by decree', 'They held new free elections'], 1, 'The Reichstag Fire Decree allowed arrests without trial and was never lifted.'],
       ['What do historians still debate?', ['Whether the fire happened', 'Whether Marinus van der Lubbe acted alone or Nazis were involved', 'Which year it happened'], 1, 'Most historians long accepted he acted alone (Fritz Tobias, 1959); others, such as Benjamin Hett (2014), argue Nazis were involved. The fire is not in doubt.']],
      'Separate the event (certain) from who caused it (debated) from how it was used (documented).', 'Within a month the Enabling Act ended German democracy.'],
    ['c:ford-assembly', 'Ford’s moving assembly line (about 1913)',
      [['What does it show?', ['Hand-built luxury cars', 'Workers each repeating one task as the product moves past them', 'A car showroom'], 1, 'Adam Smith’s division of labour, scaled up with conveyor belts.'],
       ['What can’t a photo like this show?', ['That cars were built', 'That worker turnover hit about 370% in 1913 because the work was so monotonous', 'That there were machines'], 1, 'Company records, not pictures, reveal the human cost; Ford responded with the $5 day in 1914.'],
       ['Who made photos like this?', ['Undercover journalists', 'Often the company itself, for publicity', 'Unions only'], 1, 'Corporate images showcase efficiency. Compare them with workers’ accounts.']],
      'Ask who benefits from an image, and look for the records it does not show.', 'Mass production cut the Model T’s price by more than half within a few years, putting cars within reach of ordinary families.'],
  ];
  const WHERE = [['History', 'Source criticism: who made it, when, why, for whom.', 'd-history'], ['Journalism and open-source investigation', 'Verifying photos and videos with location, shadows and metadata, as Bellingcat does.', 'whois'], ['Law', 'Courts ask who handled evidence (the chain of custody) and whether it was altered.', 'd-law'], ['Computer science', 'Image-forensics software and AI models detect edits and deepfakes; provenance standards record where an image came from.', 'd-computing'], ['Psychology', 'Pictures persuade more than text; knowing that helps you resist manipulation.', 'd-psychology'], ['Your life', 'Before you share a shocking picture: who posted it first, when, and does anyone independent confirm it?', 'whois']];
  add({ id: 'sourcedetective', d: ['history', 'computing', 'law', 'psychology', 'arts'], e: '🕵️', t: 'Source detective: what can a picture prove?',
    b: 'Six real archival pictures, from a slave-ship diagram to a Soviet poster. Work out who made each one, why, and what it can and cannot prove, the way historians, journalists, courts and image-forensics engineers do.',
    how: 'Historians call this source criticism: every source was made by someone, for some purpose, for some audience. Propaganda and advocacy can be accurate or false; photographs can be real but selected. The same questions are now automated in computer science, which builds tools to detect edited images and record where pictures came from.',
    use: 'Checking viral images, reading the news, weighing evidence in court or in your own research.',
    m(el, K) {
      let i = 0, q = 0, score = 0, total = 0; const stage = h('div');
      const draw = () => { stage.innerHTML = '';
        if (i >= CASES.length) { stage.append(h('div', { class: 'card', style: { boxShadow: 'none', border: '2px solid #16A34A' } }, h('h3', { style: { marginTop: 0 } }, `You scored ${score} / ${total}`), h('p', { class: 'small' }, 'The same five questions work on any picture you see: Who made it? Why? For whom? What can it prove? What is outside the frame?'),
          h('h4', null, 'Where this skill is used'), h('div', { class: 'grid g2' }, WHERE.map(([t, d, hs]) => h('a', { href: '#' + hs, class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', textDecoration: 'none', color: 'inherit' } }, h('b', { class: 'small' }, t), h('div', { class: 'small muted' }, d)))),
          K.btn('Play again', () => { i = 0; q = 0; score = 0; total = 0; draw(); }, true))); return; }
        const [img, title, Qs, lesson, after] = CASES[i]; const [qq, opts, right, why] = Qs[q]; const fb = h('div');
        stage.append(h('div', { class: 'tiny muted' }, `Picture ${i + 1} of ${CASES.length} · question ${q + 1} of 3 · score ${score}/${total}`), h('h3', { style: { margin: '4px 0 8px' } }, title),
          h('div', { class: 'grid g2', style: { alignItems: 'start' } }, Lab.cfig(img, { max: '320px', fit: 'contain' }),
            h('div', null, h('p', null, h('b', null, qq)), h('div', { class: 'stack', style: { gap: '6px' } }, opts.map((o, j) => h('button', { class: 'opt', onclick: (e) => { if (fb.childNodes.length) return; total++; const ok = j === right; if (ok) score++;
              e.target.classList.add(ok ? 'right' : 'wrong'); [...stage.querySelectorAll('.opt')][right].classList.add('right');
              fb.append(h('p', { class: 'small', style: { marginTop: '8px' } }, h('b', null, ok ? '✅ Right. ' : '❌ Not quite. '), why),
                q === 2 ? h('div', { class: 'small', style: { padding: '10px', background: 'var(--card2)', borderRadius: '10px' } }, h('b', null, '🔑 Lesson: '), lesson, h('br'), h('b', null, '➡️ What happened next: '), after) : null,
                K.btn(q < 2 ? 'Next question →' : i < CASES.length - 1 ? 'Next picture →' : 'See your results →', () => { if (q < 2) q++; else { q = 0; i++; } draw(); }, true)); } }, o))), fb))); };
      el.append(stage); draw();
    } });
})();
