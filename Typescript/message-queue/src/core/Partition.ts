import { Message } from "./Message";

export class Partition {
    private log: Message[] = [];

    append(message: Message): number {
        this.log.push(message);
        return this.log.length - 1; // offset
    }

    read(fromOffset: number): Message[] {
        return this.log.slice(fromOffset);
    }
}
