def _effective_permissions(user, config):
    role_perms = config["role_permissions"]
    perms = set()
    for role in user.get("roles", []):
        perms |= set(role_perms.get(role, []))
    return perms


def _has_permission(perms, required):
    if "*" in perms:
        return True
    if required in perms:
        return True
    namespace = required.split(":")[0]
    return f"{namespace}:*" in perms


def can_access(user, page, config):
    pages = config["pages"]
    if page not in pages:
        return False
    if page in user.get("denied_pages", []):
        return False
    if page in user.get("owned_pages", []):
        return True
    required = pages[page]
    if required is None:
        return True
    return _has_permission(_effective_permissions(user, config), required)
