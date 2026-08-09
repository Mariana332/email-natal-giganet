"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Select } from "@/components/ui/form";
import { formatCurrency } from "@/lib/labels";

export type ProdutoOption = {
  id: string;
  nome: string;
  unidade: string;
  precoVenda: number;
};

export type ItemRow = {
  key: string;
  produtoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
};

let rowSeq = 0;
const newRow = (): ItemRow => ({
  key: `row-${++rowSeq}`,
  produtoId: "",
  descricao: "",
  quantidade: 1,
  valorUnitario: 0,
});

export function ItemEditor({
  produtos,
  defaultItems,
}: {
  produtos: ProdutoOption[];
  defaultItems?: ItemRow[];
}) {
  const [rows, setRows] = useState<ItemRow[]>(
    defaultItems && defaultItems.length > 0 ? defaultItems : [newRow()]
  );

  const subtotal = rows.reduce((acc, r) => acc + r.quantidade * r.valorUnitario, 0);

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[2fr_2.5fr_0.8fr_1fr_1fr_auto] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-nexa-gray sm:grid">
        <span>Produto/Serviço</span>
        <span>Descrição</span>
        <span>Qtd</span>
        <span>Valor unit.</span>
        <span>Total</span>
        <span />
      </div>

      {rows.map((row) => (
        <div
          key={row.key}
          className="grid grid-cols-1 gap-2 rounded-lg border border-nexa-gray-light p-3 sm:grid-cols-[2fr_2.5fr_0.8fr_1fr_1fr_auto] sm:items-center sm:border-0 sm:p-0"
        >
          <Select
            value={row.produtoId}
            onChange={(e) => {
              const produto = produtos.find((p) => p.id === e.target.value);
              updateRow(row.key, {
                produtoId: e.target.value,
                descricao: produto ? produto.nome : row.descricao,
                valorUnitario: produto ? produto.precoVenda : row.valorUnitario,
              });
            }}
          >
            <option value="">Item avulso</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Descrição"
            value={row.descricao}
            onChange={(e) => updateRow(row.key, { descricao: e.target.value })}
          />
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={row.quantidade}
            onChange={(e) => updateRow(row.key, { quantidade: Number(e.target.value) || 0 })}
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            value={row.valorUnitario}
            onChange={(e) => updateRow(row.key, { valorUnitario: Number(e.target.value) || 0 })}
          />
          <span className="text-sm font-medium text-nexa-black">
            {formatCurrency(row.quantidade * row.valorUnitario)}
          </span>
          <button
            type="button"
            onClick={() => removeRow(row.key)}
            className="justify-self-start rounded-md p-2 text-red-500 hover:bg-red-50 sm:justify-self-center"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* hidden inputs so the parallel-array values reach the Server Action via FormData */}
          <input type="hidden" name="item_produtoId" value={row.produtoId} />
          <input type="hidden" name="item_descricao" value={row.descricao} />
          <input type="hidden" name="item_quantidade" value={row.quantidade} />
          <input type="hidden" name="item_valorUnitario" value={row.valorUnitario} />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, newRow()])}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-nexa-gray-light px-3 py-2 text-sm font-medium text-nexa-teal-dark hover:bg-nexa-teal/5"
      >
        <Plus className="h-4 w-4" /> Adicionar item
      </button>

      <div className="flex justify-end pt-2 text-sm">
        <span className="font-semibold text-nexa-black">
          Subtotal: {formatCurrency(subtotal)}
        </span>
      </div>
    </div>
  );
}
