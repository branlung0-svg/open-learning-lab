const { h } = Lab;

// ---------- shared 3D stage ----------
async function stage(el, { camPos = [0, 1, 4], target = [0, 1, 0], bg = null, height = 520 } = {}) {
  const THREE = await import('three');
  const { OrbitControls } = await import('../vendor/OrbitControls.js');
  const wrap = h('div', { class: 'viz', style: { height: height + 'px', background: 'radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--accent) 16%, var(--card2)), var(--card2))' } });
  el.append(wrap);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.localClippingEnabled = true;
  wrap.append(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';
  const scene = new THREE.Scene();
  if (bg) scene.background = new THREE.Color(bg);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 200);
  camera.position.set(...camPos);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...target); controls.enableDamping = true; controls.update();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x99bbff, 1.0); rim.position.set(-4, 2, -3); scene.add(rim);
  const resize = () => { const w = wrap.clientWidth, hh = wrap.clientHeight; renderer.setSize(w, hh, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'; camera.aspect = w / hh; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(wrap); resize();
  const ticks = []; let raf, alive = true;
  const loop = (t) => { if (!alive) return; controls.update(); ticks.forEach((f) => f(t)); renderer.render(scene, camera); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  // picking
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null; const pickables = []; let onPick = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(pickables.filter((o) => o.visible && isShown(o)), true);
    const hit = hits.find((x) => findInfo(x.object));
    if (hit && onPick) onPick(findInfo(hit.object), hit.object);
  });
  const isShown = (o) => { while (o) { if (!o.visible) return false; o = o.parent; } return true; };
  const findInfo = (o) => { while (o) { if (o.userData && o.userData.info) return o.userData.info; o = o.parent; } return null; };
  return { THREE, scene, camera, renderer, controls, wrap, ticks, pickables, setPick: (f) => (onPick = f),
    dispose() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); scene.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()); }); } };
}
Lab.stage3d = stage;

function infoCard(box, info, accent) {
  box.innerHTML = '';
  box.append(h('div', null, h('span', { class: 'tag', style: { '--c': info.color || accent } }, info.system || 'Part'), h('h3', { style: { marginTop: '8px' } }, info.name), h('p', null, info.what),
    info.facts ? h('ul', { class: 'small' }, info.facts.map((f) => h('li', null, f))) : null,
    info.life ? Lab.apply(info.life) : null,
    h('div', { style: { height: '8px' } }),
    h('button', { class: 'btn sm', onclick: () => Lab.ask(`Teach me about the ${info.name}: how it works step by step, what goes wrong in common diseases, and one surprising fact. Then quiz me with one question.`, `3D anatomy: ${info.name}`) }, '✦ Go deeper with the tutor')));
  Lab.setContext(`Biology 3D explorer, selected: ${info.name}. ${info.what}`);
  Lab.addXP(2);
}

// ---------- 3D BODY ----------
const BODY = {
  brain: { name: 'Brain', system: 'Nervous system', color: '#F472B6', what: 'Your control center: about 86 billion neurons connected by trillions of synapses. It weighs about 1.3–1.4 kg, roughly 2% of body weight, but uses about 20% of your energy at rest.', facts: ['Neuron count of ~86 billion comes from a 2009 study that dissolved brains and counted nuclei (Azevedo et al.)', 'The outer cortex is folded so more of it fits in the skull'], life: 'sleep is when the brain consolidates what you learned that day. Adults generally need 7–9 hours; studying then sleeping beats an all-nighter.' },
  cord: { name: 'Spinal cord', system: 'Nervous system', color: '#FACC15', what: 'A cable of nerve tissue about 45 cm long running inside the spine, carrying signals between brain and body. Some reflexes are handled right here without the brain.', facts: ['The fastest nerve fibers carry signals at up to about 120 m/s', 'Injury blocks signals below the damage, which is why spinal injuries cause paralysis'] },
  nerves: { name: 'Peripheral nerves', system: 'Nervous system', color: '#FACC15', what: 'Nerves branch from the spinal cord to every muscle and patch of skin. The sciatic nerve, running down the back of each leg, is the longest and thickest in the body.', facts: ['Sensory nerves carry information in; motor nerves carry commands out'] },
  heart: { name: 'Heart', system: 'Circulatory system', color: '#E11D48', what: 'A muscular pump about the size of a fist, with four chambers. The right side sends blood to the lungs for oxygen; the left side pumps it to the rest of the body.', facts: ['Beats about 100,000 times a day', 'Pumps about 5 liters a minute at rest, several times that in hard exercise', 'Heart disease is the leading cause of death worldwide (WHO)'], life: 'the WHO recommends 150–300 minutes of moderate exercise a week for adults. A lower resting heart rate over months is one sign your fitness is improving.' },
  aorta: { name: 'Aorta & arteries', system: 'Circulatory system', color: '#DC2626', what: 'Arteries carry oxygen-rich blood away from the heart under high pressure. The aorta, the largest, is about 2.5 cm wide; it arches over the heart and runs down in front of the spine.', facts: ['Blood pressure is measured in arteries: the top number is pressure during a beat, the bottom between beats'] },
  veins: { name: 'Veins', system: 'Circulatory system', color: '#2563EB', what: 'Veins return blood to the heart at low pressure. One-way valves and squeezing leg muscles keep blood moving upward against gravity.', facts: ['Blood in veins is dark red, not blue; it looks blue through skin because of how light scatters'] },
  lungs: { name: 'Lungs', system: 'Respiratory system', color: '#FB7185', what: 'Air flows down branching tubes into roughly 480 million tiny sacs (alveoli), where oxygen passes into the blood and carbon dioxide passes out.', facts: ['The alveoli count is from a 2004 study by Ochs and colleagues', 'You breathe about 20,000 times a day', 'The left lung is smaller to make room for the heart'], life: 'smoking and vaping damage the alveoli and airways; lung capacity you lose this way does not fully come back.' },
  liver: { name: 'Liver', system: 'Digestive system', color: '#92400E', what: 'Your largest internal organ (about 1.5 kg). It processes nutrients from the gut, makes bile and blood proteins, stores sugar, and breaks down alcohol, drugs and toxins.', facts: ['It can regrow lost tissue; living donors can give part of theirs', 'Long-term heavy drinking scars it (cirrhosis)'], life: 'the liver handles alcohol at a fixed pace, roughly one standard drink per hour; drinking faster just raises blood alcohol.' },
  stomach: { name: 'Stomach', system: 'Digestive system', color: '#F59E0B', what: 'A stretchy muscular bag that churns food with acid (pH about 1.5–3.5) and enzymes, turning it into a paste that moves on to the small intestine.', facts: ['A mucus lining stops the acid digesting the stomach itself', 'Most ulcers are caused by H. pylori bacteria, a discovery that won the 2005 Nobel Prize'] },
  intestine: { name: 'Small intestine', system: 'Digestive system', color: '#FBBF24', what: 'Where most nutrients are absorbed. It is several meters long (about 3–5 m in living people), and folds and tiny projections give it a surface of roughly 30 m².', facts: ['Surface area estimate: Helander & Fändriks (2014)'] },
  colon: { name: 'Large intestine', system: 'Digestive system', color: '#D97706', what: 'About 1.5 m long. It absorbs water and salts, and hosts most of your gut bacteria, which ferment fiber into useful compounds.', facts: ['Your body carries roughly as many bacterial cells as human cells (about 38 trillion bacteria, Sender et al. 2016)'], life: 'fiber from plants feeds these bacteria; most adults eat less than recommended.' },
  kidneys: { name: 'Kidneys', system: 'Urinary system', color: '#7C2D12', what: 'Two bean-shaped filters near your back. Together they filter about 180 liters of blood plasma a day, returning almost all of it and making 1–2 liters of urine.', facts: ['They also control blood pressure, salt balance and red blood cell production'] },
  bladder: { name: 'Bladder', system: 'Urinary system', color: '#CA8A04', what: 'A muscular bag that stores urine, comfortably about 400–600 mL in adults.' },
  skull: { name: 'Skull', system: 'Skeleton', color: '#D6CFC0', what: '22 bones (8 around the brain, 14 in the face) locked together by seams called sutures; only the jaw moves.' },
  spine: { name: 'Spine', system: 'Skeleton', color: '#D6CFC0', what: '33 vertebrae: 24 movable ones (7 neck, 12 chest, 5 lower back), plus the fused sacrum and tailbone. Discs between them absorb shock.', life: 'most back pain is not serious and improves with staying active; lifting with your legs and a neutral spine reduces strain.' },
  ribs: { name: 'Rib cage', system: 'Skeleton', color: '#D6CFC0', what: '12 pairs of ribs protect the heart and lungs and move with every breath.' },
  pelvis: { name: 'Pelvis', system: 'Skeleton', color: '#D6CFC0', what: 'A bowl of fused bones that carries your upper body’s weight to the legs and protects the bladder and other organs.' },
  limbs: { name: 'Limb bones', system: 'Skeleton', color: '#D6CFC0', what: 'The femur (thigh bone) is the longest and strongest bone in the body. Adults have 206 bones; babies start with around 270–300 that fuse as they grow.', life: 'bones get denser from load: weight-bearing exercise and strength training in your teens and twenties build peak bone mass that protects you later.' },
  skin: { name: 'Skin', system: 'Skin', color: '#E8B796', what: 'Your largest organ, about 1.8 m² in an adult. It keeps water in and germs out, senses touch and temperature, and makes vitamin D in sunlight.', life: 'sunscreen and avoiding burns lower skin cancer risk, the most common cancer type.' },
};

Lab.explorer('body', 'body3d', {
  async mount(el) {
    const layerRow = h('div', { class: 'row' });
    const info = h('div', { class: 'card' }, h('h3', null, 'Tap any part'), h('p', { class: 'muted small' }, 'Drag to rotate, pinch or scroll to zoom. Turn systems on and off above the model.'));
    const holder = h('div');
    el.append(h('div', { class: 'card' }, layerRow, h('div', { style: { height: '10px' } }), holder,
      h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, 'A simplified teaching model built from basic shapes, with organs in their real positions and approximate sizes. For a medically detailed model, try the free Z-Anatomy app (open source) alongside this.')), info);
    const S = await stage(holder, { camPos: [0, 1.25, 2.6], target: [0, 1.05, 0], height: 560 });
    const { THREE, scene } = S;
    const groups = {};
    const layer = (k) => (groups[k] ||= (() => { const g = new THREE.Group(); scene.add(g); return g; })());
    const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...o });
    const add = (k, geo, m, pos, info, rot, scale) => { const me = new THREE.Mesh(geo, m); me.position.set(...pos); if (rot) me.rotation.set(...rot); if (scale) me.scale.set(...scale); me.userData.info = info; layer(k).add(me); S.pickables.push(me); return me; };
    const tube = (k, pts, r, color, info) => { const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))); return add(k, new THREE.TubeGeometry(c, Math.max(24, pts.length * 12), r, 10, false), mat(color), [0, 0, 0], info); };
    const mirror = (f) => [1, -1].forEach(f);
    // SKIN (translucent)
    const skinM = mat(0xe8b796, { transparent: true, opacity: 0.16, depthWrite: false, roughness: 0.8 });
    add('skin', new THREE.SphereGeometry(0.105, 32, 24), skinM, [0, 1.66, 0], BODY.skin, null, [0.92, 1.1, 1]);
    add('skin', new THREE.CylinderGeometry(0.05, 0.055, 0.1, 20), skinM, [0, 1.53, 0], BODY.skin);
    const torso = new THREE.LatheGeometry([[0.001, 0.86], [0.16, 0.88], [0.17, 0.98], [0.15, 1.1], [0.16, 1.25], [0.185, 1.4], [0.17, 1.47], [0.07, 1.5], [0.001, 1.505]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
    add('skin', torso, skinM, [0, 0, 0], BODY.skin, null, [1, 1, 0.62]);
    mirror((s) => { add('skin', new THREE.CapsuleGeometry(0.045, 0.52, 8, 16), skinM, [s * 0.23, 1.2, 0], BODY.skin, [0, 0, s * 0.12]); add('skin', new THREE.CapsuleGeometry(0.07, 0.72, 8, 16), skinM, [s * 0.09, 0.46, 0], BODY.skin); });
    // SKELETON
    const bone = mat(0xe9e2d0, { roughness: 0.7 });
    add('skeleton', new THREE.SphereGeometry(0.095, 32, 24), bone, [0, 1.67, -0.005], BODY.skull, null, [0.88, 1.05, 1.08]);
    add('skeleton', new THREE.BoxGeometry(0.1, 0.035, 0.08), bone, [0, 1.57, 0.035], BODY.skull);
    for (let i = 0; i < 24; i++) { const y = 1.53 - i * 0.026; add('skeleton', new THREE.CylinderGeometry(0.018, 0.02, 0.018, 12), bone, [0, y, -0.06 + (i > 6 && i < 19 ? -0.01 : 0)], BODY.spine); }
    add('skeleton', new THREE.ConeGeometry(0.045, 0.1, 12), bone, [0, 0.86, -0.07], BODY.spine, [Math.PI, 0, 0]);
    for (let i = 0; i < 12; i++) { const y = 1.43 - i * 0.022, rx = 0.08 + Math.sin((i / 11) * Math.PI) * 0.06 + i * 0.003; const g = new THREE.TorusGeometry(1, 0.006 / rx * 1.0, 6, 40, Math.PI * 1.6); const m = add('skeleton', g, bone, [0, y, -0.01], BODY.ribs, [Math.PI / 2 + 0.25, 0, Math.PI * 1.7]); m.scale.set(rx, rx * 0.62, rx); }
    add('skeleton', new THREE.BoxGeometry(0.025, 0.17, 0.012), bone, [0, 1.33, 0.085], BODY.ribs);
    mirror((s) => add('skeleton', new THREE.CylinderGeometry(0.008, 0.008, 0.15, 8), bone, [s * 0.08, 1.47, 0.03], BODY.limbs, [0, 0, Math.PI / 2 + s * 0.15]));
    const pel = new THREE.TorusGeometry(0.11, 0.025, 10, 30, Math.PI * 2); add('skeleton', pel, bone, [0, 0.93, -0.01], BODY.pelvis, [Math.PI / 2 - 0.4, 0, 0], [1.1, 0.85, 1]);
    mirror((s) => {
      add('skeleton', new THREE.CylinderGeometry(0.014, 0.012, 0.29, 10), bone, [s * 0.215, 1.31, 0], BODY.limbs, [0, 0, s * 0.1]);
      add('skeleton', new THREE.CylinderGeometry(0.011, 0.009, 0.25, 10), bone, [s * 0.243, 1.04, 0.01], BODY.limbs, [0, 0, s * 0.1]);
      add('skeleton', new THREE.BoxGeometry(0.05, 0.08, 0.018), bone, [s * 0.262, 0.87, 0.015], BODY.limbs);
      add('skeleton', new THREE.CylinderGeometry(0.02, 0.016, 0.42, 12), bone, [s * 0.1, 0.66, 0], BODY.limbs, [0, 0, s * -0.04]);
      add('skeleton', new THREE.SphereGeometry(0.022, 12, 10), bone, [s * 0.09, 0.44, 0.012], BODY.limbs);
      add('skeleton', new THREE.CylinderGeometry(0.016, 0.012, 0.38, 12), bone, [s * 0.088, 0.24, 0], BODY.limbs);
      add('skeleton', new THREE.BoxGeometry(0.06, 0.03, 0.15), bone, [s * 0.088, 0.03, 0.04], BODY.limbs);
    });
    // ORGANS
    const brainGeo = new THREE.IcosahedronGeometry(0.085, 5); const p = brainGeo.attributes.position; const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + 0.045 * Math.sin(v.x * 140) * Math.sin(v.y * 120) * Math.sin(v.z * 130); v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); } brainGeo.computeVertexNormals();
    add('organs', brainGeo, mat(0xf3a6bd), [0, 1.69, -0.01], BODY.brain, null, [0.9, 0.8, 1.12]);
    mirror((s) => add('organs', new THREE.SphereGeometry(1, 28, 20), mat(0xf5a3b1, { roughness: 0.6 }), [s * 0.075, 1.3, 0.005], BODY.lungs, null, [s > 0 ? 0.058 : 0.068, 0.12, 0.07]));
    add('organs', new THREE.SphereGeometry(1, 28, 20), mat(0x8a3b1f), [-0.05, 1.13, 0.03], BODY.liver, [0, 0, 0.35], [0.11, 0.055, 0.075]);
    add('organs', new THREE.SphereGeometry(1, 24, 18), mat(0xf2b45a), [0.065, 1.1, 0.04], BODY.stomach, [0, 0, -0.6], [0.06, 0.04, 0.045]);
    mirror((s) => add('organs', new THREE.SphereGeometry(1, 20, 16), mat(0x7c2d12), [s * 0.065, 1.06, -0.05], BODY.kidneys, [0, 0, s * 0.2], [0.028, 0.05, 0.025]));
    add('organs', new THREE.SphereGeometry(0.035, 20, 16), mat(0xe5c07b), [0, 0.89, 0.05], BODY.bladder);
    const si = []; for (let i = 0; i < 140; i++) { const t = i / 139, a = t * Math.PI * 14; si.push([Math.cos(a) * (0.05 + 0.02 * Math.sin(t * 9)), 1.03 - t * 0.1, 0.05 + Math.sin(a) * 0.035]); }
    tube('organs', si, 0.011, 0xf6c35c, BODY.intestine);
    tube('organs', [[-0.075, 0.93, 0.04], [-0.085, 1.0, 0.045], [-0.085, 1.07, 0.05], [-0.04, 1.085, 0.065], [0.04, 1.085, 0.065], [0.085, 1.07, 0.05], [0.085, 1.0, 0.045], [0.07, 0.93, 0.04], [0.02, 0.9, 0.0]], 0.019, 0xc98a3c, BODY.colon);
    // HEART & VESSELS
    const heart = add('vessels', new THREE.SphereGeometry(1, 28, 22), mat(0xc81e3a, { roughness: 0.45 }), [0.02, 1.29, 0.04], BODY.heart, [0, 0, -0.5], [0.045, 0.06, 0.042]);
    S.ticks.push((t) => { const b = 1 + 0.06 * Math.max(0, Math.sin(t / 1000 * Math.PI * 2 * 1.15)) ** 8; heart.scale.set(0.045 * b, 0.06 * b, 0.042 * b); });
    tube('vessels', [[0.02, 1.32, 0.03], [0.01, 1.39, 0.03], [-0.02, 1.4, 0.0], [-0.02, 1.35, -0.04], [-0.01, 1.2, -0.04], [0, 1.0, -0.035], [0, 0.95, -0.03]], 0.012, 0xd61f2c, BODY.aorta);
    mirror((s) => { tube('vessels', [[0, 0.95, -0.03], [s * 0.05, 0.88, 0], [s * 0.09, 0.7, 0.01], [s * 0.095, 0.45, 0.02], [s * 0.088, 0.1, 0.0]], 0.007, 0xd61f2c, BODY.aorta);
      tube('vessels', [[-0.01, 1.39, 0.02], [s * 0.02, 1.48, 0.02], [s * 0.03, 1.6, 0.03]], 0.005, 0xd61f2c, BODY.aorta);
      tube('vessels', [[-0.01, 1.4, 0.0], [s * 0.1, 1.44, 0.0], [s * 0.2, 1.4, 0.0], [s * 0.24, 1.1, 0.02], [s * 0.26, 0.9, 0.02]], 0.005, 0xd61f2c, BODY.aorta);
      tube('vessels', [[-0.03, 0.95, -0.01], [s * 0.06, 0.87, 0.01], [s * 0.1, 0.7, 0.02], [s * 0.1, 0.45, 0.03], [s * 0.093, 0.1, 0.01]], 0.007, 0x2f5bd3, BODY.veins);
      tube('vessels', [[-0.03, 1.39, 0.01], [s * 0.035, 1.48, 0.01], [s * 0.045, 1.6, 0.02]], 0.005, 0x2f5bd3, BODY.veins); });
    tube('vessels', [[-0.03, 0.95, -0.01], [-0.03, 1.1, -0.02], [-0.025, 1.28, 0.02], [-0.03, 1.39, 0.01]], 0.011, 0x2f5bd3, BODY.veins);
    // NERVES
    tube('nerves', [[0, 1.58, -0.04], [0, 1.45, -0.06], [0, 1.2, -0.075], [0, 1.0, -0.07]], 0.008, 0xf2c94c, BODY.cord);
    mirror((s) => { tube('nerves', [[0, 1.0, -0.07], [s * 0.04, 0.9, -0.06], [s * 0.09, 0.7, -0.03], [s * 0.09, 0.45, -0.02], [s * 0.085, 0.1, -0.01]], 0.0045, 0xf2c94c, BODY.nerves);
      tube('nerves', [[0, 1.45, -0.06], [s * 0.1, 1.43, -0.02], [s * 0.21, 1.38, 0.0], [s * 0.245, 1.1, 0.0], [s * 0.265, 0.88, 0.01]], 0.0035, 0xf2c94c, BODY.nerves); });
    const LAYERS = [['skin', 'Skin', '#E8B796', true], ['skeleton', 'Skeleton', '#BFB6A0', true], ['organs', 'Organs', '#F59E0B', true], ['vessels', 'Heart & vessels', '#E11D48', true], ['nerves', 'Nerves', '#EAB308', false]];
    LAYERS.forEach(([k, n, c, on]) => { layer(k).visible = on; const ch = h('span', { class: 'chip' + (on ? ' on' : ''), style: { '--c': c } }, h('i'), n); ch.onclick = () => { layer(k).visible = !layer(k).visible; ch.classList.toggle('on'); }; layerRow.append(ch); });
    layerRow.append(h('span', { class: 'sp' }), h('button', { class: 'btn sm', onclick: () => { S.controls.autoRotate = !S.controls.autoRotate; } }, '⟳ Spin'));
    S.controls.autoRotate = true; S.controls.autoRotateSpeed = 1.2;
    S.setPick((inf) => { S.controls.autoRotate = false; infoCard(info, inf, '#F43F5E'); });
    return () => S.dispose();
  },
});

// ---------- 3D CELL ----------
const CELL = {
  membrane: { name: 'Cell membrane', system: 'Boundary', color: '#38BDF8', what: 'A double layer of fat molecules studded with proteins. It decides what gets in and out: channels, pumps and receptors act as gates and antennas.', facts: ['About 5–10 nanometers thick: roughly 10,000 stacked would equal a sheet of paper'] },
  nucleus: { name: 'Nucleus', system: 'Control', color: '#7C3AED', what: 'Holds your DNA: about 2 meters of it per cell, wound around proteins and packed into 46 chromosomes. Genes are copied into RNA here.', facts: ['Nearly every cell in your body carries the same ~3.1 billion DNA letters; what differs is which genes are switched on'] },
  nucleolus: { name: 'Nucleolus', system: 'Control', color: '#4C1D95', what: 'A dense region inside the nucleus that builds ribosomes, the cell’s protein factories.' },
  mito: { name: 'Mitochondria', system: 'Energy', color: '#F97316', what: 'Burn sugar and fat with oxygen to make ATP, the cell’s energy currency. They have their own small DNA (16,569 letters, 37 genes), inherited from your mother.', facts: ['They likely descend from bacteria swallowed by an ancestor cell about 1.5–2 billion years ago (endosymbiosis): Established by DNA evidence', 'A muscle cell can have thousands'], life: 'endurance training makes muscle cells build more mitochondria. It is one reason fitness improves.' },
  er: { name: 'Endoplasmic reticulum', system: 'Manufacturing', color: '#3B82F6', what: 'A maze of folded membranes. The “rough” part, dotted with ribosomes, makes proteins for export; the “smooth” part makes fats and handles toxins.' },
  golgi: { name: 'Golgi apparatus', system: 'Shipping', color: '#F59E0B', what: 'The post office: it receives proteins from the ER, modifies and labels them, and packs them into bubbles (vesicles) for delivery.' },
  ribo: { name: 'Ribosomes', system: 'Manufacturing', color: '#64748B', what: 'Molecular machines that read messenger RNA three letters at a time and chain amino acids into proteins. Try it yourself in DNA → protein.', facts: ['A cell can have millions of them'] },
  lyso: { name: 'Lysosomes', system: 'Recycling', color: '#22C55E', what: 'Bubbles of digestive enzymes that break down worn-out parts and invaders.', facts: ['When one enzyme is missing, waste builds up: Tay-Sachs disease is one example'] },
  centro: { name: 'Centrosome', system: 'Structure', color: '#EC4899', what: 'Organizes the cell’s skeleton of protein tubes and pulls chromosomes apart when the cell divides.' },
  vesicle: { name: 'Vesicles', system: 'Shipping', color: '#FBBF24', what: 'Small membrane bubbles that carry cargo between compartments or out of the cell (how neurons release signals, for example).' },
};
Lab.explorer('body', 'cell', {
  async mount(el) {
    const ctrls = h('div', { class: 'row' });
    const info = h('div', { class: 'card' }, h('h3', null, 'Tap a part of the cell'), h('p', { class: 'muted small' }, 'This is a typical animal cell, about 20 micrometers across: five of them would fit across the width of a human hair. Your body has roughly 30–37 trillion.'));
    const holder = h('div');
    const found = h('span', { class: 'muted small' });
    el.append(h('div', { class: 'card' }, ctrls, h('div', { style: { height: '10px' } }), holder, h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, 'Cell counts: Sender, Fuchs & Milo (2016) estimate ~30 trillion; Bianconi et al. (2013) ~37 trillion. Real cells are crowded; parts here are spread out so you can see them.')), info);
    const S = await stage(holder, { camPos: [0, 1.5, 6], target: [0, 0, 0], height: 520 });
    const { THREE, scene } = S;
    const clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.2);
    const seen = new Set();
    const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o });
    const add = (geo, m, pos, inf, rot, sc) => { const me = new THREE.Mesh(geo, m); me.position.set(...pos); if (rot) me.rotation.set(...rot); if (sc) me.scale.set(...sc); me.userData.info = inf; scene.add(me); S.pickables.push(me); return me; };
    const mem = add(new THREE.SphereGeometry(2.2, 64, 48), mat(0x7dd3fc, { transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false, clippingPlanes: [clip] }), [0, 0, 0], CELL.membrane);
    const memEdge = new THREE.Mesh(new THREE.SphereGeometry(2.21, 64, 48), new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.08, clippingPlanes: [clip] })); scene.add(memEdge);
    add(new THREE.SphereGeometry(0.75, 48, 32), mat(0x8b5cf6, { transparent: true, opacity: 0.85 }), [0.1, 0.05, -0.2], CELL.nucleus);
    add(new THREE.SphereGeometry(0.28, 32, 20), mat(0x4c1d95), [0.25, 0.15, 0.1], CELL.nucleolus);
    for (let i = 0; i < 6; i++) { const t = new THREE.TorusGeometry(1.0 + i * 0.12, 0.035, 8, 60, Math.PI * (0.8 + (i % 3) * 0.15)); add(t, mat(0x60a5fa), [0.1, 0.05, -0.2], CELL.er, [Math.PI / 2 + i * 0.12, i * 0.3, i * 0.8]); }
    for (let i = 0; i < 5; i++) add(new THREE.TorusGeometry(0.45 - i * 0.03, 0.045, 8, 40, Math.PI * 0.9), mat(0xf59e0b), [-1.15, -0.55 + i * 0.12, 0.6], CELL.golgi, [Math.PI / 2, 0, 0.6]);
    const rand = (r) => { const v = new THREE.Vector3(); do v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); while (v.length() > 1); return v.multiplyScalar(r); };
    let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 9; i++) { let p; do p = new THREE.Vector3(rnd() * 3.4 - 1.7, rnd() * 3.4 - 1.7, rnd() * 3.4 - 1.7); while (p.length() > 1.75 || p.distanceTo(new THREE.Vector3(0.1, 0.05, -0.2)) < 1.2); add(new THREE.CapsuleGeometry(0.13, 0.35, 8, 16), mat(0xf97316), [p.x, p.y, p.z], CELL.mito, [rnd() * 3, rnd() * 3, rnd() * 3]); }
    for (let i = 0; i < 7; i++) { let p; do p = new THREE.Vector3(rnd() * 3.4 - 1.7, rnd() * 3.4 - 1.7, rnd() * 3.4 - 1.7); while (p.length() > 1.8 || p.length() < 1.2); add(new THREE.SphereGeometry(0.11, 16, 12), mat(0x22c55e), [p.x, p.y, p.z], CELL.lyso); }
    for (let i = 0; i < 8; i++) add(new THREE.SphereGeometry(0.06, 12, 10), mat(0xfbbf24), [-1.4 + rnd() * 0.5, -0.5 + rnd() * 0.8, 0.9 + rnd() * 0.4], CELL.vesicle);
    const c1 = add(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), mat(0xec4899), [0.9, 0.9, 0.5], CELL.centro); add(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), mat(0xec4899), [0.95, 0.9, 0.5], CELL.centro, [0, 0, Math.PI / 2]);
    const ribo = new THREE.InstancedMesh(new THREE.SphereGeometry(0.025, 6, 5), mat(0x475569), 500); const dm = new THREE.Object3D();
    for (let i = 0; i < 500; i++) { const p = i < 200 ? (() => { const a = rnd() * Math.PI * 2, b = rnd() * Math.PI, r = 1.0 + rnd() * 0.7; return new THREE.Vector3(0.1 + r * Math.sin(b) * Math.cos(a), 0.05 + r * Math.cos(b), -0.2 + r * Math.sin(b) * Math.sin(a)); })() : rand(2.0); dm.position.copy(p); dm.updateMatrix(); ribo.setMatrixAt(i, dm.matrix); }
    ribo.userData.info = CELL.ribo; scene.add(ribo); S.pickables.push(ribo);
    let cut = false;
    ctrls.append(h('button', { class: 'btn sm primary', onclick: (e) => { cut = !cut; clip.constant = cut ? 0.0 : 3; e.target.textContent = cut ? 'Close the cell' : 'Cut it open'; } }, 'Cut it open'), h('button', { class: 'btn sm', onclick: () => (S.controls.autoRotate = !S.controls.autoRotate) }, '⟳ Spin'), h('span', { class: 'sp' }), found);
    clip.constant = 3;
    S.controls.autoRotate = true; S.controls.autoRotateSpeed = 0.8;
    const total = Object.keys(CELL).length;
    found.textContent = `Found 0 of ${total} parts`;
    S.setPick((inf) => { S.controls.autoRotate = false; infoCard(info, inf, '#F43F5E'); seen.add(inf.name); found.textContent = `Found ${seen.size} of ${total} parts`; if (seen.size === total) Lab.markDone('cell:all', 30, 'every organelle found'); });
    return () => S.dispose();
  },
});

// ---------- DNA → PROTEIN ----------
const HBB = 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA';
const B = 'TCAG', AAS = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const CODE = {}; [...B].forEach((a, i) => [...B].forEach((b, j) => [...B].forEach((c, k) => (CODE[a + b + c] = AAS[16 * i + 4 * j + k]))));
const AANAME = { A: 'Alanine', R: 'Arginine', N: 'Asparagine', D: 'Aspartate', C: 'Cysteine', E: 'Glutamate', Q: 'Glutamine', G: 'Glycine', H: 'Histidine', I: 'Isoleucine', L: 'Leucine', K: 'Lysine', M: 'Methionine (start)', F: 'Phenylalanine', P: 'Proline', S: 'Serine', T: 'Threonine', W: 'Tryptophan', Y: 'Tyrosine', V: 'Valine', '*': 'STOP' };
const AACLASS = { A: 'h', V: 'h', L: 'h', I: 'h', M: 'h', F: 'h', W: 'h', P: 'h', G: 'n', S: 'p', T: 'p', C: 'p', Y: 'p', N: 'p', Q: 'p', D: '-', E: '-', K: '+', R: '+', H: '+', '*': 'x' };
const CLS = { h: ['Water-avoiding', '#F59E0B'], n: ['Tiny', '#94A3B8'], p: ['Water-loving', '#10B981'], '-': ['Negative charge', '#EF4444'], '+': ['Positive charge', '#3B82F6'], x: ['Stop', '#111827'] };
const BASEC = { A: '#22C55E', T: '#EF4444', G: '#F59E0B', C: '#3B82F6' };
const translate = (s) => { let out = ''; for (let i = 0; i + 2 < s.length; i += 3) { const a = CODE[s.slice(i, i + 3)]; out += a; if (a === '*') break; } return out; };

Lab.explorer('body', 'dna', {
  async mount(el) {
    let seq = HBB.split('');
    const SHOW = 30; // codons shown in 3D and strip
    const holder = h('div');
    const strip = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } });
    const verdict = h('div', { class: 'hint' });
    const protein = h('div', { style: { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '13px', wordBreak: 'break-all', lineHeight: 1.7 } });
    el.append(
      h('div', { class: 'card' }, h('h3', null, 'A real human gene: beta-globin (HBB)'),
        h('p', { class: 'small' }, 'This is the actual DNA code for one chain of hemoglobin, the protein that carries oxygen in your red blood cells: 444 letters on chromosome 11 (the coding part only). Every 3 letters (a codon) tells the ribosome which amino acid to add next.'),
        holder,
        h('div', { class: 'row', style: { marginTop: '10px' } },
          h('button', { class: 'btn sm primary', onclick: () => { seq = HBB.split(''); seq[19] = 'T'; render(); Lab.markDone('dna:sickle', 20, 'made the sickle-cell mutation'); } }, '🩸 Make the sickle-cell mutation'),
          h('button', { class: 'btn sm', onclick: () => { seq = HBB.split(''); render(); } }, 'Reset to normal'),
          h('span', { class: 'muted small' }, 'Or tap any letter below to change it.'))),
      h('div', { class: 'card' }, h('h3', null, 'Read it like a ribosome'), h('p', { class: 'tiny muted' }, `First ${SHOW} codons. Top: DNA. Bottom: the amino acid it codes for, colored by chemistry.`), strip, h('div', { style: { height: '10px' } }), verdict),
      h('div', { class: 'card' }, h('h3', null, 'The whole protein'), h('p', { class: 'tiny muted' }, 'All 147 amino acids. Changed ones are highlighted.'), protein,
        h('div', { class: 'row small', style: { marginTop: '10px', gap: '12px' } }, Object.values(CLS).map(([n, c]) => h('span', { class: 'row', style: { gap: '5px' } }, h('i', { style: { width: '10px', height: '10px', borderRadius: '3px', background: c, display: 'inline-block' } }), n)))),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'Why one letter matters'), h('p', { class: 'small' }, 'Changing codon 7 from GAG to GTG swaps a water-loving, negatively charged amino acid (glutamate) for a water-avoiding one (valine) on the surface of hemoglobin. When oxygen is low, these sticky patches make hemoglobin molecules clump into long fibers that bend red blood cells into sickles. They jam small blood vessels, causing pain, organ damage and anemia.'),
          h('p', { class: 'small' }, 'Doctors call it E6V or Glu6Val: they count from the second amino acid because the first (methionine) is cut off after the protein is made.'), Lab.conf('Established')),
        h('div', { class: 'card' }, h('h3', null, 'Why evolution kept it'), h('p', { class: 'small' }, 'People with one sickle copy and one normal copy (sickle-cell trait) are usually healthy and are strongly protected against severe malaria. That is why the variant is common where malaria was common: in parts of sub-Saharan Africa 10–40% of people carry it (WHO). Two copies cause sickle-cell disease.'),
          h('p', { class: 'small' }, 'In 2023 the US and UK approved the first CRISPR gene-editing therapy for sickle-cell disease (Casgevy).'), Lab.conf('Established'),
          h('button', { class: 'btn sm', style: { marginTop: '8px' }, onclick: () => Lab.ask('Walk me through how DNA becomes a protein (transcription and translation) using the beta-globin gene and the sickle-cell mutation as the example. Then explain how CRISPR therapy for sickle cell works.', 'DNA → protein: HBB and sickle cell') }, '✦ Explain transcription & CRISPR'))),
      h('div', { class: 'card' }, h('h3', null, 'Your genome at scale'), h('div', { class: 'grid g4' },
        [['3.1 billion', 'DNA letters in one copy of your genome'], ['~20,000', 'protein-coding genes'], ['~1–2%', 'of the genome codes for proteins'], ['99.9%', 'identical between any two people']].map(([k, t]) => h('div', null, h('div', { class: 'kpi' }, k), h('div', { class: 'small muted' }, t)))),
        Lab.source('<a href="https://www.ncbi.nlm.nih.gov/gene/3043">NCBI Gene: HBB</a> (sequence NM_000518 coding region); human genome figures from the Telomere-to-Telomere Consortium (2022) and NHGRI; carrier rates from the WHO.')));
    const S = await stage(holder, { camPos: [0, 0, 9], target: [0, 0, 0], height: 300 });
    const { THREE, scene } = S;
    const grp = new THREE.Group(); scene.add(grp);
    const comp = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const build = () => {
      while (grp.children.length) { const c = grp.children.pop(); c.geometry && c.geometry.dispose(); }
      const n = SHOW * 3, len = 16;
      for (let i = 0; i < n; i++) {
        const x = -len / 2 + (i / (n - 1)) * len, a = i * 0.6, r = 0.9;
        const p1 = new THREE.Vector3(x, Math.cos(a) * r, Math.sin(a) * r), p2 = new THREE.Vector3(x, -Math.cos(a) * r, -Math.sin(a) * r);
        const b = seq[i], changed = b !== HBB[i];
        for (const [p, base] of [[p1, b], [p2, comp[b]]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0xcbd5e1 })); s.position.copy(p); grp.add(s); }
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const mk = (from, to, col) => { const d = to.clone().sub(from); const c = new THREE.Mesh(new THREE.CylinderGeometry(changed ? 0.075 : 0.05, changed ? 0.075 : 0.05, d.length(), 8), new THREE.MeshStandardMaterial({ color: col, emissive: changed ? col : 0x000000, emissiveIntensity: changed ? 0.6 : 0 })); c.position.copy(from.clone().add(to).multiplyScalar(0.5)); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); grp.add(c); };
        mk(p1, mid, BASEC[b]); mk(mid, p2, BASEC[comp[b]]);
      }
    };
    S.ticks.push(() => (grp.rotation.x += 0.004));
    function render() {
      build();
      const prot = translate(seq.join('')), ref = translate(HBB);
      strip.innerHTML = '';
      for (let c = 0; c < SHOW; c++) {
        const cod = seq.slice(c * 3, c * 3 + 3).join(''), aa = CODE[cod], refAA = ref[c], diff = cod !== HBB.slice(c * 3, c * 3 + 3);
        const [cn, cc] = CLS[AACLASS[aa]];
        strip.append(h('div', { style: { textAlign: 'center', padding: '4px', borderRadius: '10px', border: diff ? '2px solid var(--bad)' : '1px solid var(--line)', background: 'var(--card)' } },
          h('div', { class: 'tiny muted' }, c + 1),
          h('div', { style: { display: 'flex', gap: '1px' } }, [0, 1, 2].map((k) => { const i = c * 3 + k; return h('span', { title: 'Tap to change', style: { cursor: 'pointer', fontFamily: 'ui-monospace,monospace', fontWeight: 700, width: '15px', color: BASEC[seq[i]] }, onclick: () => { seq[i] = 'ACGT'[('ACGT'.indexOf(seq[i]) + 1) % 4]; render(); } }, seq[i]); })),
          h('div', { title: AANAME[aa], style: { marginTop: '3px', fontWeight: 800, color: '#fff', background: cc, borderRadius: '6px', fontSize: '12px' } }, aa === '*' ? 'STOP' : aa)));
      }
      let kind, text;
      const diffs = []; for (let i = 0; i < Math.max(prot.length, ref.length); i++) if (prot[i] !== ref[i]) diffs.push(i);
      const ntDiff = seq.some((b, i) => b !== HBB[i]);
      if (!ntDiff) { kind = 'Normal'; text = 'This is the normal sequence: it makes healthy adult hemoglobin (HbA).'; }
      else if (!diffs.length) { kind = 'Silent mutation'; text = 'The DNA changed but the protein didn’t: several codons code for the same amino acid. Most single-letter changes in your genome are harmless like this.'; }
      else if (prot.length < ref.length && prot.endsWith('*')) { kind = 'Nonsense mutation'; text = `You created an early STOP at position ${prot.length}. The protein is cut short, so it can’t work. Some forms of beta-thalassemia are caused exactly like this.`; }
      else { const i = diffs[0]; kind = 'Missense mutation'; text = `Position ${i + 1}: ${AANAME[ref[i]]} → ${AANAME[prot[i]] || '?'}. ${seq.join('') === HBB.slice(0, 19) + 'T' + HBB.slice(20) ? 'This is the sickle-cell mutation (HbS).' : 'Whether this matters depends on where it is and how different the new amino acid is.'}`; }
      verdict.innerHTML = ''; verdict.append(h('b', null, kind + ': '), text);
      protein.innerHTML = '';
      [...prot].forEach((a, i) => protein.append(h('span', { style: { background: a !== ref[i] ? '#DC2626' : 'transparent', color: a !== ref[i] ? '#fff' : CLS[AACLASS[a]][1], fontWeight: a !== ref[i] ? 800 : 600, padding: '0 1px', borderRadius: '3px' } }, a)));
      Lab.setContext(`DNA explorer: HBB gene. Current state: ${kind}. ${text}`);
    }
    render();
    return () => S.dispose();
  },
});
