import Link from "next/link";
import { Plus, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { FunilSelect } from "@/components/funil-select";
import { ETAPAS_FUNIL_ORDENADAS, ETAPA_FUNIL_LABELS, formatCurrency } from "@/lib/labels";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { moveEtapaLeadForm } from "./actions";

export default async function CrmPage() {
  await requireModule("crm");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = ETAPAS_FUNIL_ORDENADAS.map((etapa) => ({
    etapa,
    leads: leads.filter((l) => l.etapa === etapa),
  }));

  return (
    <div>
      <PageHeader
        title="CRM"
        description="Funil de vendas: do primeiro contato até o fechamento."
        action={
          <ButtonLink href="/crm/novo">
            <Plus className="h-4 w-4" /> Novo contato
          </ButtonLink>
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.etapa} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-heading text-sm font-bold text-nexa-black">
                {ETAPA_FUNIL_LABELS[col.etapa]}
              </h2>
              <span className="rounded-full bg-nexa-gray-light px-2 py-0.5 text-xs font-semibold text-nexa-charcoal">
                {col.leads.length}
              </span>
            </div>
            <div className="space-y-3 rounded-xl bg-nexa-gray-light/40 p-2 min-h-[120px]">
              {col.leads.map((lead) => {
                const whatsappUrl = buildWhatsAppUrl(lead.whatsapp || lead.telefone);
                return (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-nexa-gray-light bg-white p-3 shadow-sm"
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <Link
                        href={`/crm/${lead.id}`}
                        className="truncate text-sm font-semibold text-nexa-black hover:text-nexa-teal-dark"
                      >
                        {lead.nome}
                      </Link>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Conversar no WhatsApp"
                          className="shrink-0 text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {lead.empresa && (
                      <p className="mb-1 truncate text-xs text-nexa-charcoal">{lead.empresa}</p>
                    )}
                    <div className="mb-2 flex items-center justify-between text-xs text-nexa-gray">
                      <span>{lead.origem || "—"}</span>
                      {lead.valorEstimado !== null && (
                        <span className="font-medium text-nexa-black">
                          {formatCurrency(Number(lead.valorEstimado))}
                        </span>
                      )}
                    </div>
                    <FunilSelect leadId={lead.id} etapa={lead.etapa} action={moveEtapaLeadForm} />
                  </div>
                );
              })}
              {col.leads.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-nexa-gray">
                  Nenhum contato nesta etapa
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
