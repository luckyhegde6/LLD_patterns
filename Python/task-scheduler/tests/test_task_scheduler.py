from src.scheduler import *

def test_delayed_priority_retry_and_dead_letter():
 s=Scheduler(); low=s.schedule(Task("low",10,{},priority=1)); high=s.schedule(Task("high",0,{},priority=10,max_attempts=1))
 assert s.claim_due(5,1,"w")[0].id=="high"
 high.status=Status.QUEUED;high.worker_id=None;high.lease_until=None
 assert s.run_due(5,lambda t: (_ for _ in ()).throw(RuntimeError("boom")),worker_id="w")==[]
 assert high.status is Status.FAILED and "high" in s.dead_letters
 assert s.claim_due(9,10,"w")==[] and low.status is Status.QUEUED

def test_retry_then_success_and_idempotent_schedule():
 s=Scheduler();t=s.schedule(Task("t1",0,{}));assert s.schedule(Task("t1",99,2)) is t
 attempts=[0]
 def fn(_):
  attempts[0]+=1
  if attempts[0]==1:raise RuntimeError("temporary")
  return "ok"
 assert s.run_due(0,fn)==[] and t.run_at==1
 assert s.run_due(1,fn)==["t1"] and t.status is Status.SUCCEEDED and s.results["t1"]=="ok"

def test_lease_reclaim_and_token_lock():
 s=Scheduler();s.schedule(Task("x",0,{}))
 assert len(s.claim_due(0,1,"a",5))==1 and s.claim_due(4,1,"b",5)==[]
 assert s.claim_due(5,1,"b",5)[0].worker_id=="b"
 lock=InMemoryLockManager();assert lock.acquire("k","a",10);assert not lock.acquire("k","b",10)
 assert not lock.release("k","b") and lock.release("k","a")

def test_worker_lifecycle():
 s=Scheduler();s.schedule(Task("x",0,{}));m=WorkerManager(s,lambda _:None)
 assert m.poll_once(0)==[];m.start();assert m.poll_once(0)==["x"];m.stop();assert m.poll_once(1)==[]
