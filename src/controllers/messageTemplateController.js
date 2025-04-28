const MessageTemplate = require("../models/MessageTemplate");

// 📌 Crear plantilla
exports.crearPlantilla = async (req, res) => {
  try {
    const { nombre, contenido } = req.body;
    const { bodaId, _id: creadorId } = req.user;

    const nueva = await MessageTemplate.create({
      nombre,
      contenido,
      bodaId,
      creadorId,
    });
    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear plantilla:", error);
    res.status(500).json({ message: "Error al crear plantilla" });
  }
};

// 📌 Obtener todas las plantillas de una boda
exports.obtenerPlantillas = async (req, res) => {
  try {
    const { bodaId } = req.user;
    const plantillas = await MessageTemplate.find({ bodaId });
    res.json(plantillas);
  } catch (error) {
    console.error("❌ Error al obtener plantillas:", error);
    res.status(500).json({ message: "Error al obtener plantillas" });
  }
};

// 📌 Eliminar plantilla
exports.eliminarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;
    await MessageTemplate.findByIdAndDelete(id);
    res.json({ message: "Plantilla eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar plantilla:", error);
    res.status(500).json({ message: "Error al eliminar plantilla" });
  }
};

// 📌 Actualizar plantilla
exports.editarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, contenido } = req.body;

    const plantilla = await MessageTemplate.findByIdAndUpdate(
      id,
      { nombre, contenido },
      { new: true }
    );

    res.json(plantilla);
  } catch (error) {
    console.error("❌ Error al actualizar plantilla:", error);
    res.status(500).json({ message: "Error al actualizar plantilla" });
  }
};
