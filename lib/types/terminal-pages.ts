export type KPIItem = {
  label: string;
  value: string;
  change: string;
  tone: 'up' | 'down' | 'flat';
};

export type PerformancePayload = {
  kpis: KPIItem[];
  trend: { month: string; portfolio: number; benchmark: number }[];
  rolling: { month: string; oneMonth: number; threeMonth: number; sixMonth: number }[];
  attribution: { sleeve: string; contribution: number }[];
  heatmap: { year: string; months: { label: string; value: number }[] }[];
  beats: { title: string; detail: string }[];
};

export type AnalyticsPayload = {
  kpis: KPIItem[];
  holdings: {
    security: string;
    account: string;
    weight: string;
    marketValue: string;
    dayChange: string;
    totalReturn: string;
    risk: string;
    drift: string;
  }[];
  transactions: {
    date: string;
    type: string;
    security: string;
    account: string;
    amount: string;
    status: string;
  }[];
  taxLots: {
    security: string;
    lotDate: string;
    remaining: string;
    costBasis: string;
    gain: string;
    taxClass: string;
  }[];
  alerts: {
    title: string;
    detail: string;
    severity: 'high' | 'medium' | 'low';
  }[];
};

export type RiskPayload = {
  kpis: KPIItem[];
  allocation: { name: string; value: number }[];
  sectorExposure: { name: string; value: number }[];
  factorExposure: { factor: string; value: number }[];
  correlation: {
    labels: string[];
    matrix: number[][];
  };
  scenarios: {
    scenario: string;
    impact: string;
    note: string;
  }[];
  alerts: { title: string; detail: string }[];
};

export type PlanningPayload = {
  kpis: KPIItem[];
  cashflow: { month: string; income: number; expenses: number; invested: number }[];
  goals: {
    title: string;
    target: string;
    current: string;
    funded: number;
    due: string;
  }[];
  liabilities: {
    lender: string;
    outstanding: string;
    rate: string;
    emi: string;
    tenure: string;
  }[];
  passiveIncome: { month: string; dividends: number; interest: number; rent: number }[];
  upcoming: { title: string; amount: string; due: string; status: string }[];
};
