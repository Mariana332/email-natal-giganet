"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { parseCsv, parseNumeroPtBr } from "@/lib/csv";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/labels";
import type { CategoriaProduto } from "@/generated/prisma/enums";
import type { ActionState } from "@/components/ui/action-form";

const CATEGORIAS = Object.keys(CATEGORIA_PRODUTO_LABELS) as CategoriaProduto[];

const produtoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do produto/serviço."),
  categoria: z.enum(CATEGORIAS as [CategoriaProduto, ...CategoriaProduto[]]),
  unidade: z.string().min(1),
  precoVenda: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero."),
  custo: z.coerce.number().min(0).default(0),
  descricao: z.string().optional(),
});

function parseProduto(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return produtoSchema.safeParse(raw);
}

export async function createProduto(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.produto.create({ data: parsed.data });
  revalidatePath("/produtos");
  redirect("/produtos");
}

export async function updateProduto(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("cadastros");

  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.produto.update({ where: { id }, data: parsed.data });
  revalidatePath("/produtos");
  redirect("/produtos");
}

export async function deleteProduto(id: string): Promise<void> {
  await requireModule("cadastros");
  await prisma.produto.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/produtos");
}

function matchCategoria(raw: string | undefined): CategoriaProduto {
  const value = (raw ?? "").trim().toLowerCase();
  if (!value) return "OUTROS";

  const byKey = CATEGORIAS.find((key) => key.toLowerCase() === value);
  if (byKey) return byKey;

  const byLabel = Object.entries(CATEGORIA_PRODUTO_LABELS).find(
    ([, label]) => label.toLowerCase() === value
  );
  if (byLabel) return byLabel[0] as CategoriaProduto;

  return "OUTROS";
}

export type ImportState = { error: string | null; importedCount: number | null };

const MAX_IMPORT_SIZE = 2 * 1024 * 1024;

export async function importProdutos(
  _prevState: ImportState,
  formData: FormData
): Promise<ImportState> {
  await requireModule("cadastros");

  const file = formData.get("arquivo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione um arquivo CSV.", importedCount: null };
  }
  if (file.size > MAX_IMPORT_SIZE) {
    return { error: "Arquivo muito grande (máximo 2 MB).", importedCount: null };
  }

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { error: "Nenhuma linha encontrada no arquivo.", importedCount: null };
  }

  const novos = rows
    .map((row) => {
      const nome = row["nome"] || row["produto"] || row["descrição"] || row["descricao"];
      const precoVenda = parseNumeroPtBr(
        row["preço"] || row["preco"] || row["preço de venda"] || row["preco de venda"] || row["valor"]
      );
      if (!nome || precoVenda === null) return null;

      const custo = parseNumeroPtBr(row["custo"]) ?? 0;
      const categoria = matchCategoria(row["categoria"]);
      const unidade = (row["unidade"] || "UN").toUpperCase().slice(0, 20);

      return { nome: nome.slice(0, 200), categoria, unidade, precoVenda, custo };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (novos.length === 0) {
    return {
      error:
        "Nenhuma linha válida encontrada. Use colunas: Nome, Categoria, Preço (e opcionalmente Custo, Unidade).",
      importedCount: null,
    };
  }

  await prisma.produto.createMany({ data: novos });
  revalidatePath("/produtos");
  return { error: null, importedCount: novos.length };
}
