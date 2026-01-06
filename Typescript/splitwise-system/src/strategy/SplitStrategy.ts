import { Split } from "../core/Split";

export interface SplitStrategy {
    split(amount: number, splits: Split[]): Split[];
}
