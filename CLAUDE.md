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

Next.js 16 App Router + React 19 + Supabase Postgres + **MUI v6 (Material UI, M3-themed)** + react-hook-form/zod + a custom MUI Snackbar toaster. UI text and locale are Ukrainian (`<html lang="uk">`, `uk-UA` formatters).

There is no Tailwind, no shadcn/ui, no sonner. All visual tokens (palette, typography, shape, component defaults) live in [lib/theme.ts](lib/theme.ts) via `createTheme`. Light theme only.

Path alias `@/*` resolves to the repo root (no `src/` directory).

### MUI conventions

- **Theme is the source of truth.** Don't hardcode hexes, sizes, or fonts in components — reference `theme.palette.*`, `theme.spacing(n)`, `theme.typography.*`, `theme.breakpoints.*`. Set cross-cutting changes via `theme.components` in `lib/theme.ts`, not by repeating `sx` props.
- **Providers boundary.** [app/providers.tsx](app/providers.tsx) is a `"use client"` component that wraps `AppRouterCacheProvider` + `ThemeProvider` + `CssBaseline`. Mounted from [app/layout.tsx](app/layout.tsx) (Server Component). Don't add `"use client"` to pages just to import MUI components — leaf components handle that.
- **Layout primitives:** `Stack` first (1D), `Grid` from `@mui/material/Grid2` with the `size={{ xs, sm, md }}` prop (NOT the legacy `xs`/`sm`/`md` props) for 2D grids, `Container` for page-level max-widths.
- **Forms:** `react-hook-form` `Controller` wrapping MUI `TextField`. Use `error={!!fieldState.error}` + `helperText={fieldState.error?.message}` for the a11y wiring. Enums use `TextField select` with `MenuItem` children, not `Select` directly.
- **Tables:** `DataGrid` from `@mui/x-data-grid` inside `Card variant="outlined"` with `CardContent sx={{ p: 0 }}` and `DataGrid sx={{ border: 'none' }}`. Responsive column hiding via a controlled `columnVisibilityModel` driven by `useMediaQuery(theme.breakpoints.down('md'))` and `down('sm')`. Action `IconButton`s in DataGrid cells: do NOT set `size="small"` (under-target).
- **Toasts:** `import { toast } from "@/lib/toast"` — same shape as sonner (`toast.success/error/info/warning`). The single Snackbar+Alert renderer lives at [components/crm/toaster.tsx](components/crm/toaster.tsx), mounted in `app/layout.tsx`.
- **Tone → MUI colour mapping.** [lib/constants.ts](lib/constants.ts) exports `TONE_TO_MUI_COLOR` mapping the legacy `BadgeTone` values (`success`/`warning`/`info`/`destructive`/`secondary`/`default`) to MUI palette keys. Use it in any new tonal Chip/Badge surface.

### Data flow (the load-bearing pattern)

Every CRM module — clients, drivers, vehicles, orders — follows the same three-layer split. When adding a new module or modifying an existing one, follow this exact shape:

1. **Read layer — [lib/data/](lib/data/)** — `"server-only"` query functions. They call `createClient()` from [lib/supabase/server.ts](lib/supabase/server.ts) and read from Supabase **views** (`clients_with_stats`, `drivers_with_stats`, `vehicles_with_stats`, `orders_with_metrics`) so joined/derived fields (turnover, orders_count, profitability, driver/vehicle names) come pre-computed. Don't re-implement joins in TypeScript.
2. **Write layer — [actions/](actions/)** — `"use server"` Server Actions. They Zod-validate via schemas in [lib/validation/](lib/validation/), write to **base tables** (not views), then call `revalidatePath` for every route that displays the touched data. Return shape is always `{ ok: true } | { ok: false; error: string }`. Cross-entity revalidation matters: orders mutations revalidate `/orders`, `/clients`, `/drivers`, `/vehicles`, and `/` because stats views feed all of them.
3. **Page + components — [app/(dashboard)/<module>/](app/(dashboard)/)** — `page.tsx` is an async Server Component that `Promise.all`s its data calls and renders `<ModulePage>` (hero) with a `<XxxTable>` (DataGrid). Forms are their own pages at `<module>/new/page.tsx` and `<module>/[id]/edit/page.tsx` — never dialogs (see [AGENTS.md](AGENTS.md)). Module-private components live under `_components/` (the underscore prefix keeps them out of the route tree). All pages set `export const dynamic = "force-dynamic"` — there's no ISR/static caching strategy in place.

The form-page component is the client boundary: it uses `useForm` with `zodResolver(schema)`, wraps submission in `useTransition`, calls the server action, and toasts the result via `@/lib/toast`.

### Validation contracts

Zod schemas in [lib/validation/](lib/validation/) are the single source of truth shared between client forms and server actions. They use `z.input` (form values, pre-coerce) and `z.output` (post-coerce, what the action receives) — both are exported and `useForm` is typed as `useForm<FormInput, unknown, Output>`. Empty strings are normalized to `undefined` via `.or(z.literal("").transform(() => undefined))`; numeric fields use `z.preprocess` to coerce string inputs. Status enums mirror the Postgres enums (`client_status`, `order_status`, etc.) — keep them in sync with [lib/supabase/types.ts](lib/supabase/types.ts) (generated) and the label/tone maps in [lib/constants.ts](lib/constants.ts).

### Database

Four entities (`clients`, `drivers`, `vehicles`, `orders`) with `*_with_stats` / `orders_with_metrics` views layered on top. Cross-entity links: `orders` → client/driver/vehicle (loading/unloading are free-text `loading_place`/`unloading_place` columns, not a FK); `drivers.current_vehicle_id` ↔ `vehicles.current_driver_id` (mutual current-assignment fields). Money is `_uah`, distance `_km`, volume `_tons`, fuel `_l_100km` — match these suffixes in new columns. [lib/supabase/types.ts](lib/supabase/types.ts) is generated from the Supabase schema; regenerate it (don't hand-edit) when the DB changes.

### Layout shell

[app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx) calls `requireAdmin()` from [lib/auth.ts](lib/auth.ts), then renders `<AppShell user={user}>{children}</AppShell>`. `AppShell` (a client component at [components/crm/app-shell.tsx](components/crm/app-shell.tsx)) encapsulates the MUI `AppBar` + responsive `Drawer` (permanent at `md+`, temporary on mobile; `DRAWER_WIDTH = 280`). Nav items come from [components/crm/nav-config.ts](components/crm/nav-config.ts) — add new modules there. The root layout [app/layout.tsx](app/layout.tsx) only sets up the Inter font (latin + cyrillic subsets), mounts `<Providers>`, and renders the `<Toaster />`. Shared CRM widgets (`KpiCard`, `StatusBadge`, `ModulePage`, `PageHeader`, `UserMenu`, `ConfirmDeleteDialog`, `Toaster`) live in [components/crm/](components/crm/).

### Auth

JWT auth via Supabase. `proxy.ts` at the project root (Next.js 16's renamed "middleware") refreshes session cookies and optimistically redirects unauthenticated traffic to `/login`. The hard gate lives in [lib/auth.ts](lib/auth.ts): `requireAdmin()` calls `supabase.auth.getUser()` (re-validates the JWT, not just reads the cookie) and joins to `public.profiles` to verify the `role`. The dashboard layout AND every Server Action must call `requireAdmin()`. RLS on the DB is the ground truth — all business tables have `using (public.is_admin())` policies.

### Formatting

All user-facing numbers, currency, and dates go through [lib/format.ts](lib/format.ts) (`formatUah`, `formatKm`, `formatLiters`, `formatPercent`, `formatDate`, `formatDateTime`). They handle `null`/`undefined` by returning `—`. Don't call `Intl.NumberFormat` ad-hoc.