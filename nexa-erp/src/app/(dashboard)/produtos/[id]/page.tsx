import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { updateProduto } from "../actions";
import { ProdutoFields } from "../produto-fields";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("cadastros");
  const { id } = await params;

  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) notFound();

  const boundAction = updateProduto.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={produto.nome} description="Editar produto/serviço." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <ProdutoFields defaultValues={produto} />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/produtos" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
