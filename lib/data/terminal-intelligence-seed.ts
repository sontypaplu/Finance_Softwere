import type { CalendarPayload, GoalsPayload, RebalancingPayload, ReportsPayload, WatchlistPayload } from '@/lib/types/terminal-intelligence';

export const watchlistSeed: WatchlistPayload = {
  kpis: [
    { label: 'Pinned securities', value: '18', change: '+3 this week', tone: 'up' },
    { label: 'Ideas in buy band', value: '5', change: '2 near trigger', tone: 'up' },
    { label: 'Market breadth', value: '64%', change: '+6 pts', tone: 'up' },
    { label: 'Top mover', value: 'NVDA', change: '+2.96%', tone: 'up' },
    { label: 'Macro risk mood', value: 'Balanced', change: 'VIX contained', tone: 'flat' },
    { label: 'Watchlist news hits', value: '14', change: 'Today', tone: 'flat' }
  ],
  board: [
    { symbol: 'SPX', name: 'S&P 500', price: '5,338.4', change: '+0.84%', direction: 'up', region: 'US' },
    { symbol: 'NDX', name: 'NASDAQ 100', price: '18,912.7', change: '+1.22%', direction: 'up', region: 'US' },
    { symbol: 'NIFTY', name: 'NIFTY 50', price: '23,824.1', change: '+0.48%', direction: 'up', region: 'India' },
    { symbol: 'DXY', name: 'US Dollar Index', price: '103.20', change: '-0.31%', direction: 'down', region: 'FX' },
    { symbol: 'XAU', name: 'Gold Spot', price: '2,418.6', change: '+0.56%', direction: 'up', region: 'Commodities' },
    { symbol: 'BTC', name: 'Bitcoin', price: '64,820', change: '-1.18%', direction: 'down', region: 'Crypto' }
  ],
  pulse: [
    { month: 'Jan', portfolio: 100, benchmark: 100 },
    { month: 'Feb', portfolio: 104, benchmark: 101 },
    { month: 'Mar', portfolio: 102, benchmark: 99 },
    { month: 'Apr', portfolio: 108, benchmark: 102 },
    { month: 'May', portfolio: 112, benchmark: 104 },
    { month: 'Jun', portfolio: 116, benchmark: 106 },
    { month: 'Jul', portfolio: 118, benchmark: 107 },
    { month: 'Aug', portfolio: 121, benchmark: 109 },
    { month: 'Sep', portfolio: 123, benchmark: 111 },
    { month: 'Oct', portfolio: 126, benchmark: 112 },
    { month: 'Nov', portfolio: 129, benchmark: 114 },
    { month: 'Dec', portfolio: 133, benchmark: 116 }
  ],
  watchlist: [
    { symbol: 'MSFT', name: 'Microsoft', last: '$428.80', change: '+1.14%', volume: '21.4M', trigger: 'Add on 6% pullback', thesis: 'Cloud + AI compounder with resilient free cash flow.', route: '/terminal/assets/AAPL' },
    { symbol: 'TSM', name: 'Taiwan Semi', last: '$152.44', change: '+0.92%', volume: '18.8M', trigger: 'Review after earnings', thesis: 'Foundry leverage to AI cycle with pricing power.', route: '/terminal/assets/NVDA' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', last: '₹1,171.20', change: '+0.65%', volume: '12.7M', trigger: 'Scale on valuation reset', thesis: 'India banking quality alternative with retail mix.', route: '/terminal/assets/HDFCBANK' },
    { symbol: 'AMZN', name: 'Amazon', last: '$182.63', change: '-0.42%', volume: '35.1M', trigger: 'Track AWS margin inflection', thesis: 'Retail efficiency and cloud AI optionality.', route: '/terminal/assets/AAPL' },
    { symbol: 'SCHD', name: 'Schwab US Dividend ETF', last: '$78.12', change: '+0.38%', volume: '4.6M', trigger: 'Add for income band fill', thesis: 'Dividend income ballast for passive cashflow.', route: '/terminal/assets/AAPL' }
  ],
  movers: [
    { symbol: 'NVDA', name: 'NVIDIA', change: '+2.96%', reason: 'Semiconductor strength and AI spend optimism.' },
    { symbol: 'TSLA', name: 'Tesla', change: '-3.10%', reason: 'Margin caution ahead of delivery commentary.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', change: '+0.82%', reason: 'Banking participation and stable deposit outlook.' },
    { symbol: 'GOLD', name: 'Gold', change: '+0.56%', reason: 'Softer dollar and geopolitical hedge demand.' }
  ],
  themes: [
    { title: 'AI capex remains the dominant narrative', detail: 'Semis, infrastructure, and cloud names continue to lead the equity tape.' },
    { title: 'Rates are supportive but not fully benign', detail: 'Short-end calm helps quality growth, while financials remain selective.' },
    { title: 'Income sleeve still adds stability', detail: 'Dividend-focused ETFs and high-quality banks keep the overall board balanced.' }
  ],
  breadth: [
    { name: 'Advancers', value: 64 },
    { name: 'Decliners', value: 36 },
    { name: 'New highs', value: 18 },
    { name: 'New lows', value: 6 }
  ]
};

export const calendarSeed: CalendarPayload = {
  kpis: [
    { label: 'Events this week', value: '19', change: '+4 vs last week', tone: 'up' },
    { label: 'Earnings due', value: '7', change: '3 today', tone: 'flat' },
    { label: 'Dividend receipts', value: '$8.4K', change: 'Next 10 days', tone: 'up' },
    { label: 'Obligations due', value: '4', change: '2 high priority', tone: 'down' },
    { label: 'Macro events', value: '5', change: 'CPI + policy minutes', tone: 'flat' },
    { label: 'Upcoming maturities', value: '$41K', change: '21 days', tone: 'flat' }
  ],
  timeline: [
    {
      day: 'Today',
      date: '21 Apr 2026',
      items: [
        { time: '09:00', title: 'SCHD dividend payable', type: 'dividend', detail: 'Income sleeve credit expected in brokerage cash.', value: '$4,120', status: 'Expected' },
        { time: '18:30', title: 'Microsoft earnings', type: 'earnings', detail: 'Focus on Azure growth, AI monetization, and margins.', value: 'EPS est. $2.83', status: 'Watch' },
        { time: '20:00', title: 'Treasury sweep batch', type: 'obligation', detail: 'Move free cash into short-duration reserve ladder.', value: '$25,000', status: 'Action' }
      ]
    },
    {
      day: 'Tomorrow',
      date: '22 Apr 2026',
      items: [
        { time: '08:15', title: 'India SIP batch', type: 'obligation', detail: 'Automatic investment into India core and flexi-cap funds.', value: '₹180,000', status: 'Scheduled' },
        { time: '19:00', title: 'Tesla earnings', type: 'earnings', detail: 'Track delivery quality, margin path, and commentary on pricing.', value: 'EPS est. $0.61', status: 'Watch' }
      ]
    },
    {
      day: 'This week',
      date: '23–26 Apr 2026',
      items: [
        { time: 'All week', title: 'US CPI and PMI releases', type: 'macro', detail: 'Macro tape may influence growth vs value rotation.', value: 'Macro', status: 'Monitor' },
        { time: 'Fri', title: 'Home-loan EMI', type: 'obligation', detail: 'Monthly debt service from treasury account.', value: '$3,920', status: 'Due' },
        { time: 'Fri', title: 'AAPL dividend record check', type: 'dividend', detail: 'Confirm share count against record date snapshot.', value: '$186', status: 'Review' }
      ]
    }
  ],
  earnings: [
    { symbol: 'MSFT', name: 'Microsoft', when: 'Today · After close', estimate: '$2.83 EPS', focus: 'Azure AI monetization and capex discipline' },
    { symbol: 'TSLA', name: 'Tesla', when: 'Tomorrow · After close', estimate: '$0.61 EPS', focus: 'Margin path and delivery commentary' },
    { symbol: 'GOOGL', name: 'Alphabet', when: 'Thu · After close', estimate: '$1.75 EPS', focus: 'Cloud, search resilience, and AI overhead' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', when: 'Sat · Pre-open', estimate: 'NIM stable', focus: 'Deposit growth and asset quality' }
  ],
  dividends: [
    { security: 'SCHD', exDate: '20 Apr 2026', payable: '21 Apr 2026', amount: '$4,120', note: 'Quarterly income sleeve distribution' },
    { security: 'AAPL', exDate: '25 Apr 2026', payable: '08 May 2026', amount: '$186', note: 'Core equity recurring dividend' },
    { security: 'HDFCBANK', exDate: '15 Jun 2026', payable: '18 Jun 2026', amount: '₹6,460', note: 'Annual India core dividend' }
  ],
  obligations: [
    { title: 'Home-loan EMI', due: '26 Apr 2026', amount: '$3,920', status: 'High priority', detail: 'Auto-debit from treasury account.' },
    { title: 'Portfolio review memo', due: '28 Apr 2026', amount: 'Memo', status: 'Medium', detail: 'Monthly investment committee note and allocation review.' },
    { title: 'Treasury ladder maturity', due: '11 May 2026', amount: '$41,000', status: 'Monitor', detail: 'Reinvest or route to goals bucket after maturity.' }
  ],
  distribution: [
    { name: 'Earnings', value: 7 },
    { name: 'Dividends', value: 5 },
    { name: 'Obligations', value: 4 },
    { name: 'Macro', value: 3 }
  ]
};

export const rebalancingSeed: RebalancingPayload = {
  kpis: [
    { label: 'Drifted sleeves', value: '4', change: '2 above band', tone: 'down' },
    { label: 'Capital to rebalance', value: '$186K', change: 'Gross turnover', tone: 'flat' },
    { label: 'Largest overweight', value: 'US Growth', change: '+2.8%', tone: 'down' },
    { label: 'Largest underweight', value: 'Fixed Income', change: '-2.1%', tone: 'up' },
    { label: 'Post-trade cash', value: '$118K', change: 'Healthy', tone: 'up' },
    { label: 'Policy fit score', value: '8.4 / 10', change: '+0.6 if executed', tone: 'up' }
  ],
  bands: [
    { name: 'US Growth', current: 31, target: 28 },
    { name: 'India Core', current: 18, target: 18 },
    { name: 'Income', current: 12, target: 14 },
    { name: 'Alternatives', current: 10, target: 9 },
    { name: 'Cash', current: 7, target: 8 },
    { name: 'Fixed Income', current: 22, target: 23 }
  ],
  drifts: [
    { sleeve: 'US Growth', current: '31.0%', target: '28.0%', drift: '+3.0%', action: 'Trim', amount: '$86,000' },
    { sleeve: 'Income', current: '12.0%', target: '14.0%', drift: '-2.0%', action: 'Add', amount: '$58,000' },
    { sleeve: 'Fixed Income', current: '22.0%', target: '23.0%', drift: '-1.0%', action: 'Add', amount: '$31,000' },
    { sleeve: 'Cash', current: '7.0%', target: '8.0%', drift: '-1.0%', action: 'Preserve', amount: '$11,000' },
    { sleeve: 'Alternatives', current: '10.0%', target: '9.0%', drift: '+1.0%', action: 'Trim', amount: '$18,000' }
  ],
  actions: [
    { title: 'Trim concentrated mega-cap growth', detail: 'Reduce US growth weight modestly to bring single-name concentration back inside policy bands.' },
    { title: 'Refill income sleeve and duration ballast', detail: 'Route proceeds into dividend ETF and short-duration fixed income to improve stability.' },
    { title: 'Protect runway while rebalancing', detail: 'Maintain minimum treasury cash so planning obligations stay fully funded.' }
  ],
  tradeList: [
    { side: 'Sell', security: 'NVDA', amount: '$42,000', account: 'Growth Ledger', rationale: 'Bring tactical weight back within concentration band.' },
    { side: 'Sell', security: 'Gold ETF', amount: '$18,000', account: 'Defensive', rationale: 'Trim defensive overweight after risk normalization.' },
    { side: 'Buy', security: 'SCHD', amount: '$46,000', account: 'Income Sleeve', rationale: 'Refill dividend cashflow sleeve.' },
    { side: 'Buy', security: 'Short Duration Fund', amount: '$31,000', account: 'Treasury', rationale: 'Add ballast and reduce idle-cash drag.' },
    { side: 'Buy', security: 'India Index Fund', amount: '$19,000', account: 'India Core', rationale: 'Keep regional allocation at target.' }
  ]
};

export const goalsSeed: GoalsPayload = {
  kpis: [
    { label: 'Goals tracked', value: '6', change: '+1 new', tone: 'up' },
    { label: 'Total target corpus', value: '$5.84M', change: 'Long horizon', tone: 'flat' },
    { label: 'Current funded', value: '$2.31M', change: '39.6% funded', tone: 'up' },
    { label: 'On-track goals', value: '4', change: '2 need action', tone: 'flat' },
    { label: 'Monthly need', value: '$18.2K', change: '+$1.4K gap', tone: 'down' },
    { label: 'Projected completion', value: '2034', change: 'Weighted median', tone: 'flat' }
  ],
  goals: [
    { title: 'Retirement corpus', target: '$3.20M', current: '$1.46M', funded: 46, due: 'Dec 2042', monthlyNeed: '$7,900', priority: 'Primary' },
    { title: 'Emergency fund', target: '$180K', current: '$118K', funded: 66, due: 'Dec 2026', monthlyNeed: '$3,100', priority: 'High' },
    { title: 'House down payment', target: '$620K', current: '$248K', funded: 40, due: 'Jun 2029', monthlyNeed: '$4,600', priority: 'High' },
    { title: 'Education reserve', target: '$540K', current: '$176K', funded: 33, due: 'Jul 2032', monthlyNeed: '$2,700', priority: 'Medium' },
    { title: 'Freedom travel fund', target: '$120K', current: '$54K', funded: 45, due: 'Oct 2028', monthlyNeed: '$680', priority: 'Low' },
    { title: 'Venture allocation', target: '$1.18M', current: '$252K', funded: 21, due: 'Dec 2035', monthlyNeed: '$3,200', priority: 'Strategic' }
  ],
  projection: [
    { month: '2026', portfolio: 2.31, benchmark: 5.84 },
    { month: '2027', portfolio: 2.58, benchmark: 5.84 },
    { month: '2028', portfolio: 2.92, benchmark: 5.84 },
    { month: '2029', portfolio: 3.28, benchmark: 5.84 },
    { month: '2030', portfolio: 3.65, benchmark: 5.84 },
    { month: '2031', portfolio: 4.04, benchmark: 5.84 },
    { month: '2032', portfolio: 4.43, benchmark: 5.84 },
    { month: '2033', portfolio: 4.84, benchmark: 5.84 },
    { month: '2034', portfolio: 5.26, benchmark: 5.84 },
    { month: '2035', portfolio: 5.69, benchmark: 5.84 },
    { month: '2036', portfolio: 5.96, benchmark: 5.84 }
  ],
  buckets: [
    { name: 'Retirement', value: 46 },
    { name: 'Emergency', value: 14 },
    { name: 'House', value: 18 },
    { name: 'Education', value: 11 },
    { name: 'Travel', value: 5 },
    { name: 'Venture', value: 6 }
  ],
  milestones: [
    { title: 'Emergency fund crosses 75%', due: 'Sep 2026', amount: '$135K', status: 'On track' },
    { title: 'House corpus reaches $300K', due: 'Mar 2027', amount: '$300K', status: 'Needs boost' },
    { title: 'Retirement corpus hits $2M', due: 'Aug 2028', amount: '$2.0M', status: 'On track' },
    { title: 'Education reserve first milestone', due: 'Jan 2029', amount: '$240K', status: 'Watch' }
  ],
  insights: [
    { title: 'Emergency fund is the fastest closeable gap', detail: 'A modest reallocation of idle cash and monthly savings can complete this target by year-end.' },
    { title: 'House goal needs higher contribution cadence', detail: 'Current savings pace misses the desired down-payment timeline by roughly six months.' },
    { title: 'Retirement remains comfortably compounding', detail: 'Long runway and current portfolio return assumptions keep retirement on a healthy path.' }
  ]
};

export const reportsSeed: ReportsPayload = {
  kpis: [
    { label: 'Saved reports', value: '12', change: '+3 custom', tone: 'up' },
    { label: 'Exports this month', value: '28', change: '+6', tone: 'up' },
    { label: 'Scheduled jobs', value: '5', change: 'All healthy', tone: 'up' },
    { label: 'Last report runtime', value: '12 sec', change: 'Fast', tone: 'up' },
    { label: 'PDF / XLS mix', value: '61 / 39', change: 'Usage split', tone: 'flat' },
    { label: 'Failed exports', value: '0', change: 'Stable', tone: 'up' }
  ],
  library: [
    { title: 'Executive portfolio summary', type: 'Management pack', cadence: 'On demand', lastRun: 'Today · 09:42', status: 'Ready', format: 'PDF + XLSX' },
    { title: 'Allocation and drift report', type: 'Risk report', cadence: 'Weekly', lastRun: 'Mon · 07:30', status: 'Scheduled', format: 'PDF' },
    { title: 'Income and cashflow statement', type: 'Planning report', cadence: 'Monthly', lastRun: '18 Apr · 20:10', status: 'Ready', format: 'XLSX' },
    { title: 'Tax-lot and realized P&L ledger', type: 'Tax report', cadence: 'Monthly', lastRun: '15 Apr · 18:25', status: 'Ready', format: 'CSV + XLSX' },
    { title: 'Goal progress dashboard export', type: 'Goal report', cadence: 'Quarterly', lastRun: '10 Apr · 08:00', status: 'Queued', format: 'PDF' }
  ],
  exports: [
    { id: 'rp_1', title: 'Q1 executive summary', requested: 'Today · 09:42', range: '01 Jan – 31 Mar 2026', size: '2.4 MB', status: 'Completed' },
    { id: 'rp_2', title: 'Risk and drift pack', requested: 'Mon · 07:30', range: 'MTD', size: '1.1 MB', status: 'Completed' },
    { id: 'rp_3', title: 'Income statement', requested: '18 Apr · 20:10', range: 'YTD', size: '840 KB', status: 'Completed' },
    { id: 'rp_4', title: 'Goal progress memo', requested: '10 Apr · 08:00', range: 'Rolling 12M', size: 'Pending', status: 'Queued' }
  ],
  scheduled: [
    { title: 'Monday market-open brief', cadence: 'Weekly · Monday', nextRun: '27 Apr · 07:00', recipients: 'You + advisory alias' },
    { title: 'Month-end executive pack', cadence: 'Monthly · Last business day', nextRun: '30 Apr · 19:00', recipients: 'You' },
    { title: 'Quarter-end tax prep ledger', cadence: 'Quarterly', nextRun: '30 Jun · 18:00', recipients: 'You + CA office' }
  ],
  categories: [
    { name: 'Executive', value: 32 },
    { name: 'Risk', value: 24 },
    { name: 'Planning', value: 18 },
    { name: 'Tax', value: 14 },
    { name: 'Custom', value: 12 }
  ],
  notes: [
    { title: 'Report center is backend-ready', detail: 'UI is already separated from route handlers so a real export engine can be connected later without redesign.' },
    { title: 'Scheduled delivery surface is included', detail: 'Recipients, cadence, and run status are represented in dedicated typed structures.' },
    { title: 'Date-range and report-type patterns are established', detail: 'This will help when connecting real PDF/XLS generation and export queues.' }
  ]
};
