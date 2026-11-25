/* Math path, tiers 1–2: lessons. Each topic is a real lesson (idea, worked examples, why it works,
   symbols, history, uses, how to master it, practice). Rendered by js/pathmath.js. */
(function () {
  const M = (Lab.MATH = Lab.MATH || { topics: [], by: {} });
  M.T = M.T || ((tier, id, o) => { o.id = id; o.tier = tier; M.topics.push(o); M.by[id] = o; });
  const T = M.T;

  // ───────────────────────── Tier 1: Foundations of quantity ─────────────────────────
  T(1, 'count', {
    t: 'Number sense and place value',
    big: 'Ten digits, 0 to 9, can write any number because each position is worth ten times the one to its right.',
    learn: [
      'Counting starts with matching: one tally for one sheep. That works for small amounts but breaks down fast. Try writing 4,827 in tally marks. The great invention was place value: the same digit means different things depending on where it sits. In 4,827 the 4 means four thousands, the 8 means eight hundreds, the 2 means two tens and the 7 means seven ones.',
      'Zero makes place value work. Without it you could not tell 52 from 502. Zero is a placeholder (“nothing in the tens place”) and also a number in its own right, which you can add, subtract and multiply.',
      'Number sense means having a feel for size. A million seconds is about 11.6 days; a billion seconds is about 32 years. The difference between a million and a billion is the difference between a long holiday and a career. Number lines help: every number has a place, bigger to the right, and the distance between two numbers is how far apart they are.',
    ],
    ex: [
      ['Write 30,406 in expanded form.', ['3 ten-thousands = 30,000', '0 thousands = 0', '4 hundreds = 400', '0 tens = 0', '6 ones = 6', 'So 30,406 = 30,000 + 400 + 6. The zeros hold the empty places.']],
      ['Which is bigger, 0.7 or 0.65?', ['Line up the places: 0.70 and 0.65.', 'Tenths first: 7 tenths beats 6 tenths.', 'So 0.7 is bigger, even though “65” looks bigger than “7”.']],
    ],
    why: 'Place value works because grouping is consistent: ten ones make a ten, ten tens make a hundred, and so on. Any whole number can be broken into a unique sum of digits times powers of ten, so every number gets exactly one way of being written. Other bases work the same way with a different group size: computers group by 2 (binary), the Babylonians by 60, the Maya mostly by 20.',
    sym: [['0–9', 'digits', 'the ten symbols of base ten'], ['<, >', 'less than, greater than', '3 < 5; the open side faces the bigger number'], ['=', 'equals', 'both sides are the same amount'], ['10²', 'ten squared', '10 × 10 = 100: a place value']],
    words: [['Digit', 'one symbol, 0 to 9'], ['Place value', 'what a digit is worth because of its position'], ['Base', 'the group size: base 10 groups by tens'], ['Integer', 'a whole number, positive, negative or zero'], ['Estimate', 'a quick, sensible approximation']],
    hist: [
      ['c. 20,000 years ago', 'Ishango, Central Africa', 'A baboon bone with grouped notches, found in what is now the Democratic Republic of Congo. Many think the marks are tallies; claims that they show primes or a calendar are disputed.'],
      ['c. 2000 BCE', 'Mesopotamia', 'Babylonian scribes used a place-value system in base 60. It survives in 60 minutes, 60 seconds and 360 degrees.'],
      ['early centuries CE', 'Maya, Mesoamerica', 'A base-20 place-value system with a symbol for zero, used for calendars and astronomy.'],
      ['628 CE', 'Brahmagupta, India', 'Gave rules for calculating with zero as a number. Indian decimal place value with zero spread through the Islamic world.'],
      ['c. 825 and 1202', 'al-Khwarizmi; Fibonacci', 'Al-Khwarizmi wrote on Hindu numerals in Baghdad; Fibonacci’s Liber Abaci (1202) promoted them to European merchants. We call them Hindu–Arabic numerals.'],
    ],
    uses: [['Money', 'Reading prices, wages and debts; spotting a misplaced decimal point'], ['Computing', 'Binary place value (base 2) is how almost every modern computer stores numbers'], ['Science', 'Scientific notation (6.02 × 10²³) is place value with powers of ten'], ['News and politics', 'Telling millions from billions when budgets and death tolls are reported']],
    master: ['Say numbers out loud in expanded form until it is automatic.', 'Estimate before you calculate, then check the answer is the right size.', 'Practise ordering decimals and big numbers on a number line.', 'Convert a few numbers to binary to see place value with a different base.'],
    prac: [['What is the value of the 6 in 3,617?', '600'], ['Put in order: 0.5, 0.45, 0.05', '0.05, 0.45, 0.5'], ['About how many days is a million seconds?', 'About 11.6 days (1,000,000 ÷ 86,400)']],
    gen: 'place', labs: ['play-binary', 'play-cosmiczoom'], next: ['arith'],
    read: [['Khan Academy: arithmetic', 'https://www.khanacademy.org/math/arithmetic'], ['OpenStax: Prealgebra 2e (free textbook)', 'https://openstax.org/books/prealgebra-2e/pages/preface']],
  });

  T(1, 'arith', {
    t: 'Arithmetic: the four operations',
    big: 'Addition combines, subtraction takes away or compares, multiplication is repeated addition, division splits into equal groups.',
    learn: [
      'Addition and subtraction undo each other: 8 + 5 = 13 and 13 − 5 = 8. Multiplication and division undo each other: 6 × 7 = 42 and 42 ÷ 7 = 6. Knowing these pairs (fact families) means every fact you learn gives you its opposite for free.',
      'The written methods you learn in school (carrying, borrowing, long multiplication, long division) are shortcuts built on place value. When you “carry the 1” you are trading ten ones for one ten. Long multiplication splits a problem into easy pieces: 23 × 14 = 23 × 10 + 23 × 4 = 230 + 92 = 322.',
      'Three laws let you rearrange calculations safely. Order does not matter for adding or multiplying (commutative: 3 + 5 = 5 + 3). Grouping does not matter either (associative: (2 + 3) + 4 = 2 + (3 + 4)). And multiplication spreads over addition (distributive: 6 × (10 + 3) = 60 + 18). Mental math is mostly these three laws used cleverly.',
    ],
    ex: [
      ['Work out 47 × 6 in your head.', ['Split 47 into 40 + 7 (distributive law).', '40 × 6 = 240 and 7 × 6 = 42.', '240 + 42 = 282.']],
      ['Share 156 sweets among 12 children.', ['How many 12s fit in 156?', '12 × 10 = 120, leaving 36.', '12 × 3 = 36, leaving 0.', 'So each child gets 10 + 3 = 13.']],
    ],
    why: 'The written methods are guaranteed to work because of the distributive law and place value: you break a number into hundreds, tens and ones, do each part, and add the parts back up. Division by zero is undefined because no number times 0 gives a non-zero result: if 5 ÷ 0 were some number n, then n × 0 would have to equal 5, which is impossible.',
    sym: [['+', 'plus', 'add'], ['−', 'minus', 'subtract'], ['×  or  ·', 'times', 'multiply'], ['÷  or  /', 'divided by', 'divide; a/b means a ÷ b'], ['r', 'remainder', '17 ÷ 5 = 3 r 2']],
    words: [['Sum', 'the answer to an addition'], ['Difference', 'the answer to a subtraction'], ['Product', 'the answer to a multiplication'], ['Quotient', 'the answer to a division'], ['Factor', 'a number that divides another exactly: 3 is a factor of 12'], ['Multiple', '12 is a multiple of 3']],
    hist: [
      ['c. 1550 BCE', 'Egypt', 'The Rhind Papyrus, copied by the scribe Ahmose, multiplies by doubling and adding, the same idea computers use in binary.'],
      ['c. 200 BCE–200 CE', 'China', 'Calculation with counting rods on a board, and later the abacus, which is still used and taught.'],
      ['1489', 'Johannes Widmann, Germany', 'Earliest known printed use of + and −, in a book of merchant arithmetic.'],
      ['1631 and 1659', 'William Oughtred; Johann Rahn', 'Introduced × (Oughtred) and ÷ (Rahn) in printed books.'],
    ],
    uses: [['Everyday life', 'Budgets, recipes, splitting a bill, change at a shop'], ['Business', 'Profit = revenue − costs; unit prices; payroll'], ['Engineering', 'Load totals, material lists, schedules'], ['Computing', 'Every program is built from these operations on binary numbers']],
    master: ['Know the times tables up to 12 × 12 by heart; it frees your attention for harder ideas.', 'Practise mental math daily for five minutes using the distributive trick.', 'Always check with the inverse: after dividing, multiply back.', 'Estimate first (47 × 6 is a bit under 50 × 6 = 300).'],
    prac: [['368 + 457', '825'], ['1,000 − 377', '623'], ['25 × 16', '400 (25 × 4 × 4)'], ['144 ÷ 12', '12']],
    gen: 'arith', labs: ['play-binary', 'play-fermi'], pre: ['count'], next: ['frac', 'neg'],
    read: [['Khan Academy: arithmetic', 'https://www.khanacademy.org/math/arithmetic'], ['OpenStax: Prealgebra 2e', 'https://openstax.org/books/prealgebra-2e/pages/preface']],
  });

  T(1, 'frac', {
    t: 'Parts of a whole: fractions, decimals, percents and ratios',
    big: 'A fraction, a decimal and a percent are three ways of writing the same part of a whole: ½ = 0.5 = 50%.',
    learn: [
      'A fraction a/b means “split a whole into b equal parts and take a of them”. The bottom number (denominator) says what size the pieces are; the top number (numerator) says how many you have. ¾ of a pizza is three of four equal slices.',
      'To add fractions the pieces must be the same size. ½ + ⅓ cannot be added directly, so rewrite both in sixths: 3/6 + 2/6 = 5/6. To multiply, multiply tops and bottoms: ½ × ⅓ = 1/6 (half of a third). To divide, flip the second fraction and multiply: ½ ÷ ¼ = ½ × 4 = 2, because two quarters fit in a half.',
      'Decimals are fractions with denominators 10, 100, 1000 and so on: 0.37 = 37/100. Percent means “per hundred”, so 37% = 37/100 = 0.37. A ratio compares two amounts: a recipe with 2 cups of flour to 1 cup of sugar has a 2:1 ratio. Ratios are fractions in disguise: sugar is ⅓ of the mix.',
    ],
    ex: [
      ['Add ⅔ + ¼.', ['A common denominator is 12.', '⅔ = 8/12 and ¼ = 3/12.', '8/12 + 3/12 = 11/12.']],
      ['What is 15% of 80?', ['15% = 0.15.', '0.15 × 80 = 12.', 'Quick check: 10% is 8, 5% is 4, so 15% is 12.']],
      ['Write ⅜ as a decimal and a percent.', ['3 ÷ 8 = 0.375.', '0.375 = 37.5%.']],
    ],
    why: 'Multiplying the top and bottom of a fraction by the same number does not change its value (2/4 = 1/2) because you are cutting every piece into the same number of smaller pieces. That is why common denominators work. Dividing by a fraction equals multiplying by its flip because division asks “how many of these fit?”: how many quarters fit in one whole? Four. So ÷ ¼ is the same as × 4.',
    sym: [['a/b', 'a over b', 'a parts out of b equal parts'], ['%', 'percent', 'per hundred'], ['a : b', 'a to b', 'a ratio'], ['0.3̄', 'zero point three recurring', '0.333… = ⅓']],
    words: [['Numerator', 'top number: how many parts'], ['Denominator', 'bottom number: how many parts make a whole'], ['Equivalent fractions', 'different-looking fractions with the same value'], ['Simplest form', 'top and bottom share no common factor'], ['Mixed number', '2½ means 2 + ½']],
    hist: [
      ['c. 1800 BCE', 'Egypt and Babylon', 'Egyptians wrote fractions as sums of unit fractions (like ½ + ¼); Babylonians used base-60 fractions, still seen in minutes and seconds.'],
      ['c. 100 CE', 'China', 'The Nine Chapters on the Mathematical Art gave rules for adding, simplifying and dividing fractions much like ours.'],
      ['c. 1200', 'North Africa', 'The horizontal fraction bar appears in Arabic works such as those of al-Hassar.'],
      ['952–1585', 'al-Uqlidisi; al-Kashi; Simon Stevin', 'Decimal fractions were used in Damascus and Samarkand, and Stevin’s 1585 pamphlet spread them in Europe.'],
      ['Roman times to 1400s', 'Rome; Italy', 'Romans taxed goods in hundredths; Italian merchants’ “per cento” shorthand slowly became %.'],
    ],
    uses: [['Shopping', 'Discounts, tax and tips are percents'], ['Cooking and building', 'Scaling a recipe or a mix by a ratio'], ['Medicine', 'Doses per kilogram of body weight; test accuracy as a percent'], ['Finance', 'Interest rates, inflation, odds'], ['Statistics', 'Every probability is a fraction from 0 to 1']],
    master: ['Draw fraction bars or circles until common denominators feel obvious.', 'Memorize the common conversions: ½, ⅓, ¼, ⅕, ⅛ as decimals and percents.', 'Find 10% first, then build other percents from it.', 'Ask “of what whole?” every time you see a percent.'],
    prac: [['¾ − ⅓', '5/12'], ['⅖ × 15', '6'], ['Write 0.08 as a percent', '8%'], ['Simplify 18/24', '3/4']],
    gen: 'frac', labs: ['play-fracbars', 'play-compound'], pre: ['arith'], next: ['prop', 'data1'],
    read: [['Khan Academy: fractions', 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic'], ['OpenStax: Prealgebra 2e, chapter 4', 'https://openstax.org/books/prealgebra-2e/pages/preface']],
  });

  T(1, 'meas', {
    t: 'Measurement and shapes',
    big: 'Measuring means comparing something to an agreed unit; shapes are described by their sides, angles and faces.',
    learn: [
      'A measurement is a number plus a unit: 3 metres, 2 hours, 5 kilograms. The unit matters as much as the number. In 1999 NASA lost the Mars Climate Orbiter because one team used pound-force seconds and another expected newton-seconds.',
      'Converting units is multiplying by 1 in a clever form. Since 100 cm = 1 m, the fraction 1 m / 100 cm equals 1. So 250 cm × (1 m / 100 cm) = 2.5 m: the centimetres cancel. This “unit cancelling” trick works for any conversion, from currencies to light-years.',
      'Flat (2D) shapes are named by their sides: triangles (3), quadrilaterals (4: squares, rectangles, parallelograms, trapezoids), pentagons (5), hexagons (6). Solid (3D) shapes have faces, edges and corners (vertices): a cube has 6 faces, 12 edges and 8 corners. Perimeter is the distance around a shape; area is the space it covers; volume is the space a solid fills.',
    ],
    ex: [
      ['How many seconds are in a day?', ['60 seconds per minute × 60 minutes per hour = 3,600 seconds per hour.', '3,600 × 24 hours = 86,400 seconds.']],
      ['A garden is 8 m by 5 m. Find its perimeter and area.', ['Perimeter: 8 + 5 + 8 + 5 = 26 m.', 'Area: 8 × 5 = 40 square metres (m²).', 'Note the units: length is in m, area in m².']],
    ],
    why: 'Area uses square units because you are counting how many unit squares cover the shape: an 8 by 5 rectangle holds 8 rows of 5 squares. Volume counts unit cubes, so it uses cubic units. That is also why doubling every side of a shape multiplies its area by 4 and its volume by 8, a fact that explains why giant animals need thick legs.',
    sym: [['m, cm, km', 'metre, centimetre, kilometre', 'length units (SI)'], ['kg, g', 'kilogram, gram', 'mass'], ['m², m³', 'square metres, cubic metres', 'area, volume'], ['°', 'degrees', 'angle size; a full turn is 360°'], ['∠', 'angle', '∠ABC is the angle at B']],
    words: [['Perimeter', 'distance around'], ['Area', 'flat space covered'], ['Volume', 'space filled'], ['Vertex', 'a corner'], ['Polygon', 'a flat shape with straight sides'], ['SI', 'the international system of units']],
    hist: [
      ['c. 2700 BCE', 'Egypt', 'The royal cubit (about 52 cm), kept on official rods, set lengths for building the pyramids.'],
      ['c. 360 BCE', 'Plato; Theaetetus', 'Only five solids have identical regular faces (the Platonic solids); Euclid’s Elements later proved there are no others.'],
      ['1790s', 'France', 'The metric system: the metre was set as one ten-millionth of the distance from the North Pole to the equator, after a seven-year survey.'],
      ['1960 and 2019', 'International bodies', 'The SI was adopted in 1960; since 2019 all its base units are defined by fixed constants of nature, so no physical object defines the kilogram any more.'],
    ],
    uses: [['Building', 'Paint, flooring and concrete are bought by area and volume'], ['Medicine', 'Doses are measured in mg and mL; errors kill'], ['Science', 'Every experiment depends on agreed units'], ['Trade', 'Shared units made long-distance trade and taxation possible']],
    master: ['Always write the unit next to every number.', 'Learn a few reference sizes: a door is about 2 m tall, a litre of water weighs 1 kg.', 'Use unit cancelling for every conversion.', 'Sketch shapes and label sides before calculating.'],
    prac: [['3.2 km in metres', '3,200 m'], ['Area of a 12 cm by 7 cm rectangle', '84 cm²'], ['How many edges does a triangular prism have?', '9']],
    gen: 'meas', labs: ['play-polyhedra', 'play-eratosthenes', 'play-cosmiczoom'], pre: ['arith'], next: ['geo1'],
    read: [['NIST: SI units', 'https://www.nist.gov/pml/owm/metric-si/si-units'], ['Khan Academy: measurement and data', 'https://www.khanacademy.org/math/cc-third-grade-math/imp-measurement-and-data']],
  });

  // ───────────────────────── Tier 2: Pre-algebra ─────────────────────────
  T(2, 'neg', {
    t: 'Negative numbers, powers, roots and the order of operations',
    big: 'Negative numbers extend the number line to the left; powers are repeated multiplication; roots undo powers.',
    learn: [
      'Negative numbers measure things below a zero point: debt, temperatures below freezing, depth below sea level. On a number line, adding a positive moves right; adding a negative moves left. Subtracting a number is the same as adding its opposite: 3 − 7 = 3 + (−7) = −4.',
      'Multiplying signs follows two rules: same signs give a positive, different signs give a negative. So (−4) × (−5) = 20 and (−4) × 5 = −20. The same rules hold for division.',
      'A power is shorthand for repeated multiplication: 2⁵ = 2 × 2 × 2 × 2 × 2 = 32. The small raised number is the exponent. Useful rules: aᵐ × aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, and a⁻ⁿ = 1/aⁿ. A square root asks “what number times itself gives this?”: √49 = 7. Some roots are not whole numbers: √2 ≈ 1.41421.',
      'Order of operations is an agreement so that everyone gets the same answer: brackets first, then powers, then multiplication and division from left to right, then addition and subtraction from left to right. In the US the memory aid is PEMDAS; in the UK and India it is BODMAS. It is a convention, not a law of nature; writing clearly with brackets avoids the viral arguments.',
    ],
    ex: [
      ['Work out −3 − (−8).', ['Subtracting a negative = adding a positive.', '−3 + 8 = 5.']],
      ['Evaluate 2 + 3 × 4² − 6 ÷ 2.', ['Powers: 4² = 16.', 'Multiply and divide: 3 × 16 = 48; 6 ÷ 2 = 3.', 'Add and subtract left to right: 2 + 48 − 3 = 47.']],
      ['Simplify 2³ × 2⁴ and 5⁻².', ['Same base, add exponents: 2⁷ = 128.', '5⁻² = 1/5² = 1/25.']],
    ],
    why: 'Why is negative times negative positive? Because otherwise the distributive law would break. We know (−1) × 0 = 0, and 0 = 1 + (−1). So (−1) × (1 + (−1)) = 0, which spreads out to (−1) × 1 + (−1) × (−1) = 0, that is −1 + (−1)(−1) = 0. The only number that works is (−1)(−1) = 1. Likewise a⁰ = 1 because aⁿ ÷ aⁿ must equal 1 and the exponent rule says it equals aⁿ⁻ⁿ = a⁰.',
    sym: [['−5', 'negative five', 'five below zero'], ['|−5|', 'absolute value of −5', 'distance from zero: 5'], ['aⁿ', 'a to the power n', 'a multiplied by itself n times'], ['√a', 'square root of a', 'the non-negative number whose square is a'], ['ⁿ√a', 'n-th root', '∛8 = 2'], ['( )', 'brackets', 'do this first']],
    words: [['Integer', '…, −2, −1, 0, 1, 2, …'], ['Opposite', '−7 is the opposite of 7'], ['Base and exponent', 'in 2⁵, 2 is the base and 5 the exponent'], ['Perfect square', '1, 4, 9, 16, 25, …'], ['Irrational', 'cannot be written as a fraction, like √2']],
    hist: [
      ['c. 100 CE', 'China', 'The Nine Chapters used red counting rods for positive and black for negative numbers when solving equations.'],
      ['628', 'Brahmagupta, India', 'Stated rules for “fortunes” and “debts”, including that a debt times a debt is a fortune.'],
      ['1500s–1700s', 'Europe', 'Many European mathematicians called negative answers “absurd” or “false”; they were fully accepted only in the 1700s and 1800s.'],
      ['c. 400 BCE', 'Greece', 'Greek mathematicians proved √2 cannot be a fraction. The story that Hippasus was drowned for revealing it is a later legend.'],
      ['1525 and 1637', 'Christoff Rudolff; René Descartes', 'Rudolff printed the √ sign; Descartes popularized raised exponents like x³.'],
    ],
    uses: [['Finance', 'Debts, losses, account balances'], ['Science', 'Temperatures, charges, altitudes; powers of ten for very large and very small numbers'], ['Computing', 'Memory sizes are powers of 2 (2¹⁰ = 1,024)'], ['Geometry', 'Square roots give lengths, as in the Pythagorean theorem']],
    master: ['Picture every negative problem on a number line.', 'Learn powers of 2 up to 2¹⁰ and squares up to 15².', 'Write each step of an order-of-operations problem on a new line.', 'When in doubt, add brackets.'],
    prac: [['−7 + 12', '5'], ['(−3)³', '−27'], ['10 − 2 × (3 + 1)²', '−22'], ['√144 + 2⁴', '28']],
    gen: 'neg', labs: ['play-numline', 'play-binary', 'play-cosmiczoom'], pre: ['arith'], next: ['var', 'explog'],
    read: [['Khan Academy: pre-algebra', 'https://www.khanacademy.org/math/pre-algebra'], ['OpenStax: Prealgebra 2e, chapters 3 and 10', 'https://openstax.org/books/prealgebra-2e/pages/preface']],
  });

  T(2, 'var', {
    t: 'Variables, equations and inequalities',
    big: 'A letter stands for a number you don’t know yet; an equation is a balance you can keep level while you find it.',
    learn: [
      'Algebra lets you reason about numbers you have not found yet. If a taxi charges $3 plus $2 per km, the cost for d km is 3 + 2d. The letter d is a variable: it can stand for any distance. The expression 3 + 2d is a recipe that works for all of them.',
      'An equation says two things are equal: 3 + 2d = 15. Think of a balance scale. Whatever you do to one side you must do to the other to keep it level. Subtract 3 from both sides: 2d = 12. Divide both sides by 2: d = 6. The taxi went 6 km. Each step undoes one operation, in reverse order.',
      'An inequality compares instead of balancing: 3 + 2d ≤ 15 means “the fare is at most $15”, so d ≤ 6. Inequalities are solved the same way, with one trap: multiplying or dividing both sides by a negative number flips the sign. If −x > 3 then x < −3.',
      'Like terms can be combined: 4x + 3x = 7x, but 4x + 3y cannot be simplified because x and y are different unknowns. Expanding brackets uses the distributive law: 3(x + 5) = 3x + 15.',
    ],
    ex: [
      ['Solve 5x − 7 = 2x + 8.', ['Subtract 2x from both sides: 3x − 7 = 8.', 'Add 7 to both sides: 3x = 15.', 'Divide by 3: x = 5.', 'Check: 5(5) − 7 = 18 and 2(5) + 8 = 18. ✓']],
      ['Solve −2x + 4 < 10.', ['Subtract 4: −2x < 6.', 'Divide by −2 and flip the sign: x > −3.']],
    ],
    why: 'The balance method works because equality is preserved by doing the same thing to equal amounts: if a = b then a + c = b + c and a × c = b × c. Dividing by a negative flips an inequality because it mirrors the number line: 2 < 5, but −2 > −5.',
    sym: [['x, y, n', 'variables', 'unknown or changing numbers'], ['2x', 'two x', '2 × x (the × is left out)'], ['≠', 'not equal'], ['≤, ≥', 'at most, at least', 'less/greater than or equal to'], ['∴', 'therefore']],
    words: [['Expression', 'a recipe without an equals sign: 3 + 2d'], ['Equation', 'two expressions set equal'], ['Coefficient', 'the number in front of a variable: 2 in 2d'], ['Constant', 'a fixed number: 3 in 3 + 2d'], ['Solution', 'a value that makes the equation true']],
    hist: [
      ['c. 1800 BCE', 'Babylon', 'Clay tablets pose and solve problems we would write as equations, in words.'],
      ['c. 250 CE', 'Diophantus, Alexandria', 'Used abbreviations for unknowns in his Arithmetica: a halfway step to symbols.'],
      ['c. 820', 'al-Khwarizmi, Baghdad', 'His book on “al-jabr” (restoring) and “al-muqabala” (balancing) gave systematic methods; “algebra” comes from al-jabr and “algorithm” from his name. He wrote everything in words.'],
      ['1557', 'Robert Recorde, Wales', 'Invented the = sign, two parallel lines, because nothing could be more equal.'],
      ['1591 and 1637', 'François Viète; Descartes', 'Viète used letters for unknowns and for given numbers; Descartes started the habit of x, y, z for unknowns.'],
    ],
    uses: [['Everyday', 'Phone plans, taxi fares, break-even points'], ['Science', 'Formulas such as distance = speed × time, rearranged to find any one part'], ['Spreadsheets and code', 'Every cell formula and program variable is algebra'], ['Business', 'Solving for the price that covers costs']],
    master: ['Always check by putting your answer back into the original equation.', 'Write one step per line and say which operation you applied to both sides.', 'Translate word problems into symbols slowly: underline what is unknown.', 'Practise until rearranging formulas (like v = d/t) is automatic.'],
    prac: [['4x + 9 = 37', 'x = 7'], ['3(x − 2) = 2x + 5', 'x = 11'], ['−3x ≥ 12', 'x ≤ −4'], ['Rearrange A = lw for w', 'w = A/l']],
    gen: 'lin', labs: ['math-algebra', 'play-binsearch'], pre: ['neg'], next: ['alg', 'prop'],
    read: [['Khan Academy: algebra basics', 'https://www.khanacademy.org/math/algebra-basics'], ['OpenStax: Elementary Algebra 2e', 'https://openstax.org/details/books/elementary-algebra-2e']],
  });

  T(2, 'prop', {
    t: 'Proportions, rates and percent change',
    big: 'Two quantities are proportional when one is always the same multiple of the other; a rate is “per something”.',
    learn: [
      'If 3 notebooks cost $4.50, then 1 costs $1.50 and 10 cost $15. Cost is proportional to the number of notebooks: double one and you double the other. The fixed multiple ($1.50 per notebook) is the unit rate. Speed (km per hour), wages (dollars per hour) and density (grams per cm³) are all unit rates.',
      'A proportion is an equation between two ratios: 3/4.50 = 10/c. Cross-multiplying gives 3c = 45, so c = 15. Maps and models use scale factors: on a 1:50,000 map, 2 cm on paper is 100,000 cm = 1 km on the ground.',
      'Percent change measures growth relative to where you started: change ÷ original × 100%. A price going from $80 to $100 rose by 20/80 = 25%. Watch the trap: a 50% fall followed by a 50% rise does not get you back. $100 → $50 → $75. Percent changes multiply, they do not add.',
      'Not everything is proportional. A taxi fare with a fixed starting fee is linear but not proportional: 0 km still costs $3. Spotting whether a relationship passes through zero is a quick test.',
    ],
    ex: [
      ['A car uses 6 litres per 100 km. How much for 350 km?', ['Unit rate: 6/100 = 0.06 litres per km.', '0.06 × 350 = 21 litres.']],
      ['Rent rose from $1,200 to $1,380. What is the percent increase?', ['Change: 1,380 − 1,200 = 180.', '180 ÷ 1,200 = 0.15 = 15%.']],
      ['After a 20% discount a jacket costs $64. What was the original price?', ['Paying 80% of the original: 0.8 × p = 64.', 'p = 64 ÷ 0.8 = $80. (Not 64 + 20%!)']],
    ],
    why: 'Proportional quantities have a constant ratio y/x = k, so y = kx: the graph is a straight line through the origin. Percent changes multiply because each change is applied to the new amount: going up 10% means multiplying by 1.10; going down 10% means multiplying by 0.90; both together give 1.10 × 0.90 = 0.99, a 1% loss.',
    sym: [['∝', 'is proportional to', 'y ∝ x means y = kx'], ['k', 'constant of proportionality'], ['Δ', 'delta, change in', 'Δx = new − old'], ['%', 'percent']],
    words: [['Unit rate', 'amount per one unit'], ['Scale factor', 'the multiple between a model and the real thing'], ['Proportional', 'constant ratio; graph through the origin'], ['Percentage point', 'the difference between two percents: 5% to 7% is 2 points but a 40% rise']],
    hist: [
      ['c. 370 BCE', 'Eudoxus; Euclid', 'A careful theory of ratio and proportion, preserved in Book V of Euclid’s Elements.'],
      ['499 and earlier', 'India and China', 'The “rule of three” for solving proportions appears in Aryabhata’s work and in the Nine Chapters; merchants used it for centuries.'],
      ['Middle Ages–1600s', 'Merchants and bankers', 'Interest, exchange rates and partnerships drove the teaching of proportion in Italy and beyond.'],
    ],
    uses: [['Economics', 'Inflation, growth rates, price indexes'], ['Medicine', 'Doses scaled by body weight; infusion rates'], ['News', 'Telling percent from percentage points in polls and risk claims'], ['Engineering and maps', 'Scale drawings, gear ratios, model testing']],
    master: ['Write rates with their units (km/h) and cancel units to check.', 'For percent change, always divide by the original amount.', 'Turn percent changes into multipliers (×1.07, ×0.85).', 'Test proportionality: does zero give zero, and is the ratio constant?'],
    prac: [['5 apples cost $3.25. Cost of 8?', '$5.20'], ['Population 40,000 → 46,000: percent change?', '+15%'], ['Price up 10% then down 10%: net change?', '−1%']],
    gen: 'pct', labs: ['play-compound', 'play-riskreduction', 'play-mercator'], pre: ['frac', 'var'], next: ['alg', 'explog'],
    read: [['Khan Academy: rates and percentages', 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic'], ['OpenStax: Prealgebra 2e, chapter 6', 'https://openstax.org/books/prealgebra-2e/pages/preface']],
  });

  T(2, 'geo1', {
    t: 'Area, volume, angles and the Pythagorean theorem',
    big: 'In any right triangle, the squares on the two short sides add up to the square on the longest side: a² + b² = c².',
    learn: [
      'Area formulas come from rearranging shapes into rectangles. A parallelogram can be cut and slid into a rectangle, so its area is base × height. A triangle is half a parallelogram: ½ × base × height. A circle of radius r has area πr² and circumference 2πr, where π ≈ 3.14159 is the ratio of any circle’s circumference to its diameter.',
      'Volume of a prism or cylinder is the area of its base times its height: a can of radius 4 cm and height 10 cm holds π × 4² × 10 ≈ 503 cm³. Cones and pyramids hold exactly one third of the matching prism.',
      'Angles measure turning. A right angle is 90°, a straight line 180°, a full turn 360°. The angles of any triangle add to 180°. Angles on a straight line add to 180°, and opposite angles where two lines cross are equal.',
      'The Pythagorean theorem links the sides of a right triangle. If the legs are 3 and 4, the longest side (the hypotenuse) is √(9 + 16) = √25 = 5. Builders use the 3-4-5 triangle to make square corners; GPS and screens use the same rule to find distances.',
    ],
    ex: [
      ['A ladder 5 m long reaches 4 m up a wall. How far is its foot from the wall?', ['a² + 4² = 5²', 'a² = 25 − 16 = 9', 'a = 3 m.']],
      ['Find the distance between points (1, 2) and (7, 10).', ['Horizontal gap 6, vertical gap 8.', 'Distance = √(6² + 8²) = √100 = 10.']],
      ['A triangle has angles 47° and 68°. Find the third.', ['180 − 47 − 68 = 65°.']],
    ],
    why: 'One proof you can see: take four copies of the right triangle and arrange them inside a square of side a + b. The empty space in the middle is a square of side c, so (a + b)² = 4 × ½ab + c². Expanding gives a² + 2ab + b² = 2ab + c², and so a² + b² = c². The Lab’s “Pythagoras by area” lets you move the pieces yourself. The triangle angle sum is 180° because a line through the top corner parallel to the base creates angles equal to the two base angles, and together with the top angle they make a straight line.',
    sym: [['π', 'pi', '≈ 3.14159, circumference ÷ diameter'], ['r, d', 'radius, diameter', 'd = 2r'], ['⊥', 'is perpendicular to', 'meets at 90°'], ['∥', 'is parallel to'], ['△ABC', 'triangle ABC'], ['°', 'degrees']],
    words: [['Hypotenuse', 'the side opposite the right angle; always the longest'], ['Legs', 'the two shorter sides of a right triangle'], ['Perpendicular height', 'height measured at right angles to the base'], ['Pythagorean triple', 'whole numbers that fit, like 3-4-5 or 5-12-13']],
    hist: [
      ['c. 1800 BCE', 'Babylon', 'The tablet Plimpton 322 lists Pythagorean triples, and the tablet YBC 7289 shows √2 to about six decimal places, over a thousand years before Pythagoras.'],
      ['c. 800–500 BCE', 'Baudhayana, India', 'The Sulba Sutras, manuals for building altars, state the rule for the diagonal of a rectangle.'],
      ['c. 300 BCE', 'Euclid', 'Elements Book I, Proposition 47 gives a general proof. The theorem is named after Pythagoras, though no writing of his survives.'],
      ['c. 250 BCE and 5th century', 'Archimedes; Zu Chongzhi', 'Archimedes trapped π between 223/71 and 22/7 using 96-sided polygons; in China, Zu Chongzhi found 355/113, correct to six decimals.'],
      ['Han dynasty', 'China', 'The Zhoubi Suanjing shows the “gougu” rule with a famous square diagram.'],
    ],
    uses: [['Construction', 'Square corners, roof pitches, stairs, ramps'], ['Navigation and GPS', 'Distances on maps and between coordinates'], ['Screens and games', 'Distance between pixels and objects'], ['Physics', 'Adding forces or velocities at right angles']],
    master: ['Draw a labelled diagram for every problem.', 'Know the triples 3-4-5, 5-12-13, 8-15-17 and their multiples.', 'Check that the hypotenuse is the longest side.', 'Derive the area formulas yourself by cutting paper shapes once.'],
    prac: [['Legs 9 and 12: hypotenuse?', '15'], ['Area of a triangle, base 10, height 7', '35'], ['Volume of a box 3 × 4 × 5', '60'], ['Area of a circle of radius 10 (to 1 dp)', '314.2']],
    gen: 'pyth', labs: ['play-pythag', 'play-pidarts', 'play-eratosthenes'], pre: ['meas', 'neg'], next: ['proof', 'trig', 'coord'],
    read: [['Euclid’s Elements, Book I (Clark University)', 'https://mathcs.clarku.edu/~djoyce/elements/bookI/bookI.html'], ['Khan Academy: geometry', 'https://www.khanacademy.org/math/geometry']],
  });

  T(2, 'data1', {
    t: 'Data: averages, spread and graphs',
    big: 'An average summarizes a pile of numbers with one number; how spread out they are matters just as much.',
    learn: [
      'The mean adds everything and divides by how many there are. The median is the middle value when the numbers are sorted. The mode is the most common value. For incomes 30, 35, 40, 45 and 1,000 (in thousands), the mean is 230 but the median is 40. One very rich person drags the mean up; the median better describes a typical person. That is why household income is usually reported as a median.',
      'Spread tells you how much values vary. The range is the largest minus the smallest. The interquartile range is the spread of the middle half. Two classes can both average 70% on a test, one with everyone between 65 and 75, the other ranging from 30 to 100.',
      'Graphs show patterns at a glance: bar charts compare categories, line graphs show change over time, scatter plots show whether two things move together, histograms show the shape of a distribution. Always read the axes first: a vertical axis that starts at 95 instead of 0 can make a tiny change look huge.',
    ],
    ex: [
      ['Find the mean, median and mode of 4, 8, 6, 5, 3, 8, 9.', ['Sum = 43; there are 7 values; mean = 43/7 ≈ 6.14.', 'Sorted: 3, 4, 5, 6, 8, 8, 9 → median 6.', 'Mode = 8 (appears twice).']],
      ['Your test scores are 72, 85 and 90. What score do you need on the fourth for a mean of 85?', ['Total needed: 85 × 4 = 340.', 'So far: 247. Needed: 340 − 247 = 93.']],
    ],
    why: 'The mean is the balance point: the distances of values above it exactly cancel those below. That is why one extreme value moves it so much. The median only cares about order, so extreme values cannot drag it. Which one is “right” depends on the question you are asking.',
    sym: [['x̄', 'x-bar', 'the mean of a sample'], ['Σ', 'sigma, sum of', 'Σx means add up all the x values'], ['n', 'number of values'], ['Q1, Q3', 'quartiles', 'the 25% and 75% marks']],
    words: [['Mean', 'sum ÷ count'], ['Median', 'middle value'], ['Mode', 'most frequent value'], ['Outlier', 'a value far from the rest'], ['Distribution', 'how values are spread out'], ['Skewed', 'lopsided, with a long tail on one side']],
    hist: [
      ['1662', 'John Graunt, London', 'Studied the weekly “bills of mortality” and began demographic statistics.'],
      ['1786 and 1801', 'William Playfair, Scotland', 'Invented the line graph and bar chart (1786) and the pie chart (1801).'],
      ['1854 and 1858', 'John Snow; Florence Nightingale', 'Snow mapped cholera deaths around a water pump in London; Nightingale’s diagrams showed most soldiers in the Crimean War died of disease, not wounds.'],
      ['1880s–1895', 'Francis Galton; Karl Pearson', 'Galton popularized the term “median” and Pearson coined “mode”. Both also promoted eugenics, which the Lab covers in its history pages.'],
    ],
    uses: [['Economics', 'Median income vs mean income tells different stories'], ['Sport', 'Batting averages, shooting percentages, player ratings'], ['Health', 'Average blood pressure, life expectancy'], ['Spotting misleading charts', 'Truncated axes, cherry-picked time ranges']],
    master: ['For every average you see, ask: mean or median, and of whom?', 'Sketch a quick dot plot of small data sets.', 'Look for outliers before summarizing.', 'Recreate a chart from the news and check whether its axes are honest.'],
    prac: [['Median of 12, 3, 7, 9, 15, 4', '8'], ['Mean of 10, 20, 30, 40', '25'], ['Range of 7, 2, 19, 11', '17']],
    gen: 'stats', labs: ['play-lifeexp', 'play-normal', 'play-spurious', 'play-benford'], pre: ['frac'], next: ['prob'],
    read: [['OpenIntro Statistics (free book)', 'https://www.openintro.org/book/os/'], ['Khan Academy: statistics and probability', 'https://www.khanacademy.org/math/statistics-probability']],
  });
})();
