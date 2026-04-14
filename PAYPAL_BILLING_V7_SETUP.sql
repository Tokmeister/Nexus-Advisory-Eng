-- NEXUS V7 Billing Schema
-- Prices are maintained in code for now. This table stores the live organisation subscription state.

create table if not exists public.organisation_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null unique references public.organisations(id) on delete cascade,
  plan_code text not null check (plan_code in ('startup', 'small_business', 'enterprise')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled', 'past_due', 'inactive')),
  paypal_subscription_id text,
  starts_at timestamptz,
  renews_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists organisation_subscriptions_org_idx
  on public.organisation_subscriptions(organisation_id);

create index if not exists organisation_subscriptions_status_idx
  on public.organisation_subscriptions(status);
