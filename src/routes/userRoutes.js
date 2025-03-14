const express = require("express");
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware(["admin"]), obtenerUsuarios);
router.post("/", authMiddleware(["admin"]), crearUsuario);
router.get(
  "/:id",
  authMiddleware(["admin", "novio", "novia"]),
  obtenerUsuarioPorId
);
router.put(
  "/:id",
  authMiddleware(["admin", "novio", "novia"]),
  actualizarUsuario
);
router.delete("/:id", authMiddleware(["admin"]), eliminarUsuario);

module.exports = router;
