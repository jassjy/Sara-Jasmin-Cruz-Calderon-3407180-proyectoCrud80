# API REST Productos - La 80

API REST construida con Node.js y Express para gestionar productos y usuarios, con autenticacion mediante JWT y subida de imagenes.

## Estructura del proyecto

```
.
│   .env
│   .env.example
│   .gitignore
│   app.js
│   datosProductos.json
│   datosUsuarios.json
│   index.js
│   package.json
│   readme.md
│
├───src
│   ├───config
│   │       db.js
│   │
│   ├───controllers
│   │       productosController.js
│   │       usuariosController.js
│   │
│   ├───middleware
│   │       authMiddleware.js
│   │       manejadorErrores.js
│   │       registroMiddleware.js
│   │
│   ├───models
│   │       productosModel.js
│   │       usuariosModel.js
│   │
│   ├───routes
│   │       productosRoutes.js
│   │       usuariosRoutes.js
│   │
│   └───utils
│           validaciones.js
│
└───uploads
        (imagenes subidas de productos)
```

## Instalacion

```bash
npm install
cp .env.example .env
# editar .env y definir un JWT_SECRET propio
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Autenticacion

1. Registrar un usuario: `POST /api/users/register`
2. Iniciar sesion: `POST /api/users/login` → devuelve un `token`
3. Usar el token en las rutas protegidas con el header:
   `Authorization: Bearer <token>`

## Endpoints

### Usuarios

| Metodo | Ruta                | Protegida | Descripcion               |
|--------|----------------------|-----------|----------------------------|
| POST   | /api/users/register  | No        | Crea un usuario            |
| POST   | /api/users/login     | No        | Inicia sesion, retorna JWT |
| GET    | /api/users/me         | Si        | Perfil del usuario actual  |

Body de registro (JSON):
```json
{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "password": "123456"
}
```

Body de login (JSON):
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

### Productos

| Metodo | Ruta               | Protegida | Descripcion                          |
|--------|----------------------|-----------|----------------------------------------|
| GET    | /api/products         | No        | Lista todos los productos              |
| GET    | /api/products/:id      | No        | Obtiene un producto por id             |
| POST   | /api/products          | Si        | Crea un producto (multipart/form-data) |
| PUT    | /api/products/:id       | Si        | Actualiza un producto                  |
| DELETE | /api/products/:id       | Si        | Elimina un producto                    |

Para crear/actualizar un producto se puede enviar `multipart/form-data` con los campos:
`nombre`, `precio`, `stock`, `categoria` y opcionalmente un archivo `imagen`.

Las imagenes quedan disponibles en `http://localhost:3000/uploads/<archivo>`.

## Notas

- El almacenamiento es en archivos JSON (`datosProductos.json` y `datosUsuarios.json`), no se requiere una base de datos externa para ejecutar el proyecto.
- `src/config/db.js` centraliza la lectura/escritura de esos archivos, para facilitar migrar a una base de datos real en el futuro.
