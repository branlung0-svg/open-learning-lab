# Build log

Newest first. Every run adds one entry at the top.

## 2026-11-14 02:28 UTC · CAP-0
Done: New `js/deepdive.js` renders any ideology deep dive from a data object (`Lab.deepdive.register`, registry `Lab.DEEPDIVES`); Marxism–Leninism now goes through it, with its page text moved to `Lab.MARX.ui`. Before/after HTML of all 15 Marxism routes on desktop and phone is byte-identical apart from the nav group (now "📚 Deep dives") and the new tab. New tab "Ideologies side by side" (`#history-modern-dives`): the same 8 questions per dive, a one-question filter, stacked layout on phones, planned dives with links to their short overviews, discipline links, review cards (`dv:*`) and archive seeds. Smoke test now opens every dive section and case study. How to add a dive: `research/cap-0.md`.
Checks: fact-check 1 fix (all 8 entries confirmed against opened sources; figures recorded as verified in `data/claims/marxism-side.json`); balance 7 framing fixes (one figure aligned with the dive's own table); validate/smoke pass on the merged tree; Actions pass.
Open: the side-by-side summaries draw on the dive's existing content, which a live session was also editing today; merged cleanly. Capitalism (CAP-2+) should register through the engine.

## 2026-11-14 04:30 UTC · LAB-1 (part 1, live session) and CAP-1 (in progress)
Done: Rebuilt six of the most static labs as real-world missions, each with a goal, choices, a verdict and a sourced "reality check", in `js/arcade-real.js`, replacing the old versions by id:
- battery vs fuel by vehicle
- run an insurance company
- RECOVERY trial sizing
- feed a city its protein (Poore & Nemecek data)
- the Sally Clark case and the prosecutor's fallacy
- the Hubble constant and the Hubble tension

Wrote `data/claims/capitalism.json` (65 events, 29 people, drafted); an independent fact-check and balance check are running. Added `tools/apply_verify.py`.
Checks: validate and smoke pass.
Open: the capitalism verification needs applying; the chemistry claims (SCI-CHEM) and the fascism research (FAS-0) are being drafted by helper agents in the live session.

## 2026-11-14 02:30 UTC · SETUP
Done: Built the loop. Added the runbook (`plan/LOOP.md`), the content standards (`plan/STANDARDS.md`) and the work queue (`plan/queue.md`). The repo is now self-contained: the fact-check files are in `factcheck/`, and `tools/apply_fixes.py`, `tools/mkchanges.py`, `tools/stamp.py` and `tools/smoke.py` (a 67-page browser test) are in `tools/`. GitHub Actions now runs validate and smoke on every push.
State at start: physics claim file (46 records, 38 checked); 52 public corrections; capitalism research brief v0.1 in `research/capitalism.md`; Marxism–Leninism is the only deep dive.
Open: the first loop run starts with CAP-0.

## 2026-11-14 (live session, after the loop was cancelled)
- Capitalism deep dive live (js/capitalism-data.js, js/capitalism.js): 12 sections, 9 cases, sourced timeline from data/claims/capitalism.json.
- Fascism deep dive live (js/fascism-data.js, js/fascism.js): 15 sections incl. resistance and collaboration, the words, denial is not a side; 9 cases; timeline from data/claims/fascism.json.
- New lab `reichstag` (js/arcade-history.js): real Reichstag seats 1928–33, the negative majority.
- Design: deep-dive hero + sticky chapter bar; History menu collapses to a breadcrumb; home features the three deep dives.
- Link check: 11 dead links fixed.
- Next: liberalism, conservatism, socialism/social democracy, anarchism, nationalism dives; "why does this happen" investigations; discipline-page redesign.

## 2026-11-14 (live session, part 2)
- Discipline pages now use chapters (Overview, Deep dive, Story & people, Evidence, Library, Hands-on labs, Debates & news, Lectures & quiz); #d-<id>-<chapter> links; evidence sub-tabs.
- deepdive.js: `host: 'disc'` dives mount in the discipline "Deep dive" chapter (#d-<id>-deep-<section>); label overrides via ui.lbl; start page is a section directory.
- Discipline deep dives done: physics (js/disc-physics.js), chemistry (js/disc-chemistry.js), biology (js/disc-biology.js); registered in js/disc-dives.js.
- Remaining discipline dives, in order: mathematics, statistics, computing, economics, psychology, earthspace, medicine, logic, politics, sociology, anthropology, law, philosophy, religion, linguistics, literature, arts, engineering, ethics, geopolitics (history already deep).
