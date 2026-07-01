# Andela Woven - Intense Prep Kit

You have **48 hours** from first challenge start. Two Python scenarios, each with its own
hard timer:

| # | Scenario | Timer | What it really tests |
|---|----------|-------|----------------------|
| 1 | Debugging a problem with limited information | **35 min** | Reproduce → isolate → fix → verify, fast, in unfamiliar code |
| 2 | Check which pages users are authorized to access | **45 min** | Turn a spec into correct, incremental access-control logic |

The real assessment runs on **Qualified** (unittest, a `solution.py`, editable sample
tests, hidden scored tests). **This kit reproduces that loop exactly** so you practice the
real thing, not flashcards.

---

## Two ways to practice (pick one)

### 1. Browser IDE  (recommended - looks like the real thing)

A local web IDE that mirrors the Qualified interface: code editor, editable sample tests,
Run Sample / Run Scored buttons, live pass/fail output, and a built-in countdown timer.

```bash
cd preper
python arena/serve.py
```

Then open **http://127.0.0.1:8765**. Stdlib only, no `pip install`. Run it in a terminal
window you keep open, and Ctrl-C there when you're done.

- **Top toolbar:** problem dropdown, **▶ Run Sample**, **⚑ Run Scored**, **↺ Reset**, a
  *reveal detail* toggle, and the countdown timer (auto-set to 35 or 45 min per problem).
- **Left:** `solution.py` (edit here) over `sample_tests.py` (visible, editable).
- **Right:** Instructions tab and Output tab (green PASS / red FAIL, timing, tracebacks).
- Edits autosave to disk, so the CLI below stays in sync. If you're offline, the editor
  falls back to a plain text box automatically.

### 2. Command line

```bash
python arena/run.py --list            # list all problems
python arena/run.py p1                 # run VISIBLE sample tests (debug)
python arena/run.py p1 --scored        # run HIDDEN scored tests (grade)
python arena/run.py p1 --scored --reveal   # full tracebacks on scored fails
python arena/run.py p1 --reset         # restore the original starter code
python arena/timer.py 35               # countdown timer (own terminal)
```
`p1` matches the folder `p1_*`.

---

## What each problem folder holds

Each problem lives in `arena/<id>/` and works like the real IDE:

- `INSTRUCTIONS.md` - the problem (read this).
- `solution.py` - the code you edit (a stub to implement, or buggy code to fix).
- `sample_tests.py` - **visible, editable** tests. Debug against these. Add your own.
- `_grading/` - the **hidden** scored tests + a reference solution. Don't open it until
  you've attempted; that's the "Run Scored" tests and the answer.

## The loop for each problem
1. **Read** the instructions (Instructions tab, or `arena/<id>/INSTRUCTIONS.md`).
2. **Start the timer** (button in the IDE, or `python arena/timer.py 35`).
3. **Edit** `solution.py`.
4. **Run Sample** to debug against the visible tests.
5. **Run Scored** to grade against the hidden tests - this is what counts.
6. Iterate until scored is all green or the timer runs out.
7. Only *then*, if you want the teaching notes, open `arena/<id>/_grading/reference.py`.

> Watch out: a green **Sample** run does not mean you're done. Sample tests cover the happy
> path; the bug (or the tricky rule) usually hides in the **Scored** tests. Always Run Scored.

---

## The problem set

**Warm-up**
- `p0_greet` - 5 min, confirms the loop works.

**Scenario 1 - Debugging (35 min each).** Ships with a real bug; the sample test usually
looks fine and the *scored* tests expose the bug (that's the "limited information" part).
| id | The bug hides as |
|----|------------------|
| `p1_reports`     | state that leaks between calls |
| `p2_scheduler`   | an off-by-one on a boundary |
| `p3_pricing`     | a wrong/stale cached value |
| `p4_eligibility` | a boolean rule that's true when it shouldn't be |
| `p5_cleanup`     | a crash that only happens sometimes |

**Scenario 2 - Authorization (45 min each).** Implement `can_access` from a spec; difficulty
climbs like the real thing.
| id | Adds |
|----|------|
| `p6_rbac`      | basic roles → pages |
| `p7_hierarchy` | role inheritance (+ a cycle) |
| `p8_acl`       | permissions, wildcards, deny-override, ownership |

Log every timed attempt in `practice_log.md`.

---

## Strategy first (15 min, before you drill)
- `strategy/00-game-plan.md` - how to spend the 48h + each timer, minute by minute
- `strategy/01-debugging-playbook.md` - Reproduce→Localize→Fix→Verify + a symptom→bug table
- `strategy/02-authorization-playbook.md` - the access-control model, precedence, templates
- `strategy/03-python-speed-cheatsheet.md` - **keep open during the real exam**
- `strategy/04-mindset-and-comms.md` - partial-credit tactics, show-your-work, stuck-resets

## The two rules that win partial credit
1. **Submit something that runs.** Green on the easy tests beats an ambitious broken rewrite.
2. **Show your work.** A one-line comment on the bug / the precedence order earns credit for
   reasoning even if the code isn't complete.
