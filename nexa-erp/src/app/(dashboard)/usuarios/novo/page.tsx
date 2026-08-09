import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { requireModule } from "@/lib/auth-guard";
import { ROLE_OPTIONS } from "@/lib/labels";
import { createUsuario } from "../actions";

export default async function NovoUsuarioPage() {
  await requireModule("usuarios");

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Novo usuário" description="Cadastre um novo usuário do sistema." />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createUsuario}>
          <div className="space-y-5">
            <Field label="Nome" required>
              <Input name="name" required />
            </Field>
            <Field label="E-mail" required>
              <Input type="email" name="email" required />
            </Field>
            <Field label="Perfil de acesso" required>
              <Select name="role" defaultValue="VENDEDOR">
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Senha provisória" required>
              <Input type="password" name="password" required minLength={6} />
            </Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <ButtonLink href="/usuarios" variant="secondary">
              Cancelar
            </ButtonLink>
            <SubmitButton>Criar usuário</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
