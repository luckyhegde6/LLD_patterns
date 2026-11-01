from src.scheduler import *

def test_retry_then_success():
 s=Scheduler(); t=s.schedule(Task('t1',0,{})); attempts=[0]
 def fn(_):
  attempts[0]+=1
  if attempts[0]==1: raise RuntimeError()
  return 'ok'
 assert s.run_due(0,fn)==[] and t.run_at==1; assert s.run_due(1,fn)==['t1'] and t.status is Status.SUCCEEDED
def test_idempotent_schedule():
 s=Scheduler(); a=s.schedule(Task('x',0,1)); assert s.schedule(Task('x',9,2)) is a
