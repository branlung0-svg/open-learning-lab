/* Math path, tiers 4–5: introductory college math and the bridge to pure math. */
(function () {
  const M = (Lab.MATH = Lab.MATH || { topics: [], by: {} });
  M.T = M.T || ((tier, id, o) => { o.id = id; o.tier = tier; M.topics.push(o); M.by[id] = o; });
  const T = M.T;

  // ───────────────────────── Tier 4: Introductory college math ─────────────────────────
  T(4, 'calc1', {
    t: 'Calculus I: derivatives (rates of change)',
    big: 'A derivative is the speed at one instant: how fast something is changing right now.',
    learn: [
      'Average speed is distance ÷ time. But a car’s speedometer shows speed at an instant, when no time passes. The derivative solves this: measure the change over a tiny interval h, divide by h, and see what the ratio approaches as h shrinks toward 0. Geometrically, it is the slope of the curve at one point, the slope of the tangent line.',
      'Take f(x) = x². Over a small step h, the change is (x + h)² − x² = 2xh + h². Divide by h: 2x + h. As h → 0 this approaches 2x. So the derivative of x² is 2x: at x = 3 the curve is climbing at slope 6.',
      'A few rules cover most functions. Power rule: the derivative of xⁿ is nxⁿ⁻¹. Constants multiply through, and sums split. Product rule: (fg)′ = f′g + fg′. Chain rule, for a function inside a function: the derivative of f(g(x)) is f′(g(x)) · g′(x). Also: (eˣ)′ = eˣ, (sin x)′ = cos x, (ln x)′ = 1/x.',
      'Derivatives find maximums and minimums: at the top of a hill the slope is zero. A company maximizes profit, an engineer minimizes material, and a machine-learning model minimizes its error, all by finding where a derivative is zero or by following the slope downhill.',
    ],
    ex: [
      ['A stone falls s(t) = 4.9t² metres after t seconds. How fast after 3 s?', ['v(t) = s′(t) = 9.8t.', 'v(3) = 29.4 m/s.']],
      ['A farmer has 100 m of fence for a rectangle against a wall (3 sides fenced). Maximize the area.', ['Sides x, x and 100 − 2x. Area A = x(100 − 2x) = 100x − 2x².', 'A′ = 100 − 4x = 0 gives x = 25.', 'Area = 25 × 50 = 1,250 m².']],
      ['Differentiate (3x² + 1)⁵.', ['Chain rule: 5(3x² + 1)⁴ × 6x.', '= 30x(3x² + 1)⁴.']],
    ],
    why: 'The derivative is defined as a limit, f′(x) = lim_{h→0} (f(x + h) − f(x))/h. The rules are all consequences of this one definition: for example, the power rule comes from expanding (x + h)ⁿ with the binomial theorem and noticing that every term except nxⁿ⁻¹h has h² or more, which vanishes after dividing by h and letting h → 0.',
    sym: [['f′(x)', 'f prime of x', 'derivative (Lagrange’s notation)'], ['dy/dx', 'dee y by dee x', 'derivative (Leibniz’s notation): tiny change in y over tiny change in x'], ['ẋ', 'x dot', 'time derivative (Newton’s notation)'], ['f″(x)', 'second derivative', 'rate of change of the rate: acceleration'], ['lim', 'limit']],
    words: [['Tangent line', 'the line that just touches a curve at a point'], ['Instantaneous rate', 'rate at one moment'], ['Critical point', 'where f′ = 0 or is undefined'], ['Concave up / down', 'curving like a cup / a cap'], ['Optimization', 'finding the best value']],
    hist: [
      ['c. 1350–1550', 'Kerala school, India', 'Madhava and his successors derived infinite series that calculus later reproduced, though without a general theory of derivatives.'],
      ['1630s', 'Pierre de Fermat', 'Found maximums and tangents by a method close to setting the derivative to zero.'],
      ['1665–1666', 'Isaac Newton', 'Developed his “method of fluxions” in his twenties while Cambridge was closed by plague; he published it much later.'],
      ['1684', 'Gottfried Leibniz', 'Published calculus first, with the dy/dx and ∫ notation we still use. A bitter priority dispute followed; a 1712 Royal Society report favouring Newton was drafted by Newton himself.'],
    ],
    uses: [['Physics', 'Velocity is the derivative of position; acceleration, of velocity'], ['Economics', 'Marginal cost and marginal revenue are derivatives'], ['Machine learning', 'Training follows derivatives (gradients) downhill to reduce error'], ['Medicine', 'Rate of tumour growth or drug elimination'], ['Engineering', 'Designing for maximum strength or minimum cost']],
    master: ['Compute a few derivatives from the limit definition before using rules.', 'Drill the rules until they are reflexes, then do word problems.', 'Always sketch the function and its derivative side by side.', 'Check answers numerically: (f(x + 0.001) − f(x))/0.001 should be close.'],
    prac: [['d/dx of 4x³ − 2x + 7', '12x² − 2'], ['Slope of y = √x at x = 9', '1/6'], ['d/dx of x·eˣ', 'eˣ + xeˣ'], ['Minimum of x² − 6x + 10', '1, at x = 3']],
    gen: 'deriv', labs: ['play-derivative', 'math-calculus', 'play-perceptron'], pre: ['alg', 'precalc'], next: ['calc2', 'multi', 'ode', 'optim'],
    read: [['OpenStax: Calculus Volume 1', 'https://openstax.org/details/books/calculus-volume-1'], ['MIT OCW 18.01SC Single Variable Calculus', 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/'], ['3Blue1Brown: Essence of Calculus', 'https://www.3blue1brown.com/lessons/essence-of-calculus/']],
  });

  T(4, 'calc2', {
    t: 'Calculus II: integrals and the fundamental theorem',
    big: 'An integral adds up infinitely many tiny pieces; the fundamental theorem says integrating undoes differentiating.',
    learn: [
      'To find the area under a curve, slice it into thin rectangles, add their areas, and let the slices get thinner. The limit of these sums is the definite integral, written ∫ₐᵇ f(x) dx: the ∫ is a stretched S for “sum”, and dx is the width of a slice.',
      'Integrals add up anything that accumulates. If a car’s speed is v(t), the distance travelled is ∫ v(t) dt. If water flows into a tank at rate r(t), the total is ∫ r(t) dt. Volumes, work, probability, total dose, and the centre of mass are all integrals.',
      'The fundamental theorem of calculus connects the two halves of calculus. If F is any function whose derivative is f (an antiderivative), then ∫ₐᵇ f(x) dx = F(b) − F(a). So to find the area under x² from 0 to 3, find a function whose derivative is x²: that is x³/3. Then the area is 27/3 − 0 = 9.',
      'Finding antiderivatives is a skill: reverse the power rule (∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C), undo the chain rule (substitution), and undo the product rule (integration by parts). Many integrals have no formula at all and are computed numerically.',
    ],
    ex: [
      ['∫₀² (3x² + 2x) dx', ['Antiderivative: x³ + x².', 'At 2: 8 + 4 = 12. At 0: 0.', 'Answer: 12.']],
      ['A car accelerates with speed v(t) = 2t m/s. How far does it go in 10 s?', ['Distance = ∫₀¹⁰ 2t dt = t² from 0 to 10.', '= 100 m.']],
    ],
    why: 'Why does integrating undo differentiating? Let A(x) be the area under f from a to x. Nudge x by a tiny h: the area grows by a thin strip about f(x) wide and h long, so A(x + h) − A(x) ≈ f(x)·h. Divide by h and let h → 0: A′(x) = f(x). The area function is an antiderivative of f, which is the whole theorem.',
    sym: [['∫ f(x) dx', 'integral of f', 'antiderivative (indefinite integral)'], ['∫ₐᵇ', 'integral from a to b', 'definite integral: a number'], ['+ C', 'constant of integration', 'antiderivatives differ by a constant'], ['F(b) − F(a)', 'evaluate and subtract'], ['Δx', 'width of a slice']],
    words: [['Riemann sum', 'a sum of rectangle areas approximating an integral'], ['Antiderivative', 'a function whose derivative is f'], ['Substitution', 'reversing the chain rule'], ['Integration by parts', 'reversing the product rule'], ['Improper integral', 'an integral over an infinite range']],
    hist: [
      ['c. 250 BCE', 'Archimedes', 'Found the area of a parabolic segment and the volume of a sphere by slicing and an argument by exhaustion.'],
      ['3rd and 5th centuries', 'Liu Hui; Zu Chongzhi and Zu Geng, China', 'Computed π by polygons and found the sphere’s volume using the principle that solids with equal cross-sections have equal volumes, later rediscovered by Cavalieri.'],
      ['c. 1000', 'Ibn al-Haytham, Cairo', 'Summed fourth powers to find the volume of a paraboloid.'],
      ['1660s–1680s', 'Isaac Barrow; Newton; Leibniz', 'Recognized and used the fundamental theorem; Leibniz introduced the ∫ sign in 1675.'],
      ['1854', 'Bernhard Riemann', 'Gave a precise definition of the integral as a limit of sums.'],
    ],
    uses: [['Physics and engineering', 'Work, energy, centre of mass, fluid pressure on a dam'], ['Medicine', 'Total drug exposure is the area under the concentration curve (AUC)'], ['Probability', 'Probabilities of continuous outcomes are areas under a density curve'], ['Economics', 'Consumer surplus; total revenue from a rate'], ['Climate', 'Total emissions from yearly rates; cumulative warming']],
    master: ['Sketch the area you are computing.', 'Always differentiate your antiderivative to check it.', 'Practise substitution and parts until you can tell which to try.', 'Use a numerical sum in a spreadsheet to confirm definite integrals.'],
    prac: [['∫ 6x² dx', '2x³ + C'], ['∫₁⁴ (1/√x) dx', '2'], ['∫₀^π sin x dx', '2'], ['Area between y = x and y = x² from 0 to 1', '1/6']],
    gen: 'integ', labs: ['play-riemann', 'math-calculus', 'play-pidarts'], pre: ['calc1'], next: ['series', 'multi', 'prob', 'measure'],
    read: [['OpenStax: Calculus Volume 1, chapter 5', 'https://openstax.org/details/books/calculus-volume-1'], ['OpenStax: Calculus Volume 2', 'https://openstax.org/details/books/calculus-volume-2'], ['Active Calculus (free textbook)', 'https://activecalculus.org/']],
  });

  T(4, 'series', {
    t: 'Infinite series and Taylor series',
    big: 'Many functions can be written as an infinite polynomial, which lets you compute them and approximate them to any accuracy.',
    learn: [
      'An infinite series converges if its partial sums settle on a number. ½ + ¼ + ⅛ + … converges to 1. The harmonic series 1 + ½ + ⅓ + ¼ + … does not: it grows forever, though incredibly slowly. Tests tell you which is which: the ratio test settles the first, but for the harmonic series it gives no answer, and the integral test is needed.',
      'A Taylor series rebuilds a function from its derivatives at one point. Near 0: eˣ = 1 + x + x²/2! + x³/3! + …, sin x = x − x³/3! + x⁵/5! − …, cos x = 1 − x²/2! + x⁴/4! − …. Taking only the first few terms gives approximations, which is how physicists simplify problems: for small angles sin x ≈ x, which turns a hard pendulum equation into an easy one.',
      'Plugging ix into the series for eˣ and sorting real and imaginary parts gives Euler’s formula e^(ix) = cos x + i sin x directly. Series also give surprising sums: Euler showed in 1734–35 that 1 + 1/4 + 1/9 + 1/16 + … = π²/6, linking squares of whole numbers to circles.',
      'Fourier series do something similar with waves instead of powers: almost any repeating signal is a sum of sines and cosines. That idea runs through sound compression, image compression and the analysis of heat.',
    ],
    ex: [
      ['Estimate e using the first five terms of its series.', ['1 + 1 + 1/2 + 1/6 + 1/24.', '= 2.7083…; the true value is 2.71828…']],
      ['Use sin x ≈ x − x³/6 to estimate sin(0.5).', ['0.5 − 0.125/6 = 0.5 − 0.0208 = 0.4792.', 'True value: 0.4794. Two terms give three correct digits.']],
    ],
    why: 'A Taylor polynomial is built so its value, slope, curvature and higher derivatives all match the function at one point. For well-behaved functions, matching more derivatives makes it hug the curve over a wider range, though only within the series’ radius of convergence. Taylor’s theorem bounds the error, so you know how many terms you need.',
    sym: [['Σₙ₌₀^∞', 'sum from n = 0 to infinity'], ['n!', 'n factorial', '1 × 2 × … × n; 0! = 1'], ['f⁽ⁿ⁾(a)', 'n-th derivative at a'], ['Rₙ', 'remainder', 'the error after n terms']],
    words: [['Partial sum', 'the sum of the first n terms'], ['Convergent / divergent', 'settles / does not settle'], ['Radius of convergence', 'how far from the centre the series works'], ['Power series', 'Σ cₙ(x − a)ⁿ'], ['Maclaurin series', 'a Taylor series centred at 0']],
    hist: [
      ['c. 1400', 'Madhava, Kerala', 'Series for π, sine and cosine, recorded in later Kerala texts such as the Yuktibhasa (c. 1530).'],
      ['1671–1715', 'James Gregory; Newton; Leibniz; Brook Taylor', 'Series for arctangent, the binomial series, and Taylor’s general method (1715).'],
      ['1734–1735', 'Leonhard Euler', 'Solved the Basel problem: the sum of 1/n² is π²/6.'],
      ['1807–1822', 'Joseph Fourier', 'Claimed any function could be written as a sum of sines; it was controversial and drove the later rigour of analysis.'],
    ],
    uses: [['Physics', 'Small-angle and low-speed approximations (Newton’s physics is the first terms of Einstein’s)'], ['Computing', 'Computers evaluate functions like eˣ and sin x using polynomial approximations'], ['Signal processing', 'MP3 and JPEG compression use cosine series'], ['Finance', 'Duration and convexity of bonds are the first two terms of a Taylor expansion']],
    master: ['Memorize the series for eˣ, sin x, cos x and 1/(1 − x).', 'Graph partial sums on top of the function to see convergence.', 'Learn the ratio test well; it handles most cases.', 'Use the Fourier lab to build waves from sines.'],
    prac: [['Does Σ 1/n² converge?', 'Yes (to π²/6)'], ['First three nonzero terms of cos x', '1 − x²/2 + x⁴/24'], ['Sum of Σ (⅔)ⁿ from n = 0', '3']],
    labs: ['play-fourier', 'play-zeno', 'play-harmonics'], pre: ['calc2'], next: ['complexan', 'real', 'pde'],
    read: [['OpenStax: Calculus Volume 2, chapters 5–6', 'https://openstax.org/details/books/calculus-volume-2'], ['MIT OCW 18.01SC', 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/']],
  });

  T(4, 'multi', {
    t: 'Calculus III: multivariable and vector calculus',
    big: 'The world has more than one variable: multivariable calculus handles surfaces, flows and fields in 3D.',
    learn: [
      'A function of two variables, like the height of a landscape h(x, y), has a slope in every direction. A partial derivative ∂h/∂x is the slope going east, holding y fixed. The gradient ∇h = (∂h/∂x, ∂h/∂y) is an arrow pointing straight uphill, and its length is how steep that is. Hikers, rain and machine-learning algorithms all care about the gradient.',
      'Double and triple integrals add up over areas and volumes: the mass of a plate with varying density, or the total rainfall over a region.',
      'A vector field attaches an arrow to every point: wind on a weather map, water flow in a river, the force around a magnet. Divergence measures how much a field spreads out from a point (a source); curl measures how much it swirls.',
      'The big theorems (Green’s, Stokes’, Gauss’s divergence theorem) say the same thing in different dimensions: what happens inside a region can be measured on its boundary. The total flow out of a closed surface equals the total of the sources inside. Maxwell’s equations of electromagnetism are written in this language.',
    ],
    ex: [
      ['For f(x, y) = x²y + 3y, find ∂f/∂x and ∂f/∂y at (1, 2).', ['∂f/∂x = 2xy = 4.', '∂f/∂y = x² + 3 = 4.', 'Gradient (4, 4): steepest climb is diagonal.']],
      ['Maximize xy subject to x + y = 10 using a Lagrange multiplier.', ['Set ∇(xy) = λ∇(x + y): y = λ and x = λ.', 'So x = y = 5 and the maximum is 25.']],
    ],
    why: 'The gradient points uphill because the slope in any direction u is the dot product ∇f · u, which is biggest when u points along ∇f. The boundary theorems work because, when you add up the tiny flows across all the little internal walls of a region, each internal wall is counted twice with opposite signs and cancels, leaving only the outer boundary.',
    sym: [['∂f/∂x', 'partial f by partial x'], ['∇f', 'del f, grad f', 'the gradient'], ['∇·F', 'div F', 'divergence'], ['∇×F', 'curl F'], ['∬, ∭', 'double, triple integral'], ['∮', 'integral around a closed loop']],
    words: [['Level curve', 'a contour line where f is constant'], ['Vector field', 'an arrow at every point'], ['Flux', 'flow through a surface'], ['Lagrange multiplier', 'a tool for optimizing with a constraint'], ['Jacobian', 'the scaling factor when changing coordinates']],
    hist: [
      ['1700s', 'Euler; Clairaut; d’Alembert', 'Partial derivatives appear in mechanics and the study of vibrating strings.'],
      ['1788', 'Joseph-Louis Lagrange', 'Analytical Mechanics: mechanics with no diagrams and the method of multipliers.'],
      ['1828', 'George Green', 'A self-taught miller from Nottingham published his theorem privately; it was rediscovered years later.'],
      ['1850s–1880s', 'Kelvin; Stokes; Maxwell; Heaviside', 'Stokes’ theorem appeared on a Cambridge exam in 1854; Heaviside rewrote Maxwell’s 20 equations as four in vector form.'],
    ],
    uses: [['Weather and climate', 'Wind, pressure and temperature fields'], ['Electromagnetism', 'Maxwell’s equations behind radio, power and light'], ['Machine learning', 'Gradient descent on functions of millions of variables'], ['Economics', 'Optimizing with budget constraints'], ['Medicine', 'Blood flow and diffusion in tissue']],
    master: ['Visualize everything with 3D graphing tools.', 'Practise switching coordinates (polar, cylindrical, spherical).', 'Learn what each big theorem means physically, not only the formula.', 'Work through MIT 18.02 problem sets.'],
    prac: [['∇ of x² + y²', '(2x, 2y)'], ['∂/∂y of x³y² ', '2x³y'], ['Area of a circle of radius R as a double integral in polar coordinates', '∫₀^{2π}∫₀^R r dr dθ = πR²']],
    labs: ['play-perceptron', 'play-graddescent', 'play-efield'], pre: ['calc2', 'coord'], next: ['pde', 'diffgeo', 'optim'],
    read: [['OpenStax: Calculus Volume 3', 'https://openstax.org/details/books/calculus-volume-3'], ['MIT OCW 18.02SC Multivariable Calculus', 'https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/'], ['Khan Academy: multivariable calculus', 'https://www.khanacademy.org/math/multivariable-calculus']],
  });

  T(4, 'linalg', {
    t: 'Linear algebra',
    big: 'Linear algebra is the mathematics of many numbers at once: vectors as points or data, matrices as ways to move them.',
    learn: [
      'A vector can be an arrow in space, a list of data (a person’s height, weight and age), or a pixel colour. A matrix is a grid that transforms vectors: it can rotate, stretch, shear or flatten space. Multiplying matrices means doing one transformation after another, which is why the order matters: rotating then stretching is different from stretching then rotating.',
      'Solving many linear equations at once is the core skill. Write them as Ax = b and eliminate unknowns row by row (Gaussian elimination). Computers solve systems with millions of unknowns this way for simulations, statistics and graphics.',
      'The determinant tells you how a matrix scales area (or volume). If it is 0, the matrix squashes space flat and can’t be undone: the system has no unique solution.',
      'Eigenvectors are directions that a matrix only stretches, without turning: Av = λv. The stretch factor λ is the eigenvalue. For [[2, 1], [1, 2]], the direction (1, 1) is stretched by 3 and (1, −1) by 1. Eigenvectors reveal the natural axes of a problem: the main directions of variation in data, the vibration modes of a bridge, the long-run state of a process, and the ranking of web pages.',
    ],
    ex: [
      ['Solve x + 2y = 5, 3x + 4y = 11 with elimination.', ['Subtract 3 × (row 1) from row 2: −2y = −4.', 'y = 2, then x = 1.']],
      ['Find the determinant of [[3, 1], [2, 4]] and say what it means.', ['ad − bc = 12 − 2 = 10.', 'The matrix scales every area by 10.']],
    ],
    why: 'Linear means “respects addition and scaling”: A(u + v) = Au + Av and A(cv) = cAv. Because of that, knowing what A does to a few basis vectors (like (1, 0) and (0, 1)) tells you what it does to every vector. The columns of a matrix are exactly where the basis vectors land, which is why matrix multiplication is defined the way it is.',
    sym: [['A, B', 'matrices'], ['Ax = b', 'a linear system'], ['det A or |A|', 'determinant'], ['A⁻¹', 'inverse', 'undoes A'], ['Aᵀ', 'transpose', 'rows become columns'], ['λ', 'lambda', 'an eigenvalue'], ['u · v', 'dot product', 'measures alignment']],
    words: [['Basis', 'a minimal set of vectors that builds every vector'], ['Dimension', 'number of vectors in a basis'], ['Span', 'everything you can build from some vectors'], ['Linearly independent', 'no vector is a combination of the others'], ['Rank', 'how many independent directions survive the transformation'], ['Orthogonal', 'perpendicular']],
    hist: [
      ['c. 100 CE', 'China', 'Chapter 8 of the Nine Chapters (fangcheng) solved systems by an elimination method on a counting board, about 1,600 years before Gauss.'],
      ['1683 and 1693', 'Seki Takakazu; Leibniz', 'Determinants, found independently in Japan and Germany.'],
      ['1844–1858', 'Hermann Grassmann; Arthur Cayley', 'Grassmann imagined spaces of any dimension; Cayley created matrix algebra.'],
      ['1904', 'David Hilbert', 'Popularized the prefix “eigen-” (German for “own”).'],
      ['1998', 'Sergey Brin and Larry Page', 'PageRank ranked web pages by finding an eigenvector of the web’s link matrix.'],
    ],
    uses: [['AI', 'Neural networks are mostly matrix multiplications; GPUs are built for them'], ['Graphics and games', 'Every 3D rotation and camera view is a matrix'], ['Statistics', 'Regression and principal component analysis'], ['Economics', 'Leontief’s input–output model of an economy'], ['Quantum mechanics', 'States are vectors; measurements are matrices'], ['Engineering', 'Structural analysis solves huge linear systems']],
    master: ['Watch 3Blue1Brown’s series to see matrices as motions.', 'Do elimination by hand on 3×3 systems until fluent, then use software.', 'Always ask what a matrix does geometrically.', 'Follow Gilbert Strang’s MIT 18.06 lectures, free online.'],
    prac: [['[[1, 2], [3, 4]] times (1, 1)', '(3, 7)'], ['det [[2, 5], [1, 3]]', '1'], ['Eigenvalues of [[4, 0], [0, −1]]', '4 and −1'], ['Is (1, 2) perpendicular to (−2, 1)?', 'Yes (dot product 0)']],
    gen: 'matrix', labs: ['play-matrix', 'play-perceptron', 'play-kmeans', 'play-regression'], pre: ['alg', 'precalc'], next: ['ode', 'absalg', 'func', 'ml', 'numer'],
    read: [['MIT OCW 18.06SC Linear Algebra (Gilbert Strang)', 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/'], ['Linear Algebra Done Right, 4th ed. (free, Sheldon Axler)', 'https://linear.axler.net/'], ['3Blue1Brown: Essence of Linear Algebra', 'https://www.3blue1brown.com/lessons/eola-preview/']],
  });

  T(4, 'ode', {
    t: 'Ordinary differential equations',
    big: 'A differential equation is a rule for how something changes; solving it predicts the future from the present.',
    learn: [
      'Newton’s second law says acceleration is force divided by mass. Acceleration is a second derivative of position, so the law is a differential equation: it tells you how position changes, given the forces. Solve it and you predict a planet’s orbit or a rocket’s path.',
      'The simplest one is dy/dt = ky: the rate of change is proportional to the amount. Its solution is y = y₀eᵏᵗ: exponential growth (k > 0) or decay (k < 0). Money, populations at first, radioactive atoms and cooling coffee all follow versions of it.',
      'Real growth hits limits. The logistic equation dP/dt = rP(1 − P/K) grows exponentially at first and levels off at a carrying capacity K. The SIR model splits a population into susceptible, infected and recovered groups and predicts the rise and fall of an epidemic. Predator–prey equations produce linked cycles of foxes and rabbits.',
      'Most differential equations cannot be solved with a formula. You can still draw a slope field (a little arrow at each point showing which way solutions move) and step along it numerically, which is how computers forecast weather and simulate spacecraft.',
    ],
    ex: [
      ['Coffee at 90 °C sits in a 20 °C room and cools by Newton’s law: dT/dt = −k(T − 20), with k = 0.1 per minute. Temperature after 10 minutes?', ['Solution: T = 20 + 70e^(−0.1t).', 'T(10) = 20 + 70e^(−1) ≈ 20 + 25.8 = 45.8 °C.']],
      ['A population of 1,000 bacteria doubles every 3 hours. Write the equation and find the population after 12 hours.', ['P = 1000 · 2^(t/3).', 'After 12 h: 1000 × 2⁴ = 16,000.']],
    ],
    why: 'If you know where something is now and the rule for how it changes, small steps along the rule trace its future. The Picard–Lindelöf theorem guarantees that for well-behaved rules there is exactly one solution through each starting point, which is why the same starting conditions always give the same prediction in such systems.',
    sym: [['dy/dt', 'rate of change of y over time'], ['y″ + y = 0', 'second-order equation', 'involves the second derivative'], ['y(0) = y₀', 'initial condition'], ['eᵏᵗ', 'exponential solution']],
    words: [['Order', 'the highest derivative in the equation'], ['Initial value problem', 'an equation plus a starting point'], ['Equilibrium', 'a state that does not change'], ['Stable', 'nearby states return to it'], ['Slope field', 'arrows showing the direction of change everywhere']],
    hist: [
      ['1687', 'Isaac Newton', 'Principia expressed motion and gravity in terms that are differential equations.'],
      ['1690s–1700s', 'Leibniz; the Bernoulli brothers; Euler', 'Solved the first families of equations; Johann Bernoulli’s 1696 challenge on the fastest slide (the brachistochrone) drew solutions from Newton, Leibniz and others.'],
      ['1798 and 1838', 'Thomas Malthus; Pierre-François Verhulst', 'Exponential population growth (Malthus) and the logistic curve with a limit (Verhulst).'],
      ['1925–1927', 'Lotka; Volterra; Kermack and McKendrick', 'Predator–prey cycles and the SIR epidemic model.'],
    ],
    uses: [['Medicine and public health', 'Epidemic forecasting, drug levels in the body'], ['Engineering', 'Circuits, suspension systems, control of planes and robots'], ['Ecology', 'Populations, fisheries, invasive species'], ['Space', 'Trajectories for satellites and probes'], ['Economics', 'Growth models, interest compounded continuously']],
    master: ['Classify an equation (order, linear or not) before trying to solve it.', 'Sketch slope fields by hand for simple equations.', 'Simulate with Euler’s method in a spreadsheet and compare with the exact solution.', 'Follow MIT 18.03 for the standard toolkit.'],
    prac: [['Solve dy/dt = 3y with y(0) = 2', 'y = 2e^(3t)'], ['Equilibria of dP/dt = P(1 − P/100)', 'P = 0 and P = 100'], ['A substance has half-life 5 years. What k gives dN/dt = −kN?', 'k = ln 2 / 5 ≈ 0.139 per year']],
    labs: ['play-slopefield', 'play-sir', 'play-lotka', 'play-pendulum', 'play-dosing'], pre: ['calc2', 'explog'], next: ['chaos', 'pde', 'stoch', 'numer'],
    read: [['MIT OCW 18.03SC Differential Equations', 'https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/'], ['Paul’s Online Math Notes: differential equations', 'https://tutorial.math.lamar.edu/Classes/DE/DE.aspx'], ['Khan Academy: differential equations', 'https://www.khanacademy.org/math/differential-equations']],
  });

  T(4, 'discrete', {
    t: 'Discrete mathematics: logic, sets, counting and graphs',
    big: 'Discrete math studies things you can count one by one, like statements, choices and networks, and it is the math of computers.',
    learn: [
      'Logic studies statements that are true or false and how they combine: AND (both), OR (at least one), NOT, and IF…THEN. “If it rains, the ground is wet” is not the same as “if the ground is wet, it rained” (the converse), but it is equivalent to “if the ground is dry, it did not rain” (the contrapositive). Truth tables check every case mechanically, and computer circuits are built from exactly these operations.',
      'A set is a collection: A = {1, 2, 3}. Union (A ∪ B) is everything in either; intersection (A ∩ B) is what is in both. Databases, search engines and probability all use set operations.',
      'Counting is harder than it sounds. The multiplication principle: 3 shirts and 4 trousers give 3 × 4 = 12 outfits. Arranging n things in order: n! ways (5 books: 120 orders). Choosing k from n when order doesn’t matter: C(n, k) = n!/(k!(n − k)!). A lottery picking 6 of 49 has 13,983,816 possible tickets.',
      'A graph is dots (vertices) joined by lines (edges): cities and roads, people and friendships, web pages and links. Graph questions include the shortest route, whether you can visit every edge once, and how to colour a map so neighbours differ.',
    ],
    ex: [
      ['How many ways can a committee of 3 be chosen from 10 people?', ['Order doesn’t matter: C(10, 3).', '= 10 × 9 × 8 / (3 × 2 × 1) = 120.']],
      ['Everyone in a room of 8 shakes hands once with everyone else. How many handshakes?', ['Each of 8 shakes 7 hands: 56, but each handshake is counted twice.', '56 / 2 = 28 = C(8, 2).']],
    ],
    why: 'C(n, k) divides n!/(n − k)! (the ordered choices) by k! because each unordered group of k appears in k! different orders. Euler’s 1736 bridge argument shows why some routes are impossible: every time you pass through a land mass you use two bridges, so a walk crossing every bridge once needs every land mass, except possibly the start and end, to have an even number of bridges.',
    sym: [['∧, ∨, ¬', 'and, or, not'], ['→, ↔', 'implies, if and only if'], ['∈', 'is an element of'], ['⊆', 'is a subset of'], ['∪, ∩', 'union, intersection'], ['C(n, k) or (n k)', 'n choose k'], ['n!', 'n factorial']],
    words: [['Proposition', 'a statement that is true or false'], ['Contrapositive', '“if not B then not A”: equivalent to “if A then B”'], ['Permutation', 'an ordered arrangement'], ['Combination', 'an unordered selection'], ['Vertex, edge', 'dot, line in a graph'], ['Pigeonhole principle', 'put n + 1 things in n boxes and some box has two']],
    hist: [
      ['c. 200 BCE and 10th century', 'Pingala; Halayudha, India', 'Pingala’s work on poetic metres counted patterns of long and short syllables; Halayudha’s 10th-century commentary describes the triangle of binomial coefficients.'],
      ['11th–13th centuries', 'al-Karaji; Jia Xian; Yang Hui', 'The same triangle appears in Persia and China (Yang Hui, 1261) centuries before Pascal’s 1654 treatise.'],
      ['1736', 'Leonhard Euler', 'Proved the Seven Bridges of Königsberg walk impossible, founding graph theory.'],
      ['1847–1854', 'George Boole', 'Turned logic into algebra. In 1937 Claude Shannon showed Boolean algebra describes switching circuits, the basis of digital computers.'],
      ['1976', 'Kenneth Appel; Wolfgang Haken', 'Proved four colours suffice for any map, the first major theorem proved with heavy computer help.'],
    ],
    uses: [['Computing', 'Circuits, databases, algorithms and programming languages'], ['Security', 'Counting passwords and keys tells you how hard they are to guess'], ['Networks', 'Internet routing, social networks, disease contact tracing'], ['Logistics', 'Scheduling, matching students to schools, organ donor chains'], ['Biology', 'Gene networks, evolutionary trees']],
    master: ['Count small cases by listing them before trusting a formula.', 'Use truth tables to check any logical claim you are unsure of.', 'Draw the graph.', 'Work through MIT’s free Mathematics for Computer Science.'],
    prac: [['How many 4-digit PINs are there?', '10,000'], ['C(6, 2)', '15'], ['Contrapositive of “if n is even then n² is even”', '“If n² is odd then n is odd”'], ['Ways to arrange the letters of MATH', '24']],
    gen: 'count', labs: ['play-setops', 'play-truthtable', 'play-graphroutes', 'play-gates', 'play-hanoi', 'play-birthday'], pre: ['var'], next: ['proofs', 'numth', 'logic', 'comput'],
    read: [['MIT OCW 6.042J Mathematics for Computer Science', 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/'], ['Book of Proof (free, Richard Hammack)', 'https://www.people.vcu.edu/~rhammack/BookOfProof/']],
  });

  // ───────────────────────── Tier 5: The bridge to pure math ─────────────────────────
  T(5, 'proofs', {
    t: 'How to write proofs',
    big: 'At this stage math shifts from calculating answers to proving that things must be true. A handful of proof patterns does most of the work.',
    learn: [
      'Direct proof: assume the “if” part and reason step by step to the “then” part. To prove the sum of two even numbers is even: write them as 2a and 2b; their sum 2(a + b) is a multiple of 2. ∎',
      'Proof by contradiction: assume the opposite and show it leads to nonsense. Suppose √2 = p/q in lowest terms. Then p² = 2q², so p² is even, so p is even: p = 2r. Then 4r² = 2q², so q² = 2r² and q is even too. But then p/q was not in lowest terms. Contradiction, so √2 is irrational. ∎',
      'Proof by induction proves a statement for every whole number, like knocking over infinitely many dominoes: show it holds for 1 (the first domino falls), and show that if it holds for n it holds for n + 1 (each domino knocks over the next). Example: 1 + 2 + … + n = n(n + 1)/2.',
      'Contrapositive, cases, and counterexamples round out the toolkit. To prove “if n² is even then n is even”, prove the easier contrapositive: if n is odd, n = 2k + 1, then n² = 4k² + 4k + 1 is odd. To disprove “all primes are odd”, one counterexample (2) is enough.',
    ],
    ex: [
      ['Prove by induction that 1 + 3 + 5 + … + (2n − 1) = n².', ['Base case n = 1: 1 = 1². ✓', 'Assume true for n. Add the next odd number: n² + (2n + 1) = (n + 1)².', 'So it holds for n + 1, and by induction for all n. ∎']],
      ['Prove there are infinitely many primes (Euclid).', ['Suppose there were only finitely many: p₁, p₂, …, pₖ.', 'Let N = p₁p₂…pₖ + 1. Dividing N by any pᵢ leaves remainder 1.', 'So N’s prime factors are not on the list. Contradiction. ∎']],
    ],
    why: 'A proof is convincing because each step follows from definitions or earlier results by rules of logic that cannot fail. That is also why definitions matter so much at this level: you cannot prove anything about “even” or “continuous” until you have pinned down exactly what those words mean.',
    sym: [['∀', 'for all'], ['∃', 'there exists'], ['⇒', 'implies'], ['⇔ or iff', 'if and only if'], ['∎', 'end of proof'], ['WLOG', 'without loss of generality'], ['s.t.', 'such that']],
    words: [['Hypothesis', 'what you assume'], ['Conclusion', 'what you must show'], ['Base case, inductive step', 'the two parts of induction'], ['Contradiction', 'a statement and its negation both following'], ['Rigorous', 'every step justified']],
    hist: [
      ['c. 300 BCE', 'Euclid', 'The infinitude of primes (Elements IX.20) is still a model proof.'],
      ['c. 1000 and 1654', 'al-Karaji; Blaise Pascal', 'Arguments of an inductive kind appear in al-Karaji’s work on sums and binomial coefficients; Pascal stated the method clearly.'],
      ['1945', 'George Pólya', 'How to Solve It described problem-solving heuristics that are still taught.'],
      ['2005–today', 'Proof assistants', 'Computers now check proofs step by step (see tier 9).'],
    ],
    uses: [['Software', 'Proving programs and chips correct, as in aircraft and medical devices'], ['Cryptography', 'Security proofs show that breaking a code would mean solving a problem widely believed to be hard'], ['Law and debate', 'Structured argument: what follows from what'], ['Every later tier', 'All higher mathematics is learned by reading and writing proofs']],
    master: ['Write the definitions of every word in the statement before starting.', 'Try small examples to see why it is true.', 'Write proofs in full sentences; read them aloud.', 'Work through Book of Proof and do the exercises; check against solutions honestly.'],
    prac: [['Prove the product of two odd numbers is odd.', '(2a + 1)(2b + 1) = 2(2ab + a + b) + 1, which is odd.'], ['Disprove: n² + n + 41 is prime for every n.', 'n = 40 gives 41², which is not prime.'], ['Prove 2ⁿ > n for all n ≥ 1 by induction.', 'Base: 2 > 1. Step: 2ⁿ⁺¹ = 2·2ⁿ > 2n ≥ n + 1.']],
    labs: ['play-paradoxes', 'play-knights', 'play-hilbert'], pre: ['discrete', 'proof'], next: ['real', 'absalg', 'numth', 'topo'],
    read: [['Book of Proof (free)', 'https://www.people.vcu.edu/~rhammack/BookOfProof/'], ['Lean: the Natural Number Game (learn proofs interactively)', 'https://adam.math.hhu.de/#/g/leanprover-community/nng4']],
  });

  T(5, 'real', {
    t: 'Real analysis',
    big: 'Real analysis proves why calculus works, using exact definitions of limits, continuity and the real numbers themselves.',
    learn: [
      'Calculus worked for 150 years before anyone could say exactly what a limit was. Real analysis fixes this with the ε–δ definition: lim_{x→a} f(x) = L means that for any tolerance ε > 0 you name, I can find a closeness δ > 0 so that whenever x is within δ of a, f(x) is within ε of L. It is a game: you challenge, I answer, and I must always be able to answer.',
      'The real numbers have one crucial property the fractions lack: no gaps. Every bounded set of reals has a least upper bound (completeness). The fractions below √2 have no fraction as their least upper bound; the reals do. Completeness is what guarantees that limits exist, that continuous functions take every value in between (intermediate value theorem), and that they reach a maximum on a closed interval.',
      'Analysis is full of surprises that intuition misses. Weierstrass built a function that is continuous everywhere but has a slope nowhere, a curve made of corners at every scale. A sequence of smooth functions can converge to a jagged one. These “monsters” forced mathematicians to state exactly which conditions make the usual rules safe.',
      'The reward is certainty. Every numerical method, every probability theorem and every existence result in physics or economics leans on theorems proved here.',
    ],
    ex: [
      ['Prove that 1/n → 0 as n → ∞.', ['Given ε > 0, choose a whole number N > 1/ε.', 'For every n > N, 0 < 1/n < 1/N < ε.', 'So 1/n is eventually within any tolerance of 0. ∎']],
      ['Show x³ + x − 1 = 0 has a solution between 0 and 1.', ['f(0) = −1 < 0 and f(1) = 1 > 0.', 'f is continuous, so by the intermediate value theorem it equals 0 somewhere in between.']],
    ],
    why: 'Each theorem rests on completeness: if the number line had gaps, a continuous curve could cross from negative to positive by jumping through a gap, and limits could “approach” a hole. The definitions are made so that the familiar rules of calculus become provable theorems instead of assumptions.',
    sym: [['ε, δ', 'epsilon, delta', 'small positive tolerances'], ['sup S', 'supremum', 'least upper bound of S'], ['inf S', 'infimum', 'greatest lower bound'], ['(aₙ)', 'a sequence'], ['ℝ, ℚ', 'the reals, the rationals'], ['[a, b], (a, b)', 'closed and open intervals']],
    words: [['Converge', 'get and stay within any tolerance'], ['Cauchy sequence', 'terms eventually get close to each other'], ['Continuous', 'no jumps: small input changes give small output changes'], ['Uniform convergence', 'converging at the same rate everywhere'], ['Compact', 'closed and bounded (in ℝ)']],
    hist: [
      ['1734', 'George Berkeley', 'The Analyst attacked the logic of infinitesimals, which calculus could not yet answer.'],
      ['1817 and 1821', 'Bernard Bolzano; Augustin-Louis Cauchy', 'Bolzano in Prague proved the intermediate value theorem; Cauchy’s Course of Analysis put limits at the centre.'],
      ['1872', 'Karl Weierstrass; Richard Dedekind; Georg Cantor', 'Weierstrass published his everywhere-continuous, nowhere-differentiable function; Dedekind (by “cuts”) and Cantor (by sequences) built the real numbers from the rationals.'],
    ],
    uses: [['Numerical computing', 'Guarantees that approximations converge and how fast'], ['Probability and statistics', 'Limit theorems (law of large numbers, CLT)'], ['Economics', 'Proofs that equilibria and optimal plans exist'], ['Physics', 'Rigorous foundations for differential equations']],
    master: ['Write out ε–δ arguments for simple limits until the structure is familiar.', 'For each theorem, find an example showing why each hypothesis is needed.', 'Read slowly: a page a day with every step checked is normal.', 'Use a free text such as Lebl’s Basic Analysis and MIT 18.100A lectures.'],
    prac: [['Is the set {1 − 1/n} bounded above? Supremum?', 'Yes; sup = 1 (never reached)'], ['Give a function continuous on (0, 1) with no maximum.', 'f(x) = x (or 1/x)'], ['Does Σ (−1)ⁿ/n converge?', 'Yes (alternating series), but not absolutely']],
    labs: ['play-epsdelta', 'play-zeno'], pre: ['proofs', 'calc2', 'series'], next: ['complexan', 'topo', 'measure', 'func'],
    read: [['MIT OCW 18.100A Real Analysis', 'https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/'], ['Basic Analysis (free, Jiří Lebl)', 'https://www.jirka.org/ra/']],
  });

  T(5, 'complexan', {
    t: 'Complex analysis',
    big: 'Calculus with complex numbers turns out to be far more rigid and powerful than real calculus: a function that is smooth once is smooth forever.',
    learn: [
      'A complex function takes a complex number z = x + iy to another. If it has a derivative in the complex sense (it is analytic), something remarkable follows: it automatically has derivatives of every order and equals its Taylor series. Knowing it on any tiny disc determines it everywhere it can be extended.',
      'Analytic functions preserve angles locally: they are conformal maps. That is how a circle can be mapped onto the shape of an aircraft wing, letting engineers compute airflow around the wing from easy airflow around a cylinder.',
      'Cauchy’s integral theorem says the integral of an analytic function around a closed loop is zero. The residue theorem extends this: the integral picks up contributions only from points where the function blows up (poles). This turns many hard real integrals into simple algebra. For example, ∫ from −∞ to ∞ of 1/(1 + x²) dx = π.',
      'The Riemann zeta function, extended to complex inputs, encodes the distribution of prime numbers. Its zeros are the subject of the Riemann hypothesis (tier 10).',
    ],
    ex: [
      ['Check that f(z) = z² is analytic using the Cauchy–Riemann equations.', ['z² = (x² − y²) + i(2xy), so u = x² − y², v = 2xy.', 'u_x = 2x = v_y and u_y = −2y = −v_x. ✓']],
      ['Compute ∮ dz/z around the unit circle.', ['Parametrize z = e^(iθ), dz = ie^(iθ)dθ.', '∫₀^{2π} i dθ = 2πi: the pole at 0 contributes.']],
    ],
    why: 'Complex differentiability is a much stronger requirement than real differentiability: the limit of (f(z + h) − f(z))/h must be the same from every direction in the plane, not just from left and right. That single condition (the Cauchy–Riemann equations) forces the function to be extremely well-behaved.',
    sym: [['z = x + iy', 'complex variable'], ['f′(z)', 'complex derivative'], ['∮', 'contour integral'], ['Res(f, a)', 'residue of f at a'], ['ζ(s)', 'zeta of s', 'Riemann zeta function']],
    words: [['Analytic / holomorphic', 'complex-differentiable'], ['Pole', 'a point where the function blows up like 1/(z − a)ⁿ'], ['Conformal', 'angle-preserving'], ['Analytic continuation', 'extending a function beyond where its formula works'], ['Contour', 'a path in the complex plane']],
    hist: [
      ['1814–1825', 'Augustin-Louis Cauchy', 'Founded the theory, including the integral theorem and residues.'],
      ['1851 and 1859', 'Bernhard Riemann', 'Riemann surfaces and the mapping theorem; his 1859 paper on primes introduced the zeta function’s zeros.'],
      ['1910s', 'Nikolai Joukowski', 'Conformal maps for aerofoil design in early aviation.'],
      ['1932', 'Harry Nyquist', 'A complex-analysis criterion for whether feedback amplifiers and control systems are stable.'],
    ],
    uses: [['Engineering', 'Stability of control systems, from cruise control to aircraft'], ['Signal processing', 'Laplace and z-transforms for filters'], ['Physics', 'Fluid flow, electrostatics, quantum scattering'], ['Number theory', 'The prime number theorem was first proved this way (1896)']],
    master: ['Visualize functions with domain colouring.', 'Practise contour integrals on standard examples until residues are routine.', 'Connect each theorem to its real-calculus counterpart.', 'Use a free text such as Beck et al., A First Course in Complex Analysis.'],
    prac: [['Is f(z) = z̄ (the conjugate) analytic?', 'No: the Cauchy–Riemann equations fail'], ['Residue of 1/(z − 2) at z = 2', '1'], ['Where is e^z equal to 1?', 'z = 2πik for integers k']],
    labs: ['play-complex', 'play-mandel', 'play-zeta'], pre: ['cplx', 'real', 'multi'], next: ['numth', 'func', 'alggeo', 'mill'],
    read: [['MIT OCW 18.04 Complex Variables with Applications', 'https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/'], ['A First Course in Complex Analysis (free, Beck, Marchesi, Pixton, Sabalka)', 'https://matthbeck.github.io/complex.html']],
  });

  T(5, 'absalg', {
    t: 'Abstract algebra: groups, rings and fields',
    big: 'Abstract algebra studies the rules of combining things (numbers, rotations, shuffles) rather than the things themselves.',
    learn: [
      'A group is a set with a way to combine elements that satisfies four rules: combining stays in the set (closure), grouping doesn’t matter (associativity), there is an element that changes nothing (identity), and every element can be undone (inverses). The whole numbers under addition form a group. So do the symmetries of a square: 4 rotations and 4 flips, 8 moves in all.',
      'Groups capture symmetry. Rotating a triangle then flipping it is different from flipping then rotating, so order matters (the group is non-commutative). Lagrange’s theorem says the size of any subgroup divides the size of the group, a simple fact with deep consequences, including Fermat’s little theorem in number theory.',
      'A ring has two operations, like + and × for integers or for polynomials. A field is a ring where you can also divide by anything except 0: the rationals, the reals, the complex numbers, and the integers modulo a prime p.',
      'Galois theory connects these ideas to equations. Each polynomial has a group of symmetries of its roots. A formula using only roots (like the quadratic formula) exists exactly when that group can be broken down in a certain way; for most degree-5 equations it cannot. That is why there is no quintic formula.',
    ],
    ex: [
      ['Is {1, 2, 3, 4} under multiplication mod 5 a group?', ['Closure: every product mod 5 is in {1, 2, 3, 4}. ✓', 'Identity: 1. Inverses: 1·1, 2·3, 4·4 all give 1 mod 5. ✓', 'Associativity is inherited from ordinary multiplication. So yes.']],
      ['Show that rotate-then-flip ≠ flip-then-rotate for a square.', ['Label corners 1–4. Rotate 90° then flip left-right sends corner 1 to a different place than flip then rotate.', 'Draw it: the group of the square is non-commutative.']],
    ],
    why: 'Abstraction pays because one theorem about groups instantly applies to every example: clock arithmetic, Rubik’s cubes, crystal symmetries and particle physics. You prove it once from the four rules and it holds wherever the rules hold.',
    sym: [['(G, ·)', 'a group G with operation ·'], ['e or 1', 'identity'], ['g⁻¹', 'inverse of g'], ['|G|', 'order (size) of G'], ['ℤₙ', 'integers mod n'], ['𝔽_p', 'the field with p elements'], ['≅', 'isomorphic', 'the same structure in disguise']],
    words: [['Subgroup', 'a group inside a group'], ['Homomorphism', 'a structure-preserving map'], ['Isomorphism', 'a perfect structure match'], ['Abelian', 'commutative'], ['Ideal', 'a special sub-ring'], ['Field extension', 'a bigger field containing a smaller one, like ℂ over ℝ']],
    hist: [
      ['1770–1832', 'Lagrange; Ruffini; Abel; Galois', 'Studied how the roots of an equation can be shuffled. Galois found exactly when an equation can be solved by roots; he died after a duel in 1832, aged 20, and his work was published in 1846.'],
      ['1854', 'Arthur Cayley', 'Defined groups abstractly.'],
      ['1920s', 'Emmy Noether', 'Founded modern abstract algebra (rings and ideals); her 1918 theorem links symmetries to conservation laws in physics. As a woman, and later as a Jewish academic in Nazi Germany, she faced barriers and in 1933 was dismissed and emigrated to the US.'],
      ['1980s–2004', 'Hundreds of mathematicians', 'Classified every finite simple group, the “atoms” of symmetry, in tens of thousands of pages; the largest exceptional one, the Monster, has about 8 × 10⁵³ elements.'],
    ],
    uses: [['Cryptography', 'Elliptic-curve and Diffie–Hellman encryption use groups; AES uses a finite field'], ['Error-correcting codes', 'QR codes, CDs and spacecraft use finite fields'], ['Physics', 'Symmetry groups classify particles and forces (Noether’s theorem)'], ['Chemistry', 'There are exactly 230 crystal symmetry groups in 3D'], ['Puzzles', 'Any Rubik’s cube position can be solved in at most 20 moves (proved in 2010 with computer help)']],
    master: ['Work every definition with three examples and one non-example.', 'Build multiplication tables (Cayley tables) for small groups by hand.', 'Use the symmetry lab to compose moves.', 'Follow a free text such as Judson’s Abstract Algebra: Theory and Applications.'],
    prac: [['Order of the symmetry group of an equilateral triangle', '6'], ['Inverse of 3 in ℤ₇ under multiplication', '5 (3 × 5 = 15 ≡ 1)'], ['Is ℤ₆ (mod 6) a field?', 'No: 2 × 3 = 0, and 2 has no inverse']],
    gen: 'mod', labs: ['play-symmetry', 'play-modclock', 'play-polyhedra'], pre: ['proofs', 'linalg'], next: ['numth', 'rep', 'alggeo', 'info'],
    read: [['Abstract Algebra: Theory and Applications (free, Thomas Judson)', 'https://judsonbooks.org/abstract-algebra-theory-and-applications/'], ['MIT OCW 18.701 Algebra I', 'https://ocw.mit.edu/courses/18-701-algebra-i-fall-2010/']],
  });

  T(5, 'topo', {
    t: 'Point-set topology',
    big: 'Topology studies the properties that survive stretching and bending without tearing: to a topologist a coffee mug and a doughnut are the same shape.',
    learn: [
      'Geometry cares about lengths and angles; topology cares only about nearness and connection. You may stretch, bend and twist a shape, but not cut or glue it. A mug and a doughnut each have one hole, so one can be deformed into the other.',
      'Point-set topology makes “nearness” precise without distances. A topology on a set is a choice of which subsets count as open, following a few rules. A function is continuous if the preimage of every open set is open. This one definition covers continuity for numbers, for spaces of functions, for networks, and much more.',
      'Two key properties: connected (all in one piece) and compact (in ordinary space, closed and bounded). On a compact space every continuous function reaches a maximum, a fact behind many existence proofs.',
      'Fixed-point theorems are a famous payoff. Brouwer’s theorem says any continuous map of a disc to itself leaves some point where it started: stir a cup of coffee gently and some point of the surface ends up where it began. John Nash used a fixed-point theorem to prove that every finite game has an equilibrium.',
    ],
    ex: [
      ['Euler’s formula V − E + F for a cube.', ['V = 8, E = 12, F = 6.', '8 − 12 + 6 = 2: the same for every shape topologically like a sphere.']],
      ['Is the interval (0, 1) compact? Is [0, 1]?', ['(0, 1) is bounded but not closed: f(x) = x never reaches a maximum. Not compact.', '[0, 1] is closed and bounded: compact.']],
    ],
    why: 'Defining continuity through open sets strips away everything except what continuity really needs. Because the definition is so general, theorems proved once (like “a continuous image of a compact set is compact”) apply in every setting at the same time.',
    sym: [['(X, τ)', 'a topological space', 'set X with open sets τ'], ['Ū', 'closure of U'], ['∂U', 'boundary of U'], ['≅ or ≈', 'homeomorphic', 'same shape topologically'], ['χ', 'Euler characteristic']],
    words: [['Open set', 'a set with no edge points of its own'], ['Homeomorphism', 'a continuous deformation with a continuous inverse'], ['Compact', 'every open cover has a finite subcover'], ['Connected', 'cannot be split into two separate open pieces'], ['Hausdorff', 'distinct points can be separated by open sets']],
    hist: [
      ['1736 and 1758', 'Leonhard Euler', 'The bridges of Königsberg and V − E + F = 2 for polyhedra.'],
      ['1847 and 1858', 'Johann Listing; August Möbius', 'Listing coined “topology”; both described the one-sided Möbius strip.'],
      ['1895', 'Henri Poincaré', 'Analysis Situs launched topology as a major field.'],
      ['1910–1914', 'L. E. J. Brouwer; Felix Hausdorff', 'Brouwer’s fixed-point theorem; Hausdorff’s axioms for topological spaces.'],
    ],
    uses: [['Economics', 'Existence of market and game equilibria (Arrow–Debreu, Nash)'], ['Data science', 'Topological data analysis finds the shape of data clouds'], ['Robotics', 'The space of a robot arm’s positions and how to move through it'], ['Biology', 'Enzymes that untangle knotted DNA'], ['Physics', 'Topological phases of matter (Nobel Prize in Physics, 2016)']],
    master: ['Draw pictures of open sets and continuous maps.', 'Learn the standard counterexamples (Topology without Tears is free).', 'Translate each definition into the ordinary distance case first.', 'Play with V − E + F on many shapes, including a torus.'],
    prac: [['V − E + F for a tetrahedron', '4 − 6 + 4 = 2'], ['Are the letters O and D homeomorphic?', 'Yes (each is one loop)'], ['Is ℝ compact?', 'No (not bounded)']],
    labs: ['play-polyhedra', 'play-graphroutes', 'play-voronoi'], pre: ['real'], next: ['algtop', 'measure', 'func'],
    read: [['Topology Without Tears (free, Sidney Morris)', 'https://www.topologywithouttears.net/'], ['MIT OCW 18.901 Introduction to Topology', 'https://ocw.mit.edu/courses/18-901-introduction-to-topology-fall-2004/']],
  });

  T(5, 'numth', {
    t: 'Number theory',
    big: 'Number theory studies whole numbers, especially primes; once called the purest math, it now protects every online payment.',
    learn: [
      'Every whole number above 1 factors into primes in exactly one way (the fundamental theorem of arithmetic): 360 = 2³ × 3² × 5. Primes are the atoms of multiplication. There are infinitely many (Euclid’s proof is in “How to write proofs”), but they thin out: near a number N, roughly one in every ln N numbers is prime.',
      'The greatest common divisor of two numbers can be found without factoring, by Euclid’s algorithm: repeatedly replace the larger number by its remainder when divided by the smaller. It is one of the oldest algorithms still in daily use.',
      'Modular arithmetic is clock arithmetic: 15 ≡ 3 (mod 12) because they leave the same remainder. You can add and multiply mod n and the rules still work. Fermat’s little theorem says that if p is prime and a is not a multiple of p, then a^(p−1) ≡ 1 (mod p), which makes enormous powers easy to reduce.',
      'RSA encryption uses this. Multiplying two huge primes is fast; factoring their product back is, as far as anyone publicly knows, impossibly slow. A public key lets anyone lock a message, but only the person who knows the primes can unlock it.',
    ],
    ex: [
      ['Find gcd(252, 198) with Euclid’s algorithm.', ['252 = 1 × 198 + 54', '198 = 3 × 54 + 36', '54 = 1 × 36 + 18', '36 = 2 × 18 + 0, so gcd = 18.']],
      ['Find 3¹⁰⁰ mod 7.', ['Fermat: 3⁶ ≡ 1 (mod 7).', '100 = 6 × 16 + 4, so 3¹⁰⁰ ≡ 3⁴ = 81 ≡ 4 (mod 7).']],
    ],
    why: 'Unique factorization holds because of a key lemma: if a prime divides a product ab, it divides a or b. Euclid’s algorithm works because any common divisor of a and b also divides a − qb, so the gcd never changes as the numbers shrink. RSA works because Euler’s generalization of Fermat’s theorem lets the key owner undo exponentiation, using knowledge of the primes that nobody else has.',
    sym: [['a | b', 'a divides b'], ['gcd(a, b)', 'greatest common divisor'], ['a ≡ b (mod n)', 'a is congruent to b mod n'], ['φ(n)', 'Euler’s totient', 'how many numbers up to n share no factor with n'], ['π(x)', 'prime-counting function', 'number of primes up to x'], ['ℙ', 'the primes']],
    words: [['Prime', 'only divisible by 1 and itself'], ['Composite', 'not prime'], ['Coprime', 'gcd is 1'], ['Congruence', 'same remainder'], ['Diophantine equation', 'an equation to be solved in whole numbers']],
    hist: [
      ['c. 300 BCE and c. 240 BCE', 'Euclid; Eratosthenes', 'Infinitely many primes and the gcd algorithm; the sieve for listing primes.'],
      ['3rd–5th century and 1247', 'Sun Zi; Qin Jiushao, China', 'The Chinese remainder theorem: solving several clock-arithmetic conditions at once, made general by Qin.'],
      ['7th–12th centuries', 'Brahmagupta; Bhaskara II', 'Solved equations like x² − 61y² = 1 with the cyclic “chakravala” method.'],
      ['1640–1801', 'Fermat; Euler; Gauss', 'Fermat’s little theorem; Euler’s proofs; Gauss’s Disquisitiones Arithmeticae introduced the ≡ notation.'],
      ['1896 and 1977', 'Hadamard and de la Vallée Poussin; Rivest, Shamir and Adleman', 'The prime number theorem was proved; RSA was published. Clifford Cocks at Britain’s GCHQ had found it in 1973, but it stayed secret until 1997.'],
    ],
    uses: [['Security', 'HTTPS, banking, messaging and digital signatures'], ['Error checks', 'ISBNs and credit-card numbers include check digits that catch typos'], ['Computing', 'Hash tables, random number generators'], ['Calendars', 'Computing weekdays and the date of Easter is modular arithmetic']],
    master: ['Compute lots of small examples by hand and look for patterns.', 'Implement Euclid’s algorithm and fast modular powers in a few lines of code.', 'Try Project Euler problems.', 'Read Stein’s free Elementary Number Theory.'],
    prac: [['Prime factorization of 924', '2² × 3 × 7 × 11'], ['gcd(84, 120)', '12'], ['2¹⁰ mod 11', '1'], ['Solve x ≡ 2 (mod 3), x ≡ 3 (mod 5)', 'x ≡ 8 (mod 15)']],
    gen: 'mod', labs: ['play-sieve', 'play-ulam', 'play-rsa', 'play-modclock', 'play-primecount'], pre: ['proofs', 'discrete'], next: ['info', 'arithgeo', 'mill', 'langlands'],
    read: [['Elementary Number Theory (free, William Stein)', 'https://wstein.org/ent/'], ['MIT OCW 18.781 Theory of Numbers', 'https://ocw.mit.edu/courses/18-781-theory-of-numbers-spring-2012/'], ['Project Euler', 'https://projecteuler.net/']],
  });

  T(5, 'prob', {
    t: 'Probability and mathematical statistics',
    big: 'Probability measures how likely things are; statistics works backwards from data to what is probably true, and how sure we can be.',
    learn: [
      'A probability is a number from 0 (impossible) to 1 (certain). For equally likely outcomes it is favourable ÷ total: rolling a sum of 7 with two dice has 6 of 36 outcomes, so ⅙. Independent events multiply: two heads in a row is ½ × ½ = ¼. The expected value is the long-run average: a $1 lottery ticket paying $1,000,000 with probability 1 in 14 million is worth about 7 cents.',
      'Conditional probability changes with information. Bayes’ theorem says how: P(A | B) = P(B | A) P(A) / P(B). Suppose a disease affects 1% of people and a test catches 90% of cases but also flags 9% of healthy people. A positive result means only about a 9% chance of disease, because the healthy group is so much bigger. Doctors, judges and juries often get this wrong.',
      'Two great limit theorems make statistics possible. The law of large numbers: averages of many independent trials settle near the true mean. The central limit theorem: sums of many small independent effects form a bell curve, almost regardless of what the effects look like. That is why heights, measurement errors and poll results are roughly normal.',
      'Statistics turns data into claims with stated uncertainty. A poll of 1,000 people has a margin of error of about ±3 points. A p-value measures how surprising the data would be if there were no real effect; it is not the probability the effect is real. Testing many hypotheses and reporting the lucky one (p-hacking) produces false discoveries, part of why many published findings fail to replicate.',
    ],
    ex: [
      ['Work the disease-test example with Bayes’ theorem.', ['P(positive) = 0.01 × 0.9 + 0.99 × 0.09 = 0.0981.', 'P(disease | positive) = 0.009 / 0.0981 ≈ 0.092, about 9%.']],
      ['A fair coin is flipped 100 times. About how many heads, and how much variation is normal?', ['Mean = 50. Standard deviation = √(100 × ½ × ½) = 5.', 'About 95% of the time you get between 40 and 60 heads.']],
    ],
    why: 'Bayes’ theorem is just counting two ways: P(A and B) = P(A | B)P(B) = P(B | A)P(A). The central limit theorem holds because adding independent random effects smooths out their individual shapes; the bell curve is the shape that stays the same under this kind of averaging.',
    sym: [['P(A)', 'probability of A'], ['P(A | B)', 'probability of A given B'], ['E[X] or μ', 'expected value, mean'], ['Var(X) or σ²', 'variance'], ['σ', 'standard deviation'], ['X ~ N(μ, σ²)', 'X is normally distributed'], ['H₀', 'null hypothesis'], ['p', 'p-value']],
    words: [['Random variable', 'a number whose value depends on chance'], ['Distribution', 'how probability is spread over values'], ['Independent', 'one tells you nothing about the other'], ['Confidence interval', 'a range built by a method that catches the true value most of the time'], ['Bias', 'systematic error'], ['Prior, posterior', 'belief before and after seeing data (Bayesian)']],
    hist: [
      ['1560s and 1654', 'Gerolamo Cardano; Pascal and Fermat', 'Cardano, a gambler, wrote the first book on chance; Pascal and Fermat’s letters on splitting a stake in an unfinished game founded probability.'],
      ['1713 and 1733', 'Jacob Bernoulli; Abraham de Moivre', 'The law of large numbers; the normal curve as an approximation.'],
      ['1763 and 1812', 'Thomas Bayes; Pierre-Simon Laplace', 'Bayes’ essay (published after his death by Richard Price); Laplace’s analytic theory of probability.'],
      ['1900–1935', 'Karl Pearson; William Gosset; Ronald Fisher; Neyman and Pearson', 'Chi-square tests, the t-test (Gosset, a Guinness brewer, writing as “Student”), randomized experiments and hypothesis testing. Pearson and Fisher were also leading eugenicists.'],
      ['1933', 'Andrey Kolmogorov', 'Gave probability its modern axioms using measure theory.'],
    ],
    uses: [['Medicine', 'Randomized trials (the first modern one tested streptomycin in 1948); reading test results'], ['Insurance and finance', 'Pricing risk; Edmond Halley built a life table in 1693'], ['Politics and polling', 'Sampling, margins of error, election forecasts'], ['Science', 'Deciding whether an effect is real'], ['AI', 'Language models predict probability distributions over the next word']],
    master: ['Simulate: flip virtual coins and roll dice thousands of times to check your answers.', 'Write out the sample space for small problems.', 'For every statistic in the news, ask: compared with what, out of how many, and how was it measured?', 'Use the free Introduction to Probability by Blitzstein and Hwang and the OpenIntro books.'],
    prac: [['P(at least one six in two rolls)', '11/36'], ['Expected value of one fair die roll', '3.5'], ['If P(A) = 0.3 and P(B) = 0.5 and they are independent, P(A and B)?', '0.15'], ['Margin of error for a poll of 400 (about 1/√n)', 'About ±5 points']],
    gen: 'prob', labs: ['play-bayes', 'play-clt', 'play-lln', 'play-confint', 'play-phack', 'play-birthday', 'play-margin', 'play-kelly'], pre: ['data1', 'calc2', 'discrete'], next: ['measure', 'stoch', 'info', 'ml'],
    read: [['Introduction to Probability (free, Blitzstein and Hwang)', 'https://stat110.hsites.harvard.edu/'], ['OpenIntro Statistics (free)', 'https://www.openintro.org/book/os/'], ['MIT OCW 18.650 Statistics for Applications', 'https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/']],
  });
})();
