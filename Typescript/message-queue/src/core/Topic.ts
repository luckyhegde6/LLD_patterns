import { Partition } from "./Partition";
import { Message } from "./Message";

export class Topic {
    private partitions: Partition[];

    constructor(partitionCount: number) {
        this.partitions = Array.from(
            { length: partitionCount },
            () => new Partition()
        );
    }

    publish(message: Message): number {
        const partition = this.getPartition(message.key);
        return partition.append(message);
    }

    read(partitionId: number, offset: number): Message[] {
        return this.partitions[partitionId].read(offset);
    }

    getPartition(key: string): Partition {
        const index = Math.abs(this.hash(key)) % this.partitions.length;
        return this.partitions[index];
    }

    private hash(key: string): number {
        return [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
    }
}
