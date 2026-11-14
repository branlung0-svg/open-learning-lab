// Discipline deep dives: each registers a "Deep dive" chapter on its discipline page (#d-<id>-deep).
const reg = (disc, X, cfg) => X && Lab.deepdive.register('disc-' + disc, Object.assign({ host: 'disc', disc, data: X, ui: X.ui, side: X.side || {}, caseLabel: 'landmark cases' }, cfg));
reg('physics', Lab.DPHYS, { tab: 'Deep dive', title: 'Physics in depth', color: '#7C3AED', years: 'From Galileo to gravitational waves',
  labs: ['doubleslit', 'relativity', 'doppler'],
  sections: [['start', 'Start'], ['locker', 'Evidence'], ['ideas', 'Big ideas'], ['tree', 'Branches'], ['machine', 'Tools & methods'], ['cases', 'Landmark cases'], ['compare', 'Theories compared'], ['evidence', 'Gains & costs'], ['labs', 'Labs'], ['debates', 'Debates'], ['claims', 'Myth or fact'], ['reading', 'Reading room']] });
reg('chemistry', Lab.DCHEM, { tab: 'Deep dive', title: 'Chemistry in depth', color: '#EA580C', years: 'From Lavoisier to lithium batteries',
  labs: ['periodictrends', 'bondtype', 'battery'],
  sections: [['start', 'Start'], ['locker', 'Evidence'], ['ideas', 'Big ideas'], ['tree', 'Branches'], ['machine', 'Tools & methods'], ['cases', 'Landmark cases'], ['compare', 'Bonds compared'], ['evidence', 'Gains & harms'], ['labs', 'Labs'], ['debates', 'Debates'], ['claims', 'Myth or fact'], ['reading', 'Reading room']] });
reg('biology', Lab.DBIO, { tab: 'Deep dive', title: 'Biology in depth', color: '#16A34A', years: 'From cells and Darwin to CRISPR',
  labs: ['weasel', 'punnett', 'sir', 'resistance'],
  sections: [['start', 'Start'], ['locker', 'Evidence'], ['ideas', 'Big ideas'], ['tree', 'Branches'], ['machine', 'Tools & methods'], ['cases', 'Landmark cases'], ['compare', 'Kinds of life'], ['evidence', 'Gains & harms'], ['labs', 'Labs'], ['debates', 'Debates'], ['claims', 'Myth or fact'], ['reading', 'Reading room']] });
