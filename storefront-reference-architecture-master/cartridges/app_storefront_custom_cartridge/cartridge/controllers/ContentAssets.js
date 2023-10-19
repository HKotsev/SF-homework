var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");
server.get(
    "Show",
    cache.applyDefaultCache,
    consentTracking.consent,
    function (req, res, next) {
        var ContentMgr = require("dw/content/ContentMgr");
        var Logger = require("dw/system/Logger");
        var PageMgr = require("dw/experience/PageMgr");
        var ContentModel = require("*/cartridge/models/content");
        var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");

        var page = PageMgr.getPage(req.querystring.cid);
        const isLogged = customer.isAuthenticated();

        if (page != null && page.isVisible()) {
            if (!page.hasVisibilityRules()) {
                res.cachePeriod = 168; // eslint-disable-line no-param-reassign
                res.cachePeriodUnit = "hours"; // eslint-disable-line no-param-reassign
            }

            res.page(page.ID, {});
        } else {
            var apiContent = ContentMgr.getContent(req.querystring.cid);

            if (apiContent) {
                var content = new ContentModel(
                    apiContent,
                    "content/contentAssetsHW"
                );

                pageMetaHelper.setPageMetaData(req.pageMetaData, content);
                pageMetaHelper.setPageMetaTags(req.pageMetaData, content);

                if (content.template) {
                    res.render(content.template, {
                        content: content,
                        isLogged: isLogged,
                    });
                } else {
                    Logger.warn(
                        "Content asset with ID {0} is offline",
                        req.querystring.cid
                    );
                    res.render("/components/content/offlineContent");
                }
            } else {
                Logger.warn(
                    "Content asset with ID {0} was included but not found",
                    req.querystring.cid
                );
            }
        }

        next();
    },
    pageMetaData.computedPageMetaData
);

module.exports = server.exports();

module.exports = server.exports();
