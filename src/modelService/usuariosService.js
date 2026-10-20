const fs = require("fs");
const { rutaUsuarios } = require("../config/db");
const ormPrisma = require("../config/conexion");


// CREAR USUARIO

const crearUsuario = async (email, name, clave) => {
    const nuevoUsuario = await ormPrisma.usuarios.create({
        data: { email: email, name: name, clave: clave }
    });
    return nuevoUsuario;
};


// LISTAR USUARIOS

const listarUsuarios = () => {
    const datos = ormPrisma.usuarios.findMany();
    return datos;
};

// OBTENER USUARIO POR ID

const obtenerUsuarioPorId = (id) => {
    const datos = ormPrisma.usuarios.findUnique({
        where: { id: Number(id) }
    });
    return datos;
};

// ACTUALIZAR USUARIO

const actualizarUsuario = (id, data) => {
    const datos = ormPrisma.usuarios.update({
        where: { id: Number(id) },
        data: data
    });
    return datos;
};


// ELIMINAR USUARIO

const eliminarUsuario = (id) => {
    const datos = ormPrisma.usuarios.delete({
        where: { id: Number(id) }
    });
    return datos;
};

module.exports = {
    crearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};