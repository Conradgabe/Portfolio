def overlaps(a_start, a_end, b_start, b_end):
    return a_start < b_end and b_start < a_end


def has_conflict(new_booking, existing):
    ns, ne = new_booking
    for es, ee in existing:
        if overlaps(ns, ne, es, ee):
            return True
    return False
