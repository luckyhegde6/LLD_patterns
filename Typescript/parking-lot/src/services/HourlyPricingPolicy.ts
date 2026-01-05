import { PricingPolicy } from "./PricingPolicy";

export class HourlyPricingPolicy implements PricingPolicy {
    constructor(private ratePerHour: number) { }

    calculate(entry: Date, exit: Date): number {
        const hours = Math.ceil(
            (exit.getTime() - entry.getTime()) / (1000 * 60 * 60)
        );
        return hours * this.ratePerHour;
    }
}
