"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";
import type { EtapaProducao } from "@/generated/prisma/enums";

function parseItens(formData: FormData) {
  const produtoIds = formData.getAll("item_produtoId") as string[];
  const descricoes = formData.getAll("item_descricao") as string[];
  const quantidades = formData.getAll("item_quantidade") as string[];
  const valores = formData.getAll("item_valorUnitario") as string[];

  return descricoes
    .map((descricao, i) => {
      const quantidade = Number(quantidades[i] ?? 0);
      const valorUnitario = Number(valores[i] ?? 0);
      return {
        produtoId: produtoIds[i] || null,
        descricao: descricao.trim(),
        quantidade,
        valorUnitario,
        valorTotal: quantidade * valorUnitario,
      };
    })
    .filter((item) => item.descricao && item.quantidade > 0);
}

export async function createOrdemServico(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireModule("ordensServico");

  const clienteId = formData.get("clienteId") as string;
  if (!clienteId) return { error: "Selecione um cliente." };

  const itens = parseItens(formData);
  if (itens.length === 0) {
    return { error: "Adicione ao menos um item à ordem de serviço." };
  }

  const desconto = Number(formData.get("desconto") || 0);
  const subtotal = itens.reduce((acc, i) => acc + i.valorTotal, 0);
  const total = Math.max(subtotal - desconto, 0);
  const dataEntregaRaw = formData.get("dataEntrega") as string;
  const prioridade = (formData.get("prioridade") as string) || "NORMAL";
  const formaPagamento = (formData.get("formaPagamento") as string) || null;

  const os = await prisma.ordemServico.create({
    data: {
      clienteId,
      vendedorId: session.user.id,
      desconto,
      total,
      prioridade: prioridade as never,
      formaPagamento: formaPagamento ? (formaPagamento as never) : null,
      dataEntrega: dataEntregaRaw ? new Date(dataEntregaRaw) : null,
      observacoes: (formData.get("observacoes") as string) || null,
      itens: { create: itens },
    },
  });

  await prisma.producaoLog.create({
    data: { ordemServicoId: os.id, etapa: "FILA", userId: session.user.id, observacao: "OS criada" },
  });

  revalidatePath("/ordens-servico");
  revalidatePath("/producao");
  redirect(`/ordens-servico/${os.id}`);
}

export async function updateEtapa(
  id: string,
  etapa: EtapaProducao
): Promise<void> {
  const session = await requireModule("producao");

  await prisma.ordemServico.update({
    where: { id },
    data: {
      etapa,
      dataEntregue: etapa === "ENTREGUE" ? new Date() : undefined,
    },
  });

  await prisma.producaoLog.create({
    data: { ordemServicoId: id, etapa, userId: session.user.id },
  });

  revalidatePath("/producao");
  revalidatePath("/ordens-servico");
  revalidatePath(`/ordens-servico/${id}`);
}

export async function moveEtapaForm(id: string, formData: FormData): Promise<void> {
  const etapa = formData.get("etapa") as EtapaProducao;
  await updateEtapa(id, etapa);
}

export async function updatePrioridade(id: string, formData: FormData): Promise<void> {
  await requireModule("ordensServico");
  const prioridade = formData.get("prioridade") as string;
  await prisma.ordemServico.update({ where: { id }, data: { prioridade: prioridade as never } });
  revalidatePath(`/ordens-servico/${id}`);
  revalidatePath("/producao");
}

export async function deleteOrdemServico(id: string): Promise<void> {
  await requireModule("ordensServico");
  const os = await prisma.ordemServico.findUnique({ where: { id } });
  if (!os || os.etapa !== "FILA") return;
  await prisma.ordemServico.delete({ where: { id } });
  revalidatePath("/ordens-servico");
  revalidatePath("/producao");
}
