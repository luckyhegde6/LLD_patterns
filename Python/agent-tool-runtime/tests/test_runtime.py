import time

from src.runtime import (
    AllowAllPolicy, InMemoryAuditSink, ToolCall, ToolRegistry, ToolRuntime, ToolSpec,
)


def make_runtime(handler, required=frozenset({"query"}), timeout=0.2, policy=None):
    registry = ToolRegistry()
    registry.register(ToolSpec("search", "Search knowledge", required, handler, timeout))
    audit = InMemoryAuditSink()
    return ToolRuntime(registry, policy or AllowAllPolicy(), audit), audit


def test_executes_registered_tool_and_audits_success():
    runtime, audit = make_runtime(lambda args: {"hits": [args["query"]]})
    result = runtime.execute(ToolCall("search", {"query": "docs"}, "c1"))
    assert result.ok is True
    assert result.value == {"hits": ["docs"]}
    assert audit.records[-1].outcome == "success"


def test_unknown_tool_is_rejected():
    runtime, audit = make_runtime(lambda args: None)
    result = runtime.execute(ToolCall("shell", {}, "c2"))
    assert not result.ok
    assert result.error == "unknown tool"
    assert audit.records[-1].outcome == "rejected"


def test_missing_required_argument_is_rejected_before_handler():
    called = False
    def handler(args):
        nonlocal called
        called = True
    runtime, audit = make_runtime(handler)
    result = runtime.execute(ToolCall("search", {}, "c3"))
    assert not result.ok
    assert not called
    assert audit.records[-1].outcome == "invalid"


def test_policy_denies_execution():
    class DenyPolicy:
        def allow(self, call, spec):
            return False
    runtime, audit = make_runtime(lambda args: "should not run", policy=DenyPolicy())
    result = runtime.execute(ToolCall("search", {"query": "x"}, "c4"))
    assert not result.ok
    assert result.error == "execution denied by policy"
    assert audit.records[-1].outcome == "denied"


def test_handler_exception_is_normalized():
    def fail(args):
        raise RuntimeError("sensitive internal detail")
    runtime, audit = make_runtime(fail)
    result = runtime.execute(ToolCall("search", {"query": "x"}, "c5"))
    assert not result.ok
    assert "sensitive internal detail" not in (result.error or "")
    assert audit.records[-1].outcome == "error"


def test_timeout_returns_bounded_result():
    runtime, audit = make_runtime(lambda args: time.sleep(0.5), timeout=0.05)
    started = time.monotonic()
    result = runtime.execute(ToolCall("search", {"query": "x"}, "c6"))
    assert not result.ok
    assert result.error == "tool timed out"
    assert time.monotonic() - started < 0.3
    assert audit.records[-1].outcome == "timeout"
