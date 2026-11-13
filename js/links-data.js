/* How the disciplines connect: foundation links (what builds on what), transferable skills, and which skills
   each tab and discipline uses. Used by hub.js (map, toolkits) and learn.js. */
(function () {
  // [from, to, why] : "to" builds on "from"
  Lab.FOUND = [
    ['logic', 'math', 'A proof is logic applied to numbers and shapes.'], ['logic', 'computing', 'Computers are logic gates; programs are logical rules.'], ['logic', 'philosophy', 'Valid argument is the backbone of philosophy.'], ['logic', 'law', 'Legal reasoning tests whether conclusions follow from rules and facts.'],
    ['math', 'physics', 'Physics is written in math; Newton invented calculus to describe motion.'], ['math', 'engineering', 'Every bridge, circuit and engine is designed with equations.'], ['math', 'statistics', 'Probability theory is the mathematics of chance.'], ['math', 'computing', 'Algorithms, cryptography and AI are applied math.'], ['math', 'economics', 'Models, growth rates and optimization.'], ['math', 'chemistry', 'Ratios, logarithms (pH) and reaction rates.'], ['math', 'arts', 'Perspective, symmetry and musical harmony are mathematical.'],
    ['statistics', 'medicine', 'Clinical trials decide which treatments work.'], ['statistics', 'economics', 'Econometrics tests economic claims with data.'], ['statistics', 'psychology', 'Experiments need statistics to separate effects from noise.'], ['statistics', 'sociology', 'Surveys and social data.'], ['statistics', 'politics', 'Polls, election forecasts and policy evaluation.'], ['statistics', 'biology', 'Genetics, ecology and evolution are statistical.'], ['statistics', 'history', 'Quantitative history: demography, prices, death tolls.'],
    ['computing', 'engineering', 'Modern engineering is simulated and controlled by software.'], ['computing', 'statistics', 'Large data sets and simulations need computers.'],
    ['physics', 'chemistry', 'Chemical bonds obey quantum physics.'], ['physics', 'engineering', 'Forces, energy and electricity are engineering’s raw material.'], ['physics', 'earthspace', 'Gravity, heat and light explain planets, climate and stars.'], ['physics', 'arts', 'Acoustics and optics underlie music and painting.'],
    ['chemistry', 'biology', 'Life is chemistry: DNA, proteins, metabolism.'], ['chemistry', 'medicine', 'Drugs are molecules designed to bind targets.'], ['chemistry', 'earthspace', 'Rocks, oceans and the atmosphere are chemical systems.'], ['chemistry', 'engineering', 'Materials, batteries and fuels.'],
    ['biology', 'medicine', 'Medicine is applied human biology.'], ['biology', 'psychology', 'The mind runs on a biological brain.'], ['biology', 'anthropology', 'Human evolution and genetics.'],
    ['earthspace', 'geopolitics', 'Geography, resources and climate shape power.'], ['earthspace', 'history', 'Climate, rivers and disease shaped where civilizations grew.'], ['earthspace', 'economics', 'Natural resources and energy.'],
    ['psychology', 'economics', 'Behavioral economics: real people are not perfectly rational.'], ['psychology', 'politics', 'How voters, leaders and crowds think.'], ['psychology', 'sociology', 'Individual minds add up to group behavior.'], ['psychology', 'law', 'Eyewitness memory, juries and deterrence.'],
    ['anthropology', 'sociology', 'Comparing cultures shows what is universal and what is local.'], ['anthropology', 'history', 'Societies without writing are known through anthropology and archaeology.'],
    ['linguistics', 'literature', 'Literature is made of language.'], ['linguistics', 'anthropology', 'Languages record migrations and cultures.'], ['linguistics', 'computing', 'Language models and translation software.'], ['linguistics', 'law', 'Laws and treaties live or die by wording.'],
    ['literature', 'history', 'Texts are sources: letters, chronicles, novels of their time.'],
    ['history', 'geopolitics', 'Today’s rivalries grew from past wars and borders.'], ['history', 'politics', 'Institutions are products of their history.'],
    ['economics', 'geopolitics', 'Wealth, trade and sanctions are instruments of power.'], ['economics', 'politics', 'Who gets what is the core of politics.'], ['politics', 'geopolitics', 'States’ internal systems shape their foreign policy.'], ['law', 'politics', 'Constitutions set the rules of power.'], ['sociology', 'politics', 'Class, religion and identity drive voting and protest.'],
    ['philosophy', 'ethics', 'Ethics is the branch of philosophy about how to act.'], ['philosophy', 'politics', 'Theories of justice and legitimacy.'], ['philosophy', 'law', 'What makes a law just.'], ['philosophy', 'math', 'Questions about proof, infinity and certainty.'],
    ['religion', 'law', 'Many legal systems grew from religious law.'], ['religion', 'ethics', 'Moral traditions are rooted in religions.'], ['religion', 'arts', 'Much of the world’s art and architecture is sacred.'], ['religion', 'history', 'Faiths shaped empires, wars and reforms.'],
    ['ethics', 'medicine', 'Bioethics: consent, triage, research rules.'], ['ethics', 'engineering', 'Safety and responsibility for what we build.'], ['ethics', 'law', 'Ideas of right and wrong inform law.'], ['arts', 'engineering', 'Architecture and design join beauty and function.'],
  ];

  // Transferable skills: [id, emoji, name, home discipline, what it is, labs/cases to learn it]
  Lab.SKILLS = [
    ['growth', '📈', 'Compound growth & doubling', 'math', 'Small rates add up: doubling time ≈ 70 ÷ rate.', [['play-compound', 'Compound growth lab'], ['connect-compound', 'Case: debt crises']]],
    ['percap', '➗', 'Per-person comparisons', 'math', 'Divide by population before comparing countries; totals mislead.', [['play-gdppower', 'Who is the biggest economy?']]],
    ['bayes', '🎯', 'Updating beliefs with evidence', 'statistics', 'How much should a clue change your mind? Ask how likely it is if you are wrong.', [['play-bayes', 'The positive test puzzle'], ['connect-bayes', 'Case: intelligence failures']]],
    ['sampling', '🧪', 'Who is in the sample?', 'statistics', 'Survivors, volunteers and surviving archives are not random.', [['play-margin', 'How polls work'], ['connect-wald', 'Case: Wald’s bombers']]],
    ['causation', '🔗', 'Correlation vs causation', 'statistics', 'Two things moving together do not prove one causes the other.', [['play-spurious', 'Spurious correlations'], ['play-simpson', 'Simpson’s paradox']]],
    ['estimate', '🔢', 'Estimating hidden numbers', 'statistics', 'Use structure (serial numbers, Fermi steps) to estimate what nobody will tell you.', [['play-germantank', 'German tank problem'], ['play-fermi', 'Fermi estimation']]],
    ['games', '♟️', 'Strategic thinking (game theory)', 'math', 'Predict what rivals do when your best move depends on theirs.', [['play-gametheory', 'Prisoner’s dilemma'], ['play-chicken', 'Brinkmanship'], ['connect-game', 'Case: nuclear standoffs']]],
    ['maps', '🗺️', 'Reading maps and geography', 'earthspace', 'Projections distort size; chokepoints and terrain shape power.', [['play-mercator', 'Map projections lie'], ['play-chokepoints', 'Oil chokepoints']]],
    ['dating', '⏳', 'Dating evidence', 'physics', 'Radioactive decay and tree rings put dates on the past.', [['play-halflife', 'Half-life & carbon dating'], ['play-treerings', 'Tree-ring dating']]],
    ['incentives', '🧲', 'Following incentives', 'economics', 'Ask who gains: people respond to rewards and costs.', [['play-commons', 'Tragedy of the commons'], ['whois', 'Source incentives']]],
    ['sources', '📜', 'Weighing sources', 'history', 'Primary vs secondary, internal vs public, who wrote it and why.', [['evidence-rate', 'Rate the source'], ['play-twosides', 'Same event, different stories']]],
    ['fallacy', '🧩', 'Spotting bad arguments', 'logic', 'Recognize fallacies and test conclusions.', [['play-fallacies', 'Fallacy detector'], ['play-wason', 'Wason card test']]],
    ['bias', '🧠', 'Knowing your own biases', 'psychology', 'Anchoring, framing and repetition bend judgment.', [['play-anchoring', 'Anchoring'], ['play-framing', 'Framing'], ['connect-repeat', 'Case: why lies feel true']]],
    ['networks', '🕸️', 'Networks and spread', 'sociology', 'Ideas, protests and diseases spread through connections and thresholds.', [['play-threshold', 'When protests explode'], ['play-smallworld', 'Small worlds']]],
    ['voting', '🗳️', 'How rules shape outcomes', 'politics', 'The same votes can produce different winners under different rules.', [['play-condorcet', 'Voting paradoxes'], ['play-dhondt', 'Votes into seats']]],
    ['inequality', '⚖️', 'Measuring inequality', 'economics', 'Gini and Lorenz curves summarize who has what.', [['play-lorenz', 'Measure inequality']]],
    ['population', '👪', 'Population dynamics', 'geopolitics', 'Birth and death rates change the balance of power over decades.', [['play-demotransition', 'Demographic transition']]],
    ['spread', '🦠', 'Exponential spread', 'biology', 'R above 1 means explosive growth; immunity thresholds stop it.', [['play-sir', 'Epidemics lab'], ['connect-epidemic', 'Case: the math of epidemics']]],
    ['words', '📝', 'Precise language', 'linguistics', 'One word can change a treaty or a law.', [['connect-words', 'Case: Resolution 242'], ['play-translations', 'One line, many translations']]],
    ['ethics', '🧭', 'Weighing moral trade-offs', 'ethics', 'Frameworks for hard choices: consequences, duties, fairness.', [['play-justwar', 'Just war theory'], ['play-veil', 'Veil of ignorance']]],
    ['physicscheck', '⚛️', 'Physical plausibility checks', 'physics', 'Energy, distance and materials limit what is possible.', [['play-fuels', 'Energy in a kilogram'], ['connect-nuclear', 'Case: uranium percentages']]],
    ['satellite', '🛰️', 'Independent measurement', 'earthspace', 'Satellites and sensors check claims that interested parties cannot control.', [['connect-lights', 'Case: night lights vs GDP']]],
  ];

  // Which skills each Modern-world tab uses, with how: [skill id, how it is used here]
  Lab.TABSKILLS = {
    wars: [['estimate', 'Death tolls and enemy strength are estimates; know how they are made.'], ['games', 'Arms races and alliances are strategic games.'], ['sources', 'Wartime claims come from interested parties.'], ['maps', 'Terrain, distance and chokepoints shaped campaigns.']],
    warmyths: [['bias', 'Propaganda works through repetition and framing.'], ['sources', 'Ask who told each story and what they gained.'], ['sampling', 'Which archives were opened, and by whom?']],
    sides: [['sources', 'Compare each side’s evidence, not its conclusions.'], ['bias', 'Your own side’s story feels truer: check it hardest.'], ['words', 'Names like “invasion” or “liberation” carry a verdict.']],
    koreawar: [['sources', 'Internal Soviet cables beat public speeches as evidence.'], ['estimate', 'Death tolls vary by who is counting.'], ['games', 'Stalin, Mao and Kim each calculated risk.']],
    uspower: [['incentives', 'Contractors, agencies and allies each gain from policies.'], ['percap', 'Compare military spending as a share of GDP, not just dollars.'], ['growth', 'Debt and budgets compound.'], ['maps', 'Base locations follow geography.']],
    power: [['satellite', 'Check a dictatorship’s growth claims from space.'], ['incentives', 'Who appoints whom tells you who really rules.'], ['voting', 'Rules decide whether votes can change anything.']],
    anatomy: [['incentives', 'Follow the money and the appointments.'], ['voting', 'Electoral rules create two-party or multi-party systems.'], ['networks', 'Informal networks carry real power.']],
    chosen: [['voting', 'Different rules select different leaders.'], ['causation', 'Does democracy cause growth, or do rich countries become democracies?'], ['sampling', 'Successful autocracies are remembered; failures are forgotten.']],
    africa: [['dating', 'Physics dates our species to ~300,000 years.'], ['estimate', 'Slave-trade and war tolls are reconstructed from records.'], ['maps', 'Map projections shrink Africa.'], ['population', 'Africa’s population will be a quarter of humanity.'], ['causation', 'Did the slave trade cause today’s poverty? Economists test it.']],
    americas: [['spread', 'Epidemics after 1492 killed most Indigenous people.'], ['growth', 'Debt compounding caused the 1982 crisis.'], ['estimate', 'Pre-1492 population estimates differ tenfold.'], ['inequality', 'Latin America is among the most unequal regions.']],
    timeline: [['dating', 'How we date events before written records.'], ['sources', 'Every date comes from a source.']],
    ideologies: [['fallacy', 'Test each ideology’s arguments for logic.'], ['ethics', 'Each ideology weighs freedom, equality and order differently.']],
    systems: [['incentives', 'Every economic system rewards different behavior.'], ['inequality', 'Measure who gains.']],
    compare: [['percap', 'Compare per person, over time.'], ['causation', 'Was it the system or something else?']],
    conditions: [['percap', 'Living standards per person.'], ['estimate', 'Old data is reconstructed: check the methods.']],
    opinion: [['sampling', 'Who was polled and how?'], ['bias', 'Question wording changes answers.']],
    claims: [['bayes', 'How much should each piece of evidence move you?'], ['causation', 'Did one thing really cause the other?']],
    leaders: [['sources', 'Leaders’ memoirs defend their reputations.'], ['ethics', 'Judge by the same standards across sides.']],
  };
  Lab.skill = (id) => Lab.SKILLS.find((s) => s[0] === id);
})();
