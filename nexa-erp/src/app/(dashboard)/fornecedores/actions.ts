"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const fornecedorSchema = z.object({
  nome: z.string().min(2, "Informe o nome do fornecedor."),
  documento: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
});

function parseFornecedor(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return fornecedorSchema.safeParse(raw);
}

export async function createFornecedor(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseFornecedor(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.fornecedor.create({ data: parsed.data });
  revalidatePath("/fornecedores");
  redirect("/fornecedores");
}

export async function updateFornecedor(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseFornecedor(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.fornecedor.update({ where: { id }, data: parsed.data });
  revalidatePath("/fornecedores");
  redirect("/fornecedores");
}

export async function deleteFornecedor(id: string): Promise<void> {
  await requireModule("cadastros");
  await prisma.fornecedor.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/fornecedores");
}
