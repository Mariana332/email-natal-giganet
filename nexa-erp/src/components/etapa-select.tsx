"use client";

import { useRef, useTransition } from "react";
import { ETAPAS_ORDENADAS, ETAPA_PRODUCAO_LABELS } from "@/lib/labels";

export function EtapaSelect({
  osId,
  etapa,
  action,
}: {
  osId: string;
  etapa: string;
  action: (id: string, formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const boundAction = action.bind(null, osId);

  return (
    <form ref={formRef} action={boundAction}>
      <select
        name="etapa"
        defaultValue={etapa}
        disabled={pending}
        onChange={() => startTransition(() => formRef.current?.requestSubmit())}
        className="w-full rounded-md border border-nexa-gray-light bg-white px-2 py-1 text-xs font-medium text-nexa-charcoal outline-none focus:border-nexa-teal"
      >
        {ETAPAS_ORDENADAS.map((e) => (
          <option key={e} value={e}>
            {ETAPA_PRODUCAO_LABELS[e]}
          </option>
        ))}
        <option value="CANCELADO">Cancelado</option>
      </select>
    </form>
  );
}
