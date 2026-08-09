import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { createLancamento } from "../actions";
import { LancamentoFields } from "../lancamento-fields";

export default async function NovoLancamentoPage() {
  await requireModule("financeiro");

  const [clientes, fornecedores] = await Promise.all([
    prisma.cliente.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.fornecedor.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo lançamento" description="Registre uma conta a pagar ou a receber." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createLancamento}>
          <LancamentoFields clientes={clientes} fornecedores={fornecedores} />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/financeiro" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar lançamento</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
