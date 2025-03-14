const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    tipoUsuario: {
      type: String,
      enum: ["admin", "novio", "novia"],
      required: true,
    },
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: function () {
        return this.tipoUsuario !== "admin";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
