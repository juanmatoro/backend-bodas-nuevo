const Message = require("../models/Message");
const Guest = require("../models/Guest");
const BroadcastList = require("../models/BroadcastList");
const whatsappService = require("../services/whatsappService");

// 📌 Enviar mensaje individual a un invitado
exports.enviarMensajeIndividual = async (req, res) => {
  try {
    const { invitadoId, mensaje } = req.body;

    // Verificar permisos (solo novios pueden enviar mensajes)
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Verificar que el invitado existe y pertenece a la boda del usuario
    const invitado = await Guest.findById(invitadoId);
    if (
      !invitado ||
      invitado.bodaId.toString() !== req.user.bodaId.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Invitado no encontrado o no pertenece a tu boda" });
    }

    // Enviar mensaje vía WhatsApp
    await whatsappService.enviarMensaje(invitado.telefono, mensaje);

    // Guardar mensaje en la base de datos
    const nuevoMensaje = new Message({
      remitente: req.user.id,
      destinatario: invitadoId,
      contenido: mensaje,
      bodaId: req.user.bodaId,
    });
    await nuevoMensaje.save();

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("❌ Error en enviarMensajeIndividual:", error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

// 📌 Enviar mensaje a una lista de difusión
exports.enviarMensajeLista = async (req, res) => {
  try {
    const { listaId, mensaje } = req.body;

    // Verificar permisos
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Verificar que la lista pertenece a la boda del usuario
    const lista = await BroadcastList.findById(listaId);
    if (!lista || lista.bodaId.toString() !== req.user.bodaId.toString()) {
      return res.status(404).json({
        message: "Lista de difusión no encontrada o no pertenece a tu boda",
      });
    }

    // Obtener invitados de la lista
    const invitados = await Guest.find({ _id: { $in: lista.invitados } });

    // Enviar mensaje a cada invitado
    for (const invitado of invitados) {
      await whatsappService.enviarMensaje(invitado.telefono, mensaje);
    }

    // Guardar mensaje en la base de datos
    const nuevoMensaje = new Message({
      remitente: req.user.id,
      destinatario: listaId,
      contenido: mensaje,
      bodaId: req.user.bodaId,
    });
    await nuevoMensaje.save();

    res.status(201).json({ message: "Mensajes enviados correctamente" });
  } catch (error) {
    console.error("❌ Error en enviarMensajeLista:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el mensaje a la lista de difusión" });
  }
};

// 📌 Programar un mensaje para enviar después
exports.programarMensaje = async (req, res) => {
  try {
    const { destinatarioId, mensaje, fechaEnvio } = req.body;

    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Guardar mensaje programado en la base de datos
    const nuevoMensaje = new Message({
      remitente: req.user.id,
      destinatario: destinatarioId,
      contenido: mensaje,
      bodaId: req.user.bodaId,
      programado: true,
      fechaEnvio,
    });
    await nuevoMensaje.save();

    res.status(201).json({ message: "Mensaje programado correctamente" });
  } catch (error) {
    console.error("❌ Error en programarMensaje:", error);
    res.status(500).json({ message: "Error al programar el mensaje" });
  }
};

// 📌 Obtener historial de mensajes enviados
exports.obtenerHistorialMensajes = async (req, res) => {
  try {
    // Filtrar mensajes por bodaId del usuario autenticado
    const mensajes = await Message.find({ bodaId: req.user.bodaId }).sort({
      createdAt: -1,
    });

    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error en obtenerHistorialMensajes:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el historial de mensajes" });
  }
};
