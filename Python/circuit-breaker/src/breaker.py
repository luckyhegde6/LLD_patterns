from enum import Enum
from dataclasses import dataclass
from typing import Callable,TypeVar
T=TypeVar('T')
class State(str,Enum): CLOSED='closed'; OPEN='open'; HALF_OPEN='half_open'
class CircuitOpenError(RuntimeError): pass
@dataclass(frozen=True)
class Config: threshold:int=3; recovery_seconds:float=10
class CircuitBreaker:
    def __init__(self,config:Config=Config(),clock:Callable[[],float]|None=None):
        import time
        if config.threshold<1 or config.recovery_seconds<=0: raise ValueError('invalid config')
        self.config=config; self.clock=clock or time.monotonic; self.state=State.CLOSED; self.failures=0; self.opened_at=None
    def call(self,fn:Callable[[],T])->T:
        now=self.clock()
        if self.state is State.OPEN:
            if now-(self.opened_at or 0)<self.config.recovery_seconds: raise CircuitOpenError('circuit open')
            self.state=State.HALF_OPEN
        try: result=fn()
        except Exception:
            self.failures+=1
            if self.state is State.HALF_OPEN or self.failures>=self.config.threshold: self.state=State.OPEN; self.opened_at=self.clock()
            raise
        self.state=State.CLOSED; self.failures=0; self.opened_at=None; return result
