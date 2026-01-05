import { TaskStore } from "./TaskStore";
import { Task } from "../core/Task";

export class InMemoryTaskStore implements TaskStore {
    private tasks = new Map<string, Task>();

    save(task: Task): void {
        this.tasks.set(task.id, task);
    }

    getDueTasks(now: number): Task[] {
        return [...this.tasks.values()].filter(t => t.runAt <= now);
    }

    update(task: Task): void {
        this.tasks.set(task.id, task);
    }

    delete(taskId: string): void {
        this.tasks.delete(taskId);
    }
}
