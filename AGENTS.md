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

## Links

Routing-aware links go through `LinkBehavior` from
[components/crm/link-behavior.tsx](components/crm/link-behavior.tsx)
— a `"use client"` forwardRef wrapper around `next/link`, registered
in [lib/theme.ts](lib/theme.ts) as `MuiButtonBase.defaultProps.LinkComponent`
and `MuiLink.defaultProps.component`. React 19 / Next.js 16 forbids
passing plain functions across the RSC boundary, so `component={NextLink}`
is BANNED — but with the theme default in place, you never need to
spell it out anyway.

- **MUI components with `href`** (Button, IconButton, Link,
  ListItemButton, anything backed by `ButtonBase`): just pass `href`.
  The theme's `LinkComponent` default routes it through `LinkBehavior`
  automatically. Do NOT add `component={LinkBehavior}` or
  `component={NextLink}`.

  ```tsx
  // ✅ Right
  <Button href="/clients" variant="outlined">Скасувати</Button>
  <IconButton href={`/clients/${row.id}/edit`} aria-label="Редагувати">
    <Pencil size={18} />
  </IconButton>
  <Link href={`/clients/${row.id}`} underline="hover">{row.name}</Link>

  // ❌ Wrong — `component={NextLink}` crashes in RSC; explicit
  // `component={LinkBehavior}` is redundant noise
  <Button component={NextLink} href="/clients">…</Button>
  <Button component={LinkBehavior} href="/clients">…</Button>
  ```

- **Non-MUI elements** (styled `<Box>`, plain anchors): wrap
  `<NextLink>` around the styled content. Do NOT pass `NextLink` as
  a `component` prop.

  ```tsx
  import NextLink from "next/link";

  <NextLink href="/" style={{ textDecoration: "none", color: "inherit" }}>
    <Box sx={{ ... }}>...</Box>
  </NextLink>
  ```

## MUI Stack — no `divider` prop

Do NOT use `<Stack divider={<Divider />}>` with `.map`-generated
children. In this Next.js 16 / React 19 / MUI v6.5 combination the
internal `React.Children.toArray` + `cloneElement` pass crashes
SSR with "Element type is invalid: got undefined". Instead, render
the divider manually between rows:

```tsx
// ✅ Works in SSR
<Box>
  {rows.map((row, idx) => (
    <Box key={row.id}>
      {idx > 0 && <Divider />}
      <Row {...row} />
    </Box>
  ))}
</Box>

// ❌ Crashes SSR
<Stack divider={<Divider />}>
  {rows.map((row) => <Row key={row.id} {...row} />)}
</Stack>
```

`<Stack divider={...}>` with static children (no `.map`) is fine —
the failure only triggers with dynamically generated arrays.

## Database migrations

- Apply schema changes via the Supabase MCP `apply_migration` tool only.
- Do NOT mirror migrations to `supabase/migrations/`. The remote Supabase
  project is the source of truth; the local folder is not used by any
  workflow in this repo. Use `mcp__supabase__list_migrations` to inspect
  history.

<!-- END:nextjs-agent-rules -->
