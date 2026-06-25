-- =====================================================================
-- Controla MEI — Schema do banco (Supabase / Postgres)
-- =====================================================================
-- Projeto GREENFIELD: RLS é ativado desde o início. Como NÃO existem
-- dados antigos, não há necessidade de backfill (ver skill
-- saas-multitenant-seguro). Rode este arquivo inteiro no SQL Editor
-- do Supabase.
--
-- Isolamento: cada usuário (auth.users) é dono de um tenant (MEI).
-- Toda leitura/escrita é filtrada por tenant.user_id = auth.uid().
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabela: tenants (cada MEI)
-- ---------------------------------------------------------------------
create table if not exists public.tenants (
  id                 uuid primary key default gen_random_uuid(),
  nome               text not null,
  cpf                text unique not null,
  whatsapp           text,
  nome_contador      text,
  whatsapp_contador  text,
  tipo_atividade     text check (tipo_atividade in ('comercio', 'servico', 'misto')),
  plano              text not null default 'gratuito',
  user_id            uuid not null references auth.users(id) on delete cascade,
  created_at         timestamptz not null default now()
);

create index if not exists idx_tenants_user on public.tenants(user_id);

-- ---------------------------------------------------------------------
-- Tabela: lancamentos (faturamento por mês)
-- Um lançamento por (tenant, mês, ano) — o app faz upsert.
-- ---------------------------------------------------------------------
create table if not exists public.lancamentos (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  mes         int not null check (mes between 1 and 12),
  ano         int not null,
  valor       numeric not null default 0,
  created_at  timestamptz not null default now(),
  unique (tenant_id, mes, ano)
);

create index if not exists idx_lancamentos_tenant on public.lancamentos(tenant_id);
create index if not exists idx_lancamentos_tenant_ano on public.lancamentos(tenant_id, ano);

-- ---------------------------------------------------------------------
-- Tabela: relatorios (link público gerado para o contador)
-- ---------------------------------------------------------------------
create table if not exists public.relatorios (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  mes         int,
  ano         int,
  token       text unique not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_relatorios_token on public.relatorios(token);
create index if not exists idx_relatorios_tenant on public.relatorios(tenant_id);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.tenants     enable row level security;
alter table public.lancamentos enable row level security;
alter table public.relatorios  enable row level security;

-- tenants: o dono acessa SOMENTE o próprio registro.
-- (A criação do tenant no cadastro é feita via service role no servidor,
--  que faz bypass de RLS; ainda assim grava o user_id correto.)
drop policy if exists "tenants_owner_all" on public.tenants;
create policy "tenants_owner_all" on public.tenants
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- lancamentos: acesso via tenant do próprio usuário.
drop policy if exists "lancamentos_owner_all" on public.lancamentos;
create policy "lancamentos_owner_all" on public.lancamentos
  for all
  using (tenant_id in (select id from public.tenants where user_id = auth.uid()))
  with check (tenant_id in (select id from public.tenants where user_id = auth.uid()));

-- relatorios: acesso autenticado via tenant do próprio usuário.
-- O acesso PÚBLICO do contador (/r/[token]) NÃO usa policy pública —
-- é feito no servidor com a service role, escopado pelo token.
drop policy if exists "relatorios_owner_all" on public.relatorios;
create policy "relatorios_owner_all" on public.relatorios
  for all
  using (tenant_id in (select id from public.tenants where user_id = auth.uid()))
  with check (tenant_id in (select id from public.tenants where user_id = auth.uid()));

-- =====================================================================
-- Rollback de emergência (se precisar desligar o RLS):
--   alter table public.tenants     disable row level security;
--   alter table public.lancamentos disable row level security;
--   alter table public.relatorios  disable row level security;
-- =====================================================================
