const { h } = Lab;

// ---------- REAL WORLDS (NASA maps on 3D globes) ----------
const WORLDS = [
  { id: 'earth-a', name: 'Earth', group: 'Planets', fact: 'This is a shaded-relief map of land and sea floor. About 71% of the surface is ocean. The deepest point, the Challenger Deep in the Pacific, is about 10.9 km down, deeper than Everest (8,849 m) is tall.', how: 'Measured by satellites (land) and by ships bouncing sound off the sea floor (sonar).', q: 'Why are the sea-floor ridges where they are?' },
  { id: 'venus', name: 'Venus', group: 'Planets', fact: 'Thick clouds hide Venus, so this map was made with radar by NASA’s Magellan probe (1990–94). The surface is about 465 °C, hotter than Mercury, because a thick CO₂ atmosphere traps heat. Venus spins backwards, and its day is longer than its year.', how: 'Radar: Magellan beamed radio waves through the clouds and timed the echoes.', q: 'What does Venus teach us about the greenhouse effect?' },
  { id: 'mars', name: 'Mars', group: 'Planets', fact: 'Rust (iron oxide) in the dust makes Mars red. Olympus Mons is about 22 km high, roughly 2.5 times Everest, and the Valles Marineris canyon would stretch across the United States.', how: 'Stitched from orbiter photographs.', q: 'Why could a volcano grow so much taller on Mars than on Earth?' },
  { id: 'jupiter', name: 'Jupiter', group: 'Planets', fact: 'Jupiter has about 2.5 times the mass of all the other planets combined. The Great Red Spot is a storm wider than Earth that people have watched for nearly 200 years.', how: 'Built from spacecraft images (Voyager, Cassini and others).', q: 'Why does Jupiter have stripes?' },
  { id: 'saturn', name: 'Saturn', group: 'Planets', rings: true, fact: 'Saturn is less dense than water: in a big enough bathtub it would float. The rings are mostly chunks of water ice, from dust grains to house-sized blocks, yet only about 10 meters thick in most places.', how: 'Built from Voyager and Cassini images.', q: 'Where did Saturn’s rings come from?' },
  { id: 'neptune', name: 'Neptune', group: 'Planets', fact: 'Neptune was found with math before anyone saw it. In 1846 Urbain Le Verrier calculated where an unseen planet must be to explain Uranus’s odd orbit; Johann Galle pointed a telescope there and found it within a degree. Its winds reach about 2,000 km/h.', how: 'From Voyager 2, the only spacecraft to visit (1989).', q: 'How did Le Verrier predict Neptune’s position from Uranus’s orbit?' },
  { id: 'pluto', name: 'Pluto', group: 'Dwarf planets', fact: 'NASA’s New Horizons flew past on 14 July 2015 after a 9.5-year trip. The bright “heart” is a plain of frozen nitrogen. In 2006 astronomers reclassified Pluto as a dwarf planet because it hasn’t cleared its orbit of other objects.', how: 'From New Horizons photographs.', q: 'Was it right to call Pluto a dwarf planet?' },
  { id: 'pluto-charon', name: 'Charon (Pluto’s moon)', group: 'Dwarf planets', fact: 'Charon is about half Pluto’s width, so the two orbit a point in the empty space between them. Each always shows the other the same face.', how: 'From New Horizons photographs.', q: 'What is a barycenter?' },
  { id: 'jupiter-io-b', name: 'Io (Jupiter)', group: 'Moons', fact: 'Io is the most volcanic place known. Jupiter’s gravity squeezes and flexes it every orbit, heating the inside. Scientists predicted this in 1979, and days later Voyager 1 photographed an erupting plume.', how: 'From Voyager and Galileo spacecraft images.', q: 'How can gravity heat a moon?' },
  { id: 'jupiter-europa', name: 'Europa (Jupiter)', group: 'Moons', fact: 'Under an ice shell, Europa likely hides a salty ocean with about twice as much water as all of Earth’s oceans. NASA’s Europa Clipper launched in 2024 and is due to arrive in 2030.', how: 'From Voyager and Galileo images.', q: 'Why do scientists think Europa might support life?' },
  { id: 'jupiter-ganymede', name: 'Ganymede (Jupiter)', group: 'Moons', fact: 'The largest moon in the solar system, bigger than the planet Mercury, and the only moon known to make its own magnetic field.', how: 'From Voyager and Galileo images.', q: 'What does a magnetic field tell us about a world’s inside?' },
  { id: 'jupiter-callisto', name: 'Callisto (Jupiter)', group: 'Moons', fact: 'One of the most heavily cratered surfaces known: an ancient face that has barely changed in billions of years.', how: 'From Voyager and Galileo images.', q: 'How do craters let scientists date a surface?' },
  { id: 'saturn-titan', name: 'Titan (Saturn)', group: 'Moons', fact: 'This globe is plain orange on purpose. Titan has a thick nitrogen atmosphere (1.5× Earth’s surface pressure) full of orange haze that hides the ground. Under it are lakes of liquid methane. ESA’s Huygens probe landed there in 2005.', how: 'Visible-light color of the haze; the surface needs radar or infrared.', q: 'Why could Titan tell us about early Earth?' },
  { id: 'saturn-enceladus', name: 'Enceladus (Saturn)', group: 'Moons', fact: 'In 2005 the Cassini probe found geysers of water spraying from cracks near the south pole, fed by an ocean under the ice. Cassini later flew through the spray and tasted it.', how: 'From Cassini images.', q: 'What did Cassini find in Enceladus’s spray?' },
  { id: 'saturn-mimas', name: 'Mimas (Saturn)', group: 'Moons', fact: 'Herschel crater is about 130 km wide, a third of the moon’s own width. The impact that made it nearly shattered Mimas.', how: 'From Cassini images.', q: 'How big can an impact be before a moon breaks apart?' },
  { id: 'saturn-iapetus', name: 'Iapetus (Saturn)', group: 'Moons', fact: 'Two-faced: one side is dark as coal, the other bright as snow. In 1671 Giovanni Cassini noticed he could see it only on one side of Saturn, and guessed correctly that its two halves differ.', how: 'From Cassini images.', q: 'Why would one side of a moon be dark?' },
  { id: 'uranus-miranda', name: 'Miranda (Uranus)', group: 'Moons', fact: 'The black areas are not shadows. They were never photographed. Voyager 2, the only visitor (1986), arrived when Uranus’s south pole faced the Sun, so it saw only the southern halves of the moons. Miranda has cliffs about 20 km tall.', how: 'From Voyager 2 images.', q: 'Why is Uranus tipped on its side?' },
  { id: 'mars-phobos', name: 'Phobos (Mars)', group: 'Moons', fact: 'Phobos is spiraling slowly inward toward Mars. In tens of millions of years it will either crash or be torn into a ring.', how: 'From Mars orbiter images.', q: 'Why does Phobos spiral inward while our Moon drifts away?' },
];
const PHOTOS = [
  ['earth-b', 'Earth from space', 'The whole planet in one frame. Seeing Earth like this shaped how people thought about it, from environmental politics to the idea of one shared home.'],
  ['moon-apollo-astronaut-bootprint', 'A bootprint on the Moon, Apollo 11 (July 1969)', 'Buzz Aldrin photographed his bootprint on purpose, to study how lunar soil packs under weight. With no wind or rain, prints like this can last for millions of years.'],
  ['moon', 'The full Moon', 'The dark patches are “maria” (seas): old floods of lava that cooled into basalt. The bright areas are older, cratered highlands.'],
  ['moon-lunar-far-side', 'The far side of the Moon', 'You can never see this side from Earth, because the Moon is tidally locked and always shows us the same face. The Soviet probe Luna 3 photographed it first, in 1959.'],
  ['moon-hypatia-rille', 'Hypatia Rille', 'A long valley on the Moon, named after a nearby crater, which honors Hypatia of Alexandria, a mathematician killed in 415 CE. Rilles are thought to be collapsed lava channels or places where the crust pulled apart.'],
  ['moon-bright-halo-craters', 'Bright-halo craters', 'Young craters look bright. Fresh rock thrown out by an impact hasn’t yet been darkened by billions of years of solar wind and micrometeorites.'],
  ['moon-lunar-crater', 'A lunar crater from orbit', 'Craters pile up over time, so counting them lets scientists estimate a surface’s age. Moon rocks brought back by Apollo were used to calibrate that clock.'],
  ['moon-apollo-crater', 'Crater seen from an Apollo spacecraft', 'The central peak forms when the ground rebounds after a big impact, like the splash-back of a drop hitting water.'],
  ['moon-southern-sea', 'A lunar “sea”', 'Smooth, dark maria have far fewer craters than the highlands. That shows they are younger: lava covered the older scars.'],
  ['moon-lunar-terrain', 'Lunar terrain', 'Low sun angles throw long shadows, which is how scientists measured the heights of lunar mountains, the same trick Galileo used with his telescope in 1609.'],
];
const IMG = (id) => `img/space/${id}.jpg`;

Lab.explorer('physics', 'worlds', {
  mount(el) {
    let mode = 'globe', cur = 0, alive = true, st = null, sphere = null, ring = null, light = null, amb = null, lit = true;
    const tabs = h('div', { class: 'row' });
    const body = h('div', { class: 'stack' });
    el.append(h('div', { class: 'card' }, h('p', { class: 'small', style: { margin: '0 0 10px' } }, 'Real maps and photographs from NASA. Spin each world, read what was found there, then test yourself.'), tabs), body);
    const setMode = (m) => { mode = m; [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.m === m)); render(); };
    [['globe', '🌍 Spin a world'], ['quiz', '❓ Which world is this?'], ['photos', '📷 Moon & Earth photos']].forEach(([m, t]) => tabs.append(h('button', { class: 'tab' + (m === mode ? ' on' : ''), 'data-m': m, onclick: () => setMode(m) }, t)));

    async function makeGlobe(holder) {
      if (st) { st.dispose(); st = null; }
      st = await Lab.stage3d(holder, { camPos: [0, 0, 3.2], target: [0, 0, 0], height: 420 });
      if (!alive) { st.dispose(); return; }
      const { THREE, scene } = st;
      st.wrap.style.background = '#05060f';
      const loader = new THREE.TextureLoader();
      const sky = loader.load(IMG('hipparcos-star-map')); sky.colorSpace = THREE.SRGBColorSpace;
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(40, 48, 32), new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide })));
      sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 }));
      scene.add(sphere);
      light = new THREE.DirectionalLight(0xffffff, 2.6); light.position.set(5, 2, 4); scene.add(light);
      amb = new THREE.AmbientLight(0xffffff, 0.25); scene.add(amb);
      st.ticks.push(() => { if (sphere) sphere.rotation.y += 0.0025; if (ring) ring.rotation.z += 0.0004; });
      st.controls.minDistance = 1.4; st.controls.maxDistance = 8;
      return st;
    }
    function setWorld(i) {
      if (!st || !sphere) return;
      const { THREE } = st; const w = WORLDS[i];
      const tex = new THREE.TextureLoader().load(IMG(w.id)); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      if (sphere.material.map) sphere.material.map.dispose();
      sphere.material.map = tex; sphere.material.needsUpdate = true; sphere.rotation.set(0.1, 0, 0);
      if (ring) { st.scene.remove(ring); ring.geometry.dispose(); ring.material.dispose(); ring = null; }
      if (w.rings) {
        const c = document.createElement('canvas'); c.width = 512; c.height = 8; const g = c.getContext('2d');
        for (let x = 0; x < 512; x++) { const r = x / 512; let a = 0.15 + 0.6 * Math.abs(Math.sin(r * 31)) * (r > 0.12 ? 1 : 0); if (r > 0.6 && r < 0.66) a = 0.03; if (r > 0.93) a *= 0.3; g.fillStyle = `rgba(230,214,180,${a})`; g.fillRect(x, 0, 1, 8); }
        const rt = new THREE.CanvasTexture(c); const geo = new THREE.RingGeometry(1.25, 2.3, 128);
        const pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
        for (let k = 0; k < pos.count; k++) { v.fromBufferAttribute(pos, k); uv.setXY(k, (v.length() - 1.25) / 1.05, 0.5); }
        ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: rt, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2 + 0.47; st.scene.add(ring);
      }
      setLight();
    }
    function setLight() { if (light) { light.intensity = lit ? 2.6 : 0; amb.intensity = lit ? 0.25 : 1.6; } }

    async function render() {
      body.innerHTML = '';
      if (st) { st.dispose(); st = null; sphere = null; ring = null; }
      if (mode === 'globe') {
        const holder = h('div');
        const pick = h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px' } });
        const info = h('div');
        const litBtn = h('button', { class: 'btn sm', onclick: () => { lit = !lit; litBtn.textContent = lit ? '☀️ Sunlight: on' : '☀️ Sunlight: off (see the whole map)'; setLight(); } }, '☀️ Sunlight: on');
        body.append(h('div', { class: 'grid g2' }, h('div', { class: 'card' }, holder, h('div', { class: 'row', style: { marginTop: '10px' } }, litBtn, h('span', { class: 'tiny muted' }, 'Drag to spin · pinch or scroll to zoom'))), h('div', { class: 'card' }, info)),
          h('div', { class: 'card' }, h('h3', null, 'Choose a world'), pick));
        let lastGroup = '';
        WORLDS.forEach((w, i) => { if (w.group !== lastGroup) { lastGroup = w.group; pick.append(h('div', { class: 'tiny muted', style: { width: '100%', marginTop: '6px', fontWeight: 700 } }, w.group)); }
          pick.append(h('button', { class: 'chip' + (i === cur ? ' on' : ''), style: { '--c': 'var(--accent)' }, onclick: () => { cur = i; [...pick.querySelectorAll('.chip')].forEach((c, j) => c.classList.toggle('on', j === i)); setWorld(i); drawInfo(); } }, w.name)); });
        const drawInfo = () => { const w = WORLDS[cur]; info.innerHTML = ''; Lab.setContext(`Real worlds → ${w.name}`);
          info.append(h('h3', null, w.name), h('p', null, w.fact), h('p', { class: 'small muted' }, h('b', null, 'How we know: '), w.how),
            h('button', { class: 'btn sm primary', style: { marginTop: '6px' }, onclick: () => Lab.ask(w.q, `Real worlds → ${w.name}: ${w.fact}`) }, '✦ ' + w.q),
            Lab.source('Maps from <a href="https://github.com/nasa/NASA-3D-Resources">NASA 3D Resources</a> (public domain). Background sky: Hipparcos star map.'));
          Lab.markDone('world:' + w.id, 3, w.name); };
        await makeGlobe(holder); if (!alive) return; setWorld(cur); drawInfo();
      } else if (mode === 'quiz') {
        const holder = h('div'); const qbox = h('div'); let score = 0, n = 0, ans;
        body.append(h('div', { class: 'grid g2' }, h('div', { class: 'card' }, holder), h('div', { class: 'card' }, qbox)));
        await makeGlobe(holder); if (!alive) return;
        const next = () => {
          ans = Math.floor(Math.random() * WORLDS.length); setWorld(ans);
          const opts = Lab.shuffle([ans, ...Lab.shuffle(WORLDS.map((_, i) => i).filter((i) => i !== ans)).slice(0, 3)]);
          qbox.innerHTML = '';
          qbox.append(h('h3', null, 'Which world is this?'), h('p', { class: 'small muted' }, `Score: ${score} / ${n}. Spin it and look for clues: color, craters, bands, black (unphotographed) areas.`),
            ...opts.map((i) => h('button', { class: 'opt', onclick: (e) => { if (qbox.dataset.done) return; qbox.dataset.done = 1; n++; const right = i === ans; if (right) { score++; Lab.addXP(4, 'world identified'); }
              e.target.classList.add(right ? 'right' : 'wrong'); [...qbox.querySelectorAll('.opt')].forEach((b, k) => { if (opts[k] === ans) b.classList.add('right'); });
              qbox.append(h('p', { class: 'small', style: { marginTop: '8px' } }, h('b', null, right ? 'Yes! ' : `It’s ${WORLDS[ans].name}. `), WORLDS[ans].fact), h('button', { class: 'btn primary sm', onclick: () => { delete qbox.dataset.done; next(); } }, 'Next world →')); } }, WORLDS[i].name)));
        };
        next();
      } else {
        const big = h('div'); const grid = h('div', { class: 'grid g4' });
        body.append(big, h('div', { class: 'card' }, h('h3', null, 'Photographs'), grid, Lab.source('Photographs from <a href="https://github.com/nasa/NASA-3D-Resources">NASA 3D Resources</a> (public domain).')));
        const show = (p, scroll = true) => { big.innerHTML = ''; big.append(h('div', { class: 'card' }, h('div', { class: 'grid g2' }, h('img', { src: IMG(p[0]), alt: p[1], style: { width: '100%', borderRadius: '12px', background: '#000' } }), h('div', null, h('h3', null, p[1]), h('p', null, p[2]), h('button', { class: 'btn sm primary', onclick: () => Lab.ask('Tell me more about this photo and the science behind it.', `NASA photo: ${p[1]}. ${p[2]}`) }, '✦ Ask about this photo'))))); Lab.markDone('photo:' + p[0], 2, 'photo studied'); if (scroll) big.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        PHOTOS.forEach((p) => grid.append(h('button', { style: { padding: 0, border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: '#000', aspectRatio: '1' }, onclick: () => show(p) }, h('img', { src: IMG(p[0]), alt: p[1], loading: 'lazy', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }))));
        show(PHOTOS[1], false);
      }
    }
    render();
    return () => { alive = false; if (st) st.dispose(); };
  },
});
Lab.subject('physics').ex.unshift(['worlds', 'Real worlds (NASA)']);
