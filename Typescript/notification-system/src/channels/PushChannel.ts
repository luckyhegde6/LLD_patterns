import { NotificationChannel } from "./NotificationChannel";
import { Notification } from "../core/Notification";

export class PushChannel implements NotificationChannel {
    name = "PUSH";

    async send(notification: Notification): Promise<void> {
        console.log("🔔 Push sent to", notification.recipient);
    }
}
