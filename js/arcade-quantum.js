/* Quantum physics labs: the double slit, three polarizers, a single-photon interferometer and the photoelectric effect. */
(function () {
  const h = Lab.h; const A = Lab.ARC.add;
  A({ id: 'doubleslit', d: ['physics', 'philosophy'], e: '🌊', t: 'Double slit: one particle at a time', b: 'Fire single electrons at two slits and watch a wave pattern appear dot by dot. Then try to see which slit they used.',
    how: 'Thomas Young showed light makes interference fringes in 1801. In 1989 Akira Tonomura’s team at Hitachi sent electrons through a double slit one at a time: each lands as a single dot, yet thousands of dots build an interference pattern, as if each electron passed through both slits as a wave. If you measure which slit each electron uses, the pattern disappears. Quantum theory predicts only probabilities, given by the square of a wave’s amplitude (the Born rule).',
    use: 'Electron microscopes, the design of quantum computers, and the deepest debates in philosophy about what reality is when nobody measures it.',
    m(el, K) {
      const P = K.canvas(el, 280); let det = false, run = true, sep = 4; const hits = []; const bins = new Array(120).fill(0); const out = K.out();
      const I = (x) => { const env = Math.pow(Math.sin(x * 3) / (x * 3 || 1e-6), 2); return det ? env : env * Math.pow(Math.cos(x * sep), 2); };
      const sample = () => { for (;;) { const x = (Math.random() - 0.5) * 4; if (Math.random() < I(x)) return x; } };
      const reset = () => { hits.length = 0; bins.fill(0); };
      el.append(h('div', { class: 'row' }, K.btn('⏯ Pause', () => (run = !run)), K.btn('Reset', reset), K.btn('👁️ Toggle which-slit detector', () => { det = !det; reset(); })), K.slider('Slit separation', 2, 8, 0.5, sep, (v) => { sep = v; reset(); }), out);
      K.raf(() => { if (run) for (let k = 0; k < 6; k++) { const x = sample(); hits.push([x, Math.random()]); if (hits.length > 4000) hits.shift(); const b = Math.min(119, Math.max(0, Math.floor((x + 2) / 4 * 120))); bins[b]++; }
        P.clear(); const sx = P.W * 0.62; P.rect(P.W * 0.1, 0, 6, P.H, '#475569'); P.rect(P.W * 0.1, P.H * 0.44, 6, P.H * 0.04, '#fff0');
        P.text('source', 8, P.H / 2, { s: 11 }); P.text(det ? 'detector ON: which slit is known' : 'detector OFF', P.W * 0.13, 16, { s: 11, c: det ? '#DC2626' : '#16A34A' });
        hits.forEach(([x, r]) => P.dot(sx * 0.35 + r * sx * 0.6, P.H / 2 + x * P.H / 4.2, 1.3, '#2563EB'));
        const mx = Math.max(...bins, 1); P.line(bins.map((v, i) => [sx + 20 + (v / mx) * (P.W - sx - 30), (i / 120) * P.H]), '#DC2626', 2);
        out.textContent = `${bins.reduce((a, b) => a + b, 0)} electrons detected. ${det ? 'With the detector on, the fringes vanish: two simple humps.' : 'Bright and dark bands: interference, even though each electron arrives as one dot.'}`; });
    } });

  A({ id: 'polarizers', d: ['physics', 'math'], e: '🕶️', t: 'Three polarizers: adding a filter lets more light through', b: 'Two crossed filters block all light. Put a third between them and light comes back. Why?',
    how: 'A polarizer passes light whose waves vibrate along its axis. Étienne-Louis Malus found in 1809 that the fraction passing is cos²θ, where θ is the angle between filters. For single photons this fraction becomes a probability: each photon either passes or not, and passing resets its polarization to the new filter’s angle. So a 45° filter between two crossed ones turns “impossible” into a 25% chance.',
    use: 'Sunglasses, LCD screens, 3D cinema glasses, and quantum cryptography (the BB84 protocol, 1984), whose security rests on measurement disturbing photons.',
    m(el, K) {
      let a2 = 45, three = true; const out = K.out(); const P = K.canvas(el, 170);
      const calc = () => { const t1 = 0, t3 = 90; const f = three ? 0.5 * Math.pow(Math.cos((a2 - t1) * Math.PI / 180), 2) * Math.pow(Math.cos((t3 - a2) * Math.PI / 180), 2) : 0.5 * Math.pow(Math.cos((t3 - t1) * Math.PI / 180), 2);
        P.clear(); const xs = three ? [0.2, 0.5, 0.8] : [0.2, 0.8]; const angs = three ? [0, a2, 90] : [0, 90];
        xs.forEach((x, i) => { const X = x * P.W, Y = P.H / 2; P.dot(X, Y, 46, '#94A3B833'); const r = (angs[i] - 90) * Math.PI / 180; P.line([[X - 40 * Math.cos(r), Y - 40 * Math.sin(r)], [X + 40 * Math.cos(r), Y + 40 * Math.sin(r)]], '#334155', 3); P.text(angs[i] + '°', X, Y + 64, { a: 'center', s: 12 }); });
        let sent = 0, passed = 0; for (let k = 0; k < 2000; k++) { sent++; let pol = Math.random() * 180; let ok = true; for (const a of angs) { if (Math.random() < Math.pow(Math.cos((a - pol) * Math.PI / 180), 2)) pol = a; else { ok = false; break; } } if (ok) passed++; }
        out.innerHTML = ''; out.append(h('div', null, 'Malus’s law prediction: ', h('b', null, (f * 100).toFixed(1) + '%'), ' of unpolarized light gets through. Simulated photons: ', h('b', null, `${passed} of ${sent}`), ` (${(passed / sent * 100).toFixed(1)}%).`)); };
      el.append(K.btn('Add / remove the middle filter', () => { three = !three; calc(); }), K.slider('Middle filter angle (°)', 0, 90, 1, a2, (v) => { a2 = v; calc(); }), out); calc();
    } });

  A({ id: 'interferometer', d: ['physics', 'computing'], e: '🔀', t: 'One photon, two paths', b: 'Send single photons into an interferometer: with both paths open they all reach one detector. Block a path and they split 50/50.',
    how: 'In a Mach–Zehnder interferometer a beam splitter sends each photon both ways at once as a quantum superposition. At the second splitter the two paths’ amplitudes add or cancel depending on the phase difference φ: detector A fires with probability cos²(φ/2). Blocking one path removes the interference, so the odds become 50/50. Amplitudes add, not probabilities: that is the key difference between quantum and classical chance.',
    use: 'LIGO detected gravitational waves in 2015 with giant interferometers measuring changes smaller than a proton. Quantum computers use the same interference to make wrong answers cancel and right answers add up.',
    m(el, K) {
      let phi = 0, blocked = false; const out = K.out(); const P = K.canvas(el, 200); let a = 0, b = 0;
      const pA = () => (blocked ? 0.5 : Math.pow(Math.cos(phi / 2), 2));
      const draw = () => { P.clear(); const W = P.W, H = P.H; const L = [[0.1, 0.75], [0.3, 0.75], [0.3, 0.25], [0.7, 0.25], [0.7, 0.75], [0.3, 0.75]];
        P.line([[0.08 * W, 0.75 * H], [0.3 * W, 0.75 * H]], '#DC2626', 3); P.line([[0.3 * W, 0.75 * H], [0.7 * W, 0.75 * H]], blocked ? '#94A3B8' : '#DC2626', 2, blocked ? [4, 4] : []); P.line([[0.3 * W, 0.75 * H], [0.3 * W, 0.25 * H], [0.7 * W, 0.25 * H]], '#DC2626', 2); P.line([[0.7 * W, 0.75 * H], [0.7 * W, 0.25 * H]], '#DC2626', 2);
        P.text('splitter', 0.3 * W, 0.75 * H + 18, { a: 'center', s: 11 }); P.text('splitter', 0.7 * W, 0.25 * H - 8, { a: 'center', s: 11 }); if (blocked) P.text('⛔ path blocked', 0.5 * W, 0.75 * H - 8, { a: 'center', s: 12, c: '#DC2626' });
        P.text(`A: ${a}`, 0.88 * W, 0.25 * H + 4, { s: 13, w: 700 }); P.text(`B: ${b}`, 0.72 * W, 0.92 * H, { s: 13, w: 700 }); };
      const fire = (n) => { for (let k = 0; k < n; k++) Math.random() < pA() ? a++ : b++; draw(); out.textContent = `Predicted chance at detector A: ${(pA() * 100).toFixed(0)}%. Observed: ${a + b ? Math.round(a / (a + b) * 100) : 0}% of ${a + b} photons.`; };
      el.append(h('div', { class: 'row' }, K.btn('Send 1 photon', () => fire(1)), K.btn('Send 500', () => fire(500), true), K.btn('Block / unblock a path', () => { blocked = !blocked; a = b = 0; fire(0); }), K.btn('Reset', () => { a = b = 0; fire(0); })), K.slider('Phase difference φ (degrees)', 0, 360, 5, 0, (v) => { phi = v * Math.PI / 180; a = b = 0; fire(0); }), out); fire(0);
    } });

  A({ id: 'photoelectric', d: ['physics', 'chemistry', 'engineering'], e: '💡', t: 'The photoelectric effect', b: 'Shine light on metal. Brighter red light does nothing; dim violet light knocks electrons out. Einstein explained why.',
    how: 'Classical physics said brighter light should eject electrons with more energy. Experiments showed only the light’s color (frequency) mattered. In 1905 Einstein proposed light comes in packets (photons) with energy E = hf: one photon frees one electron only if hf exceeds the metal’s “work function.” Robert Millikan set out to disprove it and confirmed it (1916). Einstein’s Nobel Prize (1921) was for this, not relativity.',
    use: 'Solar panels, camera sensors, night-vision devices and light meters all work on this effect; it was a founding step of quantum physics.',
    m(el, K) {
      let f = 5, I = 50; const W0 = 2.3; const out = K.out(); const P = K.canvas(el, 220); const es = [];
      const draw = () => { const E = 4.136 * f / 10; P.clear(); P.rect(P.W * 0.55, P.H * 0.3, 18, P.H * 0.5, '#94A3B8'); P.text('metal (sodium)', P.W * 0.55, P.H * 0.88, { s: 11 });
        const hue = 280 - (f - 4) * 70; const col = `hsl(${Math.max(0, Math.min(280, hue))},90%,55%)`; for (let k = 0; k < I / 10; k++) P.line([[20, 20 + k * 18], [P.W * 0.55, P.H * 0.35 + k * 12]], col, 2);
        const ok = E > W0; if (ok && Math.random() < I / 100) es.push([P.W * 0.57, P.H * (0.35 + Math.random() * 0.4), (E - W0) * 3]); es.forEach((e) => { e[0] += e[2] + 0.5; }); while (es.length && es[0][0] > P.W) es.shift(); es.forEach(([x, y]) => P.dot(x, y, 3, '#2563EB'));
        out.textContent = `Photon energy hf = ${E.toFixed(2)} eV; sodium needs ${W0} eV. ${ok ? `Electrons escape with up to ${(E - W0).toFixed(2)} eV of energy. Brighter light makes more of them, not faster ones.` : 'No electrons, however bright the light: each photon is too weak.'}`; };
      el.append(K.slider('Light frequency (×10¹⁴ Hz)', 4, 10, 0.1, f, (v) => { f = v; }), K.slider('Brightness', 10, 100, 10, I, (v) => { I = v; }), out); K.raf(draw);
    } });
})();
