import { randomUUID } from "crypto";
import { Scheduler, Clock } from "../../task-scheduler/src/core/Scheduler";
import { TaskStore } from "../../task-scheduler/src/store/TaskStore";
import { Worker } from "../../task-scheduler/src/worker/Worker";
import { RetryPolicy } from "../../task-scheduler/src/retry/RetryPolicy";
import { InMemoryLockManager } from "../../task-scheduler/src/retry/InMemoryLockManager";
import { TaskExecutor } from "../../task-scheduler/src/executor/TaskExecutor";
import { ToolRuntime, ToolRegistry } from "../../agent-tool-runtime/src/runtime";

export const MCP_TOOLS=[
{name:"scheduler.schedule",description:"Schedule a delayed task",inputSchema:{type:"object",properties:{runAt:{type:"number"},payload:{},priority:{type:"number"},maxAttempts:{type:"number"}},required:["runAt","payload"],additionalProperties:false}},
{name:"scheduler.list",description:"List scheduled tasks",inputSchema:{type:"object",properties:{},additionalProperties:false}},
{name:"scheduler.run_due",description:"Claim and execute due tasks",inputSchema:{type:"object",properties:{},additionalProperties:false}},
{name:"runtime.tools.list",description:"List registered agent tools",inputSchema:{type:"object",properties:{},additionalProperties:false}},
{name:"runtime.tools.execute",description:"Execute a registered tool through policy and audit",inputSchema:{type:"object",properties:{name:{type:"string"},arguments:{type:"object"},actor:{type:"string"},permissions:{type:"array",items:{type:"string"}}},required:["name","arguments","actor","permissions"],additionalProperties:false}}
];
export class MCPAdapter {
 constructor(private scheduler:Scheduler,private store:TaskStore,private runtime:ToolRuntime,private clock:Clock={now:()=>Date.now()}){}
 async handle(message:any):Promise<any|null>{
 const method=message?.method,params=message?.params??{},id=message?.id;
 const result=(value:any)=>({jsonrpc:"2.0",id,result:value}),error=(code:number,message:string)=>({jsonrpc:"2.0",id,error:{code,message}});
 if(method==="notifications/initialized")return null;
 if(method==="ping")return result({});
 if(method==="initialize")return result({protocolVersion:"2025-11-25",capabilities:{tools:{},resources:{}},serverInfo:{name:"lld-agent-platform",version:"0.1.0"}});
 if(method==="tools/list")return result({tools:MCP_TOOLS});
 if(method==="resources/list")return result({resources:[{uri:"scheduler://tasks",name:"Scheduled tasks",mimeType:"application/json"},{uri:"runtime://tools",name:"Registered tools",mimeType:"application/json"},{uri:"runtime://audit",name:"Tool audit records",mimeType:"application/json"}]});
 if(method==="resources/read"){const uri=params.uri;let value:any;if(uri==="scheduler://tasks")value=this.store.list();else if(uri==="runtime://tools")value=this.runtime.registryList();else if(uri==="runtime://audit")value=this.runtime.auditRecords();else return error(-32602,"unknown resource URI");return result({contents:[{uri,mimeType:"application/json",text:JSON.stringify(value)}]});}
 if(method==="tools/call"){const args=params.arguments??{};try{let value:any;
 if(params.name==="scheduler.schedule"){const taskId=this.scheduler.schedule(args.runAt,args.payload,{priority:args.priority,maxAttempts:args.maxAttempts});value={taskId,status:"PENDING"};}
 else if(params.name==="scheduler.list")value=this.store.list();
 else if(params.name==="scheduler.run_due"){const executor={execute:async()=>undefined} as TaskExecutor;const worker=new Worker(this.store,executor,new RetryPolicy(3,100),new InMemoryLockManager(),this.clock);await worker.poll();value={polled:true};}
 else if(params.name==="runtime.tools.list")value=this.runtime.registryList();
 else if(params.name==="runtime.tools.execute"){const r=await this.runtime.execute({id:randomUUID(),name:args.name,arguments:args.arguments,actor:args.actor,permissions:args.permissions});value=r;}
 else return error(-32602,"unknown tool");
 return result({content:[{type:"text",text:JSON.stringify(value)}],structuredContent:value});
 }catch(e){return result({isError:true,content:[{type:"text",text:e instanceof Error?e.message:"tool failed"}]});}}
 return error(-32601,"method not found");
 }
}
export async function runStdio(adapter:MCPAdapter){
 const readline=require("readline");const rl=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
 for await(const line of rl){try{const msg=JSON.parse(line);const response=await adapter.handle(msg);if(response!==null&&response!==undefined)process.stdout.write(JSON.stringify(response)+"\n");}catch(e){process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:null,error:{code:-32700,message:"parse error"}})+"\n");}}
}
