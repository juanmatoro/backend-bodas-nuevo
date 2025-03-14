const crypto = require("crypto");

// Genera un ID corto de 6 caracteres en formato hexadecimal
const generateShortId = () => {
  return crypto.randomBytes(3).toString("hex");
};

module.exports = { generateShortId };
