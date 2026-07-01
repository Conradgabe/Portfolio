# p1 - Debug: monthly totals are contaminated (35 min)

**Reported by Finance.** `build_report(entries)` totals spend by department for ONE
reporting period. They say **March's report includes February's numbers** - totals are
too high and grow each month. Restarting the process fixes it for one run.

Each call must be independent: given only this period's entries, return a fresh
`{department: total}` mapping.

The sample test passes (the happy path looks fine). The bug shows up across calls - the
scored tests catch it. Find why state survives between calls and fix `solution.py`.

## Run
`python arena/run.py p1`  then  `python arena/run.py p1 --scored`
Reset anytime: `python arena/run.py p1 --reset`
