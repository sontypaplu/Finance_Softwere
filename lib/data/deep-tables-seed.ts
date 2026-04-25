import type { DeepTablesPayload } from '@/lib/types/deep-tables';

export const deepTablesSeed: DeepTablesPayload = {
  holdingsMaster: [
    { instrument:'NVDA', account:'Growth Ledger', assetClass:'Equity', sector:'Technology', geography:'US', strategy:'AI Growth', quantity:'366 sh', avgCost:'$832.10', ltp:'$1,122.40', marketValue:'$408,220', weight:'8.4%', dayChangePct:'+2.96%', dayChangeValue:'+$11,760', unrealized:'+34.8%', realized:'+$7,420', totalReturn:'+58.2%', dividendYield:'0.03%', yieldOnCost:'0.04%', beta:'1.22', volatility:'28.4%', sharpe:'1.41', sortino:'2.05', maxDrawdown:'-16.1%', correlation:'0.71', contributionReturn:'+4.8 pts', contributionRisk:'13.4%', concentration:'High', rebalanceGap:'+1.4%', taxStatus:'Mixed lots', stalePrice:'No' },
    { instrument:'AAPL', account:'Core Equity', assetClass:'Equity', sector:'Technology', geography:'US', strategy:'Quality Core', quantity:'1609 sh', avgCost:'$176.40', ltp:'$214.90', marketValue:'$345,900', weight:'7.1%', dayChangePct:'+1.24%', dayChangeValue:'+$4,240', unrealized:'+22.1%', realized:'+$3,180', totalReturn:'+22.1%', dividendYield:'0.49%', yieldOnCost:'0.60%', beta:'0.94', volatility:'19.2%', sharpe:'1.12', sortino:'1.66', maxDrawdown:'-10.8%', correlation:'0.76', contributionReturn:'+1.9 pts', contributionRisk:'8.6%', concentration:'Medium', rebalanceGap:'+0.6%', taxStatus:'LTCG leaning', stalePrice:'No' },
    { instrument:'HDFCBANK', account:'India Core', assetClass:'Equity', sector:'Financials', geography:'India', strategy:'India Quality', quantity:'1494 sh', avgCost:'₹1,563', ltp:'₹1,756', marketValue:'$262,440', weight:'5.4%', dayChangePct:'+0.82%', dayChangeValue:'+$2,180', unrealized:'+12.3%', realized:'+$820', totalReturn:'+12.3%', dividendYield:'1.20%', yieldOnCost:'1.35%', beta:'0.86', volatility:'15.8%', sharpe:'0.94', sortino:'1.38%', maxDrawdown:'-8.2%', correlation:'0.49', contributionReturn:'+0.9 pts', contributionRisk:'5.4%', concentration:'Medium', rebalanceGap:'-0.3%', taxStatus:'LTCG', stalePrice:'No' },
    { instrument:'SCHD', account:'Income Sleeve', assetClass:'ETF', sector:'Dividend Equity', geography:'US', strategy:'Income', quantity:'520 sh', avgCost:'$74.31', ltp:'$72.90', marketValue:'$37,910', weight:'4.2%', dayChangePct:'-0.24%', dayChangeValue:'-$92', unrealized:'-1.9%', realized:'+$1,120', totalReturn:'+9.8%', dividendYield:'3.71%', yieldOnCost:'3.90%', beta:'0.72', volatility:'11.1%', sharpe:'0.82', sortino:'1.24', maxDrawdown:'-7.4%', correlation:'0.58', contributionReturn:'+0.4 pts', contributionRisk:'3.1%', concentration:'Low', rebalanceGap:'-0.8%', taxStatus:'Harvest candidate', stalePrice:'No' }
  ],
  transactionLedger: [
    { date:'21 Apr 2026', account:'Core Equity', symbol:'AAPL', txnType:'Buy', units:'280 sh', executionPrice:'$210.40', fees:'$18', taxes:'$0', fxRate:'1.00', broker:'Schwab', strategy:'Quality Core', tags:'rebalance,core', notes:'Added on pullback' },
    { date:'20 Apr 2026', account:'Income Sleeve', symbol:'SCHD', txnType:'Dividend', units:'520 sh', executionPrice:'—', fees:'$0', taxes:'$124', fxRate:'1.00', broker:'Schwab', strategy:'Income', tags:'cashflow,passive', notes:'Quarterly distribution booked' },
    { date:'19 Apr 2026', account:'Growth Ledger', symbol:'TSLA', txnType:'Sell', units:'40 sh', executionPrice:'$542.00', fees:'$12', taxes:'$208', fxRate:'1.00', broker:'IBKR', strategy:'Tactical Trim', tags:'trim,risk', notes:'Reduced concentration' },
    { date:'18 Apr 2026', account:'Treasury', symbol:'Cash Reserve', txnType:'Deposit', units:'—', executionPrice:'—', fees:'$0', taxes:'$0', fxRate:'1.00', broker:'Axis', strategy:'Liquidity', tags:'cash,runway', notes:'Monthly reserve top-up' }
  ],
  taxLots: [
    { security:'NVDA', lotDate:'14 Mar 2026', quantityRemaining:'8 sh', costBasis:'$8,098', currentValue:'$8,979', holdingPeriod:'36 days', unrealizedGain:'+$881', classification:'STCG', harvestFlag:'No' },
    { security:'AAPL', lotDate:'03 Feb 2026', quantityRemaining:'160 sh', costBasis:'$30,208', currentValue:'$34,384', holdingPeriod:'76 days', unrealizedGain:'+$4,176', classification:'STCG', harvestFlag:'No' },
    { security:'SCHD', lotDate:'17 Nov 2025', quantityRemaining:'520 sh', costBasis:'$38,640', currentValue:'$37,910', holdingPeriod:'156 days', unrealizedGain:'-$730', classification:'LTCG', harvestFlag:'Candidate' },
    { security:'EM Bond ETF', lotDate:'09 Sep 2025', quantityRemaining:'300 sh', costBasis:'$14,580', currentValue:'$13,980', holdingPeriod:'223 days', unrealizedGain:'-$600', classification:'LTCG', harvestFlag:'Candidate' }
  ],
  attribution: [
    { bucket:'US Growth', byAsset:'+3.6 pts', byAssetClass:'+4.8 pts', bySector:'+4.1 pts', byGeography:'+4.0 pts', byStrategy:'+3.9 pts', byAccount:'+3.7 pts', benchmarkRelative:'+2.2 pts' },
    { bucket:'India Core', byAsset:'+1.1 pts', byAssetClass:'+0.9 pts', bySector:'+0.8 pts', byGeography:'+1.4 pts', byStrategy:'+1.2 pts', byAccount:'+1.0 pts', benchmarkRelative:'+0.5 pts' },
    { bucket:'Income Sleeve', byAsset:'+0.4 pts', byAssetClass:'+0.6 pts', bySector:'+0.3 pts', byGeography:'+0.4 pts', byStrategy:'+0.9 pts', byAccount:'+0.5 pts', benchmarkRelative:'+0.2 pts' }
  ],
  riskTable: [
    { sleeve:'Core Multi-Asset', volatility:'11.9%', downsideDeviation:'7.1%', var95:'-2.8%', cvar95:'-4.1%', beta:'0.94', alpha:'3.1%', informationRatio:'0.74', trackingError:'4.2%', rSquared:'0.74', skewness:'0.12', kurtosis:'2.66', drawdownDuration:'42 d', recoveryTime:'58 d' },
    { sleeve:'Growth Sleeve', volatility:'18.8%', downsideDeviation:'11.3%', var95:'-4.6%', cvar95:'-6.9%', beta:'1.18', alpha:'4.4%', informationRatio:'0.88', trackingError:'6.8%', rSquared:'0.69', skewness:'0.04', kurtosis:'3.12', drawdownDuration:'61 d', recoveryTime:'83 d' },
    { sleeve:'Income Sleeve', volatility:'8.2%', downsideDeviation:'5.0%', var95:'-1.7%', cvar95:'-2.9%', beta:'0.66', alpha:'1.1%', informationRatio:'0.39', trackingError:'2.7%', rSquared:'0.58', skewness:'0.28', kurtosis:'2.14', drawdownDuration:'27 d', recoveryTime:'31 d' }
  ],
  cashflowIncome: [
    { month:'Jan', salary:'$10,200', business:'$4,100', rent:'$2,600', dividend:'$1,800', interest:'$900', fixedExpenses:'$7,100', variableExpenses:'$3,900', investmentOutflows:'$7,000', debtPayments:'$2,090', monthlySavings:'$5,510', freeCashFlow:'$10,510', deploymentRate:'64%' },
    { month:'Feb', salary:'$10,200', business:'$3,700', rent:'$2,600', dividend:'$1,700', interest:'$1,000', fixedExpenses:'$7,100', variableExpenses:'$4,500', investmentOutflows:'$6,000', debtPayments:'$2,090', monthlySavings:'$4,510', freeCashFlow:'$8,510', deploymentRate:'59%' },
    { month:'Mar', salary:'$10,200', business:'$4,300', rent:'$2,700', dividend:'$2,100', interest:'$1,000', fixedExpenses:'$7,100', variableExpenses:'$4,800', investmentOutflows:'$7,000', debtPayments:'$2,090', monthlySavings:'$5,310', freeCashFlow:'$10,310', deploymentRate:'61%' }
  ],
  liabilities: [
    { lender:'Home Loan', principalOutstanding:'$182,000', interestRate:'7.8%', emi:'$1,880', tenureLeft:'11y', debtServiceRatio:'12.8%', prepaymentImpact:'Save $26K lifetime interest on 10% prepay' },
    { lender:'Auto Loan', principalOutstanding:'$12,400', interestRate:'9.2%', emi:'$420', tenureLeft:'2y', debtServiceRatio:'2.9%', prepaymentImpact:'Save $540 on immediate closure' },
    { lender:'Credit Line', principalOutstanding:'$4,800', interestRate:'15.5%', emi:'$210', tenureLeft:'Rolling', debtServiceRatio:'1.4%', prepaymentImpact:'Highest-priority payoff' }
  ],
  alerts: [
    { type:'Over-allocation', title:'NVDA above policy band', severity:'High', detail:'Single-name exposure is above preferred ceiling after the recent rally.', action:'Review trim size' },
    { type:'Concentration breach', title:'Top 10 weights elevated', severity:'Medium', detail:'Top-10 holdings concentration remains above the internal target band.', action:'Run rebalance' },
    { type:'Stale price', title:'EM Bond ETF close delayed', severity:'Low', detail:'Most recent pricing snapshot is not final for one international fund.', action:'Refresh prices' },
    { type:'Cash warning', title:'Runway below preferred band', severity:'Medium', detail:'Cash reserve dipped below the preferred six-month threshold.', action:'Build reserve' },
    { type:'Harvesting', title:'SCHD loss available', severity:'Low', detail:'Loss can be harvested if wash-sale constraints remain clean.', action:'Check lot window' }
  ]
};
