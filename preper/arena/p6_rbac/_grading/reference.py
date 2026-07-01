def can_access(user, page, config):
    role_pages = config["role_pages"]
    for role in user.get("roles", []):
        if page in role_pages.get(role, []):
            return True
    return False
