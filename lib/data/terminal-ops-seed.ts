import type { AlertsPayload, AssetDetailPayload, MasterDataPayload, SearchPayload, SettingsPayload, TransactionsPayload } from '@/lib/types/terminal-ops';

const searchUniverse = [
  { id: 'sr_1', type: 'security', title: 'NVIDIA Corp.', subtitle: 'NASDAQ · Growth Ledger', href: '/terminal/assets/NVDA', symbol: 'NVDA' },
  { id: 'sr_2', type: 'security', title: 'Apple Inc.', subtitle: 'NASDAQ · Core Equity', href: '/terminal/assets/AAPL', symbol: 'AAPL' },
  { id: 'sr_3', type: 'security', title: 'HDFC Bank', subtitle: 'NSE · India Core', href: '/terminal/assets/HDFCBANK', symbol: 'HDFCBANK' },
  { id: 'sr_4', type: 'page', title: 'Analytics Tables', subtitle: 'Deep portfolio tables', href: '/terminal/analytics' },
  { id: 'sr_5', type: 'page', title: 'Cash Flow & Planning', subtitle: 'Income, goals, liabilities', href: '/terminal/planning' },
  { id: 'sr_6', type: 'account', title: 'Growth Ledger', subtitle: 'Brokerage account', href: '/terminal/master' },
  { id: 'sr_7', type: 'portfolio', title: 'India Core', subtitle: 'Regional mandate portfolio', href: '/terminal/master' },
  { id: 'sr_8', type: 'page', title: 'Transaction Entry', subtitle: 'Post portfolio activity', href: '/terminal/transactions' },
  { id: 'sr_9', type: 'page', title: 'Settings & Controls', subtitle: 'Workspace preferences', href: '/terminal/settings' },
  { id: 'sr_10', type: 'page', title: 'Watchlist & Market Board', subtitle: 'Live market board and idea tracking', href: '/terminal/watchlist' },
  { id: 'sr_11', type: 'page', title: 'Events Calendar', subtitle: 'Earnings, dividends, obligations', href: '/terminal/calendar' },
  { id: 'sr_12', type: 'page', title: 'Rebalancing Center', subtitle: 'Current vs target allocation drift', href: '/terminal/rebalancing' },
  { id: 'sr_13', type: 'page', title: 'Goals Dashboard', subtitle: 'Goal funding and milestones', href: '/terminal/goals' },
  { id: 'sr_14', type: 'page', title: 'Reports Center', subtitle: 'Exports and scheduled report studio', href: '/terminal/reports' },
  { id: 'sr_15', type: 'page', title: 'Portfolio Analytics Studio', subtitle: 'CAGR, XIRR, drawdown, heatmap, attribution', href: '/terminal/portfolio-analytics' },
  { id: 'sr_16', type: 'page', title: 'Security Drill-Down', subtitle: 'Holdings, exposures, risk diagnostics', href: '/terminal/security-drilldown' },
  { id: 'sr_17', type: 'page', title: 'Income Center', subtitle: 'Cash flow, income, liabilities, obligations', href: '/terminal/income-center' },
  { id: 'sr_18', type: 'page', title: 'Ratio Center', subtitle: 'Sharpe, Sortino, alpha, beta, VaR, more', href: '/terminal/ratio-center' },
  { id: 'sr_19', type: 'page', title: 'Tax Center', subtitle: 'Tax lots, harvesting, post-tax analytics', href: '/terminal/tax-center' },
  { id: 'sr_20', type: 'page', title: 'Deep Tables Center', subtitle: 'Holdings master, ledger, lots, attribution, risk, income, liabilities, alerts', href: '/terminal/deep-tables' },
  { id: 'sr_21', type: 'page', title: 'Asset Ratio Page · NVDA', subtitle: 'Security-level ratio library and benchmark diagnostics', href: '/terminal/assets/NVDA' },
  { id: 'sr_22', type: 'page', title: 'Chart Studio', subtitle: 'All charts and graphs coverage layer', href: '/terminal/chart-studio' },
  { id: 'sr_23', type: 'page', title: 'Control Center Dashboard', subtitle: 'Enterprise admin foundation', href: '/control-center' },
  { id: 'sr_24', type: 'page', title: 'Control Center Users', subtitle: 'Users and role administration', href: '/control-center/users' },
  { id: 'sr_25', type: 'page', title: 'Audit Explorer', subtitle: 'Enterprise audit trail and traceability', href: '/control-center/audit-explorer' },
] as const;

export function getSearchPayload(query?: string): SearchPayload {
  const q = (query || '').trim().toLowerCase();
  const results = q
    ? searchUniverse.filter((item) =>
        [item.title, item.subtitle, item.symbol, item.type].filter(Boolean).join(' ').toLowerCase().includes(q)
      )
    : [];

  return {
    results,
    recent: [searchUniverse[14], searchUniverse[19], searchUniverse[17], searchUniverse[18]]
  };
}


type SecurityRatioConfig = {
  absoluteReturn: string;
  benchmarkReturn: string;
  annualizedReturn: string;
  cagr: string;
  xirr: string;
  twr: string;
  rollingReturn: string;
  activeReturn: string;
  roi: string;
  volatility: string;
  downsideDeviation: string;
  beta: string;
  alpha: string;
  trackingError: string;
  correlation: string;
  covariance: string;
  rSquared: string;
  var95: string;
  cvar: string;
  maxDrawdown: string;
  averageDrawdown: string;
  drawdownDuration: string;
  recoveryTime: string;
  skewness: string;
  kurtosis: string;
  sharpe: string;
  sortino: string;
  treynor: string;
  informationRatio: string;
  calmar: string;
  jensenAlpha: string;
  appraisalRatio: string;
  omegaRatio: string;
  dividendYield: string;
  yieldOnCost: string;
  incomeGrowthRate: string;
  dividendConsistency: string;
  interestIncomeRunRate: string;
  realizedTaxByPeriod: string;
  harvestableLosses: string;
  postTaxReturn: string;
  contributionReturn: string;
  contributionRisk: string;
  marginalContributionRisk: string;
  taxStatus: string;
  holdingPeriod: string;
};

function buildSecurityRatioGroups(config: SecurityRatioConfig) {
  return [
    { title: 'Return metrics', items: [
      { label: 'Absolute return', value: config.absoluteReturn, benchmark: config.benchmarkReturn },
      { label: 'Annualized return', value: config.annualizedReturn, benchmark: config.benchmarkReturn },
      { label: 'CAGR', value: config.cagr, benchmark: config.benchmarkReturn },
      { label: 'TWRR', value: config.twr, benchmark: config.benchmarkReturn },
      { label: 'MWRR / XIRR', value: config.xirr, benchmark: 'Money-weighted' },
      { label: 'Rolling return', value: config.rollingReturn, benchmark: config.benchmarkReturn },
      { label: 'Active return', value: config.activeReturn, benchmark: 'vs benchmark' },
      { label: 'Excess over benchmark', value: config.activeReturn, benchmark: 'vs benchmark' },
      { label: 'ROI', value: config.roi }
    ]},
    { title: 'Risk metrics', items: [
      { label: 'Standard deviation', value: config.volatility, benchmark: config.benchmarkReturn },
      { label: 'Downside deviation', value: config.downsideDeviation },
      { label: 'Beta', value: config.beta, benchmark: '1.00' },
      { label: 'Alpha', value: config.alpha },
      { label: 'Tracking error', value: config.trackingError },
      { label: 'Correlation', value: config.correlation },
      { label: 'Covariance', value: config.covariance },
      { label: 'R-squared', value: config.rSquared },
      { label: 'VaR (95%)', value: config.var95 },
      { label: 'CVaR', value: config.cvar },
      { label: 'Max drawdown', value: config.maxDrawdown },
      { label: 'Average drawdown', value: config.averageDrawdown },
      { label: 'Drawdown duration', value: config.drawdownDuration },
      { label: 'Recovery time', value: config.recoveryTime },
      { label: 'Skewness', value: config.skewness },
      { label: 'Kurtosis', value: config.kurtosis }
    ]},
    { title: 'Risk-adjusted ratios', items: [
      { label: 'Sharpe', value: config.sharpe },
      { label: 'Sortino', value: config.sortino },
      { label: 'Treynor', value: config.treynor },
      { label: 'Information ratio', value: config.informationRatio },
      { label: 'Calmar', value: config.calmar },
      { label: 'Jensen alpha', value: config.jensenAlpha },
      { label: 'Appraisal ratio', value: config.appraisalRatio },
      { label: 'Omega ratio', value: config.omegaRatio }
    ]},
    { title: 'Income / tax / contribution', items: [
      { label: 'Dividend yield', value: config.dividendYield },
      { label: 'Yield on cost', value: config.yieldOnCost },
      { label: 'Income growth rate', value: config.incomeGrowthRate },
      { label: 'Dividend consistency', value: config.dividendConsistency },
      { label: 'Interest income run rate', value: config.interestIncomeRunRate },
      { label: 'Realized tax by period', value: config.realizedTaxByPeriod },
      { label: 'Harvestable losses', value: config.harvestableLosses },
      { label: 'Post-tax return', value: config.postTaxReturn },
      { label: 'Contribution to return', value: config.contributionReturn },
      { label: 'Contribution to risk', value: config.contributionRisk },
      { label: 'Marginal contribution to risk', value: config.marginalContributionRisk },
      { label: 'Tax status', value: config.taxStatus },
      { label: 'Holding period', value: config.holdingPeriod }
    ]}
  ];
}

const assets: Record<string, AssetDetailPayload> = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    exchange: 'NASDAQ',
    price: '$1,122.40',
    change: '+2.96%',
    positive: true,
    description: 'High-conviction semiconductor and AI infrastructure holding with a dominant contribution to portfolio growth and risk.',
    tags: ['AI infrastructure', 'Mega-cap growth', 'Core alpha'],
    stats: [
      { label: 'Position value', value: '$408,220', change: '+$11,760', tone: 'up' },
      { label: 'Portfolio weight', value: '8.4%', change: '+1.7% drift', tone: 'down' },
      { label: 'Unrealized gain', value: '+34.8%', change: '+4.2 pts MTD', tone: 'up' },
      { label: 'Beta', value: '1.22', change: 'High', tone: 'flat' },
      { label: 'Dividend yield', value: '0.03%', change: 'Nominal', tone: 'flat' },
      { label: 'Thesis score', value: '8.9 / 10', change: 'Maintained', tone: 'up' }
    ],
    priceHistory: [
      { month: 'Jan', price: 720, benchmark: 100 },
      { month: 'Feb', price: 742, benchmark: 101 },
      { month: 'Mar', price: 801, benchmark: 104 },
      { month: 'Apr', price: 786, benchmark: 102 },
      { month: 'May', price: 828, benchmark: 106 },
      { month: 'Jun', price: 872, benchmark: 108 },
      { month: 'Jul', price: 910, benchmark: 109 },
      { month: 'Aug', price: 944, benchmark: 111 },
      { month: 'Sep', price: 968, benchmark: 110 },
      { month: 'Oct', price: 1005, benchmark: 114 },
      { month: 'Nov', price: 1062, benchmark: 117 },
      { month: 'Dec', price: 1122, benchmark: 119 }
    ],
    exposure: [
      { name: 'Growth sleeve', value: 54 },
      { name: 'US tech', value: 24 },
      { name: 'AI infra theme', value: 14 },
      { name: 'Other', value: 8 }
    ],
    trades: [
      { date: '18 Apr 2026', type: 'Buy', account: 'Growth Ledger', quantity: '12 sh', price: '$1,086.00', amount: '$13,032' },
      { date: '14 Mar 2026', type: 'Buy', account: 'Growth Ledger', quantity: '8 sh', price: '$1,012.20', amount: '$8,097.60' },
      { date: '09 Jan 2026', type: 'Buy', account: 'Growth Ledger', quantity: '10 sh', price: '$888.40', amount: '$8,884' },
      { date: '11 Dec 2025', type: 'Rebalance trim', account: 'Growth Ledger', quantity: '4 sh', price: '$924.60', amount: '$3,698.40' }
    ],
    notes: [
      { title: 'Core thesis', body: 'Continue to treat this as the highest-conviction AI infrastructure name, with trim discipline only if concentration moves beyond the policy range.' },
      { title: 'Risk watch', body: 'Primary risk remains expectation compression after outsized performance. Correlation to broader growth sleeve is elevated.' },
      { title: 'Action bias', body: 'Prefer scaling through planned staged entries instead of momentum chasing after headline rallies.' }
    ],
    benchmark: [
      { metric: '1Y return', asset: '+58.2%', benchmark: '+19.1%' },
      { metric: 'Volatility', asset: '28.4%', benchmark: '14.8%' },
      { metric: 'Max drawdown', asset: '-16.1%', benchmark: '-8.6%' },
      { metric: 'Contribution', asset: '+4.8 pts', benchmark: '—' }
    ],
    income: [
      { date: '28 Mar 2026', type: 'Dividend', amount: '$6.20', note: 'Quarterly cash dividend' },
      { date: '27 Dec 2025', type: 'Dividend', amount: '$5.84', note: 'Quarterly cash dividend' }
    ],
    ratioGroups: buildSecurityRatioGroups({
      absoluteReturn: '+58.2%', benchmarkReturn: '+19.1%', annualizedReturn: '+58.2%', cagr: '+58.2%', xirr: '+61.4%', twr: '+56.0%', rollingReturn: '+27.8%', activeReturn: '+39.1%', roi: '+74.4%',
      volatility: '28.4%', downsideDeviation: '18.6%', beta: '1.22', alpha: '8.4%', trackingError: '11.8%', correlation: '0.71', covariance: '0.026', rSquared: '0.68', var95: '-6.9%', cvar: '-9.8%', maxDrawdown: '-16.1%', averageDrawdown: '-5.4%', drawdownDuration: '38 days', recoveryTime: '27 days', skewness: '-0.22', kurtosis: '3.44',
      sharpe: '1.41', sortino: '2.05', treynor: '47.7', informationRatio: '1.18', calmar: '3.61', jensenAlpha: '8.4%', appraisalRatio: '0.92', omegaRatio: '1.48',
      dividendYield: '0.03%', yieldOnCost: '0.04%', incomeGrowthRate: '3.0%', dividendConsistency: '6 / 10', interestIncomeRunRate: '$0 / mo', realizedTaxByPeriod: '$1.1K', harvestableLosses: '$0', postTaxReturn: '+55.9%', contributionReturn: '+4.8 pts', contributionRisk: '13.4%', marginalContributionRisk: '1.84%', taxStatus: 'Mixed lots', holdingPeriod: 'Blend of STCG/LTCG'
    })
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    price: '$214.90',
    change: '+1.24%',
    positive: true,
    description: 'Large-cap quality compounder used as a stabilizing growth anchor within the core equity sleeve.',
    tags: ['Quality', 'Mega-cap core', 'Cashflow compounder'],
    stats: [
      { label: 'Position value', value: '$345,900', change: '+$4,240', tone: 'up' },
      { label: 'Portfolio weight', value: '7.1%', change: '+0.6% drift', tone: 'flat' },
      { label: 'Unrealized gain', value: '+22.1%', change: '+1.3 pts MTD', tone: 'up' },
      { label: 'Beta', value: '0.94', change: 'Contained', tone: 'up' },
      { label: 'Dividend yield', value: '0.49%', change: 'Steady', tone: 'flat' },
      { label: 'Thesis score', value: '8.1 / 10', change: 'Maintained', tone: 'up' }
    ],
    priceHistory: [
      { month: 'Jan', price: 172, benchmark: 100 },
      { month: 'Feb', price: 174, benchmark: 102 },
      { month: 'Mar', price: 178, benchmark: 103 },
      { month: 'Apr', price: 181, benchmark: 103 },
      { month: 'May', price: 184, benchmark: 105 },
      { month: 'Jun', price: 189, benchmark: 106 },
      { month: 'Jul', price: 194, benchmark: 107 },
      { month: 'Aug', price: 199, benchmark: 108 },
      { month: 'Sep', price: 202, benchmark: 109 },
      { month: 'Oct', price: 205, benchmark: 111 },
      { month: 'Nov', price: 210, benchmark: 113 },
      { month: 'Dec', price: 215, benchmark: 115 }
    ],
    exposure: [
      { name: 'Core equity', value: 62 },
      { name: 'US mega-cap', value: 24 },
      { name: 'Quality', value: 10 },
      { name: 'Other', value: 4 }
    ],
    trades: [
      { date: '21 Apr 2026', type: 'Buy', account: 'Core Equity', quantity: '280 sh', price: '$210.40', amount: '$58,912' },
      { date: '03 Feb 2026', type: 'Buy', account: 'Core Equity', quantity: '160 sh', price: '$188.80', amount: '$30,208' }
    ],
    notes: [
      { title: 'Portfolio role', body: 'Acts as a lower-beta anchor within the broader growth allocation.' },
      { title: 'Capital discipline', body: 'Prefer accumulating on wide pullbacks rather than adding at stretched multiples.' }
    ],
    benchmark: [
      { metric: '1Y return', asset: '+22.1%', benchmark: '+15.8%' },
      { metric: 'Volatility', asset: '19.2%', benchmark: '14.8%' },
      { metric: 'Max drawdown', asset: '-10.8%', benchmark: '-8.6%' },
      { metric: 'Contribution', asset: '+1.9 pts', benchmark: '—' }
    ],
    income: [{ date: '08 Feb 2026', type: 'Dividend', amount: '$186.40', note: 'Quarterly distribution' }],
    ratioGroups: buildSecurityRatioGroups({
      absoluteReturn: '+22.1%', benchmarkReturn: '+15.8%', annualizedReturn: '+22.1%', cagr: '+22.1%', xirr: '+24.2%', twr: '+21.0%', rollingReturn: '+11.2%', activeReturn: '+6.3%', roi: '+27.0%',
      volatility: '19.2%', downsideDeviation: '12.2%', beta: '0.94', alpha: '1.8%', trackingError: '4.4%', correlation: '0.76', covariance: '0.018', rSquared: '0.73', var95: '-4.2%', cvar: '-6.1%', maxDrawdown: '-10.8%', averageDrawdown: '-3.8%', drawdownDuration: '31 days', recoveryTime: '24 days', skewness: '-0.14', kurtosis: '2.98',
      sharpe: '1.12', sortino: '1.66', treynor: '23.5', informationRatio: '0.44', calmar: '2.05', jensenAlpha: '1.8%', appraisalRatio: '0.38', omegaRatio: '1.26',
      dividendYield: '0.49%', yieldOnCost: '0.60%', incomeGrowthRate: '5.2%', dividendConsistency: '9 / 10', interestIncomeRunRate: '$0 / mo', realizedTaxByPeriod: '$0.7K', harvestableLosses: '$0', postTaxReturn: '+20.4%', contributionReturn: '+1.9 pts', contributionRisk: '8.6%', marginalContributionRisk: '0.94%', taxStatus: 'LTCG leaning', holdingPeriod: 'Core compounding position'
    })
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    exchange: 'NSE',
    price: '₹1,756.30',
    change: '+0.82%',
    positive: true,
    description: 'Core India banking exposure used for quality financials participation and portfolio diversification.',
    tags: ['India core', 'Financials', 'Quality banking'],
    stats: [
      { label: 'Position value', value: '$262,440', change: '+$2,180', tone: 'up' },
      { label: 'Portfolio weight', value: '5.4%', change: '-0.3% drift', tone: 'up' },
      { label: 'Unrealized gain', value: '+12.3%', change: '+0.8 pts MTD', tone: 'up' },
      { label: 'Beta', value: '0.86', change: 'Balanced', tone: 'up' },
      { label: 'Dividend yield', value: '1.2%', change: 'Healthy', tone: 'up' },
      { label: 'Thesis score', value: '7.8 / 10', change: 'Maintained', tone: 'flat' }
    ],
    priceHistory: [
      { month: 'Jan', price: 1560, benchmark: 100 },
      { month: 'Feb', price: 1582, benchmark: 101 },
      { month: 'Mar', price: 1590, benchmark: 102 },
      { month: 'Apr', price: 1618, benchmark: 103 },
      { month: 'May', price: 1650, benchmark: 104 },
      { month: 'Jun', price: 1672, benchmark: 104 },
      { month: 'Jul', price: 1688, benchmark: 106 },
      { month: 'Aug', price: 1704, benchmark: 107 },
      { month: 'Sep', price: 1716, benchmark: 108 },
      { month: 'Oct', price: 1730, benchmark: 109 },
      { month: 'Nov', price: 1741, benchmark: 110 },
      { month: 'Dec', price: 1756, benchmark: 112 }
    ],
    exposure: [
      { name: 'India core', value: 66 },
      { name: 'Financials', value: 21 },
      { name: 'Defensive growth', value: 9 },
      { name: 'Other', value: 4 }
    ],
    trades: [
      { date: '16 Apr 2026', type: 'Buy', account: 'India Core', quantity: '450 sh', price: '₹1,722', amount: '₹774,900' },
      { date: '07 Jan 2026', type: 'Buy', account: 'India Core', quantity: '220 sh', price: '₹1,648', amount: '₹362,560' }
    ],
    notes: [
      { title: 'Portfolio role', body: 'Quality India financials anchor with lower balance-sheet stress than cyclical peers.' },
      { title: 'Watchlist', body: 'Track deposit growth resilience and net interest margin trends.' }
    ],
    benchmark: [
      { metric: '1Y return', asset: '+12.3%', benchmark: '+9.6%' },
      { metric: 'Volatility', asset: '15.8%', benchmark: '13.9%' },
      { metric: 'Max drawdown', asset: '-8.2%', benchmark: '-7.1%' },
      { metric: 'Contribution', asset: '+0.9 pts', benchmark: '—' }
    ],
    income: [{ date: '18 Jun 2025', type: 'Dividend', amount: '₹6,460', note: 'Annual dividend' }],
    ratioGroups: buildSecurityRatioGroups({
      absoluteReturn: '+12.3%', benchmarkReturn: '+9.6%', annualizedReturn: '+12.3%', cagr: '+12.3%', xirr: '+13.8%', twr: '+11.9%', rollingReturn: '+8.1%', activeReturn: '+2.7%', roi: '+14.5%',
      volatility: '15.8%', downsideDeviation: '10.1%', beta: '0.86', alpha: '1.1%', trackingError: '3.1%', correlation: '0.49', covariance: '0.011', rSquared: '0.52', var95: '-3.1%', cvar: '-4.7%', maxDrawdown: '-8.2%', averageDrawdown: '-2.9%', drawdownDuration: '26 days', recoveryTime: '20 days', skewness: '0.08', kurtosis: '2.42',
      sharpe: '0.94', sortino: '1.38', treynor: '14.3', informationRatio: '0.26', calmar: '1.50', jensenAlpha: '1.1%', appraisalRatio: '0.22', omegaRatio: '1.19',
      dividendYield: '1.20%', yieldOnCost: '1.35%', incomeGrowthRate: '7.1%', dividendConsistency: '8 / 10', interestIncomeRunRate: '$0 / mo', realizedTaxByPeriod: '$0.2K', harvestableLosses: '$0', postTaxReturn: '+11.2%', contributionReturn: '+0.9 pts', contributionRisk: '5.4%', marginalContributionRisk: '0.61%', taxStatus: 'LTCG', holdingPeriod: 'Long core India position'
    })
  }
};

export function getAssetDetail(symbol: string): AssetDetailPayload {
  const normalized = symbol.toUpperCase();
  return assets[normalized] || assets.NVDA;
}

export const transactionsSeed: TransactionsPayload = {
  options: {
    accounts: ['Growth Ledger', 'Core Equity', 'India Core', 'Treasury'],
    brokers: ['Interactive Brokers', 'Charles Schwab', 'Axis Bank', 'Zerodha'],
    transactionTypes: ['Buy', 'Sell', 'Dividend', 'Interest', 'Fee', 'Tax', 'Deposit', 'Withdrawal', 'Transfer', 'Split', 'Bonus'],
    securities: [
      { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', assetClass: 'Equity', currency: 'USD' },
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', assetClass: 'Equity', currency: 'USD' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', assetClass: 'Equity', currency: 'INR' },
      { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', exchange: 'NYSEARCA', assetClass: 'ETF', currency: 'USD' },
      { symbol: 'GOLD ETF', name: 'Gold ETF', exchange: 'NSE', assetClass: 'Commodity', currency: 'INR' },
      { symbol: 'CASH', name: 'Cash Reserve', exchange: 'Internal', assetClass: 'Cash', currency: 'USD' }
    ],
    currencies: ['USD', 'INR', 'EUR'],
    strategies: ['Core', 'Growth', 'Income', 'Tactical', 'Hedge'],
    benchmarks: ['S&P 500', 'NASDAQ 100', 'NIFTY 50', 'Bloomberg Agg'],
    assetClasses: ['Equity', 'ETF', 'Mutual Fund', 'Bond', 'Commodity', 'Cash'],
    regions: ['US', 'India', 'Global', 'Europe', 'Asia ex-Japan']
  },
  suggestedDefaults: {
    account: 'Growth Ledger',
    broker: 'Interactive Brokers',
    currency: 'USD',
    transactionType: 'Buy',
    strategy: 'Core',
    region: 'US'
  },
  recent: [
    { id: 'tx_1', date: '21 Apr 2026', type: 'Buy', security: 'AAPL', portfolio: 'Portfolio 1', account: 'Core Equity', amount: '$62,400', status: 'Settled' },
    { id: 'tx_2', date: '20 Apr 2026', type: 'Dividend', security: 'SCHD', portfolio: 'Portfolio 1', account: 'Income Sleeve', amount: '$4,120', status: 'Booked' },
    { id: 'tx_3', date: '19 Apr 2026', type: 'Sell', security: 'NVDA', portfolio: 'Portfolio 1', account: 'Growth Ledger', amount: '$21,680', status: 'Settled' },
    { id: 'tx_4', date: '18 Apr 2026', type: 'Deposit', security: 'CASH', portfolio: 'Portfolio 1', account: 'Treasury', amount: '$15,000', status: 'Completed' }
  ],
  templates: [
    { title: 'Equity purchase', subtitle: 'Capture broker, strategy, settlement, and cost details for a new buy.' },
    { title: 'Income booking', subtitle: 'Post dividends, interest, and passive-income cashflow with tax fields.' },
    { title: 'Cash movement', subtitle: 'Track deposits, withdrawals, and internal transfers across accounts.' }
  ]
};

export const alertsSeed: AlertsPayload = {
  headline: 'Risk, cash, and activity alerts in one operational surface.',
  unread: 7,
  items: [
    { id: 'al_1', title: 'NVDA concentration above policy band', detail: 'Single-name exposure is 1.7% above the preferred ceiling after the latest rally.', severity: 'high', area: 'Risk Center', action: 'Review asset page' },
    { id: 'al_2', title: '2 unsettled broker references', detail: 'Recent transfers in Treasury do not yet have broker confirmation IDs.', severity: 'medium', area: 'Transactions', action: 'Open transaction entry' },
    { id: 'al_3', title: 'Cash reserve below preferred runway', detail: 'Runway slipped below the 6-month target after April deployment.', severity: 'medium', area: 'Planning', action: 'Open cash planning' },
    { id: 'al_4', title: 'Watchlist trigger near entry band', detail: 'HDFC Bank is near the preferred accumulation zone from the India sleeve plan.', severity: 'low', area: 'Research', action: 'Review watchlist' },
    { id: 'al_5', title: 'Upcoming SIP batch tomorrow', detail: 'Core index fund SIP batch is scheduled for the first business day.', severity: 'low', area: 'Planning', action: 'Review obligations' }
  ]
};

export const masterDataSeed: MasterDataPayload = {
  portfolios: [
    { name: 'Core Multi-Asset', base: 'USD', mandate: 'Balanced global wealth compounder', value: '$2.18M' },
    { name: 'Growth Sleeve', base: 'USD', mandate: 'High-conviction growth and innovation', value: '$812K' },
    { name: 'India Core', base: 'INR', mandate: 'India quality and compounding exposure', value: '$524K' }
  ],
  accounts: [
    { name: 'Growth Ledger', broker: 'Interactive Brokers', type: 'Brokerage', value: '$812K' },
    { name: 'Core Equity', broker: 'Charles Schwab', type: 'Brokerage', value: '$966K' },
    { name: 'Treasury', broker: 'Axis Bank', type: 'Cash / Banking', value: '$146K' }
  ],
  securities: [
    { symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'Equity', region: 'US', benchmark: 'NASDAQ 100' },
    { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'Equity', region: 'US', benchmark: 'S&P 500' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', assetClass: 'Equity', region: 'India', benchmark: 'NIFTY 50' },
    { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', assetClass: 'ETF', region: 'US', benchmark: 'DJ US Dividend 100' }
  ],
  watchlist: [
    { symbol: 'MSFT', name: 'Microsoft', trigger: 'Add on 6% pullback', thesis: 'Cloud + AI quality compounder' },
    { symbol: 'TSM', name: 'Taiwan Semi', trigger: 'Review after earnings', thesis: 'Foundry leverage to AI cycle' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', trigger: 'Scale in on valuation reset', thesis: 'India financials alternate' }
  ],
  benchmarks: [
    { name: 'S&P 500', scope: 'US large-cap equity', code: 'SPX' },
    { name: 'NASDAQ 100', scope: 'US growth equity', code: 'NDX' },
    { name: 'NIFTY 50', scope: 'India broad market', code: 'NIFTY50' },
    { name: 'Bloomberg Agg', scope: 'Global fixed income', code: 'LEGATRUU' }
  ]
};

export const settingsSeed: SettingsPayload = {
  profile: {
    name: 'Aurelius Demo',
    email: 'demo@aurelius.finance',
    role: 'Portfolio Owner',
    workspace: 'Aurelius Private Capital'
  },
  preferences: [
    { label: 'Theme', value: 'Light terminal', description: 'Bright luxury terminal surface with soft glass layers.' },
    { label: 'Density', value: 'Comfortable compact', description: 'Dense enough for finance work, still relaxed for long sessions.' },
    { label: 'Default landing page', value: 'Executive Overview', description: 'Open directly into the daily command center.' },
    { label: 'Ticker cadence', value: 'Live-style marquee', description: 'Continuous market strip visible across terminal pages.' }
  ],
  security: [
    { label: 'Two-step verification', value: 'Enabled for critical actions' },
    { label: 'Session policy', value: 'Auto-expire inactive sessions after 7 days' },
    { label: 'Login audit retention', value: '30-day rolling retention' }
  ],
  sessions: [
    { device: 'Windows Desktop · Chrome', location: 'Rajkot, IN', seen: 'Active now', status: 'Current' },
    { device: 'iPhone · Safari', location: 'Rajkot, IN', seen: 'Yesterday, 21:14', status: 'Recent' },
    { device: 'MacBook · Edge', location: 'Mumbai, IN', seen: '5 days ago', status: 'Expired soon' }
  ]
};
