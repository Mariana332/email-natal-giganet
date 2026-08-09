import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { updateLancamento } from "../actions";
import { LancamentoFields } from "../lancamento-fields";

export default async function EditarLancamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("financeiro");
  const { id } = await params;

  const [lancamento, clientes, fornecedores] = await Promise.all([
    prisma.lancamentoFinanceiro.findUnique({ where: { id } }),
    prisma.cliente.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.fornecedor.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  if (!lancamento) notFound();

  const boundAction = updateLancamento.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar lançamento" description={lancamento.descricao} />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <LancamentoFields
            defaultValues={lancamento}
            clientes={clientes}
            fornecedores={fornecedores}
          />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/financeiro" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
