import { Split } from "./Split";

export class Expense {
    constructor(
        public readonly id: string,
        public readonly paidBy: string,
        public readonly amount: number,
        public readonly splits: Split[]
    ) { }
}
