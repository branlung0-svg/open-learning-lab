/* How the Lab rates sources and claims.
   Adds: a written rubric (five criteria, 0–3 each), a score and "trust it for / be careful about" line for every source dossier,
   non-Western and state sources that were missing, a claim-confidence ladder, an evidence hierarchy for history,
   and a balance check showing where the Lab's sources come from. Loaded after sources.js. */
(function () {
  const h = Lab.h;

  // ---------- 1. The rubric ----------
  Lab.RATING = {
    criteria: [
      ['E', 'Evidence', 'What do they actually give you?', '3 = raw records, data, footage or documents you can inspect · 2 = careful analysis built on such evidence · 1 = reporting or summary of others’ evidence · 0 = assertion or opinion only'],
      ['T', 'Transparency', 'Can you check their work?', '3 = data, methods and funding all public · 2 = most of it public · 1 = conclusions public, methods or money mostly hidden · 0 = nothing checkable'],
      ['I', 'Independence', 'Do they gain if you believe them?', '3 = little to gain either way · 2 = some interest but strong rules against slanting · 1 = a clear stake (money, mission or government) in the answer · 0 = owned or directed by a party to the story'],
      ['R', 'Track record', 'How often have they been right, and do they correct errors?', '3 = long record, errors corrected publicly · 2 = mostly reliable, some disputed calls · 1 = documented misses or slow corrections · 0 = repeated proven falsehoods'],
      ['C', 'Cross-check', 'Do sources with opposite interests confirm them?', '3 = routinely confirmed by rivals or adversaries · 2 = usually confirmed · 1 = often disputed by independent sources · 0 = contradicted by most independent evidence'],
    ],
    grade: (t) => (t >= 13 ? ['A', 'High: usually trustworthy on its subject', '#15803D'] : t >= 10 ? ['B', 'Good: check its stake in the topic', '#2563EB'] : t >= 7 ? ['C', 'Mixed: useful, but confirm elsewhere', '#CA8A04'] : t >= 4 ? ['D', 'Weak: evidence of what someone wants you to believe', '#EA580C'] : ['F', 'Unreliable as fact; useful only as a record of claims', '#DC2626']),
    principles: [
      'Score the source on the topic you are using it for. A government is a good source for its own budget law and a poor one for its own war crimes, whichever government it is.',
      'Internal documents written to make decisions (secret cables, meeting notes, budgets) usually beat public statements written to persuade. They still carry their author’s bias: an ambassador may tell his boss what the boss wants to hear.',
      'An admission against interest is the strongest testimony: a government confirming its own crime, or an enemy confirming your side’s claim.',
      'Agreement between sources with opposite incentives beats any number of sources on the same side.',
      'Funding is a reason to check, not proof of falsehood. A contractor-funded think tank can be right; an independent scholar can be wrong. Check the evidence, then weigh the stake.',
      'The same rules for every country. Western governments, media and think tanks are scored exactly like Chinese, Russian, Iranian or North Korean ones. Where Western sources score higher, it is for checkable reasons (open archives, freedom-of-information laws, independent courts and press that have exposed their own governments), not because they are Western.',
      'These scores are the Lab’s judgment, written down so you can disagree with them. Every score shows its reasons.',
    ],
    ladder: [
      ['Established', 'Multiple independent kinds of evidence (documents, physical evidence, data, testimony) agree, including sources with opposite interests or an admission by the side that loses from it. Serious specialists do not dispute the core fact.'],
      ['Strong', 'Good evidence and most specialists agree, but some details (numbers, motives, sequence) are still argued or rest on one kind of source.'],
      ['Contested', 'Serious specialists with real evidence disagree. The Lab shows each side’s best evidence and who holds which view.'],
      ['Clouded', 'The evidence is thin, missing or controlled by interested parties (closed archives, destroyed records, only one side’s testimony). Treat any firm answer with suspicion.'],
      ['Unknown', 'Nobody has the evidence. Say so instead of guessing.'],
    ],
    hierarchy: [
      ['Physical evidence and raw data', 'Mass graves, satellite images, film with known provenance, census returns, budgets, shipping records.', 'Can be staged, cropped or misdated; check provenance.'],
      ['Internal records made at the time', 'Secret cables, minutes, orders, diaries, intercepted messages.', 'Written for insiders, so usually candid, but selective archive releases can mislead.'],
      ['Admissions against interest', 'A government or group confirming something that hurts it.', 'The strongest testimony there is.'],
      ['Eyewitness testimony at the time', 'Reporters, soldiers, victims, diplomats on the scene.', 'Vivid but partial; memory and loyalty shape it.'],
      ['Public statements at the time', 'Speeches, communiqués, press releases, state media.', 'Tell you what someone wanted the public to believe.'],
      ['Memoirs and later interviews', 'Written years later, often to defend a reputation.', 'Useful for motives; unreliable for facts nobody else confirms.'],
      ['Scholarship', 'Historians weighing all of the above.', 'Only as good as its sources and its access to both sides’ archives.'],
      ['Official histories, textbooks, propaganda', 'National narratives taught to citizens.', 'Evidence of what a state wants remembered.'],
    ],
  };

  // ---------- 2. Non-Western and state sources that were missing ----------
  const NEW = [
    ['xinhua', 'Chinese state and party media (Xinhua, People’s Daily, CGTN, Global Times, China Daily)', /Xinhua|People’s Daily|People's Daily|CGTN|Global Times|China Daily|WenShi Cankao/, 'Government-owned media (China)', 'Owned by the Chinese state and supervised by the Communist Party’s Propaganda Department. Global Times is a nationalist tabloid published by People’s Daily.', 'Present the Party’s position, defend China’s government and promote China abroad; CGTN and China Daily buy ad space and partnerships in foreign media.', 'The authoritative record of what Beijing’s official position is; good for Chinese economic announcements, official casualty figures and diplomatic statements, which can then be checked.', 'Press-freedom groups (Reporters Without Borders ranks China near the bottom) and Western governments say it censors anything harming the Party (Tiananmen 1989, Xinjiang camps, early COVID-19). Chinese officials reply that Western media are equally partisan against China.', 'Read it as “what the Chinese government says.” Strong evidence of the official line; weak evidence on anything the Party has a stake in. Cross-check numbers with independent data.', 'East Asia'],
    ['cnarch', 'Chinese archives and party historians (PRC Foreign Ministry archive, Party History Research Center, CASS)', /Chinese archives|Party History Research|Chinese Academy of Social Sciences|\bCASS\b|Zhou Enlai Waijiao|Zhongyang wenxian|Selected Diplomatic Papers of Zhou/, 'Government archives and state research (China)', 'State institutions under the Communist Party. The Foreign Ministry archive opened part of its 1949–65 files in 2004–2008, then restricted access again from about 2013.', 'Preserve and publish documents supporting the Party’s historical narrative; published document collections are selected.', 'Real primary documents (Mao’s and Zhou Enlai’s telegrams, for example) that show Chinese decision-making in ways Western sources cannot.', 'Historians, including Chinese ones, note that collections are edited, sensitive files withheld and access has narrowed since 2013. Party historiography must follow official resolutions (1981 and 2021).', 'Treat the documents as genuine but selected. Ask what was left out, and compare with Soviet, US and Korean archives covering the same events.', 'East Asia'],
    ['cnhist', 'Independent-minded Chinese historians (Shen Zhihua, Yang Kuisong, Niu Jun)', /Shen Zhihua|Yang Kuisong|Niu Jun|Zhang Baijia/, 'Scholars (China)', 'University historians in China (East China Normal University, Peking University) who also publish abroad; some research funded privately by Shen Zhihua himself.', 'Scholarly reputation; publishing within China’s limits while pushing them.', 'Used Russian and Chinese archives to show Mao knew of Kim Il-sung’s plan in advance and how Stalin, Mao and Kim bargained; often more candid than official Chinese accounts.', 'Must work inside Chinese censorship, so some conclusions appear only abroad or carefully worded; nationalists in China attack them for “historical nihilism.”', 'Valuable because they challenge their own government’s story using evidence. Compare with Western and Russian scholars on the same documents.', 'East Asia'],
    ['rustate', 'Russian state media (TASS, RIA Novosti, RT, Sputnik)', /\bTASS\b|RIA Novosti|\bRT\b|Sputnik|Russia Today/, 'Government-owned media (Russia)', 'Owned or funded by the Russian state; RT and Sputnik are aimed at foreign audiences.', 'Advance Kremlin positions at home and abroad; deepen divisions in rival countries.', 'The Kremlin’s official position; occasionally reports facts Western media ignore, which then need checking.', 'Banned or restricted in the EU, UK and elsewhere since 2022; documented fabrications (for example on MH17 and Bucha). Russian officials call the bans censorship and point to Western media errors such as Iraq’s weapons.', 'Read as “what the Russian government wants you to believe.” Never use alone for facts involving Russia’s interests.', 'Russia'],
    ['kcna', 'North Korean state media (KCNA, Rodong Sinmun)', /KCNA|Rodong Sinmun|Korean Central News/, 'Government-owned media (North Korea)', 'Wholly controlled by the ruling Workers’ Party; no independent media exist in North Korea.', 'Glorify the Kim family and sustain the story of a nation under siege by the United States.', 'The only official record of what Pyongyang claims; announcements of tests, appointments and policy lines.', 'Repeatedly false on verifiable matters (it still says the South started the Korean War, contradicted by Soviet archives). Accurate when describing the scale of US bombing in 1950–53, which US records confirm.', 'Treat as a record of claims. Where it agrees with its enemies’ own records, the agreement is strong evidence.', 'East Asia'],
    ['japansrc', 'Japanese media and research (NHK, Asahi, Yomiuri, “The World and Japan” database)', /\bNHK\b|Asahi|Yomiuri|Nikkei|World and Japan|worldjpn|Wada Haruki/, 'Media and academia (Japan)', 'NHK is a public broadcaster funded by license fees, its board appointed with government approval; Asahi leans liberal and Yomiuri conservative; the University of Tokyo’s “World and Japan” database publishes primary documents.', 'Commercial and political audiences; national interest on Japan’s war history.', 'Strong primary-document collections and detailed regional reporting; Japanese scholars such as Wada Haruki write international histories using Russian, Chinese and Korean sources.', 'Asahi retracted a series of “comfort women” articles in 2014 after relying on a discredited witness, which nationalists then used to deny the system existed. Critics say NHK softens coverage of wartime atrocities under political pressure.', 'Good for documents and Japanese perspectives; on Japan’s colonial and wartime record, compare Korean, Chinese and Japanese sources.', 'East Asia'],
    ['krtruth', 'South Korean truth commissions (Jeju 4.3 Committee, Truth and Reconciliation Commission)', /Truth and Reconciliation Commission|Jeju 4\.3 (Committee|report)|truth commission|National Committee for Investigation of the Truth/, 'State truth commissions (South Korea)', 'Created by South Korean law (Jeju commission 2000; TRC 2005–2010, re-established 2020) under governments that wanted to confront past state violence.', 'Recognize victims of the South Korean state and restore their honor; their creation was itself a political fight between progressive and conservative parties.', 'Documented massacres by the South Korean state and US forces that were taboo for decades, using excavated graves, records and testimony; an admission by a state against its own history.', 'Conservatives said the commissions favored leftist victims; victims’ groups said they were too slow and limited. Some estimates (for example 100,000 or more Bodo League dead) are extrapolations beyond confirmed cases (4,934 confirmed).', 'Strong evidence because a state is documenting its own crimes. Separate confirmed cases from estimates.', 'East Asia'],
    ['aljazeera', 'Al Jazeera', /Al Jazeera/, 'News media (state-funded, Qatar)', 'Funded by the government of Qatar.', 'Qatar’s influence and reputation in the Arab world and globally.', 'Strong on-the-ground reporting from the Middle East, Africa and the Global South; often covers stories Western outlets miss.', 'Criticized by Israel, Saudi Arabia, Egypt and the UAE as biased; its Arabic channel is accused of favoring the Muslim Brotherhood; it rarely criticizes Qatar itself.', 'Good for regional reporting and non-Western framing; be careful on Qatar and its rivals.', 'Middle East'],
    ['iranstate', 'Iranian state media (Press TV, IRNA, IRIB, Tasnim)', /Press TV|IRNA|IRIB|Tasnim|Fars News/, 'Government-owned media (Iran)', 'Owned by the Islamic Republic or linked to the Revolutionary Guards.', 'Defend the Islamic Republic and its regional allies.', 'Official Iranian positions; reporting from places Western media cannot reach.', 'Broadcast forced confessions of prisoners (documented by human rights groups); banned from European satellites. Iran says Western media demonize it.', 'Read as the Iranian government’s line. Check facts independently.', 'Middle East'],
    ['latam', 'teleSUR and Latin American media', /teleSUR|TeleSUR|La Jornada|Página\/12|Folha|El País/, 'News media (Latin America)', 'teleSUR was founded and funded mainly by Venezuela’s government; others are private newspapers with varying politics.', 'teleSUR promotes the Latin American left and opposes US influence; private papers serve their owners and readers.', 'Latin American perspectives on US interventions, which the region experienced directly.', 'teleSUR is criticized as Venezuelan government propaganda that downplays repression in Venezuela, Cuba and Nicaragua.', 'Compare state-funded and independent Latin American outlets, as with any region.', 'Global South'],
    ['indiamedia', 'Indian media and scholars (The Hindu, Indian Express, Indian historians)', /The Hindu|Indian Express|Times of India|Panikkar|Indian historians|Subaltern/, 'News media and scholars (India)', 'Private newspapers owned by Indian families and business groups; university scholars funded by the state and private institutions.', 'Readers and owners; Indian national interest in foreign policy coverage.', 'India was non-aligned in the Cold War, mediated in Korea (it chaired the POW repatriation commission) and offers a perspective outside both blocs; Indian historians pioneered “history from below.”', 'Press freedom groups say Indian media have become more pro-government since 2014; coverage of Pakistan, China and Kashmir is nationalistic.', 'Valuable as a large democracy outside both Cold War blocs. Apply the same checks.', 'Global South'],
    ['scmp', 'South China Morning Post (Hong Kong)', /South China Morning Post|\bSCMP\b/, 'News media (Hong Kong)', 'Owned by Alibaba since 2016.', 'Profit and its owner’s interest in good relations with Beijing.', 'Detailed reporting on China, including critical stories mainland media cannot run.', 'Critics say coverage has softened on Beijing since the Alibaba purchase and the 2020 security law; the paper says it remains independent.', 'Useful window on China; note its owner’s position.', 'East Asia'],
    ['krwarhist', 'Historians of the Korean War (Cumings, Weathersby, Millett, Lankov, Wada, Park Myung-lim)', /Cumings|Weathersby|Millett|Lankov|Park Myung-lim|Halliday|Stueck|Matray/, 'Scholars (several countries)', 'University historians in the US, Russia/South Korea, Japan and South Korea, funded by universities and research grants.', 'Reputation; each school defends its interpretation.', 'Together they cover Soviet, Chinese, American, Japanese and both Koreas’ sources. Cumings documented the US occupation and southern repression; Weathersby translated the Soviet documents; Lankov studied the Soviet occupation of the North.', 'Cumings (revisionist) is criticized for long suggesting the South may have started the June 1950 fighting, which the Soviet archives contradicted. Weathersby and others (post-revisionist) are criticized by revisionists for focusing on Moscow and neglecting the civil-war roots.', 'Read across schools: revisionists for the causes and southern repression; post-revisionists for the Soviet-Chinese documents. The best history uses both.', 'International'],
  ];
  NEW.forEach(([id, n, re, type, who, gain, good, crit, how, region]) => { if (!Lab.SOURCES.some((s) => s.id === id)) Lab.SOURCES.push({ id, n, re, type, who, gain, good, crit, how, region }); });
  // The generic state-media dossier now only catches general mentions, so specific dossiers show for specific outlets.
  const gen = Lab.SOURCES.find((s) => s.id === 'statemedia'); if (gen) gen.re = /state media|state-run|government-owned media/i;

  // ---------- 3. Scores: E T I R C (0–3), region, trust it for, be careful about ----------
  const SC = {
    gapminder: ['22232', 'International', 'Long-run world data on health, income and population', 'Its founders’ mission is to show progress; check what is left out of “better”'],
    owid: ['23233', 'International', 'Charts of official data with sources and methods', 'Only as good as the government data underneath; progress framing'],
    worldbank: ['32122', 'International', 'Country statistics on income, poverty and population', 'Its own lending policies; the US is its largest shareholder'],
    imf: ['32122', 'International', 'Economic and debt data', 'Its own programs and austerity conditions; US veto over major decisions'],
    un: ['22122', 'International', 'Population, refugee and agency field data', 'Politicized bodies; data supplied by member governments'],
    who: ['22122', 'International', 'Global health statistics', 'Depends on what governments report; earmarked donor money'],
    ilo: ['22222', 'International', 'Labor and employment statistics', 'Modelled estimates where countries do not report'],
    walkfree: ['12211', 'International', 'Raising awareness of forced labor', 'Modelled numbers from surveys; methodology widely criticized'],
    freedomhouse: ['12122', 'West', 'Expert ratings of political rights', 'Mostly US-government funded; critics say it is softer on US allies'],
    vdem: ['23233', 'International', 'Transparent, multi-expert democracy data', 'Expert judgment still underlies the scores'],
    fraser: ['22122', 'West', 'Economic freedom index', 'Free-market advocacy shapes what counts as “freedom”'],
    heritage: ['11011', 'West', 'What US conservatives argue', 'Advocacy; funded by donors who want its conclusions'],
    brookings: ['22122', 'West', 'Policy analysis by experienced officials', 'Foreign-government and corporate donors; revolving door with US government'],
    cato: ['22122', 'West', 'Libertarian analysis, critical of both parties and of war', 'Libertarian conclusions are built in'],
    cap: ['11011', 'West', 'What the Democratic Party’s policy wing argues', 'Advocacy tied to one party'],
    pew: ['33233', 'West', 'Surveys with published methods', 'Question wording; mostly US and allied countries'],
    gallup: ['32223', 'West', 'Long-running polls', 'Sampling in authoritarian countries is limited'],
    whr: ['22222', 'International', 'Life-satisfaction rankings', 'One survey question carries a lot of weight'],
    cbo: ['33233', 'West', 'Costs of US laws and budgets', 'Must use the assumptions Congress gives it'],
    bls: ['33233', 'West', 'US jobs, wages and prices', 'Definitions (what counts as unemployed) matter'],
    eia: ['33223', 'West', 'Energy production and use', 'Forecasts are often wrong; data are solid'],
    opensecrets: ['33223', 'West', 'Who gives money to US politicians', 'Dark money is invisible to everyone'],
    wikipedia: ['13122', 'International', 'A starting map with citations to follow', 'Edit wars on politics and history; always check its sources'],
    gutenberg: ['33332', 'International', 'Complete original texts', 'Mostly older Western works; texts carry their authors’ views'],
    nasa: ['33233', 'West', 'Space and climate data', 'Budget politics shape priorities, not data'],
    sipri: ['22223', 'International', 'Military spending and arms trade estimates', 'Estimates for secretive states (China, Russia) are uncertain'],
    ucdp: ['23233', 'International', 'Conflict death counts with clear rules', 'Counts only what can be documented, so undercounts'],
    cow: ['23222', 'International', 'Long-run war data', 'Older coding choices are debated'],
    maddison: ['23222', 'International', 'Historical GDP estimates', 'Figures before about 1820 are educated guesses'],
    slavevoyages: ['33233', 'International', 'Ship-by-ship slave-trade records', 'Undercounts voyages that left no records'],
    hrw: ['22122', 'West', 'Field investigations of abuses', 'Donor-funded; choice of which countries to investigate is criticized from all sides'],
    amnesty: ['22122', 'West', 'Prisoner and abuse documentation', 'Campaigning organization; criticized by many governments, Western and non-Western'],
    aclu: ['12021', 'West', 'Civil-liberties cases and documents obtained in court', 'A litigant with a cause'],
    ihme: ['22222', 'West', 'Global disease estimates', 'Modelled numbers; Gates-funded'],
    ethnologue: ['21222', 'International', 'Language counts', 'Run by a missionary organization; paywalled data'],
    ncdrisc: ['33233', 'International', 'Height, weight and health data pooled from studies', 'Coverage gaps in poorer countries'],
    statemedia: ['10010', 'International', 'Evidence of what a government wants believed', 'Anything touching that government’s interests'],
    corpmedia: ['21122', 'West', 'Fast reporting and investigations', 'Owners, advertisers and access to officials; war coverage has repeatedly followed official claims (Iraq 2003)'],
    primary: ['32122', 'International', 'What people said and decided at the time', 'Each document carries its author’s purpose'],
    inquiries: ['22112', 'International', 'Sworn testimony and documents', 'Governments investigating themselves set the limits'],
    iom: ['22222', 'International', 'Migrant deaths and flows', 'Counts only recorded cases'],
    eurostat: ['33233', 'West', 'Harmonized European statistics', 'Depends on national statistics offices'],
    journalism: ['22222', 'International', 'Documents and witnesses others missed', 'Single-source stories need confirmation'],
    scholars: ['22222', 'International', 'Deep, cited research', 'Each school has its own commitments'],
    nbs: ['22122', 'International', 'Often the only full count of a population or economy', 'Governments with a free press and independent statisticians are harder to fudge; examples of fudging include Argentina’s inflation figures (2007–15), Greek deficits (before 2010) and Chinese local GDP and youth unemployment (series halted in 2023)'],
    nsarchive: ['33233', 'West', 'Declassified US documents', 'It chooses which documents to request and highlight'],
    wilson: ['33122', 'West', 'Translated Soviet, Chinese, Korean and other archival documents', 'Partly US-government funded; its commentary has a US perspective; specific releases (such as the 1998 germ-warfare documents) are disputed'],
    hoover: ['22122', 'West', 'Large archives (Russian, Chinese, Cold War)', 'Conservative fellows and donors'],
    rand: ['22122', 'West', 'Detailed military analysis', 'Most funding from the Pentagon and US Air Force'],
    usbs: ['32122', 'West', 'Candid wartime damage data', 'The military assessing its own campaign'],
    venona: ['32223', 'West', 'Decrypted Soviet intelligence cables', 'Fragmentary; identities of code names debated'],
    mitrokhin: ['21122', 'West', 'Notes on KGB files', 'Originals not public; published with British intelligence'],
    church: ['32233', 'West', 'US Senate exposure of CIA and FBI abuses', 'Limited by what agencies handed over'],
    sovarch: ['31122', 'Russia', 'Soviet decision-making documents', 'Russia releases selectively and has re-closed much since the 2000s'],
    memoirs: ['10011', 'International', 'Motives and atmosphere', 'Self-justification; facts need other confirmation'],
    propministries: ['10000', 'International', 'Evidence of what a regime wanted believed', 'Everything else'],
    hamburg: ['32222', 'West', 'Documenting German army crimes', 'Corrected photo errors in its 1990s exhibition'],
    pentagonpapers: ['32233', 'West', 'The US government’s secret history of Vietnam', 'Ends in 1967'],
    crs: ['22233', 'West', 'Neutral briefings for Congress', 'Avoids conclusions that offend either party'],
    gao: ['33233', 'West', 'Audits of US spending and programs', 'Scope set by Congress'],
    pogo: ['22122', 'West', 'Exposing Pentagon waste', 'A watchdog looks for problems'],
    quincy: ['22121', 'West', 'Arguments for US military restraint', 'Restraint advocacy is its mission'],
    costsofwar: ['23122', 'West', 'Estimates of post-2001 war costs and deaths', 'Wide ranges; anti-war framing'],
    csis: ['22122', 'West', 'Military and Asia analysis', 'Defense-industry and foreign-government donors'],
    atlantic: ['12011', 'West', 'What NATO-aligned officials argue', 'Funded by governments, Gulf states and arms makers; pro-NATO mission'],
    cfr: ['22122', 'West', 'Mainstream US foreign-policy thinking', 'The establishment’s view of itself'],
    wbw: ['12111', 'West', 'Counts and critiques of US bases', 'Anti-war advocacy; counts differ from official ones'],
    keia: ['22122', 'East Asia', 'South Korean policy views', 'Funded via a South Korean government institute'],
    koreanmedia: ['22122', 'East Asia', 'South Korean reporting and polls', 'Strong partisan split between conservative and progressive papers'],
    usgov: ['21022', 'West', 'Official US positions, budgets and laws', 'Anything the administration has a stake in'],
    tradepress: ['21122', 'West', 'Detailed defense-industry news', 'Advertising from the companies it covers'],
    contractdata: ['33233', 'West', 'Who got which contract', 'Classified programs are hidden'],
    politicians: ['11011', 'West', 'What a politician wants to highlight', 'Their agenda'],
    xinhua: ['10010', 'East Asia', 'What Beijing officially says', 'Anything the Party has a stake in'],
    cnarch: ['31122', 'East Asia', 'Genuine Chinese leadership documents', 'Selected releases; access narrowed since 2013'],
    cnhist: ['22232', 'East Asia', 'Chinese-side decision-making from archives', 'Limits imposed by censorship'],
    rustate: ['10000', 'Russia', 'What the Kremlin officially says', 'Everything involving Russia’s interests'],
    kcna: ['00000', 'East Asia', 'What Pyongyang claims', 'Everything else'],
    japansrc: ['22222', 'East Asia', 'Japanese documents and reporting', 'Japan’s own wartime record'],
    krtruth: ['32233', 'East Asia', 'State violence documented by the state itself', 'Separate confirmed cases from estimates'],
    aljazeera: ['21122', 'Middle East', 'Middle East and Global South reporting', 'Qatar and its rivals'],
    iranstate: ['10000', 'Middle East', 'Iran’s official position', 'Anything involving the Islamic Republic'],
    latam: ['11111', 'Global South', 'Latin American perspectives on US power', 'State-funded outlets on their own governments'],
    indiamedia: ['21222', 'Global South', 'A non-aligned perspective', 'Coverage of India’s rivals and its government'],
    scmp: ['21122', 'East Asia', 'Detailed China coverage', 'Owner’s interests in Beijing'],
    krwarhist: ['22232', 'International', 'Korean War causes and archives from all sides', 'Each school’s blind spot'],
  };
  Lab.SOURCES.forEach((s) => { const r = SC[s.id]; if (!r) return; const v = r[0].split('').map(Number); s.score = v; s.total = v.reduce((a, b) => a + b, 0); s.region = s.region || r[1]; s.forUse = r[2]; s.careful = r[3]; });

  // ---------- 4. Show scores on every source card ----------
  const baseCard = Lab.sourceCard;
  Lab.scoreBox = (s) => {
    if (!s.score) return null;
    const [g, gt, col] = Lab.RATING.grade(s.total);
    return h('div', { style: { margin: '6px 0', padding: '8px', borderRadius: '10px', background: 'var(--card2)' } },
      h('div', { class: 'row', style: { gap: '8px', alignItems: 'center' } }, h('span', { style: { fontWeight: 800, fontSize: '18px', color: col } }, g), h('span', { class: 'small' }, `${s.total}/15 · ${gt}`), h('span', { class: 'tag', style: { '--c': '#64748B' } }, s.region || '')),
      h('div', { class: 'row', style: { gap: '4px', marginTop: '4px' } }, Lab.RATING.criteria.map(([k, n], i) => h('span', { class: 'tiny', title: Lab.RATING.criteria[i][3], style: { padding: '2px 6px', borderRadius: '6px', background: ['#FEE2E2', '#FFEDD5', '#DBEAFE', '#DCFCE7'][s.score[i]], color: '#111' } }, `${n} ${s.score[i]}`))),
      h('div', { class: 'tiny', style: { marginTop: '4px' } }, h('b', null, 'Trust it for: '), s.forUse), h('div', { class: 'tiny' }, h('b', null, 'Be careful about: '), s.careful));
  };
  Lab.sourceCard = (s, compact) => { const el = baseCard(s, compact); const box = Lab.scoreBox(s); if (box) { const head = el.firstChild; head.after(box); } return el; };

  // ---------- 5. Method card and balance check on the "Who is telling me this?" page ----------
  Lab.ratingMethodCard = () => {
    const R = Lab.RATING;
    const regions = {}; Lab.SOURCES.forEach((s) => { regions[s.region || 'Other'] = (regions[s.region || 'Other'] || 0) + 1; });
    return h('div', { class: 'card' }, h('h3', { style: { marginTop: 0 } }, '⚖️ How the Lab rates sources and claims'),
      h('p', { class: 'small' }, 'Every source gets five scores from 0 to 3. The total (out of 15) gives a grade. The same rubric applies to every government, outlet and scholar, Western or not.'),
      h('div', { class: 'grid g2' }, R.criteria.map(([k, n, q, d]) => h('div', { class: 'card', style: { boxShadow: 'none', background: 'var(--card2)' } }, h('b', null, `${n}: `), h('span', { class: 'small' }, q), h('div', { class: 'tiny muted', style: { marginTop: '4px' } }, d)))),
      h('h4', null, 'Rules the scores follow'), h('ol', { class: 'small', style: { lineHeight: 1.7 } }, R.principles.map((p) => h('li', null, p))),
      h('h4', null, 'How sure is a claim? The confidence ladder'), h('div', null, R.ladder.map(([l, d]) => h('div', { class: 'row', style: { alignItems: 'flex-start', margin: '4px 0', flexWrap: 'nowrap', gap: '8px' } }, h('span', { style: { flex: 'none', width: '96px' } }, Lab.conf(l)), h('span', { class: 'small' }, d)))),
      h('h4', null, 'The evidence ladder for history (strongest first)'), h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'small', style: { borderCollapse: 'collapse', width: '100%' } }, h('tr', null, ['Kind of evidence', 'Examples', 'Watch out for'].map((t) => h('th', { style: { textAlign: 'left', padding: '4px', borderBottom: '1px solid var(--line)' } }, t))), R.hierarchy.map((r) => h('tr', null, r.map((c, i) => h('td', { style: { padding: '4px', borderBottom: '1px solid var(--line)', fontWeight: i ? 400 : 600 } }, c)))))),
      h('h4', null, 'Balance check: where the Lab’s sources come from'), h('div', { class: 'row', style: { gap: '6px' } }, Object.entries(regions).sort((a, b) => b[1] - a[1]).map(([r, n]) => h('span', { class: 'tag', style: { '--c': r === 'West' ? '#2563EB' : '#7C3AED' } }, `${r}: ${n}`))),
      h('p', { class: 'tiny muted' }, 'Most of the Lab’s data sources are still Western or international, because open statistics and declassified archives are concentrated there. That is a real bias: it means Western governments’ own failures are often better documented than their rivals’ failures, and non-Western experiences are often told through Western sources. The Lab tries to correct for it by adding regional sources and by marking where only one side’s evidence exists.'));
  };
  const baseRoute = Lab.routes.whois;
  Lab.routes.whois = function (app) {
    baseRoute(app);
    const hero = app.querySelector('.hero'); if (hero) hero.after(Lab.ratingMethodCard());
    const gs = app.querySelectorAll('.grid.g2'); const grid = gs[gs.length - 1];
    if (grid) { const sortBar = h('div', { class: 'row', style: { gap: '6px', margin: '8px 0' } }, h('span', { class: 'small muted' }, 'Show:'), ...[['all', 'All'], ['West', 'Western'], ['nonwest', 'Non-Western'], ['best', 'Highest scores first'], ['worst', 'Lowest scores first']].map(([k, n]) => h('button', { class: 'btn sm', onclick: () => { let list = Lab.SOURCES.slice(); if (k === 'West') list = list.filter((s) => s.region === 'West'); if (k === 'nonwest') list = list.filter((s) => s.region && !['West', 'International'].includes(s.region)); if (k === 'best') list.sort((a, b) => (b.total || 0) - (a.total || 0)); if (k === 'worst') list.sort((a, b) => (a.total || 0) - (b.total || 0)); grid.innerHTML = ''; list.forEach((s) => grid.append(Lab.sourceCard(s))); } }, n))); grid.before(sortBar); }
  };
})();
