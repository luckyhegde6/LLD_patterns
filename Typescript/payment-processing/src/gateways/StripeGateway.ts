import { PaymentGateway } from "./PaymentGateway";
import { PaymentIntent } from "../core/PaymentIntent";

export class StripeGateway implements PaymentGateway {
    name = "STRIPE";

    async charge(intent: PaymentIntent): Promise<void> {
        console.log("💳 Charging card via Stripe:", intent.amount);
    }
}
