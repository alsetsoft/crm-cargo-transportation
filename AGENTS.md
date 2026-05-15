<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## UI patterns

- Do NOT use modals, dialogs, popups, or overlays for features.
- If a feature needs its own view, create a new page/route instead.
- This includes: forms, settings panels, detail views, confirmations
  with more than a yes/no choice, and any multi-step flows.
- Acceptable exceptions: native browser confirms for destructive
  actions (delete, discard), toast notifications, and tooltips.

## Page headers

- **Top-level pages** (reachable from the sidebar nav — `/orders`,
  `/clients`, `/drivers`, `/vehicles`, `/expenses`, `/logs`, and
  primary detail views like `/clients/[id]`) use `ModulePage` with
  the full hero (eyebrow badge + title + description + actions).
- **Sub-pages** (everything else: `*/new`, `*/[id]/edit`,
  `*/[id]/service-book`, secondary detail views) use the slim
  `<PageHeader>` from [components/crm/page-header.tsx](components/crm/page-header.tsx)
  — just `<h1>` + back button (and optional inline actions),
  no eyebrow badge, no description paragraph. This keeps forms
  above the fold and avoids unnecessary vertical scroll.
- Title format on sub-pages:
  - Create: `"Нове <entity>"` (e.g. `"Нове замовлення"`, `"Новий клієнт"`).
  - Edit: `"Зміна <entity> · <identifier>"` (e.g. `"Зміна замовлення №1001"`,
    `"Зміна клієнта · ТОВ Агроінвест"`). The identifier provides context
    without needing a separate description line.

## Database migrations

- Apply schema changes via the Supabase MCP `apply_migration` tool only.
- Do NOT mirror migrations to `supabase/migrations/`. The remote Supabase
  project is the source of truth; the local folder is not used by any
  workflow in this repo. Use `mcp__supabase__list_migrations` to inspect
  history.

<!-- END:nextjs-agent-rules -->
