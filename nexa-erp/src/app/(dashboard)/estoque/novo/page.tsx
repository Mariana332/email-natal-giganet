import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { createItemEstoque } from "../actions";
import { ItemEstoqueFields } from "../item-fields";

export default async function NovoItemEstoquePage() {
  await requireModule("estoque");

  const fornecedores = await prisma.fornecedor.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo insumo" description="Cadastre um item de estoque." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createItemEstoque}>
          <ItemEstoqueFields fornecedores={fornecedores} />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/estoque" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar insumo</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
