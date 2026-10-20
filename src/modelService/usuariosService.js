const fs = require("fs");
const { rutaUsuarios } = require("../config/db");
const ormPrisma = require("../config/conexion");

// =====================================================
// ASEGURAR QUE EL ARCHIVO DE USUARIOS EXISTA
// =====================================================

function asegurarArchivo() {
    if (!fs.existsSync(rutaUsuarios)) {
        fs.writeFileSync(rutaUsuarios, JSON.stringify([], null, 2));
    }
}

// =====================================================
// CREAR USUARIO
// =====================================================

const crearUsuario = async (email,name,clave)=> {
    const nuevoUsuario = await ormPrisma.usuarios.create({data:
        {email: email, name: name , clave: clave}
        })
        return nuevoUsuario
    }



const listarUsuarios = ()=>{
    //usar el conector de base de datos
   //{const datos =[
       // {"nombre": "Jhonny", "cargo":"Instructor", "Ficha":3407180},
       // {"nombre": "Ana", "cargo":"Aprendiz", "Ficha":3407180}
  //  ]
   // return datos;
//}
   const datos = ormPrisma.usuarios.findMany()
   return datos;

}

module.exports = {
    crearUsuario,
    listarUsuarios
};
