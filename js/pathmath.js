/* Math path: mathematics from counting to the research frontier.
   Routes: #path-math (overview), #path-math-<1..10> (a tier), #path-math-t-<id> (one lesson),
   #path-math-<check|connect|fields|symbols|experiments|learn|library|about>.
   Lessons live in js/pathmath-t1/t3/t4/t6/t8.js (Lab.MATH). */
(function () {
  const h = Lab.h;
  const M = Lab.MATH; if (!M) return;
  const TIERS = [
    [1, 'Foundations of quantity', 'Ages about 5–10', 'Numbers as amounts: counting, the four operations, parts of a whole, measuring.'],
    [2, 'Pre-algebra and visual math', 'Ages about 11–13', 'Negative numbers, powers, letters for unknowns, proportions, basic geometry and data.'],
    [3, 'High-school core', 'Ages about 14–17', 'Functions, logarithms, complex numbers, proof, trigonometry and the tools calculus needs. The GED math test covers tiers 1–2 plus the algebra, functions and coordinate parts of tier 3; trigonometry, logarithms and complex numbers are not on it.'],
    [4, 'Introductory college math', 'First and second year of college', 'Calculus, linear algebra, differential equations and discrete math: the toolkit of science and engineering.'],
    [5, 'The bridge to pure math', 'Third and fourth year of college', 'The big shift: from calculating answers to proving why things are true.'],
    [6, 'Core graduate math', 'Master’s and early PhD', 'Infinite-dimensional spaces, curved spaces, deep algebra and the equations of physics.'],
    [7, 'Applied and computational math', 'Specialist and professional', 'Randomness, computation, optimization, information, chaos, strategy and machine learning.'],
    [8, 'Foundations and meta-math', 'Specialist', 'What proof is, sizes of infinity, the limits of computation, and the math of math.'],
    [9, 'Synthesis fields', 'Late PhD and research', 'Fields where branches merge: algebraic and arithmetic geometry, symplectic geometry, new foundations.'],
    [10, 'The research frontier', 'Open problems', 'Unsolved problems, disputed proofs, recent breakthroughs, AI, and how new math is made.'],
  ];
  const COL = ['#0EA5E9', '#16A34A', '#65A30D', '#CA8A04', '#EA580C', '#DC2626', '#DB2777', '#9333EA', '#4F46E5', '#334155'];
  const col = (t) => COL[t - 1];
  const byTier = (t) => M.topics.filter((x) => x.tier === t);
  const done = (id) => Lab.isDone && Lab.isDone('math:' + id);
  const link = (id) => '#path-math-t-' + id;
  // hands-on ladder rungs in js/mathpath.js that match lessons
  const RUNG = { count: 'count', arith: 'mul', frac: 'frac', neg: 'pow', var: 'alg', alg: 'func', geo1: 'geo', calc1: 'calc', calc2: 'calc', prob: 'prob', data1: 'stats' };

  // ───────────── answer checking ─────────────
  const norm = (s) => String(s).trim().replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/,(?=\d{3}\b)/g, '').replace(/\s+/g, '');
  const num = (s) => {
    let t = norm(s).replace(/%$/, '').replace(/^\$/, '');
    t = t.replace(/√\(?(\d+(?:\.\d+)?)\)?/g, '(Math.sqrt($1))').replace(/π/g, '(Math.PI)');
    if (!/^[0-9+\-*/().]*$/.test(t.replace(/Math\.sqrt|Math\.PI/g, '')) || !t) return NaN;
    try { const v = Function('"use strict";return (' + t + ')')(); return typeof v === 'number' && isFinite(v) ? v : NaN; } catch (e) { return NaN; }
  };
  const close = (a, b, tol) => Math.abs(a - b) <= (tol ?? 1e-6) + Math.abs(b) * 1e-9;
  const cplxParse = (s) => { const t = norm(s).replace(/\*/g, ''); const m = t.match(/^([+-]?\d*\.?\d*)?(?:([+-])(\d*\.?\d*)i)?$/); if (t.endsWith('i') && !/[+-]/.test(t.slice(1))) { const b = t.slice(0, -1); return [0, b === '' || b === '+' ? 1 : b === '-' ? -1 : +b]; } if (!m) return null; const re = m[1] ? +m[1] : 0; const im = m[2] ? (m[3] === '' ? 1 : +m[3]) * (m[2] === '-' ? -1 : 1) : 0; return [re, im]; };
  const check = (g, input) => {
    if (g.kind === 'list') { const vals = String(input).split(/[,;]|and|or/).map(num).filter((v) => !isNaN(v)).sort((a, b) => a - b); const want = [...g.a].sort((a, b) => a - b); return vals.length === want.length && vals.every((v, i) => close(v, want[i], g.tol)); }
    if (g.kind === 'cplx') { const z = cplxParse(input); return !!z && close(z[0], g.a[0]) && close(z[1], g.a[1]); }
    const v = num(input); return !isNaN(v) && close(v, g.a, g.tol);
  };
  const shown = (g) => g.show || (g.kind === 'list' ? g.a.join(' and ') : g.kind === 'cplx' ? `${g.a[0]} ${g.a[1] < 0 ? '−' : '+'} ${Math.abs(g.a[1])}i` : String(+(+g.a).toFixed(4)));

  // ───────────── practice generators ─────────────
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (p, q) => { const g = gcd(p, q) || 1; let [x, y] = [p / g, q / g]; if (y < 0) { x = -x; y = -y; } return y === 1 ? String(x) : `${x}/${y}`; };
  const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
  const f = (n) => Number(n).toLocaleString('en-US');
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, k) => fact(n) / (fact(k) * fact(n - k));
  const poly = (cs) => { const t = []; cs.forEach((c, i) => { const p = cs.length - 1 - i; if (!c) return; const a = Math.abs(c); const co = a === 1 && p ? '' : a; const term = p === 0 ? `${a}` : p === 1 ? `${co}x` : `${co}x${['', '', '²', '³', '⁴'][p]}`; t.push((c < 0 ? (t.length ? ' − ' : '−') : t.length ? ' + ' : '') + term); }); return t.join('') || '0'; };
  const GEN = {
    place: () => { let n, s, pos; do { n = ri(10000, 99999); s = String(n); pos = ri(0, 4); } while (s[pos] === '0' || s.split(s[pos]).length > 2); const d = +s[pos]; const pv = 10 ** (4 - pos); const names = ['ten-thousands', 'thousands', 'hundreds', 'tens', 'ones']; return { q: `What is the value of the digit ${d} in ${f(n)}?`, a: d * pv, steps: [`${d} is in the ${names[pos]} place.`, `${d} × ${f(pv)} = ${f(d * pv)}.`] }; },
    arith: () => { const k = ri(0, 3); if (k === 0) { const a = ri(120, 989), b = ri(120, 989); return { q: `${a} + ${b}`, a: a + b, steps: [`Add hundreds, tens and ones, carrying when a column passes 9.`, `= ${a + b}`] }; } if (k === 1) { const a = ri(300, 999), b = ri(100, a - 1); return { q: `${a} − ${b}`, a: a - b, steps: [`Check by adding back: ${a - b} + ${b} = ${a}.`] }; } if (k === 2) { const a = ri(12, 99), b = ri(3, 19); return { q: `${a} × ${b}`, a: a * b, steps: [`Split ${a} into ${a - (a % 10)} + ${a % 10}.`, `${a - (a % 10)} × ${b} = ${(a - (a % 10)) * b}; ${a % 10} × ${b} = ${(a % 10) * b}.`, `Add: ${a * b}.`] }; } const d = ri(3, 12), qn = ri(11, 99); return { q: `${d * qn} ÷ ${d}`, a: qn, steps: [`How many ${d}s fit in ${d * qn}? ${d} × ${qn} = ${d * qn}.`] }; },
    frac: () => { const D = [2, 3, 4, 5, 6, 8, 10, 12]; const b = pick(D), d = pick(D); const a = ri(1, b - 1), c = ri(1, d - 1); const op = pick(['+', '−', '×']); const L = (b * d) / gcd(b, d); let p, qq, steps; if (op === '×') { p = a * c; qq = b * d; steps = [`Multiply tops and bottoms: ${a * c}/${b * d}.`, `Simplify: ${fr(p, qq)}.`]; } else { const A = a * (L / b), Cc = c * (L / d); p = op === '+' ? A + Cc : A - Cc; qq = L; steps = [`Common denominator ${L}: ${a}/${b} = ${A}/${L}, ${c}/${d} = ${Cc}/${L}.`, `${A} ${op} ${Cc} = ${p}, so ${p}/${L} = ${fr(p, qq)}.`]; } return { q: `${a}/${b} ${op} ${c}/${d}  (give a fraction or decimal)`, a: p / qq, show: fr(p, qq), steps }; },
    meas: () => { const k = ri(0, 4); if (k === 0) { const x = ri(11, 99) / 10; return { q: `${x} km in metres`, a: Math.round(x * 1000), steps: ['1 km = 1,000 m, so multiply by 1,000.'] }; } if (k === 1) { const x = ri(120, 990); return { q: `${x} cm in metres`, a: x / 100, steps: ['100 cm = 1 m, so divide by 100.'] }; } if (k === 2) { const x = ri(2, 9); return { q: `${x} hours in seconds`, a: x * 3600, steps: [`${x} × 60 × 60 = ${f(x * 3600)}.`] }; } if (k === 3) { const l = ri(3, 25), w = ri(2, 15); return { q: `Area of a ${l} m by ${w} m rectangle (m²)`, a: l * w, steps: [`Area = length × width = ${l * w} m².`] }; } const l = ri(3, 25), w = ri(2, 15); return { q: `Perimeter of a ${l} m by ${w} m rectangle (m)`, a: 2 * (l + w), steps: [`2 × (${l} + ${w}) = ${2 * (l + w)} m.`] }; },
    neg: () => { const a = ri(-9, 9), b = ri(-5, 5) || 2, c = ri(-6, 6), d = ri(-6, 6); const v = a + b * (c - d) ** 2; const p = (n) => (n < 0 ? `(−${-n})` : n); return { q: `${a} + ${p(b)} × (${c} − ${p(d)})²`, a: v, steps: [`Brackets: ${c} − ${p(d)} = ${c - d}.`, `Power: (${c - d})² = ${(c - d) ** 2}.`, `Multiply: ${p(b)} × ${(c - d) ** 2} = ${b * (c - d) ** 2}.`, `Add: ${a} + ${p(b * (c - d) ** 2)} = ${v}.`] }; },
    lin: () => { const x = ri(-9, 9); let a = ri(2, 9), c = ri(1, 8); if (a === c) a++; const b = ri(-12, 12), d = a * x + b - c * x; return { q: `Solve ${a}x ${b ? sg(b) : ''} = ${c === 1 ? '' : c}x ${d ? sg(d) : ''}`.replace(/ +/g, ' ').replace(/ =/, ' ='), a: x, steps: [`Subtract ${c === 1 ? '' : c}x from both sides: ${a - c === 1 ? '' : a - c}x ${b ? sg(b) : ''} = ${d}.`, b ? `${b < 0 ? 'Add ' + -b : 'Subtract ' + b} on both sides: ${a - c === 1 ? '' : a - c}x = ${d - b}.` : `So ${a - c === 1 ? '' : a - c}x = ${d}.`, `Divide by ${a - c}: x = ${x}.`] }; },
    pct: () => { if (Math.random() < 0.5) { const A = ri(2, 30) * 20, p = pick([-50, -40, -25, -20, -10, 5, 10, 15, 20, 25, 40, 50, 75]); const B = A * (1 + p / 100); return { q: `A price goes from $${f(A)} to $${f(B)}. Percent change? (use − for a fall)`, a: p, steps: [`Change: ${f(B - A)}.`, `${f(B - A)} ÷ ${f(A)} = ${p / 100} = ${p}%.`] }; } const p = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 60, 75]), N = ri(2, 40) * 20; return { q: `${p}% of ${f(N)}`, a: (p * N) / 100, steps: [`${p}% = ${p / 100}.`, `${p / 100} × ${f(N)} = ${f((p * N) / 100)}.`] }; },
    pyth: () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]).map((v) => v); const k = ri(1, 4); const [A, B, Cc] = [a * k, b * k, c * k]; if (Math.random() < 0.5) return { q: `A right triangle has legs ${A} and ${B}. Find the hypotenuse.`, a: Cc, steps: [`${A}² + ${B}² = ${A * A + B * B}.`, `√${A * A + B * B} = ${Cc}.`] }; return { q: `A right triangle has hypotenuse ${Cc} and one leg ${A}. Find the other leg.`, a: B, steps: [`${Cc}² − ${A}² = ${Cc * Cc - A * A}.`, `√${Cc * Cc - A * A} = ${B}.`] }; },
    stats: () => { const n = pick([5, 7]); const xs = Array.from({ length: n }, () => ri(1, 30)); const s = [...xs].sort((a, b) => a - b); if (Math.random() < 0.5) return { q: `Median of ${xs.join(', ')}`, a: s[(n - 1) / 2], steps: [`Sort: ${s.join(', ')}.`, `Middle value: ${s[(n - 1) / 2]}.`] }; const sum = xs.reduce((a, b) => a + b, 0); return { q: `Mean of ${xs.join(', ')} (to 2 decimal places)`, a: sum / n, tol: 0.006, steps: [`Sum = ${sum}; count = ${n}.`, `${sum} ÷ ${n} = ${(sum / n).toFixed(2)}.`] }; },
    quad: () => { const r = ri(-9, 9), s = ri(-9, 9); const b = -(r + s), c = r * s; return { q: `Solve x² ${b ? sg(b) + 'x ' : ''}${c ? sg(c) : ''} = 0  (separate roots with a comma)`.replace('  ', ' '), a: r === s ? [r] : [r, s], kind: 'list', steps: [`Find two numbers that multiply to ${c} and add to ${b}: ${-r} and ${-s}.`, `(x ${sg(-r)})(x ${sg(-s)}) = 0.`, `x = ${r}${r === s ? ' (repeated)' : ' or x = ' + s}.`] }; },
    log: () => { const b = pick([2, 3, 5, 10]), k = ri(-2, 5); const N = b ** k; const Ns = k < 0 ? `1/${b ** -k}` : f(N); return Math.random() < 0.5 ? { q: `log${['', '', '₂', '₃', '', '₅'][b] || '₁₀'}(${Ns})`, a: k, steps: [`${b}^${k} = ${Ns}, so the log is ${k}.`] } : { q: `Solve ${b}ˣ = ${Ns}`, a: k, steps: [`Write ${Ns} as a power of ${b}: ${b}^${k}.`, `x = ${k}.`] }; },
    cplx: () => { const nz = () => (ri(0, 1) ? 1 : -1) * ri(1, 5); const a = nz(), b = nz(), c = nz(), d = nz(); const re = a * c - b * d, im = a * d + b * c; const z = (x, y) => `(${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i)`; return { q: `${z(a, b)}${z(c, d)}  (answer like 3 − 2i)`, a: [re, im], kind: 'cplx', steps: [`Expand: ${a * c} + ${a * d}i + ${b * c}i + ${b * d}i².`, `i² = −1, so real part ${a * c} − (${b * d}) = ${re}, imaginary part ${a * d + b * c}.`] }; },
    coord: () => { const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]); const x = ri(-6, 6), y = ri(-6, 6); const sx = pick([1, -1]), sy = pick([1, -1]); if (Math.random() < 0.6) return { q: `Distance from (${x}, ${y}) to (${x + sx * a}, ${y + sy * b})`, a: c, steps: [`Across ${a}, up/down ${b}.`, `√(${a}² + ${b}²) = ${c}.`] }; return { q: `Slope of the line through (${x}, ${y}) and (${x + sx * a}, ${y + sy * b})`, a: (sy * b) / (sx * a), show: fr(sy * b, sx * a), steps: [`Rise ${sy * b}, run ${sx * a}.`, `Slope = ${fr(sy * b, sx * a)}.`] }; },
    trig: () => { if (Math.random() < 0.55) { const A = pick([0, 30, 45, 60, 90]); const fn = pick(A === 90 ? ['sin', 'cos'] : ['sin', 'cos', 'tan']); const r = (A * Math.PI) / 180; const v = fn === 'sin' ? Math.sin(r) : fn === 'cos' ? Math.cos(r) : Math.tan(r); const nice = { 0: '0', 0.5: '1/2', 1: '1' }[+v.toFixed(6)] || (close(v, Math.SQRT1_2, 1e-9) ? '√2/2' : close(v, Math.sqrt(3) / 2, 1e-9) ? '√3/2' : close(v, Math.sqrt(3), 1e-9) ? '√3' : close(v, 1 / Math.sqrt(3), 1e-9) ? '1/√3' : v.toFixed(4)); return { q: `${fn} ${A}°  (a fraction like √3/2 or a decimal)`, a: v, tol: 0.005, show: nice, steps: [`Use the 45-45-90 and 30-60-90 triangles (or the unit circle): ${fn} ${A}° = ${nice}.`] }; } const H = ri(5, 30), A = ri(15, 70); const v = H * Math.sin((A * Math.PI) / 180); return { q: `A ramp of length ${H} m rises at ${A}°. How high does it climb? (2 d.p.)`, a: v, tol: 0.02, steps: [`Opposite = hypotenuse × sin θ.`, `${H} × sin ${A}° ≈ ${v.toFixed(2)} m.`] }; },
    seq: () => { const k = ri(0, 2); if (k === 0) { const a = ri(-5, 9), d = ri(2, 9), n = ri(10, 40); return { q: `${a}, ${a + d}, ${a + 2 * d}, … Find term number ${n}.`, a: a + (n - 1) * d, steps: [`aₙ = a + (n − 1)d = ${a} + ${n - 1} × ${d} = ${a + (n - 1) * d}.`] }; } if (k === 1) { const a = ri(1, 9), d = ri(1, 6), n = ri(10, 30); const L = a + (n - 1) * d; return { q: `Sum of the first ${n} terms of ${a}, ${a + d}, ${a + 2 * d}, …`, a: (n * (a + L)) / 2, steps: [`Last term ${L}.`, `Sum = n(first + last)/2 = ${n}(${a} + ${L})/2 = ${(n * (a + L)) / 2}.`] }; } const a = ri(2, 12) * 6, [p, q] = pick([[1, 2], [1, 3], [1, 4], [2, 3]]); return { q: `${a} + ${a}·(${p}/${q}) + ${a}·(${p}/${q})² + … forever`, a: a / (1 - p / q), show: fr(a * q, q - p), steps: [`Geometric, ratio ${p}/${q}.`, `Sum = a/(1 − r) = ${a}/(1 − ${p}/${q}) = ${fr(a * q, q - p)}.`] }; },
    deriv: () => { const cs = [ri(-3, 3), ri(-5, 5), ri(-9, 9), ri(-9, 9)]; if (!cs[0] && !cs[1]) cs[0] = 1; const k = ri(-3, 3); const d = [3 * cs[0], 2 * cs[1], cs[2]]; const v = d[0] * k * k + d[1] * k + d[2]; return { q: `f(x) = ${poly(cs)}. Find f′(${k}).`, a: v, steps: [`Power rule: f′(x) = ${poly(d)}.`, `f′(${k}) = ${v}.`] }; },
    integ: () => { const cs = [ri(-3, 3) * 3, ri(-4, 4) * 2, ri(-6, 6)]; const a = ri(-2, 1), b = a + ri(1, 3); const F = (x) => (cs[0] / 3) * x ** 3 + (cs[1] / 2) * x ** 2 + cs[2] * x; const v = F(b) - F(a); return { q: `∫ from ${a} to ${b} of (${poly(cs)}) dx`, a: v, show: String(+v.toFixed(4)), steps: [`Antiderivative F(x) = ${poly([cs[0] / 3, cs[1] / 2, cs[2], 0])}.`, `F(${b}) − F(${a}) = ${+F(b).toFixed(4)} − ${+F(a).toFixed(4)} = ${+v.toFixed(4)}.`] }; },
    matrix: () => { const [a, b, c, d] = [ri(-5, 9), ri(-5, 9), ri(-5, 9), ri(-5, 9)]; if (Math.random() < 0.5) return { q: `det [[${a}, ${b}], [${c}, ${d}]]`, a: a * d - b * c, steps: [`ad − bc = ${a}×${d} − ${b}×${c} = ${a * d - b * c}.`] }; const x = ri(-4, 4), y = ri(-4, 4); return { q: `[[${a}, ${b}], [${c}, ${d}]] × (${x}, ${y}). Give the two entries, comma-separated, in order.`, a: [a * x + b * y, c * x + d * y], kind: 'pair', steps: [`Row 1: ${a}×${x} + ${b}×${y} = ${a * x + b * y}.`, `Row 2: ${c}×${x} + ${d}×${y} = ${c * x + d * y}.`] }; },
    count: () => { const k = ri(0, 2); if (k === 0) { const n = ri(5, 12), r = ri(2, 4); return { q: `How many ways to choose ${r} people from ${n} (order doesn’t matter)?`, a: C(n, r), steps: [`C(${n}, ${r}) = ${n}!/(${r}!·${n - r}!) = ${C(n, r)}.`] }; } if (k === 1) { const n = ri(3, 7); return { q: `How many ways to arrange ${n} different books on a shelf?`, a: fact(n), steps: [`${n}! = ${fact(n)}.`] }; } const L = ri(3, 6), s = pick([10, 26]); return { q: `How many ${L}-character codes using ${s === 10 ? 'digits 0–9' : 'letters A–Z'} (repeats allowed)?`, a: s ** L, steps: [`${s} choices for each of ${L} places: ${s}^${L} = ${f(s ** L)}.`] }; },
    mod: () => { if (Math.random() < 0.4) { const a = ri(20, 300), n = ri(3, 13); return { q: `${a} mod ${n}`, a: a % n, steps: [`${a} = ${n} × ${Math.floor(a / n)} + ${a % n}.`] }; } const a = ri(2, 9), b = ri(3, 12), n = ri(5, 13); let v = 1; const st = []; for (let i = 1; i <= b; i++) { v = (v * a) % n; if (i <= 4 || i === b) st.push(`${a}^${i} ≡ ${v}`); } return { q: `${a}^${b} mod ${n}`, a: v, steps: [`Multiply step by step, reducing mod ${n} each time: ${st.join(', ')}.`] }; },
    prob: () => { const k = ri(0, 2); if (k === 0) { const s = ri(2, 12); const w = 6 - Math.abs(7 - s); return { q: `Two fair dice. Probability the sum is ${s}? (fraction or decimal)`, a: w / 36, show: fr(w, 36), steps: [`${w} of the 36 equally likely outcomes give ${s}.`, `${w}/36 = ${fr(w, 36)}.`] }; } if (k === 1) { const n = ri(2, 5); const v = 1 - (5 / 6) ** n; return { q: `Probability of at least one six in ${n} rolls? (3 d.p.)`, a: v, tol: 0.0015, steps: [`P(no six) = (5/6)^${n} = ${((5 / 6) ** n).toFixed(4)}.`, `1 − that = ${v.toFixed(3)}.`] }; } const n = ri(3, 6), r = ri(0, n); return { q: `Probability of exactly ${r} heads in ${n} fair coin flips? (fraction or decimal)`, a: C(n, r) / 2 ** n, show: fr(C(n, r), 2 ** n), steps: [`C(${n}, ${r}) = ${C(n, r)} ways out of 2^${n} = ${2 ** n}.`, `= ${fr(C(n, r), 2 ** n)}.`] }; },
  };
  const checkPair = (g, input) => { const vals = String(input).split(/[,;]/).map(num); return vals.length === 2 && vals.every((v, i) => close(v, g.a[i])); };

  const practiceBox = (id, genId) => {
    const box = h('div', { class: 'pmx-prac' }); const gen = GEN[genId]; if (!gen) return null;
    let g; const qEl = h('div', { class: 'pmx-q' }); const inp = h('input', { type: 'text', inputmode: 'text', placeholder: 'Your answer', 'aria-label': 'Your answer', autocomplete: 'off' });
    const fb = h('div', { class: 'small', style: { marginTop: '6px' } }); let right = 0, tries = 0; const score = h('span', { class: 'tiny muted' });
    const next = () => { g = gen(); qEl.textContent = g.q; inp.value = ''; fb.replaceChildren(); };
    const go = () => { if (!inp.value.trim()) return; tries++; const ok = g.kind === 'pair' ? checkPair(g, inp.value) : check(g, inp.value); if (ok) { right++; Lab.addXP && Lab.addXP(2); }
      fb.replaceChildren(h('b', { style: { color: ok ? '#15803D' : '#B91C1C' } }, ok ? '✓ Correct. ' : `Not quite. Answer: ${g.kind === 'pair' ? g.a.join(', ') : shown(g)}. `), h('ol', { class: 'small', style: { margin: '4px 0 0', paddingLeft: '18px' } }, ...g.steps.map((s) => h('li', null, s))));
      score.textContent = ` ${right} / ${tries} right`; };
    inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
    box.append(h('div', { class: 'tiny muted' }, 'Unlimited practice: a new problem every time', score), qEl, h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, inp, h('button', { class: 'btn sm primary', onclick: go }, 'Check'), h('button', { class: 'btn sm', onclick: next }, 'New problem')), fb);
    next(); return box;
  };

  // ───────────── shared pieces ─────────────
  const SUBNAV = [['', 'Overview'], ['check', 'Where do I stand?'], ['connect', 'How it connects'], ['fields', 'Across fields'], ['symbols', 'Symbols'], ['experiments', 'Experiments'], ['learn', 'How to learn math'], ['library', 'Free library'], ['about', 'About this map']];
  const subnav = (active) => h('nav', { class: 'tn-bar pmx-nav', 'aria-label': 'Math path sections' }, ...SUBNAV.map(([k, t]) => h('a', { class: 'btn sm' + (k === active ? ' primary' : ''), href: '#path-math' + (k ? '-' + k : '') }, t)));
  const tierStrip = (active) => h('nav', { class: 'pmx-tiers', 'aria-label': 'Tiers' }, ...TIERS.map(([n, t]) => { const ts = byTier(n); const d = ts.filter((x) => done(x.id)).length; return h('a', { href: '#path-math-' + n, class: 'pmx-tchip' + (n === active ? ' on' : ''), style: { '--c': col(n) }, title: `Tier ${n}: ${t} (${d}/${ts.length} done)` }, String(n)); }));
  const chip = (id) => { const o = M.by[id]; if (!o) return null; return h('a', { class: 'pmx-chip' + (done(id) ? ' done' : ''), href: link(id), style: { '--c': col(o.tier) } }, (done(id) ? '✓ ' : '') + o.t); };
  const labName = (hs) => { if (hs.startsWith('play-')) { const l = Lab.ARC && Lab.ARC.by[hs.slice(5)]; return l ? l.e + ' ' + l.t : null; } if (hs.startsWith('math-')) { const S = Lab.subject && Lab.subject('math'); const e = S && S.ex.find(([k]) => k === hs.slice(5)); return e ? '🧪 ' + (e[1] || hs) : null; } return hs; };
  const sec = (title, open, ...kids) => h('details', { class: 'pmx-sec', ...(open ? { open: '' } : {}) }, h('summary', null, title), h('div', { class: 'pmx-body' }, ...kids));
  const ul = (items) => h('ul', { class: 'small pmx-ul' }, ...items.map((x) => h('li', null, x)));
  const speakTopic = (o) => Lab.speak && Lab.speak([o.t + '.', o.big, ...o.learn, 'Why it works.', o.why].join(' '));

  const topicCard = (o, full) => {
    const tog = h('button', { class: 'btn sm' + (done(o.id) ? ' primary' : ''), onclick: () => { if (done(o.id)) { delete Lab.state.done['math:' + o.id]; Lab.save && Lab.save(); } else Lab.markDone('math:' + o.id, 15, 'Math: ' + o.t); tog.classList.toggle('primary', done(o.id)); tog.textContent = done(o.id) ? '✓ I understand this' : 'Mark as understood'; } }, done(o.id) ? '✓ I understand this' : 'Mark as understood');
    const labs = (o.labs || []).map((hs) => [hs, labName(hs)]).filter(([, n]) => n);
    const rung = RUNG[o.id];
    return h('article', { class: 'card pmx-topic', id: 'pmx-' + o.id, style: { '--c': col(o.tier) } },
      h('div', { class: 'row', style: { gap: '6px', alignItems: 'center', flexWrap: 'wrap' } }, h('span', { class: 'pmx-tier', style: { background: col(o.tier) } }, 'Tier ' + o.tier), h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => speakTopic(o), 'aria-label': 'Listen to this lesson' }, '🔊 Listen'), full ? null : h('a', { class: 'btn sm', href: link(o.id) }, 'Open lesson')),
      h('h2', { style: { margin: '6px 0 4px', fontSize: full ? '24px' : '20px' } }, o.t),
      h('p', { class: 'pmx-big' }, o.big),
      sec('📘 The lesson', true, ...o.learn.map((p) => h('p', { class: 'small' }, p))),
      sec('✍️ Worked examples', full, ...o.ex.map(([q, steps]) => h('div', { class: 'mp-box', style: { marginBottom: '6px' } }, h('b', { class: 'small' }, q), h('ol', { class: 'small', style: { margin: '4px 0 0', paddingLeft: '18px' } }, ...steps.map((s) => h('li', null, s)))))),
      sec('💡 Why it works', full, h('p', { class: 'small' }, o.why)),
      sec('🔣 Symbols and words', full, h('table', { class: 'pmx-table' }, h('tbody', null, ...o.sym.map(([s, say, mean]) => h('tr', null, h('td', { class: 'pmx-sym' }, s), h('td', { class: 'small' }, h('b', null, say), mean ? ' · ' + mean : ''))))), h('dl', { class: 'small pmx-dl' }, ...o.words.flatMap(([t, m]) => [h('dt', null, t), h('dd', null, m)]))),
      sec('🏛️ Who discovered it, and how', full, h('div', { class: 'cf-tl' }, ...o.hist.map(([w, who, what]) => h('div', { class: 'pmx-h' }, h('div', { class: 'tiny muted' }, w), h('b', { class: 'small' }, who), h('div', { class: 'small' }, what))))),
      sec('🌍 Where it’s used', full, ul(o.uses.map(([fld, how]) => [h('b', null, fld + ': '), how]))),
      sec('🎯 How to master it', full, ul(o.master), o.read && o.read.length ? h('div', { class: 'small', style: { marginTop: '6px' } }, h('b', null, 'Free to learn from: '), ...o.read.map(([t, u], i) => [i ? ' · ' : '', h('a', { href: u, target: '_blank', rel: 'noopener' }, t)]).flat()) : null),
      sec('🧠 Practice', full, o.prac && o.prac.length ? h('div', { class: 'stack', style: { gap: '4px' } }, ...o.prac.map(([q, a]) => { const ans = h('span', { class: 'pmx-ans', hidden: true }, ' → ' + a); return h('div', { class: 'small' }, q, ' ', h('button', { class: 'btn sm', onclick: (e) => { ans.hidden = !ans.hidden; e.target.textContent = ans.hidden ? 'Show answer' : 'Hide'; } }, 'Show answer'), ans); })) : null, o.gen ? practiceBox(o.id, o.gen) : null),
      labs.length || rung ? sec('🕹️ Try it hands-on', full, h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } }, ...(rung ? [h('a', { class: 'btn sm', href: '#mathpath-' + rung }, '🪜 Picture it on the hands-on ladder')] : []), ...labs.map(([hs, n]) => h('a', { class: 'btn sm', href: '#' + hs }, n)))) : null,
      sec('🔗 Connections', full, (o.pre || []).length ? h('div', { class: 'small' }, h('b', null, 'Builds on: '), h('span', { class: 'pmx-chips' }, ...o.pre.map(chip))) : null, (o.next || []).length ? h('div', { class: 'small', style: { marginTop: '4px' } }, h('b', null, 'Leads to: '), h('span', { class: 'pmx-chips' }, ...o.next.map(chip))) : null,
        h('div', { class: 'small', style: { marginTop: '4px' } }, h('b', null, 'Used by: '), h('span', { class: 'pmx-chips' }, ...M.topics.filter((x) => (x.pre || []).includes(o.id)).map((x) => chip(x.id))))),
      h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '10px' } }, tog, h('button', { class: 'btn sm', onclick: () => Lab.ask(`Teach me “${o.t}” step by step, starting from what I already know. Check my understanding with one question at a time, and don’t give answers before I try.`, 'Math path, tier ' + o.tier + ': ' + o.t) }, '💬 Ask the tutor')));
  };

  // ───────────── placement check ─────────────
  const PLACE = [
    [1, 'What is ¾ of 20?', ['12', '15', '16', '5'], 1],
    [1, 'Which is larger?', ['0.58', '0.6', 'They are equal', 'Can’t tell'], 1],
    [2, 'Solve 3x − 5 = 16.', ['x = 7', 'x = 11/3', 'x = 3', 'x = 21'], 0],
    [2, 'A $40 shirt is 25% off. What do you pay?', ['$15', '$30', '$35', '$10'], 1],
    [3, 'Solve x² − 5x + 6 = 0.', ['x = −2 or −3', 'x = 2 or 3', 'x = 1 or 6', 'x = 5 or 6'], 1],
    [3, 'What is log₁₀(1,000)?', ['3', '100', '30', '0.001'], 0],
    [4, 'What is the derivative of x³?', ['3x²', 'x²', 'x⁴/4', '3x'], 0],
    [4, 'What is ∫ from 0 to 1 of 2x dx?', ['2', '1', '½', '0'], 1],
    [5, 'The classic proof that √2 is irrational is a proof by…', ['induction', 'contradiction', 'example', 'measurement'], 1],
    [5, 'The numbers {1, 2, 3, 4} under multiplication mod 5 form a…', ['group', 'vector space', 'graph', 'none of these'], 0],
    [6, 'Pick a real number between 0 and 1 uniformly at random. The probability it is a fraction is…', ['½', '0', '1', 'It has no answer'], 1],
    [6, 'The Euler characteristic V − E + F of a torus (doughnut surface) is…', ['2', '1', '0', '−2'], 2],
  ];
  const placement = () => {
    const box = h('div', { class: 'stack', style: { gap: '8px' } }); const ans = {}; const res = h('div');
    const saved = (() => { try { return JSON.parse(localStorage.getItem('lab.math.place') || 'null'); } catch (e) { return null; } })();
    PLACE.forEach(([t, q, opts, c], i) => { const row = h('div', { class: 'mp-box' }, h('div', { class: 'tiny muted' }, `Question ${i + 1} · tier ${t}`), h('b', { class: 'small' }, q), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '6px' } }, ...opts.map((o, k) => { const b = h('button', { class: 'btn sm', onclick: () => { ans[i] = k; row.querySelectorAll('button').forEach((x) => x.classList.remove('primary')); b.classList.add('primary'); } }, o); return b; }), h('button', { class: 'btn sm', onclick: (e) => { ans[i] = -1; row.querySelectorAll('button').forEach((x) => x.classList.remove('primary')); e.target.classList.add('primary'); } }, 'Not sure'))); box.append(row); });
    const show = (start) => { const T = TIERS[start - 1]; res.replaceChildren(h('div', { class: 'card', style: { borderLeft: `5px solid ${col(start)}`, margin: '10px 0 0' } }, h('b', null, start > 6 ? 'You answered everything through tier 6. Start at tier 7, or pick any tier that interests you.' : `Start at tier ${start}: ${T[1]}.`), h('p', { class: 'small', style: { margin: '4px 0 6px' } }, 'This is a quick guide, not a test score. Skim the tiers below it: anything that feels shaky is worth an hour now, because every tier builds on the ones before.'), h('a', { class: 'btn sm primary', href: '#path-math-' + Math.min(start, 10) }, `Go to tier ${Math.min(start, 10)}`))); };
    const grade = () => { let start = 7; for (let t = 1; t <= 6; t++) { const qs = PLACE.map((p, i) => [p, i]).filter(([p]) => p[0] === t); if (qs.some(([p, i]) => ans[i] !== p[3])) { start = t; break; } } try { localStorage.setItem('lab.math.place', JSON.stringify({ start, at: new Date().toISOString().slice(0, 10) })); } catch (e) {} show(start); };
    const wrap = h('div', null, h('p', { class: 'small', style: { marginTop: 0 } }, 'Twelve quick questions, two per tier for tiers 1–6. Answer honestly and choose “Not sure” rather than guessing. You will get a suggested starting tier.'), box, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: grade }, 'See where to start'), res);
    if (saved) show(saved.start);
    return wrap;
  };

  // ───────────── connections, fields, method, myths, glossary, experiments ─────────────
  const THREADS = [
    ['Number → structure', 'From counting to the deepest algebra: each step asks what rules numbers obey, then studies the rules themselves.', ['count', 'arith', 'frac', 'neg', 'var', 'alg', 'cplx', 'absalg', 'rep', 'alggeo', 'arithgeo', 'langlands']],
    ['Shape → space', 'From measuring a garden to the curvature of spacetime.', ['meas', 'geo1', 'proof', 'coord', 'trig', 'multi', 'diffgeo', 'algtop', 'sympl']],
    ['Change → motion', 'From rates and percents to fluids that may blow up.', ['prop', 'explog', 'precalc', 'calc1', 'calc2', 'series', 'ode', 'pde', 'chaos', 'mill']],
    ['Chance → data', 'From averages to the mathematics of markets and machine learning.', ['data1', 'prob', 'measure', 'stoch', 'ml']],
    ['Logic → computing', 'From true and false to the limits of computers and computer-checked proof.', ['discrete', 'proofs', 'logic', 'sets', 'comput', 'cat', 'hott', 'ai']],
    ['Primes → secrets', 'From divisibility to the codes that protect the internet and the deepest open problems.', ['numth', 'info', 'arithgeo', 'abc', 'open']],
  ];
  const FIELDS = [
    ['⚙️ Physics and engineering', [['calc1', 'motion and rates'], ['ode', 'circuits, orbits, vibrations'], ['pde', 'heat, waves, fluids, quantum'], ['linalg', 'structures and quantum states'], ['diffgeo', 'relativity and GPS'], ['rep', 'particle physics'], ['sympl', 'mechanics and long-term orbits']]],
    ['💻 Computing and AI', [['discrete', 'circuits, algorithms, data structures'], ['logic', 'programming languages and verification'], ['comput', 'what computers can and cannot do'], ['linalg', 'graphics and neural networks'], ['ml', 'how AI learns'], ['info', 'compression and encryption'], ['numer', 'simulation']]],
    ['💹 Economics, finance and trading', [['prop', 'growth rates, inflation'], ['explog', 'compound interest'], ['optim', 'allocation and planning'], ['game', 'competition and auctions'], ['prob', 'risk and expected value'], ['stoch', 'prices and options']]],
    ['🩺 Biology and medicine', [['prob', 'clinical trials and test results'], ['ode', 'epidemics and drug levels'], ['data1', 'health statistics'], ['explog', 'growth and decay'], ['chaos', 'heart rhythms and populations']]],
    ['🏛️ Politics, law and geopolitics', [['game', 'deterrence, bargaining, coalitions'], ['prob', 'polls, evidence and standards of proof'], ['data1', 'reading official statistics'], ['info', 'encryption and surveillance'], ['proof', 'structured argument']]],
    ['🧪 Chemistry and materials', [['absalg', 'crystal symmetry'], ['rep', 'spectroscopy and molecular orbitals'], ['pde', 'diffusion and reactions'], ['algtop', 'topological materials']]],
    ['🎨 Arts and music', [['trig', 'sound as waves'], ['series', 'building sounds and compressing images'], ['geo1', 'perspective and proportion'], ['absalg', 'symmetry in patterns and tiling']]],
    ['🏠 Everyday life', [['frac', 'discounts, recipes, tips'], ['prop', 'unit prices, percent changes in the news'], ['explog', 'loans and savings'], ['data1', 'spotting misleading charts'], ['prob', 'judging risk']]],
  ];
  const METHOD = [
    ['Test yourself instead of rereading', 'A large 2013 review of ten study techniques rated practice testing and spaced practice as the most effective. Close the book and try the problem.', 'https://journals.sagepub.com/doi/10.1177/1529100612453266'],
    ['Space it out', 'Short sessions over days beat one long session. Come back to each lesson’s practice a day, a week and a month later.', null],
    ['Mix problem types', 'Shuffling different kinds of problems (interleaving) improved later test scores in classroom math experiments, because you learn to recognize which method fits.', 'https://doi.org/10.1007/s11251-007-9015-8'],
    ['Study worked examples, then fade them', 'Beginners learn faster from fully worked examples; as you improve, cover the steps and do them yourself.', null],
    ['Struggle on purpose, briefly', 'Try for 15–30 minutes before looking at a solution. The effort is where learning happens; then check and fix.', null],
    ['Explain it out loud', 'Explaining each step to yourself or someone else exposes gaps quickly. Use the tutor as a listener, not an answer machine.', null],
    ['Draw it, estimate it, check it', 'Sketch the picture, estimate the size of the answer, and check by undoing the calculation.', null],
    ['Fill gaps from below', 'Most trouble in a tier comes from a shaky earlier tier. Going back is not failure; it is the fastest way forward.', null],
    ['Mindset is not magic', 'Believing you can improve helps a little: a 2018 review found growth-mindset interventions have small average effects. What reliably works is regular, effortful practice with feedback.', 'https://doi.org/10.1177/0956797617739704'],
  ];
  const MYTHS = [
    ['Math was invented by the West.', 'Place value and zero came from India, much of algebra from Baghdad, elimination methods and the remainder theorem from China, early proof from Greece, and calculus series from Kerala and Europe. Each lesson names who found what.'],
    ['Some people just aren’t math people.', 'People do differ, but most difficulty traces to gaps in earlier steps, which can be filled. Every tier here builds on the ones before for that reason.'],
    ['PEMDAS is a law of nature.', 'It is a convention so that everyone reads expressions the same way. Brackets remove all doubt.'],
    ['Math is calculating.', 'From tier 5 on, it is mostly about structure and proof. Computers calculate; people decide what is true and why.'],
    ['If a computer checked a proof, it must be right.', 'A proof checker confirms the formal statement. Whether that statement matches the real question still needs people (tier 10).'],
  ];
  const GLOSS = [
    ['+  −', 'plus, minus', '7 − 2 = 5', 'Printed by Johannes Widmann, 1489'], ['×', 'times', '3 × 4 = 12', 'William Oughtred, 1631'], ['÷', 'divided by', '12 ÷ 4 = 3', 'Johann Rahn, 1659'], ['=', 'equals', '2 + 2 = 4', 'Robert Recorde, 1557'],
    ['<  >', 'less than, greater than', '3 < 5', 'Thomas Harriot, 1631'], ['≤  ≥', 'at most, at least', 'x ≤ 6', 'Pierre Bouguer, 1734'], ['√', 'square root', '√49 = 7', 'Christoff Rudolff, 1525'], ['π', 'pi', 'circumference ÷ diameter ≈ 3.14159', 'William Jones, 1706; popularized by Euler'],
    ['e', 'Euler’s number', '≈ 2.71828', 'Leonhard Euler, 1730s'], ['i', 'imaginary unit', 'i² = −1', 'Euler, 1777'], ['∞', 'infinity', 'lim 1/x as x → 0⁺ is ∞', 'John Wallis, 1655'], ['Σ', 'sum', 'Σ n from 1 to 4 = 10', 'Euler, 1755'],
    ['∫', 'integral', '∫₀¹ 2x dx = 1', 'Gottfried Leibniz, 1675'], ['dy/dx', 'derivative', 'd/dx x² = 2x', 'Leibniz, 1675–1684'], ['f(x)', 'function of x', 'f(x) = x²', 'Euler, 1734'], ['∂', 'partial derivative', '∂f/∂x', 'Adrien-Marie Legendre, 1786'],
    ['∇', 'del, nabla', 'gradient ∇f', 'William Rowan Hamilton, 1837'], ['≡', 'congruent to', '17 ≡ 2 (mod 5)', 'Carl Friedrich Gauss, 1801'], ['n!', 'factorial', '4! = 24', 'Christian Kramp, 1808'], ['∈', 'is an element of', '3 ∈ ℕ', 'Giuseppe Peano, 1889'],
    ['∪  ∩', 'union, intersection', '{1,2} ∪ {2,3} = {1,2,3}', 'Peano, 1888'], ['∃', 'there exists', '∃x: x² = 4', 'Peano, 1897'], ['∀', 'for all', '∀x: x² ≥ 0', 'Gerhard Gentzen, 1935'], ['∅', 'empty set', '{ } = ∅', 'André Weil (Bourbaki), 1939'], ['ℵ₀', 'aleph-null', 'size of ℕ', 'Georg Cantor, 1895'],
  ];
  const EXPER = [
    ['play-primecount', 'Test the prime number theorem', 'Count primes up to a million and compare with Gauss’s guess x/ln x and the better Li(x).'],
    ['play-zeta', 'Hunt for zeros of the zeta function', 'Find the first zeros on the critical line yourself: the Riemann hypothesis says every non-trivial zero is on it.'],
    ['play-modular', 'Check a case of the Langlands program', 'Count solutions of an elliptic curve modulo primes and compare with a modular form’s coefficients.'],
    ['play-benford', 'Benford’s law on real data', 'Do first digits of real-world numbers follow the 30% “1” rule?'],
    ['play-pidarts', 'Find π with random darts', 'Monte Carlo estimation and how its error shrinks like 1/√n.'],
    ['play-collatz', 'The Collatz mystery', 'Run millions of starting numbers; every one reaches 1, and nobody can prove why.'],
    ['play-gbm', 'Volatility drag', 'Simulate thousands of random price paths and see why the median falls behind the mean.'],
    ['play-pnp', 'Easy to check, hard to find', 'Time a brute-force search as a puzzle grows, and see why P vs NP matters.'],
    ['play-diagonal', 'Cantor’s diagonal argument', 'Try to list every number between 0 and 1; the Lab builds one you missed.'],
    ['play-epsdelta', 'The ε–δ limit game', 'Challenge a limit with a tolerance; see what it takes to win every time.'],
  ];

  // ───────────── pages ─────────────
  const hero = (title, sub, back) => h('section', { class: 'hero', 'data-own': '1' }, h('a', { class: 'crumb', href: back || '#path' }, back ? '← Mathematics: counting to the frontier' : '← All learning paths'), h('h1', null, title), sub ? h('p', null, sub) : null);
  const progress = () => { const n = M.topics.length, d = M.topics.filter((x) => done(x.id)).length; return h('div', { class: 'pmx-prog' }, h('div', { class: 'pmx-bar' }, h('i', { style: { width: (100 * d) / n + '%' } })), h('span', { class: 'tiny muted' }, `${d} of ${n} lessons marked understood`)); };
  const ladder = () => h('div', { class: 'pmx-ladder' }, ...[...TIERS].reverse().map(([n, t, age, shift]) => { const ts = byTier(n); const d = ts.filter((x) => done(x.id)).length; return h('div', { class: 'pmx-rung', style: { '--c': col(n) } },
    h('a', { class: 'pmx-num', href: '#path-math-' + n, 'aria-label': 'Tier ' + n }, String(n)),
    h('div', { class: 'pmx-rbody' }, h('div', { class: 'row', style: { gap: '6px', alignItems: 'baseline', flexWrap: 'wrap' } }, h('a', { href: '#path-math-' + n, class: 'pmx-rt' }, t), h('span', { class: 'tiny muted' }, age + ` · ${d}/${ts.length}`)), h('div', { class: 'tiny', style: { margin: '2px 0 4px' } }, shift), h('div', { class: 'pmx-chips' }, ...ts.map((x) => chip(x.id))))); }));

  const overview = (app) => {
    Lab.setContext('Math path overview: ten tiers from counting to the research frontier, with ' + M.topics.length + ' lessons.');
    const saved = (() => { try { return JSON.parse(localStorage.getItem('lab.math.place') || 'null'); } catch (e) { return null; } })();
    app.append(hero('Mathematics: from counting to the frontier', `${M.topics.length} lessons in ten tiers. Each one teaches the idea, works examples, explains why it is true, decodes the symbols, tells who discovered it and how, shows where it is used, and gives practice with answers.`),
      subnav(''),
      h('div', { class: 'card' }, h('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap', alignItems: 'center' } }, h('a', { class: 'btn primary', href: '#path-math-check' }, saved ? `Your suggested start: tier ${saved.start} (retake check)` : 'Where do I stand? Take the 12-question check'), saved ? h('a', { class: 'btn', href: '#path-math-' + Math.min(saved.start, 10) }, `Go to tier ${Math.min(saved.start, 10)}`) : h('a', { class: 'btn', href: '#path-math-1' }, 'Start at tier 1')), progress(),
        h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, 'Read the ladder from the bottom up. Ages are rough US school stages, not limits: start wherever you are. The whole story matters more than any single lesson, so each lesson links to what it builds on and what it leads to.')),
      ladder(),
      h('div', { class: 'grid g2', style: { marginTop: '10px' } }, ...[['#path-math-connect', '🧵 How it all connects', 'Six threads that run from tier 1 to the frontier.'], ['#path-math-fields', '🌍 Math across fields', 'Which math each field uses, and where to learn it here.'], ['#path-math-experiments', '🔬 Do your own experiments', 'Test the prime number theorem, hunt zeta zeros, check a piece of the Langlands program.'], ['#path-math-learn', '🎯 How to get good at math', 'What the research on learning says actually works.'], ['#path-math-symbols', '🔣 Symbols dictionary', 'Every symbol in the path, what it means and who introduced it.'], ['#path-math-library', '📚 Free library', 'Free textbooks and courses for every tier.']].map(([u, t, d]) => h('a', { class: 'card cf-card', href: u, style: { margin: 0 } }, h('b', null, t), h('p', { class: 'small', style: { margin: '4px 0 0' } }, d)))));
  };
  const tierPage = (app, n) => {
    const T = TIERS[n - 1]; if (!T) return overview(app);
    Lab.setContext(`Math path tier ${n}: ${T[1]}. Lessons: ${byTier(n).map((x) => x.t).join('; ')}.`);
    document.documentElement.style.setProperty('--accent', col(n));
    app.append(hero(`Tier ${n}: ${T[1]}`, `${T[2]}. ${T[3]}`, '#path-math'), subnav(null), tierStrip(n),
      h('div', { class: 'card' }, h('b', { class: 'small' }, 'In this tier'), h('div', { class: 'pmx-chips', style: { marginTop: '6px' } }, ...byTier(n).map((x) => chip(x.id))), h('p', { class: 'tiny muted', style: { marginBottom: 0 } }, 'Each lesson opens with the core idea; tap a heading to open worked examples, history, uses, practice and more, or open the lesson on its own page.')),
      ...byTier(n).map((o) => topicCard(o, false)),
      h('div', { class: 'row', style: { gap: '8px', justifyContent: 'space-between', marginTop: '10px' } }, n > 1 ? h('a', { class: 'btn', href: '#path-math-' + (n - 1) }, `← Tier ${n - 1}`) : h('span'), n < 10 ? h('a', { class: 'btn primary', href: '#path-math-' + (n + 1) }, `Tier ${n + 1} →`) : h('a', { class: 'btn primary', href: '#path-math' }, 'Back to the overview')));
  };
  const topicPage = (app, id) => {
    const o = M.by[id]; if (!o) return overview(app);
    Lab.setContext(`Math path lesson (tier ${o.tier}): ${o.t}. ${o.big}`);
    document.documentElement.style.setProperty('--accent', col(o.tier));
    const ts = byTier(o.tier); const i = ts.indexOf(o); const all = M.topics; const gi = all.indexOf(o);
    app.append(h('section', { class: 'hero', 'data-own': '1' }, h('a', { class: 'crumb', href: '#path-math-' + o.tier }, `← Tier ${o.tier}: ${TIERS[o.tier - 1][1]}`), h('h1', null, o.t), h('p', null, o.big)), tierStrip(o.tier), topicCard(o, true),
      h('div', { class: 'row', style: { gap: '8px', justifyContent: 'space-between', marginTop: '10px', flexWrap: 'wrap' } }, gi > 0 ? h('a', { class: 'btn', href: link(all[gi - 1].id) }, '← ' + all[gi - 1].t) : h('span'), gi < all.length - 1 ? h('a', { class: 'btn primary', href: link(all[gi + 1].id) }, all[gi + 1].t + ' →') : h('span')));
    void i;
  };
  const simple = (app, key, title, sub, ...kids) => { Lab.setContext('Math path: ' + title); app.append(hero(title, sub, '#path-math'), subnav(key), ...kids); };
  const PAGES = {
    check: (app) => simple(app, 'check', 'Where do I stand?', 'A 12-question check across tiers 1–6.', h('div', { class: 'card' }, placement())),
    connect: (app) => simple(app, 'connect', 'How it all connects', 'Mathematics is one story told in threads. Follow any thread from the bottom to the frontier.', ...THREADS.map(([t, d, ids]) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, t), h('p', { class: 'small', style: { marginTop: 0 } }, d), h('div', { class: 'pmx-thread' }, ...ids.flatMap((id, k) => [k ? h('span', { class: 'pmx-arrow', 'aria-hidden': 'true' }, '→') : null, chip(id)]))))),
    fields: (app) => simple(app, 'fields', 'Math across fields', 'The same few ideas power very different fields. Each link opens the lesson.', ...FIELDS.map(([t, items]) => h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, t), h('ul', { class: 'small pmx-ul' }, ...items.map(([id, how]) => h('li', null, chip(id), ' ', how)))))),
    symbols: (app) => { const q = h('input', { type: 'search', placeholder: 'Search symbols or meanings', 'aria-label': 'Search symbols', style: { width: '100%' } }); const all = []; const seen = new Set(); GLOSS.forEach(([s, n, ex, who]) => { seen.add(s); all.push([s, n, ex, who, null]); }); M.topics.forEach((o) => o.sym.forEach(([s, say, mean]) => { if (seen.has(s)) return; seen.add(s); all.push([s, say, mean || '', '', o.id]); }));
      const tb = h('tbody'); const draw = () => { const t = q.value.trim().toLowerCase(); tb.replaceChildren(...all.filter((r) => !t || r.join(' ').toLowerCase().includes(t)).map(([s, n, ex, who, id]) => h('tr', null, h('td', { class: 'pmx-sym' }, s), h('td', { class: 'small' }, h('b', null, n), ex ? h('div', { class: 'tiny muted' }, ex) : null), h('td', { class: 'tiny' }, who || (id ? chip(id) : ''))))); }; q.oninput = draw; draw();
      simple(app, 'symbols', 'Symbols dictionary', `${all.length} symbols: what each means, an example, and who introduced it (first known printed use, where known; others link to the lesson that uses them).`, h('div', { class: 'card' }, q, h('table', { class: 'pmx-table', style: { marginTop: '8px' } }, h('thead', null, h('tr', null, h('th', null, 'Symbol'), h('th', null, 'Meaning'), h('th', null, 'First use / lesson'))), tb))); },
    experiments: (app) => simple(app, 'experiments', 'Do your own experiments', 'Mathematicians find patterns in data before they prove them. These labs let you do the same, with real computation.', h('div', { class: 'grid g2' }, ...EXPER.map(([hs, t, d]) => h('a', { class: 'card cf-card', href: '#' + hs, style: { margin: 0 } }, h('b', null, t), h('p', { class: 'small', style: { margin: '4px 0 0' } }, d))))),
    learn: (app) => simple(app, 'learn', 'How to get good at math', 'What learning research supports, and some myths to drop.', h('div', { class: 'card' }, h('ol', { class: 'small', style: { paddingLeft: '18px', margin: 0 } }, ...METHOD.map(([t, d, u]) => h('li', { style: { marginBottom: '6px' } }, h('b', null, t + '. '), d, u ? [' ', h('a', { href: u, target: '_blank', rel: 'noopener' }, '(source)')] : null)))), h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, 'Myths'), ...MYTHS.map(([m, r]) => h('div', { class: 'mp-box', style: { marginBottom: '6px' } }, h('b', { class: 'small' }, 'Myth: ' + m), h('div', { class: 'small' }, r))))),
    library: (app) => simple(app, 'library', 'Free library', 'Free textbooks, courses and tools for every tier, collected from the lessons.', ...TIERS.map(([n, t]) => { const seen = new Set(); const items = byTier(n).flatMap((o) => o.read || []).filter(([, u]) => !seen.has(u) && seen.add(u)); return h('div', { class: 'card', style: { borderLeft: `5px solid ${col(n)}` } }, h('h3', { style: { marginTop: 0 } }, `Tier ${n}: ${t}`), h('ul', { class: 'small pmx-ul' }, ...items.map(([tt, u]) => h('li', null, h('a', { href: u, target: '_blank', rel: 'noopener' }, tt))))); })),
    about: (app) => simple(app, 'about', 'About this map', 'How the path is organized, what we changed from the common ten-tier map, and how it is checked.', h('div', { class: 'card' }, ul([
      'The ten tiers follow a widely shared map of mathematics from counting to research. Ages are rough US school stages; plenty of people learn later or faster.',
      'We added lessons on writing proofs (tier 5), game theory and the mathematics of machine learning (tier 7), AI and how research works (tier 10).',
      'The common map lists inter-universal Teichmüller theory as a frontier framework. It is better described as a disputed claim, so it has its own page that presents both sides. Higher category theory is mainstream and is covered under category theory.',
      'The Navier–Stokes problem asks whether smooth fluid flows can blow up; turbulence is the motivation, not the question itself.',
      'Homotopy type theory is a foundation of mathematics; it sits in tier 9 here because it is taught alongside the proof assistants that use it.',
      'Lessons were drafted with AI (Claude) and checked by a separate AI fact-checker; no human expert has reviewed them yet. Statements about 2025–26 events are labelled developing and re-checked monthly. Corrections are logged publicly.',
    ]), h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap', marginTop: '8px' } }, h('a', { class: 'btn sm', href: '#audit' }, '✅ Accuracy audit'), h('a', { class: 'btn sm', href: '#changes' }, '📝 Corrections'), h('a', { class: 'btn sm', href: '#mathpath' }, '🪜 Hands-on math ladder'), h('button', { class: 'btn sm', onclick: () => Lab.flagError && Lab.flagError() }, '⚑ Report a problem')))),
  };

  const mathRoute = (app, args) => {
    const [a, b] = args;
    if (!a) return overview(app);
    if (a === 't') return topicPage(app, b);
    if (/^\d+$/.test(a)) return tierPage(app, +a);
    if (PAGES[a]) return PAGES[a](app);
    return overview(app);
  };
  const orig = Lab.routes.path;
  Lab.routes.path = (app, args) => (args && args[0] === 'math' ? mathRoute(app, args.slice(1)) : orig(app, args));
  Lab._mathGen = { GEN, check, checkPair, shown };
  Lab.pathMathUrls = () => M.topics.flatMap((o) => (o.read || []).map(([, u]) => u));
  Lab.MATH_TIERS = TIERS;
})();
