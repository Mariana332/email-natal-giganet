"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import type { ActionState } from "@/components/ui/action-form";

const roleEnum = z.enum(["ADMIN", "VENDEDOR", "PRODUCAO", "FINANCEIRO", "ESTOQUE"]);

const createSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  role: roleEnum,
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

const updateSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  role: roleEnum,
  active: z.string().optional(),
  password: z.string().min(6).optional().or(z.literal("")),
});

export async function createUsuario(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("usuarios");

  const parsed = createSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Já existe um usuário com este e-mail." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash,
    },
  });

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function updateUsuario(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireModule("usuarios");

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data: {
    name: string;
    email: string;
    role: typeof parsed.data.role;
    active: boolean;
    passwordHash?: string;
  } = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    active: parsed.data.active === "on",
  };

  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  }

  await prisma.user.update({ where: { id }, data });

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function deactivateUsuario(id: string): Promise<void> {
  await requireModule("usuarios");
  await prisma.user.update({ where: { id }, data: { active: false } });
  revalidatePath("/usuarios");
}
