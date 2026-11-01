"""Circuit breaker with injectable monotonic clock for deterministic tests."""
from __future__ import annotations
from enum import Enum
from dataclasses import dataclass
from typing import Callable, TypeVar
T=TypeVar("T")
class State(str, Enum):
    CLOSED="closed"; OPEN="open"; HALF_OPEN="half_open"
@dataclass(frozen=True)
class BreakerConfig:
    failure_threshold:int=3
    recovery_timeout:float=10.0
    half_open_max_calls:int=1
class CircuitOpenError(RuntimeError): pass
class CircuitBreaker:
    def __init__(self, config:BreakerConfig=BreakerConfig(), clock:Callable[[],float] | None=None):
        if config.failure_threshold<1 or config.recovery_timeout<=0 or config.half_open_max_calls<1: raise ValueError("invalid breaker config")
        import time
        self.config=config; self._clock=clock or time.monotonic
        self.state=State.CLOSED; self.failures=0; self.opened_at:float|None=None; self.probes=0
    def _admit(self)->None:
        if self.state is State.OPEN:
            if self.opened_at is not None and self._clock()-self.opened_at>=self.config.recovery_timeout:
                self.state=State.HALF_OPEN; self.probes=0
            else: raise CircuitOpenError("dependency circuit is open")
        if self.state is State.HALF_OPEN:
            if self.probes>=self.config.half_open_max_calls: raise CircuitOpenError("half-open probe limit reached")
            self.probes+=1
    def call(self, operation:Callable[[],T])->T:
        self._admit()
        try: result=operation()
        except Exception:
            self.failures+=1
            if self.state is State.HALF_OPEN or self.failures>=self.config.failure_threshold:
                self.state=State.OPEN; self.opened_at=self._clock()
            raise
        if self.state is State.HALF_OPEN:
            self.state=State.CLOSED; self.failures=0; self.opened_at=None; self.probes=0
        else: self.failures=0
        return result
