# MCP — Google Business Profile (Google Meu Negócio)

## Status
🔄 Em configuração

## Por que monitorar
Canal orgânico local gratuito. Para clínicas, as métricas de GBP são indicadores diretos de intenção de consulta:
- Buscas por nome → reconhecimento de marca
- Buscas por categoria/serviço → demanda orgânica local
- Cliques em "Ligar" → leads diretos
- Cliques em "Como chegar" → intenção de visita

## Credenciais
- **Tipo:** OAuth2 Desktop App (mesmo client do GSC)
- **Projeto GCP:** `alphafono-496918`
- **API:** Google Business Profile API v4
- **Scope:** `https://www.googleapis.com/auth/business.manage`
- **Refresh token:** `GOOGLE_REFRESH_TOKEN_GBP` (a configurar)

## Dados disponíveis via API
| Métrica | Descrição |
|---|---|
| `QUERIES_DIRECT` | Buscas pelo nome da clínica |
| `QUERIES_INDIRECT` | Buscas por categoria ("fonoaudióloga perto de mim") |
| `VIEWS_MAPS` | Visualizações no Google Maps |
| `VIEWS_SEARCH` | Visualizações na busca Google |
| `ACTIONS_PHONE` | Cliques em "Ligar" |
| `ACTIONS_DRIVING_DIRECTIONS` | Cliques em "Como chegar" |
| `ACTIONS_WEBSITE` | Cliques para o site |

## Dashboard
- Rota: `/local` (a criar)
- Lib: `lib/gbp.ts` (a criar)
- API: `/api/business-profile` (a criar)

## Setup
```bash
python3 scripts/gbp_auth.py
```
