require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const crearAdminSiNoExiste = require("./config/adminSetup");
const app = require("./app");

const PORT = process.env.PORT || 4000;
crearAdminSiNoExiste();
// Conectar a MongoDB
connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = server;
