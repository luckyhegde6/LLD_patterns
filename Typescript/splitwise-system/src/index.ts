import { Ledger } from "./core/Ledger";
import { SplitwiseService } from "./core/SplitwiseService";
import { EqualSplit } from "./strategy/EqualSplit";
import { Expense } from "./core/Expense";

const ledger = new Ledger();
const service = new SplitwiseService(ledger, new EqualSplit());

const expense = new Expense(
    "e1",
    "u1",
    300,
    [
        { userId: "u1", amount: 0 },
        { userId: "u2", amount: 0 },
        { userId: "u3", amount: 0 }
    ]
);

service.addExpense(expense);
console.log(ledger.getBalances());
