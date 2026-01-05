import { PaymentGateway } from "./PaymentGateway";
import { PaymentIntent } from "../core/PaymentIntent";

export class UpiGateway implements PaymentGateway {
    name = "UPI";

    async charge(intent: PaymentIntent): Promise<void> {
        console.log("📱 Initiating UPI collect request:", intent.amount);
    }
}
