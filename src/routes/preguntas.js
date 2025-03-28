const express = require("express");
const router = express.Router();
const preguntaController = require("../controllers/preguntaController");
const authMiddleware = require("../middlewares/authMiddleware");

// 📌 Crear pregunta (novio, novia o admin)
router.post(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  preguntaController.crearPregunta
);

// 📌 Obtener preguntas de una boda
router.get(
  "/boda/:bodaId",
  authMiddleware(["novio", "novia", "admin"]),
  preguntaController.obtenerPreguntasPorBoda
);

// 📌 Eliminar pregunta
router.delete(
  "/preguntas/:id",
  authMiddleware(["novio", "novia", "admin"]),
  preguntaController.eliminarPregunta
);

router.put(
  "/preguntas/:id",
  authMiddleware(["novio", "novia", "admin"]),
  preguntaController.editarPregunta
);

module.exports = router;
