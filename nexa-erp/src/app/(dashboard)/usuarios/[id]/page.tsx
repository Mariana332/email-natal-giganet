import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { ROLE_OPTIONS } from "@/lib/labels";
import { updateUsuario } from "../actions";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModule("usuarios");
  const { id } = await params;

  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) notFound();

  const boundAction = updateUsuario.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={usuario.name} description="Editar dados do usuário." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={boundAction}>
          <div className="space-y-5">
            <Field label="Nome" required>
              <Input name="name" required defaultValue={usuario.name} />
            </Field>
            <Field label="E-mail" required>
              <Input type="email" name="email" required defaultValue={usuario.email} />
            </Field>
            <Field label="Perfil de acesso" required>
              <Select name="role" defaultValue={usuario.role}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Nova senha (opcional)">
              <Input type="password" name="password" minLength={6} placeholder="Deixe em branco para manter a atual" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-nexa-charcoal">
              <input type="checkbox" name="active" defaultChecked={usuario.active} className="h-4 w-4 rounded border-nexa-gray-light text-nexa-teal" />
              Usuário ativo
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/usuarios" variant="secondary">
              Voltar
            </ButtonLink>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
