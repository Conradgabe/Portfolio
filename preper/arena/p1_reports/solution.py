def build_report(entries, totals=None):
    """Total the amount spent per department for one reporting period.

    entries: list of {"dept": str, "amount": number}
    returns: {dept: total_amount}
    """
    if totals is None:
        totals = {}
    # based on the entries, get the dept and then the amount
    for e in entries:
        # check dept is not in total
        if e["dept"] in totals:
            totals[e["dept"]] += e["amount"]
        else:
            # compute the amount
            totals[e["dept"]] = e["amount"]
        
    return totals
