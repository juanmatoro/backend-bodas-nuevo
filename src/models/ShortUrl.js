const mongoose = require("mongoose");
const { Schema } = mongoose;

const shortUrlSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Elimina espacios en blanco al principio y al final
    lowercase: true, // Guarda el slug en minúsculas para evitar duplicados por case-insensitivity
  },
  target: {
    type: String,
    required: true,
    trim: true,
  },
  bodaId: {
    type: Schema.Types.ObjectId, // Tipo de dato para referenciar a otro documento (si aplica)
    ref: "Boda", // O el nombre de tu modelo de Boda
    default: null,
  },
  invitadoId: {
    type: Schema.Types.ObjectId, // Tipo de dato para referenciar a otro documento (si aplica)
    ref: "Invitado", // O el nombre de tu modelo de Invitado
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar el campo updatedAt automáticamente antes de guardar
shortUrlSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = ShortUrl;
// Este modelo representa una URL corta que redirige a un destino específico.
// Incluye campos para el slug, el destino, y referencias a la boda y al invitado (si aplica).
// El slug es único y se utiliza para generar la URL corta.
// El modelo también incluye campos para las fechas de creación y actualización, y un middleware para actualizar la fecha de modificación automáticamente antes de guardar el documento.
