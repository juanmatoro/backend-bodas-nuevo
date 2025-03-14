const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);

  const statusCode = err.statusCode || 500; // Si no hay código de error definido, se usa 500 (Error interno del servidor)
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Solo mostrar stack en modo desarrollo
  });
};

module.exports = errorMiddleware;
