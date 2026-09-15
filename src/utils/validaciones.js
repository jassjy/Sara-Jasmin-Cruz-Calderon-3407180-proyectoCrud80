// Valida el cuerpo de una solicitud para crear/actualizar un producto.
// Devuelve { valido: boolean, mensaje?: string }
const validarProducto = ({ nombre, precio, stock, categoria }) => {
    if (!nombre || !precio || stock === undefined || !categoria) {
        return { valido: false, mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria' };
    }
    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
        return { valido: false, mensaje: 'El nombre debe ser un texto valido' };
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return { valido: false, mensaje: 'El precio debe ser un numero mayor a 0' };
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return { valido: false, mensaje: 'El stock debe ser un entero positivo o 0' };
    }
    if (typeof categoria !== 'string' || categoria.trim().length === 0) {
        return { valido: false, mensaje: 'La categoria debe ser un texto valido' };
    }
    return { valido: true };
};

// Valida el registro de un usuario nuevo
const validarRegistroUsuario = ({ nombre, email, password }) => {
    if (!nombre || !email || !password) {
        return { valido: false, mensaje: 'Faltan campos obligatorios: nombre, email, password' };
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        return { valido: false, mensaje: 'El email no tiene un formato valido' };
    }
    if (typeof password !== 'string' || password.length < 6) {
        return { valido: false, mensaje: 'La contrasena debe tener al menos 6 caracteres' };
    }
    return { valido: true };
};

// Valida el login de un usuario
const validarLoginUsuario = ({ email, password }) => {
    if (!email || !password) {
        return { valido: false, mensaje: 'Debe enviar email y password' };
    }
    return { valido: true };
};

module.exports = { validarProducto, validarRegistroUsuario, validarLoginUsuario };
