const path = require("path");

// =====================================================
// CONFIGURACIÓN DE "BASE DE DATOS"
// Este proyecto no usa un motor de base de datos real,
// así que aquí centralizamos las rutas de los archivos
// JSON que hacen de almacenamiento.
// =====================================================

const rutaProductos = path.join(__dirname, "..", "..", "datosProductos.json");
const rutaUsuarios = path.join(__dirname, "..", "..", "datosUsuarios.json");

module.exports = {
    rutaProductos,
    rutaUsuarios
};
