import { Task } from "../core/Task";

export interface TaskStore {
    save(task: Task): void;
    getDueTasks(now: number): Task[];
    update(task: Task): void;
    delete(taskId: string): void;
}
