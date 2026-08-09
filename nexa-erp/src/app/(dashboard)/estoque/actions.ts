"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const itemSchema = z.object({
  nome: z.string().min(2, "Informe o nome do insumo."),
  categoria: z.enum(["PAPEL", "TINTA", "CHAPA", "ACABAMENTO", "OUTROS"]),
  unidade: z.string().min(1),
  quantidadeAtual: z.coerce.number().min(0).default(0),
  quantidadeMinima: z.coerce.number().min(0).default(0),
  custoUnitario: z.coerce.number().min(0).default(0),
  fornecedorId: z.string().optional(),
});

function parseItem(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return itemSchema.safeParse(raw);
}

export async function createItemEstoque(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("estoque");

  const parsed = parseItem(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { fornecedorId, ...rest } = parsed.data;
  await prisma.itemEstoque.create({
    data: { ...rest, fornecedorId: fornecedorId || null },
  });

  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function updateItemEstoque(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("estoque");

  const parsed = parseItem(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { fornecedorId, nome, categoria, unidade, quantidadeMinima, custoUnitario } = parsed.data;
  await prisma.itemEstoque.update({
    where: { id },
    data: { nome, categoria, unidade, quantidadeMinima, custoUnitario, fornecedorId: fornecedorId || null },
  });

  revalidatePath("/estoque");
  revalidatePath(`/estoque/${id}`);
  redirect(`/estoque/${id}`);
}

export async function deleteItemEstoque(id: string): Promise<void> {
  await requireModule("estoque");
  await prisma.itemEstoque.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/estoque");
}

export async function registrarMovimentacao(
  itemId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireModule("estoque");

  const tipo = formData.get("tipo") as "ENTRADA" | "SAIDA" | "AJUSTE";
  const quantidade = Number(formData.get("quantidade") || 0);
  const motivo = (formData.get("motivo") as string) || null;

  if (!quantidade || quantidade <= 0) {
    return { error: "Informe uma quantidade válida." };
  }

  const item = await prisma.itemEstoque.findUnique({ where: { id: itemId } });
  if (!item) return { error: "Item de estoque não encontrado." };

  let novaQuantidade = Number(item.quantidadeAtual);
  if (tipo === "ENTRADA") novaQuantidade += quantidade;
  else if (tipo === "SAIDA") novaQuantidade = Math.max(novaQuantidade - quantidade, 0);
  else novaQuantidade = quantidade;

  await prisma.$transaction([
    prisma.itemEstoque.update({
      where: { id: itemId },
      data: { quantidadeAtual: novaQuantidade },
    }),
    prisma.movimentacaoEstoque.create({
      data: {
        itemEstoqueId: itemId,
        tipo,
        quantidade,
        motivo,
        userId: session.user.id,
      },
    }),
  ]);

  revalidatePath(`/estoque/${itemId}`);
  revalidatePath("/estoque");
  return { error: null };
}
