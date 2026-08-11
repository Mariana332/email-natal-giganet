import { MessageSquareText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { updateEmpresa } from "./actions";
import { EmpresaFields } from "./empresa-fields";

export default async function ConfiguracoesPage() {
  await requireModule("configuracoes");

  const empresa = await prisma.empresa.findFirst();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Configurações da Gráfica"
        description="Dados usados no PDF de orçamentos e no WhatsApp central compartilhado por todos os vendedores."
        action={
          <ButtonLink href="/configuracoes/mensagens" variant="secondary">
            <MessageSquareText className="h-4 w-4" /> Modelos de Mensagem
          </ButtonLink>
        }
      />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={updateEmpresa}>
          <EmpresaFields defaultValues={empresa} />
          <div className="mt-6 flex justify-end">
            <SubmitButton>Salvar configurações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
