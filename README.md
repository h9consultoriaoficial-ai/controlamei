# Controla MEI

SaaS multi-tenant para o microempreendedor individual (MEI) controlar o
faturamento anual, acompanhar o limite de **R$ 81.000** num semáforo visual e
enviar o relatório pro contador pelo WhatsApp.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Chart.js
- **Deploy:** Vercel
- **Multi-tenant:** cada MEI é um tenant; o isolamento é garantido por RLS
  (`tenant.user_id = auth.uid()`).

## Rotas

| Rota | Descrição | Proteção |
|------|-----------|----------|
| `/` | Landing page | pública |
| `/cadastro` | Criar conta + dados do MEI e do contador | pública |
| `/login` | Entrar (e-mail + senha) | pública |
| `/app` | Tela principal: semáforo, grid de meses, lançar | **protegida** |
| `/app/historico` | Dashboard anual (gráfico + cards + tabela) | **protegida** |
| `/app/relatorio` | Gerar relatório + botão WhatsApp | **protegida** |
| `/r/[token]` | Relatório público (sem login) | pública (via token) |

A proteção de `/app/*` é feita no `src/middleware.ts` (valida sessão com
`getUser()`).

## Configuração

### 1. Banco de dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Isso cria as tabelas `tenants`, `lancamentos`, `relatorios` e **ativa o RLS**.
3. Em **Authentication → Providers → Email**, deixe *Confirm email* **desligado**
   durante o desenvolvimento (o cadastro cria o usuário já confirmado via service
   role; ver `TODO-PRODUCAO.md` para reativar em produção).

### 2. Variáveis de ambiente

> ⚠️ Em produção, configure **apenas no painel da Vercel**
> (Settings → Environment Variables). Veja [`.env.local.example`](.env.local.example).

| Variável | Onde achar |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secreta!) |

Para rodar localmente, copie `.env.local.example` para `.env.local`
(o git ignora). **Não** use `.env.local.txt` — o Next não lê esse nome.

### 3. Rodar (Windows / PowerShell)

```powershell
npm install
npm run dev
```

Abra http://localhost:3000.

## Deploy na Vercel

1. Suba o repositório `controlamei` para o GitHub.
2. Importe na Vercel.
3. Adicione as 3 variáveis de ambiente no dashboard.
4. Deploy. (Mudanças em `NEXT_PUBLIC_*` exigem **redeploy** — são embutidas no build.)

## Segurança multi-tenant

Decisões aplicadas (ver `TODO-PRODUCAO.md` para o que falta antes de comercializar):

- **RLS em todas as tabelas** desde o início (projeto greenfield, sem backfill).
- Autorização sempre via **`getUser()`** (valida o JWT), nunca `getSession()`.
- O **tenant é criado via service role** no cadastro, gravando o `user_id` correto.
- O **relatório público** usa service role escopado pelo **token** (sem policy
  pública), então nenhum dado vaza além do relatório daquele tenant.
- A `SUPABASE_SERVICE_ROLE_KEY` só é usada no servidor, em caminhos controlados.
