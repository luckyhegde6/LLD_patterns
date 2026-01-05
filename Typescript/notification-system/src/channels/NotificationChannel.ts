import { Notification } from "../core/Notification";

export interface NotificationChannel {
    name: string;
    send(notification: Notification): Promise<void>;
}
