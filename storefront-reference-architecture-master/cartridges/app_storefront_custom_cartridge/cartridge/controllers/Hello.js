var server=require("server");
var page=module.superModule
server.extend(page)

server.append("World",(req,res,next)=>{
    let viewData = res.getViewData();
    viewData.hello="person";
    
    res.setViewData(viewData);
    next();
})
module.exports = server.exports();