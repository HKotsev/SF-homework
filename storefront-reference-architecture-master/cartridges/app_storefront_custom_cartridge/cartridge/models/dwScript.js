"use strict";
/**
 *
 * @param {dw.customer.customer} customer
 * @returns {String}
 */
const getCustomerId = (customer) => {
    return customer.getID();
};
const getCustomerName = (customer) => {
    return customer.profile.firstName;
};

function DwModel(customer) {
    this.id = getCustomerId(customer);
    this.name = getCustomerName(customer);
}
// class DwModel {
//     constructor(customer) {
//         this.id = getCustomerId(customer);
//         this.name = getCustomerName(customer);
//     }
// }
module.exports = DwModel;
