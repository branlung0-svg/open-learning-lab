/* Lab Arcade: logic, computer science & AI, statistics */
(function () {
  const A = Lab.ARC.add, h = Lab.h;

  // ======================= LOGIC =======================
  A({ id: 'truthtable', d: ['logic', 'computing', 'math'], e: '✅', t: 'Truth table builder', b: 'Type any logical formula and get its full truth table. Find tautologies and contradictions.',
    how: 'Every statement is true (1) or false (0). AND needs both, OR needs at least one, NOT flips, → (if… then) is false only when a true premise leads to a false conclusion. George Boole turned this into algebra in 1854; Wittgenstein popularized truth tables in 1921.',
    use: 'Every computer chip, database query and search filter evaluates these formulas billions of times a second. Lawyers and philosophers use the same logic to test arguments.',
    m(el, K) {
      const inp = h('input', { type: 'text', value: '(p -> q) & p -> q', style: { width: '100%', fontFamily: 'monospace' } }); const tbl = h('div', { style: { overflowX: 'auto', marginTop: '8px' } }); const out = K.out();
      const compile = (src) => { const t = src.replace(/<->/g, ' = ').replace(/->/g, ' > ').replace(/\band\b/g, '&').replace(/\bor\b/g, '|').replace(/\bnot\b/g, '~').replace(/!/g, '~').match(/[a-z]|[=>&|~()]/g) || []; let i = 0; const vars = [...new Set(t.filter((x) => /[a-z]/.test(x)))].sort();
        const peek = () => t[i], eat = (x) => { if (t[i] !== x) throw new Error('expected ' + x); i++; };
        const atom = () => { const c = t[i++]; if (c === '(') { const e = iff(); eat(')'); return e; } if (c && /[a-z]/.test(c)) return (env) => env[c]; throw new Error('bad'); };
        const neg = () => (peek() === '~' ? (i++, ((e) => (env) => !e(env))(neg())) : atom());
        const and = () => { let e = neg(); while (peek() === '&') { i++; const l = e, r = neg(); e = (env) => l(env) && r(env); } return e; };
        const or = () => { let e = and(); while (peek() === '|') { i++; const l = e, r = and(); e = (env) => l(env) || r(env); } return e; };
        const imp = () => { const l = or(); if (peek() === '>') { i++; const r = imp(); return (env) => !l(env) || r(env); } return l; };
        const iff = () => { let e = imp(); while (peek() === '=') { i++; const l = e, r = imp(); e = (env) => l(env) === r(env); } return e; };
        const e = iff(); if (i < t.length) throw new Error('extra'); return { vars, f: (...v) => !!e(Object.fromEntries(vars.map((x, k) => [x, v[k]]))) }; };
      const run = () => { try { const { vars, f } = compile(inp.value); const rows = []; for (let m = 0; m < 2 ** vars.length; m++) { const v = vars.map((_, i) => !!((m >> (vars.length - 1 - i)) & 1)); rows.push([...v, f(...v)]); }
          const res = rows.map((r) => r[r.length - 1]); tbl.innerHTML = `<table style="border-collapse:collapse;font-family:monospace"><tr>${[...vars, inp.value].map((x) => `<th style="padding:4px 10px;border-bottom:2px solid var(--line)">${x}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((x, i) => `<td style="padding:3px 10px;text-align:center;${i === r.length - 1 ? 'font-weight:700;color:' + (x ? '#16A34A' : '#DC2626') : ''}">${x ? 'T' : 'F'}</td>`).join('')}</tr>`).join('')}</table>`;
          out.innerHTML = res.every(Boolean) ? '✅ <b>Tautology</b>: true in every case. This is a valid argument form.' : !res.some(Boolean) ? '⛔ <b>Contradiction</b>: false in every case.' : `<b>Contingent</b>: true in ${res.filter(Boolean).length} of ${res.length} cases.`; } catch (e) { out.textContent = 'Could not read that formula. Use letters p, q, r and &, |, ~, ->, <->'; } };
      inp.oninput = run;
      el.append(h('label', { class: 'ctl' }, 'Formula (letters p q r s; & and, | or, ~ not, -> if-then, <-> if and only if)'), inp,
        h('div', { class: 'row', style: { marginTop: '6px' } }, [['Modus ponens', '(p -> q) & p -> q'], ['Affirming the consequent ✗', '(p -> q) & q -> p'], ['De Morgan', '~(p & q) <-> (~p | ~q)'], ['Excluded middle', 'p | ~p'], ['Contradiction', 'p & ~p'], ['Contrapositive', '(p -> q) <-> (~q -> ~p)']].map(([l, f]) => K.btn(l, () => { inp.value = f; run(); }))), out, tbl); run();
    } });

  A({ id: 'gates', d: ['logic', 'computing', 'engineering', 'physics'], e: '🔌', t: 'Logic gates to an adder', b: 'Flip switches through AND, OR, XOR gates and build a circuit that adds binary numbers.',
    how: 'Gates are tiny switches made of transistors. A half adder uses XOR for the sum bit and AND for the carry. Chain full adders and you can add any numbers: this is the heart of a CPU’s arithmetic unit. Claude Shannon showed in 1937 that Boolean logic maps onto relay circuits.',
    use: 'Every processor, phone and calculator. A modern chip has tens of billions of transistors built into gates like these.',
    m(el, K) {
      const a = [0, 1, 1, 0], b = [0, 1, 0, 1]; const box = h('div'); const draw = () => { box.innerHTML = ''; let carry = 0; const sum = []; const rows = [];
        for (let i = 3; i >= 0; i--) { const s = a[i] ^ b[i] ^ carry; const c = (a[i] & b[i]) | (carry & (a[i] ^ b[i])); rows.unshift([a[i], b[i], carry, s, c]); sum.unshift(s); carry = c; }
        const bit = (arr, i) => h('button', { class: 'btn', style: { width: '44px', fontFamily: 'monospace', background: arr[i] ? '#2563EB' : null, color: arr[i] ? '#fff' : null }, onclick: () => { arr[i] ^= 1; draw(); } }, arr[i]);
        const val = (x) => x.reduce((p, q) => p * 2 + q, 0);
        box.append(h('div', { class: 'row' }, h('span', { style: { width: '30px' } }, 'A'), ...a.map((_, i) => bit(a, i)), h('b', null, ' = ' + val(a))), h('div', { class: 'row', style: { marginTop: '4px' } }, h('span', { style: { width: '30px' } }, 'B'), ...b.map((_, i) => bit(b, i)), h('b', null, ' = ' + val(b))),
          h('div', { class: 'kpi', style: { marginTop: '10px' } }, `${carry}${sum.join('')} `, h('small', null, `= ${val([carry, ...sum])} in decimal`)),
          h('table', { class: 'small', style: { marginTop: '8px', borderCollapse: 'collapse' } }, h('tr', null, ['bit', 'A', 'B', 'carry in', 'sum = A⊕B⊕c', 'carry out'].map((x) => h('th', { style: { padding: '3px 8px' } }, x))), rows.map((r, i) => h('tr', null, h('td', { style: { padding: '3px 8px' } }, 2 ** (3 - i)), r.map((x) => h('td', { style: { padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace' } }, x)))))); };
      const gates = h('div', { class: 'grid g4', style: { marginTop: '12px' } }); const gx = [0, 1]; const gd = () => { gates.innerHTML = ''; [['AND', (x, y) => x & y], ['OR', (x, y) => x | y], ['XOR', (x, y) => x ^ y], ['NAND', (x, y) => 1 - (x & y)]].forEach(([n, f]) => gates.append(h('div', { class: 'card', style: { boxShadow: 'none', textAlign: 'center' } }, h('b', null, n), h('div', { class: 'kpi' }, f(gx[0], gx[1]))))); };
      el.append(h('h3', { style: { marginTop: 0 } }, 'Single gates'), h('div', { class: 'row' }, ...[0, 1].map((i) => K.btn('Input ' + 'XY'[i], (e) => { gx[i] ^= 1; e.target.textContent = 'Input ' + 'XY'[i] + ' = ' + gx[i]; gd(); }))), gates,
        h('p', { class: 'tiny muted' }, 'NAND alone can build every other gate, which is why chips are often built from it.'), h('h3', null, '4-bit adder (click bits)'), box); gd(); draw();
    } });

  A({ id: 'venn', d: ['logic', 'philosophy', 'math'], e: '⭕', t: 'Syllogism checker', b: 'All A are B, some B are C… Is the conclusion valid? Check it with Venn diagrams.',
    how: 'Aristotle catalogued valid argument forms (syllogisms) around 350 BC. An argument is valid if the conclusion must be true whenever the premises are, whatever the words mean. Venn (1880) drew them as overlapping circles: shade empty regions, mark regions known to have members.',
    use: 'Spotting bad arguments in politics, ads and news; legal reasoning; database queries (SQL joins are Venn diagrams); and medical diagnosis rules.',
    m(el, K) {
      const items = [['All dogs are mammals. All mammals are animals. So all dogs are animals.', true, 'Barbara: the dog circle sits inside mammals, which sits inside animals.'], ['All cats are mammals. All dogs are mammals. So all cats are dogs.', false, 'Undistributed middle: two circles inside a third need not overlap.'], ['Some politicians are lawyers. Some lawyers are honest. So some politicians are honest.', false, 'The honest lawyers might be different lawyers from the politician lawyers.'],
        ['No fish are mammals. All whales are mammals. So no whales are fish.', true, 'Whales sit inside mammals, which is completely outside fish.'], ['All successful people wake up early. I wake up early. So I will be successful.', false, 'Affirming the consequent: being in the bigger circle doesn’t put you in the smaller one.'], ['Some students are athletes. All athletes are disciplined. So some students are disciplined.', true, 'The student-athletes are inside the disciplined circle.']];
      K.quiz(items.map(([q, v, ex]) => [q, ['Valid', 'Invalid'], v ? 0 : 1, ex]), el);
      el.append(h('p', { class: 'tiny muted', style: { marginTop: '10px' } }, 'Valid does not mean true: “All fish fly; all sharks are fish; so all sharks fly” is valid but has a false premise. Sound = valid + true premises.'));
    } });

  A({ id: 'fallacies', d: ['logic', 'philosophy', 'politics', 'psychology'], e: '🎭', t: 'Fallacy detector', b: 'Real-sounding arguments with a flaw hidden inside. Name the fallacy.',
    how: 'Fallacies are reasoning mistakes that feel persuasive. Many were named by medieval logicians in Latin (ad hominem = “to the person”). Persuasion works by exploiting mental shortcuts, so naming the trick helps you resist it, whichever side uses it.',
    use: 'Political debates, advertising, social media arguments, legal cross-examination, scientific peer review.',
    m(el, K) {
      const F = ['Ad hominem', 'Straw man', 'False dilemma', 'Slippery slope', 'Appeal to authority', 'Bandwagon', 'Post hoc', 'Whataboutism'];
      const Q = [['“You can’t trust her climate policy, she flies on planes.”', 0, 'Attacks the person instead of the argument.'], ['“My opponent wants border security. So he wants to lock up every immigrant.”', 1, 'Replaces the real position with an extreme version that is easier to attack.'], ['“Either you support this war or you hate this country.”', 2, 'Pretends there are only two options.'],
        ['“If we raise the minimum wage by $1, soon it’ll be $100 and every business will close.”', 3, 'Assumes an extreme chain of events without evidence for each step.'], ['“A famous actor says this diet cures cancer, so it does.”', 4, 'The authority is not an expert on the topic.'], ['“Millions of people believe it, so it must be true.”', 5, 'Popularity is not evidence.'], ['“I wore my lucky socks and we won. The socks work.”', 6, 'After it does not mean because of it.'], ['“Why criticize our government’s corruption when the other side was worse?”', 7, 'Deflects instead of answering.'],
        ['“Capitalism made smartphones, so any criticism of capitalism is wrong.”', 2, 'Treats it as all-or-nothing; you can value achievements and still criticize parts.'], ['“Socialists want to help the poor, so anyone who opposes socialism hates the poor.”', 1, 'Misrepresents opponents’ actual reasons.']];
      K.quiz(Lab.shuffle(Q).map(([q, c, ex]) => { const opts = Lab.shuffle([F[c], ...Lab.shuffle(F.filter((_, i) => i !== c)).slice(0, 3)]); return [q, opts, opts.indexOf(F[c]), ex]; }), el);
    } });

  A({ id: 'wason', d: ['logic', 'psychology'], e: '🃏', t: 'The Wason card test', b: 'One of the most famous puzzles in psychology. Most people get it wrong. Will you?',
    how: 'Peter Wason (1966) found that fewer than 10% of people choose correctly in the abstract version. When the same logic is about social rules (“if drinking beer, must be over 21”), most people get it right, which suggests our reasoning evolved for social situations like catching cheaters.',
    use: 'Testing hypotheses properly in science (look for what could prove you wrong), debugging code, and catching confirmation bias in yourself.',
    m(el, K) {
      const V = { abs: ['Each card has a letter on one side and a number on the other. Rule: “If a card has a vowel on one side, it has an even number on the other.” Which cards must you flip to test the rule?', ['A', 'K', '4', '7'], [0, 3], 'Flip A (must be even behind) and 7 (must not be a vowel behind). Flipping 4 tells you nothing: the rule says nothing about what is behind even numbers.'],
        soc: ['Each card is a person at a bar: drink on one side, age on the other. Rule: “If someone drinks beer, they must be over 21.” Which cards must you check?', ['Beer', 'Soda', '25 yrs', '16 yrs'], [0, 3], 'Check the beer drinker and the 16-year-old. Same logic as the vowel version, but it feels obvious.'] };
      let v = 'abs', pick = new Set(); const box = h('div');
      const draw = () => { const [q, cards] = V[v]; box.innerHTML = ''; box.append(h('p', null, q), h('div', { class: 'row' }, cards.map((c, i) => h('button', { class: 'btn', style: { width: '90px', height: '120px', fontSize: '22px', fontWeight: 700, background: pick.has(i) ? '#2563EB' : null, color: pick.has(i) ? '#fff' : null }, onclick: () => { pick.has(i) ? pick.delete(i) : pick.add(i); draw(); } }, c))),
        K.btn('Check my answer', () => { const [, , ans, ex] = V[v]; const ok = pick.size === 2 && ans.every((a) => pick.has(a)); box.append(h('p', { class: 'small' }, h('b', null, ok ? '✓ Correct! ' : '✗ Not quite. '), ex)); }, true)); };
      el.append(K.choice([['abs', 'Abstract version'], ['soc', 'Social version']], v, (x) => { v = x; pick = new Set(); draw(); }), box); draw();
    } });

  A({ id: 'knights', d: ['logic', 'philosophy'], e: '🛡️', t: 'Knights & knaves', b: 'Knights always tell the truth, knaves always lie. Work out who is who.',
    how: 'Raymond Smullyan made these puzzles famous (1978). Try each possibility and check whether every statement is consistent with it. It is the same method as a truth table, done in your head.',
    use: 'This style of consistency checking powers SAT solvers, which verify chips, schedule airlines and find bugs in software.',
    m(el, K) {
      const P = [['A says: “We are both knaves.”', 'A is a knave, B is a knight', ['Both knights', 'A is a knave, B is a knight', 'Both knaves', 'A is a knight, B is a knave'], 'If A were a knight the statement would be true, impossible. So A lies: they are not both knaves, so B is a knight.'],
        ['A says: “B is a knave.” B says: “A and I are the same kind.”', 'A is a knight, B is a knave', ['Both knights', 'A is a knave, B is a knight', 'Both knaves', 'A is a knight, B is a knave'], 'If B were a knight, they’d be the same, so A a knight, but A says B is a knave: contradiction. So B is a knave, they are different, so A is a knight.'],
        ['A says: “At least one of us is a knave.”', 'A is a knight, B is a knave', ['Both knights', 'A is a knave, B is a knight', 'Both knaves', 'A is a knight, B is a knave'], 'If A were a knave the statement would be true, impossible. So A is a knight and the statement is true: B is a knave.'],
        ['A says: “I am a knave.”', 'Nobody on the island can say this', ['A is a knight', 'A is a knave', 'Nobody on the island can say this', 'Can’t tell'], 'A knight can’t say it (false); a knave can’t say it (it would be true). It is the liar paradox.']];
      K.quiz(P.map(([q, a, opts, ex]) => [q, opts, opts.indexOf(a), ex]), el);
    } });

  A({ id: 'nqueens', d: ['logic', 'computing', 'math'], e: '♛', t: 'N-Queens backtracking', b: 'Place queens so none attack each other. Watch a computer search, fail, back up and try again.',
    how: 'Backtracking: place a queen in the next row, and if a conflict appears, undo the last choice and try the next option. It explores a huge tree of possibilities but prunes dead ends early. The 8-queens puzzle has 92 solutions.',
    use: 'Sudoku solvers, scheduling exams and sports leagues, solving mazes, route planning, chip layout and many puzzle-like problems in AI.',
    m(el, K) {
      let N = 8, steps = [], i = 0, speed = 3; const P = K.canvas(el, 380); const out = K.out();
      const solve = () => { steps = []; const q = []; const ok = (r, c) => q.every((cc, rr) => cc !== c && Math.abs(cc - c) !== r - rr); const rec = (r) => { if (r === N) { steps.push({ q: q.slice(), done: true }); return true; } for (let c = 0; c < N; c++) { steps.push({ q: [...q, c], bad: !ok(r, c) }); if (ok(r, c)) { q.push(c); if (rec(r + 1)) return true; q.pop(); steps.push({ q: q.slice(), back: true }); } } return false; }; rec(0); i = 0; };
      K.raf(() => { if (!steps.length) return; i = Math.min(steps.length - 1, i + speed / 3); const st = steps[Math.floor(i)]; P.clear(); const s = Math.min(P.W, P.H) / N, ox = (P.W - s * N) / 2;
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) P.rect(ox + c * s, r * s, s, s, (r + c) % 2 ? '#94A3B855' : '#94A3B822');
        st.q.forEach((c, r) => P.text('♛', ox + c * s + s / 2, r * s + s * 0.72, { a: 'center', s: s * 0.7, c: st.bad && r === st.q.length - 1 ? '#DC2626' : st.done ? '#16A34A' : '#2563EB' }));
        out.textContent = st.done ? `Solved after ${steps.length} steps.` : `Step ${Math.floor(i)} of ${steps.length}${st.back ? ' — backtracking' : st.bad ? ' — conflict!' : ''}`; });
      el.append(K.slider('Board size N', 4, 12, 1, N, (v) => { N = v; solve(); }), K.slider('Speed', 1, 60, 1, speed, (v) => (speed = v)), out); solve();
    } });

  A({ id: 'bayes', d: ['logic', 'statistics', 'medicine', 'law'], e: '🩺', t: 'The positive test puzzle', b: 'A 99% accurate test says you have a rare disease. What’s the real chance you do?',
    how: 'Bayes’ theorem (1763) updates beliefs with evidence. If the disease is rare, most positive results come from the huge healthy group, even with a good test. Picture 10,000 people as dots: the answer is how many of the positive dots are actually sick.',
    use: 'Medical screening, spam filters, courtroom evidence (the “prosecutor’s fallacy”), machine learning, intelligence analysis, and updating any belief when you get new information.',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { prev: 1, sens: 99, spec: 99 }; const out = K.big();
      const draw = () => { const N = 10000, sick = Math.round((N * s.prev) / 100), tp = Math.round((sick * s.sens) / 100), fp = Math.round(((N - sick) * (100 - s.spec)) / 100); P.clear(); const cols = 125, sz = P.W / cols;
        let k = 0; const put = (n, c) => { for (let i = 0; i < n; i++, k++) P.rect((k % cols) * sz, Math.floor(k / cols) * sz, sz - 0.5, sz - 0.5, c); };
        put(tp, '#DC2626'); put(sick - tp, '#F9A8D4'); put(fp, '#CA8A04'); put(N - sick - fp, '#94A3B833');
        out.innerHTML = `If you test positive: <b>${((tp / Math.max(1, tp + fp)) * 100).toFixed(1)}%</b> chance you are sick <small>(${tp} true positives vs ${fp} false alarms out of 10,000)</small>`; };
      P.onResize = draw; el.append(h('div', { class: 'row small' }, h('span', { style: { color: '#DC2626' } }, '■ sick, test +'), h('span', { style: { color: '#F9A8D4' } }, '■ sick, missed'), h('span', { style: { color: '#CA8A04' } }, '■ healthy, false alarm'), h('span', { class: 'muted' }, '■ healthy, test −')),
        K.slider('How common is the disease (%)', 0.1, 30, 0.1, s.prev, (v) => { s.prev = v; draw(); }), K.slider('Catches sick people (sensitivity %)', 50, 100, 0.5, s.sens, (v) => { s.sens = v; draw(); }), K.slider('Clears healthy people (specificity %)', 50, 100, 0.1, s.spec, (v) => { s.spec = v; draw(); }), out); draw();
    } });

  A({ id: 'paradoxes', d: ['logic', 'philosophy', 'math'], e: '♾️', t: 'Paradox gallery', b: 'Six famous paradoxes. Vote on each, then see how thinkers tried to resolve it.',
    how: 'Paradoxes are arguments with apparently true premises and an unacceptable conclusion. They have forced new mathematics (Russell’s paradox reshaped set theory in 1901; Gödel’s incompleteness theorems grew from the liar paradox).',
    use: 'Paradoxes test the foundations of math, computer science (the halting problem), law (vague terms like “reasonable”), and decision theory.',
    m(el, K) {
      const X = [['The Liar', '“This sentence is false.” If it is true, it’s false; if false, it’s true.', ['Some sentences are neither true nor false', 'Language needs levels: a sentence can’t talk about its own truth (Tarski)', 'Logic itself is broken'], 'Tarski (1933) separated object language from metalanguage; others accept truth-value gaps or even “true contradictions” (dialetheism, Priest). Gödel turned a version of it into his incompleteness theorem.'],
        ['The Heap (Sorites)', 'One grain of sand isn’t a heap. Adding one grain never turns a non-heap into a heap. So no amount of sand is a heap.', ['There is a sharp but unknown boundary (epistemicism)', 'Truth comes in degrees (fuzzy logic)', 'Heaps don’t really exist'], 'Responses include epistemicism (Williamson), degrees of truth (fuzzy logic, used in engineering), and supervaluationism. Law faces it constantly: when is speed “reckless”?'],
        ['Ship of Theseus', 'Replace every plank of a ship one at a time. Is it the same ship? If you build a ship from the old planks, which is the original?', ['The repaired ship', 'The rebuilt one from old planks', 'Identity is a matter of convention'], 'A live question about personal identity: your cells are replaced over time. Philosophers split between continuity of form, of material, or conventionalism.'],
        ['Newcomb’s problem', 'A near-perfect predictor puts $1M in an opaque box only if it predicted you’d take just that box. A clear box always has $1,000. Take one box or both?', ['One box', 'Both boxes'], 'Philosophers split roughly evenly. One-boxers follow expected value given the predictor’s accuracy; two-boxers note the money is already placed. It divides “evidential” from “causal” decision theory.'],
        ['Russell’s set', 'Consider the set of all sets that don’t contain themselves. Does it contain itself?', ['Yes', 'No', 'That set can’t exist'], 'Either answer contradicts itself. Mathematics responded by restricting how sets can be formed (Zermelo–Fraenkel set theory, 1908–1922).'],
        ['The unexpected hanging', 'A judge says you’ll be hanged on a weekday next week and it will be a surprise. You reason it can’t be Friday, then not Thursday… so it can’t happen. It happens Wednesday, a surprise.', ['The prisoner’s reasoning is flawed', 'The judge’s statement is self-contradictory', 'Surprise is not a logical notion'], 'No agreed solution. It touches knowledge about one’s own future knowledge, used in game theory and epistemic logic.']];
      X.forEach(([t, d, opts, ans]) => { const fb = h('div', { class: 'small', style: { marginTop: '6px' } }); el.append(h('div', { class: 'card', style: { boxShadow: 'none', marginBottom: '10px' } }, h('b', null, t), h('p', { class: 'small' }, d), h('div', { class: 'row' }, opts.map((o) => K.btn(o, () => { fb.innerHTML = `<b>You chose:</b> ${o}. ${ans}`; }))), fb)); });
    } });

  // ======================= COMPUTER SCIENCE & AI =======================
  A({ id: 'sorting', d: ['computing', 'math'], e: '📊', t: 'Sorting race', b: 'Bubble, insertion, merge and quick sort race on the same data. Count the comparisons.',
    how: 'Bubble and insertion sort compare neighbors: about n² steps. Merge sort (von Neumann, 1945) and quicksort (Hoare, 1959) divide and conquer: about n·log n steps. For a million items that’s the difference between a trillion and 20 million steps.',
    use: 'Every search result, spreadsheet, leaderboard and database index depends on fast sorting. Choosing the right algorithm can matter more than buying a faster computer.',
    m(el, K) {
      let N = 60; const algos = { Bubble(a, S) { for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length - i - 1; j++) { S.c++; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; S.push(a, j); } } },
        Insertion(a, S) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0) { S.c++; if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; S.push(a, j); j--; } else break; } } },
        Merge(a, S) { const ms = (l, r) => { if (r - l < 2) return; const m = (l + r) >> 1; ms(l, m); ms(m, r); const t = []; let i = l, j = m; while (i < m || j < r) { if (j >= r || (i < m && (S.c++, a[i] <= a[j]))) t.push(a[i++]); else t.push(a[j++]); } t.forEach((v, k) => { a[l + k] = v; S.push(a, l + k); }); }; ms(0, a.length); },
        Quick(a, S) { const qs = (l, r) => { if (l >= r) return; const p = a[r]; let i = l; for (let j = l; j < r; j++) { S.c++; if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; S.push(a, i); i++; } } [a[i], a[r]] = [a[r], a[i]]; S.push(a, i); qs(l, i - 1); qs(i + 1, r); }; qs(0, a.length - 1); } };
      const grid = h('div', { class: 'grid g2' }); el.append(grid); let lanes = [];
      const start = () => { clock = 0; const base = Lab.shuffle(Array.from({ length: N }, (_, i) => i + 1)); grid.innerHTML = ''; lanes = Object.entries(algos).map(([n, f]) => { const box = h('div'); const lab = h('div', { class: 'small' }); grid.append(h('div', null, h('b', null, n), lab, box)); const P = K.canvas(box, 140); const S = { frames: [], c: 0, cs: [], push(a, j) { this.frames.push([a.slice(), j]); this.cs.push(this.c); } }; f(base.slice(), S); return { n, P, S, lab, i: 0 }; }); };
      let clock = 0; K.raf(() => { clock += Math.max(2, N * N / 600); lanes.forEach((L) => { while (L.i < L.S.frames.length - 1 && L.S.cs[L.i + 1] <= clock) L.i++; const fr = L.S.frames[L.i]; if (!fr) return; const [a, j] = fr; L.P.clear(); const w = L.P.W / a.length; a.forEach((v, k) => L.P.rect(k * w, L.P.H - (v / N) * L.P.H, w - 1, (v / N) * L.P.H, k === j ? '#DC2626' : '#2563EB'));
        L.lab.textContent = `${Lab.fmt(L.S.cs[L.i])} comparisons ${L.i >= L.S.frames.length - 1 ? '✓ done' : ''}`; }); });
      el.prepend(K.slider('Items', 10, 200, 10, N, (v) => (N = v)), K.btn('▶ Race', start, true)); start();
    } });

  A({ id: 'binsearch', d: ['computing', 'math'], e: '🔍', t: 'Guess my number', b: 'I’m thinking of a number from 1 to 1,000. Halve the range each time and you never need more than 10 guesses.',
    how: 'Binary search cuts the possibilities in half each step, so it needs about log₂(n) guesses: 10 for a thousand, 20 for a million, 33 for every person on Earth.',
    use: 'Finding a word in a dictionary, a record in a database, the commit that introduced a bug (git bisect), and tuning parameters.',
    m(el, K) {
      let secret, lo, hi, tries; const inp = h('input', { type: 'number', style: { width: '120px' } }); const out = K.out(); const bar = h('div', { style: { position: 'relative', height: '24px', background: 'var(--card2)', borderRadius: '8px', marginTop: '10px' } }); const hist = h('div', { class: 'small' });
      const reset = () => { secret = K.ri(1, 1000); lo = 1; hi = 1000; tries = 0; hist.innerHTML = ''; out.textContent = 'Range 1–1000. Make a guess.'; drawBar(); };
      const drawBar = () => { bar.innerHTML = ''; bar.append(h('div', { style: { position: 'absolute', left: ((lo - 1) / 1000) * 100 + '%', width: ((hi - lo + 1) / 1000) * 100 + '%', top: 0, bottom: 0, background: '#2563EB', borderRadius: '8px' } })); };
      const guess = (g) => { if (!g) return; tries++; let msg; if (g === secret) msg = `🎉 Got it in ${tries} guesses!`; else if (g < secret) { lo = Math.max(lo, g + 1); msg = `${g} is too low.`; } else { hi = Math.min(hi, g - 1); msg = `${g} is too high.`; } hist.append(h('div', null, `${tries}. ${msg}`)); out.textContent = g === secret ? msg : `Range now ${lo}–${hi} (${hi - lo + 1} left). Best guess: ${Math.floor((lo + hi) / 2)}`; drawBar(); };
      el.append(h('div', { class: 'row' }, inp, K.btn('Guess', () => guess(+inp.value), true), K.btn('🤖 Let binary search guess', () => guess(Math.floor((lo + hi) / 2))), K.btn('New number', reset)), out, bar, hist); reset();
    } });

  A({ id: 'life', d: ['computing', 'math', 'biology'], e: '🧫', t: 'Game of Life', b: 'Four rules, a grid of cells, and gliders, guns and patterns that seem alive.',
    how: 'John Conway (1970): a live cell with 2–3 live neighbors survives; a dead cell with exactly 3 comes alive; all others die. From that come moving gliders and even patterns that compute anything a computer can (it is Turing complete).',
    use: 'A classic model of emergence: complex behavior from simple local rules. Similar cellular automata model forest fires, crystal growth, traffic and tumor growth.',
    m(el, K) {
      const C = 60, R = 36; let g = new Uint8Array(C * R), run = true, gen = 0; const P = K.canvas(el, 360); const out = K.out('tiny muted');
      const rand = () => { g = g.map(() => (Math.random() < 0.25 ? 1 : 0)); gen = 0; };
      const step = () => { const n = new Uint8Array(C * R); for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) { let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) s += g[((y + dy + R) % R) * C + ((x + dx + C) % C)]; const a = g[y * C + x]; n[y * C + x] = s === 3 || (a && s === 2) ? 1 : 0; } g = n; gen++; };
      const draw = () => { P.clear(); const s = Math.min(P.W / C, P.H / R); for (let i = 0; i < C * R; i++) if (g[i]) P.rect((i % C) * s, Math.floor(i / C) * s, s - 1, s - 1, '#16A34A'); out.textContent = `Generation ${gen} · ${g.reduce((a, b) => a + b, 0)} alive. Click cells to toggle.`; };
      const put = (pat, ox, oy) => { pat.forEach(([x, y]) => (g[(oy + y) * C + ox + x] = 1)); };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); const s = Math.min(P.W / C, P.H / R); const i = Math.floor(y / s) * C + Math.floor(x / s); if (i < C * R) g[i] ^= 1; draw(); };
      K.every(100, () => { if (run) { step(); draw(); } });
      el.append(h('div', { class: 'row' }, K.btn('⏯ Play/pause', () => (run = !run), true), K.btn('Step', () => { step(); draw(); }), K.btn('Random', () => { rand(); draw(); }), K.btn('Clear', () => { g.fill(0); gen = 0; draw(); }),
        K.btn('Glider gun', () => { g.fill(0); gen = 0; put([[0, 4], [0, 5], [1, 4], [1, 5], [10, 4], [10, 5], [10, 6], [11, 3], [11, 7], [12, 2], [12, 8], [13, 2], [13, 8], [14, 5], [15, 3], [15, 7], [16, 4], [16, 5], [16, 6], [17, 5], [20, 2], [20, 3], [20, 4], [21, 2], [21, 3], [21, 4], [22, 1], [22, 5], [24, 0], [24, 1], [24, 5], [24, 6], [34, 2], [34, 3], [35, 2], [35, 3]], 2, 2); draw(); })), out); rand(); draw();
    } });

  A({ id: 'turing', d: ['computing', 'logic', 'math', 'history'], e: '📼', t: 'Turing machine', b: 'A head, a tape and a table of rules: the 1936 idea that defines what any computer can do.',
    how: 'Alan Turing imagined a machine that reads a symbol, writes one, moves left or right and changes state, following a rule table. He proved such machines can compute anything computable, and that some problems (like predicting whether any program halts) can’t be solved by any machine.',
    use: 'The theoretical model of every computer; the limits of computing (undecidable problems); Turing later helped break the Enigma code at Bletchley Park.',
    m(el, K) {
      const progs = { 'Add 1 to a binary number': { tape: '1011', start: 'right', rules: { 'right,0': ['0', 1, 'right'], 'right,1': ['1', 1, 'right'], 'right,_': ['_', -1, 'carry'], 'carry,1': ['0', -1, 'carry'], 'carry,0': ['1', 0, 'HALT'], 'carry,_': ['1', 0, 'HALT'] } },
        'Flip every bit': { tape: '110100', start: 'go', rules: { 'go,0': ['1', 1, 'go'], 'go,1': ['0', 1, 'go'], 'go,_': ['_', 0, 'HALT'] } },
        'Busy beaver (3 states)': { tape: '', start: 'A', rules: { 'A,_': ['1', 1, 'B'], 'A,1': ['1', -1, 'C'], 'B,_': ['1', -1, 'A'], 'B,1': ['1', 1, 'B'], 'C,_': ['1', -1, 'B'], 'C,1': ['1', 0, 'HALT'] } } };
      let pn = Object.keys(progs)[0], tape, head, state, steps; const view = h('div', { style: { fontFamily: 'monospace', fontSize: '22px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' } }); const info = K.out(); const rules = h('div', { class: 'small', style: { fontFamily: 'monospace' } });
      const reset = () => { const p = progs[pn]; tape = {}; [...p.tape].forEach((c, i) => (tape[i] = c)); head = 0; state = p.start; steps = 0; rules.innerHTML = Object.entries(p.rules).map(([k, [w, m, s]]) => `in <b>${k.split(',')[0]}</b> reading <b>${k.split(',')[1]}</b> → write ${w}, move ${m > 0 ? 'R' : m < 0 ? 'L' : '—'}, go to ${s}`).join('<br>'); draw(); };
      const draw = () => { view.innerHTML = ''; for (let i = head - 8; i <= head + 8; i++) view.append(h('span', { style: { display: 'inline-block', width: '34px', textAlign: 'center', border: '1px solid var(--line)', background: i === head ? '#CA8A04' : null, color: i === head ? '#fff' : null } }, tape[i] || '_')); info.textContent = `State: ${state} · steps: ${steps}`; };
      const step = () => { if (state === 'HALT') return; const r = progs[pn].rules[state + ',' + (tape[head] || '_')]; if (!r) { state = 'HALT'; draw(); return; } tape[head] = r[0]; head += r[1]; state = r[2]; steps++; draw(); };
      let auto = false; K.every(250, () => auto && step());
      el.append(K.choice(Object.keys(progs), pn, (v) => { pn = v; reset(); }), view, info, h('div', { class: 'row' }, K.btn('Step', step, true), K.btn('⏯ Run', () => (auto = !auto)), K.btn('Reset', reset)), h('div', { class: 'tiny muted', style: { marginTop: '8px' } }, 'Rule table:'), rules); reset();
    } });

  A({ id: 'huffman', d: ['computing', 'linguistics', 'math'], e: '🗜️', t: 'Compress a message', b: 'Give common letters short codes and rare letters long ones. Watch your text shrink.',
    how: 'David Huffman invented this in 1952 as a student, to avoid a final exam. Repeatedly merge the two least common symbols into a tree; each letter’s code is its path. Morse code used the same idea by hand: E is a single dot. Claude Shannon’s entropy sets the limit no code can beat.',
    use: 'ZIP files, PNG and JPEG images, MP3, and network protocols all use Huffman coding or its descendants.',
    m(el, K) {
      const ta = h('textarea', { rows: 3, style: { width: '100%' } }, 'it was the best of times it was the worst of times it was the age of wisdom it was the age of foolishness'); const out = h('div');
      const run = () => { const s = ta.value; if (!s) return; const f = {}; [...s].forEach((c) => (f[c] = (f[c] || 0) + 1)); let q = Object.entries(f).map(([c, n]) => ({ c, n })); if (q.length === 1) q.push({ c: '', n: 0 });
        while (q.length > 1) { q.sort((a, b) => a.n - b.n); const [a, b] = q.splice(0, 2); q.push({ n: a.n + b.n, l: a, r: b }); } const code = {}; const walk = (t, p) => (t.c !== undefined ? (code[t.c] = p || '0') : (walk(t.l, p + '0'), walk(t.r, p + '1'))); walk(q[0], '');
        const bits = [...s].reduce((a, c) => a + code[c].length, 0); const H = -Object.values(f).reduce((a, n) => a + (n / s.length) * Math.log2(n / s.length), 0);
        out.innerHTML = `<div class="kpi">${s.length * 8} → ${bits} bits <small>${((1 - bits / (s.length * 8)) * 100).toFixed(0)}% smaller · ${(bits / s.length).toFixed(2)} bits per letter (Shannon limit ${H.toFixed(2)})</small></div>
        <div class="small" style="columns:3;font-family:monospace;margin-top:8px">${Object.entries(code).sort((a, b) => a[1].length - b[1].length).map(([c, p]) => `<div>${c === ' ' ? '␣' : c} (${f[c]}) → ${p}</div>`).join('')}</div>`; };
      ta.oninput = run; el.append(ta, out); run();
    } });

  A({ id: 'kmeans', d: ['computing', 'statistics', 'economics'], e: '🎯', t: 'Find the clusters (k-means)', b: 'Click to drop data points and watch an algorithm find groups on its own.',
    how: 'Guess k centers, assign every point to its nearest center, move each center to the middle of its points, repeat until nothing changes. It is unsupervised learning: no labels, the structure comes from the data.',
    use: 'Customer segments in marketing, grouping news articles, compressing image colors, finding gene expression patterns, and spotting market regimes.',
    m(el, K) {
      const P = K.canvas(el, 380); let pts = [], cen = [], k = 3, asg = []; const out = K.out('tiny muted');
      const blobs = () => { pts = []; for (let b = 0; b < 4; b++) { const cx = K.rnd(0.15, 0.85), cy = K.rnd(0.15, 0.85); for (let i = 0; i < 50; i++) pts.push([cx + K.gauss() * 0.06, cy + K.gauss() * 0.06]); } init(); };
      const init = () => { cen = Lab.shuffle(pts).slice(0, k).map((p) => p.slice()); asg = []; draw(); };
      const step = () => { asg = pts.map(([x, y]) => { let b = 0, bd = Infinity; cen.forEach(([cx, cy], i) => { const d = (x - cx) ** 2 + (y - cy) ** 2; if (d < bd) { bd = d; b = i; } }); return b; }); cen = cen.map((c, i) => { const m = pts.filter((_, j) => asg[j] === i); return m.length ? [m.reduce((a, p) => a + p[0], 0) / m.length, m.reduce((a, p) => a + p[1], 0) / m.length] : c; }); draw(); };
      const draw = () => { P.clear(); pts.forEach(([x, y], i) => P.dot(x * P.W, y * P.H, 4, asg.length ? K.pal[asg[i] % 8] : '#94A3B8')); cen.forEach(([x, y], i) => { P.dot(x * P.W, y * P.H, 11, '#111'); P.dot(x * P.W, y * P.H, 8, K.pal[i % 8]); }); out.textContent = `${pts.length} points, k = ${k}. Click to add points.`; };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); for (let i = 0; i < 6; i++) pts.push([x / P.W + K.gauss() * 0.02, y / P.H + K.gauss() * 0.02]); draw(); };
      P.onResize = draw; el.append(K.slider('Clusters k', 1, 8, 1, k, (v) => { k = v; init(); }), h('div', { class: 'row' }, K.btn('Step', step, true), K.btn('Run 10 steps', () => { for (let i = 0; i < 10; i++) step(); }), K.btn('New random centers', init), K.btn('New data', blobs)), out); blobs();
    } });

  A({ id: 'perceptron', d: ['computing', 'math', 'psychology'], e: '🧠', t: 'Teach a neuron', b: 'Click to add red and blue points. A single artificial neuron learns a line to separate them.',
    how: 'Frank Rosenblatt’s perceptron (1958): weighted sum of inputs, fire if over a threshold. When it gets a point wrong, nudge the weights toward the right answer. It can only draw straight lines, which is why Minsky and Papert’s 1969 critique (it can’t do XOR) helped cause an “AI winter” until multi-layer networks returned.',
    use: 'Every neuron in today’s deep networks is a descendant: language models, image recognition, recommendation systems.',
    m(el, K) {
      const P = K.canvas(el, 360); let pts = [], w = [K.rnd(-1, 1), K.rnd(-1, 1), 0], cls = 1, lr = 0.05, epochs = 0; const out = K.out();
      const pred = (x, y) => (w[0] * x + w[1] * y + w[2] > 0 ? 1 : -1);
      const draw = () => { P.clear(); const st = 10; for (let y = 0; y < P.H; y += st) for (let x = 0; x < P.W; x += st) P.rect(x, y, st, st, pred(x / P.W * 2 - 1, 1 - y / P.H * 2) > 0 ? '#DC262618' : '#2563EB18'); pts.forEach(([x, y, c]) => P.dot((x + 1) / 2 * P.W, (1 - y) / 2 * P.H, 6, c > 0 ? '#DC2626' : '#2563EB'));
        const err = pts.filter(([x, y, c]) => pred(x, y) !== c).length; out.textContent = `Epochs: ${epochs} · misclassified: ${err} of ${pts.length} · weights ${w.map((v) => v.toFixed(2)).join(', ')}`; };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); pts.push([x / P.W * 2 - 1, 1 - y / P.H * 2, cls]); draw(); };
      const train = () => { pts.forEach(([x, y, c]) => { if (pred(x, y) !== c) { w[0] += lr * c * x; w[1] += lr * c * y; w[2] += lr * c; } }); epochs++; draw(); };
      let auto = false; K.every(60, () => auto && train());
      const demo = (xor) => { pts = []; for (let i = 0; i < 40; i++) { const x = K.rnd(-1, 1), y = K.rnd(-1, 1); pts.push([x, y, xor ? (x * y > 0 ? 1 : -1) : (y > 0.4 * x + 0.1 ? 1 : -1)]); } w = [K.rnd(-1, 1), K.rnd(-1, 1), 0]; epochs = 0; draw(); };
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.choice([[1, '🔴 Add red'], [-1, '🔵 Add blue']], 1, (v) => (cls = v)), K.btn('⏯ Train', () => (auto = !auto), true), K.btn('Separable demo', () => demo(false)), K.btn('XOR demo (impossible!)', () => demo(true)), K.btn('Clear', () => { pts = []; draw(); })), out); demo(false);
    } });

  A({ id: 'markov', d: ['computing', 'linguistics', 'literature', 'math'], e: '✍️', t: 'Markov text machine', b: 'Generate new “writing” by predicting each word from the ones before it, the ancestor of chatbots.',
    how: 'Andrey Markov counted letter pairs in Pushkin’s Eugene Onegin in 1913. Record which word follows each word (or pair of words) in a text, then generate by sampling. Longer memory gives more fluent but more copied text. Large language models do a vastly more powerful version: they predict the next token using everything before it.',
    use: 'Autocomplete, speech recognition, weather and finance models, Google’s PageRank, and modeling DNA sequences.',
    m(el, K) {
      const src = { Constitution: 'We the People of the United States in Order to form a more perfect Union establish Justice insure domestic Tranquility provide for the common defence promote the general Welfare and secure the Blessings of Liberty to ourselves and our Posterity do ordain and establish this Constitution for the United States of America. All legislative Powers herein granted shall be vested in a Congress of the United States which shall consist of a Senate and House of Representatives. The House of Representatives shall be composed of Members chosen every second Year by the People of the several States.',
        'Darwin': 'It is interesting to contemplate an entangled bank clothed with many plants of many kinds with birds singing on the bushes with various insects flitting about and with worms crawling through the damp earth and to reflect that these elaborately constructed forms so different from each other and dependent on each other in so complex a manner have all been produced by laws acting around us. There is grandeur in this view of life with its several powers having been originally breathed into a few forms or into one and that whilst this planet has gone cycling on according to the fixed law of gravity from so simple a beginning endless forms most beautiful and most wonderful have been and are being evolved.',
        'Mix both': '' };
      src['Mix both'] = src.Constitution + ' ' + src.Darwin; let s = 'Darwin', ord = 1; const out = h('p', { style: { fontSize: '16px', lineHeight: 1.6 } }); const tbl = h('div', { class: 'tiny muted' });
      const gen = () => { const w = src[s].split(/\s+/); const m = {}; for (let i = 0; i + ord < w.length; i++) { const k = w.slice(i, i + ord).join(' '); (m[k] ||= []).push(w[i + ord]); } let cur = w.slice(0, ord); const res = cur.slice(); for (let i = 0; i < 60; i++) { const nx = m[cur.join(' ')]; if (!nx) break; const n = K.pick(nx); res.push(n); cur = [...cur.slice(1), n]; } out.textContent = res.join(' ') + '…';
        const ex = Object.entries(m).sort((a, b) => b[1].length - a[1].length)[0]; tbl.textContent = `Example: after “${ex[0]}” the source continues with: ${[...new Set(ex[1])].slice(0, 10).join(', ')}`; };
      el.append(K.choice(Object.keys(src), s, (v) => { s = v; gen(); }), K.slider('Memory (words of context)', 1, 4, 1, ord, (v) => { ord = v; gen(); }), K.btn('✍️ Generate again', gen, true), out, tbl); gen();
    } });

  A({ id: 'automaton', d: ['computing', 'math', 'biology', 'physics'], e: '🔺', t: 'Elementary cellular automata', b: 'One row of cells, one rule number from 0 to 255. Rule 30 makes chaos; Rule 110 can compute anything.',
    how: 'Each cell looks at itself and its two neighbors (8 combinations) and the rule number’s binary digits say what it becomes next. Stephen Wolfram catalogued all 256 rules in the 1980s. Rule 30 is so random it was used to generate random numbers.',
    use: 'Patterns on the Conus textile seashell look like Rule 30. Automata model traffic jams, crystal growth and are a toy universe for studying complexity.',
    m(el, K) {
      const P = K.canvas(el, 360); let rule = 30, start = 'one'; const bitsEl = h('div', { class: 'row', style: { gap: '4px' } });
      const draw = () => { P.clear(); const s = 3, W = Math.floor(P.W / s), H = Math.floor(P.H / s); let row = new Uint8Array(W); if (start === 'one') row[W >> 1] = 1; else row = row.map(() => (Math.random() < 0.5 ? 1 : 0));
        for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) if (row[x]) P.rect(x * s, y * s, s, s, '#9333EA'); const n = new Uint8Array(W); for (let x = 0; x < W; x++) { const k = (row[(x - 1 + W) % W] << 2) | (row[x] << 1) | row[(x + 1) % W]; n[x] = (rule >> k) & 1; } row = n; }
        bitsEl.innerHTML = ''; for (let k = 7; k >= 0; k--) bitsEl.append(h('div', { style: { textAlign: 'center', fontFamily: 'monospace', fontSize: '11px' } }, k.toString(2).padStart(3, '0').replace(/1/g, '■').replace(/0/g, '□'), h('br'), (rule >> k) & 1 ? '■' : '□')); };
      P.onResize = draw; const sl = K.slider('Rule', 0, 255, 1, rule, (v) => { rule = v; draw(); });
      el.append(sl, h('div', { class: 'row' }, [30, 90, 110, 184, 54, 150].map((r) => K.btn('Rule ' + r, () => { rule = r; sl.set(r); draw(); })), K.choice([['one', 'Single cell'], ['rand', 'Random start']], start, (v) => { start = v; draw(); })), bitsEl); draw();
    } });

  A({ id: 'passwords', d: ['computing', 'math'], e: '🔑', t: 'How long to crack it?', b: 'Type a password (it never leaves this page) and see how its search space grows with length and variety.',
    how: 'A brute-force attacker tries every combination. The number of combinations is (characters available) ^ (length). Each extra character multiplies the work. Real attackers try dictionary words and leaked passwords first, so a long random passphrase beats a short clever one.',
    use: 'Security of your accounts, encryption key sizes (2¹²⁸ is far beyond any computer), and why websites should store passwords with slow hash functions.',
    m(el, K) {
      const inp = h('input', { type: 'text', placeholder: 'Try: password123, Tr0ub4dor&3, correct horse battery staple', style: { width: '100%' }, autocomplete: 'off' }); const out = h('div'); let rate = 1e10;
      const run = () => { const s = inp.value; let pool = 0; if (/[a-z]/.test(s)) pool += 26; if (/[A-Z]/.test(s)) pool += 26; if (/[0-9]/.test(s)) pool += 10; if (/[^a-zA-Z0-9]/.test(s)) pool += 33; const bits = s.length * Math.log2(Math.max(pool, 1)); const secs = 2 ** bits / rate / 2;
        const t = secs < 1 ? 'instantly' : secs < 3600 ? (secs / 60).toFixed(1) + ' minutes' : secs < 86400 * 365 ? (secs / 86400).toFixed(1) + ' days' : secs < 3.15e7 * 1e9 ? Lab.fmt(secs / 3.15e7) + ' years' : 'longer than the age of the universe';
        const common = /^(password|123456|qwerty|letmein|iloveyou|admin|welcome)/i.test(s); out.innerHTML = `<div class="kpi">${t} <small>${s.length} characters from a pool of ${pool} → ${bits.toFixed(0)} bits</small></div>${common ? '<p class="small" style="color:#DC2626"><b>Warning:</b> starts with one of the most common passwords; a dictionary attack finds it immediately.</p>' : ''}`; };
      inp.oninput = run; el.append(inp, K.slider('Attacker guesses per second', 3, 14, 1, 10, (v) => { rate = 10 ** v; run(); }, (v) => '10^' + v), out, h('p', { class: 'tiny muted' }, 'Nothing you type is stored or sent. This estimate ignores smarter attacks, so treat it as an upper bound.'));
    } });

  A({ id: 'boids', d: ['computing', 'biology', 'physics'], e: '🐦', t: 'Flocking birds (boids)', b: 'Three simple rules per bird and a flock emerges, with no leader.',
    how: 'Craig Reynolds (1986): each boid steers to avoid crowding (separation), align with neighbors’ direction (alignment), and move toward their center (cohesion). No bird knows the flock’s plan. Starlings, fish schools and crowds show the same emergence.',
    use: 'Bats and penguins in Batman Returns (1992) were the first film use; also crowd simulation for stadium safety, drone swarms and robotics.',
    m(el, K) {
      const P = K.canvas(el, 380); const s = { sep: 1.5, ali: 1, coh: 1 }; const B = Array.from({ length: 120 }, () => ({ x: Math.random() * 600, y: Math.random() * 380, vx: K.rnd(-2, 2), vy: K.rnd(-2, 2) }));
      el.append(K.slider('Separation', 0, 4, 0.1, s.sep, (v) => (s.sep = v)), K.slider('Alignment', 0, 3, 0.1, s.ali, (v) => (s.ali = v)), K.slider('Cohesion', 0, 3, 0.1, s.coh, (v) => (s.coh = v)));
      K.raf(() => { P.clear(); B.forEach((b) => { let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0; B.forEach((o) => { if (o === b) return; const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy); if (d < 50) { n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y; if (d < 18) { sx -= dx / d; sy -= dy / d; } } });
          if (n) { b.vx += ((ax / n - b.vx) * 0.05 * s.ali) + ((cx / n - b.x) * 0.002 * s.coh) + sx * 0.08 * s.sep; b.vy += ((ay / n - b.vy) * 0.05 * s.ali) + ((cy / n - b.y) * 0.002 * s.coh) + sy * 0.08 * s.sep; }
          const sp = Math.hypot(b.vx, b.vy) || 1; const mx = 3; if (sp > mx) { b.vx *= mx / sp; b.vy *= mx / sp; } b.x = (b.x + b.vx + P.W) % P.W; b.y = (b.y + b.vy + P.H) % P.H;
          const a = Math.atan2(b.vy, b.vx); P.ctx.fillStyle = '#0891B2'; P.ctx.beginPath(); P.ctx.moveTo(b.x + 7 * Math.cos(a), b.y + 7 * Math.sin(a)); P.ctx.lineTo(b.x + 4 * Math.cos(a + 2.5), b.y + 4 * Math.sin(a + 2.5)); P.ctx.lineTo(b.x + 4 * Math.cos(a - 2.5), b.y + 4 * Math.sin(a - 2.5)); P.ctx.fill(); }); });
    } });

  A({ id: 'bigo', d: ['computing', 'math'], e: '⏱️', t: 'How algorithms scale', b: 'Same problem, different algorithms. See why n² becomes impossible and log n stays instant.',
    how: 'Big-O notation describes how the number of steps grows with input size n. Constant and logarithmic algorithms barely notice bigger inputs; quadratic ones slow to a crawl; exponential ones become impossible even for tiny inputs.',
    use: 'Choosing algorithms for search engines, databases, route planning and cryptography (where we want attacks to be exponential).',
    m(el, K) {
      const P = K.canvas(el, 320); let n = 1000; const out = h('div', { class: 'grid g3', style: { marginTop: '8px' } }); const F = [['O(1) lookup', () => 1], ['O(log n) binary search', (x) => Math.log2(x)], ['O(n) scan', (x) => x], ['O(n log n) good sort', (x) => x * Math.log2(x)], ['O(n²) bubble sort', (x) => x * x], ['O(2ⁿ) try every subset', (x) => 2 ** x]];
      const draw = () => { P.clear(); const { X, Y } = P.chart(1, 40, 0, 400, { xl: 'n', yl: 'steps' }); F.forEach(([l, f], i) => { const pts = []; for (let x = 1; x <= 40; x += 0.25) pts.push([X(x), Y(Math.min(420, f(x)))]); P.line(pts, K.pal[i], 2.5); P.text(l, X(40) - 4, Y(Math.min(400, f(40))) - 4 + (i === 0 ? -6 : 0), { a: 'right', c: K.pal[i], s: 11 }); });
        out.innerHTML = ''; F.forEach(([l, f], i) => { const st = f(n); const sec = st / 1e9; out.append(h('div', { style: { borderLeft: `4px solid ${K.pal[i]}`, paddingLeft: '8px' } }, h('div', { class: 'tiny muted' }, l), h('b', null, st > 1e300 || !isFinite(st) ? 'more than 10³⁰⁰ steps' : Lab.fmt(st) + ' steps'), h('div', { class: 'tiny' }, !isFinite(sec) || sec > 3.15e7 * 1e10 ? 'longer than the universe has existed' : sec < 1 ? 'under a second' : sec < 3.15e7 ? (sec / 3600).toFixed(1) + ' hours' : Lab.fmt(sec / 3.15e7) + ' years'))); }); };
      P.onResize = draw; el.append(K.slider('Input size n (for the time estimates, at 1 billion steps per second)', 10, 100000, 10, n, (v) => { n = v; draw(); }), out); draw();
    } });

  A({ id: 'convolution', d: ['computing', 'arts', 'biology'], e: '🖼️', t: 'How computers see edges', b: 'Slide a 3×3 filter over an image to blur, sharpen or find edges, the first layer of computer vision.',
    how: 'Each output pixel is a weighted sum of the 3×3 pixels around it. Different weights (kernels) detect different features. Hubel and Wiesel (1959) found neurons in cat visual cortex that respond to edges at specific angles; convolutional neural networks learn their own kernels in the same spirit.',
    use: 'Photo filters, medical imaging, self-driving cars, face recognition and satellite analysis.',
    m(el, K) {
      const box = h('div', { class: 'grid g2' }); el.append(box); const A_ = K.canvas(box, 240), B_ = K.canvas(box, 240); const KS = { 'Blur': [1, 2, 1, 2, 4, 2, 1, 2, 1].map((v) => v / 16), 'Sharpen': [0, -1, 0, -1, 5, -1, 0, -1, 0], 'Edges': [-1, -1, -1, -1, 8, -1, -1, -1, -1], 'Vertical edges': [-1, 0, 1, -2, 0, 2, -1, 0, 1], 'Horizontal edges': [-1, -2, -1, 0, 0, 0, 1, 2, 1], 'Emboss': [-2, -1, 0, -1, 1, 1, 0, 1, 2] }; let kn = 'Edges';
      const S = 120; const src = new Float32Array(S * S); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let v = 0.15; if (Math.hypot(x - 40, y - 45) < 25) v = 0.9; if (x > 70 && x < 105 && y > 20 && y < 100) v = 0.6; if (y > 95 && x < 60) v = 0.35 + 0.3 * Math.sin(x / 3); src[y * S + x] = v; }
      const paint = (P, arr, abs) => { const sc = Math.min(P.W, P.H) / S; for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let v = arr[y * S + x]; v = abs ? Math.min(1, Math.abs(v)) : Math.max(0, Math.min(1, v)); const c = Math.round(v * 255); P.rect(x * sc, y * sc, sc + 0.5, sc + 0.5, `rgb(${c},${c},${c})`); } };
      const kv = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,48px)', gap: '3px', fontFamily: 'monospace', marginTop: '8px' } });
      const draw = () => { const k = KS[kn]; const o = new Float32Array(S * S); for (let y = 1; y < S - 1; y++) for (let x = 1; x < S - 1; x++) { let s = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += src[(y + j) * S + x + i] * k[(j + 1) * 3 + i + 1]; o[y * S + x] = s; } paint(A_, src); paint(B_, o, kn.includes('dge') || kn === 'Emboss'); kv.innerHTML = ''; k.forEach((v) => kv.append(h('div', { style: { textAlign: 'center', padding: '6px', background: 'var(--card2)', borderRadius: '6px' } }, +v.toFixed(2)))); };
      A_.onResize = B_.onResize = draw; el.append(K.choice(Object.keys(KS), kn, (v) => { kn = v; draw(); }), kv); draw();
    } });

  A({ id: 'tsp', d: ['computing', 'math', 'engineering', 'economics'], e: '🚚', t: 'Traveling salesperson', b: 'Find the shortest tour through every city. Easy to state, brutally hard to solve exactly.',
    how: 'With n cities there are (n−1)!/2 possible tours: 20 cities gives about 60 quadrillion. No fast exact method is known (it is NP-hard). Practical solvers use heuristics: nearest neighbor, then fixing crossings with 2-opt swaps, which gets close to the best.',
    use: 'Delivery routes (UPS saves millions of miles a year with route optimization), drilling circuit boards, DNA sequencing and telescope scheduling.',
    m(el, K) {
      const P = K.canvas(el, 360); let pts = [], tour = []; const out = K.out();
      const len = (t) => t.reduce((a, c, i) => a + Math.hypot(pts[c][0] - pts[t[(i + 1) % t.length]][0], pts[c][1] - pts[t[(i + 1) % t.length]][1]), 0);
      const draw = () => { P.clear(); if (tour.length) P.line([...tour, tour[0]].map((i) => [pts[i][0] * P.W, pts[i][1] * P.H]), '#2563EB', 2); pts.forEach(([x, y], i) => P.dot(x * P.W, y * P.H, 5, i ? '#DC2626' : '#16A34A')); out.textContent = `${pts.length} cities · tour length ${tour.length ? (len(tour) * 100).toFixed(1) : '—'} · possible tours ≈ ${pts.length > 2 ? Number((Array.from({ length: pts.length - 1 }, (_, i) => i + 1).reduce((a, b) => a * b, 1) / 2).toPrecision(3)).toLocaleString() : 1}`; };
      const nn = () => { const left = new Set(pts.map((_, i) => i)); let c = 0; tour = [0]; left.delete(0); while (left.size) { let b, bd = Infinity; left.forEach((j) => { const d = Math.hypot(pts[c][0] - pts[j][0], pts[c][1] - pts[j][1]); if (d < bd) { bd = d; b = j; } }); tour.push(b); left.delete(b); c = b; } draw(); };
      const opt = () => { let imp = true, it = 0; while (imp && it++ < 50) { imp = false; for (let i = 1; i < tour.length - 1; i++) for (let j = i + 1; j < tour.length; j++) { const t2 = [...tour.slice(0, i), ...tour.slice(i, j + 1).reverse(), ...tour.slice(j + 1)]; if (len(t2) < len(tour) - 1e-9) { tour = t2; imp = true; } } } draw(); };
      P.c.onclick = (e) => { const [x, y] = P.pt(e); pts.push([x / P.W, y / P.H]); tour = []; draw(); };
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.btn('Random 25 cities', () => { pts = Array.from({ length: 25 }, () => [K.rnd(0.04, 0.96), K.rnd(0.05, 0.95)]); tour = Lab.shuffle(pts.map((_, i) => i)); draw(); }), K.btn('1. Nearest neighbor', nn, true), K.btn('2. Fix crossings (2-opt)', opt, true), K.btn('Random tour', () => { tour = Lab.shuffle(pts.map((_, i) => i)); draw(); })), out, h('p', { class: 'tiny muted' }, 'Click to add cities.'));
      pts = Array.from({ length: 25 }, () => [K.rnd(0.04, 0.96), K.rnd(0.05, 0.95)]); tour = Lab.shuffle(pts.map((_, i) => i)); draw();
    } });

  A({ id: 'parity', d: ['computing', 'engineering', 'math'], e: '🛰️', t: 'Fix errors in space messages', b: 'Send 4 bits with 3 check bits. Flip any one bit “in transit” and the receiver finds and fixes it.',
    how: 'Richard Hamming (1950) was tired of his weekend computer jobs crashing on single errors. His Hamming(7,4) code adds 3 parity bits, each checking an overlapping group. The pattern of failed checks spells out the position of the flipped bit.',
    use: 'Memory chips (ECC RAM), QR codes, CDs, deep-space probes like Voyager, and every phone signal use error-correcting codes.',
    m(el, K) {
      const d = [1, 0, 1, 1]; let sent = [], recv = []; const box = h('div');
      const enc = () => { const [d1, d2, d3, d4] = d; const p1 = d1 ^ d2 ^ d4, p2 = d1 ^ d3 ^ d4, p3 = d2 ^ d3 ^ d4; sent = [p1, p2, d1, p3, d2, d3, d4]; recv = sent.slice(); draw(); };
      const draw = () => { const r = recv; const s1 = r[0] ^ r[2] ^ r[4] ^ r[6], s2 = r[1] ^ r[2] ^ r[5] ^ r[6], s3 = r[3] ^ r[4] ^ r[5] ^ r[6]; const pos = s1 + 2 * s2 + 4 * s3; const lab = ['p1', 'p2', 'd1', 'p3', 'd2', 'd3', 'd4'];
        const bit = (arr, i, click) => h('button', { class: 'btn', style: { width: '48px', fontFamily: 'monospace', background: arr[i] ? '#2563EB' : null, color: arr[i] ? '#fff' : null, borderColor: arr === recv && arr[i] !== sent[i] ? '#DC2626' : null }, onclick: click }, arr[i], h('div', { class: 'tiny' }, lab[i]));
        box.innerHTML = ''; box.append(h('div', { class: 'small muted' }, 'Your data (click to change):'), h('div', { class: 'row' }, d.map((_, i) => h('button', { class: 'btn', style: { width: '48px' }, onclick: () => { d[i] ^= 1; enc(); } }, d[i]))),
          h('div', { class: 'small muted', style: { marginTop: '8px' } }, 'Sent (7 bits):'), h('div', { class: 'row' }, sent.map((_, i) => bit(sent, i))),
          h('div', { class: 'small muted', style: { marginTop: '8px' } }, 'Received. Click a bit to simulate cosmic-ray damage:'), h('div', { class: 'row' }, recv.map((_, i) => bit(recv, i, () => { recv[i] ^= 1; draw(); }))),
          h('p', null, pos ? h('span', null, `Checks failed → syndrome ${s3}${s2}${s1} = position `, h('b', null, pos), ` (${lab[pos - 1]}). `, K.btn('Repair it', () => { recv[pos - 1] ^= 1; draw(); }, true)) : h('b', { style: { color: '#16A34A' } }, '✓ All checks pass. Message intact: ' + [r[2], r[4], r[5], r[6]].join('')))); };
      el.append(box); enc();
    } });

  // ======================= STATISTICS =======================
  A({ id: 'clt', d: ['statistics', 'math'], e: '🔔', t: 'Where bell curves come from', b: 'Average random numbers from any lopsided distribution and a bell curve appears. Every time.',
    how: 'The Central Limit Theorem: averages of many independent random values are approximately normally distributed, whatever the original shape (as long as its spread is finite). De Moivre glimpsed it in 1733; Laplace proved a general version in 1810.',
    use: 'Why polls work with a few thousand people, why measurement errors are bell-shaped, quality control in factories, and confidence intervals across science.',
    m(el, K) {
      const D = { 'Dice (flat)': () => K.ri(1, 6), 'Incomes (skewed)': () => Math.exp(K.gauss() * 0.8 + 10) / 10000, 'Coin (0 or 1)': () => (Math.random() < 0.3 ? 1 : 0), 'Wait times (exponential)': () => -Math.log(Math.random()) }; let dn = 'Incomes (skewed)', n = 1; const means = []; const P = K.canvas(el, 300); const out = K.out();
      const reset = () => (means.length = 0);
      el.append(K.choice(Object.keys(D), dn, (v) => { dn = v; reset(); }), K.slider('Values averaged per sample', 1, 100, 1, n, (v) => { n = v; reset(); }), K.btn('Reset', reset), out);
      K.raf(() => { for (let k = 0; k < 20; k++) { let s = 0; for (let i = 0; i < n; i++) s += D[dn](); means.push(s / n); } if (means.length > 20000) means.splice(0, 20); const mn = Math.min(...means), mx = Math.max(...means) + 1e-9; const B = 50, c = Array(B).fill(0); means.forEach((m) => c[Math.min(B - 1, Math.floor(((m - mn) / (mx - mn)) * B))]++); const top = Math.max(...c);
        P.clear(); const w = P.W / B; c.forEach((v, i) => P.rect(i * w, P.H - 20 - (v / top) * (P.H - 30), w - 1, (v / top) * (P.H - 30), '#0EA5E9')); P.text(mn.toFixed(2), 2, P.H - 5, { c: K.css('--muted') }); P.text(mx.toFixed(2), P.W - 2, P.H - 5, { a: 'right', c: K.css('--muted') });
        out.textContent = `${means.length.toLocaleString()} sample averages, each of ${n} value${n > 1 ? 's' : ''}. ${n === 1 ? 'With 1 value you just see the raw shape.' : n < 10 ? 'Getting rounder…' : 'Bell curve.'}`; });
    } });

  A({ id: 'regression', d: ['statistics', 'math', 'economics', 'computing'], e: '📉', t: 'Draw the best line', b: 'Drag points around. Try to beat least squares, then see how one outlier can swing the result.',
    how: 'Legendre (1805) and Gauss chose the line that makes the sum of squared vertical errors smallest. r measures how tightly points hug a line (−1 to 1); r² is the share of variation the line explains. Squaring errors means outliers pull hard.',
    use: 'Economics (how education relates to income), medicine, finance (a stock’s beta), sports analytics, and as the simplest machine learning model.',
    m(el, K) {
      const P = K.canvas(el, 360); let pts = Array.from({ length: 20 }, () => { const x = K.rnd(0.5, 9.5); return [x, 1 + 0.6 * x + K.gauss() * 0.9]; }); let drag = -1, mine = null; const out = K.out();
      const fit = () => { const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n; let sxy = 0, sxx = 0, syy = 0; pts.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }); const b = sxy / sxx; return { b, a: my - b * mx, r: sxy / Math.sqrt(sxx * syy) }; };
      const sse = (a, b) => pts.reduce((s, [x, y]) => s + (y - (a + b * x)) ** 2, 0);
      let ax;
      const draw = () => { P.clear(); ax = P.chart(0, 10, 0, 10); const { X, Y } = ax; const f = fit(); pts.forEach(([x, y]) => { P.line([[X(x), Y(y)], [X(x), Y(f.a + f.b * x)]], '#DC262666', 1); P.dot(X(x), Y(y), 6, '#2563EB'); }); P.line([[X(0), Y(f.a)], [X(10), Y(f.a + 10 * f.b)]], '#16A34A', 3);
        if (mine) P.line([[X(0), Y(mine.a)], [X(10), Y(mine.a + 10 * mine.b)]], '#CA8A04', 2, [6, 4]);
        out.innerHTML = `Best fit: y = ${f.a.toFixed(2)} + ${f.b.toFixed(2)}x · r = <b>${f.r.toFixed(3)}</b> · r² = ${(f.r ** 2).toFixed(3)} · squared error ${sse(f.a, f.b).toFixed(1)}` + (mine ? ` · <span style="color:#CA8A04">your line’s error ${sse(mine.a, mine.b).toFixed(1)}</span>` : ''); };
      const inv = (px, py) => { const p = 40, W = P.W - 52, H = P.H - 38; return [((px - 40) / W) * 10, ((P.H - 26 - py) / H) * 10]; };
      P.c.onpointerdown = (e) => { const [x, y] = P.pt(e); drag = pts.findIndex(([a, b]) => Math.hypot(ax.X(a) - x, ax.Y(b) - y) < 12); if (drag < 0) { pts.push(inv(x, y)); draw(); } };
      P.c.onpointermove = (e) => { if (drag >= 0) { pts[drag] = inv(...P.pt(e)).map((v) => Lab.clamp(v, 0, 10)); draw(); } }; P.c.onpointerup = () => (drag = -1);
      const sa = K.slider('Your intercept', -3, 8, 0.1, 1, () => { mine = { a: sa.get(), b: sb.get() }; draw(); }), sb = K.slider('Your slope', -1, 2, 0.01, 0.5, () => { mine = { a: sa.get(), b: sb.get() }; draw(); });
      P.onResize = draw; el.append(K.two(sa, sb), out, h('div', { class: 'row' }, K.btn('Add an outlier', () => { pts.push([9.5, 0.5]); draw(); }), K.btn('No relationship', () => { pts = Array.from({ length: 25 }, () => [K.rnd(0.5, 9.5), K.rnd(1, 9)]); draw(); }), K.btn('Strong relationship', () => { pts = Array.from({ length: 25 }, () => { const x = K.rnd(0.5, 9.5); return [x, 1 + 0.8 * x + K.gauss() * 0.3]; }); draw(); })), h('p', { class: 'tiny muted' }, 'Drag points; click empty space to add one.')); draw();
    } });

  A({ id: 'phack', d: ['statistics', 'psychology', 'medicine'], e: '🎰', t: 'p-hacking: find a fake discovery', b: 'Test 20 random “effects” that are pure noise. One will probably look significant.',
    how: 'A p-value below 0.05 means results this extreme would happen by chance less than 5% of the time if there were no real effect. Test 20 things and you expect about one “discovery” from noise alone. Selective reporting fuelled the replication crisis: a 2015 project could reproduce only about 36% of 100 psychology findings.',
    use: 'Judging news about studies (“chocolate helps you lose weight” was a deliberate 2015 hoax made this way), drug trials (which now must pre-register outcomes), and backtesting trading strategies.',
    m(el, K) {
      const grid = h('div', { class: 'grid g4', style: { marginTop: '8px' } }); const out = K.out(); let found = 0, tests = 0;
      const foods = ['Chocolate', 'Coffee', 'Blueberries', 'Red wine', 'Kale', 'Eggs', 'Cheese', 'Garlic', 'Green tea', 'Nuts', 'Oats', 'Salmon', 'Spinach', 'Yogurt', 'Apples', 'Beans', 'Honey', 'Olive oil', 'Rice', 'Tomatoes'];
      const outcomes = ['weight loss', 'better sleep', 'memory', 'cholesterol', 'mood'];
      const run = () => { grid.innerHTML = ''; let sig = 0; foods.forEach((f) => { const o = K.pick(outcomes); let s = 0; for (let i = 0; i < 30; i++) s += K.gauss(); const z = s / Math.sqrt(30) * Math.sqrt(30) / Math.sqrt(30); const zz = s / Math.sqrt(30); const p = 2 * (1 - cdf(Math.abs(zz))); const ok = p < 0.05; if (ok) sig++; grid.append(h('div', { class: 'card', style: { boxShadow: 'none', padding: '10px', borderColor: ok ? '#DC2626' : null } }, h('b', { class: 'small' }, f), h('div', { class: 'tiny' }, '→ ' + o), h('div', { class: 'tiny', style: { color: ok ? '#DC2626' : null, fontWeight: ok ? 700 : 400 } }, 'p = ' + p.toFixed(3) + (ok ? ' “SIGNIFICANT!”' : '')))); }); found += sig; tests += 20; out.innerHTML = `This run: <b>${sig}</b> fake discoveries out of 20. Running total: ${found} of ${tests} (${((found / tests) * 100).toFixed(1)}%, expected 5%). Every effect here is pure random noise.`; };
      const cdf = (z) => { const t = 1 / (1 + 0.2316419 * z); const d = 0.3989423 * Math.exp((-z * z) / 2); return 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); };
      el.append(K.btn('🔬 Run 20 studies on random noise', run, true), out, grid, h('p', { class: 'tiny muted' }, 'Defense: pre-register what you will test, correct for multiple comparisons (e.g. divide 0.05 by the number of tests), and replicate.')); run();
    } });

  A({ id: 'simpson', d: ['statistics', 'medicine', 'law', 'sociology'], e: '🔀', t: 'Simpson’s paradox', b: 'A treatment wins in every group but loses overall. How? Toggle the grouping and see.',
    how: 'When groups differ in size and in their baseline, combining them can reverse a trend. A real 1986 kidney stone study: treatment A did better for small stones and for large stones, yet B looked better overall, because A was mostly used on the harder, large-stone cases.',
    use: 'UC Berkeley’s 1973 admissions looked biased against women overall, but most departments slightly favored women; women had applied more to competitive departments. Always ask what hidden variable might be lurking.',
    m(el, K) {
      const data = { small: { A: [81, 87], B: [234, 270] }, large: { A: [192, 263], B: [55, 80] } }; let split = false; const box = h('div');
      const bar = (l, s, n, c) => h('div', { class: 'row', style: { margin: '4px 0' } }, h('span', { class: 'small', style: { width: '180px' } }, l), h('div', { style: { flex: 1, height: '20px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: (s / n) * 100 + '%', height: '100%', background: c, borderRadius: '6px' } })), h('b', { class: 'small', style: { width: '120px' } }, `${((s / n) * 100).toFixed(0)}% (${s}/${n})`));
      const draw = () => { box.innerHTML = ''; if (!split) { const A_ = [data.small.A[0] + data.large.A[0], data.small.A[1] + data.large.A[1]], B_ = [data.small.B[0] + data.large.B[0], data.small.B[1] + data.large.B[1]]; box.append(h('b', null, 'All patients'), bar('Treatment A (surgery)', ...A_, '#2563EB'), bar('Treatment B (less invasive)', ...B_, '#DC2626'), h('p', { class: 'small' }, 'B looks better overall…')); }
        else ['small', 'large'].forEach((g) => box.append(h('b', null, g === 'small' ? 'Small stones' : 'Large stones'), bar('Treatment A', ...data[g].A, '#2563EB'), bar('Treatment B', ...data[g].B, '#DC2626'))), box.append(h('p', { class: 'small' }, '…but A wins for both small and large stones. A was given mostly to large, harder cases.')); };
      el.append(K.choice([[false, 'Combined'], [true, 'Split by stone size']], false, (v) => { split = v; draw(); }), box, Lab.source('Charig et al., BMJ 1986, success rates of kidney stone treatments.')); draw();
    } });

  A({ id: 'margin', d: ['statistics', 'politics', 'sociology'], e: '🗳️', t: 'How polls work (and fail)', b: 'Poll a simulated country. See margin of error shrink with sample size, then add bias.',
    how: 'A random sample of about 1,000 gives a margin of error near ±3 points 95% of the time, whatever the population size. Random error shrinks with √n; bias does not. The 1936 Literary Digest poll had 2.4 million responses but sampled car and phone owners and called the election wrong.',
    use: 'Elections, market research, public health surveys, the census and audits.',
    m(el, K) {
      const P = K.canvas(el, 280); const s = { truth: 52, n: 1000, bias: 0 }; const polls = []; const out = K.out();
      const poll = () => { let y = 0; const p = (s.truth + s.bias) / 100; for (let i = 0; i < s.n; i++) if (Math.random() < p) y++; polls.push((y / s.n) * 100); if (polls.length > 60) polls.shift(); draw(); };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 60, 40, 64, { noX: true, fy: (v) => v + '%' }); P.line([[X(0), Y(s.truth)], [X(60), Y(s.truth)]], '#16A34A', 2, [5, 4]); P.line([[X(0), Y(50)], [X(60), Y(50)]], K.css('--muted'), 1);
        const moe = 196 * Math.sqrt((s.truth / 100) * (1 - s.truth / 100) / s.n); polls.forEach((v, i) => { P.line([[X(i), Y(v - moe)], [X(i), Y(v + moe)]], '#94A3B8', 1.5); P.dot(X(i), Y(v), 4, Math.abs(v - s.truth) <= moe ? '#2563EB' : '#DC2626'); });
        const miss = polls.filter((v) => Math.abs(v - s.truth) > moe).length; out.innerHTML = `Margin of error ±${moe.toFixed(1)} pts · ${polls.length} polls, ${miss} missed the truth (red)` + (s.bias ? ` · <b style="color:#DC2626">bias of ${s.bias > 0 ? '+' : ''}${s.bias} pts: more people won’t fix it</b>` : ''); };
      P.onResize = draw; el.append(K.slider('True support in the country (%)', 40, 60, 0.5, s.truth, (v) => { s.truth = v; polls.length = 0; draw(); }), K.slider('Sample size', 50, 10000, 50, s.n, (v) => { s.n = v; polls.length = 0; draw(); }), K.slider('Sampling bias (pts)', -6, 6, 0.5, 0, (v) => { s.bias = v; polls.length = 0; draw(); }), h('div', { class: 'row' }, K.btn('Run 1 poll', poll, true), K.btn('Run 30 polls', () => { for (let i = 0; i < 30; i++) poll(); })), out);
      for (let i = 0; i < 20; i++) poll();
    } });

  A({ id: 'lln', d: ['statistics', 'math', 'economics'], e: '🪙', t: 'Law of large numbers', b: 'Flip coins and watch the share of heads wander, then settle near 50%. Casinos depend on this.',
    how: 'Jacob Bernoulli proved in 1713 that the average of many independent trials converges to the expected value. Short runs can be wildly off, which fools people into the gambler’s fallacy (“tails is due”). The coin has no memory.',
    use: 'Insurance pricing, casino profits, polling, A/B testing, and why diversified index funds behave more predictably than single stocks.',
    m(el, K) {
      const P = K.canvas(el, 300); const runs = [[], [], [], []]; let p = 0.5; const out = K.out(); const H = [0, 0, 0, 0];
      el.append(K.slider('Probability of heads', 0.05, 0.95, 0.05, p, (v) => { p = v; runs.forEach((r) => (r.length = 0)); H.fill(0); }), K.btn('Restart', () => { runs.forEach((r) => (r.length = 0)); H.fill(0); }), out);
      K.raf(() => { if (runs[0].length < 2000) for (let k = 0; k < 5; k++) runs.forEach((r, i) => { if (Math.random() < p) H[i]++; r.push(H[i] / (r.length + 1)); }); P.clear(); const { X, Y } = P.chart(1, 2000, 0, 1, { xl: 'flips', fy: (v) => Math.round(v * 100) + '%' }); P.line([[X(1), Y(p)], [X(2000), Y(p)]], '#16A34A', 2, [5, 4]); runs.forEach((r, i) => P.line(r.map((v, j) => [X(j + 1), Y(v)]), K.pal[i], 1.8)); out.textContent = `${runs[0].length} flips per player. Final shares: ${runs.map((r) => ((r[r.length - 1] || 0) * 100).toFixed(1) + '%').join(', ')}`; });
    } });

  A({ id: 'kelly', d: ['statistics', 'economics', 'math'], e: '💹', t: 'How much to bet? (Kelly)', b: 'You have an edge. Bet too little and you grow slowly; bet too much and you go broke anyway.',
    how: 'John Kelly (Bell Labs, 1956) found the bet size that maximizes long-run growth: f* = edge ÷ odds (for an even-money bet, 2p − 1). Betting twice Kelly gives roughly zero growth; more than that loses money over time even with an edge. Many professionals bet half Kelly to reduce swings.',
    use: 'Position sizing in trading and investing, sports betting, blackjack card counting (Ed Thorp), and any repeated risk-taking where ruin must be avoided.',
    m(el, K) {
      const P = K.canvas(el, 320); const s = { p: 0.55, f: 0.1 }; const out = K.out(); let paths = [];
      const sim = () => { paths = []; for (let k = 0; k < 20; k++) { let w = 1; const a = [w]; for (let t = 0; t < 300; t++) { const b = w * s.f; w += Math.random() < s.p ? b : -b; a.push(Math.max(w, 1e-6)); } paths.push(a); } draw(); };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 300, -3, 3, { fy: (v) => '×' + (10 ** v).toPrecision(2), xl: 'bets' }); P.line([[X(0), Y(0)], [X(300), Y(0)]], K.css('--muted'), 1); paths.forEach((a, i) => P.line(a.map((v, t) => [X(t), Y(Lab.clamp(Math.log10(v), -3, 3))]), K.pal[i % 8] + 'AA', 1.5));
        const kel = 2 * s.p - 1; const g = s.p * Math.log(1 + s.f) + (1 - s.p) * Math.log(1 - s.f); const med = paths.map((a) => a[300]).sort((a, b) => a - b)[10];
        out.innerHTML = `Kelly bet = <b>${(kel * 100).toFixed(1)}%</b> of bankroll · you bet ${(s.f * 100).toFixed(0)}% (${(s.f / Math.max(kel, 1e-9)).toFixed(1)}× Kelly) · expected growth per bet ${(g * 100).toFixed(2)}% · median result ×${med.toPrecision(3)}`; };
      P.onResize = draw; el.append(K.slider('Chance of winning each even-money bet', 0.5, 0.7, 0.01, s.p, (v) => { s.p = v; sim(); }), K.slider('Fraction of bankroll bet each time', 0.01, 0.9, 0.01, s.f, (v) => { s.f = v; sim(); }, (v) => Math.round(v * 100) + '%'), K.btn('Re-run 20 gamblers', sim, true), out, h('p', { class: 'tiny muted' }, 'Log scale. Educational simulation, not financial advice: real edges are uncertain, which is one reason people bet less than full Kelly.')); sim();
    } });

  A({ id: 'randomwalk', d: ['statistics', 'economics', 'physics'], e: '🎲', t: 'Random walks & fake trends', b: 'Generate random price charts. Can you tell them from real markets? Spot the “patterns” in pure noise.',
    how: 'A random walk adds a random step each day. Louis Bachelier modeled stock prices this way in 1900; Einstein used the same math for Brownian motion (pollen jiggling in water) in 1905. Random walks produce convincing trends, support levels and head-and-shoulders patterns by chance.',
    use: 'The efficient market hypothesis, option pricing (Black-Scholes), diffusion of molecules, animal foraging, and testing whether a trading signal beats chance.',
    m(el, K) {
      const P = K.canvas(el, 320); let vol = 1.5, drift = 0.03; const out = K.out();
      const gen = () => { P.clear(); const paths = Array.from({ length: 4 }, () => { let v = 100; return Array.from({ length: 250 }, () => (v *= 1 + (drift + vol * K.gauss()) / 100)); }); const all = paths.flat(); const { X, Y } = P.chart(0, 250, Math.min(...all) * 0.98, Math.max(...all) * 1.02, { xl: 'trading days', fy: (v) => '$' + v.toFixed(0) }); paths.forEach((p, i) => P.line(p.map((v, t) => [X(t), Y(v)]), K.pal[i], 1.8)); out.textContent = 'Every line is pure chance with the same rules. Notice the “trends”, “breakouts” and “support levels” anyway.'; };
      P.onResize = gen; el.append(K.slider('Daily volatility %', 0.2, 4, 0.1, vol, (v) => { vol = v; gen(); }), K.slider('Daily drift %', -0.2, 0.2, 0.01, drift, (v) => { drift = v; gen(); }), K.btn('🎲 New random markets', gen, true), out); gen();
    } });

  A({ id: 'confint', d: ['statistics', 'medicine', 'physics'], e: '📏', t: 'What 95% confidence really means', b: 'Draw 100 samples and their intervals. About 95 catch the true value; the rest miss.',
    how: 'A 95% confidence interval comes from a method that captures the true value in 95% of repeated samples. Any single interval either contains it or doesn’t; the 95% is about the method. Jerzy Neyman introduced the idea in 1937.',
    use: 'Every serious study, drug trial result, economic estimate and poll should come with an interval, not just a single number.',
    m(el, K) {
      const P = K.canvas(el, 360); let n = 25, lvl = 1.96; const out = K.out(); const mu = 170, sd = 10;
      const run = () => { P.clear(); const { X, Y } = P.chart(160, 180, 0, 100, { noY: true, xl: 'height (cm)' }); P.line([[X(mu), Y(0)], [X(mu), Y(100)]], '#16A34A', 2); let hit = 0;
        for (let i = 0; i < 100; i++) { let s = 0; for (let j = 0; j < n; j++) s += mu + sd * K.gauss(); const m = s / n, e = (lvl * sd) / Math.sqrt(n); const ok = m - e <= mu && mu <= m + e; if (ok) hit++; P.line([[X(Lab.clamp(m - e, 160, 180)), Y(i + 0.5)], [X(Lab.clamp(m + e, 160, 180)), Y(i + 0.5)]], ok ? '#2563EB' : '#DC2626', 2); }
        out.innerHTML = `<b>${hit}</b> of 100 intervals contain the true average (green line, ${mu} cm).`; };
      P.onResize = run; el.append(K.slider('People per sample', 5, 200, 5, n, (v) => { n = v; run(); }), K.choice([[1.645, '90%'], [1.96, '95%'], [2.576, '99%']], 1.96, (v) => { lvl = v; run(); }), K.btn('Draw 100 new samples', run, true), out); run();
    } });

  A({ id: 'germantank', d: ['statistics', 'history', 'geopolitics'], e: '🛡️', t: 'The German tank problem', b: 'Estimate how many tanks the enemy built from the serial numbers of a few captured ones.',
    how: 'If you capture k tanks and the highest serial is m, a good estimate of the total is m + m/k − 1. In WWII, Allied statisticians estimated German tank production at about 246 a month; intelligence reports said about 1,400. Postwar records showed 245.',
    use: 'Estimating production from serial numbers (iPhones, factories), counting animal populations, and estimating the number of unseen species or bugs.',
    m(el, K) {
      let N = K.ri(200, 2000), caps = []; const out = h('div'); const box = h('div', { class: 'row', style: { gap: '4px', marginTop: '8px' } });
      const cap = () => { let s; do s = K.ri(1, N); while (caps.includes(s)); caps.push(s); draw(); };
      const draw = () => { box.innerHTML = ''; caps.slice().sort((a, b) => a - b).forEach((s) => box.append(h('span', { class: 'tag', style: { '--c': '#475569' } }, '#' + s))); if (!caps.length) { out.innerHTML = '<p class="small">Capture some tanks.</p>'; return; } const m = Math.max(...caps), k = caps.length;
        out.innerHTML = `<p class="small">Captured ${k}; highest serial ${m}.</p><div class="kpi">Estimate: ${Math.round(m + m / k - 1)} tanks <small>naive guess (2 × average serial): ${Math.round((2 * caps.reduce((a, b) => a + b, 0)) / k)}</small></div>`; };
      const reveal = h('div', { class: 'small' });
      el.append(h('div', { class: 'row' }, K.btn('Capture a tank', cap, true), K.btn('Capture 5', () => { for (let i = 0; i < 5; i++) cap(); }), K.btn('Reveal the truth', () => (reveal.textContent = `The enemy actually built ${N} tanks.`)), K.btn('New war', () => { N = K.ri(200, 2000); caps = []; reveal.textContent = ''; draw(); })), box, out, reveal); draw();
    } });

  A({ id: 'spurious', d: ['statistics', 'psychology', 'medicine', 'economics'], e: '🍦', t: 'Correlation isn’t causation', b: 'Ice cream sales “cause” drownings? Reveal the hidden variable behind the link.',
    how: 'Two things can move together because a third factor drives both (a confounder). Here hot weather raises both ice cream sales and swimming. Controlling for the confounder (looking within each temperature band) makes the link disappear. Randomized experiments break confounding by design.',
    use: 'Nutrition studies, policy evaluation, medicine (hormone replacement therapy looked protective in observational studies, but a 2002 randomized trial found otherwise) and business analytics.',
    m(el, K) {
      const P = K.canvas(el, 340); let show = false; const pts = Array.from({ length: 120 }, () => { const t = K.rnd(5, 35); return [t, 20 + t * 4 + K.gauss() * 18, Math.max(0, 0.15 * t + K.gauss() * 1.2)]; }); const out = K.out();
      const corr = (a, b) => { const n = a.length, ma = a.reduce((x, y) => x + y) / n, mb = b.reduce((x, y) => x + y) / n; let s = 0, sa = 0, sb = 0; a.forEach((v, i) => { s += (v - ma) * (b[i] - mb); sa += (v - ma) ** 2; sb += (b[i] - mb) ** 2; }); return s / Math.sqrt(sa * sb); };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 180, -1, 8, { xl: 'ice cream sales', yl: 'drownings' }); pts.forEach(([t, ic, dr]) => P.dot(X(ic), Y(dr), 5, show ? `hsl(${220 - (t - 5) * 7},80%,50%)` : '#64748B'));
        const r = corr(pts.map((p) => p[1]), pts.map((p) => p[2])); const bands = [[5, 15], [15, 25], [25, 35]].map(([a, b]) => { const s = pts.filter((p) => p[0] >= a && p[0] < b); return corr(s.map((p) => p[1]), s.map((p) => p[2])); });
        out.innerHTML = `Overall correlation r = <b>${r.toFixed(2)}</b>` + (show ? ` · within cold / mild / hot days: ${bands.map((x) => x.toFixed(2)).join(' / ')} (near zero). Color = temperature: heat drives both.` : ''); };
      P.onResize = draw; el.append(K.btn('🌡️ Reveal the hidden variable', () => { show = !show; draw(); }, true), out); draw();
    } });

  A({ id: 'normal', d: ['statistics', 'biology', 'medicine'], e: '📐', t: 'Normal curve & z-scores', b: 'Where does a value fall? Shade any range under the bell curve and read the probability.',
    how: 'Many traits (heights, measurement errors, test scores) are roughly normal. 68% of values fall within 1 standard deviation of the mean, 95% within 2, 99.7% within 3. A z-score says how many standard deviations a value is from the mean.',
    use: 'Growth charts at the doctor, standardized test scores (IQ is scaled to mean 100, SD 15), quality control (“six sigma”), and risk models (which can fail when reality has fatter tails).',
    m(el, K) {
      const P = K.canvas(el, 300); const s = { mu: 175, sd: 7, a: 168, b: 182 }; const out = K.big(); const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2)); const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
      const draw = () => { P.clear(); const lo = s.mu - 4 * s.sd, hi = s.mu + 4 * s.sd; const pdf = (x) => Math.exp(-(((x - s.mu) / s.sd) ** 2) / 2) / (s.sd * Math.sqrt(2 * Math.PI)); const { X, Y } = P.chart(lo, hi, 0, pdf(s.mu) * 1.1, { noY: true, xl: 'cm' });
        P.ctx.fillStyle = '#0EA5E955'; P.ctx.beginPath(); P.ctx.moveTo(X(s.a), Y(0)); for (let x = s.a; x <= s.b; x += (hi - lo) / 300) P.ctx.lineTo(X(x), Y(pdf(x))); P.ctx.lineTo(X(s.b), Y(0)); P.ctx.fill();
        const pts = []; for (let x = lo; x <= hi; x += (hi - lo) / 300) pts.push([X(x), Y(pdf(x))]); P.line(pts, '#0369A1', 2.5);
        const p = phi((s.b - s.mu) / s.sd) - phi((s.a - s.mu) / s.sd); out.innerHTML = `${(p * 100).toFixed(1)}% <small>between ${s.a} and ${s.b} (z from ${((s.a - s.mu) / s.sd).toFixed(2)} to ${((s.b - s.mu) / s.sd).toFixed(2)})</small>`; };
      P.onResize = draw; el.append(K.two(h('div', null, K.slider('Average', 150, 200, 0.5, s.mu, (v) => { s.mu = v; draw(); }), K.slider('Standard deviation', 2, 15, 0.5, s.sd, (v) => { s.sd = v; draw(); })), h('div', null, K.slider('From', 140, 210, 0.5, s.a, (v) => { s.a = v; draw(); }), K.slider('To', 140, 210, 0.5, s.b, (v) => { s.b = v; draw(); }))), out); draw();
    } });

  A({ id: 'abtest', d: ['statistics', 'economics', 'psychology', 'computing'], e: '🅰️', t: 'Run an A/B test', b: 'Two versions of a website. Watch visitors arrive and decide when you have enough evidence.',
    how: 'Randomly show visitors version A or B and compare conversion rates. Early on, random noise creates big fake differences; “peeking” and stopping as soon as one looks better inflates false wins. Decide your sample size in advance.',
    use: 'Tech companies run thousands of these a year; the same logic is a randomized controlled trial in medicine (the first modern one, streptomycin for tuberculosis, was in 1948) and in economics field experiments.',
    m(el, K) {
      const P = K.canvas(el, 280); const s = { pa: 0.1, pb: 0.11 }; let A_ = [0, 0], B_ = [0, 0], hist = [], run = false; const out = K.out();
      const reset = () => { A_ = [0, 0]; B_ = [0, 0]; hist = []; };
      el.append(K.slider('True conversion A', 0.02, 0.3, 0.005, s.pa, (v) => { s.pa = v; reset(); }, (v) => (v * 100).toFixed(1) + '%'), K.slider('True conversion B', 0.02, 0.3, 0.005, s.pb, (v) => { s.pb = v; reset(); }, (v) => (v * 100).toFixed(1) + '%'), h('div', { class: 'row' }, K.btn('⏯ Send visitors', () => (run = !run), true), K.btn('Reset', reset)), out);
      K.raf(() => { if (run && A_[1] < 40000) for (let i = 0; i < 40; i++) { const a = Math.random() < 0.5; const c = Math.random() < (a ? s.pa : s.pb); if (a) { A_[1]++; A_[0] += c; } else { B_[1]++; B_[0] += c; } }
        if (A_[1] && B_[1]) { const ra = A_[0] / A_[1], rb = B_[0] / B_[1], se = Math.sqrt(ra * (1 - ra) / A_[1] + rb * (1 - rb) / B_[1]) || 1; const z = (rb - ra) / se; if (run) hist.push(z); if (hist.length > 1500) hist.shift();
          P.clear(); const { X, Y } = P.chart(0, 1500, -4, 6, { noX: true, yl: 'z-score (B vs A)' }); P.rect(X(0), Y(6), P.W, Y(1.96) - Y(6), '#16A34A18'); P.line([[X(0), Y(1.96)], [X(1500), Y(1.96)]], '#16A34A', 1, [4, 4]); P.line([[X(0), Y(-1.96)], [X(1500), Y(-1.96)]], '#DC2626', 1, [4, 4]); P.line(hist.map((v, i) => [X(i), Y(Lab.clamp(v, -4, 6))]), '#2563EB', 2);
          out.innerHTML = `A: ${(ra * 100).toFixed(2)}% of ${A_[1].toLocaleString()} · B: ${(rb * 100).toFixed(2)}% of ${B_[1].toLocaleString()} · z = <b>${z.toFixed(2)}</b> ${Math.abs(z) > 1.96 ? '(looks significant now)' : '(not significant)'}. Set A = B and watch noise cross the line.`; } });
    } });
})();
