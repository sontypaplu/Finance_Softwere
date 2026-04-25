import type { AnalyticsPayload, PerformancePayload, PlanningPayload, RiskPayload } from '@/lib/types/terminal-pages';

export const performanceSeed: PerformancePayload = {
  kpis: [
    { label: 'Time-weighted return', value: '+16.82%', change: '+2.14 pts', tone: 'up' },
    { label: 'XIRR', value: '+19.14%', change: '+1.02 pts', tone: 'up' },
    { label: 'Active return', value: '+4.62%', change: 'vs benchmark', tone: 'up' },
    { label: 'Max drawdown', value: '-7.90%', change: 'Contained', tone: 'flat' },
    { label: 'Hit ratio', value: '63.4%', change: '+4.1 pts', tone: 'up' },
    { label: 'Sharpe ratio', value: '1.62', change: '+0.12', tone: 'up' }
  ],
  trend: [
    { month: 'Jan', portfolio: 101.2, benchmark: 100.4 },
    { month: 'Feb', portfolio: 103.8, benchmark: 101.7 },
    { month: 'Mar', portfolio: 102.9, benchmark: 100.8 },
    { month: 'Apr', portfolio: 106.4, benchmark: 102.8 },
    { month: 'May', portfolio: 108.2, benchmark: 103.5 },
    { month: 'Jun', portfolio: 110.6, benchmark: 104.9 },
    { month: 'Jul', portfolio: 112.4, benchmark: 106.1 },
    { month: 'Aug', portfolio: 113.9, benchmark: 106.8 },
    { month: 'Sep', portfolio: 115.5, benchmark: 108.2 },
    { month: 'Oct', portfolio: 116.8, benchmark: 109.1 },
    { month: 'Nov', portfolio: 117.6, benchmark: 110.3 },
    { month: 'Dec', portfolio: 118.4, benchmark: 111.0 }
  ],
  rolling: [
    { month: 'Jan', oneMonth: 1.2, threeMonth: 3.8, sixMonth: 6.4 },
    { month: 'Feb', oneMonth: 2.0, threeMonth: 4.1, sixMonth: 6.8 },
    { month: 'Mar', oneMonth: -0.8, threeMonth: 2.9, sixMonth: 5.4 },
    { month: 'Apr', oneMonth: 2.4, threeMonth: 3.7, sixMonth: 6.1 },
    { month: 'May', oneMonth: 1.6, threeMonth: 4.0, sixMonth: 6.5 },
    { month: 'Jun', oneMonth: 2.1, threeMonth: 4.8, sixMonth: 7.3 },
    { month: 'Jul', oneMonth: 1.3, threeMonth: 5.1, sixMonth: 7.8 },
    { month: 'Aug', oneMonth: 1.1, threeMonth: 4.4, sixMonth: 7.0 },
    { month: 'Sep', oneMonth: 1.5, threeMonth: 4.2, sixMonth: 6.9 },
    { month: 'Oct', oneMonth: 0.9, threeMonth: 3.8, sixMonth: 6.6 },
    { month: 'Nov', oneMonth: 0.6, threeMonth: 3.3, sixMonth: 6.0 },
    { month: 'Dec', oneMonth: 0.7, threeMonth: 3.1, sixMonth: 5.7 }
  ],
  attribution: [
    { sleeve: 'US Growth', contribution: 5.8 },
    { sleeve: 'India Core', contribution: 3.6 },
    { sleeve: 'Income', contribution: 2.1 },
    { sleeve: 'Alternatives', contribution: 1.4 },
    { sleeve: 'Cash Drag', contribution: -0.9 }
  ],
  heatmap: [
    {
      year: '2024',
      months: [
        { label: 'Jan', value: 2.4 }, { label: 'Feb', value: 1.8 }, { label: 'Mar', value: -0.9 }, { label: 'Apr', value: 3.2 },
        { label: 'May', value: 1.1 }, { label: 'Jun', value: 2.3 }, { label: 'Jul', value: 0.8 }, { label: 'Aug', value: 1.6 },
        { label: 'Sep', value: -0.4 }, { label: 'Oct', value: 1.2 }, { label: 'Nov', value: 2.0 }, { label: 'Dec', value: 1.7 }
      ]
    },
    {
      year: '2025',
      months: [
        { label: 'Jan', value: 1.9 }, { label: 'Feb', value: 2.5 }, { label: 'Mar', value: -1.2 }, { label: 'Apr', value: 2.8 },
        { label: 'May', value: 1.7 }, { label: 'Jun', value: 2.9 }, { label: 'Jul', value: 1.4 }, { label: 'Aug', value: 0.6 },
        { label: 'Sep', value: 1.2 }, { label: 'Oct', value: 0.9 }, { label: 'Nov', value: 1.1 }, { label: 'Dec', value: 0.8 }
      ]
    },
    {
      year: '2026',
      months: [
        { label: 'Jan', value: 1.2 }, { label: 'Feb', value: 2.0 }, { label: 'Mar', value: -0.8 }, { label: 'Apr', value: 2.4 },
        { label: 'May', value: 1.6 }, { label: 'Jun', value: 2.1 }, { label: 'Jul', value: 1.3 }, { label: 'Aug', value: 1.1 },
        { label: 'Sep', value: 1.5 }, { label: 'Oct', value: 0.9 }, { label: 'Nov', value: 0.6 }, { label: 'Dec', value: 0.7 }
      ]
    }
  ],
  beats: [
    { title: 'Benchmark lead sustained for 8 months', detail: 'Outperformance stayed broad-based across core growth and India sleeves.' },
    { title: 'Income sleeve offset rate volatility', detail: 'Dividend and short-duration income reduced the overall portfolio shock.' },
    { title: 'Cash drag narrowed after redeployment', detail: 'Idle cash exposure reduced after staged deployment in April and June.' }
  ]
};

export const analyticsSeed: AnalyticsPayload = {
  kpis: [
    { label: 'Holdings count', value: '42', change: '+3', tone: 'up' },
    { label: 'Turnover ratio', value: '18.2%', change: '-2.4 pts', tone: 'up' },
    { label: 'Tax lots', value: '136', change: 'Tracked', tone: 'flat' },
    { label: 'Dividend YTD', value: '$41.8K', change: '+9.6%', tone: 'up' },
    { label: 'Expense drag', value: '0.29%', change: '-0.04 pts', tone: 'up' },
    { label: 'Watchlist alerts', value: '7', change: '+2', tone: 'down' }
  ],
  holdings: [
    { security: 'NVIDIA Corp.', account: 'Growth Ledger', weight: '8.4%', marketValue: '$408,220', dayChange: '+2.96%', totalReturn: '+34.8%', risk: 'High', drift: '+1.7%' },
    { security: 'Apple Inc.', account: 'Core Equity', weight: '7.1%', marketValue: '$345,900', dayChange: '+1.24%', totalReturn: '+22.1%', risk: 'Medium', drift: '+0.6%' },
    { security: 'HDFC Bank', account: 'India Core', weight: '5.4%', marketValue: '$262,440', dayChange: '+0.82%', totalReturn: '+12.3%', risk: 'Medium', drift: '-0.3%' },
    { security: 'SCHD ETF', account: 'Income Sleeve', weight: '6.2%', marketValue: '$301,180', dayChange: '+0.44%', totalReturn: '+14.6%', risk: 'Low', drift: '+0.2%' },
    { security: 'Gold ETF', account: 'Defensive', weight: '4.8%', marketValue: '$233,640', dayChange: '+0.41%', totalReturn: '+10.2%', risk: 'Low', drift: '+0.9%' }
  ],
  transactions: [
    { date: '21 Apr 2026', type: 'Buy', security: 'AAPL', account: 'Core Equity', amount: '$62,400', status: 'Settled' },
    { date: '20 Apr 2026', type: 'Dividend', security: 'SCHD', account: 'Income Sleeve', amount: '$4,120', status: 'Booked' },
    { date: '19 Apr 2026', type: 'Sell', security: 'TSLA', account: 'Tactical', amount: '$21,680', status: 'Settled' },
    { date: '18 Apr 2026', type: 'Transfer', security: 'Cash Reserve', account: 'Treasury', amount: '$15,000', status: 'Completed' },
    { date: '16 Apr 2026', type: 'Buy', security: 'RELIANCE', account: 'India Core', amount: '$28,340', status: 'Settled' }
  ],
  taxLots: [
    { security: 'AAPL', lotDate: '14 Jan 2025', remaining: '220 sh', costBasis: '$168.40', gain: '+23.8%', taxClass: 'LTCG' },
    { security: 'NVDA', lotDate: '09 Jun 2025', remaining: '62 sh', costBasis: '$741.22', gain: '+32.5%', taxClass: 'LTCG' },
    { security: 'SCHD', lotDate: '21 Feb 2026', remaining: '410 sh', costBasis: '$73.14', gain: '+6.7%', taxClass: 'STCG' },
    { security: 'GOLD ETF', lotDate: '11 Dec 2024', remaining: '530 sh', costBasis: '$38.92', gain: '+18.1%', taxClass: 'LTCG' }
  ],
  alerts: [
    { title: 'NVDA concentration above tactical band', detail: 'Single-name weight moved 1.7% above target range after recent upside.', severity: 'high' },
    { title: '3 unsettled entries need reconciliation', detail: 'Treasury and dividend subledger have pending broker references.', severity: 'medium' },
    { title: 'Harvest window opening in one tactical lot', detail: 'One TSLA lot is close to wash-sale cooling period completion.', severity: 'low' }
  ]
};

export const riskSeed: RiskPayload = {
  kpis: [
    { label: 'Portfolio volatility', value: '11.8%', change: '-0.6 pts', tone: 'up' },
    { label: 'Downside deviation', value: '7.4%', change: 'Contained', tone: 'flat' },
    { label: 'Beta', value: '0.92', change: '-0.03', tone: 'up' },
    { label: 'VaR (95%)', value: '$84.6K', change: '-$4.1K', tone: 'up' },
    { label: 'CVaR', value: '$128.9K', change: '-$7.3K', tone: 'up' },
    { label: 'Concentration score', value: '0.18', change: '+0.01', tone: 'down' }
  ],
  allocation: [
    { name: 'Equities', value: 48 },
    { name: 'Funds', value: 22 },
    { name: 'Fixed Income', value: 14 },
    { name: 'Alternatives', value: 10 },
    { name: 'Cash', value: 6 }
  ],
  sectorExposure: [
    { name: 'Technology', value: 28 },
    { name: 'Financials', value: 16 },
    { name: 'Industrials', value: 11 },
    { name: 'Healthcare', value: 9 },
    { name: 'Energy', value: 7 },
    { name: 'Consumer', value: 12 },
    { name: 'Cash/Other', value: 17 }
  ],
  factorExposure: [
    { factor: 'Growth', value: 0.78 },
    { factor: 'Quality', value: 0.66 },
    { factor: 'Momentum', value: 0.51 },
    { factor: 'Value', value: 0.32 },
    { factor: 'Low Volatility', value: 0.47 }
  ],
  correlation: {
    labels: ['Portfolio', 'US Growth', 'India Core', 'Income', 'Gold'],
    matrix: [
      [1.0, 0.82, 0.71, 0.42, 0.18],
      [0.82, 1.0, 0.62, 0.26, 0.12],
      [0.71, 0.62, 1.0, 0.31, 0.16],
      [0.42, 0.26, 0.31, 1.0, 0.21],
      [0.18, 0.12, 0.16, 0.21, 1.0]
    ]
  },
  scenarios: [
    { scenario: 'US growth shock -8%', impact: '-4.6%', note: 'Primary sensitivity remains concentrated in mega-cap growth.' },
    { scenario: 'Rates +100 bps', impact: '-1.8%', note: 'Short-duration positioning dampens rate sensitivity.' },
    { scenario: 'Oil +20%', impact: '+0.7%', note: 'Energy and India cyclicals partly offset consumer pressure.' },
    { scenario: 'Gold +12%', impact: '+1.4%', note: 'Defensive sleeve adds convexity during equity stress.' }
  ],
  alerts: [
    { title: 'Tech exposure remains the key dominant risk', detail: 'Technology allocation still contributes the largest slice of portfolio VaR.' },
    { title: 'Correlation across growth sleeves has risen', detail: 'Cross-sleeve diversification is lower than last quarter.' },
    { title: 'Defensive ballast is working as intended', detail: 'Gold and income sleeves continue to lower tail-risk impact.' }
  ]
};

export const planningSeed: PlanningPayload = {
  kpis: [
    { label: 'Savings rate', value: '34.6%', change: '+2.1 pts', tone: 'up' },
    { label: 'Emergency runway', value: '5.8 mo', change: '+0.4 mo', tone: 'up' },
    { label: 'Passive income cover', value: '42%', change: '+5 pts', tone: 'up' },
    { label: 'Debt service ratio', value: '18.2%', change: '-1.1 pts', tone: 'up' },
    { label: 'Investable surplus', value: '$28.4K', change: '+$3.2K', tone: 'up' },
    { label: 'Upcoming obligations', value: '4', change: 'This month', tone: 'flat' }
  ],
  cashflow: [
    { month: 'Jan', income: 28, expenses: 15, invested: 8 },
    { month: 'Feb', income: 30, expenses: 16, invested: 9 },
    { month: 'Mar', income: 29, expenses: 18, invested: 7 },
    { month: 'Apr', income: 31, expenses: 17, invested: 10 },
    { month: 'May', income: 30, expenses: 16, invested: 9 },
    { month: 'Jun', income: 32, expenses: 17, invested: 10 },
    { month: 'Jul', income: 33, expenses: 18, invested: 10 },
    { month: 'Aug', income: 34, expenses: 18, invested: 11 },
    { month: 'Sep', income: 33, expenses: 17, invested: 10 },
    { month: 'Oct', income: 35, expenses: 19, invested: 11 },
    { month: 'Nov', income: 36, expenses: 20, invested: 12 },
    { month: 'Dec', income: 37, expenses: 20, invested: 12 }
  ],
  goals: [
    { title: 'Emergency Reserve', target: '$180K', current: '$146K', funded: 81, due: 'Priority' },
    { title: 'Global Equity Expansion', target: '$420K', current: '$268K', funded: 64, due: 'Q4 2026' },
    { title: 'Home Upgrade Fund', target: '$250K', current: '$98K', funded: 39, due: 'Q2 2027' }
  ],
  liabilities: [
    { lender: 'Axis Home Loan', outstanding: '$118,000', rate: '8.35%', emi: '$1,420', tenure: '118 mo' },
    { lender: 'Vehicle Finance', outstanding: '$14,300', rate: '9.10%', emi: '$420', tenure: '31 mo' },
    { lender: 'Margin Buffer', outstanding: '$0', rate: '—', emi: '—', tenure: 'Inactive' }
  ],
  passiveIncome: [
    { month: 'Jan', dividends: 3.8, interest: 1.2, rent: 2.6 },
    { month: 'Feb', dividends: 3.2, interest: 1.3, rent: 2.6 },
    { month: 'Mar', dividends: 4.1, interest: 1.3, rent: 2.6 },
    { month: 'Apr', dividends: 3.9, interest: 1.4, rent: 2.6 },
    { month: 'May', dividends: 4.4, interest: 1.4, rent: 2.6 },
    { month: 'Jun', dividends: 4.0, interest: 1.5, rent: 2.6 }
  ],
  upcoming: [
    { title: 'Quarterly tax reserve transfer', amount: '$6,000', due: '26 Apr', status: 'Upcoming' },
    { title: 'SIP batch – core index funds', amount: '$3,800', due: '01 May', status: 'Scheduled' },
    { title: 'Home loan EMI', amount: '$1,420', due: '05 May', status: 'Scheduled' },
    { title: 'Insurance annual premium', amount: '$2,300', due: '16 May', status: 'Review' }
  ]
};
