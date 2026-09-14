# Plano de Propostas — plano-de-propostas.fannymelo.com.br

Página estática com o conteúdo do "Plano de Propostas" da Fanny Melo (candidata a
Deputada Federal, PODEMOS 2060), pronta para ser publicada no subdomínio
`plano-de-propostas.fannymelo.com.br`.

## Conteúdo desta pasta

- `index.html` — página com a biografia e as 18 propostas do plano, mais um
  visualizador e botão de download do PDF original.
- `assets/Fanny_Melo_-_Plano_de_Propostas.pdf` — arquivo original enviado.
- `CNAME` — arquivo que diz ao GitHub Pages qual domínio customizado usar
  (`plano-de-propostas.fannymelo.com.br`).

Esta é uma página 100% estática (HTML/CSS puro, sem build, sem dependências de
servidor), então pode ser hospedada em qualquer serviço de hospedagem estática.

## Deploy automático via GitHub Actions (já configurado)

O workflow `.github/workflows/deploy-pages.yml` publica automaticamente esta
pasta no GitHub Pages a cada push que altere `plano-de-propostas/**` (nas
branches `main` e `claude/fanny-subdomain-proposal-plans-6d670u`), e também
pode ser disparado manualmente em **Actions → Deploy Plano de Propostas to
GitHub Pages → Run workflow**.

Ele usa `actions/configure-pages`, que habilita o GitHub Pages automaticamente
(fonte "GitHub Actions") na primeira execução — não é necessário mexer em
**Settings → Pages** manualmente. Como a pasta já contém o arquivo `CNAME`, o
GitHub também configura o domínio customizado sozinho a cada deploy.

## Como criar o subdomínio (única etapa manual)

Eu não tenho acesso ao painel de DNS/registrador do domínio `fannymelo.com.br`,
então esta etapa precisa ser feita por quem administra o domínio:

1. No painel de DNS onde `fannymelo.com.br` está registrado, crie um registro:
   - Tipo: `CNAME`
   - Nome/Host: `plano-de-propostas`
   - Valor/Aponta para: `mariana332.github.io`
2. Aguarde a propagação do DNS (minutos a algumas horas).
3. Depois que o domínio propagar, confira em **Settings → Pages** deste
   repositório se "Enforce HTTPS" está marcado (o GitHub emite o certificado
   automaticamente assim que reconhece o domínio).

Depois disso, o plano de propostas ficará acessível em
`https://plano-de-propostas.fannymelo.com.br`.

### Alternativa — outro provedor de hospedagem (Vercel, Netlify, cPanel, etc.)

1. Faça o upload/deploy desta pasta (`index.html` + `assets/`) no provedor
   escolhido.
2. O provedor vai indicar um valor de CNAME (ou um IP, para registro tipo `A`).
3. No painel de DNS do domínio `fannymelo.com.br`, crie o registro apontando
   `plano-de-propostas` para o valor indicado pelo provedor.
4. Configure o certificado HTTPS (a maioria dos provedores acima faz isso
   automaticamente).

Depois de propagado o DNS, o plano de propostas ficará acessível em
`https://plano-de-propostas.fannymelo.com.br`.
