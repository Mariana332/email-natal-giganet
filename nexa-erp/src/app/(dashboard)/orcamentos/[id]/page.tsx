import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Send, CheckCircle2, XCircle, ArrowRightLeft, MessageCircle, Printer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { STATUS_ORCAMENTO_COLORS, STATUS_ORCAMENTO_LABELS, formatCurrency, formatDate } from "@/lib/labels";
import { buildOrcamentoWhatsAppUrl } from "@/lib/whatsapp";
import { setOrcamentoStatus, deleteOrcamento, convertOrcamentoToOS } from "../actions";

export default async function OrcamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("orcamentos");
  const { id } = await params;

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: {
      cliente: true,
      vendedor: true,
      itens: true,
      ordemServico: true,
    },
  });
  if (!orcamento) notFound();

  const subtotal = orcamento.itens.reduce((acc, i) => acc + Number(i.valorTotal), 0);
  const empresa = await prisma.empresa.findFirst();
  const whatsappUrl = buildOrcamentoWhatsAppUrl(orcamento, empresa);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={`Orçamento #${orcamento.numero}`}
        description={orcamento.cliente.nome}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={STATUS_ORCAMENTO_COLORS[orcamento.status]}>
              {STATUS_ORCAMENTO_LABELS[orcamento.status]}
            </Badge>
            <ButtonLink href={`/orcamentos/${id}/imprimir`} variant="secondary">
              <Printer className="h-4 w-4" /> Imprimir / PDF
            </ButtonLink>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-nexa-gray-light bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-nexa-gray-light/60"
              >
                <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
              </a>
            )}
            {orcamento.status === "RASCUNHO" && (
              <>
                <ButtonLink href={`/orcamentos/${id}/editar`} variant="secondary">
                  <Pencil className="h-4 w-4" /> Editar
                </ButtonLink>
                <form action={setOrcamentoStatus.bind(null, id, "ENVIADO")}>
                  <Button type="submit" variant="secondary">
                    <Send className="h-4 w-4" /> Marcar como enviado
                  </Button>
                </form>
                <DeleteButton
                  id={id}
                  action={deleteOrcamento}
                  confirmText="Excluir este orçamento?"
                  label="Excluir"
                />
              </>
            )}
            {orcamento.status === "ENVIADO" && (
              <>
                <form action={setOrcamentoStatus.bind(null, id, "APROVADO")}>
                  <Button type="submit" variant="primary">
                    <CheckCircle2 className="h-4 w-4" /> Aprovar
                  </Button>
                </form>
                <form action={setOrcamentoStatus.bind(null, id, "REJEITADO")}>
                  <Button type="submit" variant="danger">
                    <XCircle className="h-4 w-4" /> Rejeitar
                  </Button>
                </form>
              </>
            )}
            {orcamento.status === "APROVADO" && !orcamento.ordemServico && (
              <form action={convertOrcamentoToOS.bind(null, id)}>
                <Button type="submit" variant="primary">
                  <ArrowRightLeft className="h-4 w-4" /> Converter em OS
                </Button>
              </form>
            )}
            {orcamento.ordemServico && (
              <ButtonLink href={`/ordens-servico/${orcamento.ordemServico.id}`} variant="secondary">
                Ver OS gerada
              </ButtonLink>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Cliente</p>
          <Link href={`/clientes/${orcamento.cliente.id}`} className="font-medium text-nexa-black hover:text-nexa-teal-dark">
            {orcamento.cliente.nome}
          </Link>
        </div>
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Vendedor</p>
          <p className="font-medium text-nexa-black">{orcamento.vendedor.name}</p>
        </div>
        <div className="rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Validade</p>
          <p className="font-medium text-nexa-black">{formatDate(orcamento.dataValidade)}</p>
        </div>
      </div>

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
            {orcamento.itens.map((i) => (
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
          <p className="text-nexa-gray">Desconto: {formatCurrency(Number(orcamento.desconto))}</p>
          <p className="font-heading text-lg font-bold text-nexa-black">
            Total: {formatCurrency(Number(orcamento.total))}
          </p>
        </div>
      </div>

      {orcamento.observacoes && (
        <div className="mt-4 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-nexa-gray">Observações</p>
          <p className="mt-1 text-sm text-nexa-charcoal">{orcamento.observacoes}</p>
        </div>
      )}
    </div>
  );
}
