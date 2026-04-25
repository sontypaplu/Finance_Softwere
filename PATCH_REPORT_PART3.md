Part 3 adds the operating layer to the approved finance terminal.

New pages:
- /terminal/assets/[symbol]
- /terminal/transactions
- /terminal/master
- /terminal/settings
- /terminal/profile

New features:
- Global command search overlay
- Alerts drawer from bell button
- Asset detail page
- Transaction entry page
- Master data manager page
- Settings page
- Profile page
- Separate API routes and seed data layer for each new surface

Changed files:
- components/terminal/terminal-shell.tsx
- components/terminal/sidebar.tsx
- components/terminal/settings-menu.tsx

New files:
- components/terminal/global-search.tsx
- components/terminal/alerts-drawer.tsx
- components/terminal/asset-detail-client.tsx
- components/terminal/transaction-entry-client.tsx
- components/terminal/master-data-client.tsx
- components/terminal/settings-page-client.tsx
- components/terminal/profile-page-client.tsx
- app/(app)/terminal/assets/[symbol]/page.tsx
- app/(app)/terminal/transactions/page.tsx
- app/(app)/terminal/master/page.tsx
- app/(app)/terminal/settings/page.tsx
- app/(app)/terminal/profile/page.tsx
- app/api/terminal/search/route.ts
- app/api/terminal/assets/[symbol]/route.ts
- app/api/terminal/transactions/route.ts
- app/api/terminal/alerts/route.ts
- app/api/terminal/master/route.ts
- app/api/terminal/settings/route.ts
- lib/types/terminal-ops.ts
- lib/data/terminal-ops-seed.ts
