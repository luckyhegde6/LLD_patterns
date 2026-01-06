import { Consumer } from "./Consumer";

export class ConsumerGroup {
    private consumers: Consumer[] = [];

    addConsumer(consumer: Consumer) {
        this.consumers.push(consumer);
    }
}
