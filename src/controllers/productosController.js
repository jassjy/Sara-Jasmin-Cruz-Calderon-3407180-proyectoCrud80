const { Router } = require("express")

const listarProductos = (req,res)=>{
    res.json ({mensaje:"listado de productos"})
}


const listarUnProducto = (req,res)=>{
    res.json ({mensaje:"Ruta de listado de un producto"})
}

const crearProducto = (req,res)=>{
    res.json ({mensaje:"crear productos"})
}

const eliminarProducto = (req,res)=>{
    res.json ({mensaje:"eliminar productos"})
}




module.exports = {listarProductos,
listarUnProducto,
crearProducto,
eliminarProducto}