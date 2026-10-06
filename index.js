require("dotenv").config();

const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const registroMiddleware  = require("./src/middleware/registroMiddleware")
const manejadorErrores = require("./src/middleware/manejadorErrores.js")
const autenticacion = require("./src/middleware/autenticacion.js")
const usuariosRoutes = require("./src/routes/usuariosRoutes.js")

const miApp = express();

const miPuerto = process.env.MIPUERTO || 3333;
//importar jsonwebtoken 
const jswtoken = require("jsonwebtoken")

const archivoProductos = "./datosProductos.json";

// Middleware
miApp.use(express.json());
miApp.use(registroMiddleware);

//endpoint para autenticacion (rutas públicas: no llevan el middleware de autenticación)
miApp.use("/api/usuarios", usuariosRoutes);

// A partir de aquí, todo lo que sea /api/productos requiere estar autenticado
miApp.use("/api/productos", autenticacion);



//endpoint para provocar un error
miApp.get("/error", (req, res, next) => {
    next(new Error("Error provocado, intencional"));
});

// =====================================================
// CONFIGURACIÓN DE MULTER
// =====================================================

// Carpeta donde se guardarán las imágenes
const carpetaUploads = "./uploads";

// Crear la carpeta si no existe
if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads);
}

// Configuración del almacenamiento
const almacenamiento = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, carpetaUploads);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const nombreArchivo =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extension;

        cb(null, nombreArchivo);
    }

});

// Configuración de Multer
const upload = multer({

    storage: almacenamiento,

    fileFilter: (req, file, cb) => {

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (tiposPermitidos.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Solo se permiten imágenes JPG, PNG, WEBP o GIF"
                )
            );

        }

    },

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }

});


// =====================================================
// MOSTRAR IMÁGENES (carpeta pública)
// =====================================================

miApp.use(
    "/uploads",
    express.static(path.resolve(carpetaUploads))
);


// =====================================================
// FUNCION PARA LEER LOS PRODUCTOS
// =====================================================

function leerProductos() {

    const datos = fs.readFileSync(archivoProductos, "utf-8");

    return JSON.parse(datos);
}


// =====================================================
// FUNCION PARA GUARDAR LOS PRODUCTOS
// =====================================================

function guardarProductos(productos) {

    fs.writeFileSync(
        archivoProductos,
        JSON.stringify(productos, null, 2)
    );
}


// =====================================================
// RUTA PRINCIPAL
// =====================================================

miApp.get("/", (req, res) => {

    res.send("<h1>API REST Productos la 80</h1>");

});


// =====================================================
// GET - LISTAR TODOS LOS PRODUCTOS
// =====================================================

miApp.get("/api/productos", (req, res) => {

    try {

        const productos = leerProductos();

        res.status(200).json(productos);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });

    }

});


// =====================================================
// GET - BUSCAR PRODUCTO POR ID
// =====================================================

miApp.get("/api/productos/:id", (req, res) => {

    try {

        const productos = leerProductos();

        const id = parseInt(req.params.id);

        const producto = productos.find(
            producto => producto.id === id
        );

        if (!producto) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        res.status(200).json(producto);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al buscar el producto"
        });

    }

});


// =====================================================
// POST - CREAR PRODUCTO
// =====================================================

miApp.post(
    "/api/productos",
    upload.single("imagen"),
    (req, res) => {

    try {

        const {
            nombre,
            precio,
            stock,
            categoria
        } = req.body;


        // Validar campos obligatorios

        if (
            nombre === undefined ||
            nombre.trim() === "" ||
            precio === undefined ||
            precio === "" ||
            stock === undefined ||
            stock === "" ||
            categoria === undefined ||
            categoria.trim() === ""
        ) {

            return res.status(400).json({
                mensaje: "Nombre, precio, stock y categoria son obligatorios"
            });

        }


        // Convertir precio y stock (llegan como texto desde form-data)

        const precioNumero = Number(precio);

        const stockNumero = Number(stock);


        // Validar precio

        if (
            !Number.isFinite(precioNumero) ||
            precioNumero <= 0
        ) {

            return res.status(400).json({
                mensaje: "El precio debe ser un número mayor a 0"
            });

        }


        // Validar stock

        if (
            !Number.isInteger(stockNumero) ||
            stockNumero < 0
        ) {

            return res.status(400).json({
                mensaje: "El stock debe ser un entero positivo o 0"
            });

        }


        const productos = leerProductos();


        // Generar ID

        const nuevoId = productos.length > 0
            ? Math.max(...productos.map(producto => producto.id)) + 1
            : 1;


        // Construir la ruta de la imagen, si se subió una

        let imagen = null;

        if (req.file) {

            imagen = `/uploads/${req.file.filename}`;

        }


        const nuevoProducto = {

            id: nuevoId,

            nombre: nombre.trim(),

            precio: precioNumero,

            stock: stockNumero,

            categoria: categoria.trim(),

            imagen: imagen

        };


        productos.push(nuevoProducto);

        guardarProductos(productos);


        res.status(201).json({

            mensaje: "Producto creado correctamente",

            producto: nuevoProducto

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });

    }

});


// =====================================================
// PUT - ACTUALIZAR PRODUCTO
// =====================================================

miApp.put(
    "/api/productos/:id",
    upload.single("imagen"),
    (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const {
            nombre,
            precio,
            stock,
            categoria
        } = req.body;


        const productos = leerProductos();


        const posicion = productos.findIndex(
            producto => producto.id === id
        );


        // Si no existe

        if (posicion === -1) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }


        // Validar campos

        if (
            nombre === undefined ||
            nombre.trim() === "" ||
            precio === undefined ||
            precio === "" ||
            stock === undefined ||
            stock === "" ||
            categoria === undefined ||
            categoria.trim() === ""
        ) {

            return res.status(400).json({
                mensaje: "Nombre, precio, stock y categoria son obligatorios"
            });

        }


        // Convertir precio y stock

        const precioNumero = Number(precio);

        const stockNumero = Number(stock);


        // Validar precio

        if (
            !Number.isFinite(precioNumero) ||
            precioNumero <= 0
        ) {

            return res.status(400).json({
                mensaje: "El precio debe ser un número mayor a 0"
            });

        }


        // Validar stock

        if (
            !Number.isInteger(stockNumero) ||
            stockNumero < 0
        ) {

            return res.status(400).json({
                mensaje: "El stock debe ser un entero positivo o 0"
            });

        }


        // Mantener la imagen anterior por defecto

        let imagen = productos[posicion].imagen || null;


        // Si se subió una imagen nueva, reemplazarla

        if (req.file) {

            imagen = `/uploads/${req.file.filename}`;

        }


        // Actualizar

        productos[posicion] = {

            id: id,

            nombre: nombre.trim(),

            precio: precioNumero,

            stock: stockNumero,

            categoria: categoria.trim(),

            imagen: imagen

        };


        guardarProductos(productos);


        res.status(200).json({

            mensaje: "Producto actualizado correctamente",

            producto: productos[posicion]

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });

    }

});


// =====================================================
// DELETE - ELIMINAR PRODUCTO
// =====================================================

miApp.delete("/api/productos/:id", (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const productos = leerProductos();


        const posicion = productos.findIndex(
            producto => producto.id === id
        );


        if (posicion === -1) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }


        const productoEliminado =
            productos.splice(posicion, 1)[0];


        // Eliminar la imagen del servidor, si tenía una

        if (productoEliminado.imagen) {

            const nombreImagen = path.basename(productoEliminado.imagen);

            const rutaImagen = path.join(carpetaUploads, nombreImagen);

            if (fs.existsSync(rutaImagen)) {

                fs.unlinkSync(rutaImagen);

            }

        }


        guardarProductos(productos);


        res.status(200).json({

            mensaje: "Producto eliminado correctamente",

            producto: productoEliminado

        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });

    }

});


// =====================================================
// MANEJO DE ERRORES (SIEMPRE AL FINAL, DESPUÉS DE LAS RUTAS)
// =====================================================

miApp.use(manejadorErrores);


// =====================================================
// SERVIDOR
// =====================================================

//ruta protegida//

miApp.get("/rutaprotegida", autenticacion, (req, res) => {
    res.send("Ruta protegida")
})

*//endpoint inicio de sesion*

miApp.post ("/login",(req,res)=>{


//capturar datos del usuario* 

const { correo , clave ,} = req.body;

//simular datos del usuario de una bd* 

const datoUsuario = {
    correo: "Linaromano@gmail.com",
    clave: "1234",
    nombre: "Lina"
};

//validar datos de usuario* 

if (correo !== datoUsuario.correo || clave !== datoUsuario.clave) {

    return res.status(400).json({
        Mensaje:"Credenciales incorrectas"
    });

}

//generar y verificar* 

const token = jswtoken.sign(
    { correo: datoUsuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

res.json(token);


})


miApp.listen(miPuerto, () => {

    console.log(
        `SERVIDOR: http://localhost:${miPuerto}`
    );

    console.log(
        `IMÁGENES: http://localhost:${miPuerto}/uploads`
    );

});