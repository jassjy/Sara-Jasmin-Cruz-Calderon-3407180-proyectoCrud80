
const listar = require("../modelService/productosModel");

const listarProductos = async (req, res) => {
    try {
        // Obtener el listado de productos utilizando el modelo
        const productos = await listar.listar();

        res.status(200).json(productos);

    } catch (error) {
        res.status(500).json({
            Error: error.message
        });
    }
};

const listarUnProducto = (req, res) => {
    res.json({
        mensaje: "Ruta de listado de un producto"
    });
};

const crearProducto = (req, res) => {
    res.json({
        mensaje: "Crear productos"
    });
};

const eliminarProducto = (req, res) => {
    res.json({
        mensaje: "Eliminar productos"
    });
};

module.exports = {
    listarProductos,
    listarUnProducto,
    crearProducto,
    eliminarProducto
};
