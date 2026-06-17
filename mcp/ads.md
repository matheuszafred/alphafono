# MCP — Google Ads

## Status
📋 Planejado — implementar quando campanhas estiverem ativas

## Por que monitorar
Quando a Alphafono investir em Google Ads, será necessário cruzar:
- Custo por clique (CPC) vs leads gerados
- Keywords que convertem vs keywords que só gastam
- ROAS por campanha/grupo de anúncios
- Comparativo orgânico (GSC) vs pago (Ads) no mesmo dashboard

## Pré-requisitos para implementar
- [ ] Conta Google Ads ativa com campanhas rodando
- [ ] **Developer Token aprovado** pelo Google (processo de aprovação manual — pode levar dias)
- [ ] Customer ID da conta Ads
- [ ] OAuth2 com scope `https://www.googleapis.com/auth/adwords`

## Como solicitar o Developer Token
1. Acesse: `ads.google.com → Ferramentas → Centro de API`
2. Solicite acesso "Basic" (suficiente para conta própria)
3. Aguarde aprovação do Google (2-5 dias úteis)

## Dados planejados para o dashboard
| Métrica | Descrição |
|---|---|
| Impressões | Vezes que o anúncio apareceu |
| Cliques | Cliques nos anúncios |
| CTR | Taxa de clique |
| CPC médio | Custo médio por clique |
| Custo total | Investimento no período |
| Conversões | Leads/ações rastreadas |
| Custo por conversão | Investimento / leads |
| Top keywords | Keywords por conversão e custo |

## Dashboard (futuro)
- Rota: `/ads`
- Lib: `lib/gads.ts`
- API: `/api/google-ads`

## Ação recomendada
Iniciar o processo de aprovação do Developer Token **antes** de ativar campanhas, pois a aprovação pode demorar.
