import { Scheduler } from "../src/core/Scheduler";
import { TaskStatus } from "../src/core/TaskStatus";
import { InMemoryTaskStore } from "../src/store/InMemoryTaskStore";
import { TaskExecutor } from "../src/executor/TaskExecutor";
import { RetryPolicy } from "../src/retry/RetryPolicy";
import { InMemoryLockManager } from "../src/retry/InMemoryLockManager";
import { Worker } from "../src/worker/Worker";

class FakeClock {
    constructor(private time = 0) {}
    now(): number { return this.time; }
    advance(ms: number): void { this.time += ms; }
}

function makeWorker(store: InMemoryTaskStore, executor: TaskExecutor, clock: FakeClock) {
    return new Worker(store, executor, new RetryPolicy(3, 100), new InMemoryLockManager(), clock, 10, 1_000);
}

test("executes due tasks and removes successful tasks", async () => {
    const clock = new FakeClock(100);
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, clock, () => "success-task");
    scheduler.schedule(100, { action: "send" });
    const executor = { execute: jest.fn().mockResolvedValue(undefined) } as unknown as TaskExecutor;

    await makeWorker(store, executor, clock).poll();

    expect(executor.execute).toHaveBeenCalledTimes(1);
    expect(store.get("success-task")).toBeUndefined();
});

test("retries failed tasks with backoff then retains them as FAILED", async () => {
    const clock = new FakeClock(100);
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, clock, () => "retry-task");
    scheduler.schedule(100, { action: "fail" }, { maxAttempts: 2 });
    const executor = { execute: jest.fn().mockRejectedValue(new Error("boom")) } as unknown as TaskExecutor;
    const worker = makeWorker(store, executor, clock);

    await worker.poll();
    expect(store.get("retry-task")).toMatchObject({
        status: TaskStatus.PENDING,
        attempts: 1,
        runAt: 200,
        lastError: "boom"
    });

    clock.advance(100);
    await worker.poll();
    expect(store.get("retry-task")).toMatchObject({
        status: TaskStatus.FAILED,
        attempts: 2,
        lastError: "boom"
    });
});

test("reclaims a task after its execution lease expires", () => {
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, { now: () => 0 }, () => "leased");
    scheduler.schedule(0, {});
    expect(store.claimDueTasks(0, 1, 100)).toHaveLength(1);
    expect(store.claimDueTasks(50, 1, 100)).toHaveLength(0);
    expect(store.claimDueTasks(100, 1, 100)).toHaveLength(1);
});

test("claims tasks by priority then due time", () => {
    const store = new InMemoryTaskStore();
    const scheduler = new Scheduler(store, { now: () => 0 }, (() => {
        let id = 0; return () => `task-${++id}`;
    })());
    scheduler.schedule(0, "low", { priority: 1 });
    scheduler.schedule(0, "high", { priority: 10 });
    expect(store.claimDueTasks(0, 1, 100)[0].payload).toBe("high");
});
