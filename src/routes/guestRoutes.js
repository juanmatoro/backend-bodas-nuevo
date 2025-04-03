const express = require("express");
const multer = require("multer");
const {
  obtenerInvitados,
  obtenerInvitado,
  crearInvitado,
  actualizarInvitado,
  eliminarInvitado,
  reenviarEnlace,
  cargarInvitadosDesdeExcel,
  asignarPreguntaAInvitados,
  filtrarInvitadosPorRespuesta,
  obtenerPreguntasAsignadas,
  guardarRespuestas,
} = require("../controllers/guestController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get(
  "/invitados/:bodaId",
  authMiddleware(["admin", "novio", "novia"]),
  obtenerInvitados
); // Listar invitados de una boda
router.get(
  "/:id",
  authMiddleware(["admin", "novio", "novia"]),
  obtenerInvitado
);
router.post("/", authMiddleware(["admin", "novio", "novia"]), crearInvitado);
router.patch(
  "/:id",
  authMiddleware(["admin", "novio", "novia", "guest"]),
  actualizarInvitado
);
router.delete(
  "/:id",
  authMiddleware(["admin", "novio", "novia"]),
  eliminarInvitado
);
router.post(
  "/reenviar-enlace/:id",
  authMiddleware(["admin", "novio", "novia"]),
  reenviarEnlace
); // Para invitados con problemas

router.post(
  "/cargar-excel",
  authMiddleware(["admin", "novio", "novia"]),
  upload.single("archivo"),
  cargarInvitadosDesdeExcel
);

router.post(
  "/asignar-pregunta",
  authMiddleware(["admin", "novio", "novia"]),
  asignarPreguntaAInvitados
);

router.post(
  "/filtrar-por-respuesta",
  authMiddleware(["admin", "novio", "novia"]),
  filtrarInvitadosPorRespuesta
);

router.get(
  "/:id/preguntas-asignadas",
  authMiddleware(["guest", "admin", "novio", "novia"]),
  obtenerPreguntasAsignadas
);

router.post(
  "/:id/responder",
  authMiddleware(["guest", "admin", "novio", "novia"]),
  guardarRespuestas
);

module.exports = router;
