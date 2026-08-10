import { Plus, Mail, Phone, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DeleteButton } from "@/components/ui/delete-button";
import { PrintButton } from "@/components/ui/print-button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { deleteCliente } from "./actions";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireModule("cadastros");
  const { q } = await searchParams;

  const clientes = await prisma.cliente.findMany({
    where: {
      ativo: true,
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" } },
              { documento: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description={`${clientes.length} cliente(s) cadastrado(s)`}
        action={
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            <ButtonLink href="/clientes/novo" className="no-print">
              <Plus className="h-4 w-4" /> Novo cliente
            </ButtonLink>
          </div>
        }
      />

      <div className="mb-4 no-print">
        <SearchInput placeholder="Buscar por nome, documento ou e-mail..." />
      </div>

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3 text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const whatsappUrl = buildWhatsAppUrl(c.whatsapp || c.telefone);
              return (
                <tr
                  key={c.id}
                  className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/clientes/${c.id}`}
                      className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                    >
                      {c.nome}
                    </a>
                    {c.documento && (
                      <p className="text-xs text-nexa-gray">{c.documento}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-nexa-charcoal">
                    {c.tipo === "FISICA" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </td>
                  <td className="px-4 py-3 text-nexa-charcoal">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-nexa-gray" /> {c.email}
                        </span>
                      )}
                      {c.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-nexa-gray" /> {c.telefone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-nexa-charcoal">
                    {c.cidade ? `${c.cidade}${c.estado ? "/" + c.estado : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right no-print">
                    <div className="flex items-center justify-end gap-3">
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Conversar no WhatsApp"
                          className="text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                      <DeleteButton id={c.id} action={deleteCliente} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
