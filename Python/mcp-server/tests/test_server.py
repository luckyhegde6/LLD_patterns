from src.server import MCPAdapter
from src.scheduler import Scheduler
from src.runtime import ToolRegistry,ToolRuntime,AllowAllPolicy,InMemoryAuditSink

def test_mcp_initialize_tools_and_schedule_resource():
 a=MCPAdapter(Scheduler(),ToolRuntime(ToolRegistry(),AllowAllPolicy(),InMemoryAuditSink()))
 init=a.handle({"jsonrpc":"2.0","id":1,"method":"initialize","params":{}})
 assert init["result"]["capabilities"]["tools"]=={}
 tools=a.handle({"jsonrpc":"2.0","id":2,"method":"tools/list"})
 assert any(t["name"]=="scheduler.schedule" for t in tools["result"]["tools"])
 scheduled=a.handle({"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"scheduler.schedule","arguments":{"taskId":"x","runAt":0,"payload":{"op":"demo"}}}})
 assert "x" in scheduled["result"]["structuredContent"]["taskId"]
 resource=a.handle({"jsonrpc":"2.0","id":4,"method":"resources/read","params":{"uri":"scheduler://tasks"}})
 assert '"id": "x"' in resource["result"]["contents"][0]["text"]
