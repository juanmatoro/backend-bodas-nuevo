const MessageTemplate = require("../models/MessageTemplate");
const Guest = require("../models/Guest");
const shortUrlService = require("../services/shortUrlService");
const { issueOrReuseToken } = require("../services/tokenService");
const mustache = require("mustache");
const { enviarMensaje } = require("../services/whatsappService");

exports.enviarPrimerContacto = async (req, res) => {
  const { bodaId, templateId } = req.body;
  try {
    const plantilla = await MessageTemplate.findById(templateId);
    if (!plantilla)
      return res.status(404).json({ error: "Plantilla no encontrada" });

    const invitados = await Guest.find({
      bodaId,
      telefono: { $exists: true },
    }).lean();

    const resultados = [];
    for (const invitado of invitados) {
      try {
        const { token } = issueOrReuseToken(invitado);
        const magicUrl = await shortUrlService.createShortUrl(
          `/invitado/${token}`,
          bodaId,
          invitado._id
        );
        const texto = mustache.render(plantilla.cuerpo, {
          nombreInvitado: invitado.nombre,
          magicUrl,
        });
        await enviarMensaje(invitado.telefono, texto, bodaId);
        resultados.push({ invitado: invitado._id, status: "enviado" });
      } catch (err) {
        resultados.push({
          invitado: invitado._id,
          status: "fallo",
          error: err.message,
        });
      }
    }
    res.json({ success: true, resultados });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
