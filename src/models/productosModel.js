//importar la conexion a la base de datsos con prisma
//para el ejemplo simularemos una bd

const datos= [
    {"id":1, "nombre":"Laptop de segunda","precio": 120000},
    {"id":2, "nombre":"Mouse Inalambrico","precio": 45000}
]

const listar = async () => {
    //consulta a bd con await
    return datos;
};


module.exports = {
    listar
};