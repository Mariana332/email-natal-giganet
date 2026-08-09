import { Field, Input, Textarea } from "@/components/ui/form";
import type { Fornecedor } from "@/generated/prisma/client";

export function FornecedorFields({ defaultValues }: { defaultValues?: Fornecedor }) {
  return (
    <div className="space-y-5">
      <Field label="Nome / Razão Social" required>
        <Input name="nome" required defaultValue={defaultValues?.nome} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="CNPJ / CPF">
          <Input name="documento" defaultValue={defaultValues?.documento ?? ""} />
        </Field>
        <Field label="Telefone">
          <Input name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
        </Field>
        <Field label="E-mail">
          <Input type="email" name="email" defaultValue={defaultValues?.email ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Endereço" className="sm:col-span-2">
          <Input name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
        </Field>
        <Field label="Cidade / UF">
          <Input name="cidade" defaultValue={defaultValues?.cidade ?? ""} />
        </Field>
      </div>

      <Field label="Observações">
        <Textarea name="observacoes" rows={3} defaultValue={defaultValues?.observacoes ?? ""} />
      </Field>
    </div>
  );
}
