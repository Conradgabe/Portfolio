def can_access(user, page, config):
    """Return True if `user` may access `page`, honoring transitive role inheritance.

    config: {"role_pages": {role: [page, ...]}, "inherits": {role: [parent, ...]}}
    Watch for cycles in `inherits`.
    """
    # TODO: implement
    raise NotImplementedError
