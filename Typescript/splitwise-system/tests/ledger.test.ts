import { Ledger } from "../src/core/Ledger";

test("ledger updates balances correctly", () => {
    const ledger = new Ledger();
    ledger.addTransaction("u2", "u1", 100);

    expect(ledger.getBalances().get("u1")).toBe(100);
    expect(ledger.getBalances().get("u2")).toBe(-100);
});
