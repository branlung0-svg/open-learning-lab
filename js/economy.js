const { h } = Lab;

const COLORS = { 'United States': '#1D4ED8', 'United Kingdom': '#DC2626', France: '#0EA5E9', Germany: '#525252', Italy: '#65A30D', Spain: '#EAB308', Netherlands: '#F97316', Sweden: '#0891B2', Poland: '#BE185D', Russia: '#7C3AED', 'Former USSR': '#A855F7', Ukraine: '#FACC15', China: '#E11D48', India: '#F59E0B', Japan: '#EC4899', 'South Korea': '#2563EB', 'North Korea': '#B91C1C', Taiwan: '#14B8A6', Vietnam: '#B45309', Singapore: '#06B6D4', Brazil: '#16A34A', Mexico: '#15803D', Argentina: '#38BDF8', Chile: '#9333EA', Cuba: '#F43F5E', Venezuela: '#CA8A04', Egypt: '#A16207', Nigeria: '#22C55E', Ethiopia: '#84CC16', 'South Africa': '#0D9488', Iran: '#059669', Turkey: '#EF4444', 'Saudi Arabia': '#4D7C0F', Israel: '#3B82F6', Canada: '#B91C1C', Australia: '#0369A1', World: '#64748B' };
const METRICS = {
  gdppc: ['GDP per person', 'Real GDP per person, 2011 international dollars (adjusted for inflation and prices)', (v) => '$' + Lab.fmt(v), true],
  pop: ['Population', 'Population, thousands', (v) => (v >= 1e6 ? (v / 1e6).toFixed(2) + ' bn' : v >= 1e3 ? (v / 1e3).toFixed(1) + ' m' : Lab.fmt(v) + ' k'), true],
  life: ['Life expectancy', 'Life expectancy at birth, years', (v) => v.toFixed(1) + ' yrs', false],
  steel: ['Iron & steel output', 'Iron and steel production, thousands of tons (a classic measure of industrial and war-making power)', (v) => Lab.fmt(v) + ' k t', true],
  troops: ['Military personnel', 'Military personnel, thousands', (v) => Lab.fmt(v) + ' k', true],
};
const PRESETS = [
  { name: 'Three systems: US · USSR/Russia · China', c: ['United States', 'Former USSR', 'Russia', 'China'], from: 1870,
    notes: [[1917, 'Russian Revolution'], [1928, 'Stalin’s first five-year plan'], [1949, 'PRC founded'], [1959, 'Great Leap famine'], [1978, 'China’s market reforms'], [1991, 'USSR dissolves']],
    notice: 'The USSR grew fast from 1928 to the 1970s, then stalled and collapsed in the 1990s. China was among the poorest countries on earth until 1978, then grew faster than any large economy in history.',
    debate: 'How much Soviet growth was real is debated: Soviet statistics were inflated and prices were set by planners, so every reconstruction involves guesswork. China’s official GDP figures are also questioned by some economists. The broad shape here is well supported; the exact levels are not.', conf: 'Strong' },
  { name: 'One people, two systems: the Koreas', c: ['South Korea', 'North Korea'], from: 1900,
    notes: [[1910, 'Japanese rule'], [1945, 'Division'], [1953, 'War ends'], [1990, 'Soviet aid ends'], [1995, 'North Korean famine']],
    notice: 'Same language, culture and history until 1945. By 2018 the South was more than 20 times richer per person by these estimates.',
    debate: 'It looks like a clean natural experiment, but not everything else was equal: the South got large US aid and markets, the North got Soviet aid until 1991, and the North started with more industry. North Korea publishes almost no data, so its numbers are rough outside estimates.', conf: 'Strong' },
  { name: 'The Great Divergence: Europe vs Asia', c: ['United Kingdom', 'Netherlands', 'China', 'India'], from: 1500,
    notes: [[1600, 'East India Companies'], [1760, 'Industrial Revolution begins'], [1839, 'Opium War'], [1858, 'British Raj']],
    notice: 'Around 1700 the gap between northwest Europe and China or India was modest. By 1900 Britain was several times richer per person.',
    debate: 'Why? Leading answers include coal and colonies (Pomeranz), institutions and property rights (North, Acemoglu & Robinson), culture and ideas (Mokyr, McCloskey), and high wages pushing machines (Allen). Earlier numbers for China and India rest on thin evidence.', conf: 'Contested' },
  { name: 'Asian miracles', c: ['Japan', 'South Korea', 'Taiwan', 'Singapore', 'China'], from: 1900,
    notes: [[1945, 'Japan defeated'], [1960, 'Korean & Taiwanese export push'], [1965, 'Singapore independent'], [1978, 'China reforms']],
    notice: 'Each went from poor to rich (or middle-income) within about two generations, mostly by exporting manufactured goods.',
    debate: 'Free-market economists stress exports, savings and openness; others stress heavy state direction of credit and industry. Both are visible in the history.', conf: 'Contested' },
  { name: 'Latin America’s roller coaster', c: ['Argentina', 'Chile', 'Venezuela', 'Cuba', 'Mexico', 'Brazil'], from: 1870,
    notes: [[1930, 'Depression'], [1959, 'Cuban Revolution'], [1973, 'Chile coup'], [1982, 'Debt crisis'], [2013, 'Venezuela collapse begins']],
    notice: 'Around 1900 Argentina was among the richest countries per person. Venezuela was the richest in South America in the 1950s–70s; then it collapsed.',
    debate: 'Explanations range from bad policy and inflation to commodity dependence, coups and US intervention. Cuba’s GDP is hard to measure because of its currency system.', conf: 'Contested' },
  { name: 'Oil, war and the Middle East', c: ['Saudi Arabia', 'Iran', 'Turkey', 'Egypt', 'Israel'], from: 1900,
    notes: [[1948, 'Israel founded'], [1973, 'Oil shock'], [1979, 'Iranian Revolution'], [1980, 'Iran–Iraq War']],
    notice: 'Oil made some states rich fast, but income swings with oil prices. Iran stagnated after 1979.',
    debate: 'The “resource curse” idea says oil wealth weakens institutions; critics point to Norway and argue it depends on how the money is governed.', conf: 'Contested' },
  { name: 'Africa’s giants', c: ['Nigeria', 'Ethiopia', 'South Africa', 'Egypt'], from: 1950,
    notes: [[1960, 'Independence wave'], [1984, 'Ethiopian famine'], [1994, 'End of apartheid']],
    notice: 'Growth stalled for decades after independence, then picked up in many countries after about 2000.',
    debate: 'Debates cover colonial legacies, borders drawn by outsiders, Cold War proxy conflict, governance, and aid. Older figures are rough.', conf: 'Contested' },
];

function lineChart({ series, metric, log, from, to, notes = [], height = 380 }) {
  const W = 900, H = height, m = { l: 62, r: 120, t: 16, b: 34 };
  const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');
  const data = series.map((s) => ({ ...s, pts: s.pts.filter(([y, v]) => y >= from && y <= to && v > 0) })).filter((s) => s.pts.length);
  const all = data.flatMap((s) => s.pts.map((p) => p[1]));
  if (!all.length) { svg.append('text').attr('x', W / 2).attr('y', H / 2).attr('text-anchor', 'middle').attr('fill', 'currentColor').text('No data for this choice and period'); return svg.node(); }
  const x = d3.scaleLinear([from, to], [m.l, W - m.r]);
  const y = (log ? d3.scaleLog() : d3.scaleLinear()).domain(log ? [d3.min(all) * 0.85, d3.max(all) * 1.15] : [0, d3.max(all) * 1.08]).range([H - m.b, m.t]).nice();
  const fmt = METRICS[metric][2];
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(8).tickFormat(d3.format('d'))).call((g) => g.selectAll('text').attr('font-size', 12)).attr('color', 'var(--muted)');
  svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6, log ? '~s' : '~s')).attr('color', 'var(--muted)').call((g) => g.select('.domain').remove()).call((g) => g.selectAll('.tick line').clone().attr('x2', W - m.l - m.r).attr('stroke-opacity', 0.12));
  for (const [yr, label] of notes) {
    if (yr < from || yr > to) continue;
    svg.append('line').attr('x1', x(yr)).attr('x2', x(yr)).attr('y1', m.t).attr('y2', H - m.b).attr('stroke', 'var(--muted)').attr('stroke-dasharray', '3 4').attr('stroke-opacity', 0.6);
    svg.append('text').attr('x', x(yr) + 4).attr('y', m.t + 10).attr('font-size', 11).attr('fill', 'var(--muted)').attr('transform', `rotate(90 ${x(yr) + 4} ${m.t + 10})`).text(label);
  }
  const line = d3.line().x((d) => x(d[0])).y((d) => y(d[1])).defined((d, i, a) => i === 0 || d[0] - a[i - 1][0] <= 12);
  const labels = [];
  for (const s of data) {
    svg.append('path').datum(s.pts).attr('d', line).attr('fill', 'none').attr('stroke', s.color).attr('stroke-width', 2.6).attr('stroke-linejoin', 'round');
    const sparse = s.pts.filter((p, i, a) => i === 0 || p[0] - a[i - 1][0] > 12);
    svg.append('g').selectAll('circle').data(sparse).join('circle').attr('cx', (d) => x(d[0])).attr('cy', (d) => y(d[1])).attr('r', 2.6).attr('fill', s.color);
    const last = s.pts[s.pts.length - 1];
    labels.push({ y: y(last[1]), x: x(last[0]), name: s.name, color: s.color, v: last[1] });
  }
  labels.sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 14) labels[i].y = labels[i - 1].y + 14;
  for (const L of labels) svg.append('text').attr('x', W - m.r + 6).attr('y', L.y + 4).attr('font-size', 12).attr('font-weight', 700).attr('fill', L.color).text(L.name.replace('Former USSR', 'USSR area'));
  // hover
  const hover = svg.append('g').style('display', 'none');
  hover.append('line').attr('y1', m.t).attr('y2', H - m.b).attr('stroke', 'var(--ink)').attr('stroke-opacity', 0.3);
  const htxt = hover.append('g');
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', H - m.t - m.b).attr('fill', 'transparent')
    .on('mousemove touchmove', (e) => {
      const [px] = d3.pointer(e); const yr = Math.round(x.invert(px));
      hover.style('display', null).select('line').attr('x1', x(yr)).attr('x2', x(yr));
      htxt.selectAll('*').remove();
      const rows = data.map((s) => { const p = s.pts.reduce((b, q) => (Math.abs(q[0] - yr) < Math.abs(b[0] - yr) ? q : b), s.pts[0]); return [s, p]; }).filter(([, p]) => Math.abs(p[0] - yr) <= 3);
      const bx = x(yr) + (x(yr) > W / 2 ? -190 : 10);
      htxt.append('rect').attr('x', bx).attr('y', m.t + 4).attr('width', 180).attr('height', 22 + rows.length * 17).attr('rx', 8).attr('fill', 'var(--card)').attr('stroke', 'var(--line)');
      htxt.append('text').attr('x', bx + 10).attr('y', m.t + 20).attr('font-weight', 700).attr('font-size', 12).attr('fill', 'var(--ink)').text(yr);
      rows.forEach(([s, p], i) => htxt.append('text').attr('x', bx + 10).attr('y', m.t + 38 + i * 17).attr('font-size', 12).attr('fill', s.color).text(`${s.name.replace('Former USSR', 'USSR area')}: ${fmt(p[1])}`));
    })
    .on('mouseleave', () => hover.style('display', 'none'));
  return svg.node();
}
Lab.lineChart = lineChart;

Lab.explorer('economy', 'divergence', {
  async mount(el) {
    const D = await Lab.json('data/econ.json');
    let pi = 0, metric = 'gdppc', log = true, from = PRESETS[0].from, sel = new Set(PRESETS[0].c);
    const presetRow = h('div', { class: 'tabs', style: { paddingBottom: '6px' } });
    const chipRow = h('div', { class: 'row', style: { gap: '6px' } });
    const chartBox = h('div', { class: 'viz', style: { padding: '8px' } });
    const story = h('div', { class: 'grid g2' });
    const metricSel = h('select', null, Object.entries(METRICS).map(([k, [n]]) => h('option', { value: k }, n)));
    const logChk = h('input', { type: 'checkbox', checked: true });
    const fromSel = h('select', null, [1500, 1700, 1820, 1870, 1900, 1950, 1980].map((y) => h('option', { value: y }, 'from ' + y)));
    const desc = h('p', { class: 'tiny muted', style: { margin: '6px 0 0' } });
    el.append(
      h('div', { class: 'card' },
        h('h3', null, 'Pick a story'), presetRow,
        h('div', { class: 'row', style: { margin: '8px 0' } }, metricSel, fromSel, h('label', { class: 'row small', style: { gap: '6px' } }, logChk, 'Ratio (log) scale')),
        chartBox, desc,
        h('details', { style: { marginTop: '10px' } }, h('summary', { class: 'small', style: { cursor: 'pointer', fontWeight: 600 } }, 'Add or remove countries'), h('div', { style: { marginTop: '8px' } }, chipRow)),
        Lab.source('<a href="https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2020">Maddison Project Database 2020</a> (Bolt & van Zanden); life expectancy: Riley, Clio Infra and UN; steel and troops: <a href="https://correlatesofwar.org/data-sets/national-material-capabilities/">Correlates of War</a> v4. Compiled by Our World in Data. “USSR area” is the territory of the former Soviet Union; “Russia” starts in 1960.')),
      story);
    function drawPresets() {
      presetRow.innerHTML = '';
      PRESETS.forEach((p, i) => presetRow.append(h('button', { class: 'tab' + (i === pi ? ' on' : ''), onclick: () => { pi = i; sel = new Set(p.c); from = p.from; fromSel.value = closestFrom(from); drawPresets(); drawChips(); draw(); } }, p.name)));
    }
    function closestFrom(f) { return [1500, 1700, 1820, 1870, 1900, 1950, 1980].reduce((b, y) => (Math.abs(y - f) < Math.abs(b - f) ? y : b)); }
    function drawChips() {
      chipRow.innerHTML = '';
      Object.keys(D).forEach((c) => { const ch = h('span', { class: 'chip' + (sel.has(c) ? ' on' : ''), style: { '--c': COLORS[c] || '#888' } }, h('i'), c.replace('Former USSR', 'USSR area'));
        ch.onclick = () => { sel.has(c) ? sel.delete(c) : sel.add(c); ch.classList.toggle('on'); draw(); }; chipRow.append(ch); });
    }
    function draw() {
      const p = PRESETS[pi];
      const series = [...sel].map((c) => ({ name: c, color: COLORS[c] || '#888', pts: (D[c] && D[c][metric]) || [] }));
      chartBox.innerHTML = '';
      chartBox.append(lineChart({ series, metric, log: log && METRICS[metric][3], from, to: 2019, notes: p.notes }));
      desc.textContent = METRICS[metric][1] + '. Hover or tap the chart to read values.';
      story.innerHTML = '';
      story.append(
        h('div', { class: 'card' }, h('span', { class: 'tag' }, 'What to notice'), h('p', { style: { marginTop: '8px' } }, p.notice), gapLine(p)),
        h('div', { class: 'card' }, h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': '#D97706' } }, 'What’s debated'), Lab.conf(p.conf)), h('p', { style: { marginTop: '8px' } }, p.debate),
          h('button', { class: 'btn sm', onclick: () => Lab.ask(`Using the story "${p.name}": what explains the differences in this chart? Give the strongest case from at least two schools of thought, then say what the evidence best supports.`, `Economy explorer: ${p.name}, metric ${METRICS[metric][0]}`) }, '✦ Ask: what explains this?')));
      Lab.setContext(`Economy explorer — "${p.name}", showing ${METRICS[metric][0]} for ${[...sel].join(', ')} from ${from}.`);
    }
    function gapLine(p) {
      const yrs = [1950, 2018];
      const rows = p.c.filter((c) => D[c] && D[c].gdppc).map((c) => { const g = Object.fromEntries(D[c].gdppc); return [c, g[1950], g[2018]]; }).filter((r) => r[1] && r[2]);
      if (rows.length < 2) return null;
      return h('table', { class: 't small' }, h('tr', null, h('th', null, 'GDP per person'), h('th', null, '1950'), h('th', null, '2018'), h('th', null, 'Growth / yr')),
        rows.map(([c, a, b]) => h('tr', null, h('td', null, h('b', { style: { color: COLORS[c] } }, c.replace('Former USSR', 'USSR area'))), h('td', null, '$' + Lab.fmt(a)), h('td', null, '$' + Lab.fmt(b)), h('td', null, ((Math.pow(b / a, 1 / 68) - 1) * 100).toFixed(1) + '%'))));
    }
    metricSel.onchange = () => { metric = metricSel.value; draw(); };
    logChk.onchange = () => { log = logChk.checked; draw(); };
    fromSel.onchange = () => { from = +fromSel.value; draw(); };
    fromSel.value = closestFrom(from);
    drawPresets(); drawChips(); draw();
  },
});

Lab.explorer('economy', 'world', {
  async mount(el) {
    const D = await Lab.json('data/econ.json');
    const W = D.World;
    const mk = (title, pts, metricFmt, color, note, conf, src) => {
      const first = pts[0], last = pts[pts.length - 1];
      const c = h('div', { class: 'card' }, h('div', { class: 'row' }, h('h3', { style: { margin: 0 } }, title), h('span', { class: 'sp' }), conf ? Lab.conf(conf) : null),
        h('div', { class: 'row', style: { margin: '6px 0' } }, h('div', { class: 'kpi' }, metricFmt(first[1]), h('small', null, ' in ' + first[0])), h('span', { class: 'muted' }, '→'), h('div', { class: 'kpi', style: { color } }, metricFmt(last[1]), h('small', null, ' in ' + last[0]))),
        h('div', { class: 'viz', style: { padding: '6px' } }, miniChart(pts, color)), h('p', { class: 'small', style: { marginTop: '10px' } }, note), Lab.source(src));
      return c;
    };
    el.append(
      h('div', { class: 'hint' }, 'Three of the biggest changes in human history, measured. Each number is an estimate, and the further back you go the rougher it gets; read the notes on how they were made and what critics say.'),
      h('div', { class: 'grid g2' },
        mk('Share of people in extreme poverty', W.poverty, (v) => v.toFixed(0) + '%', '#059669', 'Measured as the share of people who can’t afford a basic bundle of food, shelter and other needs where they live (the “cost of basic needs” method). Critics such as Jason Hickel argue poverty lines are set too low and that early estimates miss subsistence living outside markets; defenders like Max Roser and Michail Moatsos reply that the decline holds across most reasonable lines.', 'Strong', 'Moatsos (2021), OECD “How Was Life? Vol. II”, via Our World in Data.'),
        mk('Share of adults who can read', W.literacy, (v) => v.toFixed(0) + '%', '#2563EB', 'Early figures come from signatures on marriage records and census questions, so they are rough. The broad rise from about 1 in 8 to more than 8 in 10 is well documented.', 'Strong', 'OECD and UNESCO (2019) via Our World in Data.'),
        mk('Life expectancy at birth', W.life.filter((p) => p[0] >= 1770), (v) => v.toFixed(0) + ' yrs', '#E11D48', 'Low early averages mostly reflect child deaths: in 1800 roughly 4 in 10 children died before their fifth birthday. Adults who survived childhood often lived into their 50s or 60s. Vaccines, clean water, antibiotics and better food drove the change.', 'Strong', 'Riley (2005), Clio Infra and UN (2019) via Our World in Data.')),
      Lab.apply('when someone says “things were better in the past” or “everything is getting worse,” ask: better for whom, measured how, and compared with when? Both optimists and pessimists cherry-pick start dates.'));
    function miniChart(pts, color) {
      const W2 = 600, H2 = 200, m = { l: 36, r: 10, t: 10, b: 24 };
      const svg = d3.create('svg').attr('viewBox', `0 0 ${W2} ${H2}`).style('width', '100%').style('height', 'auto');
      const x = d3.scaleLinear(d3.extent(pts, (d) => d[0]), [m.l, W2 - m.r]);
      const y = d3.scaleLinear([0, d3.max(pts, (d) => d[1]) * 1.1], [H2 - m.b, m.t]).nice();
      svg.append('g').attr('transform', `translate(0,${H2 - m.b})`).call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('d'))).attr('color', 'var(--muted)');
      svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(4)).attr('color', 'var(--muted)').call((g) => g.select('.domain').remove());
      svg.append('path').datum(pts).attr('d', d3.area().x((d) => x(d[0])).y0(y(0)).y1((d) => y(d[1]))).attr('fill', color).attr('fill-opacity', 0.15);
      svg.append('path').datum(pts).attr('d', d3.line().x((d) => x(d[0])).y((d) => y(d[1]))).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5);
      return svg.node();
    }
  },
});

Lab.explorer('economy', 'market', {
  mount(el) {
    const st = { dShift: 0, sShift: 0, policy: 'none', level: 50, tax: 10 };
    const W = 560, H = 420, m = { l: 50, r: 20, t: 20, b: 40 };
    const box = h('div', { class: 'viz', style: { padding: '8px' } });
    const out = h('div', { class: 'stack' });
    const ctl = (label, key, min, max, step) => { const v = h('b'); const r = h('input', { type: 'range', min, max, step, value: st[key] }); r.oninput = () => { st[key] = +r.value; v.textContent = r.value; draw(); }; v.textContent = st[key]; return h('div', null, h('label', { class: 'ctl' }, label + ' ', v), r); };
    const pol = h('select', null, [['none', 'No policy (free market)'], ['ceiling', 'Price ceiling (e.g. rent control)'], ['floor', 'Price floor (e.g. minimum wage)'], ['tax', 'Tax per unit']].map(([v, n]) => h('option', { value: v }, n)));
    pol.onchange = () => { st.policy = pol.value; draw(); };
    el.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, box),
      h('div', { class: 'card' }, h('h3', null, 'Controls'), ctl('Demand shift (more buyers →)', 'dShift', -30, 30, 1), ctl('Supply shift (more sellers →)', 'sShift', -30, 30, 1), h('label', { class: 'ctl' }, 'Government policy'), pol, ctl('Ceiling or floor price', 'level', 10, 90, 1), ctl('Tax per unit', 'tax', 0, 30, 1), out)),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'Real cases to test it on'), h('ul', { class: 'small' },
          h('li', null, h('b', null, 'Rent control: '), 'in a 2012 IGM Chicago survey, most leading economists disagreed that rent control had improved the amount or quality of affordable housing. Supporters argue it protects tenants from displacement. A San Francisco study (Diamond, McQuade & Qian, 2019) found both: covered tenants stayed put, while landlords cut rental supply by about 15%.'),
          h('li', null, h('b', null, 'Minimum wage: '), 'the simple model predicts fewer jobs. Card & Krueger (1994) found no job loss in New Jersey fast food; later studies disagree on size. The debate is about how big the effect is and at what level.'),
          h('li', null, h('b', null, 'Gas price caps (1970s US): '), 'long lines and shortages, as the model predicts.'))),
        h('div', { class: 'card' }, h('h3', null, 'What the model leaves out'), h('p', { class: 'small' }, 'Real markets have few sellers (monopoly power), information gaps, and side effects on others (pollution). Each can make a policy that looks harmful here helpful in practice, or the reverse. That is why the empirical studies matter more than the diagram.'),
          Lab.apply('when you hear “this policy will lower prices” or “raise wages,” sketch the two curves and ask: what happens to the quantity? Who gains, who loses, and who is not in the room?'))));
    function draw() {
      const a = 100 + st.dShift, b = 1, c = 0 - st.sShift, d = 1; // P = a - bQ ; P = c + dQ
      const taxed = st.policy === 'tax' ? st.tax : 0;
      const Qe = (a - c) / (b + d), Pe = a - b * Qe;
      let Q = Qe, P = Pe, note = '', short = 0, Pc = Pe, Pp = Pe;
      if (taxed) { Q = (a - c - taxed) / (b + d); Pc = a - b * Q; Pp = Pc - taxed; P = Pc; note = `Buyers pay $${Pc.toFixed(1)}, sellers keep $${Pp.toFixed(1)}. The government collects $${(taxed * Q).toFixed(0)}.`; }
      if (st.policy === 'ceiling' && st.level < Pe) { P = st.level; const Qs = Math.max(0, (P - c) / d), Qd = (a - P) / b; Q = Qs; short = Qd - Qs; note = `Price held at $${P}. Buyers want ${Qd.toFixed(0)}, sellers offer ${Qs.toFixed(0)}: a shortage of ${short.toFixed(0)}.`; }
      if (st.policy === 'floor' && st.level > Pe) { P = st.level; const Qs = (P - c) / d, Qd = Math.max(0, (a - P) / b); Q = Qd; short = -(Qs - Qd); note = `Price held at $${P}. Sellers offer ${Qs.toFixed(0)}, buyers want ${Qd.toFixed(0)}: a surplus of ${(Qs - Qd).toFixed(0)} (for labor: unemployment).`; }
      if ((st.policy === 'ceiling' && st.level >= Pe) || (st.policy === 'floor' && st.level <= Pe)) note = 'This limit isn’t binding: the market price is already on the allowed side, so nothing changes.';
      const x = d3.scaleLinear([0, 100], [m.l, W - m.r]), y = d3.scaleLinear([0, 130], [H - m.b, m.t]);
      const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto');
      svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(5)).attr('color', 'var(--muted)');
      svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6)).attr('color', 'var(--muted)');
      svg.append('text').attr('x', W - m.r).attr('y', H - 6).attr('text-anchor', 'end').attr('font-size', 12).attr('fill', 'var(--muted)').text('Quantity →');
      svg.append('text').attr('x', 8).attr('y', 14).attr('font-size', 12).attr('fill', 'var(--muted)').text('Price ($)');
      const Pd = (q) => a - b * q, Ps = (q) => c + d * q;
      // surplus areas
      const cs = [[0, Pd(0)], [Q, Pd(Q)], [Q, P === Pe && !taxed ? P : Pc], [0, P === Pe && !taxed ? P : Pc]];
      const pPrice = taxed ? Pp : P;
      const ps = [[0, pPrice], [Q, pPrice], [Q, Ps(Q)], [0, Math.max(0, Ps(0))]];
      const poly = (pts, col, op) => svg.append('path').attr('d', d3.line()(pts.map(([q, p]) => [x(q), y(Math.max(0, p))])) + 'Z').attr('fill', col).attr('fill-opacity', op);
      poly(cs, '#3B82F6', 0.18); poly(ps, '#10B981', 0.2);
      if (Math.abs(Q - Qe) > 0.5) poly([[Q, Pd(Q)], [Qe, Pe], [Q, Ps(Q)]], '#DC2626', 0.3);
      if (taxed) poly([[0, Pc], [Q, Pc], [Q, Pp], [0, Pp]], '#F59E0B', 0.25);
      const ln = (f, col, name) => { svg.append('line').attr('x1', x(0)).attr('y1', y(f(0))).attr('x2', x(100)).attr('y2', y(f(100))).attr('stroke', col).attr('stroke-width', 3); svg.append('text').attr('x', x(92)).attr('y', y(f(92)) - 8).attr('fill', col).attr('font-weight', 700).attr('font-size', 13).text(name); };
      ln(Pd, '#2563EB', 'Demand'); ln(Ps, '#059669', 'Supply');
      if (st.policy === 'ceiling' || st.policy === 'floor') svg.append('line').attr('x1', x(0)).attr('x2', x(100)).attr('y1', y(st.level)).attr('y2', y(st.level)).attr('stroke', '#DC2626').attr('stroke-dasharray', '6 4').attr('stroke-width', 2);
      svg.append('circle').attr('cx', x(Qe)).attr('cy', y(Pe)).attr('r', 6).attr('fill', 'var(--ink)');
      box.innerHTML = ''; box.append(svg.node());
      const DWL = Math.abs(0.5 * (Qe - Q) * (Pd(Q) - Ps(Q)));
      out.innerHTML = '';
      out.append(h('div', { class: 'row' }, h('div', null, h('div', { class: 'tiny muted' }, 'Market price'), h('div', { class: 'kpi' }, '$' + Pe.toFixed(1))), h('div', null, h('div', { class: 'tiny muted' }, 'Quantity traded'), h('div', { class: 'kpi' }, Q.toFixed(0))), h('div', null, h('div', { class: 'tiny muted' }, 'Lost trades (red)'), h('div', { class: 'kpi', style: { color: DWL > 1 ? 'var(--bad)' : 'inherit' } }, DWL.toFixed(0)))),
        note ? h('div', { class: 'hint small' }, note) : h('p', { class: 'small muted' }, 'Blue area: buyers’ gain (they’d have paid more). Green: sellers’ gain. Red appears when a policy blocks trades both sides wanted.'));
    }
    draw();
  },
});

Lab.explorer('economy', 'growth', {
  async mount(el) {
    const D = await Lab.json('data/econ.json');
    const st = { r: 2, yrs: 35 };
    const out = h('div');
    const ctl = (label, key, min, max, step, unit) => { const v = h('b'); const r = h('input', { type: 'range', min, max, step, value: st[key] }); r.oninput = () => { st[key] = +r.value; draw(); }; return [h('label', { class: 'ctl' }, label + ' ', v), r, v]; };
    const [l1, r1, v1] = ctl('Growth per year', 'r', 0, 10, 0.5); const [l2, r2, v2] = ctl('Years', 'yrs', 5, 70, 1);
    const cmp = h('div');
    el.append(h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'Small rates, giant differences'), l1, r1, l2, r2, out), h('div', { class: 'card' }, h('h3', null, 'Real growth, measured'), h('p', { class: 'small muted' }, 'Average growth in GDP per person, computed live from the Maddison data.'), cmp)),
      Lab.apply('the same math runs your savings, a trading account and your skills. Doubling time ≈ 70 ÷ growth rate. At 7% a year, money doubles in about 10 years; at 2%, about 35.'));
    function draw() {
      v1.textContent = st.r + '%'; v2.textContent = st.yrs;
      const mult = Math.pow(1 + st.r / 100, st.yrs);
      out.innerHTML = '';
      out.append(h('div', { class: 'kpi', style: { margin: '10px 0' } }, '×' + mult.toFixed(mult < 10 ? 2 : 1), h('small', null, ` after ${st.yrs} years`)),
        h('p', { class: 'small' }, st.r > 0 ? `Doubles every ${(Math.log(2) / Math.log(1 + st.r / 100)).toFixed(1)} years (rule of 70 says ${(70 / st.r).toFixed(1)}).` : 'No growth, no change.'),
        h('div', { class: 'row' }, [1, 2, 4, 7].map((r) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)', padding: '10px' } }, h('div', { class: 'tiny muted' }, r + '% for ' + st.yrs + ' yrs'), h('b', null, '×' + Math.pow(1 + r / 100, st.yrs).toFixed(1))))));
    }
    const span = (c, a, b) => { const g = Object.fromEntries(D[c].gdppc); if (!g[a] || !g[b]) return null; return [g[a], g[b], (Math.pow(g[b] / g[a], 1 / (b - a)) - 1) * 100]; };
    const cases = [['South Korea', 1960, 2018], ['China', 1978, 2018], ['United States', 1870, 2018], ['United Kingdom', 1820, 1913], ['Former USSR', 1928, 1975], ['Former USSR', 1975, 1990], ['Argentina', 1950, 2018], ['North Korea', 1990, 2018], ['Venezuela', 2000, 2018], ['India', 1991, 2018]];
    cmp.append(h('table', { class: 't small' }, h('tr', null, h('th', null, 'Country'), h('th', null, 'Period'), h('th', null, 'Per year')),
      cases.map(([c, a, b]) => { const r = span(c, a, b); return r ? h('tr', null, h('td', null, c.replace('Former USSR', 'USSR area')), h('td', null, `${a}–${b}`), h('td', { style: { fontWeight: 700, color: r[2] < 0 ? 'var(--bad)' : r[2] > 4 ? 'var(--good)' : 'inherit' } }, r[2].toFixed(1) + '%')) : null; })));
    draw();
  },
});
