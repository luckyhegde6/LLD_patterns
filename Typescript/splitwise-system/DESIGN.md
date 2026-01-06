# Splitwise System — Design

## Goals
- Accurate expense splitting
- Clear balance tracking
- Minimized settlements

## Architecture
Expense → SplitStrategy → Ledger

## Ledger Model
Positive balance → user is owed  
Negative balance → user owes

## Extensibility
- New split types
- Group expenses
- Multi-currency

## Precision
Use decimals / integer cents in production
