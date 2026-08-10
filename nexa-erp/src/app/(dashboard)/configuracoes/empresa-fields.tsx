import { Field, Input, Textarea } from "@/components/ui/form";
import type { Empresa } from "@/generated/prisma/client";

export function EmpresaFields({ defaultValues }: { defaultValues?: Empresa | null }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome da gráfica" required>
          <Input name="nome" required defaultValue={defaultValues?.nome ?? "Nexa Print"} />
        </Field>
        <Field label="CNPJ">
          <Input name="cnpj" defaultValue={defaultValues?.cnpj ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="WhatsApp central">
          <Input
            name="telefone"
            placeholder="(34) 99150-1234"
            defaultValue={defaultValues?.telefone ?? ""}
          />
        </Field>
        <Field label="Instagram">
          <Input
            name="instagram"
            placeholder="@nexaprint.araxa"
            defaultValue={defaultValues?.instagram ?? ""}
          />
        </Field>
      </div>

      <Field label="E-mail">
        <Input type="email" name="email" defaultValue={defaultValues?.email ?? ""} />
      </Field>

      <Field label="Endereço">
        <Textarea name="endereco" rows={2} defaultValue={defaultValues?.endereco ?? ""} />
      </Field>

      <Field label="URL do logo">
        <Input name="logoUrl" placeholder="https://..." defaultValue={defaultValues?.logoUrl ?? ""} />
      </Field>

      <p className="text-xs text-nexa-gray">
        O WhatsApp central é usado por todos os vendedores para enviar orçamentos e propostas —
        aparece no botão &ldquo;Enviar por WhatsApp&rdquo; dos orçamentos e no cabeçalho do PDF.
      </p>
    </div>
  );
}
