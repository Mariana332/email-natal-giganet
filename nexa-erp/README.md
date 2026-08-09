# Nexa Print ERP

Sistema de gestão (ERP) completo para gráficas, desenvolvido para a **Nexa Print** — cadastros, orçamentos, ordens de serviço, produção, financeiro e estoque em um só lugar.

## Stack

- **Next.js 16** (App Router, Server Actions, Server Components)
- **TypeScript**
- **Tailwind CSS v4** com a identidade visual da Nexa (teal `#59C5CA`, preto `#0D0D0D`, Montserrat + Inter)
- **PostgreSQL** + **Prisma ORM 7** (driver adapter `@prisma/adapter-pg`)
- **NextAuth v5** (Credentials, sessão JWT, controle de acesso por perfil)
- **Recharts** para os gráficos do dashboard

> **Nota:** o dev/build server roda com `--webpack`. O Turbopack (padrão do Next 16) tem um bug conhecido nesta versão ao lidar com o route group `(dashboard)`, então os scripts em `package.json` fixam `--webpack` até que isso seja corrigido upstream.

## Perfis de acesso

| Perfil | Acesso |
|---|---|
| **Administrador** | Todos os módulos |
| **Vendedor** | Cadastros, Orçamentos, Ordens de Serviço |
| **Produção** | Ordens de Serviço, Produção (Kanban), Estoque |
| **Financeiro** | Financeiro |
| **Estoque** | Estoque |

## Módulos

- **Cadastros**: Clientes (PF/PJ), Fornecedores, Produtos & Serviços
- **Orçamentos**: criação com itens dinâmicos, fluxo Rascunho → Enviado → Aprovado/Rejeitado → Convertido em OS
- **Ordens de Serviço**: geração manual ou a partir de orçamento aprovado
- **Produção**: quadro Kanban (Fila → Design → Impressão → Acabamento → Expedição → Entregue)
- **Financeiro**: contas a pagar/receber, baixa de pagamento, fluxo de caixa
- **Estoque**: insumos, movimentações de entrada/saída/ajuste, alerta de estoque mínimo
- **Usuários**: gestão de usuários e perfis (admin)

## Setup local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o `.env` (copie de `.env.example`) com a `DATABASE_URL` de um Postgres local e um `AUTH_SECRET`.

3. Rode as migrations e o seed:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

### Usuários de exemplo (senha: `nexa123`)

| E-mail | Perfil |
|---|---|
| admin@nexaprint.com.br | Administrador |
| vendas@nexaprint.com.br | Vendedor |
| producao@nexaprint.com.br | Produção |
| financeiro@nexaprint.com.br | Financeiro |
| estoque@nexaprint.com.br | Estoque |

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — ESLint
