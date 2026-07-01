import unittest
from solution import overlaps, has_conflict


class ScoredTests(unittest.TestCase):
    def test_touching_do_not_overlap(self):
        "touching intervals must not overlap"
        self.assertFalse(overlaps(540, 600, 600, 660))

    def test_touching_reversed(self):
        "touching intervals in reverse order must not overlap"
        self.assertFalse(overlaps(600, 660, 540, 600))

    def test_real_overlap(self):
        "genuinely overlapping intervals overlap"
        self.assertTrue(overlaps(540, 600, 570, 630))

    def test_contained(self):
        "a contained interval overlaps"
        self.assertTrue(overlaps(540, 660, 570, 600))

    def test_disjoint(self):
        "far-apart intervals do not overlap"
        self.assertFalse(overlaps(540, 600, 660, 720))

    def test_back_to_back_allowed(self):
        "booking 10-11 is fine when 9-10 exists"
        self.assertFalse(has_conflict((600, 660), [(540, 600)]))

    def test_conflict_rejected(self):
        "an overlapping booking is a conflict"
        self.assertTrue(has_conflict((570, 630), [(540, 600)]))
