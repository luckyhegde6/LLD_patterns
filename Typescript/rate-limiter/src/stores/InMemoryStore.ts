import { Store } from "./Store";

type Entry = { value: number; expiresAt: number };

export class InMemoryStore implements Store {
  private data = new Map<string, Entry>();

  async get(key: string): Promise<number | null> {
    const entry = this.data.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: number, ttlMs: number): Promise<void> {
    this.data.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  async incr(key: string, ttlMs: number): Promise<number> {
    const current = await this.get(key);
    const newValue = (current ?? 0) + 1;
    await this.set(key, newValue, ttlMs);
    return newValue;
  }
}
