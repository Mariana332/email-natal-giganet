import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRightLeft, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { ETAPA_FUNIL_COLORS, ETAPA_FUNIL_LABELS, formatCurrency, formatDate } from "@/lib/labels";
import { updateLead, convertLeadToCliente, deleteLead } from "../actions";
import { LeadFields } from "../lead-fields";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("crm");
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { cliente: true, orcamento: true, vendedor: true },
  });
  if (!lead) notFound();

  const boundAction = updateLead.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={lead.nome}
        description={lead.empresa ?? "Contato do funil de vendas"}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={ETAPA_FUNIL_COLORS[lead.etapa]}>{ETAPA_FUNIL_LABELS[lead.etapa]}</Badge>
            {lead.etapa === "NOVO_CONTATO" && (
              <DeleteButton id={id} action={deleteLead} confirmText="Excluir este contato?" label="Excluir" />
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Cliente vinculado</p>
          {lead.cliente ? (
            <Link
              href={`/clientes/${lead.cliente.id}`}
              className="font-medium text-nexa-black hover:text-nexa-teal-dark"
            >
              {lead.cliente.nome}
            </Link>
          ) : (
            <form action={convertLeadToCliente.bind(null, id)} className="mt-1">
              <Button type="submit" variant="secondary">
                <UserPlus className="h-4 w-4" /> Converter em cliente
              </Button>
            </form>
          )}
        </div>

        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Orçamento</p>
          {lead.orcamento ? (
            <Link
              href={`/orcamentos/${lead.orcamento.id}`}
              className="font-medium text-nexa-black hover:text-nexa-teal-dark"
            >
              Orçamento #{lead.orcamento.numero} — {formatCurrency(Number(lead.orcamento.total))}
            </Link>
          ) : lead.cliente ? (
            <ButtonLink
              href={`/orcamentos/novo?clienteId=${lead.cliente.id}&leadId=${lead.id}`}
              variant="secondary"
              className="mt-1"
            >
              <ArrowRightLeft className="h-4 w-4" /> Criar orçamento
            </ButtonLink>
          ) : (
            <p className="mt-1 text-sm text-nexa-gray">Converta em cliente primeiro.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <LeadFields defaultValues={lead} />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-nexa-gray">
              Vendedor responsável: {lead.vendedor.name} · Criado em {formatDate(lead.createdAt)}
            </p>
            <div className="flex gap-2">
              <ButtonLink href="/crm" variant="secondary">
                Voltar
              </ButtonLink>
              <SubmitButton>Salvar alterações</SubmitButton>
            </div>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
