const { mongo } = require("mongoose");
const Guest = require("../models/Guest");
const Question = require("../models/question");
const BroadcastList = require("../models/BroadcastList");

const normalizationUtils = require("../utils/normalization");
const { generateShortId } = require("../utils/shortIdUtils");
const multer = require("multer");
const { parseExcelFile } = require("../services/excelService");
const { default: mongoose } = require("mongoose");

// 📌 Obtener invitados de una boda
exports.obtenerInvitados = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bodaId = req.user.bodaId;

    const skip = (page - 1) * limit;
    const invitados = await Guest.find({ bodaId })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Guest.countDocuments({ bodaId });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      invitados: Array.isArray(invitados) ? invitados : [], // 📌 Asegurar siempre un array
    });
  } catch (error) {
    console.error("❌ Error en obtenerInvitados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener invitados", invitados: [] });
  }
};

// 📌 Obtener un invitado por ID

exports.obtenerInvitado = async (req, res) => {
  try {
    console.log("🔍 Buscando invitado con ID:", req.params.id);
    const invitado = await Guest.findById(req.params.id).lean();

    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    // 🔍 Obtener las preguntas asignadas (usando los IDs de respuestas)
    const preguntaIds = invitado.respuestas.map((r) => r.preguntaId);
    const preguntas = await Question.find({ _id: { $in: preguntaIds } });

    // ✅ Inyectar las preguntas asignadas en la respuesta del invitado
    invitado.preguntasAsignadas = preguntas;

    res.json(invitado);
  } catch (error) {
    console.error("❌ Error en obtenerInvitado:", error);
    res.status(500).json({ message: "Error al obtener invitado" });
  }
};

// 📌 Crear invitado (solo novios/admin)
exports.crearInvitado = async (req, res) => {
  try {
    const { nombre, telefono, invitadoDe } = req.body;
    const { bodaId } = req.user;

    if (!bodaId) {
      return res.status(403).json({ message: "Acceso no autorizado." });
    }

    if (!nombre || !telefono || !invitadoDe) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const telefonoNormalizado = telefono.toString().trim();

    const existingGuest = await Guest.findOne({
      telefono: telefonoNormalizado,
      bodaId,
    });

    if (existingGuest) {
      return res
        .status(400)
        .json({ message: "El invitado ya existe en esta boda." });
    }

    const newGuest = await Guest.create({
      nombre,
      nombreNormalizado: normalizationUtils.normalizeName(nombre),
      telefono: telefonoNormalizado,
      invitadoDe,
      bodaId,
      shortId: generateShortId(),
    });

    res.status(201).json({
      message: "Invitado agregado correctamente.",
      guest: newGuest,
    });
  } catch (error) {
    console.error("❌ Error en crearInvitado:", error);
    res.status(500).json({ message: "Error al crear invitado" });
  }
};

// 📌 Actualizar invitado (invitado solo puede editarse a sí mismo)
exports.actualizarInvitado = async (req, res) => {
  try {
    console.log("📥 Respuestas recibidas en el backend:", req.body.respuestas);
    console.log("📦 BODY COMPLETO:", req.body);
    const user = req.user;
    const idDelInvitadoAEditar = req.params.id;

    if (user.role === "guest" && user._id !== idDelInvitadoAEditar) {
      return res.status(403).json({
        message: "No tienes permiso para editar este invitado.",
      });
    }

    const invitado = await Guest.findById(idDelInvitadoAEditar);
    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado." });
    }

    // 📌 Actualizar respuestas si vienen en el body
    if (Array.isArray(req.body.respuestas)) {
      req.body.respuestas.forEach((nueva) => {
        const idx = invitado.respuestas.findIndex(
          (r) => r.preguntaId.toString() === nueva.preguntaId
        );

        if (idx !== -1) {
          // ✅ Actualizar respuesta existente
          invitado.respuestas[idx].respuesta = nueva.respuesta;
          if (nueva.subRespuesta) {
            invitado.respuestas[idx].subRespuesta = nueva.subRespuesta;
          }
        } else {
          // ➕ Añadir nueva respuesta
          invitado.respuestas.push({
            preguntaId: nueva.preguntaId,
            respuesta: nueva.respuesta,
            subRespuesta: nueva.subRespuesta || undefined,
            pregunta: nueva.pregunta || "", // Puedes incluirla si la mandas desde el front
          });
        }
      });

      await invitado.save();
    } else {
      // 📌 Actualizar otros datos generales
      Object.assign(invitado, req.body);
      await invitado.save();
    }

    res.json(invitado);
  } catch (error) {
    console.error("❌ Error en actualizarInvitado:", error);
    res.status(500).json({ message: "Error al actualizar invitado" });
  }
};

// 📌 Eliminar un invitado
exports.eliminarInvitado = async (req, res) => {
  try {
    const { invitadoId } = req.params;
    const invitado = await Guest.findById(invitadoId);

    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    await Guest.findByIdAndDelete(invitadoId);
    res.json({ message: "Invitado eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarInvitado:", error);
    res.status(500).json({ message: "Error al eliminar el invitado" });
  }
};
// 📌 Reenviar enlace a invitado con problemas
exports.reenviarEnlace = async (req, res) => {
  try {
    const { telefono } = req.body;
    const { bodaId } = req.user; // 📌 Aquí nos aseguramos de obtener correctamente el bodaId

    if (!mongoose.Types.ObjectId.isValid(bodaId)) {
      return res.status(400).json({ message: "ID de boda no válido." });
    }

    const guest = await Guest.findOne({
      telefono,
      bodaId: new mongoose.Types.ObjectId(bodaId),
    });

    if (!guest) {
      return res.status(404).json({ message: "Invitado no encontrado." });
    }

    const magicLink = generateMagicLink(guest._id, telefono);
    const mensaje = `Hola *${guest.nombre}*, accede a tu área personal usando el siguiente enlace:\n\n 👉 [🔗 Haz clic aquí](${magicLink})`;

    await enviarMensaje(bodaId, telefono, mensaje);

    res.json({ message: "Enlace mágico enviado correctamente.", magicLink });
  } catch (error) {
    console.error("❌ Error enviando enlace mágico:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el enlace mágico", error });
  }
};

// 📌 Configuración de `multer` para manejar archivos
const upload = multer({ dest: "uploads/" });

// 📌 Cargar invitados desde un archivo Excel (solo novios/admin)
exports.cargarInvitadosDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debe subir un archivo válido." });
    }

    const { bodaId } = req.user;
    if (!bodaId) {
      return res.status(403).json({ message: "Acceso no autorizado." });
    }

    console.log("📂 Archivo recibido:", req.file);
    console.log("📂 Nombre original:", req.file.originalname);
    console.log("📂 Ruta en el servidor:", req.file.path);
    console.log("📌 Usuario autenticado:", req.user);
    console.log("📌 Boda asociada:", bodaId);

    // 📌 Pasar `originalname` para asegurar la extensión correcta
    const invitados = await parseExcelFile(
      req.file.path,
      req.file.originalname
    );

    if (!Array.isArray(invitados) || invitados.length === 0) {
      return res
        .status(400)
        .json({ message: "El archivo está vacío o no tiene formato válido." });
    }

    console.log("📌 Invitados a procesar:", invitados);

    const invitadosGuardados = [];

    for (const invitado of invitados) {
      // 📌 Normalizar claves del Excel para evitar errores de mayúsculas
      const nombre = invitado["Nombre"] || invitado["nombre"];
      const telefono = invitado["Teléfono"] || invitado["telefono"];
      const invitadoDe = invitado["Invitado De"] || invitado["invitadoDe"];

      console.log("🔍 Procesando invitado:", { nombre, telefono, invitadoDe });

      if (!nombre || !telefono || !["Novio", "Novia"].includes(invitadoDe)) {
        console.warn(
          "⚠️ Invitado con datos incompletos o inválidos, ignorado:",
          { nombre, telefono, invitadoDe }
        );
        continue;
      }

      const telefonoNormalizado = telefono.toString().trim();

      // 📌 Verificar si el invitado ya existe en la boda
      const existingGuest = await Guest.findOne({
        telefono: telefonoNormalizado,
        bodaId,
      });

      if (!existingGuest) {
        const newGuest = await Guest.create({
          nombre,
          nombreNormalizado: normalizationUtils.normalizeName(nombre),
          telefono: telefonoNormalizado,
          invitadoDe,
          bodaId,
          shortId: generateShortId(),
        });

        invitadosGuardados.push(newGuest);
      } else {
        console.log("⚠️ Invitado ya existe:", existingGuest.nombre);
      }
    }

    res.status(201).json({
      message: `Se agregaron ${invitadosGuardados.length} invitados.`,
      invitados: invitadosGuardados,
    });
  } catch (error) {
    console.error("❌ Error en cargarInvitadosDesdeExcel:", error);
    res.status(500).json({ message: "Error al procesar el archivo." });
  }
};

// 📌 Asignar pregunta a invitados (por invitado, lista o todos)
exports.asignarPreguntaAInvitados = async (req, res) => {
  try {
    const { preguntaId, tipoAsignacion, listaId, invitadoId } = req.body;
    const { bodaId } = req.user;

    if (!preguntaId || !tipoAsignacion) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const pregunta = await Question.findById(preguntaId);
    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    let invitados = [];

    if (tipoAsignacion === "todos") {
      invitados = await Guest.find({ bodaId });
    } else if (tipoAsignacion === "lista") {
      if (!listaId) return res.status(400).json({ message: "Falta listaId." });
      const lista = await BroadcastList.findById(listaId).populate("invitados");
      if (!lista)
        return res.status(404).json({ message: "Lista no encontrada." });
      invitados = lista.invitados;
    } else if (tipoAsignacion === "invitado") {
      if (!invitadoId)
        return res.status(400).json({ message: "Falta invitadoId." });
      const invitado = await Guest.findById(invitadoId);
      if (!invitado)
        return res.status(404).json({ message: "Invitado no encontrado." });
      invitados = [invitado];
    } else {
      return res.status(400).json({ message: "Tipo de asignación no válido." });
    }

    let count = 0;

    for (const invitado of invitados) {
      const yaTiene = invitado.respuestas.find(
        (r) => r.preguntaId.toString() === preguntaId
      );

      if (!yaTiene) {
        invitado.respuestas.push({
          preguntaId: pregunta._id,
          pregunta: pregunta.pregunta,
          respuesta: "",
        });

        await invitado.save();
        count++;
      }
    }

    res.status(200).json({
      message: `Pregunta asignada a ${count} invitado(s).`,
    });
  } catch (error) {
    console.error("❌ Error en asignarPreguntaAInvitados:", error);
    res.status(500).json({ message: "Error interno al asignar pregunta." });
  }
};

// 📌 Guardar respuestas del invitado
exports.guardarRespuestas = async (req, res) => {
  console.log("📥 Respuestas recibidas en el backend:", req.body.respuestas);

  try {
    const { id } = req.params;
    const { respuestas } = req.body;

    const invitado = await Guest.findById(id);
    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado." });
    }

    // Actualiza o añade respuestas
    req.body.respuestas.forEach((nuevaResp) => {
      const idx = invitado.respuestas.findIndex(
        (r) => r.preguntaId && r.preguntaId.toString() === nuevaResp.preguntaId
      );

      if (idx >= 0) {
        invitado.respuestas[idx].respuesta = nuevaResp.respuesta;
        if (nuevaResp.subRespuesta) {
          invitado.respuestas[idx].subRespuesta = nuevaResp.subRespuesta;
        }
      } else {
        invitado.respuestas.push({
          preguntaId: nuevaResp.preguntaId,
          pregunta: nuevaResp.pregunta || "",
          respuesta: nuevaResp.respuesta,
          subRespuesta: nuevaResp.subRespuesta || "",
        });
      }
    });

    await invitado.save();

    res.status(200).json({ message: "Respuestas guardadas correctamente." });
  } catch (error) {
    console.error("❌ Error al guardar respuestas:", error);
    res.status(500).json({ message: "Error al guardar respuestas." });
  }
};

// 📌 Obtener preguntas asignadas a un invitado
exports.obtenerPreguntasAsignadas = async (req, res) => {
  try {
    const invitadoId = req.params.id;
    const invitado = await Guest.findById(invitadoId);

    if (!invitado) {
      return res.status(404).json({ message: "Invitado no encontrado" });
    }

    res.json(invitado.respuestas);
  } catch (error) {
    console.error("❌ Error al obtener preguntas asignadas:", error);
    res.status(500).json({ message: "Error interno al obtener preguntas." });
  }
};
// 📌 Filtrar invitados por respuesta a una pregunta
exports.filtrarInvitadosPorRespuesta = async (req, res) => {
  try {
    const { preguntaId, respuesta } = req.body;
    const { bodaId } = req.user;

    if (!preguntaId || typeof respuesta !== "string") {
      return res
        .status(400)
        .json({ message: "Se requiere preguntaId y respuesta." });
    }

    // Filtrar directamente en los documentos de invitados
    const invitados = await Guest.find({
      bodaId,
      respuestas: {
        $elemMatch: {
          preguntaId: new mongoose.Types.ObjectId(preguntaId),
          respuesta: respuesta,
        },
      },
    });

    res.status(200).json({
      total: invitados.length,
      invitados,
    });
  } catch (error) {
    console.error("❌ Error al filtrar invitados:", error);
    res
      .status(500)
      .json({ message: "Error al filtrar invitados por respuesta." });
  }
};

exports.getAllGuestsByBoda = async (req, res) => {
  const { bodaId } = req.params;
  try {
    const invitados = await Guest.find({ bodaId });
    res.status(200).json({ invitados });
  } catch (error) {
    console.error("Error al obtener todos los invitados:", error);
    res.status(500).json({ mensaje: "Error al obtener los invitados" });
  }
};
