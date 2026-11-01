import { Task } from "../core/Task";

export interface TaskStore {
    save(task: Task): void;
    /** Atomically claim due tasks and mark them RUNNING with a lease. */
    claimDueTasks(now: number, limit: number, leaseMs: number): Task[];
    update(task: Task): void;
    delete(taskId: string): void;
    get(taskId: string): Task | undefined;
    list(): Task[];
}
