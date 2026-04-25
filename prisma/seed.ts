import { prisma } from '../lib/db/prisma';
import { hashPassword } from '../lib/security/password';

async function main() {
  const email = 'demo@aurelius.finance';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await hashPassword('Demo@1234');
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email,
      passwordHash,
      role: 'PORTFOLIO_MANAGER'
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Aurelius Demo Workspace',
      ownerId: user.id,
      members: {
        create: [{ userId: user.id, role: 'OWNER' }]
      },
      benchmarks: {
        create: [
          { name: 'S&P 500', currency: 'USD' },
          { name: 'NIFTY 50', currency: 'INR' }
        ]
      }
    }
  });

  const securities = await Promise.all([
    prisma.security.create({ data: { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', assetClass: 'Equity', currency: 'USD', sector: 'Technology', country: 'US' } }),
    prisma.security.create({ data: { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', assetClass: 'Equity', currency: 'USD', sector: 'Technology', country: 'US' } }),
    prisma.security.create({ data: { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', assetClass: 'Equity', currency: 'USD', sector: 'Technology', country: 'US' } }),
    prisma.security.create({ data: { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', exchange: 'NSE', assetClass: 'Equity', currency: 'INR', sector: 'Financials', country: 'IN' } }),
    prisma.security.create({ data: { symbol: 'RELIANCE.NS', name: 'Reliance Industries', exchange: 'NSE', assetClass: 'Equity', currency: 'INR', sector: 'Energy', country: 'IN' } }),
    prisma.security.create({ data: { symbol: 'GC=F', name: 'Gold Futures', exchange: 'COMEX', assetClass: 'Commodity', currency: 'USD', sector: 'Metals', country: 'Global' } })
  ]);

  const portfolio = await prisma.portfolio.create({
    data: {
      workspaceId: workspace.id,
      name: 'Portfolio 1',
      baseCurrency: 'USD',
      notes: 'Seeded default portfolio',
      accounts: {
        create: [
          { name: 'Growth Ledger', broker: 'Interactive Brokers', accountType: 'Brokerage', currency: 'USD' },
          { name: 'India Core', broker: 'Zerodha', accountType: 'Brokerage', currency: 'INR' }
        ]
      }
    },
    include: { accounts: true }
  });

  const usdAccount = portfolio.accounts.find((item) => item.currency === 'USD');
  const inrAccount = portfolio.accounts.find((item) => item.currency === 'INR');
  const bySymbol = Object.fromEntries(securities.map((item) => [item.symbol, item]));

  if (usdAccount) {
    await prisma.transaction.createMany({
      data: [
        {
          portfolioId: portfolio.id,
          accountId: usdAccount.id,
          securityId: bySymbol['AAPL'].id,
          type: 'BUY',
          tradeDate: new Date('2026-01-08'),
          settlementDate: new Date('2026-01-10'),
          quantity: 50,
          price: 210,
          grossAmount: 10500,
          fees: 10,
          taxes: 0,
          netAmount: 10510,
          currency: 'USD',
          fxRateToBase: 1,
          status: 'POSTED',
          createdById: user.id
        },
        {
          portfolioId: portfolio.id,
          accountId: usdAccount.id,
          securityId: bySymbol['NVDA'].id,
          type: 'BUY',
          tradeDate: new Date('2026-02-03'),
          settlementDate: new Date('2026-02-05'),
          quantity: 12,
          price: 950,
          grossAmount: 11400,
          fees: 8,
          taxes: 0,
          netAmount: 11408,
          currency: 'USD',
          fxRateToBase: 1,
          status: 'POSTED',
          createdById: user.id
        }
      ]
    });
  }

  if (inrAccount) {
    await prisma.transaction.createMany({
      data: [
        {
          portfolioId: portfolio.id,
          accountId: inrAccount.id,
          securityId: bySymbol['HDFCBANK.NS'].id,
          type: 'BUY',
          tradeDate: new Date('2026-01-20'),
          settlementDate: new Date('2026-01-22'),
          quantity: 120,
          price: 1710,
          grossAmount: 205200,
          fees: 50,
          taxes: 0,
          netAmount: 205250,
          currency: 'INR',
          fxRateToBase: 0.012,
          status: 'POSTED',
          createdById: user.id
        }
      ]
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
