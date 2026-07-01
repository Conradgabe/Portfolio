def can_access(user, page, config):
    """Full access control. See INSTRUCTIONS.md.

    Precedence: deny > owner > public > permission grant > default deny.

    config: {"pages": {page: required_permission_or_None},
             "role_permissions": {role: [permission, ...]}}   # perms may use "*"
    user:   {"roles": [...], "denied_pages": [...], "owned_pages": [...]}  # last two optional
    """
    # TODO: implement
    raise NotImplementedError
