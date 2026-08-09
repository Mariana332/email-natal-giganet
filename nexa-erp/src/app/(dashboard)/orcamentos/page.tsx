import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { STATUS_ORCAMENTO_COLORS, STATUS_ORCAMENTO_LABELS, formatCurrency, formatDate } from "@/lib/labels";

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("orcamentos");
  const { q } = await searchParams;

  const orcamentos = await prisma.orcamento.findMany({
    where: q
      ? { cliente: { nome: { contains: q, mode: "insensitive" } } }
      : {},
    include: { cliente: true, vendedor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        description={`${orcamentos.length} orçamento(s)`}
        action={
          <ButtonLink href="/orcamentos/novo">
            <Plus className="h-4 w-4" /> Novo orçamento
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
              <th className="px-4 py-3">Vendedor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Validade</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((o) => (
              <tr
                key={o.id}
                className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/orcamentos/${o.id}`}
                    className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                  >
                    #{o.numero}
                  </a>
                </td>
                <td className="px-4 py-3 text-nexa-charcoal">{o.cliente.nome}</td>
                <td className="px-4 py-3 text-nexa-charcoal">{o.vendedor.name}</td>
                <td className="px-4 py-3">
                  <Badge color={STATUS_ORCAMENTO_COLORS[o.status]}>
                    {STATUS_ORCAMENTO_LABELS[o.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-nexa-gray">{formatDate(o.dataValidade)}</td>
                <td className="px-4 py-3 text-right font-medium text-nexa-black">
                  {formatCurrency(Number(o.total))}
                </td>
              </tr>
            ))}
            {orcamentos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
