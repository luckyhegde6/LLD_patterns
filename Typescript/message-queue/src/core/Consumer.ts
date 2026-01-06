import { Broker } from "./Broker";

export class Consumer {
    private offsets = new Map<number, number>();

    constructor(
        private broker: Broker,
        private topic: string,
        private partitionId: number
    ) {
        this.offsets.set(partitionId, 0);
    }

    poll(): string[] {
        const offset = this.offsets.get(this.partitionId)!;
        const messages = this.broker.read(this.topic, this.partitionId, offset);
        this.offsets.set(this.partitionId, offset + messages.length);
        return messages.map(m => m.value);
    }
}
