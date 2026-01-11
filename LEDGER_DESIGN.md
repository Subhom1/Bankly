# Double-Entry Ledger System Documentation

## Overview
Bankly implements a **double-entry ledger** system to ensure complete financial auditability and data integrity. Every financial transaction creates two or more ledger entries that balance each other out, following the fundamental accounting principle: **debits must equal credits**.

## Database Schema Design

### Core Tables

#### 1. **Account Table**
Stores the current balance for each user's currency wallet.
```prisma
model Account {
  id       Int      @id @default(autoincrement())
  currency Currency
  balance  Decimal  @default(0)
  userId   Int
  user     User     @relation(fields: [userId], references: [id])
  ledger   Ledger[]
}
```

#### 2. **Transaction Table**
Records high-level transaction metadata (type, amount, timestamp).
```prisma
model Transaction {
  id        Int             @id @default(autoincrement())
  type      TransactionType
  amount    Decimal
  createdAt DateTime        @default(now())
  ledger    Ledger[]
}
```

#### 3. **Ledger Table** (The Double-Entry Core)
The ledger is the **immutable audit trail**. Each entry records a single movement of funds.
```prisma
model Ledger {
  id            Int         @id @default(autoincrement())
  accountId     Int
  transactionId Int
  amount        Decimal     // Positive = Credit, Negative = Debit
  createdAt     DateTime    @default(now())
  account       Account     @relation(fields: [accountId], references: [id])
  transaction   Transaction @relation(fields: [transactionId], references: [id])
}
```

## Double-Entry Mechanics

### Transfer Example
When User A sends $100 to User B:

1. **Transaction Record** is created:
   - `type`: TRANSFER
   - `amount`: 100.00

2. **Two Ledger Entries** are created:
   - **Entry 1 (Debit)**: User A's USD account, amount: `-100.00`
   - **Entry 2 (Credit)**: User B's USD account, amount: `+100.00`

3. **Account Balances** are updated atomically:
   - User A: `balance -= 100`
   - User B: `balance += 100`

**Key Property**: `Sum(Ledger entries for Transaction X) = 0`

### Exchange Example
When a user swaps $100 USD for EUR (rate: 0.92):

1. **Transaction Record**:
   - `type`: EXCHANGE
   - `amount`: 100.00

2. **Two Ledger Entries**:
   - **Entry 1**: User's USD account, amount: `-100.00`
   - **Entry 2**: User's EUR account, amount: `+92.00`

3. **Account Balances**:
   - USD: `balance -= 100`
   - EUR: `balance += 92`

## Balance Consistency Strategy

### 1. **Atomic Database Transactions**
All financial operations use Prisma's `$transaction` to ensure atomicity:

```typescript
await this.prisma.$transaction(async (tx) => {
  // 1. Validate balances
  // 2. Update Account.balance
  // 3. Create Ledger entries
  // All or nothing - no partial updates
});
```

### 2. **Optimistic Locking via Balance Checks**
Before debiting an account, we verify sufficient funds **inside the transaction**:
```typescript
if (senderAccount.balance.lt(amount)) {
  throw new BadRequestException('Insufficient funds');
}
```

### 3. **Ledger as Source of Truth**
The `Account.balance` field is a **cached value** for performance. The true balance can always be recalculated:
```sql
SELECT SUM(amount) FROM Ledger WHERE accountId = X
```

### 4. **Immutable Ledger**
Ledger entries are **never updated or deleted**. Corrections are made via new offsetting entries (like real accounting).

### 5. **Reconciliation Capability**
A background job can verify consistency:
```typescript
const ledgerSum = await prisma.ledger.aggregate({
  where: { accountId },
  _sum: { amount: true }
});

if (ledgerSum._sum.amount !== account.balance) {
  // Flag for manual review
}
```

## Indexing Strategy

### Recommended Indexes
```sql
-- Fast lookup of all movements for an account
CREATE INDEX idx_ledger_account ON Ledger(accountId, createdAt DESC);

-- Fast lookup of all entries for a transaction
CREATE INDEX idx_ledger_transaction ON Ledger(transactionId);

-- Fast user account lookup
CREATE INDEX idx_account_user_currency ON Account(userId, currency);
```

## Scalability Considerations

### Current Implementation (Single Instance)
- Prisma handles connection pooling
- Database-level row locking prevents race conditions
- Suitable for up to ~10K concurrent users

### Future Scaling (Millions of Users)
1. **Sharding**: Partition accounts by `userId` across multiple databases
2. **Read Replicas**: Route transaction history queries to read-only replicas
3. **Event Sourcing**: Store ledger entries in an append-only event log (Kafka)
4. **CQRS**: Separate write model (transactions) from read model (balances)

## Decimal Precision

All monetary values use Prisma's `Decimal` type (arbitrary precision):
```typescript
import Decimal = Prisma.Decimal;

const amount = new Decimal(100.50).toDecimalPlaces(2);
```

This prevents floating-point rounding errors common with JavaScript's `Number` type.

## Audit Trail Benefits

1. **Complete History**: Every cent movement is traceable
2. **Dispute Resolution**: Can reconstruct account state at any point in time
3. **Regulatory Compliance**: Meets financial audit requirements
4. **Fraud Detection**: Anomalies in ledger patterns can trigger alerts

## Summary

The double-entry ledger ensures:
-  **Atomicity**: All-or-nothing transaction processing
-  **Consistency**: Balances always match ledger totals
-  **Isolation**: Concurrent transactions don't interfere
-  **Durability**: Once committed, changes are permanent
-  **Auditability**: Complete immutable financial history
