const Boda = require("../models/Boda");

// 📌 Obtener todas las bodas (Solo admin)
const obtenerBodas = async (req, res) => {
  try {
    const bodas = await Boda.find();
    res.json(bodas);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Obtener una boda por ID (Admin, Novio, Novia)
const obtenerBoda = async (req, res) => {
  try {
    const boda = await Boda.findById(req.params.id);
    if (!boda) return res.status(404).json({ message: "Boda no encontrada" });

    res.json(boda);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Crear una nueva boda (Solo Admin)
const crearBoda = async (req, res) => {
  try {
    console.log("📌 Datos recibidos en el backend:", req.body); // 🔍 Verifica qué datos llegan desde Postman
    const { nombre, fecha, ubicacion, detalles, whatsappNumber } = req.body;

    if (!whatsappNumber) {
      return res
        .status(400)
        .json({ message: "El número de WhatsApp es obligatorio." });
    }

    // Validar datos requeridos
    if (!nombre || !fecha || !ubicacion || !whatsappNumber) {
      return res
        .status(400)
        .json({ message: "Todos los campos obligatorios." });
    }

    // Crear la boda en la base de datos
    const nuevaBoda = new Boda({
      nombre,
      fecha,
      ubicacion,
      detalles,
      whatsappNumber,
    });
    await nuevaBoda.save();

    res
      .status(201)
      .json({ message: "Boda creada exitosamente.", boda: nuevaBoda });
  } catch (error) {
    console.error("❌ Error creando boda:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Actualizar una boda (Solo admin)
const actualizarBoda = async (req, res) => {
  try {
    const boda = await Boda.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(boda);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Eliminar una boda (Solo admin)
const eliminarBoda = async (req, res) => {
  try {
    await Boda.findByIdAndDelete(req.params.id);
    res.json({ message: "Boda eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  obtenerBodas,
  obtenerBoda,
  crearBoda,
  actualizarBoda,
  eliminarBoda,
};
