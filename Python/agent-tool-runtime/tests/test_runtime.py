import time
from src.runtime import *
def make(handler,attempts=1):
 r=ToolRegistry();r.register(ToolSpec("echo","echo",{"type":"object","properties":{"text":{"type":"string"}},"required":["text"],"additionalProperties":False},frozenset({"echo"}),handler,max_attempts=attempts))
 a=InMemoryAuditSink();return ToolRuntime(r,AllowAllPolicy(),a),a
def test_schema_permission_and_audit():
 rt,a=make(lambda x:x["text"])
 assert rt.execute(ToolCall("echo",{"text":"ok"},"1",permissions=frozenset({"echo"}))).value=="ok"
 assert rt.execute(ToolCall("echo",{"bad":1},"2",permissions=frozenset({"echo"}))).ok is False
 assert rt.execute(ToolCall("echo",{"text":"x"},"3")).error=="execution denied by policy"
 assert len(a.records)==3
def test_retry():
 n=[0]
 def flaky(_):
  n[0]+=1
  if n[0]==1:raise RuntimeError()
  return "ok"
 rt,_=make(flaky,2);assert rt.execute(ToolCall("echo",{"text":"x"},"4",permissions=frozenset({"echo"}))).value=="ok";assert n[0]==2
