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


class SampleTests(unittest.TestCase):
    def test_exact_permission(self):
        "viewer can view reports"
        self.assertTrue(can_access(user(["viewer"]), "reports", CONFIG))

    def test_namespace_wildcard(self):
        "analyst's reports:* covers reports_export"
        self.assertTrue(can_access(user(["analyst"]), "reports_export", CONFIG))


if __name__ == "__main__":
    unittest.main()
