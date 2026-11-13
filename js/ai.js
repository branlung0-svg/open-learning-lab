const { h } = Lab;

// ---------- tiny neural network ----------
function makeNet(sizes) {
  const W = [], B = [];
  for (let l = 0; l < sizes.length - 1; l++) { W.push(Array.from({ length: sizes[l + 1] }, () => Array.from({ length: sizes[l] }, () => (Math.random() * 2 - 1) * Math.sqrt(1 / sizes[l])))); B.push(new Array(sizes[l + 1]).fill(0)); }
  return { sizes, W, B };
}
function forward(net, x) {
  const acts = [x];
  for (let l = 0; l < net.W.length; l++) { const prev = acts[l], out = net.W[l].map((row, j) => { let s = net.B[l][j]; for (let i = 0; i < row.length; i++) s += row[i] * prev[i]; return l === net.W.length - 1 ? 1 / (1 + Math.exp(-s)) : Math.tanh(s); }); acts.push(out); }
  return acts;
}
function train(net, data, lr, batch = 16) {
  let loss = 0;
  for (let b = 0; b < data.length; b += batch) {
    const gW = net.W.map((m) => m.map((r) => r.map(() => 0))), gB = net.B.map((v) => v.map(() => 0));
    const chunk = data.slice(b, b + batch);
    for (const [x, y] of chunk) {
      const acts = forward(net, x); const o = acts[acts.length - 1][0]; loss += -(y * Math.log(o + 1e-9) + (1 - y) * Math.log(1 - o + 1e-9));
      let delta = [o - y];
      for (let l = net.W.length - 1; l >= 0; l--) {
        const prev = acts[l];
        for (let j = 0; j < delta.length; j++) { gB[l][j] += delta[j]; for (let i = 0; i < prev.length; i++) gW[l][j][i] += delta[j] * prev[i]; }
        if (l > 0) { const nd = prev.map((a, i) => { let s = 0; for (let j = 0; j < delta.length; j++) s += net.W[l][j][i] * delta[j]; return s * (1 - a * a); }); delta = nd; }
      }
    }
    for (let l = 0; l < net.W.length; l++) for (let j = 0; j < net.W[l].length; j++) { net.B[l][j] -= (lr * gB[l][j]) / chunk.length; for (let i = 0; i < net.W[l][j].length; i++) net.W[l][j][i] -= (lr * gW[l][j][i]) / chunk.length; }
  }
  return loss / data.length;
}
const DATA = {
  circle: () => Array.from({ length: 300 }, () => { const r = Math.random() < 0.5 ? Math.random() * 0.45 : 0.65 + Math.random() * 0.3, a = Math.random() * 6.283; return [[r * Math.cos(a), r * Math.sin(a)], r < 0.55 ? 1 : 0]; }),
  xor: () => Array.from({ length: 300 }, () => { const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1; const xx = x + (x > 0 ? 0.05 : -0.05), yy = y + (y > 0 ? 0.05 : -0.05); return [[xx, yy], xx * yy > 0 ? 1 : 0]; }),
  spiral: () => { const out = []; for (let c = 0; c < 2; c++) for (let i = 0; i < 150; i++) { const r = (i / 150) * 0.95, t = 1.75 * (i / 150) * 2 * Math.PI + c * Math.PI; out.push([[r * Math.sin(t) + (Math.random() - 0.5) * 0.06, r * Math.cos(t) + (Math.random() - 0.5) * 0.06], c]); } return out; },
  split: () => Array.from({ length: 300 }, () => { const c = Math.random() < 0.5 ? 1 : 0; return [[(c ? 0.4 : -0.4) + (Math.random() - 0.5) * 0.7, (c ? 0.35 : -0.35) + (Math.random() - 0.5) * 0.7], c]; }),
};
Lab.explorer('ai', 'nn', {
  mount(el) {
    const s = { ds: 'circle', layers: 2, units: 6, lr: 0.3, run: false, epoch: 0, loss: null };
    let data = DATA[s.ds](), net, raf, losses = [];
    const holder = h('div'); const netBox = h('div'); const lossBox = h('div');
    const kp = h('div', { class: 'row' });
    const dsRow = h('div', { class: 'row' }, Object.keys(DATA).map((k) => h('button', { class: 'tab' + (k === s.ds ? ' on' : ''), onclick: (e) => { s.ds = k; data = DATA[k](); [...dsRow.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); reset(); } }, { circle: '◎ Circle', xor: '✕ XOR', spiral: '🌀 Spiral', split: '⚬ Two blobs' }[k])));
    const playBtn = h('button', { class: 'btn primary', onclick: () => { s.run = !s.run; playBtn.textContent = s.run ? '❚❚ Pause' : '▶ Train'; } }, '▶ Train');
    const sl = (label, min, max, step, key, after) => { const v = h('b', null, s[key]); const r = h('input', { type: 'range', min, max, step, value: s[key] }); r.oninput = () => { s[key] = +r.value; v.textContent = r.value; after && after(); }; return h('div', null, h('label', { class: 'ctl' }, label + ' ', v), r); };
    el.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, dsRow, h('div', { style: { height: '10px' } }), holder, h('div', { class: 'row', style: { marginTop: '10px' } }, playBtn, h('button', { class: 'btn', onclick: reset }, '↺ New network'), h('span', { class: 'sp' }), kp)),
      h('div', { class: 'card' }, h('h3', null, 'The network'), netBox, sl('Hidden layers', 1, 3, 1, 'layers', reset), sl('Neurons per layer', 1, 8, 1, 'units', reset), sl('Learning rate', 0.01, 1, 0.01, 'lr'), h('div', { style: { height: '8px' } }), lossBox)),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'What you’re watching'), h('p', { class: 'small' }, 'Each neuron takes a weighted sum of its inputs and squashes it. Training nudges every weight a tiny bit in the direction that reduces the error, over and over (gradient descent, with the nudges worked out by backpropagation). Nobody programs the rule “orange inside, blue outside”; the network finds it.'),
          h('p', { class: 'small' }, 'Try the spiral with 1 layer of 2 neurons: it can’t learn it. Add layers and neurons and it can. More capacity lets a model learn more complex patterns; too much, with too little data, and it memorizes noise instead (overfitting).'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Same idea, giant scale'), h('p', { class: 'small' }, 'This network has a few dozen weights. GPT-3 (2020) had 175 billion, trained on hundreds of billions of words with the same basic recipe: predict, measure the error, adjust. Companies no longer publish sizes for most frontier models.'),
          h('button', { class: 'btn sm', onclick: () => Lab.ask('Explain backpropagation and gradient descent intuitively, using the tiny network on my screen as the example, then explain how the same idea scales to a large language model.', 'AI: neural network playground') }, '✦ Explain backpropagation'))));
    const cv = Lab.canvasBox(holder, 360); const { ctx } = cv;
    const off = document.createElement('canvas'); const RES = 50; off.width = off.height = RES; const octx = off.getContext('2d'); const img = octx.createImageData(RES, RES);
    function reset() { net = makeNet([2, ...Array(s.layers).fill(s.units), 1]); s.epoch = 0; losses = []; drawNet(); }
    function drawNet() {
      const svg = d3.create('svg').attr('viewBox', '0 0 300 160').style('width', '100%');
      const L = net.sizes, X = (l) => 20 + (l * 260) / (L.length - 1), Y = (l, i) => 80 + (i - (L[l] - 1) / 2) * (140 / Math.max(...L));
      net.W.forEach((m, l) => m.forEach((row, j) => row.forEach((w, i) => svg.append('line').attr('x1', X(l)).attr('y1', Y(l, i)).attr('x2', X(l + 1)).attr('y2', Y(l + 1, j)).attr('stroke', w > 0 ? '#F97316' : '#3B82F6').attr('stroke-width', Math.min(4, Math.abs(w) * 1.5) + 0.2).attr('stroke-opacity', 0.75))));
      L.forEach((n, l) => { for (let i = 0; i < n; i++) svg.append('circle').attr('cx', X(l)).attr('cy', Y(l, i)).attr('r', 7).attr('fill', 'var(--card)').attr('stroke', 'var(--ink)'); });
      netBox.innerHTML = ''; netBox.append(svg.node(), h('div', { class: 'tiny muted' }, 'Orange lines: positive weights. Blue: negative. Thicker: stronger.'));
    }
    function frame() {
      if (s.run) { for (let k = 0; k < 4; k++) { s.loss = train(net, Lab.shuffle(data), s.lr); s.epoch++; } losses.push(s.loss); if (losses.length > 300) losses.shift(); if (s.epoch % 20 === 0) drawNet(); if (s.ds === 'spiral' && s.loss < 0.1) Lab.markDone('nn:spiral', 25, 'spiral learned'); }
      for (let yy = 0; yy < RES; yy++) for (let xx = 0; xx < RES; xx++) { const o = forward(net, [(xx / RES) * 2 - 1, 1 - (yy / RES) * 2]).at(-1)[0]; const i = (yy * RES + xx) * 4; img.data[i] = 249 * o + 59 * (1 - o); img.data[i + 1] = 115 * o + 130 * (1 - o); img.data[i + 2] = 22 * o + 246 * (1 - o); img.data[i + 3] = 120; }
      octx.putImageData(img, 0, 0);
      const [W, H] = cv.size(), S = Math.min(W, H); const ox = (W - S) / 2;
      ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, W, H); ctx.imageSmoothingEnabled = true; ctx.drawImage(off, ox, 0, S, S);
      for (const [[x, y], c] of data) { ctx.fillStyle = c ? '#F97316' : '#3B82F6'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ox + ((x + 1) / 2) * S, ((1 - y) / 2) * S, 3.5, 0, 7); ctx.fill(); ctx.stroke(); }
      const acc = data.filter(([x, c]) => (forward(net, x).at(-1)[0] > 0.5 ? 1 : 0) === c).length / data.length;
      kp.innerHTML = ''; kp.append(h('span', { class: 'pill' }, 'Epoch ' + s.epoch), h('span', { class: 'pill', style: { color: acc > 0.95 ? 'var(--good)' : 'inherit' } }, 'Accuracy ' + Math.round(acc * 100) + '%'));
      if (losses.length > 1) { const w = 280, hh = 60, mx = Math.max(...losses); lossBox.innerHTML = ''; const svg = d3.create('svg').attr('viewBox', `0 0 ${w} ${hh + 16}`).style('width', '100%'); svg.append('path').attr('d', d3.line()(losses.map((l, i) => [(i / (losses.length - 1)) * w, hh - (l / mx) * hh + 2]))).attr('fill', 'none').attr('stroke', '#06B6D4').attr('stroke-width', 2); svg.append('text').attr('x', 0).attr('y', hh + 14).attr('font-size', 11).attr('fill', 'var(--muted)').text(`Error (loss): ${s.loss.toFixed(3)} — should fall as it learns`); lossBox.append(svg.node()); }
      raf = requestAnimationFrame(frame);
    }
    reset(); raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); cv.stop(); };
  },
});

// ---------- next-word picker ----------
const LM = {
  'The capital of France is': [['Paris', 0.86], ['a', 0.05], ['located', 0.03], ['one', 0.02], ['home', 0.015], ['Lyon', 0.008], ['not', 0.007], ['Berlin', 0.003]],
  'The best way to learn is to': [['practice', 0.31], ['teach', 0.16], ['do', 0.14], ['read', 0.1], ['fail', 0.07], ['ask', 0.06], ['sleep', 0.03], ['play', 0.03], ['quit', 0.005]],
  'In 1776 the American colonies declared': [['independence', 0.9], ['war', 0.05], ['that', 0.03], ['themselves', 0.015], ['bankruptcy', 0.001]],
  'The first person to walk on Mars was': [['a', 0.22], ['not', 0.18], ['Neil', 0.12], ['astronaut', 0.1], ['Elon', 0.08], ['John', 0.06], ['never', 0.05], ['Buzz', 0.04]],
};
Lab.explorer('ai', 'llm', {
  mount(el) {
    let prompt = Object.keys(LM)[0], T = 1, samples = [];
    const pRow = h('div', { class: 'tabs' }); const bars = h('div'); const out = h('div'); const tL = h('b', null, '1.0');
    const tR = h('input', { type: 'range', min: 0.1, max: 2.5, step: 0.1, value: 1 }); tR.oninput = () => { T = +tR.value; tL.textContent = T.toFixed(1); samples = []; draw(); };
    el.append(h('div', { class: 'card' }, h('h3', null, 'Pick a sentence to continue'), pRow, h('div', { class: 'grid g2', style: { marginTop: '10px' } },
      h('div', null, h('div', { class: 'kpi', style: { fontSize: '20px', margin: '6px 0 12px' } }, h('span', { id: 'lmPrompt' }), ' ', h('span', { style: { color: '#06B6D4' } }, '▁')), bars, h('label', { class: 'ctl' }, 'Temperature ', tL), tR),
      h('div', null, h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { for (let i = 0; i < 20; i++) samples.push(pick()); draw(); Lab.markDone('llm:sample', 10, 'sampled a model'); } }, '🎲 Sample 20 times'), h('button', { class: 'btn', onclick: () => { samples = []; draw(); } }, 'Clear')), out)),
      h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, 'The probabilities here are hand-made to show the idea, not taken from a real model.')),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'How a chatbot writes'), h('p', { class: 'small' }, 'A language model reads your text as tokens (word pieces) and outputs a probability for every possible next token, learned from patterns in enormous amounts of text. It picks one, adds it, and repeats, one token at a time. Temperature controls how adventurous the pick is: low means almost always the top choice; high means more surprising words.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Why they “hallucinate”'), h('p', { class: 'small' }, 'Look at the Mars sentence: nobody has walked on Mars, but the model still has to produce likely-sounding words, and “Neil” or “Elon” sound plausible. A model predicts what text usually looks like; it doesn’t look facts up unless it is connected to a search or database. That is why you check claims, including mine, against sources.'),
          Lab.apply('ask any AI for its sources, then open them. Fluent is not the same as true.'))));
    Object.keys(LM).forEach((p) => pRow.append(h('button', { class: 'tab' + (p === prompt ? ' on' : ''), onclick: (e) => { prompt = p; samples = []; [...pRow.children].forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, p + '…')));
    const probs = () => { const w = LM[prompt].map(([t, p]) => [t, Math.pow(p, 1 / T)]); const z = w.reduce((a, [, p]) => a + p, 0); return w.map(([t, p]) => [t, p / z]); };
    const pick = () => { const ps = probs(); let r = Math.random(); for (const [t, p] of ps) { if ((r -= p) <= 0) return t; } return ps[0][0]; };
    function draw() {
      document.getElementById('lmPrompt').textContent = prompt;
      bars.innerHTML = '';
      probs().forEach(([t, p]) => bars.append(h('div', { style: { margin: '5px 0' } }, h('div', { class: 'row small' }, h('b', null, t), h('span', { class: 'sp' }), h('span', null, (p * 100).toFixed(1) + '%')), h('div', { class: 'bar', style: { '--accent': '#06B6D4' } }, h('i', { style: { width: Math.max(1, p * 100) + '%' } })))));
      out.innerHTML = '';
      if (samples.length) { const counts = {}; samples.forEach((s) => (counts[s] = (counts[s] || 0) + 1)); out.append(h('p', { class: 'small', style: { marginTop: '10px' } }, `${samples.length} samples at temperature ${T.toFixed(1)}:`), h('div', { class: 'row' }, Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, n]) => h('span', { class: 'pill' }, `${t} ×${n}`)))); }
      else out.append(h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Sample to see what the model would actually write. Then raise the temperature and sample again.'));
    }
    draw();
  },
});
