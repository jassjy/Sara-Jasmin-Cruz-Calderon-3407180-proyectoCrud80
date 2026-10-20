const express = require("express");
const router = express.Router();
const {
    crear,
    listarController,
    obtenerUno,
    actualizar,
    eliminar
} = require("../controllers/productosController");

router.post("/crear", crear);
router.get("/listado", listarController);
router.get("/:id", obtenerUno);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

module.exports = router;