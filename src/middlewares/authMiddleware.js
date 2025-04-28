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

/* //modelo de usuario y de invitado
//middleware de autenticación
//jwt
//roles permitidos
//roles de usuario
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Guest = require("../models/Guest");

const authMiddleware =
  (rolesPermitidos = []) =>
  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "guest") {
        const invitado = await Guest.findById(decoded._id);
        if (!invitado) {
          return res.status(404).json({ message: "Invitado no encontrado" });
        }

        req.user = {
          _id: invitado._id,
          role: "guest",
          bodaId: invitado.bodaId,
        };
      } else {
        const user = await User.findById(decoded._id);
        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        req.user = {
          _id: user._id,
          role: user.tipoUsuario, // admin | novio | novia
          bodaId: user.bodaId,
        };
      }

      // Verificación del rol permitido
      if (!rolesPermitidos.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      next();
    } catch (error) {
      console.error("❌ Error en authMiddleware:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };

module.exports = authMiddleware;
 */
