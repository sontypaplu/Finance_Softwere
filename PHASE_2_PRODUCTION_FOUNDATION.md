Phase 2 Production Foundation
============================

What changed
------------
1. Secure auth foundation
   - Password hashing with bcryptjs
   - Signed session cookies with jose
   - Login/signup validation with Zod
   - Logout and current-user APIs
   - Middleware for /terminal and /control-center
   - Rate limiting on auth endpoints
   - Audit logging for auth events

2. Database-ready architecture
   - Prisma schema for users, workspaces, portfolios, accounts, securities, transactions, holding lots, price history, alerts, audits, reports
   - Prisma client singleton
   - .env.example added
   - Prisma seed script added

3. Service layer
   - Auth, workspace, portfolio, account, security, transaction, holding, alert, report, overview services
   - Database-first with runtime-store fallback when DATABASE_URL is not configured

4. Transaction engine foundation
   - Validation for transaction posting
   - Duplicate detection
   - SELL quantity guard using FIFO open lots
   - FIFO lot matching
   - Holdings quantity
   - Average cost
   - Realized P&L
   - Unrealized P&L helper
   - Cash balance calculation

5. Portfolio API foundation
   - GET /api/portfolios
   - POST /api/portfolios
   - PATCH /api/portfolios/:id
   - DELETE /api/portfolios/:id
   - Portfolio workspace provider now prefers API and falls back to local storage

6. Quality
   - Unit tests for transaction schema and calculations
   - Playwright config and starter auth test
   - package.json scripts for typecheck, test, e2e, migrate, seed

How to run
----------
1. npm install
2. copy .env.example to .env
3. fill DATABASE_URL and SESSION_SECRET
4. npm run db:migrate
5. npm run db:seed
6. npm run dev

If DATABASE_URL is empty
------------------------
The app still runs using the runtime in-memory repository fallback.
This keeps the UI functional while remaining honest that production persistence is not yet active.

Next recommended phase
----------------------
- Move portfolio analytics, deep tables, and ratio center to calculated service-backed data
- Add real watchlist CRUD and report persistence
- Add session management UI, password change, and audit explorer on settings/profile
