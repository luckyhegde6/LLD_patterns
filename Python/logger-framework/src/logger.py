from dataclasses import dataclass,field
from datetime import datetime,timezone
from enum import IntEnum
from queue import Queue,Full
from typing import Any,Protocol
class Level(IntEnum): DEBUG=10; INFO=20; WARN=30; ERROR=40
@dataclass(frozen=True)
class Record: level:Level; message:str; fields:dict[str,Any]=field(default_factory=dict); timestamp:str=field(default_factory=lambda:datetime.now(timezone.utc).isoformat())
class Sink(Protocol):
    def write(self,record:Record)->None: ...
class MemorySink:
    def __init__(self): self.records=[]
    def write(self,record): self.records.append(record)
class Logger:
    def __init__(self,sinks:list[Sink],min_level:Level=Level.INFO,capacity:int=100):
        if capacity<1: raise ValueError('capacity must be positive')
        self.sinks=sinks; self.min_level=min_level; self.queue=Queue(capacity); self.dropped=0
    def log(self,level:Level,message:str,**fields)->bool:
        if level<self.min_level: return True
        try: self.queue.put_nowait(Record(level,message,fields)); return True
        except Full: self.dropped+=1; return False
    def flush(self)->int:
        n=0
        while not self.queue.empty():
            r=self.queue.get_nowait()
            for s in self.sinks:
                try: s.write(r)
                except Exception: pass
            self.queue.task_done(); n+=1
        return n
