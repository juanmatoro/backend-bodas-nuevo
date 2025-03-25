const express = require("express");
const {
  crearListaDifusion,
  obtenerListasDifusion,
  eliminarListaDifusion,
  agregarInvitadosALista,
  eliminarInvitadoDeLista,
  editarListaDifusion,
} = require("../controllers/broadcastListController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Admin y Novios pueden gestionar listas
router.get(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  obtenerListasDifusion
);
router.post(
  "/",
  authMiddleware(["novio", "novia", "admin"]),
  crearListaDifusion
);
router.delete(
  "/:id",
  authMiddleware(["novio", "novia", "admin"]),
  eliminarListaDifusion
);
router.put(
  "/agregar-invitados",
  authMiddleware(["novio", "novia", "admin"]),
  agregarInvitadosALista
);

router.put(
  "/eliminar-invitado",
  authMiddleware(["novio", "novia", "admin"]),
  eliminarInvitadoDeLista
);

router.put(
  "/:id",
  authMiddleware(["novio", "novia", "admin"]),
  editarListaDifusion
);

module.exports = router;
