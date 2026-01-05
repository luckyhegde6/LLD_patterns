import { PaymentIntent } from "../core/PaymentIntent";

export interface PaymentGateway {
  name: string;
  charge(intent: PaymentIntent): Promise<void>;
}
