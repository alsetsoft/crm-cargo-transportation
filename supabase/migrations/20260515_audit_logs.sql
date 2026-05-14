-- Append-only audit log of all CRM mutations. Each entry references an
-- entity (client, driver, vehicle, order, expense, service_procedure, ...)
-- and an action (created, updated, deleted, completed, reverted). Free-text
-- entity_label and description keep the table self-contained — rows survive
-- even after the referenced entity is deleted.

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  entity_label text,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id);

alter table public.audit_logs enable row level security;

create policy "audit_logs_all_anon"
  on public.audit_logs
  for all
  to anon, authenticated
  using (true)
  with check (true);
