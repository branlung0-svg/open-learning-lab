// Modern world module: "How leaders are chosen", party systems and why they differ, and the democracy debate
// from Plato to today, with evidence. Tab: 'chosen'.
const h = Lab.h;
const M = Lab.MODERN;
const ai = M.SUBS.findIndex(([x]) => x === 'anatomy'); M.SUBS.splice(ai >= 0 ? ai + 1 : M.SUBS.length, 0, ['chosen', 'How leaders are chosen']);
const gI = M.GROUPS.find((x) => x[1] === 'Ideas & power'); if (gI) { const j = gI[2].indexOf('anatomy'); gI[2].splice(j >= 0 ? j + 1 : gI[2].length, 0, 'chosen'); }
const card = (...k) => h('div', { class: 'card' }, ...k);

const PIPES = [
  ['🇺🇸 United States (presidential)', 'Bottom-up through voters, but outside party control', ['Anyone 35+, US-born, 14 years resident can run.', 'Raise money and build a following; since reforms in 1972, primary voters, not party bosses, choose nominees.', 'Win a party primary state by state.', 'Win the general election through the Electoral College.'], 'Selects for: campaigning skill, fundraising, media presence, appeal to a party’s base.', 'Most presidents had long careers first (governors, senators, generals); outsiders can win.'],
  ['🇬🇧 United Kingdom & 🇩🇪 Germany (parliamentary)', 'Rise inside the party and parliament', ['Selected as a candidate by a local party.', 'Elected as a member of parliament.', 'Years as backbencher, junior minister, cabinet minister.', 'Chosen as party leader by MPs and members; becomes head of government if the party commands a majority.'], 'Selects for: party loyalty, debating skill, years of parliamentary work.', 'A leader can be removed by their own party without an election (UK: Thatcher 1990, Johnson 2022).'],
  ['🇨🇳 China (party cadre system)', 'A ladder of appointments, not elections', ['Join the Party after vetting (about 100 million members).', 'Serve as an official at the township or county level; promotions are decided by the Party committee above you, guided by its Organization Department.', 'Get evaluated on targets (growth, stability, later pollution and debt) and on political loyalty; rotate between provinces and ministries.', 'Rise to provincial party secretary, then the Central Committee (elected by Congress delegates from slightly more candidates than seats), then the Politburo.', 'The 7-member Standing Committee is chosen by a small group of top leaders in closed consultations.'], 'Selects for: administrative experience, results on assigned targets, and loyalty and patronage networks.', 'Direct elections exist only for village committees and the lowest people’s congresses, with vetted candidates.'],
  ['🇻🇳 Vietnam (party, more collective)', 'Like China, with stronger Central Committee votes', ['Party membership and local posts.', 'Province and ministry leadership.', 'Election to a 200-member Central Committee at the five-yearly Congress.', 'The Central Committee votes on the Politburo and General Secretary and has overruled leaders (2016).'], 'Selects for: experience in party and state posts, faction support.', 'Since 2026 one person holds both the party and state top jobs.'],
  ['🇰🇵 North Korea (hereditary)', 'Inheritance confirmed by the party', ['Born into the Kim family.', 'Groomed and introduced through party posts and propaganda.', 'Confirmed by party bodies after the predecessor dies.'], 'Selects for: bloodline and the backing of the elite.', 'Kim Jong Un became leader at about 27 with almost no prior office.'],
  ['🇮🇷 Iran (vetted elections under a clerical leader)', 'Votes, but only among approved candidates', ['Candidates register for president or parliament.', 'The Guardian Council disqualifies most (6 of 80 presidential hopefuls were approved in 2024).', 'Voters choose among the rest.', 'The Supreme Leader is chosen for life by the 88-member Assembly of Experts.'], 'Selects for: loyalty to the system, then popularity among the approved.', 'The most powerful office is not chosen by the public.'],
  ['🇯🇵 Japan (dominant party)', 'Elections plus internal party bargaining', ['Many lawmakers inherit a parent’s or relative’s constituency and support network.', 'Rise through ministries and the Liberal Democratic Party.', 'The LDP leader, chosen by its MPs and members, becomes prime minister because the party almost always governs.'], 'Selects for: party seniority, faction ties, family networks.', 'Hereditary politicians are a large share of LDP lawmakers.'],
  ['🇸🇦 Saudi Arabia (monarchy)', 'Chosen within the royal family', ['Sons and grandsons of the founder.', 'The king names the crown prince; the Allegiance Council confirms.'], 'Selects for: lineage and the king’s choice.', 'Mohammed bin Salman was crown prince at 31.'],
];

// Years in public office or government posts before reaching the top job (approximate)
const CAREERS = [
  ['Joe Biden (US, 2021)', 46, 'County council 1970, Senate 1973–2009, Vice President 2009–17. Among the most experienced presidents ever.'],
  ['To Lam (Vietnam, 2024)', 45, 'Decades in the police and Ministry of Public Security, minister from 2016.'],
  ['Xi Jinping (China, 2012)', 30, 'County official 1982, then Fujian, Zhejiang and Shanghai, Politburo Standing Committee 2007.'],
  ['Angela Merkel (Germany, 2005)', 15, 'A physicist; MP 1990, minister 1991, party leader 2000.'],
  ['Lee Jae-myung (S. Korea, 2025)', 15, 'Mayor of Seongnam 2010, governor of Gyeonggi 2018.'],
  ['Claudia Sheinbaum (Mexico, 2024)', 15, 'A scientist; Mexico City environment secretary 2000–06, borough mayor 2015, head of the city 2018.'],
  ['Narendra Modi (India, 2014)', 13, 'Party organizer; Chief Minister of Gujarat 2001–14.'],
  ['Barack Obama (US, 2009)', 12, 'Illinois Senate 1997–2004, US Senate 2005–08.'],
  ['Keir Starmer (UK, 2024)', 9, 'Chief prosecutor 2008–13; MP from 2015.'],
  ['Lula (Brazil, 2003)', 4, 'Union and party leader for over 20 years; only 4 years in Congress.'],
  ['Kim Jong Un (N. Korea, 2011)', 1, 'Named successor about a year before his father died.'],
  ['Donald Trump (US, 2017)', 0, 'Businessman and TV host; the first president with no prior government or military service.'],
  ['Volodymyr Zelensky (Ukraine, 2019)', 0, 'Comedian and actor; elected with 73% as an outsider.'],
];

const THINKERS = [
  ['Plato', 'c. 375 BCE, The Republic', 'Democracy treats unequal people as equals, lets citizens follow pleasure and flatterers, and slides into tyranny when a demagogue promises to defend the people. Rule should go to those trained in wisdom (philosopher-kings).', 'He witnessed Athens’ democracy execute his teacher Socrates; critics answer that his ideal rulers have never existed and nothing stops them abusing power.', 'reading-library-republic'],
  ['Aristotle', 'c. 330 BCE, Politics', 'Rule by one, few or many can each be good or corrupt. The most stable is a “polity” mixing democracy and oligarchy, anchored by a large middle class.', 'Studied about 150 constitutions; accepted slavery and excluded women.', ''],
  ['James Madison', '1787, Federalist No. 10', 'Pure democracies are turbulent and short-lived; a large republic with elected representatives and checks controls factions.', 'The US system was built on this; critics say it also protected property and slavery.', 'reading-library-federalist'],
  ['Alexis de Tocqueville', '1835, Democracy in America', 'Democracy brings equality and energy but risks “tyranny of the majority” and conformity; local associations protect freedom.', 'Written after visiting the US; noted slavery and the treatment of Native Americans.', ''],
  ['Joseph Schumpeter', '1942', 'Democracy is not rule by the people but competition between elites for the people’s vote.', 'A realistic definition many political scientists still use.', ''],
  ['Winston Churchill', '1947, House of Commons', 'Called democracy the worst form of government “except for all those other forms” that have been tried, quoting an unnamed earlier speaker.', 'Said after losing the 1945 election.', ''],
  ['Amartya Sen', '1981 and 1999', 'No major famine has occurred in a functioning democracy with a free press, because governments that must face elections and criticism cannot ignore starvation.', 'Nobel economist; critics debate edge cases (India’s chronic malnutrition, Bengal 1943 under colonial rule).', 'connect-malthus'],
  ['Daniel A. Bell', '2015, The China Model', 'Political meritocracy, selecting leaders by long tested performance, can beat elections at choosing competent leaders; China combines it with local democracy.', 'Critics (Minxin Pei and others) point to corruption, factional patronage and Xi’s concentration of power.', ''],
  ['Jason Brennan', '2016, Against Democracy', 'Most voters are poorly informed; consider “epistocracy” giving more weight to knowledgeable voters.', 'Critics: who decides who is knowledgeable? Such tests were used historically to disenfranchise Black Americans.', ''],
  ['Francis Fukuyama', '2011–14', 'Good order needs three things: a capable state, rule of law and accountability. China has the first, democracies may lack the first.', 'Combines comparisons of both systems.', ''],
];

const EVIDENCE = [
  ['Do Chinese officials get promoted for performance?', 'Partly. Li and Zhou (2005) found provincial leaders with faster growth were more likely to be promoted. Shih, Adolph and Liu (2012) found factional ties, not growth, predicted rank in the Central Committee. Jia, Kudamatsu and Seim (2015) found performance mattered mainly for officials who also had connections.', 'Contested'],
  ['Does democracy cause growth?', 'Acemoglu, Naidu, Restrepo and Robinson (2019) estimated that countries that democratized had about 20% higher GDP per person 25 years later, through more investment, schooling and health.', 'Strong'],
  ['Are autocracies better at long-term growth?', 'Autocracies include both the fastest growers (South Korea and Taiwan before democracy, China) and the worst disasters (Mao’s famine, Zimbabwe, North Korea): far more variation than democracies (Besley and Kudamatsu, 2008).', 'Strong'],
  ['Do autocracies report their growth honestly?', 'Satellite night-light data suggest autocracies overstate yearly GDP growth by about 35% (Martínez, 2022).', 'Strong'],
  ['Do democracies avoid famine?', 'No major famine has struck a functioning democracy with a free press (Sen); the 20th century’s worst famines happened under one-party states and colonial rule.', 'Strong'],
  ['Does experience predict good leadership?', 'There is no simple answer: historians rank some inexperienced leaders highly (Lincoln had two years in Congress) and some highly experienced ones poorly. Experience improves knowledge of how institutions work; it does not guarantee judgment or honesty.', 'Contested'],
];

const PARTYSYS = [
  ['Two-party systems', 'Winner-take-all, single-member districts squeeze third parties (Duverger’s law): voters fear wasting votes. US, UK historically.', 'play-medianvoter'],
  ['Multi-party systems', 'Proportional representation gives seats in proportion to votes, so many parties survive and govern through coalitions. Germany, the Netherlands, Brazil, South Africa.', 'play-dhondt'],
  ['Dominant-party democracies', 'Free elections but one party wins for decades through patronage, organization and a divided opposition. Japan’s LDP, South Africa’s ANC (until 2024), Mexico’s PRI (with fraud).', 'play-coalition'],
  ['Leninist one-party states', 'Lenin argued a disciplined “vanguard” party must lead the working class; under democratic centralism, debate happens inside the party and decisions bind everyone. China, Vietnam, Laos, Cuba, North Korea.', ''],
  ['Hegemonic systems with satellite parties', 'Small allied parties exist but cannot compete: China’s eight “democratic parties”, North Korea’s two minor parties, East Germany’s bloc parties.', ''],
  ['No-party systems', 'Parties banned: Saudi Arabia and other Gulf monarchies.', ''],
  ['Vetted competition', 'Parties or factions compete, but an unelected body decides who may run: Iran’s Guardian Council.', ''],
];

const CLAIMS = [
  ['In China, officials rise by being elected at each level.', 'Mostly false', 'Officials climb a ladder of levels, which is right, but they are appointed and evaluated by the Party committee above them. Direct public elections exist only for the lowest bodies, with vetted candidates.'],
  ['In the US, people often reach the top with no government experience.', 'Mostly false', 'Most presidents, senators and governors had long careers in office, law or the military first. Outsiders can win (Trump 2016) because primaries let voters bypass party leaders.'],
  ['Joe Biden came to the presidency without experience.', 'False', 'He had about 46 years in elected office: county council, 36 years in the Senate and 8 as Vice President.'],
  ['Campaign skill, money and media matter a lot in US politics.', 'True', 'Election spending reached about $16 billion in 2024; primaries reward fundraising and media attention.'],
  ['One-party states have no internal competition.', 'False', 'Factions compete fiercely behind closed doors (Vietnam’s 2016 contest, China’s purges); the public is excluded from the contest.'],
  ['Plato thought democracy was the best system.', 'False', 'He ranked it near the bottom, just above tyranny, which he believed it produces.'],
];

const R = {};
R.start = (p, go) => p.append(card(h('h2', { style: { marginTop: 0 } }, 'How leaders are chosen, and why systems differ'),
  h('p', { class: 'small' }, 'Every system answers the same questions: who may compete for power, who decides who wins, what the winner must have done before, and how a bad leader can be removed. Some answer “the voters”, some “the party”, some “the family”, some “God’s representatives”. Each answer selects for different skills and fails in different ways.'),
  h('div', { class: 'grid g3' }, [['pipes', '🪜 Eight ways to the top'], ['careers', '📊 Real careers compared'], ['parties', '🎭 Why party systems differ'], ['debate', '🏛️ The democracy debate, Plato to now'], ['evidence', '🔬 What the evidence says'], ['claims', '🔎 Test common beliefs']].map(([k, n]) => h('button', { class: 'btn', onclick: () => go(k) }, n))),
  h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, 'See also: the Anatomy of power tab (18 countries asked the same ten questions) and the Who really rules? tab.')));
R.pipes = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Eight ways to the top'), h('p', { class: 'small muted' }, 'Read each ladder from the bottom up. Notice who does the choosing at each rung.')), h('div', { class: 'grid g2', style: { alignItems: 'start' } }, PIPES.map(([n, kind, steps, sel, note]) => card(h('h3', { style: { margin: '0 0 2px' } }, n), h('div', { class: 'tiny muted' }, kind), h('ol', { class: 'small', style: { lineHeight: 1.6 } }, steps.map((s) => h('li', null, s))), h('div', { class: 'small', style: { background: 'var(--card2)', padding: '6px', borderRadius: '8px' } }, sel), h('p', { class: 'tiny', style: { marginBottom: 0 } }, note)))));
R.careers = (p) => { const mx = 50; p.append(card(h('h3', { style: { marginTop: 0 } }, 'Years in government before the top job'), h('p', { class: 'small muted' }, 'Approximate years in elected office or senior government posts before becoming national leader. Experience is not the same as competence; this shows what each system rewards.'),
  CAREERS.map(([n, y, d]) => h('div', { style: { margin: '6px 0' } }, h('div', { class: 'row', style: { flexWrap: 'nowrap', gap: '8px' } }, h('span', { class: 'small', style: { width: '210px', flex: 'none', fontWeight: 600 } }, n), h('div', { style: { flex: 1, height: '16px', background: 'var(--card2)', borderRadius: '6px' } }, h('div', { style: { width: Math.max(1, (y / mx) * 100) + '%', height: '100%', borderRadius: '6px', background: /China|Vietnam|Korea \(|N\. Korea/.test(n) && !/S\. Korea/.test(n) ? '#DC2626' : '#2563EB' } })), h('b', { class: 'small', style: { width: '40px' } }, y)), h('div', { class: 'tiny muted', style: { marginLeft: '218px' } }, d))),
  h('p', { class: 'small' }, 'Pattern: party-state systems promote people after decades of administrative posts; democracies produce both very experienced leaders (Biden, Merkel) and outsiders (Trump, Zelensky), because voters can choose anyone the rules allow. Hereditary systems skip the ladder entirely.'))); };
R.parties = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Why do party systems differ?'), h('p', { class: 'small' }, 'Mostly because of rules and history: how votes become seats, whether parties may legally compete, and what ideology the founders held. Try the labs to see the mechanics.'),
  PARTYSYS.map(([t, d, lab]) => h('div', { style: { borderLeft: '3px solid #7C3AED', paddingLeft: '10px', margin: '10px 0' } }, h('b', null, t), h('p', { class: 'small', style: { margin: '2px 0' } }, d), lab ? h('a', { class: 'tiny', href: '#' + lab }, '🕹️ Try the lab →') : null)),
  h('div', { class: 'row', style: { gap: '6px' } }, [['play-condorcet', 'Voting paradoxes'], ['play-dhondt', 'Votes into seats'], ['play-medianvoter', 'Where parties position'], ['play-coalition', 'Build a coalition'], ['play-powerindex', 'Who holds the veto?']].map(([hs, n]) => h('a', { class: 'btn sm', href: '#' + hs, style: { textDecoration: 'none' } }, '🕹️ ' + n)))));
R.debate = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'Is democracy the best system? 2,400 years of argument'), h('p', { class: 'small muted' }, 'You are right that the critics are serious: Plato, Aristotle and the US founders all feared pure democracy. Here is each position, with the strongest objection to it.')),
  h('div', { class: 'grid g2', style: { alignItems: 'start' } }, THINKERS.map(([n, when, view, crit, link]) => card(h('b', null, n), h('div', { class: 'tiny muted' }, when), h('p', { class: 'small', style: { margin: '4px 0' } }, view), h('p', { class: 'tiny', style: { color: '#B45309', margin: 0 } }, h('b', null, 'Context and critics: '), crit), link ? h('a', { class: 'tiny', href: '#' + link }, 'Read or try it →') : null))));
R.evidence = (p) => p.append(card(h('h3', { style: { marginTop: 0 } }, 'What the evidence says'), h('p', { class: 'small muted' }, 'Philosophy asks what should work; data can test some of it.'),
  EVIDENCE.map(([q, a, c]) => h('div', { style: { margin: '10px 0' } }, h('div', { class: 'row' }, h('b', null, q), Lab.conf(c)), h('p', { class: 'small', style: { margin: '2px 0' } }, a))),
  h('p', { class: 'small' }, 'A fair summary: party-state systems can select experienced administrators and act fast, but have no peaceful way to remove a bad leader and are prone to hiding bad news. Electoral democracies can pick inexperienced or demagogic leaders and move slowly, but can remove leaders without violence and expose mistakes publicly.')));
R.claims = (p) => { let i = 0; const box = h('div'); const show = () => { box.innerHTML = ''; if (i >= CLAIMS.length) { box.append(card(h('h3', null, 'Done'), h('button', { class: 'btn sm', onclick: () => { i = 0; show(); } }, 'Again'))); return; } const [c, v, why] = CLAIMS[i]; const res = h('div');
  box.append(card(h('div', { class: 'tiny muted' }, `Belief ${i + 1} of ${CLAIMS.length}`), h('h3', null, '“' + c + '”'), h('div', { class: 'row', style: { gap: '6px' } }, ['True', 'Mostly false', 'False'].map((o) => h('button', { class: 'btn sm', onclick: () => { if (res.childNodes.length) return; res.append(h('p', null, h('b', null, (o === v ? '✓ ' : '✗ ') + 'Verdict: ' + v)), h('p', { class: 'small' }, why), h('button', { class: 'btn sm primary', onclick: () => { i++; show(); } }, 'Next →')); } }, o))), res)); };
  p.append(card(h('h3', { style: { marginTop: 0 } }, 'Test common beliefs'), h('p', { class: 'small muted' }, 'Including some that come up often when comparing systems.')), box); show(); };

M.render.chosen = (el) => {
  const SECTIONS = [['start', '🧭 Start'], ['pipes', '🪜 Ways to the top'], ['careers', '📊 Careers'], ['parties', '🎭 Party systems'], ['debate', '🏛️ The debate'], ['evidence', '🔬 Evidence'], ['claims', '🔎 Test beliefs']];
  const panel = h('div', { class: 'stack' }); const nav = h('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } });
  const go = (k) => { nav.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.k === k)); panel.innerHTML = ''; R[k](panel, go); };
  SECTIONS.forEach(([k, n]) => nav.append(h('span', { class: 'chip', 'data-k': k, onclick: () => go(k) }, n)));
  el.append(card(nav), panel); go('start');
};
