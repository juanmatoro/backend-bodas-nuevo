const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const GuestSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  nombreNormalizado: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  invitadoDe: { type: String, enum: ["Novio", "Novia"], required: true },
  confirmacion: { type: Boolean, default: null },
  fotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
  shortId: { type: String, unique: true, default: () => nanoid(6) }, // ID corto único
  bodaId: { type: mongoose.Schema.Types.ObjectId, ref: "Boda", required: true }, // 🆕 Vinculación con la boda
});

module.exports = mongoose.model("Guest", GuestSchema);
