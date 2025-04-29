// Verifica que la plantilla conserve los marcadores obligatorios
const REQUIRED = ["{nombreInvitado}", "{magicUrl}"];
module.exports = function validateTemplateMarkers(req, res, next) {
  const { cuerpo } = req.body;
  if (!cuerpo)
    return res.status(400).json({ error: "Falta cuerpo de plantilla" });
  const ok = REQUIRED.every((tag) => cuerpo.includes(tag));
  return ok
    ? next()
    : res
        .status(400)
        .json({
          error: "La plantilla debe contener {nombreInvitado} y {magicUrl}",
        });
};
