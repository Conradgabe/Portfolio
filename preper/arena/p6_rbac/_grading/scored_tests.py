import unittest
from solution import can_access

CONFIG = {"role_pages": {
    "viewer": ["home", "reports"],
    "editor": ["home", "reports", "settings"],
    "admin":  ["home", "reports", "settings", "users"],
}}


class ScoredTests(unittest.TestCase):
    def test_role_grants_page(self):
        "a role grants its pages"
        self.assertTrue(can_access({"name": "v", "roles": ["viewer"]}, "reports", CONFIG))

    def test_default_deny(self):
        "pages no role grants are denied"
        self.assertFalse(can_access({"name": "v", "roles": ["viewer"]}, "users", CONFIG))

    def test_union_of_roles(self):
        "access is the union across roles"
        u = {"name": "m", "roles": ["viewer", "editor"]}
        self.assertTrue(can_access(u, "settings", CONFIG))

    def test_no_roles(self):
        "no roles means no access"
        self.assertFalse(can_access({"name": "x", "roles": []}, "home", CONFIG))

    def test_unknown_role_ignored(self):
        "unknown roles are ignored, not fatal"
        u = {"name": "g", "roles": ["ghost", "viewer"]}
        self.assertTrue(can_access(u, "home", CONFIG))
        self.assertFalse(can_access(u, "users", CONFIG))

    def test_unknown_page(self):
        "an unknown page is denied"
        self.assertFalse(can_access({"name": "a", "roles": ["admin"]}, "nope", CONFIG))
