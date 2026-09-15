require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const puerto = process.env.PORT || 3000;

// Importando middlewares
const registroMiddleware = require("./src/middlewares/registroMiddleware");
const manejoErrores = require("./src/middlewares/manejadorErrores");
const autentificacion = require("./src/middlewares/autentificacion");
const autentificacionToken = require('./src/middlewares/autentificacion');
// Middleware para parsear JSON
app.use(express.json());

// MIDDLEWARE DE REGISTRO (ANTES de las rutas)
app.use(registroMiddleware);
app.use(autentificacion);
app.use(autentificacionToken);
// JWT_ autentificacion
//app.use(autentificacion)

// MIDDLEWARE DE TIEMPO (ANTES de las rutas)
app.use((req, res, next) => {
    console.log(`Tiempo en millisegundos: ${Date.now()}`);
    next();
});

// CONFIGURACION DE MULTER (imagenes en la raiz, carpeta /images)
const carpetaImagenes = path.join(__dirname, "images");
if (!fs.existsSync(carpetaImagenes)) {
    fs.mkdirSync(carpetaImagenes, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, carpetaImagenes),
    filename: (req, file, cb) => {
        const nombreSaneado = file.originalname.replace(/\s+/g, "_");
        cb(null, `${Date.now()}-${nombreSaneado}`);
    }
});

const upload = multer({ storage });

// Servir la carpeta de imagenes estaticamente
app.use("/images", express.static(carpetaImagenes));

// Ruta raíz
app.get("/", (req, res) => {
    res.send("<h1>Api Rest Productos la 80</h1>");
});

// Ruta para productos
const productosPath = path.join(__dirname, 'datosProductos.json');

// Funcion auxiliar para leer productos
const leerProductos = () => {
    try {
        const data = fs.readFileSync(productosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Funcion auxiliar para escribir productos
const escribirProductos = (productos) => {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
};

// Obtener todos los productos
app.get('/api/products', (req, res) => {
    const productos = leerProductos();
    res.json(productos);
});

// Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
});

// Crear un producto (POST) — acepta multipart/form-data con campo "imagen"
app.post('/api/products', upload.single("imagen"), (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;

    // Con multipart/form-data todo llega como string, hay que parsear
    const precioNum = parseFloat(precio);
    const stockNum = parseInt(stock);

    // Validaciones
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria' });
    }
    if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor a 0' });
    }
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        return res.status(400).json({ mensaje: 'El stock debe ser un entero positivo o 0' });
    }

    const productos = leerProductos();
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

    // Ruta publica de la imagen (si se subio)
    const rutaImagen = req.file ? `/images/${req.file.filename}` : null;

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        precio: precioNum,
        stock: stockNum,
        categoria,
        imagen: rutaImagen
    };
    productos.push(nuevoProducto);
    escribirProductos(productos);
    res.status(201).json(nuevoProducto);
});

// Actualizar un producto (PUT) — acepta imagen opcional
app.put('/api/products/:id', upload.single("imagen"), (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio, stock, categoria } = req.body;

    const precioNum = parseFloat(precio);
    const stockNum = parseInt(stock);

    // Validaciones similares
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria' });
    }
    if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor a 0' });
    }
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        return res.status(400).json({ mensaje: 'El stock debe ser un entero positivo o 0' });
    }

    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Si se subio una imagen nueva, borrar la anterior y actualizar
    let rutaImagen = productos[index].imagen;
    if (req.file) {
        if (productos[index].imagen) {
            const rutaAnterior = path.join(__dirname, productos[index].imagen);
            if (fs.existsSync(rutaAnterior)) {
                fs.unlinkSync(rutaAnterior);
            }
        }
        rutaImagen = `/images/${req.file.filename}`;
    }

    // Actualizar manteniendo el id
    productos[index] = {
        ...productos[index],
        nombre,
        precio: precioNum,
        stock: stockNum,
        categoria,
        imagen: rutaImagen
    };
    escribirProductos(productos);
    res.json(productos[index]);
});

// Eliminar un producto (DELETE) — tambien borra su imagen
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Borrar la imagen asociada si existe
    if (productos[index].imagen) {
        const rutaImagen = path.join(__dirname, productos[index].imagen);
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
        }
    }

    productos.splice(index, 1);
    escribirProductos(productos);
    res.status(204).send();
});

// ENDPOINT ERROR (para probar el manejo de errores)
app.get("/error", (req, res, next) => {
    const error = new Error("Error intencional");
    error.statusCode = 500;
    next(error);
});

// MIDDLEWARE DE ERRORES AL FINAL (despues de TODAS las rutas)
app.use(manejoErrores);

// RUTA PROTEGIDA ENDPOINT
app.get("/rutaProtegida", autentificacion ,(req,res)=>{
    res.send("Ruta protegida")
})
// SIMULAR LOGIN




// VISTA HTML DE PRODUCTOS (simple, sin estilos)
app.get('/productos', (req, res) => {
    const productos = leerProductos();
    const html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Productos</title>
        </head>
        <body>
            ${productos.map(p => `
                <div>
                    <p>ID: ${p.id}</p>
                    <p>Nombre: ${p.nombre}</p>
                    <p>Precio: ${p.precio}</p>
                    <p>Stock: ${p.stock}</p>
                    <p>Categoria: ${p.categoria}</p>
                    ${p.imagen ? `<img src="${p.imagen}" width="200">` : '<p>Sin imagen</p>'}
                    <hr>
                </div>
            `).join('')}
        </body>
        </html>
    `;
    res.send(html);
});

// Levantar el servidor
app.listen(puerto, () => {
    console.log(`SERVIDOR: http://localhost:${puerto}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});