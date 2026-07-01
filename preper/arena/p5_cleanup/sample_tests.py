import unittest
from solution import purge_inactive


class SampleTests(unittest.TestCase):
    def test_single_inactive_last(self):
        "removes a single trailing inactive user"
        users = {"a": {"active": True}, "b": {"active": False}}
        self.assertEqual(purge_inactive(users), {"a": {"active": True}})


if __name__ == "__main__":
    unittest.main()
