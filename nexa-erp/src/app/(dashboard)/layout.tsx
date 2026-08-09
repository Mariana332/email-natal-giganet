import { requireSession } from "@/lib/auth-guard";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const session = await requireSession();

  return (
    <AppShell name={session.user.name} role={session.user.role}>
      {children}
    </AppShell>
  );
}
