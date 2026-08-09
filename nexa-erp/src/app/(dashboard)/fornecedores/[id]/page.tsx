import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { updateFornecedor } from "../actions";
import { FornecedorFields } from "../fornecedor-fields";

export default async function EditarFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("cadastros");
  const { id } = await params;

  const fornecedor = await prisma.fornecedor.findUnique({ where: { id } });
  if (!fornecedor) notFound();

  const boundAction = updateFornecedor.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={fornecedor.nome} description="Editar dados do fornecedor." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <FornecedorFields defaultValues={fornecedor} />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/fornecedores" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
