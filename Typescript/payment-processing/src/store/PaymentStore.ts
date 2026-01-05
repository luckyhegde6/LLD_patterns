import { PaymentIntent } from "../core/PaymentIntent";

export interface PaymentStore {
  save(intent: PaymentIntent): void;
  get(id: string): PaymentIntent | undefined;
  update(intent: PaymentIntent): void;
}
