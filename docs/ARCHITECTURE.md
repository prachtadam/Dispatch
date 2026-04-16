# Ultimate Tech-First Dispatch Platform Architecture

## Foundation implemented in this repo

- **Tech app (mobile-first PWA):** `tech/`
- **Office/Admin app (desktop-first):** `office/`
- **Shared service/domain layer:** `shared/`
- **Supabase bootstrap SQL:** `supabase/`

## Separation of concerns

1. **UI layer**
   - `tech/app.js`, `office/app.js`
   - Focuses on workflows and interactions.
2. **Domain services**
   - `shared/services/dispatchEngine.js`
   - `shared/services/syncEngine.js`
   - `shared/services/auth.js`
3. **Persistence/integration**
   - `shared/db.js` and Supabase SQL in `supabase/schema.sql`

## Offline-first design

- IndexedDB-backed sync queue (`shared/services/syncEngine.js`).
- Local state caching in tech flow (`shared/offline.js` + localStorage).
- Deferred actions replayed when service is restored.
- Conflict metadata persisted for office/admin review.

## Setup-driven behavior

- Setup values live in `setup_settings` (JSON-based category/key model).
- Dispatch weights are consumed by `dispatchEngine` and are not hardcoded per company.
- Job types/colors, diagnostics, keyword mappings, and inventory rules are table-driven.

## Extension points

- SMS/notifications: `notifications` table + template keys.
- Weather providers: feed `weather_reports` and `weather_area_impacts`.
- Accounting export: `work_orders` + `invoice_records`.
- Analytics/training: `tech_metrics`, `callback_tracking`, `job_status_history`.
