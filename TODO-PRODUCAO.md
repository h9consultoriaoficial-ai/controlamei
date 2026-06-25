# TODO antes de comercializar — Controla MEI

Checklist do que precisa ser feito/desfeito antes de abrir o cadastro pro
público pagante. Baseado na skill `saas-multitenant-seguro`.

## Segurança / isolamento

- [ ] **Testar isolamento com 2 usuários.** Crie dois MEIs diferentes e confirme
      que cada um só vê os próprios lançamentos e relatórios (um vê seus dados,
      o outro vê vazio). Fazer ANTES de divulgar.
- [ ] **Confirmar RLS ativo** em `tenants`, `lancamentos`, `relatorios`
      (já vem ligado pelo `schema.sql`). Validar pelo painel do Supabase.
- [ ] **Plano só via service role.** Hoje a policy `tenants_owner_all` permite o
      usuário dar UPDATE no próprio registro, incluindo a coluna `plano`. Quando
      existir plano pago, mover `plano` para mudança **apenas via service role**
      (separar a policy de UPDATE para não cobrir `plano`, ou usar tabela
      separada). Hoje só existe `gratuito`, então o risco é baixo.
- [ ] **Confirmação de e-mail.** Hoje o cadastro cria o usuário já confirmado
      (`email_confirm: true`) para reduzir fricção do público-alvo. Para produção,
      avaliar reativar verificação de e-mail (Authentication → Email) e ajustar
      o fluxo de cadastro.
- [ ] **Rate limit no cadastro/login** (evitar abuso/bots). Avaliar Vercel
      Firewall ou verificação simples.

## Infraestrutura

- [ ] **Supabase plano Pro.** O plano gratuito **pausa após ~1 semana** de
      inatividade e derruba o app. Migrar para Pro antes de ter clientes.
- [ ] **Domínio próprio** (`controlamei.com.br`) na Vercel.
- [ ] **Open Graph / preview no WhatsApp.** Para o link do relatório mostrar
      preview bonito: domínio próprio + imagem JPEG < 600KB (não funciona em
      `*.vercel.app` nem com PNG transparente).
- [ ] Conferir as 3 variáveis de ambiente na Vercel (e redeploy após mudar
      qualquer `NEXT_PUBLIC_*`).

## Produto

- [ ] **Editar dados do MEI / contador** (tela de configurações). Hoje só dá pra
      definir no cadastro.
- [ ] **Trocar de ano** no histórico/lançamento (hoje usa só o ano atual).
- [ ] **Expiração / revogação de relatórios** públicos (token sem validade hoje).
- [ ] **Gateway de pagamento** se houver plano pago.
- [ ] **Recuperação de senha** (esqueci minha senha).
- [ ] **LGPD:** política de privacidade e termos de uso (lida com CPF).

## Limpeza

- [ ] Remover quaisquer logs temporários de debug.
- [ ] Revisar mensagens de erro para não vazar detalhes internos.
