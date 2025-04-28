const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  crearPlantilla,
  obtenerPlantillas,
  eliminarPlantilla,
  editarPlantilla,
} = require("../controllers/messageTemplateController");

// Solo novios y admins
router.post("/", authMiddleware(["novio", "novia", "admin"]), crearPlantilla);
router.get("/", authMiddleware(["novio", "novia", "admin"]), obtenerPlantillas);
router.delete(
  "/:id",
  authMiddleware(["novio", "novia", "admin"]),
  eliminarPlantilla
);
router.put(
  "/:id",
  authMiddleware(["novio", "novia", "admin"]),
  editarPlantilla
);

module.exports = router;
