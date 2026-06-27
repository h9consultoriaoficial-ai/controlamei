import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Atualiza/renova a sessão Supabase a cada request e protege as rotas /app/*.
 * Usa getUser() (valida o JWT no servidor) — nunca getSession() para
 * decisões de autorização.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // /cadastro foi descontinuado como rota pública: redireciona tudo para
  // /assinar. O webhook da Cakto cria contas via API + service role (não usa
  // esta rota), então não há impacto no provisionamento automático.
  if (path === "/cadastro") {
    const url = request.nextUrl.clone();
    url.pathname = "/assinar";
    return NextResponse.redirect(url);
  }

  // Rotas protegidas: /app/*
  if (!user && path.startsWith("/app")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Gating de PLANO em /app/*: só quem tem plano 'pro' acessa.
  // (As demais rotas — /login, /cadastro, /assinar, /r/[token], /api/* etc. —
  //  não começam com /app, então ficam fora desta checagem.)
  // Se o usuário ainda não tem tenant (cadastro incompleto), deixamos passar:
  // o getTenantOrRedirect do app cuida desse caso (-> /cadastro).
  if (user && path.startsWith("/app")) {
    const { data: tenant } = await supabase
      .from("tenants")
      .select("plano")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tenant && tenant.plano !== "pro") {
      const url = request.nextUrl.clone();
      url.pathname = "/assinar";
      return NextResponse.redirect(url);
    }
  }

  // Usuário logado não precisa ver a tela de login.
  // (Não redirecionamos de /cadastro para evitar loop com o fallback
  //  de "cadastro incompleto" em getTenantOrRedirect.)
  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
