// Desc: Controladores para la autenticación de usuarios
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Guest = require("../models/Guest");
const { generarToken, generarMagicToken } = require("../utils/jwtUtils");

// 📌 Login para Admin / Novio / Novia
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 📌 Generar token JWT
    const token = generarToken(user._id, user.tipoUsuario);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Cambiar contraseña (Admin, Novio, Novia)
exports.cambiarPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Se requieren ambas contraseñas." });
    }

    // 📌 Obtener usuario autenticado
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 📌 Verificar la contraseña actual
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta." });
    }

    // 📌 Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 📌 Guardar la nueva contraseña
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Contraseña cambiada correctamente." });
  } catch (error) {
    console.error("❌ Error en cambiarPassword:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// 📌 Generar Enlace Mágico para Invitados
exports.generarMagicLink = async (req, res) => {
  try {
    const { email } = req.body;
    const guest = await Guest.findOne({ email });

    if (!guest) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    // 📌 Generar token único para el enlace
    const token = generarMagicToken(guest._id);
    const enlace = `${process.env.FRONTEND_URL}/auth/magic-login?token=${token}`;

    res.json({ message: "Enlace mágico generado", enlace });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Validar Enlace Mágico (Acceso Invitado)
exports.validarMagicLink = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.tipoUsuario !== "guest") {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const guest = await Guest.findById(decoded.id);
    if (!guest) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    res.json({ message: "Autenticación exitosa", guest });
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
