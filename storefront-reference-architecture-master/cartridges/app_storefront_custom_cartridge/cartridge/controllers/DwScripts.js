var server = require("server");
var ProductMgr = require("dw/catalog/ProductMgr");
var CatalogMgr = require("dw/catalog/CatalogMgr");
var CustomerMgr = require("dw/catalog/CustomerMgr");
/**
 *
 * @param {String} id
 * @returns {dw.catalog.Product}
 */
const getProductById = (id) => {
    return ProductMgr.getProduct(id);
};
/**
 *
 * @param {dw.catalog.Product} product
 * @returns {dw.Catalog.Category}
 */
const getProductsCategory = (product) => {
    return product.getPrimaryCategory();
};

/**
 *
 * @param {dw.catalog.Product} product
 * @returns {dw.value.Money}
 */
const getProductsPrice = (product) => {
    return product.getPriceModel().getPrice();
};
/**
 *
 * @param {String} id
 * @returns {dw.customer.Customer}
 */
const getCustomerById = (id) => {
    return CustomerMgr.getCustomerByNumber(id);
};
/**
 *
 * @param {String} catalogID
 * @returns Category
 */
const getMainCategories = (catalogID) => {
    const catalog = CatalogMgr.getCatalog(catalogID);
    return catalog.getRoot().getSubCategories();
};

/**
 *
 * @param {dw.customer.Customer} customer
 * @param {String} groupId
 * @returns booliean
 */
const isMemberOfGroup = (customer, groupId) => {
    return customer.isMemberOfCustomerGroup(groupId);
};
module.exports = server.exports();
