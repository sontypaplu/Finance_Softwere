# Finance Terminal Part 1

This starter includes:
- Premium login page
- Premium signup page with staged verification flow
- Executive Overview terminal homepage
- Hover-open / click-lock top nav dropdowns
- Hover-open / click-lock sidebar
- Account/settings menu
- Sliding market ticker bar
- News spotlight carousel with local SVG artwork
- API routes that feed the UI from separate data files

## Run

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Demo sign in

- Email: `demo@aurelius.finance`
- Password: `Demo@1234`

## Data separation

UI reads through these routes:
- `/api/terminal/overview`
- `/api/terminal/markets`
- `/api/terminal/news`
- `/api/auth/login`
- `/api/auth/signup`

Current source files:
- `lib/data/market-seed.ts`
- `lib/data/seed-users.ts`

Later, you can keep the UI and replace only the source/adapters with backend services.

## Important note

Authentication, account verification, and log retention are only staged for UI/review structure in this part. Real database persistence, login logs, 30-day deletion logic, account verification delivery, and production auth security still need backend implementation.
