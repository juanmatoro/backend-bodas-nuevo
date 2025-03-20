const express = require("express");
const { obtenerEstadisticasBoda } = require("../controllers/statsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Obtener estadísticas de la boda
router.get(
  "/boda",
  authMiddleware(["admin", "novio", "novia"]),
  obtenerEstadisticasBoda
);

module.exports = router;
