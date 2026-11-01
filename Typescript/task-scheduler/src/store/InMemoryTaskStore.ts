import { TaskStore } from "./TaskStore";
import { Task } from "../core/Task";
import { TaskStatus } from "../core/TaskStatus";

export class InMemoryTaskStore implements TaskStore {
    private readonly tasks = new Map<string, Task>();

    save(task: Task): void {
        if (this.tasks.has(task.id)) {
            throw new Error(`task already exists: ${task.id}`);
        }
        this.tasks.set(task.id, { ...task });
    }

    /**
     * Synchronous selection + state transition makes claiming atomic within
     * this process. A persistent/distributed store must implement this as
     * one transaction or conditional update.
     */
    claimDueTasks(now: number, limit: number, leaseMs: number): Task[] {
        if (!Number.isInteger(limit) || limit < 1) {
            throw new Error("limit must be an integer >= 1");
        }
        if (!Number.isFinite(leaseMs) || leaseMs <= 0) {
            throw new Error("leaseMs must be > 0");
        }

        const eligible = [...this.tasks.values()]
            .filter(task =>
                (task.status === TaskStatus.PENDING && task.runAt <= now) ||
                (task.status === TaskStatus.RUNNING && (task.leaseUntil ?? 0) <= now)
            )
            .sort((a, b) => b.priority - a.priority || a.runAt - b.runAt || a.id.localeCompare(b.id))
            .slice(0, limit);

        return eligible.map(task => {
            const claimed: Task = {
                ...task,
                status: TaskStatus.RUNNING,
                leaseUntil: now + leaseMs
            };
            this.tasks.set(task.id, claimed);
            return { ...claimed };
        });
    }

    update(task: Task): void {
        if (!this.tasks.has(task.id)) {
            throw new Error(`task not found: ${task.id}`);
        }
        this.tasks.set(task.id, { ...task });
    }

    delete(taskId: string): void {
        this.tasks.delete(taskId);
    }

    get(taskId: string): Task | undefined {
        const task = this.tasks.get(taskId);
        return task ? { ...task } : undefined;
    }

    list(): Task[] {
        return [...this.tasks.values()].map(task => ({ ...task }));
    }
}
