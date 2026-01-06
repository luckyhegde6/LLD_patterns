export class Ledger {
    private balances = new Map<string, number>();

    addUser(userId: string) {
        if (!this.balances.has(userId)) {
            this.balances.set(userId, 0);
        }
    }

    addTransaction(from: string, to: string, amount: number) {
        this.balances.set(from, (this.balances.get(from) ?? 0) - amount);
        this.balances.set(to, (this.balances.get(to) ?? 0) + amount);
    }

    getBalances() {
        return this.balances;
    }
}
