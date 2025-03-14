const { mongo } = require("mongoose");
const Guest = require("../models/Guest");
const normalizationUtils = require("../utils/normalization");
const { generateShortId } = require("../utils/shortIdUtils");
const { default: mongoose } = require("mongoose");

// 📌 Obtener invitados de una boda
exports.obtenerInvitados = async (req, res) => {
  try {
    const invitados = await Guest.find({ bodaId: req.user.bodaId });
    res.json(invitados);
  } catch (error) {
    console.error("❌ Error en obtenerInvitados:", error);
    res.status(500).json({ message: "Error al obtener invitados" });
  }
};

// 📌 Obtener un invitado por ID
exports.obtenerInvitado = async (req, res) => {
  try {
    const invitado = await Guest.findById(req.params.id);
    if (!invitado)
      return res.status(404).json({ message: "Invitado no encontrado" });

    res.json(invitado);
  } catch (error) {
    console.error("❌ Error en obtenerInvitado:", error);
    res.status(500).json({ message: "Error al obtener invitado" });
  }
};
// Función para normalizar textos (sin acentos, minúsculas)
/* const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}; */
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
