import unittest
from solution import is_eligible


def u(active, premium, trial):
    return {"active": active, "premium": premium, "trial_days_left": trial}


class ScoredTests(unittest.TestCase):
    def test_active_premium(self):
        "active premium user is eligible"
        self.assertTrue(is_eligible(u(True, True, 0)))

    def test_active_with_trial(self):
        "active user with trial days is eligible"
        self.assertTrue(is_eligible(u(True, False, 5)))

    def test_inactive_with_trial_not_eligible(self):
        "cancelled account with trial days is NOT eligible"
        self.assertFalse(is_eligible(u(False, False, 5)))

    def test_inactive_premium_not_eligible(self):
        "cancelled premium account is NOT eligible"
        self.assertFalse(is_eligible(u(False, True, 0)))

    def test_active_no_premium_no_trial(self):
        "active user with nothing is not eligible"
        self.assertFalse(is_eligible(u(True, False, 0)))
