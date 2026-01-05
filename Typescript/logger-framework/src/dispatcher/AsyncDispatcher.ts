import { LogSink } from "../sinks/LogSink";
import { LogMessage } from "../core/LogMessage";

export class AsyncDispatcher {
    private queue: LogMessage[] = [];
    private flushing = false;

    constructor(private sinks: LogSink[]) { }

    enqueue(message: LogMessage) {
        this.queue.push(message);
        this.flush();
    }

    private async flush() {
        if (this.flushing) return;
        this.flushing = true;

        while (this.queue.length > 0) {
            const msg = this.queue.shift()!;
            for (const sink of this.sinks) {
                try {
                    await sink.write(msg);
                } catch {
                    // swallow errors to avoid app crash
                }
            }
        }

        this.flushing = false;
    }
}
