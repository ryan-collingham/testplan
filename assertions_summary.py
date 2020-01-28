"""Summary assertion testcases"""
import random

from testplan.testing.multitest import testsuite, testcase


def new_fix(reference=False):
    """
    Returns a reference or a randomized fix message that
    will be used to generate multiple failure categories.
    """
    if reference is True:
        _38 = 6
        _55 = 2
        _688 = "a"
    else:
        choices = {
            "38": [6] * 7 + [6] * 3,
            "55": [2] * 9 + [1] * 1,
            "688": ["a"] * 9 + ["b"] * 1,
        }

        _38 = random.choice(choices["38"])
        _55 = random.choice(choices["55"])
        _688 = random.choice(choices["688"])

    return {
        36: 6,
        22: 5,
        55: _55,
        38: _38,
        555: [
            {
                600: "A",
                601: "A",
                683: [{688: _688, 689: "a"}, {688: "b", 689: "b"}],
            },
            {
                600: "B",
                601: "B",
                683: [{688: "c", 689: "c"}, {688: "d", 689: "d"}],
            },
        ],
    }


@testsuite
class AssertionsSummary(object):
    @testcase(summarize=True)
    def mixed_assertions_summary(self, env, result):
        """
        When we have summarized testcase that has different assertion types,
        we will end up with a separate group for each assertion type.

        Assertions of the same type (e.g. ``equal``, ``less``) will be
        grouped together, however separate grouping can be enabled by passing
        ``category`` argument to assertions.
        """
        for i in range(500):
            result.equal(i, i)
            result.equal(i * 2, i * 2, category="Multiples")
            result.less(i, i + 1)
            result.less(i * 2, i * 2, category="Multiples")
            result.contain(i, [i, i + 1, i + 2])
            result.contain(i, [i * 2, i * 3, i * 4], category="Multiples")

    @testcase(
        parameters=range(2),
        summarize=True,
        num_passing=2,
        num_failing=2,
        key_combs_limit=2,
    )
    def parameterized_fixmatch_summary(self, env, result, idx):
        """
        Demonstrates customization of how many passed/failed result entries
        to present in the testcase summary report of input 1000 assertions.
        """
        reference = new_fix(reference=True)
        for _ in range(1000):
            result.fix.match(reference, new_fix(), "Fixmatch assertion")

    # summarize=True option will use default values for the number of
    # passed/failed fixmatch results to be displayed in the testcase report.
    @testcase(summarize=True)
    def fixmatch_summary(self, env, result):
        """
        Testcase report will contain a summary of 500 fixmatch passed/failed
        result entries and they will be grouped by the input
        fixmatch category given (Upstream or Downstream).

        Failing fix matches will also be grouped further per failing tag groups.
        """
        reference = new_fix(reference=True)
        category = random.choice(["Upstream", "Downstream"])
        for _ in range(500):
            result.fix.match(
                reference, new_fix(), "Fixmatch assertion", category=category
            )
