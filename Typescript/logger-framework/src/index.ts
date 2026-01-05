import { Logger } from "./core/Logger";
import { LogLevel } from "./core/LogLevel";
import { AsyncDispatcher } from "./dispatcher/AsyncDispatcher";
import { ConsoleSink } from "./sinks/ConsoleSink";

const logger = new Logger(
    LogLevel.INFO,
    new AsyncDispatcher([new ConsoleSink()])
);

logger.debug("This will not print");
logger.info("App started", { port: 3000 });
logger.error("Something broke");
