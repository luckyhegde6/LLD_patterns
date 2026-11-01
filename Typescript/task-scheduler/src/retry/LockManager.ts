export interface LockManager {
    acquire(key: string): boolean | Promise<boolean>;
    release(key: string): void | Promise<void>;
}
