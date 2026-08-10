import type { Role } from "@/generated/prisma/enums";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  PRODUCAO: "Produção",
  FINANCEIRO: "Financeiro",
  ESTOQUE: "Estoque",
};

export const MODULE_ACCESS = {
  dashboard: ["ADMIN", "VENDEDOR", "PRODUCAO", "FINANCEIRO", "ESTOQUE"],
  crm: ["ADMIN", "VENDEDOR"],
  cadastros: ["ADMIN", "VENDEDOR"],
  orcamentos: ["ADMIN", "VENDEDOR"],
  ordensServico: ["ADMIN", "VENDEDOR", "PRODUCAO"],
  producao: ["ADMIN", "PRODUCAO"],
  financeiro: ["ADMIN", "FINANCEIRO"],
  estoque: ["ADMIN", "ESTOQUE", "PRODUCAO"],
  usuarios: ["ADMIN"],
  configuracoes: ["ADMIN"],
} as const satisfies Record<string, readonly Role[]>;

export type ModuleKey = keyof typeof MODULE_ACCESS;

export function canAccess(role: Role, moduleKey: ModuleKey) {
  return (MODULE_ACCESS[moduleKey] as readonly Role[]).includes(role);
}
