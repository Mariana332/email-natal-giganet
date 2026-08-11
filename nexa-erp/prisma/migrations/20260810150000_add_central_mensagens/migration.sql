-- CreateEnum
CREATE TYPE "DirecaoMensagem" AS ENUM ('ENVIADA', 'RECEBIDA');

-- CreateTable
CREATE TABLE "mensagem_templates" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagem_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagem_logs" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "direcao" "DirecaoMensagem" NOT NULL DEFAULT 'ENVIADA',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagem_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mensagem_logs" ADD CONSTRAINT "mensagem_logs_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagem_logs" ADD CONSTRAINT "mensagem_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
