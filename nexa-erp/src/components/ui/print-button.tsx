"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir / PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center justify-center gap-2 rounded-lg border border-nexa-gray-light bg-white px-4 py-2 text-sm font-semibold text-nexa-charcoal transition hover:bg-nexa-gray-light/60"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
