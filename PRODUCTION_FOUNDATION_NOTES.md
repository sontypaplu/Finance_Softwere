Production Foundation Refactor
=============================

This package implements the highest-value backend-ready foundation work without pretending that a full production backend already exists.

Implemented in this pass:
- Prisma schema and client scaffold
- Secure password hashing (bcryptjs)
- Signed session cookies (jose)
- Rate limiting helpers
- Zod validation for auth, portfolios, and transactions
- Service layer modules for auth, workspaces, portfolios, accounts, securities, transactions, holdings, alerts, and reports
- Runtime in-memory repository fallback for development when DATABASE_URL is not configured
- Audit log writer with database-first / runtime-fallback behavior
- Portfolio API routes (GET, POST, PATCH, DELETE)
- Auth routes (login, signup, logout, me)
- Middleware protection for /terminal and /control-center
- Transaction calculation foundation: FIFO, holdings, average cost, realized/unrealized P&L, cash balance
- Unit tests for validation and calculations
- Playwright baseline config and a starter auth test

Important constraints:
- If DATABASE_URL is not configured, the app uses the runtime in-memory repository fallback honestly.
- Existing UI routes were preserved.
- Existing premium UI was preserved where possible.
- Full page-by-page replacement of all seed-backed terminal routes is intentionally progressive, not all-at-once.
