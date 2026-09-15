const jwtoken = require("jsonwebtoken")

const autentificacionToken= (req,res, next)=>{
    //formato del token = Bearer <token>.
    const token = req.header("authorization")?.split(" ")[1]
    if(!token){
        return res.status(401).json({mensaje: "Acceso denegado, no provee un token"})
    }

    //verificar el token
    jwtoken.verify(token, process.env.JWT_SECRET, (error,usuario)=>{
        if(error){
            return res.status(403).json({mensaje: "Token invalido"})
        }
        req.aprendiz = usuario
        next()
    })
}

module.exports = autentificacionToken