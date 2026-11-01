from dataclasses import dataclass,field
from enum import Enum
class Direction(str,Enum): UP='up'; DOWN='down'; IDLE='idle'
class State(str,Enum): IDLE='idle'; MOVING='moving'; DOORS_OPEN='doors_open'
@dataclass
class Elevator:
    min_floor:int; max_floor:int; current:int=0; direction:Direction=Direction.IDLE; state:State=State.IDLE; requests:set[int]=field(default_factory=set)
    def request(self,floor:int):
        if not self.min_floor<=floor<=self.max_floor: raise ValueError('floor out of range')
        self.requests.add(floor)
    def step(self)->int:
        if not self.requests: self.direction=Direction.IDLE; self.state=State.IDLE; return self.current
        ahead=[x for x in self.requests if (x-self.current)*(1 if self.direction is not Direction.DOWN else -1)>=0]
        target=(min(ahead) if self.direction is Direction.UP else max(ahead)) if ahead else min(self.requests,key=lambda x:abs(x-self.current))
        self.direction=Direction.UP if target>self.current else Direction.DOWN if target<self.current else Direction.IDLE
        if target!=self.current: self.current+=1 if target>self.current else -1
        self.state=State.DOORS_OPEN if self.current in self.requests else State.MOVING; self.requests.discard(self.current); return self.current
