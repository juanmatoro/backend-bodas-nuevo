const Question = require("../models/Question");
const Guest = require("../models/Guest");

// 📌 Crear nueva pregunta (con posible subpregunta condicional)
const crearPregunta = async (req, res) => {
  try {
    const {
      bodaId,
      pregunta,
      opciones,
      esObligatoria = false,
      esConfirmacionAsistencia = false,
      subPregunta = null,
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
      subPregunta, // ✅ Se guarda como parte del modelo
    });

    await nuevaPregunta.save();

    // Opcional: aquí podrías notificar por WhatsApp a los invitados

    res.status(201).json({
      message: "Pregunta creada correctamente.",
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
// 📌 Actualizar pregunta (incluye subpregunta)
const editarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pregunta,
      opciones,
      esObligatoria,
      esConfirmacionAsistencia,
      subPregunta,
    } = req.body;

    // Validación mínima
    if (!pregunta || !Array.isArray(opciones) || opciones.length < 2) {
      return res
        .status(400)
        .json({ message: "Datos incompletos o inválidos." });
    }

    // Validar subpregunta si está presente
    if (
      subPregunta &&
      (!subPregunta.pregunta || !Array.isArray(subPregunta.opciones))
    ) {
      return res.status(400).json({ message: "Subpregunta inválida." });
    }

    const preguntaActualizada = await Question.findByIdAndUpdate(
      id,
      {
        pregunta,
        opciones,
        esObligatoria,
        esConfirmacionAsistencia,
        subPregunta: subPregunta || null, // Si no se envía, se borra
      },
      { new: true }
    );

    if (!preguntaActualizada) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    res.json({
      message: "Pregunta actualizada correctamente.",
      question: preguntaActualizada,
    });
  } catch (error) {
    console.error("❌ Error al actualizar pregunta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  crearPregunta,
  obtenerPreguntasPorBoda,
  eliminarPregunta,
  editarPregunta,
};
