import { CircuitBreaker } from "./CircuitBreaker";

export class ProtectedExecutor {
  constructor(private breaker: CircuitBreaker) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.breaker.canExecute()) {
      throw new Error("Circuit is OPEN");
    }

    try {
      const result = await fn();
      this.breaker.onSuccess();
      return result;
    } catch (err) {
      this.breaker.onFailure();
      throw err;
    }
  }
}
