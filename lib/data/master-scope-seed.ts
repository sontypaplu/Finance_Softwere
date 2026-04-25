import type { IncomeCenterPayload, PortfolioAnalyticsPayload, RatioCenterPayload, SecurityDrilldownPayload, TaxCenterPayload } from '@/lib/types/master-scope';

export const portfolioAnalyticsSeed: PortfolioAnalyticsPayload = {
  kpis: [
    { label: 'CAGR', value: '18.6%', change: '+2.1 pts vs target', tone: 'up' },
    { label: 'XIRR', value: '21.4%', change: '+3.8 pts YTD', tone: 'up' },
    { label: 'TWR', value: '16.8%', change: '+2.4 pts vs benchmark', tone: 'up' },
    { label: 'Volatility', value: '11.9%', change: '-0.4 pts', tone: 'up' },
    { label: 'Sharpe', value: '1.42', change: '+0.18', tone: 'up' },
    { label: 'Sortino', value: '2.08', change: '+0.26', tone: 'up' }
  ],
  cumulative: [
    { month: 'Jan', portfolio: 100, benchmark: 100 },
    { month: 'Feb', portfolio: 102, benchmark: 101 },
    { month: 'Mar', portfolio: 104, benchmark: 102 },
    { month: 'Apr', portfolio: 103, benchmark: 101 },
    { month: 'May', portfolio: 106, benchmark: 103 },
    { month: 'Jun', portfolio: 108, benchmark: 104 },
    { month: 'Jul', portfolio: 111, benchmark: 106 },
    { month: 'Aug', portfolio: 114, benchmark: 108 },
    { month: 'Sep', portfolio: 116, benchmark: 109 },
    { month: 'Oct', portfolio: 119, benchmark: 111 },
    { month: 'Nov', portfolio: 121, benchmark: 112 },
    { month: 'Dec', portfolio: 124, benchmark: 114 }
  ],
  drawdown: [
    { month: 'Jan', portfolio: 0, benchmark: 0 },
    { month: 'Feb', portfolio: -1.2, benchmark: -0.8 },
    { month: 'Mar', portfolio: -2.3, benchmark: -1.6 },
    { month: 'Apr', portfolio: -4.4, benchmark: -3.2 },
    { month: 'May', portfolio: -2.8, benchmark: -2.1 },
    { month: 'Jun', portfolio: -1.1, benchmark: -0.9 },
    { month: 'Jul', portfolio: -2.2, benchmark: -1.7 },
    { month: 'Aug', portfolio: -3.1, benchmark: -2.5 },
    { month: 'Sep', portfolio: -1.4, benchmark: -1.2 },
    { month: 'Oct', portfolio: -0.7, benchmark: -0.6 },
    { month: 'Nov', portfolio: -1.6, benchmark: -1.1 },
    { month: 'Dec', portfolio: -0.4, benchmark: -0.2 }
  ],
  rollingRisk: [
    { month: 'Jan', volatility: 12.1, sharpe: 1.22, sortino: 1.74 },
    { month: 'Feb', volatility: 11.8, sharpe: 1.24, sortino: 1.78 },
    { month: 'Mar', volatility: 12.6, sharpe: 1.19, sortino: 1.71 },
    { month: 'Apr', volatility: 13.2, sharpe: 1.08, sortino: 1.54 },
    { month: 'May', volatility: 12.4, sharpe: 1.26, sortino: 1.84 },
    { month: 'Jun', volatility: 12.0, sharpe: 1.31, sortino: 1.91 },
    { month: 'Jul', volatility: 11.7, sharpe: 1.34, sortino: 1.96 },
    { month: 'Aug', volatility: 11.9, sharpe: 1.36, sortino: 1.99 },
    { month: 'Sep', volatility: 12.2, sharpe: 1.33, sortino: 1.95 },
    { month: 'Oct', volatility: 12.0, sharpe: 1.39, sortino: 2.03 },
    { month: 'Nov', volatility: 11.8, sharpe: 1.41, sortino: 2.06 },
    { month: 'Dec', volatility: 11.9, sharpe: 1.42, sortino: 2.08 }
  ],
  contributors: [
    { name: 'US Growth', contribution: 4.8 },
    { name: 'India Core', contribution: 2.2 },
    { name: 'Dividend Income', contribution: 1.3 },
    { name: 'Gold Hedge', contribution: 0.6 },
    { name: 'FX Overlay', contribution: -0.2 }
  ],
  treemap: [
    { name: 'US Equity', size: 34 },
    { name: 'India Equity', size: 16 },
    { name: 'Global ETFs', size: 14 },
    { name: 'Fixed Income', size: 11 },
    { name: 'Cash', size: 9 },
    { name: 'Gold', size: 8 },
    { name: 'REITs', size: 5 },
    { name: 'Other', size: 3 }
  ],
  heatmap: [
    { year: '2025', months: [{ label:'Jan', value:1.6 },{ label:'Feb', value:0.8 },{ label:'Mar', value:-1.4 },{ label:'Apr', value:2.2 },{ label:'May', value:1.5 },{ label:'Jun', value:0.9 },{ label:'Jul', value:2.4 },{ label:'Aug', value:1.2 },{ label:'Sep', value:-0.6 },{ label:'Oct', value:1.1 },{ label:'Nov', value:2.6 },{ label:'Dec', value:1.9 }] },
    { year: '2026', months: [{ label:'Jan', value:1.2 },{ label:'Feb', value:0.4 },{ label:'Mar', value:-0.8 },{ label:'Apr', value:1.8 },{ label:'May', value:1.1 },{ label:'Jun', value:1.4 },{ label:'Jul', value:2.1 },{ label:'Aug', value:1.0 },{ label:'Sep', value:0.7 },{ label:'Oct', value:1.8 },{ label:'Nov', value:1.3 },{ label:'Dec', value:0.9 }] }
  ],
  scorecards: [
    { label: 'Annualized return', portfolio: '18.6%', benchmark: '14.1%', note: 'Outperformance sustained across 3Y and 5Y windows.' },
    { label: 'Max drawdown', portfolio: '-9.4%', benchmark: '-11.8%', note: 'Drawdown discipline remains better than blended benchmark.' },
    { label: 'Alpha', portfolio: '+3.1%', benchmark: '—', note: 'Positive alpha with moderate beta exposure.' },
    { label: 'Information ratio', portfolio: '0.74', benchmark: '—', note: 'Consistent active return delivery.' }
  ]
};

export const securityDrilldownSeed: SecurityDrilldownPayload = {
  kpis: [
    { label: 'Holdings', value: '42', change: '+3 this year', tone: 'up' },
    { label: 'Top 10 concentration', value: '48.2%', change: '-1.1 pts', tone: 'up' },
    { label: 'Income yield', value: '2.6%', change: '+0.3 pts', tone: 'up' },
    { label: 'Avg beta', value: '0.96', change: 'Balanced', tone: 'flat' },
    { label: 'Avg Sharpe', value: '1.18', change: '+0.06', tone: 'up' },
    { label: 'Rebalance gap', value: '4.8%', change: 'Needs action', tone: 'down' }
  ],
  holdingsCore: [
    { security: 'NVDA', account: 'Growth Ledger', assetClass: 'Equity', sector: 'Technology', geography: 'US', weight: '8.4%', marketValue: '$408,220', unrealized: '+34.8%', dividendYield: '0.03%' },
    { security: 'AAPL', account: 'Core Equity', assetClass: 'Equity', sector: 'Technology', geography: 'US', weight: '7.1%', marketValue: '$345,900', unrealized: '+22.1%', dividendYield: '0.49%' },
    { security: 'HDFCBANK', account: 'India Core', assetClass: 'Equity', sector: 'Financials', geography: 'India', weight: '5.4%', marketValue: '$262,440', unrealized: '+12.3%', dividendYield: '1.20%' },
    { security: 'SCHD', account: 'Income Sleeve', assetClass: 'ETF', sector: 'Dividend Equity', geography: 'US', weight: '4.2%', marketValue: '$204,880', unrealized: '+9.8%', dividendYield: '3.71%' },
    { security: 'GOLD ETF', account: 'Treasury', assetClass: 'Commodity', sector: 'Gold', geography: 'Global', weight: '3.1%', marketValue: '$150,240', unrealized: '+6.5%', dividendYield: '—' }
  ],
  riskSnapshot: [
    { security: 'NVDA', beta: 1.22, volatility: 28.4, sharpe: 1.41, sortino: 2.05, drawdown: -16.1, contributionRisk: 13.4 },
    { security: 'AAPL', beta: 0.94, volatility: 19.2, sharpe: 1.12, sortino: 1.66, drawdown: -10.8, contributionRisk: 8.6 },
    { security: 'HDFCBANK', beta: 0.86, volatility: 15.8, sharpe: 0.94, sortino: 1.38, drawdown: -8.2, contributionRisk: 5.4 },
    { security: 'SCHD', beta: 0.72, volatility: 11.1, sharpe: 0.82, sortino: 1.24, drawdown: -7.4, contributionRisk: 3.1 }
  ],
  exposureSector: [
    { name: 'Technology', value: 28 }, { name: 'Financials', value: 16 }, { name: 'Dividend Equity', value: 12 }, { name: 'Fixed Income', value: 11 }, { name: 'Gold', value: 8 }
  ],
  exposureGeo: [
    { name: 'US', value: 49 }, { name: 'India', value: 23 }, { name: 'Global', value: 14 }, { name: 'Europe', value: 8 }, { name: 'Cash', value: 6 }
  ],
  topMovers: [
    { security: 'NVDA', return: '+58.2%', income: '$12', thesis: 'AI capex cycle continues to drive alpha.' },
    { security: 'AAPL', return: '+22.1%', income: '$186', thesis: 'Lower-beta quality anchor stabilizes portfolio.' },
    { security: 'SCHD', return: '+9.8%', income: '$4,120', thesis: 'Income sleeve coverage keeps rising.' }
  ],
  rebalance: [
    { security: 'NVDA', current: '8.4%', target: '7.0%', gap: '+1.4%', action: 'Trim' },
    { security: 'Cash Reserve', current: '4.8%', target: '6.0%', gap: '-1.2%', action: 'Build' },
    { security: 'India Core', current: '14.2%', target: '16.0%', gap: '-1.8%', action: 'Add' },
    { security: 'Gold ETF', current: '3.1%', target: '4.0%', gap: '-0.9%', action: 'Add' }
  ]
};

export const incomeCenterSeed: IncomeCenterPayload = {
  kpis: [
    { label: 'Savings rate', value: '38.4%', change: '+2.3 pts', tone: 'up' },
    { label: 'Free cash flow', value: '$11.8K', change: '+$1.4K', tone: 'up' },
    { label: 'Passive income', value: '$8.4K', change: '+9.2%', tone: 'up' },
    { label: 'Runway', value: '8.2 mo', change: '+0.7 mo', tone: 'up' },
    { label: 'Debt service ratio', value: '17.1%', change: '-0.4 pts', tone: 'up' },
    { label: 'Surplus deploy', value: '64%', change: '+6 pts', tone: 'up' }
  ],
  monthlyFlow: [
    { month:'Jan', income: 21, expenses: 11, invested: 7 },
    { month:'Feb', income: 20, expenses: 12, invested: 6 },
    { month:'Mar', income: 22, expenses: 12, invested: 7 },
    { month:'Apr', income: 23, expenses: 13, invested: 8 },
    { month:'May', income: 23, expenses: 12, invested: 8 },
    { month:'Jun', income: 24, expenses: 13, invested: 9 },
    { month:'Jul', income: 25, expenses: 13, invested: 9 },
    { month:'Aug', income: 24, expenses: 12, invested: 8 },
    { month:'Sep', income: 25, expenses: 14, invested: 9 },
    { month:'Oct', income: 26, expenses: 14, invested: 10 },
    { month:'Nov', income: 25, expenses: 13, invested: 9 },
    { month:'Dec', income: 27, expenses: 15, invested: 10 }
  ],
  passiveMix: [
    { month:'Jan', dividends: 1.8, interest: 0.9, rent: 2.6 },
    { month:'Feb', dividends: 1.7, interest: 1.0, rent: 2.6 },
    { month:'Mar', dividends: 2.1, interest: 1.0, rent: 2.7 },
    { month:'Apr', dividends: 2.0, interest: 1.0, rent: 2.8 },
    { month:'May', dividends: 2.2, interest: 1.1, rent: 2.8 },
    { month:'Jun', dividends: 2.3, interest: 1.1, rent: 2.9 },
    { month:'Jul', dividends: 2.4, interest: 1.1, rent: 2.9 },
    { month:'Aug', dividends: 2.3, interest: 1.2, rent: 3.0 },
    { month:'Sep', dividends: 2.5, interest: 1.2, rent: 3.0 },
    { month:'Oct', dividends: 2.6, interest: 1.2, rent: 3.1 },
    { month:'Nov', dividends: 2.5, interest: 1.3, rent: 3.1 },
    { month:'Dec', dividends: 2.8, interest: 1.3, rent: 3.2 }
  ],
  incomeSources: [
    { name: 'Salary', value: 44 }, { name: 'Business', value: 18 }, { name: 'Dividends', value: 13 }, { name: 'Rent', value: 17 }, { name: 'Interest', value: 8 }
  ],
  liabilities: [
    { lender: 'Home Loan', outstanding: '$182,000', rate: '7.8%', emi: '$1,880', tenure: '11y', coverage: 'Comfortable' },
    { lender: 'Auto Loan', outstanding: '$12,400', rate: '9.2%', emi: '$420', tenure: '2y', coverage: 'Manageable' },
    { lender: 'Credit Line', outstanding: '$4,800', rate: '15.5%', emi: '$210', tenure: 'Rolling', coverage: 'Reduce' }
  ],
  obligations: [
    { title: 'Home EMI', due: '02 May', amount: '$1,880', type: 'Debt', status: 'Upcoming' },
    { title: 'SIP Batch', due: '03 May', amount: '$2,500', type: 'Investment', status: 'Scheduled' },
    { title: 'Insurance Premium', due: '12 May', amount: '$740', type: 'Expense', status: 'Upcoming' },
    { title: 'School Fee', due: '18 May', amount: '$520', type: 'Expense', status: 'Upcoming' }
  ],
  freeCashflow: [
    { month:'Jan', value: 10 },{ month:'Feb', value: 8 },{ month:'Mar', value: 10 },{ month:'Apr', value: 10 },{ month:'May', value: 11 },{ month:'Jun', value: 11 },{ month:'Jul', value: 12 },{ month:'Aug', value: 12 },{ month:'Sep', value: 11 },{ month:'Oct', value: 12 },{ month:'Nov', value: 12 },{ month:'Dec', value: 12 }
  ]
};

export const ratioCenterSeed: RatioCenterPayload = {
  hero: [
    { label: 'Alpha', value: '3.10%', change: '+0.60%', tone: 'up' },
    { label: 'Beta', value: '0.94', change: 'Contained', tone: 'up' },
    { label: 'Max drawdown', value: '-9.4%', change: '+2.4 pts vs benchmark', tone: 'up' },
    { label: 'Tracking error', value: '4.2%', change: '-0.3 pts', tone: 'up' },
    { label: 'Calmar', value: '1.98', change: '+0.12', tone: 'up' },
    { label: 'Ulcer index', value: '3.4', change: '-0.5', tone: 'up' }
  ],
  groups: [
    { title: 'Return metrics', items: [
      { label: 'Absolute return', value: '16.8%', benchmark: '14.1%', note: 'One-year total return' },
      { label: 'Annualized return', value: '18.6%', benchmark: '14.1%' },
      { label: 'CAGR', value: '18.6%', benchmark: '14.1%' },
      { label: 'TWRR', value: '16.8%', benchmark: '14.1%' },
      { label: 'MWRR / XIRR', value: '21.4%', benchmark: '—' },
      { label: 'Rolling return', value: '12.4%', benchmark: '9.8%' },
      { label: 'Active return', value: '+2.7%', benchmark: '—' },
      { label: 'Excess over benchmark', value: '+2.7%', benchmark: '—' },
      { label: 'ROI', value: '28.2%', benchmark: '—' }
    ]},
    { title: 'Risk-adjusted ratios', items: [
      { label: 'Sharpe', value: '1.42', benchmark: '1.04' },
      { label: 'Sortino', value: '2.08', benchmark: '1.42' },
      { label: 'Treynor', value: '17.9', benchmark: '13.1' },
      { label: 'Information ratio', value: '0.74', benchmark: '—' },
      { label: 'Calmar', value: '1.98', benchmark: '1.21' },
      { label: 'Jensen alpha', value: '3.1%', benchmark: '—' },
      { label: 'Appraisal ratio', value: '0.63', benchmark: '—' },
      { label: 'Omega ratio', value: '1.31', benchmark: '1.12' }
    ]},
    { title: 'Risk metrics', items: [
      { label: 'Standard deviation', value: '11.9%', benchmark: '13.4%' },
      { label: 'Downside deviation', value: '7.1%', benchmark: '8.4%' },
      { label: 'Beta', value: '0.94', benchmark: '1.00' },
      { label: 'Alpha', value: '3.10%', benchmark: '—' },
      { label: 'Tracking error', value: '4.2%', benchmark: '—' },
      { label: 'Correlation', value: '0.82', benchmark: '1.00' },
      { label: 'Covariance', value: '0.014', benchmark: '—' },
      { label: 'R-squared', value: '0.74', benchmark: '—' },
      { label: 'VaR (95%)', value: '-2.8%', benchmark: '-3.4%' },
      { label: 'CVaR', value: '-4.1%', benchmark: '-5.0%' },
      { label: 'Average drawdown', value: '-3.6%', benchmark: '-4.8%' },
      { label: 'Drawdown duration', value: '41 days', benchmark: '58 days' },
      { label: 'Recovery time', value: '29 days', benchmark: '47 days' },
      { label: 'Skewness', value: '-0.18', benchmark: '-0.26' },
      { label: 'Kurtosis', value: '2.84', benchmark: '3.22' },
      { label: 'Ulcer index', value: '3.4', benchmark: '4.1' }
    ]},
    { title: 'Concentration & exposure metrics', items: [
      { label: 'Top 5 exposure', value: '31.8%', benchmark: '25.4%' },
      { label: 'Top 10 exposure', value: '48.2%', benchmark: '37.0%' },
      { label: 'HHI concentration index', value: '0.086', benchmark: '0.071' },
      { label: 'Effective holdings', value: '18.4', benchmark: '24.1' },
      { label: 'Issuer concentration', value: '8.4%', benchmark: '6.7%' },
      { label: 'Sector concentration', value: '28.0%', benchmark: '24.0%' },
      { label: 'Country concentration', value: '49.0%', benchmark: '43.0%' },
      { label: 'Currency exposure USD', value: '61%', benchmark: '58%' },
      { label: 'Factor exposure growth', value: '34%', benchmark: '26%' },
    ]},
    { title: 'Income metrics', items: [
      { label: 'Dividend yield', value: '2.6%', benchmark: '1.8%' },
      { label: 'Yield on cost', value: '3.8%', benchmark: '—' },
      { label: 'Income growth rate', value: '11.4%', benchmark: '7.2%' },
      { label: 'Dividend consistency', value: '9 / 10', benchmark: '—' },
      { label: 'Interest income run rate', value: '$1.3K/mo', benchmark: '—' },
      { label: 'Passive income coverage ratio', value: '0.46x', benchmark: 'Target 0.50x' }
    ]},
    { title: 'Cost and tax metrics', items: [
      { label: 'Expense ratio weighted avg', value: '0.42%', benchmark: '0.55%' },
      { label: 'Brokerage cost drag', value: '0.11%', benchmark: '0.18%' },
      { label: 'Tax drag', value: '0.8%', benchmark: '1.1%' },
      { label: 'Turnover ratio', value: '14.2%', benchmark: '22.0%' },
      { label: 'Realized tax by period', value: '$6.8K', benchmark: '—' },
      { label: 'Harvestable losses', value: '$9.4K', benchmark: '—' },
      { label: 'Post-tax return', value: '16.0%', benchmark: '13.0%' }
    ]},
    { title: 'Personal finance metrics', items: [
      { label: 'Savings rate', value: '38.4%', benchmark: 'Target 35%' },
      { label: 'Expense growth rate', value: '4.2%', benchmark: 'Target <6%' },
      { label: 'Fixed vs variable expense', value: '61 / 39', benchmark: '—' },
      { label: 'Debt-to-income', value: '22.1%', benchmark: 'Limit 30%' },
      { label: 'Debt-service coverage', value: '17.1%', benchmark: 'Limit 25%' },
      { label: 'Liquidity ratio', value: '5.8x', benchmark: 'Target 6x' },
      { label: 'Emergency fund months', value: '8.2', benchmark: 'Target 6' },
      { label: 'Cash burn', value: '$2.1K/mo', benchmark: 'Keep low' },
      { label: 'Surplus deployment ratio', value: '64%', benchmark: 'Target 60%' }
    ]},
    { title: 'Advanced portfolio analytics', items: [
      { label: 'Contribution to return', value: '+2.7 pts', benchmark: '—' },
      { label: 'Contribution to risk', value: '11.8%', benchmark: '—' },
      { label: 'Marginal contribution to risk', value: '1.42%', benchmark: '—' },
      { label: 'Brinson attribution', value: '+1.1 pts', benchmark: '—' },
      { label: 'Drift from target allocation', value: '4.8%', benchmark: 'Target <3%' },
      { label: 'Rebalancing gap', value: '4.8%', benchmark: '—' },
      { label: 'Up capture ratio', value: '112%', benchmark: '100%' },
      { label: 'Down capture ratio', value: '86%', benchmark: '100%' },
      { label: 'Benchmark-relative sector OW/UW', value: '+4.0 pts tech', benchmark: '—' }
    ]},
    { title: 'Execution and recovery metrics', items: [
      { label: 'Hit ratio', value: '62%', benchmark: '55%' },
      { label: 'Profit factor', value: '1.84', benchmark: '1.35' },
      { label: 'Expectancy', value: '0.42', benchmark: '0.18' },
      { label: 'Recovery factor', value: '2.16', benchmark: '1.44' }
    ]}
  ],
  radar: [
    { subject: 'Return', portfolio: 84, benchmark: 68 },
    { subject: 'Quality', portfolio: 78, benchmark: 72 },
    { subject: 'Stability', portfolio: 74, benchmark: 61 },
    { subject: 'Income', portfolio: 66, benchmark: 52 },
    { subject: 'Efficiency', portfolio: 81, benchmark: 63 },
    { subject: 'Diversification', portfolio: 71, benchmark: 69 }
  ],
  scatter: [
    { name: 'NVDA', risk: 28.4, return: 58.2, size: 408 },
    { name: 'AAPL', risk: 19.2, return: 22.1, size: 346 },
    { name: 'HDFCBANK', risk: 15.8, return: 12.3, size: 262 },
    { name: 'SCHD', risk: 11.1, return: 9.8, size: 205 },
    { name: 'GOLD ETF', risk: 8.8, return: 6.5, size: 150 }
  ],
  factorExposure: [
    { name: 'Growth', value: 34 }, { name: 'Quality', value: 22 }, { name: 'Value', value: 14 }, { name: 'Income', value: 18 }, { name: 'Defensive', value: 12 }
  ]
};

export const taxCenterSeed: TaxCenterPayload = {
  kpis: [
    { label: 'Tax drag', value: '0.8%', change: '-0.1 pts', tone: 'up' },
    { label: 'Realized gains', value: '$28,420', change: '+$4,210', tone: 'down' },
    { label: 'Harvest candidates', value: '5', change: '+2', tone: 'up' },
    { label: 'LTCG mix', value: '68%', change: '+4 pts', tone: 'up' },
    { label: 'STCG mix', value: '32%', change: '-4 pts', tone: 'up' },
    { label: 'Post-tax return', value: '16.0%', change: '+3.0 pts', tone: 'up' }
  ],
  summary: [
    { title: 'Estimated tax payable', value: '$6,840', detail: 'Across realized gains, dividends, and interest income.' },
    { title: 'Available losses', value: '$9,420', detail: 'Potential harvesting pool before wash-sale review.' },
    { title: 'Qualified dividends', value: '$4,280', detail: 'Income eligible for favorable tax treatment.' }
  ],
  realizedVsUnrealized: [
    { label: 'Equity', realized: 12.4, unrealized: 28.2 },
    { label: 'ETF', realized: 6.8, unrealized: 11.6 },
    { label: 'Fixed Income', realized: 1.1, unrealized: 2.7 },
    { label: 'Gold', realized: 0.8, unrealized: 4.4 }
  ],
  lots: [
    { security: 'NVDA', lotDate: '14 Mar 2026', quantity: '8 sh', costBasis: '$8,098', currentValue: '$8,979', gain: '+$881', term: 'STCG', harvest: 'No' },
    { security: 'AAPL', lotDate: '03 Feb 2026', quantity: '160 sh', costBasis: '$30,208', currentValue: '$34,384', gain: '+$4,176', term: 'STCG', harvest: 'No' },
    { security: 'SCHD', lotDate: '17 Nov 2025', quantity: '520 sh', costBasis: '$38,640', currentValue: '$37,910', gain: '-$730', term: 'LTCG', harvest: 'Candidate' },
    { security: 'EM Bond ETF', lotDate: '09 Sep 2025', quantity: '300 sh', costBasis: '$14,580', currentValue: '$13,980', gain: '-$600', term: 'LTCG', harvest: 'Candidate' },
    { security: 'Small Cap Fund', lotDate: '18 Apr 2026', quantity: '90 units', costBasis: '$9,870', currentValue: '$9,110', gain: '-$760', term: 'STCG', harvest: 'Review' }
  ],
  taxes: [
    { bucket: 'Long-term capital gains', amount: '$2,940', rate: '10–15%', note: 'Mostly from trims in matured holdings.' },
    { bucket: 'Short-term capital gains', amount: '$2,420', rate: '15–30%', note: 'Driven by tactical growth sleeve trims.' },
    { bucket: 'Dividend tax', amount: '$940', rate: 'Qualified / mixed', note: 'Blend of domestic and international dividend treatment.' },
    { bucket: 'Interest income tax', amount: '$540', rate: 'Marginal', note: 'Treasury and savings income.' }
  ],
  harvesting: [
    { security: 'SCHD', loss: '$730', washSale: 'Clean', action: 'Harvest and rotate into broad dividend ETF' },
    { security: 'EM Bond ETF', loss: '$600', washSale: 'Clean', action: 'Harvest and re-enter after window' },
    { security: 'Small Cap Fund', loss: '$760', washSale: 'Potential', action: 'Check related purchases before harvesting' }
  ]
};
