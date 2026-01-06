import { CircuitState } from "./CircuitState";
import { FailureTracker } from "./FailureTracker";

export class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private lastFailureTime = 0;

  constructor(
    private tracker: FailureTracker,
    private cooldownMs: number
  ) {}

  canExecute(): boolean {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = CircuitState.HALF_OPEN;
        return true;
      }
      return false;
    }
    return true;
  }

  onSuccess() {
    this.tracker.reset();
    this.state = CircuitState.CLOSED;
  }

  onFailure() {
    this.tracker.recordFailure();
    this.lastFailureTime = Date.now();

    if (this.tracker.isThresholdReached()) {
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
