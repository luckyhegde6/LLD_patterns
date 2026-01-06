import { SplitStrategy } from "./SplitStrategy";
import { Split } from "../core/Split";

export class ExactSplit implements SplitStrategy {
    split(_: number, splits: Split[]): Split[] {
        return splits;
    }
}