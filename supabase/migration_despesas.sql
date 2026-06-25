-- =====================================================================
-- MEI no Limite — Migração: módulo de despesas com categorias
-- Rodar no Supabase SQL Editor (banco que JÁ tem o schema inicial).
-- Seguro e idempotente.
-- =====================================================================

-- 1) Tabela de categorias de despesa (uma lista por tenant — isolamento)
create table if not exists public.categorias_despesa (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid references public.tenants(id) on delete cascade,
  nome        text not null,
  icone       text,
  is_padrao   boolean default false,
  created_at  timestamptz default now()
);

create index if not exists idx_categorias_tenant
  on public.categorias_despesa(tenant_id);

-- 2) Novas colunas em lancamentos
alter table public.lancamentos
  add column if not exists tipo text not null default 'receita';

alter table public.lancamentos
  add column if not exists categoria_id uuid references public.categorias_despesa(id);

-- garante valores válidos em tipo
alter table public.lancamentos drop constraint if exists lancamentos_tipo_check;
alter table public.lancamentos
  add constraint lancamentos_tipo_check check (tipo in ('receita', 'despesa'));

-- 3) Ajuste de unicidade:
--    A regra antiga (1 lançamento por mês) impede receita + despesas no mesmo
--    mês. Removemos e criamos índice único PARCIAL só para receita
--    (1 receita por mês; despesas podem ter várias por mês/categoria).
alter table public.lancamentos drop constraint if exists lancamentos_tenant_id_mes_ano_key;
create unique index if not exists uniq_lancamentos_receita_mes
  on public.lancamentos(tenant_id, mes, ano)
  where tipo = 'receita';

create index if not exists idx_lancamentos_categoria on public.lancamentos(categoria_id);
create index if not exists idx_lancamentos_tipo on public.lancamentos(tenant_id, ano, tipo);

-- 4) RLS em categorias_despesa
alter table public.categorias_despesa enable row level security;

drop policy if exists "usuario ve proprias categorias" on public.categorias_despesa;
create policy "usuario ve proprias categorias" on public.categorias_despesa
  for all using (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  )
  with check (
    tenant_id in (select id from public.tenants where user_id = auth.uid())
  );

-- =====================================================================
-- Observação: as categorias padrão NÃO são semeadas aqui (seriam globais).
-- Cada tenant recebe as suas no cadastro, via service role no servidor.
-- Para tenants que já existiam antes desta migração, o app cria as
-- categorias na primeira vez que abrir a aba Despesa (auto-seed).
-- =====================================================================
