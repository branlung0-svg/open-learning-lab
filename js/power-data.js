/* Who really rules? Power structures of North Korea and Vietnam in depth, plus a same-questions comparison
   with China, Cuba, Laos, the US and South Korea. Used by modern11.js. Current through November 2026. */
(function () {
  const P = {};
  P.howto = [
    ['📜 The paper structure', 'What the constitution says: parliaments, presidents, courts, elections.'],
    ['🪪 Who picks whom', 'Follow appointments. Whoever chooses the people in the top jobs holds the real power.'],
    ['🔫 Who controls the guns', 'Army, police and secret police: who do they answer to?'],
    ['💰 Who controls the money', 'Budgets, state companies, foreign currency, markets.'],
    ['📣 Who controls information', 'Media, schools, internet, ideology.'],
    ['🚪 How can it change?', 'Elections, party votes, succession, coups, revolts.'],
  ];

  // Each country: name, flag, one-line summary, layers [[icon, title, text]], money, ideology, change, recent [[date,text,conf]], tellings [[who, view, leaves out]], numbers, conf, sources, links
  P.countries = {
    dprk: {
      n: 'North Korea (DPRK)', flag: '🇰🇵', img: 'pw:pyongyang',
      sum: 'A one-party state where real power runs through one family. Three legal parties exist, but two of them only exist to support the ruling Workers’ Party of Korea. There is no competition for power.',
      parties: [['Workers’ Party of Korea (WPK)', 'The ruling party, founded 1946–49. Leads the state, the army and society under its rules and constitution.', 'Rules'], ['Korean Social Democratic Party', 'A small party founded in 1945, originally for businessmen and Christians in the North. It accepts WPK leadership and holds a few seats in the parliament.', 'Allied, no real power'], ['Chondoist Chongu Party', 'Linked to Chondoism (Cheondogyo), a Korean religion born from the 19th-century Donghak peasant movement. Also accepts WPK leadership.', 'Allied, no real power']],
      partyNote: 'So “a three-party system” is technically true and practically misleading. The minor parties sit inside a front the WPK leads; they never run against it. Even some careful Western analysts call the WPK “the only party”, which is also slightly off. Precise words matter in both directions.',
      layers: [
        ['👑', 'The Supreme Leader', 'Kim Jong Un (since December 2011), grandson of founder Kim Il Sung. He is General Secretary of the WPK, President of the State Affairs Commission (head of state), Chairman of the party’s Central Military Commission and Supreme Commander of the armed forces. Power has passed down the Kim family for three generations.'],
        ['🏛️', 'The Party at the center', 'The Party Congress (revived in 2016, now about every five years) elects a Central Committee, which elects the Politburo and its small Presidium, the inner circle. The Ninth Congress met 19–25 February 2026 and re-elected Kim. The key departments are the Organization and Guidance Department (which controls appointments and watches every official) and the Propaganda and Agitation Department.'],
        ['🏢', 'The state (on paper)', 'The Supreme People’s Assembly is the parliament. Voters receive one approved candidate per district, and turnout is reported near 100%. It meets briefly to approve decisions. The Cabinet, led by a Premier, runs the economy day to day. Courts answer to the party.'],
        ['🔫', 'The guns', 'The Korean People’s Army is large (over a million soldiers by most estimates) and answers to the party and Kim personally. Under Kim Jong Il the military was raised above the party (“Songun”, military-first); Kim Jong Un restored the party’s primacy. The Ministry of State Security runs the secret police and political prison camps; a 2014 UN Commission of Inquiry estimated 80,000–120,000 political prisoners.'],
        ['📣', 'Information and belief', 'All media are state media. Foreign broadcasts, films and phones are banned, with severe punishment under recent laws against “reactionary thought”. Ideology: Juche (self-reliance) and loyalty to the Kim family, codified in the Ten Principles for the Monolithic Ideological System (1974, revised 2013), which rank loyalty to the leader above any law.'],
        ['🧬', 'Who you are born as', 'Songbun, a hereditary classification of every family as core, wavering or hostile based on their ancestors’ actions around 1945–53, shapes where people may live, study and work.'],
      ],
      money: 'The state economy failed in the 1990s; a famine (1994–98) killed hundreds of thousands, with estimates from about 240,000 to 3.5 million and most scholars nearer the lower-middle of that range. Private markets (jangmadang) grew to survive and are now tolerated and taxed. The leadership earns foreign currency through arms exports, workers abroad, smuggling and cyber theft (US and UN investigators attribute billions in cryptocurrency theft to North Korean hackers). Since 2024 arms and troops sent to Russia have brought money, food, oil and possibly technology. South Korea’s central bank estimates income per person in the North at roughly 1/30th of the South’s.',
      change: 'There is no legal path to change leaders. Change has come only through death and family succession (1994, 2011). Kim’s possible successor is debated; his daughter (named Ju Ae by South Korean intelligence) appears often in state media.',
      recent: [
        ['Jan 2024', 'Kim declared South Korea the “principal enemy”, abandoned the goal of peaceful reunification and closed reunification agencies.', 'Established'],
        ['Jun 2024', 'A treaty with Russia promised mutual military aid. North Korean troops later fought for Russia in the Kursk region, which Pyongyang confirmed in 2025.', 'Established'],
        ['Feb 2026', 'The Ninth Party Congress re-elected Kim Jong Un as General Secretary, expanded the Congress presidium to 39 members, and reaffirmed the rejection of reunification. South Korea reported tens of thousands of containers of weapons shipped to Russia.', 'Established'],
      ],
      tellings: [
        ['North Korean state', 'A socialist, independent nation led by a wise leader, surrounded by hostile powers, especially the US. Nuclear weapons guarantee survival.', 'Prison camps, famine deaths, the failure of the planned economy, the absence of political freedom.'],
        ['South Korean conservatives', 'A criminal dictatorship and the main military threat; only strength and alliance with the US work.', 'How Seoul’s own past dictatorships and US threats shaped Pyongyang’s fears.'],
        ['South Korean progressives', 'A dangerous but rational state that engagement and trade can slowly change.', 'That engagement in 1998–2008 and 2018 did not stop the nuclear program.'],
        ['US government', 'A rogue state and proliferation threat to be denuclearized through sanctions and pressure.', 'That decades of sanctions have not worked, and that the Iraq and Libya cases taught Pyongyang that giving up weapons is risky.'],
        ['China', 'A troublesome neighbor but a buffer against US forces; stability comes first.', 'China’s role in keeping the regime afloat.'],
        ['Defectors and survivors', 'First-hand testimony of camps, famine and control.', 'Testimony varies; a few well-known accounts changed under scrutiny (Shin Dong-hyuk revised his story in 2015), though the overall picture is confirmed by satellite images and hundreds of witnesses.'],
        ['Scholars such as Andrei Lankov', 'Not crazy but ruthlessly rational: every policy serves regime survival.', 'Ordinary people’s lives can disappear in a focus on the leadership.'],
      ],
      conf: 'Strong', src: 'UN Commission of Inquiry (2014); KCNA; Bank of Korea; Daily NK; KEIA; NK News; historians (Lankov, Cumings)',
    },
    vietnam: {
      n: 'Vietnam', flag: '🇻🇳', img: 'pw:hanoi',
      sum: 'A one-party communist state with a market economy. The Communist Party of Vietnam (CPV) is the only legal party. Power has traditionally been shared among four top leaders, but in 2026 the party chief also became head of state, concentrating power more than in decades.',
      parties: [['Communist Party of Vietnam (CPV)', 'Founded by Ho Chi Minh in 1930. The constitution names it “the force leading the State and society.”', 'Rules alone'], ['Vietnam Fatherland Front', 'Not a party: an umbrella of party-led mass organizations (unions, women, youth, religions) that vets every election candidate.', 'Party-led']],
      partyNote: 'No other party is legal. Independent candidates may try to run, but the Fatherland Front screens them out almost entirely.',
      layers: [
        ['🏛️', 'The Party Congress and Central Committee', 'Every five years a National Party Congress sets the line and elects the Central Committee. The 14th Congress (19–23 January 2026) elected a 200-member Central Committee, which elected a 19-member Politburo and re-elected To Lam as General Secretary by 180 votes to 0.'],
        ['🪪', 'Who picks whom', 'The Politburo and its Organization Commission decide who fills every important party and state job; the National Assembly then confirms them. Le Minh Hung chaired the Organization Commission before becoming Prime Minister in 2026.'],
        ['4️⃣', 'The “four pillars”, and their merger', 'For decades the top jobs were split among four people: General Secretary, State President, Prime Minister and Chair of the National Assembly, a form of collective leadership. In April 2026 the National Assembly elected General Secretary To Lam as State President too (495 of 495 votes), echoing China’s model. Le Minh Hung became Prime Minister and Tran Thanh Man remained Assembly Chair.'],
        ['🏢', 'The National Assembly', 'Elected every five years from candidates vetted by the Fatherland Front; nearly all deputies are party members. It debates laws and questions ministers more openly than North Korea’s parliament, but it ratifies party decisions.'],
        ['🔫', 'The guns and the police', 'The People’s Army and the Ministry of Public Security answer to the party. To Lam rose through public security and, as minister, enforced the “blazing furnace” anti-corruption campaign that removed presidents, deputy prime ministers and business tycoons. Critics say it also removed rivals.'],
        ['📣', 'Information', 'All newspapers and broadcasters are party or state owned. Social media is widely used but monitored; bloggers and journalists who criticize the party have received long prison sentences.'],
      ],
      money: 'After war and a failed planned economy (food shortages and inflation of several hundred percent in the mid-1980s), the 1986 Đổi Mới (“Renovation”) reforms allowed private business, foreign investment and markets. Vietnam became a major exporter of electronics, clothing and food; poverty fell from roughly half the population around 1990 to a few percent. State firms still dominate key sectors. In 2025 the state merged its 63 provinces into 34 and abolished the district tier to cut bureaucracy. The new government set a growth target of about 10% a year.',
      change: 'Change happens inside the party: at congresses, in Central Committee votes and through anti-corruption purges. There are no competitive national elections.',
      recent: [
        ['Aug 2024', 'To Lam became General Secretary after Nguyen Phu Trong died.', 'Established'],
        ['Jan 2026', 'The 14th Party Congress re-elected To Lam unanimously; a 19-member Politburo was elected.', 'Established'],
        ['Apr 2026', 'The new National Assembly elected To Lam as State President and Le Minh Hung as Prime Minister, both unanimously.', 'Established'],
      ],
      tellings: [
        ['Communist Party of Vietnam', 'The party led the nation to independence, reunification and prosperity; unity and stability make growth possible.', 'Political prisoners; the absence of choice; corruption at the top.'],
        ['Overseas Vietnamese (especially in the US)', 'A communist dictatorship that took their country in 1975 and still jails dissidents.', 'The scale of poverty reduction and the support the government has at home.'],
        ['Foreign investors and Western governments', 'A stable, growing partner and an alternative to China for factories (“China plus one”).', 'Human rights, which they mention but rarely act on.'],
        ['Human rights groups', 'Press freedom near the bottom of world rankings; activists jailed for Facebook posts.', 'Economic gains people value.'],
        ['China', 'A fellow socialist state on a similar path, despite a 1979 war and South China Sea disputes.', 'Those disputes and the war.'],
      ],
      conf: 'Strong', src: 'Vietnam News Agency; Reuters; AP; World Bank; Reporters Without Borders',
    },
  };

  // Same questions for every system: [question, DPRK, Vietnam, China, Cuba, Laos, United States, South Korea]
  P.compareCols = ['🇰🇵 North Korea', '🇻🇳 Vietnam', '🇨🇳 China', '🇨🇺 Cuba', '🇱🇦 Laos', '🇺🇸 United States', '🇰🇷 South Korea'];
  P.compare = [
    ['Legal parties', '3 (WPK leads; 2 allied minor parties)', '1 (CPV)', '9 (CCP leads; 8 small allied parties)', '1 (Communist Party of Cuba)', '1 (Lao People’s Revolutionary Party)', 'Many; 2 dominate', 'Many'],
    ['Can the ruling party lose power in an election?', 'No', 'No', 'No', 'No', 'No', 'Yes', 'Yes'],
    ['How the top leader is chosen', 'Family succession, confirmed by the party', 'Party Central Committee', 'Party Central Committee', 'Party and National Assembly', 'Party Congress and Central Committee', 'Popular vote through the Electoral College', 'Direct popular vote'],
    ['Term limits for the top leader', 'None', 'Informal age and term norms, with exceptions', 'Removed for the presidency in 2018', 'Two 5-year terms (2019 constitution)', 'Informal', 'Two 4-year terms', 'One 5-year term'],
    ['Army answers to', 'Party and leader', 'Party', 'Party', 'Party', 'Party', 'Elected civilian government', 'Elected civilian government'],
    ['Independent courts and press', 'No', 'No', 'No', 'No', 'No', 'Yes, with debates about pressure', 'Yes, with debates about pressure'],
    ['Peaceful transfer of power between rivals in last 40 years', 'Never', 'Never (only within the party)', 'Never (only within the party)', 'Never (only within the party)', 'Never (only within the party)', 'Many times', 'Many times since 1987'],
    ['Where real power concentrates', 'Leader, family, Organization and Guidance Department', 'Politburo; since 2026 strongly the General Secretary-President', 'General Secretary Xi Jinping and the Politburo Standing Committee', 'Party leadership and the military’s business arm', 'Politburo', 'Split among President, Congress, courts, states; money and lobbying matter', 'President (strong), National Assembly, courts; big business groups matter'],
  ];
  P.compareNote = 'A table like this can make the democracies look simply better, and on the question of who can be voted out, they are. It cannot show everything: democracies also concentrate power (money in US politics, chaebol in South Korea, surveillance agencies), and one-party states can deliver rapid growth (China, Vietnam). The point is to ask every system the same questions.';
  Lab.POWER = P;
})();
