import type { ChartStudioPayload } from '@/lib/types/chart-studio';

export const chartStudioSeed: ChartStudioPayload = {
  hero: [
    { label: 'Chart coverage', value: '24', change: 'Master set active', tone: 'up' },
    { label: 'Ratio groups', value: '9', change: 'Expanded', tone: 'up' },
    { label: 'Heatmaps', value: '2', change: 'Monthly + correlation', tone: 'up' },
    { label: 'Allocation views', value: '6', change: 'Full mix', tone: 'up' },
    { label: 'Planning visuals', value: '7', change: 'Cash + debt + goals', tone: 'up' },
    { label: 'Risk visuals', value: '6', change: 'Stress + beta + drawdown', tone: 'up' }
  ],
  cumulative: [
    { month:'Jan', portfolio:100, benchmark:100 },{ month:'Feb', portfolio:102, benchmark:101 },{ month:'Mar', portfolio:104, benchmark:102 },{ month:'Apr', portfolio:103, benchmark:101 },{ month:'May', portfolio:106, benchmark:103 },{ month:'Jun', portfolio:108, benchmark:104 },{ month:'Jul', portfolio:111, benchmark:106 },{ month:'Aug', portfolio:114, benchmark:108 },{ month:'Sep', portfolio:116, benchmark:109 },{ month:'Oct', portfolio:119, benchmark:111 },{ month:'Nov', portfolio:121, benchmark:112 },{ month:'Dec', portfolio:124, benchmark:114 }
  ],
  rolling: [
    { month:'Jan', oneMonth:1.2, threeMonth:3.1, sixMonth:6.8, oneYear:14.2 },
    { month:'Feb', oneMonth:0.8, threeMonth:3.4, sixMonth:7.1, oneYear:14.6 },
    { month:'Mar', oneMonth:-0.6, threeMonth:2.8, sixMonth:6.4, oneYear:13.8 },
    { month:'Apr', oneMonth:1.4, threeMonth:3.0, sixMonth:6.9, oneYear:14.4 },
    { month:'May', oneMonth:1.1, threeMonth:3.3, sixMonth:7.2, oneYear:15.0 },
    { month:'Jun', oneMonth:1.5, threeMonth:3.7, sixMonth:7.6, oneYear:15.6 }
  ],
  dailyPnl: [
    { day:'Mon', value: 8200 },{ day:'Tue', value:-2400 },{ day:'Wed', value:4100 },{ day:'Thu', value:5600 },{ day:'Fri', value:-1300 },{ day:'Mon2', value:2800 },{ day:'Tue2', value:3300 },{ day:'Wed2', value:-900 },{ day:'Thu2', value:4700 },{ day:'Fri2', value:6200 }
  ],
  realizedVsUnrealized: [
    { label:'Equity', realized:12.4, unrealized:28.2 },{ label:'ETF', realized:6.8, unrealized:11.6 },{ label:'Fixed Income', realized:1.1, unrealized:2.7 },{ label:'Gold', realized:0.8, unrealized:4.4 }
  ],
  incomeVsCapital: [ { name:'Capital appreciation', value: 74 }, { name:'Income return', value: 26 } ],
  waterfall: [ { name:'Allocation', value:1.1 }, { name:'Selection', value:1.6 }, { name:'FX', value:-0.2 }, { name:'Income', value:0.9 }, { name:'Costs', value:-0.3 } ],
  assetAllocation: [ { name:'US Equity', size:34 },{ name:'India Equity', size:16 },{ name:'Global ETFs', size:14 },{ name:'Fixed Income', size:11 },{ name:'Cash', size:9 },{ name:'Gold', size:8 },{ name:'REITs', size:5 },{ name:'Other', size:3 } ],
  sectorAllocation: [ { name:'Technology', value:28 },{ name:'Financials', value:16 },{ name:'Dividend Eq.', value:12 },{ name:'Fixed Income', value:11 },{ name:'Gold', value:8 } ],
  geographyAllocation: [ { name:'US', value:49 },{ name:'India', value:23 },{ name:'Global', value:14 },{ name:'Europe', value:8 },{ name:'Cash', value:6 } ],
  marketCapAllocation: [ { name:'Mega', value:42 },{ name:'Large', value:24 },{ name:'Mid', value:14 },{ name:'Small', value:8 },{ name:'Other', value:12 } ],
  accountAllocation: [ { name:'Growth Ledger', value:28 },{ name:'Core Equity', value:31 },{ name:'India Core', value:19 },{ name:'Income Sleeve', value:12 },{ name:'Treasury', value:10 } ],
  strategyAllocation: [ { name:'Core Compounders', value:29 },{ name:'Growth Alpha', value:24 },{ name:'Income', value:18 },{ name:'Defensive', value:17 },{ name:'Tactical', value:12 } ],
  topHoldings: [ { name:'NVDA', value:8.4 },{ name:'AAPL', value:7.1 },{ name:'HDFCBANK', value:5.4 },{ name:'SCHD', value:4.2 },{ name:'Gold ETF', value:3.1 } ],
  correlation: { labels:['NVDA','AAPL','HDFCBANK','SCHD','GOLD'], matrix:[[1,0.78,0.41,0.35,-0.18],[0.78,1,0.44,0.38,-0.12],[0.41,0.44,1,0.22,0.06],[0.35,0.38,0.22,1,-0.08],[-0.18,-0.12,0.06,-0.08,1]] },
  riskContribution: [ { name:'NVDA', value:13.4 },{ name:'AAPL', value:8.6 },{ name:'US Growth Basket', value:11.2 },{ name:'India Core', value:7.1 },{ name:'Income Sleeve', value:4.8 } ],
  betaExposure: [ { name:'US Growth', value:1.14 },{ name:'Core Equity', value:0.98 },{ name:'India Core', value:0.86 },{ name:'Income', value:0.71 },{ name:'Gold', value:0.12 } ],
  drawdownDistribution: [ { bucket:'0 to -2%', value: 18 },{ bucket:'-2 to -4%', value: 10 },{ bucket:'-4 to -6%', value: 5 },{ bucket:'-6 to -8%', value: 2 },{ bucket:'<-8%', value: 1 } ],
  scenarioStress: [ { name:'US recession', value:-8.4 },{ name:'Rates shock', value:-5.1 },{ name:'Tech derating', value:-11.2 },{ name:'Oil spike', value:-3.4 },{ name:'India correction', value:-6.8 } ],
  monthlyIncomeExpense: [ { month:'Jan', income:21, expenses:11, invested:7 },{ month:'Feb', income:20, expenses:12, invested:6 },{ month:'Mar', income:22, expenses:12, invested:7 },{ month:'Apr', income:23, expenses:13, invested:8 },{ month:'May', income:23, expenses:12, invested:8 },{ month:'Jun', income:24, expenses:13, invested:9 } ],
  savingsRate: [ { month:'Jan', rate:37 },{ month:'Feb', rate:34 },{ month:'Mar', rate:38 },{ month:'Apr', rate:39 },{ month:'May', rate:40 },{ month:'Jun', rate:41 } ],
  debtPayoff: [ { month:'Jan', home:182, auto:12.4, credit:4.8 },{ month:'Feb', home:180.6, auto:11.9, credit:4.3 },{ month:'Mar', home:179.2, auto:11.3, credit:3.8 },{ month:'Apr', home:177.8, auto:10.8, credit:3.2 },{ month:'May', home:176.4, auto:10.2, credit:2.6 },{ month:'Jun', home:175.0, auto:9.7, credit:2.1 } ],
  cashRunway: [ { month:'Jan', value:6.8 },{ month:'Feb', value:6.9 },{ month:'Mar', value:7.1 },{ month:'Apr', value:7.4 },{ month:'May', value:7.8 },{ month:'Jun', value:8.2 } ],
  emergencyFund: [ { month:'Jan', value:54 },{ month:'Feb', value:56 },{ month:'Mar', value:59 },{ month:'Apr', value:61 },{ month:'May', value:64 },{ month:'Jun', value:68 } ],
  dividendInterestTimeline: [ { month:'Jan', dividends:1.8, interest:0.9, rent:2.6 },{ month:'Feb', dividends:1.7, interest:1.0, rent:2.6 },{ month:'Mar', dividends:2.1, interest:1.0, rent:2.7 },{ month:'Apr', dividends:2.0, interest:1.0, rent:2.8 },{ month:'May', dividends:2.2, interest:1.1, rent:2.8 },{ month:'Jun', dividends:2.3, interest:1.1, rent:2.9 } ],
  obligations: [ { title:'Home EMI', due:'02 May', amount:'$1,880', type:'Debt' },{ title:'SIP Batch', due:'03 May', amount:'$2,500', type:'Investment' },{ title:'Insurance Premium', due:'12 May', amount:'$740', type:'Expense' },{ title:'School Fee', due:'18 May', amount:'$520', type:'Expense' } ],
  goals: [ { title:'Retirement Corpus', funded:58, target:'$2.5M', current:'$1.45M' },{ title:'Emergency Reserve', funded:82, target:'$84K', current:'$68K' },{ title:'Travel Fund', funded:47, target:'$18K', current:'$8.5K' } ],
  funnel: [ { stage:'Gross Income', value:100 },{ stage:'Post Tax', value:78 },{ stage:'Expenses', value:42 },{ stage:'Savings', value:36 },{ stage:'Investments', value:24 } ],
  sankey: [ { from:'Income', to:'Expenses', value:'42%' },{ from:'Income', to:'Savings', value:'36%' },{ from:'Savings', to:'Investments', value:'24%' },{ from:'Savings', to:'Cash Buffer', value:'12%' } ],
  heatmap: [
    { year:'2025', months:[{ label:'Jan', value:1.6 },{ label:'Feb', value:0.8 },{ label:'Mar', value:-1.4 },{ label:'Apr', value:2.2 },{ label:'May', value:1.5 },{ label:'Jun', value:0.9 },{ label:'Jul', value:2.4 },{ label:'Aug', value:1.2 },{ label:'Sep', value:-0.6 },{ label:'Oct', value:1.1 },{ label:'Nov', value:2.6 },{ label:'Dec', value:1.9 }] },
    { year:'2026', months:[{ label:'Jan', value:1.2 },{ label:'Feb', value:0.4 },{ label:'Mar', value:-0.8 },{ label:'Apr', value:1.8 },{ label:'May', value:1.1 },{ label:'Jun', value:1.4 },{ label:'Jul', value:2.1 },{ label:'Aug', value:1.0 },{ label:'Sep', value:0.7 },{ label:'Oct', value:1.8 },{ label:'Nov', value:1.3 },{ label:'Dec', value:0.9 }] }
  ],
  drawdown: [ { month:'Jan', portfolio:0, benchmark:0 },{ month:'Feb', portfolio:-1.2, benchmark:-0.8 },{ month:'Mar', portfolio:-2.3, benchmark:-1.6 },{ month:'Apr', portfolio:-4.4, benchmark:-3.2 },{ month:'May', portfolio:-2.8, benchmark:-2.1 },{ month:'Jun', portfolio:-1.1, benchmark:-0.9 } ]
};
