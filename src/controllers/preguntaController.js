const Question = require("../models/Question");
const Guest = require("../models/Guest");

// 📌 Crear nueva pregunta y asignarla a invitados que cumplan el filtro
const crearPregunta = async (req, res) => {
  try {
    const {
      bodaId,
      pregunta,
      opciones,
      esObligatoria = false,
      esConfirmacionAsistencia = false,
      filtros = {},
    } = req.body;

    if (
      !bodaId ||
      !pregunta ||
      !Array.isArray(opciones) ||
      opciones.length < 2
    ) {
      return res
        .status(400)
        .json({ message: "Datos incompletos o inválidos." });
    }

    const nuevaPregunta = new Question({
      bodaId,
      pregunta,
      opciones,
      esObligatoria,
      esConfirmacionAsistencia,
      filtros,
    });

    await nuevaPregunta.save();

    // 🔎 Filtrar invitados que cumplan los filtros (o todos si no hay filtros)
    const filtroInvitados = { bodaId, ...filtros };

    const invitados = await Guest.find(filtroInvitados);

    // No se guarda la relación en la pregunta, pero podrías notificar por WhatsApp aquí

    res.status(201).json({
      message: `Pregunta creada y asignada a ${invitados.length} invitado(s).`,
      question: nuevaPregunta,
    });
  } catch (error) {
    console.error("❌ Error al crear pregunta:", error);
    res.status(500).json({ message: "Error al crear la pregunta", error });
  }
};

// 📌 Obtener todas las preguntas de una boda
const obtenerPreguntasPorBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;
    const preguntas = await Question.find({ bodaId });
    res.status(200).json(preguntas);
  } catch (error) {
    console.error("❌ Error al obtener preguntas:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Eliminar una pregunta
const eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Pregunta no encontrada." });

    res.status(200).json({ message: "Pregunta eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar pregunta:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

//📌 Editar preguntas
const editarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, opciones, esObligatoria, esConfirmacionAsistencia } =
      req.body;

    const pregunta = await Pregunta.findByIdAndUpdate(
      id,
      { texto, opciones, esObligatoria, esConfirmacionAsistencia },
      { new: true }
    );

    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    res.json(pregunta);
  } catch (error) {
    console.error("Error al editar la pregunta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  crearPregunta,
  obtenerPreguntasPorBoda,
  eliminarPregunta,
  editarPregunta,
};
