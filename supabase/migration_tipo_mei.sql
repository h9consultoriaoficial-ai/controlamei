-- =====================================================================
-- MEI no Limite — Migração: tipo de MEI (padrão x caminhoneiro)
-- Rodar no Supabase SQL Editor. Seguro e idempotente.
-- =====================================================================
-- MEI Padrão        -> limite R$ 81.000/ano  (tipo_mei = 'mei')
-- MEI Caminhoneiro  -> limite R$ 251.600/ano (tipo_mei = 'mei_caminhoneiro')
-- =====================================================================

alter table public.tenants
  add column if not exists tipo_mei text not null default 'mei';

alter table public.tenants drop constraint if exists tenants_tipo_mei_check;
alter table public.tenants
  add constraint tenants_tipo_mei_check
  check (tipo_mei in ('mei', 'mei_caminhoneiro'));
