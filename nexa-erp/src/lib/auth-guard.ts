import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MODULE_ACCESS, type ModuleKey } from "@/lib/permissions";
import type { Role } from "@/generated/prisma/enums";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireModule(moduleKey: ModuleKey) {
  const session = await requireSession();
  const allowed = MODULE_ACCESS[moduleKey] as readonly Role[];
  if (!allowed.includes(session.user.role)) {
    redirect("/");
  }
  return session;
}
