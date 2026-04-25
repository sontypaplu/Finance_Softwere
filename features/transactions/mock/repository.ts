import { transactionsSeed } from '@/lib/data/terminal-ops-seed';
import type { TransactionsConsolePayload, TransactionCreateResponse } from '@/features/transactions/contracts';
import { createRequestId } from '@/lib/utils/request-id';

export function getTransactionsConsolePayload(): TransactionsConsolePayload {
  return transactionsSeed as TransactionsConsolePayload;
}

export function createTransactionMock(): TransactionCreateResponse {
  return {
    message: 'Simulated transaction stored in UI-only adapter. Real ledger persistence is not connected yet.',
    transactionId: createRequestId('txn')
  };
}
