export class FailureTracker {
  private failures = 0;

  constructor(private threshold: number) {}

  recordFailure() {
    this.failures++;
  }

  reset() {
    this.failures = 0;
  }

  isThresholdReached(): boolean {
    return this.failures >= this.threshold;
  }
}
