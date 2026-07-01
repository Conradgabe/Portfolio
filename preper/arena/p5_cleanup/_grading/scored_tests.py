import unittest
from solution import purge_inactive


class ScoredTests(unittest.TestCase):
    def test_multiple_inactive(self):
        "removes several inactive users without crashing"
        users = {
            "a": {"active": True},
            "b": {"active": False},
            "c": {"active": False},
            "d": {"active": True},
        }
        self.assertEqual(purge_inactive(users),
                         {"a": {"active": True}, "d": {"active": True}})

    def test_all_active(self):
        "keeps everyone when all active"
        users = {"a": {"active": True}, "b": {"active": True}}
        self.assertEqual(purge_inactive(users),
                         {"a": {"active": True}, "b": {"active": True}})

    def test_all_inactive(self):
        "removes everyone when all inactive"
        users = {"a": {"active": False}, "b": {"active": False}}
        self.assertEqual(purge_inactive(users), {})

    def test_empty(self):
        "handles an empty dict"
        self.assertEqual(purge_inactive({}), {})
