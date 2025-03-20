/* const Form = require("../models/Form");
const { Question, Response } = require("../models/Form"); // 🛠️ Corrección aquí

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
// 📌 Actualizar una pregunta existente
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Buscando pregunta con id:", id);
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

// 📌 Crear un nuevo formulario para un invitado
const createForm = async (req, res) => {
  try {
    const { bodaId, invitadoId, preguntas } = req.body;

    if (!bodaId || !invitadoId || !preguntas.length) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const newForm = new Form({
      bodaId,
      enviadoA: invitadoId,
      preguntas,
      completado: false,
    });

    await newForm.save();
    res
      .status(201)
      .json({ message: "Formulario creado con éxito.", form: newForm });
  } catch (error) {
    console.error("❌ Error al crear el formulario:", error);
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

// 📌 Obtener todos los formularios de una boda
const getFormsByBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;

    if (!bodaId)
      return res.status(400).json({ message: "BodaId es requerido." });

    const forms = await Form.find({ bodaId }).populate(
      "enviadoA",
      "nombre telefono"
    );

    res.status(200).json(forms);
  } catch (error) {
    console.error("❌ Error al obtener formularios:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener un formulario por ID (para invitados)
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id).populate("preguntas.preguntaId");
    if (!form)
      return res.status(404).json({ message: "Formulario no encontrado." });

    res.status(200).json(form);
  } catch (error) {
    console.error("❌ Error al obtener formulario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Guardar respuesta de un invitado
const saveResponse = async (req, res) => {
  try {
    const { preguntaId, respuesta } = req.body;
    const invitadoId = req.user._id;

    if (!preguntaId || !respuesta) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // 📌 Validar que la pregunta existe
    const pregunta = await Question.findById(preguntaId);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    // 📌 Validar que la respuesta esté dentro de las opciones disponibles
    if (!pregunta.opciones.includes(respuesta)) {
      return res
        .status(400)
        .json({ message: "Respuesta no válida para esta pregunta." });
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
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("❌ Error al obtener la pregunta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  createQuestion,
  updateQuestion,
  getQuestionsByBoda,
  getQuestionById,
  deleteQuestion,
  createForm,
  getFormsByBoda,
  getFormById,
  saveResponse,
};
 */

import { Question, Response, Form } from "../models/Form.js";

// 📌 Crear una nueva pregunta personalizada
export const createQuestion = async (req, res) => {
  try {
    const { bodaId, pregunta, opciones, esObligatoria } = req.body;

    if (
      !bodaId ||
      !pregunta ||
      !Array.isArray(opciones) ||
      opciones.length < 2
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios o opciones inválidas." });
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

// 📌 Actualizar una pregunta existente
export const updateQuestion = async (req, res) => {
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

// 📌 Obtener todas las preguntas de una boda
export const getQuestionsByBoda = async (req, res) => {
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

// 📌 Obtener una pregunta por ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("❌ Error al obtener la pregunta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Eliminar una pregunta
export const deleteQuestion = async (req, res) => {
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

// 📌 Crear un nuevo formulario con preguntas seleccionadas y lista de invitados
export const createForm = async (req, res) => {
  try {
    const { bodaId, preguntas, invitados } = req.body;

    if (
      !bodaId ||
      !Array.isArray(preguntas) ||
      !preguntas.length ||
      !Array.isArray(invitados) ||
      !invitados.length
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios o formato inválido." });
    }

    const newForm = new Form({
      bodaId,
      preguntas,
      enviadosA: invitados,
      completado: false,
    });

    await newForm.save();
    res
      .status(201)
      .json({ message: "Formulario creado con éxito.", form: newForm });
  } catch (error) {
    console.error("❌ Error al crear el formulario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener todos los formularios de una boda
export const getFormsByBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;

    if (!bodaId)
      return res.status(400).json({ message: "BodaId es requerido." });

    const forms = await Form.find({ bodaId }).populate(
      "enviadosA",
      "nombre telefono"
    );

    res.status(200).json(forms);
  } catch (error) {
    console.error("❌ Error al obtener formularios:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener un formulario por ID para que el invitado lo responda
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id).populate("preguntas");
    if (!form)
      return res.status(404).json({ message: "Formulario no encontrado." });

    res.status(200).json(form);
  } catch (error) {
    console.error("❌ Error al obtener formulario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Guardar respuesta de un invitado
export const saveResponse = async (req, res) => {
  try {
    const { preguntaId, respuesta } = req.body;
    const invitadoId = req.user._id;

    if (!preguntaId || !respuesta) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const pregunta = await Question.findById(preguntaId);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    if (!pregunta.opciones.includes(respuesta)) {
      return res
        .status(400)
        .json({ message: "Respuesta no válida para esta pregunta." });
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
