def purge_inactive(users):
    for user_id in list(users):
        if not users[user_id]["active"]:
            del users[user_id]
    return users
