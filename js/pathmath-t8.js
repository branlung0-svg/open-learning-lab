/* Math path, tiers 8–10: foundations, synthesis fields, and the research frontier.
   Frontier items dated 2025–26 are marked as developing and re-checked monthly. */
(function () {
  const M = (Lab.MATH = Lab.MATH || { topics: [], by: {} });
  M.T = M.T || ((tier, id, o) => { o.id = id; o.tier = tier; M.topics.push(o); M.by[id] = o; });
  const T = M.T;

  // ───────────────────────── Tier 8: Foundations and meta-math ─────────────────────────
  T(8, 'logic', {
    t: 'Mathematical logic and model theory (Gödel)',
    big: 'Logic studies proof itself. Its most famous result: any consistent system strong enough for arithmetic contains true statements it cannot prove.',
    learn: [
      'Around 1900 mathematicians hoped to put all of mathematics on a perfect footing: a precise formal language, a fixed list of axioms and rules, and a proof that the system never contradicts itself and can decide every statement. David Hilbert led this program.',
      'Kurt Gödel showed in 1931 that it cannot be done. His first incompleteness theorem: any consistent formal system that can express basic arithmetic contains statements it can neither prove nor disprove. The idea is to build, inside arithmetic, a statement that says in effect “this statement is not provable”. If the system proved it, the system would prove something false; so (if consistent) it cannot, and the statement is therefore true but unprovable. His second theorem: such a system cannot prove its own consistency.',
      'This does not mean mathematics is broken or that “anything goes”. Gödel’s earlier completeness theorem (1929) shows the basic rules of logic are perfectly reliable: every statement true in all models of a theory has a proof. The limits are about what one fixed set of axioms can settle.',
      'Model theory studies the structures (models) that satisfy a set of axioms. Surprising facts follow: first-order axioms for the numbers also have strange “non-standard” models, with infinitely large numbers. Abraham Robinson used this to make infinitesimals rigorous in 1961, vindicating Leibniz. Model theory has also solved problems in number theory and geometry, recognized in the 2026 Fields Medal to Jacob Tsimerman for o-minimal methods.',
    ],
    ex: [
      ['Truth table for “if P then Q”.', ['P true, Q true: true. P true, Q false: false.', 'P false: true either way (“vacuously true”).', 'So “if pigs fly, then 2 = 3” is a true implication.']],
      ['Why does the liar sentence (“this sentence is false”) not break logic, while Gödel’s sentence works?', ['Truth cannot be defined inside the system (Tarski), so the liar cannot be formalized.', 'Provability can be, so “this is not provable” is a legitimate arithmetic statement.']],
    ],
    why: 'Gödel’s key trick was coding: every formula and every proof gets a number, so statements about proofs become statements about numbers. A diagonal argument then produces a sentence that refers to its own code. The same self-reference idea powers Cantor’s and Turing’s proofs on the next pages.',
    sym: [['⊢', 'proves', 'T ⊢ φ: theory T proves φ'], ['⊨', 'models / satisfies', 'M ⊨ φ: φ is true in M'], ['∀, ∃', 'for all, there exists'], ['¬, ∧, ∨, →', 'not, and, or, implies'], ['Con(T)', 'T is consistent'], ['⌜φ⌝', 'Gödel number of φ']],
    words: [['Formal system', 'symbols, axioms and rules for deriving theorems'], ['Consistent', 'never proves a contradiction'], ['Complete', 'decides every statement'], ['Model', 'a structure where the axioms are true'], ['First-order logic', 'logic that quantifies over objects, not sets of objects']],
    hist: [
      ['c. 350 BCE and 1854', 'Aristotle; George Boole', 'Syllogistic logic; logic as algebra.'],
      ['1879 and 1901', 'Gottlob Frege; Bertrand Russell', 'Frege’s formal logic with quantifiers; Russell found a paradox in Frege’s system (the set of all sets that do not contain themselves) just as Frege’s second volume was going to press.'],
      ['1910–1913', 'Whitehead and Russell', 'Principia Mathematica tried to derive mathematics from logic.'],
      ['1929–1936', 'Kurt Gödel; Alfred Tarski; Gerhard Gentzen', 'Completeness and incompleteness; the undefinability of truth; a consistency proof for arithmetic using a stronger principle.'],
      ['1961 and 2026', 'Abraham Robinson; Jacob Tsimerman', 'Non-standard analysis; Fields Medal for o-minimal methods in arithmetic geometry.'],
    ],
    uses: [['Computing', 'Programming-language type systems, database query languages, SAT solvers'], ['Chip design', 'Formal verification became standard after Intel’s 1994 Pentium division bug cost it about $475 million'], ['AI', 'Automated reasoning and proof checking'], ['Philosophy', 'What can be known, and what follows from what']],
    master: ['Learn propositional and first-order logic with a free text such as forall x.', 'Practise formal proofs in a proof checker.', 'Read a careful popular account of Gödel before the technical proof (Nagel and Newman’s Gödel’s Proof).', 'Be wary of claims that Gödel proves things about minds or society; most are overreaches.'],
    prac: [['Is “if 2 + 2 = 5 then the Moon is cheese” true?', 'Yes (false hypothesis)'], ['Can a consistent system for arithmetic prove its own consistency?', 'No (second incompleteness theorem)'], ['Negate “every student passed”', 'Some student did not pass']],
    labs: ['play-truthtable', 'play-knights', 'play-paradoxes', 'play-turing'], pre: ['proofs', 'discrete'], next: ['sets', 'comput', 'hott'],
    read: [['forall x: an introduction to formal logic (free)', 'https://forallx.openlogicproject.org/'], ['Open Logic Project (free texts)', 'https://openlogicproject.org/'], ['Stanford Encyclopedia of Philosophy: Gödel’s incompleteness theorems', 'https://plato.stanford.edu/entries/goedel-incompleteness/']],
  });

  T(8, 'sets', {
    t: 'Axiomatic set theory and the sizes of infinity',
    big: 'Some infinities are bigger than others, and the standard axioms of mathematics cannot decide whether there is one in between.',
    learn: [
      'Two sets have the same size if their elements can be paired off one to one. By this test, the even numbers are as numerous as all whole numbers (pair n with 2n), and so are the fractions. Any set that can be listed first, second, third, … is countable.',
      'Cantor proved the real numbers cannot be listed. Suppose someone gives you a complete list of decimals between 0 and 1. Build a new decimal whose first digit differs from the first number’s first digit, whose second digit differs from the second number’s second digit, and so on. Your number differs from every number on the list, so the list was not complete. There are strictly more reals than whole numbers.',
      'More generally, the set of all subsets of any set is always bigger than the set itself, so there is an endless ladder of larger infinities: ℵ₀, then larger, then larger. Cantor asked whether any infinity sits strictly between the whole numbers and the reals (the continuum hypothesis).',
      'Paradoxes such as Russell’s forced mathematicians to choose careful axioms. The standard system, ZFC (Zermelo–Fraenkel with the axiom of choice), underlies almost all mathematics. Gödel (1940) showed the continuum hypothesis cannot be disproved from ZFC, and Paul Cohen (1963) showed it cannot be proved either. It is independent: ZFC simply does not decide it.',
    ],
    ex: [
      ['Show the integers ℤ are countable.', ['List them as 0, 1, −1, 2, −2, 3, −3, …', 'Every integer appears at a finite position, so ℤ pairs off with 1, 2, 3, …']],
      ['Hilbert’s hotel is full, with rooms 1, 2, 3, … A new guest arrives. Make room.', ['Move each guest from room n to room n + 1.', 'Room 1 is free. Infinite sets can be put in one-to-one correspondence with parts of themselves.']],
    ],
    why: 'The diagonal argument works because a listed collection can always be “escaped” by changing one feature per item. It is the same self-reference trick as Gödel’s and Turing’s: whatever list or system you propose, you can build an object it misses.',
    sym: [['|A|', 'cardinality (size) of A'], ['ℵ₀', 'aleph-null', 'the size of ℕ'], ['𝔠 or 2^ℵ₀', 'the size of the reals'], ['𝒫(A)', 'power set', 'all subsets of A'], ['∅', 'empty set'], ['ZFC', 'Zermelo–Fraenkel axioms with Choice']],
    words: [['Bijection', 'a perfect one-to-one pairing'], ['Countable', 'listable'], ['Uncountable', 'too big to list'], ['Axiom of choice', 'from any collection of non-empty sets you can pick one element from each'], ['Independent', 'neither provable nor disprovable from given axioms']],
    hist: [
      ['1874 and 1891', 'Georg Cantor', 'Proved the reals are uncountable; the diagonal argument. Some leading mathematicians fiercely opposed his work.'],
      ['1901', 'Bertrand Russell', 'The paradox of the set of all sets that are not members of themselves.'],
      ['1908–1922', 'Ernst Zermelo; Abraham Fraenkel; Thoralf Skolem', 'The ZF axioms.'],
      ['1940 and 1963', 'Kurt Gödel; Paul Cohen', 'The continuum hypothesis is consistent with ZFC (Gödel) and so is its negation (Cohen, using a new method called forcing; Fields Medal 1966).'],
    ],
    uses: [['Foundations', 'Every mathematical object can be built from sets'], ['Computer science', 'Showing that some problems have no algorithm (there are more problems than programs)'], ['Probability', 'Events are sets; σ-algebras organize them'], ['Philosophy', 'What does it mean for a mathematical statement to be true if the axioms do not decide it?']],
    master: ['Do the diagonal argument yourself with a written list.', 'Practise building bijections.', 'Learn the ZFC axioms in plain words.', 'Read the Stanford Encyclopedia entry on the continuum hypothesis.'],
    prac: [['Are the fractions countable?', 'Yes'], ['How many subsets does a 5-element set have?', '32'], ['Is the set of all computer programs countable?', 'Yes (each is a finite string)']],
    labs: ['play-diagonal', 'play-hilbert', 'play-setops', 'play-paradoxes'], pre: ['logic', 'proofs'], next: ['comput', 'cat', 'measure'],
    read: [['Stanford Encyclopedia of Philosophy: set theory', 'https://plato.stanford.edu/entries/set-theory/'], ['Open Logic Project (free texts on logic and set theory)', 'https://openlogicproject.org/']],
  });

  T(8, 'comput', {
    t: 'Computability and complexity (including P vs NP)',
    big: 'Some problems can never be solved by any computer program, and many that can may take longer than the age of the universe.',
    learn: [
      'In 1936 Alan Turing defined computation with an imaginary machine: a tape of symbols, a head that reads and writes, and a finite table of rules. Every algorithm that has ever run on any computer can be done by such a machine (the Church–Turing thesis).',
      'Turing then proved the halting problem undecidable: no program can examine every program and input and correctly say whether it will eventually stop. Suppose such a checker existed. Build a program that asks the checker about itself and does the opposite. Contradiction. One consequence (Rice’s theorem): no tool can perfectly detect any non-trivial behaviour of programs, so perfect antivirus software is impossible.',
      'Among solvable problems, complexity theory asks how long they take. P is the class of problems solvable in polynomial time (time growing like n² or n³, not 2ⁿ). NP is the class whose solutions can be checked quickly: checking a filled Sudoku is easy; filling one in may be hard.',
      'P vs NP asks whether every problem whose answer is easy to check is also easy to solve. Most researchers believe not, but no one has proved it; it is a Millennium Prize problem. Thousands of practical problems (scheduling, routing, protein folding models, Sudoku of size n) are NP-complete: a fast method for one would give a fast method for all.',
    ],
    ex: [
      ['Why can you check a Sudoku quickly?', ['Scan each row, column and box once for repeats: about 3 × 81 checks.', 'Finding a solution may need searching a huge number of possibilities.']],
      ['A brute-force search tries 2ⁿ options. At a billion per second, how long for n = 100?', ['2¹⁰⁰ ≈ 1.27 × 10³⁰ tries.', '≈ 1.27 × 10²¹ seconds ≈ 4 × 10¹³ years, thousands of times the age of the universe.']],
    ],
    why: 'Undecidability uses diagonalization, like Cantor’s and Gödel’s proofs: a supposed universal decider is fed a description of a program built to contradict it. Complexity separates problems not by whether they can be solved but by how resources scale, which is what matters for real computers.',
    sym: [['TM', 'Turing machine'], ['P, NP', 'polynomial time; nondeterministic polynomial time (quickly checkable)'], ['NP-complete', 'the hardest problems in NP'], ['O(n²)', 'big-O', 'grows at most like n²'], ['BQP', 'problems efficiently solvable by quantum computers']],
    words: [['Algorithm', 'a finite step-by-step procedure'], ['Decidable', 'some algorithm always answers correctly'], ['Reduction', 'turning one problem into another'], ['Polynomial time', 'efficient in theory'], ['Busy beaver', 'the longest-running halting program of a given size']],
    hist: [
      ['1928', 'Hilbert and Ackermann', 'Posed the decision problem: is there a mechanical way to settle any logical statement?'],
      ['1936', 'Alonzo Church; Alan Turing; Emil Post', 'Church and Turing independently answered no; Post independently proposed a similar model of computation.'],
      ['1956 and 1971–1973', 'Gödel’s letter to von Neumann; Stephen Cook; Leonid Levin; Richard Karp', 'Gödel privately anticipated P vs NP; Cook (in North America) and Levin (in the USSR) independently defined NP-completeness; Karp showed 21 problems NP-complete.'],
      ['1970', 'Yuri Matiyasevich (building on Davis, Putnam and Julia Robinson)', 'No algorithm decides whether every polynomial equation has whole-number solutions: Hilbert’s 10th problem.'],
      ['2024', 'The bbchallenge collaboration', 'Proved the fifth busy beaver number is 47,176,870, with a computer-checked proof, largely by amateurs.'],
    ],
    uses: [['Security', 'Encryption assumes some problems are hard; P = NP would upset that'], ['Software', 'Limits of bug-finding tools and compilers'], ['Logistics', 'Knowing a problem is NP-complete tells you to use approximations'], ['Quantum computing', 'Which problems quantum computers can and cannot speed up'], ['AI', 'Fundamental limits on what any reasoning system can decide']],
    master: ['Simulate a Turing machine in the Lab.', 'Work through the halting-problem proof until you can explain it to someone else.', 'Practise reductions between puzzles.', 'MIT 18.404J (Michael Sipser’s course) is free online.'],
    prac: [['Can a program decide if any program halts?', 'No'], ['Is “check this Sudoku solution” in NP?', 'Yes (and in P)'], ['If an NP-complete problem had a fast algorithm, what follows?', 'P = NP']],
    labs: ['play-turing', 'play-tsp', 'play-nqueens', 'play-bigo', 'play-pnp', 'play-automaton'], pre: ['logic', 'discrete'], next: ['mill', 'hott', 'ai'],
    read: [['MIT OCW 18.404J Theory of Computation', 'https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/'], ['Clay Institute: P vs NP', 'https://www.claymath.org/millennium/p-vs-np/']],
  });

  T(8, 'cat', {
    t: 'Category theory and higher categories',
    big: 'Category theory studies mathematical objects through the maps between them, revealing the same patterns across very different fields.',
    learn: [
      'A category has objects and arrows (morphisms) between them, with two rules: arrows compose (A → B then B → C gives A → C) and every object has an identity arrow that does nothing. Sets with functions form a category; so do groups with homomorphisms, spaces with continuous maps, and types with programs.',
      'The shift in viewpoint is that an object is known by its relationships. The product of two things (a pair of sets, a pair of groups, a pair of spaces) can be defined once, by a “universal property” about arrows, and that single definition works in every category at once.',
      'A functor is a map between categories that preserves arrows and composition. The fundamental group from algebraic topology is a functor from spaces to groups: a continuous map of spaces gives a homomorphism of groups. Natural transformations compare functors. These three ideas were the original reason for the theory (Eilenberg and Mac Lane, 1945).',
      'Higher category theory adds arrows between arrows (and arrows between those), needed when “equal” must be replaced by “equivalent in a specified way”. Jacob Lurie’s work on ∞-categories made these tools standard in topology and algebraic geometry. Category theory also shapes programming languages (monads in Haskell), database design and diagrammatic reasoning in quantum computing.',
    ],
    ex: [
      ['Describe the product of sets A and B by its universal property.', ['A × B comes with arrows to A and to B (take the first or second part of a pair).', 'Any set X with arrows to A and B has exactly one arrow into A × B that agrees with them.', 'The same definition gives products of groups, spaces and types.']],
      ['Is “take a group to its underlying set” a functor?', ['Yes: homomorphisms are functions, and composition is preserved.', 'It is called a forgetful functor.']],
    ],
    why: 'Many theorems in different fields turn out to be one theorem about arrows. Proving it at the level of categories proves all the versions at once and explains why they look alike. Critics have called the subject “abstract nonsense”, partly affectionately; its defenders point to its role in major proofs and in software design.',
    sym: [['f: A → B', 'arrow (morphism) from A to B'], ['g ∘ f', 'g after f'], ['id_A', 'identity on A'], ['F: 𝒞 → 𝒟', 'functor'], ['η: F ⇒ G', 'natural transformation'], ['Hom(A, B)', 'all arrows from A to B']],
    words: [['Object, morphism', 'the dots and arrows'], ['Functor', 'a structure-preserving map between categories'], ['Universal property', 'a definition by unique arrows'], ['Isomorphism', 'an arrow with an inverse'], ['Adjunction', 'a pair of functors in optimal balance'], ['Monad', 'a pattern for structured computation']],
    hist: [
      ['1945', 'Samuel Eilenberg; Saunders Mac Lane', 'Introduced categories, functors and natural transformations to organize algebraic topology.'],
      ['1957–1970', 'Alexander Grothendieck', 'Used categories to rebuild algebraic geometry.'],
      ['1963–1964', 'F. William Lawvere', 'Category-based foundations for mathematics and logic.'],
      ['1989–1992', 'Eugenio Moggi; Philip Wadler', 'Monads as a way to structure computation, adopted in Haskell.'],
      ['2009', 'Jacob Lurie', 'Higher Topos Theory, a foundational text for ∞-categories.'],
    ],
    uses: [['Programming', 'Functional languages, type systems, composable software'], ['Mathematics', 'Algebraic topology, algebraic geometry, representation theory'], ['Databases', 'Schema mappings and data migration'], ['Physics', 'Diagrammatic quantum computing (the ZX-calculus) and topological quantum field theory']],
    master: ['Know at least two areas (algebra and topology) so the examples mean something.', 'For each new concept, check it in Set, Grp and Top.', 'Read Emily Riehl’s free Category Theory in Context.', 'Try functional programming to feel composition in practice.'],
    prac: [['Name two categories', 'Sets and functions; groups and homomorphisms'], ['What must a functor preserve?', 'Composition and identities'], ['In the category of sets, what is an isomorphism?', 'A bijection']],
    labs: ['play-matrix', 'play-symmetry'], pre: ['absalg', 'topo'], next: ['hott', 'alggeo', 'langlands'],
    read: [['Category Theory in Context (free, Emily Riehl)', 'https://math.jhu.edu/~eriehl/context/'], ['nLab (wiki for higher category theory)', 'https://ncatlab.org/nlab/show/HomePage']],
  });

  // ───────────────────────── Tier 9: Synthesis fields ─────────────────────────
  T(9, 'alggeo', {
    t: 'Algebraic geometry',
    big: 'Algebraic geometry studies shapes defined by polynomial equations, using algebra to see geometry and geometry to see algebra.',
    learn: [
      'The circle x² + y² = 1, the parabola y = x², and the surface z = x² − y² are all solutions of polynomial equations. Algebraic geometry studies such shapes (varieties) in general: in any number of dimensions, over the complex numbers, over fractions, or over finite number systems.',
      'A small example shows the power of mixing algebra and geometry. Draw lines through the point (−1, 0) on the unit circle with slope t. Each line hits the circle once more, at ((1 − t²)/(1 + t²), 2t/(1 + t²)). When t is a fraction, so is the point. t = ½ gives (3/5, 4/5), which is the 3-4-5 triangle; t = ⅔ gives (5/13, 12/13), the 5-12-13 triangle. Geometry has listed every Pythagorean triple.',
      'In the 1950s and 1960s Alexander Grothendieck rebuilt the subject on “schemes”, which treat number systems as if they were spaces. That let geometric intuition work on problems about whole numbers. Using these tools, Pierre Deligne proved the Weil conjectures in 1974, which count solutions of equations over finite number systems.',
      'Algebraic geometry now appears in cryptography (elliptic curves), coding theory, robotics (the reachable positions of an arm are an algebraic variety), statistics, computer vision and string theory, whose extra dimensions are modelled by Calabi–Yau varieties.',
    ],
    ex: [
      ['Find the rational point on x² + y² = 1 for slope t = 3/4 through (−1, 0).', ['x = (1 − 9/16)/(1 + 9/16) = 7/25; y = (3/2)/(25/16) = 24/25.', 'That is the 7-24-25 triangle.']],
      ['How many points do the line y = x and the circle x² + y² = 2 share?', ['Substitute: 2x² = 2, x = ±1.', 'Two points, (1, 1) and (−1, −1), as Bézout’s theorem predicts for a line and a conic.']],
    ],
    why: 'Shapes defined by polynomials have rigid structure: they can be studied through the rings of polynomial functions on them (tier 6’s Nullstellensatz). Algebra makes the theory work over any number system, which is exactly what number theory needs, and geometry supplies intuition about dimension, curves and intersections.',
    sym: [['V(f)', 'variety of f', 'the solutions of f = 0'], ['𝔸ⁿ, ℙⁿ', 'affine space, projective space'], ['Spec R', 'spectrum of a ring', 'the space Grothendieck attached to R'], ['𝒪_X', 'structure sheaf', 'functions on X'], ['g', 'genus of a curve']],
    words: [['Variety', 'a shape defined by polynomials'], ['Projective space', 'adds “points at infinity” so parallel lines meet'], ['Scheme', 'Grothendieck’s generalized space'], ['Sheaf', 'data attached consistently to the pieces of a space'], ['Moduli space', 'a space whose points are themselves shapes']],
    hist: [
      ['1630s and 1779', 'Descartes and Fermat; Étienne Bézout', 'Curves as equations; counting intersections of curves.'],
      ['1850s', 'Bernhard Riemann', 'Riemann surfaces linked algebra, analysis and topology.'],
      ['1949 and 1974', 'André Weil; Pierre Deligne', 'Weil’s conjectures on counting solutions; Deligne’s proof (Fields Medal 1978).'],
      ['1958–1970', 'Alexander Grothendieck', 'Schemes and a vast new foundation, written with collaborators in thousands of pages. In 1970 he left the IHÉS institute in protest at its military funding, and later withdrew from mathematics.'],
    ],
    uses: [['Cryptography', 'Elliptic curves secure web traffic and cryptocurrencies'], ['Coding theory', 'Algebraic-geometry codes; Classic McEliece, a post-quantum candidate, uses Goppa codes'], ['Robotics and vision', 'Solving polynomial systems for arm positions and camera geometry'], ['Physics', 'String theory and mirror symmetry'], ['Statistics', 'Algebraic statistics of models with polynomial structure']],
    master: ['Know commutative algebra and topology well.', 'Start with plane curves and rational points before schemes.', 'Use free texts: Ravi Vakil’s The Rising Sea and the Stacks Project.', 'Compute examples with a computer algebra system.'],
    prac: [['Rational point on the unit circle for slope t = 1', '(0, 1)'], ['How many intersections, counted properly, do two conics have?', '4 (Bézout)']],
    labs: ['play-quadratic', 'play-pythag'], pre: ['rep', 'algtop', 'coord'], next: ['arithgeo', 'langlands', 'sympl'],
    read: [['The Rising Sea (free draft, Ravi Vakil)', 'https://math.stanford.edu/~vakil/216blog/'], ['The Stacks Project', 'https://stacks.math.columbia.edu/'], ['MIT OCW 18.725 Algebraic Geometry', 'https://ocw.mit.edu/courses/18-725-algebraic-geometry-fall-2015/']],
  });

  T(9, 'arithgeo', {
    t: 'Arithmetic geometry and Fermat’s Last Theorem',
    big: 'Arithmetic geometry uses geometry to answer questions about whole-number and fraction solutions of equations; it is how Fermat’s Last Theorem was finally proved.',
    learn: [
      'Fermat’s Last Theorem says xⁿ + yⁿ = zⁿ has no positive whole-number solutions when n > 2. Around 1637 Fermat wrote in a book margin that he had a marvellous proof the margin was too narrow to contain. It took 358 years.',
      'An elliptic curve is an equation like y² = x³ − 2. Its rational points can be added: draw the line through two points (or the tangent at one); it meets the curve at a third point; reflect it. Starting from (3, 5) on y² = x³ − 2, the tangent produces the new rational point (129/100, −383/1000). The points form a group, and the Birch and Swinnerton-Dyer conjecture (a Millennium problem) predicts its size from a related function.',
      'The proof of Fermat’s theorem went through elliptic curves. Gerhard Frey suggested that a solution to Fermat’s equation would produce a very strange elliptic curve; Ken Ribet proved such a curve could not be “modular” (matched to a modular form). Andrew Wiles, working largely in secret for seven years, proved enough of the modularity conjecture to rule it out. His 1993 announcement had a gap; with Richard Taylor he repaired it in 1994.',
      'Modularity (every elliptic curve over the fractions matches a modular form, proved in full in 2001) is a case of the Langlands program on the next tier. You can check one instance yourself in the Lab: count solutions of an elliptic curve modulo primes, and compare with the coefficients of a modular form.',
    ],
    ex: [
      ['Verify (3, 5) lies on y² = x³ − 2 and compute the tangent point.', ['3³ − 2 = 25 = 5². ✓', 'Tangent slope = 3x²/(2y) = 27/10.', 'x₃ = (27/10)² − 2·3 = 129/100; y₃ = (27/10)(3 − 129/100) − 5 = −383/1000.']],
      ['Why does Fermat for n = 4 imply it for n = 8?', ['A solution x⁸ + y⁸ = z⁸ is a solution (x²)⁴ + (y²)⁴ = (z²)⁴ for n = 4.', 'So proving prime exponents (and 4) covers everything.']],
    ],
    why: 'Counting solutions modulo primes is easy; finding all rational solutions is hard. Modularity and the Langlands program connect the easy local counts to deep global structure, which is why tools from geometry and representation theory can settle problems about whole numbers.',
    sym: [['E: y² = x³ + ax + b', 'an elliptic curve'], ['E(ℚ)', 'rational points of E'], ['a_p', 'p − (number of solutions mod p) + 1, roughly'], ['L(E, s)', 'L-function of E'], ['f(q) = Σ aₙqⁿ', 'a modular form']],
    words: [['Diophantine equation', 'equation to solve in whole numbers or fractions'], ['Rational point', 'a solution in fractions'], ['Rank', 'how many independent infinite-order points'], ['Modular form', 'a highly symmetric function on the complex upper half-plane'], ['Modularity', 'a curve’s counts matching a modular form’s coefficients']],
    hist: [
      ['c. 250 and c. 1637', 'Diophantus; Pierre de Fermat', 'Arithmetica; Fermat’s margin note in his copy, published by his son in 1670.'],
      ['1770–1847', 'Euler; Sophie Germain; Ernst Kummer', 'Proofs for small exponents; Germain, who corresponded under a male pseudonym, proved a major partial case; Kummer handled “regular” primes.'],
      ['1983', 'Gerd Faltings', 'Curves of genus 2 or more have only finitely many rational points (Fields Medal 1986).'],
      ['1984–1995', 'Frey; Ribet; Andrew Wiles; Richard Taylor', 'The route to Fermat; Wiles’s proof, published in 1995.'],
      ['2001 and 2024–', 'Breuil, Conrad, Diamond and Taylor; Kevin Buzzard and collaborators', 'Full modularity; a multi-year human project to verify Fermat’s Last Theorem in the Lean proof assistant. In September 2026 Anthropic announced an AI-generated Lean proof of the theorem (developing).'],
    ],
    uses: [['Cryptography', 'Elliptic-curve keys protect messaging, web traffic and Bitcoin'], ['Security politics', 'In 2013 leaked documents indicated the NSA had promoted an elliptic-curve random-number generator with a likely backdoor; NIST withdrew it in 2014'], ['Coding theory', 'Curves over finite fields give efficient codes'], ['Pure math', 'The congruent number problem and others reduce to elliptic curves']],
    master: ['Learn number theory and algebraic geometry basics first.', 'Do the chord-and-tangent addition by hand.', 'Count points mod small primes with code.', 'J. S. Milne’s free course notes cover elliptic curves and modular forms.'],
    prac: [['Is (2, 3) on y² = x³ + 1?', 'Yes (8 + 1 = 9)'], ['Who completed the proof of Fermat’s Last Theorem?', 'Andrew Wiles, with Richard Taylor (1994–95)']],
    labs: ['play-modular', 'play-modclock', 'play-rsa'], pre: ['numth', 'alggeo'], next: ['langlands', 'mill', 'abc'],
    read: [['J. S. Milne: course notes (free)', 'https://www.jmilne.org/math/'], ['Clay Institute: Birch and Swinnerton-Dyer conjecture', 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/']],
  });

  T(9, 'sympl', {
    t: 'Symplectic and noncommutative geometry',
    big: 'Symplectic geometry is the geometry of classical mechanics; noncommutative geometry is a geometry for quantum mechanics, where xy ≠ yx.',
    learn: [
      'Describe a moving object by its position and its momentum together: a point in “phase space”. As the object moves, physics carries the point along. Liouville’s theorem (1838) says areas (volumes) in phase space are preserved: a blob of possible starting states may stretch and twist but never shrinks. Symplectic geometry is the study of spaces with this kind of area structure.',
      'Mikhail Gromov showed in 1985 that symplectic maps are stranger than they look: you cannot squeeze a ball of states through a narrower hole in phase space even though volume is preserved (the “non-squeezing theorem”, a classical cousin of the uncertainty principle). New invariants (Floer homology, Fukaya categories) now connect the field to topology and string theory. John Pardon’s 2026 Fields Medal was for work in this area.',
      'In quantum mechanics, measuring position then momentum differs from momentum then position: the corresponding operators do not commute. Alain Connes developed noncommutative geometry, which recovers geometric ideas (distance, dimension, curvature) from algebras where order matters. It has been applied to the quantum Hall effect and, more speculatively, to the structure of the Standard Model of particle physics.',
      'A practical payoff: numerical methods that respect the symplectic structure (symplectic integrators) keep energy errors bounded over billions of steps. Astronomers use them to simulate the solar system over its whole lifetime.',
    ],
    ex: [
      ['A frictionless spring: position x, momentum p. What shape does its phase-space path have?', ['Energy p²/2m + kx²/2 is constant.', 'So the path is an ellipse, traced forever.']],
      ['Why does ordinary Euler stepping spiral outward for a spring, while a symplectic step does not?', ['Euler’s method slightly increases phase-space area each step, so energy creeps up.', 'A symplectic method preserves area, so energy errors stay bounded.']],
    ],
    why: 'Hamilton rewrote Newton’s mechanics so that motion is generated by the energy function through a fixed “symplectic form”. Because that form is preserved, so are phase-space volumes and many other quantities. The geometry is forced by the physics.',
    sym: [['ω', 'symplectic form'], ['(q, p)', 'position, momentum'], ['H(q, p)', 'Hamiltonian (energy)'], ['{f, g}', 'Poisson bracket'], ['[x, p] = iħ', 'canonical commutation relation']],
    words: [['Phase space', 'all possible positions and momenta'], ['Hamiltonian', 'the energy function that drives motion'], ['Symplectomorphism', 'a map preserving the symplectic structure'], ['Noncommutative', 'order of multiplication matters'], ['Mirror symmetry', 'a surprising duality between symplectic and algebraic geometry']],
    hist: [
      ['1833–1838', 'William Rowan Hamilton; Joseph Liouville', 'Hamiltonian mechanics; preservation of phase-space volume.'],
      ['1925–1939', 'Werner Heisenberg; Hermann Weyl', 'Noncommuting quantities in quantum mechanics; Weyl coined “symplectic”.'],
      ['1985–1994', 'Mikhail Gromov; Andreas Floer; Maxim Kontsevich', 'Non-squeezing; Floer homology; homological mirror symmetry (Kontsevich, Fields Medal 1998).'],
      ['1980s–1990s', 'Alain Connes', 'Noncommutative geometry, building on operator-algebra work that won him the 1982 Fields Medal.'],
      ['2026', 'John Pardon', 'Fields Medal for work in symplectic geometry and topology.'],
    ],
    uses: [['Astronomy', 'Long-term solar-system and galaxy simulations'], ['Physics', 'Classical and quantum mechanics, optics, plasma'], ['Engineering', 'Accelerator beam design keeps particles stable using phase-space ideas'], ['Pure math', 'Mirror symmetry links counting problems in different fields']],
    master: ['Learn Hamiltonian mechanics (a physics course) alongside differential geometry.', 'Simulate a spring with Euler and with a symplectic method and compare.', 'Ana Cannas da Silva’s Lectures on Symplectic Geometry are free.'],
    prac: [['Is phase-space volume preserved for frictionless systems?', 'Yes (Liouville)'], ['Do position and momentum operators commute?', 'No']],
    labs: ['play-pendulum', 'play-dblpend', 'play-slopefield'], pre: ['diffgeo', 'pde'], next: ['langlands'],
    read: [['Lectures on Symplectic Geometry (free, Ana Cannas da Silva)', 'https://people.math.ethz.ch/~acannas/Papers/lsg.pdf']],
  });

  T(9, 'hott', {
    t: 'Homotopy type theory and computer-checked proofs',
    big: 'New foundations treat proofs as programs and equality as a path, and computers can now check entire research proofs line by line.',
    learn: [
      'In type theory every object has a type (a number, a function, a proof), and a proof of a statement is a program of the corresponding type: the Curry–Howard correspondence. If a proof checker accepts the program, the proof is correct, down to the axioms.',
      'Homotopy type theory, developed around Vladimir Voevodsky’s univalence axiom (about 2009), reads types as spaces and equalities as paths between points. Univalence says that equivalent structures can be treated as equal, which matches how mathematicians actually reason. The HoTT book was written collaboratively at the Institute for Advanced Study in 2013.',
      'Proof assistants are now practical. The four colour theorem (2005), the Feit–Thompson theorem (2012) and the Kepler conjecture (2014) have been fully checked by computer. In 2020 Peter Scholze challenged the Lean community to check a difficult new theorem of his and Dustin Clausen; they finished in 2022. In 2026 AI agents began writing huge Lean proofs, including one of Fermat’s Last Theorem. Lean’s community library, mathlib, covers much of undergraduate mathematics and a growing amount of graduate material.',
      'AI systems increasingly write proofs in Lean, because Lean can check them. But a check only proves what was formally stated. In 2026, mathematicians warned that a Lean-verified AI proof can still differ from the problem as stated in ordinary language, so human reading of the definitions remains essential.',
    ],
    ex: [
      ['In Lean, what does a proof of “A and B” consist of?', ['A pair: a proof of A together with a proof of B.', 'Under Curry–Howard, “and” is the type of pairs.']],
      ['What does a proof of “if A then B” consist of?', ['A function that turns any proof of A into a proof of B.']],
    ],
    why: 'Computers check proofs mechanically, so a verified proof is as reliable as the small trusted core of the checker and the correctness of the stated definitions. Voevodsky turned to formal proofs after errors were found in published work, including his own, in fields where proofs had grown too long for referees to check fully.',
    sym: [['a : A', 'a has type A'], ['A → B', 'functions from A to B (also: A implies B)'], ['A × B', 'pairs (also: A and B)'], ['a = b', 'identity type: paths from a to b'], ['Π, Σ', 'dependent function and pair types']],
    words: [['Proof assistant', 'software that checks formal proofs (Lean, Coq/Rocq, Isabelle, Agda)'], ['Formalization', 'translating a proof into a checkable language'], ['Univalence', 'equivalence is equality'], ['mathlib', 'Lean’s community mathematics library'], ['Autoformalization', 'AI translating ordinary math into formal language']],
    hist: [
      ['1934–1969', 'Haskell Curry; William Howard', 'Proofs as programs.'],
      ['1967–1989', 'Nicolaas de Bruijn; Per Martin-Löf; Thierry Coquand and Gérard Huet', 'Automath, intuitionistic type theory, and the Coq system.'],
      ['2005–2014', 'Georges Gonthier; Thomas Hales and team', 'Formal proofs of the four colour theorem and the Kepler conjecture.'],
      ['2009–2013', 'Vladimir Voevodsky and colleagues', 'Univalent foundations and the HoTT book.'],
      ['2013 and 2020–2022', 'Leonardo de Moura; the Lean community', 'Lean, started at Microsoft Research; the Liquid Tensor Experiment checked Clausen and Scholze’s theorem.'],
      ['2026', 'AI systems', 'AI agents produced very large Lean proofs; in September Anthropic announced a Claude-made Lean proof of Fermat’s Last Theorem of about 13 million lines (developing).'],
    ],
    uses: [['Software safety', 'Verified compilers (CompCert) and operating-system kernels (seL4)'], ['Cryptography', 'Formally verified encryption code in browsers'], ['Mathematics', 'Checking long or computer-assisted proofs; collaboration at scale'], ['AI', 'Lean is the main way to check AI-generated proofs']],
    master: ['Play the Natural Number Game in your browser.', 'Formalize a few Book of Proof exercises in Lean.', 'Read the HoTT book’s first chapter.', 'Join the Lean Zulip chat to ask questions.'],
    prac: [['Under Curry–Howard, what is a proof of “A or B”?', 'A proof of A or a proof of B, tagged with which'], ['Does a Lean check guarantee the theorem says what you meant?', 'No: the formal statement must be checked by people']],
    labs: ['play-turing', 'play-truthtable'], pre: ['logic', 'cat', 'algtop'], next: ['ai', 'research'],
    read: [['Lean (language and community)', 'https://lean-lang.org/'], ['The Next Web: a Claude-made Lean proof of Fermat’s Last Theorem (2026)', 'https://thenextweb.com/news/anthropic-claude-fermat-last-theorem-lean-buzzard'], ['Natural Number Game', 'https://adam.math.hhu.de/#/g/leanprover-community/nng4'], ['The HoTT Book (free)', 'https://homotopytypetheory.org/book/']],
  });

  // ───────────────────────── Tier 10: The research frontier ─────────────────────────
  T(10, 'mill', {
    t: 'The Millennium Prize problems',
    big: 'In 2000 the Clay Mathematics Institute named seven great open problems with $1 million for each solution. One is solved. In 2026, AI-assisted proofs were claimed for several others; all are still under review.',
    learn: [
      'Poincaré conjecture: solved by Grigori Perelman in 2002–03 (see algebraic topology). He declined the prize in 2010.',
      'Riemann hypothesis (1859): the nontrivial zeros of the zeta function, which control how evenly primes are spread, all lie on one line in the complex plane. Trillions of zeros have been checked, and a proof would sharpen countless results about primes. On 20 November 2026 Levent Alpöge of Anthropic posted a claimed proof of it, and of a stronger generalized version, made with Claude and written in Lean. Others have compiled the Lean code, but no human-readable proof exists yet and experts are still checking it (developing). Disclosure: this Lab is drafted with Claude, made by Anthropic.',
      'P vs NP (1971): can every quickly checkable problem be quickly solved? (See computability.) Yang–Mills existence and mass gap: give a rigorous mathematical construction of the quantum theory behind the strong nuclear force and prove its lightest particle has positive mass. In October 2026 OpenAI claimed an unreleased proof of the existence part only; it is unverified. Hodge conjecture: certain topological features of algebraic shapes come from algebraic sub-shapes. Birch and Swinnerton-Dyer: how many independent rational points an elliptic curve has (its rank) is predicted by its L-function at s = 1.',
      'Navier–Stokes existence and smoothness (developing, November 2026): must smooth fluid flows in 3D stay smooth, or can they “blow up”? On 8 September 2026 OpenAI announced an AI-generated, Lean-checked proof that they can blow up when a smooth external force is applied. Clay’s statement allows this case, but several experts see it as a side question, not the core problem. NYU’s Tristan Buckmaster, whose related work came first, disputes how OpenAI reached its method; OpenAI denies using his work. Clay said the problem “has apparently been settled” but is reviewing it slowly and has awarded no prize. On 20 November 2026 Buckmaster and Levent Alpöge posted a claimed AI-assisted, Lean-formalized proof of blow-up with no force, with some numerical data still to come; it is still being checked. Disclosure: this Lab’s text is drafted with Claude, made by Anthropic, where Alpöge works; the authors report using Claude and OpenAI’s Codex.',
    ],
    ex: [
      ['Why can’t computers just check the Riemann hypothesis?', ['There are infinitely many zeros.', 'Checking trillions shows no counterexample so far but cannot rule one out further along. Only a proof covers them all.']],
      ['What would P = NP mean in practice?', ['Every problem with quickly checkable answers would have a fast algorithm, in principle.', 'Much of today’s cryptography would be breakable, and many scheduling and design problems would become easy.']],
    ],
    why: 'These problems were chosen because each sits where whole fields meet, so a solution would require, and create, new methods. Clay’s rules require publication in a qualifying journal and a waiting period with general acceptance, which is why prize decisions take years.',
    sym: [['ζ(s)', 'Riemann zeta function'], ['Re(s) = ½', 'the critical line'], ['P ≟ NP', 'P vs NP'], ['∂u/∂t + (u·∇)u = −∇p + νΔu + f', 'Navier–Stokes (f is the external force)']],
    words: [['Conjecture', 'a statement believed true but unproven'], ['Blow-up / singularity', 'a quantity becoming infinite in finite time'], ['Mass gap', 'a positive minimum energy for particles'], ['L-function', 'a function packaging counts of solutions modulo primes']],
    hist: [
      ['24 May 2000', 'Clay Mathematics Institute, Paris', 'Announced the seven problems.'],
      ['2002–2010', 'Grigori Perelman', 'Proved the Poincaré conjecture; declined the Fields Medal (2006) and the Clay prize (2010).'],
      ['September 2026', 'OpenAI', 'Announced a forced Navier–Stokes blow-up proof produced by AI agents and checked in Lean (developing).'],
      ['20 November 2026', 'Tristan Buckmaster and Levent Alpöge', 'Claimed an AI-assisted proof of unforced Navier–Stokes blow-up (developing).'],
      ['20 November 2026', 'Levent Alpöge', 'Posted a claimed proof of the Riemann hypothesis, made with Claude and written in Lean, with no human-readable version yet (developing).'],
    ],
    uses: [['Cryptography', 'P vs NP and the Riemann hypothesis bear on the security of codes'], ['Engineering', 'Navier–Stokes underlies all fluid simulation'], ['Physics', 'Yang–Mills is the mathematics of the Standard Model'], ['Mathematics', 'Each problem organizes decades of research']],
    master: ['Read Clay’s official problem descriptions.', 'Explore zeta zeros and prime counts yourself in the Lab’s experiments.', 'Follow Quanta Magazine and the authors’ own posts for developments; treat company announcements as claims until verified.'],
    prac: [['Which Millennium problem has been solved?', 'The Poincaré conjecture'], ['What does the Riemann hypothesis predict about zeros of ζ?', 'All non-trivial zeros have real part ½']],
    labs: ['play-zeta', 'play-primecount', 'play-pnp', 'play-collatz'], pre: ['complexan', 'numth', 'comput', 'pde'], next: ['research', 'ai'],
    read: [['Clay Mathematics Institute: the Millennium problems', 'https://www.claymath.org/millennium-problems/'], ['Implicator: Clay has not accepted the OpenAI claim (Nov 2026)', 'https://www.implicator.ai/clay-institute-navier-stokes-openai-proof-claim/'], ['Effortless Math (a test-prep blog): the 2026 Navier–Stokes claims explained', 'https://www.effortlessmath.com/blog/navier-stokes-problem-explained/'], ['Scientific American: OpenAI’s claim and the credit dispute', 'https://scientificamerican.com/article/openai-claims-blockbuster-math-breakthrough-amid-swirl-of-controversy'], ['Scientific American: did OpenAI solve the wrong problem?', 'https://scientificamerican.com/article/did-openai-solve-the-wrong-navier-stokes-problem'], ['The Decoder: Clay says the problem has apparently been settled', 'https://the-decoder.com/clay-mathematics-institute-says-the-navier-stokes-millennium-prize-problem-has-apparently-been-settled/'], ['The Next Web: the claimed Riemann hypothesis proof in Lean', 'https://thenextweb.com/news/anthropic-alpoge-claude-riemann-hypothesis-proof-lean'], ['Quanta Magazine: 2026 updates', 'https://www.quantamagazine.org/update/168664/']],
  });

  T(10, 'langlands', {
    t: 'The Langlands program',
    big: 'The Langlands program is a web of conjectures linking number theory, symmetry and geometry, often called a grand unified theory of mathematics.',
    learn: [
      'In 1967 Robert Langlands, then a young professor at Princeton, wrote a 17-page letter to André Weil proposing deep connections between two worlds. On one side: Galois groups, the symmetries of solutions to polynomial equations, which govern counting solutions modulo primes. On the other: automorphic forms, highly symmetric functions studied with harmonic analysis.',
      'The simplest case is centuries old. Quadratic reciprocity, guessed by Euler and Legendre and first proved by Gauss in 1796, links whether an odd prime p is a square modulo another odd prime q to whether q is a square modulo p. Langlands’ conjectures extend this kind of hidden harmony to vastly more equations and symmetry groups.',
      'Modularity, used to prove Fermat’s Last Theorem, is one case: for an elliptic curve, the prime p minus the number of solutions modulo p equals the p-th coefficient of a modular form. You can check one example yourself with the curve y² + y = x³ − x² and the form q ∏(1 − qⁿ)²(1 − q¹¹ⁿ)². Modulo 5 the curve has 4 solutions, and 5 − 4 = 1, the coefficient of q⁵.',
      'There are parallel versions for number fields, for function fields and for geometry (the “Rosetta stone” Weil described in 1940). In 2024 a team of nine mathematicians led by Dennis Gaitsgory and Sam Raskin proved the geometric Langlands conjecture in five papers totalling over 800 pages, after about 30 years of work. The number-theory version remains largely open.',
    ],
    ex: [
      ['Count solutions of y² + y = x³ − x² modulo 5 (plus one point at infinity).', ['Try x = 0, …, 4 and y = 0, …, 4: solutions are (0, 0), (0, 4), (1, 0), (1, 4).', 'With the point at infinity, 5 points. Then a₅ = 5 + 1 − 5 = 1, which equals the q⁵ coefficient of the modular form.']],
      ['Quadratic reciprocity for p = 3, q = 7.', ['Is 7 a square mod 3? 7 ≡ 1 = 1², yes.', 'Since 3 ≡ 3 and 7 ≡ 3 (mod 4), reciprocity predicts 3 is not a square mod 7. Check: squares mod 7 are 1, 2, 4. ✓']],
    ],
    why: 'Counting solutions prime by prime produces sequences of numbers. Langlands predicted that these sequences always arise from symmetric analytic objects, and that the matching is controlled by representation theory. When proved in a case, it turns hard questions on one side into easier ones on the other.',
    sym: [['Gal(Q̄/Q)', 'absolute Galois group'], ['ρ', 'Galois representation'], ['π', 'automorphic representation'], ['L(s, ρ) = L(s, π)', 'matching L-functions'], ['(p/q)', 'Legendre symbol: is p a square mod q?']],
    words: [['Reciprocity', 'a hidden match between two kinds of data'], ['Functoriality', 'transferring automorphic forms between groups'], ['Automorphic form', 'a function with many symmetries'], ['Geometric Langlands', 'the version for curves over the complex numbers']],
    hist: [
      ['1796–1801', 'Carl Friedrich Gauss', 'Proved quadratic reciprocity, which he called the “golden theorem”.'],
      ['1940 and 1967', 'André Weil; Robert Langlands', 'Weil’s letter on mathematical analogies; Langlands’ letter launching the program. Langlands received the Abel Prize in 2018.'],
      ['1990–2010', 'Vladimir Drinfeld; Laurent Lafforgue; Ngô Bảo Châu', 'Fields Medals for function-field cases and the “fundamental lemma” (2008).'],
      ['1995 and 2018', 'Andrew Wiles; Peter Scholze', 'Modularity for Fermat; new p-adic geometry (Fields Medal 2018) and, with Laurent Fargues, a geometric approach to local Langlands.'],
      ['2024', 'Gaitsgory, Raskin and seven co-authors', 'Proof of the geometric Langlands conjecture.'],
    ],
    uses: [['Number theory', 'Fermat’s Last Theorem, Sato–Tate and many results on primes'], ['Physics', 'Geometric Langlands connects to electric–magnetic duality in quantum field theory (Kapustin and Witten)'], ['Mathematics as a whole', 'A roadmap tying fields together']],
    master: ['Learn number theory, representation theory and algebraic geometry first.', 'Run the modular-form experiment in the Lab.', 'Read Langlands’ own letter and Edward Frenkel’s popular account Love and Math.'],
    prac: [['Squares mod 7', '1, 2, 4'], ['Which part of the Langlands program was proved in 2024?', 'The geometric Langlands conjecture']],
    labs: ['play-modular', 'play-modclock'], pre: ['arithgeo', 'rep'], next: ['research'],
    read: [['Robert Langlands’ papers and the 1967 letter (IAS)', 'https://publications.ias.edu/rpl/'], ['Quanta: monumental proof settles geometric Langlands (2024)', 'https://www.quantamagazine.org/monumental-proof-settles-geometric-langlands-conjecture-20240719/'], ['arXiv: Proof of the geometric Langlands conjecture I', 'https://arxiv.org/abs/2405.03599']],
  });

  T(10, 'abc', {
    t: 'The abc conjecture and a disputed proof',
    big: 'Shinichi Mochizuki says his inter-universal Teichmüller theory proves the abc conjecture. Most experts outside his circle say the proof has a fatal gap. This page shows both sides.',
    learn: [
      'The abc conjecture (Masser and Oesterlé, 1985–88) is about equations a + b = c in whole numbers with no common factor. Multiply the distinct primes dividing a, b and c to get rad(abc). Usually c is smaller than rad(abc). The conjecture says c can exceed rad(abc)^(1 + ε) only finitely often, for any ε > 0. Example: 1 + 8 = 9 has rad(1·8·9) = 6 < 9, a rare “hit”. If true, abc would imply many other results at once, including a version of Fermat’s Last Theorem for large exponents.',
      'In 2012 Mochizuki, at Kyoto University’s RIMS, posted four papers (over 500 pages) developing inter-universal Teichmüller theory (IUT) and claiming a proof. Few could follow them. In 2018 Peter Scholze and Jakob Stix visited Kyoto and reported a serious gap in Corollary 3.12, the key step. Mochizuki replied that they had misunderstood. The papers were published in 2021 in PRIMS, a journal based at his own institute where he is chief editor; the editors said he was not involved in handling them.',
      'Since 2024 Kirti Joshi has argued that Scholze and Stix’s objections are wrong but that Mochizuki’s proof is incomplete, and has proposed his own completion; Mochizuki rejects Joshi’s account. Project LANA, a Lean project at Japan’s ZEN University begun in 2024, set out in 2026 to check IUT by computer. Its July 2026 interim report suspended judgment and listed unclear points in the step leading to Corollary 3.12. Mochizuki’s own group is also writing Lean code for that step (developing).',
      'The outcome so far: outside Kyoto, most number theorists do not regard abc as proved. The case shows how mathematics settles disputes: not by authority or publication alone, but by whether experts can follow and check every step, and increasingly by computer verification.',
    ],
    ex: [
      ['Compute rad(abc) for 5 + 27 = 32.', ['Primes dividing 5·27·32: 5, 3, 2.', 'rad = 30 < 32: another abc hit.']],
      ['Is 2 + 3 = 5 a hit?', ['rad(2·3·5) = 30 > 5. No: this is the usual case.']],
    ],
    why: 'A proof is accepted when the community can verify it. When a proof is long, novel and understood by very few, verification can stall, as here. That is a strong argument for formalization and for writing proofs that others can check.',
    sym: [['rad(n)', 'radical', 'product of distinct primes dividing n'], ['q(a, b, c)', 'quality', 'log c / log rad(abc)'], ['IUT', 'inter-universal Teichmüller theory']],
    words: [['abc triple', 'a + b = c with no common factor'], ['Hit', 'a triple with c > rad(abc)'], ['Referee', 'an expert who checks a paper before publication'], ['Consensus', 'general acceptance by experts']],
    hist: [
      ['1985–1988', 'David Masser; Joseph Oesterlé', 'Formulated the abc conjecture.'],
      ['2012', 'Shinichi Mochizuki', 'Posted the IUT papers.'],
      ['2018', 'Peter Scholze and Jakob Stix', '“Why abc is still a conjecture”: a gap at Corollary 3.12.'],
      ['2021', 'PRIMS', 'Published Mochizuki’s papers.'],
      ['2024–2026', 'Kirti Joshi; Project LANA; Mochizuki’s group', 'Joshi’s alternative account; LANA (begun 2024) and Mochizuki’s own group working on computer verification, with a LANA interim report in July 2026 (developing).'],
    ],
    uses: [['Number theory', 'abc would settle many open problems at once'], ['Sociology of science', 'A case study in how expert communities verify claims']],
    master: ['Compute abc hits by computer and watch how rare they are.', 'Read both Scholze–Stix and Mochizuki’s replies (summaries first).', 'Ask of any claimed breakthrough: who has checked it, and how?'],
    prac: [['rad(72)', '6'], ['Is 1 + 80 = 81 an abc hit?', 'Yes: rad(1·80·81) = 30 < 81']],
    labs: ['play-primecount', 'play-sieve'], pre: ['numth', 'arithgeo'], next: ['research'],
    read: [['Scholze and Stix: Why abc is still a conjecture (2018)', 'https://www.math.uni-bonn.de/people/scholze/WhyABCisStillaConjecture.pdf'], ['Kirti Joshi: report on the controversy (2025)', 'https://arxiv.org/abs/2505.10568'], ['Mochizuki: formalization of IUT (April 2026)', 'https://www.kurims.kyoto-u.ac.jp/~motizuki/Formalization%20of%20IUT%20(2026-04).pdf'], ['ZEN University: Project LANA interim report (2026)', 'https://zen.ac.jp/news/zmcpostevent0717e']],
  });

  T(10, 'open', {
    t: 'Famous open problems and recent breakthroughs',
    big: 'Some of the hardest problems in mathematics can be stated to a child; several fell in the last few years.',
    learn: [
      'Still open: the twin prime conjecture (infinitely many primes two apart, like 11 and 13); the Goldbach conjecture (every even number above 2 is a sum of two primes, checked up to 4 × 10¹⁸); the Collatz conjecture (halve if even, triple and add one if odd: do you always reach 1?); whether π + e is irrational.',
      'Recent progress on old problems: In 2013 Yitang Zhang, then a little-known lecturer, proved there are infinitely many prime pairs less than 70 million apart; collaborative work (Polymath) and James Maynard cut the gap to 246 by 2014. In 2026 Julia Stadlmann lowered it to 240, then AI systems claimed 212 and then 186. Also in 2013 Harald Helfgott proved the “weak” Goldbach conjecture for odd numbers; it was computer-checked in 2026. In 2019 Terence Tao proved that almost all Collatz sequences get close to small values.',
      'Settled: Maryna Viazovska solved sphere packing in 8 dimensions in 2016 (and, with colleagues, in 24), earning a Fields Medal in 2022. In February 2025 Hong Wang and Joshua Zahl proved the three-dimensional Kakeya conjecture: a set holding a needle pointing in every direction can have zero volume, yet must still be fully three-dimensional. Wang received a 2026 Fields Medal. (OpenAI claimed an all-dimensions proof in October 2026; it is unverified.) Yu Deng, with Zaher Hani and Xiao Ma, rigorously derived the Boltzmann equation for gases from hard-sphere dynamics over long times, progress on Hilbert’s sixth problem; Deng also received a 2026 Fields Medal.',
      'Amateurs still contribute. In 2023 David Smith, a retired print technician and hobbyist, found the first single tile that covers the plane only without repeating (the “hat”), proved with three professional collaborators. In 2024 an online collaboration, largely of amateurs, determined the fifth busy beaver number.',
    ],
    ex: [
      ['Run the Collatz rule from 27.', ['27 → 82 → 41 → 124 → … it climbs as high as 9,232.', 'It reaches 1 after 111 steps. Nobody can prove every start does.']],
      ['Find the twin primes below 50.', ['(3, 5), (5, 7), (11, 13), (17, 19), (29, 31), (41, 43).']],
    ],
    why: 'Simple statements can hide deep structure: primes are defined by multiplication but these problems ask about addition, and the two operations interact in ways current tools only partly control. Progress often comes from new techniques imported from other fields, as with Kakeya, where harmonic analysis, geometry and combinatorics combined.',
    sym: [['p, p + 2', 'twin primes'], ['3n + 1', 'Collatz rule for odd n'], ['dim_H', 'Hausdorff dimension (Kakeya)']],
    words: [['Conjecture', 'believed but unproven'], ['Bounded gaps', 'gaps that do not grow without limit'], ['Aperiodic tiling', 'a tiling with no repeating pattern'], ['Busy beaver', 'the longest-running halting machine of a given size'], ['Kakeya set', 'a set containing a unit needle pointing in every direction']],
    hist: [
      ['2013', 'Yitang Zhang; James Maynard; Polymath8; Harald Helfgott', 'Bounded prime gaps; weak Goldbach.'],
      ['2016 and 2022', 'Maryna Viazovska', 'Sphere packing in dimensions 8 and 24; Fields Medal, the second woman to receive it.'],
      ['2023 and 2024', 'David Smith and collaborators; bbchallenge', 'The aperiodic “hat” tile; the fifth busy beaver.'],
      ['2025–2026', 'Hong Wang and Joshua Zahl; Yu Deng', 'Kakeya in 3D; Fields Medals 2026 to Deng, Pardon, Tsimerman and Wang. Deng and Wang are the first Chinese citizens to win; China-born Shing-Tung Yau won in 1982 but was not then a Chinese citizen.'],
    ],
    uses: [['Inspiration', 'Accessible problems are a gateway into research'], ['Methods', 'Attacks on famous problems create tools used across science'], ['Computing', 'Large verifications test hardware and algorithms']],
    master: ['Explore the Collatz and prime labs; make conjectures from data.', 'Read Quanta Magazine’s mathematics section.', 'Browse erdosproblems.com and the OEIS for problems you can explore.'],
    prac: [['Collatz steps from 6 to reach 1', '8 (6, 3, 10, 5, 16, 8, 4, 2, 1)'], ['Write 100 as a sum of two primes', '3 + 97 (also 11 + 89, 17 + 83, 29 + 71, 41 + 59, 47 + 53)']],
    labs: ['play-collatz', 'play-sieve', 'play-ulam', 'play-primecount', 'play-zeta'], pre: ['numth'], next: ['research', 'ai'],
    read: [['Quanta Magazine: mathematics', 'https://www.quantamagazine.org/mathematics/'], ['Quanta: the Kakeya proof (2025)', 'https://www.quantamagazine.org/once-in-a-century-proof-settles-maths-kakeya-conjecture-20250314/'], ['European Mathematical Society: 2026 Fields Medals', 'https://euromathsoc.org/news/2026-fields-medallists-and-imu-prize-winners-announced-222'], ['Science News: the 2026 twin-prime records', 'https://www.sciencenews.org/article/human-math-record-twin-primes-openai']],
  });

  T(10, 'ai', {
    t: 'AI and the future of proof (developing)',
    big: 'Between 2024 and 2026 AI systems went from contest problems to claimed research results; how much they can be trusted, and who gets credit, are live questions.',
    learn: [
      'In 2024 DeepMind’s AlphaProof and AlphaGeometry reached silver-medal level at the International Mathematical Olympiad; in 2025 systems from Google DeepMind and OpenAI reached gold-medal level. By 2026 AI tools were helping move Erdős problems (hundreds of open questions posed by Paul Erdős) to “solved”. Terence Tao noted that much of the early help was smart literature search, finding old papers that already contained answers, but AI also produced new proofs, and in May 2026 a Google DeepMind agent reported solving 9 of 353 Erdős problems it attempted, with Lean-checked proofs.',
      'In September 2026 OpenAI announced a claimed Navier–Stokes blow-up proof produced by many AI agents and checked in Lean (see the Millennium page). Many mathematicians think it is technically correct, but they raised concerns: whether the forced case meets the spirit of the problem, whether the Lean statements match the ordinary-language problem, how hard the AI-written proof is to understand, and credit for human researchers working on similar methods. OpenAI denies using their work.',
      'Formal verification is central to trusting AI mathematics: a computer can check every step of a Lean proof. But the check covers only what was formally stated, and translating informal statements correctly is hard. In June 2026 a group of mathematicians issued the Leiden Declaration on AI and mathematics, setting out principles for responsible use.',
      'What does this mean for learners? Calculation and routine proof are increasingly automated, so the human advantages shift toward choosing good questions, judging whether a statement is the right one, understanding why results are true, and explaining them. Those are exactly the skills this path tries to build. Using AI for hints and checking, not for answers you have not understood, keeps you learning.',
    ],
    ex: [
      ['A model outputs a Lean proof that compiles. What else must you check?', ['That the formal statement says what the problem says (definitions, quantifiers, hidden assumptions).', 'That no unproven axioms or shortcuts were added.']],
    ],
    why: 'Machines are strong at search and at checking; mathematics has many problems that reduce to large searches over possible arguments. Whether they can generate deep new concepts on their own is debated among mathematicians.',
    sym: [['⊢ (in Lean)', 'a goal to prove'], ['sorry', 'Lean placeholder for an unfinished proof']],
    words: [['Autoformalization', 'AI translating math into a formal language'], ['Benchmark', 'a fixed set of test problems'], ['Literature search', 'finding existing results'], ['Attribution', 'who gets credit']],
    hist: [
      ['2024', 'Google DeepMind', 'AlphaProof and AlphaGeometry: IMO silver-medal level.'],
      ['2025', 'Google DeepMind; OpenAI', 'IMO gold-medal level performance.'],
      ['2026', 'Many groups', 'AI-assisted Erdős problem solutions; the Leiden Declaration (June); OpenAI’s Navier–Stokes claim (September) and a batch of claimed results (October); Buckmaster and Alpöge’s unforced Navier–Stokes claim and Alpöge’s claimed Lean proof of the Riemann hypothesis (November). All developing.'],
    ],
    uses: [['Research', 'Literature search, checking, exploring examples'], ['Education', 'Hints and explanations, with care not to outsource understanding'], ['Software and security', 'Verified code']],
    master: ['Learn some Lean so you can read machine-checked proofs.', 'Ask AI for hints, then finish the work yourself.', 'Treat announcements as claims until independent experts confirm them.'],
    prac: [['Does a Lean-checked proof guarantee it solves the problem as stated in English?', 'No: the formal statement must match'], ['Name one human skill that matters more as AI improves', 'Choosing and judging the right questions (also: explanation, checking statements)']],
    labs: ['play-perceptron', 'play-turing'], pre: ['hott', 'ml'], next: ['research'],
    read: [['NPR: what mathematicians learned from the AI Navier–Stokes proof', 'https://www.npr.org/2026/09/22/nx-s1-5968588/openai-navier-stokes-problem-mathematicians-learn-little'], ['Leiden University: the Leiden Declaration (June 2026)', 'https://www.universiteitleiden.nl/en/news/2026/06/leiden-declaration-warns-ai-is-challenging-the-core-values-of-mathematics'], ['Scientific American: AI uncovers solutions to Erdős problems (Feb 2026)', 'https://people.math.harvard.edu/~williams/scientificamerican2.pdf'], ['arXiv: AI-driven formal proof search on Erdős problems (May 2026)', 'https://arxiv.org/abs/2605.22763'], ['arXiv: why Lean verification of autoformalized proofs is not enough (2026)', 'https://arxiv.org/pdf/2610.08144'], ['Epoch AI: FrontierMath Erdős benchmark', 'https://epoch.ai/benchmarks/frontiermath-erdos']],
  });

  T(10, 'research', {
    t: 'How research mathematics works (and how to take part)',
    big: 'New mathematics comes from examples, guesses, failed attempts, proofs and checking by others; anyone can start exploring.',
    learn: [
      'Discovery usually starts with examples and data. As a teenager Gauss studied tables of primes and guessed that primes near N occur with density about 1/ln N; it took a century to prove (the prime number theorem, 1896). Conjectures come from patterns; proofs explain them.',
      'Research is mostly failure. A mathematician may spend years on a problem, trying approaches that collapse. Andrew Wiles worked on Fermat in secret for seven years, announced a proof, found a gap, and needed another year with Richard Taylor to repair it.',
      'Results are shared as preprints on arXiv (since 1991), then refereed by journals, which can take years. Errors are found after publication too. Collaboration has grown: online Polymath projects (from 2009) involve dozens of people, and proof assistants let dozens contribute to one formal proof and hundreds to shared libraries such as mathlib.',
      'Who gets to do mathematics has changed and is still uneven. Sophie Germain wrote under a male name; Srinivasa Ramanujan, a clerk in Madras, reached Cambridge through a letter to G. H. Hardy in 1913; the first woman to win a Fields Medal was Maryam Mirzakhani in 2014. You can join in now: explore patterns in the OEIS, try Project Euler and Erdős problems, formalize mathematics in Lean, or make a conjecture from data in the Lab and test it.',
    ],
    ex: [
      ['Make and test a conjecture: is n² + n + 41 always prime?', ['n = 0 to 39 all give primes.', 'n = 40 gives 1,681 = 41². The pattern breaks: evidence is not proof.']],
      ['Look up the sequence 1, 1, 2, 5, 14, 42 in the OEIS.', ['These are the Catalan numbers, counting dozens of structures (bracketings, paths, trees).', 'The OEIS links the different places the sequence appears.']],
    ],
    why: 'Mathematics accumulates because proofs do not expire. Once a theorem is proved and checked, it becomes a permanent tool, which is why a 300-year-old question can be answered by combining ideas from many fields and centuries.',
    sym: [['arXiv:YYMM.NNNNN', 'a preprint identifier'], ['∎', 'the end of a proof: the goal of the whole process']],
    words: [['Preprint', 'a paper shared before peer review'], ['Referee', 'an expert checking a paper'], ['Conjecture', 'a stated guess'], ['Folklore', 'results “everyone knows” but no one wrote down']],
    hist: [
      ['1792–1793', 'Carl Friedrich Gauss', 'Guessed the prime number theorem from tables at about age 15.'],
      ['1913', 'Srinivasa Ramanujan', 'His letter to Hardy began one of mathematics’ great collaborations.'],
      ['1936, 2003', 'Fields Medal; Abel Prize', 'The main international prizes (Fields for under-40s).'],
      ['1991 and 2009', 'Paul Ginsparg; Timothy Gowers', 'arXiv; the first Polymath project.'],
      ['2014, 2022, 2026', 'Mirzakhani; Viazovska; Hong Wang', 'The first three women to receive the Fields Medal.'],
    ],
    uses: [['Your own learning', 'Asking and testing your own questions is the fastest way to understand'], ['Careers', 'Research, data science, finance, cryptography, engineering, teaching'], ['Citizenship', 'Knowing how claims are checked helps judge science in the news']],
    master: ['Keep a notebook of questions and patterns you notice.', 'Try to prove small things yourself before looking them up.', 'Join communities: Math Stack Exchange, the Lean Zulip, Project Euler forums.', 'Read biographies on the MacTutor history site.'],
    prac: [['What is the first n for which n² + n + 41 is not prime?', '40'], ['Where are new math papers usually posted first?', 'arXiv']],
    labs: ['play-collatz', 'play-ulam', 'play-primecount', 'play-benford'], pre: [], next: [],
    read: [['MacTutor History of Mathematics', 'https://mathshistory.st-andrews.ac.uk/'], ['The On-Line Encyclopedia of Integer Sequences', 'https://oeis.org/'], ['Erdős problems', 'https://www.erdosproblems.com/'], ['arXiv: mathematics', 'https://arxiv.org/archive/math']],
  });
})();
