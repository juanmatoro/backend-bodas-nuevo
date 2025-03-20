const Guest = require("../models/Guest");

// 📌 Obtener estadísticas de la boda
exports.obtenerEstadisticasBoda = async (req, res) => {
  try {
    const { bodaId } = req.user;

    if (!bodaId) {
      return res.status(400).json({ message: "Boda no encontrada." });
    }

    // Contar invitados en diferentes categorías
    const totalInvitados = await Guest.countDocuments({ bodaId });
    const confirmados = await Guest.countDocuments({
      bodaId,
      confirmacion: true,
    });
    const rechazados = await Guest.countDocuments({
      bodaId,
      confirmacion: false,
    });
    const pendientes = totalInvitados - confirmados - rechazados;

    // 📊 Obtener estadísticas de respuestas de formularios (ejemplo: menú elegido)
    const respuestas = await Guest.aggregate([
      { $match: { bodaId } },
      { $group: { _id: "$menu", count: { $sum: 1 } } }, // 📌 Ajustar campo según el modelo
    ]);

    res.json({
      totalInvitados,
      confirmados,
      rechazados,
      pendientes,
      respuestas, // Datos de formularios
    });
  } catch (error) {
    console.error("❌ Error en obtenerEstadisticasBoda:", error);
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
};
