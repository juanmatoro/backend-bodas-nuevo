/**
 * Emite un token de invitado de 12 meses o reutiliza el existente si le quedan >30 días.
 */
function issueOrReuseToken(invitado) {
  const ahora = Math.floor(Date.now() / 1000);
  // reutilizar
  if (
    invitado.token &&
    invitado.tokenExp &&
    invitado.tokenExp - ahora > 3600 * 24 * 30
  ) {
    return { token: invitado.token, exp: invitado.tokenExp };
  }
  const exp = ahora + 3600 * 24 * 365; // 12 meses
  const token = jwt.sign(
    { sub: invitado._id.toString(), bid: invitado.bodaId.toString() },
    TOKEN_SECRET,
    {
      expiresIn: exp - ahora,
    }
  );
  invitado.token = token;
  invitado.tokenExp = exp;
  invitado.save({ validateBeforeSave: false });
  return { token, exp };
}

module.exports = { issueOrReuseToken };
