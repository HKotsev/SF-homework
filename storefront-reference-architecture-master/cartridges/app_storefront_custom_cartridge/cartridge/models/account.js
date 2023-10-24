"use strict";
const base = module.superModule;

/**
 * @param {Object} currentCustomer - Current customer
 * @param {Object} addressModel - The current customer's preferred address
 * @param {Object} orderModel - The current customer's order history
 */
const account = function (currentCustomer, addressModel, orderModel) {
    base.call(this, currentCustomer, addressModel, orderModel);
    this.profile.interests = customer.profile.getCustom().interests;
    this.profile.countryOfResidence =
        customer.profile.getCustom().countryOfResidence;
};
module.exports = account;
