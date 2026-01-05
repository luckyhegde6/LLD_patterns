import { LogSink } from "./LogSink";
import { LogMessage } from "../core/LogMessage";

export class ConsoleSink implements LogSink {
    async write(message: LogMessage): Promise<void> {
        console.log(
            `[${message.timestamp.toISOString()}]`,
            message.message,
            message.context ?? ""
        );
    }
}
