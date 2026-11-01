from dataclasses import dataclass
from threading import Lock
from typing import Callable
@dataclass(frozen=True)
class Decision: allowed:bool; remaining:float; retry_after:float
@dataclass
class Bucket: tokens:float; updated:float
class TokenBucket:
    def __init__(self,capacity:float,rate:float,clock:Callable[[],float]|None=None):
        import time
        if capacity<=0 or rate<=0: raise ValueError('capacity/rate must be positive')
        self.capacity=capacity; self.rate=rate; self.clock=clock or time.monotonic; self.buckets={}; self.lock=Lock()
    def consume(self,key:str,cost:float=1)->Decision:
        if cost<=0 or cost>self.capacity: raise ValueError('invalid cost')
        now=self.clock()
        with self.lock:
            b=self.buckets.setdefault(key,Bucket(self.capacity,now)); b.tokens=min(self.capacity,b.tokens+max(0,now-b.updated)*self.rate); b.updated=now
            if b.tokens>=cost: b.tokens-=cost; return Decision(True,b.tokens,0)
            return Decision(False,b.tokens,(cost-b.tokens)/self.rate)
