import { prisma } from "@/lib/prisma";

function soDigitos(v: string | null | undefined) {
  return (v ?? "").replace(/\D/g, "");
}

function normalizar(v: string | null | undefined) {
  return (v ?? "").trim().toLowerCase();
}

export type ClienteDuplicado = { id: string; nome: string; campo: "documento" | "telefone" | "email" };

/** Procura um cliente ativo com o mesmo CPF/CNPJ, telefone/WhatsApp ou e-mail. */
export async function buscarClienteDuplicado(params: {
  documento?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  excludeId?: string;
}): Promise<ClienteDuplicado | null> {
  const documento = soDigitos(params.documento);
  const telefone = soDigitos(params.telefone);
  const whatsapp = soDigitos(params.whatsapp);
  const email = normalizar(params.email);

  if (!documento && telefone.length < 8 && whatsapp.length < 8 && !email) return null;

  const candidatos = await prisma.cliente.findMany({
    where: {
      ativo: true,
      ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
    },
    take: 1000,
  });

  if (documento.length >= 5) {
    const match = candidatos.find((c) => soDigitos(c.documento) === documento);
    if (match) return { id: match.id, nome: match.nome, campo: "documento" };
  }

  if (telefone.length >= 8 || whatsapp.length >= 8) {
    const match = candidatos.find(
      (c) =>
        (telefone.length >= 8 && (soDigitos(c.telefone) === telefone || soDigitos(c.whatsapp) === telefone)) ||
        (whatsapp.length >= 8 && (soDigitos(c.whatsapp) === whatsapp || soDigitos(c.telefone) === whatsapp))
    );
    if (match) return { id: match.id, nome: match.nome, campo: "telefone" };
  }

  if (email) {
    const match = candidatos.find((c) => normalizar(c.email) === email);
    if (match) return { id: match.id, nome: match.nome, campo: "email" };
  }

  return null;
}
