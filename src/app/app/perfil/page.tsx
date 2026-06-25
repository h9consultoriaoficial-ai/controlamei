import PerfilForm from "@/components/PerfilForm";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Meu perfil</h1>
        <p className="text-gray-500">Atualize seus dados e os do contador.</p>
      </div>

      <PerfilForm
        email={user?.email ?? ""}
        tenant={{
          nome: tenant.nome,
          cpf: tenant.cpf,
          whatsapp: tenant.whatsapp ?? "",
          tipo_mei: tenant.tipo_mei,
          tipo_atividade: tenant.tipo_atividade ?? "comercio",
          nome_contador: tenant.nome_contador ?? "",
          whatsapp_contador: tenant.whatsapp_contador ?? "",
        }}
      />
    </div>
  );
}
