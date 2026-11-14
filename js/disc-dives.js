// Discipline deep dives: each registers a "Deep dive" chapter on its discipline page (#d-<id>-deep).
const reg = (disc, X, cfg) => X && Lab.deepdive.register('disc-' + disc, Object.assign({ host: 'disc', disc, data: X, ui: X.ui, side: X.side || {}, caseLabel: 'landmark cases' }, cfg));
reg('physics', Lab.DPHYS, { tab: 'Deep dive', title: 'Physics in depth', color: '#7C3AED', years: 'From Galileo to gravitational waves',
  labs: ['doubleslit', 'relativity', 'doppler'],
  sections: [['start', 'Start'], ['ideas', 'Big ideas'], ['tree', 'Branches'], ['machine', 'Tools & methods'], ['cases', 'Landmark cases'], ['compare', 'Theories compared'], ['evidence', 'Gains & costs'], ['labs', 'Labs'], ['debates', 'Debates'], ['claims', 'Myth or fact'], ['reading', 'Reading room']] });
