const BroadcastList = require("../models/BroadcastList");
const Guest = require("../models/Guest");

// 📌 Crear una nueva lista de difusión
exports.crearListaDifusion = async (req, res) => {
  try {
    const { nombre, invitados } = req.body;

    // Verificar permisos (solo novios pueden crear listas)
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Crear lista de difusión
    const nuevaLista = new BroadcastList({
      nombre,
      invitados,
      bodaId: req.user.bodaId,
    });

    await nuevaLista.save();
    res
      .status(201)
      .json({
        message: "Lista de difusión creada exitosamente",
        lista: nuevaLista,
      });
  } catch (error) {
    console.error("❌ Error en crearListaDifusion:", error);
    res.status(500).json({ message: "Error al crear la lista de difusión" });
  }
};

// 📌 Obtener todas las listas de difusión de una boda
exports.obtenerListasDifusion = async (req, res) => {
  try {
    // Verificar permisos
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const listas = await BroadcastList.find({ bodaId: req.user.bodaId });
    res.json(listas);
  } catch (error) {
    console.error("❌ Error en obtenerListasDifusion:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las listas de difusión" });
  }
};

// 📌 Agregar invitados a una lista de difusión
exports.agregarInvitadosALista = async (req, res) => {
  try {
    const { listaId, invitados } = req.body;

    // Verificar permisos
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const lista = await BroadcastList.findById(listaId);
    if (!lista || lista.bodaId.toString() !== req.user.bodaId.toString()) {
      return res
        .status(404)
        .json({ message: "Lista no encontrada o no pertenece a tu boda" });
    }

    // Añadir nuevos invitados evitando duplicados
    lista.invitados = [...new Set([...lista.invitados, ...invitados])];
    await lista.save();

    res.json({ message: "Invitados añadidos a la lista", lista });
  } catch (error) {
    console.error("❌ Error en agregarInvitadosALista:", error);
    res.status(500).json({ message: "Error al agregar invitados" });
  }
};

// 📌 Eliminar un invitado de una lista
exports.eliminarInvitadoDeLista = async (req, res) => {
  try {
    const { listaId, invitadoId } = req.body;

    // Verificar permisos
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const lista = await BroadcastList.findById(listaId);
    if (!lista || lista.bodaId.toString() !== req.user.bodaId.toString()) {
      return res
        .status(404)
        .json({ message: "Lista no encontrada o no pertenece a tu boda" });
    }

    // Remover invitado
    lista.invitados = lista.invitados.filter(
      (id) => id.toString() !== invitadoId
    );
    await lista.save();

    res.json({ message: "Invitado eliminado de la lista", lista });
  } catch (error) {
    console.error("❌ Error en eliminarInvitadoDeLista:", error);
    res.status(500).json({ message: "Error al eliminar invitado" });
  }
};

// 📌 Eliminar una lista de difusión
exports.eliminarListaDifusion = async (req, res) => {
  try {
    const { listaId } = req.params;

    // Verificar permisos
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const lista = await BroadcastList.findById(listaId);
    if (!lista || lista.bodaId.toString() !== req.user.bodaId.toString()) {
      return res
        .status(404)
        .json({ message: "Lista no encontrada o no pertenece a tu boda" });
    }

    await lista.deleteOne();
    res.json({ message: "Lista de difusión eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarListaDifusion:", error);
    res.status(500).json({ message: "Error al eliminar la lista" });
  }
};
