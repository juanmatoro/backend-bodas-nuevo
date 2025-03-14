const express = require("express");
const {
  crearLista,
  obtenerListas,
  eliminarLista,
} = require("../controllers/broadcastListController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Admin y Novios pueden gestionar listas
router.get("/", authMiddleware(["novio", "novia", "admin"]), obtenerListas);
router.post("/", authMiddleware(["novio", "novia", "admin"]), crearLista);
router.delete(
  "/:id",
  authMiddleware(["novio", "novia", "admin"]),
  eliminarLista
);

module.exports = router;
