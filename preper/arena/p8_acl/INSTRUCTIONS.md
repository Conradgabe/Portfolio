# p8 - Implement: permissions, wildcards, deny & ownership (45 min)

The full one. Pages require PERMISSIONS; roles grant permissions (with wildcards); users
can be explicitly DENIED pages or OWN them. Implement `can_access` in `solution.py`.

## Data
```
config = {
  "pages": {"home": None, "reports": "reports:view", "reports_export": "reports:export",
            "users": "users:manage", "billing": "billing:view"},
  "role_permissions": {"viewer": ["reports:view"], "analyst": ["reports:*"],
                       "admin": ["*"], "biller": ["billing:view"]},
}
user = {"name": "amara", "roles": ["analyst"],
        "denied_pages": ["reports_export"], "owned_pages": ["billing"]}
```

## Rules (mind the precedence)
1. Unknown page -> deny.
2. Explicit DENY wins over everything (`denied_pages`), even admin/owner.
3. OWNERSHIP grants (`owned_pages`), even without the permission.
4. PUBLIC pages (required permission is `None`) are allowed for everyone.
5. Otherwise allow iff the user holds the page's required permission via their roles.
6. Wildcards: `"*"` grants all; `"reports:*"` grants every `reports:<x>` permission.
7. Permissions are the UNION across roles. Default DENY.
8. `denied_pages` / `owned_pages` may be missing -> treat as empty.

**Precedence:** deny > owner > public > permission grant > default deny.

## Run
`python arena/run.py p8`  then  `python arena/run.py p8 --scored`
