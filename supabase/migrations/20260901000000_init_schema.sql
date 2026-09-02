-- Conecta Mais CRM — schema inicial
-- Espelha as estruturas de dados hoje mantidas em memória/localStorage em context/CRMContext.jsx.
-- IDs seguem o mesmo formato de texto já gerado pelo front-end (ex: 'usr-1', 'lead-1712345678').
-- RLS fica desabilitado propositalmente enquanto o projeto roda apenas em ambiente local
-- (ver README de migração antes de promover este schema para o Supabase de produção).

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  password text not null,
  role text not null default 'vendedor',
  role_name text,
  phone text,
  avatar text,
  active boolean not null default true,
  commission_rate numeric(5,4) default 0.10,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  badge text,
  tvs integer default 1,
  monthly_price numeric(10,2),
  quarterly_price numeric(10,2),
  fixed_price numeric(10,2),
  period_days integer,
  changes_per_month integer default 1,
  is_popular boolean default false,
  is_campaign boolean default false,
  color text,
  tagline text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.screens (
  id text primary key,
  name text not null,
  segment text,
  address text,
  neighborhood text,
  city text,
  tvs_count integer default 1,
  status text default 'active',
  audience_est text,
  notes text,
  installed_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key,
  name text,
  phone text,
  company text,
  company_address text,
  email text,
  role text,
  value numeric(10,2) default 0,
  plan_id text references public.plans(id) on delete set null,
  billing_cycle text default 'monthly',
  payment_method text default 'Pix',
  card_installments integer default 1,
  boleto_barcode text,
  media_format text default 'foto',
  tvs_count integer default 1,
  selected_screen_ids jsonb not null default '[]'::jsonb,
  payment_date date,
  due_date date,
  priority text default 'media',
  stage text default 'novo',
  origin text,
  assigned_to text references public.users(id) on delete set null,
  seller_id text references public.users(id) on delete set null,
  approval_status text default 'approved',
  commission_rate numeric(5,4) default 0,
  commission_amount numeric(10,2) default 0,
  tags jsonb not null default '[]'::jsonb,
  notes text,
  renewals_count integer default 0,
  renewals_history jsonb not null default '[]'::jsonb,
  approved_by text references public.users(id) on delete set null,
  approved_by_name text,
  approved_at timestamptz,
  denial_reason text,
  denied_by text references public.users(id) on delete set null,
  denied_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.hot_leads (
  id text primary key,
  name text,
  company text,
  company_address text,
  phone text,
  plan_interest text references public.plans(id) on delete set null,
  plan_name text,
  reason_not_closed text,
  notes text,
  seller_id text references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id text primary key,
  type text not null default 'income',
  description text,
  amount numeric(10,2) default 0,
  category text,
  payment_method text default 'Pix',
  date date,
  due_date date,
  status text default 'paid',
  partner_id text references public.users(id) on delete set null,
  seller_id text references public.users(id) on delete set null,
  seller_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.seller_payouts (
  id text primary key,
  seller_id text references public.users(id) on delete set null,
  seller_name text,
  amount numeric(10,2) default 0,
  payment_method text default 'Pix',
  date date,
  paid_by text references public.users(id) on delete set null,
  paid_by_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id text primary key,
  title text,
  company_name text,
  contact_person text,
  phone text,
  lead_id text references public.leads(id) on delete set null,
  date date,
  time text,
  duration text,
  type text default 'presencial',
  address text,
  scheduled_by text references public.users(id) on delete set null,
  assigned_partner_id text references public.users(id) on delete set null,
  participant_ids jsonb not null default '[]'::jsonb,
  meet_link text,
  status text default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id text primary key,
  lead_id text references public.leads(id) on delete cascade,
  type text default 'note',
  title text,
  description text,
  user_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  type text,
  title text,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_seller_id on public.leads(seller_id);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_transactions_seller_id on public.transactions(seller_id);
create index if not exists idx_hot_leads_seller_id on public.hot_leads(seller_id);
create index if not exists idx_activities_lead_id on public.activities(lead_id);
