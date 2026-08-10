"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ETAPAS_FUNIL_ORDENADAS, ETAPA_FUNIL_LABELS, formatCurrency } from "@/lib/labels";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { updateEtapaLead } from "./actions";
import type { EtapaFunil } from "@/generated/prisma/enums";

export type LeadCard = {
  id: string;
  nome: string;
  empresa: string | null;
  origem: string | null;
  valorEstimado: number | null;
  etapa: EtapaFunil;
  whatsapp: string | null;
  telefone: string | null;
};

export function KanbanBoard({ leads }: { leads: LeadCard[] }) {
  const [items, setItems] = useState(leads);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverEtapa, setDragOverEtapa] = useState<EtapaFunil | null>(null);
  const [, startTransition] = useTransition();

  const columns = ETAPAS_FUNIL_ORDENADAS.map((etapa) => ({
    etapa,
    leads: items.filter((l) => l.etapa === etapa),
  }));

  function handleDrop(etapa: EtapaFunil) {
    setDragOverEtapa(null);
    const id = draggingId;
    setDraggingId(null);
    if (!id) return;

    const lead = items.find((l) => l.id === id);
    if (!lead || lead.etapa === etapa) return;

    const etapaAnterior = lead.etapa;
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, etapa } : l)));

    startTransition(() => {
      updateEtapaLead(id, etapa).catch(() => {
        setItems((prev) => prev.map((l) => (l.id === id ? { ...l, etapa: etapaAnterior } : l)));
      });
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <div
          key={col.etapa}
          className="w-72 shrink-0"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverEtapa(col.etapa);
          }}
          onDragLeave={() => setDragOverEtapa((cur) => (cur === col.etapa ? null : cur))}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(col.etapa);
          }}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="font-heading text-sm font-bold text-nexa-black">
              {ETAPA_FUNIL_LABELS[col.etapa]}
            </h2>
            <span className="rounded-full bg-nexa-gray-light px-2 py-0.5 text-xs font-semibold text-nexa-charcoal">
              {col.leads.length}
            </span>
          </div>
          <div
            className={`space-y-3 rounded-xl p-2 min-h-[120px] transition-colors ${
              dragOverEtapa === col.etapa
                ? "bg-nexa-teal/10 ring-2 ring-nexa-teal/40"
                : "bg-nexa-gray-light/40"
            }`}
          >
            {col.leads.map((lead) => {
              const whatsappUrl = buildWhatsAppUrl(lead.whatsapp || lead.telefone);
              return (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => setDraggingId(lead.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className={`cursor-grab rounded-lg border border-nexa-gray-light bg-white p-3 shadow-sm transition-opacity active:cursor-grabbing ${
                    draggingId === lead.id ? "opacity-40" : ""
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <Link
                      href={`/crm/${lead.id}`}
                      className="truncate text-sm font-semibold text-nexa-black hover:text-nexa-teal-dark"
                    >
                      {lead.nome}
                    </Link>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Conversar no WhatsApp"
                        className="shrink-0 text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {lead.empresa && (
                    <p className="mb-1 truncate text-xs text-nexa-charcoal">{lead.empresa}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-nexa-gray">
                    <span>{lead.origem || "—"}</span>
                    {lead.valorEstimado !== null && (
                      <span className="font-medium text-nexa-black">
                        {formatCurrency(lead.valorEstimado)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {col.leads.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-nexa-gray">
                Nenhum contato nesta etapa
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
