# supabase — Camada de dados do CRM

Banco que dá **estado** ao dashboard (que hoje é só leitura de GA4/GSC). Recebe os leads
capturados pelo `whatsapp-service/` e alimenta as telas de operação/pipeline.

## Status

📋 **Planejado (Fatia 0 do CRM).** `migrations/0001_init.sql` é o schema-rascunho inicial —
revisar antes de aplicar.

## Modelo (resumo)

- **contacts** — um registro por lead (telefone único), com origem e estágio atual.
- **pipeline_events** — histórico de mudança de estágio (auditoria do funil).
- **messages** — *opcional/mínimo*. Guarda só o necessário para atribuição de origem.
  ⚠️ **LGPD:** conteúdo de conversa é dado sensível de paciente — guardar o mínimo,
  com acesso restrito. Preferir não persistir corpo de mensagem além da 1ª.

## Estágios do pipeline

`novo → em_atendimento → agendado → compareceu → perdido`

## Origens

`site · instagram · google_gbp · taggo · direto · outro`
(A origem vem do texto da 1ª mensagem do lead — ver `whatsapp-service/`.)

## ⚠️ LGPD / acesso

Ao introduzir dados de leads, o dashboard **deixa de poder ser público**. Fatia 2 inclui
auth (Supabase Auth) e política de dados mínimos.
