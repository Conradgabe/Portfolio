# Authorization playbook (Scenario 2 - 45 min)

The task: given users, roles/permissions, and pages, decide **which pages a user can access**. It's incremental - early tests are simple RBAC, later tests add wildcards, inheritance, deny rules, ownership. Extensive partial credit, so **pass the simple tests first.**

## Mental model of access control

An access decision answers: *"Can this subject perform this action on this resource?"* For this exam usually: *"Can this user view this page?"*

The building blocks you'll see, in rough order of appearance:

1. **Roles → pages/permissions.** A user has role(s); each role grants a set. Union them.
2. **Default deny.** If nothing grants access, return `False`. Never default to allow.
3. **Role hierarchy / inheritance.** `admin` inherits `editor` inherits `viewer`. Resolve transitively. Watch for cycles.
4. **Permissions, not just page names.** A page requires a permission (`"reports:view"`); a role grants permissions. Access = required permission ∈ user's permissions.
5. **Wildcards.** `"reports:*"` grants every `reports:` permission. `"*"` grants all.
6. **Explicit deny overrides allow.** A deny rule beats any grant. Check denies last (or first, but let them win).
7. **Ownership / attributes.** A user can always access their own resource, or access depends on department/status.

## A structure that scales with the rules

Write a single decision function and layer rules so each new rule is a few lines:

```python
def can_access(user, page, config):
    # 1. Resolve the user's effective permissions (union over roles, incl. inherited)
    perms = effective_permissions(user, config)

    # 2. Explicit deny wins - check first, return early
    if is_denied(user, page, config):
        return False

    # 3. What does this page require?
    required = config["pages"].get(page)
    if required is None:
        return False            # unknown page -> deny by default

    # 4. Ownership / attribute shortcuts (if the spec has them)
    if owns(user, page, config):
        return True

    # 5. Grant if the user holds the required permission (wildcard-aware)
    return has_permission(perms, required)
```

Keep helpers small and testable: `effective_permissions`, `has_permission` (handles `*`), `is_denied`, `owns`.

## Precedence - the thing they test

When rules conflict, the near-universal order is:

```
explicit DENY  >  explicit ALLOW  >  default DENY
```

So: check deny → check allow → else deny. Write the precedence as a comment at the top of your function; graders look for it.

## Wildcard matching (do it simply)

```python
def has_permission(user_perms, required):
    if "*" in user_perms:                     # global grant
        return True
    if required in user_perms:                # exact
        return True
    prefix = required.split(":")[0]           # "reports:view" -> "reports"
    return f"{prefix}:*" in user_perms        # namespace wildcard
```

## Inheritance without infinite loops

```python
def effective_roles(role, role_parents, seen=None):
    seen = seen or set()
    if role in seen:                # cycle guard
        return set()
    seen.add(role)
    result = {role}
    for parent in role_parents.get(role, []):
        result |= effective_roles(parent, role_parents, seen)
    return result
```

Always pass `seen` to guard against a role graph with a cycle - an easy hidden test.

## Edge cases they love (handle these to bank the hard tests)

- Unknown user → deny (don't crash).
- Unknown page → deny.
- User with no roles → deny.
- Page requiring no permission (public) → allow everyone (only if spec says so).
- Multiple roles → union of permissions.
- Deny rule for a page the user is otherwise granted → deny.
- Wildcard grant plus a specific deny → deny wins.

## Time management for this one

- Minute 0-10: read spec, list rules, define signature, set up config parsing.
- Then implement **one rule at a time**, running tests after each. Green tests = banked credit.
- Do inheritance/wildcards/deny only after basic RBAC passes.
- Never write all rules then run once. You'll drown in a stack trace at minute 43.
