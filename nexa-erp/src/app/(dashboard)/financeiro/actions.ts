"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const lancamentoSchema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"]),
  descricao: z.string().min(2, "Informe uma descrição."),
  categoria: z.string().min(1, "Informe uma categoria."),
  valor: z.coerce.number().positive("O valor deve ser maior que zero."),
  dataVencimento: z.string().min(1, "Informe a data de vencimento."),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  formaPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

function parseLancamento(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return lancamentoSchema.safeParse(raw);
}

export async function createLancamento(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireModule("financeiro");

  const parsed = parseLancamento(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { clienteId, fornecedorId, formaPagamento, dataVencimento, ...rest } = parsed.data;

  await prisma.lancamentoFinanceiro.create({
    data: {
      ...rest,
      dataVencimento: new Date(dataVencimento),
      clienteId: clienteId || null,
      fornecedorId: fornecedorId || null,
      formaPagamento: formaPagamento ? (formaPagamento as never) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/financeiro");
  redirect("/financeiro");
}

export async function updateLancamento(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("financeiro");

  const parsed = parseLancamento(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { clienteId, fornecedorId, formaPagamento, dataVencimento, ...rest } = parsed.data;

  await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: {
      ...rest,
      dataVencimento: new Date(dataVencimento),
      clienteId: clienteId || null,
      fornecedorId: fornecedorId || null,
      formaPagamento: formaPagamento ? (formaPagamento as never) : null,
    },
  });

  revalidatePath("/financeiro");
  redirect("/financeiro");
}

export async function marcarPago(id: string): Promise<void> {
  await requireModule("financeiro");
  await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: { status: "PAGO", dataPagamento: new Date() },
  });
  revalidatePath("/financeiro");
}

export async function cancelarLancamento(id: string): Promise<void> {
  await requireModule("financeiro");
  await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: { status: "CANCELADO" },
  });
  revalidatePath("/financeiro");
}

export async function deleteLancamento(id: string): Promise<void> {
  await requireModule("financeiro");
  await prisma.lancamentoFinanceiro.delete({ where: { id } });
  revalidatePath("/financeiro");
}
