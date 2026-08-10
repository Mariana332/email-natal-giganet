import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/permissions";

const MAX_CANDIDATOS = 300;
const MAX_RESULTADOS = 6;

function normalizar(v: string | null | undefined) {
  return (v ?? "").toLowerCase();
}

function soDigitos(v: string | null | undefined) {
  return (v ?? "").replace(/\D/g, "");
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!canAccess(session.user.role, "cadastros")) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const qRaw = (searchParams.get("q") ?? "").trim();
  if (qRaw.length < 2) {
    return NextResponse.json({ clientes: [], fornecedores: [] });
  }

  const q = normalizar(qRaw);
  const digits = soDigitos(qRaw);

  function bate(campos: (string | null | undefined)[]) {
    return campos.some((campo) => {
      if (!campo) return false;
      if (normalizar(campo).includes(q)) return true;
      if (digits.length >= 3 && soDigitos(campo).includes(digits)) return true;
      return false;
    });
  }

  const [clientesCandidatos, fornecedoresCandidatos] = await Promise.all([
    prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      take: MAX_CANDIDATOS,
    }),
    prisma.fornecedor.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      take: MAX_CANDIDATOS,
    }),
  ]);

  const clientes = clientesCandidatos
    .filter((c) => bate([c.nome, c.documento, c.email, c.telefone, c.whatsapp, c.endereco, c.cidade, c.cep]))
    .slice(0, MAX_RESULTADOS)
    .map((c) => ({ id: c.id, nome: c.nome, subtitulo: [c.documento, c.cidade].filter(Boolean).join(" · ") }));

  const fornecedores = fornecedoresCandidatos
    .filter((f) => bate([f.nome, f.documento, f.email, f.telefone, f.endereco, f.cidade]))
    .slice(0, MAX_RESULTADOS)
    .map((f) => ({ id: f.id, nome: f.nome, subtitulo: [f.documento, f.cidade].filter(Boolean).join(" · ") }));

  return NextResponse.json({ clientes, fornecedores });
}
