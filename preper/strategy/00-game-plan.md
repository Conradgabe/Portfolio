# Game plan - how to spend the time

## The 48-hour clock (starts when you open challenge 1)

You do **not** need 48 hours. The value of the window is *choice of when* and *rest between scenarios*. Plan:

- **Do the two scenarios on the same day if you're sharp, or split across two mornings.** Never start a timed scenario tired.
- The overall clock keeps running even between scenarios, so don't leave a scenario "open." Read the intro, then decide to start (which trips the 35/45-min timer).
- Set your **own** timer too. Don't trust only the platform clock.
- When you begin, note the wall-clock time you must submit by (start + 47h) as a hard backstop.

## Inside the 35-minute debug timer

| Minutes | Do |
|--------:|----|
| 0-4 | Read the brief. Run the test suite. Read the **first** failing assertion carefully - expected vs actual. |
| 4-12 | Reproduce and localize. Follow the data from the failing test into the code. Form ONE hypothesis. |
| 12-22 | Fix the smallest thing that makes the failing test pass. Re-run. |
| 22-30 | Run the **whole** suite. Make sure you didn't break another test. Handle edge cases the tests hint at. |
| 30-35 | Clean up, add a one-line comment explaining the bug, submit. Leave a note if incomplete. |

**Golden rule:** change the *code under test*, not the tests. If a test looks wrong, it almost never is - re-read the spec in the brief.

## Inside the 45-minute authorization timer

| Minutes | Do |
|--------:|----|
| 0-6 | Read the spec twice. Write down the rules as a numbered list. Note default behavior (usually **deny**). |
| 6-10 | Look at the given data shapes (users, roles, pages). Sketch the function signature and return type. |
| 10-30 | Implement the **simplest** rule first, pass its tests, then layer the next rule. Run tests after each rule. |
| 30-40 | Handle precedence (deny-over-allow), wildcards, inheritance, missing users/pages. |
| 40-45 | Full run, tidy, comment the precedence order, submit. |

**Golden rule:** implement rules one at a time and keep the suite green as you go. Never write all the logic then run once at minute 44.

## Universal habits

- **Run tests immediately**, before reading much code. The failure tells you where to look.
- **Read the assertion, not the traceback first.** `assert result == 42` where result is 41 is an off-by-one. `KeyError` is a missing/typo'd key. The shape of the failure names the bug class.
- **One hypothesis at a time.** Change one thing, re-run. Never shotgun three edits.
- **Deny/return-early by default** in authz. Build up to "allow."
- **Commit partial progress mentally as green tests** - each passing test is banked credit.
- Keep `strategy/03-python-speed-cheatsheet.md` open. Don't burn minutes recalling `defaultdict` syntax.
