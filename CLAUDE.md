# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start Next.js dev server (default http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — ESLint (flat config, extends `eslint-config-next` core-web-vitals + typescript)

There is no test runner configured.

## Environment

Two env vars are required at runtime — both are read directly from `process.env` in [lib/supabase/server.ts](lib/supabase/server.ts) and [lib/supabase/client.ts](lib/supabase/client.ts), so the app will crash on first request without them:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

A Supabase MCP server is wired up in [.mcp.json](.mcp.json) (project ref `qvcboxeklonmqxoqxuhw`) — use it to inspect schema/data rather than guessing.

## Architecture

Next.js 16 App Router + React 19 + Supabase Postgres + shadcn/ui (style: `radix-nova`) + Tailwind v4 + react-hook-form/zod + sonner. UI text and locale are Ukrainian (`<html lang="uk">`, `uk-UA` formatters).

Path alias `@/*` resolves to the repo root (no `src/` directory).

### Data flow (the load-bearing pattern)

Every CRM module — clients, drivers, vehicles, orders — follows the same three-layer split. When adding a new module or modifying an existing one, follow this exact shape:

1. **Read layer — [lib/data/](lib/data/)** — `"server-only"` query functions. They call `createClient()` from [lib/supabase/server.ts](lib/supabase/server.ts) and read from Supabase **views** (`clients_with_stats`, `drivers_with_stats`, `vehicles_with_stats`, `orders_with_metrics`) so joined/derived fields (turnover, orders_count, profitability, driver/vehicle names) come pre-computed. Don't re-implement joins in TypeScript.
2. **Write layer — [actions/](actions/)** — `"use server"` Server Actions. They Zod-validate via schemas in [lib/validation/](lib/validation/), write to **base tables** (not views), then call `revalidatePath` for every route that displays the touched data. Return shape is always `{ ok: true } | { ok: false; error: string }`. Cross-entity revalidation matters: orders mutations revalidate `/orders`, `/clients`, `/drivers`, `/vehicles`, and `/` because stats views feed all of them.
3. **Page + components — [app/(dashboard)/<module>/](app/(dashboard)/)** — `page.tsx` is an async Server Component that `Promise.all`s its data calls and renders `<ModulePage>` with a `<XxxTable>` and a `<XxxFormDialog>`. Module-private components live under `_components/` (the underscore prefix keeps them out of the route tree). All pages set `export const dynamic = "force-dynamic"` — there's no ISR/static caching strategy in place.

The form dialog component is the client boundary: it uses `useForm` with `zodResolver(schema)`, wraps submission in `useTransition`, calls the server action, and toasts the result via `sonner`.

### Validation contracts

Zod schemas in [lib/validation/](lib/validation/) are the single source of truth shared between client forms and server actions. They use `z.input` (form values, pre-coerce) and `z.output` (post-coerce, what the action receives) — both are exported and `useForm` is typed as `useForm<FormInput, unknown, Output>`. Empty strings are normalized to `undefined` via `.or(z.literal("").transform(() => undefined))`; numeric fields use `z.preprocess` to coerce string inputs. Status enums mirror the Postgres enums (`client_status`, `order_status`, etc.) — keep them in sync with [lib/supabase/types.ts](lib/supabase/types.ts) (generated) and the label/tone maps in [lib/constants.ts](lib/constants.ts).

### Database

Four entities (`clients`, `drivers`, `vehicles`, `orders`) with `*_with_stats` / `orders_with_metrics` views layered on top. Cross-entity links: `orders` → client/driver/vehicle (loading/unloading are free-text `loading_place`/`unloading_place` columns, not a FK); `drivers.current_vehicle_id` ↔ `vehicles.current_driver_id` (mutual current-assignment fields). Money is `_uah`, distance `_km`, volume `_tons`, fuel `_l_100km` — match these suffixes in new columns. [lib/supabase/types.ts](lib/supabase/types.ts) is generated from the Supabase schema; regenerate it (don't hand-edit) when the DB changes.

### Layout shell

The dashboard route group [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx) wraps every CRM page with `SidebarProvider` + `TooltipProvider`, a left `AppSidebar` (driven by [components/crm/nav-config.ts](components/crm/nav-config.ts) — add new modules there), and a top `AppHeader`. The root layout [app/layout.tsx](app/layout.tsx) only sets up the Inter font (latin + cyrillic subsets) and the sonner Toaster. Shared CRM widgets (`KpiCard`, `StatusBadge`, `ModulePage`, `ConfirmDeleteDialog`) live in [components/crm/](components/crm/); shadcn primitives in [components/ui/](components/ui/).

### Formatting

All user-facing numbers, currency, and dates go through [lib/format.ts](lib/format.ts) (`formatUah`, `formatKm`, `formatLiters`, `formatPercent`, `formatDate`, `formatDateTime`). They handle `null`/`undefined` by returning `—`. Don't call `Intl.NumberFormat` ad-hoc.