# Alphafono — Projeto Daedalus

Repositório central (monorepo) do projeto Alphafono. Reúne o dashboard de métricas, o
CRM/operação de leads, as integrações (GSC/GA4/GBP), auditorias e automações.

## Estrutura

```
alphafono/
├── dashboard/          ← Next.js + Tailwind + shadcn/ui + Recharts (deploy: Vercel)
│                          Hoje: GA4 (/) e Search Console (/seo). Recebe as telas do CRM.
├── whatsapp-service/   ← Serviço Baileys: captura leads do WhatsApp → Supabase (deploy próprio)
├── supabase/           ← Schema + migrations do CRM (contacts, pipeline_events, messages)
├── audits/             ← Relatórios de auditoria (DOM, SEO, CTA, correções do site)
├── mcp/                ← Configurações de MCPs (GSC, GBP, Ads)
├── scripts/            ← Utilitários (gsc_auth.py, gbp_auth.py, gsc.ts, grant_ga4_access.py)
└── .github/            ← Configurações do repositório
```

> **Deploy do dashboard:** o código vive agora em `dashboard/`. Na Vercel, o projeto
> `alphafono-dashboard` deve usar **Root Directory = `dashboard/`** (ajuste no painel da Vercel).

## Frentes do projeto

1. **Dashboard de métricas** (ativo) — GA4 + Search Console em `dashboard/`.
2. **CRM / Operação de leads** (em construção) — captura de leads do WhatsApp (número novo),
   origem, funil e pipeline. Código em `whatsapp-service/` + `supabase/` + novas rotas no
   `dashboard/`. Ver estrutura de fatias no ClickUp (epic *CRM / Operação — Leads WhatsApp*).

## Integrações

| Serviço | Status | Notas |
|---|---|---|
| Google Analytics 4 | ✅ Ativo | Property `538440494`, dashboard `/` |
| Google Search Console | ✅ Ativo | Dashboard `/seo`, baseline: 525 cliques/7d |
| Google Business Profile | 🔴 Bloqueado | Aguarda acesso de proprietário dos donos do perfil |
| WhatsApp (Baileys) | 🛠️ Em construção | Ingestão de leads do número novo → Supabase |
| Supabase | 🛠️ Em construção | Camada de dados do CRM |
| Google Ads | 📋 Planejado | Implementar quando campanhas estiverem ativas |
| ClickUp | ✅ Ativo | Folder `Alphafono`, Etapa 3 em andamento |
| Vercel | ✅ Deploy | alphafono-dashboard.vercel.app (Root Directory: `dashboard/`) |

## Correções do site (aguardando acesso WordPress)

| # | Correção | Prioridade | Status |
|---|---|---|---|
| 1 | Links quebrados no footer — 11 hrefs com espaço | 🔴 Crítico | Aguardando acesso |
| 2 | Flash branco no hero (CSS FlexSlider) | 🔴 Crítico | Aguardando acesso |
| 3 | Adicionar CTA WhatsApp no hero | 🟠 Alto | Aguardando acesso |

Report enviado ao admin em 17/06/2026 → `audits/2026-06-17-report-correcoes-site.md`

---

## Regras de SEO (não alterar)

- URLs/slugs de todas as páginas e posts do blog
- Texto de corpo dos artigos ranqueados
- Hierarquia de headings H1/H2/H3
- Títulos e meta descriptions configurados
- Links internos existentes no conteúdo
