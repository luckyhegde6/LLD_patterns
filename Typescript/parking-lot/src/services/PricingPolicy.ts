export interface PricingPolicy {
    calculate(entry: Date, exit: Date): number;
}
