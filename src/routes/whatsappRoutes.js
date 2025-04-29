const express = require("express");
const {
  startSession,
  startSessionFromFrontend,

  closeSession,
  getSessionStatus,
  sendMessage,
  sendBroadcastMessage,
  scheduleMessage,
} = require("../controllers/watssappController");
const primerContactoController = require("../controllers/primerContactoController");

const router = express.Router();

// Ruta para iniciar sesión en WhatsApp
router.post("/start", startSession);

// Ruta para iniciar sesión desde el frontend
router.post("/start-session", startSessionFromFrontend);

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

// Ruta para enviar un mensaje de primer contacto
router.post("/primer-contacto", primerContactoController.enviarPrimerContacto);

module.exports = router;
