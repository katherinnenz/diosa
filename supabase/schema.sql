-- DIOSA · Tabla de suscripciones
-- Cópialo en Supabase → SQL Editor → New query → Run.

create table if not exists public.suscripciones (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  email               text,
  estado              text not null default 'inactiva',   -- active, trialing, past_due, canceled, cancelada...
  stripe_customer     text unique,
  stripe_subscription text,
  periodo_fin         timestamptz,
  actualizado         timestamptz not null default now()
);

-- Seguridad: cada persona solo puede LEER su propia suscripción.
-- Nadie puede escribir desde el sitio; solo la función del servidor (stripe-webhook).
alter table public.suscripciones enable row level security;

drop policy if exists "ver mi suscripcion" on public.suscripciones;
create policy "ver mi suscripcion"
  on public.suscripciones for select
  using (auth.uid() = user_id);
