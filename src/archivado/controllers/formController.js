const { Guest } = require("../../models/Guest.js");
const { Question, Response, Form } = require("../models/Form.js");

// 📌 Crear una nueva pregunta personalizada
const createQuestion = async (req, res) => {
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

// 📌 Obtener una pregunta por ID
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

// 📌 Crear un nuevo formulario con preguntas seleccionadas y lista de invitados
/* export const createForm = async (req, res) => {
  try {
    console.log("🔍 Datos recibidos:", req.body);

    let { bodaId, enviadosA, preguntas } = req.body;

    if (
      !bodaId ||
      !Array.isArray(enviadosA) ||
      enviadosA.length === 0 ||
      !Array.isArray(preguntas) ||
      preguntas.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios o formato inválido." });
    }

    // 📌 Validar que los elementos en preguntas sean ObjectId y no objetos
    preguntas = preguntas.map((id) => id.toString()); // Convertir posibles objetos en strings

    const newForm = new Form({
      bodaId,
      enviadosA,
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
}; */

const createForm = async (req, res) => {
  try {
    console.log("🔍 Datos recibidos:", req.body);

    const { nombre, enviadosA, preguntas, bodaId } = req.body;

    if (
      !bodaId ||
      !Array.isArray(enviadosA) ||
      enviadosA.length === 0 ||
      !Array.isArray(preguntas) ||
      preguntas.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios o formato inválido." });
    }

    const nuevoFormulario = new Form({
      bodaId,
      nombre,
      enviadosA,
      preguntas,
      completado: false,
    });

    await nuevoFormulario.save();

    res.status(201).json({
      message: "✅ Formulario creado exitosamente.",
      formulario: nuevoFormulario,
    });
  } catch (error) {
    console.error("❌ Error en createForm:", error);
    res.status(500).json({ message: "Error al crear el formulario" });
  }
};

// 📌 Editar un formulario existente
const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, preguntas, enviadosA } = req.body;

    if (!nombre || !Array.isArray(preguntas) || !Array.isArray(enviadosA)) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { nombre, preguntas, enviadosA },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Formulario no encontrado." });
    }

    res.status(200).json({
      message: "✅ Formulario actualizado correctamente.",
      formulario: updatedForm,
    });
  } catch (error) {
    console.error("❌ Error al actualizar formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// 📌 Eliminar un formulario
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).json({ message: "Formulario no encontrado." });
    }

    res.status(200).json({ message: "✅ Formulario eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Obtener todos los formularios de una boda
const getFormsByBoda = async (req, res) => {
  try {
    const { bodaId } = req.params;

    if (!bodaId)
      return res.status(400).json({ message: "BodaId es requerido." });

    const forms = await Form.find({ bodaId })
      .populate("enviadosA", "nombre telefono")
      .populate("preguntas");

    res.status(200).json(forms);
  } catch (error) {
    console.error("❌ Error al obtener formularios:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener un formulario por ID para que el invitado lo responda
const getFormById = async (req, res) => {
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
/* export const saveResponse = async (req, res) => {
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
}; */

const saveResponse = async (req, res) => {
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

    // Guardar la respuesta
    const newResponse = new Response({ invitadoId, preguntaId, respuesta });
    await newResponse.save();

    // Lógica para detectar si es una pregunta de confirmación de asistencia
    const textoPregunta = pregunta.pregunta.toLowerCase();

    const esPreguntaAsistencia =
      textoPregunta.includes("asist") || // asistir, asistencia
      textoPregunta.includes("vas a venir") ||
      textoPregunta.includes("vendrás") ||
      textoPregunta.includes("confirmar");

    if (pregunta.esConfirmacionAsistencia) {
      const respuestaNormalizada = respuesta.toLowerCase();
      const confirmacion =
        respuestaNormalizada === "sí" || respuestaNormalizada === "si"
          ? true
          : respuestaNormalizada === "no"
          ? false
          : null;

      if (confirmacion !== null) {
        await Guest.findByIdAndUpdate(invitadoId, { confirmacion });
      }
    }

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
  updateQuestion,
  getQuestionsByBoda,
  getQuestionById,
  deleteQuestion,
  createForm,
  updateForm,
  deleteForm,
  getFormsByBoda,
  getFormById,
  saveResponse,
};
