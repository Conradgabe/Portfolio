#!/usr/bin/env python3
"""Countdown timer for a drill. Run this in your OWN terminal, in parallel.

    python arena/timer.py 35      # debug scenario (35 min)
    python arena/timer.py 45      # authorization scenario (45 min)

Ctrl-C stops it. It prints a big alert when time is up.
"""
import sys
import time


def main():
    mins = float(sys.argv[1]) if len(sys.argv) > 1 else 35
    total = int(mins * 60)
    print(f"\n  Timer started: {mins:g} minutes. Focus. (Ctrl-C to stop)\n")
    try:
        for remaining in range(total, -1, -1):
            m, s = divmod(remaining, 60)
            done = (total - remaining)
            filled = (40 * done // total) if total else 40
            bar = "#" * filled + "-" * (40 - filled)
            mark = "  <-- halfway" if remaining == total // 2 else ""
            print(f"\r  {m:02d}:{s:02d}  [{bar}]{mark}   ", end="", flush=True)
            if remaining == 0:
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n  Timer stopped.\n")
        return
    print("\n\n" + "=" * 48)
    print("   TIME IS UP.")
    print("   Run:  python arena/run.py <problem> --scored")
    print("=" * 48 + "\n")


if __name__ == "__main__":
    main()
