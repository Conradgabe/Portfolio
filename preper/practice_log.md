# Practice log

Log every **timed** attempt. Watch your time-to-green drop and notice which bug classes /
rules slow you down. Be honest about the clock.

Score yourself on:
- **Scored result:** how many hidden tests passed / total.
- **Time to green:** minutes until scored is all green (cap at the limit).
- **Diagnosis:** did you spot the bug class fast, or thrash?

---

## Scenario 1 - Debugging (target: scored green < 35 min)

| id | Date | Scored (pass/total) | Time to green | Spotted the bug via | Notes |
|----|------|---------------------|---------------|---------------------|-------|
| p1_reports     | | | | | |
| p2_scheduler   | | | | | |
| p3_pricing     | | | | | |
| p4_eligibility | | | | | |
| p5_cleanup     | | | | | |

## Scenario 2 - Authorization (target: scored green < 45 min)

| id | Date | Scored (pass/total) | Time to green | Notes |
|----|------|---------------------|---------------|-------|
| p6_rbac      | | | | |
| p7_hierarchy | | | | |
| p8_acl       | | | | |

## Dress rehearsals (one debug + one authz, strict timers, no reference)

| Date | Problems | Result | What slowed me down | Fix for next time |
|------|----------|--------|---------------------|-------------------|
| | | | | |

---

## Recurring weak spots (fill in as you go)
-

## Re-attempting a problem
`python arena/run.py <id> --reset` restores the original starter so you can redo it cold.
