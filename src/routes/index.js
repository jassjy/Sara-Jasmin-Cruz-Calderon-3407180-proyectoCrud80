//consolida todos los enrutadores
const { Router } = require("express");
const usuariosRouter = require("./usuariosRoutes");
const enrutador = Router();

//enrutador
enrutador.use("/usuarios", usuariosRouter);
//enrutador.use("/");

module.exports = enrutador;