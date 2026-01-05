import { InMemoryPaymentStore } from "../src/store/InMemoryPaymentStore";
import { PaymentService } from "../src/core/PaymentService";
import { StripeGateway } from "../src/gateways/StripeGateway";

test("payment intent lifecycle", () => {
    const store = new InMemoryPaymentStore();
    const service = new PaymentService(store, { CARD: new StripeGateway() });

    const intent = service.createPayment(100, "CARD");
    expect(intent.status).toBe("CREATED");
});
