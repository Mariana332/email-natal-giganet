import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { ROLE_LABELS } from "@/lib/permissions";
import { deactivateUsuario } from "./actions";

export default async function UsuariosPage() {
  await requireModule("usuarios");

  const usuarios = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader
        title="Usuários"
        description={`${usuarios.length} usuário(s) do sistema`}
        action={
          <ButtonLink href="/usuarios/novo">
            <Plus className="h-4 w-4" /> Novo usuário
          </ButtonLink>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-nexa-gray-light bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nexa-gray-light bg-nexa-gray-light/30 text-xs uppercase tracking-wide text-nexa-gray">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-b border-nexa-gray-light/60 last:border-0 hover:bg-nexa-gray-light/20"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/usuarios/${u.id}`}
                    className="font-medium text-nexa-black hover:text-nexa-teal-dark"
                  >
                    {u.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-nexa-charcoal">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge color="teal">{ROLE_LABELS[u.role]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={u.active ? "green" : "gray"}>
                    {u.active ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.active && (
                    <DeleteButton
                      id={u.id}
                      action={deactivateUsuario}
                      confirmText="Desativar este usuário?"
                      label="Desativar"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
