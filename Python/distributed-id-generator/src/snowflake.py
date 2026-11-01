"""Snowflake-like 64-bit ID generator; node IDs must be unique across workers."""
from dataclasses import dataclass
from typing import Callable
@dataclass(frozen=True)
class SnowflakeConfig:
    epoch_ms:int
    node_id:int
    node_bits:int=10
    sequence_bits:int=12
class ClockMovedBackwards(RuntimeError): pass
class SnowflakeGenerator:
    def __init__(self, config:SnowflakeConfig, clock:Callable[[],int] | None=None):
        import time
        if config.node_bits<=0 or config.sequence_bits<=0 or config.node_bits+config.sequence_bits>=63: raise ValueError("invalid bit allocation")
        if not 0<=config.node_id<(1<<config.node_bits): raise ValueError("node_id out of range")
        self.config=config; self.clock=clock or (lambda:int(time.time()*1000)); self.last_ms=-1; self.sequence=0
    def next_id(self)->int:
        now=self.clock()
        if now<self.last_ms: raise ClockMovedBackwards(f"clock moved from {self.last_ms} to {now}")
        if now==self.last_ms:
            self.sequence=(self.sequence+1)%(1<<self.config.sequence_bits)
            if self.sequence==0:
                while now<=self.last_ms: now=self.clock()
        else: self.sequence=0
        self.last_ms=now
        elapsed=now-self.config.epoch_ms
        if elapsed<0: raise ValueError("clock is before configured epoch")
        return (elapsed<<(self.config.node_bits+self.config.sequence_bits)) | (self.config.node_id<<self.config.sequence_bits) | self.sequence
