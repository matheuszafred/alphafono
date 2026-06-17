# MCPs — Alphafono

MCPs (Model Context Protocols) configurados para este projeto.

## Canais Google

| Canal | Finalidade | Status | Doc |
|---|---|---|---|
| Google Analytics 4 | Métricas de tráfego e conversão | ✅ Ativo | — |
| Google Search Console | SEO orgânico — queries, posições, cliques | ✅ Ativo | [gsc.md](./gsc.md) |
| Google Business Profile | SEO local — ligações, rotas, buscas locais | 🔄 Em configuração | [gbp.md](./gbp.md) |
| Google Ads | Performance de mídia paga | 📋 Planejado | [ads.md](./ads.md) |

## Outros

| MCP | Finalidade | Status |
|---|---|---|
| ClickUp | Gestão de tasks do projeto | ✅ Ativo |

## Google Search Console

- **Propriedade:** `https://www.alphafono.com.br/`
- **Auth:** OAuth2 (mesmo client usado no GA4)
- **Credencial:** `oauth2-client-secret.json` (não versionado)

## Configuração local

```bash
# Instalar dependências do MCP GSC
pip install google-auth google-auth-oauthlib google-api-python-client
```
