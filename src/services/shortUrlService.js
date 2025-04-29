const ShortUrl = require("../models/ShortUrl");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

/**
 * Crea una URL corta única y devuelve la URL absoluta.
 * @param {string} targetPath - Ruta destino (ej: "/invitado/{token}")
 * @param {string} bodaId
 * @param {string} invitadoId
 */
async function createShortUrl(targetPath, bodaId, invitadoId) {
  const slug = nanoid();
  await ShortUrl.create({ slug, target: targetPath, bodaId, invitadoId });
  return `${process.env.PUBLIC_BASE_URL || "https://bodas.ly"}/${slug}`;
}

async function resolveSlug(slug) {
  return ShortUrl.findOne({ slug });
}
module.exports = { createShortUrl, resolveSlug };
