//consolida todos los enrutadores
const { Router } = require("express");
const usuariosRouter = require("./usuariosRoutes");
const productosRouter = require ("./productosRoutes")
const { rutaProductos } = require("../config/db");
const enrutador = Router();

//enrutador
enrutador.use("/usuarios", usuariosRouter);
enrutador.use("/productos", productosRouter)
//enrutador.use("/");

module.exports = enrutador;