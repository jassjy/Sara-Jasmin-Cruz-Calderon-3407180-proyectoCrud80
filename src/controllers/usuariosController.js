const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { usuariosModel } = require("../modelService/usuariosService");
const { listarUsuarios } = require("../modelService/usuariosService");
const { crearUsuario } = require("../modelService/usuariosService");


//listar todos los usuario
const listarController = async(req, res)=>{
    try {
        const usuarios =  await listarUsuarios()
        res.status(200).json(usuarios)
    } catch (error) {
       res.status(500).json({Error: error.message}) 
    }
    
}



// crear Usuario  /api/usuarios/crear
const crear = async (req, res) => {
    try {
        const {email, name, clave}= req.body
        const userNew = await crearUsuario (email, name, clave)
        res.status(201).json({mensaje: "Usuario creado", userNew})

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el usuario" });
    }
};





module.exports = {
    crear,
    listarController
};
