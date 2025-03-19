const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const parseExcelFile = (filePath, originalName) => {
  try {
    let ext = path.extname(originalName).toLowerCase(); // 🔹 Obtener la extensión correcta
    console.log("📂 Archivo recibido en parseExcelFile:", filePath);
    console.log("📂 Extensión detectada:", ext);

    if (ext === ".xlsx") {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      fs.unlinkSync(filePath); // Eliminar archivo temporal
      console.log("✅ Excel procesado correctamente:", jsonData);
      return jsonData;
    } else if (ext === ".csv") {
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (data) => results.push(data))
          .on("end", () => {
            fs.unlinkSync(filePath);
            console.log("✅ CSV procesado correctamente:", results);
            resolve(results);
          })
          .on("error", (error) => {
            console.error("❌ Error procesando CSV:", error);
            reject(error);
          });
      });
    } else {
      console.error("❌ Formato de archivo no soportado:", ext);
      throw new Error("Formato de archivo no soportado. Solo .xlsx o .csv");
    }
  } catch (error) {
    console.error("❌ Error en parseExcelFile:", error);
    throw new Error("Error al procesar el archivo");
  }
};

module.exports = { parseExcelFile };
