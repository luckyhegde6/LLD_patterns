import { Scheduler } from "../../task-scheduler/src/core/Scheduler";
import { InMemoryTaskStore } from "../../task-scheduler/src/store/InMemoryTaskStore";
import { ToolRegistry,ToolRuntime,AllowListedPolicy,InMemoryAuditSink } from "../../agent-tool-runtime/src/runtime";
import { MCPAdapter,runStdio } from "./server";

async function main(){
 const store=new InMemoryTaskStore(),scheduler=new Scheduler(store),registry=new ToolRegistry(),audit=new InMemoryAuditSink();
 registry.register({name:"echo",description:"Return the supplied text",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"],additionalProperties:false},requiredPermissions:["echo"],handler:args=>args.text});
 const runtime=new ToolRuntime(registry,new AllowListedPolicy(),audit);
 const adapter=new MCPAdapter(scheduler,store,runtime,undefined,actor=>actor==="demo-agent"?["echo"]:[]);
 await runStdio(adapter);
}
void main();
