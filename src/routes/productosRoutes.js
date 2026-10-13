const { Router }= require('express');
const { listarProductos, listarUnProducto, crearProducto, eliminarProducto } = require("../controllers/productosController");

const router = Router();

router.get ('/listado', listarProductos);
router.get ('/listarUno', listarUnProducto);
router.get ('/crear', crearProducto);
router.get ('/eliminar', eliminarProducto);



module.exports = router;