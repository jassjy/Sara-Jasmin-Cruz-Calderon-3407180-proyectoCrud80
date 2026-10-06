const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuariosModel");

// =====================================================
// POST /api/usuarios/registro
// =====================================================

const registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, email y password son obligatorios"
            });
        }

        const existente = usuariosModel.buscarPorEmail(email);

        if (existente) {
            return res.status(409).json({
                mensaje: "Ya existe un usuario registrado con ese email"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = usuariosModel.crearUsuario({
            nombre,
            email,
            password: passwordHash
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar el usuario" });
    }
};

// =====================================================
// POST /api/usuarios/login
// =====================================================

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y password son obligatorios"
            });
        }

        const usuario = usuariosModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            mensaje: "Sesión iniciada correctamente",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
};

module.exports = {
    registrar,
    iniciarSesion
};
