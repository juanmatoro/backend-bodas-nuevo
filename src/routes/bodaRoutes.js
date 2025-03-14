const express = require("express");
const {
  obtenerBodas,
  obtenerBoda,
  crearBoda,
  actualizarBoda,
  eliminarBoda,
} = require("../controllers/bodaController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware(["admin"]), obtenerBodas); // Solo admin puede ver todas
router.get("/:id", authMiddleware(["admin", "novio", "novia"]), obtenerBoda); // Novios solo ven su boda
router.post("/", authMiddleware(["admin"]), crearBoda);
router.put("/:id", authMiddleware(["admin"]), actualizarBoda);
router.delete("/:id", authMiddleware(["admin"]), eliminarBoda);

module.exports = router;
