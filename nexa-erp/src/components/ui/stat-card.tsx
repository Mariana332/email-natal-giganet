import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "danger" | "warning";
}) {
  const iconTone =
    tone === "danger"
      ? "bg-red-100 text-red-600"
      : tone === "warning"
        ? "bg-amber-100 text-amber-600"
        : "bg-nexa-teal/15 text-nexa-teal-dark";

  return (
    <div className="rounded-xl border border-nexa-gray-light bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-nexa-gray">{label}</p>
        <div className={`rounded-lg p-2 ${iconTone}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-heading text-2xl font-bold text-nexa-black">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-nexa-gray">{hint}</p>}
    </div>
  );
}
