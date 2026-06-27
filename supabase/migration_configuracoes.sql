-- =====================================================================
-- MIGRATION: tabela de configurações (contadores dinâmicos da landing)
-- Rode no SQL Editor do Supabase.
-- =====================================================================

create table if not exists public.configuracoes (
  chave      text primary key,
  valor      text not null,
  updated_at timestamptz default now()
);

-- Seeds (não sobrescreve se já existirem)
insert into public.configuracoes (chave, valor) values
  ('vagas_fundador_total', '300'),
  ('vagas_fundador_usadas', '0')
on conflict (chave) do nothing;

-- RLS: leitura pública (anon), escrita só via service role
alter table public.configuracoes enable row level security;

drop policy if exists "leitura publica" on public.configuracoes;
create policy "leitura publica" on public.configuracoes
  for select using (true);

-- (Sem policy de INSERT/UPDATE/DELETE: só a service role escreve,
--  pois ela faz bypass de RLS. O endpoint /api/fundador usa service role.)
