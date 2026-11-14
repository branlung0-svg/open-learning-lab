# Build log

Newest first. Every run adds one entry at the top.

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
