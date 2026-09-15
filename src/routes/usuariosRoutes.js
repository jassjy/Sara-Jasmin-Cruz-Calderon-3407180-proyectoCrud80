const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');
const autenticacion = require('../middleware/authMiddleware');

// Rutas publicas
router.post('/register', usuariosController.registrar);
router.post('/login', usuariosController.login);

// Ruta protegida
router.get('/me', autenticacion, usuariosController.perfil);

module.exports = router;
