import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { NexaLogo } from "@/components/nexa-logo";
import { formatCurrency, formatDate } from "@/lib/labels";
import { buildOrcamentoWhatsAppUrl } from "@/lib/whatsapp";
import { PrintActions } from "./print-actions";

export default async function ImprimirOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("orcamentos");
  const { id } = await params;

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { cliente: true, itens: true },
  });
  if (!orcamento) notFound();

  const empresa = await prisma.empresa.findFirst();
  const whatsappUrl = buildOrcamentoWhatsAppUrl(orcamento, empresa);
  const subtotal = orcamento.itens.reduce((acc, i) => acc + Number(i.valorTotal), 0);
  const desconto = Number(orcamento.desconto);

  return (
    <div className="mx-auto max-w-3xl bg-white px-6 py-10 print:px-0 print:py-0">
      <PrintActions whatsappUrl={whatsappUrl} />

      <div className="space-y-6 rounded-xl border border-nexa-gray-light p-6 print:border-0 print:p-0">
        <div className="flex items-start justify-between border-b border-nexa-gray-light pb-4">
          <div>
            <NexaLogo light={false} />
            {empresa?.endereco && (
              <p className="mt-2 text-xs text-nexa-gray">{empresa.endereco}</p>
            )}
            <p className="text-xs text-nexa-gray">
              {[empresa?.telefone && `WhatsApp: ${empresa.telefone}`, empresa?.instagram]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </div>
          <div className="text-right">
            <h4 className="font-heading text-lg font-bold text-nexa-black">
              ORÇAMENTO #{orcamento.numero}
            </h4>
            <p className="text-xs text-nexa-gray">Data: {formatDate(orcamento.createdAt)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-nexa-gray-light bg-nexa-gray-light/20 p-4">
          <h5 className="text-xs font-bold uppercase text-nexa-gray">Dados do Cliente</h5>
          <p className="mt-1 font-bold text-nexa-black">{orcamento.cliente.nome}</p>
          <p className="text-sm text-nexa-charcoal">
            {orcamento.cliente.whatsapp || orcamento.cliente.telefone || ""}
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light text-xs uppercase text-nexa-gray">
              <th className="py-2">Descrição do Produto / Serviço</th>
              <th className="py-2 text-center">Qtd</th>
              <th className="py-2 text-right">Preço Unit.</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.itens.map((item) => (
              <tr key={item.id} className="border-b border-nexa-gray-light/60">
                <td className="py-3 font-medium text-nexa-black">{item.descricao}</td>
                <td className="py-3 text-center text-nexa-charcoal">{Number(item.quantidade)}</td>
                <td className="py-3 text-right text-nexa-charcoal">
                  {formatCurrency(Number(item.valorUnitario))}
                </td>
                <td className="py-3 text-right font-bold text-nexa-black">
                  {formatCurrency(Number(item.valorTotal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-nexa-gray">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-medium text-green-700">
              <span>Desconto:</span>
              <span>- {formatCurrency(desconto)}</span>
            </div>
            <div className="flex justify-between border-t border-nexa-gray-light pt-2 text-base font-bold text-nexa-black">
              <span>Total Geral:</span>
              <span className="text-nexa-teal-dark">{formatCurrency(Number(orcamento.total))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 border-t border-nexa-gray-light pt-4 text-xs text-nexa-gray">
          <p>
            <strong>Observações:</strong> {orcamento.observacoes || "Nenhuma observação informada."}
          </p>
          <p>
            Validade deste orçamento:{" "}
            {orcamento.dataValidade ? formatDate(orcamento.dataValidade) : "7 dias"}. Condições de
            pagamento a combinar.
          </p>
        </div>
      </div>
    </div>
  );
}
