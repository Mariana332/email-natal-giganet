import { Field, Input, Select } from "@/components/ui/form";
import { CATEGORIA_ESTOQUE_LABELS } from "@/lib/labels";
import type { Fornecedor, ItemEstoque } from "@/generated/prisma/client";

const UNIDADES = ["UN", "RESMA", "M2", "KIT", "L", "KG", "PACOTE"];

export function ItemEstoqueFields({
  defaultValues,
  fornecedores,
  isEditing = false,
}: {
  defaultValues?: ItemEstoque;
  fornecedores: Fornecedor[];
  isEditing?: boolean;
}) {
  return (
    <div className="space-y-5">
      <Field label="Nome do insumo" required>
        <Input name="nome" required defaultValue={defaultValues?.nome} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Categoria" required>
          <Select name="categoria" defaultValue={defaultValues?.categoria ?? "OUTROS"}>
            {Object.entries(CATEGORIA_ESTOQUE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Unidade" required>
          <Select name="unidade" defaultValue={defaultValues?.unidade ?? "UN"}>
            {UNIDADES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fornecedor">
          <Select name="fornecedorId" defaultValue={defaultValues?.fornecedorId ?? ""}>
            <option value="">—</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Quantidade atual">
          <Input
            type="number"
            name="quantidadeAtual"
            min="0"
            step="0.01"
            disabled={isEditing}
            defaultValue={defaultValues ? Number(defaultValues.quantidadeAtual) : 0}
          />
          {isEditing && (
            <p className="mt-1 text-xs text-nexa-gray">
              Use &ldquo;Movimentar estoque&rdquo; abaixo para ajustar a quantidade.
            </p>
          )}
        </Field>
        <Field label="Estoque mínimo">
          <Input
            type="number"
            name="quantidadeMinima"
            min="0"
            step="0.01"
            defaultValue={defaultValues ? Number(defaultValues.quantidadeMinima) : 0}
          />
        </Field>
        <Field label="Custo unitário (R$)">
          <Input
            type="number"
            name="custoUnitario"
            min="0"
            step="0.01"
            defaultValue={defaultValues ? Number(defaultValues.custoUnitario) : 0}
          />
        </Field>
      </div>
    </div>
  );
}
