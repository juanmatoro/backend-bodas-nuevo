const BroadcastList = require("../models/BroadcastList");
const Guest = require("../models/Guest");

// 📌 Crear una nueva lista de difusión
exports.crearListaDifusion = async (req, res) => {
  try {
    const { nombre, invitados } = req.body;
    console.log("📥 Recibido:", { nombre, invitados });
    console.log("👤 Usuario autenticado:", req.user);

    if (!["novio", "novia", "admin"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Verificar si ya existe una lista con ese nombre en la misma boda
    const existeLista = await BroadcastList.findOne({
      bodaId: req.user.bodaId,
      nombre,
    });

    if (existeLista) {
      return res
        .status(400)
        .json({ message: "Ya existe una lista con este nombre" });
    }

    const nuevaLista = new BroadcastList({
      nombre,
      invitados,
      bodaId: req.user.bodaId,
    });

    await nuevaLista.save();
    res.status(201).json({
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
    if (!["novio", "novia"].includes(req.user.tipoUsuario)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const listas = await BroadcastList.find({
      bodaId: req.user.bodaId,
    }).populate("invitados", "nombre telefono"); // ✅ Poblar detalles de los invitados

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
    const { id } = req.params; // Asegurarse de que se extrae bien el ID de la URL
    const userBodaId = req.user.bodaId;

    // Buscar la lista en la base de datos
    const lista = await BroadcastList.findById(id);

    if (!lista) {
      return res
        .status(404)
        .json({ message: "Lista de difusión no encontrada" });
    }

    // Verificar que la lista pertenece a la misma boda que el usuario
    if (lista.bodaId.toString() !== userBodaId.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar esta lista" });
    }

    await lista.deleteOne();
    res.json({ message: "Lista de difusión eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarListaDifusion:", error);
    res.status(500).json({ message: "Error al eliminar la lista" });
  }
};

// 📌 Editar una lista de difusión
exports.editarListaDifusion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, invitados } = req.body;
    const userBodaId = req.user.bodaId;

    // Buscar la lista en la base de datos
    const lista = await BroadcastList.findById(id);

    if (!lista) {
      return res
        .status(404)
        .json({ message: "Lista de difusión no encontrada" });
    }

    // Verificar que la lista pertenece a la boda del usuario
    if (lista.bodaId.toString() !== userBodaId.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para editar esta lista" });
    }

    // Actualizar datos
    lista.nombre = nombre || lista.nombre;
    if (Array.isArray(invitados)) {
      lista.invitados = invitados;
    }

    await lista.save();
    res.json({ message: "Lista actualizada correctamente", lista });
  } catch (error) {
    console.error("❌ Error en editarListaDifusion:", error);
    res.status(500).json({ message: "Error al editar la lista" });
  }
};
// 📌 Obtener listas en las que está un invitado
exports.obtenerListasPorInvitado = async (req, res) => {
  try {
    const { invitadoId } = req.params;

    const listas = await BroadcastList.find({ invitados: invitadoId }).select(
      "nombre"
    );

    res.status(200).json(listas);
  } catch (error) {
    console.error("❌ Error al obtener listas por invitado:", error);
    res.status(500).json({ message: "Error al obtener listas" });
  }
};
