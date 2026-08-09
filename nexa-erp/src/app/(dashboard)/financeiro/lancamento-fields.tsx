import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { FORMA_PAGAMENTO_LABELS } from "@/lib/labels";
import type { Cliente, Fornecedor, LancamentoFinanceiro } from "@/generated/prisma/client";

const CATEGORIAS = [
  "Vendas",
  "Insumos",
  "Fixas",
  "Manutenção",
  "Impostos",
  "Salários",
  "Comissões",
  "Marketing",
  "Outros",
];

export function LancamentoFields({
  defaultValues,
  clientes,
  fornecedores,
}: {
  defaultValues?: LancamentoFinanceiro;
  clientes: Cliente[];
  fornecedores: Fornecedor[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Tipo" required>
          <Select name="tipo" defaultValue={defaultValues?.tipo ?? "RECEITA"}>
            <option value="RECEITA">Receita (a receber)</option>
            <option value="DESPESA">Despesa (a pagar)</option>
          </Select>
        </Field>
        <Field label="Categoria" required>
          <Select name="categoria" defaultValue={defaultValues?.categoria ?? "Vendas"}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Valor (R$)" required>
          <Input
            type="number"
            name="valor"
            min="0.01"
            step="0.01"
            required
            defaultValue={defaultValues ? Number(defaultValues.valor) : undefined}
          />
        </Field>
      </div>

      <Field label="Descrição" required>
        <Input name="descricao" required defaultValue={defaultValues?.descricao} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Vencimento" required>
          <Input
            type="date"
            name="dataVencimento"
            required
            defaultValue={
              defaultValues ? defaultValues.dataVencimento.toISOString().slice(0, 10) : ""
            }
          />
        </Field>
        <Field label="Cliente (opcional)">
          <Select name="clienteId" defaultValue={defaultValues?.clienteId ?? ""}>
            <option value="">—</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fornecedor (opcional)">
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

      <Field label="Forma de pagamento">
        <Select name="formaPagamento" defaultValue={defaultValues?.formaPagamento ?? ""}>
          <option value="">Não definida</option>
          {Object.entries(FORMA_PAGAMENTO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Observações">
        <Textarea name="observacoes" rows={3} defaultValue={defaultValues?.observacoes ?? ""} />
      </Field>
    </div>
  );
}
