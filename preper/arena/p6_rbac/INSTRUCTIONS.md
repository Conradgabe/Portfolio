# p6 - Implement: page authorization, basic RBAC (45 min)

Implement `can_access(user, page, config)` in `solution.py`.

## Data
```
user   = {"name": "amara", "roles": ["editor", "viewer"]}
config = {"role_pages": {"viewer": ["home", "reports"],
                         "editor": ["home", "reports", "settings"],
                         "admin":  ["home", "reports", "settings", "users"]}}
```

## Rules
1. Access granted if ANY of the user's roles grants the page.
2. Granted pages = the UNION of the user's roles' pages.
3. Default DENY if nothing grants it.
4. Unknown role on the user -> ignore it (don't crash).
5. Unknown page -> False. No roles -> access nothing.

Return a bool.

## Run
`python arena/run.py p6`  then  `python arena/run.py p6 --scored`
