import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { KanbanBoard } from "./kanban-board";

export default async function CrmPage() {
  await requireModule("crm");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const leadCards = leads.map((l) => ({
    id: l.id,
    nome: l.nome,
    empresa: l.empresa,
    origem: l.origem,
    valorEstimado: l.valorEstimado !== null ? Number(l.valorEstimado) : null,
    etapa: l.etapa,
    whatsapp: l.whatsapp,
    telefone: l.telefone,
  }));

  return (
    <div>
      <PageHeader
        title="CRM"
        description="Funil de vendas: do primeiro contato até o fechamento. Arraste o card para mudar a etapa."
        action={
          <ButtonLink href="/crm/novo">
            <Plus className="h-4 w-4" /> Novo contato
          </ButtonLink>
        }
      />

      <KanbanBoard leads={leadCards} />
    </div>
  );
}
