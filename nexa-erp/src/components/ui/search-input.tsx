"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchInput({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nexa-gray" />
      <input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={placeholder}
        onChange={(e) => {
          const value = e.target.value;
          startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) params.set("q", value);
            else params.delete("q");
            router.replace(`${pathname}?${params.toString()}`);
          });
        }}
        className="w-full rounded-lg border border-nexa-gray-light bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-nexa-teal focus:ring-2 focus:ring-nexa-teal/30 sm:w-64"
      />
    </div>
  );
}
