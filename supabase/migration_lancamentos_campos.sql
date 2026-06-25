-- =====================================================================
-- MEI no Limite — Migração: campos detalhados em lancamentos
-- Rodar no Supabase SQL Editor. Seguro e idempotente.
-- =====================================================================

alter table public.lancamentos add column if not exists data_lancamento date;
alter table public.lancamentos add column if not exists numero_documento text;
alter table public.lancamentos add column if not exists descricao text;
alter table public.lancamentos add column if not exists forma_pagamento text;
alter table public.lancamentos add column if not exists nome_parte text;

-- Permitir MÚLTIPLAS receitas no mesmo mês: remover o índice único parcial
-- (cada lançamento agora é uma transação individual com data própria).
drop index if exists public.uniq_lancamentos_receita_mes;
drop index if exists public.lancamentos_receita_mes_ano_unique; -- nome alternativo

-- Útil para ordenar/listar por data.
create index if not exists idx_lancamentos_data
  on public.lancamentos(tenant_id, data_lancamento);
