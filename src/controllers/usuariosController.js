const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');
const { validarRegistroUsuario, validarLoginUsuario } = require('../utils/validaciones');

// POST /api/users/register
const registrar = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const { valido, mensaje } = validarRegistroUsuario({ nombre, email, password });
        if (!valido) {
            return res.status(400).json({ mensaje });
        }

        const existente = usuariosModel.obtenerPorEmail(email);
        if (existente) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario registrado con ese email' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = usuariosModel.crear({ nombre, email, passwordHash, rol });

        // Nunca devolvemos el password, ni siquiera el hash
        const { password: _p, ...usuarioSinPassword } = nuevoUsuario;
        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        next(error);
    }
};

// POST /api/users/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { valido, mensaje } = validarLoginUsuario({ email, password });
        if (!valido) {
            return res.status(400).json({ mensaje });
        }

        const usuario = usuariosModel.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales invalidas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ mensaje: 'Credenciales invalidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRA_EN || '1d' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        next(error);
    }
};

// GET /api/users/me (requiere autenticacion)
const perfil = (req, res, next) => {
    try {
        const usuario = usuariosModel.obtenerPorId(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const { password: _p, ...usuarioSinPassword } = usuario;
        res.json(usuarioSinPassword);
    } catch (error) {
        next(error);
    }
};

module.exports = { registrar, login, perfil };
