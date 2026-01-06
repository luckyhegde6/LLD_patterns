# Splitwise — Interview Guide

## 30s Pitch
“I maintain a ledger of net balances instead of raw debts,
use strategies for splitting, and simplify settlements later.”

---

## Interruptions

Interviewer: Why ledger instead of per-expense debts?
You: Ledger simplifies queries and settlement.

Interviewer: Floating-point issues?
You: Use integer cents or decimal library.

Interviewer: Debt simplification?
You: Match debtors with creditors greedily.

Interviewer: Idempotency?
You: Expense IDs prevent duplicates.

Interviewer: Hardest part?
You: Correct money handling.
