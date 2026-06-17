# MCP — Google Search Console

## Status
✅ Ativo

## Credenciais
- **Tipo:** OAuth2 Desktop App
- **Projeto GCP:** `alphafono-496918`
- **Conta com acesso:** `matheuszafred@gmail.com` (siteFullUser)
- **Propriedade:** `https://www.alphafono.com.br/`
- **Refresh token:** armazenado em `.env.local` e Vercel (var: `GOOGLE_REFRESH_TOKEN_GSC`)

## Dados disponíveis
- Cliques, impressões, CTR, posição média
- Top queries e top páginas
- Timeline diária

## Dashboard
- Rota: `/seo`
- Lib: `lib/gsc.ts`
- API: `/api/search-console`
