/* const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: true,
    },
    enviadoA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    preguntas: [{ pregunta: String, respuesta: String }],
    completado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
 */
const mongoose = require("mongoose");

// Definimos las opciones de respuesta para preguntas tipo select
const questionSchema = new mongoose.Schema({
  bodaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wedding",
    required: true,
  }, // Boda a la que pertenece la pregunta
  pregunta: { type: String, required: true }, // Texto de la pregunta
  opciones: [{ type: String }], // Opciones de respuesta si es tipo select
  esObligatoria: { type: Boolean, default: false }, // Indica si es obligatoria
  tipo: { type: String, enum: ["select"], default: "select" }, // Solo permitimos preguntas tipo select
});

// Respuestas de los invitados
const responseSchema = new mongoose.Schema({
  invitadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: true,
  }, // Invitado que responde
  preguntaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  }, // Pregunta respondida
  respuesta: { type: String, required: true }, // Respuesta seleccionada
});

const Question = mongoose.model("Question", questionSchema);
const Response = mongoose.model("Response", responseSchema);

module.exports = { Question, Response };
