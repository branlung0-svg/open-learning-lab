/* Math path, tiers 6–7: core graduate math; applied and computational math. */
(function () {
  const M = (Lab.MATH = Lab.MATH || { topics: [], by: {} });
  M.T = M.T || ((tier, id, o) => { o.id = id; o.tier = tier; M.topics.push(o); M.by[id] = o; });
  const T = M.T;

  // ───────────────────────── Tier 6: Core graduate math ─────────────────────────
  T(6, 'measure', {
    t: 'Measure theory and Lebesgue integration',
    big: 'Measure theory gives an airtight meaning to length, area, volume and probability, even for wildly complicated sets.',
    learn: [
      'Some functions are too jagged for the ordinary (Riemann) integral. Take the function that is 1 on every fraction and 0 on every irrational number. Every interval, however small, contains both kinds, so rectangle sums never settle. Yet intuitively the fractions are “negligible”: they are countable, while the irrationals are not.',
      'Measure theory makes that intuition exact. The measure of a set generalizes length. You can cover all the fractions between 0 and 1 by tiny intervals whose total length is as small as you like (cover the n-th fraction by an interval of length ε/2ⁿ), so the fractions have measure zero. Lebesgue’s integral then gives the jagged function the value 0, as it should.',
      'Lebesgue compared his method to counting money: Riemann adds coins in the order they come out of your pocket; Lebesgue first sorts them by value, then adds “how many of each”. Sorting by output value instead of by input position is what makes the new integral so robust.',
      'The payoff is powerful theorems for swapping limits and integrals (monotone and dominated convergence) and a solid foundation for probability: an event is a measurable set, a probability is a measure of total size 1, and an expected value is an integral.',
    ],
    ex: [
      ['What is the measure of the set {0.1, 0.2, 0.3}?', ['Each point has length 0.', 'A finite (or countable) union of measure-zero sets has measure 0.']],
      ['Pick a number uniformly at random from [0, 1]. What is the probability it is a fraction?', ['The fractions have measure 0.', 'So the probability is 0, even though it is possible. “Probability zero” is not the same as “impossible”.']],
    ],
    why: 'A measure only needs to add up correctly over countably many disjoint pieces. That requirement is strong enough to support limits and probability, but it cannot be extended to every subset: using the axiom of choice, Vitali built sets that cannot be given any consistent length, and Banach and Tarski showed a ball can be cut into a few non-measurable pieces and reassembled into two balls of the same size. Measure theory works by restricting attention to measurable sets.',
    sym: [['μ(A)', 'mu of A', 'the measure of A'], ['∫ f dμ', 'Lebesgue integral of f'], ['a.e.', 'almost everywhere', 'except on a set of measure 0'], ['σ-algebra', 'sigma-algebra', 'the collection of measurable sets'], ['Lᵖ', 'L-p spaces', 'functions whose p-th power is integrable']],
    words: [['Measurable set', 'a set that has a well-defined size'], ['Null set', 'a set of measure zero'], ['Countable', 'can be listed 1st, 2nd, 3rd, …'], ['Dominated convergence', 'a theorem allowing limit and integral to swap'], ['Probability space', '(Ω, F, P): outcomes, events, measure']],
    hist: [
      ['1898 and 1902', 'Émile Borel; Henri Lebesgue', 'Borel defined measurable sets; Lebesgue’s thesis created the new integral.'],
      ['1905 and 1924', 'Giuseppe Vitali; Stefan Banach and Alfred Tarski', 'A non-measurable set; the Banach–Tarski paradox.'],
      ['1918', 'Felix Hausdorff', 'Hausdorff dimension, later used to measure fractals.'],
      ['1933', 'Andrey Kolmogorov', 'Built probability on measure theory, settling its foundations.'],
    ],
    uses: [['Probability and statistics', 'Every rigorous theorem about randomness'], ['Finance', 'Pricing uses a change of measure to a “risk-neutral” probability'], ['Physics', 'Quantum mechanics and statistical mechanics'], ['Signal processing', 'Spaces of finite-energy signals (L²)'], ['Fractals', 'Measuring the dimension of coastlines and clouds']],
    master: ['Master real analysis first.', 'Work examples of measure-zero sets until “almost everywhere” feels natural.', 'Learn the three convergence theorems and an example of each failing without its hypotheses.', 'Axler’s Measure, Integration & Real Analysis is free.'],
    prac: [['Measure of the whole numbers inside ℝ', '0'], ['Measure of [2, 5] ∪ [7, 8]', '4'], ['If f = g almost everywhere, are their Lebesgue integrals equal?', 'Yes']],
    labs: ['play-pidarts', 'play-hilbert', 'play-diagonal'], pre: ['real', 'topo'], next: ['func', 'stoch'],
    read: [['Measure, Integration & Real Analysis (free, Sheldon Axler)', 'https://measure.axler.net/'], ['MIT OCW 18.175 Theory of Probability', 'https://ocw.mit.edu/courses/18-175-theory-of-probability-spring-2014/']],
  });

  T(6, 'func', {
    t: 'Functional analysis',
    big: 'Functional analysis treats functions as points in an infinite-dimensional space, so geometry and linear algebra can be used on them.',
    learn: [
      'A vector in 3D has three coordinates. A function, such as a sound wave, can be described by infinitely many numbers: its value at every instant, or its amount of each frequency. Functional analysis builds spaces where each point is a whole function, with lengths, angles and distances.',
      'In a Hilbert space there is a dot product between functions: ⟨f, g⟩ = ∫ f(x)g(x) dx. Two functions are perpendicular when that integral is 0. The waves sin x, sin 2x, sin 3x, … are all mutually perpendicular on [0, 2π], so they act like infinitely many coordinate axes. A Fourier series is just writing a function in those coordinates, and Parseval’s theorem is Pythagoras with infinitely many terms.',
      'Operators are infinite-dimensional matrices: differentiation, integration, or “multiply by x” act on functions linearly. The spectral theorem, the infinite version of eigenvectors, says nice operators can be broken into simple stretches along perpendicular directions.',
      'In quantum mechanics a particle’s state is a vector in a Hilbert space, and measurable quantities (energy, momentum) are operators. The possible results of a measurement are the operator’s eigenvalues: that is why energy comes in discrete levels.',
    ],
    ex: [
      ['Show sin x and sin 2x are perpendicular on [0, 2π].', ['⟨sin x, sin 2x⟩ = ∫₀^{2π} sin x sin 2x dx.', 'Using sin a sin b = ½[cos(a − b) − cos(a + b)], both cosines integrate to 0 over a full period.', 'So the dot product is 0.']],
      ['Why is d/dx an operator, and what are its eigenfunctions?', ['d/dx(f + g) = f′ + g′ and d/dx(cf) = cf′: it is linear.', 'd/dx e^(λx) = λe^(λx): exponentials are its eigenfunctions with eigenvalue λ.']],
    ],
    why: 'Infinite dimensions bring new dangers: a bounded sequence need not have a convergent subsequence, and some operators have no eigenvectors at all. The field’s main work is finding conditions (completeness, compactness, self-adjointness) under which finite-dimensional intuition still holds, so that methods like Fourier series and quantum mechanics rest on proven ground.',
    sym: [['⟨f, g⟩', 'inner product of f and g'], ['‖f‖', 'norm', 'the length of f'], ['L²', 'square-integrable functions'], ['T*', 'adjoint of operator T'], ['σ(T)', 'spectrum of T'], ['δ(x)', 'Dirac delta', 'a distribution: a spike of total area 1']],
    words: [['Banach space', 'a complete space with lengths'], ['Hilbert space', 'a complete space with an inner product'], ['Operator', 'a linear map between function spaces'], ['Spectrum', 'the generalized eigenvalues'], ['Distribution', 'a generalized function such as the delta']],
    hist: [
      ['1900–1910', 'Ivar Fredholm; David Hilbert', 'Integral equations led to the first infinite-dimensional spaces.'],
      ['1920s–1930s', 'Stefan Banach and the Lwów school', 'Banach spaces; problems traded in the Scottish Café’s “Scottish Book”, some with prizes like a live goose.'],
      ['1927–1932', 'John von Neumann', 'Put quantum mechanics on a Hilbert-space foundation.'],
      ['1945–1950', 'Laurent Schwartz', 'Made the Dirac delta rigorous as a distribution; Fields Medal 1950.'],
    ],
    uses: [['Quantum physics and chemistry', 'States, observables, energy levels'], ['Signal and image processing', 'Fourier and wavelet bases; JPEG 2000 uses wavelets'], ['PDEs', 'Proving solutions exist (Sobolev spaces)'], ['Machine learning', 'Kernel methods work in high- or infinite-dimensional feature spaces'], ['Control engineering', 'Robust control of aircraft and power grids']],
    master: ['Know linear algebra and real analysis cold.', 'Translate each theorem to the finite-dimensional case and ask what changes.', 'Collect counterexamples in infinite dimensions.', 'MIT 18.102 lecture notes are free.'],
    prac: [['Norm of f(x) = 1 on [0, 1] in L²', '1'], ['Are 1 and x perpendicular in L²[−1, 1]?', 'Yes (∫ x dx = 0)'], ['Eigenvalues of d²/dx² with f(0) = f(π) = 0', '−n² (eigenfunctions sin nx)']],
    labs: ['play-fourier', 'play-convolution', 'play-harmonics'], pre: ['linalg', 'real', 'measure'], next: ['pde', 'rep', 'ml'],
    read: [['MIT OCW 18.102 Introduction to Functional Analysis', 'https://ocw.mit.edu/courses/18-102-introduction-to-functional-analysis-spring-2021/']],
  });

  T(6, 'algtop', {
    t: 'Algebraic and differential topology',
    big: 'Algebraic topology counts the holes in a shape using algebra; it can tell shapes apart that no amount of stretching can turn into each other.',
    learn: [
      'How do you prove a sphere and a doughnut (torus) are different shapes? Draw loops. On a sphere every loop can shrink to a point. On a torus, a loop around the hole cannot. The fundamental group records which loops can and cannot shrink, and how they combine. Different groups mean different shapes.',
      'Homology counts holes of each dimension: connected pieces, loops (one-dimensional holes), hollow cavities (two-dimensional holes), and so on. For surfaces, the Euler characteristic V − E + F = 2 − 2g counts the handles g: 2 for a sphere, 0 for a torus.',
      'Differential topology studies smooth shapes (manifolds). The hairy ball theorem says you cannot comb the hair on a ball flat everywhere: there is always a whorl. So, at any moment, if the wind blows continuously, somewhere on Earth the horizontal wind speed is zero.',
      'The Poincaré conjecture asked whether every closed 3-dimensional shape in which every loop shrinks is a 3-sphere. It was settled in higher dimensions first (1961 and 1982) and finally in three dimensions by Grigori Perelman in 2002–2003, the only Millennium Prize problem solved so far. He declined both the Fields Medal and the $1 million prize.',
    ],
    ex: [
      ['Compute V − E + F for a torus made from a 3 × 3 grid of squares glued at opposite edges.', ['Gluing gives V = 9, E = 18, F = 9.', 'V − E + F = 0 = 2 − 2(1): one handle.']],
      ['Why can’t you continuously reshape a doughnut into a ball?', ['A loop around the hole cannot be shrunk to a point while staying on the surface.', 'So its class in the fundamental group is not the identity.', 'The fundamental group is a topological invariant, and a sphere’s is trivial, so the two shapes differ.']],
    ],
    why: 'An invariant is a number or algebraic object that does not change under stretching. If two shapes have different invariants, no deformation can turn one into the other. Turning geometry into algebra lets you compute these invariants systematically, even for shapes in dimensions you cannot picture.',
    sym: [['π₁(X)', 'fundamental group of X'], ['Hₙ(X)', 'n-th homology group'], ['χ', 'Euler characteristic'], ['Sⁿ', 'the n-sphere'], ['T²', 'the torus'], ['≃', 'homotopy equivalent']],
    words: [['Manifold', 'a space that looks flat up close, like Earth’s surface'], ['Homotopy', 'a continuous deformation of maps'], ['Genus', 'number of handles'], ['Invariant', 'a quantity unchanged by deformation'], ['Knot', 'a closed loop in 3D space']],
    hist: [
      ['1895–1904', 'Henri Poincaré', 'Introduced the fundamental group, homology and his conjecture.'],
      ['1925', 'Emmy Noether', 'Suggested viewing homology as groups, the algebraic turn.'],
      ['1961, 1982', 'Stephen Smale; Michael Freedman', 'Proved the Poincaré conjecture in dimensions 5 and up, and in dimension 4.'],
      ['1984', 'Vaughan Jones', 'A new polynomial for telling knots apart, with links to physics (Fields Medal 1990).'],
      ['2002–2003', 'Grigori Perelman', 'Proved the 3D Poincaré conjecture using Richard Hamilton’s Ricci flow, posting his papers online without journal publication.'],
    ],
    uses: [['Data science', 'Persistent homology finds loops and voids in data'], ['Robotics', 'Planning motion through the space of possible arm positions'], ['Physics', 'Topological insulators and defects in materials'], ['Biology', 'Knotting of DNA and proteins'], ['Sensor networks', 'Checking coverage without knowing sensor positions']],
    master: ['Draw and glue paper models (Möbius strip, torus).', 'Compute V − E + F for many shapes.', 'Learn group theory first.', 'Hatcher’s Algebraic Topology is free online.'],
    prac: [['Euler characteristic of a two-holed torus', '−2'], ['Fundamental group of a circle', 'ℤ (loops counted by how many times they wind)'], ['Can a tangent wind field on Earth be nonzero everywhere?', 'No (hairy ball theorem)']],
    labs: ['play-polyhedra', 'play-life'], pre: ['topo', 'absalg'], next: ['diffgeo', 'alggeo', 'hott'],
    read: [['Algebraic Topology (free, Allen Hatcher)', 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html'], ['Clay Institute: the Poincaré conjecture', 'https://www.claymath.org/millennium/poincare-conjecture/']],
  });

  T(6, 'diffgeo', {
    t: 'Differential geometry',
    big: 'Differential geometry is calculus on curved spaces; it describes the shape of the Earth, of surfaces, and of spacetime itself.',
    learn: [
      'On a sphere, the shortest path between two points (a geodesic) is an arc of a great circle, which is why flights from New York to Tokyo pass near Alaska. Draw a triangle from the North Pole to two points on the equator a quarter-turn apart: all three angles are 90°, summing to 270°. The extra 90° (the angular excess) measures the curvature inside the triangle.',
      'Gauss’s “remarkable theorem” (Theorema Egregium, 1827) says curvature can be measured from inside a surface, by measuring distances alone. One consequence: no flat map of the Earth can keep all distances correct. Another, from the kitchen: fold a pizza slice along its length and it stops drooping, because a surface cannot bend in two directions without stretching.',
      'Riemann (1854) generalized this to spaces of any dimension, with a metric that says how to measure lengths at each point. Tensors are the bookkeeping tools for quantities like the metric and curvature, written so they do not depend on the choice of coordinates.',
      'Einstein’s general relativity (1915) says gravity is the curvature of spacetime. Clocks run at different rates in different gravity and at different speeds; GPS satellite clocks gain about 38 microseconds a day relative to the ground, and without correcting for it, positions would drift by kilometres per day.',
    ],
    ex: [
      ['A sphere of radius R has a triangle with angles 90°, 90°, 90°. What is its area?', ['Girard’s theorem: area = R² × (angle sum − π).', '= R² × (3π/2 − π) = πR²/2, exactly one eighth of the sphere.']],
      ['Why does a Mercator map exaggerate Greenland?', ['To keep angles correct (useful for navigation) on a flat map, it must stretch distances more and more toward the poles.', 'Theorema Egregium says something has to give.']],
    ],
    why: 'Curvature is intrinsic because it shows up in measurements made entirely on the surface: angle sums of triangles, circumferences of circles (smaller than 2πr on a sphere), and how a vector rotates when carried around a loop. Since these are measurements, any inhabitant of the space can detect curvature, which is how astronomers test whether the universe is flat.',
    sym: [['K', 'Gaussian curvature'], ['g_ij', 'metric tensor'], ['Γᵏᵢⱼ', 'Christoffel symbols', 'how coordinates twist'], ['R_ijkl', 'Riemann curvature tensor'], ['∇', 'covariant derivative'], ['ds²', 'line element', 'infinitesimal distance squared']],
    words: [['Geodesic', 'locally shortest path'], ['Manifold', 'a space that is locally flat'], ['Tangent space', 'the flat approximation at a point'], ['Intrinsic', 'measurable from inside'], ['Parallel transport', 'carrying a vector along a path without turning it']],
    hist: [
      ['1827', 'Carl Friedrich Gauss', 'Theorema Egregium, developed while surveying the Kingdom of Hanover.'],
      ['1854', 'Bernhard Riemann', 'Lecture on the hypotheses underlying geometry: curved spaces of any dimension.'],
      ['1900', 'Gregorio Ricci-Curbastro; Tullio Levi-Civita', 'Tensor calculus.'],
      ['1912–1915', 'Albert Einstein with Marcel Grossmann', 'Grossmann introduced Einstein to Riemann’s geometry; general relativity followed.'],
      ['1944', 'Shiing-Shen Chern', 'Gave the first intrinsic proof of the general Gauss–Bonnet theorem (after Allendoerfer and Weil, 1943), linking curvature to topology.'],
    ],
    uses: [['GPS and physics', 'Relativity corrections; gravitational waves'], ['Maps and navigation', 'Great-circle routes; map projections'], ['Computer graphics', 'Curvature of meshes; smoothing 3D scans'], ['Robotics and AI', 'Planning on curved configuration spaces; information geometry'], ['Medicine', 'Mapping the folded surface of the brain']],
    master: ['Start with curves and surfaces in 3D before abstract manifolds.', 'Do physical experiments: draw triangles on a ball.', 'Learn tensor index notation slowly.', 'MIT 18.950 notes are free.'],
    prac: [['Angle sum of a triangle on a sphere is (more/less) than 180°', 'More'], ['Gaussian curvature of a flat plane', '0'], ['Can you flatten an orange peel without tearing?', 'No (positive curvature)']],
    labs: ['play-mercator', 'play-relativity', 'play-seasons'], pre: ['multi', 'linalg', 'topo'], next: ['sympl', 'pde', 'algtop'],
    read: [['MIT OCW 18.950 Differential Geometry', 'https://ocw.mit.edu/courses/18-950-differential-geometry-fall-2008/']],
  });

  T(6, 'rep', {
    t: 'Commutative algebra and representation theory',
    big: 'Commutative algebra is the algebra behind geometry; representation theory studies symmetry by turning it into matrices.',
    learn: [
      'Commutative algebra studies rings such as polynomials in several variables. Hilbert’s Nullstellensatz links algebra and geometry exactly: shapes defined by polynomial equations correspond to certain ideals (special subsets) of a polynomial ring. Every geometric question about such shapes becomes an algebraic question, and vice versa. Algebraic geometry (tier 9) is built on this bridge.',
      'Representation theory studies a group by letting it act as matrices. The rotations of a square by 0°, 90°, 180°, 270° can be represented by four 2×2 rotation matrices; they can also be represented by the numbers 1, i, −1, −i. Breaking representations into irreducible (unsplittable) pieces is like breaking a sound into pure tones.',
      'That analogy is exact: Fourier analysis is the representation theory of the circle’s rotation group. The pure tones are the irreducible representations.',
      'In physics, symmetry groups determine what particles can exist. Wigner classified particles by representations of the symmetry group of spacetime. In 1961 Murray Gell-Mann (and Yuval Ne’eman) organized particles by the group SU(3) and predicted a missing particle, the Ω⁻, found in 1964.',
    ],
    ex: [
      ['Represent rotations of a square as complex numbers.', ['A 90° turn multiplies by i.', 'Rotations: 1, i, −1, −i. Combining rotations = multiplying: i × i = −1 is two quarter-turns.']],
      ['What do the ideals (x) and (x, y) in polynomials of x, y correspond to?', ['(x) ↔ the line x = 0.', '(x, y) ↔ the single point (0, 0). Smaller shapes, bigger ideals.']],
    ],
    why: 'Representations turn the abstract multiplication of a group into concrete matrix multiplication, where linear algebra applies. Characters (traces of the matrices) are enough to identify representations, and they satisfy orthogonality relations just like sine waves do. That is why the same mathematics organizes vibrations, crystals and particles.',
    sym: [['k[x, y]', 'polynomials in x, y over a field k'], ['I, (f, g)', 'ideals'], ['ρ: G → GL(V)', 'a representation of G on V'], ['χ_ρ', 'character', 'trace of ρ(g)'], ['SU(n)', 'special unitary group'], ['⊗, ⊕', 'tensor product, direct sum']],
    words: [['Ring, ideal', 'a number-like system and a special subset of it'], ['Noetherian', 'every ideal is finitely generated (after Emmy Noether)'], ['Irreducible', 'cannot be split further'], ['Character table', 'a summary of a group’s representations'], ['Lie group', 'a continuous symmetry group']],
    hist: [
      ['1840s–1871', 'Ernst Kummer; Richard Dedekind', 'Unique factorization failed in some number systems; “ideal numbers” and then ideals repaired it.'],
      ['1890–1893', 'David Hilbert', 'Basis theorem and Nullstellensatz.'],
      ['1896 and 1870s', 'Ferdinand Frobenius; Sophus Lie', 'Characters of finite groups; continuous symmetry groups.'],
      ['1921', 'Emmy Noether', 'Ideal theory in rings, the start of modern commutative algebra.'],
      ['1939 and 1961–64', 'Eugene Wigner; Gell-Mann and Ne’eman', 'Particles as representations; the Eightfold Way and the predicted Ω⁻.'],
    ],
    uses: [['Particle physics', 'The Standard Model’s symmetry group SU(3) × SU(2) × U(1)'], ['Chemistry', 'Character tables predict which spectral lines appear'], ['Signal processing', 'Fourier transforms on groups'], ['Machine learning', 'Networks built to respect symmetries (equivariant networks)'], ['Robotics', 'Solving polynomial equations for arm positions (Gröbner bases)']],
    master: ['Know abstract algebra and linear algebra well.', 'Build character tables for small groups by hand.', 'Connect each idea to Fourier series.', 'Learn Gröbner bases with a computer algebra system.'],
    prac: [['How many irreducible representations does a group of order 4 that is cyclic have?', '4 (all one-dimensional)'], ['Which ideal corresponds to the circle x² + y² = 1?', '(x² + y² − 1)']],
    labs: ['play-symmetry', 'play-fourier', 'play-polyhedra'], pre: ['absalg', 'linalg'], next: ['alggeo', 'langlands', 'arithgeo'],
    read: [['Napkin: an infinitely large napkin (free survey, Evan Chen)', 'https://web.evanchen.cc/napkin.html']],
  });

  T(6, 'pde', {
    t: 'Partial differential equations',
    big: 'Partial differential equations describe things that change in space and time at once: heat, waves, fluids, quantum particles and option prices.',
    learn: [
      'A PDE involves derivatives with respect to several variables. The heat equation ∂u/∂t = k ∂²u/∂x² says temperature changes in proportion to how much a point differs from the average of its neighbours: hot spots cool, cold spots warm. The wave equation ∂²u/∂t² = c² ∂²u/∂x² describes vibrating strings, sound and light. Laplace’s equation describes steady states such as electric potentials.',
      'Fourier’s trick (separation of variables) solves many linear PDEs: break the starting state into sine waves, evolve each wave separately, and add them back. For heat, the wave sin(nx) decays like e^(−kn²t): sharp, high-frequency wiggles vanish fastest. That is why heat smooths things out.',
      'Nonlinear PDEs are much harder. The Navier–Stokes equations of fluid flow can produce turbulence; whether smooth solutions can blow up is a Millennium Prize problem with major developments in 2026 (see tier 10).',
      'Most real PDEs are solved numerically: the domain is cut into a mesh and the equation becomes a huge system of algebraic equations, solved by computer. Weather forecasts, crash tests, aircraft design and medical scanners all run this way.',
    ],
    ex: [
      ['Check that u = e^(−t) sin x solves ∂u/∂t = ∂²u/∂x².', ['∂u/∂t = −e^(−t) sin x.', '∂²u/∂x² = −e^(−t) sin x. Equal. ✓']],
      ['A guitar string of length L vibrates with wave speed c. What frequencies can it make?', ['Fixed ends allow sin(nπx/L) shapes.', 'Frequencies nc/(2L): a fundamental and its whole-number multiples (harmonics).']],
    ],
    why: 'Each PDE is a conservation law or balance written locally: energy, mass or momentum flowing in and out of a tiny box. Linear PDEs obey superposition (solutions add), which makes Fourier methods work. Nonlinear terms let waves interact and steepen, which is the source of shocks and turbulence and of the hard questions.',
    sym: [['∂u/∂t', 'partial derivative in time'], ['Δu or ∇²u', 'Laplacian', 'sum of second derivatives'], ['u(x, t)', 'a field depending on place and time'], ['Ω, ∂Ω', 'a region and its boundary'], ['Hˢ', 'Sobolev space']],
    words: [['Boundary condition', 'what happens at the edges'], ['Initial condition', 'the starting state'], ['Elliptic, parabolic, hyperbolic', 'steady-state, diffusion-like, wave-like'], ['Well-posed', 'a unique solution that depends continuously on the data'], ['Weak solution', 'a solution in an averaged sense']],
    hist: [
      ['1747', 'Jean d’Alembert', 'The wave equation for a vibrating string.'],
      ['1807–1822', 'Joseph Fourier', 'The heat equation and Fourier series.'],
      ['1822–1845 and 1865', 'Claude-Louis Navier; George Stokes; James Clerk Maxwell', 'Fluid equations; electromagnetism.'],
      ['1922 and 1950', 'Lewis Fry Richardson; Charney, Fjørtoft and von Neumann', 'Richardson forecast weather by hand (slowly and badly); the first computer forecast ran on ENIAC in 1950.'],
      ['1926 and 1973', 'Erwin Schrödinger; Fischer Black, Myron Scholes, Robert Merton', 'The quantum wave equation; the option-pricing equation, a heat equation in disguise.'],
    ],
    uses: [['Weather and climate', 'Global models solve fluid PDEs on the whole planet'], ['Engineering', 'Stress, heat and airflow in design'], ['Medicine', 'CT scanners invert the Radon transform; MRI and ultrasound use wave physics'], ['Finance', 'Black–Scholes and its relatives'], ['Oil and earthquakes', 'Seismic waves reveal underground structure']],
    master: ['Learn ODEs and Fourier series first.', 'Derive the heat equation from a balance on a tiny rod segment.', 'Solve a few PDEs numerically in a spreadsheet or Python.', 'MIT 18.152 and 18.303 materials are free.'],
    prac: [['Is the heat equation linear?', 'Yes'], ['What happens to high-frequency wiggles under the heat equation?', 'They decay fastest'], ['Frequencies of a string with fundamental 110 Hz', '110, 220, 330, … Hz']],
    labs: ['play-fourier', 'play-harmonics', 'play-sir'], pre: ['multi', 'ode', 'series'], next: ['numer', 'stoch', 'mill'],
    read: [['MIT OCW 18.152 Introduction to Partial Differential Equations', 'https://ocw.mit.edu/courses/18-152-introduction-to-partial-differential-equations-fall-2011/']],
  });

  // ───────────────────────── Tier 7: Applied and computational math ─────────────────────────
  T(7, 'stoch', {
    t: 'Stochastic calculus',
    big: 'Stochastic calculus is calculus for quantities driven by randomness, such as particles jostled by molecules or prices moved by news.',
    learn: [
      'Brownian motion is the limit of a random walk with ever smaller, ever faster steps. Its path is continuous but jagged at every scale, and its spread grows like the square root of time: after 4 times as long it has wandered about twice as far. That √t rule is why risk over a year is roughly √252 times daily risk.',
      'Ordinary calculus fails on such paths because they have no slopes. Itô’s calculus replaces it. The key new rule is that a random step dW squared is not negligible: (dW)² = dt. As a result, Itô’s lemma has an extra term: for a function f of a random process, df picks up ½ f″ (dX)² in addition to the usual f′ dX.',
      'The standard model of a stock price is geometric Brownian motion, dS = μS dt + σS dW: average growth μ plus random shocks scaled by volatility σ. One surprising consequence: even with zero average return, the typical (median) outcome loses money. With σ = 30% a year, the median after one year is e^(−0.045) ≈ 0.956 of the start, a 4.4% loss, while the mean stays flat. Volatility drags down compound growth.',
      'The Black–Scholes model (1973) prices options by building a portfolio that cancels the randomness. It transformed finance, but its assumptions (normal returns, constant volatility, no jumps) fail in crises. Real markets have fat tails: the 22.6% one-day crash of October 1987 is essentially impossible under the model.',
    ],
    ex: [
      ['Daily volatility is 1%. What is the approximate yearly volatility?', ['Spread grows like √t; there are about 252 trading days.', '1% × √252 ≈ 15.9%.']],
      ['Use Itô’s lemma to find d(W²).', ['f(W) = W², f′ = 2W, f″ = 2.', 'd(W²) = 2W dW + ½ × 2 × (dW)² = 2W dW + dt.', 'The extra dt is the Itô correction.']],
    ],
    why: 'Over a short time dt, a random walk moves about √dt, not dt. Squared, that is dt: a first-order term that ordinary calculus would throw away. Keeping it is what makes Itô’s calculus correct for random paths.',
    sym: [['W_t or B_t', 'Brownian motion (Wiener process)'], ['dW', 'random increment', 'mean 0, variance dt'], ['μ, σ', 'drift, volatility'], ['dX = a dt + b dW', 'stochastic differential equation'], ['E[·]', 'expectation'], ['ℚ', 'risk-neutral measure']],
    words: [['Martingale', 'a fair game: the expected future value equals today’s'], ['Volatility', 'size of random fluctuations'], ['Drift', 'average trend'], ['Itô’s lemma', 'the chain rule for random processes'], ['Fat tails', 'extreme events more common than the normal curve predicts']],
    hist: [
      ['1900', 'Louis Bachelier', 'His thesis modelled Paris stock prices with Brownian motion, five years before Einstein.'],
      ['1905–1908', 'Albert Einstein; Marian Smoluchowski; Jean Perrin', 'Brownian motion explained by molecular collisions; Perrin’s experiments confirmed atoms exist (Nobel 1926).'],
      ['1923 and 1944–1951', 'Norbert Wiener; Kiyosi Itô', 'Wiener built Brownian motion rigorously; Itô created the stochastic integral and his lemma, working in wartime Japan.'],
      ['1940 / 2000', 'Wolfgang Doeblin', 'A French soldier who sent a sealed envelope to the Academy of Sciences before his death in 1940; opened in 2000, it contained a version of Itô’s results.'],
      ['1973–1998', 'Black, Scholes, Merton', 'Option pricing (Nobel 1997 for Scholes and Merton; Black had died). In 1998 Long-Term Capital Management, with Scholes and Merton as partners, collapsed and needed a Fed-organized rescue.'],
    ],
    uses: [['Finance and trading', 'Options, risk models, portfolio hedging'], ['Physics and chemistry', 'Diffusion, noise in circuits, molecular motion'], ['Biology', 'Random genetic drift in populations'], ['Engineering', 'Filtering noisy signals (Kalman–Bucy filter, 1961), used in navigation'], ['AI', 'Diffusion models generate images by learning to reverse a noising process described by SDEs']],
    master: ['Simulate random walks and geometric Brownian motion in code before the theory.', 'Master probability and measure theory.', 'Derive Itô’s lemma from a Taylor expansion yourself.', 'MIT 18.S096 (math with applications in finance) is free; treat every model’s assumptions with suspicion.'],
    prac: [['If daily volatility is 2%, roughly what is it over 25 trading days?', '10%'], ['E[W_t] and Var[W_t]', '0 and t'], ['d(e^W) by Itô', 'e^W dW + ½ e^W dt']],
    labs: ['play-randomwalk', 'play-gbm', 'play-kelly', 'play-lln'], pre: ['prob', 'ode', 'measure'], next: ['pde', 'numer'],
    read: [['MIT OCW 18.S096 Topics in Mathematics with Applications in Finance', 'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/']],
  });

  T(7, 'numer', {
    t: 'Numerical analysis and scientific computing',
    big: 'Numerical analysis designs the step-by-step methods computers use to approximate answers that no formula can give, and proves how accurate they are.',
    learn: [
      'Computers store most numbers approximately. In standard floating point, 0.1 + 0.2 gives 0.30000000000000004 because 0.1 has no exact binary form, just as ⅓ has no exact decimal form. Tiny errors like this can grow, so methods must be designed to keep them under control (stability).',
      'Newton’s method finds roots by repeatedly following the tangent line: x ← x − f(x)/f′(x). To find √2, use x ← (x + 2/x)/2. Starting from 1: 1.5, 1.41667, 1.414216: the number of correct digits roughly doubles each step. The same iteration was used on Babylonian clay tablets.',
      'Differential equations are solved by stepping forward in small time steps (Euler’s method, Runge–Kutta methods). Integrals are approximated by weighted sums. Huge linear systems are solved by elimination or by iterative methods that improve a guess. Monte Carlo methods use random sampling when everything else is too slow.',
      'Choices matter. In 1991 a Patriot missile battery’s clock drifted because 0.1 seconds was stored inexactly; after 100 hours the error was about a third of a second and the system failed to intercept a Scud missile that killed 28 US soldiers. In 1996 the Ariane 5 rocket destroyed itself when a 64-bit number was squeezed into a 16-bit slot.',
    ],
    ex: [
      ['Two Newton steps for √10, starting at 3.', ['x₁ = (3 + 10/3)/2 = 3.1667.', 'x₂ = (3.1667 + 10/3.1667)/2 ≈ 3.16228. True: 3.162278.']],
      ['Euler’s method for dy/dt = y, y(0) = 1, step 0.5, to t = 1.', ['y(0.5) ≈ 1 + 0.5 × 1 = 1.5.', 'y(1) ≈ 1.5 + 0.5 × 1.5 = 2.25. True value e ≈ 2.718: small steps matter.']],
    ],
    why: 'Error analysis splits mistakes into truncation error (from approximating a process, like stopping a series early) and rounding error (from finite digits). A good method makes the first small fast as steps shrink without letting the second explode. Condition numbers measure how sensitive the problem itself is: no method can fix a problem whose answer swings wildly with tiny input changes.',
    sym: [['xₙ₊₁ = g(xₙ)', 'iteration'], ['O(h²)', 'big-O', 'error shrinks like h²'], ['ε_mach', 'machine epsilon', '≈ 2.2 × 10⁻¹⁶ for double precision'], ['κ(A)', 'condition number of A']],
    words: [['Floating point', 'scientific notation in binary with fixed digits'], ['Convergence order', 'how fast errors shrink'], ['Stability', 'errors don’t blow up'], ['Mesh', 'grid that divides a domain'], ['Monte Carlo', 'estimation by random sampling']],
    hist: [
      ['c. 1800 BCE', 'Babylon', 'Tablet YBC 7289 gives √2 to about six decimal places, likely by the averaging method now called Newton’s.'],
      ['1669–1768', 'Newton; Joseph Raphson; Euler', 'Newton–Raphson iteration and Euler’s method for differential equations.'],
      ['1946–1949', 'Stanisław Ulam; John von Neumann; Nicholas Metropolis', 'Monte Carlo methods at Los Alamos, named after the casino; Ulam got the idea while estimating his chances in solitaire.'],
      ['1965', 'James Cooley; John Tukey', 'The fast Fourier transform, later found in unpublished notes by Gauss from about 1805.'],
      ['1985', 'William Kahan and colleagues', 'The IEEE 754 floating-point standard used by nearly every computer (Kahan received the Turing Award in 1989).'],
    ],
    uses: [['Weather and climate', 'Simulating the atmosphere on supercomputers'], ['Engineering', 'Finite-element crash tests and bridge analysis'], ['Film and games', 'Simulated water, smoke and cloth'], ['Medicine', 'Reconstructing CT and MRI images'], ['AI', 'Training is numerical optimization at enormous scale']],
    master: ['Implement each method yourself in Python before using a library.', 'Always test on problems with known answers.', 'Plot the error against the step size on log axes.', 'MIT 18.335 materials are free.'],
    prac: [['One Newton step for √5 from 2', '2.25'], ['Does halving the step in an O(h²) method halve the error?', 'No, it quarters it'], ['Why is 0.1 + 0.2 ≠ 0.3 on most computers?', '0.1 and 0.2 have no exact binary form']],
    labs: ['play-pidarts', 'play-slopefield', 'play-bigo', 'play-aliasing'], pre: ['calc1', 'linalg', 'ode'], next: ['optim', 'pde', 'ml'],
    read: [['MIT OCW 18.335J Introduction to Numerical Methods', 'https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/']],
  });

  T(7, 'optim', {
    t: 'Optimization and operations research',
    big: 'Optimization finds the best choice under constraints: the cheapest route, the most profitable plan, the model with the least error.',
    learn: [
      'Every optimization problem has three parts: decisions (variables), a goal (the objective to maximize or minimize) and limits (constraints). A factory chooses how many of each product to make (decisions) to maximize profit (goal) given machine hours and materials (constraints).',
      'In linear programming the goal and constraints are straight-line relationships. The allowed region is a polygon (or a many-sided polytope), and the best answer is always at a corner. The simplex method walks from corner to better corner. Problems with millions of variables are solved routinely.',
      'For smooth problems, gradient descent steps downhill along the slope. If the problem is convex (bowl-shaped), any valley is the lowest valley, so local search finds the global best. Neural networks are trained by stochastic gradient descent on non-convex landscapes, which works far better in practice than theory fully explains.',
      'Some problems are combinatorial: the best order to visit 50 cities (the travelling salesperson problem) has more possible tours than there are atoms on Earth. No known method solves all such problems quickly; operations researchers use clever bounds and heuristics, and it connects to the P vs NP question.',
    ],
    ex: [
      ['Maximize 3x + 2y with x + y ≤ 4, x + 3y ≤ 6, x, y ≥ 0.', ['Corners: (0, 0) → 0; (4, 0) → 12; (0, 2) → 4; (3, 1) → 11.', 'The best corner is (4, 0), value 12.']],
      ['Gradient descent on f(x) = (x − 3)² from x = 0 with step 0.25.', ['f′(x) = 2(x − 3). Step: x ← x − 0.25 × 2(x − 3).', '0 → 1.5 → 2.25 → 2.625 → … approaching 3.']],
    ],
    why: 'In linear programming, moving in any direction changes the objective at a constant rate, so you can always keep improving until you hit an edge, then a corner. At an optimum with constraints, Lagrange multipliers balance the pull of the objective against the push of each constraint, and those multipliers have meaning: they are the “shadow prices” of each resource.',
    sym: [['max / min f(x)', 'objective'], ['s.t.', 'subject to (the constraints)'], ['∇f', 'gradient'], ['λ', 'Lagrange multiplier (shadow price)'], ['η', 'learning rate (step size)']],
    words: [['Feasible region', 'all choices that satisfy the constraints'], ['Convex', 'bowl-shaped; no false valleys'], ['Local vs global optimum', 'best nearby vs best overall'], ['Heuristic', 'a good-enough method without a guarantee'], ['Duality', 'every LP has a mirror problem with the same optimal value']],
    hist: [
      ['1788 and 1847', 'Lagrange; Cauchy', 'Multipliers for constrained problems; gradient descent.'],
      ['1939', 'Leonid Kantorovich, Leningrad', 'Invented linear programming to plan production at a plywood trust; Soviet officials were wary of “prices” in his method.'],
      ['1940s', 'British and American wartime teams', 'Operations research for convoys, radar and bombing; George Dantzig created the simplex method in 1947 for US Air Force planning.'],
      ['1975 and 1990', 'Kantorovich and Tjalling Koopmans; Harry Markowitz', 'Nobel Prizes in economics for optimal resource allocation and for portfolio optimization (mean–variance, 1952).'],
      ['1951–1984', 'Robbins and Monro; Richard Bellman; Narendra Karmarkar', 'Stochastic approximation (the root of SGD), dynamic programming, and a fast interior-point method.'],
    ],
    uses: [['Logistics', 'Delivery routes, airline crews, warehouse layouts'], ['Energy', 'Which power plants to run each hour'], ['Finance', 'Portfolio construction under risk limits'], ['AI', 'Training every neural network'], ['Medicine', 'Radiation therapy planning; kidney exchange chains (Nobel 2012)'], ['Economics and planning', 'The debate over computing a planned economy began with these tools']],
    master: ['Formulate problems in words: decisions, goal, limits.', 'Solve small LPs by drawing them.', 'Use a solver (spreadsheet Solver, Python) on real data.', 'Read Boyd and Vandenberghe’s Convex Optimization, free online.'],
    prac: [['Minimum of x² − 4x + 7', '3 at x = 2'], ['Is f(x) = x⁴ convex?', 'Yes'], ['In an LP, where is the optimum found?', 'At a corner (vertex) of the feasible region']],
    labs: ['play-graddescent', 'play-tsp', 'play-graphroutes', 'play-planmarket', 'play-kelly'], pre: ['calc1', 'linalg', 'multi'], next: ['ml', 'game', 'comput'],
    read: [['Convex Optimization (free, Boyd and Vandenberghe)', 'https://web.stanford.edu/~boyd/cvxbook/'], ['MIT OCW 15.053 Optimization Methods in Management Science', 'https://ocw.mit.edu/courses/15-053-optimization-methods-in-management-science-spring-2013/']],
  });

  T(7, 'info', {
    t: 'Information theory and cryptography',
    big: 'Information theory measures information in bits and sets the limits of compression and communication; cryptography uses hard math problems to keep secrets.',
    learn: [
      'Claude Shannon defined information as surprise. A fair coin flip carries 1 bit. A coin that lands heads 90% of the time carries only about 0.47 bits per flip, because the outcome is usually predictable. Entropy, H = −Σ p log₂ p, is the average surprise, and it is the hard limit for lossless compression: no zip program can beat it on average.',
      'Noisy channels (radio, cables, scratched discs) corrupt bits. Error-correcting codes add clever redundancy so errors can be found and fixed. Shannon proved that every channel has a capacity: below it, communication can be made almost error-free; above it, it cannot. Modern codes come close to that limit.',
      'Cryptography’s oldest codes substitute letters, which frequency analysis breaks: in English, e is the most common letter. Modern symmetric ciphers like AES scramble data with a shared key. Public-key cryptography solves the problem of sharing keys: anyone can lock with your public key, but only your private key unlocks, because recovering it requires solving a problem believed to be infeasible, such as factoring a huge number.',
      'Large quantum computers running Shor’s algorithm would break today’s public-key systems. In 2024 the US standards agency NIST published replacement “post-quantum” standards based on lattice and hash problems, and the migration is under way.',
    ],
    ex: [
      ['Entropy of a coin with P(heads) = 0.9.', ['H = −(0.9 log₂ 0.9 + 0.1 log₂ 0.1).', '= 0.9 × 0.152 + 0.1 × 3.322 ≈ 0.469 bits.']],
      ['A repetition code sends each bit three times (0 → 000). What can it fix?', ['Decode by majority vote: 010 → 0.', 'It corrects any single error per block, at the cost of tripling the length.']],
    ],
    why: 'Entropy is the right measure because information from independent sources should add while probabilities multiply, and the logarithm is the function that turns multiplication into addition. Public-key cryptography works because some functions are easy one way and hard to reverse (multiplying primes vs factoring), and number theory provides a hidden “trapdoor” that only the key holder can use.',
    sym: [['H(X)', 'entropy of X', 'in bits'], ['I(X; Y)', 'mutual information'], ['C', 'channel capacity'], ['⊕', 'XOR', 'add bits mod 2'], ['(e, n), d', 'RSA public and private keys']],
    words: [['Bit', 'binary digit; also a unit of information'], ['Redundancy', 'extra information used for checking'], ['Hash function', 'a fingerprint of data that is hard to reverse'], ['Key exchange', 'agreeing on a secret over an open channel'], ['Post-quantum', 'designed to resist quantum computers']],
    hist: [
      ['9th century', 'al-Kindi, Baghdad', 'The earliest known description of frequency analysis for breaking ciphers.'],
      ['1932–1945', 'Marian Rejewski; Alan Turing; Gordon Welchman', 'Polish mathematicians broke Enigma first and shared their work; Bletchley Park scaled it up during the war.'],
      ['1948–1952', 'Claude Shannon; Richard Hamming; David Huffman', 'Information theory (Shannon credits John Tukey with the word “bit”); error-correcting codes; optimal compression codes (Huffman, as a student).'],
      ['1976–1977', 'Diffie and Hellman; Rivest, Shamir and Adleman', 'Public-key cryptography. Britain’s GCHQ had found equivalent methods earlier in secret.'],
      ['1994 and 2024', 'Peter Shor; NIST', 'A quantum algorithm for factoring; the first post-quantum standards.'],
    ],
    uses: [['Internet', 'HTTPS, secure messaging, online banking'], ['Media', 'ZIP, PNG, MP3 and JPEG compression'], ['Space and phones', 'Error-correcting codes on deep-space probes, 5G and Wi-Fi'], ['QR codes and discs', 'Reed–Solomon codes survive scratches and smudges'], ['AI', 'Language models are trained by minimizing cross-entropy'], ['Politics', 'Debates over encryption backdoors and surveillance']],
    master: ['Compute entropies by hand for small examples.', 'Break a substitution cipher using frequency analysis.', 'Implement RSA with small primes.', 'MacKay’s Information Theory, Inference, and Learning Algorithms is free online.'],
    prac: [['Entropy of a fair 8-sided die', '3 bits'], ['How many bits to choose 1 of 1,024 equally likely items?', '10'], ['Why can’t you compress random data?', 'It is already at maximum entropy']],
    labs: ['play-huffman', 'play-parity', 'play-rsa', 'play-passwords', 'play-modclock'], pre: ['prob', 'numth', 'explog'], next: ['comput', 'arithgeo'],
    read: [['Information Theory, Inference, and Learning Algorithms (free, David MacKay)', 'https://www.inference.org.uk/mackay/itila/book.html'], ['Shannon, A Mathematical Theory of Communication (1948)', 'https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf'], ['A Graduate Course in Applied Cryptography (free, Boneh and Shoup)', 'https://toc.cryptobook.us/']],
  });

  T(7, 'chaos', {
    t: 'Dynamical systems and chaos',
    big: 'Simple deterministic rules can produce behaviour so sensitive to starting conditions that long-term prediction is impossible.',
    learn: [
      'A dynamical system is a rule for how a state changes: a pendulum, a population, the weather. Some settle to a fixed point, some cycle, and some never repeat while staying bounded. That third kind is chaos.',
      'The logistic map xₙ₊₁ = r xₙ(1 − xₙ) is a one-line population model. For r = 2.8 it settles; at r = 3.2 it alternates between two values; at 3.5 between four; and past about 3.57 it becomes chaotic. Start at 0.2 and at 0.2000001 with r = 4, and within about 25 steps the two runs bear no resemblance to each other.',
      'Sensitive dependence is measured by the Lyapunov exponent: tiny differences grow exponentially. Since we never know the present exactly, forecasts lose accuracy at a predictable rate. For weather, useful forecasts reach about a week or two, and no improvement in computers will push the theoretical limit much further.',
      'Chaos has structure. Chaotic systems trace strange attractors with fractal shape, and the route to chaos is universal: the doubling points of very different systems approach each other at the same ratio, Feigenbaum’s constant 4.669….',
    ],
    ex: [
      ['Iterate x → 3.2x(1 − x) from 0.5 a few times.', ['0.5 → 0.8 → 0.512 → 0.7995 → 0.5130 → …', 'It settles into a 2-cycle near 0.513 and 0.799.']],
      ['An error doubles every day. Your measurement error is 0.001. When does it reach 1?', ['2ⁿ × 0.001 = 1 → 2ⁿ = 1000 → n ≈ 10 days.', 'Improving the measurement 10-fold buys only about 3.3 more days.']],
    ],
    why: 'Chaos needs stretching and folding: nearby states are pulled apart (stretching), but the system stays bounded, so trajectories fold back on themselves, like kneading dough. Two specks of flour start close and end up far apart after a few folds, yet never leave the dough.',
    sym: [['xₙ₊₁ = f(xₙ)', 'a map (discrete-time system)'], ['λ', 'Lyapunov exponent', 'positive means chaos'], ['δ ≈ 4.669', 'Feigenbaum constant'], ['ẋ = f(x)', 'a flow (continuous-time system)']],
    words: [['Fixed point', 'a state that stays put'], ['Bifurcation', 'a sudden change in behaviour as a parameter crosses a threshold'], ['Attractor', 'where trajectories end up'], ['Fractal', 'detail at every scale'], ['Butterfly effect', 'small causes, large long-run effects']],
    hist: [
      ['1890', 'Henri Poincaré', 'Studying the three-body problem for a prize, he found tangled orbits we now call chaotic, after an error in his first version was caught.'],
      ['1961–1963', 'Edward Lorenz, MIT', 'Rerunning a weather model with a number rounded from 0.506127 to 0.506 gave a completely different forecast; his 1963 paper founded chaos theory.'],
      ['1975–1978', 'Li and Yorke; Robert May; Mitchell Feigenbaum', '“Period three implies chaos” gave the field its name; May showed chaos in simple population models; Feigenbaum found universality.'],
      ['1978–1982', 'Brooks and Matelski; Benoit Mandelbrot', 'Robert Brooks and Peter Matelski first drew the set (1978); Mandelbrot’s 1980 computer images made it famous, followed by The Fractal Geometry of Nature (1982).'],
    ],
    uses: [['Weather and climate', 'Ensemble forecasts run many slightly different starts'], ['Ecology', 'Boom-and-bust population cycles'], ['Medicine', 'Heart rhythm disorders and epilepsy'], ['Spaceflight', 'Low-fuel routes along chaotic paths (Japan’s Hiten probe, 1991)'], ['Markets and engineering', 'Feedback loops, instabilities, synchronization']],
    master: ['Iterate maps in a spreadsheet and plot them.', 'Draw phase portraits for 2D systems.', 'Learn ODEs first, then read Strogatz’s Nonlinear Dynamics and Chaos.', 'Watch Strogatz’s free lecture series.'],
    prac: [['Fixed point of x → 2.5x(1 − x)', '0.6'], ['Is chaos random?', 'No: deterministic, but unpredictable in practice'], ['If errors grow 10× per week, a 0.0001 error reaches 1 after?', '4 weeks']],
    labs: ['play-logistic', 'play-dblpend', 'play-mandel', 'play-lotka', 'play-life'], pre: ['ode', 'calc1'], next: ['pde', 'stoch'],
    read: [['MIT OCW 18.353J Nonlinear Dynamics I: Chaos', 'https://ocw.mit.edu/courses/18-353j-nonlinear-dynamics-i-chaos-fall-2012/']],
  });

  T(7, 'game', {
    t: 'Game theory',
    big: 'Game theory is the mathematics of strategy: what to do when your best choice depends on what others choose.',
    learn: [
      'A game has players, the strategies each can choose, and payoffs for each combination. A Nash equilibrium is a set of choices where no player can do better by changing only their own choice.',
      'The prisoner’s dilemma shows why equilibrium need not be good for anyone. Two suspects each do better by betraying the other, whatever the other does, so both betray and both get long sentences, even though both staying silent would be better for both. Arms races, price wars, overfishing and climate inaction share this structure.',
      'In some games every fixed choice can be exploited, so the best play is to randomize. In rock-paper-scissors, choose each with probability ⅓. Studies of professional penalty kicks found that kickers and goalkeepers mix their directions close to what theory predicts.',
      'Repeated games change incentives: cooperation can be sustained by the threat of future punishment. In Robert Axelrod’s 1980 computer tournaments, the simple strategy “tit for tat” (cooperate first, then copy the other player) did best. Mechanism design runs game theory backwards: design the rules (an auction, a voting system, a matching market) so that self-interested behaviour produces a good outcome.',
    ],
    ex: [
      ['Prisoner’s dilemma: payoffs (you, them) are C/C = (3, 3), C/D = (0, 5), D/C = (5, 0), D/D = (1, 1). Find the equilibrium.', ['If they cooperate, you get 5 by defecting vs 3. If they defect, 1 vs 0. Defect is always better for you.', 'Same for them. Equilibrium: (D, D) with (1, 1), worse for both than (3, 3).']],
      ['Matching pennies: you win if the coins match, they win if not. Best strategy?', ['Any predictable choice can be exploited.', 'Both randomize 50–50; the expected payoff is 0.']],
    ],
    why: 'Nash proved, using a fixed-point theorem from topology, that every finite game has at least one equilibrium if mixed strategies are allowed. Equilibria explain stable outcomes, not good ones: the gap between individual and group interest is exactly what laws, contracts, reputation and institutions try to close.',
    sym: [['uᵢ(s)', 'payoff to player i'], ['s*', 'equilibrium strategy profile'], ['Δ(S)', 'mixed strategies over S'], ['BRᵢ', 'best response of player i']],
    words: [['Dominant strategy', 'best no matter what others do'], ['Zero-sum', 'one side’s gain is the other’s loss'], ['Mixed strategy', 'choosing at random with set probabilities'], ['Evolutionarily stable strategy', 'a behaviour that cannot be invaded by mutants'], ['Mechanism design', 'engineering the rules of a game']],
    hist: [
      ['1928 and 1944', 'John von Neumann; with Oskar Morgenstern', 'The minimax theorem for zero-sum games; Theory of Games and Economic Behavior.'],
      ['1950', 'John Nash; RAND Corporation', 'Nash equilibrium; Flood and Dresher’s experiment at RAND that Albert Tucker framed as the prisoner’s dilemma.'],
      ['1960 and 1973', 'Thomas Schelling; John Maynard Smith', 'Strategy of conflict and nuclear deterrence; evolutionarily stable strategies in biology.'],
      ['1994–2020', 'Nobel Prizes', 'Nash, Harsanyi and Selten (1994); Schelling and Aumann (2005); mechanism design (2007); matching markets (2012); auction design (2020, Milgrom and Wilson).'],
    ],
    uses: [['Geopolitics', 'Deterrence, arms races, sanctions, negotiations'], ['Economics', 'Auctions (spectrum sales raised billions), pricing, competition'], ['Biology', 'Evolution of cooperation and conflict'], ['Politics', 'Voting strategies, coalitions'], ['AI', 'Poker programs beat top professionals (2017, 2019)'], ['Traffic', 'Braess’s paradox: adding a road can slow everyone down']],
    master: ['Write payoff tables for real situations you face.', 'Find equilibria by checking each player’s best responses.', 'Play the Lab’s tournaments and auctions.', 'Read Schelling’s The Strategy of Conflict and Axelrod’s The Evolution of Cooperation.'],
    prac: [['Does every finite game have a pure-strategy equilibrium?', 'No (matching pennies), but it has a mixed one'], ['In rock-paper-scissors, equilibrium probabilities?', '⅓ each'], ['Is the prisoner’s dilemma zero-sum?', 'No']],
    labs: ['play-gametheory', 'play-chicken', 'play-armsrace', 'play-auction', 'play-condorcet', 'play-coalition'], pre: ['prob', 'optim'], next: ['comput'],
    read: [['Stanford Encyclopedia of Philosophy: game theory', 'https://plato.stanford.edu/entries/game-theory/'], ['Yale Open Courses: Game Theory (Ben Polak)', 'https://oyc.yale.edu/economics/econ-159']],
  });

  T(7, 'ml', {
    t: 'The mathematics of machine learning',
    big: 'Machine learning is linear algebra, calculus, probability and optimization working together: a model is a function with adjustable numbers, tuned to reduce its errors on data.',
    learn: [
      'Data become vectors: an image is a long list of pixel values; a word becomes a list of numbers placing it near similar words. A model is a function with parameters (weights). The simplest is a straight line, y = wx + b; a neural network chains many layers of “multiply by a matrix, then apply a simple bend”.',
      'Learning means minimizing a loss: a number measuring how wrong the predictions are, such as the average squared error or the cross-entropy between predicted and actual probabilities. Training computes the gradient of the loss with respect to every weight and takes a small step downhill (gradient descent), over and over.',
      'Backpropagation computes all those gradients efficiently. It is the chain rule from calculus, applied backwards through the layers, reusing intermediate results. Modern models have billions of weights, and the same idea scales.',
      'Probability and statistics decide whether learning generalizes. A model can memorize its training data and fail on new data (overfitting). Held-out test sets, regularization and more data guard against this. A model also learns whatever patterns its data contain, including historical biases, which is a statistical fact with ethical consequences.',
    ],
    ex: [
      ['One gradient step for y = wx + b with x = 2, target 7, w = 1, b = 0, loss (y − 7)², learning rate 0.05.', ['Prediction y = 2; error y − 7 = −5.', '∂L/∂w = 2(−5)(2) = −20; ∂L/∂b = 2(−5) = −10.', 'w ← 1 + 0.05 × 20 = 2; b ← 0 + 0.05 × 10 = 0.5.', 'New prediction 4.5: closer to 7.']],
      ['Softmax turns scores (2, 1, 0) into probabilities.', ['Exponentiate: e², e¹, e⁰ ≈ 7.39, 2.72, 1.', 'Divide by the total 11.11: ≈ 0.67, 0.24, 0.09.']],
    ],
    why: 'Gradient descent works because the gradient is the direction of steepest increase, so stepping against it reduces the loss fastest locally. Neural networks can represent almost any function (universal approximation theorems), but that alone does not explain why training finds good solutions that generalize; that remains an active research question.',
    sym: [['x, y', 'input, output'], ['W, b', 'weights, bias'], ['L(θ)', 'loss as a function of parameters θ'], ['∇_θ L', 'gradient of the loss'], ['σ(z)', 'activation function'], ['softmax', 'scores → probabilities']],
    words: [['Training / test set', 'data used to fit / data held back to check'], ['Overfitting', 'memorizing instead of learning patterns'], ['Learning rate', 'step size'], ['Epoch', 'one pass through the training data'], ['Embedding', 'a vector representing a word, image or item']],
    hist: [
      ['1805–1809', 'Adrien-Marie Legendre; Gauss', 'Least squares: fitting a line by minimizing squared errors, the first “learning” algorithm.'],
      ['1958 and 1969', 'Frank Rosenblatt; Minsky and Papert', 'The perceptron; a critique of its limits that slowed neural-network research.'],
      ['1970–1986', 'Seppo Linnainmaa; Paul Werbos; Rumelhart, Hinton and Williams', 'Reverse-mode automatic differentiation; backpropagation for networks, popularized in 1986.'],
      ['2012 and 2017', 'AlexNet; “Attention Is All You Need”', 'Deep networks on GPUs won image recognition; the transformer architecture underlies today’s language models.'],
      ['2024', 'Nobel Prizes', 'Physics to John Hopfield and Geoffrey Hinton for neural networks; chemistry partly to Demis Hassabis and John Jumper for AlphaFold’s protein-structure prediction.'],
    ],
    uses: [['Language and images', 'Translation, chatbots, image generation'], ['Science', 'Protein structures, materials, weather forecasting'], ['Medicine', 'Reading scans; risks of biased training data'], ['Finance', 'Fraud detection, credit models, trading'], ['Society', 'Recommendation feeds, policing tools and hiring tools raise fairness questions']],
    master: ['Learn linear algebra, multivariable calculus and probability first.', 'Implement a tiny neural network from scratch in Python.', 'Use the free Mathematics for Machine Learning book.', 'Always check a model on data it never saw.'],
    prac: [['What does backpropagation compute?', 'The gradient of the loss with respect to every weight (by the chain rule)'], ['Training accuracy 99%, test accuracy 60%: what is happening?', 'Overfitting'], ['Softmax of scores (0, 0)', '(0.5, 0.5)']],
    labs: ['play-perceptron', 'play-graddescent', 'play-kmeans', 'play-regression', 'play-fairness', 'play-convolution'], pre: ['linalg', 'multi', 'prob', 'optim'], next: ['comput', 'ai'],
    read: [['Mathematics for Machine Learning (free, Deisenroth, Faisal and Ong)', 'https://mml-book.github.io/'], ['3Blue1Brown: Neural networks', 'https://www.3blue1brown.com/lessons/neural-networks/']],
  });
})();
