import time

from testplan.testing.multitest import MultiTest, testsuite, testcase

from testplan import Testplan
from testplan.runners.pools import ThreadPool
from testplan.runners.pools.tasks import Task

from testplan.common.utils.testing import (
    check_report,
    log_propagation_disabled,
)
from testplan.report import (
    Status,
    TestReport,
    TestGroupReport,
    TestCaseReport,
    ReportCategories,
)
from testplan.common.utils.logger import TESTPLAN_LOGGER


@testsuite
class Suite1(object):
    """A test suite with basic testcases."""

    @testcase(timeout=2)
    def test_normal(self, env, result):
        result.log("Testcase will finish execution in time")

    @testcase(timeout=2)
    def test_abnormal(self, env, result):
        result.log("Testcase will definitely timeout")
        time.sleep(5)


@testsuite
class Suite2(object):
    """A test suite with parameterized testcases in different exec groups."""

    @testcase(parameters=(1, 2, 3), execution_group="first", timeout=5)
    def test_timeout_1(self, env, result, val):
        result.log("Testcase will sleep for {} seconds".format(val))
        time.sleep(val)

    @testcase(parameters=(1, 2, 5), execution_group="second", timeout=3)
    def test_timeout_2(self, env, result, val):
        result.log("Testcase will sleep for {} seconds".format(val))
        time.sleep(val)


def get_mtest():
    test = MultiTest(
        name="MTest", suites=[Suite1(), Suite2()], thread_pool_size=2
    )
    return test


def _create_testcase_report(name, status_override=None, entries=None):
    report = TestCaseReport(name=name)
    report.status_override = status_override
    if entries:
        report.entries = entries
    return report


def test_timeout_on_testcases():

    plan = Testplan(name="plan", parse_cmdline=False)
    pool = ThreadPool(name="MyPool", size=2)
    plan.add_resource(pool)

    task = Task(target=get_mtest())
    plan.schedule(task, resource="MyPool")

    with log_propagation_disabled(TESTPLAN_LOGGER):
        plan.run()

    expected_report = TestReport(
        name="plan",
        entries=[
            TestGroupReport(
                name="MTest",
                category=ReportCategories.MULTITEST,
                entries=[
                    TestGroupReport(
                        name="Suite1",
                        description="A test suite with basic testcases.",
                        category=ReportCategories.TESTSUITE,
                        entries=[
                            TestCaseReport(
                                name="test_normal",
                                entries=[
                                    {
                                        "type": "Log",
                                        "message": "Testcase will finish execution in time",
                                    }
                                ],
                            ),
                            _create_testcase_report(
                                name="test_abnormal",
                                status_override=Status.ERROR,
                                entries=[
                                    {
                                        "type": "Log",
                                        "message": "Testcase will definitely timeout",
                                    }
                                ],
                            ),
                        ],
                    ),
                    TestGroupReport(
                        name="Suite2",
                        description="A test suite with parameterized testcases in different exec groups.",
                        category=ReportCategories.TESTSUITE,
                        entries=[
                            TestGroupReport(
                                name="test_timeout_1",
                                category=ReportCategories.PARAMETRIZATION,
                                entries=[
                                    TestCaseReport(
                                        name="test_timeout_1__val_1",
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 1 seconds",
                                            }
                                        ],
                                    ),
                                    TestCaseReport(
                                        name="test_timeout_1__val_2",
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 2 seconds",
                                            }
                                        ],
                                    ),
                                    TestCaseReport(
                                        name="test_timeout_1__val_3",
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 3 seconds",
                                            }
                                        ],
                                    ),
                                ],
                            ),
                            TestGroupReport(
                                name="test_timeout_2",
                                category=ReportCategories.PARAMETRIZATION,
                                entries=[
                                    TestCaseReport(
                                        name="test_timeout_2__val_1",
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 1 seconds",
                                            }
                                        ],
                                    ),
                                    TestCaseReport(
                                        name="test_timeout_2__val_2",
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 2 seconds",
                                            }
                                        ],
                                    ),
                                    _create_testcase_report(
                                        name="test_timeout_2__val_5",
                                        status_override=Status.ERROR,
                                        entries=[
                                            {
                                                "type": "Log",
                                                "message": "Testcase will sleep for 5 seconds",
                                            }
                                        ],
                                    ),
                                ],
                            ),
                        ],
                    ),
                ],
            )
        ],
    )

    check_report(expected_report, plan.report)
