const express = require("express");
require("dotenv").config();

//importar de la carpeta routes. usaremos un archivo que contendra los enrutadores
const enrutador = require("./routes");
const app = express();

//app usar middleware body-parse
app.use(express.json());
app.use(express.urlencoded());

//app usara una ruta predeterminada "/api", con un enrutador
app.use("/api", enrutador);

//endpoint raiz
app.get("/", (req, res) => {
  res.send("Enpoint raiz de nuestra API Rest 3407180");
});

module.exports = app;