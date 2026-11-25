/* Math path, tier 3: high-school core. */
(function () {
  const M = (Lab.MATH = Lab.MATH || { topics: [], by: {} });
  M.T = M.T || ((tier, id, o) => { o.id = id; o.tier = tier; M.topics.push(o); M.by[id] = o; });
  const T = M.T;

  T(3, 'alg', {
    t: 'Algebra: functions, systems, polynomials and quadratics',
    big: 'A function is a machine: put a number in, get exactly one number out. Algebra studies how those machines behave.',
    learn: [
      'A function f takes an input x and gives an output f(x). The rule f(x) = 2x + 3 turns 1 into 5 and 4 into 11. Its graph, the set of all points (x, f(x)), is a straight line with slope 2 (it climbs 2 for every 1 across) and y-intercept 3. Linear functions model anything that changes at a constant rate.',
      'A system of equations asks for values that satisfy several equations at once. For x + y = 10 and x − y = 4, adding the equations eliminates y: 2x = 14, so x = 7 and y = 3. Graphically, the solution is where two lines cross. Systems with thousands of unknowns run airline schedules, power grids and computer graphics.',
      'Polynomials are sums of powers: 3x³ − x + 7. Their highest power is the degree. A quadratic has degree 2, like x² − 5x + 6, and its graph is a U-shaped parabola. Solving a quadratic means finding where the parabola crosses zero. Factoring finds them when you can: x² − 5x + 6 = (x − 2)(x − 3), so x = 2 or x = 3, because a product is zero only when one factor is zero.',
      'When factoring fails, the quadratic formula always works: for ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) / 2a. The part under the root, b² − 4ac, is the discriminant. Positive: two real answers. Zero: one. Negative: no real answers, which is where complex numbers come in.',
    ],
    ex: [
      ['Solve 2x² + 3x − 2 = 0.', ['a = 2, b = 3, c = −2.', 'Discriminant: 9 − 4(2)(−2) = 25.', 'x = (−3 ± 5)/4.', 'x = ½ or x = −2.']],
      ['Tickets cost $5 for children and $8 for adults. 30 people paid $195. How many adults?', ['c + a = 30 and 5c + 8a = 195.', 'From the first, c = 30 − a. Substitute: 5(30 − a) + 8a = 195.', '150 + 3a = 195, so a = 15 adults and 15 children.']],
    ],
    why: 'The quadratic formula comes from completing the square. Starting from x² + bx = −c (with a = 1), add (b/2)² to both sides so the left becomes a perfect square: (x + b/2)² = b²/4 − c. Take square roots and solve. Al-Khwarizmi did exactly this with real squares and rectangles around the year 820, adding a missing corner to complete a square.',
    sym: [['f(x)', 'f of x', 'the output of function f at input x'], ['m, b', 'slope, intercept', 'in y = mx + b'], ['±', 'plus or minus', 'two answers'], ['xⁿ', 'x to the n', 'a power of the variable'], ['{ }', 'braces', 'a system of equations or a set']],
    words: [['Domain', 'the inputs a function accepts'], ['Range', 'the outputs it can give'], ['Slope', 'rise over run: steepness'], ['Root / zero', 'an x that makes f(x) = 0'], ['Degree', 'highest power in a polynomial'], ['Vertex', 'the turning point of a parabola'], ['Discriminant', 'b² − 4ac']],
    hist: [
      ['c. 1800 BCE', 'Babylon', 'Scribes solved problems equivalent to quadratics, step by step in words.'],
      ['628 and c. 820', 'Brahmagupta; al-Khwarizmi', 'Brahmagupta gave a rule close to the quadratic formula; al-Khwarizmi justified the method geometrically.'],
      ['1535–1545', 'Tartaglia; Cardano; Ferrari', 'Italian mathematicians solved cubic and quartic equations after public problem-solving duels; Cardano published the methods in Ars Magna (1545), angering Tartaglia.'],
      ['1824–1832', 'Niels Henrik Abel; Évariste Galois', 'Proved there is no general formula with roots for degree five and above. Galois died after a duel at 20; his ideas founded group theory.'],
      ['1673–1837', 'Leibniz; Euler; Dirichlet', 'Leibniz used the word “function”, Euler wrote f(x), and Dirichlet gave the modern idea: any rule giving one output per input.'],
    ],
    uses: [['Physics', 'A thrown ball follows a parabola: height = −4.9t² + vt + h'], ['Business', 'Profit curves; break-even points where cost and revenue lines cross'], ['Engineering', 'Systems of equations for forces in a bridge'], ['Computer graphics', 'Curves in fonts and animation are polynomial pieces (Bézier curves)']],
    master: ['Graph every function you meet, even roughly.', 'Learn to factor by checking: multiply your factors back out.', 'Derive the quadratic formula yourself once.', 'Practise word problems by naming unknowns before writing equations.'],
    prac: [['Solve x² − 9 = 0', 'x = ±3'], ['Slope of the line through (1, 2) and (3, 8)', '3'], ['Solve x + 2y = 7 and x − y = 1', 'x = 3, y = 2'], ['How many real roots has x² + 2x + 5?', 'None (discriminant −16)']],
    gen: 'quad', labs: ['math-functions', 'play-quadratic', 'play-regression'], pre: ['var', 'prop'], next: ['explog', 'cplx', 'calc1', 'linalg'],
    read: [['OpenStax: Intermediate Algebra 2e', 'https://openstax.org/details/books/intermediate-algebra-2e'], ['Khan Academy: Algebra 1', 'https://www.khanacademy.org/math/algebra'], ['Khan Academy: Algebra 2', 'https://www.khanacademy.org/math/algebra2']],
  });

  T(3, 'explog', {
    t: 'Exponentials and logarithms',
    big: 'Exponential growth multiplies by the same factor each step; a logarithm asks how many steps it took.',
    learn: [
      'Linear growth adds the same amount each step (+5, +5, +5). Exponential growth multiplies by the same factor (×2, ×2, ×2). Start with 1 and double 30 times and you pass a billion. Money at compound interest, bacteria, early epidemics, and viral posts grow this way; radioactive decay and drug levels shrink this way.',
      'The general form is y = a·bˣ: a is the starting amount and b the growth factor. A 7% yearly rise means b = 1.07. A useful shortcut, the rule of 70: something growing at r% a year doubles in about 70/r years. At 7%, about 10 years.',
      'A logarithm undoes an exponential. log₂(8) = 3 because 2³ = 8. log₁₀(1,000,000) = 6. Logs turn multiplication into addition: log(ab) = log a + log b. Before calculators, that let navigators and engineers multiply huge numbers by adding numbers from log tables or by sliding a slide rule.',
      'The special number e ≈ 2.71828 appears when growth is continuous. If a bank paid 100% interest compounded every instant, $1 would become $e after one year. The natural log, ln, is the log with base e. Logarithmic scales compress huge ranges: each step on the Richter or decibel scale is a multiplication, not an addition.',
    ],
    ex: [
      ['$1,000 at 5% a year compounded yearly. Value after 10 years?', ['Multiply by 1.05 ten times: 1,000 × 1.05¹⁰.', '1.05¹⁰ ≈ 1.6289.', 'About $1,628.89.']],
      ['Solve 3ˣ = 81.', ['81 = 3⁴, so x = 4.', 'In general x = log 81 / log 3.']],
      ['A drug’s level halves every 6 hours. What fraction is left after a day?', ['24 hours = 4 half-lives.', '(½)⁴ = 1/16, about 6%.']],
    ],
    why: 'Logs turn products into sums because exponents add when you multiply: 10² × 10³ = 10⁵, and the logs (2, 3, 5) add. Exponential growth outruns any polynomial because each step multiplies by a fixed factor, while a polynomial’s growth factor (n+1)ᵏ/nᵏ shrinks toward 1 as n grows.',
    sym: [['bˣ', 'b to the x', 'exponential with base b'], ['log_b(x)', 'log base b of x', 'the power of b that gives x'], ['ln x', 'natural log', 'log base e'], ['e', 'Euler’s number', '≈ 2.71828'], ['exp(x)', 'e to the x']],
    words: [['Growth factor', 'what you multiply by each step'], ['Half-life', 'time for something to halve'], ['Doubling time', 'time for something to double'], ['Log scale', 'equal steps mean equal multiplications'], ['Compound interest', 'interest earned on interest']],
    hist: [
      ['1614 and 1620', 'John Napier; Jost Bürgi', 'Napier published logarithms in Scotland; Bürgi, a Swiss clockmaker, found them independently.'],
      ['1617–1624', 'Henry Briggs', 'Base-10 log tables that astronomers and navigators used for over 300 years.'],
      ['c. 1622', 'William Oughtred', 'The slide rule: multiplication by sliding two log scales. Engineers used them until the 1970s, including for the Apollo missions.'],
      ['1683 and 1730s', 'Jacob Bernoulli; Leonhard Euler', 'Bernoulli met e while studying compound interest; Euler named it and proved it is irrational.'],
    ],
    uses: [['Finance', 'Compound interest, inflation, loan payments'], ['Medicine', 'Drug half-lives, bacterial growth, epidemic curves'], ['Science', 'pH (acidity), decibels (sound), earthquake magnitude, star brightness'], ['Computing', 'Binary search takes log₂(n) steps; information is measured in bits (log₂)'], ['Dating the past', 'Carbon-14 decay dates bones and wood up to about 50,000 years old']],
    master: ['Convert between bˣ = y and log_b(y) = x until it is automatic.', 'Use the rule of 70 to sanity-check growth claims in the news.', 'Plot the same data on a normal and a log scale and compare.', 'Learn the three log laws: product, quotient, power.'],
    prac: [['log₂(32)', '5'], ['log₁₀(0.001)', '−3'], ['Doubling time at 3.5% a year (rule of 70)', 'About 20 years'], ['Simplify ln(e⁷)', '7']],
    gen: 'log', labs: ['play-compound', 'play-sir', 'play-quake', 'play-dosing', 'play-binsearch'], pre: ['neg', 'prop'], next: ['calc1', 'series', 'info'],
    read: [['OpenStax: College Algebra 2e, chapter 6', 'https://openstax.org/details/books/college-algebra-2e'], ['Khan Academy: exponential and logarithmic functions', 'https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs']],
  });

  T(3, 'cplx', {
    t: 'Complex numbers',
    big: 'Invent a number i with i² = −1, and every polynomial equation gets solutions; multiplying by i turns a point 90° on a plane.',
    learn: [
      'No real number squares to −1, so mathematicians defined one: i, with i² = −1. A complex number has a real part and an imaginary part: 3 + 2i. Add them like ordinary expressions: (3 + 2i) + (1 − 5i) = 4 − 3i. Multiply them using i² = −1: (3 + 2i)(1 − i) = 3 − 3i + 2i − 2i² = 5 − i.',
      'Picture 3 + 2i as the point (3, 2) on a plane, the complex plane. Then multiplication has a beautiful meaning: it rotates and stretches. Multiplying by i rotates any point 90° counterclockwise around zero: 1 → i → −1 → −i → 1. That is why i² = −1: two quarter-turns make a half-turn.',
      'Every complex number has a size (modulus, its distance from zero) and a direction (argument, its angle). Multiplying multiplies sizes and adds angles. Euler’s formula, e^(iθ) = cos θ + i sin θ, links exponentials to rotation, and at θ = π it gives e^(iπ) + 1 = 0, connecting five of the most important numbers in mathematics.',
      'The fundamental theorem of algebra says every polynomial of degree n has exactly n roots in the complex numbers (counting repeats). With complex numbers, no polynomial equation is ever left without solutions.',
    ],
    ex: [
      ['Solve x² + 4x + 13 = 0.', ['Discriminant: 16 − 52 = −36.', '√(−36) = 6i.', 'x = (−4 ± 6i)/2 = −2 ± 3i.']],
      ['Multiply (1 + i)(1 + i). What happened geometrically?', ['(1 + i)² = 1 + 2i + i² = 2i.', '1 + i has size √2 and angle 45°. Squaring gives size 2 and angle 90°: that is 2i.']],
    ],
    why: 'Defining i² = −1 does not break arithmetic: the rules (commutative, associative, distributive) still hold, which is what makes complex numbers a legitimate number system. Rotation appears because multiplying by i sends (a, b) to (−b, a), exactly a quarter-turn.',
    sym: [['i', 'i', '√−1; engineers write j'], ['a + bi', 'complex number', 'real part a, imaginary part b'], ['|z|', 'modulus', 'distance from zero: √(a² + b²)'], ['z̄', 'conjugate', 'a − bi'], ['arg z', 'argument', 'the angle of z'], ['ℂ', 'the complex numbers']],
    words: [['Imaginary', 'a historical name; these numbers are as legitimate as negatives'], ['Complex plane', 'real numbers across, imaginary up'], ['Conjugate', 'flip the sign of the imaginary part'], ['Polar form', 'r(cos θ + i sin θ): size and angle']],
    hist: [
      ['1545 and 1572', 'Gerolamo Cardano; Rafael Bombelli', 'Cardano met square roots of negatives while solving cubics and called them useless; Bombelli worked out the rules and showed they lead to real answers.'],
      ['1637 and 1777', 'Descartes; Euler', 'Descartes called such roots “imaginary”, a dismissive label, since no real quantity matched them; Euler introduced the symbol i.'],
      ['1799 and 1806', 'Caspar Wessel; Jean-Robert Argand', 'Independently pictured complex numbers as points on a plane.'],
      ['1799 and 1831', 'Carl Friedrich Gauss', 'Gave an early proof of the fundamental theorem of algebra and popularized the name “complex number”.'],
      ['1893', 'Charles Steinmetz', 'Used complex numbers to tame alternating-current circuits, helping build the electrical grid.'],
    ],
    uses: [['Electrical engineering', 'AC voltages and currents are rotating complex numbers'], ['Quantum mechanics', 'The Schrödinger equation contains i; quantum states are complex'], ['Signal processing', 'Fourier transforms split sound and images into rotating complex waves'], ['Fluid flow and flight', 'Complex functions map airflow around wings'], ['Fractals', 'The Mandelbrot set is built by repeating z → z² + c']],
    master: ['Draw every complex number as an arrow on the plane.', 'Check products both ways: algebra and “multiply sizes, add angles”.', 'Memorize the cycle i, −1, −i, 1.', 'Play with the Mandelbrot lab: each pixel is a complex number.'],
    prac: [['(2 + 3i)(2 − 3i)', '13'], ['i⁷', '−i'], ['|3 − 4i|', '5'], ['Solve x² + 9 = 0', 'x = ±3i']],
    gen: 'cplx', labs: ['play-complex', 'play-mandel', 'play-fourier'], pre: ['alg'], next: ['trig', 'complexan', 'linalg'],
    read: [['Khan Academy: complex numbers', 'https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:complex'], ['3Blue1Brown: Euler’s formula', 'https://www.3blue1brown.com/lessons/eulers-formula-dynamically']],
  });

  T(3, 'proof', {
    t: 'Euclidean geometry and proof',
    big: 'A proof starts from statements everyone accepts and reaches a conclusion by steps that cannot be wrong.',
    learn: [
      'Euclid’s Elements, written around 300 BCE, started from a few definitions and five postulates, such as “a straight line can be drawn between any two points”, and proved hundreds of results from them. Nothing was accepted because it looked right in a picture. That method (axioms, then deductions) is how all mathematics works today.',
      'A proof is a chain of reasons. To prove the base angles of an isosceles triangle are equal, fold it along the line from the top to the midpoint of the base: the two halves are congruent (same three sides), so their matching angles are equal. In a two-column proof you list each statement with its reason: given, definition, postulate, or a theorem already proved.',
      'Congruent triangles have the same shape and size; similar triangles have the same shape at different sizes, so their sides are in proportion. Similarity lets you measure what you cannot reach: Thales is said to have measured a pyramid’s height from its shadow by comparing it with the shadow of a stick.',
      'The fifth postulate (through a point not on a line, exactly one parallel line can be drawn) bothered mathematicians for two thousand years. In the 1800s they found consistent geometries where it fails: on a sphere there are no parallel lines and triangle angles add to more than 180°. Einstein’s general relativity uses such curved geometry.',
    ],
    ex: [
      ['Prove that opposite angles where two lines cross are equal.', ['Call the angles a, b, c, d going around, with a opposite c.', 'a + b = 180° (a straight line).', 'b + c = 180° (a straight line).', 'So a + b = b + c, and subtracting b gives a = c. ∎']],
      ['A 2 m stick casts a 3 m shadow; a tree casts a 27 m shadow. How tall is the tree?', ['Sun rays are parallel, so the triangles are similar.', 'Height/shadow is equal: h/27 = 2/3.', 'h = 18 m.']],
    ],
    why: 'Proof matters because pictures and examples can mislead: a pattern can hold for a million cases and fail at the next. A proof covers every case at once. Euclid’s method also made assumptions visible. Questioning one assumption, the parallel postulate, led to new geometries that turned out to describe the universe.',
    sym: [['≅', 'is congruent to', 'same shape and size'], ['~', 'is similar to', 'same shape'], ['∴', 'therefore'], ['∎ or QED', 'end of proof', 'quod erat demonstrandum'], ['AB̄', 'segment AB']],
    words: [['Axiom / postulate', 'a starting assumption'], ['Theorem', 'a proven statement'], ['Lemma', 'a helper theorem'], ['Corollary', 'a quick consequence of a theorem'], ['Converse', 'swapping “if” and “then”; not automatically true'], ['Counterexample', 'one case that disproves a general claim']],
    hist: [
      ['6th century BCE', 'Thales of Miletus', 'Traditionally the first to prove geometric facts rather than just use them.'],
      ['c. 300 BCE', 'Euclid, Alexandria', 'Elements: 13 books built from definitions and five postulates. It was a core textbook for over 2,000 years.'],
      ['11th–13th centuries', 'Omar Khayyam; Nasir al-Din al-Tusi', 'Studied the parallel postulate in Persia; their work influenced later European attempts.'],
      ['1829–1854', 'Lobachevsky; Bolyai; Gauss; Riemann', 'Non-Euclidean geometries where the parallel postulate fails; Gauss had the idea privately but did not publish.'],
      ['1899', 'David Hilbert', 'Rewrote Euclid’s foundations with complete axioms, closing gaps Euclid had filled by looking at diagrams.'],
    ],
    uses: [['Law and argument', 'Lincoln studied Euclid to sharpen his reasoning; proof is the model for airtight argument'], ['Engineering and architecture', 'Congruence and similarity in design and scale models'], ['Computer science', 'Proving programs correct; geometric algorithms in maps and games'], ['Physics', 'Curved geometry in general relativity and GPS']],
    master: ['Before proving, draw the figure and mark what is given.', 'Work backwards: what would you need to know to conclude this?', 'Try to break a claim with a counterexample before trying to prove it.', 'Read Euclid’s first propositions with the online diagrams.'],
    prac: [['Two angles of a triangle are equal. What can you say about the opposite sides?', 'They are equal (converse of the isosceles theorem).'], ['True or false: all rectangles are similar.', 'False: a 1×2 and a 1×5 rectangle have different shapes.'], ['Angles of a triangle drawn on a sphere sum to…', 'more than 180°']],
    labs: ['play-pythag', 'play-perspective', 'play-paradoxes'], pre: ['geo1'], next: ['proofs', 'coord', 'diffgeo'],
    read: [['Euclid’s Elements with interactive diagrams (Clark University)', 'https://mathcs.clarku.edu/~djoyce/java/elements/elements.html'], ['Khan Academy: geometry proofs', 'https://www.khanacademy.org/math/geometry']],
  });

  T(3, 'coord', {
    t: 'Coordinate geometry and conic sections',
    big: 'Give every point an address (x, y) and every shape becomes an equation, so geometry problems become algebra problems.',
    learn: [
      'René Descartes and Pierre de Fermat had the same idea in the 1630s: describe points by numbers. Once a point is (x, y), a line is an equation like y = 2x + 1, a circle of radius 5 centred at the origin is x² + y² = 25 (that is Pythagoras), and a question such as “where do they meet?” becomes “solve these equations together”.',
      'Useful formulas follow from Pythagoras and averages. Distance between (x₁, y₁) and (x₂, y₂): √((x₂ − x₁)² + (y₂ − y₁)²). Midpoint: ((x₁ + x₂)/2, (y₁ + y₂)/2). Slope: (y₂ − y₁)/(x₂ − x₁). Parallel lines share a slope; perpendicular slopes multiply to −1.',
      'Slice a cone with a flat plane and you get the conic sections: a circle, an ellipse (a stretched circle), a parabola (a U), or a hyperbola (two opposite curves). Each has a simple equation: ellipse x²/a² + y²/b² = 1, parabola y = x², hyperbola x²/a² − y²/b² = 1.',
      'Conics turn up everywhere. Planets move in ellipses, to a very good approximation, with the Sun at one focus. A parabolic dish sends every incoming ray parallel to its axis to one point, which is how satellite dishes and solar cookers work. A ball thrown in the air follows a parabola, if air resistance is ignored.',
    ],
    ex: [
      ['Find the equation of the circle with centre (2, −1) and radius 3.', ['A point is on the circle if its distance from (2, −1) is 3.', 'Distance formula squared: (x − 2)² + (y + 1)² = 9.']],
      ['Where do y = x² and y = x + 2 meet?', ['Set equal: x² = x + 2, so x² − x − 2 = 0.', '(x − 2)(x + 1) = 0, so x = 2 or −1.', 'Points: (2, 4) and (−1, 1).']],
    ],
    why: 'Coordinates work because they turn the distance between points into arithmetic (Pythagoras) and straightness into a constant slope. Conics share one definition: points whose distance to a fixed point (focus) divided by the distance to a fixed line is constant. Less than 1 gives an ellipse, exactly 1 a parabola, more than 1 a hyperbola.',
    sym: [['(x, y)', 'coordinates', 'across, then up'], ['m', 'slope'], ['d', 'distance'], ['e', 'eccentricity', 'how stretched a conic is (0 for a circle)']],
    words: [['Origin', 'the point (0, 0)'], ['Quadrant', 'one of the four regions the axes make'], ['Focus', 'special point(s) of a conic'], ['Asymptote', 'a line a curve approaches but never reaches'], ['Locus', 'the set of points satisfying a condition']],
    hist: [
      ['c. 200 BCE', 'Apollonius of Perga', 'Wrote Conics and named the ellipse, parabola and hyperbola.'],
      ['1609', 'Johannes Kepler', 'Found that Mars moves in an ellipse, using Tycho Brahe’s observations.'],
      ['1636–1637', 'Fermat; Descartes', 'Invented coordinate geometry independently; Descartes published it as an appendix to his Discourse on Method.'],
      ['1687', 'Isaac Newton', 'Showed that gravity makes orbits conic sections.'],
    ],
    uses: [['Astronomy and spaceflight', 'Orbits are ellipses; escape paths are hyperbolas'], ['Engineering', 'Satellite dishes, car headlights and telescopes use parabolic mirrors'], ['Medicine', 'Kidney-stone lithotripters use an ellipse: shock waves from one focus meet at the other'], ['Maps and games', 'Every screen point and GPS position is a coordinate pair']],
    master: ['Sketch the graph before and after solving.', 'Derive the distance formula from Pythagoras once.', 'Complete the square to recognize a conic from its equation.', 'Use a graphing tool to vary a and b in each conic equation.'],
    prac: [['Distance from (−1, 3) to (5, 11)', '10'], ['Midpoint of (2, 8) and (6, −2)', '(4, 3)'], ['Slope perpendicular to slope 2/3', '−3/2'], ['Centre and radius of x² + y² − 6x = 0', '(3, 0), radius 3']],
    gen: 'coord', labs: ['math-functions', 'play-seasons', 'play-mercator'], pre: ['alg', 'geo1'], next: ['trig', 'multi', 'alggeo'],
    read: [['OpenStax: Precalculus 2e, chapter 10 (conics)', 'https://openstax.org/details/books/precalculus-2e'], ['Khan Academy: conic sections', 'https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:conics']],
  });

  T(3, 'trig', {
    t: 'Trigonometry',
    big: 'Trigonometry links angles to lengths; sine and cosine also describe anything that repeats, from sound to tides.',
    learn: [
      'In a right triangle, pick one of the small angles θ. Sine is opposite ÷ hypotenuse, cosine is adjacent ÷ hypotenuse, and tangent is opposite ÷ adjacent (SOH-CAH-TOA). These ratios depend only on the angle, not the size of the triangle, because all right triangles with that angle are similar. So if you know one angle and one side, you can find the rest.',
      'The unit circle extends trig to every angle. Walk around a circle of radius 1: at angle θ your position is (cos θ, sin θ). As you go round, sin θ rises and falls in a smooth wave. That is why sine and cosine describe sound, light, alternating current, tides and seasons: anything that goes round in cycles.',
      'Angles can be measured in degrees or radians. A radian is the angle that cuts an arc equal to the radius; a full turn is 2π radians, so 180° = π. Calculus formulas are simplest in radians.',
      'The key identity, sin²θ + cos²θ = 1, is just Pythagoras on the unit circle. The laws of sines and cosines extend trig to triangles without right angles, which is how surveyors mapped whole countries.',
    ],
    ex: [
      ['A ramp rises at 6° and is 10 m long. How high does it climb?', ['Opposite = hypotenuse × sin θ.', '10 × sin 6° ≈ 10 × 0.1045 ≈ 1.05 m.']],
      ['From 50 m away, the top of a tower is at an angle of 35°. How tall is it?', ['tan 35° = height/50.', 'height = 50 × 0.7002 ≈ 35 m.']],
    ],
    why: 'Sine and cosine are ratios of similar triangles, so they are fixed for each angle. The wave shape appears because the height of a point moving steadily round a circle changes fastest as it crosses the middle and slowest at the top and bottom, which is exactly a sine curve.',
    sym: [['sin, cos, tan', 'sine, cosine, tangent'], ['θ', 'theta', 'an angle'], ['rad', 'radians', '2π rad = 360°'], ['sin⁻¹ or arcsin', 'inverse sine', 'the angle with a given sine'], ['A sin(ωt + φ)', 'a wave', 'amplitude, frequency, phase']],
    words: [['Hypotenuse, opposite, adjacent', 'sides named relative to the angle'], ['Amplitude', 'height of a wave'], ['Period', 'length of one cycle'], ['Frequency', 'cycles per second (hertz)'], ['Identity', 'an equation true for every angle']],
    hist: [
      ['c. 140 BCE', 'Hipparchus, Rhodes', 'Built the first known table of chords for astronomy.'],
      ['499', 'Aryabhata, India', 'Tabulated half-chords (jya), our sine. Through Arabic and a Latin mistranslation the word became “sinus”, meaning a fold or bay.'],
      ['10th–13th centuries', 'Abu al-Wafa; Nasir al-Din al-Tusi', 'Developed tangent and new identities and treated trigonometry as a subject of its own, separate from astronomy.'],
      ['1464', 'Regiomontanus, Germany', 'On Triangles organized trigonometry for European astronomers and navigators.'],
      ['1802–1871', 'Great Trigonometrical Survey of India', 'Measured the subcontinent by triangulation; the computer Radhanath Sikdar is credited with the calculations that showed Peak XV, later named Everest, was the highest.'],
    ],
    uses: [['Surveying and navigation', 'Triangulation maps land, places ships and finds GPS positions'], ['Music and sound', 'Every sound is a sum of sine waves; synthesizers build sounds this way'], ['Engineering', 'Forces on slopes, roof angles, alternating current'], ['Games and graphics', 'Rotating objects and cameras uses sine and cosine'], ['Astronomy', 'Measuring star distances by parallax']],
    master: ['Learn the special angles 0°, 30°, 45°, 60°, 90° from two triangles, not by rote.', 'Always check your calculator is in degrees or radians as needed.', 'Draw the unit circle from memory.', 'Use the Circles → waves lab to see sine as motion.'],
    prac: [['sin 30°', '½'], ['cos 60°', '½'], ['tan 45°', '1'], ['Convert 90° to radians', 'π/2']],
    gen: 'trig', labs: ['math-circle', 'play-fourier', 'play-harmonics', 'play-seasons', 'play-eratosthenes'], pre: ['geo1', 'coord'], next: ['precalc', 'calc1', 'pde'],
    read: [['OpenStax: Precalculus 2e, chapters 5–7', 'https://openstax.org/details/books/precalculus-2e'], ['Khan Academy: trigonometry', 'https://www.khanacademy.org/math/trigonometry']],
  });

  T(3, 'precalc', {
    t: 'Sequences, series, vectors, matrices and limits',
    big: 'Pre-calculus collects the tools calculus needs: patterns that go on forever, arrows with direction, grids of numbers, and the idea of “getting closer and closer”.',
    learn: [
      'A sequence is an ordered list: 3, 7, 11, 15, … (arithmetic: add 4 each time) or 2, 6, 18, 54, … (geometric: multiply by 3). A series adds up a sequence. Some infinite series have finite sums: ½ + ¼ + ⅛ + … = 1. Walk half the way to a wall, then half the rest, forever: you never stop taking steps, yet the total distance is finite.',
      'A vector is an arrow with size and direction, written like (3, 4). Velocity, force and wind are vectors. Add vectors tip to tail: a plane flying north at 200 km/h in a 50 km/h east wind actually travels in the direction of (50, 200).',
      'A matrix is a grid of numbers. Multiplying a vector by a matrix moves it: the matrix [[0, −1], [1, 0]] rotates every point 90°. Matrices store systems of equations, images (a grid of pixel values) and the connections in networks.',
      'A limit describes what a value approaches. As x gets closer to 0, (sin x)/x gets closer to 1, even though at x = 0 it is undefined. Limits let calculus talk about instants and infinitely small pieces without dividing by zero.',
    ],
    ex: [
      ['Find the 20th term and the sum of the first 20 terms of 3, 7, 11, …', ['nth term: 3 + 4(n − 1). 20th: 3 + 76 = 79.', 'Sum = n × (first + last)/2 = 20 × (3 + 79)/2 = 820.']],
      ['Sum 5 + 5/3 + 5/9 + … forever.', ['Geometric with first term 5 and ratio ⅓.', 'Sum = a/(1 − r) = 5/(⅔) = 7.5.']],
      ['What does (x² − 1)/(x − 1) approach as x → 1?', ['Factor: (x − 1)(x + 1)/(x − 1) = x + 1 when x ≠ 1.', 'As x → 1 this approaches 2.']],
    ],
    why: 'The geometric series formula works because if S = a + ar + ar² + …, then rS = ar + ar² + …, and subtracting gives S − rS = a, so S = a/(1 − r) when |r| < 1. The arithmetic series trick is the young Gauss’s (in a famous but possibly embellished story): pair the first and last terms, which all add to the same total.',
    sym: [['aₙ', 'a sub n', 'the n-th term'], ['Σ', 'sigma', 'sum: Σₙ₌₁¹⁰ n = 55'], ['lim_{x→a}', 'limit as x approaches a'], ['→', 'approaches'], ['∞', 'infinity', 'without bound'], ['v⃗ or **v**', 'vector v'], ['[aᵢⱼ]', 'matrix', 'entry in row i, column j']],
    words: [['Converge', 'settle toward a finite value'], ['Diverge', 'not settle (grow without bound or oscillate)'], ['Common ratio', 'the multiplier in a geometric sequence'], ['Magnitude', 'the length of a vector'], ['Scalar', 'an ordinary number, as opposed to a vector']],
    hist: [
      ['5th century BCE', 'Zeno of Elea', 'Paradoxes such as Achilles and the tortoise asked how infinitely many steps could finish. Limits answer him.'],
      ['c. 250 BCE and c. 1350', 'Archimedes; Nicole Oresme', 'Archimedes summed a geometric series to find the area of a parabola; Oresme proved that 1 + ½ + ⅓ + ¼ + … grows without bound.'],
      ['c. 1400', 'Madhava of Sangamagrama, India', 'Founded the Kerala school, which found infinite series for π, sine and cosine about 250 years before European mathematicians. Whether this knowledge reached Europe is unproven.'],
      ['1843–1880s', 'Hamilton; Grassmann; Gibbs; Heaviside', 'Built the algebra of vectors used in physics.'],
      ['1821 and 1850s–60s', 'Augustin-Louis Cauchy; Karl Weierstrass', 'Made limits precise, answering critics like Bishop Berkeley, who in 1734 mocked infinitesimals as “ghosts of departed quantities”.'],
    ],
    uses: [['Finance', 'Loan and pension payments are geometric series'], ['Physics and games', 'Forces, velocities and movement are vectors'], ['Graphics and AI', 'Every image transformation and neural network layer is a matrix multiplication'], ['Medicine', 'Repeated doses build up as a geometric series toward a steady level']],
    master: ['Write out the first few terms before using any formula.', 'Draw vectors as arrows and add them tip to tail.', 'Do 2×2 matrix multiplications by hand until they feel natural.', 'Evaluate limits numerically with a calculator (x = 0.1, 0.01, 0.001) before doing them by algebra.'],
    prac: [['Sum of 1 + 2 + … + 100', '5,050'], ['Sum of 8 + 4 + 2 + … forever', '16'], ['Length of the vector (5, 12)', '13'], ['lim_{x→∞} 3x/(x + 1)', '3']],
    gen: 'seq', labs: ['play-zeno', 'play-matrix', 'play-compound', 'play-dosing'], pre: ['alg', 'trig'], next: ['calc1', 'series', 'linalg'],
    read: [['OpenStax: Precalculus 2e', 'https://openstax.org/details/books/precalculus-2e'], ['Khan Academy: precalculus', 'https://www.khanacademy.org/math/precalculus'], ['3Blue1Brown: Essence of Linear Algebra', 'https://www.3blue1brown.com/lessons/eola-preview/']],
  });
})();
