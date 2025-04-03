const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const respuestaSchema = new mongoose.Schema({
  preguntaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  pregunta: { type: String, required: true },
  respuesta: { type: String, default: "" },
  subRespuesta: { type: String },
  fecha: { type: Date, default: Date.now },
});

const guestSchema = new mongoose.Schema({
  // 📌 Datos básicos del invitado
  nombre: { type: String, required: true, trim: true },
  nombreNormalizado: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },

  // 📌 Relación con los novios
  invitadoDe: { type: String, enum: ["Novio", "Novia"], required: true },

  // 📌 Identificador único y vinculación
  shortId: { type: String, unique: true, default: () => nanoid(6) },
  bodaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boda",
    required: true,
  },

  // 📌 Confirmación de asistencia
  confirmacion: { type: Boolean, default: null }, // true, false, null (sin respuesta)

  // 📌 Datos sobre acompañantes
  acompanante: { type: Boolean, default: null }, // true = sí lleva
  tipoAcompanante: {
    type: String,
    enum: ["adulto", "niño", null],
    default: null,
  },

  // 📸 Fotos subidas por el invitado
  fotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],

  // 📌 Respuestas a preguntas
  respuestas: [respuestaSchema],
});

module.exports = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
