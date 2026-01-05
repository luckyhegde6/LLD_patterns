import { PaymentIntent } from "./PaymentIntent";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentStore } from "../store/PaymentStore";
import { PaymentGateway } from "../gateways/PaymentGateway";

export class PaymentService {
    constructor(
        private store: PaymentStore,
        private gateways: Record<string, PaymentGateway>
    ) { }

    createPayment(amount: number, method: "CARD" | "UPI"): PaymentIntent {
        const intent: PaymentIntent = {
            id: crypto.randomUUID(),
            amount,
            currency: "INR",
            method,
            status: PaymentStatus.CREATED
        };

        this.store.save(intent);
        return intent;
    }

    async process(intentId: string) {
        const intent = this.store.get(intentId);
        if (!intent) throw new Error("Invalid payment");

        intent.status = PaymentStatus.PROCESSING;
        this.store.update(intent);

        const gateway = this.gateways[intent.method];
        await gateway.charge(intent);
    }
}
