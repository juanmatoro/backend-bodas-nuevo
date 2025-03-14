const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // URL de la imagen
  bodaId: { type: mongoose.Schema.Types.ObjectId, ref: "Boda", required: true }, // Referencia a la boda
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Usuario o invitado que la subió
  uploadedByType: { type: String, enum: ["user", "guest"], required: true }, // Tipo de usuario
  createdAt: { type: Date, default: Date.now }, // Fecha de subida
});

module.exports = mongoose.model("Photo", PhotoSchema);
// 📌 En este modelo, guardamos la URL de la imagen, la referencia a la boda, el usuario o invitado que la subió, el tipo de usuario y la fecha de subida.
