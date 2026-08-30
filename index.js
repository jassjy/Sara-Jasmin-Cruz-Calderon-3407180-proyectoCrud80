//importacion del paquete de express, sistema moderno (import)
import miExpress from "express"

//creacion de mi aplicacion de express
const miApp = miExpress()
const miPuerto = 3333

//endpoint raiz, no tiene ruta
miApp.get("/", (req, res) => { res.send(`<h1>Api Rest Productos la 80</h1>`) })

//link del servidor, por donde se escucha las peticiones del usuario.
miApp.listen(miPuerto, () => {
    console.log(`SERVIDOR: http://localhost:${miPuerto}`)
})
