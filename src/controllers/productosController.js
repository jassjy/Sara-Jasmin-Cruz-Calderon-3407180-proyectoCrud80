const {
    crearProducto,
    listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} = require("../modelService/productosService");

// CREAR PRODUCTO
const crear = async (req, res) => {
    try {
        // Recibimos los 3 campos
        const { nombre, detalle, precio } = req.body;
        
        // Validación básica
        if (!nombre || !detalle || precio === undefined) {
            return res.status(400).json({ mensaje: "Nombre, detalle y precio son obligatorios" });
        }

        const productNew = await crearProducto(nombre, detalle, precio);
        res.status(201).json({ mensaje: "Producto creado", productNew });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el producto" });
    }
};

// LISTAR TODOS
const listarController = async (req, res) => {
    try {
        const productos = await listarProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

// OBTENER UNO
const obtenerUno = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await obtenerProductoPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


// ACTUALIZAR
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, detalle, precio } = req.body;

        const data = {};
        if (nombre) data.nombre = nombre;
        if (detalle) data.detalle = detalle;
        if (precio !== undefined) data.precio = precio;

        const productoActualizado = await actualizarProducto(id, data);
        res.status(200).json({ mensaje: "Producto actualizado", productoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
};

// ELIMINAR
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const productoEliminado = await eliminarProducto(id);
        res.status(200).json({ mensaje: "Producto eliminado", productoEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
};

module.exports = {
    crear,
    listarController,
    obtenerUno,
    actualizar,
    eliminar
};