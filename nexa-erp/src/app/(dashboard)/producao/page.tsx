import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EtapaSelect } from "@/components/etapa-select";
import {
  ETAPAS_ORDENADAS,
  ETAPA_PRODUCAO_LABELS,
  PRIORIDADE_COLORS,
  PRIORIDADE_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/labels";
import { moveEtapaForm } from "../ordens-servico/actions";

export default async function ProducaoPage() {
  await requireModule("producao");

  const ordens = await prisma.ordemServico.findMany({
    where: { etapa: { not: "CANCELADO" } },
    include: { cliente: true },
    orderBy: [{ prioridade: "desc" }, { createdAt: "asc" }],
  });

  const columns = ETAPAS_ORDENADAS.map((etapa) => ({
    etapa,
    ordens: ordens.filter((o) => o.etapa === etapa),
  }));

  return (
    <div>
      <PageHeader
        title="Produção"
        description="Acompanhe o fluxo de produção da gráfica em tempo real."
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.etapa} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-heading text-sm font-bold text-nexa-black">
                {ETAPA_PRODUCAO_LABELS[col.etapa]}
              </h2>
              <span className="rounded-full bg-nexa-gray-light px-2 py-0.5 text-xs font-semibold text-nexa-charcoal">
                {col.ordens.length}
              </span>
            </div>
            <div className="space-y-3 rounded-xl bg-nexa-gray-light/40 p-2 min-h-[120px]">
              {col.ordens.map((os) => (
                <div
                  key={os.id}
                  className="rounded-lg border border-nexa-gray-light bg-white p-3 shadow-sm"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <Link
                      href={`/ordens-servico/${os.id}`}
                      className="text-sm font-semibold text-nexa-black hover:text-nexa-teal-dark"
                    >
                      OS #{os.numero}
                    </Link>
                    <Badge color={PRIORIDADE_COLORS[os.prioridade]}>
                      {PRIORIDADE_LABELS[os.prioridade]}
                    </Badge>
                  </div>
                  <p className="mb-1 truncate text-xs text-nexa-charcoal">{os.cliente.nome}</p>
                  <div className="mb-2 flex items-center justify-between text-xs text-nexa-gray">
                    <span>{formatDate(os.dataEntrega)}</span>
                    <span className="font-medium text-nexa-black">
                      {formatCurrency(Number(os.total))}
                    </span>
                  </div>
                  <EtapaSelect osId={os.id} etapa={os.etapa} action={moveEtapaForm} />
                </div>
              ))}
              {col.ordens.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-nexa-gray">
                  Nenhuma OS nesta etapa
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
