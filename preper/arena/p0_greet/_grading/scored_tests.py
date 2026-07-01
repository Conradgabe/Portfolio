import unittest
from solution import greet


class ScoredTests(unittest.TestCase):
    def test_named(self):
        "should greet a named person"
        self.assertEqual(greet("Qualified"), "Hello, Qualified!")

    def test_another_name(self):
        "should greet any name"
        self.assertEqual(greet("Ada"), "Hello, Ada!")

    def test_blank(self):
        "should say hello there for blank input"
        self.assertEqual(greet(""), "Hello there!")
