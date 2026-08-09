import Link from "next/link";
import {
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Boxes,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/permissions";
import { requireSession } from "@/lib/auth-guard";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  ETAPA_PRODUCAO_COLORS,
  ETAPA_PRODUCAO_LABELS,
  ETAPAS_ORDENADAS,
  formatCurrency,
  formatDate,
} from "@/lib/labels";

export default async function DashboardPage() {
  const session = await requireSession();
  const role = session.user.role;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const in7Days = new Date(now.getTime() + 7 * 86400000);

  const [
    osEmProducao,
    receitaMes,
    contasAVencer,
    itensEstoque,
    ultimasOS,
    etapaCounts,
  ] = await Promise.all([
    prisma.ordemServico.count({
      where: { etapa: { notIn: ["ENTREGUE", "CANCELADO"] } },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      _sum: { valor: true },
      where: {
        tipo: "RECEITA",
        status: "PAGO",
        dataPagamento: { gte: startOfMonth },
      },
    }),
    prisma.lancamentoFinanceiro.findMany({
      where: {
        status: { in: ["PENDENTE", "ATRASADO"] },
        dataVencimento: { lte: in7Days },
      },
    }),
    prisma.itemEstoque.findMany({ where: { ativo: true } }),
    prisma.ordemServico.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { cliente: true },
    }),
    prisma.ordemServico.groupBy({
      by: ["etapa"],
      _count: { _all: true },
    }),
  ]);

  const estoqueBaixo = itensEstoque.filter(
    (i) => Number(i.quantidadeAtual) <= Number(i.quantidadeMinima)
  );

  const etapaMap = new Map(etapaCounts.map((e) => [e.etapa, e._count._all]));

  // last 6 months revenue/expense chart
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextRef = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const [rec, desp] = await Promise.all([
      prisma.lancamentoFinanceiro.aggregate({
        _sum: { valor: true },
        where: {
          tipo: "RECEITA",
          status: "PAGO",
          dataPagamento: { gte: ref, lt: nextRef },
        },
      }),
      prisma.lancamentoFinanceiro.aggregate({
        _sum: { valor: true },
        where: {
          tipo: "DESPESA",
          status: "PAGO",
          dataPagamento: { gte: ref, lt: nextRef },
        },
      }),
    ]);
    chartData.push({
      mes: ref.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      receita: Number(rec._sum.valor ?? 0),
      despesa: Number(desp._sum.valor ?? 0),
    });
  }

  const showFinanceiro = canAccess(role, "financeiro");
  const showEstoque = canAccess(role, "estoque");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-nexa-black">
          Olá, {session.user.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-nexa-gray">
          Aqui está o panorama da gráfica hoje, {formatDate(now)}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="OS em produção"
          value={String(osEmProducao)}
          icon={ClipboardList}
          hint="Pedidos ativos na esteira"
        />
        {showFinanceiro && (
          <StatCard
            label="Faturamento do mês"
            value={formatCurrency(Number(receitaMes._sum.valor ?? 0))}
            icon={TrendingUp}
            hint="Receitas recebidas"
          />
        )}
        {showFinanceiro && (
          <StatCard
            label="Contas a vencer (7 dias)"
            value={String(contasAVencer.length)}
            icon={AlertTriangle}
            tone={contasAVencer.some((c) => c.status === "ATRASADO") ? "danger" : "warning"}
            hint={formatCurrency(
              contasAVencer.reduce((acc, c) => acc + Number(c.valor), 0)
            )}
          />
        )}
        {showEstoque && (
          <StatCard
            label="Itens com estoque baixo"
            value={String(estoqueBaixo.length)}
            icon={Boxes}
            tone={estoqueBaixo.length > 0 ? "warning" : "default"}
            hint="Abaixo do mínimo cadastrado"
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {showFinanceiro && (
          <div className="rounded-xl border border-nexa-gray-light bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="font-heading text-base font-bold text-nexa-black">
              Receitas x Despesas (últimos 6 meses)
            </h2>
            <div className="mt-2">
              <RevenueChart data={chartData} />
            </div>
          </div>
        )}

        <div className={`rounded-xl border border-nexa-gray-light bg-white p-5 shadow-sm ${showFinanceiro ? "" : "lg:col-span-3"}`}>
          <h2 className="font-heading text-base font-bold text-nexa-black">
            Produção por etapa
          </h2>
          <div className="mt-4 space-y-3">
            {ETAPAS_ORDENADAS.map((etapa) => (
              <div key={etapa} className="flex items-center justify-between">
                <Badge color={ETAPA_PRODUCAO_COLORS[etapa]}>
                  {ETAPA_PRODUCAO_LABELS[etapa]}
                </Badge>
                <span className="text-sm font-semibold text-nexa-black">
                  {etapaMap.get(etapa) ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-nexa-gray-light bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-nexa-black">
            Últimas ordens de serviço
          </h2>
          <Link
            href="/ordens-servico"
            className="flex items-center gap-1 text-sm font-medium text-nexa-teal-dark hover:underline"
          >
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nexa-gray-light text-xs uppercase tracking-wide text-nexa-gray">
                <th className="pb-2 pr-4">OS</th>
                <th className="pb-2 pr-4">Cliente</th>
                <th className="pb-2 pr-4">Etapa</th>
                <th className="pb-2 pr-4">Entrega</th>
                <th className="pb-2 pr-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {ultimasOS.map((os) => (
                <tr key={os.id} className="border-b border-nexa-gray-light/60 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-nexa-black">
                    <Link href={`/ordens-servico/${os.id}`} className="hover:text-nexa-teal-dark">
                      #{os.numero}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-nexa-charcoal">{os.cliente.nome}</td>
                  <td className="py-2.5 pr-4">
                    <Badge color={ETAPA_PRODUCAO_COLORS[os.etapa]}>
                      {ETAPA_PRODUCAO_LABELS[os.etapa]}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-nexa-gray">{formatDate(os.dataEntrega)}</td>
                  <td className="py-2.5 pr-4 text-right font-medium text-nexa-black">
                    {formatCurrency(Number(os.total))}
                  </td>
                </tr>
              ))}
              {ultimasOS.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-nexa-gray">
                    Nenhuma ordem de serviço cadastrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
