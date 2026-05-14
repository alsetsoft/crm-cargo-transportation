-- Service Book: per-vehicle maintenance procedures + completion log
-- Each procedure has a period (km and/or days). Completion records compute
-- the remaining-until-next-due and procedure status.

create table if not exists public.vehicle_service_procedures (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  type public.vehicle_document_type not null,
  period_km integer,
  period_days integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_service_procedures_period_km_positive
    check (period_km is null or period_km > 0),
  constraint vehicle_service_procedures_period_days_positive
    check (period_days is null or period_days > 0),
  constraint vehicle_service_procedures_has_period
    check (period_km is not null or period_days is not null)
);

create index if not exists vehicle_service_procedures_vehicle_id_idx
  on public.vehicle_service_procedures (vehicle_id);

alter table public.vehicle_service_procedures enable row level security;

create policy "vehicle_service_procedures_all_anon"
  on public.vehicle_service_procedures
  for all
  to anon, authenticated
  using (true)
  with check (true);

create table if not exists public.vehicle_service_records (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid not null
    references public.vehicle_service_procedures(id) on delete cascade,
  completed_at date not null default current_date,
  odometer integer,
  notes text,
  created_at timestamptz not null default now(),
  constraint vehicle_service_records_odometer_nonneg
    check (odometer is null or odometer >= 0)
);

create index if not exists vehicle_service_records_procedure_id_idx
  on public.vehicle_service_records (procedure_id);

create index if not exists vehicle_service_records_procedure_completed_idx
  on public.vehicle_service_records (procedure_id, completed_at desc, created_at desc);

alter table public.vehicle_service_records enable row level security;

create policy "vehicle_service_records_all_anon"
  on public.vehicle_service_records
  for all
  to anon, authenticated
  using (true)
  with check (true);
