# Plano de Propostas — plano-de-propostas.fannymelo.com.br

Página estática com o conteúdo do "Plano de Propostas" da Fanny Melo (candidata a
Deputada Federal, PODEMOS 2060), pronta para ser publicada no subdomínio
`plano-de-propostas.fannymelo.com.br`.

## Conteúdo desta pasta

- `index.html` — página com a biografia e as 18 propostas do plano, mais um
  visualizador e botão de download do PDF original.
- `assets/Fanny_Melo_-_Plano_de_Propostas.pdf` — arquivo original enviado.

Esta é uma página 100% estática (HTML/CSS puro, sem build, sem dependências de
servidor), então pode ser hospedada em qualquer serviço de hospedagem estática.

## Como criar o subdomínio e publicar

Eu não tenho acesso ao painel de DNS/registrador do domínio `fannymelo.com.br`,
então a criação do subdomínio precisa ser feita por quem administra o domínio.
Escolha uma das opções abaixo:

### Opção A — GitHub Pages (grátis, mais simples)

1. Neste repositório, vá em **Settings → Pages** e publique a partir da branch
   com esta pasta (ou mova o conteúdo desta pasta para um repositório dedicado,
   se preferir manter o site separado do restante do projeto).
2. Em **Settings → Pages → Custom domain**, informe
   `plano-de-propostas.fannymelo.com.br`.
3. No painel de DNS onde o domínio `fannymelo.com.br` está registrado, crie um
   registro:
   - Tipo: `CNAME`
   - Nome/Host: `plano-de-propostas`
   - Valor/Aponta para: `<usuario>.github.io` (o domínio do GitHub Pages)
4. Aguarde a propagação do DNS (pode levar de minutos a algumas horas) e ative
   "Enforce HTTPS" nas configurações do Pages.

### Opção B — Outro provedor de hospedagem (Vercel, Netlify, cPanel, etc.)

1. Faça o upload/deploy desta pasta (`index.html` + `assets/`) no provedor
   escolhido.
2. O provedor vai indicar um valor de CNAME (ou um IP, para registro tipo `A`).
3. No painel de DNS do domínio `fannymelo.com.br`, crie o registro apontando
   `plano-de-propostas` para o valor indicado pelo provedor.
4. Configure o certificado HTTPS (a maioria dos provedores acima faz isso
   automaticamente).

Depois de propagado o DNS, o plano de propostas ficará acessível em
`https://plano-de-propostas.fannymelo.com.br`.
