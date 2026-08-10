import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { requireModule } from "@/lib/auth-guard";
import { createLead } from "../actions";
import { LeadFields } from "../lead-fields";

export default async function NovoLeadPage() {
  await requireModule("crm");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo contato" description="Registre um novo lead no funil de vendas." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createLead}>
          <LeadFields />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/crm" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar contato</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
