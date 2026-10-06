const multer = require("multer");

// =====================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// Debe registrarse SIEMPRE al final, después de todas las rutas
// (Express lo reconoce como manejador de errores por tener 4 argumentos)
// =====================================================

const manejadorErrores = (err, req, res, next) => {

    // Errores específicos de Multer (subida de archivos)
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            mensaje: "Error al subir la imagen",
            error: err.message
        });
    }

    const codigoEstado = err.statusCode || 500;
    const mensaje = err.message || "Error inesperado.";
    const fecha = new Date().toISOString();

    console.error(
        `Fecha: ${fecha} - Estado: ${codigoEstado} - Mensaje: ${mensaje}`
    );

    if (err.stack) {
        console.error(err.stack);
    }

    res.status(codigoEstado).json({
        estado: codigoEstado,
        error: mensaje,
        fecha: fecha,
        // Más detalles solo cuando estamos en desarrollo
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = manejadorErrores;
