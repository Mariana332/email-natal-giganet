import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { requireModule } from "@/lib/auth-guard";
import { createFornecedor } from "../actions";
import { FornecedorFields } from "../fornecedor-fields";

export default async function NovoFornecedorPage() {
  await requireModule("cadastros");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo fornecedor" description="Cadastre um novo fornecedor." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createFornecedor}>
          <FornecedorFields />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/fornecedores" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar fornecedor</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
