import { Field, Input, Select, Textarea } from "@/components/ui/form";
import type { Cliente } from "@/generated/prisma/client";

export function ClienteFields({ defaultValues }: { defaultValues?: Cliente }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Tipo" required>
          <Select name="tipo" defaultValue={defaultValues?.tipo ?? "FISICA"}>
            <option value="FISICA">Pessoa Física</option>
            <option value="JURIDICA">Pessoa Jurídica</option>
          </Select>
        </Field>
        <Field label="Nome / Razão Social" required className="sm:col-span-2">
          <Input name="nome" required defaultValue={defaultValues?.nome} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="CPF / CNPJ">
          <Input name="documento" defaultValue={defaultValues?.documento ?? ""} />
        </Field>
        <Field label="Telefone">
          <Input name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
        </Field>
        <Field label="WhatsApp">
          <Input name="whatsapp" defaultValue={defaultValues?.whatsapp ?? ""} />
        </Field>
      </div>

      <Field label="E-mail">
        <Input type="email" name="email" defaultValue={defaultValues?.email ?? ""} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Field label="Endereço" className="sm:col-span-2">
          <Input name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
        </Field>
        <Field label="Número">
          <Input name="numero" defaultValue={defaultValues?.numero ?? ""} />
        </Field>
        <Field label="Bairro">
          <Input name="bairro" defaultValue={defaultValues?.bairro ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Cidade">
          <Input name="cidade" defaultValue={defaultValues?.cidade ?? ""} />
        </Field>
        <Field label="Estado (UF)">
          <Input name="estado" maxLength={2} defaultValue={defaultValues?.estado ?? ""} />
        </Field>
        <Field label="CEP">
          <Input name="cep" defaultValue={defaultValues?.cep ?? ""} />
        </Field>
      </div>

      <Field label="Observações">
        <Textarea name="observacoes" rows={3} defaultValue={defaultValues?.observacoes ?? ""} />
      </Field>
    </div>
  );
}
