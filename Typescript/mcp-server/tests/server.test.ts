import {MCPAdapter} from "../src/server";
import {Scheduler} from "../../task-scheduler/src/core/Scheduler";
import {InMemoryTaskStore} from "../../task-scheduler/src/store/InMemoryTaskStore";
import {ToolRegistry,ToolRuntime,AllowListedPolicy,InMemoryAuditSink} from "../../agent-tool-runtime/src/runtime";
test("MCP handshake, tool discovery and scheduler resource",async()=>{
 const store=new InMemoryTaskStore(),registry=new ToolRegistry(),runtime=new ToolRuntime(registry,new AllowListedPolicy(),new InMemoryAuditSink()),adapter=new MCPAdapter(new Scheduler(store,{now:()=>0},()=>"task-1"),store,runtime,{now:()=>0});
 expect((await adapter.handle({jsonrpc:"2.0",id:1,method:"initialize"})).result.capabilities.tools).toEqual({});
 expect((await adapter.handle({jsonrpc:"2.0",id:2,method:"tools/list"})).result.tools.some((t:any)=>t.name==="scheduler.schedule")).toBe(true);
 const scheduled=await adapter.handle({jsonrpc:"2.0",id:3,method:"tools/call",params:{name:"scheduler.schedule",arguments:{runAt:0,payload:{job:"demo"}}}});
 expect(scheduled.result.structuredContent.taskId).toBe("task-1");
 const resource=await adapter.handle({jsonrpc:"2.0",id:4,method:"resources/read",params:{uri:"scheduler://tasks"}});
 expect(resource.result.contents[0].text).toContain("task-1");
});
