export type JsonSchema = Record<string, unknown>;
export type ToolHandler = (args: Record<string, unknown>) => unknown | Promise<unknown>;
export interface ToolSpec { name:string; description:string; inputSchema:JsonSchema; requiredPermissions?:string[]; handler:ToolHandler; maxAttempts?:number; timeoutMs?:number; }
export interface ToolCall { id:string; name:string; arguments:Record<string,unknown>; actor:string; permissions:string[]; }
export interface AuditRecord { callId:string; tool:string; actor:string; outcome:string; attempt:number; durationMs:number; error?:string; at:string; }
export interface Policy { authorize(call:ToolCall,spec:ToolSpec):boolean|Promise<boolean>; }
export interface AuditSink { write(record:AuditRecord):void; }
export class AllowListedPolicy implements Policy {
 constructor(private readonly grants:Record<string,string[]>={}){}
 authorize(call:ToolCall,spec:ToolSpec):boolean {const granted=new Set(this.grants[call.actor]??call.permissions);return (spec.requiredPermissions??[]).every(p=>granted.has(p));}
}
export class InMemoryAuditSink implements AuditSink {readonly records:AuditRecord[]=[];write(r:AuditRecord){this.records.push(r);}}
export function validateJsonSchema(value:unknown,schema:JsonSchema,path="$"):void{
 const type=schema.type,valid:Record<string,(v:unknown)=>boolean>={object:v=>typeof v==="object"&&v!==null&&!Array.isArray(v),array:Array.isArray,string:v=>typeof v==="string",integer:v=>typeof v==="number"&&Number.isInteger(v),number:v=>typeof v==="number"&&Number.isFinite(v),boolean:v=>typeof v==="boolean",null:v=>v===null};
 if(typeof type==="string"&&valid[type]&&!valid[type](value))throw Error(`${path}: expected ${type}`);
 if(Array.isArray(schema.enum)&&!schema.enum.some(v=>JSON.stringify(v)===JSON.stringify(value)))throw Error(`${path}: enum mismatch`);
 if(value&&typeof value==="object"&&!Array.isArray(value)){const obj=value as Record<string,unknown>,props=(schema.properties??{}) as Record<string,JsonSchema>;
 for(const k of (schema.required as string[]|undefined)??[])if(!(k in obj))throw Error(`${path}.${k}: required`);
 if(schema.additionalProperties===false)for(const k of Object.keys(obj))if(!(k in props))throw Error(`${path}: unexpected property ${k}`);
 for(const [k,s] of Object.entries(props))if(k in obj)validateJsonSchema(obj[k],s,`${path}.${k}`);}
 if(Array.isArray(value)&&schema.items&&typeof schema.items==="object")value.forEach((v,i)=>validateJsonSchema(v,schema.items as JsonSchema,`${path}[${i}]`));
}
export class ToolRegistry {
 private tools=new Map<string,ToolSpec>();
 register(spec:ToolSpec){if(!spec.name.trim()||this.tools.has(spec.name))throw Error("tool name must be unique and non-empty");if((spec.maxAttempts??1)<1||(spec.timeoutMs??10000)<=0)throw Error("invalid execution bounds");this.tools.set(spec.name,spec);}
 get(name:string){return this.tools.get(name);}
 list(){return [...this.tools.values()].map(({handler,...spec})=>spec);}
}
export class ToolRuntime {
 constructor(private registry:ToolRegistry,private policy:Policy,private audit:AuditSink){}
 async execute(call:ToolCall):Promise<{ok:boolean;value?:unknown;error?:string}>{
 const spec=this.registry.get(call.name);if(!spec)return this.finish(call,"rejected",0,0,"unknown tool");
 try{validateJsonSchema(call.arguments,spec.inputSchema);}catch(e){return this.finish(call,"invalid",0,0,e instanceof Error?e.message:"invalid arguments");}
 if(!await this.policy.authorize(call,spec))return this.finish(call,"denied",0,0,"execution denied by policy");
 let last="tool failed";
 for(let attempt=1;attempt<=(spec.maxAttempts??1);attempt++){const start=Date.now();let timer:ReturnType<typeof setTimeout>|undefined;
 try{const value=await Promise.race([Promise.resolve(spec.handler(call.arguments)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error("tool timed out")),spec.timeoutMs??10000);})]);if(timer)clearTimeout(timer);this.audit.write({callId:call.id,tool:call.name,actor:call.actor,outcome:"success",attempt,durationMs:Date.now()-start,at:new Date().toISOString()});return {ok:true,value};}
 catch(e){if(timer)clearTimeout(timer);last=e instanceof Error?e.message:"tool execution failed";const outcome=last==="tool timed out"?"timeout":"error";this.audit.write({callId:call.id,tool:call.name,actor:call.actor,outcome,attempt,durationMs:Date.now()-start,error:last,at:new Date().toISOString()});if(attempt<(spec.maxAttempts??1))await new Promise(r=>setTimeout(r,Math.min(250*2**(attempt-1),2000)));}}
 return {ok:false,error:last};}
 private finish(call:ToolCall,outcome:string,attempt:number,durationMs:number,error:string){this.audit.write({callId:call.id,tool:call.name,actor:call.actor,outcome,attempt,durationMs,error,at:new Date().toISOString()});return {ok:false,error};}
}
