import { LockManager } from "./LockManager";

export class InMemoryLockManager implements LockManager {
    private locks = new Set<string>();

    acquire(key: string): boolean {
        if (this.locks.has(key)) return false;
        this.locks.add(key);
        return true;
    }

    release(key: string): void {
        this.locks.delete(key);
    }
}
