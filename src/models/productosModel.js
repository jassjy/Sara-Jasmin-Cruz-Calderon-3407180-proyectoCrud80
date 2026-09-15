const db = require('../config/db');

const obtenerTodos = () => {
    return db.leer('productos');
};

const obtenerPorId = (id) => {
    const productos = db.leer('productos');
    return productos.find((p) => p.id === id);
};

const crear = (datosProducto) => {
    const productos = db.leer('productos');
    const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
    const nuevoProducto = {
        id: nuevoId,
        nombre: datosProducto.nombre,
        precio: datosProducto.precio,
        stock: datosProducto.stock,
        categoria: datosProducto.categoria,
        imagen: datosProducto.imagen || null,
    };
    productos.push(nuevoProducto);
    db.escribir('productos', productos);
    return nuevoProducto;
};

const actualizar = (id, datosProducto) => {
    const productos = db.leer('productos');
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    productos[index] = {
        ...productos[index],
        nombre: datosProducto.nombre,
        precio: datosProducto.precio,
        stock: datosProducto.stock,
        categoria: datosProducto.categoria,
        // Solo se reemplaza la imagen si llega una nueva
        imagen: datosProducto.imagen !== undefined ? datosProducto.imagen : productos[index].imagen,
    };
    db.escribir('productos', productos);
    return productos[index];
};

const eliminar = (id) => {
    const productos = db.leer('productos');
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    productos.splice(index, 1);
    db.escribir('productos', productos);
    return true;
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
