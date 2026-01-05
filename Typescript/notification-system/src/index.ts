import { NotificationService } from "./core/NotificationService";
import { NotificationDispatcher } from "./dispatcher/NotificationDispatcher";
import { EmailChannel } from "./channels/EmailChannel";
import { SmsChannel } from "./channels/SmsChannel";
import { RetryPolicy } from "./retry/RetryPolicy";
import { InMemoryIdempotencyStore } from "./store/InMemoryIdempotencyStore";

const service = new NotificationService(
    new NotificationDispatcher(
        [new EmailChannel(), new SmsChannel()],
        new RetryPolicy(3, 100),
        new InMemoryIdempotencyStore()
    )
);

service.notify({
    id: "notif-1",
    recipient: "user@example.com",
    message: "Welcome!",
    channels: ["EMAIL", "SMS"]
});
