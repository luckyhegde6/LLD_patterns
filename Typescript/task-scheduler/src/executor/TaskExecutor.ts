import { Task } from "../core/Task";

export class TaskExecutor {
    async execute(task: Task): Promise<void> {
        console.log("Executing task:", task.id, task.payload);
    }
}
