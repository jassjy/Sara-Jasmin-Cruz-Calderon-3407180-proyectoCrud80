const { Router } = require("express");
const usuariosRouter = require("./usuariosRoutes");
const productosRouter = require("./productosRoutes");

const enrutador = Router();

enrutador.use("/usuarios", usuariosRouter);
enrutador.use("/productos", productosRouter);

enrutador.get("/", (req, res) => {
    res.json({ mensaje: "API funcionando correctamente" });
});

module.exports = enrutador;