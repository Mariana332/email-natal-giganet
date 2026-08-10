"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const empresaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da gráfica."),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  endereco: z.string().optional(),
  instagram: z.string().optional(),
  logoUrl: z.string().optional(),
  markupPadrao: z.string().optional(),
});

export async function updateEmpresa(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("configuracoes");

  const parsed = empresaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { markupPadrao: markupPadraoRaw, ...rest } = parsed.data;
  const markupPadrao =
    markupPadraoRaw && markupPadraoRaw.trim() !== "" ? Number(markupPadraoRaw) : null;
  if (markupPadrao !== null && (isNaN(markupPadrao) || markupPadrao < 0)) {
    return { error: "Informe um markup padrão válido." };
  }

  const data = { ...rest, markupPadrao };

  const existing = await prisma.empresa.findFirst();
  if (existing) {
    await prisma.empresa.update({ where: { id: existing.id }, data });
  } else {
    await prisma.empresa.create({ data });
  }

  revalidatePath("/configuracoes");
  redirect("/configuracoes");
}
