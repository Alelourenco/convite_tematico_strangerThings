# Convite (RSVP) — Aniversário da Brenda (tema Stranger Things)

App Next.js com formulário de confirmação de presença e área admin para listar/imprimir convidados.

## Rodar localmente

1) Instale dependências

```bash
npm install
```

2) Configure variáveis de ambiente

Crie um `.env` baseado em `.env.example`.

Obrigatório:
- `DATABASE_URL` (Postgres)

Para acessar `/admin`:
- `ADMIN_USER`
- `ADMIN_PASSWORD`

3) Suba as tabelas (Prisma)

```bash
npm run prisma:migrate
```

4) Rode o servidor

```bash
npm run dev
```

Abra http://localhost:3000

## Como funciona

- A home (`/`) tem o formulário de RSVP.
- O backend salva em Postgres via Prisma.
- A lista de convidados fica em `/admin` (protegida por HTTP Basic Auth).
- A página admin tem botão de “Imprimir” (CSS de print incluído).

## Deploy no Vercel (com persistência)

1) Suba o repositório (GitHub/GitLab/Bitbucket) e importe no Vercel.

2) Crie um banco Postgres

Opção mais simples: **Vercel Postgres** (Storage). Ele cria o `DATABASE_URL` automaticamente.

3) Configure env vars no Vercel

- `DATABASE_URL`
- `ADMIN_USER`
- `ADMIN_PASSWORD`

4) Deploy

O build já roda `prisma generate` antes do `next build`.

5) Migrações em produção

Recomendado: rodar `prisma migrate deploy` no deploy pipeline. Se você quiser, eu ajusto para usar esse fluxo no Vercel.

## Admin (impressão)

Abra `/admin` e autentique com `ADMIN_USER` / `ADMIN_PASSWORD`.
Depois clique em **Imprimir** para gerar uma versão limpa (tabela).
