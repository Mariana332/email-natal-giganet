import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ItemEditor } from "@/components/item-editor";
import { updateOrcamento } from "../../actions";

export default async function EditarOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("orcamentos");
  const { id } = await params;

  const [orcamento, clientes, produtos] = await Promise.all([
    prisma.orcamento.findUnique({ where: { id }, include: { itens: true } }),
    prisma.cliente.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  if (!orcamento) notFound();

  const produtoOptions = produtos.map((p) => ({
    id: p.id,
    nome: p.nome,
    unidade: p.unidade,
    precoVenda: Number(p.precoVenda),
  }));

  const defaultItems = orcamento.itens.map((i) => ({
    key: i.id,
    produtoId: i.produtoId ?? "",
    descricao: i.descricao,
    quantidade: Number(i.quantidade),
    valorUnitario: Number(i.valorUnitario),
  }));

  const boundAction = updateOrcamento.bind(null, id);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={`Editar orçamento #${orcamento.numero}`} />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Cliente" required className="sm:col-span-2">
              <Select name="clienteId" required defaultValue={orcamento.clienteId}>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Validade da proposta">
              <Input
                type="date"
                name="dataValidade"
                defaultValue={
                  orcamento.dataValidade
                    ? orcamento.dataValidade.toISOString().slice(0, 10)
                    : ""
                }
              />
            </Field>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-nexa-charcoal">Itens do orçamento</p>
            <ItemEditor produtos={produtoOptions} defaultItems={defaultItems} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Desconto (R$)">
              <Input
                type="number"
                name="desconto"
                min="0"
                step="0.01"
                defaultValue={Number(orcamento.desconto)}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações">
              <Textarea name="observacoes" rows={3} defaultValue={orcamento.observacoes ?? ""} />
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href={`/orcamentos/${id}`} variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
