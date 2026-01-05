import { LogSink } from "./LogSink";
import { LogMessage } from "../core/LogMessage";

export class MemorySink implements LogSink {
    public logs: LogMessage[] = [];

    async write(message: LogMessage): Promise<void> {
        this.logs.push(message);
    }
}
