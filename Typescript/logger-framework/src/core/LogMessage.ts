import { LogLevel } from "./LogLevel";

export class LogMessage {
    constructor(
        public readonly level: LogLevel,
        public readonly message: string,
        public readonly timestamp: Date = new Date(),
        public readonly context?: Record<string, any>
    ) { }
}
