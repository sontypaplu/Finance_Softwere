export type SearchResultItem = {
  id: string;
  type: 'security' | 'page' | 'account' | 'portfolio';
  title: string;
  subtitle: string;
  href: string;
  symbol?: string;
};

export type SearchPayload = {
  results: SearchResultItem[];
  recent: SearchResultItem[];
};

export type AssetSummaryCard = {
  label: string;
  value: string;
  change?: string;
  tone?: 'up' | 'down' | 'flat';
};

export type AssetTradeRow = {
  date: string;
  type: string;
  account: string;
  quantity: string;
  price: string;
  amount: string;
};

export type AssetIncomeRow = {
  date: string;
  type: string;
  amount: string;
  note: string;
};

export type AssetRatioItem = {
  label: string;
  value: string;
  benchmark?: string;
  note?: string;
};

export type AssetRatioGroup = {
  title: string;
  items: AssetRatioItem[];
};

export type AssetDetailPayload = {
  symbol: string;
  name: string;
  exchange: string;
  price: string;
  change: string;
  positive: boolean;
  description: string;
  tags: string[];
  stats: AssetSummaryCard[];
  priceHistory: { month: string; price: number; benchmark: number }[];
  exposure: { name: string; value: number }[];
  trades: AssetTradeRow[];
  notes: { title: string; body: string }[];
  benchmark: { metric: string; asset: string; benchmark: string }[];
  income: AssetIncomeRow[];
  ratioGroups: AssetRatioGroup[];
};

export type SecurityOption = {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: string;
  currency: string;
};

export type NewSecurityInput = {
  symbol: string;
  name: string;
  isin: string;
  exchange: string;
  assetClass: string;
  sector: string;
  region: string;
  currency: string;
  benchmark: string;
  notes: string;
};

export type TransactionFormOptions = {
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

export type TransactionRecentRow = {
  id: string;
  date: string;
  type: string;
  security: string;
  portfolio: string;
  account: string;
  amount: string;
  status: string;
};

export type TransactionsPayload = {
  options: TransactionFormOptions;
  suggestedDefaults: {
    account: string;
    broker: string;
    currency: string;
    transactionType: string;
    strategy: string;
    region: string;
  };
  recent: TransactionRecentRow[];
  templates: { title: string; subtitle: string }[];
};

export type AlertItem = {
  id: string;
  title: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
  area: string;
  action: string;
};

export type AlertsPayload = {
  headline: string;
  unread: number;
  items: AlertItem[];
};

export type MasterDataPayload = {
  portfolios: { name: string; base: string; mandate: string; value: string }[];
  accounts: { name: string; broker: string; type: string; value: string }[];
  securities: { symbol: string; name: string; assetClass: string; region: string; benchmark: string }[];
  watchlist: { symbol: string; name: string; trigger: string; thesis: string }[];
  benchmarks: { name: string; scope: string; code: string }[];
};

export type SettingsPayload = {
  profile: {
    name: string;
    email: string;
    role: string;
    workspace: string;
  };
  preferences: { label: string; value: string; description: string }[];
  security: { label: string; value: string }[];
  sessions: { device: string; location: string; seen: string; status: string }[];
};
