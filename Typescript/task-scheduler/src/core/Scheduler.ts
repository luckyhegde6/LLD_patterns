import { Task } from "./Task";
import { TaskStatus } from "./TaskStatus";
import { TaskStore } from "../store/TaskStore";

export interface ScheduleOptions {
    priority?: number;
    maxAttempts?: number;
}

export interface Clock {
    now(): number;
}

export class SystemClock implements Clock {
    now(): number {
        return Date.now();
    }
}

export class Scheduler {
    constructor(
        private readonly store: TaskStore,
        private readonly clock: Clock = new SystemClock(),
        private readonly createId: () => string = () => crypto.randomUUID()
    ) {}

    schedule<TPayload>(
        runAt: number,
        payload: TPayload,
        options: ScheduleOptions = {}
    ): string {
        if (!Number.isFinite(runAt) || runAt < 0) {
            throw new Error("runAt must be a non-negative epoch timestamp");
        }
        const priority = options.priority ?? 0;
        const maxAttempts = options.maxAttempts ?? 3;
        if (!Number.isFinite(priority)) {
            throw new Error("priority must be a finite number");
        }
        if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
            throw new Error("maxAttempts must be an integer >= 1");
        }

        const task: Task<TPayload> = {
            id: this.createId(),
            runAt,
            payload,
            attempts: 0,
            status: TaskStatus.PENDING,
            priority,
            maxAttempts
        };
        this.store.save(task);
        return task.id;
    }
}
