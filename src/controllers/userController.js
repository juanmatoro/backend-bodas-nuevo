const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📌 Obtener todos los usuarios (solo admin)
exports.obtenerUsuarios = async (req, res) => {
  try {
    if (req.user.tipoUsuario !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const usuarios = await User.find().select("-password"); // Excluye la contraseña
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error en obtenerUsuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// 📌 Obtener un usuario por ID (solo admin o el mismo usuario)
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password");
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar si el usuario autenticado es admin o es el mismo usuario
    if (
      req.user.tipoUsuario !== "admin" &&
      req.user.id !== usuario._id.toString()
    ) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error en obtenerUsuarioPorId:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// 📌 Crear un usuario (admin puede crear novios/novias)
exports.crearUsuario = async (req, res) => {
  try {
    if (req.user.tipoUsuario !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const { nombre, email, telefono, password, tipoUsuario, bodaId } = req.body;

    // Validar tipo de usuario permitido
    if (!["novio", "novia"].includes(tipoUsuario)) {
      return res.status(400).json({ message: "Tipo de usuario inválido" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      email,
      telefono,
      password: hashedPassword,
      tipoUsuario,
      bodaId,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("❌ Error en crearUsuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// 📌 Actualizar usuario (solo admin o el mismo usuario)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;
    const usuario = await User.findById(req.params.id);

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar si el usuario autenticado es admin o es el mismo usuario
    if (
      req.user.tipoUsuario !== "admin" &&
      req.user.id !== usuario._id.toString()
    ) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Actualizar solo los campos proporcionados
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (telefono) usuario.telefono = telefono;
    if (password) usuario.password = await bcrypt.hash(password, 10);

    await usuario.save();
    res.json({ message: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error("❌ Error en actualizarUsuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// 📌 Eliminar usuario (solo admin)
exports.eliminarUsuario = async (req, res) => {
  try {
    if (req.user.tipoUsuario !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarUsuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
