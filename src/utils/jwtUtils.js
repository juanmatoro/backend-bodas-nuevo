const jwt = require("jsonwebtoken");

// 📌 Generar token JWT para User (Admin, Novio, Novia)
const generarToken = (id, tipoUsuario) => {
  return jwt.sign({ id, tipoUsuario }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 📌 Generar token único para enlace mágico (Invitado)
const generarMagicToken = (id) => {
  return jwt.sign({ id, tipoUsuario: "guest" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { generarToken, generarMagicToken };
