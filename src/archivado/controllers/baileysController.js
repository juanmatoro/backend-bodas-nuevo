const {
  iniciarSesionBaileys,
  enviarMensaje,
  obtenerEstado,
} = require("../services/baileysService");

const startSession = async (req, res) => {
  const { bodaId } = req.body;
  if (!bodaId) return res.status(400).json({ error: "Falta bodaId" });

  try {
    await iniciarSesionBaileys(bodaId);
    res.json({ success: true, message: "Sesión iniciada" });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { telefono, mensaje, bodaId } = req.body;
  if (!telefono || !mensaje || !bodaId) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    await enviarMensaje(telefono, mensaje, bodaId);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({ error: error.message });
  }
};

const getStatus = (req, res) => {
  const { bodaId } = req.query;
  if (!bodaId) return res.status(400).json({ error: "Falta bodaId" });

  const estado = obtenerEstado(bodaId);
  res.json({ estado });
};

module.exports = {
  startSession,
  sendMessage,
  getStatus,
};
