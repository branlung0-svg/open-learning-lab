const { h } = Lab;

const YEARS = [1492, 1600, 1700, 1715, 1783, 1800, 1815, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2010];

const ERAS = {
  1492: ['Two worlds about to collide', 'Columbus reaches the Caribbean; Spain completes the conquest of Granada. The Americas are home to the Aztec and Inca empires and hundreds of other nations. Ming China and the Ottoman Empire are among the most powerful states on earth.', 'Almost all of the Americas, Africa and Australia are ruled by peoples who live there. Watch how fast that changes.'],
  1600: ['The first global empires', 'Spain and Portugal (joined under one king from 1580 to 1640) hold most of the Americas. The Mughals rule northern India, the Ottomans reach Hungary, and Japan is unified after the battle of Sekigahara. The English (1600) and Dutch (1602) East India Companies are founded: private companies that will build empires.', 'Spanish America is huge on paper; real control was mostly cities, mines and coasts.'],
  1700: ['Asia still leads the world economy', 'By Angus Maddison’s estimates China and India together produced roughly half of the world’s output. Qing (Manchu) China is expanding west. European states hold coasts and islands in Africa and Asia, not interiors.', 'Compare the size of European holdings in Asia here with 1900.'],
  1715: ['After the War of the Spanish Succession', 'The Treaties of Utrecht (1713) settle a world war over who inherits Spain: a French Bourbon gets the throne, Britain gains Gibraltar, Newfoundland and the slave-trade contract to Spanish America. Louis XIV dies in 1715.', 'Britain’s Atlantic foothold grows; France still holds a vast arc from Quebec to Louisiana.'],
  1783: ['America breaks away', 'The Treaty of Paris recognizes the United States. Britain loses 13 colonies but keeps Canada, and its East India Company already rules Bengal after the battle of Plassey (1757). Russia annexes Crimea the same year.', 'France’s North American empire is gone, lost in the Seven Years’ War (1756–63).'],
  1800: ['Revolutions and Napoleon', 'Revolutionary France is at war with most of Europe; Napoleon has just seized power. In Saint-Domingue enslaved people have risen in revolt; Haiti will declare independence in 1804. Britain is industrializing fastest.', 'Spain still holds almost all of mainland Latin America. In 25 years it will be nearly gone.'],
  1815: ['The Congress of Vienna', 'Napoleon is beaten at Waterloo and Europe’s great powers redraw the map to balance each other, a settlement that limits big wars for about a century. Across Latin America, wars of independence are underway.', 'Look at the patchwork of German states. Unification is still 56 years away.'],
  1880: ['The eve of the Scramble for Africa', 'Germany (1871) and Italy (1861–70) are new nation-states. Britain rules India directly since 1858; Meiji Japan is modernizing at speed. In 1884–85 European powers meet in Berlin to set rules for claiming Africa.', 'Most of Africa’s interior is still independent. Compare with 1900.'],
  1900: ['Peak empire', 'Nearly all of Africa has been colonized, mostly in about 20 years. The US has taken the Philippines, Puerto Rico and Guam from Spain (1898). In China the Boxer uprising is crushed by an eight-nation force.', 'Only Ethiopia and Liberia remain independent in Africa.'],
  1914: ['The world goes to war', 'The assassination of Archduke Franz Ferdinand in Sarajevo sets off a war between alliance blocs: Germany, Austria-Hungary and the Ottomans against France, Russia and Britain (Italy and the US join later). About 20 million people will die, soldiers and civilians.', 'Four empires on this map won’t survive the war. Can you find them?'],
  1920: ['Empires fall, new states rise', 'The German, Austro-Hungarian, Ottoman and Russian empires are gone. Poland, Czechoslovakia, Yugoslavia and the Baltic states appear. Britain and France take Ottoman lands as League of Nations mandates. Russia is in a civil war the Bolsheviks will win.', 'The borders drawn in the Middle East now still shape conflicts there.'],
  1930: ['Depression and dictatorship', 'The 1929 crash spreads into a global depression. In the USSR, Stalin forces farms into collectives; famine follows in 1932–33. Italy is fascist; Hitler will take power in Germany in 1933.', 'The map looks calm. The economy and politics underneath are not.'],
  1938: ['The road to the Second World War', 'Japan has invaded China (1937), Italy has conquered Ethiopia (1936), and Germany has annexed Austria and, at Munich, the Sudetenland. Britain and France choose appeasement.', 'Compare Japan’s reach here with 1914.'],
  1945: ['The war ends', 'Roughly 70–85 million people have died. Germany and Japan surrender and are occupied; the United Nations is founded; the US has used atomic bombs. The USSR holds Eastern Europe. Colonial empires are still on the map but weakened.', 'Most of Africa and much of Asia is still colonial. That will change within 20 years.'],
  1960: ['Decolonization and the Cold War', 'Seventeen African countries become independent in 1960 alone. The world is split between US-led and Soviet-led blocs, with many countries trying to stay non-aligned. In China, the Great Leap Forward has caused one of history’s deadliest famines (1959–61).', 'Count the new states in Africa compared with 1945.'],
  1994: ['After the Cold War', 'The USSR has split into 15 countries (1991), Germany has reunified (1990) and Yugoslavia is breaking apart in war. South Africa holds its first all-race election; genocide kills hundreds of thousands in Rwanda. The European Union has just been created (1993).', 'Find the new countries of Central Asia and the Baltics.'],
  2010: ['A globalized, multipolar world', 'China has just become the world’s second-largest economy. The world is recovering from the 2008 financial crisis. The US is at war in Afghanistan and Iraq. Borders have changed little since 1994.', 'The big changes since 1994 are economic, not territorial. Check the economy explorer.'],
};

// [year, lat, lon, title, category, description, confidence?]
const EVENTS = [
  [1492, 24.0, -74.5, 'Columbus reaches the Americas', 'diplomacy', 'Begins lasting contact between Europe and the Americas. Within a century, epidemics and conquest kill most of the Indigenous population; estimates of the scale vary widely.', 'Established'],
  [1521, 19.43, -99.13, 'Fall of Tenochtitlan', 'war', 'Cortés and tens of thousands of Indigenous allies take the Aztec capital; smallpox had already devastated the city.'],
  [1533, -13.52, -71.97, 'Spanish take the Inca capital', 'war', 'Pizarro’s small force exploits an Inca civil war and epidemic disease.'],
  [1600, 35.37, 136.46, 'Battle of Sekigahara', 'war', 'Tokugawa Ieyasu wins control of Japan; his shogunate rules until 1868 and largely closes Japan to foreigners.'],
  [1607, 37.21, -76.78, 'Jamestown founded', 'diplomacy', 'First permanent English settlement in North America. Tobacco and, from 1619, enslaved Africans shape Virginia.'],
  [1648, 52.0, 7.6, 'Peace of Westphalia', 'diplomacy', 'Ends the Thirty Years’ War; often credited with the idea of sovereign states, though historians debate how new that was.', 'Contested'],
  [1683, 48.2, 16.37, 'Siege of Vienna fails', 'war', 'The Ottoman advance into Europe is stopped; the long Ottoman retreat from Central Europe begins.'],
  [1688, 51.5, -0.13, 'Glorious Revolution', 'revolution', 'Parliament replaces James II with William and Mary; the Bill of Rights limits the crown. Many economists link secure property rights after 1688 to Britain’s later growth (North & Weingast); others dispute the timing.', 'Contested'],
  [1709, 49.59, 34.55, 'Battle of Poltava', 'war', 'Peter the Great defeats Sweden; Russia becomes a major European power.'],
  [1757, 23.8, 88.25, 'Battle of Plassey', 'war', 'The British East India Company defeats the Nawab of Bengal, beginning company rule over much of India.'],
  [1759, 46.81, -71.21, 'Fall of Quebec', 'war', 'Britain wins the key battle of the Seven Years’ War in North America; France loses Canada in 1763.'],
  [1769, 55.86, -4.25, 'Watt’s steam engine patent', 'science', 'James Watt’s separate condenser makes steam power far more efficient, a key technology of the Industrial Revolution.'],
  [1776, 39.95, -75.15, 'Declaration of Independence', 'revolution', 'Thirteen colonies declare independence on the principle that governments get their power from the consent of the governed. Read the full text in the Reading Room.'],
  [1776, 55.95, -3.19, 'The Wealth of Nations', 'economy', 'Adam Smith argues that markets, the division of labor and free trade create wealth. It is in the Reading Room.'],
  [1781, 37.24, -76.51, 'Yorktown', 'war', 'With decisive French help, American and French forces trap a British army; the war is effectively over.'],
  [1787, 39.95, -75.15, 'US Constitution written', 'revolution', 'A federal republic with separated powers and checks and balances. The Federalist Papers argue for it.'],
  [1789, 48.85, 2.37, 'Storming of the Bastille', 'revolution', 'The French Revolution begins: absolute monarchy ends, the Declaration of the Rights of Man follows, then the Terror (1793–94).'],
  [1791, 19.7, -72.3, 'Haitian Revolution begins', 'revolution', 'The only successful large-scale uprising of enslaved people; Haiti becomes independent in 1804.'],
  [1805, 36.2, -6.0, 'Trafalgar', 'war', 'Britain’s navy destroys the Franco-Spanish fleet, securing British sea power for a century.'],
  [1812, 55.75, 37.62, 'Napoleon reaches Moscow', 'war', 'Of roughly 600,000 men who invaded Russia, only a small fraction return.'],
  [1815, 50.68, 4.41, 'Waterloo', 'war', 'Napoleon’s final defeat; the Congress of Vienna rebuilds a balance of power in Europe.'],
  [1824, -13.0, -74.1, 'Battle of Ayacucho', 'war', 'Seals the independence of Spanish South America.'],
  [1830, 53.41, -2.98, 'Liverpool–Manchester Railway', 'science', 'The first intercity railway powered only by steam locomotives.'],
  [1839, 23.13, 113.26, 'First Opium War', 'war', 'Britain goes to war after China destroys British opium. The 1842 Treaty of Nanjing gives Britain Hong Kong: the start of what China calls the “century of humiliation.”'],
  [1848, 51.51, -0.13, 'The Communist Manifesto', 'economy', 'Marx and Engels publish a call for workers’ revolution, the same year revolutions sweep Europe. Full text in the Reading Room.'],
  [1850, 32.06, 118.8, 'Taiping Rebellion', 'war', 'A civil war in China (1850–64) that killed perhaps 20–30 million people, among the deadliest wars in history.', 'Strong'],
  [1857, 28.65, 77.23, 'Indian Rebellion', 'war', 'A major uprising against Company rule; Britain crushes it and the crown takes direct control of India in 1858.'],
  [1859, 51.51, -0.13, 'On the Origin of Species', 'science', 'Darwin publishes the theory of evolution by natural selection.'],
  [1861, 32.75, -79.87, 'US Civil War begins', 'war', 'About 620,000–750,000 die. The 13th Amendment (1865) abolishes slavery except as punishment for a crime, an exception still in the Constitution today.'],
  [1868, 35.68, 139.76, 'Meiji Restoration', 'revolution', 'Japan’s leaders modernize at speed: railways, factories, schools, a conscript army. Within 40 years Japan defeats Russia.'],
  [1869, 30.6, 32.3, 'Suez Canal opens', 'economy', 'Cuts the sea route from Europe to Asia by thousands of miles.'],
  [1871, 48.8, 2.12, 'German Empire proclaimed', 'diplomacy', 'Prussia unifies Germany after defeating France; Europe’s balance of power shifts.'],
  [1884, 52.52, 13.4, 'Berlin Conference', 'diplomacy', 'European powers set rules for claiming Africa. No Africans are present.'],
  [1898, 23.1, -82.37, 'Spanish–American War', 'war', 'The US takes the Philippines, Puerto Rico and Guam and becomes an overseas empire.'],
  [1905, 34.5, 129.5, 'Japan defeats Russia', 'war', 'The first modern defeat of a European great power by an Asian one.'],
  [1911, 30.55, 114.3, 'Xinhai Revolution', 'revolution', 'The Qing dynasty falls; China becomes a republic but soon fragments among warlords.'],
  [1914, 43.86, 18.41, 'Assassination in Sarajevo', 'war', 'The killing of Archduke Franz Ferdinand triggers the First World War. Historians still argue over how much blame Germany bears.', 'Contested'],
  [1917, 59.94, 30.31, 'Russian Revolution', 'revolution', 'The tsar falls in February; the Bolsheviks seize power in October. The Soviet Union is founded in 1922.'],
  [1919, 48.8, 2.12, 'Treaty of Versailles', 'diplomacy', 'Germany loses territory and must pay reparations. Keynes called it a Carthaginian peace; others argue it was not harsh enough to stop German revival.', 'Contested'],
  [1929, 40.71, -74.01, 'Wall Street Crash', 'economy', 'Starts the Great Depression; world trade collapses by about two-thirds by value.'],
  [1932, 50.45, 30.52, 'Soviet famine', 'war', 'Famine in 1932–33 kills millions, most of all in Ukraine and Kazakhstan. Whether it was genocide against Ukrainians is debated among historians.', 'Contested'],
  [1937, 32.06, 118.8, 'Japan invades China', 'war', 'After seizing Manchuria in 1931 and pushing into northern China, Japan’s army turned a clash near Beijing into full-scale war. Japan sought resources and empire while Western powers held colonies across Asia; China was split between Nationalists and Communists. The Nanjing massacre followed that December.'],
  [1939, 52.23, 21.0, 'Germany invades Poland', 'war', 'Hitler, having taken Austria and Czechoslovakia while Britain and France appeased him, invaded Poland after a secret pact with Stalin to divide it; the USSR invaded from the east on 17 September. Germans’ anger at the 1919 peace and the Depression had helped bring the Nazis to power. The Second World War begins in Europe.'],
  [1941, 21.36, -157.95, 'Pearl Harbor', 'war', 'After four years of war in China, Japan faced a US, British and Dutch oil embargo and a US demand to leave China. It chose war, attacking the US fleet and Western colonies across Southeast Asia at once. The US enters the war.'],
  [1942, 48.7, 44.5, 'Stalingrad', 'war', 'The turning point on the Eastern Front, where most German military losses occurred.'],
  [1945, 34.39, 132.45, 'Hiroshima and Nagasaki', 'war', 'Atomic bombs kill roughly 140,000 and 74,000 people by the end of 1945. See the case study in the Doc.', 'Strong'],
  [1947, 31.6, 74.4, 'Partition of India', 'diplomacy', 'India and Pakistan become independent; partition violence kills hundreds of thousands to 2 million and displaces about 15 million.'],
  [1948, 31.77, 35.21, 'Israel founded', 'diplomacy', 'War with neighboring states follows; about 700,000 Palestinians flee or are expelled. The causes of the exodus are among history’s most argued questions.', 'Contested'],
  [1949, 39.9, 116.4, 'People’s Republic of China', 'revolution', 'Mao’s Communists win the civil war; the Nationalists retreat to Taiwan.'],
  [1950, 38.0, 127.0, 'Korean War', 'war', 'Korea, split by the US and USSR in 1945 without Koreans’ consent, had two rival states and years of uprisings, massacres and border fighting. In June 1950 the North, with Stalin’s and Mao’s approval, launched a full invasion; US-led UN forces and then China joined. About 3 million died; a 1953 armistice left the border near where it began.'],
  [1957, 45.96, 63.3, 'Sputnik', 'science', 'The USSR launches the first satellite; the space race begins.'],
  [1959, 23.1, -82.37, 'Cuban Revolution', 'revolution', 'Castro takes power and later allies with the USSR.'],
  [1959, 33.0, 113.0, 'Great Leap Forward famine', 'economy', 'Forced collectivization and grain requisitions cause a famine (1959–61). Estimates range from about 15 to 45 million deaths.', 'Strong'],
  [1962, 22.5, -80.0, 'Cuban Missile Crisis', 'war', 'The closest the Cold War came to nuclear war.'],
  [1964, 19.0, 107.0, 'Gulf of Tonkin', 'war', 'A reported attack that likely never happened leads Congress to authorize war in Vietnam. Full case study in the Evidence Lab.'],
  [1969, 28.57, -80.65, 'Moon landing', 'science', 'Apollo 11 lands humans on the Moon.'],
  [1973, 24.7, 46.7, 'Oil embargo', 'economy', 'Arab oil producers cut supplies to the US and others; oil prices quadruple.'],
  [1975, 10.82, 106.63, 'Fall of Saigon', 'war', 'North Vietnam takes the South; the Vietnam War ends.'],
  [1978, 39.9, 116.4, 'China opens up', 'economy', 'Deng Xiaoping begins market reforms. About 800 million Chinese leave extreme poverty over the next four decades.'],
  [1979, 35.69, 51.39, 'Iranian Revolution', 'revolution', 'The shah, restored by a US-British coup in 1953 and ruling through a feared secret police, falls to a broad revolution that clerics come to dominate; an Islamic Republic is founded. The same year the USSR invades Afghanistan to prop up a communist regime facing revolt.'],
  [1989, 52.52, 13.4, 'Berlin Wall falls', 'revolution', 'Communist governments across Eastern Europe collapse, mostly peacefully.'],
  [1989, 39.9, 116.39, 'Tiananmen crackdown', 'revolution', 'The army clears protests in Beijing. The death toll is still unknown. Full case study in the Evidence Lab.', 'Unknown'],
  [1991, 55.75, 37.62, 'USSR dissolves', 'revolution', 'Fifteen independent states replace the Soviet Union.'],
  [1994, -1.95, 30.06, 'Rwandan genocide', 'war', 'About 500,000–800,000 people, mostly Tutsi, are murdered in about 100 days.'],
  [1994, -25.75, 28.19, 'South Africa’s first free election', 'revolution', 'Apartheid ends; Nelson Mandela becomes president.'],
  [2001, 40.71, -74.01, 'September 11 attacks', 'war', 'Al-Qaeda, which grew out of the US- and Saudi-backed Afghan jihad of the 1980s and cited US troops in Saudi Arabia, sanctions on Iraq and support for Israel, kills nearly 3,000 people. The US invades Afghanistan, whose Taliban rulers hosted al-Qaeda.'],
  [2003, 33.31, 44.37, 'Invasion of Iraq', 'war', 'Justified mainly by weapons claims that proved false. Full case study in the Evidence Lab.'],
  [2008, 40.71, -74.01, 'Global financial crisis', 'economy', 'US housing losses spread through banks worldwide; the deepest recession since the 1930s.'],
  [2011, 30.04, 31.24, 'Arab Spring', 'revolution', 'Uprisings across the Arab world; wars follow in Syria, Libya and Yemen.'],
  [2014, 44.95, 34.1, 'Russia annexes Crimea', 'war', 'Followed by war in eastern Ukraine.'],
  [2020, 30.59, 114.3, 'COVID-19 pandemic', 'science', 'Millions of deaths worldwide. Where the virus came from is still disputed: a natural spillover or a lab-related accident.', 'Contested'],
  [2022, 50.45, 30.52, 'Russia invades Ukraine', 'war', 'After annexing Crimea and backing a war in eastern Ukraine since 2014, Russia launches a full invasion, claiming NATO’s eastward expansion threatened it and that Ukraine belongs in its sphere; Ukraine says it is fighting for survival as a nation. The largest war in Europe since 1945.'],
  [2022, 37.77, -122.42, 'ChatGPT launches', 'science', 'Large language models reach the public; the AI race accelerates.'],
];

const CAT = { war: ['War & conflict', '#DC2626'], revolution: ['Revolution', '#7C3AED'], economy: ['Economy', '#059669'], science: ['Science & tech', '#2563EB'], diplomacy: ['Diplomacy & empire', '#D97706'] };

// Normalize who controls a territory into one empire key, with a fixed color for the big ones
const EMPIRES = [
  [/brit|united kingdom|england|east india company|great britain/i, 'British', '#E63946'],
  [/franc|french/i, 'French', '#3A86FF'],
  [/spain|spanish/i, 'Spanish', '#FFBE0B'],
  [/portug/i, 'Portuguese', '#2A9D8F'],
  [/netherland|dutch/i, 'Dutch', '#FB5607'],
  [/russia|ussr|soviet/i, 'Russian / Soviet', '#8338EC'],
  [/ottoman|turkey/i, 'Ottoman / Turkey', '#06D6A0'],
  [/manchu|qing|china|ming/i, 'Chinese', '#B5179E'],
  [/japan|tokugawa/i, 'Japanese', '#FF006E'],
  [/united states/i, 'United States', '#1D4E89'],
  [/german|prussia/i, 'German', '#6C757D'],
  [/austria|habsburg/i, 'Austrian', '#C08552'],
  [/ital/i, 'Italian', '#80B918'],
  [/mughal/i, 'Mughal', '#9D4EDD'],
  [/belgi/i, 'Belgian', '#8D6E63'],
];
function empireOf(p) {
  const s = (p.SUBJECTO || p.NAME || '').trim();
  for (const [re, name, col] of EMPIRES) if (re.test(s)) return { key: name, color: col };
  let x = 0; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = x % 360;
  return { key: s || 'Unclaimed / unknown', color: `hsl(${hue} 30% 72%)`, minor: true };
}
function rewind(fc) {
  for (const f of fc.features) {
    if (!f.geometry) continue;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [];
    for (const poly of polys) {
      if (d3.geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI) for (const ring of poly) ring.reverse();
    }
  }
  return fc;
}

Lab.explorer('history', 'atlas', {
  mount(el, arg) {
    let year = YEARS.includes(+arg) ? +arg : 1914, playing = null, sel = null;
    const W = 960, H = 500;
    const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).style('width', '100%').style('height', 'auto').style('touch-action', 'none');
    const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' });
    const path = d3.geoPath(proj);
    const g = svg.append('g');
    g.append('path').datum({ type: 'Sphere' }).attr('d', path).attr('fill', 'color-mix(in srgb, #3B82F6 14%, var(--card2))');
    g.append('path').datum(d3.geoGraticule10()).attr('d', path).attr('fill', 'none').attr('stroke', 'rgba(127,127,160,.18)');
    const land = g.append('g'), pins = g.append('g');
    const zoom = d3.zoom().scaleExtent([1, 12]).on('zoom', (e) => { g.attr('transform', e.transform); pins.selectAll('circle').attr('r', 5 / e.transform.k).attr('stroke-width', 1.5 / e.transform.k); land.selectAll('path').attr('stroke-width', 0.4 / e.transform.k); });
    svg.call(zoom);
    const tip = h('div', { class: 'tip', style: { display: 'none' } });

    const yearLbl = h('div', { class: 'kpi' });
    const slider = h('input', { type: 'range', min: 0, max: YEARS.length - 1, step: 1, value: YEARS.indexOf(year) });
    const playBtn = h('button', { class: 'btn primary sm' }, '▶ Play');
    const eraBox = h('div', { class: 'card' });
    const legend = h('div', { class: 'card' });
    const info = h('div', { class: 'card' }, h('h3', null, 'Tap any territory'), h('p', { class: 'muted small' }, 'See who ruled it in this year, then ask the tutor how it got there.'));
    const viz = h('div', { class: 'viz' }, svg.node(), tip);
    const ticks = h('div', { class: 'row tiny muted', style: { justifyContent: 'space-between' } }, YEARS.filter((y, i) => i % 2 === 0).map((y) => h('span', null, y)));

    el.append(
      h('div', { class: 'card' },
        h('div', { class: 'row' }, yearLbl, h('span', { class: 'sp' }), playBtn, h('button', { class: 'btn sm', onclick: () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity) }, 'Reset zoom')),
        h('div', { style: { margin: '10px 0 2px' } }, slider), ticks,
        h('div', { style: { height: '10px' } }), viz,
        h('p', { class: 'tiny muted', style: { marginTop: '8px' } }, 'Pinch or scroll to zoom, drag to pan. Pins mark events since the previous map. Colors show who controlled each territory; big empires keep the same color in every year.'),
        Lab.source('<a href="https://github.com/aourednik/historical-basemaps">Historical Basemaps</a> by André Ourednik (GPL-3). Borders before about 1800 are approximate, and many peoples had no fixed borders at all; the map can make control look tidier than it was.')),
      h('div', { class: 'grid g2' }, eraBox, legend), info);

    function drawPins() {
      const i = YEARS.indexOf(year), prev = i > 0 ? YEARS[i - 1] : 1450, next = i < YEARS.length - 1 ? 9999 : 2100;
      const evs = EVENTS.filter(([y]) => y > prev && y <= (i === YEARS.length - 1 ? next : year));
      const k = d3.zoomTransform(svg.node()).k;
      pins.selectAll('circle').data(evs).join('circle')
        .attr('cx', (d) => proj([d[2], d[1]])[0]).attr('cy', (d) => proj([d[2], d[1]])[1])
        .attr('r', 5 / k).attr('fill', (d) => CAT[d[4]][1]).attr('stroke', '#fff').attr('stroke-width', 1.5 / k).style('cursor', 'pointer')
        .on('click', (e, d) => { e.stopPropagation(); showEvent(d); });
    }
    function showEvent(d) {
      info.innerHTML = '';
      info.append(h('div', { class: 'row' }, h('span', { class: 'tag', style: { '--c': CAT[d[4]][1] } }, CAT[d[4]][0]), h('b', null, d[0]), d[6] ? Lab.conf(d[6]) : null),
        h('h3', { style: { marginTop: '8px' } }, d[3]), h('p', null, d[5]),
        h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain "${d[3]}" (${d[0]}): causes, consequences, and where historians disagree. Who benefits from each version of the story?`, `History atlas, event: ${d[3]} (${d[0]})`) }, '✦ Ask: causes, effects, debates'));
    }
    async function load() {
      yearLbl.innerHTML = `${year} <small>· ${ERAS[year][0]}</small>`;
      slider.value = YEARS.indexOf(year);
      const [title, text, notice] = ERAS[year];
      eraBox.innerHTML = '';
      eraBox.append(h('span', { class: 'tag' }, 'The world in ' + year), h('h3', { style: { marginTop: '8px' } }, title), h('p', null, text), h('div', { class: 'hint small' }, h('b', null, 'Notice: '), notice));
      Lab.setContext(`World atlas, year ${year}: ${title}. ${text}`);
      const topo = await Lab.json(`data/w${year}.json`);
      const fc = rewind(topojson.feature(topo, Object.values(topo.objects)[0]));
      const areas = new Map(); let total = 0;
      for (const f of fc.features) { f.emp = empireOf(f.properties); const a = d3.geoArea(f); f.area = a; total += a; const o = areas.get(f.emp.key) || { a: 0, color: f.emp.color, minor: f.emp.minor }; o.a += a; areas.set(f.emp.key, o); }
      const k = d3.zoomTransform(svg.node()).k;
      land.selectAll('path').data(fc.features, (d) => d.properties.NAME + '|' + d.properties.SUBJECTO).join('path')
        .attr('d', path).attr('fill', (d) => d.emp.color).attr('stroke', 'rgba(20,20,43,.55)').attr('stroke-width', 0.4 / k).style('cursor', 'pointer')
        .on('mousemove', (e, d) => { const r = viz.getBoundingClientRect(); tip.style.display = 'block'; tip.style.left = (e.clientX - r.left + 12) + 'px'; tip.style.top = (e.clientY - r.top + 12) + 'px'; tip.innerHTML = `<b>${d.properties.NAME || 'Unnamed'}</b>${d.properties.SUBJECTO && d.properties.SUBJECTO !== d.properties.NAME ? '<br>ruled by ' + d.properties.SUBJECTO : ''}`; })
        .on('mouseleave', () => (tip.style.display = 'none'))
        .on('click', (e, d) => {
          const p = d.properties;
          info.innerHTML = '';
          info.append(h('span', { class: 'tag', style: { '--c': d.emp.minor ? '#64748B' : d.emp.color } }, d.emp.key + (d.emp.minor ? '' : ' empire / state')),
            h('h3', { style: { marginTop: '8px' } }, p.NAME || 'Unnamed territory'),
            h('p', null, p.SUBJECTO && p.SUBJECTO !== p.NAME ? `In ${year}, controlled by ${p.SUBJECTO}.` : `In ${year}, a self-governing territory or state.`),
            h('button', { class: 'btn sm', onclick: () => Lab.ask(`What was happening in ${p.NAME} around ${year}? Who ruled it, how did they gain control, and how did local people experience it? Give more than one perspective.`, `History atlas: ${p.NAME}, ${year}`) }, '✦ Ask about this place in ' + year));
        });
      const top = [...areas.entries()].filter(([, o]) => !o.minor).sort((a, b) => b[1].a - a[1].a).slice(0, 9);
      legend.innerHTML = '';
      legend.append(h('h3', null, 'Who claimed the most land'), h('p', { class: 'tiny muted' }, 'Share of mapped land area, including colonies. Claims, not always real control.'),
        ...top.map(([kname, o]) => { const pct = o.a / total * 100; return h('div', { style: { margin: '7px 0' } },
          h('div', { class: 'row small' }, h('i', { style: { width: '11px', height: '11px', borderRadius: '3px', background: o.color, display: 'inline-block' } }), h('b', null, kname), h('span', { class: 'sp' }), h('span', null, pct.toFixed(1) + '%')),
          h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, pct * 3) + '%', background: o.color } }))); }));
      drawPins();
    }
    slider.oninput = () => { year = YEARS[+slider.value]; load(); };
    playBtn.onclick = () => {
      if (playing) { clearInterval(playing); playing = null; playBtn.textContent = '▶ Play'; return; }
      playBtn.textContent = '❚❚ Pause';
      if (year === YEARS[YEARS.length - 1]) { year = YEARS[0]; load(); }
      playing = setInterval(() => { const i = YEARS.indexOf(year); if (i >= YEARS.length - 1) { clearInterval(playing); playing = null; playBtn.textContent = '▶ Play'; return; } year = YEARS[i + 1]; load(); }, 2200);
    };
    load();
    return () => { if (playing) clearInterval(playing); };
  },
});

Lab.explorer('history', 'timeline', {
  mount(el) {
    const ERAS2 = [[1450, 1699, 'The first global age'], [1700, 1788, 'Empires & Enlightenment'], [1789, 1815, 'The Age of Revolutions'], [1816, 1913, 'Industry & Empire'], [1914, 1945, 'The World Wars'], [1946, 1991, 'The Cold War'], [1992, 2030, 'Globalization & a multipolar world']];
    const on = new Set(Object.keys(CAT));
    const chips = h('div', { class: 'row' }, Object.entries(CAT).map(([k, [n, c]]) => {
      const ch = h('span', { class: 'chip on', style: { '--c': c } }, h('i'), n);
      ch.onclick = () => { on.has(k) ? on.delete(k) : on.add(k); ch.classList.toggle('on'); draw(); };
      return ch;
    }));
    const list = h('div');
    el.append(h('div', { class: 'card' }, h('p', { class: 'small muted' }, 'Tap an event to open it. Events tagged Contested or Unknown are ones where the evidence or the interpretation is genuinely in dispute.'), chips), list);
    function draw() {
      list.innerHTML = '';
      for (const [a, b, name] of ERAS2) {
        const evs = EVENTS.filter((e) => e[0] >= a && e[0] <= b && on.has(e[4]));
        if (!evs.length) continue;
        list.append(h('h2', { style: { margin: '22px 0 10px' } }, name, h('span', { class: 'muted small', style: { fontWeight: 500, marginLeft: '8px' } }, `${a}–${b > 2025 ? 'now' : b}`)));
        const col = h('div', { style: { borderLeft: '3px solid var(--line)', marginLeft: '8px', paddingLeft: '18px' } });
        for (const e of evs) {
          const det = h('div', { style: { display: 'none', marginTop: '6px' } }, h('p', { class: 'small' }, e[5]),
            h('div', { class: 'row' },
              h('button', { class: 'btn sm', onclick: () => { const y = YEARS.find((Y) => Y >= e[0]) || YEARS[YEARS.length - 1]; Lab.go('history-atlas-' + y); } }, '🗺️ See the map'),
              h('button', { class: 'btn sm', onclick: () => Lab.ask(`Explain "${e[3]}" (${e[0]}). What caused it, what changed because of it, and what do historians still argue about?`, `Timeline: ${e[3]}`) }, '✦ Ask the tutor')));
          const row = h('div', { style: { position: 'relative', margin: '0 0 14px', cursor: 'pointer' }, onclick: (ev) => { if (ev.target.closest('button')) return; det.style.display = det.style.display === 'none' ? 'block' : 'none'; if (det.style.display === 'block') Lab.addXP(1); } },
            h('span', { style: { position: 'absolute', left: '-26px', top: '6px', width: '13px', height: '13px', borderRadius: '50%', background: CAT[e[4]][1], border: '2px solid var(--bg)' } }),
            h('div', { class: 'row' }, h('b', { style: { fontFamily: 'Space Grotesk', minWidth: '44px' } }, e[0]), h('span', { style: { fontWeight: 600 } }, e[3]), e[6] ? Lab.conf(e[6]) : null), det);
          col.append(row);
        }
        list.append(col);
      }
    }
    draw();
  },
});
