def _effective_roles(role, inherits, seen):
    if role in seen:
        return seen
    seen.add(role)
    for parent in inherits.get(role, []):
        _effective_roles(parent, inherits, seen)
    return seen


def can_access(user, page, config):
    role_pages = config["role_pages"]
    inherits = config.get("inherits", {})
    roles = set()
    for r in user.get("roles", []):
        _effective_roles(r, inherits, roles)
    for r in roles:
        if page in role_pages.get(r, []):
            return True
    return False
