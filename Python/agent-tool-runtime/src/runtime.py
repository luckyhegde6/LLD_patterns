"""A governed, framework-neutral tool execution boundary."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Protocol


ToolHandler = Callable[[dict[str, Any]], Any]


@dataclass(frozen=True)
class ToolSpec:
    name: str
    description: str
    required: frozenset[str]
    handler: ToolHandler
    timeout_seconds: float = 2.0


@dataclass(frozen=True)
class ToolCall:
    tool_name: str
    arguments: dict[str, Any]
    call_id: str


@dataclass(frozen=True)
class ToolResult:
    call_id: str
    tool_name: str
    ok: bool
    value: Any = None
    error: str | None = None


@dataclass(frozen=True)
class AuditRecord:
    call_id: str
    tool_name: str
    outcome: str
    timestamp: str
    detail: str = ""


class ExecutionPolicy(Protocol):
    def allow(self, call: ToolCall, spec: ToolSpec) -> bool: ...


class AuditSink(Protocol):
    def write(self, record: AuditRecord) -> None: ...


class AllowAllPolicy:
    """Demo policy. Replace with identity/tenant/approval-aware policy in production."""

    def allow(self, call: ToolCall, spec: ToolSpec) -> bool:
        return True


class InMemoryAuditSink:
    def __init__(self) -> None:
        self.records: list[AuditRecord] = []

    def write(self, record: AuditRecord) -> None:
        self.records.append(record)


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, ToolSpec] = {}

    def register(self, spec: ToolSpec) -> None:
        if not spec.name.strip():
            raise ValueError("tool name must not be empty")
        if spec.timeout_seconds <= 0:
            raise ValueError("timeout_seconds must be positive")
        if spec.name in self._tools:
            raise ValueError(f"tool already registered: {spec.name}")
        self._tools[spec.name] = spec

    def get(self, name: str) -> ToolSpec | None:
        return self._tools.get(name)


class ToolRuntime:
    def __init__(
        self,
        registry: ToolRegistry,
        policy: ExecutionPolicy,
        audit: AuditSink,
    ) -> None:
        self._registry = registry
        self._policy = policy
        self._audit = audit

    def execute(self, call: ToolCall) -> ToolResult:
        spec = self._registry.get(call.tool_name)
        if spec is None:
            return self._finish(call, "rejected", ToolResult(
                call.call_id, call.tool_name, False, error="unknown tool"
            ))

        missing = spec.required - call.arguments.keys()
        if missing:
            return self._finish(call, "invalid", ToolResult(
                call.call_id, call.tool_name, False,
                error=f"missing required arguments: {', '.join(sorted(missing))}",
            ))

        if not self._policy.allow(call, spec):
            return self._finish(call, "denied", ToolResult(
                call.call_id, call.tool_name, False, error="execution denied by policy"
            ))

        executor = ThreadPoolExecutor(max_workers=1)
        future = executor.submit(spec.handler, dict(call.arguments))
        try:
            value = future.result(timeout=spec.timeout_seconds)
            result = ToolResult(call.call_id, call.tool_name, True, value=value)
            return self._finish(call, "success", result)
        except FutureTimeout:
            future.cancel()
            result = ToolResult(call.call_id, call.tool_name, False, error="tool timed out")
            return self._finish(call, "timeout", result)
        except Exception as exc:  # normalize tool failure at the boundary
            result = ToolResult(
                call.call_id, call.tool_name, False,
                error=f"tool execution failed: {type(exc).__name__}",
            )
            return self._finish(call, "error", result)
        finally:
            # Do not wait for a timed-out handler; threads cannot be forcibly stopped.
            executor.shutdown(wait=False, cancel_futures=True)

    def _finish(self, call: ToolCall, outcome: str, result: ToolResult) -> ToolResult:
        self._audit.write(AuditRecord(
            call_id=call.call_id,
            tool_name=call.tool_name,
            outcome=outcome,
            timestamp=datetime.now(timezone.utc).isoformat(),
            detail=result.error or "",
        ))
        return result
