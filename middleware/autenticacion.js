const jwtoken = require ("jsonwebtoken")
const autenticacionToken = (req, res, next) =>{
    //formato del token = Bearer <token>.
    const token = req.header("authentication").split(" ")[1]
    if (token){return res.status(401).json({mensaje:"Acceso denegado, no provee un token."})
        //401 no envia las credenciales
        //403 envio las credenciales pero no son validas
    }

    jwtoken.verify(token,process.env.JWT_SECRET,(error, usuario)=>{
    if (error){
        res.status(403).json({mensaje:"Token inavalido"})
    }
    req.aprendiz = usuario
    })
    next()
}

module.exports = autenticacionToken