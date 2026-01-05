import { PaymentStore } from "../store/PaymentStore";
import { PaymentStatus } from "../core/PaymentStatus";

export class WebhookHandler {
  constructor(private store: PaymentStore) {}

  handle(paymentId: string, success: boolean) {
    const intent = this.store.get(paymentId);
    if (!intent) return;

    intent.status = success
      ? PaymentStatus.SUCCESS
      : PaymentStatus.FAILED;

    this.store.update(intent);
  }
}
