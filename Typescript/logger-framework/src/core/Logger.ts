import { LogLevel } from "./LogLevel";
import { LogMessage } from "./LogMessage";
import { AsyncDispatcher } from "../dispatcher/AsyncDispatcher";

export class Logger {
    constructor(
        private minLevel: LogLevel,
        private dispatcher: AsyncDispatcher
    ) { }

    log(level: LogLevel, message: string, context?: Record<string, any>) {
        if (level < this.minLevel) return;
        this.dispatcher.enqueue(new LogMessage(level, message, new Date(), context));
    }

    debug(msg: string, ctx?: any) { this.log(LogLevel.DEBUG, msg, ctx); }
    info(msg: string, ctx?: any) { this.log(LogLevel.INFO, msg, ctx); }
    warn(msg: string, ctx?: any) { this.log(LogLevel.WARN, msg, ctx); }
    error(msg: string, ctx?: any) { this.log(LogLevel.ERROR, msg, ctx); }
}
