# Alphafono — Projeto Daedalus

Repositório central do projeto Alphafono. Contém o dashboard de métricas, integrações com GSC/GA4, auditorias e automações.

## Estrutura

```
alphafono/
├── dashboard/      ← Next.js + Tailwind + shadcn/ui + Recharts (deploy: Vercel)
├── audits/         ← Relatórios de auditoria (DOM, SEO, CTA, etc.)
├── mcp/            ← Configurações de MCPs (GSC, ClickUp, etc.)
├── scripts/        ← Utilitários Python (clickup_sync.py, grant_ga4_access.py)
└── .github/        ← Configurações do repositório
```

## Dashboard

- **URL produção:** https://alphafono-dashboard.vercel.app
- **Stack:** Next.js + Tailwind CSS + shadcn/ui + Recharts
- **Código:** `/dashboard`

## Integrações

| Serviço | Status |
|---|---|
| Google Analytics 4 | ✅ Ativo — Property `538440494` |
| Google Search Console | 🔄 Em configuração |
| ClickUp | ✅ Ativo — Folder `Alphafono` |
| Vercel | ✅ Deploy automático |

## Regras de SEO (não alterar)

- URLs/slugs de todas as páginas e posts do blog
- Texto de corpo dos artigos ranqueados
- Hierarquia de headings H1/H2/H3
- Títulos e meta descriptions configurados
- Links internos existentes no conteúdo
