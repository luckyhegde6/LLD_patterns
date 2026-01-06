import { SnowflakeConfig } from "./SnowflakeConfig";
import { Clock } from "./Clock";

export class SnowflakeGenerator {
    private lastTimestamp = -1;
    private sequence = 0;

    private readonly maxSequence: number;
    private readonly nodeShift: number;
    private readonly timeShift: number;

    constructor(
        private config: SnowflakeConfig,
        private clock: Clock = new Clock()
    ) {
        this.maxSequence = (1 << config.sequenceBits) - 1;
        this.nodeShift = config.sequenceBits;
        this.timeShift = config.sequenceBits + config.nodeIdBits;
    }

    generate(): bigint {
        let timestamp = this.clock.now() - this.config.epoch;

        if (timestamp < this.lastTimestamp) {
            throw new Error("Clock moved backwards");
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & this.maxSequence;
            if (this.sequence === 0) {
                timestamp = this.waitNextMillis(timestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        return (
            (BigInt(timestamp) << BigInt(this.timeShift)) |
            (BigInt(this.config.nodeId) << BigInt(this.nodeShift)) |
            BigInt(this.sequence)
        );
    }

    private waitNextMillis(current: number): number {
        let now = this.clock.now() - this.config.epoch;
        while (now <= current) {
            now = this.clock.now() - this.config.epoch;
        }
        return now;
    }
}
