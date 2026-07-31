import "dotenv/config";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import { upsertLead } from "./supabase.js";

const AUTH_DIR = process.env.SESSION_STORAGE_PATH || "./auth_info";

function extractText(message) {
  if (!message) return "";
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    ""
  );
}

function phoneFromJid(jid) {
  return (jid || "").split("@")[0].split(":")[0];
}

function tsToMs(messageTimestamp) {
  if (typeof messageTimestamp === "number") return messageTimestamp * 1000;
  if (messageTimestamp?.toNumber) return messageTimestamp.toNumber() * 1000;
  return Date.now();
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    markOnlineOnConnect: false, // não fica "online" no lugar da secretária
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n[whatsapp] Escaneie o QR com o WhatsApp do NÚMERO NOVO:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("[whatsapp] Conectado ✓ — escutando novas conversas (somente leitura).");
    }

    if (connection === "close") {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;
      if (loggedOut) {
        console.log("[whatsapp] Deslogado. Apague a pasta da sessão e reescaneie o QR.");
      } else {
        console.log(`[whatsapp] Conexão caiu (code=${code}). Reconectando...`);
        start();
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return; // só mensagens novas em tempo real

    for (const msg of messages) {
      if (msg.key.fromMe) continue; // ignora o que a secretária envia
      const jid = msg.key.remoteJid || "";
      if (jid.endsWith("@g.us") || jid === "status@broadcast") continue; // ignora grupos/status

      const phone = phoneFromJid(jid);
      if (!phone) continue;

      try {
        await upsertLead({
          phone,
          name: msg.pushName || null,
          firstMessage: extractText(msg.message),
          ts: tsToMs(msg.messageTimestamp),
        });
      } catch (e) {
        console.error("[supabase] erro ao gravar lead:", e.message);
      }
    }
  });
}

start().catch((e) => {
  console.error("[fatal]", e);
  process.exit(1);
});
