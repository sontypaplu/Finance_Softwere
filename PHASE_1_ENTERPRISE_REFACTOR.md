# Phase 1–6 enterprise frontend refactor

## What changed
- Added shared contracts and API envelope types under `lib/contracts/*`
- Added shared fetch client under `lib/api/fetch-client.ts`
- Added mock envelope builder under `lib/mock/envelope.ts`
- Added permission contracts, role definitions, and permission helpers under `lib/permissions/*`
- Added registry-driven navigation under `lib/navigation/registry.ts`
- Added enterprise UI primitives under `components/enterprise/*`
- Added demo session provider for permission-aware navigation
- Added feature folders for `overview`, `alerts`, `transactions`, and `control-center`
- Refactored overview, alerts, and transactions to use shared hooks and typed envelopes
- Added Control Center foundation with dashboard and registry-driven module pages

## Important truthfulness note
Everything is still mock/demo-backed. No real backend, DB, RBAC service, tenancy service, or audit persistence exists yet.

## Safe routes preserved
All existing terminal routes remain available.
