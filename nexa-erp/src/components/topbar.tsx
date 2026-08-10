"use client";

import { Menu, LogOut } from "lucide-react";
import { ROLE_LABELS } from "@/lib/permissions";
import type { Role } from "@/generated/prisma/enums";
import { logoutAction } from "@/app/(dashboard)/actions";

export function Topbar({
  name,
  role,
  onMenuClick,
}: {
  name: string;
  role: Role;
  onMenuClick: () => void;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-nexa-gray-light bg-white px-4 sm:px-6 print:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-nexa-charcoal hover:bg-nexa-gray-light lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-nexa-black">{name}</p>
          <p className="text-xs text-nexa-gray">{ROLE_LABELS[role]}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nexa-teal text-sm font-bold text-nexa-black">
          {initials}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md p-2 text-nexa-gray hover:bg-nexa-gray-light hover:text-nexa-black"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
