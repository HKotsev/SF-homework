"use strict";

/**
 * @namespace AddressJSON
 */

var server = require("server");

var URLUtils = require("dw/web/URLUtils");
var Resource = require("dw/web/Resource");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

/**
 * Creates a list of address model for the logged in user
 * @param {string} customerNo - customer number of the current customer
 * @returns {List} a plain list of objects of the current customer's addresses
 */
function getList(customerNo) {
    var CustomerMgr = require("dw/customer/CustomerMgr");
    var AddressModel = require("*/cartridge/models/address");
    var collections = require("*/cartridge/scripts/util/collections");

    var customer = CustomerMgr.getCustomerByCustomerNumber(customerNo);
    var rawAddressBook = customer.addressBook.getAddresses();
    var addressBook = collections.map(rawAddressBook, function (rawAddress) {
        var addressModel = new AddressModel(rawAddress);
        addressModel.address.UUID = rawAddress.UUID;
        return addressModel;
    });
    return addressBook;
}

server.get("Show", consentTracking.consent, function (req, res, next) {
    const currCustomer = req.currentCustomer.profile;
    if (currCustomer) {
        const addressBook = getList(currCustomer.customerNo);
        res.json(addressBook);
    } else {
        res.json();
    }
    next();
});

module.exports = server.exports();
