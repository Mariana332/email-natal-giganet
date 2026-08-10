"use client";

export function PrintActions({ whatsappUrl }: { whatsappUrl: string | null }) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-nexa-gray-light pb-4">
      <span className="text-sm font-semibold text-nexa-charcoal">Visualizar Proposta / Orçamento</span>
      <div className="flex flex-wrap gap-2">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Enviar WhatsApp
          </a>
        )}
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-nexa-teal px-4 py-2 text-sm font-semibold text-nexa-black hover:bg-nexa-teal-dark"
        >
          Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  );
}
