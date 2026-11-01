import { TaskStatus } from "./TaskStatus";

export interface Task<TPayload = unknown> {
    id: string;
    runAt: number; // epoch ms
    payload: TPayload;
    attempts: number;
    status: TaskStatus;
    priority: number;
    maxAttempts: number;
    leaseUntil?: number;
    lastError?: string;
}
