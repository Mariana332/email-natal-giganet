"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { buscarClienteDuplicado } from "@/lib/duplicados";
import type { ActionState } from "@/components/ui/action-form";

const clienteSchema = z.object({
  tipo: z.enum(["FISICA", "JURIDICA"]),
  nome: z.string().min(2, "Informe o nome do cliente."),
  documento: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  observacoes: z.string().optional(),
});

function parseCliente(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return clienteSchema.safeParse(raw);
}

export async function createCliente(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseCliente(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (parsed.data.documento) {
    const duplicado = await buscarClienteDuplicado({ documento: parsed.data.documento });
    if (duplicado) {
      return { error: `Já existe um cliente cadastrado com este CPF/CNPJ: ${duplicado.nome}.` };
    }
  }

  const cliente = await prisma.cliente.create({ data: parsed.data });
  revalidatePath("/clientes");
  redirect(`/clientes/${cliente.id}`);
}

export async function updateCliente(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseCliente(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (parsed.data.documento) {
    const duplicado = await buscarClienteDuplicado({ documento: parsed.data.documento, excludeId: id });
    if (duplicado) {
      return { error: `Já existe um cliente cadastrado com este CPF/CNPJ: ${duplicado.nome}.` };
    }
  }

  await prisma.cliente.update({ where: { id }, data: parsed.data });
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect(`/clientes/${id}`);
}

export async function deleteCliente(id: string): Promise<void> {
  await requireModule("cadastros");
  await prisma.cliente.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/clientes");
}
