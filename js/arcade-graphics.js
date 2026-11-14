/* Graphics that changed the world: read four real historical data graphics, then see the same skill in today's fields. */
(function () {
  const h = Lab.h, ARC = Lab.ARC;
  const add = (def) => { const i = ARC.labs.findIndex((l) => l.id === def.id); if (i >= 0) ARC.labs[i] = def; else ARC.labs.push(def); ARC.by[def.id] = def; };
  // [image, title, who, story, [question, options, right, why], impact, today]
  const G = [
    ['c:statistics-snow-map', 'The cholera map (1854)', 'John Snow, a London doctor',
      'In August–September 1854 cholera killed over 600 people near Broad Street, Soho. Most doctors blamed “bad air”. Snow marked each death on a street map as a black bar.',
      ['Look at where the black bars cluster. What does the pattern suggest?', ['Deaths were spread evenly across London', 'Deaths clustered around one water pump', 'Deaths were highest near the river'], 1, 'The bars pile up around the Broad Street pump. Snow also found telling exceptions: a nearby brewery whose workers drank beer had almost no deaths.'],
      'Officials removed the pump handle on 8 September 1854. Germ theory later explained why it worked.', 'Epidemiologists still map cases to find outbreak sources, as in COVID-19 contact tracing; the method is called spatial analysis.'],
    ['c:statistics-nightingale', 'The “rose” diagram (1858)', 'Florence Nightingale, nurse and statistician',
      'During the Crimean War Nightingale gathered hospital records. Each wedge is a month; its area shows deaths. Blue is deaths from preventable disease, red from wounds, black from other causes.',
      ['Which colour dominates?', ['Red (wounds)', 'Blue (preventable disease)', 'Black (other causes)'], 1, 'Far more soldiers died of disease such as cholera and typhus than of wounds. After sanitary reforms in 1855, the blue wedges shrink sharply.'],
      'Her charts helped push Parliament and the Army to reform military hospitals and public sanitation. She became the first woman elected to the Royal Statistical Society (1858).', 'Hospitals now track infection rates on dashboards; data journalists use the same idea to make numbers impossible to ignore.'],
    ['c:statistics-minard', 'Napoleon’s march on Moscow (1869)', 'Charles Joseph Minard, a French civil engineer',
      'The band’s width shows the size of Napoleon’s army as it marched into Russia in 1812 (tan) and retreated (black). The line at the bottom shows the freezing temperatures on the way back.',
      ['About what share of the army that set out came back?', ['About half', 'About a quarter', 'Only a small fraction, around 1 in 40'], 2, 'Minard shows about 422,000 men setting out and about 10,000 returning: six variables (size, position, direction, temperature, date, place) in one picture.'],
      'Minard made it to show the staggering human cost of the campaign. The statistician Edward Tufte (1983) called it perhaps the best statistical graphic ever drawn.', 'Software designers use the same principle, showing many variables at once without clutter, in maps, weather apps and financial charts.'],
    ['c:sociology-booth-map', 'The poverty map of London (1889)', 'Charles Booth, a businessman and social researcher',
      'Booth’s team visited every street and coloured it from black (“lowest class, vicious, semi-criminal”, in Booth’s Victorian words) to yellow (wealthy). Booth set out to prove that socialist claims about poverty were exaggerated.',
      ['What did his data show?', ['Socialists had exaggerated: almost nobody was poor', 'About 30% of Londoners lived in poverty, more than critics had claimed', 'Poverty only existed in the East End'], 1, 'His survey found around 30% in poverty: the evidence went against his own starting belief, and he published it anyway.'],
      'The work fed into old-age pensions (1908) and other reforms; it shows good research can change the researcher’s mind.', 'City planners and sociologists use the same street-level maps for housing, health and policing; today they also debate the labels used, which can stigmatize neighbourhoods.'],
  ];
  add({ id: 'graphics', d: ['statistics', 'medicine', 'history', 'computing', 'sociology', 'arts'], e: '🗺️', t: 'Graphics that changed the world',
    b: 'Read four real historical data graphics, from John Snow’s cholera map to Minard’s chart of Napoleon’s army. Find what each reveals, how it changed policy, and how the same idea is used in today’s jobs.',
    how: 'A good graphic turns a table of numbers into a pattern your eye catches at once. Each of these four was made by someone trying to win an argument with evidence. Statisticians call the skill data visualization; it combines statistics, design and storytelling.',
    use: 'Epidemiology, journalism, public policy, business dashboards and spotting misleading charts.',
    m(el, K) {
      let i = 0, sc = 0; const box = h('div');
      const draw = () => { box.innerHTML = '';
        if (i >= G.length) { box.append(h('div', { class: 'card', style: { boxShadow: 'none', border: '2px solid #16A34A' } }, h('h3', { style: { marginTop: 0 } }, `You read ${sc} of ${G.length} graphics correctly`),
          h('p', { class: 'small' }, 'All four makers were outsiders to the debate they changed: a doctor, a nurse, an engineer and a businessman. Each used data and design together.'),
          h('p', { class: 'small' }, h('b', null, 'Your turn: '), 'next time you see a chart, ask what each colour, width and position means, what is left out, and who made it and why.'),
          h('div', { class: 'row', style: { gap: '6px' } }, h('a', { class: 'btn sm', href: '#play-sourcedetective' }, 'Lab: Source detective'), h('a', { class: 'btn sm', href: '#d-statistics-evidence' }, 'Statistics: evidence'), K.btn('Start again', () => { i = 0; sc = 0; draw(); }, true)))); return; }
        const [img, t, who, story, [q, opts, right, why], impact, today] = G[i]; const fb = h('div');
        box.append(h('div', { class: 'tiny muted' }, `Graphic ${i + 1} of ${G.length}`), h('h3', { style: { margin: '4px 0' } }, t), h('div', { class: 'small muted', style: { marginBottom: '8px' } }, 'Made by ' + who),
          h('div', { class: 'grid g2', style: { alignItems: 'start' } }, Lab.cfig(img, { max: '360px', fit: 'contain' }),
            h('div', null, h('p', { class: 'small' }, story), h('p', null, h('b', null, q)), h('div', { class: 'stack', style: { gap: '6px' } }, opts.map((o, j) => h('button', { class: 'opt', onclick: (e) => { if (fb.childNodes.length) return; const ok = j === right; if (ok) sc++;
              e.target.classList.add(ok ? 'right' : 'wrong'); [...box.querySelectorAll('.opt')][right].classList.add('right');
              fb.append(h('p', { class: 'small', style: { marginTop: '8px' } }, h('b', null, ok ? '✅ ' : '❌ '), why), h('div', { class: 'small', style: { padding: '10px', background: 'var(--card2)', borderRadius: '10px', marginBottom: '8px' } }, h('b', null, '🌍 What it changed: '), impact, h('br'), h('b', null, '🛠️ Same skill today: '), today),
                K.btn(i < G.length - 1 ? 'Next graphic →' : 'See your results →', () => { i++; draw(); }, true)); } }, o))), fb))); };
      el.append(box); draw();
    } });
})();
