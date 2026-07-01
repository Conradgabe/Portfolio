def is_eligible(user):
    """Eligible if active AND (premium OR trial days remaining).

    user: {"active": bool, "premium": bool, "trial_days_left": int}
    """
    return user["active"] and user["premium"] or user["trial_days_left"] > 0
