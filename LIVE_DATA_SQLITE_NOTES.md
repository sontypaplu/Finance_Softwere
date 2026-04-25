LIVE DATA PHASE — SQLITE + YFINANCE-LABELLED YAHOO ADAPTER + MARKETAUX

What changed:
- Prisma datasource switched to SQLite for local desktop-friendly development.
- .env.example now targets a local SQLite database.
- Added server-side market data adapter service.
- Added server-side Indian finance news adapter service.
- Added terminal API routes that use live/fallback provider services.
- Asset detail and watchlist now try live market data before falling back to seeded UI data.

Important notes:
- MARKET_DATA_PROVIDER is set to yfinance for app configuration continuity, but the adapter uses Yahoo Finance HTTP endpoints from the Next.js backend runtime.
- NEWS_PROVIDER is set to marketaux when an API key is available.
- If NEWS_PROVIDER_API_KEY is empty, the project falls back to the existing RSS-based finance news helper.

Run steps:
1. npm install
2. copy .env.example to .env
3. npx prisma generate
4. npx prisma db push
5. npm run db:seed
6. npm run dev

Example .env:
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="change_me_to_a_long_random_secret"
MARKET_DATA_PROVIDER="yfinance"
NEWS_PROVIDER="marketaux"
NEWS_PROVIDER_API_KEY=""
APP_URL="http://localhost:3000"
