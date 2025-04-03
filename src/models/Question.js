// ✅ Nuevo modelo actualizado sin campo 'filtros', con soporte para subpregunta condicional
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: true,
      index: true,
    },
    pregunta: { type: String, required: true },
    opciones: [{ type: String, required: true }],
    esObligatoria: { type: Boolean, default: false },
    esConfirmacionAsistencia: { type: Boolean, default: false },

    // 🆕 Subpregunta condicional
    subPregunta: {
      texto: { type: String },
      opciones: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
