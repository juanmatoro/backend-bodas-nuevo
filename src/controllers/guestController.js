const { mongo } = require("mongoose");
const Guest = require("../models/Guest");
const normalizationUtils = require("../utils/normalization");
const { generateShortId } = require("../utils/shortIdUtils");
const multer = require("multer");
const { parseExcelFile } = require("../services/excelService");
const { default: mongoose } = require("mongoose");

// 📌 Obtener invitados de una boda
exports.obtenerInvitados = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bodaId = req.user.bodaId;

    const skip = (page - 1) * limit;
    const invitados = await Guest.find({ bodaId })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Guest.countDocuments({ bodaId });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      invitados: Array.isArray(invitados) ? invitados : [], // 📌 Asegurar siempre un array
    });
  } catch (error) {
    console.error("❌ Error en obtenerInvitados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener invitados", invitados: [] });
  }
};

// 📌 Obtener un invitado por ID
exports.obtenerInvitado = async (req, res) => {
  try {
    console.log("🔍 Buscando invitado con ID:", req.params.id); // 👀 Debug
    const invitado = await Guest.findById(req.params.id); // ✅ findById espera solo el ID

    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    res.json(invitado);
  } catch (error) {
    console.error("❌ Error en obtenerInvitado:", error);
    res.status(500).json({ message: "Error al obtener invitado" });
  }
};

// 📌 Crear invitado (solo novios/admin)
exports.crearInvitado = async (req, res) => {
  try {
    const { nombre, telefono, invitadoDe } = req.body;
    const { bodaId } = req.user;

    if (!bodaId) {
      return res.status(403).json({ message: "Acceso no autorizado." });
    }

    if (!nombre || !telefono || !invitadoDe) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const telefonoNormalizado = telefono.toString().trim();

    const existingGuest = await Guest.findOne({
      telefono: telefonoNormalizado,
      bodaId,
    });

    if (existingGuest) {
      return res
        .status(400)
        .json({ message: "El invitado ya existe en esta boda." });
    }

    const newGuest = await Guest.create({
      nombre,
      nombreNormalizado: normalizationUtils.normalizeName(nombre),
      telefono: telefonoNormalizado,
      invitadoDe,
      bodaId,
      shortId: generateShortId(),
    });

    res.status(201).json({
      message: "Invitado agregado correctamente.",
      guest: newGuest,
    });
  } catch (error) {
    console.error("❌ Error en crearInvitado:", error);
    res.status(500).json({ message: "Error al crear invitado" });
  }
};

// 📌 Actualizar invitado (solo novios/admin)
exports.actualizarInvitado = async (req, res) => {
  try {
    const invitado = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(invitado);
  } catch (error) {
    console.error("❌ Error en actualizarInvitado:", error);
    res.status(500).json({ message: "Error al actualizar invitado" });
  }
};
// 📌 Eliminar un invitado
exports.eliminarInvitado = async (req, res) => {
  try {
    const { invitadoId } = req.params;
    const invitado = await Guest.findById(invitadoId);

    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    await Guest.findByIdAndDelete(invitadoId);
    res.json({ message: "Invitado eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarInvitado:", error);
    res.status(500).json({ message: "Error al eliminar el invitado" });
  }
};
// 📌 Reenviar enlace a invitado con problemas
exports.reenviarEnlace = async (req, res) => {
  try {
    const { telefono } = req.body;
    const { bodaId } = req.user; // 📌 Aquí nos aseguramos de obtener correctamente el bodaId

    if (!mongoose.Types.ObjectId.isValid(bodaId)) {
      return res.status(400).json({ message: "ID de boda no válido." });
    }

    const guest = await Guest.findOne({
      telefono,
      bodaId: new mongoose.Types.ObjectId(bodaId),
    });

    if (!guest) {
      return res.status(404).json({ message: "Invitado no encontrado." });
    }

    const magicLink = generateMagicLink(guest._id, telefono);
    const mensaje = `Hola *${guest.nombre}*, accede a tu área personal usando el siguiente enlace:\n\n 👉 [🔗 Haz clic aquí](${magicLink})`;

    await enviarMensaje(bodaId, telefono, mensaje);

    res.json({ message: "Enlace mágico enviado correctamente.", magicLink });
  } catch (error) {
    console.error("❌ Error enviando enlace mágico:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el enlace mágico", error });
  }
};

// 📌 Configuración de `multer` para manejar archivos
const upload = multer({ dest: "uploads/" });

// 📌 Cargar invitados desde un archivo Excel (solo novios/admin)
exports.cargarInvitadosDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debe subir un archivo válido." });
    }

    const { bodaId } = req.user;
    if (!bodaId) {
      return res.status(403).json({ message: "Acceso no autorizado." });
    }

    console.log("📂 Archivo recibido:", req.file);
    console.log("📂 Nombre original:", req.file.originalname);
    console.log("📂 Ruta en el servidor:", req.file.path);
    console.log("📌 Usuario autenticado:", req.user);
    console.log("📌 Boda asociada:", bodaId);

    // 📌 Pasar `originalname` para asegurar la extensión correcta
    const invitados = await parseExcelFile(
      req.file.path,
      req.file.originalname
    );

    if (!Array.isArray(invitados) || invitados.length === 0) {
      return res
        .status(400)
        .json({ message: "El archivo está vacío o no tiene formato válido." });
    }

    console.log("📌 Invitados a procesar:", invitados);

    const invitadosGuardados = [];

    for (const invitado of invitados) {
      // 📌 Normalizar claves del Excel para evitar errores de mayúsculas
      const nombre = invitado["Nombre"] || invitado["nombre"];
      const telefono = invitado["Teléfono"] || invitado["telefono"];
      const invitadoDe = invitado["Invitado De"] || invitado["invitadoDe"];

      console.log("🔍 Procesando invitado:", { nombre, telefono, invitadoDe });

      if (!nombre || !telefono || !["Novio", "Novia"].includes(invitadoDe)) {
        console.warn(
          "⚠️ Invitado con datos incompletos o inválidos, ignorado:",
          { nombre, telefono, invitadoDe }
        );
        continue;
      }

      const telefonoNormalizado = telefono.toString().trim();

      // 📌 Verificar si el invitado ya existe en la boda
      const existingGuest = await Guest.findOne({
        telefono: telefonoNormalizado,
        bodaId,
      });

      if (!existingGuest) {
        const newGuest = await Guest.create({
          nombre,
          nombreNormalizado: normalizationUtils.normalizeName(nombre),
          telefono: telefonoNormalizado,
          invitadoDe,
          bodaId,
          shortId: generateShortId(),
        });

        invitadosGuardados.push(newGuest);
      } else {
        console.log("⚠️ Invitado ya existe:", existingGuest.nombre);
      }
    }

    res.status(201).json({
      message: `Se agregaron ${invitadosGuardados.length} invitados.`,
      invitados: invitadosGuardados,
    });
  } catch (error) {
    console.error("❌ Error en cargarInvitadosDesdeExcel:", error);
    res.status(500).json({ message: "Error al procesar el archivo." });
  }
};
