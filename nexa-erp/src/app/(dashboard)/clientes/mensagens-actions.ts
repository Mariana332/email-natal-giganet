"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { DirecaoMensagem } from "@/generated/prisma/enums";

export async function registrarMensagem(
  clienteId: string,
  conteudo: string,
  direcao: DirecaoMensagem
): Promise<void> {
  const session = await requireModule("cadastros");
  if (!conteudo.trim()) return;

  await prisma.mensagemLog.create({
    data: { clienteId, conteudo: conteudo.trim(), direcao, userId: session.user.id },
  });

  revalidatePath(`/clientes/${clienteId}`);
}

export async function excluirMensagem(id: string, clienteId: string): Promise<void> {
  await requireModule("cadastros");
  await prisma.mensagemLog.delete({ where: { id } });
  revalidatePath(`/clientes/${clienteId}`);
}
