"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const produtoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do produto/serviço."),
  categoria: z.enum([
    "IMPRESSAO_DIGITAL",
    "OFFSET",
    "BANNER",
    "ADESIVO",
    "PAPELARIA",
    "COMUNICACAO_VISUAL",
    "PERSONALIZADOS",
    "ACABAMENTO",
    "OUTROS",
  ]),
  unidade: z.string().min(1),
  precoVenda: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero."),
  custo: z.coerce.number().min(0).default(0),
  descricao: z.string().optional(),
});

function parseProduto(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return produtoSchema.safeParse(raw);
}

export async function createProduto(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.produto.create({ data: parsed.data });
  revalidatePath("/produtos");
  redirect("/produtos");
}

export async function updateProduto(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.produto.update({ where: { id }, data: parsed.data });
  revalidatePath("/produtos");
  redirect("/produtos");
}

export async function deleteProduto(id: string): Promise<void> {
  await requireModule("cadastros");
  await prisma.produto.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/produtos");
}
