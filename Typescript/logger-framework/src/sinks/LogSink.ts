import { LogMessage } from "../core/LogMessage";

export interface LogSink {
    write(message: LogMessage): Promise<void>;
}
