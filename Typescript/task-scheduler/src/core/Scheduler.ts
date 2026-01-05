import { Task } from "./Task";
import { TaskStore } from "../store/TaskStore";

export class Scheduler {
  constructor(private store: TaskStore) {}

  schedule(runAt: number, payload: any) {
    const task: Task = {
      id: crypto.randomUUID(),
      runAt,
      payload,
      attempts: 0
    };
    this.store.save(task);
    return task.id;
  }
}
