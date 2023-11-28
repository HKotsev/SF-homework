"use strict";

function getDeathStar() {
    const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

    const getDeathstarService = LocalServiceRegistry.createService(
        "http.starwars.getdeathstar",
        {
            createRequest: function (svc, args) {
                svc.setRequestMethod("GET");
                return args;
            },
            parseResponse: function (svc, client) {
                return client.text;
            },

            filterLogMessage: function (msg) {
                return msg.replace(
                    /cost_in_credits\: \".*?\"/,
                    "cost_in_credits:$$$$$$$$$$$$$$$$$$$$$$"
                );
            },
        }
    );
    return JSON.parse(getDeathstarService.call().object);
}

module.exports = {
    getDeathStar,
};
