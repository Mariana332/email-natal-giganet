"use client";

import { useState } from "react";
import { X, FileText, Wallet } from "lucide-react";
import { STATUS_ORCAMENTO_LABELS, formatCurrency } from "@/lib/labels";

type PendenciaGrupo = { valor: number; quantidade: number; proximoVencimento: string | null };

export function ClienteStatusCard({
  ultimoOrcamento,
  pendencias,
  totalPendente,
  mostrarFinanceiro,
}: {
  ultimoOrcamento: { numero: number; status: string; data: string } | null;
  pendencias: PendenciaGrupo[];
  totalPendente: number;
  mostrarFinanceiro: boolean;
}) {
  const [visivel, setVisivel] = useState(true);

  const temFinanceiro = mostrarFinanceiro && pendencias.length > 0;
  if (!visivel || (!ultimoOrcamento && !temFinanceiro)) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-nexa-gray">Status do cliente</h3>
        <button
          onClick={() => setVisivel(false)}
          className="text-nexa-gray hover:text-nexa-black"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {ultimoOrcamento && (
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-nexa-teal-dark" />
            <p className="text-nexa-charcoal">
              Pediu orçamento em <strong>{ultimoOrcamento.data}</strong> —{" "}
              {STATUS_ORCAMENTO_LABELS[ultimoOrcamento.status]}
            </p>
          </div>
        )}

        {temFinanceiro && (
          <div className="flex items-start gap-2 border-t border-nexa-gray-light pt-3">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-nexa-charcoal">
              <p className="font-medium">Pendências: {formatCurrency(totalPendente)}</p>
              <ul className="mt-1 space-y-0.5 text-xs text-nexa-gray">
                {pendencias.map((p, i) => (
                  <li key={i}>
                    {p.quantidade > 1 ? `${p.quantidade}x de ${formatCurrency(p.valor)}` : formatCurrency(p.valor)}
                    {p.proximoVencimento && ` — vence ${p.proximoVencimento}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
