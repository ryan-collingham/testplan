#!/usr/bin/env python
# This plan contains tests that demonstrate failures as well.
"""
This example shows usage of assertions,
assertion groups and assertion namespaces.
"""
from concurrent import futures

import testplan
from testplan.testing import multitest
from testplan.report.testing import styles
from testplan.runnable.interactive import http
from testplan.runnable.interactive import base

import assertions_test
import assertions_summary
import assertions_graph


plan = testplan.Testplan(
    name="Assertions Example",
    stdout_style=styles.Style(
        passing=styles.StyleEnum.ASSERTION_DETAIL,
        failing=styles.StyleEnum.ASSERTION_DETAIL,
    ),
)

plan.add(
    multitest.MultiTest(
        name="Assertions Test", suites=[assertions_test.SampleSuite()]
    )
)
plan.add(
    multitest.MultiTest(
        name="AssertionsSummaryTest",
        suites=[assertions_summary.AssertionsSummary()],
    )
)
plan.add(
    multitest.MultiTest(
        name="Graph Assertions Test", suites=[assertions_graph.SampleSuite()]
    )
)

ihandler = base.TestRunnerIHandler(target=plan, http_port=0)
ihandler._pool = futures.ThreadPoolExecutor(max_workers=1)
application, _ = http.generate_interactive_api(ihandler)


if __name__ == "__main__":
    application.debug = True
    application.run(host="0.0.0.0")
