const venom = require("venom-bot");
const BroadcastList = require("../models/BroadcastList");
const Boda = require("../models/Boda");
const User = require("../models/User");

let sesionesWhatsApp = {}; // 📌 Almacena sesiones activas por `bodaId`

const iniciarSesionWhatsApp = async (bodaId) => {
  if (sesionesWhatsApp[bodaId]) {
    console.log(`📲 Sesión ya iniciada para la boda ${bodaId}.`);
    return sesionesWhatsApp[bodaId];
  }

  const boda = await Boda.findById(bodaId);
  if (!boda || !boda.whatsappNumber) {
    throw new Error(
      `❌ No se encontró un número de WhatsApp para la boda ${bodaId}`
    );
  }

  console.log(
    `🚀 Iniciando sesión de WhatsApp con el número ${boda.whatsappNumber}...`
  );

  sesionesWhatsApp[bodaId] = await venom.create(
    `boda-${bodaId}`,
    (qrCode) => {
      console.log(`📲 Escanea este código QR en WhatsApp: ${qrCode}`);
    },
    async (statusSession) => {
      console.log(
        `🟢 Estado de la sesión de la boda ${bodaId}:`,
        statusSession
      );
      if (statusSession === "disconnected" || statusSession === "notLogged") {
        console.log(`⚠️ Sesión cerrada para la boda ${bodaId}.`);
        await Boda.findByIdAndUpdate(bodaId, { whatsappSession: null });
        cerrarWhatsApp(bodaId);
      } else {
        await Boda.findByIdAndUpdate(bodaId, {
          whatsappSession: `boda-${bodaId}`,
        });
      }
    },
    {
      headless: false,
      useChrome: true,
      autoClose: false,
      disableSpins: true,
      logQR: true,
    }
  );

  console.log(`✅ Venom Bot iniciado para la boda ${bodaId}.`);
  return sesionesWhatsApp[bodaId];
};

// 🔹 Obtener el teléfono del `novio` o `novia` de la boda
const obtenerTelefonoDeBoda = async (bodaId) => {
  try {
    const boda = await Boda.findById(bodaId).populate("novios");
    if (!boda || !boda.novios.length) {
      throw new Error("❌ No se encontró un `novio` o `novia` para esta boda.");
    }

    // 📌 Selecciona el primer `novio` o `novia` con número de WhatsApp
    const usuarioWhatsApp = boda.novios.find((novio) => novio.telefono);
    if (!usuarioWhatsApp) {
      throw new Error(
        "❌ Ningún `novio` o `novia` tiene un número de WhatsApp registrado."
      );
    }

    return usuarioWhatsApp.telefono;
  } catch (error) {
    console.error("❌ Error obteniendo teléfono de la boda:", error);
    return null;
  }
};

// 🔹 Enviar mensaje desde la sesión de WhatsApp de la boda
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const enviarMensaje = async (bodaId, telefonoDestino, mensaje) => {
  try {
    if (!sesionesWhatsApp[bodaId]) {
      console.log(
        `⚠️ Sesión de WhatsApp no encontrada para la boda ${bodaId}. Iniciando...`
      );
      await iniciarSesionWhatsApp(bodaId);
    }

    console.log(
      `📨 Enviando mensaje a ${telefonoDestino} desde la boda ${bodaId}...`
    );

    await delay(2000); // ⏳ Esperar 2 segundos antes de enviar cada mensaje

    await sesionesWhatsApp[bodaId].sendText(`${telefonoDestino}@c.us`, mensaje);
    console.log(`✅ Mensaje enviado a ${telefonoDestino}`);

    return { success: true, message: `Mensaje enviado a ${telefonoDestino}` };
  } catch (error) {
    console.error(`❌ Error enviando mensaje a ${telefonoDestino}:`, error);
    return { success: false, error: error.message };
  }
};
// 🔹 Cambiar el número de WhatsApp de la boda
const cambiarNumeroWhatsApp = async (bodaId, nuevoNumero) => {
  await cerrarWhatsApp(bodaId);
  await Boda.findByIdAndUpdate(bodaId, {
    whatsappNumber: nuevoNumero,
    whatsappSession: null,
  });
  console.log(
    `🔄 Número de WhatsApp cambiado a ${nuevoNumero} para la boda ${bodaId}.`
  );
  return { success: true, message: "Número de WhatsApp actualizado." };
};

// 🔹 Enviar mensaje a una lista de difusión desde la sesión de la boda
const enviarMensajeBroadcast = async (bodaId, nombreLista, mensaje) => {
  try {
    if (!sesionesWhatsApp[bodaId]) {
      console.log(
        `⚠️ Sesión de la boda ${bodaId} no encontrada. Iniciando sesión...`
      );
      await iniciarSesionWhatsApp(bodaId);
    }

    console.log(`🔍 Buscando la lista de difusión '${nombreLista}'...`);
    const listaDB = await BroadcastList.findOne({ nombre: nombreLista }).exec();
    if (!listaDB) {
      throw new Error(`❌ Lista de difusión '${nombreLista}' no encontrada.`);
    }

    const telefonos = listaDB.invitados.map((inv) => inv.telefono);
    console.log(`📦 Enviando mensaje a la lista '${nombreLista}':`, telefonos);

    for (const telefonoDestino of telefonos) {
      try {
        await sesionesWhatsApp[bodaId].sendText(
          `${telefonoDestino}@c.us`,
          mensaje
        );
        console.log(`✅ Mensaje enviado a ${telefonoDestino}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Pausa de 1 segundo entre envíos
      } catch (error) {
        console.error(
          `❌ Error enviando mensaje a ${telefonoDestino}:`,
          error.message
        );
      }
    }

    return {
      success: true,
      message: `Mensaje enviado a la lista '${nombreLista}'.`,
    };
  } catch (error) {
    console.error(
      `❌ Error enviando mensaje a la lista '${nombreLista}':`,
      error
    );
    return { success: false, error: error.message };
  }
};

// 🔹 Cerrar sesión en WhatsApp de una boda
const cerrarWhatsApp = async (bodaId) => {
  if (sesionesWhatsApp[bodaId]) {
    await sesionesWhatsApp[bodaId].close();
    console.log(`🛑 Venom Bot cerrado para la boda ${bodaId}.`);
    delete sesionesWhatsApp[bodaId];
  } else {
    console.log(`⚠️ No hay sesión activa para la boda ${bodaId}.`);
  }
};

// 🔹 Obtener estado de la sesión de la boda
const estadoWhatsApp = (bodaId) => {
  return sesionesWhatsApp[bodaId] ? "Sesión activa" : "Sesión no iniciada";
};

/* // 🔹 Monitorear y reiniciar sesiones automáticamente
const monitorearSesionesWhatsApp = async () => {
  console.log("🔍 Monitoreando sesiones de WhatsApp activas...");
  const bodasConSesion = await Boda.find({ whatsappSession: { $ne: null } });

  for (const boda of bodasConSesion) {
    const estado = await sesionesWhatsApp[boda._id]?.isConnected();
    if (!estado) {
      console.log(`⚠️ Sesión de la boda ${boda._id} desconectada. Reiniciando...`);
      await iniciarSesionWhatsApp(boda._id);
    }
  }
}; */

module.exports = {
  iniciarSesionWhatsApp,
  cambiarNumeroWhatsApp,
  obtenerTelefonoDeBoda,
  cerrarWhatsApp,
  estadoWhatsApp,
  enviarMensaje,
  enviarMensajeBroadcast,
};
