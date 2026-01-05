export interface LockManager {
    acquire(key: string): boolean;
    release(key: string): void;
}
