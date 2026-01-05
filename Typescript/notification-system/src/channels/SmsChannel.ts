import { NotificationChannel } from "./NotificationChannel";
import { Notification } from "../core/Notification";

export class SmsChannel implements NotificationChannel {
  name = "SMS";

  async send(notification: Notification): Promise<void> {
    console.log("📱 SMS sent to", notification.recipient);
  }
}
