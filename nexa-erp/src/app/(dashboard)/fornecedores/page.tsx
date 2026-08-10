import { Plus, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DeleteButton } from "@/components/ui/delete-button";
import { PrintButton } from "@/components/ui/print-button";
import { deleteFornecedor } from "./actions";

export default async function FornecedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("cadastros");
  const { q } = await searchParams;

  const fornecedores = await prisma.fornecedor.findMany({
    where: {
      ativo: true,
      ...(q ? { nome: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        description={`${fornecedores.length} fornecedor(es) cadastrado(s)`}
        action={
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            <ButtonLink href="/fornecedores/novo" className="no-print">
              <Plus className="h-4 w-4" /> Novo fornecedor
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
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3 text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f) => (
              <tr
                key={f.id}
                className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/fornecedores/${f.id}`}
                    className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                  >
                    {f.nome}
                  </a>
                  {f.documento && <p className="text-xs text-nexa-gray">{f.documento}</p>}
                </td>
                <td className="px-4 py-3 text-nexa-charcoal">
                  <div className="flex flex-col gap-0.5 text-xs">
                    {f.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-nexa-gray" /> {f.email}
                      </span>
                    )}
                    {f.telefone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-nexa-gray" /> {f.telefone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-nexa-charcoal">{f.cidade ?? "—"}</td>
                <td className="px-4 py-3 text-right no-print">
                  <DeleteButton id={f.id} action={deleteFornecedor} />
                </td>
              </tr>
            ))}
            {fornecedores.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
