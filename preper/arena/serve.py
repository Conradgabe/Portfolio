#!/usr/bin/env python3
"""Local web IDE for the Woven prep arena - mimics the Qualified interface.

    python arena/serve.py            # opens http://127.0.0.1:8765

Stdlib only (no pip installs). Runs your solution against the same validated test
runner as the CLI (run.py --json), in an isolated subprocess with a timeout, so an
infinite loop in your code can't hang the server. Edits save to solution.py /
sample_tests.py, so the CLI and UI stay in sync.
"""
import json
import os
import shutil
import subprocess
import sys
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ARENA = os.path.dirname(os.path.abspath(__file__))
WEBUI = os.path.join(ARENA, "webui", "index.html")
HOST, PORT = "127.0.0.1", 8765
RUN_TIMEOUT = 15  # seconds; guards against infinite loops in a solution


def problem_ids():
    out = []
    for name in sorted(os.listdir(ARENA)):
        if os.path.isdir(os.path.join(ARENA, name)) and name[:1] == "p" and "_" in name:
            out.append(name)
    return out


def meta(pid):
    try:
        n = int(pid.split("_")[0][1:])
    except ValueError:
        n = 1
    timer = 5 if n == 0 else (35 if n <= 5 else 45)
    kind = "implement" if (n == 0 or n >= 6) else "debug"
    return {"id": pid, "kind": kind, "timer": timer}


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, content):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def run_tests(pid, scored, solution, sample):
    pdir = os.path.join(ARENA, pid)
    if solution is not None:
        write(os.path.join(pdir, "solution.py"), solution)
    if sample is not None:
        write(os.path.join(pdir, "sample_tests.py"), sample)
    cmd = [sys.executable, os.path.join(ARENA, "run.py"), pid, "--json"]
    if scored:
        cmd.append("--scored")
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=RUN_TIMEOUT)
    except subprocess.TimeoutExpired:
        return {"error": f"Timed out after {RUN_TIMEOUT}s. Likely an infinite loop.",
                "passed": 0, "failed": 0, "total": 0, "tests": []}
    out = proc.stdout.strip()
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        err = (proc.stderr or out or "no output").strip()
        return {"error": f"Runner error:\n{err}", "passed": 0, "failed": 0, "total": 0, "tests": []}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass  # quiet

    def _json(self, obj, code=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _html(self, text):
        body = text.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        length = int(self.headers.get("Content-Length", 0))
        if not length:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_GET(self):
        u = urlparse(self.path)
        if u.path in ("/", "/index.html"):
            return self._html(read(WEBUI))
        if u.path == "/api/problems":
            return self._json([meta(p) for p in problem_ids()])
        if u.path == "/api/problem":
            pid = parse_qs(u.query).get("id", [None])[0]
            if pid not in problem_ids():
                return self._json({"error": "unknown problem"}, 404)
            pdir = os.path.join(ARENA, pid)
            m = meta(pid)
            m.update({
                "instructions": read(os.path.join(pdir, "INSTRUCTIONS.md")),
                "solution": read(os.path.join(pdir, "solution.py")),
                "sample": read(os.path.join(pdir, "sample_tests.py")),
            })
            return self._json(m)
        return self._json({"error": "not found"}, 404)

    def do_POST(self):
        u = urlparse(self.path)
        try:
            data = self._body()
        except Exception as e:
            return self._json({"error": f"bad body: {e}"}, 400)
        pid = data.get("id")
        if pid not in problem_ids():
            return self._json({"error": "unknown problem"}, 404)
        pdir = os.path.join(ARENA, pid)

        if u.path == "/api/run":
            scored = bool(data.get("scored"))
            return self._json(run_tests(pid, scored, data.get("solution"), data.get("sample")))
        if u.path == "/api/save":
            if data.get("solution") is not None:
                write(os.path.join(pdir, "solution.py"), data["solution"])
            if data.get("sample") is not None:
                write(os.path.join(pdir, "sample_tests.py"), data["sample"])
            return self._json({"ok": True})
        if u.path == "/api/reset":
            shutil.copyfile(os.path.join(pdir, "_grading", "starter.py"),
                            os.path.join(pdir, "solution.py"))
            return self._json({"solution": read(os.path.join(pdir, "solution.py"))})
        return self._json({"error": "not found"}, 404)


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{HOST}:{PORT}"
    print(f"\n  Woven Arena IDE running at  {url}")
    print("  Press Ctrl-C to stop.\n")
    if not os.environ.get("ARENA_NO_OPEN"):
        try:
            webbrowser.open(url)
        except Exception:
            pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.\n")
        server.shutdown()


if __name__ == "__main__":
    main()
