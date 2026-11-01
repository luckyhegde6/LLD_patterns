import { Worker } from "./Worker";

/** Owns polling worker lifecycle; the shared TaskStore must provide atomic claims. */
export class WorkerManager {
  private timer: ReturnType<typeof setInterval> | undefined;
  private started = false;
  private polling = false;

  constructor(private readonly workers: Worker[]) {
    if (!workers.length) {
      throw new Error("at least one worker is required");
    }
  }

  get isRunning(): boolean {
    return this.started;
  }

  async pollOnce(): Promise<void> {
    if (this.polling) return;
    this.polling = true;
    try {
      await Promise.all(this.workers.map((worker) => worker.poll()));
    } finally {
      this.polling = false;
    }
  }

  start(pollIntervalMs = 250): void {
    if (this.started) return;
    if (pollIntervalMs < 1) {
      throw new Error("poll interval must be positive");
    }
    this.started = true;
    this.timer = setInterval(() => {
      void this.pollOnce().catch(() => undefined);
    }, pollIntervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.started = false;
  }
}
