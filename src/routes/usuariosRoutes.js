const express = require("express");
const router = express.Router();
const {registrar, iniciarSesion, listarController} = require("../controllers/usuariosController");
//const usuariosController = require("../controllers/usuariosController");

// Estas rutas son PÚBLICAS (no llevan el middleware de autenticación)
router.post("/registro", registrar);
router.post("/login", iniciarSesion);
router.get("/listado", listarController)

module.exports = router;
