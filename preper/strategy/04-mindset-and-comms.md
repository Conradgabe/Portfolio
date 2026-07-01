# Mindset, partial credit & communication

Woven grades **process and correctness**, not elegance. These habits directly move your score.

## Partial credit is the whole strategy

Both scenarios have "extensive partial credit." That changes how you play:

- **Get to green on the easy cases first, then reach.** In the authz scenario, a solution
  that passes basic RBAC and misses wildcards scores far better than an ambitious rewrite
  that passes nothing.
- **Never leave the code in a non-running state at submit.** A syntax error can zero out a
  scenario. Before the timer ends, make sure the file at least imports and runs.
- **Commit progress continuously.** Each passing test is banked. Don't hold all your changes
  for one big reveal at minute 44.

## Show your work (graders read it)

- Leave a **one-line comment** at the bug you fixed: `# BUG: mutable default arg -> shared
  state across calls. Fixed by defaulting to None.`
- For authz, comment the **precedence order** you implemented at the top of the function.
- If you run out of time, leave a `# TODO:` note stating your hypothesis and next step:
  `# TODO: suspect wildcard match doesn't handle "*"; would add global-grant check first.`
  That earns credit for reasoning even without the code.

## When you're stuck (the 3-minute reset)

1. Re-read the failing assertion / the spec rule out loud. State expected vs actual in one
   sentence.
2. Add one debug print at the midpoint of the function. Is the value already wrong there?
   Bug is upstream. Still right? Downstream.
3. If still stuck, **bank what you can**: fix the easy test, comment the hard one, move on.
   A timer is not the place for pride.

## Stress control

- **Set your own timer** and glance at it at the 1/2 and 3/4 marks, not constantly.
- **Take the break between scenarios.** The 48h window exists so you don't do both tired.
- Read the whole brief before touching code. Ninety seconds of reading saves ten minutes of
  wrong direction.
- Breathe. These are small, bounded problems. You've drilled this exact shape.

## Pre-flight checklist (before you click "Start")

- [ ] Environment works: you can run the provided tests locally / in their editor.
- [ ] `strategy/03-python-speed-cheatsheet.md` open in a tab.
- [ ] Own timer set (35 or 45 min).
- [ ] Scratch note ready to jot the rules / hypothesis.
- [ ] Rested, not rushed.

## What "done" looks like per scenario

**Debug:** all tests green, one comment explaining the fix, whole suite re-run so nothing
else broke.

**Authz:** as many tests green as possible, precedence order commented, unknown user/page
handled without crashing, file runs clean.
