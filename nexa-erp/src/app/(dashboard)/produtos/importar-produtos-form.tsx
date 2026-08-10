"use client";

import { useActionState, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { importProdutos, type ImportState } from "./actions";

const initialState: ImportState = { error: null, importedCount: null };

function FilePicker({ pending }: { pending: boolean }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-nexa-gray-light bg-white px-4 py-2 text-sm font-semibold text-nexa-charcoal transition hover:bg-nexa-gray-light/60">
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        {fileName ?? "Importar planilha (CSV)"}
        <input
          type="file"
          name="arquivo"
          accept=".csv,text/csv"
          className="hidden"
          disabled={pending}
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      {fileName && (
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-nexa-teal px-3 py-2 text-sm font-semibold text-nexa-black transition hover:bg-nexa-teal-dark disabled:opacity-60"
        >
          {pending ? "Importando..." : "Enviar"}
        </button>
      )}
    </>
  );
}

export function ImportarProdutosForm() {
  const [state, formAction, pending] = useActionState(importProdutos, initialState);
  // Forces the file picker to remount (clearing the selected file) after each completed submission.
  const pickerKey = JSON.stringify(state);

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction} className="flex items-center gap-2">
        <FilePicker key={pickerKey} pending={pending} />
      </form>
      {state.error && <p className="max-w-xs text-right text-xs text-red-600">{state.error}</p>}
      {state.importedCount !== null && !state.error && (
        <p className="text-xs text-emerald-600">
          {state.importedCount} produto(s) importado(s) com sucesso!
        </p>
      )}
    </div>
  );
}
