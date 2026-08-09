import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/labels";
import { updateItemEstoque, registrarMovimentacao } from "../actions";
import { ItemEstoqueFields } from "../item-fields";

export default async function EditarItemEstoquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("estoque");
  const { id } = await params;

  const [item, fornecedores] = await Promise.all([
    prisma.itemEstoque.findUnique({
      where: { id },
      include: {
        movimentacoes: {
          include: { usuario: true },
          orderBy: { createdAt: "desc" },
          take: 15,
        },
      },
    }),
    prisma.fornecedor.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  if (!item) notFound();

  const boundUpdate = updateItemEstoque.bind(null, id);
  const boundMovimentacao = registrarMovimentacao.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={item.nome}
        description={`Estoque atual: ${Number(item.quantidadeAtual)} ${item.unidade}`}
      />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-base font-bold text-nexa-black">
          Movimentar estoque
        </h2>
        <ActionForm action={boundMovimentacao} className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
          <Field label="Tipo">
            <Select name="tipo" defaultValue="ENTRADA">
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
              <option value="AJUSTE">Ajuste (definir valor)</option>
            </Select>
          </Field>
          <Field label="Quantidade">
            <Input type="number" name="quantidade" min="0.01" step="0.01" required />
          </Field>
          <Field label="Motivo" className="sm:col-span-2">
            <Input name="motivo" placeholder="Ex: compra, uso em OS #123, perda..." />
          </Field>
          <div className="sm:col-span-4">
            <SubmitButton>Registrar movimentação</SubmitButton>
          </div>
        </ActionForm>
      </div>

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-base font-bold text-nexa-black">
          Dados do insumo
        </h2>
        <ActionForm action={boundUpdate}>
          <ItemEstoqueFields defaultValues={item} fornecedores={fornecedores} isEditing />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/estoque" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-base font-bold text-nexa-black">
          Histórico de movimentações
        </h2>
        <div className="space-y-2">
          {item.movimentacoes.map((m) => (
            <div key={m.id} className="flex items-center justify-between text-sm">
              <Badge color={m.tipo === "ENTRADA" ? "green" : m.tipo === "SAIDA" ? "red" : "blue"}>
                {m.tipo === "ENTRADA" ? "Entrada" : m.tipo === "SAIDA" ? "Saída" : "Ajuste"}
              </Badge>
              <span className="text-nexa-charcoal">
                {Number(m.quantidade)} {item.unidade}
              </span>
              <span className="text-nexa-gray">{m.motivo ?? "—"}</span>
              <span className="text-nexa-charcoal">{m.usuario.name}</span>
              <span className="text-nexa-gray">{formatDate(m.createdAt)}</span>
            </div>
          ))}
          {item.movimentacoes.length === 0 && (
            <p className="text-sm text-nexa-gray">Nenhuma movimentação registrada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
