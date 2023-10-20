"use strict";

/**
 * @namespace ContentSlot
 */

var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");

/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/ContentSlot-Show
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
        var ContentMgr = require("dw/content/ContentMgr");
        const isLogged = customer.isAuthenticated();
        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
        let contentAsset;

        if (isLogged) {
            contentAsset = (
                ContentMgr.getContent("Logged-user").custom.body + ""
            ).replace("{0}", customer.profile.firstName);
        } else {
            contentAsset = ContentMgr.getContent("Guest-user").custom.body;
        }

        res.render("contentSlot", {
            isLogged,
            contentAsset,
        });

        next();
    },
    pageMetaData.computedPageMetaData
);

module.exports = server.exports();
