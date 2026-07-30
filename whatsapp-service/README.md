# whatsapp-service — Ingestão de Leads (Baileys)

Serviço **sempre-ligado** que escuta o número de WhatsApp da clínica (o **número novo**),
captura os leads que chegam e grava no Supabase. Não roda na Vercel (precisa de socket
persistente) — deploy próprio (ver decisão de hosting).

## Papel na arquitetura

```
CTA (site / Instagram / Taggo / GBP)
  └─ wa.me → NÚMERO NOVO, com mensagem pré-preenchida que carrega a ORIGEM
       └─ [este serviço] Baileys
            ├─ captura: telefone, timestamp, 1ª mensagem
            ├─ parseia a ORIGEM a partir do texto da 1ª mensagem
            └─ grava lead em Supabase (contacts + pipeline_events)
                 └─ dashboard/ lê e exibe (/operacao, /pipeline)
```

A secretária **continua atendendo no WhatsApp do celular normalmente** — o serviço só
espelha as mensagens para o banco.

## Status

📋 **Planejado (Fatia 1 do CRM).** Ver tasks no ClickUp:
- Decisão de hospedagem (Mac local vs Railway/Fly.io)
- Setup Baileys + Supabase
- Repontar todos os `wa.me` para o número novo + tag de origem
- Parser de origem a partir da 1ª mensagem

## Decisões em aberto

- **Hosting:** Mac local (grátis, frágil) vs Railway/Fly.io (pago, estável). → task dedicada.
- **Sessão do número novo:** confirmar se o chip é dedicado ou já em uso pela secretária
  (define se o Baileys pode assumir a sessão sem atrapalhar o atendimento).
- **Baileys (não-oficial) vs WhatsApp Cloud API (oficial):** decidido por **Baileys** para
  preservar o fluxo humano da secretária. Migrar para Cloud API só se surgir necessidade de
  automação de resposta/broadcast em escala.

## Variáveis de ambiente (a definir)

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_NUMBER=            # número novo, formato internacional
SESSION_STORAGE_PATH=       # onde persistir a sessão do Baileys
```
