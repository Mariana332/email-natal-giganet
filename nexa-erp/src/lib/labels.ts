export const ETAPA_PRODUCAO_LABELS: Record<string, string> = {
  FILA: "Fila",
  DESIGN: "Design",
  IMPRESSAO: "Impressão",
  ACABAMENTO: "Acabamento",
  EXPEDICAO: "Expedição",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const ETAPA_PRODUCAO_COLORS: Record<string, "teal" | "green" | "red" | "yellow" | "gray" | "blue" | "purple"> = {
  FILA: "gray",
  DESIGN: "purple",
  IMPRESSAO: "blue",
  ACABAMENTO: "yellow",
  EXPEDICAO: "teal",
  ENTREGUE: "green",
  CANCELADO: "red",
};

export const ETAPAS_ORDENADAS = [
  "FILA",
  "DESIGN",
  "IMPRESSAO",
  "ACABAMENTO",
  "EXPEDICAO",
  "ENTREGUE",
] as const;

export const STATUS_ORCAMENTO_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  EXPIRADO: "Expirado",
  CONVERTIDO: "Convertido em OS",
};

export const STATUS_ORCAMENTO_COLORS: Record<string, "teal" | "green" | "red" | "yellow" | "gray" | "blue" | "purple"> = {
  RASCUNHO: "gray",
  ENVIADO: "blue",
  APROVADO: "green",
  REJEITADO: "red",
  EXPIRADO: "yellow",
  CONVERTIDO: "teal",
};

export const PRIORIDADE_LABELS: Record<string, string> = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

export const PRIORIDADE_COLORS: Record<string, "teal" | "green" | "red" | "yellow" | "gray" | "blue" | "purple"> = {
  BAIXA: "gray",
  NORMAL: "blue",
  ALTA: "yellow",
  URGENTE: "red",
};

export const STATUS_LANCAMENTO_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ATRASADO: "Atrasado",
  CANCELADO: "Cancelado",
};

export const STATUS_LANCAMENTO_COLORS: Record<string, "teal" | "green" | "red" | "yellow" | "gray" | "blue" | "purple"> = {
  PENDENTE: "yellow",
  PAGO: "green",
  ATRASADO: "red",
  CANCELADO: "gray",
};

export const CATEGORIA_PRODUTO_LABELS: Record<string, string> = {
  IMPRESSAO_DIGITAL: "Impressão Digital",
  OFFSET: "Offset",
  BANNER: "Banner",
  ADESIVO: "Adesivo",
  PAPELARIA: "Papelaria",
  COMUNICACAO_VISUAL: "Comunicação Visual",
  PERSONALIZADOS: "Personalizados",
  ACABAMENTO: "Acabamento",
  OUTROS: "Outros",
};

export const CATEGORIA_ESTOQUE_LABELS: Record<string, string> = {
  PAPEL: "Papel",
  TINTA: "Tinta",
  CHAPA: "Chapa",
  ACABAMENTO: "Acabamento",
  OUTROS: "Outros",
};

export const FORMA_PAGAMENTO_LABELS: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferência",
  PRAZO: "A Prazo",
};

export const TIPO_LANCAMENTO_LABELS: Record<string, string> = {
  RECEITA: "Receita",
  DESPESA: "Despesa",
};

export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VENDEDOR", label: "Vendedor" },
  { value: "PRODUCAO", label: "Produção" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "ESTOQUE", label: "Estoque" },
];

export function formatCurrency(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("pt-BR");
}
