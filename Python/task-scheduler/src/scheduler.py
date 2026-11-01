from dataclasses import dataclass
from enum import Enum
class Status(str,Enum): QUEUED='queued'; RUNNING='running'; SUCCEEDED='succeeded'; FAILED='failed'
@dataclass
class Task: id:str; run_at:float; payload:object; max_attempts:int=3; attempts:int=0; status:Status=Status.QUEUED; last_error:str|None=None
class Scheduler:
    def __init__(self): self.tasks={}; self.results={}
    def schedule(self,t:Task):
        if t.max_attempts<1: raise ValueError('max attempts must be positive')
        return self.tasks.setdefault(t.id,t)
    def run_due(self,now:float,handler,base_backoff:float=1):
        done=[]
        for t in sorted(self.tasks.values(),key=lambda x:(x.run_at,x.id)):
            if t.status is not Status.QUEUED or t.run_at>now: continue
            t.status=Status.RUNNING; t.attempts+=1
            try:
                if t.id not in self.results: self.results[t.id]=handler(t)
                t.status=Status.SUCCEEDED; done.append(t.id)
            except Exception as e:
                t.last_error=type(e).__name__
                if t.attempts>=t.max_attempts: t.status=Status.FAILED
                else: t.status=Status.QUEUED; t.run_at=now+base_backoff*2**(t.attempts-1)
        return done
