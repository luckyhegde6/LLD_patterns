from dataclasses import dataclass
from typing import Callable
class ClockRollback(RuntimeError): pass
@dataclass(frozen=True)
class Config: epoch_ms:int; node_id:int; node_bits:int=10; sequence_bits:int=12
class SnowflakeGenerator:
    def __init__(self,c:Config,clock:Callable[[],int]|None=None):
        import time
        if c.node_bits<1 or c.sequence_bits<1 or c.node_bits+c.sequence_bits>=63 or not 0<=c.node_id<2**c.node_bits: raise ValueError('invalid config')
        self.c=c; self.clock=clock or (lambda:int(time.time()*1000)); self.last=-1; self.sequence=0
    def next_id(self)->int:
        now=self.clock()
        if now<self.last: raise ClockRollback('clock moved backwards')
        if now==self.last:
            self.sequence=(self.sequence+1)%(2**self.c.sequence_bits)
            if self.sequence==0: raise RuntimeError('sequence exhausted in this millisecond')
        else: self.sequence=0
        if now<self.c.epoch_ms: raise ValueError('before epoch')
        self.last=now
        return ((now-self.c.epoch_ms)<<(self.c.node_bits+self.c.sequence_bits))|(self.c.node_id<<self.c.sequence_bits)|self.sequence
