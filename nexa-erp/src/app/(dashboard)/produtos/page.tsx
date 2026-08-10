import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DeleteButton } from "@/components/ui/delete-button";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { CATEGORIA_PRODUTO_LABELS, formatCurrency } from "@/lib/labels";
import { deleteProduto } from "./actions";
import { ImportarProdutosForm } from "./importar-produtos-form";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("cadastros");
  const { q } = await searchParams;

  const produtos = await prisma.produto.findMany({
    where: {
      ativo: true,
      ...(q ? { nome: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Produtos & Serviços"
        description={`${produtos.length} item(ns) no catálogo`}
        action={
          <div className="flex flex-wrap items-start justify-end gap-2">
            <PrintButton />
            <ImportarProdutosForm />
            <ButtonLink href="/produtos/novo" className="no-print">
              <Plus className="h-4 w-4" /> Novo item
            </ButtonLink>
          </div>
        }
      />

      <div className="mb-4 no-print">
        <SearchInput placeholder="Buscar por nome..." />
      </div>

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Produto/Serviço</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3 text-right">Margem</th>
              <th className="px-4 py-3 text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => {
              const preco = Number(p.precoVenda);
              const custo = Number(p.custo);
              const margem = preco > 0 ? ((preco - custo) / preco) * 100 : 0;
              return (
                <tr
                  key={p.id}
                  className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/produtos/${p.id}`}
                      className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                    >
                      {p.nome}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="teal">{CATEGORIA_PRODUTO_LABELS[p.categoria]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-nexa-charcoal">{p.unidade}</td>
                  <td className="px-4 py-3 text-right font-medium text-nexa-black">
                    {formatCurrency(preco)}
                  </td>
                  <td className="px-4 py-3 text-right text-nexa-gray">
                    {margem.toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right no-print">
                    <DeleteButton id={p.id} action={deleteProduto} />
                  </td>
                </tr>
              );
            })}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum produto ou serviço cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
