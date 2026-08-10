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
import { updateCliente } from "../actions";
import { ClienteFields } from "../cliente-fields";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("cadastros");
  const { id } = await params;

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: {
      ordensServico: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!cliente) notFound();

  const boundAction = updateCliente.bind(null, id);
  const whatsappUrl = buildWhatsAppUrl(cliente.whatsapp || cliente.telefone);

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
          <ClienteFields defaultValues={cliente} />
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
          {cliente.ordensServico.map((os) => (
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
          {cliente.ordensServico.length === 0 && (
            <p className="text-sm text-nexa-gray">
              Este cliente ainda não possui ordens de serviço.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
