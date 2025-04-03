const {
  iniciarSesionWhatsApp,
  enviarMensaje,
} = require("../services/whatsappService");
const BroadcastList = require("../models/BroadcastList");
const Guest = require("../models/Guest");

// Iniciar sesión desde backend (uso interno o admin)
const startSession = async (req, res) => {
  const { bodaId } = req.body;

  try {
    const client = await iniciarSesionWhatsApp(bodaId);
    res
      .status(200)
      .json({
        success: true,
        message: "Sesión iniciada",
        clientInfo: !!client,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error iniciando sesión",
        error: error.message,
      });
  }
};

// Iniciar sesión desde frontend (por botón)
const startSessionFromFrontend = async (req, res) => {
  const { bodaId } = req.body;

  try {
    const client = await iniciarSesionWhatsApp(bodaId);
    res
      .status(200)
      .json({
        success: true,
        message: "Sesión iniciada correctamente desde el frontend",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "No se pudo iniciar la sesión",
        error: error.message,
      });
  }
};

// Cerrar sesión manualmente
const closeSession = async (req, res) => {
  const { bodaId } = req.body;

  try {
    // Aquí podrías implementar una función específica si quieres cerrar y borrar la sesión
    res
      .status(501)
      .json({ success: false, message: "Cerrar sesión aún no implementado" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error cerrando sesión",
        error: error.message,
      });
  }
};

// Estado de la sesión (revisar si está activa)
const getSessionStatus = async (req, res) => {
  const { bodaId } = req.query;

  try {
    const client = await iniciarSesionWhatsApp(bodaId); // Esto intenta levantar o usar la sesión
    const estado = await client.getConnectionState();

    res.status(200).json({ success: true, estado });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error obteniendo estado",
        error: error.message,
      });
  }
};

// Enviar mensaje directo
const sendMessage = async (req, res) => {
  const { telefono, mensaje, bodaId } = req.body;

  try {
    const enviado = await enviarMensaje(telefono, mensaje, bodaId);
    res.status(200).json({ success: true, enviado });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error enviando mensaje",
        error: error.message,
      });
  }
};

// Enviar mensaje por lista de difusión
const sendBroadcastMessage = async (req, res) => {
  const { listaId, mensaje, bodaId } = req.body;

  try {
    const lista = await BroadcastList.findById(listaId).populate("invitados");

    if (!lista) {
      return res
        .status(404)
        .json({ success: false, message: "Lista no encontrada" });
    }

    const resultados = [];
    for (const invitado of lista.invitados) {
      if (invitado.telefono) {
        try {
          const r = await enviarMensaje(invitado.telefono, mensaje, bodaId);
          resultados.push({
            invitado: invitado._id,
            status: "enviado",
            resultado: r,
          });
        } catch (err) {
          resultados.push({
            invitado: invitado._id,
            status: "fallo",
            error: err.message,
          });
        }
      }
    }

    res.status(200).json({ success: true, resultados });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error en envío a lista",
        error: error.message,
      });
  }
};

// Programar mensaje (puede ir a una lista o grupo de invitados)
const scheduleMessage = async (req, res) => {
  const { invitados = [], mensaje, fechaEnvio, bodaId } = req.body;

  try {
    // Aquí solo simulamos programación. En producción deberías guardar esto en BD y usar un scheduler (como cron, agenda, etc.)
    console.log(
      `📅 Mensaje programado para ${fechaEnvio}: "${mensaje}" a ${invitados.length} invitados`
    );

    // Aquí podrías guardar la tarea en una colección de mensajes programados

    res
      .status(200)
      .json({
        success: true,
        message: "Mensaje programado",
        invitados,
        fechaEnvio,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error programando mensaje",
        error: error.message,
      });
  }
};

module.exports = {
  startSession,
  startSessionFromFrontend,
  closeSession,
  getSessionStatus,
  sendMessage,
  sendBroadcastMessage,
  scheduleMessage,
};
