import { TaskStore } from "../store/TaskStore";
import { TaskExecutor } from "../executor/TaskExecutor";
import { RetryPolicy } from "../retry/RetryPolicy";
import { LockManager } from "../retry/LockManager";
import { Clock, SystemClock } from "../core/Scheduler";
import { TaskStatus } from "../core/TaskStatus";

export class Worker {
    constructor(
        private readonly store: TaskStore,
        private readonly executor: TaskExecutor,
        private readonly retry: RetryPolicy,
        // Retained as a local adapter hook; distributed claim correctness is
        // provided by TaskStore.claimDueTasks in a shared-store implementation.
        private readonly lock: LockManager,
        private readonly clock: Clock = new SystemClock(),
        private readonly batchSize = 10,
        private readonly leaseMs = 30_000
    ) {}

    async poll(): Promise<void> {
        const now = this.clock.now();
        const tasks = this.store.claimDueTasks(now, this.batchSize, this.leaseMs);

        for (const task of tasks) {
            if (!await this.lock.acquire(task.id)) {
                task.status = TaskStatus.PENDING;
                task.leaseUntil = undefined;
                this.store.update(task);
                continue;
            }

            try {
                await this.executor.execute(task);
                this.store.delete(task.id);
            } catch (error) {
                task.attempts += 1;
                task.lastError = error instanceof Error ? error.message : String(error);
                task.leaseUntil = undefined;

                if (task.attempts < task.maxAttempts) {
                    task.status = TaskStatus.PENDING;
                    task.runAt = this.retry.nextRunTime(task.attempts, this.clock.now());
                    this.store.update(task);
                } else {
                    task.status = TaskStatus.FAILED;
                    this.store.update(task); // retain failed task as a dead-letter record
                }
            } finally {
                await this.lock.release(task.id);
            }
        }
    }
}
