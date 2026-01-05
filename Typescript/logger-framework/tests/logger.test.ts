import { Logger } from "../src/core/Logger";
import { LogLevel } from "../src/core/LogLevel";
import { AsyncDispatcher } from "../src/dispatcher/AsyncDispatcher";
import { MemorySink } from "../src/sinks/MemorySink";

test("logs above min level", async () => {
    const sink = new MemorySink();
    const logger = new Logger(
        LogLevel.INFO,
        new AsyncDispatcher([sink])
    );

    logger.debug("ignore");
    logger.info("hello");

    await new Promise(r => setTimeout(r, 10));
    expect(sink.logs.length).toBe(1);
});
