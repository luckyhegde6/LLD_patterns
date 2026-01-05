import { Scheduler } from "../src/core/Scheduler";
import { InMemoryTaskStore } from "../src/store/InMemoryTaskStore";

test("task is scheduled", () => {
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store);

    const id = scheduler.schedule(Date.now(), { job: "email" });
    expect(id).toBeDefined();
});
