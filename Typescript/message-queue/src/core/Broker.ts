import { Topic } from "./Topic";
import { Message } from "./Message";

export class Broker {
    private topics = new Map<string, Topic>();

    createTopic(name: string, partitions: number) {
        this.topics.set(name, new Topic(partitions));
    }

    publish(topicName: string, message: Message): number {
        const topic = this.topics.get(topicName);
        if (!topic) throw new Error("Topic not found");
        return topic.publish(message);
    }

    read(topicName: string, partitionId: number, offset: number) {
        const topic = this.topics.get(topicName);
        if (!topic) throw new Error("Topic not found");
        return topic.read(partitionId, offset);
    }
}
