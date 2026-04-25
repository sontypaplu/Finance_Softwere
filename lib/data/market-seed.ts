export const marketTicker = [
  { symbol: 'AAPL', price: '208.44', change: '+1.24%', positive: true },
  { symbol: 'NVDA', price: '982.31', change: '+2.96%', positive: true },
  { symbol: 'MSFT', price: '431.82', change: '+0.66%', positive: true },
  { symbol: 'TSLA', price: '171.58', change: '-1.83%', positive: false },
  { symbol: 'NIFTY 50', price: '23,921.70', change: '+0.58%', positive: true },
  { symbol: 'BTC', price: '84,270', change: '-0.74%', positive: false },
  { symbol: 'GOLD', price: '2,346.11', change: '+0.41%', positive: true },
  { symbol: 'RELIANCE', price: '2,963.40', change: '+1.18%', positive: true }
];

export const overviewSeed = {
  kpis: [
    { label: 'Net Worth', value: '$4.86M', change: '+2.4%', tone: 'up' },
    { label: '1D P&L', value: '+$46.2K', change: '+0.96%', tone: 'up' },
    { label: 'Cash Balance', value: '$318.5K', change: '-4.2%', tone: 'down' },
    { label: 'YTD Return', value: '+18.4%', change: '+4.1 pts', tone: 'up' },
    { label: 'Dividend Run Rate', value: '$92.1K', change: '+11.2%', tone: 'up' },
    { label: 'Max Drawdown', value: '-8.3%', change: 'Contained', tone: 'flat' }
  ],
  trend: [
    { month: 'Jan', portfolio: 3.98, benchmark: 3.84 },
    { month: 'Feb', portfolio: 4.06, benchmark: 3.9 },
    { month: 'Mar', portfolio: 4.12, benchmark: 3.96 },
    { month: 'Apr', portfolio: 4.25, benchmark: 4.05 },
    { month: 'May', portfolio: 4.31, benchmark: 4.1 },
    { month: 'Jun', portfolio: 4.38, benchmark: 4.16 },
    { month: 'Jul', portfolio: 4.51, benchmark: 4.21 },
    { month: 'Aug', portfolio: 4.63, benchmark: 4.28 },
    { month: 'Sep', portfolio: 4.71, benchmark: 4.34 },
    { month: 'Oct', portfolio: 4.78, benchmark: 4.42 },
    { month: 'Nov', portfolio: 4.82, benchmark: 4.47 },
    { month: 'Dec', portfolio: 4.86, benchmark: 4.52 }
  ],
  allocation: [
    { name: 'Equities', value: 48 },
    { name: 'Funds', value: 22 },
    { name: 'Fixed Income', value: 14 },
    { name: 'Alternatives', value: 10 },
    { name: 'Cash', value: 6 }
  ],
  news: [
    {
      id: 'n1',
      title: 'Fed tone softens as markets reprice rate path',
      category: 'Macro Pulse',
      image: '/news/macro-wave.svg',
      summary: 'Treasury yields eased and growth names rebounded as the market priced a more patient policy path.',
      badge: 'Breaking'
    },
    {
      id: 'n2',
      title: 'AI infrastructure leaders continue capex rotation',
      category: 'Equity Watch',
      image: '/news/ai-grid.svg',
      summary: 'Mega-cap platforms and semiconductor supply chains remained the focus for institutional flows.',
      badge: 'Live'
    },
    {
      id: 'n3',
      title: 'Gold and defensives firm as volatility compresses',
      category: 'Risk Lens',
      image: '/news/gold-defense.svg',
      summary: 'Safe-haven allocations rose modestly while realized volatility stayed below recent averages.',
      badge: 'New'
    }
  ],
  recent: [
    { id: 't1', title: 'Bought Apple Inc.', meta: 'AAPL · Core Growth', amount: '$62,400', date: 'Today' },
    { id: 't2', title: 'Dividend Received', meta: 'SCHD · Income Sleeve', amount: '$4,120', date: 'Today' },
    { id: 't3', title: 'Added to Cash Reserve', meta: 'Primary Treasury Account', amount: '$15,000', date: 'Yesterday' },
    { id: 't4', title: 'Reduced Tesla Exposure', meta: 'TSLA · Tactical Trim', amount: '$21,680', date: 'Yesterday' }
  ],
  alerts: [
    { title: 'Cash runway below strategic target', detail: 'Liquidity cover slipped to 4.6 months. Consider a reserve top-up.' },
    { title: 'Tech sleeve above target by 3.1%', detail: 'Review allocation drift before next rebalance window.' },
    { title: '2 assets near earnings volatility event', detail: 'AAPL and NVDA implied move above 4%. Risk desk watchlist updated.' }
  ]
};
