import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ETAPA_PRODUCAO_COLORS, ETAPA_PRODUCAO_LABELS, formatCurrency, formatDate } from "@/lib/labels";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { canAccess } from "@/lib/permissions";
import { updateCliente } from "../actions";
import { ClienteFields } from "../cliente-fields";
import { ClienteStatusCard } from "./cliente-status-card";
import { CentralMensagens } from "./central-mensagens";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireModule("cadastros");
  const { id } = await params;
  const mostrarFinanceiro = canAccess(session.user.role, "financeiro");

  const [cliente, ultimoOrcamento, pendentes, templates, mensagens] = await Promise.all([
    prisma.cliente.findUnique({
      where: { id },
      include: {
        ordensServico: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    }),
    prisma.orcamento.findFirst({ where: { clienteId: id }, orderBy: { createdAt: "desc" } }),
    mostrarFinanceiro
      ? prisma.lancamentoFinanceiro.findMany({
          where: { clienteId: id, tipo: "RECEITA", status: { in: ["PENDENTE", "ATRASADO"] } },
          orderBy: { dataVencimento: "asc" },
        })
      : Promise.resolve([]),
    prisma.mensagemTemplate.findMany({ orderBy: { nome: "asc" } }),
    prisma.mensagemLog.findMany({
      where: { clienteId: id },
      include: { usuario: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  if (!cliente) notFound();

  const { ordensServico, ...clienteSemRelacoes } = cliente;

  const boundAction = updateCliente.bind(null, id);
  const whatsappUrl = buildWhatsAppUrl(cliente.whatsapp || cliente.telefone);

  const gruposPendencia = new Map<number, { quantidade: number; proximoVencimento: Date | null }>();
  for (const l of pendentes) {
    const valor = Number(l.valor);
    const atual = gruposPendencia.get(valor) ?? { quantidade: 0, proximoVencimento: null };
    atual.quantidade += 1;
    if (!atual.proximoVencimento || l.dataVencimento < atual.proximoVencimento) {
      atual.proximoVencimento = l.dataVencimento;
    }
    gruposPendencia.set(valor, atual);
  }
  const pendencias = Array.from(gruposPendencia.entries()).map(([valor, info]) => ({
    valor,
    quantidade: info.quantidade,
    proximoVencimento: info.proximoVencimento ? formatDate(info.proximoVencimento) : null,
  }));
  const totalPendente = pendentes.reduce((acc, l) => acc + Number(l.valor), 0);

  const mensagensFormatadas = mensagens.map((m) => ({
    id: m.id,
    conteudo: m.conteudo,
    direcao: m.direcao,
    usuario: m.usuario?.name ?? null,
    data: m.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={cliente.nome}
        description="Editar dados do cliente."
        action={
          whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-nexa-gray-light bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-nexa-gray-light/60"
            >
              <MessageCircle className="h-4 w-4" /> Conversar no WhatsApp
            </a>
          ) : undefined
        }
      />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <ClienteFields defaultValues={clienteSemRelacoes} />
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/clientes" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>

      <div className="mt-6 rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-nexa-black">
          Últimas ordens de serviço
        </h2>
        <div className="mt-3 space-y-2">
          {ordensServico.map((os) => (
            <Link
              key={os.id}
              href={`/ordens-servico/${os.id}`}
              className="flex items-center justify-between rounded-lg border border-nexa-gray-light px-3 py-2 text-sm hover:bg-nexa-gray-light/20"
            >
              <span className="font-medium text-nexa-black">#{os.numero}</span>
              <Badge color={ETAPA_PRODUCAO_COLORS[os.etapa]}>
                {ETAPA_PRODUCAO_LABELS[os.etapa]}
              </Badge>
              <span className="text-nexa-gray">{formatDate(os.createdAt)}</span>
              <span className="font-medium text-nexa-black">
                {formatCurrency(Number(os.total))}
              </span>
            </Link>
          ))}
          {ordensServico.length === 0 && (
            <p className="text-sm text-nexa-gray">
              Este cliente ainda não possui ordens de serviço.
            </p>
          )}
        </div>
      </div>

      <CentralMensagens
        clienteId={cliente.id}
        clienteNome={cliente.nome}
        telefone={cliente.whatsapp || cliente.telefone}
        templates={templates}
        mensagens={mensagensFormatadas}
      />

      <ClienteStatusCard
        ultimoOrcamento={
          ultimoOrcamento
            ? {
                numero: ultimoOrcamento.numero,
                status: ultimoOrcamento.status,
                data: formatDate(ultimoOrcamento.createdAt),
              }
            : null
        }
        pendencias={pendencias}
        totalPendente={totalPendente}
        mostrarFinanceiro={mostrarFinanceiro}
      />
    </div>
  );
}
