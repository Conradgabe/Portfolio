def overlaps(a_start, a_end, b_start, b_end):
    """True if [a_start, a_end) and [b_start, b_end) overlap in time."""
    return a_start <= b_end and b_start <= a_end


def has_conflict(new_booking, existing):
    """new_booking: (start, end). existing: list of (start, end)."""
    ns, ne = new_booking
    for es, ee in existing:
        if overlaps(ns, ne, es, ee):
            return True
    return False
