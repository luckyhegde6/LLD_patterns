import { Worker } from "./Worker";
/** Owns polling worker lifecycle; the shared TaskStore must provide atomic claims. */
export class WorkerManager {
  private timer:ReturnType<typeof setInterval>|undefined;
  private started=false;
  constructor(private readonly workers:Worker[]){if(!workers.length)throw new Error("at least one worker is required");}
  get isRunning(){return this.started;}
  async pollOnce():Promise<void>{await Promise.all(this.workers.map(w=>w.poll()));}
  start(pollIntervalMs=250):void{
    if(this.started)return;if(pollIntervalMs<1)throw new Error("poll interval must be positive");
    this.started=true;this.timer=setInterval(()=>{void this.pollOnce();},pollIntervalMs);
  }
  stop():void{if(this.timer)clearInterval(this.timer);this.timer=undefined;this.started=false;}
}
