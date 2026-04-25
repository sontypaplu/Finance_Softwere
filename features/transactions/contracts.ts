import type { SecurityOption } from '@/lib/types/terminal-ops';

export type TransactionsConsolePayload = {
  options: {
    accounts: string[];
    brokers: string[];
    transactionTypes: string[];
    securities: SecurityOption[];
    currencies: string[];
    strategies: string[];
    benchmarks: string[];
    assetClasses: string[];
    regions: string[];
  };
  suggestedDefaults: {
    account: string;
    broker: string;
    currency: string;
    transactionType: string;
    strategy: string;
    region: string;
  };
  recent: {
    id: string;
    date: string;
    type: string;
    security: string;
    portfolio: string;
    account: string;
    amount: string;
    status: string;
  }[];
  templates: { title: string; subtitle: string }[];
};

export type TransactionCreateResponse = {
  message: string;
  transactionId: string;
};
