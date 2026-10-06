// =====================================================
// MIDDLEWARE DE REGISTRO (LOGGING)
// Imprime cada solicitud entrante y cuánto tardó en responder
// =====================================================

const registroMiddleware = (req, res, next) => {
    // Guardamos el momento en que llega la solicitud
    const tiempoInicio = Date.now();

    // Obtenemos la fecha y hora actual en formato UTC
    const tiempoUTC = new Date().toISOString();

    // Mostrar información de la solicitud entrante
    console.log(
        `[${tiempoUTC}] ${req.method} - ${req.url} - ${req.ip}`
    );

    // Escuchamos el evento 'finish' para saber cuándo termina la respuesta
    res.on('finish', () => {
        // Calculamos cuánto tardó en responder el servidor
        const duracion = Date.now() - tiempoInicio;

        console.log(
            `[${tiempoUTC}] ${req.method} ${req.url} - ` +
            `response ${res.statusCode} - ${duracion} ms`
        );
    });

    // Continuamos con el siguiente middleware o ruta
    next();
};

module.exports = registroMiddleware;
