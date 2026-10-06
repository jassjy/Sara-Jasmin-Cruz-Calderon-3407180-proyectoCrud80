// importar libreria
const jwtoken = require("jsonwebtoken");

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN
// Formato esperado: Authorization: Bearer <token>
// =====================================================

const autenticacionToken = (req, res, next) => {

    const encabezado = req.header("Authorization");

    if (!encabezado) {
        return res.status(401).json({
            mensaje: "Acceso denegado, no se proveyó un token."
        });
    }

    // Soporta "Bearer token" o token directo
    const partes = encabezado.split(" ");
    const token = partes.length === 2 ? partes[1] : partes[0];

    if (!token) {
        return res.status(401).json({
            mensaje: "Acceso denegado, no se proveyó un token."
        });
    }

    jwtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {

        if (error) {
            return res.status(403).json({
                mensaje: "Token inválido"
            });
        }

        req.aprendiz = usuario;

        next();
    });
};

module.exports = autenticacionToken;