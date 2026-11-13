/* Lab Arcade: economics, politics, geopolitics, psychology, sociology, anthropology, law */
(function () {
  const A = Lab.ARC.add, h = Lab.h;
  const bars = (rows, max, fmt = (v) => Lab.fmt(v, 1)) => h('div', null, rows.map(([l, v, c]) => h('div', { class: 'row', style: { margin: '4px 0', flexWrap: 'nowrap' } }, h('span', { class: 'small', style: { width: '190px', flex: 'none' } }, l), h('div', { style: { flex: 1, height: '18px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: Math.max(0, Math.min(100, (v / max) * 100)) + '%', height: '100%', background: c || '#2563EB', borderRadius: '6px' } })), h('b', { class: 'small', style: { width: '90px', flex: 'none', textAlign: 'right' } }, fmt(v)))));

  // ======================= ECONOMICS =======================
  A({ id: 'pricecontrol', d: ['economics', 'politics', 'law'], e: '🏷️', t: 'Price ceilings & floors', b: 'Cap rents or set a minimum wage in a textbook market. See shortages, surpluses and who gains.',
    how: 'In the simple supply-and-demand model, a ceiling below the market price creates a shortage (more people want it than is supplied); a floor above it creates a surplus. Real markets can differ: with employer market power (monopsony), a moderate minimum wage can raise both pay and jobs (Card & Krueger, 1994), a point economists still debate.',
    use: 'Rent control, minimum wages, price-gouging laws after disasters, drug price caps, agricultural price supports, and wartime rationing.',
    m(el, K) {
      const P = K.canvas(el, 320); let price = 6, mode = 'ceiling'; const out = K.out(); const D = (p) => 10 - p, S = (p) => p; // equilibrium at p=5, q=5
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 10, 0, 10, { xl: 'quantity', yl: 'price' }); P.line([[X(0), Y(10)], [X(10), Y(0)]], '#2563EB', 3); P.line([[X(0), Y(0)], [X(10), Y(10)]], '#DC2626', 3); P.text('Demand', X(8.5), Y(1.8), { c: '#2563EB', w: 700 }); P.text('Supply', X(8.3), Y(9), { c: '#DC2626', w: 700 });
        const binding = mode === 'ceiling' ? price < 5 : price > 5; P.line([[X(0), Y(price)], [X(10), Y(price)]], binding ? '#CA8A04' : '#94A3B8', 2, [6, 4]); P.dot(X(5), Y(5), 5, '#111');
        if (binding) { const qd = D(price), qs = S(price); P.line([[X(Math.min(qd, qs)), Y(price)], [X(Math.max(qd, qs)), Y(price)]], '#CA8A04', 6); const traded = Math.min(qd, qs); const dwl = 0.5 * (5 - traded) * Math.abs(D(traded) - traded);
          out.innerHTML = mode === 'ceiling' ? `<b>Shortage</b> of ${(qd - qs).toFixed(1)} units: buyers want ${qd.toFixed(1)}, sellers offer ${qs.toFixed(1)}. Those who get the good pay less; others go without. Lost trades (deadweight loss) ≈ ${dwl.toFixed(1)}.` : `<b>Surplus</b> of ${(qs - qd).toFixed(1)} units: sellers offer ${qs.toFixed(1)}, buyers want ${qd.toFixed(1)}. In a labor market this is unemployment; those still employed earn more. Deadweight loss ≈ ${dwl.toFixed(1)}.`; }
        else out.innerHTML = `Not binding: the market price (5) is already ${mode === 'ceiling' ? 'below the ceiling' : 'above the floor'}, so nothing changes.`; };
      P.onResize = draw; el.append(K.choice([['ceiling', 'Price ceiling (e.g. rent control)'], ['floor', 'Price floor (e.g. minimum wage)']], mode, (v) => { mode = v; draw(); }), K.slider('Legal price', 1, 9, 0.1, price, (v) => { price = v; draw(); }), out,
        h('p', { class: 'tiny muted' }, 'Textbook competitive model. Debates: supporters of rent control cite stability for tenants; most economists cite reduced supply and quality (e.g. Diamond, McQuade & Qian on San Francisco, 2019). Minimum wage studies range from small job losses to none at moderate levels.')); draw();
    } });

  A({ id: 'compadv', d: ['economics', 'geopolitics', 'history', 'math'], e: '🍷', t: 'Why countries trade', b: 'England and Portugal make cloth and wine. Find out why both gain from trade even if one is better at everything.',
    how: 'David Ricardo (1817): what matters is comparative advantage, the opportunity cost of each good. If Portugal is better at both but relatively better at wine, both countries end up with more by specializing and trading. Gains are real for countries overall, but some workers and regions lose (e.g. the “China shock” to US manufacturing towns, Autor, Dorn & Hanson, 2013).',
    use: 'Trade policy, tariffs and trade wars, supply chains, and even dividing chores in a household.',
    m(el, K) {
      const s = { pw: 80, pc: 90, ew: 120, ec: 100 }; const out = h('div');
      const draw = () => { const H = 1000; const auto = { P: [H / 2 / s.pw, H / 2 / s.pc], E: [H / 2 / s.ew, H / 2 / s.ec] }; const pRatio = s.pw / s.pc, eRatio = s.ew / s.ec; const pSpecW = pRatio < eRatio;
        const spec = pSpecW ? { P: [H / s.pw, 0], E: [0, H / s.ec] } : { P: [0, H / s.pc], E: [H / s.ew, 0] }; const tw = auto.P[0] + auto.E[0], tc = auto.P[1] + auto.E[1], sw = spec.P[0] + spec.E[0], sc = spec.P[1] + spec.E[1];
        out.innerHTML = `<p class="small">Each country has 1,000 hours of labor. Opportunity cost of 1 wine: Portugal ${pRatio.toFixed(2)} cloth, England ${eRatio.toFixed(2)} cloth → <b>${pSpecW ? 'Portugal' : 'England'}</b> has the comparative advantage in wine.</p>
          <table class="small" style="border-collapse:collapse"><tr><th></th><th style="padding:4px 12px">Wine</th><th style="padding:4px 12px">Cloth</th></tr><tr><td>No trade (split time)</td><td style="text-align:center">${tw.toFixed(1)}</td><td style="text-align:center">${tc.toFixed(1)}</td></tr><tr><td>Specialize</td><td style="text-align:center"><b>${sw.toFixed(1)}</b></td><td style="text-align:center"><b>${sc.toFixed(1)}</b></td></tr></table>
          <p class="small">${sw >= tw || sc >= tc ? 'Specializing produces more in total; trade can leave both better off. (With full specialization one good may fall; partial specialization fixes that.)' : 'No gain: equal opportunity costs mean no comparative advantage.'}</p>`; };
      el.append(h('p', { class: 'small muted' }, 'Hours of labor to make one unit (Ricardo’s original numbers: Portugal 80/90, England 120/100):'), K.two(h('div', null, K.slider('Portugal: hours per wine', 20, 200, 5, s.pw, (v) => { s.pw = v; draw(); }), K.slider('Portugal: hours per cloth', 20, 200, 5, s.pc, (v) => { s.pc = v; draw(); })), h('div', null, K.slider('England: hours per wine', 20, 200, 5, s.ew, (v) => { s.ew = v; draw(); }), K.slider('England: hours per cloth', 20, 200, 5, s.ec, (v) => { s.ec = v; draw(); }))), out); draw();
    } });

  A({ id: 'commons', d: ['economics', 'earthspace', 'politics', 'biology'], e: '🐟', t: 'Tragedy of the commons', b: 'You and 4 computer fishers share a lake. Overfish and it collapses. Can rules save it?',
    how: 'Garrett Hardin (1968) argued shared resources get overused because each user gains from taking more while costs are shared. Elinor Ostrom (Nobel 2009) showed many communities avoid this with local rules, monitoring and sanctions, not only through private property or government control.',
    use: 'Fisheries (the Grand Banks cod collapse of 1992), groundwater, climate change, antibiotics, traffic congestion and open-source software.',
    m(el, K) {
      let fish, yr, mine, rule = 'none', log; const box = h('div'); const P = K.canvas(el, 200);
      const reset = () => { fish = 1000; yr = 0; mine = 0; log = [fish]; draw(); };
      const draw = () => { P.clear(); const { X, Y } = P.chart(0, 20, 0, 1200, { xl: 'year', yl: 'fish' }); P.line(log.map((v, i) => [X(i), Y(v)]), '#0891B2', 3); box.innerHTML = `<p class="small">Year ${yr} · fish in lake: <b>${Math.round(fish)}</b> · your total catch: <b>${Math.round(mine)}</b>${fish < 50 ? ' · <b style="color:#DC2626">The fishery has collapsed.</b>' : ''}</p>`; };
      const year = (take) => { if (fish < 1 || yr >= 20) return; const others = [0, 1, 2, 3].map(() => (rule === 'quota' ? Math.min(40, fish * 0.04) : rule === 'ostrom' ? fish * 0.05 : fish * K.rnd(0.06, 0.14))); let mineT = rule === 'quota' ? Math.min(take, 40) : take; if (rule === 'ostrom' && take > fish * 0.06) { mineT = take * 0.5; box.append(h('p', { class: 'small' }, 'Your neighbors caught you overfishing and confiscated half.')); }
        const total = Math.min(fish, mineT + others.reduce((a, b) => a + b, 0)); const share = mineT / (mineT + others.reduce((a, b) => a + b, 0) || 1); mine += total * share; fish -= total; fish += 0.4 * fish * (1 - fish / 1200); yr++; log.push(fish); draw(); };
      const take = K.slider('Your catch this year', 0, 300, 5, 50, () => {});
      el.append(K.choice([['none', 'No rules'], ['quota', 'Government quota (40 each)'], ['ostrom', 'Community monitoring (Ostrom)']], rule, (v) => { rule = v; reset(); }), take, h('div', { class: 'row' }, K.btn('Fish for a year', () => year(take.get()), true), K.btn('Restart', reset)), box); reset();
    } });

  A({ id: 'moneyprint', d: ['economics', 'politics', 'history'], e: '💵', t: 'Money, prices & inflation', b: 'Print money faster than the economy grows and prices rise. See the rough rule and famous hyperinflations.',
    how: 'The quantity theory: money × velocity = prices × real output (MV = PY). If velocity is stable, prices rise roughly with money growth minus output growth. Over long periods and in hyperinflations it fits well; in the short run, especially when interest rates are near zero, the link is much looser (US money grew fast after 2008 with low inflation).',
    use: 'Central bank policy, Weimar Germany (1923), Zimbabwe (2008), Venezuela (2016–19), the 2021–23 inflation surge, and debates about government deficits and modern monetary theory.',
    m(el, K) {
      const s = { m: 5, y: 2, v: 0 }; const out = h('div'); const P = K.canvas(el, 220);
      const draw = () => { const inf = s.m + s.v - s.y; P.clear(); const { X, Y } = P.chart(0, 20, 0, Math.max(3, Math.log10(Math.max(1.01, (1 + inf / 100) ** 20)) * 1.1), { xl: 'years', fy: (v) => '×' + Lab.fmt(10 ** v, 1) }); P.line(Array.from({ length: 21 }, (_, t) => [X(t), Y(Math.max(0, t * Math.log10(Math.max(0.01, 1 + inf / 100))))]), '#DC2626', 3);
        out.innerHTML = `<div class="kpi">≈ ${inf.toFixed(1)}% inflation a year <small>prices ×${Lab.fmt((1 + inf / 100) ** 20, 1)} in 20 years; $100 buys ${Lab.fmt(100 / (1 + inf / 100) ** 20, 1)} of today’s goods</small></div>`; };
      P.onResize = draw; el.append(K.slider('Money supply growth % per year', 0, 100, 0.5, s.m, (v) => { s.m = v; draw(); }), K.slider('Real economic growth % per year', -5, 8, 0.5, s.y, (v) => { s.y = v; draw(); }), K.slider('Change in velocity % per year (people spending faster/slower)', -10, 30, 0.5, s.v, (v) => { s.v = v; draw(); }), out,
        bars([['Weimar Germany, peak month (Oct 1923)', 29500], ['Zimbabwe, peak month (Nov 2008, est.)', 7.96e10], ['Venezuela, 2018 (annual, IMF est.)', 65374], ['US, 2022 (annual CPI)', 8.0]].map(([l, v]) => [l, Math.log10(v), '#DC2626']), 11, (v) => Lab.fmt(10 ** v, 0) + '%'), h('p', { class: 'tiny muted' }, 'Bars on a log scale. Hyperinflations usually follow wars, lost output or collapsing tax revenue paid for by printing money.')); draw();
    } });

  A({ id: 'lorenz', d: ['economics', 'sociology', 'politics'], e: '📊', t: 'Measure inequality (Gini)', b: 'Split a country’s income among 5 groups and see its Lorenz curve and Gini coefficient. Compare real countries.',
    how: 'Sort everyone from poorest to richest and plot the share of total income held by the bottom x%. Perfect equality is a straight diagonal; the bigger the bulge, the more unequal. The Gini coefficient (Corrado Gini, 1912) is the bulge area as a share: 0 = equal, 1 = one person has everything.',
    use: 'Comparing countries and decades, judging tax and welfare policy, and studying links between inequality and growth, health or political stability (much debated).',
    m(el, K) {
      const P = K.canvas(el, 320); let q = [8, 14, 18, 23, 37]; const out = K.out(); const sl = [];
      const R = { 'South Africa (≈0.63)': [3, 5, 8, 17, 67], 'Brazil (≈0.52)': [3, 8, 12, 19, 58], 'United States (≈0.41)': [5, 10, 15, 22, 48], 'China (≈0.36)': [6, 11, 15, 22, 46], 'Germany (≈0.32)': [8, 13, 17, 23, 39], 'Sweden (≈0.29)': [9, 14, 18, 23, 36], 'Perfect equality': [20, 20, 20, 20, 20] };
      const draw = () => { const tot = q.reduce((a, b) => a + b, 0); const sh = q.map((v) => v / tot); let c = 0; const pts = [[0, 0], ...sh.map((v, i) => [(i + 1) / 5, (c += v)])]; let area = 0; for (let i = 1; i < pts.length; i++) area += ((pts[i][1] + pts[i - 1][1]) / 2) * 0.2; const gini = 1 - 2 * area;
        P.clear(); const { X, Y } = P.chart(0, 1, 0, 1, { xl: 'share of people (poorest first)', fx: (v) => Math.round(v * 100) + '%', fy: (v) => Math.round(v * 100) + '%' }); P.ctx.fillStyle = '#DC262622'; P.ctx.beginPath(); P.ctx.moveTo(X(0), Y(0)); pts.forEach(([x, y]) => P.ctx.lineTo(X(x), Y(y))); P.ctx.lineTo(X(1), Y(1)); P.ctx.closePath(); P.ctx.fill();
        P.line([[X(0), Y(0)], [X(1), Y(1)]], '#16A34A', 2, [5, 4]); P.line(pts.map(([x, y]) => [X(x), Y(y)]), '#DC2626', 3); out.innerHTML = `Gini ≈ <b>${gini.toFixed(2)}</b> (5-group approximation) · richest fifth gets ${(sh[4] * 100).toFixed(0)}%, poorest fifth ${(sh[0] * 100).toFixed(0)}%`; };
      ['Poorest 20%', 'Next 20%', 'Middle 20%', 'Fourth 20%', 'Richest 20%'].forEach((l, i) => sl.push(K.slider(l + ' (share of income)', 1, 80, 1, q[i], (v) => { q[i] = v; draw(); })));
      P.onResize = draw; el.append(h('div', { class: 'grid g3' }, ...sl), h('div', { class: 'row' }, Object.entries(R).map(([n, v]) => K.btn(n, () => { q = v.slice(); v.forEach((x, i) => sl[i].set(x)); draw(); }))), out, h('p', { class: 'tiny muted' }, 'Country shares are rounded approximations of World Bank income/consumption quintile data (recent years); exact Gini values differ by source and by whether income is before or after taxes.')); draw();
    } });

  A({ id: 'budget', d: ['economics', 'politics'], e: '🏛️', t: 'Balance the US budget', b: 'Real federal spending and revenue (FY2024, rounded). Cut, tax, and see how hard closing the deficit is.',
    how: 'In fiscal 2024 the federal government spent about $6.75 trillion and collected about $4.92 trillion (CBO), a deficit of about $1.8 trillion. Most spending is “mandatory” (Social Security, Medicare, Medicaid) or interest, which Congress doesn’t vote on each year. Every option has trade-offs that different political traditions weigh differently.',
    use: 'Understanding budget debates, debt-ceiling fights, tax proposals and what “cutting waste” can and can’t achieve.',
    m(el, K) {
      const SP = [['Social Security', 1460], ['Medicare (net)', 870], ['Defense', 870], ['Net interest on debt', 880], ['Medicaid', 620], ['Income security (SNAP, credits, etc.)', 670], ['Veterans', 330], ['Everything else (education, roads, science, agencies…)', 1050]];
      const RV = [['Individual income tax', 2430], ['Payroll taxes', 1710], ['Corporate income tax', 530], ['Other (customs, excise, estate…)', 250]];
      const sp = SP.map(() => 0), rv = RV.map(() => 0); const out = h('div'); const grid = h('div', { class: 'grid g2' });
      const draw = () => { const S = SP.reduce((a, [, v], i) => a + v * (1 + sp[i] / 100), 0), R = RV.reduce((a, [, v], i) => a + v * (1 + rv[i] / 100), 0); const d = S - R;
        out.innerHTML = `<div class="kpi" style="color:${d > 0 ? '#DC2626' : '#16A34A'}">${d > 0 ? 'Deficit' : 'Surplus'}: $${Lab.fmt(Math.abs(d) / 1000, 2)} trillion <small>spending $${Lab.fmt(S / 1000, 2)}T · revenue $${Lab.fmt(R / 1000, 2)}T</small></div>`; };
      grid.append(h('div', null, h('b', null, 'Spending ($ billions, change %)'), ...SP.map(([l, v], i) => K.slider(`${l}: $${v}B`, -50, 50, 1, 0, (x) => { sp[i] = x; draw(); }, (x) => (x > 0 ? '+' : '') + x + '%'))), h('div', null, h('b', null, 'Revenue ($ billions, change %)'), ...RV.map(([l, v], i) => K.slider(`${l}: $${v}B`, -50, 100, 1, 0, (x) => { rv[i] = x; draw(); }, (x) => (x > 0 ? '+' : '') + x + '%'))));
      el.append(out, grid, h('p', { class: 'tiny muted' }, 'Rounded from CBO’s Monthly Budget Review for FY2024; categories simplified. The model is static: in reality tax and spending changes affect growth, behavior and interest rates, which economists dispute. Cutting interest isn’t directly possible; it falls only if debt or rates fall.')); draw();
    } });

  A({ id: 'ultimatum', d: ['economics', 'psychology', 'anthropology'], e: '🤲', t: 'The ultimatum game', b: 'Split $100. If the other person rejects your offer, nobody gets anything. What do people really do?',
    how: 'Pure self-interest says accept any offer above zero. In real experiments most people offer 40–50%, and offers under about 20% are often rejected: people pay to punish unfairness. Joseph Henrich’s team (2001) ran it in 15 small-scale societies: average offers ranged from about 26% (Machiguenga, Peru) to 58% (Lamalera whale hunters, Indonesia), tracking how much each society relied on market exchange and cooperation.',
    use: 'Behavioral economics, negotiation, fairness in pay, and evidence that cultural norms shape economic behavior.',
    m(el, K) {
      const out = h('div'); let offer = 30, rounds = 0, earned = 0; const res = h('div', { class: 'small' });
      const play = () => { const thr = Math.max(0, Math.min(50, 25 + K.gauss() * 10)); rounds++; const ok = offer >= thr; if (ok) earned += 100 - offer; res.innerHTML = `Round ${rounds}: you offered $${offer}. The other player (who secretly needed at least $${thr.toFixed(0)}) <b>${ok ? 'accepted' : 'rejected'}</b>. You get $${ok ? 100 - offer : 0}. Average per round: $${(earned / rounds).toFixed(1)}`; };
      el.append(K.slider('Your offer to the other player ($ of 100)', 0, 100, 1, offer, (v) => (offer = v)), K.btn('Make the offer', play, true), res,
        h('h3', null, 'Average offers in 15 small-scale societies (Henrich et al., 2001)'), bars([['Machiguenga (Peru)', 26], ['Hadza (Tanzania)', 40], ['Orma (Kenya)', 44], ['Au (Papua New Guinea)', 43], ['US students (typical)', 44], ['Lamalera (Indonesia)', 58]], 70, (v) => v + '%'), h('p', { class: 'tiny muted' }, 'Values rounded from the published study; the computer opponent here is a rough model of typical rejection behavior.'));
    } });

  A({ id: 'auction', d: ['economics', 'math', 'psychology'], e: '🔨', t: 'Auctions: bid your true value?', b: 'Play first-price and second-price sealed-bid auctions against computer bidders. Find the best strategy.',
    how: 'In a second-price (Vickrey) auction the winner pays the second-highest bid, so bidding exactly your true value is always optimal (William Vickrey, Nobel 1996). In a first-price auction you should shade your bid below your value. Auction theory earned Milgrom and Wilson the 2020 Nobel for designing spectrum auctions.',
    use: 'Google and Facebook ad auctions, government bond and spectrum auctions, eBay (a version of second-price), art sales and electricity markets.',
    m(el, K) {
      let type = 'second', val, profit = 0, n = 0; const info = h('div', { class: 'small' }); const res = h('div', { class: 'small' }); const bid = K.slider('Your bid ($)', 0, 100, 1, 50, () => {});
      const newItem = () => { val = K.ri(20, 100); info.innerHTML = `The item is worth <b>$${val}</b> to you. Four rivals each have a private value between $0 and $100.`; };
      const play = () => { const rivals = [0, 1, 2, 3].map(() => { const v = K.rnd(0, 100); return type === 'second' ? v : v * 0.8; }); const b = bid.get(); const top = Math.max(...rivals); n++; let msg; if (b > top) { const pay = type === 'second' ? top : b; profit += val - pay; msg = `You won and paid $${pay.toFixed(0)}: profit $${(val - pay).toFixed(0)}.`; } else msg = `You lost (top rival bid $${top.toFixed(0)}).`; res.innerHTML = `${msg} Total profit after ${n} auctions: <b>$${profit.toFixed(0)}</b> (avg $${(profit / n).toFixed(1)})`; newItem(); };
      el.append(K.choice([['second', 'Second-price (pay 2nd-highest bid)'], ['first', 'First-price (pay your bid)']], type, (v) => { type = v; profit = 0; n = 0; res.textContent = ''; }), info, bid, h('div', { class: 'row' }, K.btn('Bid', play, true), K.btn('Auto: bid my true value ×20', () => { for (let i = 0; i < 20; i++) { bid.set(val); play(); } }), K.btn('Auto: bid 75% of value ×20', () => { for (let i = 0; i < 20; i++) { bid.set(Math.round(val * 0.75)); play(); } })), res); newItem();
    } });

  A({ id: 'bankrun', d: ['economics', 'history', 'psychology'], e: '🏦', t: 'Bank runs', b: 'Banks lend out most deposits. If enough people panic at once, even a healthy bank fails.',
    how: 'Banks keep a fraction of deposits as cash and lend the rest. That creates money and credit, but means the bank can’t pay everyone at once. Diamond and Dybvig (1983, Nobel 2022) showed runs can be self-fulfilling: if you think others will withdraw, withdrawing is rational. Deposit insurance (FDIC, 1933) and central banks as lenders of last resort exist to stop this.',
    use: 'The Great Depression (about 9,000 US banks failed 1930–33), Northern Rock (2007), Silicon Valley Bank (2023, $42 billion withdrawn in one day), and stablecoins today.',
    m(el, K) {
      let reserve = 10, panic = 15, insured = false; const P = K.canvas(el, 260); const out = K.out();
      const run = () => { const N = 200; let cash = reserve, deposits = 100, out_ = 0, withdrawn = new Uint8Array(N); const hist = []; for (let t = 0; t < 60; t++) { const frac = out_ / N; for (let i = 0; i < N; i++) if (!withdrawn[i]) { const fear = insured ? 0.002 : 0.002 + (frac * panic) / 100 + (t === 5 ? 0.05 : 0); if (Math.random() < fear) { withdrawn[i] = 1; out_++; cash -= 100 / N; } } hist.push([out_ / N, cash]); if (cash < 0) break; }
        P.clear(); const { X, Y } = P.chart(0, 60, 0, 1, { xl: 'days', fy: (v) => Math.round(v * 100) + '%' }); P.line(hist.map(([f], i) => [X(i), Y(f)]), '#DC2626', 3); P.line([[X(0), Y(reserve / 100)], [X(60), Y(reserve / 100)]], '#16A34A', 2, [5, 4]); P.text('cash on hand', X(1), Y(reserve / 100) - 5, { c: '#16A34A', s: 11 });
        const failed = hist[hist.length - 1][1] < 0; out.innerHTML = `${failed ? '<b style="color:#DC2626">The bank ran out of cash and failed</b>' : '<b style="color:#16A34A">The bank survived</b>'}: ${(hist[hist.length - 1][0] * 100).toFixed(0)}% of depositors withdrew. ${insured ? 'With insurance, nobody had a reason to rush.' : 'A small rumor on day 5 started it.'}`; };
      P.onResize = run; el.append(K.slider('Cash reserves (% of deposits)', 2, 50, 1, reserve, (v) => { reserve = v; run(); }), K.slider('How contagious is panic', 0, 40, 1, panic, (v) => { panic = v; run(); }), K.choice([[false, 'No deposit insurance'], [true, 'Deposit insurance']], false, (v) => { insured = v; run(); }), K.btn('Run again', run, true), out); run();
    } });

  A({ id: 'multiplier', d: ['economics', 'politics', 'math'], e: '🔁', t: 'The spending multiplier', b: 'Government spends $100. The worker spends some, the shopkeeper spends some… how big does it get?',
    how: 'Keynes (1936) argued spending ripples through the economy: if people spend a fraction c of each extra dollar, total demand rises by 1/(1−c) times the original. Leakages (saving, taxes, imports) shrink it, and if the economy is at full capacity or the central bank raises rates, crowding out can cancel much of it. Estimates of real multipliers range from about 0.5 to 2.',
    use: 'Stimulus debates (2009, 2020–21), austerity in Europe after 2010, tax cuts versus spending, and how local economies respond to a new factory or base.',
    m(el, K) {
      let c = 0.6, leak = 0.15, crowd = 0; const P = K.canvas(el, 260); const out = K.out();
      const draw = () => { P.clear(); const rounds = []; let amt = 100; for (let i = 0; i < 15; i++) { rounds.push(amt); amt *= c * (1 - leak); } const tot = rounds.reduce((a, b) => a + b, 0) * (1 - crowd / 100); const { X, Y } = P.chart(0, 15, 0, 100, { xl: 'round of spending', yl: '$' }); rounds.forEach((v, i) => P.rect(X(i) + 2, Y(v), X(1) - X(0) - 4, Y(0) - Y(v), K.pal[i % 8]));
        out.innerHTML = `Total extra spending ≈ <b>$${tot.toFixed(0)}</b> from $100 → multiplier ≈ <b>${(tot / 100).toFixed(2)}</b>`; };
      P.onResize = draw; el.append(K.slider('Share of extra income people spend', 0.1, 0.95, 0.01, c, (v) => { c = v; draw(); }), K.slider('Leakage to taxes & imports', 0, 0.5, 0.01, leak, (v) => { leak = v; draw(); }), K.slider('Crowding out (%)', 0, 100, 1, crowd, (v) => { crowd = v; draw(); }), out); draw();
    } });

  // ======================= POLITICS =======================
  A({ id: 'condorcet', d: ['politics', 'math', 'logic'], e: '🔄', t: 'Voting paradoxes', b: 'Three voters, three options, and the group prefers A over B, B over C, and C over A. Who wins?',
    how: 'The Marquis de Condorcet (1785) found majority preferences can cycle even when every individual is consistent. Kenneth Arrow (1951) proved no ranked voting system can satisfy a short list of fairness conditions at once. So the rules for counting votes can change the winner.',
    use: 'Choosing electoral systems (plurality, ranked-choice, Condorcet methods), committee agenda-setting, and why whoever controls the order of votes has power.',
    m(el, K) {
      const V = [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']]; const out = h('div'); let agenda = 0;
      const pref = (v, x, y) => v.indexOf(x) < v.indexOf(y); const maj = (x, y) => (V.filter((v) => pref(v, x, y)).length >= 2 ? x : y);
      const draw = () => { const pairs = [['A', 'B'], ['B', 'C'], ['C', 'A']]; const orders = [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']]; const o = orders[agenda]; const w1 = maj(o[0], o[1]), w2 = maj(w1, o[2]);
        out.innerHTML = `<table class="small" style="border-collapse:collapse;margin:8px 0">${V.map((v, i) => `<tr><td style="padding:3px 10px">Voter ${i + 1}</td><td>${v.join(' > ')}</td></tr>`).join('')}</table>
          <p class="small">Head-to-head: ${pairs.map(([x, y]) => `${x} vs ${y} → <b>${maj(x, y)}</b>`).join(' · ')}. A cycle: every option loses to another.</p>
          <p>Agenda: vote ${o[0]} vs ${o[1]} first (winner ${w1}), then against ${o[2]} → <b>${w2} wins</b>. Change the agenda and a different option wins.</p>`; };
      el.append(K.choice([[0, 'Agenda 1'], [1, 'Agenda 2'], [2, 'Agenda 3']], 0, (v) => { agenda = v; draw(); }), out); draw();
    } });

  A({ id: 'coalition', d: ['politics', 'math'], e: '🧩', t: 'Build a coalition', b: 'A real-style parliament with no majority. Find coalitions that reach 50% + 1, then count how much power each party really has.',
    how: 'In proportional systems, governments usually need coalitions. A party’s real bargaining power depends on how often it is pivotal (its votes turn a losing coalition into a winning one), not just its seat count. The Banzhaf index counts this.',
    use: 'Germany, the Netherlands, Israel, India and many others are governed by coalitions; the same math describes shareholder voting and the EU Council.',
    m(el, K) {
      const parties = [['Center-Right', 208, '#1D4ED8'], ['Center-Left', 120, '#DC2626'], ['Nationalist', 152, '#0EA5E9'], ['Greens', 85, '#16A34A'], ['Liberals', 30, '#CA8A04'], ['Left', 64, '#9333EA'], ['Regional', 11, '#64748B']]; const total = parties.reduce((a, p) => a + p[1], 0), need = Math.floor(total / 2) + 1; const on = new Set(); const box = h('div'); const pw = h('div');
      const banz = () => { const n = parties.length, c = Array(n).fill(0); for (let m = 0; m < 1 << n; m++) { let s = 0; for (let i = 0; i < n; i++) if (m >> i & 1) s += parties[i][1]; if (s >= need) for (let i = 0; i < n; i++) if (m >> i & 1 && s - parties[i][1] < need) c[i]++; } const t = c.reduce((a, b) => a + b, 0); return c.map((x) => x / t); };
      const draw = () => { const seats = [...on].reduce((a, i) => a + parties[i][1], 0); box.innerHTML = ''; box.append(h('div', { class: 'row' }, parties.map(([n, s, c], i) => h('span', { class: 'chip' + (on.has(i) ? ' on' : ''), style: { '--c': c }, onclick: () => { on.has(i) ? on.delete(i) : on.add(i); draw(); } }, h('i'), `${n} ${s}`))),
        h('div', { style: { height: '22px', background: 'var(--card2)', borderRadius: '8px', marginTop: '10px', position: 'relative', overflow: 'hidden' } }, h('div', { style: { width: (seats / total) * 100 + '%', height: '100%', background: seats >= need ? '#16A34A' : '#94A3B8' } }), h('div', { style: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#111' } })),
        h('p', { class: 'small' }, `${seats} of ${total} seats (need ${need}). ${seats >= need ? '✓ Majority coalition!' : 'Not yet a majority.'}`)); };
      const b = banz(); pw.append(h('h3', null, 'Real bargaining power (Banzhaf index) vs seat share'), bars(parties.map(([n, s, c], i) => [n + ` (${((s / total) * 100).toFixed(0)}% seats)`, b[i] * 100, c]), 40, (v) => v.toFixed(1) + '% power'));
      el.append(h('p', { class: 'small muted' }, 'Click parties to add them to your coalition. Parties are fictional.'), box, pw); draw();
    } });

  A({ id: 'dhondt', d: ['politics', 'math'], e: '🪑', t: 'Votes into seats', b: 'Same votes, different formulas: first-past-the-post, D’Hondt and Sainte-Laguë give different parliaments.',
    how: 'Single-member districts reward the largest party and punish spread-out smaller ones. Proportional formulas divide each party’s votes by a sequence (D’Hondt: 1, 2, 3…; Sainte-Laguë: 1, 3, 5…) and hand out seats to the largest quotients. D’Hondt slightly favors big parties; Sainte-Laguë is closer to exact proportionality.',
    use: 'The UK and US use first-past-the-post; D’Hondt is used in Spain, Portugal, the European Parliament in several countries; Sainte-Laguë in Germany, New Zealand and Scandinavia.',
    m(el, K) {
      const P_ = [['Party A', 38, '#2563EB'], ['Party B', 31, '#DC2626'], ['Party C', 17, '#CA8A04'], ['Party D', 9, '#16A34A'], ['Party E', 5, '#9333EA']]; let seats = 20, thr = 0; const out = h('div'); const sl = [];
      const alloc = (div) => { const r = P_.map(() => 0); const elig = P_.map(([, v]) => v >= thr); for (let s = 0; s < seats; s++) { let b = -1, bq = -1; P_.forEach(([, v], i) => { if (!elig[i]) return; const q = v / div(r[i]); if (q > bq) { bq = q; b = i; } }); r[b]++; } return r; };
      const fptp = () => { const r = P_.map(() => 0); for (let d = 0; d < seats; d++) { const local = P_.map(([, v]) => v * (0.75 + Math.random() * 0.5) * (1 + 0.6 * Math.sin(d * 1.3 + v))); r[local.indexOf(Math.max(...local))]++; } return r; };
      const draw = () => { const sets = [['First past the post (simulated districts)', fptp()], ['D’Hondt', alloc((n) => n + 1)], ['Sainte-Laguë', alloc((n) => 2 * n + 1)]]; const tv = P_.reduce((a, p) => a + p[1], 0); out.innerHTML = '';
        sets.forEach(([n, r]) => out.append(h('div', { style: { margin: '10px 0' } }, h('b', { class: 'small' }, n), h('div', { style: { display: 'flex', height: '26px', borderRadius: '6px', overflow: 'hidden', marginTop: '4px' } }, r.map((x, i) => (x ? h('div', { style: { width: (x / seats) * 100 + '%', background: P_[i][2], color: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '26px' } }, x) : null))))));
        out.append(h('div', { class: 'small muted' }, 'Vote shares: ' + P_.map(([n, v]) => `${n} ${((v / tv) * 100).toFixed(0)}%`).join(' · '))); };
      P_.forEach(([n, v], i) => sl.push(K.slider(n + ' votes', 0, 60, 1, v, (x) => { P_[i][1] = x; draw(); })));
      el.append(h('div', { class: 'grid g3' }, ...sl), K.slider('Seats', 5, 100, 1, seats, (v) => { seats = v; draw(); }), K.slider('Threshold to get seats (% of votes)', 0, 10, 1, thr, (v) => { thr = v; draw(); }), out); draw();
    } });

  A({ id: 'medianvoter', d: ['politics', 'economics'], e: '↔️', t: 'Where do parties position?', b: 'Two parties chasing votes on a left-right line converge to the middle. Add a third party, primaries or turnout and see what changes.',
    how: 'Anthony Downs (1957) and Harold Hotelling (1929): with one dimension, two parties and everyone voting, both move toward the median voter. Real parties often don’t, because of primaries, activists and donors, low turnout among moderates, and multiple issue dimensions.',
    use: 'Explains moderation in some eras and polarization in others; it also explains why competing shops cluster on the same street.',
    m(el, K) {
      const P = K.canvas(el, 260); let a = 0.2, b = 0.8, prim = 0, run = false; const out = K.out(); const voters = Array.from({ length: 2000 }, () => Lab.clamp(0.5 + K.gauss() * 0.18, 0, 1));
      const share = (x, y) => { let s = 0; voters.forEach((v) => { if (Math.abs(v - x) < Math.abs(v - y)) s++; else if (Math.abs(v - x) === Math.abs(v - y)) s += 0.5; }); return s / voters.length; };
      const draw = () => { P.clear(); const B = 40, c = Array(B).fill(0); voters.forEach((v) => c[Math.min(B - 1, Math.floor(v * B))]++); const m = Math.max(...c); c.forEach((v, i) => P.rect((i / B) * P.W, P.H - 30 - (v / m) * (P.H - 60), P.W / B - 1, (v / m) * (P.H - 60), '#94A3B866'));
        [[a, '#2563EB', 'A'], [b, '#DC2626', 'B']].forEach(([x, c2, l]) => { P.line([[x * P.W, 10], [x * P.W, P.H - 30]], c2, 3); P.text(l, x * P.W, P.H - 12, { a: 'center', c: c2, w: 700 }); }); P.text('left', 4, P.H - 12, { c: K.css('--muted') }); P.text('right', P.W - 4, P.H - 12, { a: 'right', c: K.css('--muted') });
        const sa = share(a, b); out.innerHTML = `Party A wins ${(sa * 100).toFixed(1)}%, Party B ${(100 - sa * 100).toFixed(1)}%`; };
      K.every(120, () => { if (!run) return; const st = 0.01; const best = (x, y, base) => { let bx = x, bs = -1; [-st, 0, st].forEach((d) => { const nx = Lab.clamp(x + d, 0, 1); const pen = prim * Math.abs(nx - base); const sc = share(nx, y) - pen; if (sc > bs) { bs = sc; bx = nx; } }); return bx; }; a = best(a, b, 0.25); b = 1 - best(1 - b, 1 - a, 0.25); draw(); });
      P.onResize = draw; el.append(h('div', { class: 'row' }, K.btn('⏯ Let parties compete', () => (run = !run), true), K.btn('Reset', () => { a = 0.2; b = 0.8; draw(); })), K.slider('Pressure from primaries/base (pulls parties outward)', 0, 1, 0.05, prim, (v) => (prim = v)), out); draw();
    } });

  A({ id: 'publicgoods', d: ['politics', 'economics', 'sociology', 'psychology'], e: '🫙', t: 'Public goods & free riders', b: 'Four players, a shared pot that doubles. Everyone gains if all contribute, but each gains more by free riding.',
    how: 'Each round, players put some of $20 into a pot; the pot is doubled and split equally. Contributing everything is best for the group, but each dollar you put in returns only 50 cents to you. In lab experiments contributions start around 40–60% and decay, but adding punishment of free riders sustains cooperation (Fehr & Gächter, 2000). Mancur Olson’s “Logic of Collective Action” (1965) explains why large groups struggle to organize.',
    use: 'Taxes for roads and defense, climate agreements, unions, open-source software, public broadcasting, and voting itself.',
    m(el, K) {
      let round = 0, mine = 0, bots = [12, 10, 8], punish = false, totalMe = 0; const out = h('div', { class: 'small' }); const give = K.slider('Your contribution ($ of 20)', 0, 20, 1, 10, () => {});
      const play = () => { const me = give.get(); const pot = (me + bots.reduce((a, b) => a + b, 0)) * 2; const each = pot / 4; let pay = 20 - me + each; let note = ''; if (punish && me < 6) { pay -= 9; note = ' The others fined you $9 for free riding.'; } totalMe += pay; round++;
        out.innerHTML = `Round ${round}: pot $${pot} → $${each.toFixed(1)} each. Bots gave ${bots.join(', ')}. You earned $${pay.toFixed(1)} (total $${totalMe.toFixed(0)}).${note}`;
        bots = bots.map((b) => Math.round(Lab.clamp(punish ? b + (me < 6 ? 0 : 1) : (b + me) / 2 - 1 + K.gauss(), 0, 20))); };
      el.append(K.choice([[false, 'No punishment'], [true, 'Peer punishment allowed']], false, (v) => { punish = v; round = 0; totalMe = 0; bots = [12, 10, 8]; out.textContent = ''; }), give, K.btn('Play a round', play, true), out, h('p', { class: 'tiny muted' }, 'Bots copy the group’s behavior, a pattern called conditional cooperation.'));
    } });

  A({ id: 'billlaw', d: ['politics', 'law'], e: '📜', t: 'How a bill really becomes law (US)', b: 'Push a bill through every veto point. Each stage shows the real odds of surviving it.',
    how: 'The US system has many veto points: committees, leaders deciding what gets a vote, the Senate filibuster (60 votes), the other chamber, conference, the president’s veto (two-thirds to override), and the courts. In a typical recent Congress, about 2–4% of bills introduced became law.',
    use: 'Explains gridlock, why big laws often pass through budget reconciliation, executive orders, and the role of lobbyists at the committee stage.',
    m(el, K) {
      const ST = [['Introduced', 1, 'Any member can introduce a bill: over 15,000 bills are introduced in a typical two-year Congress.'], ['Committee hearing & markup', 0.15, 'Most bills die here without a hearing; chairs and lobbyists shape the text.'], ['Floor vote in the House', 0.7, 'The Speaker and Rules Committee decide what comes to the floor and how it can be amended.'], ['Senate: 60 votes to end debate', 0.4, 'The filibuster means most bills need 60 of 100 senators, so the minority can block.'], ['Both chambers agree on one text', 0.8, 'Differences are resolved by conference or by one chamber passing the other’s version.'], ['President signs (or veto overridden by 2/3)', 0.95, 'Vetoes are rare when the same party controls both, common in divided government.'], ['Survives court challenges', 0.95, 'Courts can strike laws down or narrow them (e.g. parts of the Affordable Care Act in 2012).']];
      let i = 0, alive = true; const box = h('div');
      const draw = () => { box.innerHTML = ''; ST.forEach(([n, p, d], k) => box.append(h('div', { class: 'row', style: { opacity: k <= i ? 1 : 0.4, margin: '6px 0', flexWrap: 'nowrap' } }, h('span', { style: { width: '28px', flex: 'none', fontSize: '18px' } }, k < i ? '✅' : k === i ? (alive ? '👉' : '💀') : '⬜'), h('div', null, h('b', { class: 'small' }, n), ' ', k ? h('span', { class: 'tiny muted' }, `(~${Math.round(p * 100)}% of bills at this stage survive it; illustrative)`) : null, h('div', { class: 'tiny' }, d)))));
        box.append(h('div', { class: 'row', style: { marginTop: '8px' } }, alive && i < ST.length - 1 ? K.btn('Try the next stage', () => { i++; if (Math.random() > ST[i][1]) alive = false; draw(); }, true) : h('b', null, alive ? '🎉 It’s law!' : 'The bill died here.'), K.btn('New bill', () => { i = 0; alive = true; draw(); }))); };
      el.append(box); draw();
    } });

  A({ id: 'powerindex', d: ['politics', 'geopolitics', 'math'], e: '🗝️', t: 'Who holds the veto? UN Security Council', b: 'Fifteen members, five with vetoes. Count how often each member actually decides the outcome.',
    how: 'A Security Council resolution needs 9 of 15 votes and no veto from the five permanent members (China, France, Russia, UK, US). The Shapley–Shubik index (1954) measures power as the chance a member is the decisive vote. Each permanent member has about 19.6% of the power; each of the 10 elected members about 0.19%.',
    use: 'Debates on Security Council reform, weighted voting in the IMF and EU, shareholder power, and why small swing states can matter more than their size.',
    m(el, K) {
      const out = h('div'); let trials = 0, piv = { perm: 0, elec: 0 };
      const sim = (n) => { for (let t = 0; t < n; t++) { const order = Lab.shuffle([...Array(15).keys()]); let yes = 0, permYes = 0; for (const m of order) { yes++; if (m < 5) permYes++; if (yes >= 9 && permYes === 5) { m < 5 ? piv.perm++ : piv.elec++; break; } } trials++; } draw(); };
      const draw = () => { out.innerHTML = ''; out.append(h('p', { class: 'small' }, `${trials.toLocaleString()} random voting orders simulated.`), bars([['Each permanent member', (piv.perm / 5 / trials) * 100, '#DC2626'], ['Each elected member', (piv.elec / 10 / trials) * 100, '#2563EB']], 25, (v) => v.toFixed(2) + '%'), h('p', { class: 'small' }, 'Exact theory: 19.63% and 0.19%. The five permanent members hold about 98% of the decisive power with a third of the seats.')); };
      el.append(K.btn('Simulate 20,000 votes', () => sim(20000), true), out); sim(5000);
    } });

  // ======================= GEOPOLITICS =======================
  A({ id: 'chokepoints', d: ['geopolitics', 'economics', 'earthspace'], e: '🛢️', t: 'Oil chokepoints', b: 'A handful of narrow straits carry much of the world’s oil. Close one and watch prices respond.',
    how: 'The US Energy Information Administration estimates about 20 million barrels a day passed the Strait of Hormuz in 2023–24 (about a fifth of global oil consumption) and about 23 million through the Strait of Malacca. Short-run oil demand is very inelastic, so even a small supply loss can push prices up sharply. Pipelines and strategic reserves can only partly compensate.',
    use: 'Naval strategy (why the US Fifth Fleet is in Bahrain and China worries about the “Malacca dilemma”), energy security, insurance markets, and the 2023–24 Houthi attacks diverting Red Sea shipping around Africa.',
    m(el, K) {
      const CP = [['Strait of Malacca', 23.7, 'Asia’s lifeline: oil to China, Japan, Korea.'], ['Strait of Hormuz', 20.9, 'Gulf exports; limited bypass pipelines.'], ['Suez Canal & SUMED pipeline', 7.5, 'Europe–Asia shortcut; Red Sea attacks rerouted ships in 2024.'], ['Bab el-Mandeb', 8.6, 'Southern entrance to the Red Sea.'], ['Danish Straits', 4.9, 'Russian Baltic exports.'], ['Turkish Straits', 3.4, 'Black Sea exports.'], ['Panama Canal', 2.3, 'Drought limited traffic in 2023.']];
      let closed = new Set(), elast = 0.05; const out = h('div'); const box = h('div');
      const draw = () => { box.innerHTML = ''; box.append(h('div', { class: 'row' }, CP.map(([n], i) => h('span', { class: 'chip' + (closed.has(i) ? ' on' : ''), style: { '--c': '#DC2626' }, onclick: () => { closed.has(i) ? closed.delete(i) : closed.add(i); draw(); } }, (closed.has(i) ? '⛔ ' : '🚢 ') + n))));
        const lost = [...closed].reduce((a, i) => a + CP[i][1], 0) * 0.5; const frac = lost / 102; const rise = frac ? ((1 / (1 - frac)) ** (1 / elast) - 1) * 100 : 0;
        out.innerHTML = ''; out.append(bars(CP.map(([n, v], i) => [n, v, closed.has(i) ? '#DC2626' : '#0891B2']), 25, (v) => v + ' mb/d'), h('div', { class: 'kpi', style: { marginTop: '8px' } }, `Supply lost ≈ ${lost.toFixed(1)} mb/d (${(frac * 100).toFixed(1)}% of world use)`), h('p', { class: 'small' }, `Toy model price spike: ${rise > 1000 ? 'over 1,000%' : '+' + rise.toFixed(0) + '%'}. Assumes half the flow can be rerouted, bypassed or replaced from reserves.`)); };
      el.append(box, K.slider('How much demand falls when prices rise (elasticity)', 0.02, 0.3, 0.01, elast, (v) => { elast = v; draw(); }), out, Lab.source('US EIA World Oil Transit Chokepoints (flows rounded, million barrels per day, 2023 or latest). Bab el-Mandeb and Suez overlap.')); draw();
    } });

  A({ id: 'armsrace', d: ['geopolitics', 'politics', 'math', 'history'], e: '🚀', t: 'The security dilemma', b: 'Two rivals each arm to feel safe, which makes the other feel less safe. Run Richardson’s arms-race model.',
    how: 'Lewis Fry Richardson (1960) modeled arms races with two equations: each side builds in response to the other’s arms, minus the economic burden of its own, plus a baseline grievance. If reaction outweighs restraint, spending spirals. John Herz (1950) called this the security dilemma: defensive moves look threatening.',
    use: 'The Anglo-German naval race before WWI, the US–Soviet nuclear buildup, and today’s US–China competition; arms control treaties try to change the reaction coefficients.',
    m(el, K) {
      const P = K.canvas(el, 280); const s = { k: 0.6, a: 0.5, g: 1 }; const out = K.out();
      const run = () => { let x = 5, y = 5; const hx = [], hy = []; for (let t = 0; t < 400; t++) { const dx = s.k * y - s.a * x + s.g, dy = s.k * x - s.a * y + s.g; x = Math.max(0, x + dx * 0.05); y = Math.max(0, y + dy * 0.05); hx.push(x); hy.push(y); }
        P.clear(); const mx = Math.min(1000, Math.max(20, ...hx)); const { X, Y } = P.chart(0, 400, 0, mx, { noX: true, xl: 'time', yl: 'weapons' }); P.line(hx.map((v, i) => [X(i), Y(Math.min(v, mx))]), '#2563EB', 3); P.line(hy.map((v, i) => [X(i), Y(Math.min(v, mx)) - 3]), '#DC2626', 2);
        out.innerHTML = s.k > s.a ? '<b style="color:#DC2626">Runaway arms race</b>: each side’s reaction is stronger than its restraint.' : `<b style="color:#16A34A">Stable</b>: both settle at about ${(s.g / (s.a - s.k)).toFixed(1)} units.`; };
      P.onResize = run; el.append(K.slider('Reaction to rival’s weapons', 0, 1, 0.01, s.k, (v) => { s.k = v; run(); }), K.slider('Restraint (economic burden, fatigue)', 0, 1, 0.01, s.a, (v) => { s.a = v; run(); }), K.slider('Baseline grievance / distrust', 0, 5, 0.1, s.g, (v) => { s.g = v; run(); }), out); run();
    } });

  A({ id: 'chicken', d: ['geopolitics', 'math', 'politics', 'psychology'], e: '🐔', t: 'Brinkmanship (game of chicken)', b: 'Two leaders in a standoff. Backing down is humiliating; neither backing down is catastrophic.',
    how: 'In chicken, your best move depends on what you think the other will do. Thomas Schelling (Nobel 2005) showed it can pay to commit visibly (throwing away the steering wheel) or seem slightly irrational. The danger is that both sides try it. The Cuban Missile Crisis (1962) ended with a public Soviet withdrawal and a secret US promise to remove missiles from Turkey.',
    use: 'Nuclear deterrence, trade wars, government shutdowns and debt-ceiling standoffs, strikes and labor negotiations.',
    m(el, K) {
      const pay = { SS: [-100, -100], SY: [10, -10], YS: [-10, 10], YY: [0, 0] }; let opp = 0.5, score = 0, n = 0; const out = h('div', { class: 'small' });
      const play = (me) => { const them = Math.random() < opp ? 'S' : 'Y'; const [a] = pay[me + them]; score += a; n++; out.innerHTML = `You ${me === 'S' ? 'held firm' : 'backed down'}; they ${them === 'S' ? 'held firm' : 'backed down'}. ${me + them === 'SS' ? '<b style="color:#DC2626">Catastrophe.</b>' : ''} Your payoff ${a}. Total ${score} after ${n} crises.`; };
      el.append(h('table', { class: 'small', style: { borderCollapse: 'collapse', margin: '6px 0' } }, h('tr', null, h('th'), h('th', { style: { padding: '4px 10px' } }, 'They hold firm'), h('th', { style: { padding: '4px 10px' } }, 'They back down')), h('tr', null, h('th', null, 'You hold firm'), h('td', { style: { textAlign: 'center' } }, '−100 / −100'), h('td', { style: { textAlign: 'center' } }, '+10 / −10')), h('tr', null, h('th', null, 'You back down'), h('td', { style: { textAlign: 'center' } }, '−10 / +10'), h('td', { style: { textAlign: 'center' } }, '0 / 0'))),
        K.slider('How reckless is your opponent (chance they hold firm)', 0, 1, 0.05, opp, (v) => (opp = v), (v) => Math.round(v * 100) + '%'), h('div', { class: 'row' }, K.btn('Hold firm', () => play('S'), true), K.btn('Back down', () => play('Y'))), out,
        h('p', { class: 'tiny muted' }, 'Mixed strategy equilibrium here: hold firm about 9% of the time. The more reckless they seem, the more you should yield, which is why leaders try to look committed.'));
    } });

  A({ id: 'mercator', d: ['geopolitics', 'math', 'earthspace'], e: '🗺️', t: 'Map projections lie', b: 'Greenland looks as big as Africa on many maps. Drag a country’s latitude and see its true size.',
    how: 'You can’t flatten a sphere without distortion. Mercator’s 1569 projection keeps angles (great for navigation) but stretches areas by 1/cos²(latitude): near the poles, enormously. Africa is about 14 times larger than Greenland. Equal-area projections (Gall-Peters, Equal Earth) fix area but distort shapes.',
    use: 'How we perceive the size and importance of regions, navigation, web maps (Google Maps uses Web Mercator), and debates about Eurocentric world maps.',
    m(el, K) {
      const P = K.canvas(el, 280); let lat = 72; const out = K.out(); const C = [['Greenland', 2.17], ['Africa', 30.37], ['Russia', 17.1], ['Brazil', 8.5], ['India', 3.29], ['United States', 9.83], ['Alaska', 1.72]];
      const draw = () => { P.clear(); const s = 1 / Math.cos((lat * Math.PI) / 180) ** 2; const base = 40; const r = (a) => base * Math.sqrt(a / 2.17); P.ctx.fillStyle = '#16A34A88'; P.ctx.beginPath(); P.ctx.arc(P.W * 0.25, P.H / 2, r(2.17), 0, 7); P.ctx.fill(); P.text('Greenland true size', P.W * 0.25, P.H / 2 + r(2.17) + 16, { a: 'center', s: 11 });
        P.ctx.fillStyle = '#DC262644'; P.ctx.beginPath(); P.ctx.arc(P.W * 0.25, P.H / 2, Math.min(P.H / 2 - 5, r(2.17) * Math.sqrt(s)), 0, 7); P.ctx.fill(); P.ctx.fillStyle = '#CA8A0488'; P.ctx.beginPath(); P.ctx.arc(P.W * 0.7, P.H / 2, Math.min(P.H / 2 - 5, r(30.37)), 0, 7); P.ctx.fill(); P.text('Africa (true size)', P.W * 0.7, P.H / 2 + 4, { a: 'center', w: 700 });
        out.innerHTML = `At ${lat}° latitude Mercator inflates area <b>${s.toFixed(1)}×</b>. Greenland (red) looks ${(2.17 * s).toFixed(1)} million km² — Africa is really ${(30.37).toFixed(1)} million km².`; };
      P.onResize = draw; el.append(K.slider('Latitude of the country', 0, 85, 1, lat, (v) => { lat = v; draw(); }), out, bars(C.map(([n, a]) => [n, a, '#16A34A']), 32, (v) => v + ' M km²')); draw();
    } });

  A({ id: 'demotransition', d: ['geopolitics', 'sociology', 'economics', 'medicine'], e: '👶', t: 'Demographic transition', b: 'Death rates fall, then birth rates fall. Watch a population pyramid change shape over 150 years.',
    how: 'As countries get cleaner water, vaccines and food, deaths fall first, so population booms. Later, with urbanization, women’s education and contraception, births fall too. Europe went through this from about 1750–1950; many countries are now doing it much faster. With fertility below 2.1, populations eventually age and shrink.',
    use: 'Pension systems, labor shortages, military recruitment, China’s and Japan’s aging, Africa’s youth boom, immigration debates and long-run economic growth.',
    m(el, K) {
      const P = K.canvas(el, 320); let yr = 0, run = true; const out = K.out(); let pop;
      const reset = () => { pop = Array.from({ length: 21 }, (_, i) => 100 * Math.exp(-i * 0.18)); yr = 0; };
      const rates = (y) => { const death = 1 - Math.min(0.9, y / 90) * 0.85; const birth = y < 50 ? 1 : Math.max(0.3, 1 - (y - 50) / 70); return { death, birth }; };
      el.append(h('div', { class: 'row' }, K.btn('⏯ Pause', () => (run = !run)), K.btn('Restart', reset)), out); reset();
      K.every(120, () => { if (!run || yr >= 150) return; yr++; const { death, birth } = rates(yr); const n = pop.slice(); for (let i = 20; i > 0; i--) n[i] = pop[i - 1] * (1 - (i > 13 ? 0.1 + (i - 13) * 0.05 : 0.04 * death) * (i > 13 ? 1 : 1)) * 0.2 + pop[i] * 0.8 * (1 - (i > 13 ? (0.1 + (i - 13) * 0.05) * death : 0.01 * death)); n[0] = pop.slice(4, 9).reduce((a, b) => a + b, 0) * 0.09 * birth + pop[0] * 0.8 * (1 - 0.05 * death); pop = n;
        P.clear(); const mx = Math.max(...pop); const bh = (P.H - 20) / 21; pop.forEach((v, i) => { const w = (v / mx) * (P.W / 2 - 40); P.rect(P.W / 2 - w, P.H - 10 - (i + 1) * bh, w, bh - 2, '#2563EB'); P.rect(P.W / 2, P.H - 10 - (i + 1) * bh, w, bh - 2, '#DB2777'); if (i % 4 === 0) P.text(i * 5 + '', 4, P.H - 10 - i * bh - 3, { s: 10, c: K.css('--muted') }); });
        const r = rates(yr); out.innerHTML = `Year ${yr} · death rate index ${(r.death * 100).toFixed(0)} · birth rate index ${(r.birth * 100).toFixed(0)} · stage: <b>${yr < 15 ? '1: high births, high deaths' : yr < 50 ? '2: deaths fall, population booms' : yr < 110 ? '3: births fall too' : '4: low births, low deaths, aging'}</b>`; });
    } });

  // ======================= PSYCHOLOGY =======================
  A({ id: 'reaction', d: ['psychology', 'biology', 'medicine'], e: '⚡', t: 'Reaction time test', b: 'Click as soon as the box turns green. How fast is your nervous system?',
    how: 'Simple visual reaction time averages about 200–250 ms: light hits the retina, signals travel the optic nerve to the visual cortex, a decision is made, and a command travels down to your hand. Franciscus Donders (1868) used reaction-time differences to measure the time of mental steps, founding mental chronometry.',
    use: 'Driving safety (it takes over a second to react and brake), sports, aviation, measuring fatigue, alcohol and concussion effects, and video game design.',
    m(el, K) {
      let state = 'idle', t0 = 0, timer = null; const times = []; const box = h('div', { style: { height: '200px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, cursor: 'pointer', userSelect: 'none', color: '#fff', background: '#2563EB' } }, 'Click to start'); const out = K.out();
      const set = (bg, t) => { box.style.background = bg; box.textContent = t; };
      box.onpointerdown = () => { if (state === 'idle' || state === 'done') { state = 'wait'; set('#DC2626', 'Wait for green…'); timer = setTimeout(() => { state = 'go'; t0 = performance.now(); set('#16A34A', 'CLICK!'); }, K.rnd(1200, 3500)); } else if (state === 'wait') { clearTimeout(timer); state = 'done'; set('#CA8A04', 'Too soon! Click to try again'); } else if (state === 'go') { const rt = performance.now() - t0; times.push(rt); state = 'done'; set('#2563EB', `${rt.toFixed(0)} ms — click to go again`); const avg = times.reduce((a, b) => a + b, 0) / times.length; out.innerHTML = `Tries: ${times.length} · average <b>${avg.toFixed(0)} ms</b> · best ${Math.min(...times).toFixed(0)} ms. At 65 mph (105 km/h) your average reaction alone covers ${((avg / 1000) * 29).toFixed(1)} m before your foot moves.`; } };
      K.stops.push(() => clearTimeout(timer)); el.append(box, out);
    } });

  A({ id: 'anchoring', d: ['psychology', 'economics', 'law'], e: '⚓', t: 'Anchoring bias', b: 'A random number shouldn’t change your estimate. Try it and see if it does.',
    how: 'Tversky and Kahneman (1974) spun a rigged wheel (landing on 10 or 65), then asked people the percentage of African countries in the UN. Those who saw 65 guessed much higher on average (45% vs 25%). Irrelevant numbers anchor our estimates; we adjust away from them, but not enough.',
    use: 'Negotiation (the first offer anchors), retail “was $200, now $99” pricing, salary negotiations, and judges’ sentencing (studies found prosecutors’ demands and even dice rolls influence sentences).',
    m(el, K) {
      const Qs = [['How many countries are in Africa?', 54], ['How tall is the Eiffel Tower in meters?', 330], ['In what year was the first telephone patented?', 1876], ['How many bones in the adult human body?', 206]]; let i = 0, anchor; const log = []; const box = h('div'); const res = h('div', { class: 'small' });
      const ask = () => { if (i >= Qs.length) { const hi = log.filter((x) => x.high), lo = log.filter((x) => !x.high); res.innerHTML = `Your answers: ${log.map((x) => `${x.q.slice(0, 30)}…: ${x.a} (anchor ${x.anchor}, true ${x.truth})`).join('<br>')}<br><br>Did your estimates drift toward the random anchor? Across thousands of people they do: the effect is one of the most replicated in psychology.`; box.innerHTML = ''; return; }
        const [q, t] = Qs[i]; const high = Math.random() < 0.5; anchor = Math.round(high ? t * K.rnd(1.6, 2.4) : t * K.rnd(0.3, 0.6)); const inp = h('input', { type: 'number', style: { width: '120px' } });
        box.innerHTML = ''; box.append(h('p', null, `🎡 The wheel landed on `, h('b', null, anchor), '.'), h('p', null, `Is the answer higher or lower than ${anchor}? Then give your best estimate:`), h('p', null, h('b', null, q)), h('div', { class: 'row' }, inp, K.btn('Submit', () => { log.push({ q, a: +inp.value, anchor, truth: t, high }); i++; ask(); }, true))); };
      el.append(box, res); ask();
    } });

  A({ id: 'digitspan', d: ['psychology', 'biology', 'medicine'], e: '🔢', t: 'Working memory span', b: 'Remember a growing string of digits. Most people top out around 7.',
    how: 'George Miller’s famous 1956 paper “The Magical Number Seven, Plus or Minus Two” described the limits of short-term memory. Later work (Nelson Cowan, 2001) suggests about 4 chunks; we stretch it by chunking (phone numbers in groups of 3–4).',
    use: 'Phone numbers and PINs, interface design (don’t ask people to remember much), learning techniques, IQ tests, and assessing brain injury and dementia.',
    m(el, K) {
      let len = 3, seq = '', best = 0; const show = h('div', { style: { fontSize: '44px', fontWeight: 800, letterSpacing: '8px', textAlign: 'center', height: '70px' } }); const inp = h('input', { type: 'text', inputmode: 'numeric', style: { width: '220px', fontSize: '20px' } }); const out = K.out(); let tm = null;
      const start = () => { seq = Array.from({ length: len }, () => K.ri(0, 9)).join(''); show.textContent = seq; inp.value = ''; clearTimeout(tm); tm = setTimeout(() => { show.textContent = '•'.repeat(len); inp.focus(); }, 900 + len * 450); };
      const check = () => { if (inp.value === seq) { best = Math.max(best, len); out.innerHTML = `✓ Correct! Span ${len}. Next: ${len + 1} digits.`; len++; } else { out.innerHTML = `✗ It was ${seq}. Your best: <b>${best}</b> digits.`; len = Math.max(3, len - 1); } start(); };
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); }; K.stops.push(() => clearTimeout(tm));
      el.append(show, h('div', { class: 'row', style: { justifyContent: 'center' } }, inp, K.btn('Check', check, true), K.btn('Start', start)), out);
    } });

  A({ id: 'stroop', d: ['psychology', 'linguistics'], e: '🎨', t: 'The Stroop effect', b: 'Name the ink color, not the word. Your reading brain fights you.',
    how: 'J. Ridley Stroop (1935) found people are slower to name ink colors when the word names a different color. Reading is so automatic it interferes with the task. It is a classic measure of attention and self-control.',
    use: 'Testing executive function, ADHD and brain injury assessment, lie-detection research, and understanding how practice makes skills automatic.',
    m(el, K) {
      const C = [['RED', '#DC2626'], ['BLUE', '#2563EB'], ['GREEN', '#16A34A'], ['YELLOW', '#CA8A04']]; let cur, t0, mode = 'mixed'; const res = { same: [], mixed: [] }; const word = h('div', { style: { fontSize: '54px', fontWeight: 900, textAlign: 'center', margin: '20px 0' } }); const out = K.out();
      const next = () => { const w = K.pick(C); const ink = mode === 'same' ? w : K.pick(C.filter((c) => c !== w)); cur = ink[0]; word.textContent = w[0]; word.style.color = ink[1]; t0 = performance.now(); };
      const ans = (c) => { const rt = performance.now() - t0; if (c === cur) res[mode].push(rt); const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(0) + ' ms' : '—'); out.innerHTML = `${c === cur ? '✓' : '✗'} Average: matching words ${avg(res.same)} · mismatched words ${avg(res.mixed)}`; next(); };
      el.append(K.choice([['same', 'Matching (easy)'], ['mixed', 'Mismatched (Stroop)']], mode, (v) => { mode = v; next(); }), h('p', { class: 'small' }, 'Click the INK color:'), word, h('div', { class: 'row', style: { justifyContent: 'center' } }, C.map(([n, c]) => h('button', { class: 'btn', style: { background: c, color: '#fff', minWidth: '90px' }, onclick: () => ans(n) }, n))), out); next();
    } });

  A({ id: 'illusion', d: ['psychology', 'arts', 'biology'], e: '👁️', t: 'Measure an illusion', b: 'Adjust a line until it looks equal to the other. Then see how far off your brain was.',
    how: 'In the Müller-Lyer illusion (1889) a line with outward fins looks longer than an identical line with inward fins. One theory: our visual system reads the fins as corners of rooms, as near or far edges. Studies across cultures (Segall, Campbell & Herskovits, 1966) found the effect varies, possibly with exposure to rectangular buildings, though this is debated.',
    use: 'Art and architecture (Greek temples curved columns to look straight), design, road markings that make drivers slow down, and understanding perception as active interpretation.',
    m(el, K) {
      const P = K.canvas(el, 240); let L2 = 160; const L1 = 200; const out = K.out(); let shown = false;
      const draw = () => { P.clear(); const y1 = P.H * 0.33, y2 = P.H * 0.7, cx = P.W / 2; const fin = (x, y, d) => { P.line([[x, y], [x + d * 20, y - 18]], K.css('--ink'), 3); P.line([[x, y], [x + d * 20, y + 18]], K.css('--ink'), 3); };
        P.line([[cx - L1 / 2, y1], [cx + L1 / 2, y1]], K.css('--ink'), 3); fin(cx - L1 / 2, y1, 1); fin(cx + L1 / 2, y1, -1);
        P.line([[cx - L2 / 2, y2], [cx + L2 / 2, y2]], K.css('--ink'), 3); fin(cx - L2 / 2, y2, -1); fin(cx + L2 / 2, y2, 1);
        if (shown) { P.line([[cx - L1 / 2, 10], [cx - L1 / 2, P.H - 10]], '#DC2626', 1, [4, 4]); P.line([[cx + L1 / 2, 10], [cx + L1 / 2, P.H - 10]], '#DC2626', 1, [4, 4]); } };
      P.onResize = draw; el.append(K.slider('Adjust the bottom line until it looks the same length as the top', 80, 260, 1, L2, (v) => { L2 = v; draw(); }), K.btn('Reveal', () => { shown = true; out.innerHTML = `You set it to ${L2}px; the top line is ${L1}px. Your illusion strength: <b>${(((L1 - L2) / L1) * 100).toFixed(0)}%</b> (typical: 10–30%).`; draw(); }, true), out); draw();
    } });

  A({ id: 'framing', d: ['psychology', 'economics', 'medicine', 'politics'], e: '🖼️', t: 'Framing & loss aversion', b: 'The same choice described as lives saved or lives lost. Does the wording flip your decision?',
    how: 'Tversky and Kahneman’s “Asian disease problem” (1981): when options were framed as lives saved, 72% chose the sure option; framed as deaths, 78% chose the gamble, though the outcomes were identical. Losses loom about twice as large as equal gains (prospect theory; Kahneman’s 2002 Nobel).',
    use: 'Medical decisions (90% survival vs 10% mortality), political messaging, marketing, insurance, investing (holding losers too long), and public health communication.',
    m(el, K) {
      const box = h('div'); let frame = K.pick(['gain', 'loss']); const res = h('div', { class: 'small' });
      const draw = () => { box.innerHTML = ''; const intro = 'A new disease is expected to kill 600 people. Choose a program:'; const opts = frame === 'gain' ? ['Program A: 200 people will be saved.', 'Program B: a 1/3 chance all 600 are saved, 2/3 chance nobody is saved.'] : ['Program C: 400 people will die.', 'Program D: a 1/3 chance nobody dies, 2/3 chance all 600 die.'];
        box.append(h('p', null, intro), ...opts.map((o, i) => h('button', { class: 'btn', style: { display: 'block', width: '100%', textAlign: 'left', margin: '6px 0' }, onclick: () => { res.innerHTML = `You chose the ${i === 0 ? 'sure thing' : 'gamble'} in the “${frame === 'gain' ? 'lives saved' : 'deaths'}” framing. In the original study, 72% chose the sure option when framed as saving lives, but only 22% when framed as deaths. Both programs are mathematically identical in each pair, and A = C, B = D. Try the other framing:`; res.append(K.btn('Show me the other framing', () => { frame = frame === 'gain' ? 'loss' : 'gain'; res.innerHTML = ''; draw(); })); } }, o))); };
      el.append(box, res); draw();
    } });

  A({ id: 'conditioning', d: ['psychology', 'biology', 'economics'], e: '🐀', t: 'Reward schedules', b: 'Train a virtual rat with different reward rules. Why are slot machines so addictive?',
    how: 'B. F. Skinner (1930s–50s) found behavior rewarded unpredictably (variable-ratio schedules) is learned persistently and is hardest to extinguish. Fixed schedules create pauses after each reward. Pavlov (1890s) showed the related classical conditioning with dogs and bells.',
    use: 'Slot machines and loot boxes, social media notifications, training animals, classroom behavior plans, habit formation and addiction research.',
    m(el, K) {
      const P = K.canvas(el, 260); let sched = 'VR', run = true; const S = { FR: 'Fixed ratio: reward every 10th press', VR: 'Variable ratio: reward after random number of presses (avg 10)', FI: 'Fixed interval: first press after 5 s is rewarded', EXT: 'Extinction: no more rewards' }; let presses = [], drive = 0.5, cnt = 0, lastR = 0, nextVR = 10, t = 0; const out = K.out();
      el.append(K.choice(Object.keys(S).map((k) => [k, k]), sched, (v) => { sched = v; }), out);
      K.every(50, () => { if (!run) return; t += 0.05; let press = false; const since = t - lastR; const rate = sched === 'FI' ? drive * (since > 3.5 ? 1 : 0.15) : sched === 'FR' ? drive * (cnt < 2 ? 0.3 : 1) : drive; if (Math.random() < rate * 0.6) { press = true; cnt++; } let rew = false;
        if (press) { if (sched === 'FR' && cnt >= 10) rew = true; if (sched === 'VR' && cnt >= nextVR) { rew = true; nextVR = K.ri(1, 19); } if (sched === 'FI' && since >= 5) rew = true; }
        if (rew) { cnt = 0; lastR = t; drive = Math.min(1, drive + 0.05); } else if (press && sched === 'EXT') drive = Math.max(0, drive - 0.004); presses.push([press, rew]); if (presses.length > 400) presses.shift();
        P.clear(); let c = 0; const pts = presses.map(([p], i) => [i * (P.W / 400), P.H - 10 - (c += p ? 1 : 0) * ((P.H - 20) / 200)]); P.line(pts, '#2563EB', 2); presses.forEach(([, r], i) => r && P.rect(i * (P.W / 400), pts[i][1] - 6, 2, 12, '#DC2626'));
        out.innerHTML = `${S[sched]} · motivation ${(drive * 100).toFixed(0)}% · line = cumulative presses, red ticks = rewards`; });
    } });

  A({ id: 'weber', d: ['psychology', 'physics', 'math', 'arts'], e: '⚖️', t: 'Weber’s law: noticing differences', b: 'Which circle is bigger? The smallest difference you can notice grows with the size of what you compare.',
    how: 'Ernst Weber (1834) and Gustav Fechner (1860) found the just-noticeable difference is a constant fraction of the stimulus (about 2–3% for weights, roughly 8–10% for areas). So perception works on ratios, like a logarithm: going from 1 to 2 candles feels like 10 to 20.',
    use: 'Why decibels and the Richter scale are logarithmic, pricing ($9.99 vs $10), sound engineering, and the psychology of money (an extra $100 matters less to a rich person).',
    m(el, K) {
      const P = K.canvas(el, 240); let diff = 20, base, bigger, score = 0, n = 0; const out = K.out();
      const next = () => { base = K.rnd(20, 50); bigger = Math.random() < 0.5 ? 0 : 1; draw(); };
      const draw = () => { P.clear(); const r = [base, base * Math.sqrt(1 + diff / 100)]; if (bigger === 0) r.reverse(); P.dot(P.W * 0.3, P.H / 2, r[0], '#2563EB'); P.dot(P.W * 0.7, P.H / 2, r[1], '#2563EB'); };
      const ans = (i) => { n++; const ok = i === (bigger === 0 ? 0 : 1); if (ok) { score++; diff = Math.max(1, diff * 0.8); } else diff = Math.min(60, diff * 1.4); out.innerHTML = `${ok ? '✓' : '✗'} Difference now ${diff.toFixed(1)}% in area. Your threshold is about where this settles.`; next(); };
      P.onResize = draw; el.append(h('div', { class: 'row', style: { justifyContent: 'center' } }, K.btn('◀ Left is bigger', () => ans(0), true), K.btn('Right is bigger ▶', () => ans(1), true)), out); next();
    } });

  // ======================= SOCIOLOGY =======================
  A({ id: 'schelling', d: ['sociology', 'economics', 'computing', 'politics'], e: '🏘️', t: 'Schelling’s segregation model', b: 'Even mild preferences to live near similar neighbors can produce strongly segregated neighborhoods.',
    how: 'Thomas Schelling (1971) used coins on a checkerboard: agents move if fewer than a threshold share of neighbors are like them. Even a 33% preference produces highly segregated patterns. It shows macro outcomes don’t require extreme individual attitudes. It is not a full explanation of real segregation, which was also driven by laws and policies like redlining and restrictive covenants.',
    use: 'Urban sociology, housing policy, school segregation, and as a founding example of agent-based modeling.',
    m(el, K) {
      const N = 40; let g, thr = 0.34, run = true, moves = 0; const P = K.canvas(el, 360); const out = K.out();
      const reset = () => { g = Array.from({ length: N * N }, () => { const r = Math.random(); return r < 0.45 ? 1 : r < 0.9 ? 2 : 0; }); moves = 0; };
      const unhappy = (i) => { const x = i % N, y = Math.floor(i / N); let same = 0, tot = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; const v = g[ny * N + nx]; if (v) { tot++; if (v === g[i]) same++; } } return tot && same / tot < thr; };
      const segIdx = () => { let s = 0, t = 0; g.forEach((v, i) => { if (!v) return; const x = i % N, y = Math.floor(i / N); for (const [dx, dy] of [[1, 0], [0, 1]]) { const nx = x + dx, ny = y + dy; if (nx < N && ny < N && g[ny * N + nx]) { t++; if (g[ny * N + nx] === v) s++; } } }); return s / t; };
      el.append(K.slider('Minimum share of similar neighbors each person wants', 0, 0.8, 0.01, thr, (v) => (thr = v), (v) => Math.round(v * 100) + '%'), h('div', { class: 'row' }, K.btn('⏯ Pause', () => (run = !run)), K.btn('Restart', reset)), out); reset();
      K.every(80, () => { if (run) { const empty = g.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0); let m = 0; Lab.shuffle(g.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).slice(0, 150).forEach((i) => { if (g[i] && unhappy(i) && empty.length) { const k = K.ri(0, empty.length - 1); const j = empty[k]; g[j] = g[i]; g[i] = 0; empty[k] = i; m++; } }); moves += m; }
        P.clear(); const s = Math.min(P.W, P.H) / N, ox = (P.W - s * N) / 2; g.forEach((v, i) => v && P.rect(ox + (i % N) * s, Math.floor(i / N) * s, s - 1, s - 1, v === 1 ? '#2563EB' : '#CA8A04')); const un = g.filter((v, i) => v && unhappy(i)).length;
        out.innerHTML = `Similar neighbors on average: <b>${(segIdx() * 100).toFixed(0)}%</b> (random mixing ≈ 50%) · unhappy households: ${un} · moves: ${moves}`; });
    } });

  A({ id: 'smallworld', d: ['sociology', 'math', 'computing', 'medicine'], e: '🕸️', t: 'Six degrees: small-world networks', b: 'A ring of friends where everyone knows only neighbors. Add a few random long links and distances collapse.',
    how: 'Stanley Milgram’s 1967 letter-passing experiment suggested about six steps link strangers in the US. Watts and Strogatz (1998) showed why: a few random shortcuts in a mostly local network dramatically shrink average distances while keeping friend groups clustered. Facebook measured an average of about 3.6 degrees between its users in 2016.',
    use: 'How diseases, rumors and job information spread (Granovetter’s “strength of weak ties”, 1973), network design, epidemics and influencer marketing.',
    m(el, K) {
      const N = 60; let p = 0, edges; const P = K.canvas(el, 380); const out = K.out();
      const build = () => { edges = []; for (let i = 0; i < N; i++) for (const k of [1, 2]) { let j = (i + k) % N; if (Math.random() < p) { do j = K.ri(0, N - 1); while (j === i); } edges.push([i, j]); } draw(); };
      const avgDist = () => { const adj = Array.from({ length: N }, () => []); edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); }); let tot = 0, cnt = 0; for (let s = 0; s < N; s++) { const d = Array(N).fill(-1); d[s] = 0; const q = [s]; while (q.length) { const u = q.shift(); adj[u].forEach((v) => { if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); } }); } d.forEach((x) => { if (x > 0) { tot += x; cnt++; } }); } return tot / cnt; };
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, R = Math.min(cx, cy) - 20; const pos = (i) => [cx + R * Math.cos((i / N) * 6.283), cy + R * Math.sin((i / N) * 6.283)]; edges.forEach(([a, b]) => { const long = Math.min(Math.abs(a - b), N - Math.abs(a - b)) > 2; P.line([pos(a), pos(b)], long ? '#DC2626' : '#94A3B8', long ? 1.5 : 1); }); for (let i = 0; i < N; i++) P.dot(...pos(i), 4, '#2563EB');
        out.innerHTML = `Average steps between any two people: <b>${avgDist().toFixed(2)}</b> · long-range links (red): ${edges.filter(([a, b]) => Math.min(Math.abs(a - b), N - Math.abs(a - b)) > 2).length}`; };
      P.onResize = () => edges && draw(); el.append(K.slider('Chance each link is rewired to a random person', 0, 0.5, 0.01, p, (v) => { p = v; build(); }), K.btn('Rewire again', build), out); build();
    } });

  A({ id: 'threshold', d: ['sociology', 'politics', 'psychology', 'history'], e: '✊', t: 'When do protests explode?', b: 'Everyone joins a riot once enough others have. Change one person’s threshold and the whole outcome flips.',
    how: 'Mark Granovetter (1978): each person has a threshold, the number of others who must act before they join. With thresholds 0, 1, 2, … 99, one instigator triggers everyone. Change a single person from 1 to 2 and nothing happens. The same crowd with almost the same attitudes can produce a revolution or nothing.',
    use: 'Why revolutions surprise experts (1989 in Eastern Europe, the 2011 Arab Spring), fashion and technology adoption, bank runs and viral content.',
    m(el, K) {
      let spread = 0, mean = 25; const P = K.canvas(el, 260); const out = K.out();
      const run = () => { const N = 100; const th = Array.from({ length: N }, (_, i) => (spread === 0 ? i : Math.max(0, Math.round(mean + K.gauss() * spread)))); let act = 0, hist = [0]; for (let t = 0; t < 100; t++) { const n = th.filter((x) => x <= act).length; hist.push(n); if (n === act) break; act = n; }
        P.clear(); const { X, Y } = P.chart(0, Math.max(5, hist.length - 1), 0, 100, { xl: 'rounds', yl: 'people acting' }); P.line(hist.map((v, i) => [X(i), Y(v)]), '#DC2626', 3); out.innerHTML = `Final: <b>${hist[hist.length - 1]}</b> of 100 people join.`; };
      P.onResize = run; el.append(K.choice([[0, 'Thresholds 0,1,2…99 (Granovetter)'], [1, 'Change person #1 to threshold 2'], [10, 'Random thresholds']], 0, (v) => { if (v === 1) { const N = 100; const th = Array.from({ length: N }, (_, i) => (i === 1 ? 2 : i)); let act = 0, hist = [0]; for (let t = 0; t < 100; t++) { const n = th.filter((x) => x <= act).length; hist.push(n); if (n === act) break; act = n; } P.clear(); const { X, Y } = P.chart(0, 5, 0, 100, { xl: 'rounds' }); P.line(hist.map((x, i) => [X(i), Y(x)]), '#DC2626', 3); out.innerHTML = `Final: <b>${hist[hist.length - 1]}</b> of 100 join. One person’s change stopped the cascade.`; } else { spread = v; run(); } }), K.slider('Average threshold (random mode)', 0, 60, 1, mean, (v) => { mean = v; spread = 10; run(); }), out); run();
    } });

  A({ id: 'mobility', d: ['sociology', 'economics', 'politics'], e: '🪜', t: 'Social mobility ladder', b: 'How likely is a child born in the bottom fifth to reach the top? Compare a sticky society with a fluid one.',
    how: 'Mobility matrices give the chance a child ends up in each income fifth given their parents’. Raj Chetty’s team (2014) found a US child born in the bottom fifth has about a 7.5% chance of reaching the top fifth, varying from about 4% to 13% by region. Over generations, low mobility locks in advantage.',
    use: 'Debates about equality of opportunity versus outcome, education policy, inheritance taxes, and where to live.',
    m(el, K) {
      let stick = 0.3; const box = h('div');
      const draw = () => { const M = [0, 1, 2, 3, 4].map((i) => [0, 1, 2, 3, 4].map((j) => { const w = Math.exp(-((i - j) ** 2) * (1 / (0.5 + (1 - stick) * 6))); return w; })).map((r) => { const s = r.reduce((a, b) => a + b, 0); return r.map((x) => x / s); });
        let gen = [1, 0, 0, 0, 0]; const gens = [gen]; for (let g = 0; g < 4; g++) { gen = [0, 1, 2, 3, 4].map((j) => gen.reduce((a, p, i) => a + p * M[i][j], 0)); gens.push(gen); }
        box.innerHTML = `<p class="small">Chance a child born in the <b>bottom fifth</b> reaches the top fifth: <b>${(M[0][4] * 100).toFixed(1)}%</b> (US estimate ≈ 7.5%; perfect mobility = 20%)</p>` + gens.map((g, k) => `<div class="row" style="flex-wrap:nowrap;margin:4px 0"><span class="small" style="width:120px">${k ? 'Grandchild '.repeat(0) + 'Generation ' + k : 'Starting family'}</span>${g.map((p, i) => `<div title="${['Bottom', '2nd', 'Middle', '4th', 'Top'][i]} fifth" style="flex:1;height:26px;background:rgba(37,99,235,${0.1 + p * 0.9});color:${p > 0.4 ? '#fff' : 'inherit'};font-size:11px;text-align:center;line-height:26px">${(p * 100).toFixed(0)}%</div>`).join('')}</div>`).join('') + '<p class="tiny muted">Columns: bottom fifth → top fifth.</p>'; };
      el.append(K.slider('How “sticky” is the society (0 = fluid, 1 = rigid)', 0, 1, 0.01, stick, (v) => { stick = v; draw(); }), box); draw();
    } });

  A({ id: 'adoption', d: ['sociology', 'economics', 'computing', 'history'], e: '📱', t: 'How new things spread (S-curves)', b: 'Innovators, then imitators. Model how phones, ideas and fashions take off and saturate.',
    how: 'Frank Bass (1969) modeled adoption with two forces: innovation (people trying it independently) and imitation (copying adopters). The result is an S-curve. Everett Rogers (1962) named the groups: innovators, early adopters, early majority, late majority, laggards.',
    use: 'Forecasting sales, technology adoption (it took the telephone decades to reach half of US households; smartphones about 6 years), vaccine uptake, and the spread of social movements.',
    m(el, K) {
      const P = K.canvas(el, 280); const s = { p: 0.01, q: 0.4 }; const out = K.out();
      const draw = () => { let F = 0; const cum = [0], nw = [0]; for (let t = 1; t <= 40; t++) { const f = (s.p + s.q * F) * (1 - F); F += f; cum.push(F); nw.push(f); } P.clear(); const { X, Y } = P.chart(0, 40, 0, 1, { xl: 'years', fy: (v) => Math.round(v * 100) + '%' }); P.line(cum.map((v, i) => [X(i), Y(v)]), '#2563EB', 3); const mx = Math.max(...nw); P.line(nw.map((v, i) => [X(i), Y((v / mx) * 0.5)]), '#DC2626', 2, [5, 4]);
        const half = cum.findIndex((v) => v >= 0.5); out.innerHTML = `<span style="color:#2563EB">Total adopters</span> · <span style="color:#DC2626">new adopters per year (scaled)</span> · reaches 50% in year <b>${half < 0 ? '>40' : half}</b>`; };
      P.onResize = draw; el.append(K.slider('Innovation (try it on their own)', 0.001, 0.1, 0.001, s.p, (v) => { s.p = v; draw(); }), K.slider('Imitation (copy others)', 0, 1, 0.01, s.q, (v) => { s.q = v; draw(); }), out); draw();
    } });

  // ======================= ANTHROPOLOGY =======================
  A({ id: 'outofafrica', d: ['anthropology', 'history', 'biology', 'earthspace'], e: '🌍', t: 'Peopling the planet', b: 'Follow modern humans out of Africa. Slide through 300,000 years of migration.',
    how: 'Fossils (Jebel Irhoud, Morocco, about 300,000 years old) and genetics indicate Homo sapiens arose in Africa and spread across the world, mostly after about 60,000–70,000 years ago, mixing with Neanderthals and Denisovans along the way. Dates for the Americas are actively debated (footprints in New Mexico suggest about 21,000–23,000 years ago).',
    use: 'Understanding human diversity (most genetic diversity is within Africa), population history, the deep history of Indigenous peoples, and how ancient DNA is rewriting prehistory.',
    m(el, K) {
      const R = [[300, 'Africa', 0.53, 0.55, 'Earliest Homo sapiens fossils (Jebel Irhoud, Morocco)'], [180, 'Levant', 0.58, 0.38, 'Early, possibly short-lived ventures out (Misliya, Israel)'], [65, 'Arabia & South Asia', 0.66, 0.45, 'Main dispersal begins'], [50, 'Australia', 0.86, 0.72, 'Arrival in Sahul (Australia–New Guinea), 50,000–65,000 years ago (debated)'], [45, 'Europe', 0.52, 0.28, 'Modern humans enter Europe; Neanderthals vanish by ~40,000 years ago'], [40, 'East Asia', 0.8, 0.38, 'Spread across East Asia'], [22, 'Americas', 0.22, 0.38, 'Earliest accepted evidence (White Sands footprints, debated)'], [15, 'South America', 0.3, 0.7, 'Monte Verde, Chile ~14,500 years ago'], [3, 'Remote Pacific', 0.95, 0.6, 'Polynesian voyagers settle the Pacific; Aotearoa/New Zealand ~1250–1300 AD']];
      const P = K.canvas(el, 340); let kya = 300; const out = K.out();
      const draw = () => { P.clear(); const W = P.W, H = P.H; P.rect(0, 0, W, H, '#0EA5E918'); const reached = R.filter((r) => r[0] >= kya); for (let i = 1; i < reached.length; i++) { const a = R[0], b = reached[i]; P.line([[a[2] * W, a[3] * H], [b[2] * W, b[3] * H]], '#DC262688', 2, [6, 4]); }
        R.forEach(([y, n, x, yy]) => { const on = y >= kya; P.dot(x * W, yy * H, on ? 9 : 5, on ? '#DC2626' : '#94A3B8'); P.text(n, x * W + 10, yy * H + 4, { s: 11, c: on ? K.css('--ink') : K.css('--muted') }); });
        const last = reached[reached.length - 1]; out.innerHTML = `<b>${kya.toLocaleString()} thousand years ago</b> · latest arrival: ${last[1]} — ${last[4]}`; };
      P.onResize = draw; el.append(K.slider('Thousands of years ago', 1, 300, 1, kya, (v) => { kya = v; draw(); }), out, h('p', { class: 'tiny muted' }, 'Schematic positions, not a real map. Dates are approximate and several are actively debated.')); draw();
    } });

  A({ id: 'telephone', d: ['anthropology', 'linguistics', 'psychology', 'history'], e: '🗣️', t: 'Cultural transmission chain', b: 'Pass a story through 10 retellings. See which details survive and which drift.',
    how: 'Frederic Bartlett (1932) had people retell a Native American folk tale, “The War of the Ghosts.” With each retelling it got shorter and reshaped to fit the tellers’ own culture. Later studies show emotional, social and surprising-but-not-too-strange details survive best, a key idea in cultural evolution.',
    use: 'How myths, rumors and oral histories change, why some news spreads, memory in eyewitness testimony, and how oral traditions sometimes preserve real events for centuries.',
    m(el, K) {
      const src = 'At dawn the fisherman Kalani paddled past the red cliffs, where his grandmother said a sea turtle once saved a drowning child. Near the reef he found a broken bottle holding a map with seven islands, and he gave it to the village chief, who argued with the priest about whether to sail.';
      const box = h('div'); const out = K.out();
      const retell = (s) => { let w = s.split(' '); w = w.filter((x, i) => Math.random() > 0.08 || /turtle|child|chief|map|grandmother/i.test(x)); const swaps = [['seven', 'many'], ['red', 'tall'], ['bottle', 'jar'], ['dawn', 'morning'], ['argued', 'talked'], ['priest', 'elder'], ['broken', 'old'], ['Kalani', 'a young man'], ['reef', 'shore']]; swaps.forEach(([a, b]) => { if (Math.random() < 0.18) w = w.map((x) => x.replace(new RegExp('^' + a, 'i'), b)); }); return w.join(' '); };
      const run = () => { box.innerHTML = ''; let s = src; box.append(h('p', { class: 'small' }, h('b', null, 'Original: '), s)); for (let i = 1; i <= 10; i++) { s = retell(s); if (i % 2 === 0) box.append(h('p', { class: 'small' }, h('b', null, `After ${i} retellings: `), s)); } out.textContent = 'Simulated drift: the emotional core (child saved, chief, map) is protected; numbers, names and colors drift or vanish.'; };
      el.append(K.btn('Run the chain', run, true), box, out); run();
    } });

  A({ id: 'dunbar', d: ['anthropology', 'psychology', 'biology', 'sociology'], e: '👥', t: 'How many relationships can you keep?', b: 'Fill in your own circles of closeness and compare with Dunbar’s layers: 5, 15, 50, 150.',
    how: 'Robin Dunbar (1992) linked primate brain size to group size and predicted humans can maintain about 150 stable relationships, in layers of roughly 5, 15, 50 and 150. Hunter-gatherer bands, army companies and village sizes often cluster near these numbers. A 2021 reanalysis argued the confidence interval is so wide the number is uncertain.',
    use: 'Organizational design (Gore-Tex kept factories under about 150 people), military units, online communities, and thinking about your own social life.',
    m(el, K) {
      const L = [['People you’d call in a crisis', 5], ['Close friends', 15], ['Good friends', 50], ['Meaningful contacts', 150]]; const vals = [3, 10, 30, 100]; const P = K.canvas(el, 300); const out = K.out(); const sl = [];
      const draw = () => { P.clear(); const cx = P.W / 2, cy = P.H / 2, R = P.H / 2 - 10; [...L].reverse().forEach(([, n], k) => { const i = 3 - k; P.ctx.strokeStyle = '#94A3B8'; P.ctx.setLineDash([4, 4]); P.ctx.beginPath(); P.ctx.arc(cx, cy, (R * (i + 1)) / 4, 0, 7); P.ctx.stroke(); P.ctx.setLineDash([]); P.ctx.fillStyle = K.pal[i] + '44'; P.ctx.beginPath(); P.ctx.arc(cx, cy, ((R * (i + 1)) / 4) * Math.min(1.2, Math.sqrt(vals[i] / n)), 0, 7); P.ctx.fill(); P.text(`${n}`, cx + (R * (i + 1)) / 4 - 14, cy - 4, { s: 11, c: K.css('--muted') }); });
        out.textContent = 'Shaded = your numbers; dashed = Dunbar’s typical layers. There is no right answer; this is for reflection.'; };
      L.forEach(([l, n], i) => sl.push(K.slider(l, 0, n * 2, 1, vals[i], (v) => { vals[i] = v; draw(); })));
      P.onResize = draw; el.append(h('div', { class: 'grid g2' }, ...sl), out); draw();
    } });

  // ======================= LAW =======================
  A({ id: 'blackstone', d: ['law', 'statistics', 'ethics', 'philosophy'], e: '⚖️', t: 'Blackstone’s ratio', b: '“Better that ten guilty go free than one innocent suffer.” Set the standard of proof and count the errors.',
    how: 'William Blackstone (1769) argued it is better that ten guilty persons escape than one innocent suffers. Any standard of proof trades false convictions against false acquittals; “beyond reasonable doubt” sets the bar high. Since 1989 the US National Registry of Exonerations has recorded thousands of people later found wrongly convicted.',
    use: 'Criminal vs civil standards of proof, plea bargaining, forensic evidence, medical tests and spam filters (all have the same trade-off).',
    m(el, K) {
      const P = K.canvas(el, 280); let bar = 0.8, guiltyShare = 0.6; const out = K.out();
      const draw = () => { P.clear(); const N = 10000; let fc = 0, fa = 0, tc = 0; for (let i = 0; i < N; i++) { const g = Math.random() < guiltyShare; const ev = Lab.clamp((g ? 0.72 : 0.38) + K.gauss() * 0.15, 0, 1); const conv = ev >= bar; if (conv && !g) fc++; if (!conv && g) fa++; if (conv && g) tc++; }
        const { X, Y } = P.chart(0, 1, 0, 1, { noY: true, xl: 'strength of evidence' }); const pdf = (x, m) => Math.exp(-(((x - m) / 0.15) ** 2) / 2); const pts = (m) => Array.from({ length: 101 }, (_, i) => [X(i / 100), Y(pdf(i / 100, m) * 0.9)]); P.line(pts(0.38), '#16A34A', 2.5); P.line(pts(0.72), '#DC2626', 2.5); P.line([[X(bar), Y(0)], [X(bar), Y(1)]], '#111', 2); P.text('innocent', X(0.25), Y(0.95), { c: '#16A34A' }); P.text('guilty', X(0.8), Y(0.95), { c: '#DC2626' }); P.text('convict →', X(bar) + 4, Y(0.05));
        out.innerHTML = `Out of 10,000 trials: <b>${fc}</b> innocent people convicted, <b>${fa}</b> guilty people acquitted, ${tc} guilty convicted. Ratio of guilty freed to innocent convicted: <b>${fc ? (fa / fc).toFixed(1) : '∞'} : 1</b>`; };
      P.onResize = draw; el.append(K.slider('How much evidence the jury needs to convict', 0.3, 0.95, 0.01, bar, (v) => { bar = v; draw(); }), K.slider('Share of defendants who are actually guilty', 0.2, 0.95, 0.01, guiltyShare, (v) => { guiltyShare = v; draw(); }), out); draw();
    } });

  A({ id: 'contract', d: ['law', 'economics', 'ethics'], e: '✍️', t: 'Is it a binding contract?', b: 'Real-world scenarios. Decide whether a court would likely enforce the promise.',
    how: 'In common-law systems a contract generally needs an offer, acceptance, consideration (something of value exchanged), capacity and a lawful purpose. Some contracts must be in writing (e.g. land sales, under the Statute of Frauds, 1677). This is general education, not legal advice; rules vary by jurisdiction.',
    use: 'Jobs, leases, phone plans, online terms of service, freelancing and starting a business.',
    m(el, K) {
      K.quiz([['You tell a friend “I’ll give you my old guitar for your birthday” and later change your mind. Can they enforce it?', ['Yes, a promise is a promise', 'Generally no: a promise of a gift has no consideration'], 1, 'Gifts lack consideration, so courts usually won’t enforce the promise (with exceptions like promissory estoppel if they relied on it to their cost).'],
        ['A 15-year-old signs up for a gym membership and wants out after two months.', ['They’re stuck with it', 'Generally the minor can cancel (void the contract)'], 1, 'Minors generally lack capacity and can usually void contracts, except for necessities.'],
        ['You agree by email to sell your car for $3,000, the buyer replies “Deal!” and you then get a better offer.', ['There is likely a binding contract', 'No contract without a signed paper form'], 0, 'Offer, acceptance and consideration exist; email can satisfy writing requirements in many places.'],
        ['Two people agree in writing that one will pay the other $500 to commit a crime.', ['Enforceable because it’s written', 'Not enforceable: illegal purpose'], 1, 'Courts won’t enforce contracts for unlawful purposes.'],
        ['You click “I agree” on a website’s terms without reading them.', ['Not binding because you didn’t read them', 'Usually binding if you had a reasonable chance to see them'], 1, '“Clickwrap” agreements are generally upheld, though unfair or hidden terms can be challenged.']], el);
    } });

  A({ id: 'legalfamilies', d: ['law', 'history', 'religion', 'geopolitics'], e: '📚', t: 'Legal systems of the world', b: 'Common law, civil law, religious law, customary law. Match the country to its legal tradition.',
    how: 'Civil law descends from Roman law via Napoleon’s Code (1804) and relies on comprehensive codes. Common law (England) builds on judges’ precedents. Religious systems (Islamic law in some areas) and customary or Indigenous law operate alongside them. Most countries are mixed, and colonial history explains much of the map.',
    use: 'International business, human rights comparisons, how judges reason, and understanding why legal cultures differ.',
    m(el, K) {
      K.quiz([['France', ['Civil law', 'Common law', 'Mixed civil/common'], 0, 'The Napoleonic Code (1804) is the model for civil law worldwide.'], ['India', ['Civil law', 'Common law (with religious personal law)', 'Islamic law'], 1, 'British colonial rule left common law; marriage and inheritance follow religion-specific personal laws.'],
        ['Japan', ['Common law', 'Civil law (German-influenced)', 'Customary law'], 1, 'Meiji-era Japan adopted codes modeled on Germany’s in the 1890s.'], ['South Africa', ['Mixed: Roman-Dutch civil law and English common law, plus customary law', 'Pure common law', 'Pure civil law'], 0, 'Dutch and British colonization layered two systems; the constitution recognizes customary law.'],
        ['Saudi Arabia', ['Common law', 'Islamic law (sharia) as the primary source', 'Civil law'], 1, 'Sharia, interpreted by judges, is the main source; royal decrees add regulation.'], ['Louisiana (US state)', ['Common law like the rest of the US', 'Civil law tradition (French/Spanish roots)'], 1, 'Louisiana’s civil code reflects its French and Spanish history.'], ['China', ['Civil law system with socialist characteristics', 'Common law', 'Islamic law'], 0, 'Codified civil law (Civil Code 2020) under Communist Party leadership; courts are not independent of the Party.']], el);
    } });

  A({ id: 'eyewitness', d: ['law', 'psychology'], e: '👀', t: 'How reliable are eyewitnesses?', b: 'Study a lineup, answer leading questions, and see how memory gets rewritten.',
    how: 'Elizabeth Loftus (1974) showed people a car crash film. Asked how fast cars were going when they “smashed” versus “hit” each other, people gave higher speeds, and a week later many falsely remembered broken glass. Mistaken eyewitness identification has been a factor in about 69% of more than 375 DNA exonerations tracked by the Innocence Project.',
    use: 'Police lineup reforms (double-blind lineups, recording confidence immediately), jury instructions, journalism and everyday arguments about “what really happened.”',
    m(el, K) {
      const scene = ['🧢', '🧥', '👜', '🚲', '☕']; const P = h('div', { style: { fontSize: '60px', textAlign: 'center', letterSpacing: '20px', height: '90px' } }); const box = h('div'); let stage = 0;
      const start = () => { P.textContent = scene.join(''); box.innerHTML = '<p class="small">Memorize the scene: a person walked past carrying these items. You have 4 seconds.</p>'; const tm = setTimeout(() => { P.textContent = '❓'; quiz(); }, 4000); K.stops.push(() => clearTimeout(tm)); };
      const quiz = () => { box.innerHTML = ''; const lead = Math.random() < 0.5; box.append(h('p', null, lead ? 'What color was the umbrella the person was carrying?' : 'Was the person carrying an umbrella?'), h('div', { class: 'row' }, (lead ? ['Black', 'Blue', 'Red', 'There was no umbrella'] : ['Yes', 'No']).map((o) => K.btn(o, () => { box.append(h('p', { class: 'small' }, `There was no umbrella. ${lead ? 'The question presupposed one, and many people pick a color: a leading question can implant a detail.' : 'A neutral question makes false memories less likely.'} The real items were ${scene.join(' ')}.`)); })))); };
      el.append(P, box, K.btn('Start', start, true));
    } });
})();
