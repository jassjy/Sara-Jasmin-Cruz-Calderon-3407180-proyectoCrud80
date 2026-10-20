const ormPrisma = require("../config/conexion");

// CREAR PRODUCTO
const crearProducto = async (nombre, detalle, precio) => {
    const nuevoProducto = await ormPrisma.productos.create({
        data: { 
            nombre: nombre, 
            detalle: detalle, 
            precio: precio 
        }
    });
    return nuevoProducto;
};

// LISTAR PRODUCTOS
const listarProductos = () => {
    return ormPrisma.productos.findMany();
};

// OBTENER PRODUCTO POR ID
const obtenerProductoPorId = (id) => {
    return ormPrisma.productos.findUnique({
        where: { id: Number(id) }
    });
};

// ACTUALIZAR PRODUCTO
const actualizarProducto = (id, data) => {
    return ormPrisma.productos.update({
        where: { id: Number(id) },
        data: data
    });
};

// ELIMINAR PRODUCTO
const eliminarProducto = (id) => {
    return ormPrisma.productos.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    crearProducto,
    listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};