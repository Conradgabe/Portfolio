# p7 - Implement: role inheritance (45 min)

Builds on p6. Roles now INHERIT other roles. Implement `can_access` in `solution.py`.

## Data
```
config = {
  "role_pages": {"viewer": ["home", "reports"], "editor": ["settings"], "admin": ["users"]},
  "inherits":   {"editor": ["viewer"], "admin": ["editor"]},
}
```

## Rules
1. A role grants its own pages PLUS all pages of roles it inherits, TRANSITIVELY.
   (admin -> editor -> viewer, so admin gets viewer's pages too.)
2. A user's access is the union over all their roles' effective (inherited) pages.
3. Default DENY.
4. The inheritance graph MAY contain a cycle (a -> b -> a). Do not infinite-loop.
5. Unknown roles / pages -> deny, don't crash.

Return a bool.

## Run
`python arena/run.py p7`  then  `python arena/run.py p7 --scored`
