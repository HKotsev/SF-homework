const server = require("server");
const HookMgr = require("dw/system/HookMgr");
const page = module.superModule;
server.extend(page);

server.append("Show", (req, res, next) => {
    let viewData = res.getViewData();
    viewData.title = "SFRA";
    if (HookMgr.hasHook("app.home.initial")) {
        viewData = HookMgr.callHook("app.home.initial", "addValue", viewData);
    }
    res.setViewData(viewData);
    next();
});
module.exports = server.exports();
