"use strict";

/**
 * @namespace DwScriptDemo
 */

var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");
const DwModel = require("*/cartridge/models/dwScript");

/**
 * Any customization on this endpoint, also requiresss update for Default-Start endpoint
 */
/**
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    "Show",
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        var Site = require("dw/system/Site");
        var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");
        let dwScriptModel = new DwModel(customer);

        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
        res.render("dwScriptDemo", dwScriptModel);
        next();
    },
    pageMetaData.computedPageMetaData
);

server.get("ErrorNotFound", function (req, res, next) {
    res.setStatusCode(404);
    res.render("error/notFound");
    next();
});

module.exports = server.exports();
