import unittest
from solution import can_access

CONFIG = {"role_pages": {
    "viewer": ["home", "reports"],
    "editor": ["home", "reports", "settings"],
    "admin":  ["home", "reports", "settings", "users"],
}}


class SampleTests(unittest.TestCase):
    def test_role_grants_page(self):
        "a role grants its pages"
        self.assertTrue(can_access({"name": "v", "roles": ["viewer"]}, "reports", CONFIG))

    def test_default_deny(self):
        "pages no role grants are denied"
        self.assertFalse(can_access({"name": "v", "roles": ["viewer"]}, "users", CONFIG))


if __name__ == "__main__":
    unittest.main()
