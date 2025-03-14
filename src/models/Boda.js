/* const mongoose = require("mongoose");

const bodaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    lugar: { type: String, required: true },
    novios: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Novio y Novia
    invitados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Boda", bodaSchema);
 */

const mongoose = require("mongoose");

const BodaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true }, // Nombre de la boda
    fecha: { type: Date, required: true }, // Fecha del evento
    ubicacion: { type: String, required: true, trim: true }, // Lugar del evento
    detalles: { type: String, trim: true }, // Descripción opcional
    whatsappNumber: { type: String, required: true }, // 📌 Número principal
    backupNumbers: [{ type: String }], // 📌 Números de respaldo (otros novios)
    whatsappSession: { type: String, default: null }, // 📌 Datos de la sesión activa

    // 👰🤵 Relación con novios/novias
    novios: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Lista de IDs de usuarios con rol "novio" o "novia"

    // 📋 Relación con invitados
    invitados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }], // Lista de IDs de invitados vinculados a esta boda

    // 📂 Otras configuraciones
    listasDifusion: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ListaDifusion" },
    ], // Listas de difusión generadas para esta boda
    formularios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Formulario" }], // Formularios asociados a la boda
    fotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }], // Galería de fotos vinculada a la boda
  },
  { timestamps: true }
);

module.exports = mongoose.model("Boda", BodaSchema);
