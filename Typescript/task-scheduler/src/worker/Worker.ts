import { TaskStore } from "../store/TaskStore";
import { TaskExecutor } from "../executor/TaskExecutor";
import { RetryPolicy } from "../retry/RetryPolicy";
import { LockManager } from "../retry/LockManager";

export class Worker {
    constructor(
        private store: TaskStore,
        private executor: TaskExecutor,
        private retry: RetryPolicy,
        private lock: LockManager
    ) { }

    async poll() {
        const now = Date.now();
        const tasks = this.store.getDueTasks(now);

        for (const task of tasks) {
            if (!this.lock.acquire(task.id)) continue;

            try {
                await this.executor.execute(task);
                this.store.delete(task.id);
            } catch {
                task.attempts++;
                if (this.retry.canRetry(task.attempts)) {
                    task.runAt = this.retry.nextRunTime(task.attempts);
                    this.store.update(task);
                } else {
                    this.store.delete(task.id);
                }
            } finally {
                this.lock.release(task.id);
            }
        }
    }
}
