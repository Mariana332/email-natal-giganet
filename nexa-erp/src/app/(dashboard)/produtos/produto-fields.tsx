import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/labels";
import type { Produto } from "@/generated/prisma/client";

const UNIDADES = ["UN", "M2", "ML", "CENTO", "MILHEIRO", "KIT", "PACOTE", "HORA"];

export function ProdutoFields({ defaultValues }: { defaultValues?: Produto }) {
  return (
    <div className="space-y-5">
      <Field label="Nome do produto/serviço" required>
        <Input name="nome" required defaultValue={defaultValues?.nome} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Categoria" required>
          <Select name="categoria" defaultValue={defaultValues?.categoria ?? "OUTROS"}>
            {Object.entries(CATEGORIA_PRODUTO_LABELS).map(([value, label]) => (
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Preço de venda (R$)" required>
          <Input
            type="number"
            name="precoVenda"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues ? Number(defaultValues.precoVenda) : undefined}
          />
        </Field>
        <Field label="Custo estimado (R$)">
          <Input
            type="number"
            name="custo"
            step="0.01"
            min="0"
            defaultValue={defaultValues ? Number(defaultValues.custo) : 0}
          />
        </Field>
      </div>

      <Field label="Descrição">
        <Textarea name="descricao" rows={3} defaultValue={defaultValues?.descricao ?? ""} />
      </Field>
    </div>
  );
}
