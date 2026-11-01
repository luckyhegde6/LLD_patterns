"""Minimal MCP stdio adapter exposing scheduler and tool-runtime operations."""
from __future__ import annotations
import importlib.util, json, sys, uuid
from pathlib import Path
from typing import Any

ROOT=Path(__file__).resolve().parents[2]
def _load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec)
    sys.modules[name]=module
    spec.loader.exec_module(module)
    return module
_scheduler=_load("lld_scheduler_module",ROOT/"task-scheduler/src/scheduler.py")
_runtime=_load("lld_runtime_module",ROOT/"agent-tool-runtime/src/runtime.py")
Scheduler,Task,Status=_scheduler.Scheduler,_scheduler.Task,_scheduler.Status
ToolRuntime,ToolCall=_runtime.ToolRuntime,_runtime.ToolCall

TOOLS=[
 {"name":"scheduler.schedule","description":"Schedule a delayed task","inputSchema":{"type":"object","properties":{"taskId":{"type":"string"},"runAt":{"type":"number"},"payload":{},"priority":{"type":"integer"},"maxAttempts":{"type":"integer"}},"required":["taskId","runAt","payload"],"additionalProperties":False}},
 {"name":"scheduler.list","description":"List scheduled tasks","inputSchema":{"type":"object","properties":{},"additionalProperties":False}},
 {"name":"scheduler.run_due","description":"Execute due tasks once (reference handler returns payload)","inputSchema":{"type":"object","properties":{"now":{"type":"number"}},"required":["now"],"additionalProperties":False}},
 {"name":"runtime.tools.list","description":"List registered agent tools","inputSchema":{"type":"object","properties":{},"additionalProperties":False}},
 {"name":"runtime.tools.execute","description":"Execute a registered tool through policy and audit","inputSchema":{"type":"object","properties":{"name":{"type":"string"},"arguments":{"type":"object"},"actor":{"type":"string"}},"required":["name","arguments","actor"],"additionalProperties":False}}
]
class MCPAdapter:
 def __init__(self,scheduler:Scheduler,runtime:ToolRuntime,permission_resolver=None):
  self.scheduler=scheduler;self.runtime=runtime;self.permission_resolver=permission_resolver or (lambda actor:set())
 def handle(self,msg:dict[str,Any]):
  method=msg.get("method");params=msg.get("params") or {};req_id=msg.get("id")
  def result(value):return {"jsonrpc":"2.0","id":req_id,"result":value}
  def error(code,message):return {"jsonrpc":"2.0","id":req_id,"error":{"code":code,"message":message}}
  if method=="initialize":return result({"protocolVersion":"2025-11-25","capabilities":{"tools":{},"resources":{}},"serverInfo":{"name":"lld-agent-platform","version":"0.1.0"}})
  if method=="notifications/initialized":return None
  if method=="ping":return result({})
  if method=="tools/list":return result({"tools":TOOLS})
  if method=="resources/list":return result({"resources":[{"uri":"scheduler://tasks","name":"Scheduled tasks","mimeType":"application/json"},{"uri":"runtime://tools","name":"Registered tools","mimeType":"application/json"},{"uri":"runtime://audit","name":"Tool audit records","mimeType":"application/json"}]})
  if method=="resources/read":
   uri=params.get("uri")
   if uri=="scheduler://tasks":value=[self._task(t) for t in self.scheduler.tasks.values()]
   elif uri=="runtime://tools":value=self.runtime._registry.list()
   elif uri=="runtime://audit":value=[r.__dict__ for r in getattr(self.runtime._audit,"records",[])]
   else:return error(-32602,"unknown resource URI")
   return result({"contents":[{"uri":uri,"mimeType":"application/json","text":json.dumps(value,default=str)}]})
  if method=="tools/call":
   name=params.get("name");args=params.get("arguments") or {}
   try:
    if name=="scheduler.schedule":
     task=Task(args["taskId"],args["runAt"],args["payload"],max_attempts=args.get("maxAttempts",3),priority=args.get("priority",0))
     self.scheduler.schedule(task);value={"taskId":task.id,"status":task.status.value}
    elif name=="scheduler.list":value=[self._task(t) for t in self.scheduler.tasks.values()]
    elif name=="scheduler.run_due":value=self.scheduler.run_due(args["now"],lambda t:t.payload)
    elif name=="runtime.tools.list":value=self.runtime._registry.list()
    elif name=="runtime.tools.execute":
     call=ToolCall(args["name"],args["arguments"],str(uuid.uuid4()),args["actor"],frozenset(self.permission_resolver(args["actor"])))
     r=self.runtime.execute(call);value={"ok":r.ok,"value":r.value,"error":r.error}
    else:return error(-32602,"unknown tool")
    return result({"content":[{"type":"text","text":json.dumps(value,default=str)}],"structuredContent":value})
   except Exception as exc:return result({"isError":True,"content":[{"type":"text","text":f"{type(exc).__name__}: {exc}"}]})
  return error(-32601,"method not found")
 @staticmethod
 def _task(t):return {"id":t.id,"runAt":t.run_at,"payload":t.payload,"priority":t.priority,"attempts":t.attempts,"maxAttempts":t.max_attempts,"status":t.status.value,"lastError":t.last_error,"workerId":t.worker_id,"leaseUntil":t.lease_until}
def main():
 registry=_runtime.ToolRegistry()
 registry.register(_runtime.ToolSpec("echo","Return the supplied text",{"type":"object","properties":{"text":{"type":"string"}},"required":["text"],"additionalProperties":False},frozenset({"echo"}),lambda args:args["text"]))
 runtime=_runtime.ToolRuntime(registry,_runtime.AllowAllPolicy(),_runtime.InMemoryAuditSink())
 adapter=MCPAdapter(Scheduler(),runtime,lambda actor:{"echo"} if actor=="demo-agent" else set())
 for line in sys.stdin:
  try:
   msg=json.loads(line);response=adapter.handle(msg)
   if response is not None:sys.stdout.write(json.dumps(response,separators=(",",":"))+"\n");sys.stdout.flush()
  except Exception:
   sys.stdout.write(json.dumps({"jsonrpc":"2.0","id":None,"error":{"code":-32700,"message":"parse error"}})+"\n");sys.stdout.flush()
if __name__=="__main__":main()
