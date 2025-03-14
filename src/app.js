const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Rutas
const authRoutes = require("./routes/authRoutes");
const bodaRoutes = require("./routes/bodaRoutes");
const guestRoutes = require("./routes/guestRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const photoRoutes = require("./routes/photoRoutes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/bodas", bodaRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/photos", photoRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

module.exports = app;
