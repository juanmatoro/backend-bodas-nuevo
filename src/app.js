const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Rutas
const authRoutes = require("./routes/authRoutes");
const bodaRoutes = require("./routes/bodaRoutes");
const broadcastRoutes = require("./routes/broadcastRoutes");
const guestRoutes = require("./routes/guestRoutes");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const photoRoutes = require("./routes/photoRoutes");
const preguntaRoutes = require("./routes/preguntas");

const app = express();

// Middlewares globales
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true, // si usas cookies o sesiones
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/bodas", bodaRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lists", broadcastRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/estadisticas", statsRoutes);

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "🚀 Conexión con el backend exitosa!" });
});
// Middleware de manejo de errores
app.use(errorMiddleware);

module.exports = app;
