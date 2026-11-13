const { h } = Lab;

const DOUG = 'I have often been utterly astonished, since I came to the north, to find persons who could speak of the singing, among slaves, as evidence of their contentment and happiness. It is impossible to conceive of a greater mistake. Slaves sing most when they are most unhappy. — Frederick Douglass, Narrative of the Life of Frederick Douglass (1845)';
const FED = 'By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community. — James Madison, Federalist No. 10 (1787)';
const PAINE = 'Society in every state is a blessing, but government even in its best state is but a necessary evil; in its worst state an intolerable one. — Thomas Paine, Common Sense (1776)';
const MILL = 'If all mankind minus one, were of one opinion, and only one person were of the contrary opinion, mankind would be no more justified in silencing that one person, than he, if he had the power, would be justified in silencing mankind. — John Stuart Mill, On Liberty (1859)';
const DECL = 'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. — That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed. — Declaration of Independence (1776)';
const EXP = 'A student puts the same kind of seedling in 4 pots with the same soil, water and sunlight. She gives each pot a different amount of fertilizer (0 g, 5 g, 10 g, 15 g) and measures plant height after 3 weeks.';

// [subject, topic, question, options, answerIndex, explanation, passage?]
const Q = [
  ['math', 'Percent', 'A jacket costs $40. It is on sale for 25% off. What is the sale price?', ['$10', '$15', '$30', '$35'], 2, '25% of $40 is $10. $40 − $10 = $30. Shortcut: 75% of 40 = 0.75 × 40 = 30.'],
  ['math', 'Linear equations', 'Solve for x: 3x − 7 = 11', ['x = 4/3', 'x = 6', 'x = 18', 'x = 1.5'], 1, 'Add 7 to both sides: 3x = 18. Divide by 3: x = 6. Check: 3(6) − 7 = 11 ✓'],
  ['math', 'Statistics', 'What is the mean of 4, 8, 10 and 14?', ['8', '9', '10', '36'], 1, 'Add them (36) and divide by how many there are (4): 36 ÷ 4 = 9.'],
  ['math', 'Statistics', 'What is the median of 7, 2, 9, 4, 5?', ['4', '5', '5.4', '7'], 1, 'Sort first: 2, 4, 5, 7, 9. The middle value is 5. (The mean would be 5.4.)'],
  ['math', 'Slope', 'What is the slope of the line through (2, 3) and (6, 11)?', ['1/2', '2', '4', '8'], 1, 'Slope = change in y ÷ change in x = (11 − 3) ÷ (6 − 2) = 8 ÷ 4 = 2.'],
  ['math', 'Expressions', 'Simplify: 2(x + 5) − 3x', ['−x + 10', '5x + 10', '−x + 5', 'x + 10'], 0, 'Distribute: 2x + 10 − 3x. Combine like terms: −x + 10.'],
  ['math', 'Geometry', 'What is the area of a circle with radius 3 cm? (Use π ≈ 3.14)', ['9.42 cm²', '18.84 cm²', '28.26 cm²', '113.04 cm²'], 2, 'Area = πr² = 3.14 × 9 = 28.26. (18.84 is the circumference, 2πr.) The formula sheet gives you these.'],
  ['math', 'Rates', 'A car travels 150 miles in 2.5 hours. What is its average speed?', ['37.5 mph', '50 mph', '60 mph', '375 mph'], 2, 'Speed = distance ÷ time = 150 ÷ 2.5 = 60 miles per hour.'],
  ['math', 'Number sense', 'Which is the greatest?', ['3/5', '0.58', '61%', '5/8'], 3, 'Convert all to decimals: 0.60, 0.58, 0.61, 0.625. 5/8 is largest.'],
  ['math', 'Functions', 'If f(x) = x² − 2x, what is f(−3)?', ['3', '−15', '15', '9'], 2, '(−3)² − 2(−3) = 9 + 6 = 15. Careful with the signs: squaring a negative gives a positive.'],
  ['math', 'Systems', 'Solve: x + y = 10 and x − y = 4', ['x = 7, y = 3', 'x = 6, y = 4', 'x = 3, y = 7', 'x = 5, y = 5'], 0, 'Add the equations: 2x = 14, so x = 7. Then y = 10 − 7 = 3.'],
  ['math', 'Geometry', 'A right triangle has legs of 6 and 8. How long is the hypotenuse?', ['10', '12', '14', '48'], 0, 'Pythagorean theorem: 6² + 8² = 36 + 64 = 100, and √100 = 10.'],
  ['math', 'Probability', 'You roll a fair six-sided die. What is the probability of rolling a number greater than 4?', ['1/6', '1/3', '1/2', '2/3'], 1, 'Only 5 and 6 work: 2 out of 6 outcomes = 1/3.'],
  ['math', 'Quadratics', 'Factor: x² − 5x + 6', ['(x − 1)(x − 6)', '(x + 2)(x + 3)', '(x − 2)(x − 3)', '(x − 5)(x − 1)'], 2, 'Find two numbers that multiply to 6 and add to −5: −2 and −3.'],
  ['math', 'Inequalities', 'Solve: −2x + 3 > 9', ['x > −3', 'x < −3', 'x > 3', 'x < 6'], 1, 'Subtract 3: −2x > 6. Divide by −2 and FLIP the sign: x < −3. Flipping when you divide by a negative is a classic trap.'],
  ['math', 'Scientific notation', 'Write 0.00045 in scientific notation.', ['4.5 × 10⁴', '4.5 × 10⁻³', '4.5 × 10⁻⁴', '45 × 10⁻⁵'], 2, 'Move the decimal 4 places right to get 4.5, so the exponent is −4.'],
  ['math', 'Percent', 'You invest $2,000 at 5% simple interest per year. How much interest after 3 years?', ['$100', '$300', '$315.25', '$2,300'], 1, 'Simple interest = principal × rate × time = 2000 × 0.05 × 3 = $300. ($315.25 would be compound interest.)'],
  ['math', 'Geometry', 'What is the volume of a box 3 ft by 4 ft by 5 ft?', ['12 ft³', '47 ft³', '60 ft³', '94 ft³'], 2, 'Volume = length × width × height = 3 × 4 × 5 = 60 cubic feet.'],

  ['science', 'Experimental design', 'In this experiment, what is the independent variable?', ['Plant height', 'Amount of fertilizer', 'Type of soil', 'Amount of sunlight'], 1, 'The independent variable is the one the experimenter changes on purpose (fertilizer). Height is the dependent variable (what is measured). Soil and sunlight are controlled variables.', EXP],
  ['science', 'Experimental design', 'Why does the student include a pot with 0 g of fertilizer?', ['To use up extra seedlings', 'As a control to compare against', 'To test the soil', 'To make the data look better'], 1, 'The control shows what happens with no treatment, so you can tell whether fertilizer made a difference.', EXP],
  ['science', 'Life science', 'Which part of the cell produces most of its usable energy (ATP)?', ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell membrane'], 2, 'Mitochondria carry out cellular respiration, turning sugar and oxygen into ATP. Explore one in the 3D cell.'],
  ['science', 'Life science', 'During photosynthesis, plants take in carbon dioxide and water. Which gas do they release?', ['Nitrogen', 'Oxygen', 'Carbon monoxide', 'Hydrogen'], 1, '6CO₂ + 6H₂O + light → C₆H₁₂O₆ (glucose) + 6O₂.'],
  ['science', 'Genetics', 'Two parents each carry one dominant allele (A) and one recessive allele (a). What is the chance a child is aa?', ['0%', '25%', '50%', '75%'], 1, 'Punnett square: AA, Aa, aA, aa. One of four is aa = 25%. Sickle-cell disease follows this pattern.'],
  ['science', 'Physics', 'A net force accelerates a 10 kg object at 2 m/s². What is the force?', ['5 N', '12 N', '20 N', '50 N'], 2, 'Newton’s second law: F = m × a = 10 × 2 = 20 newtons.'],
  ['science', 'Physical science', 'An object has a mass of 50 g and a volume of 20 cm³. Water’s density is 1 g/cm³. Will the object float?', ['Yes, its density is 0.4 g/cm³', 'Yes, its density is 2.5 g/cm³', 'No, its density is 2.5 g/cm³', 'No, its density is 1,000 g/cm³'], 2, 'Density = mass ÷ volume = 50 ÷ 20 = 2.5 g/cm³, which is more than water, so it sinks.'],
  ['science', 'Energy', 'In a battery-powered flashlight, what energy change happens?', ['Light → chemical', 'Chemical → electrical → light', 'Heat → electrical', 'Nuclear → light'], 1, 'The battery stores chemical energy, which becomes electrical energy, then light (plus some heat).'],
  ['science', 'Ecology', 'In the food chain grass → rabbit → fox, disease kills most of the rabbits. What happens first to the grass?', ['It decreases', 'It increases', 'It stays the same', 'It dies out'], 1, 'Fewer rabbits eat less grass, so grass increases. The foxes, losing food, would decline.'],
  ['science', 'Earth & space', 'What causes Earth’s seasons?', ['Distance from the Sun', 'The tilt of Earth’s axis', 'The Moon’s orbit', 'Sunspots'], 1, 'Earth’s 23.5° tilt changes how directly sunlight hits each hemisphere. Earth is actually closest to the Sun in early January, during northern winter.'],
  ['science', 'Scientific method', 'Which is a testable hypothesis?', ['Plants are beautiful', 'Plants given more light grow taller', 'Plants have feelings', 'Plants are better than animals'], 1, 'A hypothesis must make a prediction you can measure and could prove wrong.'],
  ['science', 'Earth & space', 'Where do most earthquakes happen?', ['In the middle of plates', 'Along plate boundaries', 'Only under oceans', 'Near the poles'], 1, 'Most earthquakes occur where tectonic plates meet, such as around the Pacific “Ring of Fire.”'],
  ['science', 'Chemistry', 'Which is a chemical change?', ['Ice melting', 'Cutting paper', 'Burning wood', 'Dissolving sugar'], 2, 'Burning makes new substances (ash, carbon dioxide, water). The others change form but not what the substance is.'],
  ['science', 'Physics', 'If a car’s speed doubles, its kinetic energy:', ['stays the same', 'doubles', 'triples', 'quadruples'], 3, 'KE = ½mv². Doubling v multiplies v² by 4. This is why crashes at higher speed are far more deadly.'],
  ['science', 'Chemistry', 'A sample of 80 g has a half-life of 5 years. How much is left after 15 years?', ['40 g', '20 g', '10 g', '5 g'], 2, '15 years = 3 half-lives: 80 → 40 → 20 → 10 g.'],
  ['science', 'Life science', 'Which is an example of homeostasis?', ['Growing taller', 'Sweating when hot', 'Catching a cold', 'Learning to swim'], 1, 'Homeostasis means keeping internal conditions stable; sweating cools the body back toward 37 °C.'],

  ['social', 'Civics', 'Which branch of the US government interprets laws?', ['Legislative', 'Executive', 'Judicial', 'The states'], 2, 'Congress (legislative) makes laws, the president (executive) carries them out, and the courts (judicial) interpret them.'],
  ['social', 'Civics', 'The president vetoes a bill. How can Congress still make it law?', ['A simple majority vote', 'A two-thirds vote in both houses', 'Asking the Supreme Court', 'A national referendum'], 1, 'Overriding a veto takes two-thirds of both the House and the Senate: a check on the president.'],
  ['social', 'Civics', 'Which right is NOT in the First Amendment?', ['Freedom of speech', 'Freedom of religion', 'Right to bear arms', 'Freedom of the press'], 2, 'The right to bear arms is the Second Amendment. The First covers religion, speech, press, assembly and petition.'],
  ['social', 'Civics', 'Federalism means power is divided between:', ['the president and Congress', 'national and state governments', 'Democrats and Republicans', 'courts and police'], 1, 'Federalism splits power between the national government and the states.'],
  ['social', 'Founding documents', 'According to this passage, where do governments get their legitimate power?', ['From God directly', 'From the consent of the governed', 'From military strength', 'From the king'], 1, 'The Declaration says governments derive “their just powers from the consent of the governed,” an idea drawn from John Locke.', DECL],
  ['social', 'Economics', 'A frost destroys much of Florida’s orange crop. What most likely happens to orange prices?', ['They fall', 'They rise', 'They stay the same', 'Oranges become free'], 1, 'Supply drops while demand stays the same, so the price rises. Try it in the Supply & demand lab.'],
  ['social', 'Economics', 'Inflation is:', ['a fall in unemployment', 'a general rise in prices over time', 'an increase in exports', 'a rise in the stock market'], 1, 'Inflation means the same money buys less over time.'],
  ['social', 'Economics', 'You choose to work a shift instead of going to a concert. The concert is your:', ['sunk cost', 'opportunity cost', 'tax', 'profit'], 1, 'Opportunity cost is the value of the best option you give up when you choose something.'],
  ['social', 'Economics', 'When inflation is high, the Federal Reserve usually:', ['lowers interest rates', 'raises interest rates', 'prints coins', 'cuts taxes'], 1, 'Higher interest rates make borrowing costlier, slowing spending and price growth.'],
  ['social', 'Geography', 'Lines of latitude measure:', ['distance east or west of Greenwich', 'distance north or south of the equator', 'height above sea level', 'time zones'], 1, 'Latitude runs from 0° at the equator to 90° at the poles. Longitude measures east–west.'],
  ['social', 'US history', 'Which amendment abolished slavery in the United States?', ['1st', '13th', '15th', '19th'], 1, 'The 13th (1865) abolished slavery, except as punishment for a crime (an exception that allowed convict leasing and still permits unpaid prison labor), the 14th (1868) guaranteed citizenship and equal protection, the 15th (1870) barred race-based voting bans, and the 19th (1920) gave women the vote.'],
  ['social', 'US history', 'The US Cold War policy of “containment” aimed to:', ['conquer the Soviet Union', 'stop the spread of communism', 'end all foreign trade', 'create the United Nations'], 1, 'Containment, outlined by diplomat George Kennan in 1946–47, sought to stop Soviet influence from spreading.'],
  ['social', 'World history', 'What event directly triggered World War I?', ['The sinking of the Lusitania', 'The assassination of Archduke Franz Ferdinand', 'The Russian Revolution', 'The invasion of Poland'], 1, 'His assassination in Sarajevo on June 28, 1914 set off the chain of alliance commitments. (Poland’s invasion began WWII.)'],
  ['social', 'Civics', 'How many electoral votes does a candidate need to win the presidency?', ['218', '270', '300', '51%'], 1, 'There are 538 electors; a majority is 270.'],
  ['social', 'Reading sources', 'Which is a primary source about the Civil War?', ['A 2010 textbook chapter', 'A soldier’s 1863 letter home', 'A documentary film', 'An encyclopedia article'], 1, 'Primary sources were made by people at the time. Learn to weigh them in the Evidence Lab.'],
  ['social', 'Reading sources', 'Which statement is an opinion?', ['The Constitution was signed in 1787', 'The Senate has 100 members', 'The Electoral College is the worst way to pick a president', 'Washington was the first president'], 2, '“Worst” is a judgment that can’t be proven true or false; the others can be checked.'],

  ['rla', 'Grammar', 'Choose the correct word: “Each of the students ___ a laptop.”', ['have', 'has', 'are having', 'were having'], 1, '“Each” is singular, so the verb is singular: has. Ignore “of the students” between subject and verb.'],
  ['rla', 'Grammar', 'Which sentence is correct?', ['Its going to rain.', 'The dog wagged it’s tail.', 'It’s been a long day.', 'The company lost it’s lead.'], 2, 'It’s = it is / it has. Its = belonging to it (no apostrophe).'],
  ['rla', 'Grammar', 'Which fixes this run-on: “I studied all night I still felt nervous.”', ['I studied all night, I still felt nervous.', 'I studied all night, but I still felt nervous.', 'I studied all night but, I still felt nervous.', 'I studied, all night I still felt nervous.'], 1, 'Join two complete sentences with a comma plus a conjunction (but), a semicolon, or a period. A comma alone is a comma splice.'],
  ['rla', 'Grammar', 'Choose the correct word: “The students left ___ books in the classroom.”', ['there', 'their', 'they’re', 'thier'], 1, 'Their = belonging to them. There = a place. They’re = they are.'],
  ['rla', 'Grammar', 'Which sentence has parallel structure?', ['She likes hiking, to swim, and biking.', 'She likes hiking, swimming, and biking.', 'She likes to hike, swimming, and bikes.', 'She likes hike, swim, and biking.'], 1, 'Items in a list should share the same form: hiking, swimming, biking.'],
  ['rla', 'Grammar', 'Choose the correct word: “To ___ should I address the letter?”', ['who', 'whom', 'whose', 'who’s'], 1, 'Use whom as an object (after “to”). Test: “address it to him” → him = whom.'],
  ['rla', 'Author’s purpose', 'What is Douglass mainly doing in this passage?', ['Describing his favorite songs', 'Correcting a false belief about enslaved people', 'Praising life in the North', 'Explaining how to write music'], 1, 'He calls the belief that singing showed contentment “a greater mistake” than one can imagine, and replaces it with the truth.', DOUG],
  ['rla', 'Word meaning', 'In this passage, “faction” most nearly means:', ['a fraction of a number', 'a group united by a shared interest against others’ rights', 'any political party', 'a group of soldiers'], 1, 'Madison defines it himself: citizens united by a passion or interest adverse to others’ rights or the community’s interests. Definitions inside a passage are gifts on the test.', FED],
  ['rla', 'Main idea', 'What is Paine’s view of government in this passage?', ['Government is always good', 'Government is a necessary evil', 'Society is the problem', 'Government should be abolished'], 1, 'He says society is a blessing but government, even at best, is “a necessary evil.”', PAINE],
  ['rla', 'Argument', 'Which claim best summarizes Mill’s argument?', ['The majority should decide what may be said', 'Silencing even one dissenting opinion is unjustified', 'Only experts should speak', 'Free speech is dangerous'], 1, 'Mill compares silencing one dissenter to that one person silencing everyone: equally unjustified.', MILL],
  ['rla', 'Evidence', 'A writer claims, “Exercise improves grades.” Which is the strongest support?', ['“My friend works out and gets A’s.”', '“Everyone knows exercise is good.”', '“A study of 2,000 students found that those who exercised regularly averaged higher GPAs, even after accounting for income.”', '“Athletes are popular.”'], 2, 'Large, specific data that rules out other explanations beats anecdotes and appeals to common belief. Even this shows a link, not proof of cause.'],
  ['rla', 'Evidence', 'Which is a logical fallacy?', ['“The study had 5,000 participants.”', '“You can’t trust his tax plan; he’s been divorced twice.”', '“Prices rose 3% last year.”', '“The bridge opened in 1937.”'], 1, 'Attacking the person instead of the argument (ad hominem) is a fallacy. The extended response rewards spotting weak reasoning.'],
];

const NAMES = { math: ['Math', '#3B82F6'], science: ['Science', '#8B5CF6'], social: ['Social Studies', '#F59E0B'], rla: ['Language Arts', '#10B981'] };
Lab.explorer('ged', 'arcade', {
  mount(el) {
    const ged = (Lab.state.ged ||= {}); const topics = (Lab.state.gedTopic ||= {});
    const box = h('div');
    el.append(box);
    let round = null;
    function menu() {
      box.innerHTML = '';
      const tile = (key, label, sub, color, icon) => h('button', { class: 'subj', style: { '--c': color, border: 0, textAlign: 'left', cursor: 'pointer', minHeight: '130px' }, onclick: () => start(key) }, h('div', { class: 'e' }, icon), h('h3', null, label), h('p', null, sub));
      const weak = Object.entries(topics).filter(([, [r, t]]) => t >= 2).map(([k, [r, t]]) => [k, r / t, t]).sort((a, b) => a[1] - b[1]).slice(0, 3);
      box.append(h('div', { class: 'grid g3' },
        tile('mix', 'Mixed round', '10 questions from all four tests', '#F97316', '🎲'),
        tile('sprint', '90-second sprint', 'As many as you can. Speed matters on test day.', '#DB2777', '⚡'),
        ...Object.entries(NAMES).map(([k, [n, c]]) => tile(k, n, `10 ${n} questions`, c, { math: '📐', science: '🔬', social: '🏛️', rla: '✍️' }[k]))),
        h('div', { class: 'grid g2', style: { marginTop: '14px' } },
          h('div', { class: 'card' }, h('h3', null, 'Your accuracy'), ...Object.entries(NAMES).map(([k, [n, c]]) => { const g = ged[k] || { r: 0, t: 0 }; const p = g.t ? Math.round((g.r / g.t) * 100) : 0; return h('div', { style: { margin: '8px 0' } }, h('div', { class: 'row small' }, h('b', null, n), h('span', { class: 'sp' }), h('span', { class: 'muted' }, g.t ? `${p}% of ${g.t}` : '—')), h('div', { class: 'bar' }, h('i', { style: { width: p + '%', background: c } }))); })),
          h('div', { class: 'card' }, h('h3', null, 'Work on next'), weak.length ? weak.map(([k, p, t]) => h('div', { class: 'row', style: { margin: '8px 0' } }, h('span', null, k), h('span', { class: 'sp' }), h('span', { class: 'pill', style: { color: p < 0.6 ? 'var(--bad)' : 'inherit' } }, Math.round(p * 100) + '%'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`Teach me "${k}" for the GED: the key rules, a worked example, the most common trap, then give me 3 practice questions one at a time and wait for my answers.`, `GED topic: ${k}`) }, '✦ Teach me'))) : h('p', { class: 'small muted' }, 'Play a few rounds and your weakest topics will show up here.'),
            h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, `${Q.length} questions in the bank so far. The tutor can generate unlimited extra practice on any topic.`))));
    }
    function start(mode) {
      const pool = mode === 'mix' || mode === 'sprint' ? Q : Q.filter((q) => q[0] === mode);
      round = { mode, qs: Lab.shuffle(pool).slice(0, mode === 'sprint' ? 40 : 10), i: 0, right: 0, t0: Date.now(), timer: null };
      if (mode === 'sprint') round.timer = setInterval(() => { const left = 90 - Math.floor((Date.now() - round.t0) / 1000); const el2 = document.getElementById('sprintT'); if (el2) el2.textContent = left + 's'; if (left <= 0) { clearInterval(round.timer); finish(); } }, 250);
      ask();
    }
    function ask() {
      if (round.i >= round.qs.length) return finish();
      const [s, topic, q, opts, a, why, passage] = round.qs[round.i];
      const [sn, sc] = NAMES[s];
      box.innerHTML = '';
      const order = Lab.shuffle(opts.map((o, i) => i));
      const feedback = h('div');
      const optBox = h('div', null, order.map((oi) => h('button', { class: 'opt', onclick: (e) => answer(oi, e.currentTarget) }, opts[oi])));
      box.append(h('div', { class: 'card', style: { '--accent': sc } },
        h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': sc } }, sn), h('span', { class: 'tag', style: { '--c': '#64748B' } }, topic), h('span', { class: 'sp' }), round.mode === 'sprint' ? h('b', { id: 'sprintT' }, '90s') : null, h('span', { class: 'muted small' }, `${round.i + 1} / ${round.mode === 'sprint' ? '∞' : round.qs.length} · ${round.right} right`)),
        h('div', { class: 'bar', style: { margin: '10px 0' } }, h('i', { style: { width: ((round.i / round.qs.length) * 100) + '%', background: sc } })),
        passage ? h('blockquote', { class: 'reader', style: { fontSize: '16px', borderLeft: `4px solid ${sc}`, margin: '10px 0', padding: '8px 14px', background: 'var(--card2)', borderRadius: '0 10px 10px 0' } }, passage) : null,
        h('h3', { style: { fontFamily: 'Inter', fontSize: '18px', margin: '12px 0' } }, q), optBox, feedback));
      Lab.setContext(`GED ${sn} practice question (${topic}): ${q} Options: ${opts.join(' | ')}`);
      function answer(oi, btn) {
        [...optBox.children].forEach((b, k) => { b.disabled = true; if (order[k] === a) b.classList.add('right'); });
        const ok = oi === a; if (!ok) btn.classList.add('wrong');
        const g = (ged[s] ||= { r: 0, t: 0 }); g.t++; if (ok) g.r++;
        const tp = (topics[topic] ||= [0, 0]); tp[1]++; if (ok) tp[0]++;
        if (ok) round.right++;
        Lab.addXP(ok ? 5 : 1);
        if (round.mode === 'sprint') { round.i++; setTimeout(ask, ok ? 350 : 1400); return; }
        feedback.append(h('div', { class: 'hint small', style: { marginTop: '10px' } }, h('b', null, ok ? '✓ Correct. ' : '✗ Not quite. '), why),
          h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', onclick: () => { round.i++; ask(); } }, round.i + 1 >= round.qs.length ? 'See results' : 'Next →'), h('button', { class: 'btn sm', onclick: () => Lab.ask(`I got this GED question ${ok ? 'right' : 'wrong'}: "${q}" (answer: ${opts[a]}). Explain the concept another way and give me a similar question to try.`) }, '✦ Explain differently')));
      }
    }
    function finish() {
      if (round.timer) clearInterval(round.timer);
      const n = round.mode === 'sprint' ? round.i : round.qs.length; const p = n ? Math.round((round.right / n) * 100) : 0;
      if (p >= 80 && n >= 10) Lab.markDone('ged:80:' + round.mode, 25, '80%+ GED round');
      Lab.addXP(10, 'round finished');
      box.innerHTML = '';
      box.append(h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { style: { fontSize: '56px' } }, p >= 80 ? '🏆' : p >= 60 ? '💪' : '📚'), h('h2', null, `${round.right} of ${n} right (${p}%)`),
        h('p', { class: 'muted' }, p >= 80 ? 'Test-ready pace on this set. Keep it up across all topics.' : p >= 60 ? 'Solid. Review the explanations for the misses, then go again.' : 'Every miss shows you exactly what to study. Use “Work on next” and the tutor.'),
        h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn primary', onclick: () => start(round.mode) }, 'Play again'), h('button', { class: 'btn', onclick: menu }, 'Menu'))));
    }
    menu();
    return () => { if (round && round.timer) clearInterval(round.timer); };
  },
});

Lab.explorer('ged', 'facts', {
  mount(el) {
    const T = [['Mathematical Reasoning', '115 minutes', 'About 45% quantitative problem solving, 55% algebra. An on-screen calculator (TI-30XS) and a formula sheet are provided for most questions.', '#3B82F6'],
      ['Science', '90 minutes', 'About 40% life science, 40% physical science, 20% Earth and space. Heavy on reading charts and experiments, not memorizing facts.', '#8B5CF6'],
      ['Social Studies', '70 minutes', 'About 50% civics and government, 20% US history, 15% economics, 15% geography and the world. Lots of reading primary sources and graphs.', '#F59E0B'],
      ['Reasoning Through Language Arts', '150 minutes', 'Reading comprehension, grammar and editing, and a 45-minute extended response where you analyze two arguments and say which is better supported. Includes a 10-minute break.', '#10B981']];
    el.append(h('div', { class: 'grid g2' }, T.map(([n, t, d, c]) => h('div', { class: 'card', style: { borderTop: `5px solid ${c}` } }, h('h3', null, n), h('div', { class: 'kpi', style: { color: c } }, t), h('p', { class: 'small' }, d)))),
      h('div', { class: 'card' }, h('h3', null, 'Scoring'), h('table', { class: 't' }, [['100–144', 'Not passed yet (retake available)'], ['145–164', 'Pass: GED credential'], ['165–174', 'GED College Ready'], ['175–200', 'GED College Ready + Credit (some colleges give credit)']].map(([a, b]) => h('tr', null, h('td', null, h('b', null, a)), h('td', null, b)))),
        h('p', { class: 'small', style: { marginTop: '10px' } }, 'You can take the four tests separately, in any order, and only pay for the ones you take. Prices and rules vary by state: check GED.com for Colorado.'),
        h('a', { class: 'btn sm', href: 'https://ged.com', style: { textDecoration: 'none' } }, 'GED.com ↗')),
      h('div', { class: 'card' }, h('h3', null, 'A plan that works'), h('ol', { class: 'small' },
        h('li', null, 'Take the official GED Ready practice test for one subject. It predicts whether you’d pass today.'),
        h('li', null, 'Drill weak topics here daily (one round = about 10 minutes) and ask the tutor to teach anything below 70%.'),
        h('li', null, 'When the arcade shows 80%+ in a subject and GED Ready says “likely to pass,” book that test.'),
        h('li', null, 'Start with your strongest subject: a quick pass builds momentum.')),
        Lab.apply('the skills tested (reading arguments, interpreting data, algebra) are the same ones you use to judge news, contracts and trades. You’re not just passing a test.')),
      h('p', { class: 'tiny muted' }, 'Test lengths and content splits from GED Testing Service, checked November 2026. Your Doc’s GED syllabi list every topic.'));
  },
});
