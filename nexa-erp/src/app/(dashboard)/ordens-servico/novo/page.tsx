import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ItemEditor } from "@/components/item-editor";
import { PRIORIDADE_LABELS, FORMA_PAGAMENTO_LABELS } from "@/lib/labels";
import { createOrdemServico } from "../actions";

export default async function NovaOrdemServicoPage() {
  await requireModule("ordensServico");

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
      <PageHeader title="Nova Ordem de Serviço" description="Registre um novo pedido de produção." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createOrdemServico}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Field label="Cliente" required className="sm:col-span-2">
              <Select name="clienteId" required defaultValue="">
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
            <Field label="Prioridade">
              <Select name="prioridade" defaultValue="NORMAL">
                {Object.entries(PRIORIDADE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Previsão de entrega">
              <Input type="date" name="dataEntrega" />
            </Field>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-nexa-charcoal">Itens da OS</p>
            <ItemEditor produtos={produtoOptions} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Desconto (R$)">
              <Input type="number" name="desconto" min="0" step="0.01" defaultValue={0} />
            </Field>
            <Field label="Forma de pagamento">
              <Select name="formaPagamento" defaultValue="">
                <option value="">Não definida</option>
                {Object.entries(FORMA_PAGAMENTO_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações">
              <Textarea name="observacoes" rows={3} />
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/ordens-servico" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Criar OS</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
