const { create } = require("venom-bot");
const path = require("path");
const Boda = require("../models/Boda");

const sesionesWhatsApp = new Map();
const estadosSesion = new Map();

const iniciarSesionWhatsApp = async (bodaId) => {
  if (sesionesWhatsApp.has(bodaId)) {
    const cliente = sesionesWhatsApp.get(bodaId);
    const estado = await cliente.getConnectionState?.();
    if (estado === "CONNECTED") {
      console.log(`🔄 Sesión ya activa para boda ${bodaId}`);
      estadosSesion.set(bodaId, "CONNECTED");
      return cliente;
    }
  }

  console.log(`🚀 Iniciando nueva sesión para boda ${bodaId}`);
  estadosSesion.set(bodaId, "CONNECTING");

  const tokenPath = path.join("tokens", `${bodaId}.json`);

  try {
    const client = await create({
      session: `boda-${bodaId}`,
      multidevice: true,
      headless: false,
      folderNameToken: "tokens",
      browserSessionToken: tokenPath,
      disableWelcome: true,
      useChrome: true,
      puppeteerOptions: {
        headless: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-background-timer-throttling",
          "--disable-renderer-backgrounding",
          "--disable-backgrounding-occluded-windows",
          "--window-size=1280,800",
        ],
      },
    });

    sesionesWhatsApp.set(bodaId, client);
    estadosSesion.set(bodaId, "CONNECTED");

    if (typeof client.onStateChange === "function") {
      client.onStateChange((estado) => {
        console.log(`📶 Estado sesión boda ${bodaId}: ${estado}`);
        if (estado === "DISCONNECTED") {
          estadosSesion.set(bodaId, "DISCONNECTED");
        } else if (estado === "CONNECTED") {
          estadosSesion.set(bodaId, "CONNECTED");
        }
      });
    }

    if (typeof client.onClose === "function") {
      client.onClose(() => {
        console.log(`🔴 Sesión cerrada para boda ${bodaId}`);
        sesionesWhatsApp.delete(bodaId);
        estadosSesion.set(bodaId, "DISCONNECTED");
      });
    }

    return client;
  } catch (error) {
    console.error(`❌ Error iniciando sesión boda ${bodaId}:`, error);
    estadosSesion.set(bodaId, "ERROR");
    throw new Error("No se pudo iniciar la sesión de WhatsApp");
  }
};

// Enviar mensaje a un teléfono
async function enviarMensaje(telefono, mensaje, bodaId) {
  const client = await iniciarSesionWhatsApp(bodaId);
  const numeroConPrefijo = `34${telefono}@c.us`;

  try {
    const enviado = await client.sendText(numeroConPrefijo, mensaje);
    console.log(`✅ Mensaje enviado a ${telefono}`);
    return enviado;
  } catch (error) {
    console.error(`❌ Error al enviar mensaje a ${telefono}:`, error);
    throw new Error("No se pudo enviar el mensaje");
  }
}

module.exports = {
  iniciarSesionWhatsApp,
  enviarMensaje,
};
