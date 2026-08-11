import { prisma } from "@/lib/prisma";
import { requireModule } from "@/lib/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { ActionForm, SubmitButton } from "@/components/ui/action-form";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { DeleteButton } from "@/components/ui/delete-button";
import { createTemplate, deleteTemplate } from "./actions";

export default async function MensagensTemplatesPage() {
  await requireModule("configuracoes");

  const templates = await prisma.mensagemTemplate.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Modelos de Mensagem"
        description='Textos prontos para usar na Central de Mensagens de cada cliente. Use "{nome}" para inserir o nome do cliente automaticamente.'
        action={
          <ButtonLink href="/configuracoes" variant="secondary">
            Voltar
          </ButtonLink>
        }
      />

      <div className="rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
        <ActionForm action={createTemplate}>
          <div className="space-y-4">
            <Field label="Nome do modelo" required>
              <Input name="nome" required placeholder="Ex: Orçamento enviado" />
            </Field>
            <Field label="Mensagem" required>
              <Textarea
                name="conteudo"
                rows={4}
                required
                placeholder="Olá {nome}, tudo bem? Segue o orçamento combinado..."
              />
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <SubmitButton>Adicionar modelo</SubmitButton>
          </div>
        </ActionForm>
      </div>

      <div className="mt-6 space-y-3">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-nexa-gray-light bg-white p-4 shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-nexa-black">{t.nome}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-nexa-charcoal">{t.conteudo}</p>
            </div>
            <DeleteButton id={t.id} action={deleteTemplate} confirmText="Excluir este modelo de mensagem?" />
          </div>
        ))}
        {templates.length === 0 && (
          <p className="text-center text-sm text-nexa-gray">Nenhum modelo cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
