import unittest
from solution import build_report


class ScoredTests(unittest.TestCase):
    def test_single_period(self):
        "should total spend for a single period"
        entries = [{"dept": "eng", "amount": 100}, {"dept": "ops", "amount": 30}]
        self.assertEqual(build_report(entries), {"eng": 100, "ops": 30})

    def test_periods_are_independent(self):
        "should not leak totals between separate calls"
        build_report([{"dept": "eng", "amount": 100}])
        self.assertEqual(build_report([{"dept": "eng", "amount": 20}]), {"eng": 20})

    def test_empty_period(self):
        "should return an empty report for no entries"
        self.assertEqual(build_report([]), {})

    def test_repeated_empty_calls(self):
        "should stay empty across repeated empty calls"
        build_report([{"dept": "x", "amount": 5}])
        self.assertEqual(build_report([]), {})
