const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

// Función para leer archivos Excel o CSV y convertirlos en JSON
const parseExcelFile = (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".xlsx") {
      // 🟢 Procesar archivos XLSX normalmente
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      // Eliminar el archivo temporal después de leerlo
      fs.unlinkSync(filePath);
      return jsonData;
    } else if (ext === ".csv") {
      // 🟢 Procesar archivos CSV con `csv-parser`
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (data) => results.push(data))
          .on("end", () => {
            fs.unlinkSync(filePath); // Eliminar el archivo después de procesarlo
            resolve(results);
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    } else {
      throw new Error("Formato de archivo no soportado. Solo .xlsx o .csv");
    }
  } catch (error) {
    console.error("❌ Error procesando el archivo:", error);
    throw new Error("Error al procesar el archivo");
  }
};

module.exports = { parseExcelFile };
