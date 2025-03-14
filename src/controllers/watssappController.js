const {
  iniciarWhatsApp,
  cerrarWhatsApp,
  estadoWhatsApp,
  enviarMensaje,
  enviarMensajeBroadcast,
} = require("../services/whatsappService");

// Iniciar la sesión de WhatsApp
const startSession = async (req, res) => {
  try {
    await iniciarWhatsApp();
    res.json({
      success: true,
      message: "Sesión de WhatsApp iniciada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión de WhatsApp:", error);
    res.status(500).json({
      success: false,
      error: "Error al iniciar la sesión de WhatsApp.",
    });
  }
};

// Cerrar la sesión de WhatsApp
const closeSession = async (req, res) => {
  try {
    await cerrarWhatsApp();
    res.json({
      success: true,
      message: "Sesión de WhatsApp cerrada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al cerrar la sesión de WhatsApp:", error);
    res.status(500).json({
      success: false,
      error: "Error al cerrar la sesión de WhatsApp.",
    });
  }
};

// Verificar el estado de la sesión de WhatsApp
const getSessionStatus = async (req, res) => {
  try {
    const status = await estadoWhatsApp();
    res.json({ success: true, status });
  } catch (error) {
    console.error(
      "❌ Error al obtener el estado de la sesión de WhatsApp:",
      error
    );
    res.status(500).json({
      success: false,
      error: "Error al obtener el estado de la sesión de WhatsApp.",
    });
  }
};

// Enviar mensaje directo
const sendMessage = async (req, res) => {
  try {
    const { telefono, mensaje } = req.body;
    const response = await enviarMensaje(telefono, mensaje);
    res.json(response);
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({
      success: false,
      error: "Error al enviar el mensaje.",
    });
  }
};

// Enviar mensaje a lista de difusión
const sendBroadcastMessage = async (req, res) => {
  try {
    const { nombreLista, mensaje } = req.body;
    console.log("📨 Datos recibidos en la solicitud:");
    console.log("Nombre de la Lista:", nombreLista);
    console.log("Mensaje:", mensaje);
    console.log("📦 req.body completo:", req.body);

    if (
      !nombreLista ||
      typeof nombreLista !== "string" ||
      nombreLista.trim() === ""
    ) {
      console.error("❌ El nombre de la lista de difusión no es válido.");
      return res.status(400).json({
        success: false,
        error:
          "El nombre de la lista de difusión es requerido y debe ser un texto válido.",
      });
    }

    const response = await enviarMensajeBroadcast(nombreLista, mensaje);
    res.json(response);
  } catch (error) {
    console.error("❌ Error al enviar mensaje a la lista de difusión:", error);
    res.status(500).json({
      success: false,
      error: "Error al enviar el mensaje a la lista de difusión.",
    });
  }
};

// 🔹 Programar un mensaje
const scheduleMessage = async (req, res) => {
  try {
    const { telefono, mensaje, fechaEnvio } = req.body;
    const response = await programarMensaje(telefono, mensaje, fechaEnvio);
    res.json(response);
  } catch (error) {
    console.error("❌ Error al programar mensaje:", error);
    res.status(500).json({
      success: false,
      error: "Error al programar el mensaje.",
    });
  }
};

module.exports = {
  startSession,
  closeSession,
  getSessionStatus,
  sendMessage,
  sendBroadcastMessage,
  scheduleMessage,
};
