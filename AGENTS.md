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
  
<!-- END:nextjs-agent-rules -->
