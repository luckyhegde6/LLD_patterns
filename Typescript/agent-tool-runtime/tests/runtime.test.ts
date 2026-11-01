import {AllowListedPolicy,InMemoryAuditSink,ToolRegistry,ToolRuntime,ToolSpec} from "../src/runtime";
const makeSpec=(handler:ToolSpec["handler"],extra:Partial<ToolSpec>={}):ToolSpec=>({name:"echo",description:"echo",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"],additionalProperties:false},requiredPermissions:["echo"],handler,...extra});
test("schema, permission and audit",async()=>{const r=new ToolRegistry(),a=new InMemoryAuditSink();r.register(makeSpec(x=>x.text));const rt=new ToolRuntime(r,new AllowListedPolicy(),a);
expect(await rt.execute({id:"1",name:"echo",arguments:{text:"hi"},actor:"agent",permissions:["echo"]})).toEqual({ok:true,value:"hi"});
expect((await rt.execute({id:"2",name:"echo",arguments:{bad:1},actor:"agent",permissions:["echo"]})).ok).toBe(false);
expect((await rt.execute({id:"3",name:"echo",arguments:{text:"x"},actor:"agent",permissions:[]})).error).toBe("execution denied by policy");expect(a.records).toHaveLength(3);});
test("retries transient failures",async()=>{let n=0;const r=new ToolRegistry(),a=new InMemoryAuditSink();r.register(makeSpec(()=>{if(++n===1)throw Error("transient");return "ok"},{maxAttempts:2}));const rt=new ToolRuntime(r,new AllowListedPolicy(),a);expect(await rt.execute({id:"r",name:"echo",arguments:{text:"x"},actor:"a",permissions:["echo"]})).toEqual({ok:true,value:"ok"});expect(n).toBe(2);});
