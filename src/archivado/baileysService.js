const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");

const sesionesBaileys = new Map();
const estadosBaileys = new Map();

const getSesionPath = (bodaId) =>
  path.join(__dirname, "../sessions", `${bodaId}.json`);

// 👉 Iniciar o reutilizar sesión por boda
async function iniciarSesionBaileys(bodaId) {
  if (sesionesBaileys.has(bodaId)) {
    console.log(`🔁 Reutilizando sesión activa para boda ${bodaId}`);
    return sesionesBaileys.get(bodaId);
  }

  const sessionPath = getSesionPath(bodaId);
  const { state, saveState } = useSingleFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`🚀 Iniciando nueva sesión Baileys para boda ${bodaId}`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
  });

  sesionesBaileys.set(bodaId, sock);
  estadosBaileys.set(bodaId, "CONNECTED");

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;

      console.log(`❌ Sesión cerrada para boda ${bodaId} (code ${code}).`);
      estadosBaileys.set(bodaId, "DISCONNECTED");
      sesionesBaileys.delete(bodaId);

      if (shouldReconnect) {
        setTimeout(() => iniciarSesionBaileys(bodaId), 5000);
      }
    }

    if (connection === "open") {
      console.log(`✅ Sesión conectada para boda ${bodaId}`);
      estadosBaileys.set(bodaId, "CONNECTED");
    }
  });

  return sock;
}

// 📩 Enviar mensaje
async function enviarMensaje(telefono, mensaje, bodaId) {
  const sock = await iniciarSesionBaileys(bodaId);
  const numeroConPrefijo = `34${telefono}@s.whatsapp.net`;

  await sock.sendMessage(numeroConPrefijo, { text: mensaje });
  console.log(`✅ Mensaje enviado a ${telefono}`);
}

// 📡 Obtener estado actual
function obtenerEstado(bodaId) {
  return estadosBaileys.get(bodaId) || "NO_CONECTADA";
}

module.exports = {
  iniciarSesionBaileys,
  enviarMensaje,
  obtenerEstado,
};
