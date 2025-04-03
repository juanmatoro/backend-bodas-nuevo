const mongoose = require("mongoose");

const messageTemplateSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    contenido: { type: String, required: true },
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: true,
    },
    creadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // o "Novio"/"Novia" según el modelo
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageTemplate", messageTemplateSchema);
// Este modelo representa una plantilla de mensaje que puede ser utilizada para enviar mensajes personalizados a los invitados.
// El modelo incluye campos para el nombre de la plantilla, el contenido del mensaje, y referencias a la boda y al creador de la plantilla.
