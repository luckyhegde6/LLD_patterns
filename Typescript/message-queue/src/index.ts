import { Broker } from "./core/Broker";
import { Producer } from "./core/Producer";
import { Consumer } from "./core/Consumer";

const broker = new Broker();
broker.createTopic("orders", 2);

const producer = new Producer(broker);
producer.send("orders", "order1", "created");
producer.send("orders", "order2", "paid");

const consumer = new Consumer(broker, "orders", 0);
console.log(consumer.poll());
