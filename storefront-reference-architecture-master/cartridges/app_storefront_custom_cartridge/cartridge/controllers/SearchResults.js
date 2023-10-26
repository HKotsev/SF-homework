"use strict";
const server = require("server");

server.get("Show", function (req, res, next) {
    const SearchModel = require("dw/catalog/ProductSearchModel");
    const results = new SearchModel();
    results.setSearchPhrase(req.querystring.query);
    results.search();
    res.render("searchResults", { searchResults: results });
    next();
});

module.exports = server.exports();
