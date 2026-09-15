const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir las imagenes subidas de forma publica
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares propios (logging)
const registroMiddleware = require('./src/middleware/registroMiddleware');
app.use(registroMiddleware);

// Ruta raiz
app.get('/', (req, res) => {
    res.send('<h1>Api Rest Productos la 80</h1>');
});

// Rutas de la API
const productosRoutes = require('./src/routes/productosRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
app.use('/api/products', productosRoutes);
app.use('/api/users', usuariosRoutes);

// Endpoint de prueba para el manejo de errores
app.get('/error', (req, res, next) => {
    const error = new Error('Error intencional');
    error.statusCode = 500;
    next(error);
});

// Ruta 404 para lo que no exista
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Middleware de manejo de errores (SIEMPRE al final, despues de todas las rutas)
const manejoErrores = require('./src/middleware/manejadorErrores');
app.use(manejoErrores);

module.exports = app;
