"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  FileText,
  ClipboardList,
  Kanban,
  Wallet,
  Boxes,
  UserCog,
  Settings,
  X,
} from "lucide-react";
import type { Role } from "@/generated/prisma/enums";
import { canAccess, type ModuleKey } from "@/lib/permissions";
import { NexaLogo } from "@/components/nexa-logo";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  module: ModuleKey;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
    ],
  },
  {
    title: "Cadastros",
    items: [
      { href: "/clientes", label: "Clientes", icon: Users, module: "cadastros" },
      { href: "/fornecedores", label: "Fornecedores", icon: Truck, module: "cadastros" },
      { href: "/produtos", label: "Produtos & Serviços", icon: Package, module: "cadastros" },
    ],
  },
  {
    title: "Comercial",
    items: [
      { href: "/orcamentos", label: "Orçamentos", icon: FileText, module: "orcamentos" },
      { href: "/ordens-servico", label: "Ordens de Serviço", icon: ClipboardList, module: "ordensServico" },
      { href: "/producao", label: "Produção", icon: Kanban, module: "producao" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { href: "/financeiro", label: "Financeiro", icon: Wallet, module: "financeiro" },
      { href: "/estoque", label: "Estoque", icon: Boxes, module: "estoque" },
      { href: "/usuarios", label: "Usuários", icon: UserCog, module: "usuarios" },
      { href: "/configuracoes", label: "Configurações", icon: Settings, module: "configuracoes" },
    ],
  },
];

export function Sidebar({
  role,
  mobileOpen,
  onClose,
}: {
  role: Role;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col bg-nexa-black">
      <div className="flex items-center justify-between px-5 py-5">
        <NexaLogo />
        <button
          onClick={onClose}
          className="rounded-md p-1 text-white/60 hover:bg-white/10 lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) =>
            canAccess(role, item.module)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title || "root"}>
              {group.title && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-nexa-teal text-nexa-black"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[260px] shrink-0 border-r border-black/20 lg:block print:hidden">
        {content}
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[260px]">{content}</div>
        </div>
      )}
    </>
  );
}
