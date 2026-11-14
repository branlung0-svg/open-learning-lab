# CAP-0: deep-dive engine (2026-11-14)

Engineering unit. New file `js/deepdive.js` renders every ideology deep dive from one data object
(`Lab.deepdive.register(id, cfg)`, registry `Lab.DEEPDIVES`) and adds the "Ideologies side by side" tab
(`#history-modern-dives`). Marxism–Leninism now registers through it; its page text moved to `Lab.MARX.ui`.

How to add a new dive (for CAP-1 onward): put data in `js/<id>-data.js` with the same shapes as `marx-data.js`
(intro, howto, ideas, tree, machine, gap, tools, cases/caseOrder, compareCols/compare, gains, tolls, predictions,
debates, claims, reading) plus `ui` (headings, prompts) and `side` (the 8 shared answers, each `[text, section]`).
Then a small module calls `Lab.deepdive.register('<id>', {...})` with the section list and any custom renderers,
loaded after `deepdive.js` in `index.html`. Missing parts are simply not shown. A planned dive in `Lab.DIVES_PLANNED` drops off the "on the way" list automatically once a dive with the same title is registered.

Sources: the Marxism column summarizes material already in the dive; figures were re-verified (see
`factcheck/cap0-verified.txt`) and recorded in `data/claims/marxism-side.json`.
