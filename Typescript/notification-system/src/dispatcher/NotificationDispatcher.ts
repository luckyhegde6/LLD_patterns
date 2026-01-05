import { Notification } from "../core/Notification";
import { NotificationChannel } from "../channels/NotificationChannel";
import { RetryPolicy } from "../retry/RetryPolicy";
import { IdempotencyStore } from "../store/IdempotencyStore";

export class NotificationDispatcher {
    constructor(
        private channels: NotificationChannel[],
        private retryPolicy: RetryPolicy,
        private idempotencyStore: IdempotencyStore
    ) { }

    async dispatch(notification: Notification) {
        for (const channel of this.channels) {
            if (!notification.channels.includes(channel.name)) continue;

            const key = `${notification.id}:${channel.name}`;
            if (this.idempotencyStore.isProcessed(key)) continue;

            await this.retryPolicy.retry(async () => {
                await channel.send(notification);
                this.idempotencyStore.markProcessed(key);
            });
        }
    }
}
