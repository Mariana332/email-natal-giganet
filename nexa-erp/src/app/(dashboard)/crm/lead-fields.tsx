import { Field, Input, Textarea } from "@/components/ui/form";
import type { Lead } from "@/generated/prisma/client";

export function LeadFields({ defaultValues }: { defaultValues?: Lead }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome do contato" required>
          <Input name="nome" required defaultValue={defaultValues?.nome} />
        </Field>
        <Field label="Empresa">
          <Input name="empresa" defaultValue={defaultValues?.empresa ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Telefone">
          <Input name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
        </Field>
        <Field label="WhatsApp">
          <Input name="whatsapp" defaultValue={defaultValues?.whatsapp ?? ""} />
        </Field>
        <Field label="E-mail">
          <Input type="email" name="email" defaultValue={defaultValues?.email ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Origem do contato">
          <Input
            name="origem"
            placeholder="Ex: Instagram, Indicação, Site"
            defaultValue={defaultValues?.origem ?? ""}
          />
        </Field>
        <Field label="Valor estimado (R$)">
          <Input
            type="number"
            name="valorEstimado"
            step="0.01"
            min="0"
            defaultValue={
              defaultValues?.valorEstimado !== null && defaultValues?.valorEstimado !== undefined
                ? Number(defaultValues.valorEstimado)
                : undefined
            }
          />
        </Field>
      </div>

      <Field label="Observações">
        <Textarea name="observacoes" rows={3} defaultValue={defaultValues?.observacoes ?? ""} />
      </Field>
    </div>
  );
}
