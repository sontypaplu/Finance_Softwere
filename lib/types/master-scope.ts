import type { KPIItem } from '@/lib/types/terminal-pages';

export type PortfolioAnalyticsPayload = {
  kpis: KPIItem[];
  cumulative: { month: string; portfolio: number; benchmark: number }[];
  drawdown: { month: string; portfolio: number; benchmark: number }[];
  rollingRisk: { month: string; volatility: number; sharpe: number; sortino: number }[];
  contributors: { name: string; contribution: number }[];
  treemap: { name: string; size: number }[];
  heatmap: { year: string; months: { label: string; value: number }[] }[];
  scorecards: { label: string; portfolio: string; benchmark: string; note: string }[];
};

export type SecurityDrilldownPayload = {
  kpis: KPIItem[];
  holdingsCore: { security: string; account: string; assetClass: string; sector: string; geography: string; weight: string; marketValue: string; unrealized: string; dividendYield: string }[];
  riskSnapshot: { security: string; beta: number; volatility: number; sharpe: number; sortino: number; drawdown: number; contributionRisk: number }[];
  exposureSector: { name: string; value: number }[];
  exposureGeo: { name: string; value: number }[];
  topMovers: { security: string; return: string; income: string; thesis: string }[];
  rebalance: { security: string; current: string; target: string; gap: string; action: string }[];
};

export type IncomeCenterPayload = {
  kpis: KPIItem[];
  monthlyFlow: { month: string; income: number; expenses: number; invested: number }[];
  passiveMix: { month: string; dividends: number; interest: number; rent: number }[];
  incomeSources: { name: string; value: number }[];
  liabilities: { lender: string; outstanding: string; rate: string; emi: string; tenure: string; coverage: string }[];
  obligations: { title: string; due: string; amount: string; type: string; status: string }[];
  freeCashflow: { month: string; value: number }[];
};

export type RatioGroup = { title: string; items: { label: string; value: string; benchmark?: string; note?: string }[] };

export type RatioCenterPayload = {
  hero: KPIItem[];
  groups: RatioGroup[];
  radar: { subject: string; portfolio: number; benchmark: number }[];
  scatter: { name: string; risk: number; return: number; size: number }[];
  factorExposure: { name: string; value: number }[];
};

export type TaxCenterPayload = {
  kpis: KPIItem[];
  summary: { title: string; value: string; detail: string }[];
  realizedVsUnrealized: { label: string; realized: number; unrealized: number }[];
  lots: { security: string; lotDate: string; quantity: string; costBasis: string; currentValue: string; gain: string; term: string; harvest: string }[];
  taxes: { bucket: string; amount: string; rate: string; note: string }[];
  harvesting: { security: string; loss: string; washSale: string; action: string }[];
};
