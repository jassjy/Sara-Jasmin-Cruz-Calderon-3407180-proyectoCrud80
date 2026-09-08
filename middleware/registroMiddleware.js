// middleware/registroMiddleware.js
const registroMiddleware = (req, res, next) => {
    const tiempoMillisegundos = Date.now();
    const tiempoUTC = new Date().toISOString();
    
    console.log(`[${tiempoUTC}] ${req.method} - ${req.url} - ${req.ip || req.connection.remoteAddress}`);
    
    res.on('finish', () => {
        const duracion = Date.now() - tiempoMillisegundos;
        console.log(`[${tiempoUTC}] Response: ${res.statusCode} - ${duracion}ms`);
    });
    
    next();
};

export default registroMiddleware;