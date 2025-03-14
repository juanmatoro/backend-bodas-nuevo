const normalizationUtils = {
  /**
   * Normaliza un texto eliminando acentos, convirtiéndolo a minúsculas y eliminando espacios en blanco al inicio y al final.
   *
   * @param {string} text - El texto a normalizar.
   * @returns {string} - El texto normalizado.
   */
  normalizeText: (text) => {
    if (!text) return ""; // Manejo de valores nulos o indefinidos
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  },

  /**
   * Normaliza un nombre eliminando caracteres especiales y normalizando el texto.
   *
   * @param {string} name - El nombre a normalizar.
   * @returns {string} - El nombre normalizado.
   */
  normalizeName: (name) => {
    if (!name) return "";
    return normalizationUtils.normalizeText(name).replace(/[^a-z\s]/g, ""); // Permite letras y espacios
  },

  /**
   * Normaliza un número de teléfono eliminando caracteres no numéricos y espacios.
   *
   * @param {string} phone - El número de teléfono a normalizar.
   * @returns {string} - El número de teléfono normalizado.
   */
  normalizePhone: (phone) => {
    if (!phone) return "";
    return phone.replace(/[^\d]/g, ""); // Permite solo dígitos
  },
};

module.exports = normalizationUtils;

/* const nombre = "José María González";
const nombreNormalizado = normalizationUtils.normalizeName(nombre);
console.log(nombreNormalizado); // "jose maria gonzalez"

const telefono = "+1 (555) 123-4567";
const telefonoNormalizado = normalizationUtils.normalizePhone(telefono);
console.log(telefonoNormalizado); // "15551234567"

const texto = "Análisis de datos con acéntos y mayúsculas.";
const textoNormalizado = normalizationUtils.normalizeText(texto);
console.log(textoNormalizado); // "analisis de datos con acentos y mayusculas."
 */
