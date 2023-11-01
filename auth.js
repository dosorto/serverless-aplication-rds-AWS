const jwt = require("jsonwebtoken");
const { secret } = require('./config/config');
module.exports.validarToken = function  (token){
    //const token = req.header('Authorization');
    // Si no se proporcionó un token, enviar una respuesta de error
    if (!token) {
        return  {isValid:false,usuario:usuario};
    }
  
   try {
      // Verificar si el token es válido
      const decoded = jwt.verify(token, secret);
      var usuario = decoded.usuario
      // Continuar al siguiente middleware
      return  {isValid:true,usuario:usuario};
    } catch (ex) {
      // Si el token no es válido, enviar una respuesta de error
      return  {isValid:false,usuario:usuario};
    }
  }
