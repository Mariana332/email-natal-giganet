"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

function parseItens(formData: FormData) {
  const produtoIds = formData.getAll("item_produtoId") as string[];
  const descricoes = formData.getAll("item_descricao") as string[];
  const quantidades = formData.getAll("item_quantidade") as string[];
  const valores = formData.getAll("item_valorUnitario") as string[];

  const itens = descricoes
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

  return itens;
}

export async function createOrcamento(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireModule("orcamentos");

  const clienteId = formData.get("clienteId") as string;
  if (!clienteId) return { error: "Selecione um cliente." };

  const itens = parseItens(formData);
  if (itens.length === 0) {
    return { error: "Adicione ao menos um item ao orçamento." };
  }

  const desconto = Number(formData.get("desconto") || 0);
  const subtotal = itens.reduce((acc, i) => acc + i.valorTotal, 0);
  const total = Math.max(subtotal - desconto, 0);
  const dataValidadeRaw = formData.get("dataValidade") as string;

  const orcamento = await prisma.orcamento.create({
    data: {
      clienteId,
      vendedorId: session.user.id,
      desconto,
      total,
      dataValidade: dataValidadeRaw ? new Date(dataValidadeRaw) : null,
      observacoes: (formData.get("observacoes") as string) || null,
      itens: { create: itens },
    },
  });

  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${orcamento.id}`);
}

export async function updateOrcamento(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("orcamentos");

  const existing = await prisma.orcamento.findUnique({ where: { id } });
  if (!existing) return { error: "Orçamento não encontrado." };
  if (existing.status === "CONVERTIDO") {
    return { error: "Este orçamento já foi convertido em OS e não pode ser editado." };
  }

  const clienteId = formData.get("clienteId") as string;
  if (!clienteId) return { error: "Selecione um cliente." };

  const itens = parseItens(formData);
  if (itens.length === 0) {
    return { error: "Adicione ao menos um item ao orçamento." };
  }

  const desconto = Number(formData.get("desconto") || 0);
  const subtotal = itens.reduce((acc, i) => acc + i.valorTotal, 0);
  const total = Math.max(subtotal - desconto, 0);
  const dataValidadeRaw = formData.get("dataValidade") as string;

  await prisma.$transaction([
    prisma.itemOrcamento.deleteMany({ where: { orcamentoId: id } }),
    prisma.orcamento.update({
      where: { id },
      data: {
        clienteId,
        desconto,
        total,
        dataValidade: dataValidadeRaw ? new Date(dataValidadeRaw) : null,
        observacoes: (formData.get("observacoes") as string) || null,
        itens: { create: itens },
      },
    }),
  ]);

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
  redirect(`/orcamentos/${id}`);
}

export async function setOrcamentoStatus(
  id: string,
  status: "ENVIADO" | "APROVADO" | "REJEITADO"
): Promise<void> {
  await requireModule("orcamentos");
  await prisma.orcamento.update({ where: { id }, data: { status } });
  revalidatePath(`/orcamentos/${id}`);
  revalidatePath("/orcamentos");
}

export async function deleteOrcamento(id: string): Promise<void> {
  await requireModule("orcamentos");
  const orcamento = await prisma.orcamento.findUnique({ where: { id } });
  if (!orcamento || orcamento.status !== "RASCUNHO") return;
  await prisma.orcamento.delete({ where: { id } });
  revalidatePath("/orcamentos");
}

export async function convertOrcamentoToOS(id: string): Promise<void> {
  const session = await requireModule("orcamentos");

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { itens: true, ordemServico: true },
  });
  if (!orcamento) throw new Error("Orçamento não encontrado.");
  if (orcamento.ordemServico) throw new Error("Este orçamento já foi convertido.");

  const os = await prisma.ordemServico.create({
    data: {
      clienteId: orcamento.clienteId,
      orcamentoId: orcamento.id,
      vendedorId: session.user.id,
      desconto: orcamento.desconto,
      total: orcamento.total,
      observacoes: orcamento.observacoes,
      itens: {
        create: orcamento.itens.map((i) => ({
          produtoId: i.produtoId,
          descricao: i.descricao,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
          valorTotal: i.valorTotal,
        })),
      },
    },
  });

  await prisma.orcamento.update({ where: { id }, data: { status: "CONVERTIDO" } });
  await prisma.producaoLog.create({
    data: { ordemServicoId: os.id, etapa: "FILA", userId: session.user.id, observacao: "OS gerada a partir de orçamento" },
  });

  revalidatePath("/orcamentos");
  revalidatePath("/ordens-servico");
  redirect(`/ordens-servico/${os.id}`);
}
