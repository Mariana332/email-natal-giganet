"use client";

import { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/labels";

const UNIDADES = ["UN", "M2", "ML", "CENTO", "MILHEIRO", "KIT", "PACOTE", "HORA"];

type ProdutoDefaults = {
  nome: string;
  categoria: string;
  unidade: string;
  precoVenda: number;
  custo: number;
  descricao: string | null;
};

export function ProdutoFields({
  defaultValues,
  markupPadrao,
}: {
  defaultValues?: ProdutoDefaults;
  markupPadrao?: number | null;
}) {
  const custoInicial = defaultValues?.custo ?? 0;
  const precoInicial = defaultValues?.precoVenda ?? 0;
  const markupInicial =
    defaultValues && custoInicial > 0
      ? Number((((precoInicial - custoInicial) / custoInicial) * 100).toFixed(2))
      : (markupPadrao ?? 100);

  const [custo, setCusto] = useState(custoInicial > 0 ? String(custoInicial) : "");
  const [markup, setMarkup] = useState(String(markupInicial));
  const [precoVenda, setPrecoVenda] = useState(precoInicial > 0 ? String(precoInicial) : "");

  function recalcularPreco(custoStr: string, markupStr: string) {
    const c = parseFloat(custoStr) || 0;
    const m = parseFloat(markupStr) || 0;
    setPrecoVenda((c * (1 + m / 100)).toFixed(2));
  }

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Custo estimado (R$)">
          <Input
            type="number"
            name="custo"
            step="0.01"
            min="0"
            value={custo}
            onChange={(e) => {
              setCusto(e.target.value);
              recalcularPreco(e.target.value, markup);
            }}
          />
        </Field>
        <Field label="Markup (%)">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={markup}
            onChange={(e) => {
              setMarkup(e.target.value);
              recalcularPreco(custo, e.target.value);
            }}
          />
        </Field>
        <Field label="Preço de venda (R$)" required>
          <Input
            type="number"
            name="precoVenda"
            step="0.01"
            min="0"
            required
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
          />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-nexa-gray">
        O preço de venda é recalculado automaticamente a partir do custo e do markup (ex: 100%
        dobra o custo). Você também pode editá-lo diretamente para sobrepor o cálculo.
      </p>

      <Field label="Descrição">
        <Textarea name="descricao" rows={3} defaultValue={defaultValues?.descricao ?? ""} />
      </Field>
    </div>
  );
}
