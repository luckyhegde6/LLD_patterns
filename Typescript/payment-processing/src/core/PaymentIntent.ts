import { PaymentStatus } from "./PaymentStatus";

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    method: "CARD" | "UPI";
    status: PaymentStatus;
}

