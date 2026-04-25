Part 4 adds the finance intelligence layer directly into the approved terminal structure.

Included routes:
- /terminal/watchlist
- /terminal/calendar
- /terminal/rebalancing
- /terminal/goals
- /terminal/reports

Included API routes:
- /api/terminal/watchlist
- /api/terminal/calendar
- /api/terminal/rebalancing
- /api/terminal/goals
- /api/terminal/reports

New data contracts:
- lib/types/terminal-intelligence.ts

New separated data layer:
- lib/data/terminal-intelligence-seed.ts

Updated navigation/search:
- components/terminal/terminal-shell.tsx
- components/terminal/sidebar.tsx
- lib/data/terminal-ops-seed.ts

Updated chart exports:
- components/terminal/charts.tsx
