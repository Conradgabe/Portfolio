def build_report(entries, totals={}):
    """Total the amount spent per department for one reporting period.

    entries: list of {"dept": str, "amount": number}
    returns: {dept: total_amount}
    """
    for e in entries:
        totals[e["dept"]] = totals.get(e["dept"], 0) + e["amount"]
    return totals
