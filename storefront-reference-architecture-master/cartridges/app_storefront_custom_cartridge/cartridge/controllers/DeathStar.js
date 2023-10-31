"use strict";

/**
 * @namespace DeathStar
 */

var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");
var deathstarService = require("*/cartridge/scripts/deathstarService.js");

/**
 * Any customization on this endpoint, also requiresss update for Default-Start endpoint
 */
/**
 * @function
 * @memberof DeathStar
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    "Show",
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        const deathstar = deathstarService.getDeathStar();
        res.render("deathstar", {
            deathstar: deathstar,
        });
        next();
    },
    pageMetaData.computedPageMetaData
);

module.exports = server.exports();
