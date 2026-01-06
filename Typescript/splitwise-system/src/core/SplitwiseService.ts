import { Expense } from "./Expense";
import { Ledger } from "./Ledger";
import { SplitStrategy } from "../strategy/SplitStrategy";

export class SplitwiseService {
    constructor(
        private ledger: Ledger,
        private strategy: SplitStrategy
    ) { }

    addExpense(expense: Expense) {
        const splits = this.strategy.split(expense.amount, expense.splits);

        for (const split of splits) {
            if (split.userId !== expense.paidBy) {
                this.ledger.addTransaction(
                    split.userId,
                    expense.paidBy,
                    split.amount
                );
            }
        }
    }
}
