"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";
import type { EtapaFunil } from "@/generated/prisma/enums";

const leadSchema = z.object({
  nome: z.string().min(2, "Informe o nome do contato."),
  empresa: z.string().optional(),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  origem: z.string().optional(),
  valorEstimado: z.string().optional(),
  observacoes: z.string().optional(),
});

function parseLead(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return leadSchema.safeParse(raw);
}

export async function createLead(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireModule("crm");

  const parsed = parseLead(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { valorEstimado: valorRaw, ...rest } = parsed.data;
  const valorEstimado = valorRaw && valorRaw.trim() !== "" ? Number(valorRaw) : null;
  if (valorEstimado !== null && isNaN(valorEstimado)) {
    return { error: "Informe um valor estimado válido." };
  }

  await prisma.lead.create({
    data: { ...rest, valorEstimado, vendedorId: session.user.id },
  });

  revalidatePath("/crm");
  redirect("/crm");
}

export async function updateLead(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("crm");

  const parsed = parseLead(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { valorEstimado: valorRaw, ...rest } = parsed.data;
  const valorEstimado = valorRaw && valorRaw.trim() !== "" ? Number(valorRaw) : null;
  if (valorEstimado !== null && isNaN(valorEstimado)) {
    return { error: "Informe um valor estimado válido." };
  }

  await prisma.lead.update({ where: { id }, data: { ...rest, valorEstimado } });

  revalidatePath("/crm");
  revalidatePath(`/crm/${id}`);
  redirect(`/crm/${id}`);
}

export async function updateEtapaLead(id: string, etapa: EtapaFunil): Promise<void> {
  await requireModule("crm");
  await prisma.lead.update({ where: { id }, data: { etapa } });
  revalidatePath("/crm");
  revalidatePath(`/crm/${id}`);
}

export async function moveEtapaLeadForm(id: string, formData: FormData): Promise<void> {
  const etapa = formData.get("etapa") as EtapaFunil;
  await updateEtapaLead(id, etapa);
}

export async function convertLeadToCliente(id: string): Promise<void> {
  await requireModule("crm");

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || lead.clienteId) return;

  const cliente = await prisma.cliente.create({
    data: {
      nome: lead.empresa || lead.nome,
      telefone: lead.telefone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      observacoes: lead.nome !== (lead.empresa || lead.nome) ? `Contato: ${lead.nome}` : null,
    },
  });

  await prisma.lead.update({ where: { id }, data: { clienteId: cliente.id } });

  revalidatePath("/crm");
  revalidatePath(`/crm/${id}`);
  revalidatePath("/clientes");
}

export async function deleteLead(id: string): Promise<void> {
  await requireModule("crm");
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || lead.etapa !== "NOVO_CONTATO") return;
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/crm");
}
