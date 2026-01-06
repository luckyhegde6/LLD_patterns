import { Broker } from "../src/core/Broker";
import { Producer } from "../src/core/Producer";
import { Consumer } from "../src/core/Consumer";

test("message ordering per partition", () => {
    const broker = new Broker();
    broker.createTopic("test", 1);

    const producer = new Producer(broker);
    producer.send("test", "k1", "a");
    producer.send("test", "k1", "b");

    const consumer = new Consumer(broker, "test", 0);
    const messages = consumer.poll();

    expect(messages).toEqual(["a", "b"]);
});
