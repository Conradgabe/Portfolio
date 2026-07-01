import unittest
from solution import greet


class SampleTests(unittest.TestCase):
    def test_named(self):
        "should greet a named person"
        self.assertEqual(greet("Gabriel"), "Hello, Gabriel!")

    def test_blank(self):
        "should say hello there for blank input"
        self.assertEqual(greet(""), "Hello there!")


if __name__ == "__main__":
    unittest.main()
