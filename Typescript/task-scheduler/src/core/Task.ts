export interface Task {
    id: string;
    runAt: number; // epoch ms
    payload: any;
    attempts: number;
}
