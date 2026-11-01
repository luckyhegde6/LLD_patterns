import { Scheduler } from "../src/core/Scheduler";
import { InMemoryTaskStore } from "../src/store/InMemoryTaskStore";
import { TaskStatus } from "../src/core/TaskStatus";

test("schedules a typed task with defaults", () => {
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, { now: () => 100 }, () => "task-1");

    const id = scheduler.schedule(200, { job: "email" });
    expect(id).toBe("task-1");
    expect(store.get(id)).toMatchObject({
        id,
        runAt: 200,
        payload: { job: "email" },
        attempts: 0,
        status: TaskStatus.PENDING,
        priority: 0,
        maxAttempts: 3
    });
});

test("supports priority and attempt configuration", () => {
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, { now: () => 0 }, () => "priority-task");
    const id = scheduler.schedule(0, "payload", { priority: 5, maxAttempts: 4 });
    expect(store.get(id)).toMatchObject({ priority: 5, maxAttempts: 4 });
});

test("rejects invalid scheduling options", () => {
    const scheduler = new Scheduler(new InMemoryTaskStore(), { now: () => 0 }, () => "id");
    expect(() => scheduler.schedule(-1, {})).toThrow();
    expect(() => scheduler.schedule(0, {}, { maxAttempts: 0 })).toThrow();
    expect(() => scheduler.schedule(0, {}, { priority: Number.NaN })).toThrow();
});
