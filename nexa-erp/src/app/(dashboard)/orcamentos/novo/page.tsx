import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ItemEditor } from "@/components/item-editor";
import { createOrcamento } from "../actions";

export default async function NovoOrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ clienteId?: string; leadId?: string }>;
}) {
  await requireModule("orcamentos");
  const { clienteId, leadId } = await searchParams;

  const [clientes, produtos] = await Promise.all([
    prisma.cliente.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  const produtoOptions = produtos.map((p) => ({
    id: p.id,
    nome: p.nome,
    unidade: p.unidade,
    precoVenda: Number(p.precoVenda),
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Novo orçamento" description="Monte um orçamento para o cliente." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createOrcamento}>
          {leadId && <input type="hidden" name="leadId" value={leadId} />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Cliente" required className="sm:col-span-2">
              <Select name="clienteId" required defaultValue={clienteId ?? ""}>
                <option value="" disabled>
                  Selecione um cliente
                </option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Validade da proposta">
              <Input type="date" name="dataValidade" />
            </Field>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-nexa-charcoal">Itens do orçamento</p>
            <ItemEditor produtos={produtoOptions} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Desconto (R$)">
              <Input type="number" name="desconto" min="0" step="0.01" defaultValue={0} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações">
              <Textarea name="observacoes" rows={3} />
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/orcamentos" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar orçamento</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
