import { Notification } from "./Notification";
import { NotificationDispatcher } from "../dispatcher/NotificationDispatcher";

export class NotificationService {
    constructor(private dispatcher: NotificationDispatcher) { }

    async notify(notification: Notification) {
        await this.dispatcher.dispatch(notification);
    }
}
