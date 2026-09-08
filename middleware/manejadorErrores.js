const manejoErrores =(err,req,res,next)=>{
    const codigoEstado = err.statusCode || 500
    const mensaje = err.message || "Error Inesperado"
    const fecha = new Date().toISOString
    console.error(['Fecha:', fecha - 'Estado:', codigoEstado - 'Mensaje:', mensaje ])
    //otra parte de mensaje de error
    if(err.stack){
        console.error(err.stack)
    }

    res.status(codigoEstado).json({Estado:'error', CodigoEstado: codigoEstado , Mensaje: mensaje})

    next()
}