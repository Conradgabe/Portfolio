import unittest
from solution import is_eligible


def u(active, premium, trial):
    return {"active": active, "premium": premium, "trial_days_left": trial}


class SampleTests(unittest.TestCase):
    def test_active_premium(self):
        "active premium user is eligible"
        self.assertTrue(is_eligible(u(True, True, 0)))

    def test_active_with_trial(self):
        "active user with trial days is eligible"
        self.assertTrue(is_eligible(u(True, False, 5)))


if __name__ == "__main__":
    unittest.main()
