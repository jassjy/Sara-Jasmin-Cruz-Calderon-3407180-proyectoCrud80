const fs = require('fs');
const path = require('path');

/**
 * "Base de datos" simple basada en archivos JSON.
 * El proyecto no usa un motor de base de datos externo (Mongo, MySQL, etc.),
 * asi que este modulo centraliza la lectura y escritura de los archivos
 * .json que hacen de almacenamiento para productos y usuarios.
 */

// Rutas de los archivos que funcionan como "tablas"
const RUTAS = {
    productos: path.join(__dirname, '..', '..', 'datosProductos.json'),
    usuarios: path.join(__dirname, '..', '..', 'datosUsuarios.json'),
};

// Asegura que un archivo exista, si no, lo crea con un arreglo vacio
const asegurarArchivo = (ruta) => {
    if (!fs.existsSync(ruta)) {
        fs.writeFileSync(ruta, '[]', 'utf8');
    }
};

/**
 * Lee y parsea el contenido de una "tabla" (nombre: 'productos' | 'usuarios')
 */
const leer = (nombreTabla) => {
    const ruta = RUTAS[nombreTabla];
    if (!ruta) {
        throw new Error(`Tabla desconocida: ${nombreTabla}`);
    }
    asegurarArchivo(ruta);
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error(`Error leyendo ${nombreTabla}:`, error.message);
        return [];
    }
};

/**
 * Sobrescribe una "tabla" completa con el arreglo dado
 */
const escribir = (nombreTabla, datos) => {
    const ruta = RUTAS[nombreTabla];
    if (!ruta) {
        throw new Error(`Tabla desconocida: ${nombreTabla}`);
    }
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), 'utf8');
};

module.exports = { leer, escribir, RUTAS };
