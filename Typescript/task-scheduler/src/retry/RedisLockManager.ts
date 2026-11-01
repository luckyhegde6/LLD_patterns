import { LockManager } from "./LockManager";

export interface RedisLockClient {
  set(key:string,value:string,...args:(string|number)[]):Promise<unknown>;
  eval(script:string,numKeys:number,...args:string[]):Promise<unknown>;
}
/** Redis SET NX PX with token-checked release. Suitable for shared worker coordination. */
export class RedisLockManager implements LockManager {
  private readonly tokens=new Map<string,string>();
  private static readonly RELEASE="if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
  constructor(private readonly redis:RedisLockClient,private readonly ttlMs=30_000,private readonly prefix="lld:lock:") {
    if(ttlMs<=0)throw new Error("ttlMs must be positive");
  }
  async acquire(key:string):Promise<boolean>{
    const token=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ok=await this.redis.set(this.prefix+key,token,"PX",this.ttlMs,"NX");
    if(ok==="OK"||ok===true){this.tokens.set(key,token);return true;}return false;
  }
  async release(key:string):Promise<void>{
    const token=this.tokens.get(key);if(!token)return;
    await this.redis.eval(RedisLockManager.RELEASE,1,this.prefix+key,token);this.tokens.delete(key);
  }
}
