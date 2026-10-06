const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Estas rutas son PÚBLICAS (no llevan el middleware de autenticación)
router.post("/registro", usuariosController.registrar);
router.post("/login", usuariosController.iniciarSesion);

module.exports = router;
