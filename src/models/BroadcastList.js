const mongoose = require("mongoose");

const broadcastListSchema = new mongoose.Schema(
  {
    bodaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boda",
      required: true,
    },
    nombre: { type: String, required: true },
    invitados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BroadcastList", broadcastListSchema);
