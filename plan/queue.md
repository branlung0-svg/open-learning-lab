# Work queue

Take the first `[ ]` unit, or continue the `[~]` one. `[x]` means done.

Each unit is about one run (1–2 hours). A deep dive is split into 7 parts: engine or research, ideas, history and cases, costs and gains, debates and claims, labs, and a final check.

**Order of work:**
1. Capitalism first.
2. Then rotate through: an ideology deep dive → discipline depth → a "Why does this happen?" investigation → labs or design.
3. Science claim files are spread throughout.

**What "done" means for every unit:**
- Every new fact is in a claim file with a source.
- The independent fact-check has been applied (plus the balance check for sensitive units).
- `validate.py` and `smoke.py` pass.
- New review cards and archive seeds are added.
- A beginner layer is on top and depth is below.
- The page shows real-world uses and links to other disciplines.

## Phase 1: capitalism deep dive and design foundations

- [x] (2026-11-14) **CAP-0 Deep-dive engine.** Generalize `js/marxism.js` so any ideology deep dive is rendered from a data object: a registry `Lab.DEEPDIVES[id] = {title, data, labs}`, where each dive has a tab under History › Modern world › Deep dives. Marxism–Leninism must look and work exactly as before (smoke test, plus before/after screenshots). Add an "Ideologies side by side" page that lists every dive, with the same headings for each, so users can compare.
- [~] (2026-11-14, live session: loop skip) **CAP-1 Research and claims.** Work from `research/capitalism.md`. Fetch each "to fetch" source. Write `data/claims/capitalism.json` with 60 or more sourced events and figures, and 25 or more people: thinkers, entrepreneurs, workers, reformers and critics from every continent.
- [ ] **CAP-2 Ideas, family tree, the machine.** Build it as `js/capitalism-data.js` + a small module calling `Lab.deepdive.register('capitalism', …)` with title "Capitalism" (see `research/cap-0.md`), and fill `side` so it appears on Ideologies side by side. Cover 12 big ideas, each with a plain explanation, the original text (free link), what supporters say, what critics say, and real-world use today. Show 10 variants from mercantilism to state capitalism. In "How the machine works", each institution gets "the ideal" and "the reality" side by side.
- [ ] **CAP-3 Cases.** Ten cases, each covering conditions before, what was done, by whom and why, the results in data, who gained and who lost, and how both sides tell it: Britain 1760–1850, the USA, Germany, Sweden, Japan and South Korea, Chile, Russia in the 1990s, India 1991, China after 1978 (cross-link with the Marxism dive), and Argentina. Add archive seeds for each.
- [ ] **CAP-4 Gains, costs, comparisons, predictions.** Gains: poverty, life expectancy, child mortality, literacy and income, as charts with Maddison/OWID data and the arguments over how they are measured. Costs: slavery and plantations, colonial famines, child labor, the Depression, the post-Soviet mortality crisis and climate, each with the causation debate. Natural experiments. A predictions scorecard. The same layout as the Marxism dive's balance sheet.
- [ ] **CAP-5 Debates, true or false, reading room.** Present the seven debates from the brief, with each side at its strongest. Include 12 or more true-or-false items, and a 40-book reading room split into supporters and critics, linking free full texts.
- [ ] **CAP-6 Labs.** Build three real-world labs:
  - Comparative advantage, using real trade data for two countries.
  - A boom-and-bust simulator, with credit, leverage and a bank run, checked against 1929 and 2008.
  - Price signals in a shortage, with real cases such as the 1970s US gasoline lines and price-controlled markets.
- [ ] **CAP-7 Final check.** Run the full fact-check and the balance check, run one agent arguing as a pro-market reviewer and one as a critical reviewer, and apply the fixes. Update `hub.js` ("Coming next" → live) and the learning paths.
- [ ] **DES-1 Design system.** Write `plan/DESIGN.md` covering type scale, spacing, color tokens, components and tone. Apply it to the top bar, home, hub and discipline pages. The aim is calmer and professional: fewer emoji, consistent cards, better hierarchy, and dark mode checked. Take before and after screenshots on a phone and a desktop.
- [ ] **DES-2 Home and onboarding.** First-visit tour (30 seconds); "Start here" paths by age band; a search box across every page title and claim.
- [~] (2026-11-14, live session: loop skip) **SCI-CHEM Chemistry claim file.** Drafted and live (45 events, 14 people, all "Sources linked"). Still open: an independent check with `tools/apply_verify.py`, a South American chemist, and confirming the 9 sources found only in search results (see `research/chemistry-notes.md`). 35 or more events and 10 or more people worldwide, checked independently, shown on the chemistry page.

## Phase 2: rotation

- [~] (2026-11-14) **FAS-0 Fascism and Nazism: research and claims.** Drafted: `research/fascism.md` (brief) and `data/claims/fascism.json` (69 events, 30 people). Not shown on the site yet. **Next run:** open every source, verify the items the brief flags (King et al. 2008 group findings, election decimals, the Tokyo tribunal's Nanjing figure, USHMM Roma wording, the Wikipedia-only sources), then run the independent fact-check plus a balance check, and apply both with `tools/apply_verify.py --no-log`. Mark done only after that. The loop may take this unit. Origins (Italy 1919, Germany, Japan's militarism as a related case, Spain, Romania, Hungary, Croatia, Vichy, plus Latin American and modern variants and the debate over that term). Why people joined: class, war trauma, humiliation, fear of communism, propaganda and genuine belief. Use the scholars on each side of the definition debate: Paxton, Griffin, Payne, Eatwell, Mosse and Marxist interpretations.
- [ ] **FAS-1 Ideas and the machine.** Present the doctrine in its own words, analyzed without reproducing propaganda at length. Explain how the party-state worked, the economy (cartels, rearmament, forced labor) and how power was taken legally and illegally.
- [ ] **FAS-2 Cases.** Italy 1922–45, Germany 1933–45, Spain 1936–75, Japan 1931–45 (related), Romania, Croatia (Ustaše), Hungary (Arrow Cross), Vichy France, and Portugal's Estado Novo (as a debated case).
- [ ] **FAS-3 The Holocaust and other crimes.** Cover the Holocaust with primary evidence and survivor testimony (USHMM, Yad Vashem, Arolsen Archives), the genocide of the Roma, the killing of disabled people, Generalplan Ost, and Japanese atrocities. Follow the graphic-content rules strictly. Explain how ordinary people took part, drawing on Browning, Goldhagen and the debate between them.
- [ ] **FAS-4 Support, resistance and aftermath.** Mass support and why it happened; the resistance (the White Rose, partisans, the Warsaw Ghetto uprising); collaboration; Nuremberg; denazification and its limits; and how far-right movements reused these ideas later. Today's parties are presented through their own statements and their critics', with no labels assigned by us.
- [ ] **FAS-5 Debates, true or false, reading room.** Debates: Was fascism left or right? Was the Holocaust planned from the start (intentionalists vs. functionalists)? Was appeasement wrong? How far does the term "fascism" stretch?
- [ ] **FAS-6 Final check.** Fact-check, balance check, and an extra check that nothing glorifies or reproduces propaganda without analysis.
- [ ] **DEP-GEO-1 Geopolitics depth, part 1.** Audit the discipline against `plan/STANDARDS.md`. List the gaps in `research/geopolitics-depth.md` and split them into units in this queue.
- [ ] **WHY-1 Why do wars happen?** The major theories, each tested on real wars with data (Correlates of War, UCDP): realism, democratic peace, resources, nationalism, miscalculation, domestic politics and the security dilemma. Include an interactive "test the theory" lab.
- [~] (2026-11-14, live session: loop skip) **LAB-1 Labs overhaul, batch 1.** Part 1 done: six labs rebuilt as real-world missions in `js/arcade-real.js` (fuels, lln, confint, foodweb, proof, doppler). Part 2 (4 more) is open. Find the 10 least engaging labs (static, toy-like, or without real data). Rebuild each around a real problem with real data. Keep each lab's old version only if it teaches something the new one doesn't.
- [ ] **SCI-BIO Biology claim file.**
- [ ] **LIB-0…6 Liberalism deep dive.** Seven parts as above: Locke to Rawls; classical, social and neoliberal variants; revolutions; empire and liberalism (Mill and India); civil rights; and critiques from left, right, and post-colonial thinkers.
- [ ] **DEP-HIS-1 History depth, part 1.** Audit and split, as for DEP-GEO-1.
- [ ] **WHY-2 Why do people become racist or supremacist?** Every form, with the same rigor: white supremacy, antisemitism, anti-Black racism, caste, Han chauvinism, Hutu Power, Japanese imperial racial ideology, religious supremacism, and supremacist movements in any group. Cover the psychology (in-group bias, Allport, Tajfel), the history (pseudo-science, slavery's justifications), economics (competition and status) and politics (propaganda and the elites who benefited). Also cover how people leave these movements (deradicalization research), and what reduces prejudice (contact theory and its evidence).
- [ ] **SCI-MED Medicine claim file.**
- [ ] **CON-0…6 Conservatism deep dive.** Burke, de Maistre, Disraeli, Oakeshott, Kirk, Buckley, Scruton; Christian democracy; East Asian and Islamic conservatism; plus its critics.
- [ ] **LAB-2 Labs overhaul, batch 2.**
- [ ] **WHY-3 Slavery then and now.** Slavery across all societies (ancient, Islamic world, Atlantic, Indian Ocean, Africa's internal systems, serfdom, the Gulag and the laogai as forced labor). Why it was so widespread: economics, law, religion and race. Abolition movements. Modern slavery today (ILO/Walk Free estimates, debt bondage, forced labor in supply chains), with the methodology debates.
- [ ] **SCI-MATH Mathematics claim file.**
- [ ] **ANA-0…6 Anarchism deep dive.** Proudhon, Bakunin, Kropotkin, Goldman; Spain 1936; the Zapatistas and Rojava (as a debated case); anarcho-capitalism as a separate branch; critics.
- [ ] **DEP-ECO-1 Economics depth, part 1.**
- [ ] **WHY-4 Why famines happen.** Ireland, Bengal 1770 and 1943, the Soviet Union 1932–33, China 1959–61, Ethiopia 1984, North Korea in the 1990s, Yemen and Gaza. Sen's entitlement theory and its critics; the role of the state, markets and war in each.
- [ ] **SOCDEM-0…6 Social democracy and democratic socialism deep dive.**
- [ ] **WHY-5 Empires and colonization: how and why.** Every empire with the same questions (Roman, Mongol, Ottoman, Mughal, Qing, Spanish, British, French, Russian/Soviet, Japanese, American). How colonized people were ruled and how they resisted.
- [ ] **WHY-6 Financial crashes.** 1637 tulips (and the myth), 1720, 1873, 1929, 1997, 2008, 2020. Why crashes happen: credit, leverage, mania, policy. Who paid the costs. Cross-link to the Dust Bowl and the Depression.
- [ ] **NAT-0…6 Nationalism deep dive** (including anti-colonial nationalism).
- [ ] **LBT-0…6 Libertarianism deep dive.**
- [ ] **REL-POL Political religion deep dives:** Islamism; Zionism and its critics; Hindutva; Christian nationalism; political Buddhism. Each topic is its own 3–7 part unit, with the strictest balance check.
- [ ] **PAN-0…6 Pan-Africanism and Black political thought.**
- [ ] **FEM-0…6 Feminism deep dive.**
- [ ] **ENV-0…6 Environmentalism and green politics.**
- [ ] **PEOPLE-1…20 People deep dives.** Ten people per unit, for each tradition: their life, how they lived, what they believed and why, what they did, supporters' and critics' views, and primary sources.
- [ ] **DEP-<each of the 24 disciplines>-1…n.** Audit and split for every discipline not yet covered. Aim for 2–5× the depth of geopolitics and history today, in the order: physics, biology, medicine, math, psychology, philosophy, religion, law, politics, sociology, anthropology, literature, arts, linguistics, computing, statistics, logic, chemistry, earth and space, engineering, ethics.
- [ ] **COMM-1 Community, step 1.** Set up GitHub Discussions with clear rules and a code of conduct, plus links from the site. Leaderboards, debate rooms and accounts wait until the content is solid, and need a server and a moderation plan that Owen approves.

## Recurring (every 8th run, in place of a queue unit)
- **MAINT:**
  - Read the last 8 log entries and every open issue.
  - Re-check claims marked Developing and update them.
  - Spot-check 10 random checked claims against their sources.
  - Fix anything broken.
  - Write a progress summary at the top of the log.
