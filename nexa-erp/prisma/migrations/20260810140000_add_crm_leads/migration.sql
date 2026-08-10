-- CreateEnum
CREATE TYPE "EtapaFunil" AS ENUM ('NOVO_CONTATO', 'QUALIFICADO', 'PROPOSTA_ENVIADA', 'NEGOCIACAO', 'GANHO', 'PERDIDO');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "origem" TEXT,
    "etapa" "EtapaFunil" NOT NULL DEFAULT 'NOVO_CONTATO',
    "valorEstimado" DECIMAL(12,2),
    "observacoes" TEXT,
    "clienteId" TEXT,
    "orcamentoId" TEXT,
    "vendedorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_orcamentoId_key" ON "leads"("orcamentoId");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
