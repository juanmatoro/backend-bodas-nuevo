const mongoose = require("mongoose");

// 📌 Modelo de Preguntas
const questionSchema = new mongoose.Schema({
  bodaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boda",
    required: true,
    index: true,
  },
  pregunta: { type: String, required: true },
  opciones: [{ type: String, required: true }],
  esObligatoria: { type: Boolean, default: false },

  // 🆕 Campo para marcar preguntas de confirmación
  esConfirmacionAsistencia: { type: Boolean, default: false },
});
const Question = mongoose.model("Question", questionSchema);

// 📌 Modelo de Respuestas de Invitados
const responseSchema = new mongoose.Schema({
  invitadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: true,
  },
  preguntaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  respuesta: { type: String, required: true }, // ✅ Solo respuestas dentro de `opciones`
});

const Response = mongoose.model("Response", responseSchema);

// 📌 Modelo de Formularios
const formSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // ✅ Se agregó el campo nombre al formulario
  bodaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boda",
    required: true,
    index: true,
  },
  enviadosA: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
  ], // 📌 Invitados que recibirán el formulario
  preguntas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ], // 📌 Preguntas incluidas en el formulario
  completado: { type: Boolean, default: false },
});

const Form = mongoose.model("Form", formSchema);

module.exports = { Question, Response, Form }; // ✅ Exportado en CommonJS
