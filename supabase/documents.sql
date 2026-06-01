-- Business documents: profile, clients, quotations, contracts.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- RLS is enabled with no policies, so only the service-role key used by the
-- admin panel can read or write these tables.

create table if not exists business_profile (
  id                   smallint primary key default 1 check (id = 1),
  name                 text not null,
  business_name        text not null default '',
  logo_url             text not null default '',
  signature_url        text not null default '',
  address              text not null,
  state                text not null,
  email                text not null,
  phone                text not null,
  website              text not null default '',
  pan                  text not null,
  gstin                text not null default '',
  udyam_number         text not null default '',
  bank_account_name    text not null default '',
  bank_account_number  text not null default '',
  bank_ifsc            text not null default '',
  bank_name            text not null default '',
  bank_swift           text not null default '',
  upi_id               text not null default '',
  default_currency     text not null default 'INR' check (default_currency in ('INR', 'USD', 'EUR')),
  default_payment_terms text not null default '',
  default_quote_terms  text not null default '',
  quote_validity_days  integer not null default 15 check (quote_validity_days between 1 and 365),
  default_jurisdiction text not null default 'Ghaziabad, Uttar Pradesh',
  numbering_scheme     text not null default 'calendar' check (numbering_scheme in ('calendar', 'financial')),
  updated_at           timestamptz not null default now()
);

-- Upgrade for profiles created before the signature image. Safe on new ones too.
alter table business_profile add column if not exists signature_url text not null default '';

create table if not exists clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text not null default '',
  address    text not null default '',
  email      text not null default '',
  phone      text not null default '',
  gstin      text not null default '',
  state      text not null default '',
  country    text not null default 'India',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- `client` is a copy of the client's details at the time of writing, so
-- editing a client record never rewrites documents already sent.
create table if not exists quotations (
  id              uuid primary key default gen_random_uuid(),
  number          text not null unique,
  -- Revisions share the original's number: QT-2026-001, QT-2026-001-R1, ...
  base_number     text not null,
  revision        integer not null default 0 check (revision >= 0),
  status          text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'superseded')),
  title           text not null,
  issue_date      date not null,
  valid_until     date not null,
  client_id       uuid references clients(id) on delete set null,
  client          jsonb not null,
  currency        text not null default 'INR' check (currency in ('INR', 'USD', 'EUR')),
  line_items      jsonb not null default '[]'::jsonb,
  discount_type   text not null default 'none' check (discount_type in ('none', 'percent', 'flat')),
  discount_value  numeric(14, 2) not null default 0,
  gst_enabled     boolean not null default false,
  notes           text not null default '',
  payment_terms   text not null default '',
  terms           text not null default '',
  -- Recomputed on the server on every save; stored for the list page.
  subtotal        numeric(14, 2) not null default 0,
  discount_amount numeric(14, 2) not null default 0,
  tax_amount      numeric(14, 2) not null default 0,
  total           numeric(14, 2) not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (valid_until >= issue_date)
);

create index if not exists quotations_created_at_idx on quotations (created_at desc);

-- Upgrade for tables created before quotation revisions. Safe on new ones too.
alter table quotations add column if not exists base_number text;
alter table quotations add column if not exists revision integer not null default 0;
update quotations set base_number = number where base_number is null;
alter table quotations alter column base_number set not null;
alter table quotations drop constraint if exists quotations_revision_check;
alter table quotations add constraint quotations_revision_check check (revision >= 0);
alter table quotations drop constraint if exists quotations_status_check;
alter table quotations add constraint quotations_status_check
  check (status in ('draft', 'sent', 'accepted', 'rejected', 'superseded'));

create index if not exists quotations_base_number_idx on quotations (base_number);

create table if not exists contracts (
  id               uuid primary key default gen_random_uuid(),
  number           text not null unique,
  status           text not null default 'draft' check (status in ('draft', 'sent', 'signed')),
  template_key     text not null,
  title            text not null,
  contract_date    date not null,
  place            text not null default '',
  client_id        uuid references clients(id) on delete set null,
  client           jsonb not null,
  client_signatory text not null default '',
  quotation_id     uuid references quotations(id) on delete set null,
  currency         text not null default 'INR' check (currency in ('INR', 'USD', 'EUR')),
  fields           jsonb not null,
  clauses          jsonb not null default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists contracts_created_at_idx on contracts (created_at desc);

-- Per-type, per-period counters behind QT-2026-001 style numbers.
-- `period` is "2026" (calendar year) or "2026-27" (financial year).
create table if not exists document_counters (
  doc_type   text not null,
  period     text not null,
  last_value integer not null default 0,
  primary key (doc_type, period)
);

-- Atomically claims the next number, so two saves can never share one.
create or replace function next_document_number(p_doc_type text, p_period text)
returns integer
language sql
as $$
  insert into document_counters as c (doc_type, period, last_value)
  values (p_doc_type, p_period, 1)
  on conflict (doc_type, period) do update set last_value = c.last_value + 1
  returning last_value;
$$;

revoke all on function next_document_number(text, text) from public, anon, authenticated;
grant execute on function next_document_number(text, text) to service_role;

alter table business_profile  enable row level security;
alter table clients           enable row level security;
alter table quotations        enable row level security;
alter table contracts         enable row level security;
alter table document_counters enable row level security;

-- Make new tables and columns visible to the API straight away.
notify pgrst, 'reload schema';
