def build_report(entries, totals=None):
    if totals is None:
        totals = {}
    for e in entries:
        totals[e["dept"]] = totals.get(e["dept"], 0) + e["amount"]
    return totals
