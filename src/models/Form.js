const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  bodaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boda",
    required: true,
    index: true,
  },
  pregunta: { type: String, required: true }, // Texto de la pregunta
  opciones: [{ type: String, required: true }], // ✅ 🔹 Opciones obligatorias (mínimo 2 respuestas)
  esObligatoria: { type: Boolean, default: false }, // Indica si es requerida
});

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
  respuesta: { type: String, required: true }, // 🔹 Solo respuestas dentro de `opciones`
});

const Question = mongoose.model("Question", questionSchema);
const Response = mongoose.model("Response", responseSchema);

module.exports = { Question, Response };
