/* const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdminIfNotExists = async () => {
  try {
    const existingAdmin = await User.findOne({ tipoUsuario: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new User({
        nombre: "Administrador",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        tipoUsuario: "admin",
      });

      await admin.save();
      console.log("✅ Admin creado correctamente.");
    } else {
      console.log("✅ Admin ya registrado.");
    }
  } catch (error) {
    console.error("❌ Error creando el admin:", error);
  }
};

module.exports = createAdminIfNotExists;
 */

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdminIfNotExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        "❌ ERROR: Faltan variables de entorno ADMIN_EMAIL o ADMIN_PASSWORD."
      );
      return;
    }

    const existingAdmin = await User.findOne({ tipoUsuario: "admin" });

    if (!existingAdmin) {
      console.log("🔄 Creando admin con email:", adminEmail);

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = new User({
        nombre: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        tipoUsuario: "admin",
      });

      await admin.save();
      console.log("✅ Admin creado correctamente.");
    } else {
      console.log("✅ Admin ya registrado.");
    }
  } catch (error) {
    console.error("❌ Error creando el admin:", error);
  }
};

module.exports = createAdminIfNotExists;
