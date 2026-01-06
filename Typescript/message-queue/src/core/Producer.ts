import { Broker } from "./Broker";
import { Message } from "./Message";

export class Producer {
    constructor(private broker: Broker) { }

    send(topic: string, key: string, value: string) {
        return this.broker.publish(topic, new Message(key, value));
    }
}
