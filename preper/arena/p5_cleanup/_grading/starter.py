def purge_inactive(users):
    """Remove inactive users in place and return the dict.

    users: {user_id: {"active": bool, ...}}
    """
    for user_id, info in users.items():
        if not info["active"]:
            del users[user_id]
    return users
