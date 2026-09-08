// Importación de dotenv para leer las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Importación de Express
import express from 'express';

// Importación de fs y path
import fs from 'fs';
import path from 'path';

// Importación para trabajar con __dirname en ES Modules
import { fileURLToPath } from 'url';

// Importación de Multer para subir imágenes
import multer from 'multer';
import cors from 'cors';


// Importación del middleware
import registroMiddleware from './middleware/registroMiddleware.js';

// ----------------------------------------------------
// CONFIGURACIÓN INICIAL
// ----------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const puerto = process.env.PORT || 3000;

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------

// CORS para permitir peticiones desde el navegador
app.use(cors());

// Permite recibir JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro
app.use(registroMiddleware);

// ----------------------------------------------------
// CARPETA DE IMÁGENES
// ----------------------------------------------------

const carpetaImagenes = path.join(__dirname, 'uploads');

// Crear carpeta uploads si no existe
if (!fs.existsSync(carpetaImagenes)) {
    fs.mkdirSync(carpetaImagenes, { recursive: true });
    console.log('Carpeta uploads creada');
}

// ----------------------------------------------------
// CONFIGURACIÓN DE MULTER
// ----------------------------------------------------

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaImagenes);
    },
    filename: (req, file, cb) => {
        // Generar nombre único con timestamp y número aleatorio
        const extension = path.extname(file.originalname);
        const nombreArchivo = Date.now() + '-' + Math.round(Math.random() * 1E9) + extension;
        cb(null, nombreArchivo);
    }
});

// Filtro para solo permitir imágenes
const filtroImagen = (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG, WEBP o GIF'));
    }
};

// Configuración de Multer
const subirImagen = multer({
    storage: almacenamiento,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter: filtroImagen
});

// ----------------------------------------------------
// HACER PÚBLICA LA CARPETA UPLOADS
// ----------------------------------------------------

app.use('/uploads', express.static(carpetaImagenes));

// ----------------------------------------------------
// ARCHIVO JSON
// ----------------------------------------------------

const rutaDatos = path.join(__dirname, 'datosProductos.json');

// Verificar si el archivo JSON existe, si no, crearlo
if (!fs.existsSync(rutaDatos)) {
    fs.writeFileSync(rutaDatos, JSON.stringify([], null, 2));
    console.log('Archivo datosProductos.json creado');
}

// ----------------------------------------------------
// FUNCIONES PARA MANEJAR PRODUCTOS
// ----------------------------------------------------

const leerProductos = () => {
    try {
        const data = fs.readFileSync(rutaDatos, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer productos:', error.message);
        return [];
    }
};

const guardarProductos = (productos) => {
    try {
        fs.writeFileSync(rutaDatos, JSON.stringify(productos, null, 2));
        return true;
    } catch (error) {
        console.error('Error al guardar productos:', error.message);
        return false;
    }
};

// ----------------------------------------------------
// RUTA PRINCIPAL
// ----------------------------------------------------

app.get('/', (req, res) => {
    res.send(`
        <h1> API REST Productos</h1>
        <p>Servidor funcionando correctamente</p>
        <p>Endpoints disponibles:</p>
        <ul>
            <li><b>GET</b> /api/products - Listar todos los productos</li>
            <li><b>GET</b> /api/products/:id - Obtener un producto</li>
            <li><b>POST</b> /api/products - Crear producto (con imagen)</li>
            <li><b>PUT</b> /api/products/:id - Actualizar producto (con imagen)</li>
            <li><b>DELETE</b> /api/products/:id - Eliminar producto</li>
        </ul>
        <h3> Las imágenes se guardan en la carpeta uploads/</h3>
        <p><a href="/uploads">Ver imágenes</a></p>
    `);
});

// ----------------------------------------------------
// GET /api/products
// LISTAR TODOS LOS PRODUCTOS
// ----------------------------------------------------

app.get('/api/products', (req, res) => {
    try {
        const productos = leerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener productos',
            error: error.message
        });
    }
});

// ----------------------------------------------------
// GET /api/products/:id
// OBTENER UN PRODUCTO POR ID
// ----------------------------------------------------

app.get('/api/products/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const productos = leerProductos();
        const producto = productos.find(p => p.id === id);
        
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        res.json(producto);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el producto',
            error: error.message
        });
    }
});

// ----------------------------------------------------
// POST /api/products
// CREAR PRODUCTO CON IMAGEN (USANDO MULTER)
// ----------------------------------------------------

app.post('/api/products', subirImagen.single('imagen'), (req, res) => {
    try {
        const { nombre, precio, stock, categoria } = req.body;
        
        // Validaciones de campos obligatorios
        if (!nombre || !precio || stock === undefined || !categoria) {
            // Si hay error, eliminar imagen subida
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria'
            });
        }
        
        // Validar precio
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'El precio debe ser un número mayor a 0'
            });
        }
        
        // Validar stock
        const stockNum = parseInt(stock);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'El stock debe ser un número entero positivo o 0'
            });
        }
        
        const productos = leerProductos();
        
        // Generar nuevo ID
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        
        // URL de la imagen si se subió
        let imagen = null;
        if (req.file) {
            imagen = `/uploads/${req.file.filename}`;
        }
        
        const nuevoProducto = {
            id: nuevoId,
            nombre: nombre.trim(),
            precio: precioNum,
            stock: stockNum,
            categoria: categoria.trim(),
            imagen: imagen,
            createdAt: new Date().toISOString()
        };
        
        productos.push(nuevoProducto);
        guardarProductos(productos);
        
        res.status(201).json({
            mensaje: 'Producto creado correctamente',
            producto: nuevoProducto
        });
        
    } catch (error) {
        // Si hay error, eliminar imagen subida
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error al eliminar imagen:', err);
            }
        }
        res.status(500).json({
            mensaje: 'Error al crear el producto',
            error: error.message
        });
    }
});

// ----------------------------------------------------
// PUT /api/products/:id
// ACTUALIZAR PRODUCTO CON IMAGEN (USANDO MULTER)
// ----------------------------------------------------

app.put('/api/products/:id', subirImagen.single('imagen'), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, precio, stock, categoria } = req.body;
        
        // Validaciones de campos obligatorios
        if (!nombre || !precio || stock === undefined || !categoria) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria'
            });
        }
        
        // Validar precio
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'El precio debe ser un número mayor a 0'
            });
        }
        
        // Validar stock
        const stockNum = parseInt(stock);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                mensaje: 'El stock debe ser un número entero positivo o 0'
            });
        }
        
        const productos = leerProductos();
        const index = productos.findIndex(p => p.id === id);
        
        if (index === -1) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        // Si se subió nueva imagen, actualizarla, sino mantener la anterior
        let imagen = productos[index].imagen;
        if (req.file) {
            // Eliminar imagen anterior si existe
            if (productos[index].imagen) {
                const imagenAnterior = path.join(__dirname, productos[index].imagen);
                if (fs.existsSync(imagenAnterior)) {
                    try {
                        fs.unlinkSync(imagenAnterior);
                    } catch (err) {
                        console.error('Error al eliminar imagen anterior:', err);
                    }
                }
            }
            imagen = `/uploads/${req.file.filename}`;
        }
        
        productos[index] = {
            ...productos[index],
            nombre: nombre.trim(),
            precio: precioNum,
            stock: stockNum,
            categoria: categoria.trim(),
            imagen: imagen,
            updatedAt: new Date().toISOString()
        };
        
        guardarProductos(productos);
        
        res.json({
            mensaje: 'Producto actualizado correctamente',
            producto: productos[index]
        });
        
    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error al eliminar imagen:', err);
            }
        }
        res.status(500).json({
            mensaje: 'Error al actualizar el producto',
            error: error.message
        });
    }
});

// ----------------------------------------------------
// DELETE /api/products/:id
// ELIMINAR PRODUCTO (INCLUYE IMAGEN)
// ----------------------------------------------------

app.delete('/api/products/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const productos = leerProductos();
        const index = productos.findIndex(p => p.id === id);
        
        if (index === -1) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        // Eliminar imagen asociada si existe
        if (productos[index].imagen) {
            const rutaImagen = path.join(__dirname, productos[index].imagen);
            if (fs.existsSync(rutaImagen)) {
                try {
                    fs.unlinkSync(rutaImagen);
                    console.log('Imagen eliminada:', productos[index].imagen);
                } catch (err) {
                    console.error('Error al eliminar imagen:', err);
                }
            }
        }
        
        const productoEliminado = productos.splice(index, 1);
        guardarProductos(productos);
        
        res.json({
            mensaje: 'Producto eliminado correctamente',
            producto: productoEliminado[0]
        });
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
});

// ----------------------------------------------------
// MANEJO DE ERRORES DE MULTER
// ----------------------------------------------------

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({
                mensaje: 'La imagen es demasiado grande. Máximo 5MB'
            });
        }
        return res.status(400).json({
            mensaje: 'Error al subir la imagen',
            error: error.message
        });
    }
    
    if (error) {
        return res.status(400).json({
            mensaje: error.message
        });
    }
    
    next();
});

// ----------------------------------------------------
// RUTA 404 - NO ENCONTRADA
// ----------------------------------------------------

app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada',
        ruta: req.url
    });
});

// ----------------------------------------------------
// INICIAR SERVIDOR
// ----------------------------------------------------

app.listen(puerto, () => {
    console.log('=================================');
    console.log(' SERVIDOR INICIADO');
    console.log('=================================');
    console.log(` Puerto: ${puerto}`);
    console.log(`URL: http://localhost:${puerto}`);
    console.log(`Uploads: ${carpetaImagenes}`);
    console.log(`Datos: ${rutaDatos}`);
    console.log('=================================');
    console.log(' Endpoints disponibles:');
    console.log(`   GET  /api/products`);
    console.log(`   GET  /api/products/:id`);
    console.log(`   POST /api/products (con imagen)`);
    console.log(`   PUT  /api/products/:id (con imagen)`);
    console.log(`   DELETE /api/products/:id`);
    console.log('=================================');
    console.log('Para subir imágenes usa form-data con campo "imagen"');
    console.log('Campos obligatorios: nombre, precio, stock, categoria');
    console.log('=================================');
});