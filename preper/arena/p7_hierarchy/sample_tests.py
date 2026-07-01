import unittest
from solution import can_access

CONFIG = {
    "role_pages": {"viewer": ["home", "reports"], "editor": ["settings"], "admin": ["users"]},
    "inherits": {"editor": ["viewer"], "admin": ["editor"]},
}


class SampleTests(unittest.TestCase):
    def test_own_page(self):
        "editor can reach its own page"
        self.assertTrue(can_access({"name": "e", "roles": ["editor"]}, "settings", CONFIG))

    def test_inherited_page(self):
        "editor inherits viewer's pages"
        self.assertTrue(can_access({"name": "e", "roles": ["editor"]}, "reports", CONFIG))


if __name__ == "__main__":
    unittest.main()
