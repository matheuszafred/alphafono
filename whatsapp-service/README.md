# whatsapp-service — Ingestão de Leads (Baileys)

Serviço Node **sempre-ligado** que conecta ao WhatsApp do **número novo** como dispositivo
vinculado (**somente leitura** — não envia nada), e a cada nova conversa grava o lead no
Supabase. A secretária segue atendendo no celular normalmente.

## Como funciona

```
CTA (site/IG/Taggo/GBP) → wa.me c/ msg pré-preenchida (tag de origem)
  → NÚMERO NOVO → [este serviço, Baileys]
       ├─ captura: telefone, nome (pushName), timestamp
       ├─ deriva a ORIGEM da 1ª mensagem (src/origin.js)
       └─ grava em Supabase: contacts + 1º pipeline_event ('novo')
```

Novo contato → cria lead. Contato que já existe → só atualiza `last_seen` (recorrente).
**Não grava conteúdo de mensagem** — só telefone, nome e origem.

## Rodar (VPS via Docker)

Pré-requisito: Docker (o VPS daedalustech.io já tem, do n8n).

```bash
cp .env.example .env      # e preencha SUPABASE_SERVICE_ROLE_KEY
docker compose up -d --build
docker logs -f alphafono-whatsapp    # mostra o QR na 1ª vez
```

Escaneie o QR **com o WhatsApp do número novo** (uma única vez). A sessão fica salva no
volume `auth_info/` e sobrevive a restart.

## Rodar local (dev)

```bash
npm install
cp .env.example .env      # preencha as chaves
npm start                 # escaneie o QR que aparece no terminal
```

## Variáveis (.env)

| Var | Descrição |
|---|---|
| `SUPABASE_URL` | `https://spljuolozvuaizeumqmm.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role do Supabase — **secreta, só no servidor** |
| `SESSION_STORAGE_PATH` | pasta da sessão (default `./auth_info`) |

## Tag de origem nos links wa.me

O `src/origin.js` lê uma tag na 1ª mensagem: `(ref: X)` com `X` ∈
`site · instagram · google · taggo · direto` (opcional `pag: <detalhe>`).
Os links `wa.me` precisam carregar essa tag — ver task **"Repontar wa.me"**. Ex.:

```
https://wa.me/55XXXXXXXXXXX?text=Ol%C3%A1!%20Quero%20agendar.%20(ref:%20site%20pag:%20home)
```

## ⚠️ Notas

- **Baileys é não-oficial** → risco de ban. Por isso: número **dedicado** e listen-only.
  Fallback documentado (n8n) existe no ClickUp caso necessário.
- **LGPD:** guardamos telefone/nome/origem (necessário pra operar o pipeline), **sem
  conteúdo de conversa**. Acesso ao dashboard entra sob login na Fatia 2.
- Decidimos guardar o telefone em claro (e não hash) para a secretária conseguir
  identificar o lead no pipeline; o dado fica protegido por auth + RLS (F2).

## Deploy no VPS — aprendizados & runbook

Validado ponta-a-ponta em 2026-08-04 (Docker no VPS `daedalustech.io`, Node 22).

### ⚠️ Gotcha: o Web console mascara tokens JWT ao colar
Ao colar a `SUPABASE_SERVICE_ROLE_KEY` (que começa com `eyJ`) direto no Web console da
Hostinger, ele **detecta o padrão JWT e substitui por `•`** — a chave chega corrompida no
`.env` e TODA gravação falha com `Cannot convert argument to a ByteString ... value of 8226`.
**Solução:** gravar a chave via **base64 em pedaços curtos** e decodificar no servidor:

```bash
# gere localmente:  printf '%s' "$KEY" | base64
: > /tmp/k.b64
printf %s 'CHUNK1_de_~48_chars' >> /tmp/k.b64
printf %s 'CHUNK2...'          >> /tmp/k.b64   # etc.
printf 'SUPABASE_SERVICE_ROLE_KEY=' >> .env
base64 -d /tmp/k.b64 >> .env && echo >> .env && rm -f /tmp/k.b64
```

### Pareamento (por código, headless)
```bash
docker compose up -d --force-recreate && sleep 12 && docker compose logs --tail=30
# → CÓDIGO DE PAREAMENTO: XXXX-XXXX
# no celular do número (PAIRING_NUMBER): WhatsApp → Aparelhos conectados →
#   Conectar um aparelho → Conectar com número de telefone → digitar o código
```

### Migrar para outro número (ex.: teste → Alphafono)
Simples — a infra é agnóstica ao número:
```bash
sed -i 's/^PAIRING_NUMBER=.*/PAIRING_NUMBER=<novo numero>/' .env
rm -rf auth_info                       # limpa a sessão antiga
docker compose up -d --force-recreate  # gera novo código → parear o novo celular
```

### 🐛 Known issue: telefone vem como LID
Em contatos novos, `msg.key.remoteJid` pode ser um **LID** (`@lid`, ID interno de
privacidade do WhatsApp) em vez do número real. Precisa resolver **LID → telefone** antes
de considerar o dado 100% utilizável pela secretária. (Follow-up.)
