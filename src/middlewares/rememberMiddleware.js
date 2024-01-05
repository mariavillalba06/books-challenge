const db = require('../database/models');

function rememberMiddleware(req,res,next){
    if(req.cookies.recordame!=undefined && req.session.usuarioLogueado == undefined){
        db.User.findOne({
            where:{
              email:req.cookies.recordame,
            }
          })
          .then(usuarioALoguearse=>{
            if(usuarioALoguearse != undefined){
                req.session.usuarioLogueado = usuarioALoguearse;
            }});
    }
    next();
}

module.exports = rememberMiddleware;