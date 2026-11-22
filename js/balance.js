// Source balance: classify every linked source by where its publisher is based, so the lopsidedness is visible.
// This measures the publisher's location, not the author's view: a Chinese scholar published by Harvard counts as North America.
(function () {
  const h = Lab.h;
  const REG = [['na', 'North America', '#2563EB'], ['eu', 'Europe', '#7C3AED'], ['ru', 'Russia & Eurasia', '#B91C1C'], ['ea', 'East Asia', '#DC2626'], ['sea', 'Southeast Asia', '#EA580C'], ['sa', 'South Asia', '#F59E0B'], ['me', 'Middle East & N. Africa', '#0D9488'], ['af', 'Sub-Saharan Africa', '#15803D'], ['la', 'Latin America', '#DB2777'], ['oc', 'Oceania', '#0891B2'], ['int', 'International bodies (UN, IMF…)', '#64748B'], ['open', 'Open archives, origin not tagged (Wikipedia, Gutenberg…)', '#94A3B8'], ['unk', 'Publisher base unknown (.org/.com)', '#CBD5E1']];
  const DOM = { na: /(nytimes|washingtonpost|wsj|cnn|apnews|npr|brookings|cfr\.org|rand\.org|foreignaffairs|theatlantic|jstor|pewresearch|38north|opensecrets|fec\.gov|nber|hoover|cato|heritage|politico|bloomberg|stanford|harvard|yale|princeton|mit\.edu|columbia|chicago|nknews|slavevoyages|aiddata|census\.gov|loc\.gov|archives\.gov|si\.edu|propublica|vox\.com|newyorker|smithsonian|encyclopedia\.com|britannica|time\.com|nationalarchives\.gov(?!\.uk))/,
    eu: /(bbc|theguardian|ft\.com|reuters|economist|telegraph|independent\.co|lemonde|spiegel|dw\.com|france24|v-dem|ourworldindata|gapminder|sipri|chathamhouse|iiss|europa\.eu|lse\.ac|ox\.ac|cam\.ac|nationalarchives\.gov\.uk|bundeswahlleiterin|parliament\.uk|ucl\.ac|meduza|uio\.no|politico\.eu|euronews|rferl|swissinfo)/,
    ru: /(tass|rt\.com|kremlin|ria\.ru|kommersant|interfax|vedomosti|novayagazeta|carnegie\.ru|duma\.gov)/,
    ea: /(xinhua|chinadaily|people\.cn|cgtn|globaltimes|gov\.cn|scmp|nippon\.com|japantimes|nhk|asahi|yomiuri|kyodo|koreaherald|yna\.co\.kr|hani\.co\.kr|kcna|rodong|fnnews|taipeitimes|focustaiwan|sixthtone|caixin)/,
    sea: /(kpl\.gov\.la|vientianetimes|laotiantimes|vietnamnews|vnexpress|straitstimes|thestar\.com\.my|bernama|jakartapost|rappler|inquirer\.net|bangkokpost|irrawaddy|asianews\.network|channelnewsasia|cna\.asia|stratsea)/,
    sa: /(thehindu|scroll\.in|indianexpress|hindustantimes|dawn\.com|eci\.gov\.in|livemint|thewire\.in|epw\.in|dailystar\.net|ndtv)/,
    me: /(aljazeera|haaretz|timesofisrael|arabnews|middleeasteye|tehrantimes|presstv|ahram|aa\.com\.tr|dailysabah|hurriyet|thenationalnews|al-monitor)/,
    af: /(news24|mg\.co\.za|dailymaverick|elections\.org\.za|premiumtimesng|nation\.africa|theeastafrican|allafrica|codesria|africanews|monitor\.co\.ug|gazettengr)/,
    la: /(granma|cubadebate|eltiempo|clarin|lanacion|folha|globo|elpais\.com\.uy|telesurtv|jornada\.com\.mx|eluniversal|biobiochile|pagina12|brasildefato)/,
    oc: /(abc\.net\.au|smh\.com\.au|lowyinstitute|avpi\.org\.au|rnz\.co\.nz|anu\.edu\.au|theconversation\.com\/au)/,
    int: /(un\.org|undp|unesco|unicef|who\.int|imf\.org|worldbank|wto\.org|oecd|icc-cpi|icj-cij|ohchr|ilo\.org|fao\.org|ipu\.org|idea\.int|nato\.int|brics|weforum|apec\.org|asean\.org|au\.int|opec\.org|sectsco|g20\.org|unhcr|wfp\.org)/,
    open: /(wikipedia|wikisource|wikimedia|gutenberg|marxists\.org|archive\.org|theanarchistlibrary|avalon\.law\.yale|plato\.stanford)/ };
  const TLD = { na: /\.(us|ca|gov|edu|mil)$/, eu: /\.(uk|de|fr|it|es|nl|se|no|dk|fi|pl|be|ch|at|ie|pt|cz|gr|hu|ro|ua|lv|lt|ee|eu)$/, ru: /\.(ru|by|kz|uz|am|ge|az)$/, ea: /\.(cn|jp|kr|kp|tw|hk|mn)$/, sea: /\.(vn|la|kh|th|my|sg|id|ph|mm)$/, sa: /\.(in|pk|bd|lk|np)$/, me: /\.(ir|iq|sa|ae|il|tr|eg|jo|lb|sy|qa|ma|dz|tn)$/, af: /\.(za|ng|ke|gh|et|tz|ug|sn|cm|rw|zw)$/, la: /\.(br|mx|ar|cl|co|cu|ve|pe|bo|uy|ec)$/, oc: /\.(au|nz)$/ };
  // marxists.org hosts texts from every country: count each by its author's origin
  const MX = [[/\/(mao|deng-xiaoping|kim-il-sung|zhou-enlai|liu-shaoqi|china)\//, 'ea'], [/\/(ho-chi-minh|vietnam)\//, 'sea'], [/\/(cuba|guevara|castro|mariateg|latin-america)\//, 'la'], [/\/(sankara|nkrumah|cabral|africa|nyerere|lumumba)\//, 'af'], [/\/(lenin|stalin|khrushchev|trotsky|bukharin|plekhanov|kollontai|brezhnev|ussr)\//, 'ru'], [/\/(marx|engels|luxemburg|kautsky|bernstein|gramsci|dimitrov)\//, 'eu']];
  Lab.sourceRegion = (u) => { let host; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return null; }
    if (/marxists\.org$/.test(host)) { const hit = MX.find(([re]) => re.test(u)); if (hit) return hit[1]; }
    for (const k of ['open', 'int', 'ru', 'ea', 'sea', 'sa', 'me', 'af', 'la', 'oc', 'eu', 'na']) if (DOM[k].test(host)) return k;
    for (const [k, re] of Object.entries(TLD)) if (re.test(host)) return k;
    return /\.(org|com|net|info|io)$/.test(host) ? 'unk' : null; };
  const urlsOf = (D) => { const X = D.data || {}; const out = [];
    const tg = (u, o, l) => u + (o || l ? '#@' + (o || '') + (l ? '@' + l : '') : '');
    (X.reading || []).forEach(([, it]) => it.forEach((x) => x[1] && out.push(tg(x[1], x[2], x[3]))));
    ((X.lineage && X.lineage.steps) || []).forEach((s) => (s.src || []).forEach((x) => x[1] && out.push(tg(x[1], x[2], x[3]))));
    const L = X.locker || {}; (L.docs || []).forEach((x) => x[3] && out.push(x[4] ? x[3] + '#@' + x[4] : x[3])); (L.data || []).forEach((x) => x[2] && out.push(x[2])); (L.papers || []).forEach((x) => x[4] && out.push(x[4]));
    (X.ideas || []).forEach((x) => x[5] && x[5][1] && out.push(x[5][1]));
    return [...new Set(out)]; };
  const count = (urls) => { const c = {}; let unk = 0; urls.forEach((u) => { const tag = (u.match(/#@(\w*)/) || [])[1]; const r = tag || Lab.sourceRegion(u.replace(/#@.*$/, '')); if (!r) unk++; else { const k = r.replace('?', ''); c[k] = (c[k] || 0) + 1; } }); return [c, unk]; };
  Lab.balanceBar = (urls, title) => { const [c, unk] = count(urls); const tot = Object.values(c).reduce((a, b) => a + b, 0); if (!tot) return null;
    const named = tot - (c.open || 0) - (c.int || 0) - (c.unk || 0); const west = (c.na || 0) + (c.eu || 0) + (c.oc || 0); const rest = named - west;
    const bar = h('div', { class: 'bal-bar' }, REG.filter(([k]) => c[k]).map(([k, n, col]) => h('span', { title: `${n}: ${c[k]}`, style: { flex: String(c[k]), background: col } })));
    return h('div', { class: 'card bal-card' }, h('h3', { style: { marginTop: 0 } }, title || '🌍 Where these sources come from'), bar,
      h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap', margin: '6px 0' } }, REG.filter(([k]) => c[k]).map(([k, n, col]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', background: col, marginRight: '4px' } }), `${n} ${c[k]}`))),
      h('p', { class: 'small', style: { margin: '6px 0 0' } }, named ? `Of ${named} sources from a named country or region, ${west} (${Math.round(100 * west / named)}%) come from North America, Europe or Oceania and ${rest} (${Math.round(100 * rest / named)}%) from everywhere else.` : 'All sources here are open archives or international bodies.', ' ', (c.open || 0) ? `${c.open} are open archives that host texts from every country.` : ''),
      h('p', { class: 'tiny muted', style: { margin: '4px 0 0' } }, 'Where a source is tagged with the origin of its voice (for example a Chinese, Indian or Cuban author or government document hosted on an archive), it counts by that origin; otherwise it counts by where the publisher is based. A Chinese historian published in the US and not tagged counts as North America. Books listed without a link are not counted; most of those are Western, so the true balance is more Western than this bar shows.' + (unk ? ` ${unk} links could not be classified.` : ''), ' ', h('a', { href: '#method' }, 'Research standard →')), Lab.leanBar ? Lab.leanBar(urls) : null); };

  // ---- political perspective (by publisher reputation; explicit tags win). Rough by nature: shown as a guide, not a verdict.
  const LEAN = [['left', 'Left', '#B91C1C'], ['cleft', 'Centre-left', '#F87171'], ['centre', 'Centre / wire services', '#A3A3A3'], ['cright', 'Centre-right', '#60A5FA'], ['right', 'Right', '#1D4ED8'], ['state', 'Governments & state media', '#7C3AED'], ['acad', 'Academic research & data', '#0D9488'], ['intl', 'International bodies', '#64748B'], ['ref', 'Reference & archives', '#CBD5E1']];
  const LD = { left: /(jacobin|thenation|motherjones|monthlyreview|counterpunch|democracynow|commondreams|theintercept|marxists\.org|theanarchistlibrary|epi\.org|cepr\.net|truthout|newleftreview|socialistworker|versobooks|haymarketbooks|tni\.org|jacobinmag)/,
    cleft: /(theguardian|nytimes|washingtonpost|vox\.com|npr\.org|cnn\.com|newyorker|theatlantic|brookings|propublica|huffpost|msnbc|thewire\.in|scroll\.in|haaretz|lemonde|independent\.co)/,
    centre: /(reuters|apnews|bbc\.|pewresearch|csis\.org|cfr\.org|rand\.org|politico|bloomberg|economist|ft\.com|dw\.com|france24|nippon\.com|straitstimes|thehindu|dailymaverick|chathamhouse|iiss|crisisgroup|sipri)/,
    cright: /(telegraph\.co|wsj\.com|thetimes\.co|spectator|economist\.com\/leaders|fraserinstitute|hoover\.org|manhattan-institute|city-journal|aei\.org|dailysabah)/,
    right: /(heritage\.org|cato\.org|nationalreview|foxnews|dailywire|washingtonexaminer|americanconservative|claremont|mises\.org|fee\.org|breitbart|theblaze|firstthings|imprimis|quillette)/,
    state: /(xinhua|news\.cn|cgtn|people\.cn|qstheory|globaltimes|chinadaily|tass|rt\.com|kremlin|kcna|rodong|granma|cubadebate|nhandan|vietnamnews|presstv|tehrantimes|aljazeera|voanews|rferl|kpl\.gov\.la|telesur|\.gov(\.[a-z]{2})?$|\.gov\.|\.mil$|parliament\.|duma\.gov|npc\.gov)/,
    acad: /(\.edu$|\.edu\.|\.ac\.[a-z]{2}|jstor|doi\.org|aeaweb|academic\.oup|journals\.|nber|springer|tandfonline|sciencedirect|nature\.com|science\.org|thelancet|bmj\.com|v-dem|wid\.world|ourworldindata|rug\.nl|slavevoyages|aiddata|ipcinfo|acleddata|politicalterrorscale|manifesto-project|worldvaluessurvey|journalofdemocracy|codesria|clacso|epw\.in|dccam)/,
    intl: /(un\.org|undp|unesco|unicef|who\.int|imf\.org|worldbank|wto\.org|oecd|icc-cpi|icj-cij|ohchr|ilo\.org|fao\.org|ipu\.org|nato\.int|europa\.eu|opcw|ochaopt|reliefweb|ipcinfo)/,
    ref: /(wikipedia|wikisource|wikimedia|gutenberg|archive\.org|avalon\.law|plato\.stanford|constituteproject|britannica|loc\.gov|nationalarchives|ushmm|trc|vatican\.va|legislation\.gov|eur-lex)/ };
  Lab.sourceLean = (u) => { const t = (u.match(/#@\w*@(\w+)/) || [])[1]; if (t) return t; let host; try { host = new URL(u.replace(/#@.*$/, '')).hostname.replace(/^www\./, ''); } catch (e) { return null; }
    for (const k of ['ref', 'intl', 'acad', 'state', 'right', 'cright', 'left', 'cleft', 'centre']) if (LD[k].test(host)) return k; return null; };
  Lab.leanBar = (urls) => { const c = {}; let unk = 0; urls.forEach((u) => { const r = Lab.sourceLean(u); if (r) c[r] = (c[r] || 0) + 1; else unk++; });
    const tot = Object.values(c).reduce((a, b) => a + b, 0); if (!tot) return null; const L = (c.left || 0) + (c.cleft || 0), R = (c.right || 0) + (c.cright || 0);
    return h('div', null, h('h4', { style: { margin: '12px 0 4px' } }, '🧭 Political perspective of the publishers'), h('div', { class: 'bal-bar' }, LEAN.filter(([k]) => c[k]).map(([k, n, col]) => h('span', { title: `${n}: ${c[k]}`, style: { flex: String(c[k]), background: col } }))),
      h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap', margin: '6px 0' } }, LEAN.filter(([k]) => c[k]).map(([k, n, col]) => h('span', { class: 'tiny' }, h('span', { style: { display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', background: col, marginRight: '4px' } }), `${n} ${c[k]}`))),
      h('p', { class: 'small', style: { margin: '4px 0 0' } }, L + R ? `Of sources with a clear political lean, ${L} lean left and ${R} lean right.` : 'Almost all sources here are archives, research, governments or international bodies.'),
      h('p', { class: 'tiny muted', style: { margin: '2px 0 0' } }, 'Lean is judged from each publisher’s general reputation (or a tag on the source), not from each article. Original texts such as Marx, Hayek or Burke count as “Reference & archives” unless tagged with the author’s side.' + (unk ? ` ${unk} not classified.` : ''))); };
  const R = Lab.deepdive && Lab.deepdive.R;
  if (R && R.reading) { const orig = R.reading; R.reading = (p, nav, arg, D) => { orig(p, nav, arg, D); const b = Lab.balanceBar(urlsOf(D)); if (b) p.append(b); }; }
  Lab.siteBalance = () => { const all = new Set(); Object.values(Lab.DIVES_ALL || {}).forEach((D) => urlsOf(D).forEach((u) => all.add(u)));
    (Lab.INSTITUTIONS || []).forEach((x) => (x.src || []).forEach((s) => s[1] && all.add(s[1])));
    (Lab.oppressionUrls ? Lab.oppressionUrls() : []).forEach((u) => all.add(u)); (Lab.liesUrls ? Lab.liesUrls() : []).forEach((u) => all.add(u)); Object.values(Lab.POWER || {}).forEach((S) => (S.src || []).forEach((x) => all.add(x[2] ? x[1] + '#@' + x[2] : x[1])));
    return Lab.balanceBar([...all], '🌍 Source balance across all deep dives (measured live)'); };
})();
