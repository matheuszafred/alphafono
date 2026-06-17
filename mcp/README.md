# MCPs — Alphafono

MCPs (Model Context Protocols) configurados para este projeto.

## Ativos

| MCP | Finalidade | Status |
|---|---|---|
| ClickUp | Gestão de tasks do projeto | ✅ Ativo |
| Google Search Console | Monitoramento de SEO | 🔄 Em configuração |
| Google Analytics 4 | Métricas do site | ✅ Ativo (via API) |

## Google Search Console

- **Propriedade:** `https://www.alphafono.com.br/`
- **Auth:** OAuth2 (mesmo client usado no GA4)
- **Credencial:** `oauth2-client-secret.json` (não versionado)

## Configuração local

```bash
# Instalar dependências do MCP GSC
pip install google-auth google-auth-oauthlib google-api-python-client
```
