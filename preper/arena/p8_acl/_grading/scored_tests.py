import unittest
from solution import can_access

CONFIG = {
    "pages": {"home": None, "reports": "reports:view", "reports_export": "reports:export",
              "users": "users:manage", "billing": "billing:view"},
    "role_permissions": {"viewer": ["reports:view"], "analyst": ["reports:*"],
                         "admin": ["*"], "biller": ["billing:view"]},
}


def user(roles, denied=None, owned=None):
    u = {"name": "u", "roles": roles}
    if denied is not None:
        u["denied_pages"] = denied
    if owned is not None:
        u["owned_pages"] = owned
    return u


class ScoredTests(unittest.TestCase):
    def test_exact_permission(self):
        "exact permission grants; missing one denies"
        self.assertTrue(can_access(user(["viewer"]), "reports", CONFIG))
        self.assertFalse(can_access(user(["viewer"]), "users", CONFIG))

    def test_namespace_wildcard(self):
        "reports:* covers all reports pages but not billing"
        self.assertTrue(can_access(user(["analyst"]), "reports", CONFIG))
        self.assertTrue(can_access(user(["analyst"]), "reports_export", CONFIG))
        self.assertFalse(can_access(user(["analyst"]), "billing", CONFIG))

    def test_superuser_wildcard(self):
        "'*' grants everything"
        self.assertTrue(can_access(user(["admin"]), "users", CONFIG))
        self.assertTrue(can_access(user(["admin"]), "billing", CONFIG))

    def test_public_page(self):
        "public pages are open to all"
        self.assertTrue(can_access(user([]), "home", CONFIG))

    def test_unknown_page(self):
        "unknown page denied even for admin"
        self.assertFalse(can_access(user(["admin"]), "nope", CONFIG))

    def test_deny_overrides(self):
        "explicit deny beats an admin grant"
        self.assertFalse(can_access(user(["admin"], denied=["users"]), "users", CONFIG))
        self.assertTrue(can_access(user(["admin"], denied=["users"]), "reports", CONFIG))

    def test_ownership_grants(self):
        "owner reaches a page without the permission"
        self.assertTrue(can_access(user([], owned=["billing"]), "billing", CONFIG))

    def test_deny_beats_ownership(self):
        "deny beats ownership"
        self.assertFalse(can_access(user([], denied=["billing"], owned=["billing"]), "billing", CONFIG))

    def test_union_of_roles(self):
        "permissions union across roles"
        self.assertTrue(can_access(user(["biller", "viewer"]), "billing", CONFIG))
        self.assertTrue(can_access(user(["biller", "viewer"]), "reports", CONFIG))

    def test_missing_optional_keys(self):
        "missing denied/owned keys are treated as empty"
        self.assertTrue(can_access({"name": "x", "roles": ["viewer"]}, "reports", CONFIG))
