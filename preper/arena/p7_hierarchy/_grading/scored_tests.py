import unittest
from solution import can_access

CONFIG = {
    "role_pages": {"viewer": ["home", "reports"], "editor": ["settings"], "admin": ["users"]},
    "inherits": {"editor": ["viewer"], "admin": ["editor"]},
}


class ScoredTests(unittest.TestCase):
    def test_own_page(self):
        "editor can reach its own page"
        self.assertTrue(can_access({"name": "e", "roles": ["editor"]}, "settings", CONFIG))

    def test_inherited_page(self):
        "editor inherits viewer's pages"
        self.assertTrue(can_access({"name": "e", "roles": ["editor"]}, "reports", CONFIG))

    def test_transitive(self):
        "admin inherits editor which inherits viewer"
        a = {"name": "a", "roles": ["admin"]}
        self.assertTrue(can_access(a, "home", CONFIG))
        self.assertTrue(can_access(a, "settings", CONFIG))
        self.assertTrue(can_access(a, "users", CONFIG))

    def test_no_upward_leak(self):
        "viewer must not get editor/admin pages"
        v = {"name": "v", "roles": ["viewer"]}
        self.assertFalse(can_access(v, "settings", CONFIG))
        self.assertFalse(can_access(v, "users", CONFIG))

    def test_default_deny(self):
        "unknown page denied"
        self.assertFalse(can_access({"name": "a", "roles": ["admin"]}, "nope", CONFIG))

    def test_cycle_terminates(self):
        "a cyclic inheritance graph must not hang"
        cyclic = {"role_pages": {"a": ["pa"], "b": ["pb"]},
                  "inherits": {"a": ["b"], "b": ["a"]}}
        u = {"name": "u", "roles": ["a"]}
        self.assertTrue(can_access(u, "pa", cyclic))
        self.assertTrue(can_access(u, "pb", cyclic))
        self.assertFalse(can_access(u, "pc", cyclic))
