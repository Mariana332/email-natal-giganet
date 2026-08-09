"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  id,
  action,
  confirmText = "Tem certeza que deseja excluir este registro?",
  label,
}: {
  id: string;
  action: (id: string) => Promise<void>;
  confirmText?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => action(id));
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      title="Excluir"
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </button>
  );
}
