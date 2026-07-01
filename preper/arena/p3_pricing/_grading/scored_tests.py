import unittest
import solution
from solution import get_price


class ScoredTests(unittest.TestCase):
    def setUp(self):
        solution._cache.clear()

    def test_standard_price(self):
        "standard tier pays full price"
        self.assertEqual(get_price("widget", "standard"), 100)

    def test_gold_price(self):
        "gold tier gets the discount"
        self.assertEqual(get_price("widget", "gold"), 80)

    def test_tiers_do_not_contaminate(self):
        "pricing gold first must not change the standard price"
        self.assertEqual(get_price("widget", "gold"), 80)
        self.assertEqual(get_price("widget", "standard"), 100)

    def test_cache_reused_within_tier(self):
        "same product+tier returns a stable price"
        self.assertEqual(get_price("gadget", "standard"), 250)
        self.assertEqual(get_price("gadget", "standard"), 250)
