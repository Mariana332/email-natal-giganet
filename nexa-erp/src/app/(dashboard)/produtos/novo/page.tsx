import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { requireModule } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createProduto } from "../actions";
import { ProdutoFields } from "../produto-fields";

export default async function NovoProdutoPage() {
  await requireModule("cadastros");
  const empresa = await prisma.empresa.findFirst();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo produto/serviço" description="Cadastre um item do catálogo." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createProduto}>
          <ProdutoFields
            markupPadrao={empresa?.markupPadrao ? Number(empresa.markupPadrao) : null}
          />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/produtos" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar item</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
