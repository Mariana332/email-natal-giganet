import { formatCurrency } from "@/lib/labels";

export function buildWhatsAppUrl(phone: string | null | undefined, message?: string) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://api.whatsapp.com/send?phone=${withCountryCode}${query}`;
}

type OrcamentoParaWhatsApp = {
  numero: number;
  total: unknown;
  cliente: { nome: string; whatsapp: string | null; telefone: string | null };
  itens: { descricao: string; quantidade: unknown; valorUnitario: unknown }[];
};

export function buildOrcamentoWhatsAppUrl(
  orcamento: OrcamentoParaWhatsApp,
  empresa: { nome: string; telefone: string | null } | null
) {
  const mensagem = [
    `Olá ${orcamento.cliente.nome}! Segue o orçamento #${orcamento.numero} da *${empresa?.nome ?? "Nexa Print"}*:`,
    "",
    ...orcamento.itens.map(
      (i) => `📦 ${i.descricao} — ${Number(i.quantidade)} x ${formatCurrency(Number(i.valorUnitario))}`
    ),
    "",
    `💰 *Valor Total:* ${formatCurrency(Number(orcamento.total))}`,
    "",
    `📞 Contato: ${empresa?.telefone ?? ""}`,
  ].join("\n");

  return buildWhatsAppUrl(orcamento.cliente.whatsapp || orcamento.cliente.telefone, mensagem);
}
