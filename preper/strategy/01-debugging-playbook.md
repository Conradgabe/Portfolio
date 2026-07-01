# Debugging playbook (Scenario 1 - 35 min)

You're dropped into unfamiliar code with a bug and *limited information*. There is a working test suite; some tests fail. Your job: make them pass without breaking the rest.

## The loop: Reproduce → Localize → Fix → Verify

### 1. Reproduce (first 3 minutes, always)
- Run the visible tests: `python arena/run.py <id>`. See what fails.
- Run the hidden scored tests: `python arena/run.py <id> --scored` (add `--reveal` for
  full tracebacks). In the real Qualified IDE this is the "Run Tests" button.
- **Read the assertion.** `expected` vs `actual` is the single most useful signal. Write down: "It returns X, should return Y."

### 2. Localize
- Start from the failing test. What function does it call? Open only that.
- Trace the input through the code by hand for the failing case. Where does the value diverge from what you expect?
- Use prints if needed - fast and honest: `print(f"DEBUG x={x!r}")`. Delete before submit.
- Narrow to **one line or one expression**. Resist reading the whole file.

### 3. Fix
- Make the **smallest** change that fixes the failing case. Don't refactor.
- Re-run the failing test. Green?

### 4. Verify
- Run the **whole** suite. Did you break a previously-passing test? If yes, your fix was too broad.
- Check the boundary/edge cases the tests imply (empty input, zero, negative, duplicate).

## Bug-class → symptom cheat table

Recognizing the *class* of bug from the symptom saves 10 minutes.

| Symptom | Likely bug class | First thing to check |
|---------|------------------|----------------------|
| Result "leaks" between calls / grows each call | **Mutable default arg** (`def f(x, acc=[])`) or module-level mutable | Function signature defaults |
| Off by exactly 1 | Boundary: `<` vs `<=`, `range(n)` vs `range(n+1)`, inclusive/exclusive | Loop bounds, slice indices |
| Wrong on ties/duplicates | `>` should be `>=`, unstable comparison | Comparison operators |
| Truncated / rounded wrong | `int(a/b)` vs `a/b`, `//`, float money | Division operators, `round()` |
| `KeyError` / `AttributeError` | Typo'd key, missing default | `dict.get`, key spelling |
| Wrong on empty input | Missing base case / `[0]` on empty | Guards at top of function |
| Stale / wrong cached value | Cache keyed on mutable, or never invalidated | Memo dict, cache key |
| Dict/list "changed size during iteration" | Mutating while looping | Loop body mutation |
| `is` comparison flaky | `is` vs `==` on ints/strings | Identity vs equality |
| Off by timezone / a day | Naive vs aware datetime, inclusive date range | date arithmetic, `<=` on dates |
| Condition never / always true | Operator precedence, `and`/`or` mix, `not a == b` | Boolean expression grouping |

## Traps to avoid under time pressure

- **Don't edit the tests.** The tests define correct behavior. If one seems wrong, re-read the brief - you misread the spec.
- **Don't rewrite the function.** You'll introduce new bugs and lose the timer. Patch the one defect.
- **Don't fix bugs the tests don't cover.** Only chase failing tests. "Improvements" waste time and risk regressions.
- **Don't trust the traceback line as the bug's home.** The exception surfaces downstream of the real cause. Walk back.

## If you're stuck at minute 25
- Re-read the failing assertion out loud. State expected vs actual in one sentence.
- Binary-search the code: `print` halfway through the function. Is the value already wrong there? Bug is upstream. Right? Downstream.
- Bank partial credit: if one of three failing tests is easy, fix that, leave a comment on the others: `# Suspect off-by-one in window bound; ran out of time verifying.`
