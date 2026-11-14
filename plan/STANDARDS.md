# Content standards (every run must follow these)

The Open Learning Lab is free, for anyone aged 10 to 100. Its job is to give people **all the facts, evidence and arguments so they can decide for themselves**. It never tells them what to believe about contested questions.

## 1. Even-handed, never steering
- On contested political, economic, moral and religious questions, present **every serious side at its strongest**, in the words and reasoning its own defenders would use. Then present its critics the same way. Do not pick a winner.
- **Ideologies** (Marxism–Leninism, capitalism, fascism, liberalism and others) all get the same structure and the same standard. That means the ideas; who held them and why; what they promised; what happened when they were tried; the gains; the costs and death tolls; and what supporters and critics say now.
- **Settled facts are stated plainly** (the Holocaust happened; the Earth is about 4.5 billion years old). "Balance" never means inventing doubt about established evidence.
- **No loaded one-liners.** Phrases like "Engels traced…", "Mother of the Nation" or "Great Leader" are never dropped in without context: who said it, when, why, what it meant to supporters, what critics say, and what the evidence shows.
- **The same standard for every country and side.** Western colonial violence, Soviet and Chinese famines, US covert operations, Japanese imperial atrocities, Atlantic and Arab slave trades, and modern forced labor are all covered with equal rigor.

## 2. Explain *why*, not only *what*
For every hard subject (war, racism and every form of supremacism, slavery past and present, genocide, famine, empire, repression, financial crashes) explain the causes, drawing on several disciplines at once:
- psychology (in-group bias, fear, obedience and conformity research)
- economics (incentives, resources, labor demand)
- politics (power, propaganda, institutions)
- history (precedent, ideas, accidents)
- sociology and anthropology (identity, status, norms)
- geography (resources, borders, climate)

Show how ordinary people came to support or carry out terrible things, and how others resisted. Then show **what was learned** and how it applies today.

## 3. Evidence and sourcing
- Every factual claim has a source a reader can open. New facts go into claim records (`data/claims/<id>.json`) with a confidence label:
  - **Established:** many independent sources agree.
  - **Strong:** most evidence points one way.
  - **Contested:** informed experts disagree.
  - **Unknown:** the evidence is missing.
  - **Clouded:** every main source has a strong stake.
  - **Developing:** a 2025–26 event that is still unfolding.
- Prefer primary sources: original documents, data, peer-reviewed research, official records, archives. Then reputable scholarship and journalism. Cite both sides' best scholars.
- **Paraphrase. Quotes stay under 15 words, with at most one per source.** Never reproduce copyrighted text, song lyrics or poems (public-domain texts are fine). Link full texts only where they are free and legal: no pirated books.
- Numbers: give a range when estimates differ, and say who made each estimate and how.
- Never invent a source, a URL or a quote. If you can't verify something, leave it out or mark it Unknown.

## 4. Media: real evidence, no junk
- Show real photographs, film, paintings, maps, documents and data related to the topic: archive film from the 1890s onward, period photographs, museum objects, primary documents.
- **No junk:** no entertainment or influencer videos, AI-generated images, stock photos, or loosely related search results. If a result isn't clearly about the topic, it doesn't go in.
- Link and credit media; don't copy it into the repository. The exception is small, freely licensed files with full credit. YouTube is linked, never downloaded.
- Don't store photos centered on public figures in lab files. Archive seeds are places, events and objects.
- **Graphic material** (war, atrocities, famine, lynching, the camps) is included only where it is needed to understand the truth. It is blurred until tapped, hidden for ages 10–12, and always shown with context: who, what, when, where, and the victims' names where known.
- **Never shown:**
  - torture or execution media made by perpetrators to spread terror
  - gore with no historical purpose
  - anything sexual
  - step-by-step instructions for harm, such as weapons
- Unethical experiments are described factually, not shown.

## 5. For ages 10 to 100
- Every page has a clear beginner layer (short, concrete, a picture or an example) and depth below it for people who want to keep going for hours.
- Plain words first; technical terms are explained the first time they appear.
- Every topic shows **how it is used in real life** and **how it connects to other disciplines**.

## 6. Fun, interactive, visual, audio
- Labs must solve real problems with real data, not toy graphs. For example:
  - calculate whether a bridge holds
  - run a real epidemic curve
  - price a loan
  - trace a supply chain
  - test a historical claim against the data
- Add narration (the browser's speech) to new long sections.
- Reward exploring: missions, review cards and badges.

## 7. Quality and design
- Professional and calm. Avoid emoji walls, filler adjectives and "AI voice" phrases ("delve", "tapestry", "it's important to note"), as well as generic gradients.
- Accessible: real headings, alt text, keyboard use, contrast. Fast on phones.
- Every new page must pass `tools/validate.py` and `tools/smoke.py`.

## 8. Honesty about ourselves
- The site says the content is drafted with AI and checked by a separate AI fact-checker. No human expert has reviewed it unless a record names one.
- When we get something wrong, we fix it and log it publicly (`factcheck/*.json` → corrections log).
