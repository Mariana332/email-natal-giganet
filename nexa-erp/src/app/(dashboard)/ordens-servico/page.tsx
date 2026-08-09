import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import {
  ETAPA_PRODUCAO_COLORS,
  ETAPA_PRODUCAO_LABELS,
  PRIORIDADE_COLORS,
  PRIORIDADE_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/labels";

export default async function OrdensServicoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("ordensServico");
  const { q } = await searchParams;

  const ordens = await prisma.ordemServico.findMany({
    where: q
      ? { cliente: { nome: { contains: q, mode: "insensitive" } } }
      : {},
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Ordens de Serviço"
        description={`${ordens.length} OS registrada(s)`}
        action={
          <ButtonLink href="/ordens-servico/novo">
            <Plus className="h-4 w-4" /> Nova OS
          </ButtonLink>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Buscar por cliente..." />
      </div>

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Nº</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Etapa</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Entrega</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((os) => (
              <tr
                key={os.id}
                className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/ordens-servico/${os.id}`}
                    className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                  >
                    #{os.numero}
                  </a>
                </td>
                <td className="px-4 py-3 text-nexa-charcoal">{os.cliente.nome}</td>
                <td className="px-4 py-3">
                  <Badge color={ETAPA_PRODUCAO_COLORS[os.etapa]}>
                    {ETAPA_PRODUCAO_LABELS[os.etapa]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={PRIORIDADE_COLORS[os.prioridade]}>
                    {PRIORIDADE_LABELS[os.prioridade]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-nexa-gray">{formatDate(os.dataEntrega)}</td>
                <td className="px-4 py-3 text-right font-medium text-nexa-black">
                  {formatCurrency(Number(os.total))}
                </td>
              </tr>
            ))}
            {ordens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhuma ordem de serviço encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
