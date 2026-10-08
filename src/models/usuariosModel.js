const fs = require("fs");
const { rutaUsuarios } = require("../config/db");

// =====================================================
// ASEGURAR QUE EL ARCHIVO DE USUARIOS EXISTA
// =====================================================

function asegurarArchivo() {
    if (!fs.existsSync(rutaUsuarios)) {
        fs.writeFileSync(rutaUsuarios, JSON.stringify([], null, 2));
    }
}

// =====================================================
// LEER / GUARDAR USUARIOS
// =====================================================

function leerUsuarios() {
    asegurarArchivo();
    const datos = fs.readFileSync(rutaUsuarios, "utf-8");
    return JSON.parse(datos);
}

function guardarUsuarios(usuarios) {
    fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2));
}

// =====================================================
// BUSCAR USUARIO POR EMAIL
// =====================================================

function buscarPorEmail(email) {
    const usuarios = leerUsuarios();
    return usuarios.find(usuario => usuario.email === email);
}

// =====================================================
// CREAR USUARIO
// =====================================================

function crearUsuario({ nombre, email, password }) {
    const usuarios = leerUsuarios();

    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        email,
        password // ya viene hasheado desde el controller
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return nuevoUsuario;
}

const listarUsuarios = ()=>{
    //usar el conector de base de datos
    const datos =[
        {"nombre": "Jhonny", "cargo":"Instructor", "Ficha":3407180},
        {"nombre": "Ana", "cargo":"Aprendiz", "Ficha":3407180}
    ]
    return datos
}

module.exports = {
    leerUsuarios,
    guardarUsuarios,
    buscarPorEmail,
    crearUsuario,
    listarUsuarios
};
