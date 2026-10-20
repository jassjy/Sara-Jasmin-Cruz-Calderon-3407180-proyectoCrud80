const express = require("express");
const router = express.Router();
const {crear, listarController} = require("../controllers/usuariosController");
//const usuariosController = require("../controllers/usuariosController");

// Estas rutas son PÚBLICAS (no llevan el middleware de autenticación)
router.post("/crear", crear)
router.get("/listado", listarController)

module.exports = router;
