-- =====================================================================
-- MIGRATION: tornar tenants.cpf OPCIONAL (nullable)
-- =====================================================================
-- Contexto: o webhook da Cakto (/api/cakto/webhook) provisiona a conta
-- após o pagamento. Nem todo gateway envia o CPF no payload, mas o schema
-- original define `cpf text unique not null` — sem esta migration, criar um
-- tenant sem CPF FALHA e o cliente pago fica sem acesso.
--
-- Solução: remover o NOT NULL. A constraint UNIQUE permanece (o Postgres
-- aceita múltiplos NULLs em coluna UNIQUE). O cliente preenche o CPF depois
-- na tela de perfil; o cadastro manual continua exigindo CPF na validação
-- da própria aplicação.
--
-- Rode no SQL Editor do Supabase.
-- =====================================================================

alter table public.tenants alter column cpf drop not null;
