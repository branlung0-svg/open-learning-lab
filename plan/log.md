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

## 2026-11-14 (live session, part 3)
- Home page in tabs; Back restores scroll on every page (core.js scrollMem).
- Media pipeline: tools/fetch_commons.py runs in GitHub Actions (media.yml) from data/media-wanted.json → img/c + data/commons.json (credits). Front end: js/media.js (Lab.cfig, Lab.cgrid, Lab.lightbox). Review picks with a contact sheet; drop off-target or public-figure-centred picks.
- How power works (js/govern-data.js, js/govern.js): 9 governments as diagrams, freedom compared, citizen's toolkit (#history-modern-govern).
- Pictures & film sections in the three ideology dives; case photos.
- Lab: sourcedetective (js/arcade-evidence.js).
- Artifact is at its 256 MB cap: publish code only; pictures load from the public site.
- Next: more Commons media per dive and per discipline; UK→US empire module; more picture-based labs; remaining discipline dives.
- Part 4: empire module (js/empire-data.js, js/empire.js, #history-modern-empire); "Treasures of the field" Commons pictures on all 24 discipline pages (keys c:<disc>-<slug>); lab `graphics` (js/arcade-graphics.js). Next: country studies (USSR, DPRK, China, Cuba, USA), more picture labs, discipline dives.

## 2026-11-14 (afternoon session)
- Evidence tabs: charts (chartSVG in deepdive.js; X.charts), gainsFig/tollsFig, "Check it yourself" locker embedded (documents, data, papers, pictures, records). Marxism locker added.
- The Archive (#archive, js/archive.js): ~900 Commons items + 662 modern-history pack images; topic chips, search, infinite scroll; graphic blur via Lab.graphicMode.
- Media pipeline: multi-result topics (n), name filter, date filter, data/media-skip.json, thumbnails (tools/make_thumbs.py, img/c/t).
- Home redesign (js/home-wow.js + css): cinematic archive-mosaic hero with live counts, photo doors, picture of the day, subject photo headers.
- Hard truths module (js/truths-data.js, js/truths.js, #history-modern-truths).
- Readiness: og/twitter tags + img/share.jpg, 404.html, robots.txt, Report a mistake link.
- Pending: custom domain (Owen to buy; then CNAME + DNS), more discipline dives, country studies.

## 2026-11-14 (evening): honest costs for capitalism
- Owen: the USA case listed harms without numbers while the USSR case had Gulag figures. Fixed: every capitalism case now has sourced numbers for its costs (slavery, Native removal and the California genocide, Cold War coups and massacres, Vietnam, opioids, Bhopal, Chile's victims, Sweden's sterilizations, Nazi-era forced labor in West German firms, Kenya camps, Indian famines).
- New case: "The colonized world" (1600–1960s) with timeline, three tellings (defenders of empire, anti-colonial historians, institutional economists).
- Tolls table: +10 rows with ranges and attribution notes; tollsNote now answers "can it add up to billions?" (no scholarly estimate does; few hundred million at the very most, mostly from baseline-sensitive excess-death methods).
- Immigration line rewritten with Pew survey data plus the push side (Central America, Vietnam); new claims ("billions", "most immigrants fled Western damage") and debates (colonialism and poverty; why people migrate).
- USSR costs given famine and Terror numbers too, for symmetry.
- Archive: dropped two off-topic picks (tiger hunt in famine topic, 1931 Indochinese flag in Indonesia 1965). The e84362a media run added nothing new.

## 2026-11-14 (late): lineages, achievements, photos everywhere
- New "How it changed" section (engine: R.lineage) for Marxism (12 steps: Marx → Second International → Lenin → Stalin → Trotsky → Mao → Tito → Juche → Ho → Castro → Deng → Gramsci/Eurocommunism), capitalism (12: Smith → … → state capitalism) and fascism (8). Each step: material conditions, added/changed/kept, three readings (adaptation / revision for power / design flaw), sources, pictures; plus an idea-tracker matrix.
- Promise scorecards: "Why did it change? Both answers" under every promise (gapWhy); new capitalism and fascism promises.
- Achievements: +10 Marxism rows, +9 capitalism rows, each with a caveat; USSR and Cuba case achievements deepened.
- Photo heroes on every page with a section.hero (Lab.photoize via Lab.enhanceHeroes in the router); deep dives get photo heroes; photo strips on discipline chapters and dive sections (Lab.photoStrip).
- Media: +315 fetched, 27 dropped after contact-sheet review (portraits, modern politicians, off-topic), smallpox photos flagged graphic. Commons now 1,179 items.
- Deep-dive routes now pass sub-arguments (#…-lineage-kim opens that step).
