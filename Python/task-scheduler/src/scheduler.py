from dataclasses import dataclass, field
from enum import Enum
from threading import RLock, Event, Thread
from typing import Any, Callable, Protocol
import time

class Status(str, Enum):
    QUEUED="queued"; RUNNING="running"; SUCCEEDED="succeeded"; FAILED="failed"

@dataclass
class Task:
    id: str
    run_at: float
    payload: Any
    max_attempts: int = 3
    attempts: int = 0
    priority: int = 0
    status: Status = Status.QUEUED
    last_error: str | None = None
    worker_id: str | None = None
    lease_until: float | None = None
    created_at: float = field(default_factory=time.time)

class LockManager(Protocol):
    def acquire(self,key:str,token:str,ttl_seconds:float)->bool: ...
    def release(self,key:str,token:str)->bool: ...

class InMemoryLockManager:
    """Process-local lock; useful for tests, not distributed coordination."""
    def __init__(self): self._locks={}; self._guard=RLock()
    def acquire(self,key,token,ttl_seconds):
        now=time.monotonic()
        with self._guard:
            current=self._locks.get(key)
            if current and current[1]>now: return False
            self._locks[key]=(token,now+ttl_seconds); return True
    def release(self,key,token):
        with self._guard:
            current=self._locks.get(key)
            if not current or current[0]!=token: return False
            del self._locks[key]; return True

class RedisLockManager:
    """Redis SET NX PX lock with token-checked release (redis-py compatible client)."""
    RELEASE_SCRIPT="if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end"
    def __init__(self,redis): self.redis=redis
    def acquire(self,key,token,ttl_seconds):
        return bool(self.redis.set(key,token,nx=True,px=max(1,int(ttl_seconds*1000))))
    def release(self,key,token):
        return bool(self.redis.eval(self.RELEASE_SCRIPT,1,key,token))

class Scheduler:
    """In-memory reference scheduler. Atomic claims are process-local only."""
    def __init__(self):
        self.tasks={}; self.results={}; self.dead_letters={}; self._guard=RLock()
    def schedule(self,t:Task):
        if not t.id or t.max_attempts<1: raise ValueError("id and positive max_attempts required")
        if not isinstance(t.priority,int): raise ValueError("priority must be integer")
        with self._guard: return self.tasks.setdefault(t.id,t)
    def claim_due(self,now,limit,worker_id,lease_seconds=30):
        if limit<1 or lease_seconds<=0: raise ValueError("limit and lease must be positive")
        with self._guard:
            eligible=[t for t in self.tasks.values() if
                (t.status is Status.QUEUED and t.run_at<=now) or
                (t.status is Status.RUNNING and (t.lease_until or 0)<=now)]
            eligible.sort(key=lambda t:(-t.priority,t.run_at,t.created_at,t.id))
            claimed=[]
            for t in eligible[:limit]:
                t.status=Status.RUNNING;t.worker_id=worker_id;t.lease_until=now+lease_seconds;claimed.append(t)
            return claimed
    def run_due(self,now:float,handler:Callable[[Task],Any],base_backoff:float=1,limit:int=100,worker_id:str="worker-1"):
        done=[]
        for t in self.claim_due(now,limit,worker_id):
            try:
                if t.id not in self.results: self.results[t.id]=handler(t)
                t.status=Status.SUCCEEDED;done.append(t.id)
            except Exception as e:
                t.attempts+=1;t.last_error=f"{type(e).__name__}: {e}";t.worker_id=None;t.lease_until=None
                if t.attempts<t.max_attempts:
                    t.status=Status.QUEUED;t.run_at=now+min(300,base_backoff*2**(t.attempts-1))
                else:
                    t.status=Status.FAILED;self.dead_letters[t.id]=t
        return done

class WorkerManager:
    """Lifecycle controller for poll workers; deployment adapter supplies the loop."""
    def __init__(self,scheduler:Scheduler,handler:Callable[[Task],Any],worker_count=1):
        if worker_count<1: raise ValueError("worker_count must be >= 1")
        self.scheduler=scheduler;self.handler=handler;self.worker_count=worker_count;self.running=False;self._stop=Event();self._thread=None
    def start(self): self.running=True
    def stop(self): self.running=False
    def poll_once(self,now):
        if not self.running:return []
        return self.scheduler.run_due(now,self.handler,worker_id="managed-worker",limit=self.worker_count)
