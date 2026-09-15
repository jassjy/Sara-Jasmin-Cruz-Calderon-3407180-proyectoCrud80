const manejoErrores = (err, req, res, next) => {
    const codigoEstado = err.statusCode || 500;
    const mensaje = err.message || "Error inesperado.";
    const fecha = new Date().toISOString();
    
    // Log del error
    console.error(`[${fecha}] Estado: ${codigoEstado} - Mensaje: ${mensaje}`);
    
    // Stack trace solo en desarrollo
    if (err.stack && process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Respuesta del servidor
    const response = {
        estado: "Error",
        mensaje: process.env.NODE_ENV === 'production' ? "Error interno del servidor" : mensaje
    };

    // Detalles adicionales SOLO en desarrollo
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        response.fecha = fecha;
        response.ruta = req.originalUrl;
        response.metodo = req.method;
    }

    res.status(codigoEstado).json(response);
};

module.exports = manejoErrores;