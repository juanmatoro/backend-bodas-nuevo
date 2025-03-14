const Photo = require("../models/Photo");
const Guest = require("../models/Guest");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// 📌 Directorio de almacenamiento
const UPLOADS_DIR = path.join(__dirname, "../uploads/photos/");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 📌 Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Subir Foto (con validación de límite)
exports.subirFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    let bodaId, uploadedBy, uploadedByType, maxFotos;

    if (req.user) {
      bodaId = req.user.bodaId;
      uploadedBy = req.user._id;
      uploadedByType = "user";
    } else if (req.guest) {
      bodaId = req.guest.bodaId;
      uploadedBy = req.guest._id;
      uploadedByType = "guest";

      // 📌 Obtener el límite de fotos del invitado
      const guest = await Guest.findById(uploadedBy);
      if (!guest)
        return res.status(404).json({ message: "Invitado no encontrado" });

      maxFotos = guest.maxFotos;

      // 📌 Contar fotos subidas por el invitado
      const fotosSubidas = await Photo.countDocuments({ bodaId, uploadedBy });
      if (fotosSubidas >= maxFotos) {
        return res
          .status(400)
          .json({ message: `Has alcanzado tu límite de ${maxFotos} fotos.` });
      }
    } else {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const fileName = `photo-${Date.now()}.webp`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // 📌 Optimizar imagen con Sharp
    await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: "inside" })
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(filePath);

    // 📌 Guardar en la base de datos
    const nuevaFoto = new Photo({
      bodaId,
      imageUrl: `/uploads/photos/${fileName}`,
      uploadedBy,
      uploadedByType,
    });

    await nuevaFoto.save();
    res
      .status(201)
      .json({ message: "Foto subida correctamente", photo: nuevaFoto });
  } catch (error) {
    console.error("❌ Error en subirFoto:", error);
    res.status(500).json({ message: "Error al subir la foto" });
  }
};

// 📌 Obtener todas las fotos de una boda
exports.obtenerFotosBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;
    const fotos = await Photo.find({ bodaId });

    res.json(fotos);
  } catch (error) {
    console.error("❌ Error en obtenerFotosBoda:", error);
    res.status(500).json({ message: "Error al obtener las fotos" });
  }
};

// 📌 Obtener las fotos de un invitado específico
exports.obtenerFotosInvitado = async (req, res) => {
  try {
    if (!req.guest) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const fotos = await Photo.find({ uploadedBy: req.guest._id });
    res.json(fotos);
  } catch (error) {
    console.error("❌ Error en obtenerFotosInvitado:", error);
    res.status(500).json({ message: "Error al obtener las fotos" });
  }
};

// 📌 Eliminar una foto (solo si el usuario es el propietario)
exports.eliminarFoto = async (req, res) => {
  try {
    const { fotoId } = req.params;
    const foto = await Photo.findById(fotoId);

    if (!foto) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    if (req.guest && foto.uploadedBy.toString() !== req.guest._id.toString()) {
      return res
        .status(403)
        .json({ message: "No puedes eliminar fotos de otros usuarios." });
    }

    if (
      req.user &&
      req.user.tipoUsuario !== "admin" &&
      foto.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "No puedes eliminar fotos de otros usuarios." });
    }

    // 📌 Eliminar el archivo de la carpeta
    const filePath = path.join(UPLOADS_DIR, path.basename(foto.imageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 📌 Eliminar de la base de datos
    await Photo.findByIdAndDelete(fotoId);

    res.json({ message: "Foto eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarFoto:", error);
    res.status(500).json({ message: "Error al eliminar la foto" });
  }
};
