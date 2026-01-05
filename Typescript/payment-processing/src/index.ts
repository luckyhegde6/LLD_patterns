import { PaymentService } from "./core/PaymentService";
import { InMemoryPaymentStore } from "./store/InMemoryPaymentStore";
import { StripeGateway } from "./gateways/StripeGateway";
import { UpiGateway } from "./gateways/UpiGateway";

const service = new PaymentService(
    new InMemoryPaymentStore(),
    {
        CARD: new StripeGateway(),
        UPI: new UpiGateway()
    }
);

const payment = service.createPayment(500, "UPI");
service.process(payment.id);
