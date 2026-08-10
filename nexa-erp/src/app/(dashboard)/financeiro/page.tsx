import Link from "next/link";
import { Plus, CheckCircle2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { PrintButton } from "@/components/ui/print-button";
import {
  STATUS_LANCAMENTO_COLORS,
  STATUS_LANCAMENTO_LABELS,
  TIPO_LANCAMENTO_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/labels";
import { marcarPago, deleteLancamento } from "./actions";

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; status?: string }>;
}) {
  await requireModule("financeiro");
  const { tipo, status } = await searchParams;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [lancamentos, receitasPendentes, despesasPendentes, pagoMes] = await Promise.all([
    prisma.lancamentoFinanceiro.findMany({
      where: {
        ...(tipo ? { tipo: tipo as never } : {}),
        ...(status ? { status: status as never } : {}),
      },
      include: { cliente: true, fornecedor: true },
      orderBy: { dataVencimento: "asc" },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      _sum: { valor: true },
      where: { tipo: "RECEITA", status: { in: ["PENDENTE", "ATRASADO"] } },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      _sum: { valor: true },
      where: { tipo: "DESPESA", status: { in: ["PENDENTE", "ATRASADO"] } },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      _sum: { valor: true },
      where: { status: "PAGO", dataPagamento: { gte: startOfMonth }, tipo: "RECEITA" },
    }),
  ]);

  const tabs = [
    { label: "Todos", tipo: "", status: "" },
    { label: "A Receber", tipo: "RECEITA", status: "" },
    { label: "A Pagar", tipo: "DESPESA", status: "" },
    { label: "Atrasados", tipo: "", status: "ATRASADO" },
  ];

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Contas a pagar, a receber e fluxo de caixa"
        action={
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            <ButtonLink href="/financeiro/novo" className="no-print">
              <Plus className="h-4 w-4" /> Novo lançamento
            </ButtonLink>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="A receber"
          value={formatCurrency(Number(receitasPendentes._sum.valor ?? 0))}
          icon={TrendingUp}
          hint="Pendente + atrasado"
        />
        <StatCard
          label="A pagar"
          value={formatCurrency(Number(despesasPendentes._sum.valor ?? 0))}
          icon={TrendingDown}
          tone="warning"
          hint="Pendente + atrasado"
        />
        <StatCard
          label="Recebido no mês"
          value={formatCurrency(Number(pagoMes._sum.valor ?? 0))}
          icon={Wallet}
        />
      </div>

      <div className="mt-6 mb-4 flex flex-wrap gap-2 no-print">
        {tabs.map((tab) => {
          const active = (tipo ?? "") === tab.tipo && (status ?? "") === tab.status;
          const params = new URLSearchParams();
          if (tab.tipo) params.set("tipo", tab.tipo);
          if (tab.status) params.set("status", tab.status);
          return (
            <Link
              key={tab.label}
              href={`/financeiro${params.toString() ? "?" + params.toString() : ""}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-nexa-teal text-nexa-black"
                  : "bg-white text-nexa-charcoal border border-nexa-gray-light hover:bg-nexa-gray-light/40"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l) => {
              const overdue =
                l.status === "PENDENTE" && new Date(l.dataVencimento) < now;
              const effectiveStatus = overdue ? "ATRASADO" : l.status;
              return (
                <tr
                  key={l.id}
                  className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/financeiro/${l.id}`}
                      className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                    >
                      {l.descricao}
                    </Link>
                    <p className="text-xs text-nexa-gray">
                      {l.cliente?.nome ?? l.fornecedor?.nome ?? l.categoria}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={l.tipo === "RECEITA" ? "green" : "red"}>
                      {TIPO_LANCAMENTO_LABELS[l.tipo]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-nexa-charcoal">{formatDate(l.dataVencimento)}</td>
                  <td className="px-4 py-3">
                    <Badge color={STATUS_LANCAMENTO_COLORS[effectiveStatus]}>
                      {STATUS_LANCAMENTO_LABELS[effectiveStatus]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-nexa-black">
                    {formatCurrency(Number(l.valor))}
                  </td>
                  <td className="px-4 py-3 text-right no-print">
                    <div className="flex justify-end gap-1">
                      {l.status !== "PAGO" && l.status !== "CANCELADO" && (
                        <form action={marcarPago.bind(null, l.id)}>
                          <button
                            type="submit"
                            title="Marcar como pago"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                      <DeleteButton
                        id={l.id}
                        action={deleteLancamento}
                        confirmText="Excluir este lançamento?"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {lancamentos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-nexa-gray">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
