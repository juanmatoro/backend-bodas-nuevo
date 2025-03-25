const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const authMiddleware = require("../middlewares/authMiddleware");

// 📌 CRUD de Preguntas (Solo Admin o Novios)
router.post(
  "/questions",
  authMiddleware(["admin", "novio", "novia"]),
  formController.createQuestion
);
router.get(
  "/questions/:bodaId",
  authMiddleware(["admin", "novio", "novia"]),
  formController.getQuestionsByBoda
);
router.get(
  "/question/:id",
  authMiddleware(["admin", "novio", "novia"]),
  formController.getQuestionById
);
router.put(
  "/questions/:id",
  authMiddleware(["admin", "novio", "novia"]),
  formController.updateQuestion
);
router.delete(
  "/questions/:id",
  authMiddleware(["admin", "novio", "novia"]),
  formController.deleteQuestion
);

// 📌 CRUD de Formularios (Solo Admin o Novios pueden crearlos)
router.post(
  "/form",
  authMiddleware(["admin", "novio", "novia"]),
  formController.createForm
);

router.get(
  "/forms/:bodaId",
  authMiddleware(["admin", "novio", "novia"]),
  formController.getFormsByBoda
);
router.get(
  "/forms/:id",
  authMiddleware(["admin", "novio", "novia", "guest"]),
  formController.getFormById
);

router.delete(
  "/form/:id",
  authMiddleware(["admin", "novio", "novia"]),
  formController.deleteForm
);

router.put(
  "/form/:id",
  authMiddleware(["admin", "novio", "novia"]),
  formController.updateForm
);
// 📌 Guardar respuesta de un invitado (Solo Invitados)
router.post(
  "/responses",
  authMiddleware(["guest"]),
  formController.saveResponse
);

module.exports = router;
