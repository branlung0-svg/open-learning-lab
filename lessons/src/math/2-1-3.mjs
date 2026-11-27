// Lesson 2.1.3 — the template lesson for the rebuilt Math path. Outline approved by Owen on 2026-11-26
// ("a little more in depth for everything"). Build: node tools/lessons/build.mjs
const R = String.raw;

export default {
  id: '2.1.3', subject: 'math', tier: 2, unit: '2.1', unitTitle: 'Integers',
  title: 'Multiplying and dividing integers',
  dek: 'Why a negative times a negative is positive: seen in six pictures, worked out by hand, then proved from the laws of arithmetic. Plus the 1,500-year argument over whether negative numbers even exist.',
  description: 'Why negative times negative is positive: six interactive visuals, a full proof from the laws of arithmetic, the history from China and India to Hankel in 1867, real uses and 30 practice problems with worked solutions.',
  minutes: 50, shortMinutes: 10, updated: '27 November 2026', checked: '27 November 2026',
  prereqs: [
    { id: '1.3.1', t: 'Groups, arrays and area' }, { id: '1.3.3', t: 'The distributive law' },
    { id: '2.1.1', t: 'Negative numbers' }, { id: '2.1.2', t: 'Adding and subtracting integers' },
  ],
  prev: { id: '2.1.2', t: 'Adding and subtracting integers' },
  next: { id: '2.1.4', t: 'Absolute value and distance' },

  summary: {
    title: 'The rules in one minute',
    md: R`
| When the signs are | the answer is | for example |
| --- | --- | --- |
| the same | positive | \((-3)(-4) = 12\) and \(3 \times 4 = 12\) |
| different | negative | \((-3)(4) = -12\) and \(3 \times (-4) = -12\) |
| division, same signs | positive | \((-12) \div (-3) = 4\) |
| division, different signs | negative | \(12 \div (-3) = -4\) |

**Many factors:** count the negative ones. An even count gives a positive answer, an odd count a negative one.
**Why:** multiplying by \(-1\) flips the number line around zero, and two flips cancel. Any other rule would break the distributive law, which all of algebra depends on (section 4 proves it).
**Zero:** \(0 \div 5 = 0\), but \(5 \div 0\) has no answer.
`,
  },

  sections: [
    { id: 'why', full: true, title: 'Why should minus times minus be plus?', toc: 'The question', md: R`
In 1797 a fourteen-year-old in Grenoble named Henri Beyle, who later wrote novels as Stendhal, fell for mathematics for a reason he gave decades later: he thought it was the one subject where nobody could fake it. Then he met the rule that a minus times a minus makes a plus, and nobody could tell him why.

His teacher repeated the lesson and fell back on custom: everyone uses the rule, Euler and Lagrange included. A star pupil laughed at him. In the end Stendhal settled for this: the rule must be right, because every calculation that uses it comes out right. He remembered it as “ma difficulté de moins par moins”, his minus-times-minus problem.

That is a sensible thing to believe and a weak reason for believing it. This lesson gives you three strong ones: a picture, a pattern and a proof. It also shows why some of the best mathematicians in Europe refused negative numbers for three hundred years, and how, in 1867, Hermann Hankel gave the answer mathematicians still use.

<div class="full-only">

**By the end you will be able to:**

1. Multiply and divide any integers quickly and correctly, including long chains of factors.
2. Explain the sign rules in three independent ways: as a flip of the number line, as a pattern that has to continue, and as debts being removed.
3. Prove from the laws of arithmetic that \((-a)(-b) = ab\), and show that any other rule breaks the distributive law.
4. Divide as the undoing of multiplication, and explain why dividing by zero has no answer.
5. Use signed products in finance, physics, weather, economics and code.
6. Read the notation without traps, including why \(-3^2\) is not \((-3)^2\).

</div>
` },

    { id: 'see', num: 1, title: 'See it', md: R`
Multiplying by a positive number stretches or shrinks: \(\times 3\) moves every number three times as far from zero. The real question is what multiplying by a *negative* number does. Six pictures answer it from six directions. Try each one before reading on.

### The flip

Start with the simplest negative number, \(-1\). Multiplying by \(-1\) swaps every number with its opposite: 3 becomes \(-3\), \(-2\) becomes 2, and 0 stays where it is. On the number line, that is a half-turn of the whole line around zero.

{{fig:flip|Multiplying by \(-1\) turns the whole number line half a turn around zero. A second half-turn undoes the first, so \((-1) \times (-1) = 1\). Press the button and follow the blue dot.}}

Press it twice and every number is back where it started. Doing nothing to a number is multiplying it by 1, so two flips together are \(\times 1\): \((-1) \times (-1) = 1\). Section 4 proves that \(\times(-1)\) really is this flip, \((-1) \times a = -a\) for every \(a\). For now, treat the picture as a guess worth testing.

<p class="try"><b>Try it:</b> use the flip to find \((-1) \times (-4)\). <span class="reveal" tabindex="0">Answer: 4. The flip sends \(-4\) to 4.</span></p>

<div class="full-only">

### Stretch, then flip

Every negative number is a positive number times \(-1\): \(-3 = 3 \times (-1)\). So multiplying by \(-3\) is two moves, a stretch by 3 and then a flip. The order of the moves does not matter.

{{fig:stretch|Multiplying by a negative number means stretching by its size, then flipping. Choose both numbers and step through the two moves.}}

<p class="try"><b>Try it:</b> \((-2) \times (-5)\) as moves. <span class="reveal" tabindex="0">Stretch \(-5\) by 2 to \(-10\), then flip to 10.</span></p>

### The pattern that must continue

Here is a way to see the rule with no flips at all, just a pattern you already trust. Multiply \(-2\) by 3, 2, 1, 0 and watch the products: \(-6, -4, -2, 0\). Each time the first number drops by 1, the product goes *up* by 2.

{{fig:pattern|The products \(n \times (-2)\) lie on one straight line. Keeping the pattern going past zero forces \((-1) \times (-2) = 2\), \((-2) \times (-2) = 4\), and so on. Drag \(n\) down and predict each value before it appears.}}

If the pattern continues past zero, \((-1) \times (-2) = 2\). Any other answer would bend a perfectly straight line. A pattern is a good reason to guess, not a proof: patterns can break. Section 4 shows this one cannot.

### The missing corner

Long before negative numbers were accepted, people multiplied *subtractions*, like \((10 - 2)(10 - 3)\), using areas. Take a 10 by 10 square. Cutting off a strip 3 wide removes 30. Cutting off a strip 2 tall removes 20. But the 2 by 3 corner lies in *both* strips, so it has been removed twice. Putting it back once gives the right answer, \(56 = 8 \times 7\).

{{fig:area|\((10 - 2)(10 - 3) = 100 - 30 - 20 + 6\). The corner is counted out twice, so it comes back once: the \(+6\) is \((-2) \times (-3)\). Drag the strip widths and the four areas update.}}

### The film in reverse

A car drives left at 3 metres per second, so its velocity is \(-3\) m/s. Where was it 2 seconds ago? “Ago” is negative time, \(t = -2\) s. The distance moved is velocity times time: \((-3)(-2) = +6\) metres. Two seconds ago the car was 6 m to the *right* of where it is now, exactly what you see if you run the film backward.

{{fig:film|Reverse the direction and reverse time: the two reversals cancel. Play the clip forward, then backward, and read the position.}}

</div>

<div class="full-only deeper">

### Going deeper: the rule on a clock

The rule holds even where there are no negative numbers at all. On a 12-hour clock, going back 1 hour lands on the same place as going forward 11, so 11 behaves like \(-1\). Now multiply: \(11 \times 11 = 121 = 10 \times 12 + 1\), which on the clock is 1. So \((-1) \times (-1) = 1\) holds there too, and on every clock, because
\[(n - 1)^2 = n(n - 2) + 1.\]
The first part, \(n(n-2)\), is a whole number of full turns, so what remains on the clock face is 1.

{{fig:clock|On an \(n\)-hour clock, \(n - 1\) plays the part of \(-1\), and \((n - 1)^2\) always lands on 1. Change the number of hours and check.}}

This is the first glimpse of an idea from Tier 5: the sign rule is not about debts or directions. It is a consequence of the *laws* a number system obeys, and any system with those laws gets the same rule.

</div>
` },

    { id: 'language', full: true, num: 2, title: 'The language', md: R`
The minus sign does two different jobs, and most mistakes in this lesson come from mixing them up. Brackets are how written mathematics keeps the jobs apart.

| Written | Read aloud | Meaning | Where it came from |
| --- | --- | --- | --- |
| \(-3\) | “negative three” | The number three steps left of zero | Johannes Widmann's 1489 arithmetic used − to mark a *shortfall* in merchants' goods; using it for a negative number came later |
| \(7 - 3\) | “seven minus three” | Subtraction | The same sign, a different job |
| \(-(-3)\) | “the opposite of negative three” | The opposite of \(-3\), which is 3 | — |
| \(3 \times 4\) | “three times four” | Multiplication | First printed in a 1618 appendix probably by William Oughtred; then his *Clavis Mathematicae*, 1631 |
| \(3 \cdot 4\) | “three times four” | Multiplication; used in algebra so it is not confused with the letter \(x\) | Gottfried Leibniz argued for it in a 1698 letter |
| \((-3)(-2)\) | “negative three times negative two” | Brackets side by side mean multiply; they keep each sign attached to its number | — |
| \(12 \div 4\), \(12/4\), \(\frac{12}{4}\) | “twelve divided by four” | Division | ÷ was first used for division by Johann Rahn in 1659 |
| \(-3^2\) | “the opposite of three squared” | \(-(3 \times 3) = -9\) | Powers come before the minus sign |
| \((-3)^2\) | “negative three, all squared” | \((-3) \times (-3) = 9\) | — |
| \(\lvert -3 \rvert\) | “the absolute value of negative three” | Its distance from zero: 3 | Lesson 2.1.4 |

**Words you will meet.** A *factor* is a number being multiplied; the answer is the *product*. In \(12 \div 3 = 4\), 12 is the *dividend*, 3 the *divisor* and 4 the *quotient*. The *opposite* of a number (also called its *additive inverse*) is the number that adds to it to make zero. A *law* (or *axiom*) is a rule we agree to keep; a *theorem* is a statement we prove from the laws; *undefined* means no answer exists.

<div class="full-only">

**Saying it clearly.** “Negative” for the number and “minus” for subtraction is the clearest habit, but both are common speech, and many scientific calculators have separate keys for the two jobs: the (−) key for negative and the − key for subtract. Read \(-5 - (-2)\) as “negative five minus negative two”.

</div>
` },

    { id: 'do', full: true, num: 3, title: 'Do it', md: R`
Fifteen short steps. Each one asks you to predict before anything is revealed. A wrong answer gets a hint aimed at that exact mistake and a second try; the answer is shown after two tries. Your progress is saved on this device.

{{steps}}
` },

    { id: 'prove', num: 4, title: 'Prove it', md: R`
The sign rules are not extra facts to memorize. They follow in a few lines from the ordinary laws of arithmetic, once we decide that those laws should still hold for negative numbers.

**The laws we keep.** For all integers \(a\), \(b\) and \(c\):

| Law | Addition | Multiplication |
| --- | --- | --- |
| Order does not matter (commutative) | \(a + b = b + a\) | \(ab = ba\) |
| Grouping does not matter (associative) | \((a + b) + c = a + (b + c)\) | \((ab)c = a(bc)\) |
| Doing nothing (identity) | \(a + 0 = a\) | \(a \times 1 = a\) |
| Opposites | \(a + (-a) = 0\) | — |
| Distributive law | — | \(a(b + c) = ab + ac\) |

**Definitions.** The *opposite* \(-a\) is the number that adds to \(a\) to give 0. For \(b \neq 0\), \(a \div b = q\) means \(b \times q = a\), when such an integer \(q\) exists.

<div class="full-only">

<div class="thm">

**Step 0 (opposites are unique).** If \(a + x = 0\), then \(x = -a\).

*Proof.* Add \(-a\) and regroup: \[x = x + \bigl(a + (-a)\bigr) = (x + a) + (-a) = 0 + (-a) = -a. \qquad \blacksquare\]

</div>

<div class="thm">

**Theorem 0.** \(-(-a) = a\).

*Proof.* \((-a) + a = 0\), so \(a\) is the number that adds to \(-a\) to make zero. By Step 0, that number is \(-(-a)\). \(\blacksquare\)

</div>

<div class="thm">

**Theorem 1 (anything times zero is zero).** \(a \times 0 = 0\).

*Proof.* Split 0 as \(0 + 0\) and use the distributive law: \[a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0.\] Adding the opposite of \(a \cdot 0\) to both sides leaves \(0 = a \cdot 0\). \(\blacksquare\)

</div>

</div>

<div class="thm">

**Theorem 2 (one negative factor).** \((-a)\,b = -(ab)\).

*Proof.* \[ab + (-a)b = \bigl(a + (-a)\bigr)b = 0 \cdot b = 0.\] So \((-a)b\) is the number that adds to \(ab\) to make zero. By Step 0 it is \(-(ab)\). \(\blacksquare\)

In particular \((-1) \times a = -a\): multiplying by \(-1\) really is the flip of Figure 1.

</div>

<div class="thm">

**Theorem 3 (two negative factors).** \((-a)(-b) = ab\).

*Proof.* Use Theorem 2 twice, then Theorem 0: \[(-a)(-b) = -\bigl(a(-b)\bigr) = -\bigl(-(ab)\bigr) = ab. \qquad \blacksquare\]

</div>

<div class="full-only">

<div class="thm">

**Theorem 4 (division follows multiplication).** If \(b \times q = a\), then \[\frac{-a}{-b} = \frac{a}{b} = q, \qquad \frac{-a}{b} = \frac{a}{-b} = -q.\]

*Proof.* By Theorems 2 and 3, \((-b)q = -a\), \(b(-q) = -a\) and \((-b)(-q) = a\). Read each as a division. \(\blacksquare\)

</div>

<div class="thm">

**Theorem 5 (counting signs).** A product of nonzero integers is negative exactly when an odd number of its factors are negative.

*Proof by induction.* One factor: true. Now suppose it holds for some product \(P\), and multiply by one more factor \(c\). If \(c > 0\), neither the sign of the product nor the count of negatives changes. If \(c < 0\), the sign flips (Theorems 2 and 3) and the count goes up by one, so its parity flips too. Either way the statement still holds. \(\blacksquare\)

</div>

</div>

### Why no other rule can work

Suppose someone insisted that \((-1)(-1) = -1\). Then Theorem 1 and the distributive law would give
\[0 = (-1) \cdot 0 = (-1)\bigl(1 + (-1)\bigr) = (-1)(1) + (-1)(-1) = -1 + (-1) = -2,\]
which is false. The only value that avoids a contradiction is \((-1)(-1) = 1\).

<div class="full-only">

**What did we actually assume?** Look at what the proofs never used: pictures, debts or films. They used only the laws, plus one decision: that the laws keep holding once negative numbers join the system. That decision is the real choice. Hermann Hankel made exactly this point in 1867: the sign rule cannot be proved from positive numbers alone, but it is the only rule that keeps the laws of arithmetic working. Mathematicians keep the laws because almost everything depends on them. Expanding brackets, factoring, collecting like terms and solving equations all use the distributive law.

</div>

<div class="full-only deeper">

**One proof, many number systems.** Nothing in the proofs was special to whole numbers. They hold word for word for fractions, decimals and all real numbers, so \((-0.5)(-0.5) = 0.25\) and \(\left(-\tfrac{2}{3}\right)\left(-\tfrac{3}{4}\right) = \tfrac{1}{2}\). Step 0 and Theorems 0–3 also hold for the clock numbers of Figure 6, and in every *ring*, the abstract systems you meet in Tier 5: any system with these laws gets the sign rule for free. Theorems 4 and 5 need more: quotients that are unique, and a meaning for “positive”. Clock numbers have neither: on a 12-hour clock, \(2 \times 2\) and \(2 \times 8\) both land on 4.

</div>

<div class="full-only">

### Edge cases

- **Zero.** \(0 \div 5 = 0\), because \(5 \times 0 = 0\). But \(5 \div 0\) has no answer: no \(q\) gives \(0 \times q = 5\). And \(0 \div 0\) has no *single* answer, because every \(q\) gives \(0 \times q = 0\). Brahmagupta wrote that zero divided by zero is zero; that was his one recorded slip in these rules.
- **Negative zero.** In the integers, \(-0 = 0\), because \(0 + 0 = 0\). Computers’ floating-point arithmetic does keep a “negative zero”: Python's \(0 / (-13)\) prints <code>-0.0</code>, which still counts as equal to 0.
- **Division that does not come out even.** Programming languages disagree. Python rounds down, so <code>-7 // 2</code> gives \(-4\) with remainder 1. C (since its 1999 standard) rounds toward zero, so <code>-7 / 2</code> gives \(-3\) with remainder \(-1\). Both keep dividend = divisor × quotient + remainder. We ran both to confirm.
- **Fixed-size numbers.** Computers often store integers in a fixed number of bits. An 8-bit signed integer holds \(-128\) to 127, so \((-128) \times (-1) = 128\) does not fit. NumPy wraps it around to \(-128\), with an overflow warning; some languages stop with an error instead. Checked with NumPy.

</div>

### Common mistakes

| Mistake | Example | The fix |
| --- | --- | --- |
| Two negatives make a bigger negative | \((-3)(-4) = -12\) | Two flips cancel: the answer is 12 |
| Using the multiplication rule for addition | \(-3 + (-4) = 7\) | Adding two debts makes a bigger debt: \(-7\) |
| Squaring before the minus sign | \(-3^2 = 9\) | \(-3^2\) means \(-(3^2) = -9\); only \((-3)^2 = 9\) |
| Dividing by zero gives zero | \(5 \div 0 = 0\) | No number times 0 makes 5, so there is no answer |
| Losing count of the signs | \((-2)(-3)(-5) = 30\) | Three negatives is an odd count, so \(-30\) |
| Guessing a sign rule for division | \(12 \div (-3) = 4\) | Check by multiplying back: \((-3)(4) = -12\), so it must be \(-4\) |
` },

    { id: 'story', num: 5, title: 'The story', full: true, md: R`
People used these rules for well over a thousand years before anyone could say why they must hold. The story has three acts: practical use in China and India, a long refusal in Europe, and a resolution in 1867 that is the proof you have just read.

### Act 1: Counting boards and fortunes

The oldest surviving rules for negative numbers come from China. *The Nine Chapters on the Mathematical Art*, a handbook compiled over generations and in its final form by about the first century CE, solves systems of equations by laying numbers out as rods on a counting board. Its method is essentially the elimination taught in algebra today, and elimination produces negative numbers all the time, so chapter 8 gives rules for adding and subtracting them.

{{img:c:math-l213-nine-chapters|A page from Li Huang’s 1820 illustrated edition of *The Nine Chapters on the Mathematical Art*.}}

In his commentary of 263 CE, Liu Hui explained what the two kinds of rod mean: they stand for opposite quantities, gains and losses, which is why the book’s rule calls them positive (zheng) and negative (fu).

<blockquote class="primary" lang="zh"><p class="zh">正算赤，負算黑。</p><p>“The positive rods are red, and the negative rods are black.” Liu Hui, commentary on <i>The Nine Chapters</i>, 263 CE. Translation from Tao Steven Zheng’s article on Chinese counting rods.</p></blockquote>

Red for positive is the reverse of the Western bookkeeping habit of writing losses “in the red”, a contrast David Mumford points out.

In India, Brahmagupta's *Brāhmasphuṭasiddhānta* of 628 CE gave the first complete set of rules in words, treating positive numbers as *fortunes* and negative numbers as *debts*. In the translation quoted by the MacTutor archive, one rule reads: “The product or quotient of two debts is one fortune.” He also tried to say what happens with zero, and got one case wrong, writing that zero divided by zero is zero. In China, by about 1300, Zhu Shijie stated the full rules, multiplication included.

Neither tradition seems to have worried much about *why*. The rules worked on the counting board and in the account book, and that was enough.

### Act 2: The long refusal

Greek mathematics went another way. Euclid’s *Elements* distinguished two kinds of quantity: magnitudes, such as lengths, areas and volumes, and numbers, which were collections of units. Neither can be less than nothing. Diophantus of Alexandria, who solved equations with symbols around the third century CE, called an equation whose answer would be negative, \(4 = 4x + 20\), absurd. In Baghdad, al-Khwārizmī knew Brahmagupta’s work, but his geometric methods led him to treat negative results of equations as meaningless, even though he used debts in his book on inheritance. Later scholars went further: Abu'l-Wafā' worked with debts in the 900s, and al-Samaw'al stated the rules for multiplying signed numbers in the 1100s.

In Europe, the signs + and − first appeared in print in 1489, in Johannes Widmann's arithmetic for merchants, where they marked surplus and shortfall in goods.

{{img:c:math-l213-widmann|A page of Johannes Widmann’s arithmetic for merchants (first printed 1489), with + and − in use. Here they mark how far each load of goods is over or under a round weight in hundredweights (zentner).}}

Gerolamo Cardano's *Ars Magna* (1545) admitted negative solutions but called them fictitious. René Descartes called negative roots false. John Wallis gave a clear account using a number line in 1685, though about thirty years earlier, in his *Arithmetica Infinitorum*, he had argued that negative numbers were larger than infinity. Leonhard Euler's *Complete Guide to Algebra* (1770) explained \((-a) \times 3\) as a debt taken three times, and argued that \((-a)(-b)\) must be the opposite of \((-a)b\). His argument quietly assumes what it needs to prove: that changing one factor's sign must change the product's sign. That is Theorem 2, which needs the distributive law.

In England, Francis Maseres (1758) and William Frend (1796) wrote algebra books that rejected negative numbers outright. As late as 1831, Augustus De Morgan wrote that \(0 - a\) was as inconceivable as the square root of \(-a\).

David Mumford, a mathematician who has written a cross-cultural study of this history, argues the delay was an accident rather than a necessary stage. Two things held Europe back: the authority of Euclid in deciding what counted as mathematics, and the way negative numbers got tangled up with the even stranger square roots of negatives.

### Act 3: Laws first

The way out was to stop asking what a negative number *is* and start asking what rules it *obeys*. George Peacock (1830) proposed that algebra starts from its laws, which carry over to new kinds of number. Hermann Hankel (1867) turned this into his principle of the permanence of formal laws, and drew the conclusion you proved in section 4: the sign rule cannot be proved from positive numbers alone, but it is the only rule that keeps the laws of arithmetic, above all the distributive law, intact. Seventy years after Stendhal asked his question, mathematics had a real answer to it.

### Timeline

| When | Who and where | What they did | What they got wrong or refused |
| --- | --- | --- | --- |
| c. 100 BCE – 100 CE | *The Nine Chapters*, China, chapter 8 | Rules for adding and subtracting signed numbers while solving equations | No multiplication rule in the standard English edition (Mumford) |
| 263 CE | Liu Hui, commentary on *The Nine Chapters* | Explained positive and negative rods as gains and losses; red rods for positive, black for negative | — |
| 3rd century CE | Diophantus, Alexandria | Solved equations with symbols | Called an equation with a negative answer absurd |
| 628 | Brahmagupta, India | Full rules for fortunes and debts | Said 0 ÷ 0 = 0 |
| 9th – 12th century | Baghdad and beyond | Abu'l-Wafā' (940–998) used debts; al-Samaw'al (1130–1180) stated the multiplication rules | Al-Khwārizmī treated negative results as meaningless |
| c. 1300 | Zhu Shijie, China | Stated the full rules, multiplication included | — |
| 1489 | Johannes Widmann, Leipzig | First printed + and −, for surplus and shortfall | − did not yet mean “negative number” |
| 1545 | Gerolamo Cardano | Included negative solutions | Called them fictitious |
| 1637 | René Descartes | Showed how to turn negative roots into positive ones | Called negative roots false |
| 1685 | John Wallis | First clear Western account, with a number line | Had argued in the 1650s that negatives were larger than infinity |
| 1758, 1796 | Francis Maseres, William Frend | Wrote algebra books | Rejected negative numbers altogether |
| 1770 | Leonhard Euler | Debt argument for \((-a) \times 3\); argued \((-a)(-b) = ab\) | Assumed the step that needed proof |
| 1797 | Stendhal, aged 14 | Asked why minus times minus is plus | Was told, in effect, that everyone accepts it |
| 1830 | George Peacock | Algebra starts from its laws | — |
| 1831 | Augustus De Morgan | Compared \(0 - a\) to the square root of \(-a\) | Still doubted negatives as quantities |
| 1867 | Hermann Hankel | The sign rule is the only one that keeps the laws | — |

No portrait of Brahmagupta or Liu Hui survives from their lifetimes, so this lesson shows their texts, not imagined faces.
` },

    { id: 'uses', full: true, num: 6, title: 'Uses', md: R`
Six real cases from five fields, each with published figures. In every one, the sign of a product carries real meaning: profit or loss, push or pull, warmer or colder, more or less.

<div class="case"><p class="case-tag">Finance</p>

**A short futures position.** One E-mini S&P 500 futures contract is worth $50 times the index, and its smallest price step is 0.25 points, or $12.50 (CME Rulebook, chapter 358). A trader who is short 2 contracts holds a position of \(-2\). Profit is position × price change × $50:
\[(-2)(-13.25)(\$50) = +\$1{,}325 \quad\text{if the index falls 13.25 points,}\]
\[(-2)(+4.5)(\$50) = -\$450 \quad\text{if it rises 4.5 points.}\]
*What if the trader were long 2 instead?* <span class="reveal" tabindex="0">\((+2)(-13.25)(\$50) = -\$1{,}325\): the same move is now a loss.</span>

</div>

<div class="case"><p class="case-tag">Finance</p>

**A negative-rate mortgage.** On 5 August 2019, Denmark's Jyske Bank announced 10-year mortgages at \(-0.5\%\) a year. A borrower owing 1,000,000 kroner has a balance of \(-1{,}000{,}000\). One year's interest added to that balance is
\[(-0.005)(-1{,}000{,}000) = +5{,}000 \text{ kroner},\]
so the debt *shrinks*. This is simplified: one year, no fees, and Jyske's own economist warned that fees could still leave borrowers paying overall.
*What if the rate were +3%?* <span class="reveal" tabindex="0">\((0.03)(-1{,}000{,}000) = -30{,}000\): the debt grows by 30,000 kroner.</span>

</div>

<div class="case"><p class="case-tag">Physics</p>

**Why like charges repel.** Coulomb's law multiplies the two charges:
\[F = k\,\frac{q_1 q_2}{r^2}, \qquad k \approx 8.99 \times 10^{9}\ \text{N·m}^2/\text{C}^2.\]
A positive result means the charges push apart; a negative result means they pull together (OpenStax *Physics*). An electron's charge is exactly \(-1.602176634 \times 10^{-19}\) C (NIST). For two electrons 1 nanometre apart, \((-e)(-e)\) is positive, so they repel, with a force of about \(2.31 \times 10^{-10}\) N. For an electron and a proton, \((-e)(+e)\) is negative, so they attract. The sign rule is why “like charges repel” and “unlike charges attract” come out of one formula.

</div>

<div class="case"><p class="case-tag">Atmospheric science</p>

**Temperature on the way down.** The International Standard Atmosphere, a reference model published by ICAO, sets 15 °C at sea level, falling 6.5 °C per kilometre up to 11 km (ICAO Doc 7488). A plane descending from 11 km to sea level changes altitude by \(-11\) km, so
\[\Delta T = (-6.5\ ^\circ\text{C/km})(-11\ \text{km}) = +71.5\ ^\circ\text{C},\]
from \(-56.5\) °C to 15 °C.
*What is the standard temperature at 3 km?* <span class="reveal" tabindex="0">\(15 + (-6.5)(3) = -4.5\) °C.</span>

</div>

<div class="case"><p class="case-tag">Economics and health</p>

**Cheaper cigarettes, more smoking.** Economists measure how demand responds to price with the *price elasticity*: percent change in quantity ≈ elasticity × percent change in price. A 2000 U.S. National Cancer Institute monograph summarized the research as roughly a 4% drop in cigarette consumption for a 10% price rise in the short run, an elasticity of about \(-0.4\):
\[(-0.4)(+10\%) = -4\% \quad\text{(a tax rise)}, \qquad (-0.4)(-10\%) = +4\% \quad\text{(a price cut).}\]
Two negatives make a positive: cheaper cigarettes mean more smoking. The same monograph puts the long-run effect at about double, and NCI’s later Monograph 21, written with the World Health Organization, gives 2.5–5% for most countries. This is the arithmetic behind using tobacco taxes to cut smoking.

</div>

<div class="case"><p class="case-tag">Computing</p>

**Two languages, two answers.** Dividing negative integers that do not divide evenly gives different results in different languages. Python rounds down: <code>-7 // 2</code> is \(-4\), remainder 1. C (since its 1999 standard) rounds toward zero: <code>-7 / 2</code> is \(-3\), remainder \(-1\). Code moved from one language to the other can silently change its results for negative inputs. We ran both to confirm these values. Both follow the same law, dividend = divisor × quotient + remainder; they just choose the quotient differently.

</div>
` },

    { id: 'practice', num: 7, title: 'Practice', md: R`
Thirty problems in three levels, each with a worked solution, then unlimited fresh drills. Every numeric answer was checked by computer. Work each problem before opening its solution.

<div class="full-only">

### Level 1: fluency

<ol class="probs">
<li>\((-4)(6)\)<details><summary>Solution</summary>Different signs, so negative. \(4 \times 6 = 24\), so \(-24\).</details></li>
<li>\((-7)(-3)\)<details><summary>Solution</summary>Same signs, so positive: 21.</details></li>
<li>\(9 \times (-8)\)<details><summary>Solution</summary>Different signs: \(-72\).</details></li>
<li>\((-12)(-12)\)<details><summary>Solution</summary>Same signs: 144.</details></li>
<li>\(-45 \div 9\)<details><summary>Solution</summary>\(-5\). Check: \(9 \times (-5) = -45\).</details></li>
<li>\((-56) \div (-7)\)<details><summary>Solution</summary>8. Check: \((-7) \times 8 = -56\).</details></li>
<li>\(63 \div (-9)\)<details><summary>Solution</summary>\(-7\). Check: \((-9)(-7) = 63\).</details></li>
<li>\(0 \div (-13)\)<details><summary>Solution</summary>0. Check: \((-13) \times 0 = 0\).</details></li>
<li>\((-2)(-3)(-5)\)<details><summary>Solution</summary>Three negative factors, an odd count, so negative. \(2 \times 3 \times 5 = 30\), so \(-30\).</details></li>
<li>\((-1)(-1)(-1)(-1)(-1)(-1)\)<details><summary>Solution</summary>Six negative factors, an even count: 1.</details></li>
<li>\((-3)^2\) and \(-3^2\)<details><summary>Solution</summary>\((-3)^2 = (-3)(-3) = 9\). But \(-3^2 = -(3^2) = -9\), because the power applies before the minus sign.</details></li>
<li>\((-6)(-5) \div (-10)\)<details><summary>Solution</summary>\((-6)(-5) = 30\), then \(30 \div (-10) = -3\).</details></li>
</ol>

### Level 2: applying it

<ol class="probs" start="13">
<li>The temperature falls 3 °C every hour. How did it compare 4 hours ago?<details><summary>Solution</summary>Rate \(-3\) °C per hour, time \(-4\) hours: \((-3)(-4) = +12\). It was 12 °C warmer.</details></li>
<li>A trader is short 3 E-mini contracts and the index rises 4.5 points. Profit or loss?<details><summary>Solution</summary>\((-3)(4.5)(\$50) = -\$675\), a loss of $675.</details></li>
<li>Short 2 contracts; the index falls 13.25 points.<details><summary>Solution</summary>\((-2)(-13.25)(\$50) = +\$1{,}325\).</details></li>
<li>A diver descends at 2 m/s. What is the change in depth over the next 15 s, and where was the diver 10 s ago?<details><summary>Solution</summary>Velocity \(-2\) m/s. Next 15 s: \((-2)(15) = -30\) m, so 30 m deeper. Ten seconds ago: \((-2)(-10) = +20\), so 20 m higher than now.</details></li>
<li>An account loses $1,200 a month. How did its balance 6 months ago compare with today's?<details><summary>Solution</summary>\((-1{,}200)(-6) = +7{,}200\): it was $7,200 higher.</details></li>
<li>Find the mean of the temperatures \(-4\), \(-7\), 2 and \(-3\) °C.<details><summary>Solution</summary>Sum: \(-4 - 7 + 2 - 3 = -12\). Divide by 4: \(-3\) °C.</details></li>
<li>What number times \(-8\) gives 96?<details><summary>Solution</summary>\(96 \div (-8) = -12\). Check: \((-12)(-8) = 96\).</details></li>
<li>Two electrons; an electron and a proton. Does each pair attract or repel?<details><summary>Solution</summary>Two electrons: \((-e)(-e) > 0\), so they repel. Electron and proton: \((-e)(+e) < 0\), so they attract.</details></li>
<li>In the standard atmosphere, what is the temperature at 3 km? What is the change when descending from 8 km to 2 km?<details><summary>Solution</summary>At 3 km: \(15 + (-6.5)(3) = -4.5\) °C. Descending 8 km to 2 km changes altitude by \(-6\) km, so \(\Delta T = (-6.5)(-6) = +39\) °C.</details></li>
<li>Divide \(-17\) by 5 with a remainder, the Python way and the C way.<details><summary>Solution</summary>Python rounds down: quotient \(-4\), remainder \(-17 - 5(-4) = 3\). C rounds toward zero: quotient \(-3\), remainder \(-17 - 5(-3) = -2\). Both satisfy dividend = divisor × quotient + remainder.</details></li>
</ol>

### Level 3: challenge and proof

<ol class="probs" start="23">
<li>Prove that \(a \times 0 = 0\) using only the laws in section 4.<details><summary>Solution</summary>\(a \cdot 0 = a(0 + 0) = a \cdot 0 + a \cdot 0\). Add the opposite of \(a \cdot 0\) to both sides: \(0 = a \cdot 0\).</details></li>
<li>Prove that \((-a)b = -(ab)\).<details><summary>Solution</summary>\(ab + (-a)b = (a + (-a))b = 0 \cdot b = 0\), so \((-a)b\) is the opposite of \(ab\) (opposites are unique).</details></li>
<li>Prove that \((-a)(-b) = ab\).<details><summary>Solution</summary>\((-a)(-b) = -(a(-b)) = -(-(ab)) = ab\), using the previous result twice and \(-(-x) = x\).</details></li>
<li>Show that if \((-1)(-1)\) were \(-1\), the distributive law would fail. Find a specific contradiction.<details><summary>Solution</summary>\((-1)(1 + (-1)) = (-1) \cdot 0 = 0\). Distributing instead gives \((-1)(1) + (-1)(-1) = -1 + (-1) = -2\). So \(0 = -2\), a contradiction.</details></li>
<li>Prove by induction that a product of nonzero integers is negative exactly when an odd number of its factors are negative.<details><summary>Solution</summary>True for one factor. If it holds for a product \(P\) and we multiply by \(c\): when \(c > 0\), neither the sign nor the count of negatives changes; when \(c < 0\), the sign flips and the count rises by one, so its parity flips. The statement survives each step, so it holds for any number of factors.</details></li>
<li>Why is \(0 \div 0\) undefined while \(0 \div 5 = 0\)? What did Brahmagupta claim, and where does the claim break?<details><summary>Solution</summary>\(0 \div 5\) asks for \(q\) with \(5q = 0\): only \(q = 0\) works. \(0 \div 0\) asks for \(q\) with \(0 \cdot q = 0\): every \(q\) works, so there is no single answer. Brahmagupta said \(0 \div 0 = 0\); 0 is one possible \(q\) among infinitely many, so calling it *the* answer is unjustified.</details></li>
<li>In 8-bit signed integers (\(-128\) to 127), what is \((-128) \times (-1)\)? Why does this pair fail when \((-127) \times (-1)\) works?<details><summary>Solution</summary>The true answer is 128, one more than the largest value that fits, so it wraps around (by 256) to \(-128\). \((-127)(-1) = 127\) fits exactly. The range is lopsided, \(-128\) to \(+127\), so the most negative number has no positive partner.</details></li>
<li>Euler argued that \((-a)(-b)\) must be the opposite of \((-a)b\). What assumption does that rest on? Repair it with the distributive law.<details><summary>Solution</summary>He assumed that changing the sign of one factor changes the sign of the product. The distributive law proves it: \((-a)(-b) + (-a)b = (-a)\bigl((-b) + b\bigr) = (-a) \cdot 0 = 0\). So \((-a)(-b)\) is the opposite of \((-a)b = -ab\), which is \(ab\).</details></li>
</ol>

</div>

### Drills

Fresh problems every time, at three levels. A wrong answer shows exactly where the sign went wrong.

{{drills}}
` },

    { id: 'check', num: 8, title: 'Check', md: R`
Seven questions. Each wrong option comes from one specific misconception, so a wrong pick tells you exactly what to review. Score 6 or more to mark the lesson complete.

{{quiz}}

<div class="full-only">

### Explain it back

Write a sentence or two for each prompt, then compare with the model answers. Explaining is the best test of understanding.

{{explain}}

</div>
` },

    { id: 'connect', full: true, num: 9, title: 'Connections', md: R`
This lesson sits on the *Number → structure* thread of the map. The flip returns in complex numbers, and the five short proofs return, unchanged, in abstract algebra.

| Direction | Lesson | The link |
| --- | --- | --- |
| Builds on | 1.3.1 Groups, arrays and area | Multiplication as groups and as area (Figure 4) |
| Builds on | 1.3.3 The distributive law | The law every proof here rests on |
| Builds on | 2.1.1 and 2.1.2 | Opposites, the number line, subtracting a negative |
| Unlocks | 2.1.4 Absolute value | The size of a product is the product of the sizes |
| Unlocks | 2.2 Powers and roots | \((-1)\) to an even power is 1, to an odd power \(-1\) |
| Unlocks | 2.3 Simplifying | \(-(x - 3) = -x + 3\) is Theorem 2 at work |
| Unlocks | 2.4 Inequalities | Multiplying both sides by a negative flips the inequality, because it flips the number line |
| Later | Tier 3 Complex numbers | \(\times(-1)\) is a half-turn; \(\times i\) is a quarter-turn, so \(i \times i = -1\) |
| Later | Tier 4 Determinants | A negative determinant means a flip: the same idea in two and three dimensions |
| Later | Tier 5 Rings | Theorems 0–3 hold in every ring, with the same proofs |

**Watch and read next**

- Khan Academy, [Why a negative times a negative is a positive](https://www.youtube.com/watch?v=rK4sXm_MPWo) (5:47).
- Khan Academy, [Why a negative times a negative makes intuitive sense](https://www.youtube.com/watch?v=pzQY-9Nmtws) (6:13).
- David Mumford, [What's so Baffling About Negative Numbers? A Cross-Cultural Comparison](https://www.dam.brown.edu/people/mumford/beyond/papers/2010b--Negatives-PrfShts.pdf), the full history for readers who want it.
` },

    { id: 'faq', title: 'Questions people ask', full: true, md: R`
**Is the sign rule just a convention?** In one sense, yes, and that was Hankel's point: it is chosen, not discovered in nature. But it is not arbitrary. It is the only choice that keeps the laws of arithmetic, and choosing anything else breaks the distributive law and, with it, nearly all of algebra.

**Does it work for fractions and decimals?** Yes. The proofs used only the laws, and those hold for fractions, decimals and all real numbers: \((-0.5)(-0.5) = 0.25\).

**Why does \(-(-5) = 5\) feel different from \((-1)(-5) = 5\)?** They are the same fact seen two ways. Theorem 2 says \((-1)(-5) = -(1 \times (-5)) = -(-5)\), and Theorem 0 says that is 5.

**If two negatives make a positive when multiplying, why not when adding?** Because the operations do different things. Adding a negative moves you left on the number line, so adding two of them moves you further left. Multiplying by a negative flips the line, so two flips bring you back.

**Why can I divide zero by a number but not a number by zero?** Division asks: what times the divisor gives the dividend? For \(0 \div 5\), the answer is 0. For \(5 \div 0\), nothing times 0 gives 5. For \(0 \div 0\), everything does, so there is no single answer.
` },

    { id: 'glossary', title: 'Glossary', full: true, md: R`
| Term | Meaning |
| --- | --- |
| Integer | A whole number: positive, negative or zero |
| Opposite (additive inverse) | The number that adds to a given number to make 0; the opposite of 4 is \(-4\) |
| Factor | A number being multiplied |
| Product | The result of multiplying |
| Dividend, divisor, quotient | In \(12 \div 3 = 4\): 12, 3 and 4 |
| Absolute value | Distance from zero, written \(\lvert x \rvert\) |
| Law (axiom) | A rule we agree to keep, such as the distributive law |
| Distributive law | \(a(b + c) = ab + ac\) |
| Theorem | A statement proved from the laws |
| Induction | Proving a statement for one case, then showing each case carries it to the next |
| Undefined | Having no answer, such as \(5 \div 0\) |
| Ring | Any number system with these addition and multiplication laws (Tier 5) |
` },

    { id: 'sources', title: 'Sources and how this lesson was checked', toc: 'Sources', md: R`
Every factual claim comes from a source we opened. Every number in the practice set was checked by running the calculation. Before going live, a separate reviewer re-checks every claim, and fixes are logged publicly in the corrections log.

- David Mumford, [What's so Baffling About Negative Numbers? A Cross-Cultural Comparison](https://www.dam.brown.edu/people/mumford/beyond/papers/2010b--Negatives-PrfShts.pdf): framing of the story; Zhu Shijie; Brahmagupta's chapter 18; Cardano; Wallis.
- MacTutor History of Mathematics, [Brahmagupta](https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/): the rules for fortunes and debts; the zero-by-zero slip.
- Leo Rogers, NRICH, [The history of negative numbers](https://nrich.maths.org/5961): Diophantus; Abu'l-Wafā'; al-Samaw'al; al-Khwārizmī; Maseres and Frend.
- M. K. Smith, University of Texas, [History of negative numbers](https://web.ma.utexas.edu/users/mks/326K/Negnos.html): dating of *The Nine Chapters*; Descartes; Wallis; Euler; Peacock.
- Tao Steven Zheng, [article on Chinese numerals and counting rods](https://math-physics-problems.fandom.com/wiki/File:Ivory_counting_rods.jpg), on the open Math & Physics Problems wiki (Fandom): Liu Hui’s line, with translation. Mumford (above) independently confirms Liu Hui’s colour rule.
- Ian Bruce, [translation of Euler's *Algebra*, chapters 1–8](https://www.17centurymaths.com/contents/euler/algebra/algebrabkIsect1ch1-8.pdf): Euler's paragraphs 32–33.
- Stendhal, *Vie de Henry Brulard* (written 1835–36), via [a French classroom extract](https://clg-paul-kapel.eta.ac-guyane.fr/IMG/pdf/mathematiques_et_litterature-_val.pdf).
- Jeff Miller, MacTutor, [Earliest uses of symbols of operation](https://mathshistory.st-andrews.ac.uk/Miller/mathsym/operation/): +, −, ×, · and ÷.
- MacTutor, [De Morgan quotations](https://mathshistory.st-andrews.ac.uk/Biographies/De%5FMorgan/quotations/): the 1831 remark.
- Vincent Tariel-Adam, [Two teams that cancel](https://arxiv.org/pdf/2611.02294) (arXiv preprint, 2026, not peer reviewed): Hankel’s 1867 position. MacTutor, [Hermann Hankel](https://mathshistory.st-andrews.ac.uk/Biographies/Hankel/): his 1867 *Theorie der complexen Zahlensysteme*, which opens with a revised statement of Peacock’s principle of permanence of formal laws.
- CME Group, [Rulebook chapter 358](https://www.cmegroup.com/rulebook/CME/IV/350/358/358.pdf): E-mini contract size and tick.
- CNBC, [Danish bank offers negative-rate mortgages](https://www.cnbc.com/2019/08/12/danish-bank-is-offering-10-year-mortgages-with-negative-interest-rates.html) (12 August 2019).
- OpenStax, [*Physics*, 18.2 Coulomb's law](https://openstax.org/books/physics/pages/18-2-coulombs-law); NIST, [elementary charge](https://physics.nist.gov/cuu/Constants/Value/e.html).
- Penn State, [METEO 300, 3.6](https://courses.ems.psu.edu/meteo300/node/594): the standard atmosphere per ICAO Doc 7488.
- U.S. National Cancer Institute, [Smoking and Tobacco Control Monograph 12, chapter 6](https://cancercontrol.cancer.gov/sites/default/files/2020-06/chapter_6.pdf): the 10% price, 4% consumption estimate (2000); [NCI and WHO, Monograph 21 summary](https://cancercontrol.cancer.gov/sites/default/files/2020-08/NCI-WHO-Economics-Monograph-Presentation.pdf): 2.5–5% in most countries.
- Pictures: Wikimedia Commons, credited under each picture.

Found a mistake? Use “Report a problem” at the bottom of the page.
` },
  ],

  data: {
    steps: [
      { type: 'line', range: [-10, 10], answer: -6, hop: -2, count: 3, prompt: R`Find \(3 \times (-2)\): three jumps of \(-2\), starting at 0. Tap where you land.`, hints: { '6': 'Jumps of −2 go left, not right.', other: 'Start at 0 and jump 2 to the left, three times.' }, explain: R`Three jumps of \(-2\): \(0 \to -2 \to -4 \to -6\). A positive times a negative is negative.` },
      { type: 'choice', prompt: R`Is \((-2) \times 3\) the same as \(3 \times (-2)\)?`, options: ['Yes: both are −6', 'No: (−2) × 3 is 6', 'It has no meaning: you cannot have −2 groups'], answer: 0, hints: { '1': 'Order never changes a product: 3 × 4 = 4 × 3, and that law still holds with negatives.', '2': '“−2 groups” is hard to picture, but order does not matter in multiplication, so we can swap the factors.' }, explain: R`Order does not matter, so \((-2) \times 3 = 3 \times (-2) = -6\).` },
      { type: 'table', prompt: R`Fill in \(n \times (-2)\) for \(n = 3, 2, 1, 0\).`, labels: ['3 × (−2)', '2 × (−2)', '1 × (−2)', '0 × (−2)'], answers: [-6, -4, -2, 0], explain: R`\(-6, -4, -2, 0\): each time \(n\) drops by 1, the product goes up by 2.` },
      { type: 'num', prompt: R`The products went \(-6, -4, -2, 0\), rising by 2 each time. Predict \((-1) \times (-2)\).`, answer: 2, hints: { '-2': 'That would make the pattern turn back down. Each step adds 2: 0 + 2 = ?', other: 'Keep adding 2 to the last product.' }, explain: R`\(0 + 2 = 2\), so \((-1)(-2) = 2\). The straight line continues.` },
      { type: 'choice', prompt: R`Multiplying by \(-1\) flips the line around zero. Where do 4 and \(-4\) land?`, options: ['4 → −4 and −4 → 4', '4 → −4 and −4 stays at −4', 'Both get smaller'], answer: 0, hints: { '1': 'A flip is a mirror through zero, so −4 moves too.', '2': '× (−1) makes 4 smaller but makes −4 bigger: it swaps each number with its opposite.' }, explain: R`\((-1)(4) = -4\) and \((-1)(-4) = 4\): every number swaps with its opposite.` },
      { type: 'num', prompt: R`Flip twice: \(3 \to -3 \to {?}\) So \((-1) \times (-1) \times 3 = 3\). What must \((-1) \times (-1)\) be?`, answer: 1, hints: { '-1': 'Two flips put 3 back at 3. What number times 3 gives 3?', other: 'What number times 3 leaves it at 3?' }, explain: R`Two flips change nothing, and "change nothing" is \(\times 1\): \((-1)(-1) = 1\).` },
      { type: 'num', prompt: R`Find \((-3) \times (-2)\): stretch \(-2\) by 3, then flip.`, answer: 6, hints: { '-6': 'You stretched to −6. Now the flip: the 3 was a −3.', other: 'Stretch −2 to −6 first, then flip it.' }, explain: R`Stretch: \(-6\). Flip: \(6\).` },
      { type: 'choice', prompt: R`You owe three charges of $20 (each is \(-\$20\)). The bank cancels two of them. Which expression gives the change in your balance?`, options: ['(−2) × (−$20) = +$40', '(+2) × (−$20) = −$40', '(−2) × (+$20) = −$40'], answer: 0, hints: { '1': 'That adds two more debts. Cancelling removes them: −2 copies.', '2': 'The charges are debts, so each is −$20.' }, explain: R`Removing two debts of \(-\$20\) is \((-2)(-\$20) = +\$40\): your balance goes from \(-\$60\) to \(-\$20\).` },
      { type: 'num', prompt: R`A car moves left at 3 m/s (velocity \(-3\)). Where was it 2 seconds ago, compared with now? Give metres, right is positive.`, answer: 6, hints: { '-6': 'That is where it will be in 2 seconds. Looking back is negative time: (−3)(−2).', other: 'Velocity × time, with time = −2.' }, explain: R`\((-3)(-2) = 6\): two seconds ago it was 6 m to the right.` },
      { type: 'num', prompt: R`\(12 \div (-3) = {?}\) Find the number that times \(-3\) gives 12.`, answer: -4, hints: { '4': 'Check: (−3) × 4 = −12, not 12. Try the other sign.', other: 'What times −3 is 12? Check by multiplying back.' }, explain: R`\((-3)(-4) = 12\), so \(12 \div (-3) = -4\).` },
      { type: 'choice', prompt: R`What is the sign of \((-1)(-1)(-1)(-1)(-1)\)?`, options: ['Positive', 'Negative'], answer: 1, hints: { '0': 'Pair them off: four pair up and cancel. What is left?' }, explain: R`Five negatives: two pairs cancel, one is left over, so the product is \(-1\).` },
      { type: 'choice', prompt: R`A product of 7 nonzero numbers has exactly 3 negative factors. What is its sign?`, options: ['Positive', 'Negative'], answer: 1, hints: { '0': 'Only the negative factors matter. Is 3 even or odd?' }, explain: R`Three is odd, so the product is negative. The 4 positive factors never change the sign.` },
      { type: 'choice', prompt: R`Which one equals 9?`, options: ['−3²', '(−3)²', 'Both'], answer: 1, hints: { '0': 'Powers come first: −3² means −(3²).', '2': 'Powers come first: −3² means −(3²) = −9.' }, explain: R`\((-3)^2 = 9\), but \(-3^2 = -(3^2) = -9\).` },
      { type: 'choice', prompt: R`Which one has an answer?`, options: ['0 ÷ (−5)', '(−5) ÷ 0', 'Both', 'Neither'], answer: 0, hints: { '1': 'You would need q with 0 × q = −5. Does one exist?', '2': '(−5) ÷ 0 needs q with 0 × q = −5.', '3': '0 ÷ (−5) needs q with (−5) × q = 0. Try q = 0.' }, explain: R`\(0 \div (-5) = 0\) because \((-5) \times 0 = 0\). But no \(q\) gives \(0 \times q = -5\), so \((-5) \div 0\) has no answer.` },
      { type: 'text', prompt: R`In one or two sentences: why must \((-1) \times (-1)\) equal 1?`, models: [R`Multiplying by \(-1\) flips the number line; flipping twice puts everything back, so \((-1)(-1)\) acts like \(\times 1\).`, R`The pattern \(n \times (-1)\) goes \(-3, -2, -1, 0\) as \(n\) goes 3, 2, 1, 0; continuing it gives \((-1)(-1) = 1\).`, R`If \((-1)(-1)\) were \(-1\), the distributive law would give \((-1)(1 + (-1)) = -2\), but the left side is \((-1) \times 0 = 0\).`] },
    ],
    quiz: [
      { q: R`\((-5)(-4) = {?}\)`, options: ['20', '−20', '−9', '9'], answer: 0, why: { '1': 'Two negatives make a bigger negative is the classic mistake: two flips cancel.', '2': 'That is −5 + (−4). Multiply, don’t add.', '3': 'That adds the sizes. Multiply them: 5 × 4.' }, explain: R`Same signs, so positive: 20.`, review: 'see' },
      { q: R`\(-5 + (-4) = {?}\)`, options: ['9', '−9', '20', '−20'], answer: 1, why: { '0': 'The multiplication rule does not apply to addition. Adding two debts makes a bigger debt.', '2': 'That multiplies. This question adds.', '3': 'That multiplies with the wrong sign. This question adds.' }, explain: R`Adding two negatives moves further left: \(-9\).`, review: 'faq' },
      { q: R`\(-4^2 = {?}\)`, options: ['16', '−16', '8', '−8'], answer: 1, why: { '0': 'Powers come before the minus: −4² = −(4²).', '2': 'Squaring is 4 × 4, not 4 × 2.', '3': 'Squaring is 4 × 4, and the minus applies afterwards.' }, explain: R`\(-4^2 = -(4^2) = -16\).`, review: 'language' },
      { q: R`What is the sign of \((-2)(-2)(-2)\)?`, options: ['Positive', 'Negative'], answer: 1, why: { '0': 'One pair cancels, but a third negative is left.' }, explain: R`Three negatives is an odd count: the product is \(-8\).`, review: 'prove' },
      { q: R`\(18 \div (-3) = {?}\)`, options: ['−6', '6', '15', '−54'], answer: 0, why: { '1': 'Check by multiplying back: (−3)(6) = −18, not 18.', '2': 'That is 18 + (−3): adding, not dividing.', '3': 'That is 18 × (−3): multiplying, not dividing.' }, explain: R`\((-3)(-6) = 18\), so the answer is \(-6\).`, review: 'prove' },
      { q: R`Which one has no answer?`, options: ['0 ÷ 7', '7 ÷ 0', '0 × 7'], answer: 1, why: { '0': '0 ÷ 7 = 0, because 7 × 0 = 0. Zero can be divided.', '2': '0 × 7 = 0. Multiplying by zero is fine.' }, explain: R`\(7 \div 0\) would need a number \(q\) with \(0 \times q = 7\). None exists.`, review: 'prove' },
      { q: R`A trader is short 1 E-mini contract ($50 a point) and the index falls 8 points. What is the result?`, options: ['+$400', '−$400', '+$8', '−$58'], answer: 0, why: { '1': 'A short position gains when prices fall: (−1)(−8)($50).', '2': 'Each point is worth $50.', '3': 'Multiply, don’t add.' }, explain: R`\((-1)(-8)(\$50) = +\$400\).`, review: 'uses' },
    ],
    explain: [
      { prompt: R`Why must \((-1) \times (-1)\) equal 1?`, models: [R`Two flips of the number line put every number back where it started, which is what \(\times 1\) does.`, R`Any other value breaks the distributive law: \((-1)(1 + (-1))\) must be \((-1) \times 0 = 0\), which forces \((-1)(-1) = 1\).`] },
      { prompt: R`Describe multiplying by \(-3\) as two moves on the number line.`, models: [R`Stretch every number to three times its distance from zero, then flip the whole line around zero. The order of the two moves does not matter.`] },
      { prompt: R`Why is there no answer to \(7 \div 0\)?`, models: [R`Division asks what times the divisor gives the dividend. Nothing times 0 gives 7, because anything times 0 is 0.`] },
    ],
  },
};
