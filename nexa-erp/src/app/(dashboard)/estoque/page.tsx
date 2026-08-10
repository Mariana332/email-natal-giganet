import { Plus, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { CATEGORIA_ESTOQUE_LABELS, formatCurrency } from "@/lib/labels";

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("estoque");
  const { q } = await searchParams;

  const itens = await prisma.itemEstoque.findMany({
    where: {
      ativo: true,
      ...(q ? { nome: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: { nome: "asc" },
  });

  const baixoEstoque = itens.filter(
    (i) => Number(i.quantidadeAtual) <= Number(i.quantidadeMinima)
  ).length;

  return (
    <div>
      <PageHeader
        title="Estoque"
        description={`${itens.length} insumo(s) cadastrado(s)${baixoEstoque > 0 ? ` · ${baixoEstoque} abaixo do mínimo` : ""}`}
        action={
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            <ButtonLink href="/estoque/novo" className="no-print">
              <Plus className="h-4 w-4" /> Novo insumo
            </ButtonLink>
          </div>
        }
      />

      <div className="mb-4 no-print">
        <SearchInput placeholder="Buscar insumo..." />
      </div>

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Insumo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3 text-right">Estoque atual</th>
              <th className="px-4 py-3 text-right">Mínimo</th>
              <th className="px-4 py-3 text-right">Custo unit.</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => {
              const atual = Number(i.quantidadeAtual);
              const minimo = Number(i.quantidadeMinima);
              const baixo = atual <= minimo;
              return (
                <tr
                  key={i.id}
                  className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/estoque/${i.id}`}
                      className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                    >
                      {i.nome}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="teal">{CATEGORIA_ESTOQUE_LABELS[i.categoria]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        baixo ? "text-red-600" : "text-nexa-black"
                      }`}
                    >
                      {baixo && <AlertTriangle className="h-3.5 w-3.5" />}
                      {atual} {i.unidade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-nexa-gray">
                    {minimo} {i.unidade}
                  </td>
                  <td className="px-4 py-3 text-right text-nexa-charcoal">
                    {formatCurrency(Number(i.custoUnitario))}
                  </td>
                </tr>
              );
            })}
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum insumo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
