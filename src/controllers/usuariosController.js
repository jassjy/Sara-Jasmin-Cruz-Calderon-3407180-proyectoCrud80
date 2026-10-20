const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    crearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require("../modelService/usuariosService");

const SALT_ROUNDS = 10;

// LISTAR TODOS LOS USUARIOS
const listarController = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

// OBTENER UN USUARIO POR ID
const obtenerUno = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


// CREAR USUARIO (con encriptación)
const crear = async (req, res) => {
    try {
        const { email, name, clave } = req.body;

        // Encriptar la contraseña
        const claveHash = await bcrypt.hash(clave, SALT_ROUNDS);

        const userNew = await crearUsuario(email, name, claveHash);
        res.status(201).json({ mensaje: "Usuario creado", userNew });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el usuario" });
    }
};

// ACTUALIZAR USUARIO
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, clave } = req.body;

        const data = {};
        if (email) data.email = email;
        if (name) data.name = name;
        if (clave) data.clave = await bcrypt.hash(clave, SALT_ROUNDS);

        const usuarioActualizado = await actualizarUsuario(id, data);
        res.status(200).json({ mensaje: "Usuario actualizado", usuarioActualizado });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
};

// ELIMINAR USUARIO
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioEliminado = await eliminarUsuario(id);
        res.status(200).json({ mensaje: "Usuario eliminado", usuarioEliminado });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el usuario" });
    }
};

module.exports = {
    crear,
    listarController,
    obtenerUno,
    actualizar,
    eliminar
};