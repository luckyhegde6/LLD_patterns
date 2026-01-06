# Splitwise / Expense Sharing System
## Interview Framing

Design a system that allows users to split expenses, track who owes whom, and minimize settlements.

## Problem Decomposition

### Entities

- User
- Expense
- Split
- Settlement

### Flow

- Expense creation
- Splitting
- Settlement

### Core Responsibilities

- Expense tracking
- Split management
- Settlement calculation
- User balance tracking

```
| Component     | Responsibility             |
| ------------- | -------------------------- |
| User          | Participant in expenses    |
| Expense       | Money spent                |
| Split         | How expense is divided     |
| Ledger        | Net balance per user       |
| Settlement    | Simplify debts             |
| SplitStrategy | Equal / Exact / Percentage |
```

## Key Design Decisions
Ledger-based accounting (net balances, not raw debts)

Pluggable split strategies

Precision-safe money handling

Debt simplification

Idempotent expense addition

## Repo Structure (Final)
```
splitwise-system/
├── src/
│   ├── core/
│   │   ├── User.ts
│   │   ├── Expense.ts
│   │   ├── Split.ts
│   │   ├── Ledger.ts
│   │   └── SplitwiseService.ts
│   ├── strategy/
│   │   ├── SplitStrategy.ts
│   │   ├── EqualSplit.ts
│   │   └── ExactSplit.ts
│   └── index.ts
├── tests/
│   ├── ledger.test.ts
│   │   └── split.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── SPLITWISE_EXPLAINED_LIKE_IM_5.md
├── SPLITWISE_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json

```
