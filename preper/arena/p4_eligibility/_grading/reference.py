def is_eligible(user):
    return user["active"] and (user["premium"] or user["trial_days_left"] > 0)
