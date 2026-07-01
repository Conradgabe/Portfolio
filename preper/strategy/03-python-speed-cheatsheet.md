# Python speed cheat-sheet (keep open during the exam)

Fast recall of the things you'll reach for. No time to Google under a 35-min timer.

## Collections

```python
from collections import defaultdict, Counter, deque, namedtuple

d = defaultdict(list); d[k].append(v)        # auto-empty list
d = defaultdict(int);  d[k] += 1             # counting
c = Counter(items)                            # {item: count}
c.most_common(3)                              # top 3 (item, count)
dq = deque(); dq.append(x); dq.popleft()      # O(1) both ends

s.get(key, default)                           # never KeyError
s.setdefault(key, []).append(v)               # get-or-create
{**a, **b}                                     # merge dicts (b wins)
a | b   (dict, py3.9+)                         # merge
```

## Sets & membership (authz bread-and-butter)

```python
A | B      # union
A & B      # intersection
A - B      # difference
x in A     # O(1) membership -> use sets for permission checks
A <= B     # A is subset of B
required.issubset(user_perms)
```

## Sorting

```python
sorted(xs, key=lambda x: x.age)
sorted(xs, key=lambda x: (x.last, x.first))   # multi-key
sorted(xs, key=lambda x: x.score, reverse=True)
sorted(xs, key=lambda x: (-x.score, x.name))  # score desc, name asc
```

## Slicing & ranges (off-by-one HQ)

```python
xs[a:b]          # includes a, EXCLUDES b   -> length b-a
xs[:n]           # first n
xs[-n:]          # last n
range(n)         # 0..n-1     (n items)
range(1, n+1)    # 1..n       (inclusive of n)
# Inclusive slice of items i..j: xs[i:j+1]
```

## Numbers / money

```python
a // b           # floor division (int)
a / b            # true division (float)
round(x, 2)      # banker's rounding! round(2.5)==2, round(3.5)==4
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")   # exact -> use for money
# 0.1 + 0.2 == 0.30000000000000004  (never == for floats)
abs(a - b) < 1e-9                  # compare floats this way
```

## Strings

```python
s.split(":")            # -> list
s.split(":", 1)         # split once: "a:b:c" -> ["a", "b:c"]
s.strip() / .lstrip() / .rstrip()
s.startswith(p) / s.endswith(sfx)
":".join(parts)
s.lower() / s.casefold()   # case-insensitive compare
f"{x!r}"                    # repr, for debug prints
```

## Dates (the day-off-by-one trap)

```python
from datetime import date, datetime, timedelta, timezone
d + timedelta(days=1)
(d2 - d1).days
# Ranges: decide inclusive vs exclusive and be consistent.
# start <= day <= end   (inclusive both ends)
# Naive vs aware: don't compare tz-aware with naive -> TypeError
datetime.now(timezone.utc)
```

## Common bug fingerprints (spot instantly)

```python
def f(x, acc=[]):        # BUG: mutable default -> shared across calls
def f(x, acc=None):      # FIX
    acc = acc if acc is not None else []

for k in d:              # BUG if you del d[k] / d[k]=... inside
for k in list(d):        # FIX: iterate a copy

if x == None:            # smell: use `is None`
if not items:            # correct empty check (list/dict/str/set)
if len(items) == 0:      # verbose but fine

a is b                   # identity -> only for None/True/False/sentinels
a == b                   # value equality -> almost always what you want
```

## Guard-clause template (return early, stay flat)

```python
def decide(user, page, cfg):
    if user is None:      return False
    if page not in cfg:   return False
    if denied(user, page): return False
    ...
    return granted(user, page)
```

## Running tests

This kit + the real Qualified IDE use **unittest** (a `solution.py` + test classes).

```bash
python arena/run.py p1              # visible sample tests (debug)
python arena/run.py p1 --scored     # hidden scored tests (like "Run Tests")
python arena/run.py p1 --reveal --scored   # full tracebacks
python arena/run.py p1 --reset      # restore the starter
```

unittest assertions you'll use:
```python
self.assertEqual(a, b)     self.assertTrue(x)     self.assertFalse(x)
self.assertIsNone(x)       self.assertIn(a, b)    self.assertRaises(ValueError, fn, arg)
```
Add your own cases to `sample_tests.py` to reproduce an edge case before you fix it.

## Debug prints (fast, delete after)

```python
print(f"DBG {var=}")     # py3.8+ shows `var=value`
import json; print(json.dumps(obj, indent=2, default=str))
```
