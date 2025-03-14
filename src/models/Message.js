const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: true,
    },
    enviadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Novio/Novia/Admin
    destinatario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: false,
    },
    listaDifusion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BroadcastList",
      required: false,
    },
    contenido: { type: String, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "enviado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
