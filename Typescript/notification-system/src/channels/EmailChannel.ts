import { NotificationChannel } from "./NotificationChannel";
import { Notification } from "../core/Notification";

export class EmailChannel implements NotificationChannel {
    name = "EMAIL";

    async send(notification: Notification): Promise<void> {
        console.log("📧 Email sent to", notification.recipient);
    }
}
