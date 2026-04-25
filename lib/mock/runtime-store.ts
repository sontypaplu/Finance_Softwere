import { nanoid } from 'nanoid';
import type { AppRole, WorkspaceMemberRole, TransactionStatus, TransactionType } from '@prisma/client';
import { hashPassword } from '@/lib/security/password';

type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string | null;
  mfaEnabled: boolean;
};

type WorkspaceRecord = { id: string; name: string; ownerId: string; createdAt: string; updatedAt: string };
type WorkspaceMemberRecord = { userId: string; workspaceId: string; role: WorkspaceMemberRole };
type PortfolioRecord = { id: string; workspaceId: string; name: string; baseCurrency: string; notes: string; createdAt: string; updatedAt: string };
type AccountRecord = { id: string; portfolioId: string; name: string; broker: string; accountType: string; currency: string; createdAt: string; updatedAt: string };
type SecurityRecord = { id: string; symbol: string; name: string; isin?: string; exchange?: string; assetClass: string; sector?: string; industry?: string; currency: string; country?: string };
type TransactionRecord = {
  id: string;
  portfolioId: string;
  accountId: string;
  securityId?: string | null;
  type: TransactionType;
  tradeDate: string;
  settlementDate?: string | null;
  quantity?: number | null;
  price?: number | null;
  grossAmount?: number | null;
  fees?: number | null;
  taxes?: number | null;
  netAmount?: number | null;
  currency: string;
  fxRateToBase?: number | null;
  notes?: string | null;
  status: TransactionStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};
type AlertRecord = { id: string; workspaceId: string; portfolioId?: string | null; type: string; severity: string; title: string; message: string; status: string; createdAt: string };
type AuditRecord = { id: string; workspaceId?: string | null; userId?: string | null; action: string; entityType: string; entityId?: string | null; beforeJson?: unknown; afterJson?: unknown; createdAt: string; ipAddress?: string | null; userAgent?: string | null };

type RuntimeStore = {
  users: UserRecord[];
  workspaces: WorkspaceRecord[];
  workspaceMembers: WorkspaceMemberRecord[];
  portfolios: PortfolioRecord[];
  accounts: AccountRecord[];
  securities: SecurityRecord[];
  transactions: TransactionRecord[];
  alerts: AlertRecord[];
  audits: AuditRecord[];
};

declare global {
  // eslint-disable-next-line no-var
  var __financeRuntimeStore: RuntimeStore | undefined;
  // eslint-disable-next-line no-var
  var __financeRuntimeBootstrapped: boolean | undefined;
}

function now() {
  return new Date().toISOString();
}

function makeStore(): RuntimeStore {
  return {
    users: [],
    workspaces: [],
    workspaceMembers: [],
    portfolios: [],
    accounts: [],
    securities: [
      { id: 'sec_nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', assetClass: 'Equity', sector: 'Technology', currency: 'USD', country: 'US' },
      { id: 'sec_aapl', symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', assetClass: 'Equity', sector: 'Technology', currency: 'USD', country: 'US' },
      { id: 'sec_hdfc', symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', assetClass: 'Equity', sector: 'Financials', currency: 'INR', country: 'IN' }
    ],
    transactions: [],
    alerts: [],
    audits: []
  };
}

export function getRuntimeStore() {
  if (!global.__financeRuntimeStore) {
    global.__financeRuntimeStore = makeStore();
  }
  return global.__financeRuntimeStore;
}

export async function ensureRuntimeSeeded() {
  if (global.__financeRuntimeBootstrapped) return getRuntimeStore();
  const store = getRuntimeStore();
  if (!store.users.length) {
    const passwordHash = await hashPassword('Demo@1234');
    const userId = 'usr_demo';
    const workspaceId = 'ws_demo';
    const portfolioId = 'pf_demo';
    const accountId = 'acct_demo';

    store.users.push({
      id: userId,
      name: 'Demo User',
      email: 'demo@aurelius.finance',
      passwordHash,
      role: 'PORTFOLIO_MANAGER',
      createdAt: now(),
      updatedAt: now(),
      emailVerifiedAt: now(),
      mfaEnabled: false
    });
    store.workspaces.push({ id: workspaceId, name: 'Aurelius Demo Workspace', ownerId: userId, createdAt: now(), updatedAt: now() });
    store.workspaceMembers.push({ userId, workspaceId, role: 'OWNER' });
    store.portfolios.push({ id: portfolioId, workspaceId, name: 'Portfolio 1', baseCurrency: 'USD', notes: 'Default portfolio created for this account.', createdAt: now(), updatedAt: now() });
    store.accounts.push({ id: accountId, portfolioId, name: 'Growth Ledger', broker: 'Interactive Brokers', accountType: 'Brokerage', currency: 'USD', createdAt: now(), updatedAt: now() });
    store.alerts.push({ id: nanoid(), workspaceId, portfolioId, type: 'DRAWDOWN', severity: 'medium', title: 'Demo alert', message: 'This is a seeded alert for the workspace.', status: 'OPEN', createdAt: now() });
  }
  global.__financeRuntimeBootstrapped = true;
  return store;
}
