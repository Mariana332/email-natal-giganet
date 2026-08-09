import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { requireModule } from "@/lib/auth-guard";
import { createCliente } from "../actions";
import { ClienteFields } from "../cliente-fields";

export default async function NovoClientePage() {
  await requireModule("cadastros");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Novo cliente" description="Cadastre um novo cliente da gráfica." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createCliente}>
          <ClienteFields />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/clientes" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar cliente</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
