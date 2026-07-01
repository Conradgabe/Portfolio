import unittest
import solution
from solution import get_price


class SampleTests(unittest.TestCase):
    def setUp(self):
        solution._cache.clear()

    def test_standard_price(self):
        "standard tier pays full price"
        self.assertEqual(get_price("widget", "standard"), 100)

    def test_gold_price(self):
        "gold tier gets the discount"
        self.assertEqual(get_price("widget", "gold"), 80)


if __name__ == "__main__":
    unittest.main()
