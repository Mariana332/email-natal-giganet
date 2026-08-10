import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("nexa123", 10);

  const [admin, vendedor, producao, financeiro, estoque] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@nexaprint.com.br" },
      update: {},
      create: {
        name: "Mariana Silva",
        email: "admin@nexaprint.com.br",
        passwordHash,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "vendas@nexaprint.com.br" },
      update: {},
      create: {
        name: "Carlos Vendedor",
        email: "vendas@nexaprint.com.br",
        passwordHash,
        role: "VENDEDOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "producao@nexaprint.com.br" },
      update: {},
      create: {
        name: "Fernanda Produção",
        email: "producao@nexaprint.com.br",
        passwordHash,
        role: "PRODUCAO",
      },
    }),
    prisma.user.upsert({
      where: { email: "financeiro@nexaprint.com.br" },
      update: {},
      create: {
        name: "Roberto Financeiro",
        email: "financeiro@nexaprint.com.br",
        passwordHash,
        role: "FINANCEIRO",
      },
    }),
    prisma.user.upsert({
      where: { email: "estoque@nexaprint.com.br" },
      update: {},
      create: {
        name: "Juliana Estoque",
        email: "estoque@nexaprint.com.br",
        passwordHash,
        role: "ESTOQUE",
      },
    }),
  ]);

  await prisma.empresa.deleteMany();
  await prisma.empresa.create({
    data: {
      nome: "Nexa Print",
      cnpj: "12.345.678/0001-90",
      telefone: "(34) 9 9150-1234",
      email: "contato@nexaprint.com.br",
      endereco: "Rua Celmério Guimarães, 123 - Centro - Araxá/MG",
      instagram: "@nexaprint.araxa",
      markupPadrao: 100,
    },
  });

  const clientesData = [
    { tipo: "JURIDICA" as const, nome: "Padaria Pão Dourado", documento: "11.222.333/0001-44", email: "contato@paodourado.com", telefone: "(34) 3222-1010", cidade: "Araxá", estado: "MG" },
    { tipo: "JURIDICA" as const, nome: "Clínica Vida Saudável", documento: "22.333.444/0001-55", email: "financeiro@vidasaudavel.com", telefone: "(34) 3223-2020", cidade: "Araxá", estado: "MG" },
    { tipo: "FISICA" as const, nome: "João Pedro Almeida", documento: "123.456.789-00", email: "joaopedro@gmail.com", telefone: "(34) 99911-2233", cidade: "Uberaba", estado: "MG" },
    { tipo: "JURIDICA" as const, nome: "Escritório Contábil Araxá", documento: "33.444.555/0001-66", email: "contato@contabilaraxa.com", telefone: "(34) 3224-3030", cidade: "Araxá", estado: "MG" },
    { tipo: "FISICA" as const, nome: "Mariana Costa Eventos", documento: "987.654.321-00", email: "mariana.eventos@gmail.com", telefone: "(34) 99822-4455", cidade: "Araxá", estado: "MG" },
    { tipo: "JURIDICA" as const, nome: "Supermercado Bom Preço", documento: "44.555.666/0001-77", email: "compras@bompreco.com", telefone: "(34) 3225-4040", cidade: "Ibiá", estado: "MG" },
  ];

  const clientes = [];
  for (const c of clientesData) {
    const existing = await prisma.cliente.findFirst({ where: { nome: c.nome } });
    clientes.push(existing ?? (await prisma.cliente.create({ data: c })));
  }

  const fornecedoresData = [
    { nome: "Papelaria Central Distribuidora", documento: "55.666.777/0001-88", telefone: "(34) 3220-1111", email: "vendas@papelariacentral.com", cidade: "Uberaba" },
    { nome: "Tintas & Cia Gráfica", documento: "66.777.888/0001-99", telefone: "(34) 3220-2222", email: "comercial@tintasecia.com", cidade: "Araxá" },
    { nome: "Chapas Offset Minas", documento: "77.888.999/0001-00", telefone: "(31) 3333-3333", email: "vendas@chapasoffset.com", cidade: "Belo Horizonte" },
  ];

  const fornecedores = [];
  for (const f of fornecedoresData) {
    const existing = await prisma.fornecedor.findFirst({ where: { nome: f.nome } });
    fornecedores.push(existing ?? (await prisma.fornecedor.create({ data: f })));
  }

  const produtosData = [
    { nome: "Cartão de Visita 300g (1000un)", categoria: "PAPELARIA" as const, unidade: "MILHEIRO", precoVenda: 180, custo: 70 },
    { nome: "Banner Lona 440g (m²)", categoria: "BANNER" as const, unidade: "M2", precoVenda: 45, custo: 18 },
    { nome: "Adesivo Vinil Recorte Eletrônico (m²)", categoria: "ADESIVO" as const, unidade: "M2", precoVenda: 60, custo: 22 },
    { nome: "Folder A5 4x4 cores (1000un)", categoria: "IMPRESSAO_DIGITAL" as const, unidade: "MILHEIRO", precoVenda: 220, custo: 95 },
    { nome: "Impressão Offset Catálogo (unidade)", categoria: "OFFSET" as const, unidade: "UN", precoVenda: 12, custo: 5 },
    { nome: "Fachada em ACM (m²)", categoria: "COMUNICACAO_VISUAL" as const, unidade: "M2", precoVenda: 380, custo: 190 },
    { nome: "Caneca Personalizada", categoria: "PERSONALIZADOS" as const, unidade: "UN", precoVenda: 28, custo: 11 },
    { nome: "Encadernação Espiral", categoria: "ACABAMENTO" as const, unidade: "UN", precoVenda: 8, custo: 2.5 },
    { nome: "Bloco de Notas A6 (100 folhas)", categoria: "PAPELARIA" as const, unidade: "UN", precoVenda: 14, custo: 5 },
    { nome: "Convite Casamento Premium (100un)", categoria: "PAPELARIA" as const, unidade: "CENTO", precoVenda: 450, custo: 190 },
  ];

  const produtos = [];
  for (const p of produtosData) {
    const existing = await prisma.produto.findFirst({ where: { nome: p.nome } });
    produtos.push(existing ?? (await prisma.produto.create({ data: p })));
  }

  const estoqueCount = await prisma.itemEstoque.count();
  if (estoqueCount === 0) {
    await prisma.itemEstoque.createMany({
      data: [
        { nome: "Papel Couché 300g A3", categoria: "PAPEL", unidade: "RESMA", quantidadeAtual: 42, quantidadeMinima: 15, custoUnitario: 85, fornecedorId: fornecedores[0].id },
        { nome: "Papel Sulfite A4 75g", categoria: "PAPEL", unidade: "RESMA", quantidadeAtual: 8, quantidadeMinima: 10, custoUnitario: 22, fornecedorId: fornecedores[0].id },
        { nome: "Lona 440g Branca", categoria: "PAPEL", unidade: "M2", quantidadeAtual: 120, quantidadeMinima: 30, custoUnitario: 12, fornecedorId: fornecedores[0].id },
        { nome: "Tinta CMYK Offset (kit)", categoria: "TINTA", unidade: "KIT", quantidadeAtual: 6, quantidadeMinima: 4, custoUnitario: 340, fornecedorId: fornecedores[1].id },
        { nome: "Tinta Solvente Eco (litro)", categoria: "TINTA", unidade: "L", quantidadeAtual: 3, quantidadeMinima: 5, custoUnitario: 95, fornecedorId: fornecedores[1].id },
        { nome: "Chapa Offset CTP", categoria: "CHAPA", unidade: "UN", quantidadeAtual: 25, quantidadeMinima: 10, custoUnitario: 38, fornecedorId: fornecedores[2].id },
        { nome: "Vinil Adesivo Brilho", categoria: "PAPEL", unidade: "M2", quantidadeAtual: 65, quantidadeMinima: 20, custoUnitario: 14, fornecedorId: fornecedores[0].id },
        { nome: "Espiral Plástico 12mm", categoria: "ACABAMENTO", unidade: "UN", quantidadeAtual: 300, quantidadeMinima: 50, custoUnitario: 0.8 },
      ],
    });
  }

  const orcamentosCount = await prisma.orcamento.count();
  if (orcamentosCount === 0) {
    const orc1 = await prisma.orcamento.create({
      data: {
        clienteId: clientes[0].id,
        vendedorId: vendedor.id,
        status: "APROVADO",
        dataValidade: new Date(Date.now() + 15 * 86400000),
        total: 630,
        observacoes: "Kit de material para inauguração",
        itens: {
          create: [
            { produtoId: produtos[0].id, descricao: produtos[0].nome, quantidade: 2, valorUnitario: 180, valorTotal: 360 },
            { produtoId: produtos[1].id, descricao: produtos[1].nome, quantidade: 6, valorUnitario: 45, valorTotal: 270 },
          ],
        },
      },
    });

    await prisma.orcamento.create({
      data: {
        clienteId: clientes[2].id,
        vendedorId: vendedor.id,
        status: "ENVIADO",
        dataValidade: new Date(Date.now() + 10 * 86400000),
        total: 450,
        itens: {
          create: [
            { produtoId: produtos[9].id, descricao: produtos[9].nome, quantidade: 1, valorUnitario: 450, valorTotal: 450 },
          ],
        },
      },
    });

    await prisma.orcamento.create({
      data: {
        clienteId: clientes[4].id,
        vendedorId: vendedor.id,
        status: "RASCUNHO",
        total: 220,
        itens: {
          create: [
            { produtoId: produtos[3].id, descricao: produtos[3].nome, quantidade: 1, valorUnitario: 220, valorTotal: 220 },
          ],
        },
      },
    });

    // OS from approved quote
    const os1 = await prisma.ordemServico.create({
      data: {
        clienteId: clientes[0].id,
        orcamentoId: orc1.id,
        vendedorId: vendedor.id,
        etapa: "IMPRESSAO",
        prioridade: "ALTA",
        dataEntrega: new Date(Date.now() + 3 * 86400000),
        total: 630,
        formaPagamento: "PIX",
        itens: {
          create: [
            { produtoId: produtos[0].id, descricao: produtos[0].nome, quantidade: 2, valorUnitario: 180, valorTotal: 360 },
            { produtoId: produtos[1].id, descricao: produtos[1].nome, quantidade: 6, valorUnitario: 45, valorTotal: 270 },
          ],
        },
      },
    });
    await prisma.orcamento.update({ where: { id: orc1.id }, data: { status: "CONVERTIDO" } });
    await prisma.producaoLog.create({
      data: { ordemServicoId: os1.id, etapa: "IMPRESSAO", userId: producao.id, observacao: "Em impressão" },
    });

    const osExtra = [
      { clienteId: clientes[1].id, etapa: "FILA" as const, prioridade: "NORMAL" as const, total: 380 },
      { clienteId: clientes[3].id, etapa: "DESIGN" as const, prioridade: "NORMAL" as const, total: 220 },
      { clienteId: clientes[5].id, etapa: "ACABAMENTO" as const, prioridade: "URGENTE" as const, total: 540 },
      { clienteId: clientes[2].id, etapa: "EXPEDICAO" as const, prioridade: "ALTA" as const, total: 168 },
      { clienteId: clientes[4].id, etapa: "ENTREGUE" as const, prioridade: "NORMAL" as const, total: 450, dataEntregue: new Date() },
    ];

    for (const os of osExtra) {
      const created = await prisma.ordemServico.create({
        data: {
          clienteId: os.clienteId,
          vendedorId: vendedor.id,
          etapa: os.etapa,
          prioridade: os.prioridade,
          total: os.total,
          dataEntrega: new Date(Date.now() + 5 * 86400000),
          dataEntregue: os.dataEntregue,
          itens: {
            create: [
              { descricao: "Serviço gráfico diverso", quantidade: 1, valorUnitario: os.total, valorTotal: os.total },
            ],
          },
        },
      });
      await prisma.producaoLog.create({
        data: { ordemServicoId: created.id, etapa: os.etapa, userId: producao.id },
      });
    }
  }

  const lancamentosCount = await prisma.lancamentoFinanceiro.count();
  if (lancamentosCount === 0) {
    const hoje = new Date();
    const daysFromNow = (n: number) => new Date(hoje.getTime() + n * 86400000);

    await prisma.lancamentoFinanceiro.createMany({
      data: [
        { tipo: "RECEITA", descricao: "Recebimento OS #1 - Padaria Pão Dourado", categoria: "Vendas", valor: 630, dataVencimento: daysFromNow(-2), dataPagamento: daysFromNow(-2), status: "PAGO", formaPagamento: "PIX", clienteId: clientes[0].id, userId: financeiro.id },
        { tipo: "RECEITA", descricao: "Recebimento Convites - Mariana Eventos", categoria: "Vendas", valor: 450, dataVencimento: daysFromNow(5), status: "PENDENTE", clienteId: clientes[4].id, userId: financeiro.id },
        { tipo: "RECEITA", descricao: "Fachada ACM - Supermercado Bom Preço", categoria: "Vendas", valor: 540, dataVencimento: daysFromNow(-5), status: "ATRASADO", clienteId: clientes[5].id, userId: financeiro.id },
        { tipo: "DESPESA", descricao: "Compra de papel couché", categoria: "Insumos", valor: 850, dataVencimento: daysFromNow(-1), dataPagamento: daysFromNow(-1), status: "PAGO", formaPagamento: "BOLETO", fornecedorId: fornecedores[0].id, userId: financeiro.id },
        { tipo: "DESPESA", descricao: "Manutenção impressora offset", categoria: "Manutenção", valor: 620, dataVencimento: daysFromNow(3), status: "PENDENTE", userId: financeiro.id },
        { tipo: "DESPESA", descricao: "Aluguel do galpão", categoria: "Fixas", valor: 3200, dataVencimento: daysFromNow(7), status: "PENDENTE", userId: financeiro.id },
        { tipo: "DESPESA", descricao: "Energia elétrica", categoria: "Fixas", valor: 780, dataVencimento: daysFromNow(-10), status: "ATRASADO", userId: financeiro.id },
        { tipo: "RECEITA", descricao: "Cartões de visita - Escritório Contábil", categoria: "Vendas", valor: 180, dataVencimento: daysFromNow(-15), dataPagamento: daysFromNow(-14), status: "PAGO", formaPagamento: "CARTAO_CREDITO", clienteId: clientes[3].id, userId: financeiro.id },
      ],
    });
  }

  console.log("Seed concluído:");
  console.log({ admin: admin.email, vendedor: vendedor.email, producao: producao.email, financeiro: financeiro.email, estoque: estoque.email });
  console.log("Senha para todos os usuários: nexa123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
