import unittest
from solution import overlaps


class SampleTests(unittest.TestCase):
    def test_touching_do_not_overlap(self):
        "9-10 and 10-11 just touch -> no overlap"
        self.assertFalse(overlaps(540, 600, 600, 660))

    def test_real_overlap(self):
        "9-10 and 9:30-10:30 overlap"
        self.assertTrue(overlaps(540, 600, 570, 630))


if __name__ == "__main__":
    unittest.main()
