const express = require("express");
const {
  startSession,
  closeSession,
  getSessionStatus,
  sendMessage,
  sendBroadcastMessage,
  scheduleMessage,
} = require("../controllers/whatsappController");

const router = express.Router();

// Ruta para iniciar sesión en WhatsApp
router.post("/start", startSession);

// Ruta para cerrar sesión en WhatsApp
router.post("/close", closeSession);

// Ruta para obtener el estado de la sesión de WhatsApp
router.get("/status", getSessionStatus);

// Ruta para enviar un mensaje directo
router.post("/send", sendMessage);

// Ruta para programar un mensaje
router.post("/schedule", scheduleMessage);

// Ruta para enviar un mensaje a una lista de difusión
router.post("/broadcast", sendBroadcastMessage);

module.exports = router;
