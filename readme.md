## COMANDOS

LISTA DE COMANDOS
npm install express

npm init -y

npm run dev : para iniciar el servidor

comandos de sguridad:

git config --global --list

//////

git branch -r : ver ramas remotas git

git fetch --all : actuliza el remoto

git branch commonjs origin/commonjs

git add .

git commit -m "lista"

///

git checkout main

git branch

git checkout "commit"

git checkout -b "" // crear rama

git branch : ver ramas

//

## PROYECTO CRUD 

node --watch index.js 

npm install dotenv

.env

🧪 Probar GET todos

Inicia:

npm run dev

En LiteClient:

GET http://localhost:3030/api/productos

Respuesta:

[
    {
        "id": 1,
        "nombre": "Laptop Lenovo",
        "precio": 2500000,
        "stock": 10,
        "categoria": "Tecnologia",
        "imagen": null
    },
    {
        "id": 2,
        "nombre": "Mouse Logitech",
        "precio": 85000,
        "stock": 25,
        "categoria": "Accesorios",
        "imagen": null
    }
]
20. 🔎 GET por ID
GET http://localhost:3030/api/productos/1

Respuesta:

{
    "id": 1,
    "nombre": "Laptop Lenovo",
    "precio": 2500000,
    "stock": 10,
    "categoria": "Tecnologia",
    "imagen": null
}

Si buscas:

GET http://localhost:3030/api/productos/99

Obtendrás:

{
    "mensaje": "Producto no encontrado"
}

Con estado:

404 Not Found
21. ➕ POST crear producto

En LiteClient:

POST http://localhost:3030/api/productos

Selecciona:

Body → JSON

Envía:

{
    "nombre": "Teclado Gamer",
    "precio": 150000,
    "stock": 15,
    "categoria": "Accesorios"
}

Respuesta:

{
    "mensaje": "Producto creado correctamente",
    "producto": {
        "id": 3,
        "nombre": "Teclado Gamer",
        "precio": 150000,
        "stock": 15,
        "categoria": "Accesorios",
        "imagen": null
    }
}

Estado:

201 Created

El taller pide que los campos nombre, precio, stock y categoria sean obligatorios y que una falla de validación produzca 400 Bad Request.

22. ❌ Probar POST incorrecto

Por ejemplo:

{
    "nombre": "Mouse",
    "precio": 50000
}

Faltan:

stock
categoria

Respuesta:

{
    "mensaje": "Nombre, precio, stock y categoria son obligatorios"
}

Estado:

400 Bad Request
23. ❌ Precio incorrecto
{
    "nombre": "Mouse",
    "precio": -500,
    "stock": 5,
    "categoria": "Accesorios"
}

Respuesta:

{
    "mensaje": "El precio debe ser un número mayor a 0"
}
24. ❌ Stock incorrecto
{
    "nombre": "Mouse",
    "precio": 50000,
    "stock": -5,
    "categoria": "Accesorios"
}

Respuesta:

{
    "mensaje": "El stock debe ser un entero positivo o 0"
}
25. ✏️ PUT actualizar

URL:

PUT http://localhost:3030/api/productos/1

Body:

{
    "nombre": "Laptop Lenovo Actualizada",
    "precio": 2800000,
    "stock": 20,
    "categoria": "Tecnologia"
}

Respuesta:

{
    "mensaje": "Producto actualizado correctamente",
    "producto": {
        "id": 1,
        "nombre": "Laptop Lenovo Actualizada",
        "precio": 2800000,
        "stock": 20,
        "categoria": "Tecnologia",
        "imagen": null
    }
}
26. ❌ PUT con ID inexistente
PUT http://localhost:3030/api/productos/100

Respuesta:

{
    "mensaje": "Producto no encontrado"
}

Estado:

404 Not Found

El PDF especifica que PUT debe aplicar las mismas validaciones y devolver 404 cuando el ID no existe.

27. 🗑️ DELETE

URL:

DELETE http://localhost:3030/api/productos/2

Respuesta:

{
    "mensaje": "Producto eliminado correctamente",
    "producto": {
        "id": 2,
        "nombre": "Mouse Logitech",
        "precio": 85000,
        "stock": 25,
        "categoria": "Accesorios",
        "imagen": null
    }
}


## multer imagenes 

npm install multer

Commonjs - tradicional

ESM - MODERNO

Typescript - tipo

## Middleware express

importacion 

index :

const registroMiddleware  = require("./middleware/registroMiddleware") 
miApp.use(registroMiddleware); 


middleware/registroMiddleware: 

const registroMiddleware = (req,res,next)=>{
    const tiempoMillisegundos = Date.now()
    const tiempoUTC = new Date().toISOString()
    //console.log(`Millisegundo: ${tiempoMillisegundos}
    //    UTC:${tiempoUTC}`)
    //Mostrar informacion de la solicitud entrante
    console.log(`[${tiempoUTC}: ${req.method} - ${req.url} - ${req.ip}]`)
    //Escuchamos evento 'finish' pareasaber cuando termina la respuesta
    res.on('finish',()=>{
        const duracion = Date.now() - tiempoMillisegundos;
        console.log(tiempoUTC, 'response', res.statusCode, duracion +'ms');

    });
    next()
}

module.exports = registroMiddleware



## json web token jwt 

npm install jsonwebtoken 

npm install bcryptjs 


Es una cadena firmada que confirma un usuario autenticado
