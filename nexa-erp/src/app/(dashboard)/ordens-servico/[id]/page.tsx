import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { canAccess } from "@/lib/permissions";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import {
  ETAPA_PRODUCAO_COLORS,
  ETAPA_PRODUCAO_LABELS,
  ETAPAS_ORDENADAS,
  PRIORIDADE_COLORS,
  PRIORIDADE_LABELS,
  FORMA_PAGAMENTO_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/labels";
import { updateEtapa, updatePrioridade, deleteOrdemServico } from "../actions";

export default async function OrdemServicoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireModule("ordensServico");
  const { id } = await params;

  const os = await prisma.ordemServico.findUnique({
    where: { id },
    include: {
      cliente: true,
      vendedor: true,
      orcamento: true,
      itens: true,
      producaoLogs: { include: { usuario: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!os) notFound();

  const canManageProducao = canAccess(session.user.role, "producao");
  const subtotal = os.itens.reduce((acc, i) => acc + Number(i.valorTotal), 0);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={`OS #${os.numero}`}
        description={os.cliente.nome}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={ETAPA_PRODUCAO_COLORS[os.etapa]}>
              {ETAPA_PRODUCAO_LABELS[os.etapa]}
            </Badge>
            <Badge color={PRIORIDADE_COLORS[os.prioridade]}>
              {PRIORIDADE_LABELS[os.prioridade]}
            </Badge>
            {os.etapa === "FILA" && (
              <DeleteButton
                id={id}
                action={deleteOrdemServico}
                confirmText="Excluir esta OS?"
                label="Excluir"
              />
            )}
          </div>
        }
      />

      {canManageProducao && os.etapa !== "CANCELADO" && (
        <div className="mb-4 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-wide text-nexa-gray">
            Avançar etapa de produção
          </p>
          <div className="flex flex-wrap gap-2">
            {ETAPAS_ORDENADAS.map((etapa) => (
              <form key={etapa} action={updateEtapa.bind(null, id, etapa)}>
                <button
                  type="submit"
                  disabled={etapa === os.etapa}
                  className={`badge cursor-pointer border transition ${
                    etapa === os.etapa
                      ? "border-nexa-teal bg-nexa-teal text-nexa-black"
                      : "border-nexa-gray-light bg-white text-nexa-charcoal hover:border-nexa-teal"
                  }`}
                >
                  {ETAPA_PRODUCAO_LABELS[etapa]}
                </button>
              </form>
            ))}
            <form action={updateEtapa.bind(null, id, "CANCELADO")}>
              <button
                type="submit"
                className="badge cursor-pointer border border-red-200 bg-white text-red-600 hover:bg-red-50"
              >
                Cancelar OS
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Cliente</p>
          <Link href={`/clientes/${os.cliente.id}`} className="font-medium text-nexa-black hover:text-nexa-teal-dark">
            {os.cliente.nome}
          </Link>
        </div>
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Entrega prevista</p>
          <p className="font-medium text-nexa-black">{formatDate(os.dataEntrega)}</p>
        </div>
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Forma de pagamento</p>
          <p className="font-medium text-nexa-black">
            {os.formaPagamento ? FORMA_PAGAMENTO_LABELS[os.formaPagamento] : "—"}
          </p>
        </div>
      </div>

      {canManageProducao && (
        <form action={updatePrioridade.bind(null, id)} className="mt-4 flex items-center gap-2 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <span className="text-sm text-nexa-charcoal">Prioridade:</span>
          <select
            name="prioridade"
            defaultValue={os.prioridade}
            className="rounded-lg border border-nexa-gray-light px-2 py-1 text-sm"
          >
            {Object.entries(PRIORIDADE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary" className="py-1.5">
            Atualizar
          </Button>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3 text-right">Qtd</th>
              <th className="px-4 py-3 text-right">Valor unit.</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {os.itens.map((i) => (
              <tr key={i.id} className="border-b border-nexa-gray-light/60 last:border-0">
                <td className="px-4 py-3 text-nexa-charcoal">{i.descricao}</td>
                <td className="px-4 py-3 text-right text-nexa-charcoal">{Number(i.quantidade)}</td>
                <td className="px-4 py-3 text-right text-nexa-charcoal">
                  {formatCurrency(Number(i.valorUnitario))}
                </td>
                <td className="px-4 py-3 text-right font-medium text-nexa-black">
                  {formatCurrency(Number(i.valorTotal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-1 border-t border-nexa-gray-light p-4 text-right text-sm">
          <p className="text-nexa-gray">Subtotal: {formatCurrency(subtotal)}</p>
          <p className="text-nexa-gray">Desconto: {formatCurrency(Number(os.desconto))}</p>
          <p className="font-heading text-lg font-bold text-nexa-black">
            Total: {formatCurrency(Number(os.total))}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs uppercase tracking-wide text-nexa-gray">Histórico de produção</p>
        <div className="space-y-2">
          {os.producaoLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between text-sm">
              <Badge color={ETAPA_PRODUCAO_COLORS[log.etapa]}>
                {ETAPA_PRODUCAO_LABELS[log.etapa]}
              </Badge>
              <span className="text-nexa-charcoal">{log.usuario.name}</span>
              <span className="text-nexa-gray">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
