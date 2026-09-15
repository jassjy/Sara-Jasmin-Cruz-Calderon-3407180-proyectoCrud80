const db = require('../config/db');

const obtenerTodos = () => {
    return db.leer('usuarios');
};

const obtenerPorId = (id) => {
    const usuarios = db.leer('usuarios');
    return usuarios.find((u) => u.id === id);
};

const obtenerPorEmail = (email) => {
    const usuarios = db.leer('usuarios');
    return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const crear = ({ nombre, email, passwordHash, rol }) => {
    const usuarios = db.leer('usuarios');
    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        email: email.toLowerCase(),
        password: passwordHash,
        rol: rol || 'cliente',
        creadoEn: new Date().toISOString(),
    };
    usuarios.push(nuevoUsuario);
    db.escribir('usuarios', usuarios);
    return nuevoUsuario;
};

module.exports = { obtenerTodos, obtenerPorId, obtenerPorEmail, crear };
