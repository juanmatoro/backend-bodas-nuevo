const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  subirFoto,
  obtenerFotosBoda,
  obtenerFotosInvitado,
  eliminarFoto,
} = require("../controllers/photoController");
const multer = require("multer");

// 📌 Configurar Multer para recibir archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authMiddleware(["admin", "novio", "novia", "guest"]),
  upload.single("photo"),
  subirFoto
);
router.get(
  "/:bodaId",
  authMiddleware(["admin", "novio", "novia"]),
  obtenerFotosBoda
);
router.get("/mis-fotos", authMiddleware(["guest"]), obtenerFotosInvitado);
router.delete(
  "/:fotoId",
  authMiddleware(["admin", "novio", "novia", "guest"]),
  eliminarFoto
);

module.exports = router;
