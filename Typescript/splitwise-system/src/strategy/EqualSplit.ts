import { SplitStrategy } from "./SplitStrategy";
import { Split } from "../core/Split";

export class EqualSplit implements SplitStrategy {
  split(amount: number, splits: Split[]): Split[] {
    const perUser = amount / splits.length;
    return splits.map(s => ({
      userId: s.userId,
      amount: perUser
    }));
  }
}
