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
router.put(
  "/:id",
  authMiddleware(["admin", "novio", "novia"]),
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

module.exports = router;
