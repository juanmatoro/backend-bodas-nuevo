const { Question, Response } = require("../models/FormModels");

// 📌 Crear una nueva pregunta personalizada
const createQuestion = async (req, res) => {
  try {
    const { bodaId, pregunta, opciones, esObligatoria } = req.body;

    if (!bodaId || !pregunta) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const newQuestion = new Question({
      bodaId,
      pregunta,
      opciones,
      esObligatoria,
    });

    await newQuestion.save();
    res
      .status(201)
      .json({ message: "Pregunta creada con éxito.", question: newQuestion });
  } catch (error) {
    console.error("❌ Error al crear la pregunta:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener todas las preguntas de una boda
const getQuestionsByBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;
    if (!bodaId)
      return res.status(400).json({ message: "BodaId es requerido." });

    const questions = await Question.find({ bodaId });
    res.status(200).json(questions);
  } catch (error) {
    console.error("❌ Error al obtener preguntas:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Editar una pregunta
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { pregunta, opciones, esObligatoria } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { pregunta, opciones, esObligatoria },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    res.status(200).json({
      message: "Pregunta actualizada con éxito.",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("❌ Error al actualizar pregunta:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Eliminar una pregunta
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    res.status(200).json({ message: "Pregunta eliminada con éxito." });
  } catch (error) {
    console.error("❌ Error al eliminar pregunta:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Guardar la respuesta de un invitado
const saveResponse = async (req, res) => {
  try {
    const { invitadoId, preguntaId, respuesta } = req.body;

    if (!invitadoId || !preguntaId || !respuesta) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const newResponse = new Response({ invitadoId, preguntaId, respuesta });
    await newResponse.save();

    res.status(201).json({
      message: "Respuesta guardada con éxito.",
      response: newResponse,
    });
  } catch (error) {
    console.error("❌ Error al guardar respuesta:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

module.exports = {
  createQuestion,
  getQuestionsByBoda,
  updateQuestion,
  deleteQuestion,
  saveResponse,
};
