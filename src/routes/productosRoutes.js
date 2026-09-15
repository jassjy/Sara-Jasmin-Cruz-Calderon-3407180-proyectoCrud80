const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const productosController = require('../controllers/productosController');
const autenticacion = require('../middleware/authMiddleware');

// Configuracion de almacenamiento para las imagenes de productos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, nombreUnico);
    },
});

const filtroImagen = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
    const extensionValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mimeValido = tiposPermitidos.test(file.mimetype);
    if (extensionValida && mimeValido) {
        return cb(null, true);
    }
    cb(new Error('Solo se permiten imagenes (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({ storage, fileFilter: filtroImagen, limits: { fileSize: 5 * 1024 * 1024 } });

// Rutas publicas de lectura
router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProducto);

// Rutas protegidas de escritura (requieren token)
router.post('/', autenticacion, upload.single('imagen'), productosController.crearProducto);
router.put('/:id', autenticacion, upload.single('imagen'), productosController.actualizarProducto);
router.delete('/:id', autenticacion, productosController.eliminarProducto);

module.exports = router;
