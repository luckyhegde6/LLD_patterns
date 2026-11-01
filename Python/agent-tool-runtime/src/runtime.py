"""Governed, framework-neutral tool execution with schema, policy, retry and audit."""
from __future__ import annotations
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Callable, Protocol
import time

ToolHandler=Callable[[dict[str,Any]],Any]
@dataclass(frozen=True)
class ToolSpec:
    name:str; description:str; input_schema:dict[str,Any]; required_permissions:frozenset[str]; handler:ToolHandler
    timeout_seconds:float=2.0; max_attempts:int=1
@dataclass(frozen=True)
class ToolCall:
    tool_name:str; arguments:dict[str,Any]; call_id:str; actor:str="agent"; permissions:frozenset[str]=frozenset()
@dataclass(frozen=True)
class ToolResult:
    call_id:str; tool_name:str; ok:bool; value:Any=None; error:str|None=None
@dataclass(frozen=True)
class AuditRecord:
    call_id:str; tool_name:str; actor:str; outcome:str; timestamp:str; attempt:int=0; duration_ms:float=0; detail:str=""
class ExecutionPolicy(Protocol):
    def allow(self,call:ToolCall,spec:ToolSpec)->bool: ...
class AuditSink(Protocol):
    def write(self,record:AuditRecord)->None: ...
class AllowAllPolicy:
    def allow(self,call,spec): return spec.required_permissions.issubset(call.permissions)
class InMemoryAuditSink:
    def __init__(self):self.records=[]
    def write(self,record):self.records.append(record)
def validate_schema(value,schema,path="$"):
    types={"object":dict,"array":list,"string":str,"integer":int,"number":(int,float),"boolean":bool,"null":type(None)}
    expected=schema.get("type")
    if expected in types and (not isinstance(value,types[expected]) or (expected=="integer" and isinstance(value,bool))):raise ValueError(f"{path}: expected {expected}")
    if "enum" in schema and value not in schema["enum"]:raise ValueError(f"{path}: enum mismatch")
    if isinstance(value,dict):
        props=schema.get("properties",{})
        for key in schema.get("required",[]):
            if key not in value:raise ValueError(f"{path}.{key}: required")
        if schema.get("additionalProperties") is False and set(value)-set(props):raise ValueError(f"{path}: unexpected properties")
        for k,v in value.items():
            if k in props:validate_schema(v,props[k],f"{path}.{k}")
    if isinstance(value,list) and "items" in schema:
        for i,v in enumerate(value):validate_schema(v,schema["items"],f"{path}[{i}]")
class ToolRegistry:
    def __init__(self):self._tools={}
    def register(self,spec):
        if not spec.name.strip() or spec.name in self._tools:raise ValueError("tool name must be unique and non-empty")
        if spec.timeout_seconds<=0 or spec.max_attempts<1:raise ValueError("invalid execution bounds")
        self._tools[spec.name]=spec
    def get(self,name):return self._tools.get(name)
    def list(self):return [{"name":s.name,"description":s.description,"inputSchema":s.input_schema,"requiredPermissions":sorted(s.required_permissions)} for s in self._tools.values()]
class ToolRuntime:
    def __init__(self,registry,policy,audit):self._registry=registry;self._policy=policy;self._audit=audit
    def execute(self,call):
        spec=self._registry.get(call.tool_name)
        if spec is None:return self._finish(call,"rejected",ToolResult(call.call_id,call.tool_name,False,error="unknown tool"))
        try:validate_schema(call.arguments,spec.input_schema)
        except Exception as e:return self._finish(call,"invalid",ToolResult(call.call_id,call.tool_name,False,error=str(e)))
        if not self._policy.allow(call,spec):return self._finish(call,"denied",ToolResult(call.call_id,call.tool_name,False,error="execution denied by policy"))
        last=None
        for attempt in range(1,spec.max_attempts+1):
            start=time.monotonic();executor=ThreadPoolExecutor(max_workers=1);future=executor.submit(spec.handler,dict(call.arguments))
            try:
                value=future.result(timeout=spec.timeout_seconds)
                self._audit.write(AuditRecord(call.call_id,call.tool_name,call.actor,"success",datetime.now(timezone.utc).isoformat(),attempt,(time.monotonic()-start)*1000))
                return ToolResult(call.call_id,call.tool_name,True,value=value)
            except FutureTimeout:
                future.cancel();last="tool timed out";outcome="timeout"
            except Exception:
                last="tool execution failed";outcome="error"
            finally:executor.shutdown(wait=False,cancel_futures=True)
            self._audit.write(AuditRecord(call.call_id,call.tool_name,call.actor,outcome,datetime.now(timezone.utc).isoformat(),attempt,(time.monotonic()-start)*1000,last))
            if attempt<spec.max_attempts:time.sleep(min(.1*2**(attempt-1),1))
        return ToolResult(call.call_id,call.tool_name,False,error=last)
    def _finish(self,call,outcome,result):
        self._audit.write(AuditRecord(call.call_id,call.tool_name,call.actor,outcome,datetime.now(timezone.utc).isoformat(),detail=result.error or ""));return result
