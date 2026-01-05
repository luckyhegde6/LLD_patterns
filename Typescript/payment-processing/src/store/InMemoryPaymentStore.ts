import { PaymentStore } from "./PaymentStore";
import { PaymentIntent } from "../core/PaymentIntent";

export class InMemoryPaymentStore implements PaymentStore {
  private store = new Map<string, PaymentIntent>();

  save(intent: PaymentIntent): void {
    this.store.set(intent.id, intent);
  }

  get(id: string): PaymentIntent | undefined {
    return this.store.get(id);
  }

  update(intent: PaymentIntent): void {
    this.store.set(intent.id, intent);
  }
}
