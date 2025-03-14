const express = require("express");
const {
  enviarMensajeIndividual,
  enviarMensajeLista,
  programarMensaje,
  obtenerHistorialMensajes,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Admin y Novios pueden enviar mensajes
router.post(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  enviarMensajeIndividual
);

// 📌 Admin y Novios pueden programar mensajes
router.post(
  "/programar",
  authMiddleware(["novio", "novia", "admin"]),
  programarMensaje
);

// 📌 Admin y Novios pueden enviar mensajes a una list
router.post(
  "/lista",
  authMiddleware(["novio", "novia", "admin"]),
  enviarMensajeLista
);

// 📌 Admin y Novios pueden ver mensajes
router.get(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  obtenerHistorialMensajes
);

module.exports = router;
