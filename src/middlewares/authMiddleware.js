const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Guest = require("../models/Guest");

// 📌 Middleware para autenticar usuarios
const authMiddleware = (rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res
          .status(401)
          .json({ message: "Acceso no autorizado, token requerido." });
      }

      // 📌 Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.tipoUsuario === "guest") {
        const guest = await Guest.findById(decoded.id);
        if (!guest)
          return res.status(401).json({ message: "Invitado no encontrado." });

        req.guest = guest;
      } else {
        const user = await User.findById(decoded.id);
        if (!user)
          return res.status(401).json({ message: "Usuario no encontrado." });

        req.user = user;
      }

      // 📌 Validar roles permitidos
      const userRole =
        decoded.tipoUsuario || (req.user ? req.user.tipoUsuario : null);
      if (!rolesPermitidos.includes(userRole)) {
        return res.status(403).json({ message: "Acceso denegado." });
      }

      next();
    } catch (error) {
      console.error("❌ Error en autenticación:", error);
      res.status(401).json({ message: "Token inválido o expirado." });
    }
  };
};

module.exports = authMiddleware;
