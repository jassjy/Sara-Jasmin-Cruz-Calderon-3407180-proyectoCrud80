const registroMiddleware = (req,res,next)=>{
    const tiempoMillisegundos = Date.now()
    const tiempoUTC = new Date().toISOString()
    //console.log(`Millisegundo: ${tiempoMillisegundos}
    //    UTC:${tiempoUTC}`)
    //Mostrar informacion de la solicitud entrante
    console.log(`[${tiempoUTC}] ${req.method} - ${req.url} - ${req.ip}`)
    //Escuchamos evento 'finish' pareasaber cuando termina la respuesta
    res.on('finish',()=>{
        const duracion = Date.now() - tiempoMillisegundos;
        console.log(tiempoUTC, 'response', res.statusCode, duracion +'ms');

    });
    next()
}

module.exports = registroMiddleware