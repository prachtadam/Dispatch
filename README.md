# Ultimate Tech-First Dispatch Platform (Foundation)

This repository contains a modular foundation for a **tech-first, offline-first dispatch/work-order platform** focused on irrigation service workflows.

## Implemented foundation

- Tech mobile PWA shell (`tech/`).
- Office/Admin web shell (`office/`).
- Shared Supabase integration and data services (`shared/`).
- Offline queue + sync framework (`shared/offline.js`, `shared/services/syncEngine.js`).
- Dispatch scoring engine v1 (`shared/services/dispatchEngine.js`).
- App-managed username + 4-digit PIN login service (`shared/services/auth.js`).
- Supabase schema with RLS + setup tables (`supabase/schema.sql`).
- Storage bucket policy bootstrap (`supabase/storage.sql`).

## Local development

Because this project is currently vanilla web assets, you can run with any static file server.

### 1) Configure Supabase values

Set these via browser globals in HTML or localStorage:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ORG_ID`
- `GOOGLE_MAPS_API_KEY` (optional for maps)

### 2) Apply SQL in Supabase

1. Run `supabase/schema.sql`.
2. Run `supabase/storage.sql`.

### 3) Start a local server

Example using Python:

```bash
python3 -m http.server 4173
```

Then open:

- Tech app: `http://localhost:4173/tech/index.html`
- Office app: `http://localhost:4173/office/index.html`
- Inventory helper app: `http://localhost:4173/inventory-app/inventory.html`

## Setup-driven modules expected in-app

- Company setup and operational settings (`setup_settings`).
- User + role + permission management (`users`, `roles`, `user_permissions`).
- Job types/colors and work order prefixes (`job_types`).
- Diagnostics flows and branching (`diagnostics_*`).
- Dispatch weights (`setup_settings`, consumed by dispatch engine).
- Inventory catalogs/minimums/live counts (`products`, `main_inventory`, truck inventory tables).
- CSV imports with batch logging (`import_batches`).

## Notes

- All entity design is org-scoped to support multi-tenant isolation.
- The schema is designed for expansion (analytics, weather confidence, callbacks, safety escalation, SMS/accounting adapters).
