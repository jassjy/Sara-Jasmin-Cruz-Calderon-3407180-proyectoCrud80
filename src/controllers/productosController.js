const fs = require('fs');
const path = require('path');
const productosModel = require('../models/productosModel');
const { validarProducto } = require('../utils/validaciones');

// GET /api/products
const obtenerProductos = (req, res, next) => {
    try {
        const productos = productosModel.obtenerTodos();
        res.json(productos);
    } catch (error) {
        next(error);
    }
};

// GET /api/products/:id
const obtenerProducto = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const producto = productosModel.obtenerPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        next(error);
    }
};

// POST /api/products  (soporta multipart/form-data con campo "imagen")
const crearProducto = (req, res, next) => {
    try {
        // multer llena req.body con los campos de texto y req.file con la imagen
        const nombre = req.body.nombre;
        const precio = req.body.precio !== undefined ? Number(req.body.precio) : undefined;
        const stock = req.body.stock !== undefined ? Number(req.body.stock) : undefined;
        const categoria = req.body.categoria;

        const { valido, mensaje } = validarProducto({ nombre, precio, stock, categoria });
        if (!valido) {
            return res.status(400).json({ mensaje });
        }

        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const nuevoProducto = productosModel.crear({ nombre, precio, stock, categoria, imagen });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        next(error);
    }
};

// PUT /api/products/:id (soporta reemplazar la imagen)
const actualizarProducto = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const productoExistente = productosModel.obtenerPorId(id);
        if (!productoExistente) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const nombre = req.body.nombre;
        const precio = req.body.precio !== undefined ? Number(req.body.precio) : undefined;
        const stock = req.body.stock !== undefined ? Number(req.body.stock) : undefined;
        const categoria = req.body.categoria;

        const { valido, mensaje } = validarProducto({ nombre, precio, stock, categoria });
        if (!valido) {
            return res.status(400).json({ mensaje });
        }

        let imagen;
        if (req.file) {
            imagen = `/uploads/${req.file.filename}`;
            // Borrar la imagen anterior si existia, para no dejar archivos huerfanos
            if (productoExistente.imagen) {
                const rutaImagenAnterior = path.join(__dirname, '..', '..', productoExistente.imagen);
                fs.unlink(rutaImagenAnterior, () => {});
            }
        }

        const productoActualizado = productosModel.actualizar(id, { nombre, precio, stock, categoria, imagen });
        res.json(productoActualizado);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/products/:id
const eliminarProducto = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const producto = productosModel.obtenerPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const eliminado = productosModel.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        if (producto.imagen) {
            const rutaImagen = path.join(__dirname, '..', '..', producto.imagen);
            fs.unlink(rutaImagen, () => {});
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
