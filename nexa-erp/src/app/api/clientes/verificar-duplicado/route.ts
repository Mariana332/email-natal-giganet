import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";
import { buscarClienteDuplicado } from "@/lib/duplicados";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!canAccess(session.user.role, "cadastros")) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const duplicado = await buscarClienteDuplicado({
    documento: searchParams.get("documento") ?? undefined,
    telefone: searchParams.get("telefone") ?? undefined,
    whatsapp: searchParams.get("whatsapp") ?? undefined,
    email: searchParams.get("email") ?? undefined,
    excludeId: searchParams.get("excludeId") ?? undefined,
  });

  return NextResponse.json({ duplicado });
}
