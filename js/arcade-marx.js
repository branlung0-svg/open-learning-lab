/* Political economy labs for the Marxism–Leninism deep dive: Marx's surplus value model and a plan-vs-market economy. */
(function () {
  const h = Lab.h; const A = Lab.ARC.add;
  const kgrid = (pairs) => h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '8px', margin: '6px 0' } }, pairs.map(([l, el]) => h('div', null, h('div', { class: 'tiny muted' }, l), el)));

  A({ id: 'surplusvalue', d: ['economics', 'philosophy', 'history'], e: '⚒️', t: 'Marx’s surplus value machine', b: 'Split a working day into the hours that pay your wage and the hours that make profit, then add machines and watch Marx’s “falling rate of profit” and the arguments against it.',
    how: 'Karl Marx built this model in Capital, Volume I (1867) from the labor theory of value of Adam Smith and David Ricardo. Value is measured in hours of labor. A worker produces the value of their wage in the “necessary” hours and the rest is surplus value kept by the owner. Volume III (published by Engels in 1894) argued that as machines (constant capital) grow faster than wages, the profit rate tends to fall.',
    use: 'Understanding why unions fought over the length of the working day, how productivity, wages and profits relate, and how to judge a theory by its predictions. Modern economists mostly use marginal productivity theory instead, so this lab also shows where the critics attack.',
    m(el, K) {
      let day = 10, need = 5, c = 10; const hist = [];
      const out = K.out(); const P = K.canvas(el, 120); const kp = h('div'); const P2 = K.canvas(el, 170);
      const legend = h('div', { class: 'tiny muted' }, 'Chart: red line = profit rate; blue dashed = exploitation rate ÷ 10. Press “Add better machines” to add steps.');
      const calc = () => { const s = Math.max(0, day - need), v = need; return { s, v, e: v ? s / v : 0, r: s / (c + v || 1), comp: c / (v || 1) }; };
      const draw = () => { const R = calc(); P.clear(); const W = P.W - 20, x0 = 10, y = 26, bh = 30; const wN = (need / day) * W, wS = (R.s / day) * W;
        P.text('One worker’s day: ' + day + ' hours', x0, 16, { w: 700, s: 12 });
        P.rect(x0, y, wN, bh, '#2563EB'); P.rect(x0 + wN, y, wS, bh, '#DC2626');
        if (wN > 46) P.text('wage ' + need + 'h', x0 + 5, y + 20, { c: '#fff', s: 11, w: 700 });
        if (wS > 54) P.text('surplus ' + R.s + 'h', x0 + wN + 5, y + 20, { c: '#fff', s: 11, w: 700 });
        P.text('Machines & materials used per worker (c): ' + c + 'h', x0, y + bh + 22, { s: 11 });
        P.rect(x0, y + bh + 30, Math.min(W, (c / 120) * W), 14, '#94A3B8');
        kp.innerHTML = ''; kp.append(kgrid([['Exploitation s/v', K.big(R.e.toFixed(2))], ['Profit rate s/(c+v)', K.big((R.r * 100).toFixed(1) + '%')], ['Composition c/v', K.big(R.comp.toFixed(1))], ['Surplus hours', K.big(String(R.s))]]));
        P2.clear(); if (hist.length) { const mx = Math.max(...hist.map((x) => x.r), 0.2); const { X, Y } = P2.chart(0, Math.max(5, hist.length - 1), 0, mx, { fy: (v) => Math.round(v * 100) + '%', xl: 'step', yl: 'profit rate' }); P2.line(hist.map((x, i) => [X(i), Y(x.r)]), '#DC2626', 2.5); P2.line(hist.map((x, i) => [X(i), Y(Math.min(mx, x.e / 10))]), '#2563EB', 1.5, [4, 3]); }
        out.innerHTML = ''; out.append(h('p', { class: 'small' }, R.s <= 0 ? 'No surplus: the whole day only reproduces the wage. Marx argued no capitalist would hire on these terms.' : `Of every ${day} hours, ${R.s} produce value the worker does not receive as wages. In Marx’s terms this is exploitation in a technical sense (unpaid labor), not a claim that the boss is personally cruel.`)); };
      P.onResize = P2.onResize = () => draw();
      el.insertBefore(kp, P2.box); el.insertBefore(legend, P2.box);
      const tech = () => { if (!hist.length) hist.push(calc()); need = Math.max(1, +(need * 0.85).toFixed(1)); c = Math.round(c * 1.45); syncS(); hist.push(calc()); draw(); };
      const sl = h('div');
      const syncS = () => { sl.innerHTML = ''; sl.append(K.slider('Length of the working day (hours)', 6, 16, 1, day, (v) => { day = v; if (need > day) need = day; draw(); }), K.slider('Necessary labor: hours to produce the value of the wage', 1, 10, 0.5, need, (v) => { need = Math.min(v, day); draw(); }), K.slider('Constant capital c per worker (hours of past labor)', 0, 120, 1, c, (v) => { c = v; draw(); })); };
      syncS();
      el.append(sl, h('div', { class: 'row', style: { gap: '6px', margin: '8px 0' } }, K.btn('⚙️ Add better machines (one technology step)', tech, true), K.btn('↺ Reset', () => { day = 10; need = 5; c = 10; hist.length = 0; syncS(); draw(); })),
        h('div', { class: 'grid g2' },
          h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, h('b', null, 'Marx’s argument'), h('p', { class: 'small' }, 'Capitalists compete by mechanizing. Better machines cut the hours needed to make the wage (relative surplus value), but machine costs grow faster. Since in this theory only living labor creates new value, profit per unit of capital tends to fall, which he saw as a source of crises.')),
          h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)' } }, h('b', null, 'The main objections'), h('p', { class: 'small' }, 'Böhm-Bawerk (1896) argued prices do not follow labor hours (the “transformation problem”). Okishio (1961) proved that if real wages stay fixed, a new technique a capitalist adopts because it is cheaper cannot lower the general profit rate. Marginalist economists say machines and capital are productive too. Measured profit rates have risen and fallen without a clear long-run collapse, though some Marxist economists (Kliman, Roberts) find a long decline.'))));
      el.append(out); draw();
    } });

  A({ id: 'planmarket', d: ['economics', 'politics', 'statistics', 'computing'], e: '🏭', t: 'Plan vs market: run an economy', b: 'You have 100 units of factory capacity and five goods. Plan production yourself, let a computer planner do it, or let prices decide. Then compare shortages, waste and who gets left out.',
    how: 'This is a toy version of the “socialist calculation debate”. Ludwig von Mises (1920) and Friedrich Hayek (1945) argued planners cannot know scattered, changing demand without market prices. Oskar Lange (1936) replied that planners could mimic markets by adjusting prices by trial and error. János Kornai later showed how real planned firms behaved: shortages, hoarding and “soft budget constraints”.',
    use: 'Every large organization plans internally (Walmart and Amazon plan huge supply chains), and every government mixes plans and markets. The real question is which decisions each handles better.',
    m(el, K) {
      const G = [['🍞', 'Bread', 28], ['👟', 'Shoes', 18], ['🧥', 'Coats', 16], ['🚲', 'Bikes', 14], ['📻', 'Radios', 24]];
      let mode = 'plan', round = 0, base, dem, prod, price, tot, last, log;
      const reset = () => { round = 0; base = G.map((g) => g[2]); dem = base.slice(); prod = [20, 20, 20, 20, 20]; price = [1, 1, 1, 1, 1]; tot = { short: 0, waste: 0, out: 0, need: 0 }; last = null; log = []; draw(); };
      const shift = () => { round++; dem = base.map((b, i) => { let x = dem[i] * (1 + (Math.random() - 0.5) * 0.35); if (i === 2) x = b * (1 + 0.6 * Math.sin(round / 1.6)); if (round === 6 && i === 4) x *= 1.8; return Math.max(3, x); }); };
      const play = () => { shift(); let sold, shortage, waste, out = 0;
        if (mode === 'market') { const want = dem.map((d, i) => d / Math.pow(price[i], 1.1)); sold = want.map((w, i) => Math.min(w, prod[i])); shortage = want.map((w, i) => Math.max(0, w - prod[i])); waste = prod.map((p, i) => Math.max(0, p - want[i])); out = dem.reduce((a, d, i) => a + Math.max(0, Math.min(d, prod[i]) - Math.min(want[i], prod[i])), 0);
          price = price.map((p, i) => Math.min(4, Math.max(0.35, p * (1 + 0.6 * (want[i] - prod[i]) / Math.max(prod[i], 1)))));
          const w = prod.map((p, i) => p * Math.pow(price[i], 1.4)); const s = w.reduce((a, b) => a + b, 0); prod = w.map((x) => (x / s) * 100);
        } else { sold = dem.map((d, i) => Math.min(d, prod[i])); shortage = dem.map((d, i) => Math.max(0, d - prod[i])); waste = prod.map((p, i) => Math.max(0, p - dem[i])); }
        const need = dem.reduce((a, b) => a + b, 0); const S = shortage.reduce((a, b) => a + b, 0), Wt = waste.reduce((a, b) => a + b, 0);
        tot.short += S; tot.waste += Wt; tot.out += out; tot.need += need; last = { sold, shortage, waste, d: dem.slice() };
        log.push([round, S, Wt, out]);
        if (mode === 'auto') { const seen = sold.map((s, i) => s + shortage[i] * 0.5); const s = seen.reduce((a, b) => a + b, 0); prod = seen.map((x) => (x / s) * 100); }
        draw(); };
      const box = h('div'); const modes = K.choice([['plan', '🧑‍💼 You plan'], ['auto', '🖥️ Computer planner'], ['market', '💱 Market prices']], mode, (m) => { mode = m; reset(); });
      el.append(modes, box);
      const draw = () => { box.innerHTML = ''; const sum = prod.reduce((a, b) => a + b, 0);
        const rows = G.map(([e, n], i) => h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '8px', margin: '6px 0', alignItems: 'center' } },
          h('span', { style: { width: '92px', flex: 'none' } }, e + ' ' + n),
          mode === 'plan' ? h('input', { type: 'range', min: 0, max: 60, step: 1, value: Math.round(prod[i]), style: { flex: 1 }, oninput: (ev) => { prod[i] = +ev.target.value; tag.textContent = 'Capacity used: ' + Math.round(prod.reduce((a, b) => a + b, 0)) + ' / 100'; } }) : h('div', { style: { flex: 1, height: '14px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: prod[i] + '%', height: '100%', background: '#2563EB', borderRadius: '6px' } })),
          h('b', { class: 'small', style: { width: '40px', textAlign: 'right' } }, Math.round(prod[i])),
          mode === 'market' ? h('span', { class: 'tiny', style: { width: '64px' } }, 'price ' + price[i].toFixed(2)) : null,
          last ? h('span', { class: 'tiny', style: { width: '150px', color: last.shortage[i] > 1 ? '#DC2626' : last.waste[i] > 1 ? '#B45309' : 'var(--muted)' } }, last.shortage[i] > 1 ? `queue: ${Math.round(last.shortage[i])} unmet` : last.waste[i] > 1 ? `unsold: ${Math.round(last.waste[i])}` : 'about right') : null));
        const tag = h('div', { class: 'tiny muted' }, 'Capacity used: ' + Math.round(sum) + ' / 100');
        const pct = (x) => tot.need ? Math.round((x / tot.need) * 100) + '%' : '–';
        box.append(h('div', { class: 'small muted', style: { margin: '6px 0' } }, mode === 'plan' ? 'Set next round’s output. You only learn what people wanted after the round, like a real planner reading last quarter’s reports.' : mode === 'auto' ? 'The computer copies last round’s demand. It is fast and honest, but always one round behind.' : 'Prices rise where there are queues and fall where goods pile up; factories shift toward higher prices. Nobody plans.'),
          ...rows, tag,
          h('div', { class: 'row', style: { gap: '6px', margin: '8px 0' } }, K.btn(round ? `▶ Produce round ${round + 1}` : '▶ Produce round 1', () => { if (mode === 'plan' && sum > 100.5) { tag.textContent = '⚠️ Over capacity: lower some goods to 100 total.'; return; } play(); }, true), mode !== 'plan' ? K.btn('⏩ Run 12 rounds', () => { for (let k = 0; k < 12; k++) play(); }) : null, K.btn('↺ Reset', reset)),
          kgrid([['Rounds', K.big(String(round))], ['Shortage (unmet wants)', K.big(pct(tot.short))], ['Waste (unsold goods)', K.big(pct(tot.waste))], ['Priced out (needed it, could not pay)', K.big(mode === 'market' ? pct(tot.out) : '0%')]]),
          round === 6 ? h('p', { class: 'small', style: { color: '#B45309' } }, '📻 News: a radio craze just hit. How fast does your system notice?') : null,
          round >= 8 ? h('div', { class: 'card', style: { boxShadow: 'none', border: '1px solid var(--line)', marginTop: '8px' } }, h('b', null, 'What this shows, and what it hides'), h('p', { class: 'small' }, 'Prices usually cut queues and waste because millions of small signals adjust automatically: that is Hayek’s point. But markets ration by money, so some people who need a coat do not get one: that is the socialist point. Real planners faced millions of products, not five, plus bosses who padded reports to hit targets. Real markets have monopolies, booms and busts. Most real economies, including China’s and Vietnam’s today, mix both.'), Lab.source('Mises, “Economic Calculation in the Socialist Commonwealth” (1920); Hayek, “The Use of Knowledge in Society” (1945); Lange, “On the Economic Theory of Socialism” (1936–37); Kornai, “Economics of Shortage” (1980)')) : null); };
      reset();
    } });
})();
