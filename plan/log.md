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

## 2026-11-14 (evening 2): carousels and case sub-tabs
- Lab.carousel (media.js): one picture at a time with arrows, swipe, keyboard, counter, thumbnails, tap to enlarge, graphic blur; pulls extra archive pictures by case words (js/case-words.js), matched on title/caption only, within the case's years, never leader portraits.
- Case studies: sub-tabs (Overview with carousel, Timeline, Achievements & costs, Each side, Today & sources, Show all), remembered per dive; previous/next case buttons.
- Lineage steps and dive galleries now use carousels (galleries: one tab per collection, with a grid toggle).

## 2026-11-14 (night): study tools, search, review status, offline, places
- js/study.js wired into every deep dive (Lab.study.after in deepdive.js show): progress bar + "Continue" on Start; per-section tools (listen aloud, explain simply via tutor, text size); "Check yourself" (3 questions built from the section's own data; misses go to Review as spaced cards); "Mark section done"; expert-review status line linking an issue form.
- #search: one search over deep dives, cases, timelines, lineage, evidence, claims, debates, disciplines, people, books, Modern-world timeline events, plus matching pictures. Home "Find anything" uses it. "Also appears in" panel on each case's Today tab.
- #reviewers page; .github/ISSUE_TEMPLATE expert-review.yml and mistake.yml.
- Accessibility: skip link, focus outlines, reduced-motion, top bar fits 380–430 px phones (was overflowing).
- Offline: sw.js (registered only on github.io): HTML network-first, versioned assets cache-first, pictures/data cached (900-picture cap).
- Media: country batch reviewed (57 dropped); worldwide places batch (~710 fetched, 98 dropped). Archive chips: India, Japan, Korea, Middle East, Africa, Latin America, Europe, Australia & Pacific, Architecture, Nature & geography.
- Not done: true second reading level for all text (only tutor "explain simply"), Spanish, outside expert reviews (needs people).

## 2026-11-14 (late night): countries, My Lab, translation
- Countries (js/countries.js): #countries atlas of 196 countries (region tabs, search by name/capital/language, sort by people/area/saved); #country-<iso3> with tabs Overview (facts, neighbours, pictures), History (Lab cases + Modern timeline events mentioning it + tutor studies by period), Life in numbers (12 long-run series since 1800, compare with any country), Government & power, Places & pictures, Go deeper & sources. Data: tools/build_countries.py → data/countries.json + data/cs/<id>.json (mledoze/countries ODbL + Maddison, Gapminder, V-Dem, World Bank, UNDP, OWID).
- Charts now use a proportional time axis (Lab.chartSVG).
- My Lab (js/me.js, #me): saved items (☆ Save on dive sections and countries), recent pages, deep-dive progress, For you, text size / tutor depth / graphic pictures / language. Translation via Google Translate (page and picture captions).
- Media: 853 country searches queued (capital, landscape, village, history; extra cities for big countries); new pictures saved at 1000 px q72 to keep the Pages site under 1 GB (now ~610 MB).

## 2026-11-19 — Research standard, parliaments, institutions, math path
- DPRK context: constitution keeps "socialism" (~40 mentions in 2019 text); what Juche kept from Marx/Engels, Lenin, Stalin, Mao; withering-state shown as three readings incl. the one-country/global argument; new ⏳ "postponed" tracker mark; stages panel (capitalism → transition → lower → higher phase) with each state's own stage claims.
- #parliaments: seat charts for 10 chambers with as-of dates and sources; #parliaments-china: state and Party ladders (direct elections only at township/county level).
- #institutions: 17 bodies (UN, IMF, World Bank, WTO, ICC, ICJ, NATO, BRICS, SCO, APEC, G7/G20, EU, AU, ASEAN, OPEC, WEF, lobbying/super PACs) with supporters, Western critics and Global South/East critics; follow-the-money databases.
- #mathpath: 14 rungs from counting to statistics, each with interactive picture, why/history/uses, practice; formula builder (safe parser, sliders, plot).
- #method: research standard (quant + qual, 8 rules, honest gaps); tutor rules now include it.
- Scroll memory restores only on Back/Forward; back-to-top button.

## 2026-11-19 (later) — Five ideology dives, source balance, picture review
- New deep dives with step-by-step lineages: liberalism (8 steps), conservatism (7), anarchism (7), authoritarianism (7), imperialism & colonialism (7); each has core ideas, debates and a reading room.
- Source-balance meter on every reading room and on #method, counting by origin of the voice where tagged. Before adding voices: 100% of region-tagged sources were Western; after: about 47% Western / 53% elsewhere among linked, tagged sources (unlinked books, mostly Western, not counted).
- Added 70+ sources from Asia, Africa, Latin America, Russia and the Middle East across the nine ideology dives.
- Legislatures: Laos (2026), Japan (Feb 2026), South Africa (2024).
- Link check: all 726 linked Commons pictures load. Reviewed 25 contact sheets by eye and removed 171 off-target items (maps, charts, diagrams, portraits of political figures, duplicates, modern scenes for historical searches, objects).

## 2026-11-19 (evening) — Fact-check pass, evidence lockers, film and photo batch
- Fact-check of the five new dives: corrected or attributed 11 claims (Spanish clergy count 6,832 with both sides' violence; Lenin–Kropotkin; Qin book-burning as traditional account; Americas population fall as a 50–90% range; EIC dating; Cold War coups worded by documented role; "social credit" description; V-Dem 2026 figures with its critics' view; DPRK constitution "socialist/socialism" counted at 42 in the official English translation).
- Evidence sections (original documents, datasets, peer-reviewed studies) for liberalism, conservatism, anarchism, authoritarianism, imperialism.
- Queued 106 Commons searches: 24 archival films and 82 photo sets across all eight ideology dives; galleries wired in.

## 2026-11-22 — Power ladders, oppressor and oppressed, more archives, roadmap
- #power: step-by-step ladders for the US, China, USSR and Nazi Germany (citizen to top, how people climb with a real career, how decisions are made, money and war, checks, who was shut out), plus a side-by-side table. Linked from How power works and each system page.
- #oppression: 11 categories, 59 cases (colonial rule and slavery, genocide, apartheid, war, famine, disease, sanctions, chemical, biological and nuclear weapons, camps and torture, disasters) with numbers as ranges, testimony archives, the propaganda on each side, and live archive evidence. Developing cases (Ukraine, Gaza, Sudan, famine) use November 2026 figures.
- Live archive search: added Europeana, Smithsonian, Wellcome Collection, V&A, Art Institute of Chicago and Japan's National Diet Library after a CORS test from GitHub Actions (plan/cors-check.json).
- Political-perspective meter added to source balance; right-to-left reading lists on seven dives.
- plan/ROADMAP.md: the finish line and phases. Build loop found paused since 2026-11-14.

## 2026-11-22 (afternoon) — Power data for every country
- tools/build_power.py + .github/workflows/power.yml (weekly, Mondays): for every country, head of state and government with offices and start dates, form of government and current ministers from Wikidata; each legislature's seats, parties, official Commons seat diagram, last and next election and voting system from Wikipedia infoboxes (templates expanded through the API; sub-parties and footnotes skipped). Output data/power.json; unparsed infoboxes in plan/power-debug.json.
- Country "Government & power" tabs show who holds power now, each chamber with a seat chart and the official diagram, who runs which ministry (stale entries flagged), and pictures of where power sits. #parliaments has an every-country finder.
- #power: new "Roles & who runs what" view. China as of November 2026 (three roles; Standing Committee and vice premiers with portfolios; vacancies and military purges per CRS, April 2026); US, USSR and Nazi Germany roles.
- 13th NPC (2018–23) full party breakdown added (CPC 2,175; eight smaller parties 379; no affiliation 426); 14th NPC breakdown not fully published.
- Verified UK prime minister change (Andy Burnham since 20 July 2026) against gov.uk.
- Queued 392 Commons searches: parliament and government buildings for every country.
- Coverage after parser fixes: of the Lab's 196 countries, 182 with legislatures, 143 with full party breakdowns, 193 with ministers. China's NPC now shows the 14th NPC's eight smaller parties (Jiusan 61, Peasants' and Workers' 60, Democratic League 55, Promoting Democracy 54, National Construction 44, Kuomintang Revolutionary Committee 43, Zhi Gong 39, Taimeng 13) with CPC and non-affiliated combined (2,478).
- Picture review: 573 parliament and government building pictures checked; 315 kept (143 countries), 258 removed (handshakes and meetings, stamps, coins, logos, satellite images, and buildings filed under the wrong country).
- HTML infobox fallback and known titles for 14 countries still missing (Israel, South Africa, Nigeria and others); placeholder names filtered.

## 2026-11-22 — Six more power ladders; former leaders no longer shown as current; stray "null" fixed site-wide
- js/power-more.js: UK, Russia, India, Iran, Japan, North Korea, each with ladder (theory vs practice), how leaders climbed, how decisions are made, money and war, checks, who was shut out, roles, and seven comparison rows. 2026 events checked against news sources and marked developing: Burnham became PM on 20 July 2026 without a general election; Ali Khamenei was killed on 28 February 2026 and Mojtaba Khamenei named on 8 March; United Russia won 349 of 450 Duma seats in September 2026; North Korea's Ninth Party Congress (February) and 15th SPA (March).
- Open data showed former presidents as current in presidential systems (Ghana: Akufo-Addo; Turkey: Özal; Zambia: Lungu; Benin: Talon) because Wikidata country entries lacked end dates. build_power.py now drops holders whose own office records are all closed, uses the head of state when both roles are one office, and fixes Iran's office labels; power-world.js applies the same fixes on the page and shows one box when one person holds both roles. power.yml now cancels an older run when a new one starts.
- Carousels printed "null" under single pictures (native append prints null). polish.js now makes append/prepend/replaceChildren/before/after skip null/undefined/false everywhere; smoke.py fails any page with stray null/undefined/NaN text.
- Reading room fetches book packs from the public site when a copy lacks them; the chat copy dropped 94 MB of book packs to stay under its 256 MB limit.
- Same day: Vietnam (To Lam holds both the Party's top post and the state presidency since 7 April 2026, elected 495 to 0) and Cuba (2026 fuel crisis, Party Congress postponed) added to js/power-more.js; the comparison table now covers 12 systems.
- Power data: the HTML fallback reached 195 of 196 countries' legislatures (Jamaica still missing) but double-counted blocs and their member parties (Israel summed to 133 of 120, Lebanon 256 of 128) and kept HTML codes in names. build_power.py now reads nested HTML lists like wikitext levels (sub-parties skipped), unescapes names and reads the seat total from header rows; the page draws its own seat chart only when parties add up to the official total and otherwise explains why there is no chart.

## 2026-11-22 (afternoon) — Pictures: place-checked, organized by theme
- Owen found China's pictures included China, Maine and other US places. Causes: generic searches ("China village") and a fill step that took any picture whose caption mentioned the country, capital or demonym.
- tools/place_check.py (runs after every media fetch in media.yml): for every picture tied to a country, Commons coordinates must fall inside the country (Natural Earth borders, ~15 km margin), or its categories/description must name the country and not a US place such as "China, Maine". Failures are removed and added to media-skip.json; results in plan/place-check.json.
- Country pages: pictures come only from the country's own checked set, grouped Heritage / Cities / Land / Daily life / History (oldest first), fixed order; header photos the same. Case studies (e.g. Marxism–Leninism: China) add the country's checked pictures from the case's years.
- New searches: Commons "Featured pictures of X" and "Quality images of X" for all 196 countries (12 each), plus 61 themed searches for China.
- Country pages reorganized: tabs Overview, Government & power, History, Life in numbers, Pictures, Everything in the Lab, Sources & perspectives. Government & power now opens with the structure itself (js/power-viz.js): the leader's roles as a tree (BBC-style), "who runs what" as coloured rings (Fairbank-style; stacked blocks on phones), the ladder from citizen to the top, then seat charts, live leaders and ministers. "Everything in the Lab" gathers every page, case study, ideology, oppression case and timeline event about the country. Sources & perspectives adds 18 labelled outlets from every region (6 Western, 12 non-Western) plus the country's own press translated.
- Bug: js/power-data.js ("Who really rules?") and js/power.js both set Lab.POWER, which broke #history-modern-power and site search. The older data is now Lab.RULES. smoke.py now fails pages that show an error message.
- Power data rebuild: all 196 countries have a legislature; former leaders gone (Ghana, Turkey, Zambia, Benin, Malawi); Lebanon adds up (128). Israel, Malta, Latvia lists still incomplete (no chart drawn).
