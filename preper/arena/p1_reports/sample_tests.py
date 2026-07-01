import unittest
from solution import build_report


class SampleTests(unittest.TestCase):
    def test_single_period(self):
        "should total spend for a single period"
        entries = [
            {"dept": "ops", "amount": 100},
            {"dept": "eng", "amount": 50},
          
        ]
        self.assertEqual(build_report(entries), {"eng": 50, "ops": 100})


if __name__ == "__main__":
    unittest.main()
