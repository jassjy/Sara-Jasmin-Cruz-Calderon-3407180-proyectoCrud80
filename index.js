//importacion de dotenv, para leer las variables de entorno del archivo .env
import "dotenv/config"

//importacion del paquete de express, sistema moderno (import)
import miExpress from "express"
//importacion del modulo fs (file system) y path, nativos de node
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

//en ES Modules no existe __dirname por defecto, se reconstruye asi:
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//creacion de mi aplicacion de express
const miApp = miExpress()
const miPuerto = process.env.MIPUERTO || 3333

//middleware para poder leer JSON en el body de las peticiones (POST/PUT)
miApp.use(miExpress.json())

//ruta del archivo que funciona como nuestra "base de datos"
const rutaDatos = path.join(__dirname, "datosProductos.json")

//funcion auxiliar para leer los productos del archivo json
function leerProductos() {
    const contenido = fs.readFileSync(rutaDatos, "utf-8")
    return JSON.parse(contenido)
}

//funcion auxiliar para guardar los productos en el archivo json
function guardarProductos(productos) {
    fs.writeFileSync(rutaDatos, JSON.stringify(productos, null, 2))
}

//endpoint raiz, no tiene ruta
miApp.get("/", (req, res) => { res.send(`<h1>Api Rest Productos la 80</h1>`) })

//----------------------------------------------------
// GET /api/productos: Listar todos los productos
//----------------------------------------------------
miApp.get("/api/productos", (req, res) => {
    const productos = leerProductos()
    res.json(productos)
})

//----------------------------------------------------
// GET /api/productos/:id: Obtener un producto por su ID
//----------------------------------------------------
miApp.get("/api/productos/:id", (req, res) => {
    const productos = leerProductos()
    const id = Number(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    res.json(producto)
})

//----------------------------------------------------
// POST /api/productos: Crear un producto con validaciones
//----------------------------------------------------
miApp.post("/api/productos", (req, res) => {
    const { nombre, precio, stock, categoria } = req.body

    //validar que nombre, precio, stock y categoria no lleguen vacios o undefined
    if (
        nombre === undefined || nombre === "" ||
        precio === undefined || precio === "" ||
        stock === undefined || stock === "" ||
        categoria === undefined || categoria === ""
    ) {
        return res.status(400).json({ mensaje: "Bad Request: nombre, precio, stock y categoria son obligatorios" })
    }

    //validaciones adicionales de tipo/rango
    if (typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ mensaje: "Bad Request: precio debe ser un numero mayor a 0" })
    }

    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: "Bad Request: stock debe ser un numero entero positivo o 0" })
    }

    const productos = leerProductos()

    //generar un id autoincremental
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        precio,
        stock,
        categoria,
        imagen: null //asignado temporalmente, se usara Multer mas adelante
    }

    productos.push(nuevoProducto)
    guardarProductos(productos)

    res.status(201).json(nuevoProducto)
})

//----------------------------------------------------
// PUT /api/productos/:id: Actualizar datos de un producto
//----------------------------------------------------
miApp.put("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id)
    const productos = leerProductos()
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    const { nombre, precio, stock, categoria } = req.body

    if (
        nombre === undefined || nombre === "" ||
        precio === undefined || precio === "" ||
        stock === undefined || stock === "" ||
        categoria === undefined || categoria === ""
    ) {
        return res.status(400).json({ mensaje: "Bad Request: nombre, precio, stock y categoria son obligatorios" })
    }

    if (typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ mensaje: "Bad Request: precio debe ser un numero mayor a 0" })
    }

    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: "Bad Request: stock debe ser un numero entero positivo o 0" })
    }

    productos[indice] = {
        ...productos[indice],
        nombre,
        precio,
        stock,
        categoria
    }

    guardarProductos(productos)
    res.json(productos[indice])
})

//----------------------------------------------------
// DELETE /api/productos/:id: Eliminar un producto por ID
//----------------------------------------------------
miApp.delete("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id)
    const productos = leerProductos()
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    const eliminado = productos.splice(indice, 1)
    guardarProductos(productos)

    res.json({ mensaje: "Producto eliminado", producto: eliminado[0] })
})

//link del servidor, por donde se escucha las peticiones del usuario.
miApp.listen(miPuerto, () => {
    console.log(`SERVIDOR: http://localhost:${miPuerto}`)
})
