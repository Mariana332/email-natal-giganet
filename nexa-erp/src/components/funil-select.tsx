"use client";

import { useRef, useTransition } from "react";
import { ETAPAS_FUNIL_ORDENADAS, ETAPA_FUNIL_LABELS } from "@/lib/labels";

export function FunilSelect({
  leadId,
  etapa,
  action,
}: {
  leadId: string;
  etapa: string;
  action: (id: string, formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const boundAction = action.bind(null, leadId);

  return (
    <form ref={formRef} action={boundAction}>
      <select
        name="etapa"
        defaultValue={etapa}
        disabled={pending}
        onChange={() => startTransition(() => formRef.current?.requestSubmit())}
        className="w-full rounded-md border border-nexa-gray-light bg-white px-2 py-1 text-xs font-medium text-nexa-charcoal outline-none focus:border-nexa-teal"
      >
        {ETAPAS_FUNIL_ORDENADAS.map((e) => (
          <option key={e} value={e}>
            {ETAPA_FUNIL_LABELS[e]}
          </option>
        ))}
      </select>
    </form>
  );
}
