#!/usr/bin/env python3
"""Arena test runner - mimics the Qualified / Andela "Run Tests" loop.

You edit `arena/<problem>/solution.py`, then:

    python arena/run.py p1              # VISIBLE sample tests (debug your code)
    python arena/run.py p1 --scored     # HIDDEN scored tests  (like "Run Tests"/Submit)
    python arena/run.py p1 --reset      # restore the original starter code
    python arena/run.py p1 --scored --reveal   # show full tracebacks for scored fails
    python arena/run.py --list          # list all problems

'p1' matches the folder starting with 'p1_' (e.g. p1_reports). Full names work too.
"""
import argparse
import importlib
import os
import shutil
import sys
import time
import unittest

ARENA = os.path.dirname(os.path.abspath(__file__))


def problems():
    out = []
    for name in sorted(os.listdir(ARENA)):
        if os.path.isdir(os.path.join(ARENA, name)) and "_" in name and name[0] == "p":
            out.append(name)
    return out


def resolve(token):
    if os.path.isdir(os.path.join(ARENA, token)):
        return token
    for name in problems():
        if name == token or name.startswith(token + "_"):
            return name
    raise SystemExit(f"No problem matching '{token}'. Try: python arena/run.py --list")


def flatten(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from flatten(item)
        else:
            yield item


def last_error_line(tb):
    lines = [l for l in tb.strip().splitlines() if l.strip()]
    for l in reversed(lines):
        s = l.strip()
        if "Error" in s or "Exception" in s:
            return s
    return lines[-1].strip() if lines else ""


def main():
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("problem", nargs="?")
    ap.add_argument("--scored", action="store_true")
    ap.add_argument("--reset", action="store_true")
    ap.add_argument("--reveal", action="store_true")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON (used by the web UI)")
    args = ap.parse_args()

    if args.list or not args.problem:
        print("Problems in the arena:\n")
        for name in problems():
            print(f"  {name}")
        print("\nRun:  python arena/run.py <id>            (sample tests)")
        print("      python arena/run.py <id> --scored   (scored tests)")
        return

    name = resolve(args.problem)
    pdir = os.path.join(ARENA, name)

    if args.reset:
        shutil.copyfile(os.path.join(pdir, "_grading", "starter.py"),
                        os.path.join(pdir, "solution.py"))
        print(f"Reset {name}/solution.py to the original starter.")
        return

    sys.path.insert(0, pdir)
    if args.scored:
        sys.path.insert(0, os.path.join(pdir, "_grading"))
        test_module, header = "scored_tests", "SCORED TESTS (hidden)"
    else:
        test_module, header = "sample_tests", "SAMPLE TESTS (visible)"

    for m in ("solution", "sample_tests", "scored_tests"):
        sys.modules.pop(m, None)

    try:
        mod = importlib.import_module(test_module)
    except Exception as e:
        msg = f"{type(e).__name__}: {e}"
        if args.json:
            import json
            print(json.dumps({"error": msg, "header": header,
                              "passed": 0, "failed": 0, "total": 0, "tests": []}))
        else:
            print(f"\n{header}\nCould not load your solution / tests:\n  {msg}")
        sys.exit(1)

    suite = unittest.TestLoader().loadTestsFromModule(mod)
    tests = list(flatten(suite))   # snapshot BEFORE run() (TestSuite nulls refs after)
    result = unittest.TestResult()
    t0 = time.perf_counter()
    suite.run(result)
    ms = (time.perf_counter() - t0) * 1000

    bad = {t.id(): tb for t, tb in (result.failures + result.errors)}
    total = result.testsRun
    failed = len(bad)
    passed = total - failed

    if args.json:
        import json
        out = {"header": header, "time_ms": round(ms), "passed": passed,
               "failed": failed, "total": total, "tests": []}
        for test in tests:
            desc = test.shortDescription() or test.id().split(".")[-1]
            tb = bad.get(test.id())
            out["tests"].append({
                "name": desc,
                "status": "fail" if tb else "pass",
                "message": last_error_line(tb) if tb else "",
                "detail": tb.strip() if tb else "",
            })
        print(json.dumps(out))
        sys.exit(0 if failed == 0 else 1)

    print(f"\n{header}")
    print(f"Time: {ms:.0f}ms   Passed: {passed}   Failed: {failed}\n")
    print("Test Results:")
    for test in tests:
        desc = test.shortDescription() or test.id().split(".")[-1]
        if test.id() in bad:
            print(f"  FAIL  {desc}")
            tb = bad[test.id()]
            if args.reveal or not args.scored:
                for line in tb.strip().splitlines():
                    print(f"        {line}")
            else:
                print(f"        {last_error_line(tb)}")
        else:
            print(f"  PASS  {desc}")
    print()
    print("All tests passed. Nice work." if failed == 0
          else f"{failed} failing. Keep going, or `--reveal` for detail.")
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
