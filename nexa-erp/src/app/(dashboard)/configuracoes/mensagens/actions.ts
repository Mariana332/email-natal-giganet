"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const templateSchema = z.object({
  nome: z.string().min(2, "Informe o nome do modelo."),
  conteudo: z.string().min(2, "Informe o texto da mensagem."),
});

export async function createTemplate(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("configuracoes");

  const parsed = templateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.mensagemTemplate.create({ data: parsed.data });
  revalidatePath("/configuracoes/mensagens");
  redirect("/configuracoes/mensagens");
}

export async function deleteTemplate(id: string): Promise<void> {
  await requireModule("configuracoes");
  await prisma.mensagemTemplate.delete({ where: { id } });
  revalidatePath("/configuracoes/mensagens");
}
