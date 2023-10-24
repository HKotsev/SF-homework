"use strict";
const base = module.superModule;

/**
 * @param {dw.order.OrderAddress} addressObject - User's address
 * extending address
 */
const address = function (addressObject) {
    base.call(this, addressObject);
    this.address.city = "Trustenik";
    this.address.population = 100000000;
};
module.exports = address;
