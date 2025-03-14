/* const express = require("express");
const {
  obtenerFormularios,
  responderFormulario,
} = require("../controllers/formController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Novios y Admin ven formularios
router.get(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  obtenerFormularios
);

// 📌 Invitados pueden responder
router.post("/:id/responder", authMiddleware(["guest"]), responderFormulario);

module.exports = router;
 */

const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

// 📌 Endpoints para la gestión de preguntas y respuestas
router.post("/questions", formController.createQuestion);
router.get("/questions/:bodaId", formController.getQuestionsByBoda);
router.put("/questions/:id", formController.updateQuestion);
router.delete("/questions/:id", formController.deleteQuestion);
router.post("/responses", formController.saveResponse);

module.exports = router;
