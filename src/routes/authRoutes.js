const express = require("express");
const {
  loginUser,
  generarMagicLink,
  validarMagicLink,
  cambiarPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Login para Admin / Novio / Novia
router.post("/login", loginUser);

// 📌 Ruta para cambiar contraseña (protegida)
router.post(
  "/cambiar-password",
  authMiddleware(["admin", "novio", "novia"]),
  cambiarPassword
);

// 📌 Generar Enlace Mágico para Invitados
router.post("/magic-link", generarMagicLink);

// 📌 Validar Enlace Mágico
router.get("/magic-login", validarMagicLink);

module.exports = router;
