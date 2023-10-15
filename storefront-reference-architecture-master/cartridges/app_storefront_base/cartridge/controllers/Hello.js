"use strict"
/**
 * @namespace Hello
 */
var server=require("server");

server.get("World",(req,res,next)=>{
    res.json({hello:"World"})
    next()
})

// server.get('ErrorNotFound', function (req, res, next) {
//     res.setStatusCode(404);
//     res.render('error/notFound');
//     next();
// });
module.exports=server.exports()