const jwtoken = require('jsonwebtoken');

// Formato esperado del header: Authorization: Bearer <token>
const autenticacionToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado, no provee un token.' });
        // 401 no envia las credenciales
        // 403 envio las credenciales pero no son validas
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado, formato de token invalido. Use: Bearer <token>' });
    }

    jwtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(403).json({ mensaje: 'Token invalido o expirado' });
        }
        req.usuario = usuario;
        next();
    });
};

module.exports = autenticacionToken;
